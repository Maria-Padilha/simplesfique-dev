<template>
  <localizacao-padrao-modal
      :headers="headers"
      :pesquisar="pesquisar"
      :modal="modal"
      :close-modal="closeModal"
      @selecionar="selecionarCidade"
      :termo-pesquisa="termoPesquisar"
  >
    <template #title>Cidade</template>

    <template #tbody="{ selecionar }">
      <tr v-if="cidadeStore.loading">
        <td colspan="4">Buscando Cidades...</td>
      </tr>

      <tr
          v-else
          v-for="cidade in cidades"
          :key="cidade.codigo"
          @click="selecionar(cidade)"
      >
        <td>{{ cidade.ID }}</td>
        <td>{{ cidade.DESCCIDADE }}</td>
        <td>{{ cidade.ID_UF }}</td>
        <td>{{ cidade.DDD }}</td>
      </tr>
    </template>

    <template #paginacao>
      <p class="text-sm opacity-70">Exibindo {{qtdAtual}} de {{records}}</p>
      <div class="flex items-center gap-1">
        <v-btn
            icon="mdi-chevron-left"
            color="var(--text-color-laranja)"
            size="small" variant="flat" class="text-white"
            density="comfortable"
            @click="cidadesAnteriores"
        />

        <v-btn
            icon="mdi-chevron-right"
            color="var(--text-color-laranja)"
            size="small" variant="flat" class="text-white"
            density="comfortable"
            @click="proximasCidades"
        />
      </div>
    </template>
  </localizacao-padrao-modal>
</template>

<script setup>
import LocalizacaoPadraoModal from "@/components/base/modais/localizacao/LocalizacaoPadraoModal.vue";
import { ref, defineProps, defineEmits, watchEffect, computed } from "vue";
import {useLocalizacaoStore} from "@/stores/APIs/localizacao";

const props = defineProps({
  modal: Boolean,
  closeModal: Function,
});

const emit = defineEmits(["selecionar"]);

const selecionarCidade = (cidade) => {
  emit("selecionar", cidade);
  props.closeModal();
};

const headers = [
  {text: "Código", value: "codigo"},
  {text: "Cidade", value: "pais"},
  {text: "UF", value: "uf"},
  {text: "DDD", value: "ddd"},
];

const termoPesquisar = ref("");

/**
 * Trabalhando com a API de cidades
 */
const cidadeStore = useLocalizacaoStore();
const cidades = computed(() => cidadeStore.cidades);
const records = computed(() => cidadeStore.recordsCidades);
const qtdAtual = computed(() => {
  return Math.min(offsetAtual.value + cidades.value.length, records.value || 0);
});

const offsetAtual = ref(0);
const limit = ref(50);

watchEffect(async () => {
  if (props.modal && cidades.value.length === 0) {
    offsetAtual.value = 0;
    await cidadeStore.buscarTodasCidades(limit.value, offsetAtual.value);
  }
});

/**
 * Função para buscar as próximas cidades na lista
 */
const proximasCidades = async () => {
  // só busca se ainda houver mais cidades
  if (offsetAtual.value + limit.value < records.value) {
    offsetAtual.value += limit.value;
    await cidadeStore.buscarTodasCidades(limit.value, offsetAtual.value);
  }
};

/**
 * Função para buscar as cidades anteriores na lista
 */
const cidadesAnteriores = async () => {
  // evita offset negativo
  if (offsetAtual.value - limit.value >= 0) {
    offsetAtual.value -= limit.value;
    await cidadeStore.buscarTodasCidades(limit.value, offsetAtual.value);
  }
};
</script>