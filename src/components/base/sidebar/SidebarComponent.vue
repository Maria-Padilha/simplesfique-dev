<template>
  <!-- NAVBAR NO TOPO -->
  <v-app-bar class="py-2 z-10 background-navbar" elevation="0" density="compact">
    <v-icon icon="mdi-menu" size="25px" class="ml-5 cursor-pointer" @click="openSidebar"></v-icon>
    <p class="ml-3 text-xl text-uppercase">Simples <span class="texto-color-laranja">Fique</span></p>

    <v-spacer></v-spacer>

    <!-- MENU DE ACESSO RÁPIDO -->
    <div class="d-flex align-center gap-2 mx-4">
      <v-tooltip
        v-for="acesso in acessosRapidosStore.acessosRapidos.slice(0, 8)"
        :key="acesso.id"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :icon="acesso.icon"
            :to="acesso.route"
            variant="text"
            size="small"
            class="acesso-rapido-btn"
          />
        </template>
        <span>{{ acesso.titulo }}</span>
      </v-tooltip>

      <!-- Botão de Configurar Acessos Rápidos -->
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-cog"
            variant="text"
            size="small"
            class="config-acesso-btn"
            @click="modalAcessosRapidos = true"
          />
        </template>
        <span>Configurar Acessos Rápidos</span>
      </v-tooltip>
    </div>

    <v-divider vertical class="mx-2"></v-divider>

    <!-- SELECT DE EMPRESAS -->
    <div>
      <v-select
          v-model="empresaStore.empresaSelecionada"
          :items="empresas"
          item-title="razao_social"
          item-value="id"
          variant="outlined"
          return-object
          density="compact"
          class="mt-6"
          @update:model-value="selecionarEmpresa"
          :theme="themeStore.darkMode ? 'dark' : 'light'"
      />
    </div>

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
        <v-list class="background-primary py-3" nav density="compact">
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
      v-model="drawer"
      :width="260"
      rail-width="65"
  >
    <v-list class="flex items-center flex-col justify-center">
      <v-sheet v-if="!sidebarRail" width="50px" class="bg-transparent mt-10">
        <v-img alt="logo da simplesfique" cover class="w-[100%] h-[100%]" :src="require('@/assets/img/logo/logo.png')" />
      </v-sheet>

      <v-sheet v-else width="40px" class="bg-transparent mt-8 ml-2">
        <v-img alt="logo da simplesfique" cover class="w-[100%] h-[100%]" :src="require('@/assets/img/logo/logo.png')" />
      </v-sheet>

      <v-text-field
          hide-details variant="outlined" class="mt-7 w-[92%]" density="compact" append-inner-icon="mdi-magnify"
          placeholder="Pesquisar" @click:appendInner="errorModal = true"
      />
    </v-list>

    <v-divider class="mt-3"></v-divider>

    <v-list :lines="false" density="default" nav>
      <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          to="/paginas/home"
      >
        <template #title><span class="grupo-primario">Home</span></template>
      </v-list-item>

      <!-- RENDERIZAR DINAMICAMENTE TODOS OS MÓDULOS DO STORE -->
      <v-list-group
          v-for="modulo in sidebarStore.getModulos()"
          :key="modulo.id"
          :value="modulo.id"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
              v-bind="props"
              :prepend-icon="modulo.icon"
              class="menu-pai"
          >
            <template #title>
              <span class="grupo-primario">{{ modulo.titulo }}</span>
            </template>
          </v-list-item>
        </template>

        <!-- RENDERIZAR TODOS OS SUBMENUS DO MÓDULO -->
        <template v-for="(submenu, i) in modulo.submenus" :key="i">
          <!-- Se o submenu tem submenus próprios, renderiza como grupo -->
          <v-list-group v-if="submenu.submenus" :value="`${modulo.id}-${i}`">
            <template v-slot:activator="{ props }">
              <v-list-item
                  v-bind="props"
                  :prepend-icon="submenu.icon"
                  class="submenu-item"
                  density="comfortable"
              >
                <template #prepend>
                  <v-icon :icon="submenu.icon" size="21px" />
                </template>
                <template #title>
                  <span class="span">{{ submenu.text }}</span>
                </template>
              </v-list-item>
            </template>

            <!-- Renderizar sub-submenus -->
            <v-list-item
                v-for="(subSubmenu, j) in submenu.submenus"
                :key="j"
                class="sub-submenu-item"
                :to="subSubmenu.route"
                :prepend-icon="subSubmenu.icon"
                density="comfortable"
            >
              <template #prepend>
                <v-icon :icon="subSubmenu.icon" size="18px" />
              </template>
              <template #title>
                <span class="span-small">{{ subSubmenu.text }}</span>
              </template>
            </v-list-item>
          </v-list-group>

          <!-- Se não tem submenus, renderiza como item normal -->
          <v-list-item
              v-else
              class="submenu-item"
              :to="submenu.route"
              :prepend-icon="submenu.icon"
              density="comfortable"
          >
            <template #prepend>
              <v-icon :icon="submenu.icon" size="21px" />
            </template>
            <template #title>
              <span class="span">{{ submenu.text }}</span>
            </template>
          </v-list-item>
        </template>
      </v-list-group>

