<template>
  <ParticleBackground />
  <section class="background-secondary h-[350px] texto-color-primary flex flex-col items-center justify-center relative z-10">
    <h1 class="text-4xl font-bold text-center">
      As melhores <span class="texto-color-laranja">integrações</span>
      <br>para a sua empresa
    </h1>

    <p class="mt-5 text-center w-[45%] text-sm">
      Aproveite todas as integrações do sistema para otimizar as operações do seu negócio e tornar a gestão mais
      prática!
    </p>

    <v-divider color="var(--text-color-laranja)" class="w-[150px] rounded-lg mt-4 mx-auto border-opacity-50" :thickness="5" />

    <v-btn variant="flat" class="text-none mt-10" color="var(--text-color-laranja)">
      Experimente
    </v-btn>
  </section>

  <main class="w-[70%] mx-auto my-10">
    <section>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-5 items-center">
        <v-sheet width="100%" class="rounded-md" data-aos="fade-right" data-aos-duration="1000">
          <v-img
              width="100%" height="100%" class="rounded-md" :src="require('@/assets/img/site/images.png')"
              :lazy-src="require('@/assets/img/site/images.png')"
          >
            <template v-slot:placeholder>
              <LazyImage/>
            </template>
          </v-img>
        </v-sheet>

        <div data-aos="fade-right" data-aos-duration="1000">
          <h2 class="text-3xl font-semibold">Integrações que melhoram as <br/> operações do seu negócio</h2>
          <p class="mt-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
            make a type specimen book.
          </p>
          <p class="mt-5">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
            make a type specimen book.
          </p>
          <p class="mt-5">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-14">
      <title-sections><template #default>Todas as Integrações</template></title-sections>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div data-aos="fade-right" data-aos-duration="1000" class="flex flex-col col-span-1">
          <v-btn
              class="text-none rounded-0 w-[100%] flex text-truncate justify-start mb-5"
              :class="menu.id === activeId ? 'border-preta text-white' : 'border-laranja'" size="x-large"
              :variant="activeId === menu.id ? 'flat' : 'tonal'"
              v-for="menu in menus" :key="menu.id" @click="activeId = menu.id"
              :color="activeId === menu.id ? 'var(--text-color-laranja)' : ''"
          >
            <p class="text-blue-dark text-bold" :class="{activeText: menu.id === activeId}">{{ menu.text }}</p>
          </v-btn>
        </div>

        <div
          v-for="(integracao, index) in integracoes" :key="index" v-show="integracao.id === activeId"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-100"
        >
          <div v-for="(item, idx) in integracao.integracao" :key="idx">
            <v-card
              data-aos="fade-right" data-aos-duration="1000"  elevation="0"
              class="pa-6 h-full background-card card-hover-effect"
            >
              <div class="text-center">
                <v-icon size="48" class="mb-4 texto-color-laranja">{{ item.icone }}</v-icon>
                <h3 class="text-xl font-semibold mb-3 texto-color-primary">{{ item.titulo }}</h3>
                <p class="texto-color-primary texto-pequeno">{{ item.descricao }}</p>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-14">
      <title-sections><template #default>Perguntas Frequentes</template></title-sections>

      <v-expansion-panels>
        <v-expansion-panel
            v-for="(pergunta, index) in perguntas" :key="index" elevation="0"
            class="background-card texto-color-primary"
            :title="pergunta.titulo" :text="pergunta.resposta"
        />
      </v-expansion-panels>
    </section>
  </main>
</template>

<script setup>
import TitleSections from "@/components/site/TitleSections.vue";
import {ref} from "vue";
import ParticleBackground from "@/components/particle/ParticleBackground.vue";

const activeId = ref(1);
const menus = ref([
  {id: 1, text: 'Meios de Pagamento'},
  {id: 2, text: 'Auto. de E-mail'},
  {id: 3, text: 'Gerenciamento de Contatos'},
  {id: 4, text: 'Campanhas de Marketing'},
]);

