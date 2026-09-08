import { memo, useCallback, type MouseEvent } from 'react'
import closeIcon from '../../img/home/schedule-modal-icon.svg'

type MonthDetailModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description: string
}

// AnnualSchedule은 hover 상태가 바뀔 때마다 리렌더되지만, 이 모달은 open/title/description이
// 바뀌지 않는 한(즉 열려있지 않은 동안) 다시 렌더링될 필요가 없다.
const MonthDetailModal = memo(function MonthDetailModal({ open, onClose, title, description }: MonthDetailModalProps) {
  const stopPropagation = useCallback((e: MouseEvent<HTMLDivElement>) => e.stopPropagation(), [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(18,18,18,0.6)]"
      onClick={onClose}
    >
      <div
        className="relative flex w-[633px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0px_4px_11px_rgba(0,0,0,0.5)]"
        onClick={stopPropagation}
      >
        <div className="relative h-[339px] w-full bg-[#f3f4f6]">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-[40px] top-[39px] size-[29px] cursor-pointer border-0 bg-transparent p-0"
          >
            <img src={closeIcon} alt="" className="size-full" />
          </button>
        </div>
        <div className="flex flex-col gap-[14px] p-[38px]">
          <p className="m-0 text-[25px] font-semibold text-[#121212]">{title}</p>
          <p className="m-0 whitespace-pre-line text-[16px] leading-[1.6] text-[#121212]">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
})

export default MonthDetailModal
