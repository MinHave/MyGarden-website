<template>
  <v-form ref="loginForm" v-model="isValid" @submit="validate">
    <v-card>
      <v-card-title>Log in</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" md="6" class="px-2">
            <v-text-field v-model.trim="username" :rules="[rules.required]" label="Username" />
          </v-col>
          <v-col cols="12" md="6" class="px-2">
            <v-text-field
              v-model="password"
              label="Kodeord"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-alert type="error" v-if="errorMessage">
              {{ errorMessage }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-col>
          <v-btn
            block
            depressed
            :disabled="!isValid"
            color="success"
            class="mr-4 mb-4"
            type="submit"
            :loading="isLoading"
          >
            Log in
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/auth' // Ensure this path is correct

export default defineComponent({
  name: 'LoginDialog',
  setup() {
    const authStore = useAuthStore()
    const username = ref('')
    const password = ref('')
    const isValid = ref(false)
    const isLoading = ref(false)
    const showPassword = ref(false)
    const errorMessage = ref<string | null>(null)
    const rules = {
      required: (value: string) => !!value || 'Field cannot be empty.'
    }

    const validate = async (e: Event) => {
      e.preventDefault()
      const loginForm = e.currentTarget as HTMLFormElement

      if (loginForm.checkValidity()) {
        isLoading.value = true
        try {
          await authStore.AUTHENTICATE({ username: username.value, password: password.value })
          // Redirect or hide login dialog on success
        } catch (error) {
          errorMessage.value = 'Error - You could not be granted access to the system.'
          console.error('Login failed:', error)
        } finally {
          isLoading.value = false
        }
      }
    }

    return {
      username,
      password,
      isValid,
      isLoading,
      showPassword,
      errorMessage,
      rules,
      validate
    }
  }
})
</script>

<!-- <script>
// import { mapGetters } from 'vuex'
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()

export default {
  name: 'loginDialog',
  computed: {
    // ...mapGetters(['isAdmin', 'isManager'])
  },
  data: () => ({
    username: null,
    password: null,
    isValid: false,
    isLoading: false,
    showPassword: false,
    errorMessage: null,
    rules: {
      required: (value) => !!value || 'Field cannot be empty.'
    }
  }),
  methods: {
    async validate(e) {
      if (this.$refs.loginForm.validate()) {
        this.isLoading = true
        // apiService.login({ username: this.username, password: this.password })
        await authStore.AUTHENTICATE({ username: this.username, password: this.password })
        // this.$store
        //   .dispatch('AUTHENTICATE', {
        //     username: this.username,
        //     password: this.password
        //   })
        //   .then(() => {
        //     this.isLoading = false
        //     this.$emit('hide-login')
        //     if (this.isAdmin || this.isManager) {
        //       this.$router.push({ name: 'UserList' })
        //     } else {
        //       this.$router.push({ name: 'FrontPage' })
        //     }
        //   })
        //   .catch(() => {
        //     this.isLoading = false
        //     this.errorMessage = 'Error - You could not be granted access to the system.'
        //   })
      }

      // we need to do this in order to not actually submit the form (which will reload the site)
      e.preventDefault()
    },
    loginView() {
      this.forgotPasswordView = false
      this.password = ''
    }
  }
}
</script> -->
