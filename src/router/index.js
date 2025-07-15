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

// 门禁管理相关页面
import AccessControlDashboard from '../views/AccessControlDashboard.vue'
import AccessControlRecords from '../views/AccessControlRecords.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    // 门禁管理路由
    {
      path: '/access-control',
      redirect: '/access-control/dashboard'
    },
    {
      path: '/access-control/dashboard',
      name: 'AccessControlDashboard',
      component: AccessControlDashboard
    },
    {
      path: '/access-control/records',
      name: 'AccessControlRecords',
      component: AccessControlRecords
    },
    // 后续可以添加更多门禁管理页面
    // {
    //   path: '/access-control/permissions',
    //   name: 'AccessControlPermissions',
    //   component: () => import('../views/AccessControlPermissions.vue')
    // },
    // {
    //   path: '/access-control/device-management',
    //   name: 'AccessControlDeviceManagement',
    //   component: () => import('../views/AccessControlDeviceManagement.vue')
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router