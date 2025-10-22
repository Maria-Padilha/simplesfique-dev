import {defineStore} from "pinia"
import api from "@/services/api";

export const useLocalizacaoStore = defineStore('localizacao', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',

        cep: [],

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
         * BUSCAR BAIRROS
         *  @param {number} limit - Número máximo de bairros a serem retornados.
         *  @param {number} offset - Número de bairros a serem ignorados antes de começar a retornar os resultados.
         *  @param {boolean} ignorarPaginacao - Se verdadeiro, busca todos os bairros sem aplicar paginação.
         *  @return {Promise<void>}
         */

        async buscarTodosBairros(limit = 50, offset = 0, ignorarPaginacao = false) {
            this.loading = true;

            try {
                const url = ignorarPaginacao
                    ? '/bairro'
                    : `/bairro?limit=${limit}&offset=${offset}`;

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
         * BUSCAR CIDADES
         * @param {number} limit - Número máximo de cidades a serem retornadas.
         * @param {number} offset - Número de cidades a serem ignoradas antes de começar a retornar os resultados.
         * @param {boolean} ignorarPaginacao - Se verdadeiro, busca todas as cidades sem aplicar paginação.
         * @return {Promise<void>}
         */

        async buscarTodasCidades(limit = 50, offset = 0, ignorarPaginacao = false) {
            this.loading = true;

            try {
                const url = ignorarPaginacao
                    ? '/cidade'
                    : `/cidade?limit=${limit}&offset=${offset}`;

                const response = await api.get(url);

                this.cidades = response.data.data;
                this.recordsCidades = response.data.records;
                this.errorMessage = '';

                console.log('Cidades encontrada:', this.cidades);
                console.log('Total de registros:', this.recordsCidades);

                console.log(response.data);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar cidades:', error);
            } finally {
                this.loading = false;
            }
        },
    }
})