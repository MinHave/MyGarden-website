<script setup lang="ts"></script>

<template>
  <VApp class="pa-0 ma-0">
    <v-card>
      <v-tabs bg-color="deep-purple-darken-4" v-model="tab" fixed-tabs center-active>
        <v-tab :to="{ name: 'GardenList' }">Gardens</v-tab>
        <v-tab :to="{ name: 'UserList' }">Users</v-tab>
      </v-tabs>
    </v-card>
    <VMain class="pa-2">
      <RouterView />
    </VMain>
  </VApp>
</template>

<script>
export default {
  data: () => ({
    tab: null
  })
}
</script>
