import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSidebarStore = defineStore('sidebar', () => {

    /**
     * MODULOS - Define toda a estrutura de módulos/seções da sidebar
     *
     * Cada módulo contém:
     * - id: identificador único do módulo (usado como value no v-list-group)
     * - titulo: nome exibido na sidebar
     * - icon: ícone MDI exibido ao lado do título
     * - submenus: array com os links internos do módulo
     *   - cada submenu tem: text (nome), icon (ícone), route (caminho)
     */
    const modulos = ref([
        {
            id: 'financeiro',
            titulo: 'Financeiro',
            icon: 'mdi-currency-usd',
            submenus: [
                {
                    text: 'Conta Corrente',
                    icon: 'mdi-bank-outline',
                    route: '/paginas/financeiro/contacorrente'
                },
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
                        {
                            text: 'Cadastro de Caixa',
                            icon: 'mdi-cash-register',
                            route: '/paginas/financeiro/caixa'
                        },
                        {
                            text: 'Abertura de Caixa',
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
            id: 'contabil',
            titulo: 'Contabil',
            icon: 'mdi-cash-register',
            submenus: [
                {
                    text: 'Nota de Serviço',
                    icon: 'mdi-format-list-bulleted-type',
                    route: '/paginas/contabil/notadeservico'
                },
            ]


        },

        {
            id: 'manutencao',
            titulo: 'Manutenção',
            icon: 'mdi-tools',
            submenus: [
                {
                    text: 'Pessoas',
                    icon: 'mdi-account-group',
                    route: '/paginas/manutencao/pessoas'
                },
                {
                    text: 'Usuários',
                    icon: 'mdi-account-cog',
                    route: '/paginas/manutencao/usuarios'
                }
            ]
        },
        {
            id: 'estoque',
            titulo: 'Estoque',
            icon: 'mdi-package-variant',
            submenus: [
                {
                    text: 'Grupos',
                    icon: 'mdi-shape-plus',
                    route: '/paginas/estoque/grupo'
                },
                {
                    text: 'Classe',
                    icon: 'mdi-clipboard-text-outline',
                    route: '/paginas/estoque/classe'
                },
                {
                    text: 'CEST',
                    icon: 'mdi-file-table-box-outline',
                    route: '/paginas/estoque/cest'
                },
            ]
        },
        {
            id: 'produtos',
            titulo: 'Produtos',
            icon: 'mdi-tag-multiple',
            submenus: [
                {
                    text: 'Produtos',
                    icon: 'mdi-tag-outline',
                    route: '/paginas/produtos'
                },
                {
                    text: 'Entrada de DFe',
                    icon: 'mdi-file-document-outline',
                    route: '/paginas/entradadfe'
                },
            ]
        },
        {
            id: 'PDV',
            titulo: 'PDV',
            icon: 'mdi-package-variant',
            submenus: [
                {
                    text: 'Operação',
                    icon: 'mdi-shape-plus',
                    route: '/paginas/pdv/operacao'
                },
            ]
        }
    ]);

    /**
     * GETTERS - Funções para acessar os modulos
     */

    /**
     * Retorna todos os módulos
     */
    const getModulos = () => modulos.value;

    /**
     * Busca um módulo específico pelo ID
     * @param {string} id - ID do módulo (ex: 'financeiro')
     * @returns {object} O módulo encontrado ou undefined
     */
    const getModuloById = (id) => {
        return modulos.value.find(modulo => modulo.id === id);
    };

    /**
     * ACTIONS - Funções para modificar o estado
     */

    /**
     * Adiciona um novo módulo na sidebar
     * @param {object} novoModulo - Estrutura do módulo a adicionar
     *
     * Exemplo de uso:
     * adicionarModulo({
     *   id: 'vendas',
     *   titulo: 'Vendas',
     *   icon: 'mdi-cart',
     *   submenus: [...]
     * })
     */
    const adicionarModulo = (novoModulo) => {
        if (!novoModulo.id || !novoModulo.titulo || !Array.isArray(novoModulo.submenus)) {
            console.error('Módulo inválido. Verifique id, titulo e submenus.');
            return;
        }
        modulos.value.push(novoModulo);
    };

    /**
     * Remove um módulo da sidebar pelo ID
     * @param {string} id - ID do módulo a remover
     */
    const removerModulo = (id) => {
        const index = modulos.value.findIndex(m => m.id === id);
        if (index !== -1) {
            modulos.value.splice(index, 1);
        }
    };

    /**
     * Atualiza um submenu dentro de um módulo
     * @param {string} moduloId - ID do módulo
     * @param {array} novoSubmenus - Array com os novos submenus
     */
    const atualizarSubmenus = (moduloId, novoSubmenus) => {
        const modulo = getModuloById(moduloId);
        if (modulo) {
            modulo.submenus = novoSubmenus;
        }
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

