import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  createMyProfile,
  deleteMyProfile,
  updateMyProfile,
  type MemberGroup,
  type MemberProfileDetail,
  type MemberType,
} from '../../api/people/people'
// 부원 프로필 사진 전용 업로드 API가 없어서, 프로젝트 이미지 업로드(S3 저장 후 URL 반환)를 그대로 재사용한다
import { uploadProjectImage } from '../../api/project/project'

type Position = 'PRESIDENT' | 'VICE_PRESIDENT' | 'PART_LEADER' | 'NONE'

const GROUP_OPTIONS: { value: MemberGroup; label: string }[] = [
  { value: 'LEADERSHIP', label: '대표단' },
  { value: 'PM', label: 'PM (기획/디자인)' },
  { value: 'FE', label: 'FE (프론트엔드)' },
  { value: 'BE', label: 'BE (백엔드)' },
]

const TYPE_OPTIONS: { value: MemberType; label: string }[] = [
  { value: 'STAFF', label: '운영진' },
  { value: 'BABY_LION', label: '아기사자' },
]

const POSITION_OPTIONS: { value: Position; label: string }[] = [
  { value: 'PRESIDENT', label: '대표' },
  { value: 'VICE_PRESIDENT', label: '부대표' },
  { value: 'PART_LEADER', label: '파트장' },
  { value: 'NONE', label: '선택 안 함' },
]

const INTRO_MAX_LENGTH = 50

type FormState = {
  name: string
  department: string
  studentId: string
  memberGroup: MemberGroup | ''
  memberType: MemberType | ''
  position: Position | ''
  profileImageUrl: string
  introduction: string
  githubUrl: string
  instagramUrl: string
}

const EMPTY_FORM: FormState = {
  name: '',
  department: '',
  studentId: '',
  memberGroup: '',
  memberType: '',
  position: '',
  profileImageUrl: '',
  introduction: '',
  githubUrl: '',
  instagramUrl: '',
}

function detailToForm(detail: MemberProfileDetail): FormState {
  return {
    name: detail.name ?? '',
    department: detail.department ?? '',
    studentId: detail.studentId ?? '',
    memberGroup: detail.memberGroup ?? '',
    memberType: detail.memberType ?? '',
    position: (detail.position as Position) ?? '',
    profileImageUrl: detail.profileImageUrl ?? '',
    introduction: detail.introduction ?? '',
    githubUrl: detail.githubUrl ?? '',
    instagramUrl: detail.instagramUrl ?? '',
  }
}

// 포커스/클릭 시 보라색 테두리가 생기지 않도록 focus 스타일을 별도로 주지 않는다 (피그마 디자인 기준)
const INPUT_CLASS =
  'h-[61px] w-full rounded-[15px] border border-gray-9 px-[20px] text-[16px] text-black outline-none placeholder:text-gray-7'
const DROPDOWN_TRIGGER_CLASS =
  'flex h-[61px] w-full items-center rounded-[15px] border border-gray-9 bg-white px-[20px] pr-[44px] text-left text-[16px] outline-none'

// 모바일 폼 필드 (피그마 node 1183:15273 기준 — 데스크탑보다 작은 텍스트/패딩)
const MOBILE_INPUT_CLASS =
  'w-full rounded-[10px] border border-gray-9 px-[20px] py-[18px] text-[14px] text-black outline-none placeholder:text-gray-4'
const MOBILE_DROPDOWN_TRIGGER_CLASS =
  'flex h-[57px] w-full items-center rounded-[10px] border border-gray-9 bg-white px-[20px] pr-[44px] text-left text-[14px] outline-none'

