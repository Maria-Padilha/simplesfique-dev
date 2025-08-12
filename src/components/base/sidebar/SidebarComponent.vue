<template>
  <!-- NAVBAR NO TOPO -->
  <v-app-bar class="py-2 z-10 background-navbar" elevation="0" density="compact">
    <v-icon icon="mdi-menu" size="25px" class="ml-5 cursor-pointer" @click="openSidebar"></v-icon>
    <p class="font-weight-bold ml-5 mt-1">Simples Fique</p>

    <v-spacer></v-spacer>

    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <v-list-item
                class="w-[200px] truncate whitespace-nowrap overflow-hidden"
                v-bind="mergeProps(menu, tooltip)"
                append-avatar="https://randomuser.me/api/portraits/women/85.jpg"
                subtitle="sandra_a88@gmailcom"
                title="Sandra Adams"
            />
          </template>
          <span>Menu</span>
        </v-tooltip>
      </template>

      <v-card class="mx-auto w-[300px]">
        <v-list class="background-primary py-3" :items="items" nav density="compact">
          <v-list-subheader>
            <p class="text-sm font-medium color-btn">Seja bem vindo, <span class="font-normal">Sandra Adams</span></p>
            <span class="texto-color-primary">Painel de usuário Admin</span>
          </v-list-subheader>

          <v-divider thickness="2" class="my-3"/>

          <v-list-item v-for="(item, i) in items" :key="i" :value="item" :to="item.route">
            <template v-slot:prepend><v-icon size="20px" :icon="item.icon" /></template>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>

          <v-divider thickness="2" class="my-3"/>

          <div class="flex items-center justify-between w-100 px-5">
            <p class="text-sm font-semibold opacity-70">Tema da Aplicação</p>
            <v-btn
                :class="themeStore.darkMode ? 'text-orange' : 'text-black'"
                :icon="themeStore.darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
                :color="themeStore.darkMode ? '#F1F1F1' : '#121212'" size="small"
                variant="tonal" @click="alterarTema"
            />
          </div>

          <div class="w-100 px-3 mt-4">
            <v-container class="px-0 py-0">
              <v-slider hide-details v-model="themeStore.brightness" min="0.3" max="1" step="0.1">
                <template #label> <p class="text-sm font-semibold opacity-70">Alterar Brilho</p></template>
              </v-slider>
            </v-container>
          </div>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
  <!-- FIM NAVBAR NO TOPO -->

  <!-- SIDEBAR LATERAL -->
  <v-navigation-drawer
      class="background-sidebar menu-scroll"
      v-model="drawer" expand-on-hover
      :temporary="rail" :rail="sidebarRail"
      rail-width="65"
  >
    <v-list class="flex items-center flex-col justify-center">
      <v-sheet v-if="!sidebarRail" width="50px" class="bg-transparent mt-4 mb-2">
        <v-img alt="logo da simplesfique" cover class="w-[100%] h-[100%]" :src="require('@/assets/img/logo/logo.png')" />
      </v-sheet>

      <v-sheet v-else width="40px" class="bg-transparent mt-4 mb-2 ml-2">
        <v-img alt="logo da simplesfique" cover class="w-[100%] h-[100%]" :src="require('@/assets/img/logo/logo.png')" />
      </v-sheet>

      <p v-if="!sidebarRail" class="text-sm uppercase font-semibold text-center texto-color-primary">Simples <span class="texto-color-laranja">Fique</span></p>

      <v-text-field
          hide-details variant="outlined" class="mt-7 w-[92%]" density="compact" append-inner-icon="mdi-magnify"
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

  <!-- MODAL DE ERRO - PESQUISA (PROVISÓRIO) -->
  <ErrorAlertModal :error="false" v-model:modal="errorModal">
    <template #erro>O recurso de busca está em desenvolvimento e será disponibilizado em breve.</template>
  </ErrorAlertModal>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {ref, onMounted, onBeforeUnmount, mergeProps} from 'vue'
import ErrorAlertModal from "@/components/base/modais/ErrorAlertModal.vue";
// import SidebarThemas from "@/components/base/sidebar/SidebarThemas.vue";

// // Alterando o tema do site
const themeStore = useThemeStore();

const alterarTema = () => {
  themeStore.darkMode = !themeStore.darkMode
  themeStore.darkMode ? themeStore.tipoBtn = true : themeStore.tipoBtn = false
}

const sidebarRail = ref(false);

const openSidebar = () => {
  rail.value ? drawer.value = !drawer.value : sidebarRail.value = !sidebarRail.value
}

// modal de erro
const errorModal = ref(false);

// links do menu perfil
const items = ref([
  { text: 'Visualizar seu Perfil', icon: 'mdi-account-outline', route: '/paginas/perfil' },
  { text: 'Sair', icon: 'mdi-logout', route: '/login' },
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
}

.color-btn {
  color: var(--text-color-laranja);
}

.background-sidebar {
  background: var(--bg-navbar);
  color: white;
}

.hover-link {
  color: var(--text-color-fourth);
  background: transparent;
}

.menu-scroll {
  scrollbar-color: transparent transparent;
}
</style>