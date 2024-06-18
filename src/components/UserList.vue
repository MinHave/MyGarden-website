<template>
  <div>
    <div v-if="!detailsView">
      <v-row no-gutters justify="space-between" align="center">
        <v-checkbox @change="getUsers" v-model="showAll" label="Show disabled" />
      </v-row>
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
      </v-data-table>
    </div>
    <user-details v-else />
    <!-- <create-edit-user ref="CreateEditUserRef" @user-updated="getUsers" /> -->
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
        title: 'Enabled',
        key: 'disabled'
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
