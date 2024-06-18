<template>
  <v-container fluid>
    <div class="text-center mt-md-8"></div>
    <div class="text-center">
      <div class="text-h6 text-md-h5 my-4">Welcome to MyGarden</div>
    </div>
    <v-card max-width="500" class="mx-auto mt-8">
      <v-window v-model="activated" vertical>
        <v-window-item :value="false">
          <v-form v-model="isValid" class="pa-4" @submit.prevent="activate">
            <v-col cols="12">
              <div class="mb-6">Enter your desired password to activate your MyGarden account:</div>
              <PasswordTextField
                v-model="password"
                label="Password"
                :rules="[rules.required, rules.length]"
              />
              <PasswordTextField
                v-model="password2"
                label="Password (again)"
                :rules="[rules.required, mustMatch]"
                @keypress.enter="activate"
              />
              <v-alert v-if="error" class="error white--text" icon="mdi-alert">
                Error activating account
              </v-alert>
              <v-btn
                class="mt-4"
                depressed
                @click="activate"
                :loading="isLoading"
                color="primary"
                block
                :disabled="!isValid"
              >
                Activate account
              </v-btn>
            </v-col>
          </v-form>
        </v-window-item>
        <v-window-item :value="true">
          <div class="pa-8">
            <div class="text-h5 mb-4">Account activated</div>
            <p>
              Your MyGarden account has been successfully activated and you have been logged in.
            </p>
            <v-btn class="mt-8" :to="{ name: 'UserList' }" block> Go to users </v-btn>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PasswordTextField from '@/components/PasswordTextField.vue'
import apiService from '@/services/apiService'

export default {
  name: 'ActivateAccount',
  components: { PasswordTextField },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const authStore = useAuthStore()

    const password = ref(null)
    const password2 = ref(null)
    const isValid = ref(false)
    const isLoading = ref(false)
    const error = ref(null)
    const activated = ref(false)

    const rules = {
      required: (value) => !!value || 'Value is required.',
      length: (value) => value?.length > 5 || 'Password must be at least 6 characters long.'
    }

    const mustMatch = (value) => value === password.value || 'Passwords are not identical'

    const activate = async () => {
      if (isValid.value) {
        isLoading.value = true

        let activationObject = {
          email: route.query.email,
          activationToken: route.query.token,
          password: password.value
        }

        try {
          await apiService.activateAccount(activationObject)

          await authStore.AUTHENTICATE({
            userName: route.query.email,
            password: password.value
          })

          password.value = null
          password2.value = null
          activated.value = true
        } catch (e) {
          error.value = e.message
        } finally {
          isLoading.value = false
        }
      }
    }

    return {
      password,
      password2,
      isValid,
      isLoading,
      error,
      activated,
      rules,
      mustMatch,
      activate
    }
  }
}
</script>

<style scoped></style>
