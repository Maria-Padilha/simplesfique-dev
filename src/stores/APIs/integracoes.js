import { defineStore } from 'pinia'
import apiPhp from '@/services/apiPhp'
import { toast } from 'vue3-toastify'

export const useIntegracoesStore = defineStore('integracoes', {
    state: () => ({
        loading: false,

        apisExternas: [],
        integracoesLoja: [],
    }),

    actions: {
        /**
         * Listar todas as APIs externas cadastradas pela empresa
         */
        async listarApisExternas() {
            this.loading = true
            try {
                const response = await apiPhp.get('/integracoes/api-externa')
                this.apisExternas = response.data?.data ?? response.data ?? []
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao buscar APIs externas.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Cadastrar nova API externa
         * @param {Object} payload
         */
        async cadastrarApiExterna(payload) {
            this.loading = true
            try {
                const response = await apiPhp.post('/integracoes/api-externa', payload)
                toast.success('API externa cadastrada com sucesso!')
                await this.listarApisExternas()
                return response.data
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao cadastrar API externa.')
                return null
            } finally {
                this.loading = false
            }
        },

        /**
         * Atualizar API externa existente
         * @param {number} id
         * @param {Object} payload
         */
        async alterarApiExterna(id, payload) {
            this.loading = true
            try {
                const response = await apiPhp.put(`/integracoes/api-externa/${id}`, payload)
                toast.success('API externa atualizada com sucesso!')
                await this.listarApisExternas()
                return response.data
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao atualizar API externa.')
                return null
            } finally {
                this.loading = false
            }
        },

        /**
         * Excluir API externa
         * @param {number} id
         */
        async deletarApiExterna(id) {
            this.loading = true
            try {
                await apiPhp.delete(`/integracoes/api-externa/${id}`)
                toast.success('API externa excluída com sucesso!')
                await this.listarApisExternas()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao excluir API externa.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Ativar ou desativar uma API externa
         * @param {number} id
         * @param {boolean} ativo
         */
        async alterarStatusApiExterna(id, ativo) {
            this.loading = true
            try {
                await apiPhp.put(`/integracoes/api-externa/${id}`, { ativo })
                toast.success(`API externa ${ativo ? 'ativada' : 'desativada'} com sucesso!`)
                await this.listarApisExternas()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao alterar status da API externa.')
            } finally {
                this.loading = false
            }
        },

        // ─── Loja de Integrações ─────────────────────────────────────────────

        /**
         * Listar todas as integrações de plataforma configuradas pela empresa
         */
        async listarIntegracoesLoja() {
            this.loading = true
            try {
                const response = await apiPhp.get('/integracoes/loja')
                this.integracoesLoja = response.data?.data ?? response.data ?? []
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao buscar integrações.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Salvar (criar ou atualizar) configuração de uma plataforma
         * @param {Object} payload - { plataforma, nome, credenciais, ativo }
         */
        async salvarIntegracaoLoja(payload) {
            this.loading = true
            try {
                const existente = this.integracoesLoja.find(i => i.plataforma === payload.plataforma)
                if (existente) {
                    await apiPhp.put(`/integracoes/loja/${existente.id}`, payload)
                } else {
                    await apiPhp.post('/integracoes/loja', payload)
                }
                toast.success(`${payload.nome} configurada com sucesso!`)
                await this.listarIntegracoesLoja()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao salvar integração.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Remover integração de plataforma pelo ID da plataforma
         * @param {string} plataformaId - ex: 'asaas', 'stripe'
         */
        async deletarIntegracaoLoja(plataformaId) {
            this.loading = true
            try {
                const item = this.integracoesLoja.find(i => i.plataforma === plataformaId)
                if (!item) return
                await apiPhp.delete(`/integracoes/loja/${item.id}`)
                toast.success('Integração desconectada com sucesso!')
                await this.listarIntegracoesLoja()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao desconectar integração.')
            } finally {
                this.loading = false
            }
        },
    },
})
