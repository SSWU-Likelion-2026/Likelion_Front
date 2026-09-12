import { useState } from 'react'
import PmFolderImg from '../../img/session/session_folder_PM.jpg'
import PmFolderHoverImg from '../../img/session/session_folder_PM_hover.jpg'
import FeFolderImg from '../../img/session/session_folder_FE.jpg'
import FeFolderHoverImg from '../../img/session/session_folder_FE_hover.jpg'
import BeFolderImg from '../../img/session/session_folder_BE.jpg'
import BeFolderHoverImg from '../../img/session/session_folder_BE_hover.jpg'
import SessionFolderNoneImg from '../../img/session/session_folder_none.jpg'

const folderImgMap: Record<string, { base: string; hover: string }> = {
  PM: { base: PmFolderImg, hover: PmFolderHoverImg },
  FRONTEND: { base: FeFolderImg, hover: FeFolderHoverImg },
  BACKEND: { base: BeFolderImg, hover: BeFolderHoverImg },
}

interface Props {
  variant?: 'default' | 'none'
  part?: string
  week?: number
  title?: string
  onClick?: () => void
}

export default function SessionFolder({ variant = 'default', part, week, title, onClick }: Props) {
  const isNone = variant === 'none'
  const [hovered, setHovered] = useState(false)
  const imgs = isNone ? null : (folderImgMap[part ?? ''] ?? folderImgMap['PM'])
  const baseImg = isNone ? SessionFolderNoneImg : imgs!.base
  const hoverImg = imgs?.hover

  return (
    <div
      className={`relative ${isNone ? 'cursor-default' : 'cursor-pointer'}`}
      onMouseEnter={() => { if (!isNone) setHovered(true) }}
      onMouseLeave={() => { if (!isNone) setHovered(false) }}
      onClick={onClick}
    >
      <img src={baseImg} alt="session folder" className="w-full aspect-9/8 object-cover" />
      {!isNone && hoverImg && (
        <img
          src={hoverImg}
          alt=""
          aria-hidden
          className={`absolute bottom-0 left-0 w-full transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div className='flex flex-col absolute left-3 lg:left-6 right-3 lg:right-6 bottom-3 lg:bottom-5 gap-1'>
        <p className='text-[11px] lg:text-[17px] text-white'>W{String(week).padStart(2, '0')}</p>
        <p className='text-[13px] lg:text-[19px] font-semibold text-white'>{title}</p>
      </div>
    </div>
  )
}
