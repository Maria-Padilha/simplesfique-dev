<template>
  <top-all-pages icon="mdi-chart-line">
    <template #titulo>Aliquota UF</template>

    <template #acoes>
      <v-select
          density="compact"
          variant="outlined"
          label="UF"
          hide-details="auto"
          v-model="ufSelecionada"
          class="w-[130px]"
          :items="ufs"
          clearable
          item-title="label"
          item-value="value"
          :theme="themeStore.darkMode ? 'dark' : 'light'"
          prepend-inner-icon="mdi-map-marker"
      />
    </template>

    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition
              v-if="!exibirAliquotas"
              :formulario-aberto="formularioAberto"
              @toggle="toggleFormulario"
          >
            <template #default>{{ formularioAberto ? "Cancelar" : "Nova Alíquota" }}</template>
          </botao-expand-transition>
        </v-card-text>

        <forms-expand-transition
            :salvar-formulario="salvarFormulario"
            :cancelar-formulario="cancelarFormulario"
            :editando="editando"
            :formulario-aberto="formularioAberto"
            :loading="loading"
        >
          <template #form>
            <v-form ref="formRef">
              <v-row>
                <!-- LINHA 1 (igual ao antigo: UF + Alíquota + Redução + IBPT) -->
                <v-col cols="12" md="2">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="UF"
                      hide-details="auto"
                      class="required-left-border"
                      v-model="forms.id_uf"
                      :items="ufs"
                      item-title="label"
                      :readonly="editando"
                      item-value="value"
                      :rules="validacaoUF"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-map-marker"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="CFOP"
                      hide-details="auto"
                      class="required-left-border"
                      :readonly="editando"
                      v-model="forms.id_cfop"
                      :rules="validacaoCFOP"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-file-document-outline"
                  >
                    <template v-if="!editando" #append-inner>
                      <cfop-menu @selecionar="selecionarCfop"/>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% Alíquota"
                      hide-details="auto"
                      v-model="forms.aliquota_icms"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% Redução BC"
                      hide-details="auto"
                      v-model="forms.reducao_base_calc"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      density="compact"
                      inset
                      hide-details
                      color="primary"
                      v-model="forms.exibir_msg_ibpt"
                      true-value="S"
                      false-value="N"
                  >
                    <template #label><small>Exibe msg IBPT?</small></template>
                  </v-switch>
                </v-col>

                <!-- LINHA 2 (igual ao antigo: Gera Comissão / Financeiro / Estoque) -->
                <v-col cols="12" md="4">
                  <v-switch
                      density="compact"
                      inset
                      hide-details
                      color="primary"
                      v-model="forms.gera_comissao"
                      true-value="S"
                      false-value="N"
                  >
                    <template #label><small>Gera Comissão?</small></template>
                  </v-switch>
                </v-col>

                <v-col cols="12" md="4">
                  <v-switch
                      density="compact"
                      inset
                      hide-details
                      color="primary"
                      v-model="forms.gera_financeiro"
                      true-value="S"
                      false-value="N"
                  >
                    <template #label><small>Gera Financeiro?</small></template>
                  </v-switch>
                </v-col>

                <v-col cols="12" md="4">
                  <v-switch
                      density="compact"
                      inset
                      hide-details
                      color="primary"
                      v-model="forms.gera_estoque"
                      true-value="S"
                      false-value="N"
                  >
                    <template #label><small>Gera Estoque?</small></template>
                  </v-switch>
                </v-col>

                <!-- LINHA 3 (substitui os radios do antigo: Tipo / Aplicação / Assume preço / Imposto federal) -->
                <v-col cols="12" md="3">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Tipo"
                      hide-details="auto"
                      v-model="forms.tipo"
                      :readonly="editando"
                      :items="[
          { label: 'Entrada', value: 'E' },
          { label: 'Saída', value: 'S' },
        ]"
                      item-title="label"
                      item-value="value"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-swap-horizontal"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Aplicação CFOP"
                      hide-details="auto"
                      class="required-left-border"
                      v-model="forms.aplicacao_cfop"
                      :items="opcoesAplicacaoCfop"
                      :readonly="editando"
                      item-title="label"
                      item-value="value"
                      :rules="validacaoAplicacaoCfop"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-format-list-bulleted"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Assume Preço"
                      hide-details="auto"
                      v-model="forms.assume_preco"
                      :items="opAssumePreco"
                      item-title="title"
                      item-value="value"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-cash"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      density="compact"
                      inset
                      hide-details
                      color="primary"
                      v-model="forms.gera_imposto_federal"
                      true-value="S"
                      false-value="N"
                  >
                    <template #label><small>Gera Imposto Federal?</small></template>
                  </v-switch>
                </v-col>

                <!-- LINHA 4 (custo entrada - int4: 1/0) -->
                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Altera custo compra"
                      hide-details="auto"
                      v-model="forms.altera_custo_compra_entrada"
                      :items="opAlteraCusto"
                      item-title="title"
                      item-value="value"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-swap-vertical"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Altera custo aquisição"
                      hide-details="auto"
                      v-model="forms.altera_custo_aquisicao_entrada"
                      :items="opAlteraCusto"
                      item-title="title"
                      item-value="value"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-swap-vertical"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Altera custo médio"
                      hide-details="auto"
                      v-model="forms.altera_custo_medio_entrada"
                      :items="opAlteraCusto"
                      item-title="title"
                      item-value="value"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-swap-vertical"
                  />
                </v-col>

                <!-- LINHA 5 (ICMS / CSOSN) -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="CST ICMS"
                      hide-details="auto"
                      v-model="forms.cst_icms"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-tag"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="CSOSN"
                      hide-details="auto"
                      v-model="forms.csosn"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-tag-outline"
                  />
                </v-col>

                <!-- LINHA 6 (IPI) -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="CST IPI"
                      hide-details="auto"
                      v-model="forms.cst_ipi"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-tag"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% IPI"
                      hide-details="auto"
                      v-model="forms.aliquota_ipi"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Cód. Enquadramento"
                      hide-details="auto"
                      v-model="forms.cenqipi"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-pound"
                  />
                </v-col>

                <!-- LINHA 7 (PIS) -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="CST PIS"
                      hide-details="auto"
                      v-model="forms.cst_pis"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-tag"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% PIS"
                      hide-details="auto"
                      v-model="forms.aliquota_pis"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <!-- LINHA 8 (COFINS) -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="CST COFINS"
                      hide-details="auto"
                      v-model="forms.cst_cofins"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-tag"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% COFINS"
                      hide-details="auto"
                      v-model="forms.aliquota_cofins"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <!-- LINHA 9 (CBS/IBS - bloco como no antigo) -->
                <v-col cols="12" class="mt-2">
                  <v-divider class="mb-2" />
                  <div class="text-subtitle-2 font-weight-medium mb-2">Situação Tributária CBS/IBS</div>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="CST IBS/CBS"
                      hide-details="auto"
                      v-model="forms.cst_cbsibs"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-tag-multiple"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% CBS"
                      hide-details="auto"
                      v-model="forms.aliquota_cbs"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% IBS UF"
                      hide-details="auto"
                      v-model="forms.aliquota_ibsuf"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% IBS Mun"
                      hide-details="auto"
                      v-model="forms.aliquota_ibsmun"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <!-- LINHA 10 (demais impostos que existem na tabela) -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% IR"
                      hide-details="auto"
                      v-model="forms.aliquota_ir"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% CSLL"
                      hide-details="auto"
                      v-model="forms.aliquota_csll"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% II"
                      hide-details="auto"
                      v-model="forms.aliquota_ii"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="% ICMS Importação"
                      hide-details="auto"
                      v-model="forms.aliquota_icms_importacao"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-percent"
                  />
                </v-col>

                <!-- LINHA 11 (Fórmula) -->
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Fórmula cálculo imposto"
                      hide-details="auto"
                      v-model="forms.id_formula_imposto"
                      type="number"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-function"
                  />
                </v-col>
              </v-row>
            </v-form>
          </template>
        </forms-expand-transition>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="aliquotas"
            :loading="loading"
            :search="search"
            @update:search="(value) => (search = value)"
            search-label="Pesquisar Itens"
            item-key="id"
            no-data-icon="mdi-database-off"
            no-data-text="Nenhum item encontrado"
        >

          <template v-slot:[`item.aliquota_icms`]="{ item }">
            {{ item.aliquota_icms ? (item.aliquota_icms / 100) + ' %' : '0 %' }}
          </template>

          <template v-slot:[`item.gera_comissao`]="{ item }">
            {{ item.gera_comissao === 'S' ? 'Sim' : 'Não' }}
          </template>

          <template v-slot:[`item.gera_financeiro`]="{ item }">
            {{ item.gera_financeiro === 'S' ? 'Sim' : 'Não' }}
          </template>

          <template v-slot:[`item.gera_estoque`]="{ item }">
            {{ item.gera_estoque === 'S' ? 'Sim' : 'Não' }}
          </template>

          <template v-slot:[`item.ativo`]="{ item }">
            <v-chip
              :color="item.ativo === 'S' ? 'green' : 'red'"
              variant="outlined" size="small"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            >
              {{ item.ativo === 'S' ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>

          <template v-slot:[`item.acoes`]="{ item }">
            <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editarItem(item)"
            />

            <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="excluirItem(item)"
            />
          </template>
        </tabela-padrao>

        <excluir-modal
            :cancelar="cancelarModalExcluir"
            :deletar="confirmarExclusao"
            :loading="loading"
            v-model:modal-excluir="modalExcluir"
        >
          <template #item>
            {{ itemSelecionado?.id_cfop }} - {{ itemSelecionado?.id_uf }}
          </template>
        </excluir-modal>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, computed, watchEffect, reactive } from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import { useEstoqueStore } from "@/stores/APIs/estoque";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import { useThemeStore } from "@/stores/config-temas/theme";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import CfopMenu from "@/components/base/menu/CfopMenu.vue";

const estoqueStore = useEstoqueStore();
const themeStore = useThemeStore();

const empresaSelecionada = localStorage.getItem("empresaSelecionada");

const empresaObj = empresaSelecionada ? JSON.parse(empresaSelecionada) : null;

const loading = computed(() => estoqueStore.loading);
const aliquotas = computed(() => estoqueStore.aliquotas);

// Estado para exibir ou ocultar a seção
const exibirAliquotas = ref(false);
const formularioAberto = ref(false);
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
  cancelarFormulario();
};

