import { useSyncExternalStore } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { getUser, subscribe } from '../lib/auth-storage'
import { logout } from '../api/signup/auth'

const navItems = [
  { to: '/session', label: 'Session' },
  { to: '/project', label: 'Project' },
  { to: '/people', label: 'People' },
  { to: '/recruiting', label: 'Recruit' },
  { to: '/stamp', label: 'Stamp' },
]

function Header() {
  const navigate = useNavigate()
  const user = useSyncExternalStore(subscribe, getUser, () => null)

  const handleLogout = () => {
    void logout().finally(() => navigate('/'))
  }

  return (
    <header className="flex h-20 items-center justify-between px-[120px] border-b border-gray-9">
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
    </header>
  )
}

export default Header
