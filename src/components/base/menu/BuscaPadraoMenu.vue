<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" icon="mdi-magnify" size="25px" @click="overlay = true" />
    </template>

    <v-overlay v-model="overlay" activator="parent" location-strategy="connected" scroll-strategy="block">
      <v-card min-width="300" class="mt-5">
        <v-card-text class="pa-3">
          <v-text-field
              variant="outlined"
              hide-details="auto"
              label="Pesquisar"
              density="compact"
              append-inner-icon="mdi-magnify"
              v-model="modelInput"
              @click:appendInner="pesquisar"
          />

          <div v-if="resultados.length" class="mt-3 flex flex-col gap-3">
            <p class="text-sm font-italic opacity-70 mb-2">Resultados:</p>
            <slot name="resultados" :selecionar="emitSelecionar" />
          </div>

          <div v-else class="mt-3 flex flex-col gap-3">
            <p class="text-sm font-italic opacity-70 mb-2">Nenhum resultado encontrado!</p>

            <v-btn
                color="var(--text-color-laranja)"
                variant="tonal"
                icon="mdi-plus-circle-outline"
                class="mt-4 w-100"
                rounded="sm"
                size="small"
                density="comfortable"
                @click="modalCadastrar"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-overlay>
  </v-menu>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  menu: {
    type: Boolean,
    default: false,
  },
  overlay: {
    type: Boolean,
    default: false,
  },
  pesquisar: {
    type: Function,
    required: true,
  },
  modelInput: {
    type: String,
    default: "",
  },
  modalCadastrar: {
    type: Function,
    required: true,
  },
  resultados: {
    type: Array,
    default: () => [],
  },
});

const menu = computed(() => props.menu);
const overlay = computed(() => props.overlay);
const resultados = computed(() => props.resultados);

const emit = defineEmits(["selecionar", "update:modelInput"]);

const modelInput = computed({
  get: () => props.modelInput,
  set: (val) => emit("update:modelInput", val),
});

const emitSelecionar = (item) => {
  emit("selecionar", item);
};
</script>