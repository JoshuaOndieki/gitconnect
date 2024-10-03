import AppExpress from "@itznotabug/appexpress";
import {Client, Databases, Models, Query, Users, Storage, AppwriteException, ID} from "node-appwrite";
import {
    COMMENTS_COLLECTION_ID,
    DATABASE_ID, POST_REACTIONS_COLLECTION_ID, POSTS_COLLECTION_ID,
    PROFILES_COLLECTION_ID,
} from "./constants.js";
import {
    Post,
    PostRequest,
    PostsResponse,
    Profile,
    Reaction, Comment, PostData, ReactionActionType, CommentsResponse
} from "./interfaces.js";
import {request} from "node:http";

const router = new AppExpress.Router();

const getClient = (req: any) => {
    return new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT ?? '')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID ?? '')
        .setKey(req.headers['x-appwrite-key'] ?? '');
}

const getPosts = async (request: any, response: any, log: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const users = new Users(client)

    // TODO: Add filters and sorting. Current defaults to created date DESC.
    let {pageNumber, pageSize, searchQuery, userId} = request.query
    let trimmedSearchQuery = searchQuery && searchQuery.trim() ? searchQuery.trim() : null
    userId = userId && userId.trim() ? userId.trim() : null

    const queries = [
        Query.orderDesc('$createdAt'),
        Query.limit(pageSize ?? 10),
        Query.offset((pageSize ?? 10) * ((pageNumber ?? 1) - 1)),
    ]
    if (trimmedSearchQuery) {
        queries.push(Query.search('content', trimmedSearchQuery));
    }
    if (userId) {
        queries.push(Query.equal('userId', userId))
    }

    const filteredPosts = await databases.listDocuments<Post>(
        DATABASE_ID, POSTS_COLLECTION_ID, queries);

    if (!filteredPosts.documents.length) {
        response.json({
            metadata: {
                total: {
                    filtered: filteredPosts.documents.length,
                    all: 0 // not needed for infinite scroll
                },
                searchQuery: trimmedSearchQuery,
                pageSize: pageSize ?? 10,
                pageNumber: pageNumber ?? 1
            },
            results: []
        })
        return
    }

    const userIds = filteredPosts.documents.map(post => post.userId)
    const postIds = filteredPosts.documents.map(post => post.$id)

    const postUsers = await users.list(
        [Query.equal('$id', userIds)])
    const postProfiles = await databases.listDocuments<Profile>(
        DATABASE_ID, PROFILES_COLLECTION_ID, [Query.equal('userId', userIds)]);

    const reactions = await databases.listDocuments<Reaction>(
        DATABASE_ID, POST_REACTIONS_COLLECTION_ID,
        [Query.equal('postId', postIds), Query.select(['$id', 'userId', 'postId', 'like'])]
    )
    const comments = await databases.listDocuments<Comment>(
        DATABASE_ID, COMMENTS_COLLECTION_ID,
        [Query.equal('postId', postIds), Query.select(['$id', 'userId', 'postId'])]
    )

    const data: PostsResponse = {
        metadata: {
            total: {
                filtered: filteredPosts.documents.length,
                all: 0 // not needed for infinite scroll
            },
            searchQuery: trimmedSearchQuery,
            pageSize: pageSize ?? 10,
            pageNumber: pageNumber ?? 1
        },
        results: filteredPosts.documents.map(p => {
            const user = postUsers.users.find(u => u.$id == p.userId);
            const profile = postProfiles.documents.find(u => u.userId == p.userId);
            const like = reactions.documents.find(r => {
                return r.userId == request.headers['x-appwrite-user-id'] && r.postId == p.$id
            })?.like ?? null;
            const userReaction = like == null ? null : like ? 'like' : 'dislike'
            return {
                ...p,
                user: {
                    name: user?.name ?? '',
                    username: profile?.username ?? '',
                    avatar: profile?.avatar ? profile.avatar : null,
                },
                interactions: {
                    commentsCount: comments.documents.reduce((accum, current) => accum += current.postId == p.$id ? 1 : 0, 0),
                    likesCount: reactions.documents.reduce((accum, current) => current.postId == p.$id && current.like ? accum += 1 : accum, 0),
                    dislikesCount: reactions.documents.reduce((accum, current) => current.postId == p.$id && !current.like ? accum += 1 : accum, 0),
                    userReaction
                }
            }
        })
    }

    response.json(data)
}


