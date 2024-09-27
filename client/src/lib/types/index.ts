export interface UserProfile {
    userId: string
    username: string
    avatar: string | null
    lastVerificationEmailDate: string | null
}

export interface PublicProfileResponse {
    $id: string
    name: string
    avatar: string
    bio: string
    joined: string
    title: string
    username: string
    website: string
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
    avatar: string
    title: string
    joined: string
    reputation: number
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
