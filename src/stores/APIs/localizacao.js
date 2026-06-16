import {defineStore} from "pinia"
import apiPhp from "@/services/apiPhp";
import {toast} from "vue3-toastify";

export const useLocalizacaoStore = defineStore('localizacao', {
    state: () => ({
        loading: false,
        errorMessage: '',
        successMessage: '',

        cep: [],
        cnpj: [],

        ufs: [],

        bairros: [],
        bairro: null,
        recordsBairros: 0,

        cidades: [],
        cidade: null,
        recordsCidades: 0,
    }),

    actions: {

        /**
         * BUSCAR CEP
         * @param {string} cep - CEP a ser buscado.
         * @return {Promise<void>}
         */

        async buscarCep(cep) {
            this.loading = true;

            try {
                const res = await apiPhp.get(`/manutencao/ceps/${cep}`);

                this.cep = res.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR CNPJ
         * @param {string} cnpj - CNPJ a ser buscado.
         * @return {Promise<void>}
         */

        async buscarCnpj(cnpj) {
            this.loading = true;

            try {
                const res = await apiPhp.get(`/manutencao/ws-cnpj/${cnpj}`);

                this.cnpj = res.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR BAIRROS
         * @param {string} find - Termo de busca.
         * @return {Promise<void>}
         */

        async buscarTodosBairros(find) {
            this.loading = true;

            try {
                const res = await apiPhp.get('/manutencao/bairros', { params: { find } });

                this.bairros = res.data?.data ?? res.data;
                this.recordsBairros = res.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR BAIRRO
         * @param {Object} bairroData - Dados do bairro a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarBairro(bairroData) {
            this.loading = true;

            try {
                await apiPhp.post('/manutencao/bairros', bairroData);
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },


        /**
         * BUSCAR CIDADES
         * @param {string} find - Termo de busca.
         * @return {Promise<void>}
         */

        async buscarTodasCidades(find) {
            this.loading = true;

            try {
                const res = await apiPhp.get('/manutencao/cidades', { params: { find } });

                this.cidades = res.data?.data ?? res.data;
                this.recordsCidades = res.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * VERIFICANDO EXISTENCIA CIDADE
         * @param nomeCidade
         * @param idCidade
         * @param bairro
         * @param idBairro
         * @returns {Promise<void>}
         */
        async verificandoExistenciaCidade(nomeCidade, idCidade, bairro) {
            await this.buscarTodasCidades(nomeCidade);

            if (!this.cidades || this.cidades.length === 0) {
                this.errorMessage = 'Cidade não encontrada!';
                toast.info('Verifique se essa cidade existe!');
                this.cidade = null;
                return;

            } else if (this.cidades.length > 1 && !this.cidade) {
                this.errorMessage = 'Mais de uma cidade encontrada!';
                toast.info('Mais de uma cidade encontrada! Selecione a correta.');
                this.cidade = null;
                return;

            } else {
                idCidade = this.cidades[0]?.ID;

                await this.buscarTodosBairros(bairro);

                if (!this.bairros || this.bairros.length === 0) {
                    await this.cadastrarBairro({ descbairro: bairro, id_cidade: idCidade });
                    this.errorMessage = '';
                }

                this.cidade = null;
                this.cidades = [];
                nomeCidade = '';
                bairro = '';
                idCidade = null;
            }
        },

        /**
         * BUSCAR TODAS AS UFs
         */

        async buscarTodasUfs() {
            this.loading = true;

            try {
                const res = await apiPhp.get('/manutencao/ufs');

                this.ufs = res.data?.data ?? res.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },
    }
})
