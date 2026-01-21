<template>
  <!-- NAVBAR NO TOPO -->
  <v-app-bar class="py-2 z-10 background-navbar" elevation="0" density="compact">
    <v-icon icon="mdi-menu" size="25px" class="ml-5 cursor-pointer" @click="openSidebar"></v-icon>
    <p class="ml-5 mt-1 text-lg">Simples <span class="texto-color-laranja">Fique</span></p>

    <v-spacer></v-spacer>

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
      :width="240"
      rail-width="65"
  >
    <v-list class="flex items-center flex-col justify-center">
      <v-sheet v-if="!sidebarRail" width="50px" class="bg-transparent mt-5">
        <v-img alt="logo da simplesfique" cover class="w-[100%] h-[100%]" :src="require('@/assets/img/logo/logo.png')" />
      </v-sheet>

      <v-sheet v-else width="40px" class="bg-transparent mt-5 ml-2">
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
      ></v-list-item>

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
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {useSidebarStore} from "@/stores/Sidebar";
import {useEmpresaStore} from "@/stores/APIs/empresa";
import {useConfigParfinStore} from "@/stores/APIs/config";
import {useAcessoStore} from "@/stores/APIs/acesso";
import {ref, onMounted, onBeforeUnmount, mergeProps, computed, watchEffect} from 'vue'
import ErrorAlertModal from "@/components/base/modais/ErrorAlertModal.vue";

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

// modal de erro
const errorModal = ref(false);

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
  color: white;
}


.menu-scroll {
  scrollbar-color: transparent transparent;
}

.submenu-item {
  padding-left: 30px !important; /* padrão costuma ser 24px ou mais */
}
.submenu-item .v-list-item__prepend {
  margin-right: 8px !important; /* ajusta o espaço entre ícone e texto */
}

.sub-submenu-item {
  padding-left: 50px !important; /* mais indentação para sub-submenus */
}
.sub-submenu-item .v-list-item__prepend {
  margin-right: 8px !important;
}

.span {
  font-size: 12px !important;
  opacity: .9;
}

.span-small {
  font-size: 11px !important;
  opacity: .85;
}

.grupo-primario {
  font-weight: 700 !important;
  font-size: 14px !important;
}
</style>