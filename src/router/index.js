import { createRouter, createWebHistory } from 'vue-router'
import PublicRoutes from '@/modules/public/router';
import AuthRoutes from '@/modules/auth/router';
import AdminRoutes from '@/modules/admin/router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...PublicRoutes, ...AuthRoutes, ...AdminRoutes
  ],
})

export default router