const getPost = async (request: any, response: any, log: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const users = new Users(client)
    const userId = request.headers['x-appwrite-user-id']

    let {postId} = request.params

    let post: Post;
    try {
        post = await databases.getDocument<Post>(
            DATABASE_ID, POSTS_COLLECTION_ID, postId);

        const user = await users.get(post.userId)
        const profile = (await databases.listDocuments<Profile>(
            DATABASE_ID, PROFILES_COLLECTION_ID, [Query.equal('userId', post.userId)])).documents[0];

        const reactions = await databases.listDocuments<Reaction>(
            DATABASE_ID, POST_REACTIONS_COLLECTION_ID,
            [Query.equal('postId', post.$id), Query.select(['$id', 'userId', 'postId', 'like'])]
        )
        const commentsCount = (await databases.listDocuments(
            DATABASE_ID, COMMENTS_COLLECTION_ID,
            [Query.equal('postId', post.$id), Query.select(['$id'])]
        )).documents.length

        const like = reactions.documents.find(r => {
            return r.userId == userId && r.postId == post.$id
        })?.like ?? null;
        const userReaction = like == null ? null : like ? 'like' : 'dislike'
        const data: PostData = {
            ...post,
            user: {
                name: user?.name ?? '',
                username: profile?.username ?? '',
                avatar: profile?.avatar ? profile.avatar : null,
            },
            interactions: {
                commentsCount,
                likesCount: reactions.documents.reduce((accum, current) => current.like ? accum += 1 : accum, 0),
                dislikesCount: reactions.documents.reduce((accum, current) => !current.like ? accum += 1 : accum, 0),
                userReaction
            }
        }
        response.json(data)
        return
    } catch (e) {
        log(e)
    }
    // response.status(404)
}

const createPost = async (request: any, response: any, log: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const users = new Users(client)

    const payload = request.body as PostRequest

    if (payload.content.trim()) {
        const newPost = await databases.createDocument(DATABASE_ID, POSTS_COLLECTION_ID, ID.unique(), {
            content: payload.content,
            userId: request.headers['x-appwrite-user-id'],
        })
        const user = await users.get(newPost.userId);
        const profile = (await databases.listDocuments(
            DATABASE_ID, PROFILES_COLLECTION_ID, [Query.equal('userId', newPost.userId)])).documents[0];

        response.json({
                ...newPost,
                user: {
                    name: user?.name ?? '',
                    username: profile?.username ?? '',
                    avatar: profile?.avatar ? profile.avatar : null,
                },
                interactions: {
                    commentsCount: 0,
                    likesCount: 0,
                    dislikesCount: 0,
                    userReaction: null
                }
            }, 201
        )
    } else {
        response.status(400)
    }

}

const updatePost = async (request: any, response: any, log: any) => {

}

const deletePost = async (request: any, response: any) => {
    const userId = request.headers['x-appwrite-user-id']
    const {postId} = request.params
    const client = getClient(request)
    const databases = new Databases(client)

    const post = (await databases.listDocuments(DATABASE_ID, POSTS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.equal('$id', postId)])).documents[0];
    // TODO: delete images

    // delete comments
    const comments = (await databases.listDocuments(
        DATABASE_ID, COMMENTS_COLLECTION_ID,
        [Query.equal('postId', post.$id), Query.select(['$id'])]
    )).documents
    for(const comment of comments) {
        await databases.deleteDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, comment.$id)
    }

    // delete reactions
    const reactions = (await databases.listDocuments<Reaction>(
        DATABASE_ID, POST_REACTIONS_COLLECTION_ID,
        [Query.equal('postId', post.$id), Query.select(['$id'])]
    )).documents
    for(const reaction of reactions) {
        await databases.deleteDocument(DATABASE_ID, POST_REACTIONS_COLLECTION_ID, reaction.$id)
    }

    await databases.deleteDocument(DATABASE_ID, POSTS_COLLECTION_ID, post.$id)
    response.json({}, 204)
}

