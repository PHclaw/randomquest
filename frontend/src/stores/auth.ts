import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  username: string
  avatar: string
  streak: number
  total_checkins: number
}

interface AuthState {
  token: string | null
  user: User | null
  setToken: (t: string | null) => void
  setUser: (u: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (t) => set({ token: t }),
      setUser: (u) => set({ user: u }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'randomquest-auth' }
  )
)
