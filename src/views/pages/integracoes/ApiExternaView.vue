<template>
  <top-all-pages icon="mdi-api">
    <template #titulo>APIs Externas</template>

    <template #section>
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
        <v-card-text class="pa-4">

          <!-- Botão abrir formulário -->
          <div class="d-flex justify-space-between align-center mb-3 gap-2">
            <BotaoExpandTransition
                :formulario-aberto="formularioAberto"
                texto-abrir="Nova API Externa"
                texto-fechar="Cancelar"
                @toggle="toggleFormulario"
            />
          </div>

          <!-- Formulário Expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                  {{ editando ? 'Editar API Externa' : 'Nova API Externa' }}
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row>

                      <!-- Nome da integração -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.nome"
                            label="Nome da Integração *"
                            :rules="[rules.required]"
                            maxlength="80"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-tag-outline"
                            hint="Ex: Mercado Pago, Asaas, NF-e.io"
                            persistent-hint
                        ></v-text-field>
                      </v-col>

                      <!-- Plataforma / Tipo -->
                      <v-col cols="12" md="4">
                        <v-select
                            v-model="formData.plataforma"
                            :items="plataformasDisponiveis"
                            item-title="label"
                            item-value="value"
                            label="Plataforma *"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-puzzle-outline"
                        ></v-select>
                      </v-col>

                      <!-- Base URL (opcional) -->
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formData.base_url"
                            label="URL Base (opcional)"
                            maxlength="255"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-web"
                            hint="Deixe em branco para usar o padrão da plataforma"
                            persistent-hint
                        ></v-text-field>
                      </v-col>

                      <!-- Chave de API (Token/Client ID) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.api_key"
                            label="Chave de API / Token *"
                            :rules="[rules.required]"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-key-variant"
                            :type="mostrarApiKey ? 'text' : 'password'"
                            :append-inner-icon="mostrarApiKey ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="mostrarApiKey = !mostrarApiKey"
                            hint="Nunca compartilhe sua chave de API"
                            persistent-hint
                        ></v-text-field>
                      </v-col>

                      <!-- Secret / Client Secret (opcional) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.api_secret"
                            label="Secret / Client Secret (opcional)"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-lock-outline"
                            :type="mostrarSecret ? 'text' : 'password'"
                            :append-inner-icon="mostrarSecret ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="mostrarSecret = !mostrarSecret"
                        ></v-text-field>
                      </v-col>

                      <!-- Descrição / Observação -->
                      <v-col cols="12">
                        <v-textarea
                            v-model="formData.descricao"
                            label="Observações (opcional)"
                            maxlength="255"
                            rows="2"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-text"
                            counter
                        ></v-textarea>
                      </v-col>

                      <!-- Ativo -->
                      <v-col cols="12" md="3">
                        <v-switch
                            v-model="formData.ativo"
                            label="Ativar integração"
                            color="var(--text-color-laranja)"
                            density="compact"
                            inset
                            hide-details
                        ></v-switch>
                      </v-col>

                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                  <v-btn
                      color="var(--text-color-laranja)"
                      :loading="loading"
                      :disabled="!formValido"
                      @click="salvarApi"
                      variant="flat"
                      class="text-white"
                  >
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela -->
          <TabelaPadrao
              :formulario-aberto="formularioAberto"
              :headers="headers"
              :items="apisFiltradas"
              :loading="loading"
              :search="search"
              @update:search="(v) => search = v"
              search-label="Pesquisar API Externa"
              item-key="id"
              no-data-icon="mdi-api"
              no-data-text="Nenhuma API externa cadastrada"
              delete-item-display-field="nome"
              delete-dialog-message="A chave de API será removida permanentemente."
              @edit-item="editarApi"
              @confirm-delete="excluirApi"
          >
            <!-- Coluna: Plataforma com badge colorido -->
            <template v-slot:[`item.plataforma`]="{ item }">
              <v-chip
                  :color="corPlataforma(item.plataforma)"
                  size="small"
                  variant="tonal"
                  class="text-uppercase font-weight-bold"
              >
                <v-icon start :icon="iconePlataforma(item.plataforma)" size="14"></v-icon>
                {{ item.plataforma || '—' }}
              </v-chip>
            </template>

            <!-- Coluna: API Key mascarada -->
            <template v-slot:[`item.api_key`]="{ item }">
              <span class="font-mono text-caption">
                {{ mascararChave(item.api_key) }}
              </span>
            </template>

            <!-- Coluna: Status ativo -->
            <template v-slot:[`item.ativo`]="{ item }">
              <v-switch
                  :model-value="item.ativo"
                  color="var(--text-color-laranja)"
                  density="compact"
                  inset
                  hide-details
                  :loading="loading"
                  @update:model-value="(val) => alterarStatus(item.id, val)"
              ></v-switch>
            </template>
          </TabelaPadrao>

        </v-card-text>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useIntegracoesStore } from '@/stores/APIs/integracoes'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'

const themeStore = useThemeStore()
const integracoesStore = useIntegracoesStore()

// ─── State ──────────────────────────────────────────────────────────────────
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const mostrarApiKey = ref(false)
const mostrarSecret = ref(false)

const loading = computed(() => integracoesStore.loading)

const formData = reactive({
  id: null,
  nome: '',
  plataforma: null,
  base_url: '',
  api_key: '',
  api_secret: '',
  descricao: '',
  ativo: true,
})

