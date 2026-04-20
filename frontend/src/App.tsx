import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Square from './pages/Square'
import Achievements from './pages/Achievements'

function App() {
  const token = useAuthStore((s) => s.token)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/square" element={<Square />} />
        <Route path="/achievements" element={token ? <Achievements /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