const reactOnPost = async (request: any, response: any, log: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const userId = request.headers['x-appwrite-user-id']
    const {postId} = request.params
    const {reaction} = request.query
    const validReactions: ReactionActionType[] = ['like', 'undo-like', 'dislike', 'undo-dislike']
    if (!reaction && !validReactions.includes(reaction)) {
        response.json({message: 'Invalid reaction. Accepts: ' + validReactions.join(', ')}, 400)
        return
    } else {
        const post = await databases.getDocument(DATABASE_ID, POSTS_COLLECTION_ID, postId)
        const currentReaction = (await databases.listDocuments<Reaction>(
            DATABASE_ID, POST_REACTIONS_COLLECTION_ID, [
                Query.equal('userId', userId), Query.equal('postId', postId)])).documents[0]
        if (currentReaction) {
            if (reaction == 'undo-like' && currentReaction.like) {
                await databases.deleteDocument(DATABASE_ID, POST_REACTIONS_COLLECTION_ID, currentReaction.$id);
            } else if (reaction == 'undo-dislike' && !currentReaction.like) {
                await databases.deleteDocument(DATABASE_ID, POST_REACTIONS_COLLECTION_ID, currentReaction.$id);
            } else if (reaction == 'like' && !currentReaction.like) {
                await databases.updateDocument(DATABASE_ID, POST_REACTIONS_COLLECTION_ID, currentReaction.$id, {
                    like: true
                });
            } else if (reaction == 'dislike' && currentReaction.like) {
                await databases.updateDocument(DATABASE_ID, POST_REACTIONS_COLLECTION_ID, currentReaction.$id, {
                    like: false
                });
            } else {
                response.status(204);
                return
            }
        } else {
            if (reaction == 'like') {
                await databases.createDocument(DATABASE_ID, POST_REACTIONS_COLLECTION_ID, ID.unique(), {
                    postId: post.$id,
                    userId: userId,
                    like: true
                });
            } else if (reaction == 'dislike') {
                const dislike = await databases.createDocument(DATABASE_ID, POST_REACTIONS_COLLECTION_ID, ID.unique(), {
                    postId: post.$id,
                    userId: userId,
                    like: false
                });
            } else {
                response.status(204);
                return
            }
        }

        response.json({message: 'Reaction processed successfully'}, 201);
    }
}

const addComment = async (request: any, response: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const {postId} = request.params
    const userId = request.headers['x-appwrite-user-id']
    const {content} = request.body
    if (!content || !content.trim()) {
        response.status(400)
        return
    }
    await databases.createDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, ID.unique(), {
        userId,
        content: content.trim(),
        postId
    })
    response.json({message: 'Add comment successful.'}, 201)
}

const getComments = async (request: any, response: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const users = new Users(client)
    // const userId = request.headers['x-appwrite-user-id']
    const {postId} = request.params

    const {pageSize, pageNumber} = request.query
    const queries = [
        Query.orderDesc('$createdAt'),
        Query.limit(pageSize ?? 10),
        Query.offset((pageSize ?? 10) * ((pageNumber ?? 1) - 1)),
        Query.equal('postId', postId),
    ]

    const allComments = await databases.listDocuments<Comment>(
        DATABASE_ID, COMMENTS_COLLECTION_ID, [Query.select(['$id'])]
    )

    const comments = await databases.listDocuments<Comment>(
        DATABASE_ID, COMMENTS_COLLECTION_ID, queries
    )

    const data: CommentsResponse = {
        metadata: {
            pageNumber: 0,
            pageSize: 0,
            searchQuery: null,
            total: {all: allComments.total, filtered: comments.total}
        },
        results: []
    }

    if(comments.total) {
        const commentsUsers = (await users.list([
            Query.equal('$id', comments.documents.map(comment => comment.userId))
        ])).users
        const commentsProfiles = (await databases.listDocuments<Profile>(
            DATABASE_ID, PROFILES_COLLECTION_ID, [
                Query.equal('userId', comments.documents.map(comment => comment.userId))
            ]
        )).documents

        data.results = comments.documents.map(comment => {
            const user = commentsUsers.find(u => u.$id === comment.userId)
            const profile = commentsProfiles.find(p => p.userId === comment.userId)
            return {
                ...comment, user: {
                    name: user?.name ?? '',
                    username: profile?.username ?? '',
                    avatar: profile?.avatar ?? null
                }
            }
        })
    }

    response.json(data)
}

router.get("/", getPosts)
router.post("/", createPost)
router.get("/:postId", getPost)
router.put("/:postId", updatePost)
router.delete("/:postId", deletePost)
router.post("/:postId/comments", addComment)
router.get("/:postId/comments", getComments)
router.post("/:postId/reactions", reactOnPost)

export default router;
