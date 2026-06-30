<template>
  <div class="contas-receber-config">
    <v-form ref="formRef" v-model="formValid">
      <!-- Códigos de Histórico -->
      <div class="config-section mb-6">
      <h4 class="text-lg font-medium mb-4 texto-color-primary">Códigos de Histórico</h4>

      <div class="mb-5">
        <p class="texto-color-primary font-medium mb-2">Código do histórico para baixa no caixa:</p>
        <v-text-field
        v-model="histCaixaLabel"
        label="Histórico Caixa *"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-cash"
        readonly
        :rules="[v => !!config.rec_id_hist_bxa_caixa || 'Campo obrigatório']"
        placeholder="Selecione um histórico"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuHistCaixa"
            :pesquisar="pesquisarHistoricoCaixa"
            :modelInput="termoHistCaixa"
            :resultados="historicoCaixaResultados"
            @update:modelInput="termoHistCaixa = $event"
            @selecionar="selecionarHistoricoCaixa"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="historicoCaixaResultados"
              :height="120"
              item-height="42"
              class="mt-3"
            >
              <template #default="{ item }">
              <div
                class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                @click="selecionar(item)"
              >
                <p class="text-body-1">({{ item.id }}) - {{ item.deschistorico }}</p>
              </div>
              </template>
            </v-virtual-scroll>
            </template>
          </busca-padrao-menu>
          </div>
        </template>
        </v-text-field>


        <!-- Campo para estorno de títulos recebidos no caixa -->
        <p class="texto-color-primary font-medium mb-2 mt-4">Código do hist. para estorno de tit. recebidos no caixa:</p>
        <v-text-field
        v-model="histEstBxaCaixaLabel"
        label="Histórico Estorno Caixa *"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-cash-refund"
        readonly
        :rules="[v => !!config.rec_id_hist_est_bxa_caixa || 'Campo obrigatório']"
        placeholder="Selecione um histórico"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuHistEstBxaCaixa"
            :pesquisar="pesquisarHistoricoCaixa"
            :modelInput="termoHistEstBxaCaixa"
            :resultados="historicoCaixaResultados"
            @update:modelInput="termoHistEstBxaCaixa = $event"
            @selecionar="item => selecionarHistoricoEstBxaCaixa(item)"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="historicoCaixaResultados"
              :height="120"
              item-height="42"
              class="mt-3"
            >
              <template #default="{ item }">
              <div
                class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                @click="selecionar(item)"
              >
                <p class="text-body-1">({{ item.id }}) - {{ item.deschistorico }}</p>
              </div>
              </template>
            </v-virtual-scroll>
            </template>
          </busca-padrao-menu>
          </div>
        </template>
        </v-text-field>

        <div>
        <p class="texto-color-primary font-medium mb-2">Código do histórico para baixa no banco:</p>
        <v-text-field
        v-model="histBancoLabel"
        label="Histórico Banco *"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-bank"
        readonly
        :rules="[v => !!config.rec_id_hist_bxa_banco || 'Campo obrigatório']"
        placeholder="Selecione um histórico"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuHistBanco"
            :pesquisar="pesquisarHistoricoBanco"
            :modelInput="termoHistBanco"
            :resultados="historicoBancoResultados"
            @update:modelInput="termoHistBanco = $event"
            @selecionar="selecionarHistoricoBanco"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="historicoBancoResultados"
              :height="120"
              item-height="42"
              class="mt-3"
            >
              <template #default="{ item }">
              <div
                class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                @click="selecionar(item)"
              >
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

        <p class="texto-color-primary font-medium mb-2 mt-4">Código do hist. para estorno de tit. recebidos no banco:</p>
        <v-text-field
        v-model="histEstBxaBancoLabel"
        label="Histórico Estorno Banco *"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-bank-transfer-out"
        readonly
        :rules="[v => !!config.rec_id_hist_est_bxa_banco || 'Campo obrigatório']"
        placeholder="Selecione um histórico"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuHistEstBxaBanco"
            :pesquisar="pesquisarHistoricoBanco"
            :modelInput="termoHistEstBxaBanco"
            :resultados="historicoBancoResultados"
            @update:modelInput="termoHistEstBxaBanco = $event"
            @selecionar="item => selecionarHistoricoEstBxaBanco(item)"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="historicoBancoResultados"
              :height="120"
              item-height="42"
              class="mt-3"
            >
              <template #default="{ item }">
              <div
                class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                @click="selecionar(item)"
              >
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

      <!-- Contas Contábeis -->
      <div class="config-section mb-6">
      <h4 class="text-lg font-medium mb-4 texto-color-primary">Contas Contábeis</h4>
      <div class="d-flex flex-column" style="gap: 16px;">
        <!-- Conta juros -->
        <v-text-field
        v-model="planoContaJurosLabel"
        label="Conta juros"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-calculator"
        readonly
        placeholder="Selecione uma conta"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuPlanoContaJuros"
            :pesquisar="pesquisarPlanoContaJuros"
            :modelInput="termoPlanoContaJuros"
            :resultados="planosContaResultadosJuros"
            @update:modelInput="termoPlanoContaJuros = $event"
            @selecionar="selecionarPlanoContaJuros"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="planosContaResultadosJuros"
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

        <!-- Conta multa -->
        <v-text-field
        v-model="planoContaMultaLabel"
        label="Conta multa"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-alert-circle"
        readonly
        placeholder="Selecione uma conta"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuPlanoContaMulta"
            :pesquisar="pesquisarPlanoContaMulta"
            :modelInput="termoPlanoContaMulta"
            :resultados="planosContaResultadosMulta"
            @update:modelInput="termoPlanoContaMulta = $event"
            @selecionar="selecionarPlanoContaMulta"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="planosContaResultadosMulta"
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

        <!-- Conta descontos concedidos -->
        <v-text-field
        v-model="planoContaDescLabel"
        label="Conta descontos concedidos"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-percent"
        readonly
        placeholder="Selecione uma conta"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuPlanoContaDesc"
            :pesquisar="pesquisarPlanoContaDesc"
            :modelInput="termoPlanoContaDesc"
            :resultados="planosContaResultadosDesc"
            @update:modelInput="termoPlanoContaDesc = $event"
            @selecionar="selecionarPlanoContaDesc"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="planosContaResultadosDesc"
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

        <!-- Conta clientes -->
        <v-text-field
        v-model="planoContaCliLabel"
        label="Conta clientes"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-account-group"
        readonly
        placeholder="Selecione uma conta"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuPlanoContaCli"
            :pesquisar="pesquisarPlanoContaCli"
            :modelInput="termoPlanoContaCli"
            :resultados="planosContaResultadosCli"
            @update:modelInput="termoPlanoContaCli = $event"
            @selecionar="selecionarPlanoContaCli"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="planosContaResultadosCli"
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

      <!-- Adiantamento Clientes -->
      <div class="config-section">
      <h4 class="text-lg font-medium mb-4 texto-color-primary">Adiantamento Clientes</h4>

      <div class="mb-5">
        <p class="texto-color-primary font-medium mb-2">Histórico do caixa padrão:</p>
        <v-text-field
        v-model="histAdtCaixaLabel"
        label="Histórico Caixa"
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
            v-model="menuHistAdtCaixa"
            :pesquisar="pesquisarHistoricoAdtCaixa"
            :modelInput="termoHistAdtCaixa"
            :resultados="historicoAdtCaixaResultados"
            @update:modelInput="termoHistAdtCaixa = $event"
            @selecionar="selecionarHistoricoAdtCaixa"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="historicoAdtCaixaResultados"
              :height="120"
              item-height="42"
              class="mt-3"
            >
              <template #default="{ item }">
              <div
                class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                @click="selecionar(item)"
              >
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

      <div class="mb-5">
        <p class="texto-color-primary font-medium mb-2">Histórico bancário padrão:</p>
        <v-text-field
        v-model="histAdtBancoLabel"
        label="Histórico Banco"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-bank"
        readonly
        placeholder="Selecione um histórico"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuHistAdtBanco"
            :pesquisar="pesquisarHistoricoAdtBanco"
            :modelInput="termoHistAdtBanco"
            :resultados="historicoAdtBancoResultados"
            @update:modelInput="termoHistAdtBanco = $event"
            @selecionar="selecionarHistoricoAdtBanco"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="historicoAdtBancoResultados"
              :height="120"
              item-height="42"
              class="mt-3"
            >
              <template #default="{ item }">
              <div
                class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                @click="selecionar(item)"
              >
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

      <div>
        <p class="texto-color-primary font-medium mb-2">Tipo de documento padrão:</p>
        <v-text-field
        v-model="tipoDocumentoLabel"
        label="Tipo de Documento"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="custom-text-field"
        prepend-inner-icon="mdi-file-document"
        readonly
        placeholder="Selecione um tipo de documento"
        style="max-width: 420px;"
        >
        <template #append-inner>
          <div class="d-flex align-center">
          <busca-padrao-menu
            v-model="menuTipoDocumento"
            :pesquisar="pesquisarTipoDocumento"
            :modelInput="termoTipoDocumento"
            :resultados="tiposDocumentoResultados"
            @update:modelInput="termoTipoDocumento = $event"
            @selecionar="selecionarTipoDocumento"
          >
            <template #resultados="{ selecionar }">
            <v-virtual-scroll
              :items="tiposDocumentoResultados"
              :height="120"
              item-height="42"
              class="mt-3"
            >
              <template #default="{ item }">
              <div
                class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
                @click="selecionar(item)"
              >
                <p class="text-body-1">({{ item.id }}) - {{ item.desctipodocumento || item.descricao }}</p>
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
        :loading="loading || useConfig.loading"
        :disabled="!canSave"
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
import { watch, ref, reactive, onMounted, computed } from 'vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import { useConfigParfinStore } from '@/stores/APIs/config'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'

