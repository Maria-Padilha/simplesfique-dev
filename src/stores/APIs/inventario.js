import { defineStore } from 'pinia'
import api from '@/services/api'
import { toast } from 'vue3-toastify'

export const useInventarioStore = defineStore('inventario', {
  state: () => ({
    inventarios: [],
    inventarioAtual: null,
    gridProdutos: [],
    loading: false,
    token: localStorage.getItem('token')
  }),

  actions: {
    /**
     * Lista todos os inventários de uma empresa
     * @param {number} idEmpresa - ID da empresa
     */
    async listarInventarios(idEmpresa) {
      if (!idEmpresa) {
        toast.error('ID da empresa não informado')
        return
      }

      this.loading = true
      try {
        const response = await api.get(`/inventario/${idEmpresa}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.inventarios = response.data.data || response.data || []
        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao listar inventários:', error)
        toast.error('Erro ao carregar inventários')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Busca um inventário específico
     * @param {number} idEmpresa - ID da empresa
     * @param {number} id - ID do inventário
     */
    async obterInventario(idEmpresa, id) {
      if (!idEmpresa || !id) {
        toast.error('Parâmetros inválidos')
        return
      }

      this.loading = true
      try {
        const response = await api.get(`/inventario/${idEmpresa}/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.inventarioAtual = response.data.data || response.data || null
        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao obter inventário:', error)
        toast.error('Erro ao carregar inventário')
        throw error
      } finally {
        this.loading = false
      }
    },

    async obterItensInventarioNovo(idEmpresa, id, id_almoxarifado) {
      if (idEmpresa == null || id == null || id_almoxarifado == null) {
        toast.error('Parâmetros inválidos')
        return
      }

      this.loading = true
      try {
        const response = await api.get(`/inventarioitem/${idEmpresa}/${id}/${id_almoxarifado}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.inventarioAtual = response.data.data || response.data || null
        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao obter inventário:', error)
        toast.error('Erro ao carregar inventário')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Cadastra um novo inventário
     * @param {object} dados - Dados do inventário no formato { data: [{ campos }] }
     */
    async cadastrarInventario(dados) {
      // Validar se tem a estrutura data
      if (!dados.data || !Array.isArray(dados.data) || dados.data.length === 0) {
        toast.error('Dados inválidos')
        return
      }

      const primeiroItem = dados.data[0]
      
      if (!primeiroItem.id_empresa || !primeiroItem.id_almoxarifado) {
        toast.error('Preencha todos os campos obrigatórios')
        return
      }

      this.loading = true
      try {
        const response = await api.post(`/inventario`, dados, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        if (response.data) {
          const novoInventario = response.data.data || response.data
          this.inventarios.push(novoInventario)
          toast.success('Inventário cadastrado com sucesso!')
        }

        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao cadastrar inventário:', error)
        toast.error('Erro ao cadastrar inventário')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Altera um inventário existente
     * @param {number} idEmpresa - ID da empresa
     * @param {number} id - ID do inventário
     * @param {object} dados - Dados a serem alterados
     */
    async alterarInventario(idEmpresa, id, dados) {
      if (!idEmpresa || !id) {
        toast.error('Parâmetros inválidos')
        return
      }

      this.loading = true
      try {
        const payload = {
          ...dados,
          id_empresa: idEmpresa
        }

        const response = await api.put(`/inventario/${idEmpresa}/${id}`, payload, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        if (response.data) {
          const inventarioAtualizado = response.data.data || response.data
          const index = this.inventarios.findIndex(inv => inv.id === id)
          if (index !== -1) {
            this.inventarios[index] = inventarioAtualizado
          }
          toast.success('Inventário alterado com sucesso!')
        }

        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao alterar inventário:', error)
        toast.error('Erro ao alterar inventário')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Cancela/exclui um inventário
     * @param {number} idEmpresa - ID da empresa
     * @param {number} id - ID do inventário
     */
    async cancelarInventario(idEmpresa, id) {
      if (!idEmpresa || !id) {
        toast.error('Parâmetros inválidos')
        return
      }

      this.loading = true
      try {
        const response = await api.delete(`/inventario/${idEmpresa}/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.inventarios = this.inventarios.filter(inv => inv.id !== id)
        toast.success('Inventário cancelado com sucesso!')

        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao cancelar inventário:', error)
        toast.error('Erro ao cancelar inventário')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Encerra um inventário
     * @param {number} idEmpresa - ID da empresa
     * @param {number} id - ID do inventário
     * @param {number} idUsuario - ID do usuário que está encerrando
     */
    async encerrarInventario(idEmpresa, id, idUsuario) {
      if (!idEmpresa || !id || !idUsuario) {
        toast.error('Parâmetros inválidos')
        return
      }

      this.loading = true
      try {
        const payload = {
          id_usuarioencerrou: idUsuario,
          dtencerramento: new Date().toISOString()
        }

        const response = await api.put(`/inventario/${idEmpresa}/${id}`, payload, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        if (response.data) {
          const inventarioEncerrado = response.data.data || response.data
          const index = this.inventarios.findIndex(inv => inv.id === id)
          if (index !== -1) {
            this.inventarios[index] = inventarioEncerrado
          }
          toast.success('Inventário encerrado com sucesso!')
        }

        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao encerrar inventário:', error)
        toast.error('Erro ao encerrar inventário')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Consulta o saldo de um produto em um almoxarifado
     * @param {number} idEmpresa - ID da empresa
     * @param {number} idAlmoxarifado - ID do almoxarifado
     * @param {number} idProduto - ID do produto
     * @returns {Promise} Saldo do produto no almoxarifado
     */
    async consultarSaldoProdutoAlmoxarifado(idEmpresa, idAlmoxarifado, idProduto) {
      if (!idEmpresa || !idAlmoxarifado || !idProduto) {
        toast.error('Parâmetros inválidos')
        return
      }

      this.loading = true
      try {
        const response = await api.get(`/proalmox/${idEmpresa}/${idAlmoxarifado}/${idProduto}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        return response.data.data || response.data || null
      } catch (error) {
        console.error('[Inventário] Erro ao consultar saldo do produto:', error)
        toast.error('Erro ao consultar saldo do produto')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Insere itens de contagem em um inventário (usado pela tela de contagem via link)
     * @param {number} idEmpresa - ID da empresa
     * @param {number} id - ID do inventário
     * @param {Array} itens - Lista de itens no formato [{ id_produto, qtd_contada, diferenca, id_localizacao }]
     */
    async inserirItemInventario(idEmpresa, id, itens) {
      if (!idEmpresa || !id) {
        toast.error('Parâmetros inválidos')
        return
      }

      if (!Array.isArray(itens) || itens.length === 0) {
        toast.error('Nenhum item para salvar')
        return
      }

      this.loading = true
      try {
        const payload = { item: itens }

        const response = await api.post(`/inventarioitem/${idEmpresa}/${id}`, payload, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        toast.success('Contagem salva com sucesso!')
        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao inserir itens de inventário:', error)
        toast.error('Erro ao salvar contagem')
        throw error
      } finally {
        this.loading = false
      }
    },

    async atualizarItemInventario(idEmpresa, id, itens, id_almoxarifado = {}) {
      if (!idEmpresa || !id || !id_almoxarifado) {
        toast.error('Parâmetros inválidos')
        return
      }

      if (!Array.isArray(itens) || itens.length === 0) {
        toast.error('Nenhum item para salvar')
        return
      }

      this.loading = true
      try {
        const payload = {
          data: itens,
        }

        const response = await api.put(`/inventarioitem/${idEmpresa}/${id}/${id_almoxarifado}`, payload, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        toast.success('Contagem atualizada com sucesso!')
        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao atualizar itens de inventário:', error)
        toast.error('Erro ao atualizar contagem')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Busca a grade de produtos de um almoxarifado para o inventário
     * @param {number} idEmpresa - ID da empresa
     * @param {number} idAlmoxarifado - ID do almoxarifado
     * @param {object} [filtros] - Filtros opcionais
     * @param {number} [filtros.idpro] - ID do produto
     * @param {number} [filtros.idgrp] - ID do grupo
     * @param {number} [filtros.idsbg] - ID do subgrupo
     * @param {number} [filtros.idmar] - ID da marca
     * @param {number} [filtros.idloc] - ID da localização
     */
    async buscarGridInventario(idEmpresa, idAlmoxarifado, filtros = {}) {
      if (!idEmpresa || !idAlmoxarifado) {
        toast.error('Parâmetros inválidos')
        return
      }

      // Montar query params ignorando valores nulos/undefined
      const params = {}
      if (filtros.idpro) params.idpro = filtros.idpro
      if (filtros.idgrp) params.idgrp = filtros.idgrp
      if (filtros.idsbg) params.idsbg = filtros.idsbg
      if (filtros.idmar) params.idmar = filtros.idmar
      if (filtros.idloc) params.idloc = filtros.idloc

      this.loading = true
      try {
        const response = await api.get(`/inventarioitem/${idEmpresa}/${idAlmoxarifado}`, {
          headers: { Authorization: `Bearer ${this.token}` },
          params
        })

        this.gridProdutos = response.data.data || response.data || []
        return response.data
      } catch (error) {
        console.error('[Inventário] Erro ao buscar grid de produtos:', error)
        toast.error('Erro ao carregar produtos do almoxarifado')
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Limpa o estado do store
     */
    limparEstado() {
      this.inventarios = []
      this.inventarioAtual = null
      this.loading = false
    }
  }
})
