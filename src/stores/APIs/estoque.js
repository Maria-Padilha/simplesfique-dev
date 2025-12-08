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

        classes: [],
        classe: null,
        recordsClasse: 0,

        ncms: [],
        ncm: null,
        recordsNcm: 0,

        cests: [],
        cest: null,

        nbs: [],
    }),

    actions: {

        /**
         * BUSCAR TODOS OS GRUPOS
         * @return {Promise<void>}
         */

        async buscarTodos(find, limit = 100) {
            this.loading = true;

            try {
                const response = await api.get(`/grupo?find=${find}&limit=${limit}`, {
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

        /**
         * BUSCAR TODAS AS CLASSES
         * @return {Promise<void>}
         */

        async buscarTodasClasses(find, limit = 100) {
            this.loading = true;

            try {
                const response = await api.get(`/classe?find=${find}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.classes = response.data.data;
                this.recordsClasse = response.data.records;
                this.errorMessage = '';

                console.log('Classes encontradas:', this.classes);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar classes:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR CLASSE
         * @param {Object} classeData - Dados da classe a ser cadastrada.
         * @return {Promise<void>}
         */

        async cadastrarClasse(classeData) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`classe`, 'post', classeData);
                await this.buscarTodasClasses();
            } catch (error) {
                console.error('Erro ao cadastrar classe:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * EDITAR CLASSE
         * @param {number} id - ID da classe a ser editada.
         * @param {Object} classeData - Dados da classe a ser editada.
         * @return {Promise<void>}
         */

        async editarClasse(id, classeData) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`classe/${id}`, 'put', classeData);
                await this.buscarTodasClasses();
            } catch (error) {
                console.error('Erro ao editar classe:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR CLASSE
         * @param {number} id - ID da classe a ser deletada
         * @return {Promise<void>}
         */

        async deletarClasse(id) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`classe/${id}`, 'delete');
                await this.buscarTodasClasses();
            } catch (error) {
                console.error('Erro ao deletar classe:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR TODOS NCM
         * @param {string} find - Termo de busca para filtrar os NCMs.
         * @return {Promise<void>}
         */

        async buscarNcms(find, limit = 100) {
            this.loading = true;

            try {
                const response = await api.get(`/ncm?find=${find}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.ncms = response.data.data;
                this.recordsNcm = response.data.records;
                this.errorMessage = '';

                console.log('NCMs encontrados:', this.grupos);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar NCMs:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR TODOS CEST
         * @param {number} limit - Número máximo de CESTs a serem retornados.
         * @param {number} offset - Número de CESTs a serem ignorados antes de começar a retornar os resultados.
         * @return {Promise<void>}
         */

        async buscarCests(limit = 10, offset = 0) {
            this.loading = true;

            try {
                const response = await api.get(`/cest?limit=${limit}&offset=${offset}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.cests = response.data.data;
                this.errorMessage = '';

                console.log('CESTs encontrados:', this.cests);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar CESTs:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR CEST
         * @param {Object} ncmData - Dados do NCM a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarCest(cestData) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`cest`, 'post', cestData);
                await this.buscarCests();
            } catch (error) {
                console.error('Erro ao cadastrar CEST:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * EDITAR CEST
         * @param {number} id - ID do CEST a ser editado.
         * @param {number} idNcm - ID do NCM relacionado ao CEST a ser editado.
         * @param {string} uf - Unidade Federativa relacionada ao CEST a ser editado.
         * @param {Object} cestData - Dados do CEST a ser editado.
         * @return {Promise<void>}
         */

        async editarCest(id, idNcm, uf, cestData) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`cest/${id}/${idNcm}/${uf}`, 'put', cestData);
                await this.buscarCests();
            } catch (error) {
                console.error('Erro ao Atualizar CEST:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR CEST
         * @param {number} id - ID do CEST a ser deletado.
         * @param {number} idNcm - ID do NCM relacionado ao CEST a ser deletado.
         * @param {string} uf - Unidade Federativa relacionada ao CEST a ser deletado.
         * @return {Promise<void>}
         */

        async deletarCest(id, idNcm, uf) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`cest/${id}/${idNcm}/${uf}`, 'delete');
                await this.buscarCests();
            } catch (error) {
                console.error('Erro ao Deletar CEST:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR TODOS NBS
         * @return {Promise<void>}
         */

        async buscarNbs(limit = 10, offset = 0) {
            this.loading = true;

            try {
                const response = await api.get(`/nbs?limit=${limit}&offset=${offset}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.nbs = response.data.data;
                this.errorMessage = '';

                console.log('NBS encontrados:', this.nbs);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar NBS:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR NBS
         * @param {Object} nbsData - Dados do NBS a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarNbs(nbsData) {
            this.loading = true;
            try {
                await apiStore.executarAcao(`nbs`, 'post', nbsData);
                await this.buscarNbs();
            } catch (error) {
                console.error('Erro ao cadastrar NBS:', error);
            } finally {
                this.loading = false;
            }
        },
    }
})