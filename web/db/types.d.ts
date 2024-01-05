export type DbScript = {
    id: number
    name: string
    public: boolean
    owner_id: number
    tags: string
    stars: number
    synced: boolean
}

export type DbTemplte = {
    id: number
    name: string
    public: boolean
    owner_id: number
    tags: string
    stars: number
    synced: boolean
}

export type DbUser = {
    id: number
    name: string
    email: string
    emailVerified: Date
    image: string
    login: string
    github_id: number
}
