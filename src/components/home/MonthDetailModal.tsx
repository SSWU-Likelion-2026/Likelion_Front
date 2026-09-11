import { memo, useCallback, type MouseEvent } from 'react'
import closeIcon from '../../img/home/schedule-modal-icon.svg'

type MonthDetailModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description: string
  image?: string
}

// AnnualSchedule은 hover 상태가 바뀔 때마다 리렌더되지만, 이 모달은 open/title/description이
// 바뀌지 않는 한(즉 열려있지 않은 동안) 다시 렌더링될 필요가 없다.
const MonthDetailModal = memo(function MonthDetailModal({ open, onClose, title, description, image }: MonthDetailModalProps) {
  const stopPropagation = useCallback((e: MouseEvent<HTMLDivElement>) => e.stopPropagation(), [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-dim"
      onClick={onClose}
    >
      <div
        className="relative flex w-[345px] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0px_4px_11px_var(--color-shadow-strong)] lg:w-[633px]"
        onClick={stopPropagation}
      >
        <div className="relative h-[194px] w-full bg-surface-neutral lg:h-[339px]">
          {image && <img src={image} alt="" className="absolute inset-0 size-full object-cover" />}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-6 top-[39px] flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 lg:right-[40px] lg:size-9 lg:bg-white"
          >
            <img src={closeIcon} alt="" className="size-full lg:size-5" />
          </button>
        </div>
        <div className="flex flex-col gap-[13px] p-6 lg:gap-[14px] lg:p-[38px]">
          <p className="m-0 text-[18px] font-semibold text-black-1 lg:text-[25px]">{title}</p>
          <p className="m-0 whitespace-pre-line text-[14px] leading-[1.6] text-black-1 lg:text-[16px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
})

export default MonthDetailModal
