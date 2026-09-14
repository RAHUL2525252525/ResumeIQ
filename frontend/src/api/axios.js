import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resumeiq_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue = []

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('resumeiq_refresh')
      if (!refresh) {
        localStorage.removeItem('resumeiq_access')
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve) => queue.push(() => resolve(api(original))))
      }
      isRefreshing = true
      try {
        const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh })
        localStorage.setItem('resumeiq_access', data.access)
        queue.forEach((cb) => cb())
        queue = []
        return api(original)
      } catch (refreshError) {
        localStorage.removeItem('resumeiq_access')
        localStorage.removeItem('resumeiq_refresh')
        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default api
