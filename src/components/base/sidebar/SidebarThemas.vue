<template>

  <!-- titulo -->
  <p class="text-sm texto-color-primary">Aparência</p>

  <!-- modo escuro / claro -->
  <section class="mt-3 px-5 py-3 background-primary">
    <p class="texto-pequeno-15 mb-3">Tema do site</p>

    <div @click="alterarTema" :class="['theme-switch cursor-pointer', themeStore.darkMode ? 'dark' : 'light']">
      <p class="label light-label">Modo Escuro</p>
      <p class="label dark-label">Modo Claro</p>

      <div class="switch-toggle">
        <v-icon class="icon" size="15px" :icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"/>
      </div>
    </div>
  </section>

  <!-- brilho -->
  <section class="mt-3 px-5 py-3 background-primary">
    <p class="texto-pequeno-15">Alterar Brilho</p>

    <div class="mt-3">
      <!--        <v-btn-->
      <!--            icon="mdi-brightness-5" variant="tonal"-->
      <!--            :class="themeStore.darkMode ? 'text-dark-orange' : 'text-orange'"-->
      <!--            @click="themeStore.brightness = themeStore.brightness === 1 ? 0.6 : 1"-->
      <!--        />-->

      <v-container class="px-0 py-0">
        <v-slider hide-details v-model="themeStore.brightness" min="0.3" max="1" step="0.1" label="Brilho"/>
      </v-container>
    </div>
  </section>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";

const themeStore = useThemeStore();

const alterarTema = () => {
  themeStore.darkMode = !themeStore.darkMode
  themeStore.darkMode ? themeStore.tipoBtn = true : themeStore.tipoBtn = false
}
</script>