import type {
  CurrentQuestionsResponse,
  LandingPageResponse,
} from '../api/recruiting/recruit'

/**
 * 백엔드에 활성 모집 공고가 없을 때(/recruitments/current 404) 쓰는 임시 데이터.
 * 실제 공고가 생기면 API 응답이 이걸 대체한다. 디자인 확인용.
 */
export const FALLBACK_LANDING: LandingPageResponse = {
  recruitment: {
    recruitmentId: 0,
    term: 15,
    title: '15기 아기사자 모집',
    status: 'CLOSED',
    docStartAt: '2026-03-02T00:00:00',
    docEndAt: '2026-03-09T23:59:59',
    docResultAt: '2026-03-12T00:00:00',
    interviewStartAt: '2026-03-14T00:00:00',
    interviewEndAt: '2026-03-16T00:00:00',
    finalResultAt: '2026-03-19T00:00:00',
  },
  parts: [
    {
      partId: 1,
      name: '기획/디자인',
      description: '문제를 정의하고 서비스의 방향과 화면을 설계하는 파트입니다.',
    },
    {
      partId: 2,
      name: '프론트엔드',
      description: '사용자가 마주하는 화면을 코드로 구현하는 파트입니다.',
    },
    {
      partId: 3,
      name: '백엔드',
      description: '데이터와 서버 로직, API 를 다루는 파트입니다.',
    },
  ],
  faqs: [
    {
      faqId: 1,
      partId: null,
      question: '학년 제한이 있나요?',
      answer: '성신여대 재학생이라면 학년 상관없이 지원할 수 있어요.',
    },
    {
      faqId: 2,
      partId: 1,
      question: '기획/디자인 파트는 포트폴리오가 필수인가요?',
      answer: '필수는 아니지만 있으면 심사에 도움이 됩니다.',
    },
    {
      faqId: 3,
      partId: 2,
      question: '프론트엔드는 어떤 기술을 배우나요?',
      answer: 'HTML/CSS/JS 기초부터 React 까지 다룹니다.',
    },
    {
      faqId: 4,
      partId: 3,
      question: '백엔드 사전 지식이 없어도 되나요?',
      answer: '기초 세션부터 시작하니 프로그래밍 경험만 있으면 괜찮아요.',
    },
  ],
}

/**
 * 지원서 문항 임시 데이터 (/recruitments/current/questions 404 시).
 * 실제 문항 확정 전까지 임시로 자기소개/지원동기로 채움.
 * placeholder 는 `{content}를 작성해주세요.` 로 자동 생성됨.
 */
const longQ = (
  questionId: number,
  questionNumber: number,
  content: string,
): CurrentQuestionsResponse['commonQuestions'][number] => ({
  questionId,
  questionNumber,
  content,
  questionType: 'LONG_ANSWER',
  maxLength: 500,
  isRequired: false,
})

const portfolioQ = (
  questionId: number,
  questionNumber: number,
): CurrentQuestionsResponse['commonQuestions'][number] => ({
  questionId,
  questionNumber,
  content: '포트폴리오 업로드',
  questionType: 'FILE',
  maxLength: 0,
  isRequired: false,
})

export const FALLBACK_QUESTIONS: CurrentQuestionsResponse = {
  recruitmentId: 0,
  term: 15,
  commonQuestions: [
    longQ(101, 1, '자기소개'),
    longQ(102, 2, '지원동기'),
    longQ(103, 3, '지원동기'),
  ],
  partQuestions: [
    {
      partId: 1,
      partName: '기획/디자인',
      questions: [longQ(201, 4, '지원동기'), portfolioQ(202, 5)],
    },
    {
      partId: 2,
      partName: '프론트엔드',
      questions: [longQ(211, 4, '지원동기'), portfolioQ(212, 5)],
    },
    {
      partId: 3,
      partName: '백엔드',
      questions: [longQ(221, 4, '지원동기'), portfolioQ(222, 5)],
    },
  ],
}
