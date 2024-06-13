import { defineStore } from 'pinia'
import apiService from '@/services/apiService'

interface User {
  token: string
  refreshToken: string
  roles: string[]
  settings: Record<string, any>
  expires: string
  name?: string // Add other user properties as needed
}

interface AuthState {
  user: User | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null
  }),
  getters: {
    user: (state: AuthState) => state.user,
    authToken: (state: AuthState) => state.user?.token,
    isAuthenticated: (state: AuthState) => !!state.user,
    isAdmin: (state: AuthState) => state.user?.roles.includes('admin'),
    isManager: (state: AuthState) =>
      state.user?.roles.includes('manager') || state.user?.roles.includes('admin'),
    hasRole: (state: AuthState) => (role: string) => state.user?.roles.includes(role)
  },
  actions: {
    async AUTHENTICATE(credentials: { username: string; password: string }) {
      try {
        const user = await apiService.login(credentials)
        this.updateUser(user)
        localStorage.setItem('refreshToken', user.refreshToken)
        return user
      } catch (error) {
        console.error('Authentication failed:', error)
        throw error
      }
    },
    async AUTHENTICATE_REFRESH() {
      const cachedToken = localStorage.getItem('refreshToken')
      if (cachedToken) {
        try {
          const user = await apiService.refreshAuth(cachedToken)
          this.updateUser(user)
          localStorage.setItem('refreshToken', user.refreshToken)
          return true
        } catch (err: any) {
          if (err?.response?.status === 401) {
            console.log('Stored refresh token not accepted, clearing it')
            localStorage.removeItem('refreshToken')
          } else {
            console.log('Unable to utilize stored refresh token')
          }
          return false
        }
      }
      return false
    },
    async ENSURE_AUTH() {
      if (!this.isAuthenticated) {
        await this.AUTHENTICATE_REFRESH()
      }
      return this.isAuthenticated
    },
    LOGOUT() {
      localStorage.removeItem('refreshToken')
      this.updateUser(null)
    },
    updateUser(user: User | null) {
      this.user = user
    },
    updateUserSetting({ setting, value }: { setting: string; value: any }) {
      if (this.user) {
        this.user.settings[setting] = value
      }
    }
  }
})