const useConfig = useConfigParfinStore()
const empresaStore = useEmpresaStore()
const useFinanceiro = useFinanceiroStore()
const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)
const dadosExistem = ref(false)

// Dados de configuração com os nomes corretos da API
const config = reactive({
  // Parâmetros da API
  rec_id_red_ctb_cli: null,             // Conta clientes
  rec_id_red_ctb_juros_recebido: null,  // Conta juros
  rec_id_red_ctb_multa_recebida: null,  // Conta multa
  rec_id_red_ctb_desc_concedido: null,  // Conta descontos concedidos
  rec_id_hist_bxa_caixa: null,     // Histórico baixa caixa
  rec_id_hist_bxa_banco: null,
  rec_id_hist_est_bxa_caixa: null,
  rec_id_hist_est_bxa_banco: null,
  rec_id_hist_adt_cli_caixa: null, // Histórico adiantamento cliente caixa
  rec_id_hist_adt_cli_banco: null, // Histórico adiantamento cliente banco
  tipo_documento_padrao: null,     // Tipo de documento padrão
  // Campos de descrição
  desc_ctb_juros_recebido: '',
  desc_ctb_multa_recebida: '',
  desc_ctb_desc_concedido: '',
  desc_ctb_cli: '',
  hist_bxa_caixa_desc: '',
  hist_est_bxa_caixa_desc: '',
  hist_est_bxa_banco_desc: '',
  hist_bxa_banco_desc: '',
  hist_adt_caixa_desc: '',
  hist_adt_banco_desc: '',
  tipo_doc_desc: ''
})

