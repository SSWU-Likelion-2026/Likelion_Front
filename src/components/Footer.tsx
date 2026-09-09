import Logo from './Logo'
import instagramIcon from '../img/instagram-icon-outline.svg'
import likelionIcon from '../img/likelion-icon.svg'
import youtubeIcon from '../img/youtube-icon.svg'

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/likelion_sswu/', icon: instagramIcon },
  { name: '멋쟁이사자처럼', href: 'https://likelion.university/', icon: likelionIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/UCYaDkwVaOhuoe_LuFr3lWkA', icon: youtubeIcon },
] as const

function Footer() {
  return (
    <footer className="mt-[100px] flex w-full items-center justify-center bg-warm-black py-[80px]">
      <div className="flex w-[523px] flex-col items-center gap-[25px]">
        <Logo size={64} text="SSWU LIKELION UNIV" wordmarkFontSize={41} />
        <div className="flex items-center gap-[31px]">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.name}
              className="flex size-[55px] items-center justify-center"
            >
              <img src={link.icon} alt="" className="size-[45px]" />
            </a>
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
