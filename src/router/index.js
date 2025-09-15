import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/HomeView.vue'
import NotFoundView from "@/views/pages/NotFoundView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import PerfilView from "@/views/pages/PerfilView.vue";
import HomeSiteView from "@/views/site/HomeSiteView.vue";
import FuncionalidadesSiteView from "@/views/site/FuncionalidadesSiteView.vue";
import IntegracoesView from "@/views/site/IntegracoesSiteView.vue";
import PlanosSiteView from "@/views/site/PlanosSiteView.vue";

const routes = [

  //   pagina não encontrada
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView
  },

  //   paginas de autenticação
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },

  //   paginas do sistema
  {
    path: '/paginas/perfil',
    name: 'perfil',
    component: PerfilView
  },
  {
    path: '/paginas/home',
    name: 'home',
    component: HomeView
  },

  //    Páginas do site
  {
    path: '/',
    name: 'site_home',
    component: HomeSiteView,
  },
  {
    path: '/funcionalidades',
    name: 'site_funcionalidades',
    component: FuncionalidadesSiteView
  },
  {
    path: '/integracoes',
    name: 'site_integracoes',
    component: IntegracoesView
  },
  {
    path: '/planos',
    name: 'site_planos',
    component: PlanosSiteView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
