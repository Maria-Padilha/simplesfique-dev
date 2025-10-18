<template>
  <localizacao-padrao-modal
      :headers="headers"
      :pesquisar="pesquisar"
      :modal="modal"
      :close-modal="closeModal"
      @selecionar="selecionarBairro"
  >
    <template #title>Bairro</template>

    <template #tbody="{ selecionar }">
      <tr
          v-for="bairro in bairros"
          :key="bairro.codigo"
          @click="selecionar(bairro)"
      >
        <td>{{ bairro.codigo }}</td>
        <td>{{ bairro.bairro }}</td>
        <td>{{ bairro.cidade }}</td>
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
          <v-text-field label="Bairro" variant="outlined" density="comfortable" hide-details="auto" />
          <v-autocomplete label="Cidade" variant="outlined" density="comfortable" hide-details="auto" :items="['Cuiabá', 'Varzea Grande']" />

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
  { text: "Código", value: "codigo" },
  { text: "Bairro", value: "bairro" },
  { text: "Cidade", value: "cidade" },
];

const bairros = ref([
  { codigo: "001", bairro: "Dom Aquino", cidade: "Cuiabá" },
  { codigo: "002", bairro: "Centro", cidade: "Várzea Grande" },
  { codigo: "003", bairro: "Jardim América", cidade: "Rondonópolis" },
  { codigo: "004", bairro: "Vila Nova", cidade: "Sinop" },
]);

const pesquisar = () => {
  cadastrarModal.value = !cadastrarModal.value;
};

// Repassa o item selecionado para o componente pai (EmpresasView)
const selecionarBairro = (bairro) => {
  emit("selecionar", bairro);
  props.closeModal();
};
</script>