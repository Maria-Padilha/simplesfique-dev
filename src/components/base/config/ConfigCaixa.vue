<template>
  <div class="caixa-config">
    <v-form ref="formRef" v-model="formValid">
      <!-- Suprimento de Caixa -->
      <div class="config-section mb-6">
        <h4 class="text-lg font-medium mb-4 texto-color-primary">Suprimento de Caixa</h4>
        
        <div class="d-flex flex-column" style="gap: 16px;">
          <!-- Conta Contábil Suprimento -->
          <v-text-field
            v-model="planoContaSuprimentoLabel"
            label="Conta contábil suprimento"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="custom-text-field"
            prepend-inner-icon="mdi-cash-plus"
            readonly
            placeholder="Selecione uma conta"
            style="max-width: 420px;"
          >
            <template #append-inner>
              <div class="d-flex align-center">
                <busca-padrao-menu
                  v-model="menuPlanoContaSuprimento"
                  :pesquisar="pesquisarPlanoContaSuprimento"
                  :modelInput="termoPlanoContaSuprimento"
                  :resultados="planosContaResultadosSuprimento"
                  @update:modelInput="termoPlanoContaSuprimento = $event"
                  @selecionar="selecionarPlanoContaSuprimento"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="planosContaResultadosSuprimento"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer" @click="selecionar(item)">
                          <p class="text-body-1">({{ item.id }}) - {{ item.descconta || item.descricao }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </div>
            </template>
          </v-text-field>

          <!-- Histórico Caixa Suprimento -->
          <v-text-field
            v-model="histCaixaSuprimentoLabel"
            label="Histórico caixa suprimento"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="custom-text-field"
            prepend-inner-icon="mdi-cash"
            readonly
            placeholder="Selecione um histórico"
            style="max-width: 420px;"
          >
            <template #append-inner>
              <div class="d-flex align-center">
                <busca-padrao-menu
                  v-model="menuHistCaixaSuprimento"
                  :pesquisar="pesquisarHistoricoCaixaSuprimento"
                  :modelInput="termoHistCaixaSuprimento"
                  :resultados="historicoCaixaResultadosSuprimento"
                  @update:modelInput="termoHistCaixaSuprimento = $event"
                  @selecionar="selecionarHistoricoCaixaSuprimento"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoCaixaResultadosSuprimento"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer" @click="selecionar(item)">
                          <p class="text-body-1">({{ item.id }}) - {{ item.deschistorico }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </div>
            </template>
          </v-text-field>

          <!-- Histórico Contábil Suprimento -->
          <v-text-field
            v-model="histContabilSuprimentoLabel"
            label="Histórico contábil suprimento"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="custom-text-field"
            prepend-inner-icon="mdi-book-open-variant"
            readonly
            placeholder="Selecione um histórico"
            style="max-width: 420px;"
          >
            <template #append-inner>
              <div class="d-flex align-center">
                <busca-padrao-menu
                  v-model="menuHistContabilSuprimento"
                  :pesquisar="pesquisarHistoricoContabilSuprimento"
                  :modelInput="termoHistContabilSuprimento"
                  :resultados="historicoContabilResultadosSuprimento"
                  @update:modelInput="termoHistContabilSuprimento = $event"
                  @selecionar="selecionarHistoricoContabilSuprimento"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="historicoContabilResultadosSuprimento"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer" @click="selecionar(item)">
                          <p class="text-body-1">({{ item.id }}) - {{ item.deschistorico }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </div>
            </template>
          </v-text-field>
        </div>
      </div>

      <!-- Sangria de Caixa -->
      <div class="config-section mb-6">
        <h4 class="text-lg font-medium mb-4 texto-color-primary">Sangria de Caixa</h4>
        
        <div class="d-flex flex-column" style="gap: 16px;">
          <!-- Conta Contábil Sangria -->
          <v-text-field
            v-model="planoContaSangriaLabel"
            label="Conta contábil sangria"
            variant="outlined"
            density="compact"
            hide-details="auto"
            class="custom-text-field"
            prepend-inner-icon="mdi-cash-minus"
            readonly
            placeholder="Selecione uma conta"
            style="max-width: 420px;"
          >
            <template #append-inner>
              <div class="d-flex align-center">
                <busca-padrao-menu
                  v-model="menuPlanoContaSangria"
                  :pesquisar="pesquisarPlanoContaSangria"
                  :modelInput="termoPlanoContaSangria"
                  :resultados="planosContaResultadosSangria"
                  @update:modelInput="termoPlanoContaSangria = $event"
                  @selecionar="selecionarPlanoContaSangria"
                >
                  <template #resultados="{ selecionar }">
                    <v-virtual-scroll
                      :items="planosContaResultadosSangria"
                      :height="120"
                      item-height="42"
                      class="mt-3"
                    >
                      <template #default="{ item }">
                        <div class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer" @click="selecionar(item)">
                          <p class="text-body-1">({{ item.id }}) - {{ item.descconta || item.descricao }}</p>
                        </div>
                      </template>
                    </v-virtual-scroll>
                  </template>
                </busca-padrao-menu>
              </div>
            </template>
          </v-text-field>
        </div>
      </div>
    </v-form>

    <!-- Botões de Ação -->
    <div class="action-buttons mt-6">
      <v-btn
        color="var(--text-color-laranja)"
        variant="flat"
        @click="salvarConfiguracoes"
        :loading="loading"
        :disabled="loading"
        class="text-white"
      >
        <v-icon class="mr-2">mdi-content-save</v-icon>
        Salvar Configurações
      </v-btn>
      
      <v-btn
        variant="outlined"
        @click="resetarConfiguracoes"
        class="ml-3"
      >
        <v-icon class="mr-2">mdi-refresh</v-icon>
        Resetar
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import { useConfigParfinStore } from '@/stores/APIs/config'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

const useConfig = useConfigParfinStore()
const empresaStore = useEmpresaStore()
const useFinanceiro = useFinanceiroStore()
const formRef = ref(null)
const formValid = ref(false)
const loading = computed(() => useConfig.loading)
const dadosExistem = ref(false)

// Dados de configuração
const config = reactive({
  id_red_ctb_suprimento: null,
  id_hist_caixa_suprimento: null,
  id_hist_contabil_suprimento: null,
  id_red_ctb_sangria: null,
  // Campos de descrição
  desc_ctb_suprimento: '',
  desc_hist_caixa_suprimento: '',
  desc_hist_contabil_suprimento: '',
  desc_ctb_sangria: ''
})

// Dados dos selects
const historicoCaixa = ref([])
const historicoContabil = ref([])
const planosConta = computed(() => useFinanceiro.planosConta || [])

// Computed para labels
const planoContaSuprimentoLabel = computed(() => 
  config.id_red_ctb_suprimento ? `( ${config.id_red_ctb_suprimento} ) - ${config.desc_ctb_suprimento}` : ''
)
const histCaixaSuprimentoLabel = computed(() => 
  config.id_hist_caixa_suprimento ? `( ${config.id_hist_caixa_suprimento} ) - ${config.desc_hist_caixa_suprimento}` : ''
)
const histContabilSuprimentoLabel = computed(() => 
  config.id_hist_contabil_suprimento ? `( ${config.id_hist_contabil_suprimento} ) - ${config.desc_hist_contabil_suprimento}` : ''
)
const planoContaSangriaLabel = computed(() => 
  config.id_red_ctb_sangria ? `( ${config.id_red_ctb_sangria} ) - ${config.desc_ctb_sangria}` : ''
)

// Estados dos modais de busca - Plano de Conta
const menuPlanoContaSuprimento = ref(false)
const termoPlanoContaSuprimento = ref('')
const planosContaResultadosSuprimento = ref([])

const menuPlanoContaSangria = ref(false)
const termoPlanoContaSangria = ref('')
const planosContaResultadosSangria = ref([])

// Estados dos modais de busca - Histórico Caixa
const menuHistCaixaSuprimento = ref(false)
const termoHistCaixaSuprimento = ref('')
const historicoCaixaResultadosSuprimento = ref([])

// Estados dos modais de busca - Histórico Contábil
const menuHistContabilSuprimento = ref(false)
const termoHistContabilSuprimento = ref('')
const historicoContabilResultadosSuprimento = ref([])

// Funções de filtro - Plano de Conta
const filtrarPlanosConta = (termo) => {
  const filtro = (termo || '').toString().trim().toLowerCase()
  if (!filtro) return [...planosConta.value]
  return planosConta.value.filter((item) => (
    (item?.descconta ?? '').toLowerCase().includes(filtro) ||
    (item?.descricao ?? '').toLowerCase().includes(filtro) ||
    (item?.id ?? '').toString().includes(filtro)
  ))
}

const pesquisarPlanoContaSuprimento = () => {
  planosContaResultadosSuprimento.value = filtrarPlanosConta(termoPlanoContaSuprimento.value)
}

const pesquisarPlanoContaSangria = () => {
  planosContaResultadosSangria.value = filtrarPlanosConta(termoPlanoContaSangria.value)
}

watch([planosConta, termoPlanoContaSuprimento], pesquisarPlanoContaSuprimento, { immediate: true })
watch([planosConta, termoPlanoContaSangria], pesquisarPlanoContaSangria, { immediate: true })

// Funções de filtro - Históricos
const filtrarLista = (lista, termo, campos) => {
  if (!Array.isArray(lista)) return []
  const filtro = (termo || '').toString().trim().toLowerCase()
  if (!filtro) return [...lista]
  return lista.filter((item) => campos.some((campo) => (
    (item?.[campo] ?? '').toString().toLowerCase().includes(filtro)
  )))
}

const pesquisarHistoricoCaixaSuprimento = () => {
  historicoCaixaResultadosSuprimento.value = filtrarLista(historicoCaixa.value, termoHistCaixaSuprimento.value, ['deschistorico', 'id'])
}

const pesquisarHistoricoContabilSuprimento = () => {
  historicoContabilResultadosSuprimento.value = filtrarLista(historicoContabil.value, termoHistContabilSuprimento.value, ['deschistorico', 'id'])
}

watch([historicoCaixa, termoHistCaixaSuprimento], pesquisarHistoricoCaixaSuprimento, { immediate: true })
watch([historicoContabil, termoHistContabilSuprimento], pesquisarHistoricoContabilSuprimento, { immediate: true })

// Funções de seleção - Plano de Conta
const selecionarPlanoContaSuprimento = (item) => {
  config.id_red_ctb_suprimento = item?.id ?? null
  config.desc_ctb_suprimento = item?.descconta || item?.descricao || ''
  menuPlanoContaSuprimento.value = false
}

const selecionarPlanoContaSangria = (item) => {
  config.id_red_ctb_sangria = item?.id ?? null
  config.desc_ctb_sangria = item?.descconta || item?.descricao || ''
  menuPlanoContaSangria.value = false
}

// Funções de seleção - Históricos
const selecionarHistoricoCaixaSuprimento = (item) => {
  config.id_hist_caixa_suprimento = item?.id ?? null
  config.desc_hist_caixa_suprimento = item?.deschistorico ?? ''
  menuHistCaixaSuprimento.value = false
}

const selecionarHistoricoContabilSuprimento = (item) => {
  config.id_hist_contabil_suprimento = item?.id ?? null
  config.desc_hist_contabil_suprimento = item?.deschistorico ?? ''
  menuHistContabilSuprimento.value = false
}

// Carregar parâmetros do caixa
const carregarParametrosCaixa = async () => {
  const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
  
  if (!idEmpresa) {
    console.error('ID da empresa não encontrado!')
    return
  }
  
  try {
    const response = await useConfig.buscarParametrosCaixa(idEmpresa)
    const dadosArray = response?.data
    
    // Se o array tem pelo menos um objeto com algum campo preenchido
    let dados = null
    if (Array.isArray(dadosArray) && dadosArray.length > 0) {
      const temCampos = Object.keys(dadosArray[0] || {}).filter(k => k.startsWith('id_')).length > 0
      if (temCampos) {
        dados = dadosArray[0]
      }
    }
    
    if (dados) {
      Object.keys(config).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(dados, key)) {
          config[key] = dados[key]
        }
      })
      
      // Preencher descrições dos planos de conta
      if (Array.isArray(planosConta.value)) {
        if (config.id_red_ctb_suprimento) {
          const planoSuprimento = planosConta.value.find(p => Number(p.id) === Number(config.id_red_ctb_suprimento))
          config.desc_ctb_suprimento = planoSuprimento ? (planoSuprimento.descconta || planoSuprimento.descricao) : ''
        }
        if (config.id_red_ctb_sangria) {
          const planoSangria = planosConta.value.find(p => Number(p.id) === Number(config.id_red_ctb_sangria))
          config.desc_ctb_sangria = planoSangria ? (planoSangria.descconta || planoSangria.descricao) : ''
        }
      }
      
      // Preencher descrições dos históricos de caixa
      if (Array.isArray(historicoCaixa.value) && config.id_hist_caixa_suprimento) {
        const histCaixa = historicoCaixa.value.find(h => Number(h.id) === Number(config.id_hist_caixa_suprimento))
        config.desc_hist_caixa_suprimento = histCaixa ? histCaixa.deschistorico : ''
      }
      
      // Preencher descrições dos históricos contábeis
      if (Array.isArray(historicoContabil.value) && config.id_hist_contabil_suprimento) {
        const histContabil = historicoContabil.value.find(h => Number(h.id) === Number(config.id_hist_contabil_suprimento))
        config.desc_hist_contabil_suprimento = histContabil ? histContabil.deschistorico : ''
      }
      
      dadosExistem.value = true
    } else {
      dadosExistem.value = false
    }
  } catch (error) {
    console.error('Erro ao carregar parâmetros do caixa:', error)
    dadosExistem.value = false
  }
}

