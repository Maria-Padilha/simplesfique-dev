import {defineStore} from "pinia"
import api from "@/services/api";
import apiPhp from "@/services/apiPhp";
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
                const response = await apiPhp.get(`/estoque/grupos`, {
                    params: { find, limit }
                });

                this.grupos = response.data?.data ?? response.data ?? [];
                this.recordsGrupo = response.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.post('/estoque/grupos', grupoData);
                await this.buscarTodos();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.put(`/estoque/grupos/${id}`, grupoData);
                await this.buscarTodos();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.delete(`/estoque/grupos/${id}`);
                await this.buscarTodos();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                const response = await apiPhp.get(`/estoque/subgrupos`, {
                    params: { id_grupo: idgrupo }
                });

                this.subgrupos = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.post('/estoque/subgrupos', { ...subgrupoData, id_grupo: idgrupo });
                await this.buscarTodosSubgrupos(idgrupo);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.put(`/estoque/subgrupos/${idgrupo}/${id}`, subgrupoData);
                await this.buscarTodosSubgrupos(idgrupo);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.delete(`/estoque/subgrupos/${idgrupo}/${id}`);
                await this.buscarTodosSubgrupos(idgrupo);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                const response = await apiPhp.get(`/estoque/classes`, {
                    params: { find, limit }
                });

                this.classes = response.data?.data ?? response.data ?? [];
                this.recordsClasse = response.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.post('/estoque/classes', classeData);
                await this.buscarTodasClasses();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.put(`/estoque/classes/${id}`, classeData);
                await this.buscarTodasClasses();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.delete(`/estoque/classes/${id}`);
                await this.buscarTodasClasses();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                const res = await apiPhp.get(`/manutencao/ncms`, {
                    params: { find, per_page: limit }
                });

                this.ncms = res.data?.data ?? res.data;
                this.recordsNcm = res.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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

        async buscarCests(limit = 10) {
            this.loading = true;

            try {
                const res = await apiPhp.get(`/manutencao/cests`, {
                    params: { per_page: limit }
                });

                this.cests = res.data?.data ?? res.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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

        async buscarNbs(limit = 10) {
            this.loading = true;

            try {
                const res = await apiPhp.get(`/manutencao/nbs`, {
                    params: { per_page: limit }
                });

                this.nbs = res.data?.data ?? res.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                const response = await apiPhp.get(`/estoque/almoxarifados`, {
                    params: { find, limit }
                });

                this.almoxarifados = response.data?.data ?? response.data ?? [];
                this.recordsAlmoxarifados = response.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                const response = await apiPhp.get(`/estoque/almoxarifados/${id}`);

                this.almoxarifado = response.data?.data ?? response.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.post('/estoque/almoxarifados', almoxarifadoData);
                await this.buscarAlmoxarifados(idemp);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.put(`/estoque/almoxarifados/${id}`, almoxarifadoData);
                await this.buscarAlmoxarifados(idemp);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                await apiPhp.delete(`/estoque/almoxarifados/${id}`);
                await this.buscarAlmoxarifados(idemp);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                const res = await apiPhp.get(`/manutencao/cfops`, {
                    params: { find, per_page: limit }
                });

                this.cfops = res.data?.data ?? res.data;
                this.recordsCfop = res.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
                const res = await apiPhp.get(`/manutencao/cfops/${id}`);

                this.cfop = res.data?.data ?? res.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR CFOP
         * @param {Object} cfopData - Dados do CFOP a ser cadastrado.
         * @return {Promise<void>}
         */

        /**
         * CADASTRAR CFOP
         * @deprecated THorse offline - sem endpoint PHP de escrita
         * @param {Object} cfopData - Dados do CFOP a ser cadastrado.
         * @return {Promise<void>}
         */
        async cadastrarCfop(cfopData) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao('cfop', 'post', cfopData);
                await this.buscarCfops();
                toast.success('CFOP cadastrado com sucesso!');
            } catch (error) {
                const msg = error?.response?.data?.message
                    || error?.validationMessage
                    || 'Operação de CFOP temporariamente indisponível. Tente novamente mais tarde.';
                toast.error(msg);
                console.error('[CFOP] Erro ao cadastrar:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * EDITAR CFOP
         * @deprecated THorse offline - sem endpoint PHP de escrita
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
                toast.success('CFOP atualizado com sucesso!');
            } catch (error) {
                const msg = error?.response?.data?.message
                    || error?.validationMessage
                    || 'Operação de CFOP temporariamente indisponível. Tente novamente mais tarde.';
                toast.error(msg);
                console.error('[CFOP] Erro ao editar:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR CFOP
         * @deprecated THorse offline - sem endpoint PHP de escrita
         * @param {number} id - ID do CFOP a ser deletado.
         * @return {Promise<void>}
         */
        async deletarCfop(id) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao(`cfop/${id}`, 'delete');
                await this.buscarCfops();
                toast.success('CFOP excluído com sucesso!');
            } catch (error) {
                const msg = error?.response?.data?.message
                    || error?.validationMessage
                    || 'Operação de CFOP temporariamente indisponível. Tente novamente mais tarde.';
                toast.error(msg);
                console.error('[CFOP] Erro ao deletar:', error);
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
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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

        async buscarTodasFormulas(emp) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                const response = await apiPhp.get('/manutencao/formulas');

                this.formulas = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async buscarFormulaId(emp, id) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                const response = await apiPhp.get(`/manutencao/formulas/${id}`);

                this.formula = response.data?.data ?? response.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async cadastrarFormula(formulaData, emp) { // eslint-disable-line no-unused-vars
            this.loading = true;
            try {
                await apiPhp.post('/manutencao/formulas', formulaData);
                await this.buscarTodasFormulas();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async editarFormula(formulaData, emp, id) { // eslint-disable-line no-unused-vars
            this.loading = true;
            try {
                await apiPhp.put(`/manutencao/formulas/${id}`, formulaData);
                await this.buscarTodasFormulas();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async compilarFormula(formulaData, emp) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                await apiPhp.post('/manutencao/formulas/validar', formulaData);

                this.errorMessage = '';

                await this.buscarTodasFormulas();

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';

                if (this.errorMessage === 'Not Acceptable') {
                    this.errorMessage = 'Fórmula não aceita. Verifique se todas as variaveis existem e se a sintaxe está correta.';
                }

                toast.error(this.errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async deletarFormula(emp, id) { // eslint-disable-line no-unused-vars
            this.loading = true;
            try {
                await apiPhp.delete(`/manutencao/formulas/${id}`);
                await this.buscarTodasFormulas();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },
    }
})