const integracoes = ref([
  {
    id: 1,
    integracao: [
      {titulo: 'Pagamentos Online', icone: 'mdi-credit-card', descricao: 'Aceite pagamentos online com facilidade.'},
      {titulo: 'Integração com Bancos', icone: 'mdi-bank', descricao: 'Conecte-se aos principais bancos.'},
      {
        titulo: 'Relatórios Financeiros',
        icone: 'mdi-chart-line',
        descricao: 'Obtenha relatórios financeiros detalhados.'
      },
      {
        titulo: 'Configurações Personalizadas',
        icone: 'mdi-cog',
        descricao: 'Ajuste as configurações conforme suas necessidades.'
      }
    ]
  },
  {
    id: 2,
    integracao: [
      {
        titulo: 'Envio Automático de E-mails',
        icone: 'mdi-email',
        descricao: 'Automatize o envio de e-mails para seus clientes.'
      },
      {
        titulo: 'Gerenciamento de Contatos',
        icone: 'mdi-account',
        descricao: 'Organize e gerencie seus contatos facilmente.'
      },
      {titulo: 'Campanhas de Marketing', icone: 'mdi-bullhorn', descricao: 'Crie campanhas de marketing por e-mail.'},
      {titulo: 'Relatórios de E-mail', icone: 'mdi-chart-bar', descricao: 'Analise o desempenho das suas campanhas.'}
    ]
  },
  {
    id: 3,
    integracao: [
      {titulo: 'Gerenciamento de Leads', icone: 'mdi-lead-pencil', descricao: 'Capture e gerencie leads de forma eficiente.'},
      {titulo: 'Segmentação de Contatos', icone: 'mdi-filter', descricao: 'Segmente seus contatos para campanhas direcionadas.'},
      {titulo: 'Automação de Tarefas', icone: 'mdi-robot', descricao: 'Automatize tarefas repetitivas no gerenciamento de contatos.'},
      {titulo: 'Relatórios de CRM', icone: 'mdi-chart-pie', descricao: 'Obtenha insights sobre o desempenho do seu CRM.'}
    ]
  },
  {
    id: 4,
    integracao: [
      {titulo: 'Criação de Campanhas', icone: 'mdi-shopping-outline', descricao: 'Crie campanhas de marketing personalizadas.'},
      {titulo: 'Envio Programado', icone: 'mdi-timer-sand', descricao: 'Programe o envio das suas campanhas.'},
      {titulo: 'Análise de Resultados', icone: 'mdi-chart-line-stacked', descricao: 'Analise o desempenho das suas campanhas.'},
      {titulo: 'Integração com Redes Sociais', icone: 'mdi-facebook', descricao: 'Conecte-se às redes sociais para ampliar o alcance.'}
    ]
  }
]);

const perguntas = ref([
  {
    titulo: 'Como posso integrar meios de pagamento?',
    resposta: 'Você pode integrar meios de pagamento através das configurações do sistema, selecionando os provedores disponíveis.'
  },
  {
    titulo: 'É possível automatizar o envio de e-mails?',
    resposta: 'Sim, você pode configurar campanhas de e-mail automatizadas para enviar mensagens em horários específicos.'
  },
  {
    titulo: 'Como gerenciar meus contatos?',
    resposta: 'Você pode gerenciar seus contatos na seção de CRM, onde é possível adicionar, editar e segmentar contatos.'
  },
  {
    titulo: 'Quais tipos de relatórios estão disponíveis?',
    resposta: 'O sistema oferece relatórios financeiros, de vendas e de desempenho de campanhas de marketing.'
  }
]);
</script>

<style scoped>
.card-hover-effect {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
}

.border-laranja {
  border-left: 2px solid var(--text-secondary-laranja);
}

.border-preta {
  border-left: 2px solid var(--text-color);
}
</style>