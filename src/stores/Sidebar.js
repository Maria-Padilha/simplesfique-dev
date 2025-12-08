// javascript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {
    const modulos = ref([
        {
            id: 'financeiro',
            titulo: 'Financeiro',
            icon: 'mdi-currency-usd',
            submenus: [
                { text: 'Conta Corrente', icon: 'mdi-bank-outline', route: '/paginas/financeiro/contacorrente' },
                { 
                    text: 'Centro de Custo', 
                    icon: 'mdi-warehouse', 
                    submenus: [
                        { text: 'Cadastro', icon: 'mdi-file-tree', route: '/paginas/financeiro/centrodecusto/cadastro' },
                        { text: 'Previsão de Débitos', icon: 'mdi-chart-timeline-variant', route: '/paginas/financeiro/centrodecusto/previsao' },
                        { text: 'Débito Real', icon: 'mdi-chart-bar', route: '/paginas/financeiro/centrodecusto/debitoreal' }
                    ]
                },
                {
            text: 'Caixa',
            icon: 'mdi-cash-register',
            submenus: [
                {   text: 'Cadastro de Caixa',
                    icon: 'mdi-cash-register',
                    route: '/paginas/financeiro/caixa'
                },
                {   text: 'Abertura de Caixa',
                    icon: 'mdi-cash-multiple',
                    route: '/paginas/financeiro/caixa/abertura'
                },
                {
                    text: 'Lançamento de Caixa',
                    icon: 'mdi-cash-plus',
                    route: '/paginas/financeiro/caixa/lancamento'
                }
                
            ]
        },
                { text: 'Pagar', icon: 'mdi-credit-card-outline', route: '/paginas/financeiro/pagar' },
                { text: 'Receber', icon: 'mdi-cash-plus', route: '/paginas/financeiro/receber' },
                { text: 'Plano de Conta', icon: 'mdi-format-list-bulleted-type', route: '/paginas/financeiro/planoconta' }
            ]
        },
        
        {
            id: 'manutencao',
            titulo: 'Manutenção',
            icon: 'mdi-tools',
            submenus: [
                { text: 'Pessoas', icon: 'mdi-account-group', route: '/paginas/manutencao/pessoas' },
                { text: 'Usuários', icon: 'mdi-account-cog', route: '/paginas/manutencao/usuarios' }
            ]
        },
        {
            id: 'estoque',
            titulo: 'Estoque',
            icon: 'mdi-package-variant',
            submenus: [
                { text: 'Grupos', icon: 'mdi-shape-plus', route: '/paginas/estoque/grupo' },
                { text: 'Classe', icon: 'mdi-clipboard-text-outline', route: '/paginas/estoque/classe' },
                { text: 'NCM', icon: 'mdi-barcode-scan', route: '/paginas/estoque/ncm' },
                { text: 'CEST', icon: 'mdi-file-table-box-outline', route: '/paginas/estoque/cest' }
            ]
        },
        {
            id: 'PDV',
            titulo: 'PDV',
            icon: 'mdi-package-variant',
            submenus: [
                { text: 'Operação', icon: 'mdi-shape-plus', route: '/paginas/pdv/operacao' }
            ]
        }
    ]);

    const getModulos = () => modulos.value;

    const getModuloById = (id) => modulos.value.find(modulo => modulo.id === id);

    const adicionarModulo = (novoModulo) => {
        if (!novoModulo || !novoModulo.id || !novoModulo.titulo || !Array.isArray(novoModulo.submenus)) {
            console.error('Módulo inválido. Verifique id, titulo e submenus.');
            return;
        }
        modulos.value.push(novoModulo);
    };

    const removerModulo = (id) => {
        const index = modulos.value.findIndex(m => m.id === id);
        if (index !== -1) modulos.value.splice(index, 1);
    };

    const atualizarSubmenus = (moduloId, novoSubmenus) => {
        const modulo = getModuloById(moduloId);
        if (modulo) modulo.submenus = novoSubmenus;
    };

    return {
        modulos,
        getModulos,
        getModuloById,
        adicionarModulo,
        removerModulo,
        atualizarSubmenus
    };
});
