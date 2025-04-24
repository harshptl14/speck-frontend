export type Roadmap = {
    id: number
    name: string
    description?: string
    markdown?: string
    createdAt: string
    updatedAt: string
    topics?: Topic[]
}

export type Topic = {
    id: number
    title: string
    description?: string
}