// Dados dos selects
const historicoCaixa = ref([])
const historicoBancario = ref([])
const tiposDocumento = ref([])
const planosConta = computed(() => useFinanceiro.planosConta || [])

// Computed para labels dinâmicos dos campos unificados
const histCaixaLabel = computed(() => config.rec_id_hist_bxa_caixa ? `( ${config.rec_id_hist_bxa_caixa} ) - ${config.hist_bxa_caixa_desc}` : '')
const histEstBxaCaixaLabel = computed(() => config.rec_id_hist_est_bxa_caixa ? `( ${config.rec_id_hist_est_bxa_caixa} ) - ${config.hist_est_bxa_caixa_desc}` : '')
const histEstBxaBancoLabel = computed(() => config.rec_id_hist_est_bxa_banco ? `( ${config.rec_id_hist_est_bxa_banco} ) - ${config.hist_est_bxa_banco_desc}` : '')
const histBancoLabel = computed(() => config.rec_id_hist_bxa_banco ? `( ${config.rec_id_hist_bxa_banco} ) - ${config.hist_bxa_banco_desc}` : '')
const planoContaJurosLabel = computed(() => config.rec_id_red_ctb_juros_recebido ? `( ${config.rec_id_red_ctb_juros_recebido} ) - ${config.desc_ctb_juros_recebido}` : '')
const planoContaMultaLabel = computed(() => config.rec_id_red_ctb_multa_recebida ? `( ${config.rec_id_red_ctb_multa_recebida} ) - ${config.desc_ctb_multa_recebida}` : '')
const planoContaDescLabel = computed(() => config.rec_id_red_ctb_desc_concedido ? `( ${config.rec_id_red_ctb_desc_concedido} ) - ${config.desc_ctb_desc_concedido}` : '')
const planoContaCliLabel = computed(() => config.rec_id_red_ctb_cli ? `( ${config.rec_id_red_ctb_cli} ) - ${config.desc_ctb_cli}` : '')
const histAdtCaixaLabel = computed(() => config.rec_id_hist_adt_cli_caixa ? `( ${config.rec_id_hist_adt_cli_caixa} ) - ${config.hist_adt_caixa_desc}` : '')
const histAdtBancoLabel = computed(() => config.rec_id_hist_adt_cli_banco ? `( ${config.rec_id_hist_adt_cli_banco} ) - ${config.hist_adt_banco_desc}` : '')
const tipoDocumentoLabel = computed(() => config.tipo_documento_padrao ? `( ${config.tipo_documento_padrao} ) - ${config.tipo_doc_desc}` : '')