// CAMPOS DA TABELA
const headers = [
  { title: "CFOP", key: "id_cfop" },
  { title: "Alíquota", key: "aliquota_icms" },
  { title: "CSOSN", key: "csosn" },
  { title: "Gera Comissão?", key: "gera_comissao" },
  { title: "Gera Financeiro?", key: "gera_financeiro" },
  { title: "Gera Estoque?", key: "gera_estoque" },
  { title: "Ativo", key: "ativo" },
  { title: "Ações", key: "acoes", align: "center", sortable: false },
];

// PESQUISANDO NA TABELA
const search = ref("");

// FORMULARIO
const editando = ref(false);
const formRef = ref(null);
const itemSelecionado = ref(null);

const validacaoUF = [
  (v) => !!v || "A UF é obrigatória.",
  (v) => (v && v.length <= 2) || "A UF deve ter no máximo 2 caracteres.",
];

const validacaoCFOP = [
  (v) => !!v || "O CFOP é obrigatório.",
  (v) => (v && v.length <= 5) || "O CFOP deve ter no máximo 5 caracteres.",
];

const selecionarCfop = (cfop) => {
  forms.id_cfop = cfop.id_cfop;
};

const ufs = [
  { label: "AC", value: "AC" }, { label: "AL", value: "AL" }, { label: "AP", value: "AP" },
  { label: "AM", value: "AM" }, { label: "BA", value: "BA" }, { label: "CE", value: "CE" },
  { label: "DF", value: "DF" }, { label: "ES", value: "ES" }, { label: "GO", value: "GO" },
  { label: "MA", value: "MA" }, { label: "MT", value: "MT" }, { label: "MS", value: "MS" },
  { label: "MG", value: "MG" }, { label: "PA", value: "PA" }, { label: "PB", value: "PB" },
  { label: "PR", value: "PR" }, { label: "PE", value: "PE" }, { label: "PI", value: "PI" },
  { label: "RJ", value: "RJ" }, { label: "RN", value: "RN" }, { label: "RS", value: "RS" },
  { label: "RO", value: "RO" }, { label: "RR", value: "RR" }, { label: "SC", value: "SC" },
  { label: "SP", value: "SP" }, { label: "SE", value: "SE" }, { label: "TO", value: "TO" },
];

