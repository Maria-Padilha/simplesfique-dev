import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/HomeView.vue'
import NotFoundView from "@/views/NotFoundView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import PerfilView from "@/views/pages/PerfilView.vue";
import HomeSiteView from "@/views/site/HomeSiteView.vue";
import FuncionalidadesSiteView from "@/views/site/FuncionalidadesSiteView.vue";
import IntegracoesView from "@/views/site/IntegracoesSiteView.vue";
import PlanosSiteView from "@/views/site/PlanosSiteView.vue";
import PagarView from "@/views/pages/financeiro/PagarView.vue";
import ReceberView from "@/views/pages/financeiro/ReceberView.vue";
import ContaCorrenteView from "@/views/pages/banco/ContaCorrenteView.vue";
import CentroDeCustoView from "@/views/pages/financeiro/CentroDeCustoView.vue";
import PrevisaoDebitosView from "@/views/pages/financeiro/PrevisaoDebitosView.vue";
import PessoasView from '@/views/pages/PessoasView.vue';
import PlanoContaView from '@/views/pages/financeiro/PlanoContaView.vue';
import DebitoRealView from '@/views/pages/financeiro/DebitoRealView.vue';
import UsuariosView from '@/views/pages/UsuariosView.vue';
import OperacaoView from '@/views/pages/pdv/OperacaoView.vue';
import PdvCaixaView from '@/views/pages/pdv/CaixaView.vue';
import PdvView from '@/views/pages/pdv/PdvView.vue';
import PagamentoView from '@/views/pages/pdv/PagamentoView.vue';
import MovimentacaoView from '@/views/pages/banco/MovimentacaoView.vue';
import AdiantamentoClienteView from '@/views/pages/adiantamento/AdiantamentoClienteView.vue';
import AdiantamentoFornecedorView from '@/views/pages/adiantamento/AdiantamentoFornecedorView.vue';
import AutorizacaoPagtoView from '@/views/pages/financeiro/AutorizacaoPagtoView.vue';
import BaixaPagtoView from '@/views/pages/financeiro/BaixaPagtoView.vue';
import FinanceiroRelatorioView from '@/views/pages/relatorios/FinanceiroRelatorioView.vue';
import {useSiteStore} from "@/stores/site";
import {useApiStore} from "@/stores/APIs/api";
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
    {
        path: '/paginas/manutencao/usuarios',
        name: 'manutencao_usuarios',
        component: UsuariosView
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
        meta: {requiresToken: true}
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
    {
        path: '/paginas/financeiro/centrodecusto',
        name: 'financeiro_centrodecusto',
        redirect: '/paginas/financeiro/centrodecusto/cadastro'
    },
    {
        path: '/paginas/financeiro/centrodecusto/cadastro',
        name: 'financeiro_centrodecusto_cadastro',
        component: CentroDeCustoView
    },
    {
        path: '/paginas/financeiro/centrodecusto/previsao',
        name: 'financeiro_centrodecusto_previsao',
        component: PrevisaoDebitosView
    },
    {
        path: '/paginas/financeiro/centrodecusto/debitoreal',
        name: 'financeiro_debitoreal',
        component: DebitoRealView
    },
    {
        path: '/paginas/financeiro/caixa',
        name: 'financeiro_caixa',
        component: () => import('@/views/pages/financeiro/CaixaView.vue')
    },
    {
        path: '/paginas/financeiro/caixa/abertura',
        name: 'financeiro_caixa_abertura',
        component: () => import('@/views/pages/caixa/AberCaixaView.vue')
    },
    {
        path: '/paginas/financeiro/caixa/lancamento',
        name: 'financeiro_caixa_lancamento',
        component: () => import('@/views/pages/caixa/LancCaixaView.vue')
    },
    {
        path: '/paginas/financeiro/planoconta',
        name: 'financeiro_planoconta',
        component: PlanoContaView
    },
    {
        path: '/paginas/financeiro/autorizacao',
        name: 'financeiro_autorizacao',
        component: AutorizacaoPagtoView
    },
    {
        path: '/paginas/financeiro/baixa',
        name: 'financeiro_baixa',
        component: BaixaPagtoView
    },

    // Paginas de banco
    {
        path: '/paginas/banco/movimentacao',
        name: 'financeiro_banco_movimentacao',
        component: MovimentacaoView
    },

    // páginas do estoque (substituídas por placeholder até criar os arquivos reais)
    {
        path: '/paginas/estoque/grupo',
        name: 'grupo',
        component: () => import('@/views/pages/estoque/GruposView.vue')
    },
    {
        path: '/paginas/estoque/classe',
        name: 'classe',
        component: () => import('@/views/pages/estoque/ClassesView.vue')
    },
    {
        path: '/paginas/estoque/cest',
        name: 'cest',
        component: () => import('@/views/pages/estoque/CestView.vue')
    },
    // Paginas de adiantamento de cliente
    {
        path: '/paginas/adiantamento/cliente',
        name: 'adiantamento_cliente',
        component: AdiantamentoClienteView
    },
    // Paginas de adiantamento de fornecedor
    {
        path: '/paginas/adiantamento/fornecedor',
        name: 'adiantamento_fornecedor',
        component: AdiantamentoFornecedorView
    },

    // páginas de produtos

    {
        path: '/paginas/produtos',
        name: 'produtos',
        component: () => import('@/views/pages/produtos/ProdutosView.vue')
    },
    {
        path: '/paginas/produtos/:id',
        name: 'produtos-detalhes',
        component: () => import('@/views/pages/produtos/ProdutosDetalhesView.vue')
    },
    {
        path: '/paginas/entradadfe',
        name: 'entradadfe',
        component: () => import('@/views/pages/produtos/EntradaDfeView.vue')
    },
    {
        path: '/paginas/entradadfe/nova',
        name: 'entradadfe-nova',
        component: () => import('@/views/pages/produtos/EntradaDfeNovaView.vue')
    },

    // páginas do pdv
    {
        path: '/paginas/pdv',
        name: 'pdv',
        component: PdvView
    },
    {
        path: '/paginas/pdv/pagamento',
        name: 'pdv_pagamento',
        component: PagamentoView
    },
    {
        path: '/paginas/pdv/operacao',
        name: 'pdv_operacao',
        component: OperacaoView
    },
    {
        path: '/paginas/pdv/caixa',
        name: 'pdv_caixa',
        component: PdvCaixaView
    },
    // páginas do pdv
    {
        path: '/paginas/contabil/notadeservico',
        name: 'notadeservico',
        component: () => import('@/views/pages/contabil/NotaDeServicoView.vue')
    },

    // Páginas de Relatórios
    {
        path: '/paginas/relatorios/financeiro',
        name: 'relatorio_financeiro',
        component: FinanceiroRelatorioView
    },
    {
        path: '/paginas/relatorios/contabil',
        name: 'relatorio_contabil',
        component: () => import('@/views/pages/contabil/NotaDeServicoView.vue')
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
    const apiStore = useApiStore();

    const manutencao = siteStore.manutencao;

    if (manutencao && to.name !== 'manutencao') {
        return next({ name: 'manutencao' });
    }

    if (!manutencao && to.name === 'manutencao') {
        return next({ name: 'home' });
    }

    if (to.name === 'empresa') {
        const token = to.query.token;
        if (!token) {
            router.push('/');
            return next({ name: 'nao-autorizado' });
        }

        try {
            const response = await api.get(`/empsaas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.data;

            if (!data) {
                router.push('/');
                return next({ name: 'erro401' });
            }

            apiStore.dataEmpresa = data;
            apiStore.tokenEmpresa = token;
            return next();
        } catch (error) {
            console.error('Erro ao validar token:', error);
            return next({ name: 'erro500' });
        }
    }

    next();
});

export default router
