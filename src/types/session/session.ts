export type SessionReviewResponse ={
    commentId: number
    userId: number
    userName: string
    profileImageUrl: string
    content: string
    isOwner: boolean
    createdAt: string
    updatedAt: string
}

export type SessionResponse ={
    term: number
    part: string
    sessions: Session[]
}

export type Session = {
    sessionId: number
    weekNumber: number
    title: string
    subTitle: string
}

export type SessionDetailResponse = {
    sessionId: number
    term: number
    weekNumber: number
    part: string
    title: string
    subTitle: string
    content: string
    thumbnailUrl: string
    learningTopics: LearningTopic[]
}

export type LearningTopic = {
    learningTopicId: number
    content: string
    sequenceNum: number
}