<!--      <v-list-group value="cep">-->
<!--        <template v-slot:activator="{ props }">-->
<!--          <v-list-item-->
<!--              v-bind="props"-->
<!--              prepend-icon="mdi-map-marker"-->
<!--              title="Localização"-->
<!--          ></v-list-item>-->
<!--        </template>-->

<!--        <v-list-item-->
<!--            v-for="(link, i) in links.cep" :key="i"-->
<!--            class="pl-5"-->
<!--            :title="link.text"-->
<!--            :to="link.route"-->
<!--            density="comfortable"-->
<!--        />-->
<!--      </v-list-group>-->

    </v-list>
  </v-navigation-drawer>
  <!-- FIM SIDEBAR LATERAL -->

  <!-- MODAL DE ERRO - PESQUISA (PROVISÓRIO) -->
  <ErrorAlertModal :error="false" v-model:modal="errorModal">
    <template #erro>O recurso de busca está em desenvolvimento e será disponibilizado em breve.</template>
  </ErrorAlertModal>

  <!-- MODAL DE CONFIGURAÇÃO DE ACESSOS RÁPIDOS -->
  <ConfigAcessosRapidosModal v-model="modalAcessosRapidos" />
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {useSidebarStore} from "@/stores/Sidebar";
import {useEmpresaStore} from "@/stores/APIs/empresa";
import {useConfigParfinStore} from "@/stores/APIs/config";
import {useAcessoStore} from "@/stores/APIs/acesso";
import {useAcessosRapidosStore} from "@/stores/acessos-rapidos";
import {ref, onMounted, onBeforeUnmount, mergeProps, computed, watchEffect} from 'vue'
import ErrorAlertModal from "@/components/base/modais/ErrorAlertModal.vue";
import ConfigAcessosRapidosModal from "@/components/base/modais/ConfigAcessosRapidosModal.vue";

// Inicializar o store da sidebar
const sidebarStore = useSidebarStore();

// Alterando o tema do site
const themeStore = useThemeStore();

// Store de empresas
const empresaStore = useEmpresaStore();
const empresas = computed(() => empresaStore.empresas?.data || []);

// Store de acessos
const acessoStore = useAcessoStore();

// Store de configurações
const configStore = useConfigParfinStore();

// Store de acessos rápidos
const acessosRapidosStore = useAcessosRapidosStore();

// modal de erro
const errorModal = ref(false);

// modal de acessos rápidos
const modalAcessosRapidos = ref(false);

// links do menu perfil
const items = ref([
  { text: 'Visualizar seu Perfil', icon: 'mdi-account-outline', route: '/paginas/perfil' },
  { text: 'Configurações', icon: 'mdi-cog-outline', route: '/paginas/configuracoes' },
  { text: 'Sair', icon: 'mdi-logout', route: '/login' },
])

// Ajustando o sidebar para ficar responsivo
const drawer = ref(true);
const rail = ref(false);
const sidebarRail = ref(false);

const onResize = () => {
  drawer.value = window.innerWidth >= 967;
  rail.value = window.innerWidth <= 967;
};

const openSidebar = () => {
  drawer.value = !drawer.value;
}

const alterarTema = () => {
  themeStore.darkMode = !themeStore.darkMode
  themeStore.darkMode ? themeStore.tipoBtn = true : themeStore.tipoBtn = false
}

// Função para selecionar empresa
const selecionarEmpresa = async (empresa) => {
  console.log('[SidebarComponent] Empresa selecionada:', empresa);

  empresaStore.selecionarEmpresa(empresa);

  // Buscar acessos do usuário quando empresa for selecionada
  const idEmpresa = empresa?.id;
  console.log('[SidebarComponent] Buscando acessos para empresa:', idEmpresa);

  if (idEmpresa) {
    console.log('[SidebarComponent] Iniciando requisição de acessos...');
    await acessoStore.buscarAcessos(idEmpresa);
    console.log('[SidebarComponent] Acessos carregados com sucesso');
  } else {
    console.warn('[SidebarComponent] ID da empresa não encontrado');
  }
};

