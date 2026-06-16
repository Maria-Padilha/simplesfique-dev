import {defineStore} from "pinia"
import api from "@/services/api";
import apiPhp from "@/services/apiPhp";
import {useApiStore} from "@/stores/APIs/api";

export const useProdutosStore = defineStore('produtos', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',

        produtos: [],
        produto: null,

        marcas: [],
        recordsMarcas: 0,

        medidas: [],
        recordsMedidas: 0,

        garantias: [],
        recordsGarantias: 0,
        tiposGarantias: [
            {title: 'Horas', value: 1},
            {title: 'Mes', value: 2},
            {title: 'Ano', value: 3},
            {title: 'KM', value: 4},
        ],
        tiposGarantiasObj: {
            1: 'Horas',
            2: 'Mes',
            3: 'Ano',
            4: 'KM'
        },

        embalagens: [],
        embalagem: null,

        fornecedores: [],

        similar: [],

        entradadfe: [],
        entradadfeItem: null,

        deventrada: [],

        localizacoes: [],

        API_MIDIAS: "http://192.168.10.79:3005",
        fotosBanco: [],

        cores: [],
        tamanhos: [
            {title: 'PP', value: 'PP'},
            {title: 'P', value: 'P'},
            {title: 'M', value: 'M'},
            {title: 'G', value: 'G'},
            {title: 'GG', value: 'GG'},
            {title: 'XG', value: 'XG'},
            {title: 'XGG', value: 'XGG'},
            {title: 'Único', value: 'Único'},
            {title: '36', value: '36'},
            {title: '38', value: '38'},
            {title: '40', value: '40'},
            {title: '42', value: '42'},
            {title: '44', value: '44'},
            {title: '46', value: '46'},
            {title: '48', value: '48'},
            {title: '50', value: '50'},
            {title: '52', value: '52'},
        ],

        grades: [],
        grade: null,

        tributos: [],
        tributo: null,
    }),

    actions: {

        /**
         * BUSCAR PRODUTOS
         * @return {Promise<void>}
         */

        async buscarProdutos() {
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/produtos');

                this.produtos = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR PRODUTO POR ID
         * @param {number} id - ID do produto a ser buscado.
         * @return {Promise<void>}
         */

        async buscarProdutoPorId(id) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/estoque/produtos/${id}`);

                this.produto = response.data?.data ?? response.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR PRODUTO
         * @param {object} produtoData - Dados do produto a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarProduto(produtoData) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/produtos', produtoData);
                await this.buscarProdutos();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR PRODUTO
         * @param {number} id - ID do produto a ser atualizado.
         * @param {object} produtoData - Dados do produto a serem atualizados.
         * @return {Promise<void>}
         */

        async atualizarProduto(id, produtoData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/produtos/${id}`, produtoData);
                await this.buscarProdutoPorId(id);
                await this.buscarProdutos();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR PRODUTO
         * @param {number} id - ID do produto a ser deletado.
         * @return {Promise<void>}
         */

        async deletarProduto(id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/produtos/${id}`);
                await this.buscarProdutos();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR MARCAS
         * @return {Promise<void>}
         */

        async buscarMarcas(find = "", limit = 100) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/estoque/marcas`, {
                    params: { find, limit }
                });

                this.marcas = response.data?.data ?? response.data ?? [];
                this.recordsMarcas = response.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR MARCA
         *
         */

        async cadastrarMarca(marcaData) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/marcas', marcaData);
                await this.buscarMarcas();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR MEDIDAS
         * @return {Promise<void>}
         */

        async buscarMedidas(find = "", limit = 100) {
            this.loading = true;

            try {
                const response = await api.get(`/medida?find=${find}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.medidas = response.data.data;
                this.recordsMedidas = response.data.records;
                this.errorMessage = '';

                console.log('medidas encontradas:', this.medidas);

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar medidas:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR MEDIDA
         *
         */

        async cadastrarMedida(payload) {
            this.loading = true;
            try {
                const apiStore = useApiStore();
                await apiStore.executarAcao('medida', 'post', payload);
                await this.buscarMedidas();
            } catch (error) {
                console.error('Erro ao cadastrar medida:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR GARANTIAS
         * @return {Promise<void>}
         */

        async buscarGarantias(find = "", limit = 100) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/estoque/garantias`, {
                    params: { find, limit }
                });

                this.garantias = response.data?.data ?? response.data ?? [];
                this.recordsGarantias = response.data?.total ?? 0;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR GARANTIAS
         *
         */

        async cadastrarGarantia(payload) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/garantias', payload);
                await this.buscarGarantias();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR EMBALAGENS
         * @ PARAM {string} ID - produto ID
         * @return {Promise<void>}
         */

        async buscarEmbalagens(produtoId) {
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/produto-embalagens', {
                    params: { id_produto: produtoId }
                });

                this.embalagens = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR EMBALAGEM
         * @param {object} embalagemData - Dados da embalagem a ser cadastrada.
         * @return {Promise<void>}
         */

        async cadastrarEmbalagem(embalagemData, produtoId) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/produto-embalagens', { ...embalagemData, id_produto: produtoId });
                await this.buscarEmbalagens(produtoId);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR EMBALAGEM
         * @param {number} id - ID do produto vinculado.
         * @param {number} id - ID da embalagem a ser atualizada.
         * @param {object} embalagemData - Dados da embalagem a serem atualizados.
         * @return {Promise<void>}
         */

        async atualizarEmbalagem(produtoId, id, embalagemData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/produto-embalagens/${id}`, { ...embalagemData, id_produto: produtoId });
                await this.buscarEmbalagens(produtoId);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR EMBALAGEM
         * @param {number} produtoId - ID do produto vinculado.
         * @param {number} id - ID da embalagem a ser deletada.
         * @return {Promise<void>}
         */

        async deletarEmbalagem(produtoId, id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/produto-embalagens/${id}`);
                await this.buscarEmbalagens(produtoId);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR FORNECEDORES
         * @param {string} id - id do produto.
         * @return {Promise<void>}
         */

        async buscarFornecedores(idProduto) {
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/produto-fornecedors', {
                    params: { id_produto: idProduto }
                });

                this.fornecedores = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR FORNECEDOR
         * @param {object} fornecedorData - Dados do fornecedor a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarFornecedor(fornecedorData, idProduto) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/produto-fornecedors', { ...fornecedorData, id_produto: idProduto });
                await this.buscarFornecedores(idProduto);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR FORNECEDOR
         * @param {number} idProduto - ID do produto vinculado.
         * @param {number} id - ID do fornecedor a ser deletado.
         * @return {Promise<void>}
         */

        async deletarFornecedor(idProduto, id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/produto-fornecedors/${id}`, { params: { id_produto: idProduto } });
                await this.buscarFornecedores(idProduto);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR FORNECEDOR
         * @param {number} idProduto - ID do produto vinculado.
         * @param {number} id - ID do fornecedor a ser atualizado.
         * @param {object} fornecedorData - Dados do fornecedor a serem atualizados.
         * @return {Promise<void>}
         */

        async atualizarFornecedor(idProduto, id, fornecedorData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/produto-fornecedors/${id}`, { ...fornecedorData, id_produto: idProduto });
                await this.buscarFornecedores(idProduto);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR PRODUTOS SIMILARES
         * @param {string} id - id do produto.
         * @return {Promise<void>}
         */

        async buscarProdutosSimilares(idProduto) {
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/produto-similars', {
                    params: { id_produto: idProduto }
                });

                this.similar = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR PRODUTO SIMILAR
         * @param {object} similarData - Dados do produto similar a ser cadastrado.
         * @return {Promise<void>}
         */

        async cadastrarProdutoSimilar(similarData, idProduto) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/produto-similars', { ...similarData, id_produto: idProduto });
                await this.buscarProdutosSimilares(idProduto);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR PRODUTO SIMILAR
         * @param {number} idProduto - ID do produto vinculado.
         * @param {number} id - ID do produto similar a ser deletado.
         * @return {Promise<void>}
         */

        async deletarProdutoSimilar(idProduto, id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/produto-similars/${id}`, { params: { id_produto: idProduto } });
                await this.buscarProdutosSimilares(idProduto);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR PRODUTO SIMILAR
         * @param {number} idProduto - ID do produto vinculado.
         * @param {number} id - ID do produto similar a ser atualizado.
         * @param {object} similarData - Dados do produto similar a serem atualizados.
         * @return {Promise<void>}
         */

        async atualizarProdutoSimilar(idProduto, id, similarData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/produto-similars/${id}`, { ...similarData, id_produto: idProduto });
                await this.buscarProdutosSimilares(idProduto);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR ENTRADAS DFE
         * @param {string} id - id da empresa.
         * @return {Promise<void>}
         */

        async buscarEntradasDfe(idEmpresa) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/entradas');

                this.entradadfe = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR ENTRADA DFE POR ID
         * @param {number} idEmpresa - ID da Empresa.
         * @param {number} id - ID da entrada dfe a ser buscada.
         * @return {Promise<void>}
         */

        async buscarEntradaDfePorId(idEmpresa, id) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/estoque/entradas/${id}`);
                this.entradadfeItem = response.data?.data ?? response.data;
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR ENTRADA DFE
         * @param {object} entradadfeData - Dados da entrada dfe a ser cadastrada.
         * @return {Promise<void>}
         */

        async cadastrarEntradaDfe(entradadfeData, idEmpresa) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/entradas', entradadfeData);
                await this.buscarEntradasDfe(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR ENTRADA DFE
         * @param {number} idEmpresa - ID da Empresa.
         * @param {number} id - ID da entrada dfe a ser deletada.
         * @return {Promise<void>}
         */
        async deletarEntradaDfe(idEmpresa, id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/entradas/${id}`);
                await this.buscarEntradasDfe(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR ENTRADA DFE
         * @param {number} idEmpresa - ID da Empresa.
         * @param {number} id - ID da entrada dfe a ser atualizada.
         * @param {object} entradadfeData - Dados da entrada dfe a serem atualizados.
         * @return {Promise<void>}
         */

        async atualizarEntradaDfe(idEmpresa, id, entradadfeData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/entradas/${id}`, entradadfeData);
                await this.buscarEntradaDfePorId(idEmpresa, id);
                await this.buscarEntradasDfe(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR DEVOLUÇÕES DE ENTRADA
         */

        async buscarDevolucoesEntrada(idEmpresa) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/devolucao-compras');
                this.deventrada = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR DEVOLUÇÃO DE ENTRADA
         */

        async cadastrarDevEntrada(data, idEmpresa) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/devolucao-compras', data);
                await this.buscarEntradasDfe(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * EDITAR DEVOLUÇÃO DE ENTRADA
         */

        async editarDevEntrada(idEmpresa, id, data) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/devolucao-compras/${id}`, data);
                await this.buscarDevolucoesEntrada(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },


        /**
         * BUSCAR LOCALIZAÇÕES
         * @return {Promise<void>}
         */

        async buscarLocalizacoes(idEmpresa) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/localizacoes');

                this.localizacoes = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR LOCALIZAÇÃO
         * @param {object} localizacaoData - Dados da localização a ser cadastrada.
         * @return {Promise<void>}
         */

        async cadastrarLocalizacao(localizacaoData, idEmpresa) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/localizacoes', localizacaoData);
                await this.buscarLocalizacoes(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR LOCALIZAÇÃO
         * @param {number} idEmpresa - ID da Empresa.
         * @param {number} id - ID da localização a ser deletada.
         * @return {Promise<void>}
         */

        async deletarLocalizacao(idEmpresa, id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/localizacoes/${id}`);
                await this.buscarLocalizacoes(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR LOCALIZAÇÃO
         * @param {number} idEmpresa - ID da Empresa.
         * @param {number} id - ID da localização a ser atualizada.
         * @param {object} localizacaoData - Dados da localização a serem atualizados.
         * @return {Promise<void>}
         */

        async atualizarLocalizacao(idEmpresa, id, localizacaoData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/localizacoes/${id}`, localizacaoData);
                await this.buscarLocalizacoes(idEmpresa);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR CORES
         * @return {Promise<void>}
         */

        async buscarCores() {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/estoque/cors`);

                this.cores = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR COR
         * @param {object} corData - Dados da cor a ser cadastrada.
         * @return {Promise<void>}
         */

        async cadastrarCor(corData) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/cors', corData);
                await this.buscarCores();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR COR
         * @param {number} id - ID da cor a ser atualizada.
         * @param {object} corData - Dados da cor a serem atualizados.
         * @return {Promise<void>}
         */

        async atualizarCor(id, corData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/cors/${id}`, corData);
                await this.buscarCores();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        /**
         * GRADE DE PRODUTOS
         */

        async cadastrarGradeProduto(gradeData, idEmp) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/grades', gradeData);
                await this.buscarGradeProduto(idEmp);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async deletarGradeProduto(idEmp, idProduto, idCor, idTam) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/grades/${idProduto}/${idCor}/${idTam}`);
                await this.buscarGradeProduto(idEmp);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async atualizarGradeProduto(idEmp, idProduto, idCor, idTam, gradeData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/grades/${idProduto}/${idCor}/${idTam}`, gradeData);
                await this.buscarGradeProduto(idEmp);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async buscarGradeProduto(idEmp) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/grades');

                this.grades = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                return [];
            } finally {
                this.loading = false;
            }
        },

        async buscarGradeProdutoPorId(idEmp, idProduto) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/estoque/grades/${idProduto}`);

                const gradeItem = response.data?.data ?? response.data;
                this.errorMessage = '';

                return gradeItem;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                return null;
            } finally {
                this.loading = false;
            }
        },

        /** ================= TRIBUTOS DE PRODUTOS ================= */

        async buscarTributos(idEmpresa) { // eslint-disable-line no-unused-vars
            this.loading = true;

            try {
                const response = await apiPhp.get('/estoque/produto-tributos');

                this.tributos = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async cadastrarTributo(tributoData, idEmpresa, id) {
            this.loading = true;
            try {
                await apiPhp.post('/estoque/produto-tributos', tributoData);
                await this.buscarTributoPorId(idEmpresa, id);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async atualizarTributo(idEmpresa, id, tributoData) {
            this.loading = true;
            try {
                await apiPhp.put(`/estoque/produto-tributos/${id}`, tributoData);
                await this.buscarTributoPorId(idEmpresa, id);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async deletarTributo(idEmpresa, id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/estoque/produto-tributos/${id}`);
                await this.buscarTributoPorId(idEmpresa, id);
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async buscarTributoPorId(idEmpresa, id) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/estoque/produto-tributos/${id}`);

                this.tributos = response.data?.data ?? response.data;
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async listFiles() {
            const response = await fetch(`${this.API_MIDIAS}/api/files/list`);
            return response.json();
        },

        getDownloadUrl(key) {
            return `${this.API_MIDIAS}/api/files/download/${encodeURIComponent(key)}`;
        },

        async deleteFile(key) {
            const response = await fetch(
                `${this.API_MIDIAS}/api/files/${encodeURIComponent(key)}`,
                { method: "DELETE" }
            );

            return response.json();
        },

        async uploadFile(idSaas, idUsuario, file) {
            const API_BASE_URL = this.API_MIDIAS;

            const formData = new FormData();

            formData.append("id_saas", idSaas);
            formData.append("id_usuario", idUsuario);
            formData.append("file", file);

            const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro no upload");
            }

            return response.json();
        },

        async salvarFotoBanco(dataFoto) {
            this.loading = true;
            const apiStore = useApiStore();
            try {
                await apiStore.executarAcao('profoto', 'post', dataFoto);
            } catch (error) {
                console.error('Erro ao cadastrar foto no banco de dados:', error);
            } finally {
                this.loading = false;
            }
        },

        async buscarFotosBanco(idProduto) {
            this.loading = true;

            try {
                const response = await api.get(`/profoto/${idProduto}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.fotosBanco = response.data;
                this.errorMessage = '';

                console.log('fotos do banco encontradas:', this.fotosBanco);

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar fotos do banco:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async deletarFotoBanco(idProduto, payload) {
            this.loading = true;

            try {
                await api.delete(`/profoto/${idProduto}`, {
                    data: payload,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });

                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao deletar fotos do banco:', error);
                return null;
            } finally {
                this.loading = false;
            }
        }
    }
})