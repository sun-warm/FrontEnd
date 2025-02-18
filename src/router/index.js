// filepath: /Users/sunwen/Projects/FrontEnd/frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import HomePage from '../views/Home.vue'
import GetReports from '../views/GetReports.vue'
import AppSettings from '../views/Settings.vue'

const routes = [
  //{ path: '/', name: 'Home', component: HomaPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/', name: 'Home', component: HomePage, meta:{requireAuth: true} },
  { path: '/get-reports', name: 'GetReports', component: GetReports, meta:{requireAuth: true} },
  { path: '/settings', name: 'Settings', component: AppSettings, meta:{requireAuth: true} },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = !!sessionStorage.getItem('user_name'); // 检查是否已登录
  if (requiresAuth && isAuthenticated === false) {
    console.log("isAuthenticated:", isAuthenticated)
    next('/login'); // 重定向到登录页面
  } else {
    next(); // 继续导航
  }
});

export default router
