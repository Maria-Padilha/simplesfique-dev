<template>
  <localizacao-padrao-modal
      :headers="headers"
      :pesquisar="pesquisar"
      :modal="modal"
      :close-modal="closeModal"
      @selecionar="selecionarAtividade"
  >
    <template #title>Atividade</template>

    <template #tbody="{ selecionar }">
      <tr
          v-for="atividade in atividades"
          :key="atividade.codigo"
          @click="selecionar(atividade)"
      >
        <td>{{ atividade.codigo }}</td>
        <td>{{ atividade.atividade }}</td>
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
          <v-text-field label="Atividade" variant="outlined" density="comfortable" hide-details="auto" />

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
  { text: "Atividade", value: "atividade" },
];

const atividades = ref([
  { codigo: "001", atividade: "Desenvolvimento de Software" },
  { codigo: "002", atividade: "Consultoria em TI" },
  { codigo: "003", atividade: "Manutenção de Computadores" },
  { codigo: "004", atividade: "Design Gráfico" },
  { codigo: "005", atividade: "Marketing Digital" },
]);

const pesquisar = () => {
  cadastrarModal.value = !cadastrarModal.value;
};

// Quando o usuário clicar em uma linha
const selecionarAtividade = (atividade) => {
  emit("selecionar", atividade);
  props.closeModal();
};
</script>