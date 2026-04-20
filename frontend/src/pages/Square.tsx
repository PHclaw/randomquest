import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { checkinApi } from '../services/api'

interface FeedItem {
  id: number
  username: string
  content: string
  mood: string
  likes: number
  created_at: string
}

export default function Square() {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    try {
      const res = await checkinApi.feed()
      setFeed(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id: number) => {
    try {
      await checkinApi.like(id)
      setFeed(feed.map(f => f.id === id ? { ...f, likes: f.likes + 1 } : f))
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="p-8 text-center">鍔犺浇涓?..</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">馃幉</span>
          <span className="font-bold">RandomQuest</span>
        </Link>
        <Link to="/dashboard" className="text-purple-600 hover:underline">杩斿洖涓婚〉</Link>
      </nav>

      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">馃寙 鎸戞垬骞垮満</h1>
        
        {feed.length > 0 ? (
          <div className="space-y-4">
            {feed.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                      {item.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{item.username}</p>
                      <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-2xl">{item.mood}</span>
                </div>
                <p className="text-gray-700 mb-3">{item.content}</p>
                <button
                  onClick={() => handleLike(item.id)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                >
                  鉂わ笍 {item.likes}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">杩樻病鏈変汉鎵撳崱</p>
        )}
      </main>
    </div>
  )
}
