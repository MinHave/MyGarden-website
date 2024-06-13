import axios from 'axios'

import { credentials, inOptions } from '@/types/apiService'
import { useAuthStore } from '@/store/modules/auth'
import { DateTime } from 'luxon'

const API_URL = import.meta.env.VITE_API_URL

const authStore = useAuthStore()

const service = {
  api: API_URL,
  timeoutTime: 20000,

  async getOptions(inOptions?: inOptions): Promise<any> {
    if (
      !inOptions?.noAuth &&
      authStore.user &&
      authStore.user.expires < DateTime.local().setZone('Europe/Copenhagen').toISO()
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

  async handleResponse(task: any): Promise<any> {},

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
  refreshAuth(refreshCode: string): Promise<ICurrentUser> {
    return this.postJsonString('auth/refresh', refreshCode, { noAuth: true })
  },
  changePassword(passwordChanges: string) {
    return this.post('auth/changePassword', passwordChanges)
  },
  resetPassword(username: string) {
    return this.postJsonString('auth/resetPassword', username, {
      noAuth: true
    })
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
  }

  //#endregion Endpoints
}
export default service
