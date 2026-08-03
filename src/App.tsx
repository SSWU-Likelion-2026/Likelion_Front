import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import People from './pages/People'
import Project from './pages/Project'
import Recruiting from './pages/Recruiting'
import Session from './pages/Session'
import Stamp from './pages/Stamp'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/project" element={<Project />} />
        <Route path="/people" element={<People />} />
        <Route path="/recruiting" element={<Recruiting />} />
        <Route path="/stamp" element={<Stamp />} />
      </Routes>
    </>
  )
}

export default App
