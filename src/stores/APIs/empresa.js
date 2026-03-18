import {defineStore} from "pinia"
import api from "@/services/api";
import {toast} from "vue3-toastify";

export const useEmpresaStore = defineStore('empresa', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),

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
                const response = await api.get(`/empresa`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });

                this.empresas = response.data?.data || response.data || [];
                this.errorMessage = '';

            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao buscar empresas';
                console.error('Erro ao buscar empresas:', error);
                toast.error(this.errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async cadastrarEmpresa(data) {
            this.loading = true;

            try {
                const response = await api.post('/empresa', { data: [data] }, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });

                this.successMessage = 'Empresa cadastrada com sucesso!';
                this.errorMessage = '';
                toast.success(this.successMessage);

                return response.data;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar empresa';
                console.error('Erro ao cadastrar empresa:', error);
                toast.error(this.errorMessage);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async alterarEmpresa(id, data) {
            this.loading = true;

            try {
                const response = await api.put(`/empresa/${id}`, { data: [data] }, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });

                this.successMessage = 'Empresa atualizada com sucesso!';
                this.errorMessage = '';
                toast.success(this.successMessage);

                return response.data;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao alterar empresa';
                console.error('Erro ao alterar empresa:', error);
                toast.error(this.errorMessage);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async deletarEmpresa(id) {
            this.loading = true;

            try {
                await api.delete(`/empresa/${id}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });

                this.successMessage = 'Empresa excluída com sucesso!';
                this.errorMessage = '';
                toast.success(this.successMessage);

            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao excluir empresa';
                console.error('Erro ao excluir empresa:', error);
                toast.error(this.errorMessage);
            } finally {
                this.loading = false;
            }
        },

        async buscarEmpresaPorId(id) {
            this.loading = true;

            try {
                const response = await api.get(`/empresa/${id}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });

                this.empresa = response.data?.data || response.data;
                this.errorMessage = '';

                return this.empresa;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao buscar empresa';
                console.error('Erro ao buscar empresa:', error);
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
                const response = await api.get(`/useraccess/${idEmpresa}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.errorMessage = '';
                console.log('Acesso do usuário carregado:', response.data);
                return response.data;

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar acesso do usuário:', error);
            } finally {
                this.loading = false;
            }
        }
    }
})