// Estados dos modais de busca para plano de conta
const menuPlanoContaJuros = ref(false)
const termoPlanoContaJuros = ref('')
const planosContaResultadosJuros = ref([])

const menuPlanoContaMulta = ref(false)
const termoPlanoContaMulta = ref('')
const planosContaResultadosMulta = ref([])

const menuPlanoContaDesc = ref(false)
const termoPlanoContaDesc = ref('')
const planosContaResultadosDesc = ref([])

const menuPlanoContaCli = ref(false)
const termoPlanoContaCli = ref('')
const planosContaResultadosCli = ref([])

const filtrarPlanosConta = (termo) => {
  const filtro = (termo || '').toString().trim().toLowerCase()
  if (!filtro) return [...planosConta.value]
  return planosConta.value.filter((item) => (
    (item?.descconta ?? '').toLowerCase().includes(filtro) ||
    (item?.descricao ?? '').toLowerCase().includes(filtro) ||
    (item?.id ?? '').toString().includes(filtro)
  ))
}

const pesquisarPlanoContaJuros = () => {
  planosContaResultadosJuros.value = filtrarPlanosConta(termoPlanoContaJuros.value)
}
const pesquisarPlanoContaMulta = () => {
  planosContaResultadosMulta.value = filtrarPlanosConta(termoPlanoContaMulta.value)
}
const pesquisarPlanoContaDesc = () => {
  planosContaResultadosDesc.value = filtrarPlanosConta(termoPlanoContaDesc.value)
}
const pesquisarPlanoContaCli = () => {
  planosContaResultadosCli.value = filtrarPlanosConta(termoPlanoContaCli.value)
}

