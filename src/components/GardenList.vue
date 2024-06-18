<template>
  <div>
    <div v-if="!detailsView">
      <v-row no-gutters justify="space-between" align="center">
        <v-checkbox @change="getGardens" v-model="showAll" label="Show disabled" />
      </v-row>
      <VBtn @click="logCount">TEst</VBtn>
      <v-data-table
        @click:row="showDetails"
        :headers="headers"
        :items="gardens"
        v-if="!detailsView"
        :search="search"
      >
        <!-- <template #[`item.name`]="{ item }">
          <router-link :to="{ name: 'UserDetails', params: { Id: item.id } }">{{
            item.name
          }}</router-link>
        </template> -->
        <template #[`item.isDisabled`]="{ item }">
          {{ item ? 'Enabled' : 'Disabled' }}
        </template>
      </v-data-table>
    </div>
    <!-- <user-details @user-updated="getUsers" v-else /> -->
    <!-- <create-edit-user ref="CreateEditUserRef" @user-updated="getUsers" /> -->
  </div>
</template>

<script>
import apiService from '@/services/apiService'
// import UserDetails from '@/components/details/UserDetails.vue'

export default {
  name: 'GardenList',
  // components: { UserDetails },
  data: () => ({
    gardens: [],
    showAll: false,
    loading: true,
    search: null,

    // headers: [
    //     {
    //       title: 'CPU Model',
    //       align: 'start',
    //       key: 'name',
    //     },
    //   ]
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
        title: 'Enabled',
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
    },
    logCount() {
      console.log(this.gardens[0].plants.length)
    }
  },
  created() {
    this.getGardens()
  }
}
</script>
