import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const questApi = {
  today: () => api.get('/quests/today'),
  all: () => api.get('/quests/'),
  byCategory: (cat: string) => api.get(`/quests/category/${cat}`),
}

export const checkinApi = {
  create: (questId: number, data: { content: string; mood: string }) =>
    api.post(`/checkins/?quest_id=${questId}`, data),
  my: () => api.get('/checkins/my'),
  feed: () => api.get('/checkins/feed'),
  like: (id: number) => api.post(`/checkins/${id}/like`),
}

export const achievementApi = {
  all: () => api.get('/achievements/'),
  my: () => api.get('/achievements/my'),
}

export const socialApi = {
  follow: (userId: number) => api.post(`/social/follow/${userId}`),
  unfollow: (userId: number) => api.delete(`/social/follow/${userId}`),
  following: () => api.get('/social/following'),
  followers: () => api.get('/social/followers'),
  leaderboard: () => api.get('/social/leaderboard'),
}

export default api
