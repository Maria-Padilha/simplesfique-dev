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
import ContaCorrenteView from "@/views/pages/ContaCorrenteView.vue";
import PessoasView from '@/views/pages/PessoasView.vue';
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
  {
    path: '/paginas/manutencao/pessoas',
    name: 'manutencao_pessoas',
    component: PessoasView
  },

  //   paginas de autenticação
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/empresa',
    name: 'empresa',
    component: () => import('@/views/auth/EmpresaView.vue'),
    meta: { requiresToken: true }
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
  {
    path: '/paginas/financeiro/contacorrente',
    name: 'financeiro_contacorrente',
    component: ContaCorrenteView
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

router.beforeEach(async (to, from, next) => {
  const siteStore = useSiteStore();
  const manutencao = siteStore.manutencao;

  // 🔧 1. Modo de manutenção
  if (manutencao && to.name !== 'manutencao') {
    return next({ name: 'manutencao' });
  }

  if (!manutencao && to.name === 'manutencao') {
    return next({ name: 'home' });
  }

  // 🔐 2. Proteção da rota "empresa"
  // if (to.name === 'empresa') {
  //   const token = to.query.token;
  //
  //   // Se não houver token, bloqueia o acesso
  //   if (!token) {
  //     router.push('/');
  //     return next({ name: 'erro401' }); // ou qualquer rota de erro/autenticação
  //   }
  //
  //   try {
  //     // Exemplo de verificação via API
  //     const response = await fetch(`https://api.seuservidor.com/validar-token?token=${token}`);
  //     const data = await response.json();
  //
  //     if (!data.valido) {
  //       router.push('/');
  //       return next({ name: 'erro401' });
  //     }
  //
  //     // Caso o token seja válido, permite o acesso
  //     return next();
  //   } catch (error) {
  //     console.error('Erro ao validar token:', error);
  //     // router.push('/');
  //     return next({ name: 'erro500' });
  //   }
  // }

  // ✅ Se não cair em nenhuma condição acima, segue normalmente
  next();
});

export default router
