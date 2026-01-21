import {defineStore} from "pinia"
import api from "@/services/api";
import {useApiStore} from "@/stores/APIs/api";

const apiStore = useApiStore();

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
            { title: 'Horas', value: 1 },
            { title: 'Mes', value: 2 },
            { title: 'Ano', value: 3 },
            { title: 'KM', value: 4 },
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

        localizacoes: [],
    }),

    actions: {

        /**
         * BUSCAR PRODUTOS
         * @return {Promise<void>}
         */

        async buscarProdutos() {
            this.loading = true;

            try {
                const response = await api.get(`/produto`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.produtos = response.data.data;
                this.errorMessage = '';

                console.log('Produtos encontrados:', this.produtos);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar produtos:', error);
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
                const response = await api.get(`/produto/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.produto = response.data;
                this.errorMessage = '';

                console.log('Produto encontrado:', this.produto);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar produto por ID:', error);
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
                await apiStore.executarAcao('produto', 'post', produtoData);
                await this.buscarProdutos();
            } catch (error) {
                console.error('Erro ao cadastrar produto:', error);
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
                await apiStore.executarAcao(`produto/${id}`, 'put', produtoData);
                await this.buscarProdutoPorId(id);
                await this.buscarProdutos();
            } catch (error) {
                console.error('Erro ao atualizar produto:', error);
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
                await apiStore.executarAcao(`produto/${id}`, 'delete');
                await this.buscarProdutoPorId(id);
                await this.buscarProdutos();
            } catch (error) {
                console.error('Erro ao deletar produto:', error);
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
                const response = await api.get(`/marca?find=${find}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.marcas = response.data.data;
                this.recordsMarcas = response.data.records;
                this.errorMessage = '';

                console.log('marcas encontradas:', this.marcas);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar marcas:', error);
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
                await apiStore.executarAcao('marca', 'post', marcaData);
                await this.buscarMarcas();
            } catch (error) {
                console.error('Erro ao cadastrar marca:', error);
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
                this.errorMessage = error.response;
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
                const response = await api.get(`/garantia?find=${find}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.garantias = response.data.data;
                this.recordsGarantias = response.data.records;
                this.errorMessage = '';

                console.log('garantias encontradas:', this.garantias);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar garantias:', error);
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
                await apiStore.executarAcao('garantia', 'post', payload);
                await this.buscarGarantias();
            } catch (error) {
                console.error('Erro ao cadastrar garantia:', error);
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
                const response = await api.get(`/proemb/${produtoId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.embalagens = response.data.data;
                this.errorMessage = '';

                console.log('embalagens encontradas:', this.embalagens);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar embalagens:', error);
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
                await apiStore.executarAcao('proemb', 'post', embalagemData);
                await this.buscarEmbalagens(produtoId);
            } catch (error) {
                console.error('Erro ao cadastrar embalagem:', error);
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
                await apiStore.executarAcao(`proemb/${produtoId}/${id}`, 'put', embalagemData);
                await this.buscarEmbalagens(produtoId);
            } catch (error) {
                console.error('Erro ao atualizar embalagem:', error);
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
                await apiStore.executarAcao(`proemb/${produtoId}/${id}`, 'delete');
                await this.buscarEmbalagens(produtoId);
            } catch (error) {
                console.error('Erro ao deletar embalagem:', error);
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
                const response = await api.get(`/profor/${idProduto}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.fornecedores = response.data.data;
                this.errorMessage = '';

                console.log('fornecedores encontrados:', this.fornecedores);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar fornecedores:', error);
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
                await apiStore.executarAcao('profor', 'post', fornecedorData);
                await this.buscarFornecedores(idProduto);
            } catch (error) {
                console.error('Erro ao cadastrar fornecedor:', error);
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
                await apiStore.executarAcao(`profor/${idProduto}/${id}`, 'delete');
                await this.buscarFornecedores(idProduto);
            } catch (error) {
                console.error('Erro ao deletar fornecedor:', error);
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
                await apiStore.executarAcao(`profor/${idProduto}/${id}`, 'put', fornecedorData);
                await this.buscarFornecedores(idProduto);
            } catch (error) {
                console.error('Erro ao atualizar fornecedor:', error);
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
                const response = await api.get(`/prosim/${idProduto}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.similar = response.data.data;
                this.errorMessage = '';

                console.log('produtos similares encontrados:', this.similar);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar produtos similares:', error);
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
                await apiStore.executarAcao('prosim', 'post', similarData);
                await this.buscarProdutosSimilares(idProduto);
            } catch (error) {
                console.error('Erro ao cadastrar produto similar:', error);
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
                await apiStore.executarAcao(`prosim/${idProduto}/${id}`, 'delete');
                await this.buscarProdutosSimilares(idProduto);
            } catch (error) {
                console.error('Erro ao deletar produto similar:', error);
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
                await apiStore.executarAcao(`prosim/${idProduto}/${id}`, 'put', similarData);
                await this.buscarProdutosSimilares(idProduto);
            } catch (error) {
                console.error('Erro ao atualizar produto similar:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR ENTRADAS DFE
         * @param {string} id - id da empresa.
         * @return {Promise<void>}
         */

        async buscarEntradasDfe(idEmpresa) {
            this.loading = true;

            try {
                const response = await api.get(`/entrada/${idEmpresa}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.entradadfe = response.data.data;
                this.errorMessage = '';

                console.log('entradas dfe encontradas: ', this.entradadfe);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar entradas dfe: ', error);
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
                const response = await api.get(`/entrada/${idEmpresa}/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                this.entradadfeItem = response.data;
                this.errorMessage = '';
                console.log('Entrada DFE encontrada:', this.entradadfeItem);
            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar entrada dfe por ID:', error);
            }
            finally {
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
                await apiStore.executarAcao('entrada', 'post', entradadfeData);
                await this.buscarEntradasDfe(idEmpresa);
            } catch (error) {
                console.error('Erro ao cadastrar entrada dfe:', error);
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
                await apiStore.executarAcao(`entrada/${idEmpresa}/${id}`, 'delete');
                await this.buscarEntradasDfe(idEmpresa);
            } catch (error) {
                console.error('Erro ao deletar entrada dfe:', error);
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
                await apiStore.executarAcao(`entrada/${idEmpresa}/${id}`, 'put', entradadfeData);
                await this.buscarEntradaDfePorId(idEmpresa, id);
                await this.buscarEntradasDfe(idEmpresa);
            } catch (error) {
                console.error('Erro ao atualizar entrada dfe:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR LOCALIZAÇÕES
         * @return {Promise<void>}
         */

        async buscarLocalizacoes(idEmpresa) {
            this.loading = true;

            try {
                const response = await api.get(`/localizacao/${idEmpresa}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.localizacoes = response.data.data;
                this.errorMessage = '';

                console.log('localizações encontradas:', this.localizacoes);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar localizações:', error);
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
                await apiStore.executarAcao('localizacao', 'post', localizacaoData);
                await this.buscarLocalizacoes(idEmpresa);
            } catch (error) {
                console.error('Erro ao cadastrar localização:', error);
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
                await apiStore.executarAcao(`localizacao/${idEmpresa}/${id}`, 'delete');
                await this.buscarLocalizacoes(idEmpresa);
            } catch (error) {
                console.error('Erro ao deletar localização:', error);
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
                await apiStore.executarAcao(`localizacao/${idEmpresa}/${id}`, 'put', localizacaoData);
                await this.buscarLocalizacoes(idEmpresa);
            } catch (error) {
                console.error('Erro ao atualizar localização:', error);
            } finally {
                this.loading = false;
            }
        }
    }
})