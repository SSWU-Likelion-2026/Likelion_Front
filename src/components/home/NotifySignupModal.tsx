import { memo, useCallback, useState, type ChangeEvent, type MouseEvent } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import DelIcon from '../../img/del.svg'
import { registerAlert } from '../../api/recruiting/recruit'

type NotifySignupModalProps = {
  open: boolean
  onClose: () => void
}

// MainWrap이 장식 요소/모집 상태 변경으로 리렌더돼도, 이 모달은 open이 바뀌지 않는 한(닫혀 있는 동안) 다시 렌더링되지 않는다.
const NotifySignupModal = memo(function NotifySignupModal({ open, onClose }: NotifySignupModalProps) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleClose = useCallback(() => {
    setEmail('')
    setError('')
    onClose()
  }, [onClose])

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), [])
  const stopPropagation = useCallback((e: MouseEvent<HTMLDivElement>) => e.stopPropagation(), [])

  const handleSubmit = useCallback(async () => {
    if (!email.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await registerAlert(email.trim())
      setDone(true)
    } catch {
      setError('알림 신청에 실패했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }, [email])

  if (!open) return null

  return (
    <>
      {!done && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleClose}
        >
          <div className="relative w-[400px] rounded-[20px] bg-white px-7 py-6" onClick={stopPropagation}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[20px] font-semibold">모집 알림 신청</h2>
              <Button onClick={handleClose} className="!p-0 h-5 w-5">
                <img src={DelIcon} alt="닫기" className="h-full w-full" />
              </Button>
            </div>

            <p className="mb-4 text-[14px] text-text-muted">
              모집이 시작되면 입력하신 이메일로 알려드릴게요.
            </p>

            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일 주소를 입력해주세요"
              className="h-[44px] w-full rounded-[10px] border border-gray-9 px-4 text-[14px] outline-none placeholder:text-gray-6 focus:border-primary-100"
            />
            {error && <p className="mt-2 text-[12px] text-red-500">{error}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <Button onClick={handleClose} color="white" className="!px-5 !py-2 !text-[14px]">
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                color="Main100"
                disabled={submitting}
                className="!px-5 !py-2 !text-[14px]"
              >
                {submitting ? '신청 중...' : '알림 신청'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={done}
        title="알림 신청 완료"
        message="모집이 시작되면 입력하신 이메일로 알려드릴게요."
        onClose={handleClose}
        onConfirm={handleClose}
        confirmOnly
        compact
        confirmClassName="bg-primary-100 text-white rounded-[10px] cursor-pointer hover:opacity-90"
      />
    </>
  )
})

export default NotifySignupModal
