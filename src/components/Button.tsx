import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonColor = 'black' | 'white' | 'Main100'

const colorStyles: Record<ButtonColor, string> = {
  black: 'bg-black text-white',
  white: 'bg-white text-black border border-gray-9',
  Main100: 'bg-primary-100 text-white',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor
  className?: string
  children: ReactNode
}

export default function Button({ color, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer px-5 py-3 lg:px-8 lg:py-3 text-[14px] lg:text-[18px] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed ${color ? colorStyles[color] : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
