import { defineStore } from "pinia"
import apiPhp from "@/services/apiPhp";

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
        async buscarTodosGruposUsuario() {
            this.loading = true;

            try {
                const response = await apiPhp.get('/manutencao/grupo-usuarios');

                // Mapear os dados da API para o formato esperado
                const data = response.data?.data ?? response.data ?? [];
                this.gruposUsuario = data.map(item => ({
                    id: item.id,
                    nome: item.nome || item.descgrupousuario,
                    descricao: item.descricao || item.descgrupousuario,
                    usuario: item.usuario,
                    data_criacao: item.created_at || item.dhinc,
                    dhinc: item.dhinc || item.created_at
                }));

                this.errorMessage = '';
                this.records = response.data?.total || 0;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async buscarGrupoUsuarioId(id) {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/manutencao/grupo-usuarios/${id}`);

                this.grupoUsuario = response.data?.data ?? response.data;
                this.errorMessage = '';

                this.records = response.data?.total || 0;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async cadastrarGrupoUsuario(id, nome, descricao) {
            this.loading = true;
            try {
                await apiPhp.post('/manutencao/grupo-usuarios', { nome, descricao });

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
                    this.errorMessage = 'Desculpe, ocorreu um erro ao cadastrar o Grupo de usuário. Entre em contato com nosso suporte.';
                }

            } finally {
                this.loading = false;
            }
        },

        async alterarGrupoUsuario(id, nome, descricao) {
            this.loading = true;
            try {
                await apiPhp.put(`/manutencao/grupo-usuarios/${id}`, { nome, descricao });

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
                    this.errorMessage = 'Desculpe, ocorreu um erro ao atualizar o Grupo de usuário. Entre em contato com nosso suporte.';
                }

            } finally {
                this.loading = false;
            }
        },

        async deleteGrupoUsuario(id) {
            this.loading = true;
            try {
                await apiPhp.delete(`/manutencao/grupo-usuarios/${id}`);

                await this.buscarTodosGruposUsuario();
                this.errorMessage = '';
                this.successMessage = 'Grupo de usuário deletado com sucesso!';
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        }
    }
})
