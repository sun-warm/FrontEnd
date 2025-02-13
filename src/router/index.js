// filepath: /Users/sunwen/Projects/FrontEnd/frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import HomePage from '../views/Home.vue'
import GetReports from '../views/GetReports.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/home', name: 'Home', component: HomePage, meta:{requireAuth: true} },
  { path: '/get_reports', name: 'GetReports', component: GetReports, meta:{requireAuth: true} }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 检查特定的 Cookie 是否存在
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// 模拟一个简单的认证服务
const isAuthenticated = () => {
  // 检查名为 'session_id' 的 Cookie 是否存在
  return !!getCookie('session_id');
};

// 添加全局导航守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 这个路由需要登录
    if (!isAuthenticated()) {
      // 用户未登录，重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 登录后重定向回原页面
      });
    } else {
      // 用户已登录，允许访问
      next();
    }
  } else {
    // 这个路由不需要登录，允许访问
    next();
  }
});

export default router