const salvarConfiguracoes = async () => {
  try {
    const dadosParaEnvio = {
      data: [{
        id_red_ctb_suprimento: config.id_red_ctb_suprimento,
        id_hist_caixa_suprimento: config.id_hist_caixa_suprimento,
        id_hist_contabil_suprimento: config.id_hist_contabil_suprimento,
        id_red_ctb_sangria: config.id_red_ctb_sangria
      }]
    }
    
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado!')
      return
    }
    
    const response = await useConfig.alterarParametrosCaixa(idEmpresa, dadosParaEnvio)
    
    if (response) {
      await carregarParametrosCaixa()
      console.log('Configurações do caixa salvas com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
  }
}

const resetarConfiguracoes = () => {
  config.id_red_ctb_suprimento = null
  config.id_hist_caixa_suprimento = null
  config.id_hist_contabil_suprimento = null
  config.id_red_ctb_sangria = null
  config.desc_ctb_suprimento = ''
  config.desc_hist_caixa_suprimento = ''
  config.desc_hist_contabil_suprimento = ''
  config.desc_ctb_sangria = ''
}

// Carregar dados ao montar o componente
onMounted(async () => {
  try {
    // Carregar empresa selecionada do localStorage se não houver id
    if (!empresaStore.empresa?.id && !empresaStore.empresaSelecionada?.id) {
      empresaStore.carregarEmpresaSelecionada()
    }
    
    // Sincroniza empresaStore.empresa com empresaSelecionada se necessário
    if (!empresaStore.empresa?.id && empresaStore.empresaSelecionada?.id) {
      empresaStore.empresa = empresaStore.empresaSelecionada
    }

    // Carregar históricos e planos de conta
    const [histCaixa, histContabil] = await Promise.all([
      useConfig.buscarHistoricoCaixa(),
      useConfig.buscarHistoricoBancario(), // Usando como histórico contábil temporariamente
      useFinanceiro.buscarPlanosConta()
    ])

    historicoCaixa.value = Array.isArray(histCaixa?.data) ? histCaixa.data : (Array.isArray(histCaixa) ? histCaixa : [])
    historicoContabil.value = Array.isArray(histContabil?.data) ? histContabil.data : (Array.isArray(histContabil) ? histContabil : [])

    // Carregar parâmetros do caixa
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (idEmpresa) {
      await carregarParametrosCaixa()
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})

// Watch para garantir que busca os parâmetros quando o id da empresa estiver disponível
watch(
  () => empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id,
  async (id) => {
    if (id) {
      await carregarParametrosCaixa()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
@import "@/assets/scss/1-components/components.scss";

.custom-text-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface), 0.7);
}

.caixa-config {
  padding: 20px 0;
}

.config-section {
  padding-bottom: 24px;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>