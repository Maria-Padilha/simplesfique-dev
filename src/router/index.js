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
import api from "@/services/api";

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
        path: '/paginas/configuracoes',
        name: 'configuracoes',
        component: () => import('@/views/pages/ConfigView.vue')
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

  // // 🔹 Se vier com token na URL (ex: /empresa?token=abc123)
  // const tokenUrl = to.query.token;
  //
  // if (tokenUrl) {
  //   // Guarda o token localmente (ou sessionStorage se quiser expirar no reload)
  //   localStorage.setItem('empresa_token', tokenUrl);
  //
  //   // Limpa a URL (sem o ?token=)
  //   return next({
  //     path: to.path,
  //     query: {} // remove o token da barra de endereço
  //   });
  // }
  //
  // // 🔐 Protege a rota /empresa
  // if (to.name === 'empresa') {
  //   const token = localStorage.getItem('empresa_token');
  //
  //   if (!token) {
  //     return next({ name: 'erro401' });
  //   }
  //
  //   try {
  //     const response = await fetch(`https://api.seuservidor.com/validar-token`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //
  //     const data = await response.json();
  //
  //     if (!data.valido) {
  //       localStorage.removeItem('empresa_token');
  //       return next({ name: 'erro401' });
  //     }
  //
  //     // Token válido
  //     return next();
  //   } catch (error) {
  //     console.error('Erro ao validar token:', error);
  //     return next({ name: 'erro500' });
  //   }
  // }


  // 🔐 2. Proteção da rota "empresa"
  if (to.name === 'empresa') {
    const token = to.query.token;

    // Se não houver token, bloqueia o acesso
    if (!token) {
      router.push('/');
      return next({ name: 'nao-autorizado' });
    }

    try {
      // Exemplo de verificação via API
      const response = await api.get(`/empsaas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!data) {
        router.push('/');
        return next({ name: 'erro401' });
      }

      console.log('Token válido para empresa: ', data);

      // Caso o token seja válido, permite o acesso
      return next();
    } catch (error) {
      console.error('Erro ao validar token:', error);
      // router.push('/');
      return next({ name: 'erro500' });
    }
  }

  // ✅ Se não cair em nenhuma condição acima, segue normalmente
  next();
});

export default router
