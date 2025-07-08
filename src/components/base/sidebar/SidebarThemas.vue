<template>
  <!-- Botão para abrir sidebar de temas -->
  <v-fab
      color="orange" absolute
      location="right center" icon
      class="mr-2" @click="drawer = !drawer"
      :variant="themeStore.tipoBtn ? 'tonal' : 'flat'"
  >
    <v-icon icon="mdi-cog-outline" class="slow-spin" size="25px"></v-icon>
  </v-fab>

  <!-- Sidebar de temas -->
  <v-navigation-drawer
      v-if="drawer"
      v-model="drawer" temporary width="300"
      location="right"
      class="background-secondary"
  >

    <!-- titulo -->
    <section class="w-100 py-4 d-flex align-center justify-space-between px-5 background-third">
      <p class="text-xl">Aparência</p>
      <v-icon @click="drawer = false" icon="mdi-close" class="cursor-pointer" size="25px"></v-icon>
    </section>

    <!-- modo escuro / claro -->
    <section class="mt-5 px-5 py-3 background-primary">
      <p class="texto-pequeno-15">Tema do site</p>

      <div class="d-flex align-center ga-5 mt-3">
        <v-btn
            :class="themeStore.darkMode ? 'text-orange' : 'text-white'"
            :icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
            :color="themeStore.darkMode ? '#F1F1F1' : '#121212'"
            variant="flat"
            @click="themeStore.darkMode = !themeStore.darkMode"
        />
        <p class="text-lg">{{ themeStore.darkMode ? 'Modo Claro' : 'Modo Escuro' }}</p>
      </div>
    </section>

    <!-- brilho -->
    <section class="mt-5 px-5 py-3 background-primary">
      <p class="texto-pequeno-15">Alterar Brilho</p>

      <div class="d-flex align-center mt-3">
        <v-btn
            icon="mdi-brightness-5" variant="tonal"
            :class="themeStore.darkMode ? 'text-dark-orange' : 'text-orange'"
            @click="themeStore.brightness = themeStore.brightness === 1 ? 0.6 : 1"
        />

        <v-container>
          <v-slider hide-details v-model="themeStore.brightness" min="0.3" max="1" step="0.1" label="Brilho" />
        </v-container>
      </div>
    </section>

    <!-- aparencia dos botoes -->
    <section class="mt-5 px-5 py-3 background-primary">
      <p class="texto-pequeno-15">Aparência dos botões</p>

      <div class="mt-5 d-flex align-center ga-2">
        <v-btn
            class="w-[100%] text-none" size="small"
            :color="themeStore.tipoBtn ? '#00509d' : '#616161'"
            :variant="themeStore.darkMode ? 'flat' : 'tonal'"
            @click="themeStore.tipoBtn = true">Com Opacidade
        </v-btn>

        <v-btn
            class="w-[100%] text-none" size="small"
            :color="!themeStore.tipoBtn ? '#00509d' : '#616161'"
            :variant="themeStore.darkMode ? 'flat' : 'tonal'"
            @click="themeStore.tipoBtn = false">Sem Opacidade
        </v-btn>
      </div>
    </section>
  </v-navigation-drawer>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {ref} from "vue";

const themeStore = useThemeStore();

// abrir / fechar sidebar
const drawer = ref(false);
</script>