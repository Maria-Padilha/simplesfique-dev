import {defineStore} from 'pinia';
import {ref} from 'vue';

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
                    text: 'Pagar',
                    icon: 'mdi-credit-card-outline',
                    route: '/paginas/financeiro/pagar'
                },
                {
                    text: 'Receber',
                    icon: 'mdi-cash-plus',
                    route: '/paginas/financeiro/receber'
                }
            ]
        },
        {
            id: 'manutencao',
            titulo: 'Manutenção',
            icon: 'mdi-currency-usd',
            submenus: [
                {
                    text: 'Pessoas',
                    icon: 'mdi-account-group',
                    route: '/paginas/manutencao/pessoas'
                },

            ]
        },
        {
            id: 'estoque',
            titulo: 'Estoque',
            icon: 'mdi-warehouse',
            submenus: [
                {
                    text: 'Produtos',
                    icon: 'mdi-package-variant-closed',
                    route: '/paginas/estoque/produtos'
                },
            ]
        }
        // Exemplo de como adicionar outro módulo no futuro:
        // {
        //   id: 'localizacao',
        //   titulo: 'Localização',
        //   icon: 'mdi-map-marker',
        //   submenus: [
        //     {
        //       text: 'País',
        //       icon: 'mdi-earth',
        //       route: '/paginas/localizacao/pais'
        //     },
        //     {
        //       text: 'Estado',
        //       icon: 'mdi-map-marker-outline',
        //       route: '/paginas/localizacao/estado'
        //     },
        //     {
        //       text: 'Cidade',
        //       icon: 'mdi-city-variant-outline',
        //       route: '/paginas/localizacao/cidade'
        //     }
        //   ]
        // }
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