// ✅ 1) LISTAS (use no <script setup>)
const opAssumePreco = [
  { title: "1 - Preço de venda", value: 1 },
  { title: "2 - Custo de compra", value: 2 },
  { title: "3 - Custo de aquisição", value: 3 },
  { title: "4 - Custo médio", value: 4 },
];

const opAlteraCusto = [
  { title: "1 - Alterar sempre", value: 1 },
  { title: "2 - Nunca alterar", value: 2 },
  { title: "3 - Somente se for acréscimo", value: 3 },
];

const opcoesAplicacaoCfop = [
  { value: '01', label: 'Venda' },
  { value: '02', label: 'Transferência de Mercadoria' },
  { value: '03', label: 'Retorno de mercadoria ou bem' },
  { value: '04', label: 'Remessa de mercadoria ou bem' },
  { value: '05', label: 'Bonificação' },
  { value: '06', label: 'Consignação' },
  { value: '07', label: 'Devolução de Venda' },
  { value: '08', label: 'Devolução de Compra' },
  { value: '09', label: 'Entrada' },
  { value: '10', label: 'Serviço' }
];

const validacaoAplicacaoCfop = [
  (v) => !!v || "Aplicação CFOP é obrigatória.",
  (v) => (v && v.length <= 2) || "Aplicação CFOP deve ter no máximo 2 caracteres.",
];

