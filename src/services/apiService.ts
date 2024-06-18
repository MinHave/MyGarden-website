import axios from 'axios'

import type { activationChanges, credentials, inOptions } from '@/types/apiService'
import { useAuthStore } from '@/stores/auth'
import { DateTime } from 'luxon'
import router from '@/router'

const API_URL = import.meta.env.VITE_API_URL

const service = {
  api: API_URL,
  timeoutTime: 20000,

  async getOptions(inOptions?: inOptions): Promise<any> {
    const authStore = useAuthStore()
    if (
      !inOptions?.noAuth &&
      authStore.user &&
      authStore.user.expires &&
      DateTime.fromISO(authStore.user.expires) < DateTime.local().setZone('Europe/Copenhagen')
    ) {
      console.log('token expired, refreshing')

      const user = await this.refreshAuth(authStore.user.refreshToken)

      authStore.updateUser(user)
    }

    const token = authStore.authToken

    if (!inOptions?.noAuth && token) {
      return {
        ...inOptions,
        headers: {
          Authorization: `Bearer ${token}`,
          ...inOptions?.headers
        }
      }
    } else {
      return inOptions
    }
  },

  async handleResponse(task: any): Promise<any> {
    try {
      const response = await task
      return response.data
    } catch (err) {
      this.handleResponseError(err)
    }
  },

  async handleResponseError(err: any) {
    const authStore = useAuthStore()

    if (err?.response?.status === 401) {
      authStore.LOGOUT()
      router.push('/')
    } else {
      let message, details
      if (err.response?.data.type) {
        if (err.response.data.type === 'https://tools.ietf.org/html/rfc7231#section-6.5.1') {
          details = ''
          for (const x in err.response.data.errors) {
            details += `${x}: ${err.response.data.errors[x]}\r\n`
          }
        }
        message = err.response.data.title
      } else {
        message = err.message
        details = err.response?.data
      }
      authStore.$patch({
        alert: {
          show: true,
          title: 'API error',
          color: '#AD2433',
          textColor: 'white',
          message,
          details
        }
      })
    }
  },

  async post(endpoint: string, payload: object | string, options?: inOptions) {
    return this.handleResponse(
      axios.post(`${this.api}/${endpoint}`, payload, await this.getOptions(options))
    )
  },
  postJsonString(endpoint: string, payload: object | string, options: inOptions) {
    return this.post(endpoint, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    })
  },
  async get(endpoint: string, payload?: object) {
    return this.handleResponse(axios.get(`${this.api}/${endpoint}`, await this.getOptions(payload)))
  },
  async put(endpoint: string, payload: object, options: inOptions) {
    return this.handleResponse(
      axios.put(`${this.api}/${endpoint}`, payload, await this.getOptions(options ?? options))
    )
  },
  async delete(endpoint: string, payload: object) {
    return this.handleResponse(
      axios.delete(`${this.api}/${endpoint}`, await this.getOptions(payload))
    )
  },

  //#region Endpoints

  //#region Auth
  login(credentials: credentials) {
    return this.post('auth/login', credentials, { noAuth: true })
  },
  refreshAuth(refreshCode: string): Promise<IUser> {
    return this.postJsonString('auth/refresh', refreshCode, { noAuth: true })
  },
  changePassword(passwordChanges: string) {
    return this.post('auth/changePassword', passwordChanges)
  },
  activateAccount(activationChanges: activationChanges) {
    return this.post('auth/activate', activationChanges)
  },
  resetPassword(username: string) {
    return this.postJsonString('auth/resetPassword', username, {
      noAuth: true
    })
  },
  resetPasswordToken(options: activationChanges) {
    return this.post('auth/resetPasswordToken', options, { noAuth: true })
  },

  //#endregion Auth

  getPlants(gardenId: string) {
    return this.get(`plant/gardenPlants/${gardenId}`)
  },
  getPlant(id: string) {
    return this.get(`plant/${id}`)
  },
  getGardenList() {
    return this.get(`garden`)
  },
  getUsers() {
    return this.get('user')
  },
  getUserById(userId: string) {
    return this.get(`user/${userId}`)
  }

  //#endregion Endpoints
}
export default service