watch([planosConta, termoPlanoContaJuros], pesquisarPlanoContaJuros, { immediate: true })
watch([planosConta, termoPlanoContaMulta], pesquisarPlanoContaMulta, { immediate: true })
watch([planosConta, termoPlanoContaDesc], pesquisarPlanoContaDesc, { immediate: true })
watch([planosConta, termoPlanoContaCli], pesquisarPlanoContaCli, { immediate: true })

// Estados dos modais de busca
const menuHistCaixa = ref(false)
const termoHistCaixa = ref('')
const historicoCaixaResultados = ref([])

const menuHistEstBxaCaixa = ref(false)
const termoHistEstBxaCaixa = ref('')

const menuHistBanco = ref(false)
const termoHistBanco = ref('')
const historicoBancoResultados = ref([])

const menuHistEstBxaBanco = ref(false)
const termoHistEstBxaBanco = ref('')

const menuHistAdtCaixa = ref(false)
const termoHistAdtCaixa = ref('')
const historicoAdtCaixaResultados = ref([])

const menuHistAdtBanco = ref(false)
const termoHistAdtBanco = ref('')
const historicoAdtBancoResultados = ref([])

const menuTipoDocumento = ref(false)
const termoTipoDocumento = ref('')
const tiposDocumentoResultados = ref([])

const filtrarLista = (lista, termo, campos) => {
  if (!Array.isArray(lista)) return []
  const filtro = (termo || '').toString().trim().toLowerCase()
  if (!filtro) return [...lista]
  return lista.filter((item) => campos.some((campo) => (
    (item?.[campo] ?? '').toString().toLowerCase().includes(filtro)
  )))
}

const atualizarHistoricoCaixaResultados = () => {
  historicoCaixaResultados.value = filtrarLista(historicoCaixa.value, termoHistCaixa.value, ['deschistorico', 'id'])
}

const atualizarHistoricoBancoResultados = () => {
  historicoBancoResultados.value = filtrarLista(historicoBancario.value, termoHistBanco.value, ['deschistorico', 'id'])
}

const atualizarHistoricoAdtCaixaResultados = () => {
  historicoAdtCaixaResultados.value = filtrarLista(historicoCaixa.value, termoHistAdtCaixa.value, ['deschistorico', 'id'])
}

const atualizarHistoricoAdtBancoResultados = () => {
  historicoAdtBancoResultados.value = filtrarLista(historicoBancario.value, termoHistAdtBanco.value, ['deschistorico', 'id'])
}

const atualizarTiposDocumentoResultados = () => {
  tiposDocumentoResultados.value = filtrarLista(tiposDocumento.value, termoTipoDocumento.value, ['desctipodocumento', 'abreviatura', 'id'])
}

const pesquisarHistoricoCaixa = () => atualizarHistoricoCaixaResultados()
const pesquisarHistoricoBanco = () => atualizarHistoricoBancoResultados()
const pesquisarHistoricoAdtCaixa = () => atualizarHistoricoAdtCaixaResultados()
const pesquisarHistoricoAdtBanco = () => atualizarHistoricoAdtBancoResultados()
const pesquisarTipoDocumento = () => atualizarTiposDocumentoResultados()

watch([historicoCaixa, termoHistCaixa], atualizarHistoricoCaixaResultados, { immediate: true })
watch([historicoBancario, termoHistBanco], atualizarHistoricoBancoResultados, { immediate: true })
watch([historicoCaixa, termoHistAdtCaixa], atualizarHistoricoAdtCaixaResultados, { immediate: true })
watch([historicoBancario, termoHistAdtBanco], atualizarHistoricoAdtBancoResultados, { immediate: true })
watch([tiposDocumento, termoTipoDocumento], atualizarTiposDocumentoResultados, { immediate: true })

const selecionarHistoricoCaixa = (item) => {
  config.rec_id_hist_bxa_caixa = item?.id ?? null
  config.hist_bxa_caixa_desc = item?.deschistorico ?? ''
  menuHistCaixa.value = false
}

