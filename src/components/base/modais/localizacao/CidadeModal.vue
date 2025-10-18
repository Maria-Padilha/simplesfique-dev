<template>
  <localizacao-padrao-modal
      :headers="headers"
      :pesquisar="pesquisar"
      :modal="modal"
      :close-modal="closeModal"
      @selecionar="selecionarCidade"
  >
    <template #title>Cidade</template>

    <template #tbody="{ selecionar }">
      <tr
          v-for="cidade in cidades"
          :key="cidade.codigo"
          @click="selecionar(cidade)"
      >
        <td>{{ cidade.codigo }}</td>
        <td>{{ cidade.cidade }}</td>
        <td>{{ cidade.uf }}</td>
        <td>{{ cidade.ddd }}</td>
      </tr>
    </template>

    <template #paginacao>
      <p class="text-sm opacity-70">Exibindo 50 de 1500</p>
      <div class="flex items-center gap-1">
        <v-btn icon="mdi-chevron-left" color="var(--text-color-laranja)" size="small" variant="flat" class="text-white" density="comfortable" />
        <v-btn icon="mdi-chevron-right" color="var(--text-color-laranja)" size="small" variant="flat" class="text-white" density="comfortable" />
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
import { ref, defineProps, defineEmits } from "vue";

const cadastrarModal = ref(false);

const props = defineProps({
  modal: Boolean,
  closeModal: Function,
});

const emit = defineEmits(["selecionar"]);

const headers = [
  {text: "Código", value: "codigo"},
  {text: "Cidade", value: "pais"},
  {text: "UF", value: "uf"},
  {text: "DDD", value: "ddd"},
];

const cidades = ref([
  {codigo: "001", cidade: "Cuiabá", uf: "MT", ddd: "65"},
  {codigo: "002", cidade: "Várzea Grande", uf: "MT", ddd: "65"},
  {codigo: "003", cidade: "Rondonópolis", uf: "MT", ddd: "66"},
  {codigo: "004", cidade: "Sinop", uf: "MT", ddd: "66"},
  {codigo: "005", cidade: "Tangará da Serra", uf: "MT", ddd: "65"},
]);

const pesquisar = () => {
  cadastrarModal.value = !cadastrarModal.value;
};

// emite a cidade selecionada para o componente pai (ex: EmpresasView)
const selecionarCidade = (cidade) => {
  emit("selecionar", cidade);
  props.closeModal();
};
</script>