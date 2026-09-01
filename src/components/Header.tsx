import { NavLink } from 'react-router-dom'
import './Header.css'

const navItems = [
  { to: '/session', label: 'Session' },
  { to: '/project', label: 'Project' },
  { to: '/people', label: 'People' },
  { to: '/recruiting', label: 'Recruiting' },
  { to: '/stamp', label: 'Stamp' },
]

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <NavLink
        to="/login"
        className={({ isActive }) =>
          isActive ? 'header-login active' : 'header-login'
        }
      >
        로그인
      </NavLink>
    </header>
  )
}

export default Header
