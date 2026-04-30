<template>
  <!-- NAVBAR DO SITE -->
  <v-app-bar class="background-navbar px-5 py-2" elevation="0">
    <div class="flex items-center ml-2">
      <v-sheet width="40px" class="bg-transparent">
        <v-img
            alt="logo da empresa" cover
            :src="!themeStore.darkMode ? require('@/assets/img/logo/logo-dark.png') : require('@/assets/img/logo/logo.png')"
        />
      </v-sheet>

      <p class="texto-color-primary uppercase text-xl md:text-2xl font-semibold">
        imples <span class="texto-color-laranja">Fique</span>
      </p>
    </div>

    <template v-slot:append>
      <v-list v-if="!menu" class="desktop-nav bg-transparent d-flex align-center pa-0 mr-4" :lines="false" density="compact" nav>
        <v-list-item
            v-for="(item, index) in links"
            :key="index"
            :to="item.route"
            :value="index"
            rounded="xl"
            class="nav-item mx-1"
            active-class="nav-item-active"
        >
          <template #title>
              <span
                  class="nav-text"
                  :class="themeStore.darkMode ? 'text-white' : 'text-black'"
              >
                {{ item.name }}
              </span>
          </template>
        </v-list-item>
      </v-list>

      <v-btn
          v-if="!menu"
          prepend-icon="mdi-account-outline"
          class="text-none text-white" color="var(--text-color-laranja)"
          variant="flat" to="/login"
          rounded
      >
        Acessar
      </v-btn>

      <v-btn
          v-if="!menu" rounded
          :class="themeStore.darkMode ? 'text-orange' : 'text-black'"
          :prepend-icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          :color="themeStore.darkMode ? '#F1F1F1' : '#121212'"
          variant="tonal" @click="alterarTema" class="text-none mr-3 ml-2"
      >
        {{ themeStore.darkMode ? 'Claro' : 'Escuro' }}
      </v-btn>

      <v-btn icon v-if="menu" @click="drawer = !drawer">
        <AlignRight v-if="!drawer"/>
        <X v-else/>
      </v-btn>
    </template>
  </v-app-bar>

  <!-- MENU DE NAVEGAÇÃO MOBILE -->
  <v-navigation-drawer v-model="drawer" width="850" color="var(--bg-color)" @click="drawer = false">
    <v-sheet v-if="drawer" width="100%" height="100%"  class="d-flex padding-bottom flex-column absolute z-10 px-10 py-10 bg-transparent">
      <div class="h-[550px] flex flex-col items-center justify-center texto-color-primary">
        <v-btn
              v-for="(link, index) in links" :key="index" variant="text"
              :to="link.route" class="text-none my-3">{{ link.name }}
          </v-btn>

        <v-btn
          :class="themeStore.darkMode ? 'text-orange' : 'text-black'"
          :prepend-icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
          :color="themeStore.darkMode ? '#F1F1F1' : '#121212'" size="small"
          variant="tonal" @click="alterarTema" class="text-none mt-4 w-[300px]"
          >{{ themeStore.darkMode ? 'Tema Claro' : 'Tema Escuro' }}
          </v-btn>

        <v-btn
              size="small" prepend-icon="mdi-account-outline"
              class="text-none w-[300px] text-white mt-2" color="var(--text-color-laranja)"
              variant="flat" to="/login"
          >
            Acessar
          </v-btn>
      </div>
    </v-sheet>
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
.desktop-nav {
  gap: 4px;
}

.nav-item {
  min-height: 44px;
  padding-inline: 10px;
  border-radius: 14px !important;
  transition: all 0.25s ease;
}

.nav-item:hover {
  background: rgba(255, 153, 0, 0.08);
}

.nav-item :deep(.v-list-item__content) {
  overflow: visible;
}

.nav-text {
  font-size: 18px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.nav-item-active {
  background: var(--text-color-laranja);
}

.nav-item-active .nav-text {
  color: white !important;
  font-weight: 700;
}

.padding-bottom{
  padding-bottom: 150px;
}

.background-navbar {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.texto-16px {
  font-size: 16px;
}
</style>