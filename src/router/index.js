import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import UserManagement from '../views/UserManagement.vue'
import OrganizationManagement from '../views/OrganizationManagement.vue'
import PositionManagement from '../views/PositionManagement.vue'
import LevelManagement from '../views/LevelManagement.vue'
import HouseManagement from '../views/HouseManagement.vue'
import PersonalCenter from '../views/PersonalCenter.vue'
import RoleManagement from '../views/RoleManagement.vue'
import AdminManagement from '../views/AdminManagement.vue'
import AddAdmin from '../views/AddAdmin.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    path: '/organization-management',
    name: 'OrganizationManagement',
    component: OrganizationManagement
  },
  {
    path: '/position-management',
    name: 'PositionManagement',
    component: PositionManagement
  },
  {
    path: '/level-management',
    name: 'LevelManagement',
    component: LevelManagement
  },
  {
    path: '/house-management',
    name: 'HouseManagement',
    component: HouseManagement
  },
  {
    path: '/personal-center',
    name: 'PersonalCenter',
    component: PersonalCenter
  },
  {
    path: '/role-management',
    name: 'RoleManagement',
    component: RoleManagement
  },
  {
    path: '/admin-management',
    name: 'AdminManagement',
    component: AdminManagement
  },
  {
    path: '/add-admin',
    name: 'AddAdmin',
    component: AddAdmin,
    meta: {
      title: '添加管理员'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router