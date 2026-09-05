import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/signup/Login'
import Signup from './pages/signup/Signup'
import People from './pages/People'
import Project from './pages/project/Project'
import ProjectMaking from './pages/project/ProjectMaking'
import ProjectEdit from './pages/project/ProjectEdit'
import ProjectDetail from './pages/project/ProjectDetail'
import Recruiting from './pages/recruiting/Recruiting'
import Apply from './pages/recruiting/Apply'
import ApplyComplete from './pages/recruiting/ApplyComplete'
import Session from './pages/session/Session'
import SessionDetail from './pages/session/SessionDetail'
import MyPage from './pages/mypage/MyPage'
import Stamp from './pages/stamp/Stamp'
import StampDetail from './pages/stamp/StampDetail'

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/session/:week" element={<SessionDetail />} />
        <Route path="/project" element={<Project />} />
        <Route path="/projectmaking" element={<ProjectMaking />} />
         <Route path="/ProjectEdit/:projectId" element={<ProjectEdit />} />
        <Route path="/ProjectDetail/:projectId" element={<ProjectDetail />} />
        <Route path="/people" element={<People />} />
        <Route path="/recruiting" element={<Recruiting />} />
        <Route path="/recruiting/apply" element={<Apply />} />
        <Route path="/recruiting/complete" element={<ApplyComplete />} />
        <Route path="/stamp" element={<Stamp />} />
        <Route path="/stamp/:missionId" element={<StampDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
