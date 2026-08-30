import { useState } from 'react'
import SessionFolderImg from '../../img/session/session_folder.jpg'
import SessionFolderHoverImg from '../../img/session/session_folder_hover.jpg'
import SessionFolderNoneImg from '../../img/session/session_folder_none.jpg'

interface Props {
  variant?: 'default' | 'none'
  week?: string
  title?: string
  onClick?: () => void
}

export default function SessionFolder({ variant = 'default', week, title, onClick }: Props) {
  const isNone = variant === 'none'
  const [hovered, setHovered] = useState(false)
  const baseImg = isNone ? SessionFolderNoneImg : SessionFolderImg

  return (
    <div
      className={`relative ${isNone ? 'cursor-default' : 'cursor-pointer'}`}
      onMouseEnter={() => { if (!isNone) setHovered(true) }}
      onMouseLeave={() => { if (!isNone) setHovered(false) }}
      onClick={onClick}
    >
      <img src={baseImg} alt="session folder" className="w-full aspect-9/8 object-cover" />
      {!isNone && (
        <img
          src={SessionFolderHoverImg}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full aspect-9/8 object-cover transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div className='flex flex-col absolute left-5 bottom-6.25'>
        <p className='text-[17px] text-white'>{week}</p>
        <p className='text-[19px] text-white'>{title}</p>
      </div>
    </div>
  )
}
