<template>
  <!-- Iniciando o footer -->
  <v-footer class="flex flex-col h-[200px]" color="var(--bg-navbar)">
    <v-sheet class="h-auto bg-transparent">
      <div class=" flex flex-col items-center justify-center py-3">
        <!-- logo -->
        <v-sheet width="40px" height="auto" color="transparent">
          <v-img width="100%" height="100%" alt="logo" :src="require('@/assets/img/logo/logo.png')"></v-img>
        </v-sheet>

        <!-- texto informativo -->
        <p class="text-sm text-center texto-color-primary mt-3">
          Lorem Ipsum simply dummy text of the printing and typesetting industry. <br> Lorem Ipsum has been the industry's standard
        </p>

        <!-- icones sociais -->
        <div class="flex gap-y-2 gap-x-3">
          <v-btn
              v-for="icon in icons" :key="icon.id"
              :icon="icon.icon" :to="icon.link" size="x-small"
              variant="outlined" class="mt-4" color="#D9D9D9"
          />
        </div>
      </div>
      <v-divider color="#fff" class="my-2 border-opacity-25"></v-divider>

      <!-- copy -->

      <p class="text-text-primary text-center texto-pequeno mt-5 text-white opacity-70">&copy; Todos os direitos reservados</p>
    </v-sheet>
  </v-footer>
  <!-- Finalizando o footer -->
</template>

<script setup>
// iniciando o js
import { ref } from 'vue';

// loop de repetição para a criação dos icons sociais
const icons = ref([
  {id: 1, icon: 'mdi-linkedin', link: ''},
  {id: 2, icon: 'mdi-twitter', link: ''},
  {id: 3, icon: 'mdi-instagram', link: ''},
])
</script>