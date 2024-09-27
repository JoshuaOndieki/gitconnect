export default {
    BASE_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL ??
        process.env.METADATA_BASE ?? `http://localhost:${process.env.PORT || 3000}`,

    NEXT_PUBLIC_APPWRITE_HOST_URL: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    ENABLE_VERCEL_ANALYTICS: process.env.ENABLE_VERCEL_ANALYTICS && process.env.ENABLE_VERCEL_ANALYTICS.toLowerCase() == 'true',

    NEXT_PUBLIC_APPWRITE_FUNCTIONS: {
        USERS: String(process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_USERS),
        POSTS: String(process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_POSTS),
    }
}