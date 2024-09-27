import AppExpress from "@itznotabug/appexpress";
import {Client, Databases, Models, Query, Users} from "node-appwrite";
import {
    DATABASE_ID,
    PROFILES_COLLECTION_ID,
    SCHOOL_COLLECTION_ID as SCHOOLS_COLLECTION_ID, SOCIALS_COLLECTION_ID,
    WORK_COLLECTION_ID
} from "./constants.js";
import {BasicUserInfo, Profile, PublicProfile, UsersResponse} from "./interfaces.js";
import {updateProfile, updateSchools, updateSocials, updateWork} from "./controllers/profile.js";

const router = new AppExpress.Router();

const getClient = (req: any) => {
    return new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT ?? '')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID ?? '')
        .setKey(req.headers['x-appwrite-key'] ?? '');
}

const getUserByUserId = async (request: any, response: any) => {
    const {userId} = request.params;
    const client = getClient(request)
    const users = new Users(client);
    const databases = new Databases(client)

    const user = await users.get(userId)
    const profile = (await databases.listDocuments<Profile>(
        DATABASE_ID, PROFILES_COLLECTION_ID,
        [Query.equal('userId', userId)])).documents[0]

    if (user && profile) {
        await returnUser(user, profile, response, databases)
    } else {
        response.status(404)
    }
};

const getUserByUsername = async (request: any, response: any) => {
    const {username} = request.params;
    const client = getClient(request)
    const users = new Users(client);
    const databases = new Databases(client)

    const profile = (await databases.listDocuments<Profile>(
        DATABASE_ID, PROFILES_COLLECTION_ID,
        [Query.equal('username', username)])).documents[0]
    const user = await users.get(profile?.userId)

    if (user && profile) {
        await returnUser(user, profile, response, databases)
    } else {
        response.status(404)
    }
}

const returnUser = async (user: Models.User<Models.Preferences>, profile: Profile, response: any, databases: Databases) => {
    const work = (await databases.listDocuments(
        DATABASE_ID, WORK_COLLECTION_ID, [Query.equal('userId', user.$id)]
    )).documents.map(w => ({
        $id: w.$id,
        company: w.company,
        title: w.title,
        startDate: w.startDate,
        endDate: w.endDate
    }))

    const schools = (await databases.listDocuments(
        DATABASE_ID, SCHOOLS_COLLECTION_ID, [Query.equal('userId', user.$id)]
    )).documents.map(s => ({
        $id: s.$id,
        name: s.name,
        course: s.course,
        startDate: s.startDate,
        endDate: s.endDate
    }))

    const socials = (await databases.listDocuments(
        DATABASE_ID, SOCIALS_COLLECTION_ID, [Query.equal('userId', user.$id)]
    )).documents.map(s => ({
        $id: s.$id,
        username: s.username,
        type: s.type,
    }))

    const data: PublicProfile = {
        $id: user.$id,
        name: user.name,
        avatar: profile.avatar,
        bio: profile.bio,
        joined: user.registration,
        title: profile.title,
        username: profile.username,
        website: profile.website,
        work,
        schools,
        socials,
    }
    response.json(data)
}

const getAuthenticatedUser = async (request: any, response: any) => {
    const client = getClient(request)
    const databases = new Databases(client)

    const documentsList = await databases.listDocuments(
        DATABASE_ID, PROFILES_COLLECTION_ID,
        [Query.equal('userId', request.headers['x-appwrite-user-id'] ?? '')])
    if (documentsList.documents.length > 0) {
        const profile = documentsList.documents[0]
        response.json({
            userId: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            lastVerificationEmailDate: profile.lastVerificationEmailDate,
        })
    } else {
        response.send(404);
    }
};

const updateUser = async (request: any, response: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const users = new Users(client)

    const userId = request.headers['x-appwrite-user-id']
    if(!userId) {
        response.status(401)
        return
    }

    // TODO: Zod validate payload
    const payload = request.body as PublicProfile

    try {
        const user = await users.get(userId)
        if (!user) {
            response.status(401)
        } else {
            await updateProfile(databases, users, user, payload)
            await updateWork(databases, payload.work, user.$id)
            await updateSchools(databases, payload.schools, user.$id)
            await updateSocials(databases, payload.socials, user.$id)

            response.json({
                status: 'success',
                message: 'Profile, work, schools, and socials updated successfully!'
            });
        }
    } catch (error: any) {
        console.error(error);
        response.status(500);
    }
}

const getUsers = async (request: any, response: any, log: any) => {
    const client = getClient(request)
    const databases = new Databases(client)
    const users = new Users(client)

    // TODO: Add filters and sorting. Current defaults to reputation based.
    let {pageNumber, pageSize, searchQuery} = request.query
    let trimmedSearchQuery = searchQuery ? searchQuery.trim() : null

    const {topDevelopers} = request.query
    if(topDevelopers) {
        log('try')
        trimmedSearchQuery = null
        pageNumber = 1
        pageSize = 6
    }

    const queries = [
        Query.orderDesc('reputation'),
        Query.limit(pageSize ?? 10),
        Query.offset((pageSize ?? 10) * ((pageNumber ?? 1) - 1)),
    ]
    let allUsers: Models.UserList<Models.Preferences> = await users.list()
    if(trimmedSearchQuery) {
        const filteredUsers = await users.list([], trimmedSearchQuery);
        const userIds = filteredUsers.total > 0 ? filteredUsers.users.map(user => user.$id) : [];

        if (userIds.length === 0) {
            const data: UsersResponse = {
                metadata: {
                    total: {
                        filtered: 0,
                        all: allUsers.total
                    },
                    searchQuery: trimmedSearchQuery,
                    pageSize: pageSize ?? 10,
                    pageNumber: pageNumber ?? 1
                },
                results: []
            }
            response.json(data)
            return
        }

        queries.push(Query.equal('userId', userIds));
    }

    const profiles = await databases.listDocuments<Profile>(
        DATABASE_ID, PROFILES_COLLECTION_ID, queries
    )

    const data: UsersResponse = {
        metadata: {
            total: {
                filtered: profiles.total,
                all: allUsers.total
            },
            searchQuery: trimmedSearchQuery,
            pageSize: pageSize ?? 10,
            pageNumber: pageNumber ?? 1
        },
        results: profiles.documents.map(p => ({
            avatar: p.avatar, joined: allUsers.users.find(u => u.$id == p.userId)?.registration ?? new Date().toISOString(),
            name: allUsers.users.find(u => u.$id == p.userId)?.name ?? '',
            reputation: p.reputation, title: p.title, username: p.username,
            $id: p.$id
        }))
    }

    response.json(data)
}


router.get("/authenticated", getAuthenticatedUser);
router.get("/:userId", getUserByUserId);
router.get("/profiles/:username", getUserByUsername);
router.put("/", updateUser);
router.get("/", getUsers)

export default router;
