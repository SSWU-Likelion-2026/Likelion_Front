import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Modal from '../../components/Modal'
import { getAccessToken } from '../../lib/auth-storage'
import { ApiError } from '../../api/http'
import {
  getCurrentQuestions,
  getMyApplication,
  saveDraft,
  submitApplication,
  uploadApplicationFile,
  type CurrentQuestionsResponse,
  type Question,
} from '../../api/recruit'
import { FALLBACK_QUESTIONS } from '../../lib/recruit-fallback'

function Apply() {
  // ?preview - 로그인 게이트 건너뛰고 폼 바로 보여줌(퍼블리싱용)
  const [params] = useSearchParams()
  const authed = Boolean(getAccessToken())
  if (!authed && !params.has('preview')) return <LoginGate />
  return <ApplyForm authed={authed} />
}

/* ------------------------------------------------------------------ *
 * 로그인 게이트 (비로그인 시)
 * ------------------------------------------------------------------ */

function LoginGate() {
  return (
    <div className="flex min-h-[calc(100svh-57px)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-[26px] font-semibold text-black">
        지원서 작성은 로그인 후 가능합니다
      </h1>
      <p className="text-[15px] text-gray-4">감사합니다.</p>
      <div className="mt-4 flex items-center gap-3">
        <Link
          to="/"
          className="rounded-[10px] border border-gray-9 px-7 py-3 text-[15px] text-gray-3 hover:bg-gray-10"
        >
          홈으로 이동
        </Link>
        <Link
          to="/login"
          className="rounded-[10px] bg-[#212121] px-7 py-3 text-[15px] font-medium text-white hover:opacity-90"
        >
          로그인 하기
        </Link>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 지원서 폼 (로그인 시)
 * ------------------------------------------------------------------ */

function ApplyForm({ authed }: { authed: boolean }) {
  const navigate = useNavigate()

  const [data, setData] = useState<CurrentQuestionsResponse | null>(null)

  const [partName, setPartName] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [uploading, setUploading] = useState<Record<number, boolean>>({})

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // 문항 + 임시저장 지원서 불러오기
  useEffect(() => {
    const apply = (res: CurrentQuestionsResponse) => {
      setData(res)
      setPartName((prev) => prev || res.partQuestions[0]?.partName || '')
    }
    getCurrentQuestions()
      .then(apply)
      // 활성 모집 공고 없으면(404) 임시 문항으로 표시 (퍼블리싱용)
      .catch(() => apply(FALLBACK_QUESTIONS))

    // 로그인 상태에서만 내 지원서(임시저장) 불러오기
    if (!authed) return
    getMyApplication()
      .then((mine) => {
        if (mine.submitStatus === 'SUBMITTED') {
          navigate('/recruiting/complete', { replace: true })
          return
        }
        setPartName(mine.part?.name ?? '')
        setAnswers(
          Object.fromEntries(
            mine.answers.map((a) => [a.questionId, a.answerContent ?? '']),
          ),
        )
      })
      .catch(() => {
        /* 작성한 지원서 없음 — 무시 */
      })
  }, [navigate, authed])

  const selectedGroup = data?.partQuestions.find((g) => g.partName === partName)
  const partId = selectedGroup?.partId ?? 0

  const questions = useMemo<Question[]>(() => {
    if (!data) return []
    return [...data.commonQuestions, ...(selectedGroup?.questions ?? [])].sort(
      (a, b) => a.questionNumber - b.questionNumber,
    )
  }, [data, selectedGroup])

  const setAnswer = (qid: number, value: string) =>
    setAnswers((prev) => ({ ...prev, [qid]: value }))

  const toAnswerList = () =>
    questions
      .map((q) => ({ questionId: q.questionId, content: answers[q.questionId] ?? '' }))
      .filter((a) => a.content !== '')

  const handleFile = async (
    e: ChangeEvent<HTMLInputElement>,
    qid: number,
  ) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading((p) => ({ ...p, [qid]: true }))
    setFormError(null)
    try {
      // 폴더 선택 시 파일이 여러 개 > 각각 업로드하고 URL을 줄바꿈으로 이어서 저장됨
      const urls: string[] = []
      for (const f of files) urls.push(await uploadApplicationFile(f))
      setAnswer(qid, urls.join('\n'))
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : '파일 업로드에 실패했어요.',
      )
    } finally {
      setUploading((p) => ({ ...p, [qid]: false }))
    }
  }

  const handleTempSave = async () => {
    setFormError(null)
    // preview(비로그인) 모드: API 없이 완료 모달만
    if (!authed) {
      setSavedOpen(true)
      return
    }
    try {
      await saveDraft({ partId, answers: toAnswerList() })
      setSavedOpen(true)
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : '임시저장에 실패했어요.',
      )
    }
  }

  const handleSubmit = async () => {
    setConfirmOpen(false)
    const missing = questions.find(
      (q) => q.isRequired && !(answers[q.questionId] ?? '').trim(),
    )
    if (missing) {
      setFormError(`필수 문항을 모두 작성해주세요: "${missing.content}"`)
      return
    }
    // preview(비로그인) 모드: API 없이 완료 화면으로 이동
    if (!authed) {
      navigate('/recruiting/complete')
      return
    }
    setSubmitting(true)
    setFormError(null)
    try {
      await submitApplication({ partId, answers: toAnswerList() })
      navigate('/recruiting/complete')
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : '제출에 실패했어요.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const openLink = (value: string) => {
    if (!value.trim()) return
    const url = /^https?:\/\//.test(value) ? value : `https://${value}`
    window.open(url, '_blank', 'noopener')
  }

  if (!data) {
    return (
      <p className="py-40 text-center text-[16px] text-gray-4">불러오는 중…</p>
    )
  }

  return (
    <div className="mx-auto w-[1200px] max-w-full py-16">
      <h1 className="text-[32px] font-semibold text-black">지원서 작성</h1>

      <div className="mt-[30px] flex flex-col gap-[30px]">
        <p className="text-[28px] font-semibold text-black">트랙 선택</p>
        <TrackSelect
          options={data.partQuestions.map((g) => g.partName)}
          value={partName}
          onChange={setPartName}
        />
      </div>

      {questions.map((q, i) => (
        <div
          key={q.questionId}
          className={`${i === 0 ? 'mt-[100px]' : 'mt-[150px]'} flex flex-col gap-3`}
        >
          <p className="text-[28px] font-semibold text-black">
            {q.content}
            {q.isRequired && <span className="ml-1 text-red-500">*</span>}
          </p>
          <QuestionField
            q={q}
            value={answers[q.questionId] ?? ''}
            uploading={Boolean(uploading[q.questionId])}
            onText={(v) => setAnswer(q.questionId, v)}
            onFile={(e) => handleFile(e, q.questionId)}
            onOpenLink={() => openLink(answers[q.questionId] ?? '')}
          />
        </div>
      ))}

      {formError && (
        <p className="mt-6 text-[13px] text-red-500" role="alert">
          {formError}
        </p>
      )}

      <div className="mt-14 flex justify-end gap-3">
        <button
          onClick={handleTempSave}
          className="rounded-[10px] border border-gray-9 px-7 py-3 text-[15px] text-gray-3 hover:bg-gray-10 cursor-pointer"
        >
          임시저장
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={submitting}
          className="rounded-[10px] bg-[#212121] px-7 py-3 text-[15px] font-medium text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? '제출 중…' : '제출'}
        </button>
      </div>

      {/* 공용 Modal 컴포넌트는 수정 안 하고, 이 화면에서만 글자 크기를 줄임 */}
      <div className="[&_h2]:text-[24px] [&_p]:text-[18px]">
        <Modal
          open={confirmOpen}
          title="지원서 제출"
          message="제출 후에는 지원서를 수정할 수 없습니다. 제출하시겠어요?"
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleSubmit}
          confirmClassName="px-6 py-2.5 bg-[#212121] text-white text-[16px] rounded-[10px] cursor-pointer hover:opacity-90"
        />
        <Modal
          open={savedOpen}
          title="임시저장"
          message="작성한 내용을 임시저장했어요."
          onClose={() => setSavedOpen(false)}
          onConfirm={() => setSavedOpen(false)}
          confirmOnly
          confirmClassName="px-6 py-2.5 bg-[#212121] text-white text-[16px] rounded-[10px] cursor-pointer hover:opacity-90"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 트랙 선택 토글 (기획/디자인 · 프론트엔드 · 백엔드)
 * ------------------------------------------------------------------ */

type TrackSelectProps = {
  options: string[]
  value: string
  onChange: (v: string) => void
}

// 트랙별 버튼 너비 (Figma 스펙). 없는 트랙은 내용에 맞춰 자동.
const TRACK_WIDTH: Record<string, string> = {
  '기획/디자인': 'w-[154px]',
  프론트엔드: 'w-[147px]',
  백엔드: 'w-[112px]',
}

function TrackSelect({ options, value, onChange }: TrackSelectProps) {
  return (
    <div className="flex gap-2.5">
      {options.map((opt) => {
        const selected = opt === value
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`h-[64px] rounded-[15px] border border-primary-35 px-[30px] text-[15px] transition-colors cursor-pointer ${
              TRACK_WIDTH[opt] ?? ''
            } ${
              selected
                ? 'bg-primary-100 text-white'
                : 'bg-white text-gray-1 hover:bg-gray-10'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 문항 타입별 입력 필드
 * ------------------------------------------------------------------ */

type FieldProps = {
  q: Question
  value: string
  uploading: boolean
  onText: (v: string) => void
  onFile: (e: ChangeEvent<HTMLInputElement>) => void
  onOpenLink: () => void
}

// 공통 클래스
const cardClass = 'rounded-[20px] border border-primary-80'

function QuestionField({ q, value, uploading, onText, onFile, onOpenLink }: FieldProps) {
  // 포트폴리오/파일: 링크 입력 + 폴더 업로드
  if (q.questionType === 'FILE') {
    const fileCount = value ? value.split('\n').filter(Boolean).length : 0
    return (
      <div className={`${cardClass} flex items-center gap-3 px-6 py-5`}>
        <input
          type="text"
          value={fileCount > 0 ? `파일 ${fileCount}개 업로드됨` : value}
          readOnly={fileCount > 0}
          onChange={(e) => onText(e.target.value)}
          placeholder="포트폴리오 링크"
          className="flex-1 text-[15px] text-gray-1 outline-none placeholder:text-gray-5"
        />
        <label className="shrink-0 rounded-lg border border-gray-9 px-4 py-2 text-[13px] text-gray-3 hover:bg-gray-10 cursor-pointer">
          {uploading ? '업로드 중…' : '파일 선택'}
          <input
            type="file"
            multiple
            {...({ webkitdirectory: '' } as Record<string, string>)}
            className="hidden"
            onChange={onFile}
          />
        </label>
      </div>
    )
  }

  if (q.questionType === 'LINK') {
    return (
      <div className={`${cardClass} flex items-center gap-3 px-6 py-5`}>
        <input
          type="url"
          value={value}
          onChange={(e) => onText(e.target.value)}
          placeholder="https://"
          className="flex-1 text-[15px] text-gray-1 outline-none placeholder:text-gray-5"
        />
        <button
          onClick={onOpenLink}
          className="shrink-0 rounded-lg border border-gray-9 px-4 py-2 text-[13px] text-gray-3 hover:bg-gray-10 cursor-pointer"
        >
          확인
        </button>
      </div>
    )
  }

  if (q.questionType === 'SHORT_ANSWER') {
    return (
      <div className={`${cardClass} px-6 py-5`}>
        <input
          type="text"
          value={value}
          maxLength={q.maxLength || undefined}
          onChange={(e) => onText(e.target.value)}
          placeholder={`${q.content}를 작성해주세요.`}
          className="w-full text-[15px] text-black outline-none placeholder:text-gray-5"
        />
      </div>
    )
  }

  // 긴 답변 (카드 높이 245px)
  return (
    <div className={`${cardClass} flex h-[245px] flex-col px-6 py-5`}>
      <textarea
        value={value}
        maxLength={q.maxLength || undefined}
        onChange={(e) => onText(e.target.value)}
        placeholder={`${q.content}를 작성해주세요.`}
        className="w-full flex-1 resize-none text-[15px] text-black outline-none placeholder:text-gray-5"
      />
      {q.maxLength > 0 && (
        <p className="text-right text-[13px] text-gray-5">
          {q.maxLength - value.length}자
        </p>
      )}
    </div>
  )
}

export default Apply