const selecionarHistoricoEstBxaCaixa = (item) => {
  config.rec_id_hist_est_bxa_caixa = item?.id ?? null
  config.hist_est_bxa_caixa_desc = item?.deschistorico ?? ''
  menuHistEstBxaCaixa.value = false
}

const selecionarHistoricoEstBxaBanco = (item) => {
  config.rec_id_hist_est_bxa_banco = item?.id ?? null
  config.hist_est_bxa_banco_desc = item?.deschistorico ?? ''
  menuHistEstBxaBanco.value = false
}

const selecionarHistoricoBanco = (item) => {
  config.rec_id_hist_bxa_banco = item?.id ?? null
  config.hist_bxa_banco_desc = item?.deschistorico ?? ''
  menuHistBanco.value = false
}

const selecionarHistoricoAdtCaixa = (item) => {
  config.rec_id_hist_adt_cli_caixa = item?.id ?? null
  config.hist_adt_caixa_desc = item?.deschistorico ?? ''
  menuHistAdtCaixa.value = false
}

const selecionarHistoricoAdtBanco = (item) => {
  config.rec_id_hist_adt_cli_banco = item?.id ?? null
  config.hist_adt_banco_desc = item?.deschistorico ?? ''
  menuHistAdtBanco.value = false
}

const selecionarTipoDocumento = (item) => {
  config.tipo_documento_padrao = item?.id ?? null
  config.tipo_doc_desc = item?.desctipodocumento || item?.descricao || ''
  menuTipoDocumento.value = false
}

const selecionarPlanoContaJuros = (item) => {
  config.rec_id_red_ctb_juros_recebido = item?.id ?? null
  config.desc_ctb_juros_recebido = item?.descconta || item?.descricao || ''
  menuPlanoContaJuros.value = false
}

const selecionarPlanoContaMulta = (item) => {
  config.rec_id_red_ctb_multa_recebida = item?.id ?? null
  config.desc_ctb_multa_recebida = item?.descconta || item?.descricao || ''
  menuPlanoContaMulta.value = false
}

const selecionarPlanoContaDesc = (item) => {
  config.rec_id_red_ctb_desc_concedido = item?.id ?? null
  config.desc_ctb_desc_concedido = item?.descconta || item?.descricao || ''
  menuPlanoContaDesc.value = false
}

const selecionarPlanoContaCli = (item) => {
  config.rec_id_red_ctb_cli = item?.id ?? null
  config.desc_ctb_cli = item?.descconta || item?.descricao || ''
  menuPlanoContaCli.value = false
}

// Computed para verificar se pode salvar
const canSave = computed(() => {
  return !useConfig.loading
})

// Métodos para buscar descrições
const buscarHistoricoCaixa = async (id, campoDesc) => {
  const idNum = Number(id)
  if (!idNum) {
    config[campoDesc] = ''
    return
  }
  const historico = historicoCaixa.value.find(h => Number(h.id) === idNum)
  config[campoDesc] = historico ? historico.deschistorico : ''
}

const buscarHistoricoBanco = async (id, campoDesc) => {
  const idNum = Number(id)
  if (!idNum) {
    config[campoDesc] = ''
    return
  }
  const historico = historicoBancario.value.find(h => Number(h.id) === idNum)
  config[campoDesc] = historico ? historico.deschistorico : ''
}

