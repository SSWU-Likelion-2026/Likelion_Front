import { useSyncExternalStore } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getUser, subscribe } from '../lib/auth-storage'
import { logout } from '../api/signup/auth'

const navItems = [
  { to: '/session', label: 'Session' },
  { to: '/project', label: 'Project' },
  { to: '/people', label: 'People' },
  { to: '/recruiting', label: 'Recruiting' },
  { to: '/stamp', label: 'Stamp' },
  { to: '/mypage', label: 'MyPage' },
]

function Header() {
  const navigate = useNavigate()
  const user = useSyncExternalStore(subscribe, getUser, () => null)

  const handleLogout = () => {
    void logout().finally(() => navigate('/'))
  }

  return (
    <header className="flex items-center px-6 py-4 border-b border-gray-9">
      <nav>
        <ul className="flex gap-6 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `no-underline font-medium ${isActive ? 'text-primary-100' : 'text-gray-1'}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {user ? (
        <div className="ml-auto flex items-center gap-3 text-gray-1">
          <button
            type="button"
            onClick={handleLogout}
            className="font-semibold cursor-pointer hover:text-primary-100"
          >
            로그아웃
          </button>
          <span className="font-semibold">{user.name}님</span>
        </div>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `ml-auto no-underline font-semibold ${
              isActive ? 'text-primary-100' : 'text-gray-1'
            }`
          }
        >
          로그인
        </NavLink>
      )}
    </header>
  )
}

export default Header
