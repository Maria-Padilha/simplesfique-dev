<template>
  <!-- SIDEBAR LATERAL -->
  <v-navigation-drawer
      :class="{'main-with-drawer': drawer && !rail}"
      class="background-sidebar menu-scroll"
      v-model="drawer" :temporary="rail"
      :permanent="!rail" expand-on-hover
  >
    <v-list class="mt-3">
      <v-menu>
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <v-list-item
                  v-bind="mergeProps(menu, tooltip)"
                  prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                  subtitle="sandra_a88@gmailcom"
                  title="Sandra Adams"
              />
            </template>
            <span>Menu</span>
          </v-tooltip>
        </template>

        <v-card class="mx-auto w-100">
          <v-list class="background-primary" :items="items" nav density="compact">
            <v-list-subheader class="color-btn">Menu</v-list-subheader>

            <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :value="item"
                :to="item.route"
            >
              <template v-slot:prepend>
                <v-icon size="20px" :icon="item.icon"></v-icon>
              </template>

              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-text-field
          hide-details variant="outlined" class="mt-7 mx-2" density="compact" append-inner-icon="mdi-magnify"
          placeholder="Pesquisar" @click:appendInner="errorModal = true"
      />
    </v-list>

    <v-divider class="mt-3"></v-divider>

    <v-list :lines="false" density="default" nav>
      <v-list-item
          v-for="(item, index) in links"
          class="text-sm"
          :key="index"
          :to="item.route"
          :title="item.name"
          :value="index"
          active-class="hover-link"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" size="21px"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!-- FIM SIDEBAR LATERAL -->

  <!-- NAVBAR NO TOPO -->
  <v-app-bar class="py-2 z-10 background-navbar" elevation="0" density="compact">
    <v-icon icon="mdi-menu" size="25px" class="ml-5 cursor-pointer" @click="drawer = !drawer"></v-icon>
    <p class="font-weight-bold ml-5 mt-1">Simples Fique</p>

    <v-spacer></v-spacer>

    <div @click="alterarTema" :class="['theme-switch cursor-pointer mr-5', themeStore.darkMode ? 'dark' : 'light']">
      <p class="label light-label">Escuro</p>
      <p class="label dark-label">Claro</p>

      <div class="switch-toggle">
        <v-icon class="icon" size="15px" :icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"/>
      </div>
    </div>
  </v-app-bar>
  <!-- FIM NAVBAR NO TOPO -->

  <!-- MODAL DE ERRO - PESQUISA (PROVISÓRIO) -->
  <ErrorAlertModal :error="false" v-model:modal="errorModal">
    <template #erro>O recurso de busca está em desenvolvimento e será disponibilizado em breve.</template>
  </ErrorAlertModal>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {ref, onMounted, onBeforeUnmount, mergeProps} from 'vue'
import ErrorAlertModal from "@/components/base/modais/ErrorAlertModal.vue";

// Alterando o tema do site
const themeStore = useThemeStore();

const alterarTema = () => {
  themeStore.darkMode = !themeStore.darkMode
  themeStore.darkMode ? themeStore.tipoBtn = true : themeStore.tipoBtn = false
}

// modal de erro
const errorModal = ref(false);

// links do menu perfil
const items = ref([
  { text: 'Perfil', icon: 'mdi-account-outline', route: '/paginas/perfil' },
  { text: 'Configurações', icon: 'mdi-cog-outline', route: '/paginas/config' },
  { text: 'Sair', icon: 'mdi-logout', route: '/' },
])

// links do sidebar
const links = ref([
  {route: '/paginas/home', name: 'Home', icon: 'mdi-home'},
  {route: '/paginas/terminal-vendas', name: 'Term. de Vendas', icon: 'mdi-cart'},
  {route: '/paginas/ordem-servico', name: 'Term. de Ordem de Serviço', icon: 'mdi-clipboard-list'},
  {route: '/paginas/grade-cor-tamanho', name: 'Grade de Cor e Tamanho', icon: 'mdi-grid'},
  {route: '/paginas/whatsapp', name: 'Whatsapp', icon: 'mdi-whatsapp'},
  {route: '/paginas/email', name: 'E-mail', icon: 'mdi-email'},
  {route: '/paginas/sms', name: 'SMS', icon: 'mdi-message'},
  {route: '/paginas/comissao-vendedores', name: 'Comissão de Vendedores', icon: 'mdi-percent'},
  {route: '/paginas/plano-contas', name: 'Plano de Contas', icon: 'mdi-file-document-outline'},
  {route: '/paginas/contas-pagar', name: 'Contas a Pagar', icon: 'mdi-arrow-down-circle'},
  {route: '/paginas/contas-receber', name: 'Contas a Receber', icon: 'mdi-arrow-up-circle'},
  {route: '/paginas/controle-caixa', name: 'Controle de Caixa', icon: 'mdi-cash'},
  {route: '/paginas/controle-bancario', name: 'Controle Bancário', icon: 'mdi-bank'},
  {route: '/paginas/documentos-fiscais', name: 'Documentos Fiscais', icon: 'mdi-file-cabinet'},
  {route: '/paginas/sped-fiscal', name: 'Sped Fiscal', icon: 'mdi-file-check'},
  {route: '/paginas/ia', name: 'Inteligência Artificial', icon: 'mdi-brain'},
  {route: '/paginas/area-contador', name: 'Área do Contador', icon: 'mdi-briefcase'},
  {route: '/paginas/aplicativo', name: 'Aplicativo', icon: 'mdi-cellphone'},
  {route: '/paginas/controle-mesa', name: 'Controle de Restaurante', icon: 'mdi-silverware-fork-knife'},
  {route: '/paginas/integracao-balanca', name: 'Integração Balança', icon: 'mdi-scale'},
  {route: '/paginas/terminal-autonomo', name: 'Term. Autônomo de Vendas', icon: 'mdi-monitor'},
  {route: '/paginas/pdv-onoff', name: 'PVD On-Off', icon: 'mdi-power'},
])

// Ajustando o sidebar para ficar responsivo
const drawer = ref(true);
const rail = ref(false);

const onResize = () => {
  drawer.value = window.innerWidth >= 967;
  rail.value = window.innerWidth <= 967;
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  onResize();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

</script>

<!-- CSS DA PAGINA -->
<style scoped>
.background-navbar {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.color-btn {
  color: var(--text-color-laranja);
}

.background-sidebar {
  background: var(--bg-navbar);
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.hover-link {
  background-color: var(--bg-navbar-hover);
  color: var(--color-text-navbar);
}

.menu-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--bg-color) var(--bg-navbar);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>