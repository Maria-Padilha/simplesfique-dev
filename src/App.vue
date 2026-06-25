  <template>
  <v-app :style="{ filter: `brightness(${themeStore.brightness})` }">

    <side-bar v-if="$route.path.startsWith('/paginas/') && !$route.path.startsWith('/paginas/pdv/caixa') && $route.path !== '/paginas/pdv' && $route.path !== '/paginas/pdv/pagamento'" />

    <nav-bar
        v-if="!$route.path.startsWith('/paginas/')
        && !$route.path.startsWith('/terminais-venda')
        && !$route.path.startsWith('/login')
        && !$route.path.startsWith('/resetar-senha')
        && !$route.path.startsWith('/paginas/pdv/caixa')
        && $route.path !== '/paginas/pdv'
        && $route.path !== '/paginas/pdv/pagamento'"
    />

    <v-main class="background-primary">
      <router-view />
    </v-main>

    <footer-bar
        class="relative z-10"
        v-if="!$route.path.startsWith('/paginas/')
        && !$route.path.startsWith('/terminais-venda')
        && !$route.path.startsWith('/login')
        && !$route.path.startsWith('/resetar-senha')
        && !$route.path.startsWith('/manutencao')
        && !$route.path.startsWith('/paginas/pdv/caixa')
        && $route.path !== '/paginas/pdv'
        && $route.path !== '/paginas/pdv/pagamento'"
    />
  </v-app>
</template>

<script setup>
import SideBar from "@/components/base/sidebar/SidebarComponent.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {watch} from "vue";
import FooterBar from "@/components/site/FooterBar.vue";
import NavBar from "@/components/site/NavBar.vue";
// import SidebarThemas from "@/components/base/sidebar/SidebarThemas.vue";

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
