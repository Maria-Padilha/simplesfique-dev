import {defineStore} from "pinia"
// import api from "@/services/api";
// import {toast} from "vue3-toastify";
import {useApiStore} from "@/stores/APIs/api";
import api from "@/services/api";

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
        async cadastrarEmpresa(empresaData, token) {
            this.loading = true;
            const apiStore = useApiStore();
            try {
                await apiStore.executarAcao('empresa', 'post', empresaData, null, token);
            } catch (error) {
                console.error('Erro ao cadastrar empresa:', error);
            }
            finally {
                this.loading = false;
            }
        },

        async buscarTodasEmpresas() {
            this.loading = true;

            try {
                const response = await api.get(`/empresa`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.empresas = response.data;
                this.errorMessage = '';
                console.log('Empresas encontradas: ', this.empresas);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar empresas:', error);
            } finally {
                this.loading = false;
            }
        },

        async buscarEmpresaId(id) {
            this.loading = true;

            try {
                const response = await api.get(`/empresa/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.empresa = response.data;
                this.errorMessage = '';
                console.log('Empresa encontrada: ', this.empresa);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar empresa pelo ID:', error);
            } finally {
                this.loading = false;
            }
        },

        selecionarEmpresa(empresa) {
            this.empresaSelecionada = empresa;
            localStorage.setItem('empresaSelecionada', JSON.stringify(empresa));
            console.log('Empresa selecionada:', this.empresaSelecionada);
        },

        carregarEmpresaSelecionada() {
            const empresa = localStorage.getItem('empresaSelecionada');
            if (empresa) {
                this.empresaSelecionada = JSON.parse(empresa);
            }
        }
    }
})