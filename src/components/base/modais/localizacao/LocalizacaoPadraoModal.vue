<template>
  <v-dialog v-model="modal" max-width="700">
    <v-card color="var(--bg-card)" class="texto-color-primary">
      <v-card-title class="background-laranja d-flex align-center">
        <p>Pesquisar <slot name="title" /></p>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeModal" />
      </v-card-title>

      <v-card-text>
        <!-- CAMPO DE PESQUISA -->
        <v-text-field
            variant="outlined"
            hide-details
            label="Pesquisar"
            class="mb-5"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            append-inner-icon="mdi-plus"
            v-model="localTermoPesquisa"
            @click:appendInner="props.pesquisar"
        />

        <!-- TABELA -->
        <v-table
            class="mb-2 cursor-pointer"
            :theme="themeStore.darkMode ? 'dark' : 'light'"
            striped="even"
            height="300px"
            fixed-header
        >
          <thead>
          <tr>
            <th
                class="text-left"
                v-for="(header, i) in props.headers"
                :key="i"
            >
              {{ header.text }}
            </th>
          </tr>
          </thead>
          <tbody>
          <slot name="tbody" :selecionar="emitSelecionar" />
          </tbody>
        </v-table>

        <!-- PAGINAÇÃO -->
        <div class="flex items-center justify-between">
          <slot name="paginacao" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import { useThemeStore } from "@/stores/config-temas/theme";

const themeStore = useThemeStore();

const props = defineProps({
  modal: Boolean,
  closeModal: Function,
  pesquisar: Function,
  headers: Array,
  termoPesquisa: String,
});

const emit = defineEmits(["selecionar", "update:termoPesquisa"]);

const modal = computed(() => props.modal);

// 🔍 Faz o v-model funcionar com o prop "termoPesquisa"
const localTermoPesquisa = computed({
  get: () => props.termoPesquisa,
  set: (val) => emit("update:termoPesquisa", val),
});

const emitSelecionar = (item) => {
  emit("selecionar", item);
};
</script>

<style scoped>
.cursor-pointer tbody tr:hover {
  background-color: rgba(255, 165, 0, 0.15);
}
</style>