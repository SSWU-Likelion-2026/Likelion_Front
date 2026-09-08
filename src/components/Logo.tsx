type LogoProps = {
  size?: number
  withText?: boolean
  text?: string
  className?: string
  wordmarkClassName?: string
  /** 워드마크 폰트 크기(px) 직접 지정. 생략하면 기본값(size * 0.8)을 사용 */
  wordmarkFontSize?: number
}

function Logo({
  size = 20,
  withText = true,
  text = 'LIKELION UNIV SSWU',
  className,
  wordmarkClassName = 'text-sswu-text',
  wordmarkFontSize,
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
          style={{ fontSize: wordmarkFontSize ?? size * 0.8 }}
        >
          {text}
        </span>
      )}
    </span>
  )
}

export default Logo
