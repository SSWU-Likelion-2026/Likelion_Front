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

// 지원 현황 조회 API - 쿼리 파라미터 SUBMITTED

export type ApplicationGetResponse = {
    status: "SUBMITTED"
    totalCount: number
    applications: SubmittedApplication[]
}

export type SubmittedApplication = {
    applicationId: number
    name: string
    part: string
    applicationStatus: string
    submittedAt: string
}

// 지원 현황 조회 API - 쿼리 파라미터 DRAFT
export type DraftApplication = {
    hasApplication: boolean
    status: "DRAFT"
    applicationId: number
    name: string
    part: string
    applicationStatus: string
    updatedAt: string
}

// 임시저장 지원서 불러오기 API 타입
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