// Função para carregar parâmetros financeiros e preencher o formulário
const carregarParametrosFinanceiros = async () => {
  const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

  if (!idEmpresa) {
    console.error('ID da empresa não encontrado!')
    return
  }

  try {
    const response = await useConfig.buscarParametrosFinanceirosReceber(idEmpresa)

    // API retorna objeto único (não paginado); store já devolve response.data diretamente
    const dados = response && typeof response === 'object' && !Array.isArray(response) ? response : null
    if (dados) {
      Object.keys(config).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(dados, key)) {
          config[key] = dados[key]
        }
      })
      // Preencher descrições dos históricos
      buscarHistoricoCaixa(config.rec_id_hist_bxa_caixa, 'hist_bxa_caixa_desc')
      buscarHistoricoBanco(config.rec_id_hist_bxa_banco, 'hist_bxa_banco_desc')
      buscarHistoricoCaixa(config.rec_id_hist_adt_cli_caixa, 'hist_adt_caixa_desc')
      buscarHistoricoBanco(config.rec_id_hist_adt_cli_banco, 'hist_adt_banco_desc')

      // Preencher descrições dos campos de estorno
      config.hist_est_bxa_caixa_desc = ''
      if (Array.isArray(historicoCaixa.value) && config.rec_id_hist_est_bxa_caixa) {
        const estCaixa = historicoCaixa.value.find(h => Number(h.id) === Number(config.rec_id_hist_est_bxa_caixa))
        config.hist_est_bxa_caixa_desc = estCaixa ? estCaixa.deschistorico : ''
      }

      config.hist_est_bxa_banco_desc = ''
      if (Array.isArray(historicoBancario.value) && config.rec_id_hist_est_bxa_banco) {
        const estBanco = historicoBancario.value.find(h => Number(h.id) === Number(config.rec_id_hist_est_bxa_banco))
        config.hist_est_bxa_banco_desc = estBanco ? estBanco.deschistorico : ''
      }

      // Preencher descrição do tipo de documento
      config.tipo_doc_desc = ''
      if (Array.isArray(tiposDocumento.value) && config.tipo_documento_padrao) {
        const tipoDoc = tiposDocumento.value.find(t => Number(t.id) === Number(config.tipo_documento_padrao))
        config.tipo_doc_desc = tipoDoc ? (tipoDoc.desctipodocumento || tipoDoc.descricao) : ''
      }

      // Preencher descrições dos planos de conta
      config.desc_ctb_juros_recebido = ''
      config.desc_ctb_multa_recebida = ''
      config.desc_ctb_desc_concedido = ''
      config.desc_ctb_cli = ''
      if (Array.isArray(planosConta.value)) {
        if (config.rec_id_red_ctb_juros_recebido) {
          const planoJuros = planosConta.value.find(p => Number(p.id) === Number(config.rec_id_red_ctb_juros_recebido))
          config.desc_ctb_juros_recebido = planoJuros ? (planoJuros.descconta || planoJuros.descricao) : ''
        }
        if (config.rec_id_red_ctb_multa_recebida) {
          const planoMulta = planosConta.value.find(p => Number(p.id) === Number(config.rec_id_red_ctb_multa_recebida))
          config.desc_ctb_multa_recebida = planoMulta ? (planoMulta.descconta || planoMulta.descricao) : ''
        }
        if (config.rec_id_red_ctb_desc_concedido) {
          const planoDesc = planosConta.value.find(p => Number(p.id) === Number(config.rec_id_red_ctb_desc_concedido))
          config.desc_ctb_desc_concedido = planoDesc ? (planoDesc.descconta || planoDesc.descricao) : ''
        }
        if (config.rec_id_red_ctb_cli) {
          const planoCli = planosConta.value.find(p => Number(p.id) === Number(config.rec_id_red_ctb_cli))
          config.desc_ctb_cli = planoCli ? (planoCli.descconta || planoCli.descricao) : ''
        }
      }
      dadosExistem.value = true
    } else {
      dadosExistem.value = false
    }
  } catch (error) {
    console.error('Erro ao buscar parâmetros financeiros:', error)
    dadosExistem.value = false
  }
}

