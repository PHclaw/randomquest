import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { achievementApi } from '../services/api'

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  tier: string
  earned_at?: string
}

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([])
  const [myAchievements, setMyAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        achievementApi.all(),
        achievementApi.my(),
      ])
      setAllAchievements(allRes.data)
      setMyAchievements(myRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const earnedIds = new Set(myAchievements.map((a) => a.id))

  const tierColors: Record<string, string> = {
    bronze: 'bg-orange-100 text-orange-600 border-orange-300',
    silver: 'bg-gray-100 text-gray-600 border-gray-300',
    gold: 'bg-yellow-100 text-yellow-600 border-yellow-300',
    diamond: 'bg-blue-100 text-blue-600 border-blue-300',
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
        <h1 className="text-2xl font-bold mb-6">馃弳 鎴愬氨寰界珷</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allAchievements.map((ach) => {
            const earned = earnedIds.has(ach.id)
            const myAch = myAchievements.find((a) => a.id === ach.id)
            
            return (
              <div
                key={ach.id}
                className={`rounded-xl border-2 p-4 ${
                  earned
                    ? tierColors[ach.tier] || 'bg-purple-100'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{earned ? ach.icon : '馃敀'}</div>
                <h3 className="font-bold mb-1">{ach.name}</h3>
                <p className="text-sm opacity-80">{ach.description}</p>
                {earned && myAch?.earned_at && (
                  <p className="text-xs mt-2 opacity-60">
                    鑾峰緱浜?{new Date(myAch.earned_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
