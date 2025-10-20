import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/HomeView.vue'
import NotFoundView from "@/views/NotFoundView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import PerfilView from "@/views/pages/PerfilView.vue";
import HomeSiteView from "@/views/site/HomeSiteView.vue";
import FuncionalidadesSiteView from "@/views/site/FuncionalidadesSiteView.vue";
import IntegracoesView from "@/views/site/IntegracoesSiteView.vue";
import PlanosSiteView from "@/views/site/PlanosSiteView.vue";
import PagarView from "@/views/financeiro/PagarView.vue";
import ReceberView from "@/views/financeiro/ReceberView.vue";
import {useSiteStore} from "@/stores/site";

const routes = [

  //   pagina não encontrada
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView
  },

  //   pagina de manutenção
  {
    path: '/manutencao',
    name: 'manutencao',
    component: () => import('@/views/ManutencaoView.vue')
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

  //    Páginas do módulo financeiro
  {
    path: '/paginas/financeiro/pagar',
    name: 'financeiro_pagar',
    component: PagarView
  },
  {
    path: '/paginas/financeiro/receber',
    name: 'financeiro_receber',
    component: ReceberView
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

// Middleware de navegação

router.beforeEach((to, from, next) => {
  const siteStore = useSiteStore();
  const manutencao = siteStore.manutencao;

  // Se o site está em manutenção e não estamos já na rota de manutenção
  if (manutencao && to.name !== 'manutencao') {
    return next({ name: 'manutencao' })
  }

  // Se o site não está mais em manutenção e o usuário está na página de manutenção
  if (!manutencao && to.name === 'manutencao') {
    return next({ name: 'home' })
  }

  next()
})

export default router
