<template>
  <top-all-pages icon="mdi-monitor-dashboard">
    <template #titulo>Terminal de Vendas</template>
    
    <template #section>
      <BotaoExpandTransition
        :formulario-aberto="formularioAberto"
        texto-abrir="Novo Terminal"
        texto-fechar="Cancelar"
        @toggle="toggleFormulario"
      />

      <!-- Formulário Expansível -->
      <v-expand-transition>
        <div v-if="formularioAberto">
          <v-card class="background-card mb-7" elevation="2">
            <v-card-title class="text-h6 pa-4">
              <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
              {{ editando ? 'Editar Terminal' : 'Novo Terminal' }}
            </v-card-title>
            
            <v-card-text class="pa-4">
              <v-form ref="formRef" v-model="formValido">
                <v-row>
                  <!-- Linha 1 - Descrição do Terminal e Nome do Dispositivo -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.descterminal"
                      label="Descrição do Terminal *"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-monitor-dashboard"
                      hide-details="auto"
                      :rules="[rules.required]"
                      color="var(--text-color-laranja)"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.nome_dispositivo"
                      label="Nome do Dispositivo"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-devices"
                      hide-details="auto"
                      color="var(--text-color-laranja)"
                    />
                  </v-col>

                  <!-- Linha 2 - IP do Dispositivo -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.ip_dispositivo"
                      label="IP do Dispositivo"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-ip-network"
                      hide-details="auto"
                      color="var(--text-color-laranja)"
                      placeholder="192.168.1.1"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.imp_nfe"
                      label="Impressora NF-e"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-printer"
                      hide-details="auto"
                      color="var(--text-color-laranja)"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.imp_nfce"
                      label="Impressora NFC-e"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-printer-pos"
                      hide-details="auto"
                      color="var(--text-color-laranja)"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                v-if="editando"
                color="error"
                variant="text"
                @click="confirmarExclusao"
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
                @click="salvarTerminal"
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
            search-label="Pesquisar Terminal"
            item-key="id"
            no-data-icon="mdi-monitor-dashboard"
            no-data-text="Nenhum terminal cadastrado"
            delete-item-display-field="descterminal"
            @edit-item="editarTerminal"
            @confirm-delete="excluirTerminal"
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
            Tem certeza que deseja excluir o terminal <strong>{{ formData.descterminal }}</strong>?
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
  const dados = vendasStore.terminais || []
  return Array.isArray(dados) ? dados : []
})

// Form Data
const formData = reactive({
  id: null,
  descterminal: '',
  nome_dispositivo: '',
  ip_dispositivo: '',
  imp_nfe: '',
  imp_nfce: ''
})

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Descrição', key: 'descterminal', sortable: true },
  { title: 'Dispositivo', key: 'nome_dispositivo', sortable: true },
  { title: 'IP', key: 'ip_dispositivo', sortable: true },
  { title: 'Impressora NF-e', key: 'imp_nfe', sortable: false },
  { title: 'Impressora NFC-e', key: 'imp_nfce', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

// Métodos

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    cancelarFormulario()
  }
}

const cancelarFormulario = () => {
  formRef.value?.reset()
  formRef.value?.resetValidation()
  editando.value = false
  formData.id = null
  formData.descterminal = ''
  formData.nome_dispositivo = ''
  formData.ip_dispositivo = ''
  formData.imp_nfe = ''
  formData.imp_nfce = ''
  formularioAberto.value = false
}

const salvarTerminal = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    const payload = {
      descterminal: formData.descterminal,
      nome_dispositivo: formData.nome_dispositivo || null,
      ip_dispositivo: formData.ip_dispositivo || null,
      imp_nfe: formData.imp_nfe || null,
      imp_nfce: formData.imp_nfce || null
    }

    if (editando.value) {
      await vendasStore.alterarTerminal(formData.id, payload)
    } else {
      await vendasStore.cadastrarTerminal(payload)
    }

    await vendasStore.listarTerminais()
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar terminal:', error)
  }
}

const editarTerminal = (item) => {
  formData.id = item.id
  formData.descterminal = item.descterminal
  formData.nome_dispositivo = item.nome_dispositivo || ''
  formData.ip_dispositivo = item.ip_dispositivo || ''
  formData.imp_nfe = item.imp_nfe || ''
  formData.imp_nfce = item.imp_nfce || ''
  
  editando.value = true
  formularioAberto.value = true
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmarExclusao = () => {
  dialogExcluir.value = true
}

const excluirTerminal = async (id) => {
  try {
    await vendasStore.deletarTerminal(id)
    await vendasStore.listarTerminais()
  } catch (error) {
    console.error('Erro ao excluir terminal:', error)
  }
}

const excluirConfirmado = async () => {
  try {
    await vendasStore.deletarTerminal(formData.id)
    await vendasStore.listarTerminais()
    dialogExcluir.value = false
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao excluir terminal:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await vendasStore.listarTerminais()
})
</script>
