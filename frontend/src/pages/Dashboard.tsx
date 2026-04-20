import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { questApi, checkinApi } from '../services/api'

interface Quest {
  id: number
  title: string
  description: string
  category: string
  difficulty: number
}

interface Checkin {
  id: number
  quest_id: number
  content: string
  mood: string
  created_at: string
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [todayQuest, setTodayQuest] = useState<Quest | null>(null)
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [showCheckin, setShowCheckin] = useState(false)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('馃槉')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [questRes, checkinRes] = await Promise.all([
        questApi.today(),
        checkinApi.my(),
      ])
      setTodayQuest(questRes.data)
      setCheckins(checkinRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async () => {
    if (!todayQuest || !content.trim()) return
    try {
      await checkinApi.create(todayQuest.id, { content, mood })
      setShowCheckin(false)
      setContent('')
      loadData()
    } catch (e) {
      console.error(e)
    }
  }

  const moods = ['馃槉', '馃槃', '馃槍', '馃槫', '馃様', '馃帀']

  if (loading) return <div className="p-8 text-center">鍔犺浇涓?..</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">馃幉</span>
          <span className="font-bold">RandomQuest</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user?.username}</span>
          <span className="text-sm">馃敟 {user?.streak || 0} 澶╄繛缁?/span>
          <Link to="/achievements" className="text-purple-600 hover:underline">鎴愬氨</Link>
          <Link to="/square" className="text-purple-600 hover:underline">骞垮満</Link>
          <button onClick={logout} className="text-gray-500 hover:text-gray-700">閫€鍑?/button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">馃幆 浠婃棩鎸戞垬</h2>
          {todayQuest ? (
            <>
              <h3 className="text-xl font-bold text-purple-600 mb-2">{todayQuest.title}</h3>
              <p className="text-gray-600 mb-4">{todayQuest.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-sm">{todayQuest.category}</span>
                <span className="text-sm text-gray-500">闅惧害 {'猸?.repeat(todayQuest.difficulty)}</span>
              </div>
              {!showCheckin && (
                <button
                  onClick={() => setShowCheckin(true)}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  瀹屾垚鎸戞垬锛屽幓鎵撳崱
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500">鏆傛棤浠婃棩鎸戞垬</p>
          )}
        </div>

        {showCheckin && todayQuest && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">馃摑 鎵撳崱璁板綍</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="鍒嗕韩涓€涓嬩綘鐨勬寫鎴樼粡鍘?.."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              rows={4}
            />
            <div className="mb-4">
              <span className="text-sm text-gray-600 mr-2">蹇冩儏锛?/span>
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-2xl mr-2 ${mood === m ? 'ring-2 ring-purple-500 rounded' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCheckin}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                鎻愪氦鎵撳崱
              </button>
              <button
                onClick={() => setShowCheckin(false)}
                className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                鍙栨秷
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">馃摐 鎴戠殑鎵撳崱璁板綍</h2>
          {checkins.length > 0 ? (
            <div className="space-y-3">
              {checkins.map((c) => (
                <div key={c.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{c.mood}</span>
                    <span className="text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">杩樻病鏈夋墦鍗¤褰?/p>
          )}
        </div>
      </main>
    </div>
  )
}
