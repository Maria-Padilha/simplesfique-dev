<template>
<!--  <ParticleBackground />-->
  <section class="pt-10 background-primary grid grid-cols-1 lg:grid-cols-3 gap-8 px-16">
    <div class="col-span-1 lg:col-span-2 h-full flex flex-col items-start justify-center gap-5 pb-5 relative z-10">
      <h1 class="md:text-4xl text-3xl font-bold">
        Sua gestão merece mais <span class="texto-color-laranja">facilidade?</span>
        <span class="texto-color-laranja"><br> SimplesFique</span> com a gente.
      </h1>

      <p class="text-lg w-[90%] mt-5">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
      </p>

      <v-btn
          class="text-none mt-3" variant="flat"
          color="orange"
      >
        Experimente Grátis
      </v-btn>
    </div>

   <div class="col-span-1 background-card rounded-lg flex items-center justify-center py-8 mb-5 relative z-10">
      <v-card class="w-[90%] max-w-md p-8 rounded-xl shadow-lg bg-transparent" elevation="0">
        <h2 class="text-2xl font-bold mb-8 text-center texto-color-primary">Experimente Grátis</h2>
        <v-form class="flex flex-col gap-3">
          <v-text-field variant="outlined" label="Nome da Empresa" hide-details="auto" v-model="nomeEmpresa" />
          <v-text-field variant="outlined" label="Seu Nome" hide-details="auto" v-model="seuNome" />

          <v-text-field
              variant="outlined" label="Telefone" hide-details="auto"
              v-model="telefone" v-mask-phone.br prefix="55"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
          />

          <v-text-field variant="outlined" label="E-mail" hide-details="auto" v-model="email" />

          <v-checkbox v-model="termoUso" hide-details color="orange">
            <template #label>
              <p class="text-sm">Concordo com os
                <span class="font-semibold text-decoration-underline" @click="openModalTermo = true">termos de uso</span>
                *
              </p>
            </template>
          </v-checkbox>

          <v-btn class="w-full text-none" variant="flat" color="orange" size="large" :disabled="!termoUso" @click="enviarForms">
            Enviar
          </v-btn>
        </v-form>
      </v-card>
    </div>
  </section>

  <!--sobre nós -->
  <section class="py-16 background-secondary relative z-10">
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
        <v-card data-aos="fade-right" data-aos-duration="1000"  class="pa-6 h-full background-primary card-hover-effect" elevation="0">
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">mdi-lightbulb-outline</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">Inovação</h3>
            <p class="texto-color-primary texto-pequeno">
              Desenvolvemos soluções tecnológicas modernas e eficientes para simplificar seus processos.
            </p>
          </div>
        </v-card>

        <!-- Card 2 -->
        <v-card data-aos="fade-right" data-aos-duration="1000" class="pa-6 h-full background-primary card-hover-effect " elevation="0">
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">mdi-account-group-outline</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">Experiência</h3>
            <p class="texto-color-primary texto-pequeno">
              Nossa equipe possui anos de experiência em gestão empresarial e desenvolvimento de software.
            </p>
          </div>
        </v-card>

        <!-- Card 3 -->
        <v-card data-aos="fade-right" data-aos-duration="1000" class="pa-6 h-full background-primary card-hover-effect " elevation="0">
          <div class="text-center">
            <v-icon size="48" class="mb-4 texto-color-laranja">mdi-headset</v-icon>
            <h3 class="text-xl font-semibold mb-3 texto-color-primary">Suporte</h3>
            <p class="texto-color-primary texto-pequeno">
              Oferecemos suporte completo e dedicado para garantir o sucesso do seu negócio.
            </p>
          </div>
        </v-card>

        <!-- Card 4 -->
        <v-card data-aos="fade-right" data-aos-duration="1000" class="pa-6 h-full background-primary card-hover-effect" elevation="0">
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
  <section class="py-16 background-card relative z-10">
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
          data-aos="fade-right" :data-aos-duration="index % 2 !== 0 ? '1000' : '1250'"
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
            class="flex justify-center items-center background-primary"
            :class="{ 'lg:col-start-1': index % 2 !== 0 }"
          >
            <v-sheet class="max-w-[400px] h-[300px] image-shadow rounded-md">
              <v-img
                :alt="funcionalidade.alt"
                :src="require('@/assets/img/site/images.png')"
                cover
                class="w-[100%] h-[100%] h-full rounded-lg"
              />
            </v-sheet>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Seção de Segmentos Atendidos -->
  <section class="py-16 background-primary">
    <div class="mx-auto px-8">
      <div class="text-center mb-12 relative z-10">
        <h2 class="text-3xl font-bold mb-4 texto-color-primary">
          Segmentos <span class="texto-color-laranja">Atendidos</span>
        </h2>
        <p class="texto-color-primary max-w-2xl mx-auto texto-pequeno-15">
          Desenvolvemos soluções personalizadas para diversos segmentos empresariais,
          adaptando nossa tecnologia às necessidades específicas de cada área.
        </p>
      </div>

      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <v-card
          v-for="(segmento, index) in segmentos"
          :key="index"
          class="pa-6 background-card card-hover-effect"
          elevation="0"
          data-aos="fade-right" :data-aos-duration="index <=3 ? '1000' : '1250'"
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

  <!-- MODAL TERMO DE USO -->
  <v-dialog v-model="openModalTermo" persistent max-width="650">
    <v-card class="background-card">
      <v-card-title class="text-center">TERMO DE USO DA LICENÇA PROMOCIONAL – HÁBIL SOFTWARE</v-card-title>

      <v-virtual-scroll
          :height="500"
          :items="['div']"
      >
        <template v-slot:default>
          <div class="pa-5 text-sm text-justify flex flex-col gap-3">
            <p>
              HÁBIL SOFTWARE LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob nº 85.093.250/0001-76,
              com sede na Rua Itapuã, nº 1258, Bairro Bancários, CEP 85503-380, Pato Branco – PR, doravante denominada
              “HÁBIL”, disponibiliza ao usuário pessoa física ou jurídica, doravante denominado “CLIENTE”, o uso gratuito
              e temporário das versões do sistema Hábil Empresarial (desktop) ou Hábil10 (web) pelo prazo de até 180 (cento
              e oitenta) dias corridos, contados a partir da data de ativação, conforme os termos e condições estabelecidos
              neste instrumento.
            </p>

            <p>
              <strong>1. OBJETO E CARACTERÍSTICAS DA LICENÇA PROMOCIONAL</strong><br>
              A licença promocional concedida ao CLIENTE é gratuita, pessoal, intransferível, não exclusiva, revogável e
              temporária, válida por até 180 dias corridos, com acesso às funcionalidades principais do sistema. É destinada
              exclusivamente à avaliação e teste, sendo vedado o uso comercial, revenda ou exploração econômica durante
              o período promocional. O prazo será contado a partir da ativação e, após vencido, o acesso será suspenso,
              salvo contratação de plano pago.
            </p>

            <p>
              <strong>2. DIREITOS E OBRIGAÇÕES DAS PARTES</strong><br>
              A HÁBIL poderá suspender ou cancelar o acesso por uso inadequado, tentativa de burlar limitações técnicas,
              uso comercial não autorizado, violação de direitos ou necessidade de manutenção, mediante aviso prévio.
              O CLIENTE poderá utilizar o sistema conforme disponibilizado, devendo usá-lo apenas para avaliação,
              não acessar códigos-fonte, não compartilhar credenciais, realizar backups periódicos e comunicar falhas
              de segurança.
            </p>

            <p>
              <strong>3. LIMITAÇÕES DE RESPONSABILIDADE E GARANTIAS</strong><br>
              O sistema poderá apresentar limitações de performance, indisponibilidades programadas e funcionalidades
              reduzidas em relação às versões pagas. A HÁBIL não se responsabiliza por danos decorrentes de uso inadequado,
              perda de dados por falta de backup, lucros cessantes, danos indiretos ou incompatibilidade com sistemas não
              homologados. É garantida apenas a licença de uso durante o período promocional.
            </p>

            <p>
              <strong>4. PROTEÇÃO DE DADOS E PRIVACIDADE</strong><br>
              O tratamento de dados pessoais tem como base legal o legítimo interesse e execução de contrato. São coletados
              dados de identificação, uso do sistema e dados inseridos pelo CLIENTE. Não há compartilhamento com terceiros,
              salvo por obrigação legal, prestadores de serviços sob confidencialidade ou consentimento expresso. Após o fim
              da licença, dados pessoais serão mantidos por até 30 dias para eventual contratação e, em seguida, excluídos.
            </p>

            <p>
              <strong>5. PROPRIEDADE INTELECTUAL</strong><br>
              Todos os direitos do sistema pertencem exclusivamente à HÁBIL. Os dados inseridos pelo CLIENTE permanecem
              de sua propriedade, sendo a HÁBIL mera depositária durante o uso.
            </p>

            <p>
              <strong>6. CONTRATAÇÃO PÓS-PERÍODO PROMOCIONAL</strong><br>
              Para continuidade do uso após 180 dias, é necessário contratar um plano pago. Sem contratação, o acesso será
              suspenso automaticamente.
            </p>

            <p>
              <strong>7. DISPOSIÇÕES GERAIS</strong><br>
              A HÁBIL não será responsabilizada por caso fortuito ou força maior. As comunicações serão feitas por e-mail
              cadastrado, sendo consideradas recebidas após 24 horas do envio. Este termo é regido pela legislação brasileira,
              com foro eleito em Pato Branco/PR. O aceite eletrônico possui plena validade jurídica.
            </p>

            <v-divider :thickness="1" class="border-opacity-50"/>

            <div class="font-bold">
              <p>Data da última atualização: 09/06/2025</p>
              <p>Versão: 2.0</p>
            </div>

            <v-divider :thickness="1" class="border-opacity-50"/>
            <div class="flex flex-col gap-3">
              <p class="font-bold mb-2">Contato da Hábil Software LTDA:</p>

              <div class="flex items-center gap-3">
                <v-icon icon="mdi-phone-outline" />
                <p>(46) 3225-6234</p>
              </div>

              <div class="flex items-center gap-3">
                <v-icon icon="mdi-email-outline" />
                <p>financeiro@habil.com.br</p>
              </div>

              <div class="flex items-center gap-3">
                <v-icon icon="mdi-map-marker-outline" />
                <p>Av. Elisa Colla Padoan, 45, Fraron, Pato Branco – PR – CEP 85503-380.</p>
              </div>
            </div>
          </div>
        </template>
      </v-virtual-scroll>

      <v-card-actions class="background-secondary">
        <v-btn variant="tonal" size="small" @click="openModalTermo = false">Fechar</v-btn>
        <v-btn variant="flat" size="small" color="orange" @click="concordarTermo">Concordar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref} from "vue";
