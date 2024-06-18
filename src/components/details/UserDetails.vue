<template>
  <div>
    <div v-if="user">
      <v-table class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ user.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Email:</td>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Name:</td>
            <td>{{ user.name }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Status:</td>
            <td>{{ user.isDiabled ? 'Disabled' : 'Enabled' }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-row dense no-gutters>
        <v-col class="justify-center" cols="12">
          <v-btn depressed class="mt-2 ml-auto mb-3 mb-md-0" @click="resetPassword">
            <v-icon left>mdi-lock-reset</v-icon>
            Reset Password
          </v-btn>
        </v-col>
        <v-col class="justify-center" cols="12">
          <v-btn depressed class="mt-2 ml-auto mb-3 mb-md-0" @click="resetPassword">
            <v-icon left>mdi-lock-reset</v-icon>
            Toggle Account
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService'

export default {
  name: 'UserDetails',
  data: () => ({
    loading: true,
    user: {}
  }),
  methods: {
    async getUser() {
      this.loading = true
      this.user = await apiService.getUserById(this.$route.params.Id)
      this.loading = false
    },
    async resetPassword() {
      var response = await apiService.adminSendResetPassword(this.user.email)
      if (response == true) {
        store.commit('alert', {
          show: true,
          color: 'orange',
          title: 'Administration',
          message: `A link has been sent to ${this.user.email}`
        })
      }
    }
  },
  created() {
    this.getUser()
  }
}
</script>
