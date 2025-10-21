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

  <v-dialog v-model="cadastrarModal" max-width="400">
    <v-card color="var(--bg-card)" class="texto-color-primary">
      <v-card-title class="background-laranja d-flex align-center">
        <p>Cadastrar</p>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="cadastrarModal = false" />
      </v-card-title>
      <v-card-text>
        <v-form class="d-flex flex-column gap-3">
          <v-text-field label="Cidade" variant="outlined" density="comfortable" hide-details="auto" />
          <v-text-field label="UF" variant="outlined" density="comfortable" hide-details="auto" />
          <v-text-field label="DDD" variant="outlined" density="comfortable" hide-details="auto" />

          <v-btn
              color="var(--text-color-laranja)"
              class="w-100 text-none"
              variant="tonal"
              density="comfortable"
          >
            Cadastrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import LocalizacaoPadraoModal from "@/components/base/modais/localizacao/LocalizacaoPadraoModal.vue";
import { ref, defineProps, defineEmits, watchEffect, computed } from "vue";
import {useCidadeStore} from "@/stores/APIs/cidade";

const cadastrarModal = ref(false);

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
const pesquisar = () => {
  cadastrarModal.value = !cadastrarModal.value;
};

/**
 * Trabalhando com a API de cidades
 * @type {Store<"cidade", {cidade: null, records: number, errorMessage: string, cidades: [], loading: boolean, successMessage: string, token: string}, {}, {buscarTodasCidades(number=, number=): Promise<void>}>}
 */
const cidadeStore = useCidadeStore();
const cidades = computed(() => cidadeStore.cidades);
const records = computed(() => cidadeStore.records);
const qtdAtual = computed(() => {
  return Math.min(offsetAtual.value + cidades.value.length, records.value || 0);
});

const offsetAtual = ref(0);
const limit = ref(50);

watchEffect(() => {
  if (props.modal && cidades.value.length === 0) {
    offsetAtual.value = 0;
    cidadeStore.buscarTodasCidades(limit, offsetAtual.value);
  }
});

/**
 * Função para buscar as próximas cidades na lista
 */
const proximasCidades = () => {
  // só busca se ainda houver mais cidades
  if (offsetAtual.value + limit.value < records.value) {
    offsetAtual.value += limit.value;
    cidadeStore.buscarTodasCidades(limit.value, offsetAtual.value);
  }
};

/**
 * Função para buscar as cidades anteriores na lista
 */
const cidadesAnteriores = () => {
  // evita offset negativo
  if (offsetAtual.value - limit.value >= 0) {
    offsetAtual.value -= limit.value;
    cidadeStore.buscarTodasCidades(limit.value, offsetAtual.value);
  }
};
</script>