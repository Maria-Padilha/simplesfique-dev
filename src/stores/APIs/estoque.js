import {defineStore} from "pinia"
import api from "@/services/api";
import {useApiStore} from "@/stores/APIs/api";

const apiStore = useApiStore();

export const useEstoqueStore = defineStore('estoque', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',

        grupos: [],
        grupo: null,
        recordsGrupo: 0,
    }),

    actions: {

        /**
         * BUSCAR TODOS OS GRUPOS
         * @return {Promise<void>}
         */

        async buscarTodos() {
            this.loading = true;

            try {
                const response = await api.get(`/grupo`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.grupos = response.data.data;
                this.recordsGrupo = response.data.records;
                this.errorMessage = '';

                console.log('Grupos encontrado:', this.grupos);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar Grupos:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR GRUPO
         * @param {Object} grupoData - Dados do grupo a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarGrupo(grupoData) {
            this.loading = true;
            try {
                await apiStore.executarAcao('grupo', 'post', grupoData);
                await this.buscarTodos();
            } catch (error) {
                console.error('Erro ao cadastrar Grupo:', error);
            } finally {
                this.loading = false;
            }
        },
    }
})