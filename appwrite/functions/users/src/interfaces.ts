import {Models} from "node-appwrite";

export interface PublicProfile {
    $id: string
    name: string

    username: string
    website: string | null
    avatar: string | null
    title: string | null
    bio: string | null
    joined: string

    work: Work[]
    schools: School[]
    socials: Social[]
}

export interface User extends Models.Document{
}

export interface Profile extends Models.Document{
    userId: string
    username: string
    website: string | null
    avatar: string | null
    title: string | null
    bio: string | null
    reputation: number
}

export interface Work {
    $id: string
    // userId: string
    company: string
    title: string
    startDate: string
    endDate: string | null
}

export interface School {
    $id: string
    // userId: string
    name: string
    course: string
    startDate: string
    endDate: string | null
}

export interface Social {
    $id: string
    // userId: string
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
    results: any
}
