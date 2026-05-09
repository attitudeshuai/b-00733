import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'animals',
        name: 'Animal',
        component: () => import('../views/Animal.vue'),
        meta: { title: '动物列表' }
      },
      {
        path: 'categories',
        name: 'Category',
        component: () => import('../views/Category.vue'),
        meta: { title: '分类管理' }
      },
      {
        path: 'categories/:name',
        name: 'CategoryDetail',
        component: () => import('../views/CategoryDetail.vue'),
        meta: { title: '分类详情' }
      },
      {
        path: 'health',
        name: 'Health',
        component: () => import('../views/Health.vue'),
        meta: { title: '健康记录' }
      },
      {
        path: 'feeding',
        name: 'Feeding',
        component: () => import('../views/Feeding.vue'),
        meta: { title: '饲养记录' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('../views/UserManagement.vue'),
        meta: { title: '用户管理', requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // Update document title
  document.title = to.meta.title ? `${to.meta.title} - 动物管理系统` : '动物管理系统'
  
  if (to.name !== 'Login' && !userStore.isLoggedIn) {
    next({ name: 'Login' })
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ path: '/dashboard' })
  } else {
    next()
  }
})

export default router
