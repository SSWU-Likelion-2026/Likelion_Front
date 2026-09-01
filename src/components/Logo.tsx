type LogoProps = {
  size?: number
  withText?: boolean
  className?: string
  wordmarkClassName?: string
}

function Logo({
  size = 20,
  withText = true,
  className,
  wordmarkClassName = 'text-gray-1',
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
          LIKELION UNIV SSWU
        </span>
      )}
    </span>
  )
}

export default Logo
