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
    Reaction, Comment, PostData
} from "./interfaces.js";

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
    if(trimmedSearchQuery) {
        queries.push(Query.search('content', trimmedSearchQuery));
    }
    if(userId) {
        queries.push(Query.equal('userId', userId))
    }

    const filteredPosts = await databases.listDocuments<Post>(
        DATABASE_ID, POSTS_COLLECTION_ID, queries);

    if(!filteredPosts.documents.length) {
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
                return r.userId == p.userId && r.postId == p.postId
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
                    commentsCount: comments.documents.reduce((accum, current) => accum += current.postId == p.postId ? 1 : 0, 0),
                    likesCount: reactions.documents.reduce((accum, current) => current.like ? accum += 1 : accum, 0),
                    dislikesCount: reactions.documents.reduce((accum, current) => !current.like ? accum += 1 : accum, 0),
                    userReaction
                }
            }
        })
    }

    response.json(data)
}


const getPost = async (request: any, response: any, log: any)=> {
    const client = getClient(request)
    const databases = new Databases(client)
    const users = new Users(client)

    let {postId} = request.params

    let post: Post;
    try{
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
            return r.userId == post.userId && r.postId == post.postId
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

    if(payload.content.trim()) {
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
            }}, 201
        )
    } else {
        response.status(400)
    }

}

const updatePost = async (request: any, response: any, log: any) => {

}

const deletePost = async (request: any, response: any) => {

}

router.get("/", getPosts)
router.post("/", createPost)
router.get("/:postId", getPost)
router.put("/:postId", updatePost)
router.delete("/:postId", deletePost)

export default router;
