<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <v-card max-width="500" class="mx-auto mt-8">
      <template #header>
        <v-card-title>Reset password</v-card-title>
      </template>
      <v-window v-model="passwordReset" vertical>
        <v-window-item :value="false">
          <v-form v-model="validPasswordReset" class="pa-4" @submit.prevent="resetPassword">
            <v-col cols="12">
              <div class="mb-6">Enter your email address and your new desired password</div>
              <v-text-field v-model="username" label="Email" />
              <PasswordTextField
                v-model="newPassword"
                label="Password"
                :rules="[rules.required, rules.length]"
              />
              <PasswordTextField
                v-model="newPassword2"
                label="Password (again)"
                :rules="[rules.required, mustMatch]"
                @keypress.enter="resetPassword"
              />
              <v-alert v-if="error" class="error white--text" icon="mdi-alert">
                Error resetting password
              </v-alert>
              <v-btn
                class="mt-4"
                depressed
                @click="resetPassword"
                :loading="isLoading"
                color="primary"
                block
                :disabled="!validPasswordReset"
              >
                Reset password
              </v-btn>
            </v-col>
          </v-form>
        </v-window-item>
        <v-window-item :value="true">
          <div class="pa-8">
            <div class="text-h5 mb-4">Password</div>
            <p>Your password was successfully reset and you have been logged in.</p>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import PasswordTextField from '@/components/PasswordTextField.vue'
import apiService from '@/services/apiService'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'

export default {
  name: 'ResetPassword',
  components: { PasswordTextField },

  setup() {
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const validPasswordReset = ref(true)
    const passwordReset = ref(false)
    const username = ref(null)
    const newPassword = ref(null)
    const newPassword2 = ref(null)
    const error = ref(null)

    // inside setup function
    const route = useRoute()

    const rules = {
      required: (value) => !!value || 'Value is required.',
      length: (value) => value?.length > 5 || 'Password must be at least 6 characters long.'
    }

    const mustMatch = (value) => value === newPassword.value || 'Passwords are not identical'

    const resetPassword = async () => {
      if (validPasswordReset.value) {
        isLoading.value = true

        try {
          console.log('object', {
            username: username.value,
            token: route.query.token,
            password: newPassword.value
          })
          let response = await apiService.resetPasswordToken({
            username: username.value,
            token: route.query.token,
            password: newPassword.value
          })
          console.log('response', response)

          await authStore.AUTHENTICATE({ userName: username.value, password: newPassword.value })
          newPassword.value = null
          newPassword2.value = null
          passwordReset.value = true
        } catch (e) {
          error.value = e.message
          console.log('error', e)
        } finally {
          isLoading.value = false
        }
      }
    }

    return {
      isLoading,
      validPasswordReset,
      passwordReset,
      username,
      newPassword,
      newPassword2,
      error,
      rules,
      mustMatch,
      resetPassword
    }
  }
}
</script>

<style></style>
