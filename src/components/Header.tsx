import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/session', label: 'Session' },
  { to: '/project', label: 'Project' },
  { to: '/people', label: 'People' },
  { to: '/recruiting', label: 'Recruiting' },
  { to: '/stamp', label: 'Stamp' },
  { to: '/mypage', label: 'MyPage' },
]

function Header() {
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
    </header>
  )
}

export default Header
