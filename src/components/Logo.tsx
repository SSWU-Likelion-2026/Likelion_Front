type LogoProps = {
  size?: number
  withText?: boolean
  text?: string
  className?: string
  wordmarkClassName?: string
}

function Logo({
  size = 20,
  withText = true,
  text = 'LIKELION UNIV SSWU',
  className,
  wordmarkClassName = 'text-sswu-text',
}: LogoProps) {
  return (
    <span className={`justify-center inline-flex items-center gap-2 ${className ?? ''}`}>
      <img
        src="/logo_1.png"
        alt=""
        width={size}
        height={size}
        className="shrink-0"
      />
      {withText && (
        <span
          className={`font-montserrat font-extrabold tracking-tight whitespace-nowrap ${wordmarkClassName}`}
          style={{ fontSize: size * 0.8 }}
        >
          {text}
        </span>
      )}
    </span>
  )
}

export default Logo
