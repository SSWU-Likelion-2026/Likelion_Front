import { useEffect, useState, useSyncExternalStore } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { getUser, subscribe } from '../lib/auth-storage'
import { logout } from '../api/signup/auth'
import navCloseIcon from '../img/nav-drawer-link-icon.svg'
import navLoginArrowIcon from '../img/nav-drawer-login-icon.svg'
// 모바일 드로어는 흰 배경이라, 어두운 배경(Footer)용 흰색 소셜 아이콘 대신
// 드로어 전용의 어두운 색(#6B69AF) 아이콘을 쓴다 — 안 그러면 흰 배경에 흰 아이콘이라 안 보인다.
import navInstagramIcon from '../img/nav-drawer-instagram-icon.svg'
import navLikelionIcon from '../img/nav-drawer-likelion-icon.svg'
import navYoutubeIcon from '../img/nav-drawer-youtube-icon.svg'

const navItems = [
  { to: '/session', label: 'Session' },
  { to: '/project', label: 'Project' },
  { to: '/people', label: 'People' },
  { to: '/recruiting', label: 'Recruit' },
  { to: '/stamp', label: 'Stamp' },
]

// 모바일 드로어(피그마 NAV/로그인전)는 데스크탑 GNB에 없는 "Home" 항목이 맨 위에 추가된다
const mobileNavItems = [{ to: '/', label: 'Home' }, ...navItems]

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/likelion_sswu/', icon: navInstagramIcon },
  { name: '멋쟁이사자처럼', href: 'https://likelion.university/', icon: navLikelionIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/channel/UCYaDkwVaOhuoe_LuFr3lWkA', icon: navYoutubeIcon },
] as const

const MOBILE_NAV_LINK_CLASS = 'flex h-[50px] w-full items-center no-underline text-[18px] font-medium whitespace-nowrap'

function Header() {
  const navigate = useNavigate()
  const user = useSyncExternalStore(subscribe, getUser, () => null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    void logout().finally(() => navigate('/'))
  }

  const closeMenu = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen((prev) => !prev)

  // 드로어가 떠 있는 동안 배경(body) 스크롤을 잠근다. 안 그러면 드로어 뒤로 배경이 스크롤되면서
  // iOS Safari의 하단 주소창 표시/숨김 판단 기준이 꼬여, 드로어를 닫은 뒤 메인 페이지에서
  // 주소창이 콘텐츠를 가리는 상태로 남는 문제가 있었다.
  useEffect(() => {
    if (!menuOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-9 bg-white lg:relative">
      {/* 데스크탑 */}
      <div className="hidden h-20 items-center justify-between px-[120px] lg:flex">
        <NavLink to="/" className="no-underline shrink-0">
          <Logo size={32} />
        </NavLink>

        <nav>
          <ul className="flex list-none gap-[25px] m-0 p-0">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex h-20 items-center justify-center px-[10px] no-underline font-medium text-[20px] whitespace-nowrap transition-colors ${
                      isActive ? 'text-primary-100' : 'text-gray-7 hover:text-black-1'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {user ? (
          <div className="flex items-center gap-6 shrink-0 text-black-1">
            <button
              type="button"
              onClick={handleLogout}
              className="font-medium text-[20px] cursor-pointer hover:text-primary-100"
            >
              로그아웃
            </button>
            <NavLink to="/mypage" className="no-underline font-medium text-[20px]">
              {user.name}님
            </NavLink>
          </div>
        ) : (
          <NavLink to="/login" className="shrink-0 no-underline font-medium text-[20px] text-black-1">
            로그인
          </NavLink>
        )}
      </div>

      {/* 모바일: 피그마 모바일헤더 목업(로고 + 햄버거 메뉴) 기준 */}
      <div className="flex h-[50px] items-center justify-between px-6 py-[14px] lg:hidden">
        <NavLink to="/" className="no-underline shrink-0" onClick={closeMenu}>
          <Logo size={32} withText={false} />
        </NavLink>

        <button
          type="button"
          onClick={toggleMenu}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
          className="flex size-7 items-center justify-center border-0 bg-transparent p-0 text-black-1"
        >
          <svg viewBox="0 0 28 28" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M7 7l14 14M21 7L7 21" /> : <path d="M4 8h20M4 14h20M4 20h20" />}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴: 피그마 "NAV/로그인전" 목업(node 1183:16088) 기준 — 오른쪽에서 슬라이드되는 드로어 + 어두운 오버레이 */}
      {menuOpen && (
        // h-[100svh]: 모바일 브라우저의 접히는 하단 주소창 영역까지 fixed로 덮어버리지 않도록,
        // 항상 보장되는 "작은" 뷰포트 높이만 차지한다 (100vh/inset-0로 bottom을 잡으면 주소창 뒤까지
        // 하얀 드로어가 확장돼 주소창이 하얀 박스로 가려 보인다).
        <div className="fixed inset-x-0 top-0 z-50 h-[100svh] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={closeMenu}
            className="absolute inset-0 border-0 bg-[rgba(18,18,18,0.75)] p-0"
          />

          <div className="absolute right-0 top-0 flex h-full w-[279px] max-w-[80%] flex-col items-center overflow-y-auto bg-white pb-[118px] pt-[68px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col items-center gap-[51px]">
              <div className="flex w-[231px] items-center justify-between">
                <button onClick={() => { if (user) { closeMenu(); navigate('/mypage') } }}>
                  <p className="m-0 text-[20px] font-semibold text-black-1">
                    {user ? `${user.name}님` : '로그인이 필요합니다.'}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="메뉴 닫기"
                  className="flex size-7 shrink-0 items-center justify-center border-0 bg-transparent p-0"
                >
                  <img src={navCloseIcon} alt="" className="size-7" />
                </button>
              </div>

              <div className="flex w-full flex-col items-center gap-[21px]">
                <nav className="flex w-[231px] flex-col items-start">
                  {mobileNavItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `${MOBILE_NAV_LINK_CLASS} ${isActive ? 'text-black-1' : 'text-gray-7'}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="h-px w-[231px] bg-gray-9" />

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu()
                      handleLogout()
                    }}
                    className="mb-[110px] flex h-[50px] w-[231px] items-center gap-[5px] border-0 bg-transparent p-0 text-[18px] font-medium text-black-1"
                  >
                    로그아웃
                    <span className="flex size-7 shrink-0 items-center justify-center">
                      <img src={navLoginArrowIcon} alt="" />
                    </span>
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="mb-[110px] flex h-[50px] w-[231px] items-center gap-[5px] no-underline text-[18px] font-medium text-black-1"
                  >
                    로그인
                    <span className="flex size-7 shrink-0 items-center justify-center">
                      <img src={navLoginArrowIcon} alt="" />
                    </span>
                  </NavLink>
                )}
              </div>
            </div>

            <div className="flex w-[231px] flex-col items-start gap-[15px]">
              <div className="flex items-center gap-[15px]">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.name}
                    className="flex size-7 items-center justify-center"
                  >
                    <img src={link.icon} alt="" className="size-7" />
                  </a>
                ))}
              </div>
              <p className="m-0 text-[14px] font-normal text-gray-4">
                Copyright © 2026 멋쟁이사자처럼_
                <br />
                성신여대 All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
