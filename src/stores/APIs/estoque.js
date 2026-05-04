import {defineStore} from "pinia"
import api from "@/services/api";
import {useApiStore} from "@/stores/APIs/api";
import {toast} from "vue3-toastify";

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

        aliquotas: [],

        nbs: [],

        formulas: [],
        formula: null,

        almoxarifados: [],
        almoxarifado: null,
        recordsAlmoxarifados: 0,

        cfops: [],
        cfop: null,
        recordsCfop: 0,
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
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
                const apiStore = useApiStore();
                await apiStore.executarAcao(`nbs`, 'post', nbsData);
                await this.buscarNbs();
            } catch (error) {
                console.error('Erro ao cadastrar NBS:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR TODOS OS ALMOXARIFADOS
         * @param {number} idemp - ID da empresa.
         * @param {string} find - Termo de busca para filtrar os almoxarifados.
         * @param {number} limit - Número máximo de almoxarifados a serem retornados.
         * @return {Promise<void>}
         */

        async buscarAlmoxarifados(idemp, find = "", limit = 100) {
            this.loading = true;

            try {
                const response = await api.get(`/almoxarifado/${idemp}?find=${find}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.almoxarifados = response.data.data;
                this.recordsAlmoxarifados = response.data.records;
                this.errorMessage = '';

                console.log('Almoxarifados encontrados:', this.almoxarifados);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar almoxarifados:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR ALMOXARIFADO POR ID
         * @param {number} idemp - ID da empresa.
         * @param {number} id - ID do almoxarifado a ser buscado.
         * @return {Promise<void>}
         */

        async buscarAlmoxarifadoPorId(idemp, id) {
            this.loading = true;

            try {
                const response = await api.get(`/almoxarifado/${idemp}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.almoxarifado = response.data;
                this.errorMessage = '';

                console.log('Almoxarifado encontrado:', this.almoxarifado);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar almoxarifado por ID:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR ALMOXARIFADO
         * @param {number} idemp - ID da empresa.
         * @param {Object} almoxarifadoData - Dados do almoxarifado a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarAlmoxarifado(idemp, almoxarifadoData) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao('almoxarifado', 'post', almoxarifadoData);
                await this.buscarAlmoxarifados(idemp);
            } catch (error) {
                console.error('Erro ao cadastrar almoxarifado:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * EDITAR ALMOXARIFADO
         * @param {number} idemp - ID da empresa.
         * @param {number} id - ID do almoxarifado a ser editado.
         * @param {Object} almoxarifadoData - Dados do almoxarifado a ser editado.
         * @return {Promise<void>}
         */

        async editarAlmoxarifado(idemp, id, almoxarifadoData) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao(`almoxarifado/${idemp}/${id}`, 'put', almoxarifadoData);
                await this.buscarAlmoxarifados(idemp);
            } catch (error) {
                console.error('Erro ao editar almoxarifado:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR ALMOXARIFADO
         * @param {number} idemp - ID da empresa.
         * @param {number} id - ID do almoxarifado a ser deletado.
         * @return {Promise<void>}
         */

        async deletarAlmoxarifado(idemp, id) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao(`almoxarifado/${idemp}/${id}`, 'delete');
                await this.buscarAlmoxarifados(idemp);
            } catch (error) {
                console.error('Erro ao deletar almoxarifado:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR TODOS OS CFOPS
         * @param {string} find - Termo de busca para filtrar os CFOPs.
         * @param {number} limit - Número máximo de CFOPs a serem retornados.
         * @return {Promise<void>}
         */

        async buscarCfops(find = "", limit = 10) {
            this.loading = true;

            try {
                const response = await api.get(`/cfop?find=${find}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.cfops = response.data.data;
                this.recordsCfop = response.data.records;
                this.errorMessage = '';

                console.log('CFOPs encontrados:', this.cfops);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar CFOPs:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR CFOP POR ID
         * @param {number} id - ID do CFOP a ser buscado.
         * @return {Promise<void>}
         */

        async buscarCfopPorId(id) {
            this.loading = true;

            try {
                const response = await api.get(`/cfop/${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.cfop = response.data;
                this.errorMessage = '';

                console.log('CFOP encontrado:', this.cfop);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar CFOP por ID:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR CFOP
         * @param {Object} cfopData - Dados do CFOP a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarCfop(cfopData) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao('cfop', 'post', cfopData);
                await this.buscarCfops();
            } catch (error) {
                console.error('Erro ao cadastrar CFOP:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * EDITAR CFOP
         * @param {number} id - ID do CFOP a ser editado.
         * @param {Object} cfopData - Dados do CFOP a ser editado.
         * @return {Promise<void>}
         */

        async editarCfop(id, cfopData) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao(`cfop/${id}`, 'put', cfopData);
                await this.buscarCfops();
            } catch (error) {
                console.error('Erro ao editar CFOP:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR CFOP
         * @param {number} id - ID do CFOP a ser deletado.
         * @return {Promise<void>}
         */

        async deletarCfop(id) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao(`cfop/${id}`, 'delete');
                await this.buscarCfops();
            } catch (error) {
                console.error('Erro ao deletar CFOP:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR ALÍQUOTAS
         */

        async buscarTodasAliquotas(emp, uf) {
            this.loading = true;

            try {
                const response = await api.get(`/aliquotauf/${emp}?find=${uf}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.aliquotas = response.data.data;
                this.errorMessage = '';

                console.log('Alíquotas encontradas:', this.aliquotas);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar alíquotas:', error);
            } finally {
                this.loading = false;
            }
        },

        async cadastrarAliquota(aliquotaData, emp, uf) {
            this.loading = true;
            try {
                const apiStoreInstance = useApiStore();
                await apiStoreInstance.executarAcao(`aliquotauf/${emp}`, 'post', aliquotaData);
                await this.buscarTodasAliquotas(emp, uf);
            } catch (error) {
                console.error('Erro ao cadastrar alíquota:', error);
            } finally {
                this.loading = false;
            }
        },

        async editarAliquota(aliquotaData, emp, cfop, uf) {
            this.loading = true;
            try {
                const apiStoreInstance = useApiStore();
                await apiStoreInstance.executarAcao(`aliquotauf/${emp}/${uf}/${cfop}`, 'put', aliquotaData);
                await this.buscarTodasAliquotas(emp, uf);
            } catch (error) {
                console.error('Erro ao editar alíquota:', error);
            } finally {
                this.loading = false;
            }
        },

        async deletarAliquota(emp, cfop, uf) {
            this.loading = true;
            try {
                const apiStoreInstance = useApiStore();
                await apiStoreInstance.executarAcao(`aliquotauf/${emp}/${uf}/${cfop}`, 'delete');
                await this.buscarTodasAliquotas(emp, uf);
            } catch (error) {
                console.error('Erro ao deletar alíquota:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * FORMULAS
         */

        async buscarTodasFormulas(emp) {
            this.loading = true;

            try {
                const response = await api.get(`/formula/${emp}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.formulas = response.data.data;
                this.errorMessage = '';

                console.log('Fórmulas encontradas:', this.formulas);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar fórmulas:', error);
            } finally {
                this.loading = false;
            }
        },

        async buscarFormulaId(emp, id) {
            this.loading = true;

            try {
                const response = await api.get(`/formula/${emp}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.formula = response.data;
                this.errorMessage = '';

                console.log('Formula por ID encontrada:', this.formulas);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar fórmula por id:', error);
            } finally {
                this.loading = false;
            }
        },

        async cadastrarFormula(formulaData, emp) {
            this.loading = true;
            try {
                const apiStoreInstance = useApiStore();
                await apiStoreInstance.executarAcao(`formula`, 'post', formulaData);
                await this.buscarTodasFormulas(emp);
            } catch (error) {
                console.error('Erro ao cadastrar fórmula:', error);
            } finally {
                this.loading = false;
            }
        },

        async editarFormula(formulaData, emp, id) {
            this.loading = true;
            try {
                const apiStoreInstance = useApiStore();
                await apiStoreInstance.executarAcao(`formula/${emp}/${id}`, 'put', formulaData);
                await this.buscarTodasFormulas(emp);
            } catch (error) {
                console.error('Erro ao editar fórmula:', error);
            } finally {
                this.loading = false;
            }
        },

        async compilarFormula(formulaData, emp) {
            this.loading = true;

            try {
                await api.post(`/formula/valida/${emp}`, formulaData, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.errorMessage = '';

                await this.buscarTodasFormulas(emp);

            } catch (error) {
                this.errorMessage = error.response.statusText || error.response.data;

                if (this.errorMessage === 'Not Acceptable') {
                    this.errorMessage = 'Fórmula não aceita. Verifique se todas as variaveis existem e se a sintaxe está correta.';
                }

                toast.error(this.errorMessage);

                console.error('Erro ao compilar fórmula:', this.errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async deletarFormula(emp, id) {
            this.loading = true;
            try {
                const apiStoreInstance = useApiStore();
                await apiStoreInstance.executarAcao(`formula/${emp}/${id}`, 'delete');
                await this.buscarTodasFormulas(emp);
            } catch (error) {
                console.error('Erro ao deletar fórmula:', error);
            } finally {
                this.loading = false;
            }
        },
    }
})