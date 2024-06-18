import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/users',
      name: 'UserList',
      component: () => import('@/components/UserList.vue'),
      children: [
        {
          path: ':Id',
          name: 'UserDetails',
          component: () => import('@/components/details/UserDetails.vue')
        }
      ]
    },
    {
      path: '/gardens',
      name: 'GardenList',
      component: () => import('@/components/GardenList.vue'),
      children: [
        {
          path: ':Id',
          name: 'GardenDetails',
          component: () => import('@/components/details/GardenDetails.vue')
        }
      ]
    },
    {
      path: '/resetpassword',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPassword.vue')
    },
    {
      path: '/activate',
      name: 'Activate',
      component: () => import('@/views/ActivateAccount.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  const success = await authStore.ENSURE_AUTH()

  // if not, redirect to login page.
  if (!success && to.name !== 'home' && to.name !== 'Activate' && to.name !== 'ResetPassword') {
    next({
      path: '/'
    })
  } else {
    next()
  }
})

export default router
