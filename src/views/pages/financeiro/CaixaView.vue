<template>
  <top-all-pages icon="mdi-cash-register">
    <template #titulo>Caixa</template>
    <template #section>
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
        <v-card-text class="pa-4">
          <BotaoExpandTransition
              :formulario-aberto="formularioAberto"
              texto-abrir="Nova Caixa"
              texto-fechar="Cancelar"
              size="default"
              @toggle="toggleFormulario"
          />

          <!-- Formulário Expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="2">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                  {{ editando ? 'Editar Caixa' : 'Novo Caixa' }}
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-form ref="novoCaixaRef" v-model="formValido">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field v-model="novoCaixa.desccaixa" label="Descrição *" :rules="[rules.required]" maxlength="120" variant="outlined" density="compact" class="custom-text-field" prepend-inner-icon="mdi-text" />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-select v-model="novoCaixa.participa_fluxo" :items="['S','N']" label="Participa Fluxo" variant="outlined" density="compact" />
                      </v-col>

                      <!-- Plano de Conta -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            label="Plano de Conta *"
                            v-model="planoContaSelecionado"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :rules="[rules.required]"
                            prepend-inner-icon="mdi-chart-tree"
                        >
                          <template #append-inner>
                            <PlanoContaMenu @selecionar="selecionarPlanoConta"/>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn
                      color="grey"
                      variant="text"
                      @click="cancelarFormulario"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                      color="var(--text-color-laranja)"
                      :loading="savingNovo"
                      :disabled="!formValido"
                      @click="salvarNovoCaixa"
                      variant="flat"
                      class="text-white"
                  >
                    Salvar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela de Caixas -->
          <TabelaPadrao
              :formulario-aberto="formularioAberto"
              :headers="headers"
              :items="filteredCaixas"
              :loading="loading"
              :search="search"
              @update:search="(value) => search = value"
              search-label="Pesquisar Caixa"
              item-key="id"
              no-data-icon="mdi-cash-register"
              no-data-text="Nenhum caixa encontrado"
              :show-custom-action="true"
              custom-action-icon="mdi-account-multiple"
              custom-action-title="Gerenciar Usuários"
              :custom-action-loading="loadingUsuarios"
              delete-dialog-message="Esta ação não pode ser desfeita."
              delete-item-display-field="desccaixa"
              @edit-item="editarCaixa"
              @custom-action="abrirModalUsuarios"
              @confirm-delete="excluirCaixa"
          >
            <!-- Slots para formatação customizada -->
            <template v-slot:[`item.dhinc`]="{ item }">
              {{ item.dhinc ? formatarDataHora(item.dhinc) : '-' }}
            </template>

            <template v-slot:[`item.ativo`]="{ item }">
              <v-chip
                  size="small"
                  :color="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'success' : 'default'"
                  :variant="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'flat' : 'outlined'"
              >
                <v-icon
                    :icon="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'mdi-check-circle' : 'mdi-close-circle'"
                    size="16"
                    class="mr-1"
                ></v-icon>
                {{ (item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </template>
          </TabelaPadrao>
        </v-card-text>
      </v-card>

      <!-- Modal de Gerenciamento de Usuários -->
      <v-dialog v-model="openUsuariosModal" persistent max-width="900px">
        <v-card class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-multiple" class="mr-3"></v-icon>
              Gerenciar Usuários - Caixa {{ caixaParaUsuarios?.desccaixa || caixaParaUsuarios?.id || caixaParaUsuarios?.ID }}
            </div>
            <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="openUsuariosModal = false"
            ></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <!-- Loading interno enquanto carrega dados -->
            <div v-if="loadingUsuarios" class="text-center pa-8">
              <v-progress-circular
                  indeterminate
                  color="var(--text-color-laranja)"
                  size="48"
                  class="mb-4"
              ></v-progress-circular>
              <p class="text-body-1">Carregando usuários...</p>
            </div>

            <!-- Tabela de usuários -->
            <div v-else>
              <v-alert
                  v-if="usuariosList.length === 0"
                  type="info"
                  variant="tonal"
                  class="mb-4"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-information"></v-icon>
                </template>
                Nenhum usuário vinculado a este caixa encontrado.
              </v-alert>

              <v-data-table
                  v-else
                  :headers="headersUsuarios"
                  :items="usuariosList"
                  item-key="ID"
                  class="elevation-1 background-secondary"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
              >
                <template v-slot:[`item.nome`]="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar size="32" class="mr-3" :color="themeStore.darkMode ? 'grey-darken-3' : 'grey-lighten-2'">
                      <v-icon icon="mdi-account" :color="themeStore.darkMode ? 'grey-lighten-1' : 'grey-darken-2'"></v-icon>
                    </v-avatar>
                    <span>{{ item.nome }}</span>
                  </div>
                </template>

                <template v-slot:[`item.email`]="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-email-outline" size="18" class="mr-2 opacity-60"></v-icon>
                    <span>{{ item.email }}</span>

                  </div>
                </template>

                <template v-slot:[`item.ativo`]="{ item }">
                  <v-chip
                      :color="item.ativo === 'S' ? 'green' : 'grey'"
                      text-color="white"
                      size="small"
                      :variant="item.ativo === 'S' ? 'flat' : 'outlined'"
                  >
                    <template v-slot:prepend>
                      <v-icon
                          :icon="item.ativo === 'S' ? 'mdi-check-circle' : 'mdi-close-circle'"
                          size="16"
                      ></v-icon>
                    </template>
                    {{ item.ativo === 'S' ? 'Ativo' : 'Inativo' }}
                  </v-chip>
                </template>

                <template v-slot:[`item.permissao`]="{ item }">
                  <v-checkbox
                      :model-value="userAccessMap[String(item.ID)] || false"
                      @update:model-value="val => userAccessMap[String(item.ID)] = val"
                      density="compact"
                      color="var(--text-color-laranja)"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  ></v-checkbox>
                </template>

                <template v-slot:no-data>
                  <div class="pa-8 text-center">
                    <v-icon icon="mdi-account-off" size="64" class="mb-2 opacity-60"></v-icon>
                    <p class="text-body-1">Nenhum usuário disponível</p>
                  </div>
                </template>
              </v-data-table>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
                color="grey"
                variant="text"
                @click="openUsuariosModal = false"
                :disabled="loadingUsuarios"
            >
              Cancelar
            </v-btn>
            <v-btn
                color="var(--text-color-laranja)"
                :loading="financeiroStore.loading"
                :disabled="loadingUsuarios || usuariosList.length === 0"
                @click="salvarUsuariosAcesso"
                variant="flat"
                class="text-white"
            >
              <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
              Salvar Permissões
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar para mensagens -->
      <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          timeout="3000"
          top
      >
        {{ snackbar.message }}
      </v-snackbar>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import PlanoContaMenu from '@/components/base/menu/PlanoContaMenu.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

const caixas = ref([])
const loading = ref(false)
const error = ref(null)
const search = ref('')

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Descrição', key: 'desccaixa' },
  { title: 'Participa Fluxo', key: 'participa_fluxo' },
  { title: 'Ativo', key: 'ativo' },
  { title: 'Cadastro', key: 'dhinc' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120' }
]

// Headers do modal de usuários
const headersUsuarios = [
  { title: 'ID', key: 'ID', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Status', key: 'ativo', sortable: true },
  { title: 'Permissão', key: 'permissao', sortable: false }
]

const formatarDataHora = (valor) => {
  try {
    return new Date(valor).toLocaleString('pt-BR')
  } catch (e) {
    return valor
  }
}

const fetchCaixas = async () => {
  loading.value = true
  error.value = null
  caixas.value = []
  
  try {
    // Para buscar caixas, precisamos do ID da empresa
    // Por enquanto, vamos usar um valor padrão ou pegar do localStorage/contexto
    const idEmpresa = localStorage.getItem('id_empresa') || '1' // Ajustar conforme necessário
    
    const dados = await financeiroStore.buscarCaixas(idEmpresa)
    caixas.value = dados || []
    
    return caixas.value
  } catch (e) {
    console.error('Erro ao buscar caixas:', e)
    error.value = e
    throw e
  } finally {
    loading.value = false
  }
}

const filteredCaixas = computed(() => {
  return Array.isArray(caixas.value) ? caixas.value : []
})

// Form visibility for the expandable create form (keeps same pattern as other pages)
const formularioAberto = ref(false)
const toggleFormulario = () => {
  if (formularioAberto.value) {
    formularioAberto.value = false
    editando.value = false
    caixaEdicao.value = null
  } else {
    novoCaixa.value = { id: '', id_empresa: '', desccaixa: '', participa_fluxo: 'S', ativo: 'S' }
    planoContaSelecionado.value = ''
    editando.value = false
    caixaEdicao.value = null
    formularioAberto.value = true
  }
}
// Validation state and rules (match ContaCorrente pattern)
const formValido = ref(false)
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  number: (value) => /^\\d+$/.test(value) || 'Deve ser um número válido',
  decimal: (value) => /^\d+(\.\d{1,2})?$/.test(value) || 'Deve ser um valor decimal válido',
}

const planoContaSelecionado = ref('')

const cancelarFormulario = () => {
  formularioAberto.value = false
  editando.value = false
  caixaEdicao.value = null
  // reset form data
  novoCaixa.value = { id: '', id_empresa: '', desccaixa: '', participa_fluxo: 'S', ativo: 'S' }
  planoContaSelecionado.value = ''
  formValido.value = false
  if (novoCaixaRef.value && typeof novoCaixaRef.value.resetValidation === 'function') {
    novoCaixaRef.value.resetValidation()
  }
}

onMounted(() => {
  fetchCaixas().catch(() => {})
})

// Novo Caixa state & handlers
const savingNovo = ref(false)
const novoCaixaRef = ref(null)
const novoCaixa = ref({
  id: '',
  id_empresa: '',
  desccaixa: '',
  participa_fluxo: 'S',
  ativo: 'S'
})

// Estados para edição
const editando = ref(false)
const caixaEdicao = ref(null)



// Estados para modal de usuários
const openUsuariosModal = ref(false)
const caixaParaUsuarios = ref(null)
const usuariosList = ref([])
const userAccessMap = reactive({})
const loadingUsuarios = ref(false) // Loading state para o modal

const selecionarPlanoConta = (planoConta) => {
  novoCaixa.value.id_planoconta = planoConta.id
  planoContaSelecionado.value = planoConta.descconta || planoConta.descricao
}

const salvarNovoCaixa = async () => {
  savingNovo.value = true
  try {
    // Preparar dados para envio
    const caixaData = { ...novoCaixa.value }
    
    // Garantir que id_empresa está preenchido
    const idEmpresa = localStorage.getItem('id_empresa') || '1'
    if (!caixaData.id_empresa) {
      caixaData.id_empresa = idEmpresa
    }
    
    // Mapear id_planoconta para id_reduzido_ctb no payload
    if (caixaData.id_planoconta) {
      caixaData.id_reduzido_ctb = caixaData.id_planoconta
    }

    
    let mensagem
    
    if (editando.value && caixaData.id) {
      // Atualizar caixa existente
      await financeiroStore.atualizarCaixa(idEmpresa, caixaData.id, caixaData)
      mensagem = 'Caixa atualizado com sucesso'
    } else {
      // Criar novo caixa
      await financeiroStore.criarCaixa(caixaData)
      mensagem = 'Caixa criado com sucesso'
    }
    
    // Resetar estado
    formularioAberto.value = false
    editando.value = false
    caixaEdicao.value = null
    
    await fetchCaixas()
    mostrarSnackbar(mensagem, 'success')
  } catch (e) {
    console.error('Erro ao salvar caixa:', e)
    mostrarSnackbar(editando.value ? 'Erro ao atualizar caixa' : 'Erro ao criar caixa', 'error')
  } finally {
    savingNovo.value = false
  }
}

// Funções de edição
const editarCaixa = (caixa) => {
  editando.value = true
  caixaEdicao.value = { ...caixa }
  novoCaixa.value = { ...caixa }
  // Carregar plano de conta se existir
  if (caixa.abreviatura_planoconta || caixa.descplanoconta) {
    planoContaSelecionado.value = caixa.abreviatura_planoconta || caixa.descplanoconta
  } else {
    planoContaSelecionado.value = ''
  }
  formularioAberto.value = true
}

// Função de exclusão
const excluirCaixa = async (caixa) => {
  try {
    const idEmpresa = localStorage.getItem('id_empresa') || '1'
    const idCaixa = caixa.id
    
    await financeiroStore.deletarCaixa(idEmpresa, idCaixa)
    
    await fetchCaixas()
    mostrarSnackbar('Caixa excluído com sucesso', 'success')
  } catch (e) {
    console.error('Erro ao excluir caixa:', e)
    mostrarSnackbar('Erro ao excluir caixa', 'error')
  }
}

// Funções do modal de usuários
const abrirModalUsuarios = async (caixa) => {
  try {
    // Iniciar loading
    loadingUsuarios.value = true
    caixaParaUsuarios.value = caixa
    
    // Tentar capturar o ID de diferentes campos possíveis
    const caixaId = caixa?.id ?? caixa?.ID ?? caixa?.id_caixa ?? caixa?.ID_CAIXA ?? caixa?.id_saas ?? caixa?.ID_SAAS
    
    if (!caixaId) {
      mostrarSnackbar('Erro: ID do caixa não encontrado', 'error')
      loadingUsuarios.value = false
      return
    }

    // Limpar dados anteriores
    usuariosList.value = []
    Object.keys(userAccessMap).forEach(key => delete userAccessMap[key])

    // Buscar usuários vinculados ao caixa ANTES de abrir o modal
    const idEmpresa = localStorage.getItem('id_empresa') || '1'
    const vinculados = await financeiroStore.buscarUsuariosPorCaixa(idEmpresa, caixaId)

    // Se os dados vêm em uma estrutura diferente, vamos normalizar
    let dadosNormalizados = vinculados
    if (vinculados && vinculados.data && Array.isArray(vinculados.data)) {
      dadosNormalizados = vinculados.data
    } else if (vinculados && !Array.isArray(vinculados) && typeof vinculados === 'object') {
      dadosNormalizados = [vinculados]
    }

    console.log('Dados normalizados para usuários do caixa:', dadosNormalizados) // DEBUG - remover depois

    if (Array.isArray(dadosNormalizados) && dadosNormalizados.length > 0) {
      usuariosList.value = dadosNormalizados?.map(v => ({
        ID: v.data.id,
        nome: v.data.nome,
        email: v.data.email,
        ativo: v.data.ativo
      }))

      console.log('Usuários carregados para o modal:', usuariosList.value) // DEBUG - remover depois

      // Inicializar o mapa de acessos a partir do campo ativo ('S' = tem acesso, 'N' = não tem acesso)
      usuariosList.value.forEach(u => {
        if (u.ID) {
          const isActive = u.ativo === 'S'
          userAccessMap[String(u.ID)] = isActive
        }
      })
    } else {
      usuariosList.value = []
    }

    // Finalizar loading e abrir modal APENAS após carregar os dados
    loadingUsuarios.value = false
    openUsuariosModal.value = true
    
  } catch (error) {
    loadingUsuarios.value = false
    mostrarSnackbar('Erro ao carregar usuários: ' + error.message, 'error')
  }
}

const salvarUsuariosAcesso = async () => {
  try {
    // Capturar ID do caixa com as mesmas regras do abrirModalUsuarios
    const caixaId = caixaParaUsuarios.value?.id ?? caixaParaUsuarios.value?.ID ?? caixaParaUsuarios.value?.id_caixa ?? caixaParaUsuarios.value?.ID_CAIXA ?? caixaParaUsuarios.value?.id_saas ?? caixaParaUsuarios.value?.ID_SAAS
    const idEmpresa = localStorage.getItem('id_empresa') || '1'
    
    if (!caixaId) {
      mostrarSnackbar('ID do caixa não encontrado', 'error')
      return
    }

    // Construir lista de usuários preservando a ordem de usuariosList
    const usersPayload = usuariosList.value
      .filter(u => u.ID)
      .map(u => ({
        id: u.ID,
        acesso: !!userAccessMap[String(u.ID)]
      }))

    const payload = {
      idEmpresa: idEmpresa,
      caixaId: caixaId,
      users: usersPayload
    }

    await financeiroStore.atualizarAcessoCaixa(payload)
    
    mostrarSnackbar('Permissões atualizadas com sucesso!', 'success')
    openUsuariosModal.value = false
    
    // Limpar dados do modal
    usuariosList.value = []
    Object.keys(userAccessMap).forEach(key => delete userAccessMap[key])
    caixaParaUsuarios.value = null
    
  } catch (error) {
    mostrarSnackbar('Erro ao salvar permissões: ' + error.message, 'error')
  }
}

// Snackbar local
const snackbar = reactive({ show: false, message: '', color: 'success' })
const mostrarSnackbar = (msg, color = 'success') => {
  snackbar.message = msg
  snackbar.color = color
  snackbar.show = true
}
</script>

