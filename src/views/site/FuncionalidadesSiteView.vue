<template>
  <ParticleBackground />
  <section class="background-secondary h-[350px] texto-color-primary flex flex-col items-center justify-center relative z-10">
    <h1 class="text-4xl font-bold text-center">
      Funcionalidades que <span class="texto-color-laranja">simplificam</span>
      <br>sua gestão empresarial
    </h1>

    <p class="mt-5 text-center w-[45%] text-sm">
      O sistema SIMPLES FIQUE possui as funcionalidades essenciais para simplificar a gestão empresarial do seu negócio
      em poucos cliques!
    </p>

    <v-divider color="var(--text-color-laranja)" class="w-[150px] rounded-lg mt-4 mx-auto border-opacity-50" :thickness="5" />

    <v-btn variant="flat" class="text-none mt-10" color="var(--text-color-laranja)">
      Experimente
    </v-btn>
  </section>

  <main class="w-[70%] mx-auto my-10">
    <section>
      <title-sections><template #default>O que oferecemos</template></title-sections>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <v-card
            v-for="(funcionalidade, index) in funcionalidades" :key="index"
            data-aos="fade-right" data-aos-duration="1000"
            class="pa-6 h-full background-card card-hover-effect" elevation="0"
        >
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">{{funcionalidade.icone}}</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">{{funcionalidade.titulo}}</h3>
            <p class="texto-color-primary texto-pequeno">{{funcionalidade.descricao}}</p>
          </div>
        </v-card>
      </div>
    </section>

    <section class="mt-14">
      <h2 class="text-3xl font-semibold relative z-10">Simples <span class="texto-color-laranja"> Fique</span></h2>
      <p class="text-lg relative z-10">Sistema de gestão comercial</p>

      <div data-aos="fade-right" data-aos-duration="1000" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 items-stretch">
        <div class="flex flex-col col-span-1">
          <v-btn
              class="text-none rounded-0 w-[100%] flex text-truncate justify-start mb-5"
              :class="menu.id === activeId ? 'border-preta text-white' : 'border-laranja'" size="x-large"
              :variant="activeId === menu.id ? 'flat' : 'tonal'"
              v-for="menu in menus" :key="menu.id" @click="active(menu.id)"
              :color="activeId === menu.id ? 'var(--text-color-laranja)' : ''"
          >
            <p class="text-blue-dark text-bold" :class="{activeText: menu.id === activeId}">{{ menu.text }}</p>
          </v-btn>
        </div>

        <div class="col-span-1 lg:col-span-2 background-card py-5 px-8 rounded-sm">
          <p class="mb-3 text-start font-bold text-3xl">{{ titleMenu }}</p>
          <p class="mb-10 text-start font-medium text-xl">{{ textMenu }}</p>
          <v-sheet width="100%" class="rounded-md">
            <v-img width="100%" height="100%" class="rounded-md" :src="imageMenu" :lazy-src="imageMenu">
              <template v-slot:placeholder><LazyImage/></template>
            </v-img>
          </v-sheet>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import {ref, watch} from "vue";
import TitleSections from "@/components/site/TitleSections.vue";
import ParticleBackground from "@/components/particle/ParticleBackground.vue";

const funcionalidades = ref([
  {
    titulo: "Varejo",
    descricao: "Lojas físicas e e-commerce com gestão de vendas, estoque e relacionamento com cliente.",
    icone: "mdi-store"
  },
  {
    titulo: "Serviços",
    descricao: "Agendamentos, orçamentos e controle de serviços prestados com eficiência.",
    icone: "mdi-wrench"
  },
  {
    titulo: "Financeiro",
    descricao: "Controle de contas a pagar e receber, fluxo de caixa e relatórios financeiros.",
    icone: "mdi-cash-multiple"
  },
  {
    titulo: "Relatórios",
    descricao: "Geração de relatórios gerenciais para tomada de decisões estratégicas.",
    icone: "mdi-chart-bar"
  },
  {
    titulo: "CRM",
    descricao: "Gerenciamento de relacionamento com clientes para fidelização e vendas.",
    icone: "mdi-account-multiple"
  },
  {
    titulo: "Integrações",
    descricao: "Conexão com outras plataformas e serviços para ampliar funcionalidades.",
    icone: "mdi-link"
  },
  {
    titulo: "Segurança",
    descricao: "Proteção de dados e acesso seguro com autenticação avançada.",
    icone: "mdi-shield-lock"
  },
  {
    titulo: "Suporte",
    descricao: "Atendimento ao cliente ágil e eficiente para resolver dúvidas e problemas.",
    icone: "mdi-headset"
  },
  {
    titulo: "Customização",
    descricao: "Personalização de funcionalidades e relatórios de acordo com as necessidades do negócio.",
    icone: "mdi-cog"
  },
  {
    titulo: "Multiplataforma",
    descricao: "Compatibilidade com diferentes sistemas operacionais e navegadores.",
    icone: "mdi-web"
  },
  {
    titulo: "Escalabilidade",
    descricao: "Crescimento do sistema conforme a demanda do negócio, sem perda de performance.",
    icone: "mdi-arrow-expand-all"
  },
  {
    titulo: "Atualizações",
    descricao: "Melhorias constantes e novas funcionalidades lançadas periodicamente.",
    icone: "mdi-update"
  }
]);

// loop apresentando o sstema - segunda section
const menus = ref([
  { id: 1, text: 'Controle de Produtos' },
  { id: 2, text: 'Gerenc. Categorias' },
  { id: 3, text: 'Gerenc. de Cupons' },
  { id: 4, text: 'Publicações' },
]);

const activeId = ref(1);
const imageMenu = ref(require('@/assets/img/site/images.png'));
const titleMenu = ref('Produtos');
const textMenu = ref('Tenha total controle de todos os seus produtos em estoque e esgotados. Adicone e edite quantos quiser.')

const active = (id) => {
  activeId.value = id;
}

watch(activeId, (newId) => {
  const imageMap = {
    1:  '',
    2: '',
    3: '',
    4:  '',
  };
  const titleMap = {
    1: 'Produtos',
    2: 'Categorias',
    3: 'Cupons de Desconto',
    4: 'Publicações',
  };
  const textMap = {
    1: 'Tenha total controle de todos os seus produtos em estoque e esgotados. Adicone e edite quantos quiser.',
    2: 'Gerencia todas as suas categorias e sub categorias e deixe que seus clientes te encontrem de forma mais rápida e fácil.',
    3: 'Crie cupons de desconto e ofertas exclusivas para todos os seus clientes ou clientes específicos.',
    4: 'Adicione publicações e atraia mais clientes. Conte sobre sua marca e seus produtos. ',
  }
  imageMenu.value = imageMap[newId] || require('@/assets/img/site/images.png');
  titleMenu.value = titleMap[newId] || 'Simples Fique';
  textMenu.value = textMap[newId] || 'A Simples Fique oferece recursos exclusivos para você vender ainda mais!';
})

</script>

<style scoped>
.card-hover-effect {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
}

.border-laranja{
  border-left: 2px solid var(--text-secondary-laranja);
}

.border-preta{
  border-left: 2px solid var(--text-color);
}
</style>