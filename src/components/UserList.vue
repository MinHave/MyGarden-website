<template>
  <div>
    <div v-if="!detailsView">
      <v-data-table
        @click:row="showDetails"
        :headers="headers"
        :items="users"
        v-if="!detailsView"
        :search="search"
      >
        <template #[`item.name`]="{ item }">
          <RouterLink :to="{ name: 'UserDetails', params: { Id: item.id } }">{{
            item.name
          }}</RouterLink>
        </template>
        <template #[`item.isDisabled`]="{ item }">
          {{ item.isDisabled ? 'Disabled' : 'Enabled' }}
        </template>
      </v-data-table>
    </div>
    <user-details v-else />
  </div>
</template>

<script>
import apiService from '@/services/apiService'
import UserDetails from '@/components/details/UserDetails.vue'
// import CreateEditUser from './Dialogs/CreateEditUser.vue'

export default {
  name: 'UserList',
  components: { UserDetails },
  data: () => ({
    users: [],
    showAll: false,
    loading: true,
    search: null,
    headers: [
      {
        title: 'Name',
        key: 'name'
      },
      {
        title: 'Email',
        key: 'email'
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
    async getUsers() {
      console.log('Get Users')
      this.loading = true

      this.users = await apiService.getUsers(this.showAll)

      this.loading = false
    },
    showDetails(user) {
      this.$router.push({ name: 'UserDetails', params: { Id: user.id } })
    },
    addUser() {
      // this.$refs.CreateEditUserRef.createUser()
    }
  },
  created() {
    this.getUsers()
  }
}
</script>
