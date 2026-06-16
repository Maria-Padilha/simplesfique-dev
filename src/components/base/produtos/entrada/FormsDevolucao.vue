<template>
  <v-form :ref="formsNf">
    <v-row class="my-5 background-card pa-5">
      <!-- Entrada base -->
      <v-col cols="12" md="1">
        <v-text-field
            density="compact"
            variant="outlined"
            label="ID"
            hide-details="auto"
            v-model="forms.id_entrada_origem"
            readonly
        />
      </v-col>

      <v-col cols="12" md="11">
        <v-text-field
            density="compact"
            variant="outlined"
            label="Entrada base (selecionar a nota para devolver)"
            hide-details="auto"
            :model-value="entradaSelecionadaLabel"
            readonly
            clearable
            class="required-left-border"
            :rules="validacao"
            :append-inner-icon="mostrarEntradas ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="toggleTabelaEntradas"
            @click:append-inner.stop="toggleTabelaEntradas"
            @click:clear.stop="limparEntradaSelecionada"
        />

        <v-expand-transition>
          <v-card
              v-if="mostrarEntradas"
              class="mt-2 border entrada-expand-card"
              elevation="0"
              rounded="lg"
          >
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <v-text-field
                      v-model="filtrosEntrada.nota"
                      label="Nº Nota"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      v-model="filtrosEntrada.fornecedor"
                      label="Fornecedor"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      v-model="filtrosEntrada.serie"
                      label="Série"
                      density="compact"
                      variant="outlined"
                      hide-details
                      clearable
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      v-model="filtrosEntrada.dataInicio"
                      label="Emissão inicial"
                      type="date"
                      density="compact"
                      variant="outlined"
                      hide-details
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      v-model="filtrosEntrada.dataFim"
                      label="Emissão final"
                      type="date"
                      density="compact"
                      variant="outlined"
                      hide-details
                  />
                </v-col>
              </v-row>

              <v-data-table
                  :headers="headersEntradas"
                  :items="entradasFiltradas"
                  density="compact"
                  fixed-header
                  height="360"
                  hover
                  items-per-page="8"
                  class="mt-4 border rounded-lg tabela-entradas"
              >
                <template v-slot:[`item.vlr_nf`]="{ item }">
                  {{ formatarReal(item.vlr_nf ?? item.vlr_total_produto) }}
                </template>

                <template v-slot:[`item.dtentrada`]="{ item }">
                  {{ formatarData(item.dtentrada ?? item.data_emissao) }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                      size="small"
                      color="var(--text-color-laranja)"
                      variant="tonal"
                      class="text-none"
                      prepend-icon="mdi-check"
                      @click="selecionarEntradaTabela(item)"
                  >
                    Selecionar
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-col>

      <!-- fornecedor -->
      <v-col cols="12" md="4">
        <v-autocomplete
            density="compact"
            variant="outlined"
            label="Fornecedor"
            hide-details="auto"
            v-model="forms.id_fornecedor"
            :rules="validacao"
            :items="pessoas"
            item-title="nome_razao"
            item-value="id"
            class="required-left-border"
        />
      </v-col>

      <!-- almoxarifado -->
      <v-col cols="12" md="4">
        <v-autocomplete
            density="compact"
            variant="outlined"
            label="Almoxarifado"
            hide-details="auto"
            v-model="forms.id_almoxarifado"
            :items="almoxarifados"
            item-title="descalmoxarifado"
            item-value="id"
            clearable
        />
      </v-col>

      <!-- natureza de operação -->
      <v-col cols="12" md="4">
        <v-autocomplete
            density="compact"
            variant="outlined"
            hide-details="auto"
            label="Natureza da Operação"
            :rules="validacao"
            class="required-left-border"
            v-model="forms.id_cfop"
            :items="cfops"
            item-title="title"
            item-value="value"
            clearable
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import {computed, defineEmits, defineProps, reactive, ref, toRefs} from "vue";
import {useProdutosStore} from "@/stores/APIs/produtos";

const produtosStore = useProdutosStore();

const props = defineProps({
  forms: {type: Object, required: true},
  validacao: {type: Array, required: true},
  pessoas: {type: Array, required: true},
  entradas: {type: Array, required: true},
  formsNf: {type: String, required: true},
  cfops: {type: Object, required: true},
  almoxarifados: {type: Array, required: true},
});

const {forms, validacao, pessoas, entradas} =
    toRefs(props);

const mostrarEntradas = ref(false);
const entradaSelecionadaId = ref(null);
const entradaSelecionada = ref(null);

function toggleTabelaEntradas() {
  mostrarEntradas.value = !mostrarEntradas.value;
}

const filtrosEntrada = reactive({
  nota: "",
  fornecedor: "",
  serie: "",
  dataInicio: "",
  dataFim: "",
});

const headersEntradas = [
  { title: "Nº Nota", key: "id" },
  { title: "Série", key: "id_serie" },
  { title: "CFOP", key: "id_cfop" },
  { title: "Data emissão", key: "dtentrada" },
  { title: "Valor NF", key: "vlr_nf" },
  { title: "Fornecedor", key: "nome_razao" },
  { title: "Almox", key: "id_almoxarifado" },
  { title: "Ações", key: "actions", sortable: false, align: "end" },
];

const entradaSelecionadaLabel = computed(() => {
  if (!entradaSelecionada.value) return "";

  const e = entradaSelecionada.value;

  return `NF ${e.numero_nf ?? e.id ?? "-"} - Série ${e.serie_nf ?? e.id_serie ?? "-"} • ${e.nome_razao ?? ""}`;
});

const entradasFiltradas = computed(() => {
  return (entradas.value || []).filter((e) => {
    const nota = String(e.numero_nf ?? e.id ?? "").toLowerCase();
    const fornecedor = String(e.nome_razao ?? "").toLowerCase();
    const serie = String(e.serie_nf ?? e.id_serie ?? "").toLowerCase();

    const dataEmissao = String(e.dtentrada ?? e.data_emissao ?? "").substring(0, 10);

    return (
        (!filtrosEntrada.nota || nota.includes(filtrosEntrada.nota.toLowerCase())) &&
        (!filtrosEntrada.fornecedor || fornecedor.includes(filtrosEntrada.fornecedor.toLowerCase())) &&
        (!filtrosEntrada.serie || serie.includes(filtrosEntrada.serie.toLowerCase())) &&
        (!filtrosEntrada.dataInicio || dataEmissao >= filtrosEntrada.dataInicio) &&
        (!filtrosEntrada.dataFim || dataEmissao <= filtrosEntrada.dataFim)
    );
  });
});

function selecionarEntradaTabela(item) {
  entradaSelecionada.value = item;
  entradaSelecionadaId.value = item.value ?? item.id;

  onSelecionarEntrada(entradaSelecionadaId.value);

  mostrarEntradas.value = false;
}

function limparEntradaSelecionada() {
  entradaSelecionada.value = null;
  entradaSelecionadaId.value = null;

  onSelecionarEntrada(null);
}

function formatarData(data) {
  if (!data) return "-";

  return new Date(data).toLocaleDateString("pt-BR");
}

function formatarReal(valor) {
  if (valor === null || valor === undefined || valor === "") return "R$ 0,00";

  if (typeof valor === "string") {
    valor = valor.replace(/\./g, "").replace(",", ".");
  }

  const numero = Number(valor);

  if (isNaN(numero)) return "R$ 0,00";

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const emit = defineEmits(["preencher-itens", "entrada-selecionada"]);

// const entradaSelecionadaId = ref(null);

const onSelecionarEntrada = async (entradaId) => {
  if (!entradaId) {
    forms.value.id_entrada_origem = null;
    emit("preencher-itens", []);
    emit("entrada-selecionada", null);
    return;
  }

  try {
    const idEmpresa = JSON.parse(localStorage.getItem("empresaSelecionada"));

    await produtosStore.buscarEntradaDfePorId(idEmpresa?.id, entradaId);

    const entrada = computed(() => produtosStore.entradadfeItem);

    const entradaData = Array.isArray(entrada.value?.data)
        ? entrada.value.data[0]
        : entrada.value?.data;

    const entradaItens = entrada.value?.item ?? entrada.value?.items ?? [];

    if (!entradaData) return;

    console.log('ENTRADA DATA: ', entradaData);

    // 1) salva ID origem no forms
    forms.value.id_entrada_origem = entradaData.id;

    // 2) Preenche cabeçalho
    forms.value.id_fornecedor = entradaData.id_fornecedor ?? forms.value.id_fornecedor ?? null;
    forms.value.dtentrada = entradaData.dtentrada ?? forms.value.dtentrada ?? null;
    forms.value.dtEmissao = new Date().toISOString().slice(0, 10);
    forms.value.observacao = entradaData.observacao ?? forms.value.observacao ?? null;
    forms.value.vlr_total_produto = entradaData.vlr_total_produto ?? forms.value.vlr_total_produto ?? null;

    forms.value.id_cfop = entradaData.id_cfop ?? null
    forms.value.id_uf = entradaData.id_uf ?? null

    // campos faltando
    forms.value.id_saas = entradaData.id_saas ?? forms.value.id_saas ?? null
    forms.value.numero_nf = entradaData.numero_nf ?? entradaData.id ?? null
    forms.value.serie_nf = entradaData.serie_nf ?? entradaData.id_serie ?? null
    forms.value.id_almoxarifado = entradaData.id_almoxarifado ?? forms.value.id_almoxarifado ?? null

    forms.value.id_transportadora = entradaData.id_transportadora ?? forms.value.id_transportadora ?? null
    forms.value.tipo_frete = entradaData.tipo_frete ?? forms.value.tipo_frete ?? null

    forms.value.vlr_nf = entradaData.vlr_nf ?? null
    forms.value.nf_exportada = entradaData.nf_exportada ?? false
    forms.value.tipo_origem = entradaData.tipo_origem ?? null

    emit("preencher-itens", entradaItens);
    emit("entrada-selecionada", entrada.value);
  } catch (error) {
    console.error("Erro ao buscar entrada por ID:", error);
    emit("preencher-itens", []);
    emit("entrada-selecionada", null);
  }
};
</script>