<template>
  <top-all-pages icon="mdi-store-outline">
    <template #titulo>Ambiente de Vendas</template>

    <template #section>
      <BotaoExpandTransition
        :formulario-aberto="formularioAberto"
        texto-abrir="Novo Ambiente"
        texto-fechar="Cancelar"
        @toggle="toggleFormulario"
      />

      <!-- Formulário Expansível -->
      <v-expand-transition>
        <div v-if="formularioAberto">
          <v-card class="background-card mb-7" elevation="2">
            <v-card-title class="text-h6 pa-4">
              <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
              {{ editando ? 'Editar Ambiente' : 'Novo Ambiente' }}
            </v-card-title>

            <v-card-text class="pa-4">
              <v-form ref="formRef" v-model="formValido">

                <!-- Seção: Identificação -->
                <div class="text-subtitle-2 text-uppercase opacity-60 mb-3">Identificação</div>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.descambiente"
                      label="Descrição do Ambiente *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-store-outline"
                      hide-details="auto"
                      :rules="[rules.required]"
                      color="var(--text-color-laranja)"
                    />
                  </v-col>
                </v-row>

                <!-- Seção: Terminal e Grupo -->
                <div class="text-subtitle-2 text-uppercase opacity-60 mb-3 mt-5">Vínculos</div>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Terminais *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-monitor-dashboard"
                      hide-details="auto"
                      color="var(--text-color-laranja)"
                      readonly
                      placeholder="Clique + para adicionar terminal"
                    >
                      <template #append-inner>
                        <v-menu>
                          <template #activator="{ props }">
                            <v-icon v-bind="props" style="cursor: pointer">mdi-plus</v-icon>
                          </template>
                          <v-list density="compact" min-width="250">
                            <v-list-item
                              v-for="t in terminaisDisponiveis"
                              :key="t.value"
                              :title="t.title"
                              @click="adicionarTerminal(t)"
                            />
                            <v-list-item
                              v-if="!terminaisDisponiveis.length"
                              title="Nenhum terminal disponível"
                              disabled
                            />
                          </v-list>
                        </v-menu>
                      </template>
                    </v-text-field>
                    <div v-if="formData.terminais.length" class="d-flex flex-wrap ga-2 mt-2">
                      <v-chip
                        v-for="id in formData.terminais"
                        :key="id"
                        closable
                        @click:close="removerTerminal(id)"
                        color="var(--text-color-laranja)"
                        variant="tonal"
                        size="small"
                      >
                        {{ terminaisOpcoes.find(t => t.value === id)?.title }}
                      </v-chip>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Grupos"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-account-group-outline"
                      hide-details="auto"
                      color="var(--text-color-laranja)"
                      readonly
                      placeholder="Clique + para adicionar grupo"
                    >
                      <template #append-inner>
                        <GruposMenu @selecionar="selecionarGrupo" />
                      </template>
                    </v-text-field>
                    <div v-if="formData.grupos.length" class="d-flex flex-wrap ga-2 mt-2">
                      <v-chip
                        v-for="grupo in formData.grupos"
                        :key="grupo.id"
                        closable
                        @click:close="removerGrupo(grupo.id)"
                        color="var(--text-color-laranja)"
                        variant="tonal"
                        size="small"
                      >
                        {{ grupo.descgrupo }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>

              </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                v-if="editando"
                color="error"
                variant="text"
                @click="dialogExcluir = true"
              >
                <v-icon start>mdi-delete</v-icon>
                Excluir
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="cancelarFormulario">
                Cancelar
              </v-btn>
              <v-btn
                color="var(--text-color-laranja)"
                :loading="loading"
                :disabled="!formValido"
                @click="salvarAmbiente"
                variant="flat"
                class="text-white px-6"
                size="default"
              >
                {{ editando ? 'Atualizar' : 'Salvar' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-expand-transition>

      <!-- Tabela de Dados -->
      <v-card v-if="!formularioAberto" class="background-card" elevation="0">
        <v-card-text class="pa-4">
          <TabelaPadrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="itemsFiltrados"
            :loading="loading"
            :search="search"
            @update:search="(value) => search = value"
            search-label="Pesquisar Ambiente"
            item-key="id"
            no-data-icon="mdi-store-outline"
            no-data-text="Nenhum ambiente cadastrado"
            delete-item-display-field="descambiente"
            @edit-item="editarAmbiente"
            @confirm-delete="excluirAmbiente"
          />
        </v-card-text>
      </v-card>

      <!-- Dialog de Confirmação de Exclusão -->
      <v-dialog v-model="dialogExcluir" max-width="500">
        <v-card>
          <v-card-title class="text-h6 pa-4">
            <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
            Confirmar Exclusão
          </v-card-title>
          <v-card-text class="pa-4">
            Tem certeza que deseja excluir o ambiente <strong>{{ formData.descambiente }}</strong>?
            <br>Esta ação não poderá ser desfeita.
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="dialogExcluir = false">
              Cancelar
            </v-btn>
            <v-btn
              color="error"
              variant="flat"
              :loading="loading"
              @click="excluirConfirmado"
            >
              Excluir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import { useVendasStore } from '@/stores/APIs/vendas'
import GruposMenu from '@/components/base/menu/GruposMenu.vue'

const vendasStore = useVendasStore()

// Estados
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const dialogExcluir = ref(false)

// Computed
const loading = computed(() => vendasStore.loading)

const itemsFiltrados = computed(() => {
  const dados = vendasStore.ambientes || []
  return Array.isArray(dados) ? dados : []
})

const terminaisOpcoes = computed(() =>
  (vendasStore.terminais || []).map((t) => ({
    title: t.descterminal || `Terminal ${t.id}`,
    value: t.id
  }))
)

const terminaisDisponiveis = computed(() =>
  terminaisOpcoes.value.filter(t => !formData.terminais.includes(t.value))
)

// Form Data
const formData = reactive({
  id: null,
  descambiente: '',
  imp_rede: '',
  imp_nome: '',
  imp_ipc: '',
  terminais: [],
  grupos: []
})

const resetFormData = () => ({
  id: null,
  descambiente: '',
  imp_rede: '',
  imp_nome: '',
  imp_ipc: '',
  terminais: [],
  grupos: []
})

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Descrição', key: 'descambiente', sortable: true },
  { title: 'Impressora Rede', key: 'imp_rede', sortable: false },
  { title: 'Nome Impressora', key: 'imp_nome', sortable: false },
  { title: 'IPC', key: 'imp_ipc', sortable: false },
  { title: 'Terminal', key: 'id_terminal', sortable: false },
  { title: 'Grupo', key: 'id_grupo', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Regras
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  requiredArray: (value) => (Array.isArray(value) && value.length > 0) || 'Selecione ao menos um terminal'
}

// Métodos
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) cancelarFormulario()
}

const cancelarFormulario = () => {
  formRef.value?.reset()
  formRef.value?.resetValidation()
  editando.value = false
  Object.assign(formData, resetFormData())
  formularioAberto.value = false
}

const adicionarTerminal = (terminal) => {
  if (!formData.terminais.includes(terminal.value)) {
    formData.terminais.push(terminal.value)
  }
}

const removerTerminal = (id) => {
  formData.terminais = formData.terminais.filter(t => t !== id)
}

const selecionarGrupo = (grupo) => {
  if (!formData.grupos.find(g => g.id === grupo.id)) {
    formData.grupos.push({ id: grupo.id, descgrupo: grupo.descgrupo })
  }
}

const removerGrupo = (id) => {
  formData.grupos = formData.grupos.filter(g => g.id !== id)
}

const montarPayload = () => {
  return {
    descambiente: formData.descambiente,
    imp_rede: formData.imp_rede || null,
    imp_nome: formData.imp_nome || null,
    imp_ipc: formData.imp_ipc || null,
    terminal: formData.terminais.map(id => ({ id_terminal: id })),
    grupo: formData.grupos.map(g => ({ id_grupo: g.id }))
  }
}

const salvarAmbiente = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    const payload = montarPayload()

    if (editando.value) {
      await vendasStore.alterarAmbiente(formData.id, payload)
    } else {
      await vendasStore.cadastrarAmbiente(payload)
    }

    await vendasStore.listarAmbientes()
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar ambiente:', error)
  }
}

