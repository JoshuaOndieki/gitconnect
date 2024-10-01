import {Databases, ID, Models, Query, Users, Storage, AppwriteException} from "node-appwrite";
import {Profile, PublicProfile, School, Social, Work} from "../interfaces.js";
import {
    DATABASE_ID,
    PROFILES_COLLECTION_ID,
    SCHOOL_COLLECTION_ID,
    SOCIALS_COLLECTION_ID, STORAGE_AVATARS,
    WORK_COLLECTION_ID
} from "../constants.js";

export const updateProfile = async (databases: Databases, users: Users, storage: Storage, user: Models.User<Models.Preferences>, payload: PublicProfile, log: any)=> {
    await users.updateName(user.$id, payload.name)
    const profile = (await databases.listDocuments<Profile>(
        DATABASE_ID, PROFILES_COLLECTION_ID,
        [Query.equal('userId', user.$id)])).documents[0]
    if (profile) {
        await databases.updateDocument(
            DATABASE_ID,
            PROFILES_COLLECTION_ID,
            profile.$id,
            {
                username: payload.username,
                website: payload.website,
                avatar: payload.avatar,
                title: payload.title,
                bio: payload.bio,
            }
        );
        if(profile.avatar != payload.avatar) {
            try {
                const fileUrlSplit = (profile.avatar ?? '').split('/')
                const fileId = fileUrlSplit[fileUrlSplit.length - 2]
                await storage.deleteFile(STORAGE_AVATARS, fileId)
            } catch {
                log('Could not delete avatar file: ', profile.avatar)
            }
        }
    }
}

export const updateWork = async (databases: Databases, work: Work[], userId: string)=> {
    const existingWorks = await databases.listDocuments(
        DATABASE_ID,
        WORK_COLLECTION_ID,
        [Query.equal('userId', userId)]
    );
    const existingWorkIds = existingWorks.documents.map(doc => doc.$id);
    const payloadWorkIds = work.map(item => item.$id).filter(id => id);
    const workIdsToDelete = existingWorkIds.filter(id => !payloadWorkIds.includes(id));

    for (const workEntry of work) {
        if (workEntry.$id) {
            await databases.updateDocument(
                DATABASE_ID,
                WORK_COLLECTION_ID,
                workEntry.$id,
                {
                    company: workEntry.company,
                    title: workEntry.title,
                    startDate: workEntry.startDate,
                    endDate: workEntry.endDate,
                }
            );
        } else {
            await databases.createDocument(
                DATABASE_ID,
                WORK_COLLECTION_ID,
                ID.unique(),
                {
                    company: workEntry.company,
                    title: workEntry.title,
                    startDate: workEntry.startDate,
                    endDate: workEntry.endDate,
                    userId
                }
            );
        }
    }

    for (const workId of workIdsToDelete) {
        await deleteDocument(databases, WORK_COLLECTION_ID, workId);
    }
}

export const updateSchools = async (databases: Databases, schools: School[], userId: string)=> {
    const existingSchools = await databases.listDocuments(
        DATABASE_ID,
        SCHOOL_COLLECTION_ID,
        [Query.equal('userId', userId)]
    );
    const existingSchoolIds = existingSchools.documents.map(doc => doc.$id);
    const payloadSchoolIds = schools.map(item => item.$id).filter(id => id);
    const schoolIdsToDelete = existingSchoolIds.filter(id => !payloadSchoolIds.includes(id));

    for (const school of schools) {
        if (school.$id) {
            await databases.updateDocument(
                DATABASE_ID,
                SCHOOL_COLLECTION_ID,
                school.$id,
                {
                    name: school.name,
                    course: school.course,
                    startDate: school.startDate,
                    endDate: school.endDate,
                    userId
                }
            );
        } else {
            await databases.createDocument(
                DATABASE_ID,
                SCHOOL_COLLECTION_ID,
                ID.unique(),
                {
                    name: school.name,
                    course: school.course,
                    startDate: school.startDate,
                    endDate: school.endDate,
                    userId
                }
            );
        }
    }

    for (const schoolId of schoolIdsToDelete) {
        await deleteDocument(databases, SCHOOL_COLLECTION_ID, schoolId);
    }

}

export const updateSocials = async (databases: Databases, socials: Social[], userId: string)=> {
    for (const social of socials) {
        if (social.$id) {
            await databases.updateDocument(
                DATABASE_ID,
                SOCIALS_COLLECTION_ID,
                social.$id,
                {
                    type: social.type,
                    username: social.username,
                }
            );
        } else {
            await databases.createDocument(
                DATABASE_ID,
                SOCIALS_COLLECTION_ID,
                ID.unique(),
                {
                    type: social.type,
                    username: social.username,
                    userId
                }
            );
        }
    }
}

const deleteDocument = async (databases: Databases, collectionId: string, documentId: string) => {
    await databases.deleteDocument(
        DATABASE_ID,
        collectionId,
        documentId
    );
};