<script setup lang="ts"></script>

<template>
  <VApp class="pa-0 ma-0">
    <v-card>
      <v-tabs bg-color="deep-purple-darken-4" fixed-tabs center-active>
        <v-tab>Gardens</v-tab>
        <v-tab>Plants</v-tab>
        <v-tab>Users</v-tab>
      </v-tabs>
    </v-card>
    <VMain class="pa-2">
      <RouterView />
    </VMain>
  </VApp>
</template>
