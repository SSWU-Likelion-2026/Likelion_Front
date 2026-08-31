type LogoProps = {
  /** 아이콘 높이(px). 워드마크 글자 크기는 이에 비례한다. */
  size?: number
  /** 워드마크(LIKELION UNIV SSWU) 표시 여부 */
  withText?: boolean
  className?: string
}

/** logo_1.png 마크 + 워드마크. */
function Logo({ size = 20, withText = true, className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <img
        src="/logo_1.png"
        alt=""
        width={size}
        height={size}
        className="shrink-0"
      />
      {withText && (
        <span
          className="font-montserrat font-extrabold tracking-tight text-gray-1 whitespace-nowrap"
          style={{ fontSize: size * 0.8 }}
        >
          LIKELION UNIV SSWU
        </span>
      )}
    </span>
  )
}

export default Logo