const salvarConfiguracoes = async () => {
  try {
    loading.value = true
    const dadosParaEnvio = {
      data: [{
        rec_id_red_ctb_cli: config.rec_id_red_ctb_cli,
        rec_id_red_ctb_juros_recebido: config.rec_id_red_ctb_juros_recebido,
        rec_id_red_ctb_multa_recebida: config.rec_id_red_ctb_multa_recebida,
        rec_id_red_ctb_desc_concedido: config.rec_id_red_ctb_desc_concedido,
        rec_id_hist_bxa_caixa: config.rec_id_hist_bxa_caixa,
        rec_id_hist_bxa_banco: config.rec_id_hist_bxa_banco,
        rec_id_hist_est_bxa_caixa: config.rec_id_hist_est_bxa_caixa,
        rec_id_hist_est_bxa_banco: config.rec_id_hist_est_bxa_banco,
        rec_id_hist_adt_cli_caixa: config.rec_id_hist_adt_cli_caixa,
        rec_id_hist_adt_cli_banco: config.rec_id_hist_adt_cli_banco,
        id_tipo_doc_suprimento: config.tipo_documento_padrao || null,
      }]
    }

    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id

    if (!idEmpresa) {
      console.error('ID da empresa não encontrado!')
      return
    }

    let response
    // PUT só se dadosExistem for verdadeiro (edição), POST se for falso (cadastro)
    if (dadosExistem.value === true) {
      response = await useConfig.alterarParametrosFinanceirosReceber(idEmpresa, dadosParaEnvio)
    } else {
      response = await useConfig.cadastrarParametrosFinanceirosReceber(idEmpresa, dadosParaEnvio)
    }

    if (response) {
      await carregarParametrosFinanceiros()
      console.log('Configurações de Contas a Receber salvas com sucesso!')
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
  } finally {
    loading.value = false
  }
}

const resetarConfiguracoes = () => {
  // Parâmetros da API
  config.rec_id_red_ctb_cli = null
  config.rec_id_red_ctb_juros_recebido = null
  config.rec_id_red_ctb_multa_recebida = null
  config.rec_id_red_ctb_desc_concedido = null
  config.rec_id_hist_est_bxa_banco = null
  config.rec_id_hist_est_bxa_caixa = null
  config.rec_id_hist_bxa_caixa = null
  config.rec_id_hist_bxa_banco = null
  config.rec_id_hist_adt_cli_caixa = null
  config.rec_id_hist_adt_cli_banco = null
  config.tipo_documento_padrao = null

  // Campos de descrição
  config.hist_bxa_caixa_desc = ''
  config.hist_bxa_banco_desc = ''
  config.hist_adt_caixa_desc = ''
  config.hist_adt_banco_desc = ''
  config.tipo_doc_desc = ''
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

    // Carregar históricos e tipos de documento
    const [histCaixa, histBanco, tiposDoc] = await Promise.all([
      useConfig.buscarHistoricoCaixa(),
      useConfig.buscarHistoricoBancario(),
      useFinanceiro.buscarTiposDocumento(),
      useFinanceiro.buscarPlanosConta()
    ])

    historicoCaixa.value = Array.isArray(histCaixa?.data) ? histCaixa.data : (Array.isArray(histCaixa) ? histCaixa : [])
    historicoBancario.value = Array.isArray(histBanco?.data) ? histBanco.data : (Array.isArray(histBanco) ? histBanco : [])
    tiposDocumento.value = Array.isArray(tiposDoc.data) ? tiposDoc.data : (Array.isArray(tiposDoc) ? tiposDoc : [])

    // Atualizar resultados dos menus de busca imediatamente após carregar os dados
    atualizarHistoricoCaixaResultados()
    atualizarHistoricoBancoResultados()
    atualizarHistoricoAdtCaixaResultados()
    atualizarHistoricoAdtBancoResultados()
    atualizarTiposDocumentoResultados()

    // Só busca parâmetros financeiros quando o id da empresa estiver disponível
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (idEmpresa) {
      await carregarParametrosFinanceiros()
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
      await carregarParametrosFinanceiros()
    }
  },
  { immediate: true }
)
</script>

<style scoped>

.custom-text-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface), 0.7);
}
</style>