import {toast} from "vue3-toastify";
import {useThemeStore} from "@/stores/config-temas/theme";
// import ParticleBackground from "@/components/particle/ParticleBackground.vue";

const themeStore = useThemeStore();
const openModalTermo = ref(false);
const termoUso = ref(false);

const concordarTermo = () => {
  termoUso.value = true;
  openModalTermo.value = false;
}

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

// Dados do formulário
const nomeEmpresa = ref('');
const seuNome = ref('');
const telefone = ref('');
const email = ref('');

/** ENVIANDO O FORMULÁRIO **/
const enviarForms = async () => {
  if (!nomeEmpresa.value || !seuNome.value || !telefone.value || !email.value || !termoUso.value) {
    toast.error('Por favor, preencha todos os campos');
    return;
  }

  try {
    // Preparar os dados para envio
    const dadosFormulario = {
      nomeEmpresa: nomeEmpresa.value,
      seuNome: seuNome.value,
      telefone: telefone.value,
      email: email.value,
      termoUso: termoUso.value,
      dataEnvio: new Date().toISOString()
    };

    // Fazer a requisição POST para o webhook do n8n adicione aqui o link do webhook
    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosFormulario)
    });

    if (response.ok) {
      // Limpar o formulário após o envio bem-sucedido
      nomeEmpresa.value = '';
      seuNome.value = '';
      telefone.value = '';
      email.value = '';
      termoUso.value = false;

      toast.success('Formulário enviado com sucesso! Em breve entraremos em contato.');
    } else {
      throw new Error('Erro ao enviar formulário');
    }
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    toast.error('Erro ao enviar formulário. Tente novamente.');
  }
}
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

.no-horizontal-scroll {
  overflow-x: hidden !important;
  overflow-y: auto !important;
}

.v-virtual-scroll::-webkit-scrollbar {
  width: 7px;
}

.v-virtual-scroll::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-radius: 5px;
}

.v-virtual-scroll::-webkit-scrollbar-thumb {
  background: rgba(105, 105, 105, 0.44);
  border-radius: 5px;
  cursor: pointer;
}

.v-virtual-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(105, 105, 105, 0.51);
}

/* Garante que o conteúdo não cause overflow horizontal */
.v-virtual-scroll >>> * {
  max-width: 100%;
  box-sizing: border-box;
}
</style>