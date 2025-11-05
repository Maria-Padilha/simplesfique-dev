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

        subgrupos: [],
        subgrupo: null,
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

        /**
         * EDITAR GRUPO
         * @param {number} id - ID do grupo a ser editado.
         * @param {Object} grupoData - Dados do grupo a ser editado.
         * @return {Promise<void>}
         */

        async editarGrupo(grupoData, id) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`grupo/${id}`, 'put', grupoData);
                await this.buscarTodos();
            } catch (error) {
                console.error('Erro ao Atualizar Grupo:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR GRUPO
         * @param {number} id - ID do grupo a ser deletado.
         * @return {Promise<void>}
         */

        async deletarGrupo(id) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`grupo/${id}`, 'delete');
                await this.buscarTodos();
            } catch (error) {
                console.error('Erro ao Deletar Grupo:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR TODOS OS SUBGRUPOS
         * @param {number} idgrupo - ID do grupo para buscar os subgrupos.
         * @return {Promise<void>}
         */

        async buscarTodosSubgrupos(idgrupo) {
            this.loading = true;

            try {
                const response = await api.get(`/subgrupo/${idgrupo}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.subgrupos = response.data.data;
                this.errorMessage = '';

                console.log('SubGrupos encontrado:', this.subgrupos);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar SubGrupos:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR SUBGRUPO
         * @param {Object} subgrupoData - Dados do subgrupo a ser cadastrado.
         */

        async cadastrarSubgrupo(subgrupoData, idgrupo) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`subgrupo/${idgrupo}`, 'post', subgrupoData);
                await this.buscarTodosSubgrupos(idgrupo);
            } catch (error) {
                console.error('Erro ao cadastrar SubGrupo:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * EDITAR SUBGRUPO
         * @param {number} id - ID do subgrupo a ser editado.
         * @param {Object} subgrupoData - Dados do subgrupo a ser editado.
         * @return {Promise<void>}
         */

        async editarSubgrupo(subgrupoData, idgrupo, id) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`subgrupo/${idgrupo}/${id}`, 'put', subgrupoData);
                await this.buscarTodosSubgrupos(idgrupo);
            } catch (error) {
                console.error('Erro ao Atualizar SubGrupo:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR SUBGRUPO
         * @param {number} id - ID do subgrupo a ser deletado.
         * @return {Promise<void>}
         */

        async deletarSubgrupo(idgrupo, id) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`subgrupo/${idgrupo}/${id}`, 'delete');
                await this.buscarTodosSubgrupos(idgrupo);
            } catch (error) {
                console.error('Erro ao Deletar SubGrupo:', error);
            } finally {
                this.loading = false;
            }
        },
    }
})