// ✅ 2) FORMS (ajustado com tipos/valores corretos)
const forms = reactive({
  id_uf: null,
  id_cfop: "",

  aplicacao_cfop: "", // varchar(2)

  // assume_preco: int (1..4)
  assume_preco: 1,

  // S/N
  gera_imposto_federal: "N",

  // int (1..3)
  altera_custo_compra_entrada: 2,
  altera_custo_aquisicao_entrada: 2,
  altera_custo_medio_entrada: 2,

  // mantém o resto como já estava
  tipo: "",

  gera_comissao: "N",
  gera_financeiro: "N",
  gera_estoque: "N",

  cst_icms: "",
  csosn: "",

  aliquota_icms: null,
  reducao_base_calc: null,

  cst_cbsibs: "",
  aliquota_cbs: null,
  aliquota_ibsuf: null,
  aliquota_ibsmun: null,

  cst_ipi: "",
  aliquota_ipi: null,
  cenqipi: "",

  cst_pis: "",
  aliquota_pis: null,

  cst_cofins: "",
  aliquota_cofins: null,

  aliquota_ir: null,
  aliquota_csll: null,
  aliquota_ii: null,
  aliquota_icms_importacao: null,

  id_formula_imposto: null,
  exibir_msg_ibpt: "N",
});

const ufSelecionada = ref(forms.id_uf ?? '');

// ✅ 3) CANCELAR (reseta com defaults corretos)
const cancelarFormulario = () => {
  Object.assign(forms, {
    id_uf: "",
    id_cfop: "",
    aplicacao_cfop: "",
    assume_preco: 1,
    gera_imposto_federal: "N",
    altera_custo_compra_entrada: 2,
    altera_custo_aquisicao_entrada: 2,
    altera_custo_medio_entrada: 2,

    tipo: "",

    gera_comissao: "N",
    gera_financeiro: "N",
    gera_estoque: "N",

    cst_icms: "",
    csosn: "",

    aliquota_icms: null,
    reducao_base_calc: null,

    cst_cbsibs: "",
    aliquota_cbs: null,
    aliquota_ibsuf: null,
    aliquota_ibsmun: null,

    cst_ipi: "",
    aliquota_ipi: null,
    cenqipi: "",

    cst_pis: "",
    aliquota_pis: null,

    cst_cofins: "",
    aliquota_cofins: null,

    aliquota_ir: null,
    aliquota_csll: null,
    aliquota_ii: null,
    aliquota_icms_importacao: null,

    id_formula_imposto: null,
    exibir_msg_ibpt: "N",
  });

  if (formRef.value) formRef.value.resetValidation();
  editando.value = false;
};