// Função para buscar configurações do sistema
const buscarConfiguracoes = async () => {
  try {
    // Buscar ID da empresa do localStorage
    let idEmpresa = localStorage.getItem('empresa');
    
    // Se não encontrar, tenta buscar do objeto empresaSelecionada
    if (!idEmpresa) {
      const empresaSelecionadaStr = localStorage.getItem('empresaSelecionada');
      if (empresaSelecionadaStr) {
        try {
          const empresaSelecionada = JSON.parse(empresaSelecionadaStr);
          idEmpresa = empresaSelecionada.id;
        } catch (e) {
          console.error('Erro ao parsear empresaSelecionada:', e);
        }
      }
    }
    
    if (!idEmpresa) {
      console.error('ID da empresa não encontrado');
      return;
    }
    
    // Buscar parâmetros financeiros de pagamento
    const parfinpag = await configStore.buscarParametrosFinanceirosPagar(idEmpresa);
    if (parfinpag) {
      localStorage.setItem('parfinpag', JSON.stringify(parfinpag));
    }
    
    // Buscar parâmetros financeiros de baixa
    const parfinbxa = await configStore.buscarParametrosCaixa(idEmpresa);
    if (parfinbxa) {
      localStorage.setItem('parfinbxa', JSON.stringify(parfinbxa));
    }
    
    // Buscar parâmetros financeiros de recebimento
    const parfinrec = await configStore.buscarParametrosFinanceirosReceber(idEmpresa);
    if (parfinrec) {
      localStorage.setItem('parfinrec', JSON.stringify(parfinrec));
    }
    
    // Buscar parâmetros de centro de custo
    const ccustoparametro = await configStore.buscarparfin();
    if (ccustoparametro) {
      localStorage.setItem('ccustoparametro', JSON.stringify(ccustoparametro));
    }
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
  }
}

// Consolidar todos os onMounted em um único
onMounted(async () => {
  console.log('[SidebarComponent] Inicializando aplicação...');

  // Primeiro carrega a empresa salva
  empresaStore.carregarEmpresaSelecionada();
  console.log('[SidebarComponent] Empresa carregada:', empresaStore.empresaSelecionada?.razao_social);

  // Event listener para resize
  window.addEventListener('resize', onResize);
  onResize();

  // Aguarda um pouco para carregar configurações
  setTimeout(async () => {
    await buscarConfiguracoes();
  }, 2000);
});

watchEffect(async () => {
  console.log('[SidebarComponent] watchEffect disparado - Carregando lista de empresas...');

  // Sempre carregar todas as empresas
  if (empresas.value.length === 0) {
    console.log('[SidebarComponent] Buscando empresas da API...');
    await empresaStore.buscarTodasEmpresas();
  }

  // Verificar se tem empresa selecionada e buscar acessos
  const empresaSelecionada = empresaStore.empresaSelecionada;
  console.log('[SidebarComponent] Empresa selecionada agora:', empresaSelecionada?.razao_social);

  if (empresaSelecionada && empresaSelecionada.id) {
    console.log('[SidebarComponent] Buscando acessos para empresa:', empresaSelecionada.id);
    await acessoStore.buscarAcessos(empresaSelecionada.id);
    console.log('[SidebarComponent] Acessos carregados com sucesso');
  } else {
    console.log('[SidebarComponent] Nenhuma empresa selecionada ainda');

    // Se não tem empresa selecionada, selecionar a primeira
    if (empresas.value.length > 0 && !empresaSelecionada) {
      const primeiraEmpresa = empresas.value[0];
      console.log('[SidebarComponent] Selecionando primeira empresa automaticamente:', primeiraEmpresa.razao_social);
      await selecionarEmpresa(primeiraEmpresa);
    }
  }
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
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

/* Scroll */
.menu-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
}

/* Lista base */
.v-list {
  padding-top: 6px;
  padding-bottom: 10px;
}

/* Divider */
.v-divider {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

/* =========================
   CAMPO DE PESQUISA
========================= */
.v-text-field {
  border-radius: 12px;
}

.v-text-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  transition: all 0.2s ease;
}

.v-text-field :deep(.v-field:hover) {
  background: rgba(255, 255, 255, 0.11);
}

.v-text-field :deep(input) {
  color: #fff !important;
}

.v-text-field :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.72) !important;
}

.v-text-field :deep(.v-field__append-inner .v-icon) {
  color: rgba(255, 255, 255, 0.85);
}

.v-text-field :deep(.v-field__outline) {
  display: none;
}

/* =========================
   ITEM BASE
========================= */
.v-list-item {
  min-height: 44px;
  margin: 4px 10px;
  border-radius: 12px;
  transition:
      background-color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.2s ease;
}

