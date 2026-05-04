<template>
  <v-form :ref="formsNf">
    <v-row class="my-5 background-card pa-5">
      <!-- ✅ NOVO: selecionar entrada base -->
      <v-col cols="12" md="10">
        <v-autocomplete
            density="compact"
            variant="outlined"
            label="Entrada base (selecionar a nota para devolver)"
            hide-details="auto"
            v-model="entradaSelecionadaId"
            :items="entradas"
            item-title="label"
            item-value="value"
            clearable
            class="required-left-border"
            :rules="validacao"
            @update:modelValue="onSelecionarEntrada"
        />
      </v-col>

      <!-- opcional: mostrar id da entrada selecionada no forms -->
      <v-col cols="12" md="2">
        <v-text-field
            density="compact"
            variant="outlined"
            label="ID Entrada Base"
            hide-details="auto"
            v-model="forms.id_entrada_origem"
            readonly
        />
      </v-col>

      <!-- id_fornecedor -->
      <v-col cols="12" md="3">
        <v-autocomplete
            density="compact" variant="outlined" label="Fornecedor" hide-details="auto"
            v-model="forms.id_fornecedor" :rules="validacao"
            :items="pessoas" item-title="nome_razao" item-value="id"
            class="required-left-border"
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field
            density="compact" variant="outlined" label="Data da venda" hide-details="auto"
            v-model="forms.dtentrada" type="date" readonly class="required-left-border"
        />
      </v-col>

      <v-col cols="12" md="5">
        <v-autocomplete
            density="compact"
            variant="outlined"
            label="Natureza da Operação"
            hide-details="auto"
            :rules="validacao"
            class="required-left-border"
            v-model="forms.id_cfop"
            :items="cfops"
            item-title="title"
            item-value="value"
            clearable
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field density="compact" variant="outlined" label="Data Emissão" hide-details="auto"
                      v-model="forms.dtEmissao" readonly type="date"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field density="compact" variant="outlined" label="Tipo Frete" hide-details="auto"
                      v-model="forms.tipo_frete"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-autocomplete
            density="compact" variant="outlined" label="Transportadora" hide-details="auto"
            v-model="forms.id_transportadora" clearable
            :items="pessoas" item-title="nome_razao" item-value="id"
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field density="compact" variant="outlined" label="Valor Frete" hide-details="auto"
                      type="number" v-model="forms.vlr_frete"/>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field density="compact" variant="outlined" label="Valor da Compra" hide-details="auto"
                      type="number" v-model="forms.vlr_total_produto"/>
      </v-col>

      <v-col cols="12">
        <v-textarea rows="3" density="compact" variant="outlined" label="Observação" hide-details="auto"
                    v-model="forms.observacao"/>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import {computed, defineEmits, defineProps, ref, toRefs} from "vue";
import {useProdutosStore} from "@/stores/APIs/produtos";

const produtosStore = useProdutosStore();

const props = defineProps({
  forms: {type: Object, required: true},
  validacao: {type: Array, required: true},
  pessoas: {type: Array, required: true},
  entradas: {type: Array, required: true},
  formsNf: {type: String, required: true},
  cfops: {type: Object, required: true},
});

const {forms, validacao, pessoas, entradas} =
    toRefs(props);

const emit = defineEmits(["preencher-itens", "entrada-selecionada"]);

const entradaSelecionadaId = ref(null);

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

    // 1) salva ID origem no forms
    forms.value.id_entrada_origem = entradaData.id;

    // 2) Preenche cabeçalho
    forms.value.id_fornecedor = entradaData.id_fornecedor ?? forms.value.id_fornecedor ?? null;
    forms.value.dtentrada = entradaData.dtentrada ?? forms.value.dtentrada ?? null;
    forms.value.dtEmissao = new Date().toISOString().slice(0, 10);
    forms.value.observacao = entradaData.observacao ?? forms.value.observacao ?? null;
    forms.value.vlr_total_produto = entradaData.vlr_total_produto ?? forms.value.vlr_total_produto ?? null;

    forms.value.tipo_frete = entradaData.tipo_frete ?? forms.value.tipo_frete ?? null;
    forms.value.vlr_frete = entradaData.vlr_frete ?? forms.value.vlr_frete ?? null;
    forms.value.id_transportadora = entradaData.id_transportadora ?? null
    forms.value.id_cfop = entradaData.id_cfop ?? null
    forms.value.id_uf = entradaData.id_uf ?? null

    emit("preencher-itens", entradaItens);
    emit("entrada-selecionada", entrada.value);
  } catch (error) {
    console.error("Erro ao buscar entrada por ID:", error);
    emit("preencher-itens", []);
    emit("entrada-selecionada", null);
  }
};
</script>