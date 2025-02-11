// filepath: /Users/sunwen/Projects/FrontEnd/frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import HomePage from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/home', name: 'Home', component: HomePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
