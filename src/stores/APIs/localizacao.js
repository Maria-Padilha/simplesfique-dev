import {defineStore} from "pinia"
import api from "@/services/api";
import {useApiStore} from "@/stores/APIs/api";
import {toast} from "vue3-toastify";

const apiStore = useApiStore();

export const useLocalizacaoStore = defineStore('localizacao', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',

        cep: [],
        cnpj: [],

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
                const response = await api.get(`/cep/${cep}`,);

                this.cep = response.data;
                this.errorMessage = '';

                console.log('CEP encontrado:', this.cep);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar CEP:', error);
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
                const response = await api.get(`/cnpj/${cnpj}`,);

                this.cnpj = response.data;
                this.errorMessage = '';

                console.log('CNPJ encontrado:', this.cnpj);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar CNPJ:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR BAIRROS
         *  @param {number} limit - Número máximo de bairros a serem retornados.
         *  @param {number} offset - Número de bairros a serem ignorados antes de começar a retornar os resultados.
         *  @param {boolean} ignorarPaginacao - Se verdadeiro, busca todos os bairros sem aplicar paginação.
         *  @return {Promise<void>}
         */

        async buscarTodosBairros(find, limit = 50, offset = 0, ignorarPaginacao = true) {
            this.loading = true;

            try {
                const url = ignorarPaginacao
                    ? `/bairro?find=${find}`
                    : `/bairro?find=${find}&limit=${limit}&offset=${offset}`;

                const response = await api.get(url);

                this.bairros = response.data.data;
                this.recordsBairros = response.data.records;
                this.errorMessage = '';

                console.log('bairros encontrados:', this.bairros);
                console.log('Total de registros:', this.recordsBairros);

                console.log(response.data);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar bairros:', error);
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
            this.loading = apiStore.loading;
            await apiStore.executarAcao('bairro', 'post', bairroData);
        },


        /**
         * BUSCAR CIDADES
         * @param {number} limit - Número máximo de cidades a serem retornadas.
         * @param {number} offset - Número de cidades a serem ignoradas antes de começar a retornar os resultados.
         * @param {boolean} ignorarPaginacao - Se verdadeiro, busca todas as cidades sem aplicar paginação.
         * @return {Promise<void>}
         */

        async buscarTodasCidades(find, limit = 50, offset = 0, ignorarPaginacao = true) {
            this.loading = true;

            try {
                const url = ignorarPaginacao
                    ? `/cidade?find=${find}`
                    : `/cidade?find=${find}&limit=${limit}&offset=${offset}`;

                const response = await api.get(url);

                this.cidades = response.data.data;
                this.recordsCidades = response.data.records;
                this.errorMessage = '';

                console.log('Cidades encontrada:', this.cidades);
                console.log('Total de registros:', this.recordsCidades);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar cidades:', error);
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
        async verificandoExistenciaCidade(nomeCidade, idCidade, bairro, idBairro) {
            await this.buscarTodasCidades(nomeCidade);

            if (!this.cidades || this.cidades.length === 0) {
                toast.info('Verifique se essa cidade existe!');
                this.cidade = null;
                return;

            } else if (this.cidades.length > 1 && !this.cidade) {
                toast.info('Mais de uma cidade encontrada! Selecione a correta.');
                this.cidade = null;
                return;

            } else {
                idCidade = this.cidades[0]?.ID;

                await this.buscarTodosBairros(bairro);
                console.log('Bairro encontrado: ', this.bairros);

                if (!this.bairros || this.bairros.length === 0) {
                    console.log('Bairro não cadastrado: ', {
                        bairro: bairro,
                        id_bairro: idBairro
                    });

                    await this.cadastrarBairro({data: [{descbairro: bairro, id_cidade: idCidade}]});
                }

                this.cidade = null;
                this.cidades = [];
                nomeCidade = '';
                bairro = '';
                idBairro = null;
                idCidade = null;
            }
        }
    }
})