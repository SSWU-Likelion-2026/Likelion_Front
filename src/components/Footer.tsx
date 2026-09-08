import Logo from './Logo'
import instagramIcon from '../img/instagram-icon.svg'

function Footer() {
  return (
    <footer className="mt-[100px] flex w-full items-center justify-center bg-warm-black py-[80px]">
      <div className="flex w-[523px] flex-col items-center gap-[25px]">
        <Logo size={64} text="SSWU LIKELION UNIV" wordmarkFontSize={41} />
        <div className="flex items-center gap-[31px]">
          {Array.from({ length: 3 }, (_, i) => (
            <button
              key={i}
              type="button"
              className="flex size-[55px] items-center justify-center"
            >
              <img src={instagramIcon} alt="Instagram" className="size-[45px]" />
            </button>
          ))}
        </div>
        <p className="m-0 text-center text-[16px] font-medium text-gray-4">
          Copyright © 2025 멋쟁이사자처럼_성신여대 All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
