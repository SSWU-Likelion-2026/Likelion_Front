import Button from './Button'
import DelIcon from '../img/del.svg'

interface Props {
  open: boolean
  title: string
  message: string
  onClose: () => void
  onConfirm: () => void
  confirmOnly?: boolean
  confirmClassName?: string
  /** 더 작은 크기로 표시 (기본값 false, 기존 화면들은 영향 없음) */
  compact?: boolean
}

export default function Modal({ open, title, message, onClose, onConfirm, confirmOnly = false, confirmClassName, compact = false }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-[20px] relative ${compact ? 'w-[315px] lg:w-[400px] px-7 py-6' : 'w-[315px] lg:w-[535px] px-10 py-9'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between ${compact ? 'mb-3' : 'mb-6'}`}>
          <h2 className={compact ? 'text-[20px] font-semibold' : 'text-[20px] lg:text-[32px] font-semibold'}>{title}</h2>
          <Button onClick={onClose} className="!p-0 w-6 h-6">
            <img src={DelIcon} alt="닫기" className="w-full h-full" />
          </Button>
        </div>

        <p className={compact ? 'text-[15px] text-[#697584] mb-6' : 'text-4 lg:text-[28px] text-[#697584] mb-6.25'}>{message}</p>

        <div className={`flex gap-4.25 ${compact ? '' : 'pt-22'}`}>
          {!confirmOnly && (
            <Button
              onClick={onClose}
              color="white"
              className={`w-full ${compact ? 'px-5! py-2! text-[14px]!' : ''}`}>
              취소
            </Button>
          )}
          <Button
            onClick={onConfirm}
            className={`w-full ${confirmClassName ?? 'bg-red-500 text-white'} ${compact ? 'px-5! py-2! text-[14px]!' : ''}`}>
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