function ChevronIcon({ open }: { open?: boolean }) {
  return (
    <svg
      className={`pointer-events-none absolute right-[20px] top-1/2 size-[18px] -translate-y-1/2 text-gray-7 transition-transform ${
        open ? 'rotate-180' : ''
      }`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7.5L10 12.5L15 7.5" />
    </svg>
  )
}

type DropdownOption<T extends string> = { value: T; label: string }

type DropdownProps<T extends string> = {
  value: T | ''
  placeholder: string
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  ariaLabel: string
  /** 모바일 폼(피그마 node 1183:15273)은 데스크탑보다 트리거가 작고 텍스트가 14px이라 별도 스타일을 쓴다 */
  size?: 'desktop' | 'mobile'
}

/** 피그마 디자인의 드롭다운(선택 항목 회색 강조 + 하단 플로팅 리스트)은 네이티브 select로 재현할 수 없어 커스텀으로 구현 */
function Dropdown<T extends string>({ value, placeholder, options, onChange, ariaLabel, size = 'desktop' }: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mobile = size === 'mobile'

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`${mobile ? MOBILE_DROPDOWN_TRIGGER_CLASS : DROPDOWN_TRIGGER_CLASS} ${
          selected ? 'text-black' : mobile ? 'text-gray-4' : 'text-gray-7'
        }`}
      >
        {selected ? selected.label : placeholder}
      </button>
      <ChevronIcon open={open} />
      {open && (
        <div
          className={`absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden border border-gray-9 bg-white shadow-[0_8px_24px_var(--color-shadow-soft)] ${
            mobile ? 'rounded-[10px] py-[4px]' : 'rounded-[15px] py-[6px]'
          }`}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
              className={`block w-full px-[20px] text-left hover:bg-surface-neutral ${mobile ? 'py-[11px] text-[14px]' : 'py-[13px] text-[16px]'} ${
                o.value === value ? 'bg-surface-neutral font-semibold text-black' : 'text-gray-7 hover:text-black'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

type ProfileFormModalProps = {
  open: boolean
  term: number
  /** null이면 신규 등록, 값이 있으면 해당 프로필을 수정 */
  existing: MemberProfileDetail | null
  onClose: () => void
  onSaved: () => void
}

function ProfileFormModal({ open, term, existing, onClose, onSaved }: ProfileFormModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setForm(existing ? detailToForm(existing) : EMPTY_FORM)
    setError('')
  }, [open, existing])

  if (!open) return null

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleTextChange = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    updateField(key, e.target.value as FormState[typeof key])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadProjectImage(file, 'LOGO')
      updateField('profileImageUrl', url)
    } catch {
      setError('이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = async () => {
    if (!existing) {
      setForm(EMPTY_FORM)
      return
    }
    if (!window.confirm('등록된 프로필을 삭제할까요? 이 작업은 되돌릴 수 없어요.')) return
    setSubmitting(true)
    setError('')
    try {
      await deleteMyProfile(term)
      onSaved()
      onClose()
    } catch {
      setError('삭제에 실패했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.department.trim() || !form.studentId.trim() || !form.memberGroup || !form.memberType) {
      setError('이름, 학과, 학번, 파트, 유형은 필수예요.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        department: form.department.trim(),
        studentId: form.studentId.trim(),
        memberGroup: form.memberGroup,
        memberType: form.memberType,
        position: form.position || 'NONE',
        profileImageUrl: form.profileImageUrl.trim() || undefined,
        introduction: form.introduction.trim() || undefined,
        githubUrl: form.githubUrl.trim() || undefined,
        instagramUrl: form.instagramUrl.trim() || undefined,
      }
      if (existing) {
        await updateMyProfile(term, payload)
      } else {
        await createMyProfile({ term, ...payload })
      }
      onSaved()
      onClose()
    } catch {
      setError('저장에 실패했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
    {/* 데스크탑: 중앙 정렬 다이얼로그 */}
    <div className="fixed inset-0 z-50 hidden items-center justify-center bg-black/65 lg:flex" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-[702px] flex-col gap-[28px] rounded-[20px] border border-gray-9 bg-white p-[52px]"
      >
        <div className="flex items-center justify-between">
          <p className="m-0 text-[32px] font-semibold text-black">{existing ? '프로필 수정' : '프로필 등록'}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="cursor-pointer border-0 bg-transparent p-0 text-gray-6"
          >
            <svg
              className="size-[22px]"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M4 4L18 18M18 4L4 18" />
            </svg>
          </button>
        </div>

        <div className="flex gap-[24px]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative size-[280px] shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-9 bg-surface-neutral disabled:opacity-60"
          >
            {form.profileImageUrl ? (
              <img src={form.profileImageUrl} alt="" className="size-full object-cover" />
            ) : (
              <>
                <span className="absolute left-1/2 top-[60px] size-[112px] -translate-x-1/2 rounded-full bg-primary-35" />
                <span className="absolute left-1/2 top-[146px] size-[236px] -translate-x-1/2 rounded-full bg-primary-35" />
              </>
            )}
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-[13px] text-gray-6">
                업로드 중...
              </span>
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          <div className="flex flex-1 flex-col gap-[20px]">
            <input
              id="name"
              className={INPUT_CLASS}
              value={form.name}
              onChange={handleTextChange('name')}
              placeholder="이름"
              aria-label="이름"
              required
            />
            <input
              id="department"
              className={INPUT_CLASS}
              value={form.department}
              onChange={handleTextChange('department')}
              placeholder="학과"
              aria-label="학과"
              required
            />
            <input
              id="studentId"
              className={INPUT_CLASS}
              value={form.studentId}
              onChange={handleTextChange('studentId')}
              placeholder="학번"
              aria-label="학번"
              required
            />
            <Dropdown
              value={form.position}
              placeholder="직책"
              options={POSITION_OPTIONS}
              onChange={(v) => updateField('position', v)}
              ariaLabel="직책"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-[16px] gap-y-[20px]">
          <Dropdown
            value={form.memberGroup}
            placeholder="파트 선택"
            options={GROUP_OPTIONS}
            onChange={(v) => updateField('memberGroup', v)}
            ariaLabel="파트 선택"
          />
          <input
            id="githubUrl"
            className={INPUT_CLASS}
            value={form.githubUrl}
            onChange={handleTextChange('githubUrl')}
            placeholder="Github"
            aria-label="Github"
          />
          <Dropdown
            value={form.memberType}
            placeholder="운영진 / 아기사자"
            options={TYPE_OPTIONS}
            onChange={(v) => updateField('memberType', v)}
            ariaLabel="운영진 / 아기사자"
          />
          <input
            id="instagramUrl"
            className={INPUT_CLASS}
            value={form.instagramUrl}
            onChange={handleTextChange('instagramUrl')}
            placeholder="Instagram"
            aria-label="Instagram"
          />
        </div>

        <div className="relative">
          <textarea
            id="introduction"
            className={`${INPUT_CLASS} h-[106px] resize-none py-[14px] pr-[70px]`}
            value={form.introduction}
            maxLength={INTRO_MAX_LENGTH}
            onChange={handleTextChange('introduction')}
            placeholder="한 줄 소개"
            aria-label="한 줄 소개"
          />
          <span className="pointer-events-none absolute bottom-[14px] right-[20px] text-[13px] text-gray-7">
            {form.introduction.length}/{INTRO_MAX_LENGTH}자
          </span>
        </div>

        {error && <p className="m-0 text-[14px] text-red-500">{error}</p>}

        <div className="flex justify-end gap-[15px]">
          <button
            type="button"
            onClick={handleReset}
            disabled={submitting || uploading}
            className="cursor-pointer rounded-[10px] border border-gray-9 bg-white px-[28px] py-[15px] text-[20px] font-semibold text-text-muted disabled:opacity-50"
          >
            전체삭제
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="cursor-pointer rounded-[10px] bg-warm-black px-[28px] py-[15px] text-[20px] font-semibold text-white disabled:opacity-50"
          >
            {existing ? '수정' : '등록'}
          </button>
        </div>
      </form>
    </div>

    {/* 모바일: 풀스크린 오버레이 (피그마 node 1183:15273 "프로필 등록 (수정 동일)" 기준) */}
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white lg:hidden">
      <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
        <div className="relative h-[180px] shrink-0 bg-gradient-to-b from-[#5D23E3] to-accent-100">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-6 top-6 cursor-pointer border-0 bg-transparent p-0 text-white"
          >
            <svg className="size-[22px]" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 4L18 18M18 4L4 18" />
            </svg>
          </button>
          <p className="absolute bottom-8 left-6 m-0 font-montserrat text-[36px] font-semibold leading-none text-white">People</p>
        </div>

        <div className="relative -mt-6 flex flex-1 flex-col gap-[15px] rounded-t-[20px] bg-white px-6 pb-10 pt-9">
          <p className="m-0 text-[20px] font-semibold text-black-1">{existing ? '프로필 수정' : '프로필 등록'}</p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative mx-auto size-[100px] shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-9 bg-surface-neutral disabled:opacity-60"
          >
            {form.profileImageUrl ? (
              <img src={form.profileImageUrl} alt="" className="size-full object-cover" />
            ) : (
              <>
                <span className="absolute left-1/2 top-[22px] size-[40px] -translate-x-1/2 rounded-full bg-primary-35" />
                <span className="absolute left-1/2 top-[52px] size-[84px] -translate-x-1/2 rounded-full bg-primary-35" />
              </>
            )}
            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-[11px] text-gray-6">
                업로드 중...
              </span>
            )}
          </button>

          <input
            className={MOBILE_INPUT_CLASS}
            value={form.name}
            onChange={handleTextChange('name')}
            placeholder="이름"
            aria-label="이름"
            required
          />
          <input
            className={MOBILE_INPUT_CLASS}
            value={form.department}
            onChange={handleTextChange('department')}
            placeholder="학과"
            aria-label="학과"
            required
          />
          <input
            className={MOBILE_INPUT_CLASS}
            value={form.studentId}
            onChange={handleTextChange('studentId')}
            placeholder="학번"
            aria-label="학번"
            required
          />
          <Dropdown
            size="mobile"
            value={form.position}
            placeholder="직책"
            options={POSITION_OPTIONS}
            onChange={(v) => updateField('position', v)}
            ariaLabel="직책"
          />
          <Dropdown
            size="mobile"
            value={form.memberGroup}
            placeholder="파트 선택"
            options={GROUP_OPTIONS}
            onChange={(v) => updateField('memberGroup', v)}
            ariaLabel="파트 선택"
          />
          <Dropdown
            size="mobile"
            value={form.memberType}
            placeholder="운영진/아기사자"
            options={TYPE_OPTIONS}
            onChange={(v) => updateField('memberType', v)}
            ariaLabel="운영진 / 아기사자"
          />
          <input
            className={MOBILE_INPUT_CLASS}
            value={form.githubUrl}
            onChange={handleTextChange('githubUrl')}
            placeholder="Github"
            aria-label="Github"
          />
          <input
            className={MOBILE_INPUT_CLASS}
            value={form.instagramUrl}
            onChange={handleTextChange('instagramUrl')}
            placeholder="Instagram"
            aria-label="Instagram"
          />

          <div className="relative">
            <textarea
              className={`${MOBILE_INPUT_CLASS} h-[116px] resize-none pr-[50px]`}
              value={form.introduction}
              maxLength={INTRO_MAX_LENGTH}
              onChange={handleTextChange('introduction')}
              placeholder="한 줄 소개"
              aria-label="한 줄 소개"
            />
            <span className="pointer-events-none absolute bottom-[14px] right-[20px] text-[12px] text-gray-6">
              {form.introduction.length}/{INTRO_MAX_LENGTH}자
            </span>
          </div>

          {error && <p className="m-0 text-[13px] text-red-500">{error}</p>}

          <div className="mt-2 flex gap-[12px]">
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting || uploading}
              className="h-[70px] w-[110px] shrink-0 cursor-pointer rounded-[10px] border border-gray-9 bg-white text-[20px] font-semibold text-black-1 disabled:opacity-50"
            >
              삭제
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="h-[70px] flex-1 cursor-pointer rounded-[10px] bg-primary-100 text-[20px] font-semibold text-white disabled:opacity-50"
            >
              {existing ? '수정' : '등록'}
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  )
}

export default ProfileFormModal
