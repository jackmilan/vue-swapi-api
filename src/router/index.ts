import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/:pathMatch(.*)*', redirect: '/' },
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
