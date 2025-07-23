<template>
  <section class="pt-5 background-primary grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="h-full flex flex-col items-start justify-center gap-5 pl-14 pb-5">
      <h1 class="md:text-4xl text-3xl font-bold">
        Sua gestão merece mais <span class="texto-color-laranja">facilidade?</span>
        <span class="texto-color-laranja"><br> SimplesFique</span> com a gente.
      </h1>

      <p class="text-sm w-[90%]">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      </p>

      <v-btn
          class="text-none mt-3" variant="flat"
          color="orange"
      >
        Experimente Grátis
      </v-btn>
    </div>

    <div class="lg:block hidden ml-7 d-flex items-center justify-center">
      <v-sheet width="420px" class="bg-transparent">
        <v-img
            alt="imagem de apresentação do sistema" cover class="h-full"
            :src="require('@/assets/img/site/robb-site.png')"
        />
      </v-sheet>
    </div>
  </section>

  <!--sobre nós -->
  <section class="py-16 background-secondary">
    <div class="max-w-6xl mx-auto px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4 texto-color-primary">
          Sobre <span class="texto-color-laranja">Nós</span>
        </h2>
        <p class="texto-color-primary max-w-2xl mx-auto texto-pequeno-15">
          Conheça os pilares que fazem da nossa empresa a escolha ideal para sua gestão empresarial.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1 -->
        <v-card data-aos="fade-right" class="pa-6 h-full background-primary border card-hover-effect border-gray-200" elevation="2">
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">mdi-lightbulb-outline</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">Inovação</h3>
            <p class="texto-color-primary texto-pequeno">
              Desenvolvemos soluções tecnológicas modernas e eficientes para simplificar seus processos.
            </p>
          </div>
        </v-card>

        <!-- Card 2 -->
        <v-card data-aos="fade-right" class="pa-6 h-full background-primary card-hover-effect border border-gray-200" elevation="2">
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">mdi-account-group-outline</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">Experiência</h3>
            <p class="texto-color-primary texto-pequeno">
              Nossa equipe possui anos de experiência em gestão empresarial e desenvolvimento de software.
            </p>
          </div>
        </v-card>

        <!-- Card 3 -->
        <v-card data-aos="fade-right" class="pa-6 h-full background-primary card-hover-effect border border-gray-200" elevation="2">
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">mdi-headset</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">Suporte</h3>
            <p class="texto-color-primary texto-pequeno">
              Oferecemos suporte completo e dedicado para garantir o sucesso do seu negócio.
            </p>
          </div>
        </v-card>

        <!-- Card 4 -->
        <v-card data-aos="fade-right" class="pa-6 h-full background-primary card-hover-effect border border-gray-200" elevation="2">
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">mdi-shield-check-outline</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">Segurança</h3>
            <p class="texto-color-primary texto-pequeno">
              Seus dados estão protegidos com as mais avançadas tecnologias de segurança digital.
            </p>
          </div>
        </v-card>
      </div>
    </div>
  </section>

  <!-- Seção de Funcionalidades -->
  <section class="py-16 background-card">
    <div class="max-w-6xl mx-auto px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold mb-4 texto-color-primary">
          Nossas <span class="texto-color-laranja">Funcionalidades</span>
        </h2>
        <p class="texto-color-primary max-w-2xl mx-auto texto-pequeno-15">
          Descubra as principais ferramentas que vão revolucionar a gestão do seu negócio.
        </p>
      </div>

      <div class="flex flex-col gap-16 mt-14">
        <div
          v-for="(funcionalidade, index) in funcionalidades"
          :key="index"
          class="grid grid-cols-1 lg:grid-cols-2 items-center gap-8"
          :class="{ 'lg:grid-flow-col-dense': index % 2 !== 0 }"
          :data-aos="index !== 1 ?  'fade-right' : 'fade-left'"
        >
          <!-- Conteúdo de texto -->
          <div
            class="flex flex-col gap-4 px-4"
            :class="{ 'lg:col-start-2': index % 2 !== 0 }"
          >
            <h3 class="text-2xl font-bold texto-color-primary">
              {{ funcionalidade.titulo }}
            </h3>
            <p class="texto-color-primary text-sm leading-relaxed">
              {{ funcionalidade.descricao }}
            </p>
            <v-btn
              class="text-none mt-3 w-fit"
              variant="outlined"
              color="orange"
            >
              Saiba Mais
            </v-btn>
          </div>

          <!-- Imagem -->
          <div
            class="flex justify-center"
            :class="{ 'lg:col-start-1': index % 2 !== 0 }"
          >
            <v-sheet class="bg-transparent max-w-[400px] h-[300px] image-shadow rounded-md">
              <v-img
                :alt="funcionalidade.alt"
                :src="funcionalidade.imagem || require('@/assets/img/site/images.png')"
                cover
                class="h-full rounded-lg"
              />
            </v-sheet>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Seção de Segmentos Atendidos -->
  <section class="py-16 background-primary">
    <div class="max-w-6xl mx-auto px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4 texto-color-primary">
          Segmentos <span class="texto-color-laranja">Atendidos</span>
        </h2>
        <p class="texto-color-primary max-w-2xl mx-auto texto-pequeno-15">
          Desenvolvemos soluções personalizadas para diversos segmentos empresariais,
          adaptando nossa tecnologia às necessidades específicas de cada área.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <v-card
          v-for="(segmento, index) in segmentos"
          :key="index"
          class="pa-6 h-full background-secondary card-hover-effect border border-gray-200"
          elevation="2"
          :data-aos="index <=3 ?  'fade-right' : 'fade-left'"
        >
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">
              {{ segmento.icone }}
            </v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">
              {{ segmento.titulo }}
            </h3>
            <p class="texto-color-primary texto-pequeno">
              {{ segmento.descricao }}
            </p>
          </div>
        </v-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref} from "vue";

