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
}

export default function Modal({ open, title, message, onClose, onConfirm, confirmOnly = false, confirmClassName }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] w-[535px] px-10 py-9 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[32px] font-semibold">{title}</h2>
          <Button onClick={onClose} className="!p-0 w-6 h-6">
            <img src={DelIcon} alt="닫기" className="w-full h-full" />
          </Button>
        </div>

        <p className="text-[28px] text-[#697584] mb-6.25">{message}</p>

        <div className="pt-22 flex justify-end gap-4.25">
          {!confirmOnly && (
            <Button
              onClick={onClose}
              color="white">
              취소
            </Button>
          )}
          <Button
            onClick={onConfirm}
            className={confirmClassName ?? 'bg-red-500 text-white'}>
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
