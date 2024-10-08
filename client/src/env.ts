export default {
    NEXT_PUBLIC_BASE_URL: getUrl(),

    NEXT_PUBLIC_APPWRITE_HOST_URL: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS && process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS.toLowerCase() == 'true',

    NEXT_PUBLIC_APPWRITE_FUNCTIONS: {
        USERS: String(process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_USERS),
        POSTS: String(process.env.NEXT_PUBLIC_APPWRITE_FUNCTION_POSTS),
    },
    NEXT_PUBLIC_APPWRITE_STORAGE: {
        NEXT_PUBLIC_APPWRITE_STORAGE_AVATARS: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_AVATARS,
        NEXT_PUBLIC_APPWRITE_STORAGE_POSTS: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_POSTS
    }
}

function getUrl() {
    const url = (typeof window !== "undefined" ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_PROJECT_PRODUCTION_URL)
    ?? (typeof window !== "undefined" ? process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL : process.env.VERCEL_BRANCH_URL)
    ?? (typeof window !== "undefined" ? process.env.NEXT_PUBLIC_VERCEL_URL : process.env.VERCEL_URL)
    ?? process.env.NEXT_PUBLIC_METADATA_BASE
    ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

    return new URL(url.startsWith('http') ? url : `https://${url}`)
}