.v-list-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Ícones */
.v-list-item :deep(.v-list-item__prepend) {
  margin-right: 10px;
}

.v-icon {
  opacity: 0.95;
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.v-list-item:hover .v-icon {
  opacity: 1;
  transform: scale(1.04);
}

/* =========================
   HOME
========================= */
.v-list-item--nav {
  padding-inline: 12px;
}

/* Item ativo geral */
.v-list-item--active {
  background: rgba(255, 255, 255, 0.14) !important;
  box-shadow: inset 3px 0 0 #ffffff;
}

/* =========================
   MENU PAI
========================= */
.menu-pai {
  min-height: 48px;
  background: rgba(193, 193, 193, 0.1);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.menu-pai:hover {
  background: rgba(0, 0, 0, 0.14);
}

.grupo-primario {
  font-size: 14px !important;
  font-weight: 700 !important;
  letter-spacing: 0.2px;
  color: #fff;
}

/* Grupo aberto */
:deep(.v-list-group--open > .v-list-item.menu-pai) {
  background: rgba(255, 255, 255, 0.14);
  box-shadow:
      inset 3px 0 0 #fff,
      inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* Espaço entre módulos */
.v-list-group {
  margin-top: 6px;
}

/* =========================
   SUBMENUS NÍVEL 1
========================= */
.submenu-item {
  min-height: 40px;
  margin: 3px 14px 3px 22px !important;
  padding-left: 18px !important;
  border-radius: 10px;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
}

/* trilha vertical */
.submenu-item::before {
  content: "";
  position: absolute;
  left: -10px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
}

/* traço horizontal ligando */
.submenu-item::after {
  content: "";
  position: absolute;
  left: -10px;
  top: 50%;
  width: 10px;
  height: 2px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.submenu-item.v-list-item--active {
  background: rgba(255, 255, 255, 0.12) !important;
  box-shadow: inset 2px 0 0 rgba(255, 255, 255, 0.95);
}

.span {
  font-size: 13px !important;
  font-weight: 500;
  opacity: 0.95;
  color: rgba(255, 255, 255, 0.95);
}

/* =========================
   SUBMENUS NÍVEL 2
========================= */
.sub-submenu-item {
  min-height: 38px;
  margin: 2px 14px 2px 42px !important;
  padding-left: 16px !important;
  border-radius: 10px;
  position: relative;
  background: rgba(255, 255, 255, 0.02);
}

.sub-submenu-item::before {
  content: "";
  position: absolute;
  left: -12px;
  top: 5px;
  bottom: 5px;
  width: 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.10);
}

.sub-submenu-item::after {
  content: "";
  position: absolute;
  left: -12px;
  top: 50%;
  width: 12px;
  height: 2px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.10);
}

.sub-submenu-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.sub-submenu-item.v-list-item--active {
  background: rgba(255, 255, 255, 0.11) !important;
  box-shadow: inset 2px 0 0 rgba(255, 255, 255, 0.9);
}

.span-small {
  font-size: 13px !important;
  font-weight: 500;
  opacity: 0.88;
  color: rgba(255, 255, 255, 0.9);
}

/* =========================
   CHEVRON / EXPANSÃO
========================= */
:deep(.v-list-group__header .v-list-item__append .v-icon) {
  opacity: 0.85;
  font-size: 18px !important;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

:deep(.v-list-group--open > .v-list-item .v-list-item__append .v-icon) {
  opacity: 1;
}

/* =========================
   ACESSOS RÁPIDOS
========================= */
.acesso-rapido-btn {
  opacity: 0.75;
  transition: all 0.2s ease;
}

.acesso-rapido-btn:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.10);
}

.config-acesso-btn {
  opacity: 0.55;
  transition: all 0.2s ease;
}

.config-acesso-btn:hover {
  opacity: 1;
  color: #fff !important;
}

.gap-2 {
  gap: 8px;
}

/* =========================
   RAIL MODE
========================= */
:deep(.v-navigation-drawer--rail .v-list-item) {
  margin-left: 8px;
  margin-right: 8px;
}

:deep(.v-navigation-drawer--rail .submenu-item),
:deep(.v-navigation-drawer--rail .sub-submenu-item) {
  margin-left: 8px !important;
  margin-right: 8px !important;
  padding-left: 0 !important;
}

:deep(.v-navigation-drawer--rail .submenu-item::before),
:deep(.v-navigation-drawer--rail .submenu-item::after),
:deep(.v-navigation-drawer--rail .sub-submenu-item::before),
:deep(.v-navigation-drawer--rail .sub-submenu-item::after) {
  display: none;
}
</style>