const editarAmbiente = (item) => {
  Object.assign(formData, {
    id: item.id,
    descambiente: item.descambiente || '',
    imp_rede: item.imp_rede || '',
    imp_nome: item.imp_nome || '',
    imp_ipc: item.imp_ipc || '',
    terminais: Array.isArray(item.terminal)
      ? item.terminal.map(t => t.id_terminal)
      : (item.id_terminal ? [item.id_terminal] : []),
    grupos: Array.isArray(item.grupo)
      ? item.grupo.map(g => ({ id: g.id_grupo, descgrupo: g.descgrupo || `Grupo ${g.id_grupo}` }))
      : (item.id_grupo ? [{ id: item.id_grupo, descgrupo: item.descgrupo || `Grupo ${item.id_grupo}` }] : [])
  })

  editando.value = true
  formularioAberto.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const excluirAmbiente = async (id) => {
  try {
    await vendasStore.deletarAmbiente(id)
    await vendasStore.listarAmbientes()
  } catch (error) {
    console.error('Erro ao excluir ambiente:', error)
  }
}

const excluirConfirmado = async () => {
  try {
    await vendasStore.deletarAmbiente(formData.id)
    await vendasStore.listarAmbientes()
    dialogExcluir.value = false
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao excluir ambiente:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    vendasStore.listarAmbientes(),
    vendasStore.listarTerminais()
  ])
})
</script>
