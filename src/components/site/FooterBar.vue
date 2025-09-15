<template>
  <!-- Iniciando o footer -->
  <footer class="flex flex-col background-navbar" color="var(--bg-navbar) relative z-10">
      <div class=" flex flex-col items-center justify-center py-3">
        <!-- logo -->
        <v-sheet width="40px" height="auto" color="transparent">
          <v-img
              width="100%" height="100%" alt="logo"
              :src="themeStore.darkMode ? require('@/assets/img/logo/logo.png') : require('@/assets/img/logo/logo-dark.png')"
          />
        </v-sheet>

        <!-- texto informativo -->
        <p class="text-sm text-center mt-3">
          Lorem Ipsum simply dummy text of the printing and typesetting industry. <br> Lorem Ipsum has been the industry's standard
        </p>

        <!-- icones sociais -->
        <div class="flex gap-y-2 gap-x-3">
          <v-btn
              v-for="icon in icons" :key="icon.id"
              :icon="icon.icon" :to="icon.link" size="x-small"
              variant="outlined" class="mt-4" color="var(--text-color)"
          />
        </div>
      </div>

      <v-divider class="my-2 border-opacity-25"></v-divider>

      <p class="text-text-primary text-center texto-pequeno my-5 opacity-70">&copy; Todos os direitos reservados</p>
  </footer>
  <!-- Finalizando o footer -->
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import { ref } from 'vue';

const themeStore = useThemeStore();

// loop de repetição para a criação dos icons sociais
const icons = ref([
  {id: 1, icon: 'mdi-linkedin', link: ''},
  {id: 2, icon: 'mdi-twitter', link: ''},
  {id: 3, icon: 'mdi-instagram', link: ''},
])
</script>