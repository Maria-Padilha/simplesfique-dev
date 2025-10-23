<template>
  <v-menu
      v-model="localMenu"
      :close-on-content-click="false"
      location="bottom end"
      offset-y
  >
    <template #activator="{ props }">
      <v-icon
          v-bind="props"
          icon="mdi-magnify"
          size="25px"
          class="cursor-pointer"
      />
    </template>

    <v-card min-width="320" class="mt-1">
      <v-card-text class="pa-3">
        <v-text-field
            variant="outlined"
            hide-details="auto"
            label="Pesquisar"
            density="compact"
            append-inner-icon="mdi-magnify"
            v-model="modelInputProxy"
            @click:append-inner="pesquisar"
        />

        <div v-if="resultados.length" class="mt-3 flex flex-col gap-3">
          <p class="text-sm font-italic opacity-70">Resultados:</p>
          <slot name="resultados" :selecionar="emitSelecionar" />
        </div>

        <div v-else class="mt-3 flex flex-col gap-3">
          <p class="text-sm font-italic opacity-70">Nenhum resultado encontrado!</p>
        </div>

        <v-btn
            v-if="props.cadastrarBtn"
            color="var(--text-color-laranja)"
            variant="tonal"
            icon="mdi-plus-circle-outline"
            class="mt-4 w-100"
            rounded="sm"
            size="small"
            density="comfortable"
            @click="modalCadastrar"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  cadastrarBtn: {type: Boolean, default: false},
  pesquisar: Function,
  modalCadastrar: Function,
  modelInput: String,
  resultados: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "update:modelInput", "selecionar"]);

const localMenu = ref(props.modelValue);

watch(() => props.modelValue, (val) => (localMenu.value = val));
watch(localMenu, (val) => emit("update:modelValue", val));

const modelInputProxy = computed({
  get: () => props.modelInput,
  set: (val) => emit("update:modelInput", val),
});

const emitSelecionar = (item) => {
  emit("selecionar", item);
  localMenu.value = false; // fecha o menu ao selecionar
};
</script>
