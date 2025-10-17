<template>
  <main class="my-12 mx-10">
    <h1 class="text-2xl mb-5">Modais já disponíveis</h1>

    <v-btn @click="modal = !modal" variant="tonal" color="var(--text-color-laranja)">Modal País</v-btn>

    <v-dialog v-model="modal" max-width="500">
      <v-card color="var(--bg-card)" class="texto-color-primary">
        <v-card-title class="background-laranja d-flex align-center">
          <p>Pesquisar País</p>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="modal = false" />
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
              <v-btn icon="mdi-chevron-left" rounded="0" color="var(--text-color-laranja)" size="small" density="compact" variant="flat" />
              <v-btn icon="mdi-chevron-right" rounded="0" color="var(--text-color-laranja)" size="small" density="compact" variant="flat" />
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="modal = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import {useThemeStore} from "@/stores/config-temas/theme";

const themeStore = useThemeStore();
const modal = ref(false);

const pesquisar = () => {
  console.log('Pesquisar país...');
};
</script>