import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/HomeView.vue'
import NotFoundView from "@/views/pages/NotFoundView.vue";
import LoginView from "@/views/auth/LoginView.vue";

const routes = [

  //   pagina não encontrada
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView
  },

  //   paginas de autenticação
  {
    path: '/',
    name: 'login',
    component: LoginView
  },

  //   paginas do sistema
  {
    path: '/paginas/home',
    name: 'home',
    component: HomeView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
