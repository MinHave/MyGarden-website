import { defineStore } from 'pinia'
import apiService from '@/services/apiService'

interface AuthState {
  user: IUser | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null
  }),
  getters: {
    authToken: (state: AuthState) => state.user?.token,
    isAuthenticated: (state: AuthState) => !!state.user
    // isAdmin: (state: AuthState) => state.user?.roles.includes('admin'),
  },
  actions: {
    async AUTHENTICATE(credentials: { username: string; password: string }) {
      try {
        const user = await apiService.adminLogin(credentials)
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
    updateUser(user: IUser | null) {
      this.user = user
    }
  }
})
