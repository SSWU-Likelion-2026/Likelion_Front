export type ProfileGetResponse = {
    userId: number
    name: string
    profileImageUrl: string
    greeting: string
    email: string
    major: string
    studentId: string
    phoneNumber: string
    joinedAt: string
    role: string
}

export type ProfileEditRequest = {
    name: string
    major: string
    studentId: string
    phoneNumber: string
}

export type ProfileEditResponse = {
    userId: number
    name: string
    major: string
    studentId: string
    phoneNumber: string
}

export type DraftApplicationResponse = {
    applicationId: number
    recruitmentId: number
    status: string
    partId: number
    partName: string
    answers: Answers[]
    updatedAt: string
}

export type Answers = {
    questionId: number
    question: string
    content: string
}