// Dados dos segmentos atendidos
const segmentos = ref([
  {
    titulo: "Varejo",
    descricao: "Lojas físicas e e-commerce com gestão de vendas, estoque e relacionamento com cliente.",
    icone: "mdi-store"
  },
  {
    titulo: "Restaurantes",
    descricao: "Bares, restaurantes e lanchonetes com controle de comanda e delivery integrado.",
    icone: "mdi-silverware-fork-knife"
  },
  {
    titulo: "Serviços",
    descricao: "Empresas prestadoras de serviços com agenda, contratos e faturamento automatizado.",
    icone: "mdi-account-tie"
  },
  {
    titulo: "Indústria",
    descricao: "Controle de produção, matéria-prima e distribuição para o setor industrial.",
    icone: "mdi-factory"
  },
  {
    titulo: "Saúde",
    descricao: "Clínicas, consultórios e laboratórios com gestão de pacientes e procedimentos.",
    icone: "mdi-medical-bag"
  },
  {
    titulo: "Educação",
    descricao: "Escolas, cursos e universidades com controle acadêmico e financeiro integrado.",
    icone: "mdi-school"
  },
  {
    titulo: "Atacado",
    descricao: "Distribuidoras e atacadistas com gestão de grandes volumes e logística.",
    icone: "mdi-truck-delivery"
  },
  {
    titulo: "Beleza",
    descricao: "Salões, clínicas de estética e spas com agendamento e controle de serviços.",
    icone: "mdi-face-woman-shimmer"
  }
]);

// Dados das funcionalidades
const funcionalidades = ref([
  {
    titulo: "Emissão de Nota Fiscal",
    descricao: "Emita notas fiscais de forma rápida e automatizada. Nossa plataforma se integra com a SEFAZ para garantir que todas as suas notas sejam emitidas conforme as normas fiscais vigentes, economizando tempo e evitando erros.",
    imagem: '',
    alt: "Imagem representando emissão de nota fiscal"
  },
  {
    titulo: "Gestão Financeira",
    descricao: "Tenha controle total sobre suas finanças com relatórios detalhados, fluxo de caixa em tempo real e análises de performance. Gerencie receitas, despesas e planeje o futuro do seu negócio com inteligência.",
    imagem: '',
    alt: "Imagem representando gestão financeira"
  },
  {
    titulo: "Gerenciamento de Estoque",
    descricao: "Controle seu estoque de forma eficiente com alertas de produtos em baixa, relatórios de movimentação e controle de entrada e saída. Evite perdas e mantenha sempre os produtos certos na quantidade ideal.",
    imagem: '',
    alt: "Imagem representando gerenciamento de estoque"
  }
]);
</script>

<style scoped lang="scss">
@import "@/assets/scss/theme.scss";

.image-shadow {
  box-shadow:
    0 2px 5px var(--text-color-orange, #ff8c00),
    0 0px 2px var(--text-color-orange, #ff8c00);
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    box-shadow:
      0 12px 25px rgba(0, 0, 0, 0.15),
      0 4px 10px rgba(0, 0, 0, 0.1),
      0 0 0 1px var(--text-color-orange, #ff8c00);
    transform: translateY(-3px);
  }
}

.card-hover-effect {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
}
</style>