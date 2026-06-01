import { defineStore } from "pinia"
import api from "@/services/api";

const errorMessages = {
    "The name field is required.": "O campo nome é obrigatório!",
};

export const useGrupoUsuarioStore = defineStore('grupousuario', {
    state: () => ({
        loading: false,
        errorMessage: '',
        successMessage: '',

        gruposUsuario: [],
        grupoUsuario: null,

        records: 0,
    }),

    actions: {
        // Função auxiliar para obter headers com token
        getAuthHeaders() {
            const token = localStorage.getItem('token')
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        },

        async buscarTodosGruposUsuario() {
            this.loading = true;

            try {
                const response = await api.get(`/grupousuario`, {
                    headers: this.getAuthHeaders()
                });

                // Mapear os dados da API para o formato esperado
                this.gruposUsuario = (response.data?.data || []).map(item => ({
                    id: item.id,
                    nome: item.descgrupousuario,
                    descricao: item.descgrupousuario,
                    usuario: item.usuario,
                    data_criacao: item.dhinc,
                    dhinc: item.dhinc
                }));

                this.errorMessage = '';
                this.records = response.data?.records || 0;

                console.log('Grupos de usuário buscados com sucesso:', this.gruposUsuario);

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.log(this.errorMessage)
            } finally {
                this.loading = false;
            }
        },

        async buscarGrupoUsuarioId(id) {
            this.loading = true;

            try {
                const response = await api.get(`/grupousuario/${id}`, {
                    headers: this.getAuthHeaders()
                });

                this.grupoUsuario = response.data;
                this.errorMessage = '';

                this.records = response.data.records;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async cadastrarGrupoUsuario(id, nome, descricao) {
            this.loading = true;
            try {
                await api.post('/grupousuario',
                    { id, nome, descricao },
                    {
                        headers: this.getAuthHeaders()
                    })

                await this.buscarTodosGruposUsuario();
                this.errorMessage = '';
                this.successMessage = 'Grupo de usuário cadastrado com sucesso!';

            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    this.fieldErrors = {};

                    Object.keys(error.response.data.errors).forEach(field => {
                        this.fieldErrors[field] = error.response.data.errors[field].map(errorMsg => {
                            this.errorMessage = errorMessages[errorMsg] || errorMsg;
                            return errorMessages[errorMsg] || errorMsg;
                        });
                    });
                } else {
                    console.log(error)
                    this.errorMessage = 'Desculpe, ocorreu um erro ao cadastrar o Grupo de usuário. Entre em contato com nosso suporte.';
                }

            } finally {
                this.loading = false;
            }
        },

        async alterarGrupoUsuario(id, nome, descricao) {
            this.loading = true;
            try {
                await api.put(`/grupousuario/${id}`,
                    { id, nome, descricao },
                    {
                        headers: this.getAuthHeaders()
                    })

                await this.buscarTodosGruposUsuario();
                this.errorMessage = '';
                this.successMessage = 'Grupo de usuário atualizado com sucesso!';

            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    this.fieldErrors = {};

                    Object.keys(error.response.data.errors).forEach(field => {
                        this.fieldErrors[field] = error.response.data.errors[field].map(errorMsg => {
                            this.errorMessage = errorMessages[errorMsg] || errorMsg;
                            return errorMessages[errorMsg] || errorMsg;
                        });
                    });
                } else {
                    console.log(error)
                    this.errorMessage = 'Desculpe, ocorreu um erro ao atualizar o Grupo de usuário. Entre em contato com nosso suporte.';
                }

            } finally {
                this.loading = false;
            }
        },

        async deleteGrupoUsuario(id) {
            this.loading = true;
            try {
                await api.delete(`/grupousuario/${id}`, {
                    headers: this.getAuthHeaders()
                });

                await this.buscarTodosGruposUsuario();
                this.errorMessage = '';
                this.successMessage = 'Grupo de usuário deletado com sucesso!';
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.log(this.errorMessage)
            } finally {
                this.loading = false;
            }
        }
    }
})