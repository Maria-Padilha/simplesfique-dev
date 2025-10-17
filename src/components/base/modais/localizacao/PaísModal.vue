<template>
  <v-dialog v-model="modal" max-width="500">
    <v-card color="var(--bg-card)" class="texto-color-primary">
      <v-card-title class="background-laranja d-flex align-center">
        <p>Pesquisar País</p>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeModal" />
      </v-card-title>

      <v-card-text>
        <v-text-field
            variant="outlined" hide-details label="Nome" class="mb-5"
            density="comfortable" append-inner-icon="mdi-magnify"
            @click:appendInner="pesquisar"
        />

        <v-table class="mb-2" :theme="themeStore.darkMode ? 'dark' : 'light'" striped="even">
          <thead >
          <tr>
            <th class="text-left">País</th>
            <th class="text-left">Código</th>
          </tr>
          </thead>
          <tbody >
          <tr>
            <td>Brasil</td>
            <td>BR</td>
          </tr>
          <tr>
            <td>Argentina</td>
            <td>AR</td>
          </tr>
          <tr>
            <td>Chile</td>
            <td>CL</td>
          </tr>
          </tbody>
        </v-table>

        <div class="flex items-center justify-between">
          <p class="text-sm opacity-70">Exibindo 50 de 1500</p>
          <div class="flex items-center gap-2">
            <v-btn icon="mdi-chevron-left" rounded="sm" color="var(--text-color-laranja)" size="small" density="compact" variant="flat" />
            <v-btn icon="mdi-chevron-right" rounded="sm" color="var(--text-color-laranja)" size="small" density="compact" variant="flat" />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {defineProps, computed, watchEffect} from 'vue';
import {useThemeStore} from "@/stores/config-temas/theme";
import {usePaísStore} from "@/stores/APIs/pais";

const themeStore = useThemeStore();
const paísStore = usePaísStore();

const modal = computed(() => props.modal);
const paises = computed(() => paísStore.paises);

const props = defineProps({
  modal: {
    type: Boolean,
    default: false
  },
  closeModal: {
    type: Function,
    default: () => {}
  }
});

const pesquisar = () => {
  console.log('Pesquisar país...');
};

watchEffect(() => {
  paísStore.buscarTodosPaises();
});

console.log(paises.value);
</script>