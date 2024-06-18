<template>
  <div>
    <div v-if="!detailsView">
      <v-data-table
        @click:row="showDetails"
        :headers="headers"
        :items="gardens"
        v-if="!detailsView"
        :search="search"
      >
        <template #[`item.gardenName`]="{ item }">
          <router-link :to="{ name: 'GardenDetails', params: { Id: item.id } }">
            {{ item.gardenName }}
          </router-link>
        </template>
        <template #[`item.isDisabled`]="{ item }">
          {{ item.isDisabled ? 'Disabled' : 'Enabled' }}
        </template>
      </v-data-table>
    </div>
    <garden-details v-else />
  </div>
</template>

<script>
import apiService from '@/services/apiService'
import GardenDetails from '@/components/details/GardenDetails.vue'

export default {
  name: 'GardenList',
  components: { GardenDetails },
  data: () => ({
    gardens: [],
    showAll: false,
    loading: true,
    search: null,

    headers: [
      {
        title: 'Garden Owner',
        key: 'gardenName'
      },
      {
        title: 'Plants',
        key: 'plants.length'
      },
      {
        title: 'Status',
        key: 'isDisabled'
      }
    ]
  }),
  computed: {
    detailsView() {
      return this.$route.params.Id
    }
  },

  methods: {
    async getGardens() {
      this.loading = true

      this.gardens = await apiService.getGardenList()

      this.loading = false
    },
    showDetails(user) {
      this.$router.push({ name: 'UserDetails', params: { Id: user.id } })
    }
  },
  created() {
    this.getGardens()
  }
}
</script>
