<template>
  <v-app>
    <side-bar v-if="$route.path.startsWith('/paginas/')" />
    <v-main class="background-primary">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import SideBar from "@/components/base/SidebarComponent.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {watch} from "vue";

const themeStore = useThemeStore();

watch(
    () => themeStore.darkMode,
    (isDark) => {
      const el = document.documentElement
      el.classList.toggle('dark', isDark)
      el.classList.toggle('light', !isDark)
    },
    { immediate: true }
)

</script>
