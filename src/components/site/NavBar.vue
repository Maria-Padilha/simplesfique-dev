<template>
  <!-- NAVBAR DO SITE -->
  <v-app-bar  class="background-navbar pl-5" elevation="0">
    <v-sheet width="45px" class="bg-transparent">
      <v-img alt="logo da empresa" :src="require('@/assets/img/logo/logo.png')" cover/>
    </v-sheet>
    <p class="font-semibold lg:text-xl text-lg texto-color-primary uppercase mt-1">imples <span class="texto-color-laranja">Fique</span></p>

    <v-list v-if="!menu" class="flex bg-transparent ml-10 mt-1 gap-3" :lines="false" density="compact" nav>
      <v-list-item
          v-for="(item, index) in links"
          :key="index"
          :to="item.route"
          :value="index"
          rounded="0"
          active-class="background-laranja"
      >
        <template #title>
          <p class="texto-16px font-normal" :class="themeStore.darkMode ? 'text-white' : 'text-black'">
            {{ item.name }}
          </p>
        </template>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-btn
          v-if="!menu"
          size="small" prepend-icon="mdi-account-outline"
          class="text-none" color="var(--text-color-laranja)"
          variant="flat" to="/login"
      >Acessar</v-btn>

      <v-btn
          v-if="!menu"
          :class="themeStore.darkMode ? 'text-orange' : 'text-black'"
          :prepend-icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          :color="themeStore.darkMode ? '#F1F1F1' : '#121212'" size="small"
          variant="tonal" @click="alterarTema" class="text-none mr-3 ml-2"
      >{{ themeStore.darkMode ? 'Claro' : 'Escuro' }}</v-btn>

      <v-btn icon v-if="menu" @click="drawer = !drawer">
        <AlignRight v-if="!drawer"/>
        <X v-else/>
      </v-btn>
    </template>
  </v-app-bar>

  <!-- MENU RESPONSIVO -->
  <v-navigation-drawer v-if="drawer" v-model="drawer" location="end" class="background-navbar" width="220">
    <v-list-item title="SimplesFique" subtitle="Menu"></v-list-item>
    <v-divider></v-divider>
    <v-list class="bg-transparent mt-1" :lines="false" density="compact" nav>
      <v-list-item
          v-for="(item, index) in links"
          :key="index"
          :to="item.route"
          :title="item.name"
          :value="index"
          rounded="0"
          active-color="var(--text-color-laranja)"
      />

      <v-btn
          :class="themeStore.darkMode ? 'text-orange' : 'text-black'"
          :prepend-icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          :color="themeStore.darkMode ? '#F1F1F1' : '#121212'" size="small"
          variant="tonal" @click="alterarTema" class="text-none w-100 mr-3 mt-4"
      >{{ themeStore.darkMode ? 'Tema Claro' : 'Tema Escuro' }}</v-btn>

      <v-btn
          size="small" prepend-icon="mdi-account-outline"
          class="text-none w-100 mr-3 mt-2" color="var(--text-color-laranja)"
          variant="flat" to="/login"
      >
        Acessar
      </v-btn>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {AlignRight, X} from 'lucide-vue-next';

// alterando o tema do site
const themeStore = useThemeStore();
const alterarTema = () => {
  themeStore.darkMode = !themeStore.darkMode
  themeStore.darkMode ? themeStore.tipoBtn = true : themeStore.tipoBtn = false
}

// links da página
const links = ref([
  {route: '/', name: 'Home'},
  {route: '/funcionalidades', name: 'Funcionalidades'},
  {route: '/integracoes', name: 'Integrações'},
  {route: '/planos', name: 'Planos'},
  {route: '/blog', name: 'Blog'},
]);

// menu responsivo

const drawer = ref(false);
const menu = ref(false);

const onResize = () => {
  menu.value = window.innerWidth <= 857;
  drawer.value = false;
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped>
.background-navbar {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.texto-16px {
  font-size: 16px;
}
</style>