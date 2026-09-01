import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import People from './pages/People'
import Project from './pages/Project'
import Recruiting from './pages/Recruiting'
import Apply from './pages/recruiting/Apply'
import ApplyComplete from './pages/recruiting/ApplyComplete'
import Session from './pages/session/Session'
import SessionDetail from './pages/session/SessionDetail'
import Stamp from './pages/Stamp'

function App() {
  return (
    // 사이트 전체 넓이 1440px 고정 (그 이상 화면에선 가운데 정렬)
    <div className="mx-auto max-w-[1440px]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/session/:week" element={<SessionDetail />} />
        <Route path="/project" element={<Project />} />
        <Route path="/people" element={<People />} />
        <Route path="/recruiting" element={<Recruiting />} />
        <Route path="/recruiting/apply" element={<Apply />} />
        <Route path="/recruiting/complete" element={<ApplyComplete />} />
        <Route path="/stamp" element={<Stamp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
