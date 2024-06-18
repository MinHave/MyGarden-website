<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Accessing state and getters
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Local state
const tab = ref(null)

// Methods
const logout = async () => {
  await authStore.LOGOUT()
  router.push('/')
}
</script>

<template>
  <VApp class="pa-0 ma-0">
    <v-card>
      <v-tabs
        v-if="isAuthenticated"
        bg-color="deep-purple-darken-4"
        v-model="tab"
        fixed-tabs
        center-active
      >
        <v-tab :to="{ name: 'GardenList' }">Gardens</v-tab>
        <v-tab :to="{ name: 'UserList' }">Users</v-tab>
        <v-tab @click="logout">Logout</v-tab>
      </v-tabs>
    </v-card>
    <VMain class="pa-2">
      <RouterView />
    </VMain>
  </VApp>
</template>
