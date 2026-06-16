import {defineStore} from "pinia"
import apiPhp from "@/services/apiPhp";
import {toast} from "vue3-toastify";

export const useEmpresaStore = defineStore('empresa', {
    state: () => ({
        loading: false,

        errorMessage: '',
        successMessage: '',

        empresas: [],
        empresa: null,
        empresaSelecionada: null
    }),

    actions: {
        async buscarTodasEmpresas() {
            this.loading = true;

            try {
                const response = await apiPhp.get('/manutencao/empresas');

                this.empresas = response.data?.data ?? response.data ?? [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao buscar empresas';
                toast.error(this.errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async cadastrarEmpresa(data) {
            this.loading = true;

            try {
                const response = await apiPhp.post('/manutencao/empresas', data);

                this.successMessage = 'Empresa cadastrada com sucesso!';
                this.errorMessage = '';
                toast.success(this.successMessage);

                return response.data;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar empresa';
                toast.error(this.errorMessage);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async alterarEmpresa(id, data) {
            this.loading = true;

            try {
                const response = await apiPhp.put(`/manutencao/empresas/${id}`, data);

                this.successMessage = 'Empresa atualizada com sucesso!';
                this.errorMessage = '';
                toast.success(this.successMessage);

                return response.data;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao alterar empresa';
                toast.error(this.errorMessage);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async deletarEmpresa(id) {
            this.loading = true;

            try {
                await apiPhp.delete(`/manutencao/empresas/${id}`);

                this.successMessage = 'Empresa excluída com sucesso!';
                this.errorMessage = '';
                toast.success(this.successMessage);

            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao excluir empresa';
                toast.error(this.errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async buscarEmpresaPorId(id) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/manutencao/empresas/${id}`);

                this.empresa = response.data?.data ?? response.data;
                this.errorMessage = '';

                return this.empresa;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao buscar empresa';
            } finally {
                this.loading = false;
            }
        },

        selecionarEmpresa(empresa) {
            if (!empresa || !empresa.id) {
                console.error('Tentativa de selecionar empresa sem id válido:', empresa);
                return;
            }
            this.empresaSelecionada = empresa;
            localStorage.setItem('empresaSelecionada', JSON.stringify(empresa));
            console.log('Empresa selecionada:', this.empresaSelecionada);
        },

        carregarEmpresaSelecionada() {
            const empresa = localStorage.getItem('empresaSelecionada');
            if (empresa) {
                this.empresaSelecionada = JSON.parse(empresa);
            }
        },

        async buscarAcessoUsuario(idEmpresa) {
            this.loading = true;

            try {
                const response = await apiPhp.get('/manutencao/grupo-usuario-programas', {
                    params: { id_empresa: idEmpresa }
                });

                this.errorMessage = '';
                return response.data?.data ?? response.data;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        }
    }
})
