// 在 src/router/index.js 文件中添加以下内容

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
import AccessControlRecords from '../views/AccessControlRecords.vue' // 新增

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
    // 新增门禁管理路由
    {
      path: '/access-control-records',
      name: 'AccessControlRecords',
      component: AccessControlRecords
    },
    // 门禁管理相关路由
    {
      path: '/access-control/dashboard',
      name: 'AccessControlDashboard',
      component: AccessControlRecords
    },
    {
      path: '/access-control/records',
      name: 'AccessControlRecords2',
      component: AccessControlRecords
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router