// ─── Opções ─────────────────────────────────────────────────────────────────
const plataformasDisponiveis = [
  { label: 'Mercado Pago', value: 'mercadopago' },
  { label: 'PagSeguro', value: 'pagseguro' },
  { label: 'Asaas', value: 'asaas' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'NF-e.io', value: 'nfeio' },
  { label: 'Omie', value: 'omie' },
  { label: 'Conta Azul', value: 'contaazul' },
  { label: 'Bling', value: 'bling' },
  { label: 'Tiny ERP', value: 'tiny' },
  { label: 'Shopify', value: 'shopify' },
  { label: 'WooCommerce', value: 'woocommerce' },
  { label: 'WhatsApp Business', value: 'whatsapp' },
  { label: 'SendGrid', value: 'sendgrid' },
  { label: 'Correios', value: 'correios' },
  { label: 'Outra', value: 'outra' },
]

// ─── Headers da tabela ───────────────────────────────────────────────────────
const headers = [
  { title: 'ID', key: 'id', sortable: true, width: '60px' },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Plataforma', key: 'plataforma', sortable: true },
  { title: 'Chave de API', key: 'api_key', sortable: false },
  { title: 'URL Base', key: 'base_url', sortable: false },
  { title: 'Ativo', key: 'ativo', sortable: true, width: '100px' },
  { title: 'Ações', key: 'actions', sortable: false },
]

// ─── Computed ────────────────────────────────────────────────────────────────
const apisFiltradas = computed(() => {
  const dados = integracoesStore.apisExternas
  return Array.isArray(dados) ? dados : []
})

// ─── Regras de validação ─────────────────────────────────────────────────────
const rules = {
  required: (v) => !!v || 'Campo obrigatório',
}

// ─── Helpers visuais ─────────────────────────────────────────────────────────
const mascararChave = (chave) => {
  if (!chave) return '—'
  if (chave.length <= 8) return '••••••••'
  return chave.substring(0, 4) + '••••••••' + chave.slice(-4)
}

const corPlataforma = (plataforma) => {
  const cores = {
    mercadopago: 'blue',
    pagseguro: 'green',
    asaas: 'deep-orange',
    stripe: 'indigo',
    paypal: 'blue-darken-3',
    nfeio: 'teal',
    omie: 'orange',
    contaazul: 'cyan',
    bling: 'light-blue',
    tiny: 'lime-darken-2',
    shopify: 'green-darken-2',
    woocommerce: 'purple',
    whatsapp: 'green',
    sendgrid: 'blue-lighten-1',
    correios: 'yellow-darken-3',
    outra: 'grey',
  }
  return cores[plataforma] ?? 'grey'
}

const iconePlataforma = (plataforma) => {
  const icones = {
    mercadopago: 'mdi-credit-card',
    pagseguro: 'mdi-shield-check',
    asaas: 'mdi-bank',
    stripe: 'mdi-lightning-bolt',
    paypal: 'mdi-paypal',
    nfeio: 'mdi-file-document',
    omie: 'mdi-briefcase-outline',
    contaazul: 'mdi-chart-line',
    bling: 'mdi-package-variant',
    tiny: 'mdi-store',
    shopify: 'mdi-shopping',
    woocommerce: 'mdi-cart',
    whatsapp: 'mdi-whatsapp',
    sendgrid: 'mdi-email-fast',
    correios: 'mdi-truck-delivery',
    outra: 'mdi-api',
  }
  return icones[plataforma] ?? 'mdi-api'
}

// ─── Ações ───────────────────────────────────────────────────────────────────
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) resetarFormulario()
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarFormulario()
}

const resetarFormulario = () => {
  Object.assign(formData, {
    id: null,
    nome: '',
    plataforma: null,
    base_url: '',
    api_key: '',
    api_secret: '',
    descricao: '',
    ativo: true,
  })
  editando.value = false
  mostrarApiKey.value = false
  mostrarSecret.value = false
  formRef.value?.resetValidation()
}

const salvarApi = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const payload = {
    nome: formData.nome,
    plataforma: formData.plataforma,
    base_url: formData.base_url || null,
    api_key: formData.api_key,
    api_secret: formData.api_secret || null,
    descricao: formData.descricao || null,
    ativo: formData.ativo,
  }

  let sucesso
  if (editando.value) {
    sucesso = await integracoesStore.alterarApiExterna(formData.id, payload)
  } else {
    sucesso = await integracoesStore.cadastrarApiExterna(payload)
  }

  if (sucesso) cancelarFormulario()
}

const editarApi = (item) => {
  Object.assign(formData, {
    id: item.id,
    nome: item.nome,
    plataforma: item.plataforma,
    base_url: item.base_url ?? '',
    api_key: item.api_key ?? '',
    api_secret: item.api_secret ?? '',
    descricao: item.descricao ?? '',
    ativo: item.ativo ?? true,
  })
  editando.value = true
  formularioAberto.value = true
}

const excluirApi = async (item) => {
  await integracoesStore.deletarApiExterna(item.id)
}

const alterarStatus = async (id, ativo) => {
  await integracoesStore.alterarStatusApiExterna(id, ativo)
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(async () => {
  await integracoesStore.listarApisExternas()
})
</script>
