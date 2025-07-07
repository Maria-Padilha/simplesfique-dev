import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/HomeView.vue'
import NotFoundView from "@/views/pages/NotFoundView.vue";

const routes = [

  //   pagina não encontrada
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView
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
