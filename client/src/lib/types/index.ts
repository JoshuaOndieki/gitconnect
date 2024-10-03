import {Models} from "appwrite";

export interface UserProfile {
    userId: string
    username: string
    avatar: string | null
    lastVerificationEmailDate: string | null
}

export interface PublicProfileResponse {
    $id: string
    name: string
    avatar: string | null
    bio: string | null
    joined: string
    title: string | null
    username: string
    website: string | null
    work: Work[]
    schools: School[]
    socials: Social[]
}

export interface Work {
    $id: string
    company: string
    title: string
    startDate: string
    endDate: string | null
}

export interface School {
    $id: string
    name: string
    course: string
    startDate: string
    endDate: string | null
}

export interface Social {
    $id: string
    type: 'github' | 'linkedin' | 'twitter'
    username: string
}

export interface BasicUserInfo {
    $id: string
    name: string

    username: string
    avatar: string | null
    title: string | null
    bio?: string | null
    joined: string
    reputation: number
    socials?: Social[]
}

export interface UsersResponse extends BasePaginatedResponse{
    results: BasicUserInfo[]
}

export interface BasePaginatedResponse {
    metadata: {
        total: {
            filtered: number
            all: number
        }
        searchQuery: string | null
        pageSize: number
        pageNumber: number
    }
    results: object[]
}

export interface Post extends Models.Document{
    userId: string
    content: string
}

export interface PostRequest {
    content: string
}

export interface PostData extends Post {
    user: {
        name: string
        username: string
        avatar: string | null
    }
    interactions: {
        commentsCount: number
        likesCount: number
        dislikesCount: number
        userReaction: null | 'like' | 'dislike'
    }
}

export interface Comment extends Models.Document{
    userId: string
    postId: string
    content: string
}

export interface Reaction extends Models.Document{
    userId: string
    postId: string
    like: boolean
}

export interface PostsResponse extends BasePaginatedResponse{
    results: PostData[]
}

export type ReactionActionType = 'like' | 'undo-like' | 'dislike' | 'undo-dislike'

export interface CommentsResponse extends BasePaginatedResponse {
    results: CommentData[]
}

export interface CommentData extends Comment{
    user: {
        name: string
        username: string
        avatar: string | null
    }
}
