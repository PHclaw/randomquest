import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.register({ email, username, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || '娉ㄥ唽澶辫触')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">馃幉</div>
          <h1 className="text-2xl font-bold">娉ㄥ唽</h1>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="閭"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            placeholder="鐢ㄦ埛鍚?
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="瀵嗙爜"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '娉ㄥ唽涓?..' : '娉ㄥ唽'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          宸叉湁璐﹀彿锛?<Link to="/login" className="text-purple-600 hover:underline">鐧诲綍</Link>
        </p>
      </div>
    </div>
  )
}
