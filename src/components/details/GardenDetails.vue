<template>
  <div>
    <div v-if="garden">
      <v-table class="my-4">
        <tbody>
          <tr>
            <td class="font-weight-bold">Id:</td>
            <td>{{ garden.id }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Name:</td>
            <td>{{ garden.gardenName }}</td>
          </tr>
          <tr>
            <td class="font-weight-bold">Status:</td>
            <td>{{ garden.isDisabled ? 'Disabled' : 'Enabled' }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-row dense no-gutters>
        <v-col class="justify-center" cols="12">
          <v-btn depressed class="mt-2 ml-auto mb-3 mb-md-0" @click="resetPassword">
            <v-icon left>mdi-lock-reset</v-icon>
            Toggle Garden Status
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService'

export default {
  name: 'GardenDetails',
  data: () => ({
    loading: true,
    garden: {}
  }),
  methods: {
    async getGarden() {
      this.loading = true
      this.garden = await apiService.getGardenById(this.$route.params.Id)
      this.loading = false
    }
  },
  created() {
    this.getGarden()
  }
}
</script>