// ✅ 4) SALVAR (payload coerente com as regras)
const salvarFormulario = async () => {
  if (formRef.value && !(await formRef.value.validate())) return;

  const payload = {
    data: [
      {
        id_uf: forms.id_uf,
        id_cfop: forms.id_cfop,

        // regras novas
        aplicacao_cfop: forms.aplicacao_cfop?.trim()?.slice(0, 2) || "",
        assume_preco: Number(forms.assume_preco),
        gera_imposto_federal: forms.gera_imposto_federal, // "S" | "N"
        altera_custo_compra_entrada: Number(forms.altera_custo_compra_entrada), // 1..3
        altera_custo_aquisicao_entrada: Number(forms.altera_custo_aquisicao_entrada), // 1..3
        altera_custo_medio_entrada: Number(forms.altera_custo_medio_entrada), // 1..3

        // restante
        tipo: forms.tipo,
        gera_comissao: forms.gera_comissao,
        gera_financeiro: forms.gera_financeiro,
        gera_estoque: forms.gera_estoque,

        cst_icms: forms.cst_icms,
        csosn: forms.csosn,
        aliquota_icms: forms.aliquota_icms,
        reducao_base_calc: forms.reducao_base_calc,

        cst_cbsibs: forms.cst_cbsibs,
        aliquota_cbs: forms.aliquota_cbs,
        aliquota_ibsuf: forms.aliquota_ibsuf,
        aliquota_ibsmun: forms.aliquota_ibsmun,

        cst_ipi: forms.cst_ipi,
        aliquota_ipi: forms.aliquota_ipi,
        cenqipi: forms.cenqipi,

        cst_pis: forms.cst_pis,
        aliquota_pis: forms.aliquota_pis,

        cst_cofins: forms.cst_cofins,
        aliquota_cofins: forms.aliquota_cofins,

        aliquota_ir: forms.aliquota_ir,
        aliquota_csll: forms.aliquota_csll,
        aliquota_ii: forms.aliquota_ii,
        aliquota_icms_importacao: forms.aliquota_icms_importacao,

        id_formula_imposto: forms.id_formula_imposto,
        exibir_msg_ibpt: forms.exibir_msg_ibpt,
      },
    ],
  };

  if (editando.value) {
    await estoqueStore.editarAliquota(
        payload,
        empresaObj?.id,
        itemSelecionado.value.id_cfop,
        itemSelecionado.value.id_uf
    );
    cancelarFormulario();
    formularioAberto.value = false;
    return;
  }

  await estoqueStore.cadastrarAliquota(payload, empresaObj?.id, ufSelecionada.value);
  cancelarFormulario();
  formularioAberto.value = false;
};

/**
 * EDITANDO ALÍQUOTA
 */
const editarItem = (item) => {
  editando.value = true;
  itemSelecionado.value = item;
  Object.assign(forms, item);
  formularioAberto.value = true;
};

/**
 * EXCLUINDO ALÍQUOTA
 */
const modalExcluir = ref(false);

const cancelarModalExcluir = () => {
  modalExcluir.value = false;
  itemSelecionado.value = null;
};

const excluirItem = (item) => {
  itemSelecionado.value = item;
  modalExcluir.value = true;
};

const confirmarExclusao = async () => {
  if (!itemSelecionado.value) return;

  await estoqueStore.deletarAliquota(empresaObj?.id, itemSelecionado.value.id_cfop, itemSelecionado.value.id_uf);
  cancelarModalExcluir();
  formularioAberto.value = false;
};

watchEffect(() => {
  estoqueStore.buscarTodasAliquotas(empresaObj?.id, ufSelecionada.value);
});
</script>
