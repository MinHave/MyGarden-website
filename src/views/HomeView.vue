<script lang="ts" setup>
// import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

// Accessing state and getters
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <v-card v-if="!isAuthenticated" class="mx-auto" width="500"><login-dialog /></v-card>
  <v-card v-else class="mx-auto" width="500">
    <v-card-title>MyGarden</v-card-title>
    <v-card-text>
      <p>Welcome to the MyGarden Admin System.</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import LoginDialog from '@/components/LoginDialog.vue'

export default {
  name: 'HomeView',
  components: { LoginDialog }
}
</script>
