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
import RoomBooking from '../views/RoomBooking.vue'
import Login from '../views/Login.vue'  // 新增：导入登录页面

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页面路由 - 新增
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '用户登录',
        requiresAuth: false  // 登录页不需要认证
      }
    },
    // 根路径重定向到仪表板（需要登录后才能访问）
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        title: '综合管理平台',
        requiresAuth: true
      }
    },
    {
      path: '/user-management',
      name: 'UserManagement',
      component: UserManagement,
      meta: {
        title: '用户管理',
        requiresAuth: true
      }
    },
    {
      path: '/organization-management',
      name: 'OrganizationManagement',
      component: OrganizationManagement,
      meta: {
        title: '组织管理',
        requiresAuth: true
      }
    },
    {
      path: '/position-management',
      name: 'PositionManagement',
      component: PositionManagement,
      meta: {
        title: '职务管理',
        requiresAuth: true
      }
    },
    {
      path: '/level-management',
      name: 'LevelManagement',
      component: LevelManagement,
      meta: {
        title: '等级管理',
        requiresAuth: true
      }
    },
    {
      path: '/house-management',
      name: 'HouseManagement',
      component: HouseManagement,
      meta: {
        title: '房屋管理',
        requiresAuth: true
      }
    },
    {
      path: '/personal-center',
      name: 'PersonalCenter',
      component: PersonalCenter,
      meta: {
        title: '个人中心',
        requiresAuth: true
      }
    },
    {
      path: '/role-management',
      name: 'RoleManagement',
      component: RoleManagement,
      meta: {
        title: '角色管理',
        requiresAuth: true
      }
    },
    {
      path: '/admin-management',
      name: 'AdminManagement',
      component: AdminManagement,
      meta: {
        title: '管理员管理',
        requiresAuth: true
      }
    },
    {
      path: '/room-booking',
      name: 'RoomBooking',
      component: RoomBooking,
      meta: {
        title: '房屋借用管理',
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: '关于',
        requiresAuth: true
      }
    },



  ]
})

// 全局路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth !== false) {
    // 检查是否已登录（这里检查localStorage中的token）
    const token = localStorage.getItem('userToken')
    
    if (!token) {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 记录原本要访问的页面
      })
    } else {
      // 已登录，继续访问
      next()
    }
  } else {
    // 不需要登录的页面，直接访问
    next()
  }
})

// 全局后置守卫 - 可以用来做一些清理工作
router.afterEach((to, from) => {
  // 页面跳转完成后的逻辑
  console.log(`从 ${from.path} 跳转到 ${to.path}`)
})

export default router