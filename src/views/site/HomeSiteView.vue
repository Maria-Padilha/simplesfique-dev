<template>
  <section class="hero-lead-section background-primary relative z-10">
    <div class="max-w-[80%] mx-auto px-4 md:px-8 py-6 md:py-10">
      <div class="hero-lead-box">
        <!-- LADO ESQUERDO -->
        <div class="hero-lead-content">
          <div class="hero-badge">
            Gestão simples, integrada e moderna
          </div>

          <h1 class="hero-title">
            Sua gestão merece mais facilidade? <br />
            <span class="texto-color-laranja">SimplesFique</span> com a gente.
          </h1>

          <p class="hero-description">
            Automatize processos, acompanhe resultados em tempo real e tome decisões com mais segurança.
          </p>

          <div class="hero-actions">
            <v-btn
                class="text-none hero-main-btn text-white"
                variant="flat"
                color="orange"
                rounded="xl"
                size="x-large"
                @click="ativarBrilhoCard"
            >
              Experimente Grátis
            </v-btn>

            <div class="hero-mini-info">
              Sem complicação • Rápido de começar • Visual intuitivo
            </div>
          </div>
        </div>

        <!-- LADO DIREITO -->
        <div
            class="hero-form-shell"
            :class="{ 'card-glow-effect': brilhoAtivo }"
        >
          <div class="hero-form-header">
            <h3 class="hero-form-title">Comece agora</h3>
            <p class="hero-form-subtitle">
              Preencha os dados abaixo para conhecer a plataforma.
            </p>
          </div>

          <v-card class="hero-form-card bg-transparent" elevation="0">
            <v-form class="flex flex-col gap-4">
              <v-text-field
                  variant="outlined"
                  label="Nome da Empresa"
                  hide-details="auto"
                  v-model="nomeEmpresa"
                  rounded="xl"
                  class="text-black"
              />

              <v-text-field
                  variant="outlined"
                  label="Seu Nome"
                  hide-details="auto"
                  v-model="nome"
                  rounded="xl"
                  class="text-black"
              />

              <v-text-field
                  variant="outlined"
                  label="Telefone"
                  hide-details="auto"
                  v-model="telefone"
                  v-mask-phone.br
                  placeholder="55"
                  rounded="xl"
                  class="text-black"
              />

              <v-text-field
                  variant="outlined"
                  label="E-mail"
                  hide-details="auto"
                  v-model="email"
                  rounded="xl"
                  class="text-black"
              />

              <v-checkbox v-model="termoUso" hide-details color="orange">
                <template #label>
                  <p class="hero-checkbox-text">
                    Concordo com os
                    <span
                        class="font-semibold text-decoration-underline cursor-pointer"
                        @click="openModalTermo = true"
                    >
                    termos de uso
                  </span>
                    *
                  </p>
                </template>
              </v-checkbox>

              <v-btn
                  class="w-full text-none text-white hero-submit-btn"
                  variant="flat"
                  color="orange"
                  size="large"
                  rounded="xl"
                  @click="enviarForms"
              >
                Enviar
              </v-btn>
            </v-form>
          </v-card>
        </div>
      </div>
    </div>
  </section>

  <!--sobre nós -->
  <section class="py-16 background-secondary relative z-10">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="sobre-box">
        <!-- IMAGEM -->
        <div
            class="sobre-imagem-wrap"
            data-aos="fade-right"
            data-aos-duration="1200"
        >
          <v-img
              :src="require('@/assets/img/segmentos/sobre-nos.jpg')"
              cover
              class="sobre-imagem"
          >
            <div class="sobre-imagem-overlay-card">
              <p class="overlay-title mb-2">Nossa essência</p>

              <div
                  v-for="(card, i) in cardsSobreNos.slice(0, 3)"
                  :key="i"
                  class="overlay-mini-item"
              >
                <v-icon size="16" class="texto-color-laranja mr-2">
                  {{ card.icon }}
                </v-icon>
                <span>{{ card.titulo }}</span>
              </div>
            </div>
          </v-img>
        </div>

        <!-- CONTEÚDO -->
        <div
            class="sobre-conteudo"
            data-aos="fade-left"
            data-aos-duration="1200"
        >
          <h2 class="sobre-titulo">
            Sobre <span class="texto-color-laranja">Nós</span>
          </h2>

          <p class="sobre-subtitulo">
            Conheça os pilares que fazem da nossa empresa a escolha ideal para sua gestão empresarial.
          </p>

          <div class="sobre-lista">
            <div
                v-for="(card, i) in cardsSobreNos"
                :key="i"
                class="sobre-item"
                :data-aos="'fade-up'"
                :data-aos-delay="i * 80"
                data-aos-duration="1000"
            >
              <div class="sobre-item-icon">
                <v-icon size="22" class="texto-color-laranja">
                  {{ card.icon }}
                </v-icon>
              </div>

              <div class="sobre-item-texto">
                <h3 class="sobre-item-titulo">
                  {{ card.titulo }}
                </h3>

                <p class="sobre-item-descricao">
                  {{ card.texto }}
                </p>
              </div>
            </div>
          </div>

          <v-btn
              class="text-none mt-6 text-white sobre-btn"
              variant="flat"
              color="var(--text-color-laranja)"
              rounded="xl"
              size="large"
          >
            Conhecer mais
          </v-btn>
        </div>
      </div>
    </div>
  </section>

  <!-- Seção de Funcionalidades -->
  <section class="funcionalidades-section py-20 background-card relative py-10 z-10">
    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="text-center mb-16">
        <h2 class="funcionalidades-heading">
          Nossas <span class="texto-color-laranja">Funcionalidades</span>
        </h2>

        <p class="funcionalidades-subheading">
          Descubra as principais ferramentas que vão revolucionar a gestão do seu negócio.
        </p>
      </div>

      <div class="flex flex-col gap-8 md:gap-10">
        <div
            v-for="(funcionalidade, index) in funcionalidades"
            :key="index"
            class="feature-block"
            :class="{ 'feature-block-reverse': index % 2 !== 0 }"
            data-aos="fade-up"
            :data-aos-duration="index % 2 !== 0 ? '1100' : '1250'"
        >
          <!-- TEXTO -->
          <div class="feature-content">
          <span class="feature-kicker">
            Funcionalidade {{ String(index + 1).padStart(2, '0') }}
          </span>

            <h3 class="feature-title">
              {{ funcionalidade.titulo }}
            </h3>

            <p class="feature-description">
              {{ funcionalidade.descricao }}
            </p>

            <div class="feature-actions">
              <v-btn
                  class="text-none feature-btn"
                  variant="flat"
                  size="large"
                  color="var(--text-color-laranja)"
                  rounded="xl"
              >
                Saiba Mais
              </v-btn>
            </div>
          </div>

          <!-- IMAGEM -->
          <div class="feature-media">
            <div class="feature-image-wrapper">
              <v-img
                  :alt="funcionalidade.alt"
                  :src="funcionalidade.imagem"
                  cover
                  class="feature-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Seção de Segmentos Atendidos -->
  <section class="segmentos-visual py-16">
    <div class="text-center mb-10">
      <h2 class="text-3xl md:text-5xl font-bold texto-color-primary">
        Adaptamos nossa tecnologia às necessidades <br /> específicas de cada área.
      </h2>
    </div>

    <div class="segmentos-gallery">
      <div
          v-for="(segmento, index) in segmentos"
          :key="index"
          class="segmento-expand-item"
          :class="{ ativo: activeSegmento === index }"
          :style="{ backgroundImage: `url(${segmento.imagem})` }"
          @mouseenter="activeSegmento = index"
          @click="activeSegmento = index"
      >
        <div class="segmento-overlay"></div>

        <div class="segmento-content">
          <div class="segmento-content-inner">
            <h3 class="segmento-titulo">
              {{ segmento.titulo }}
            </h3>

            <p class="segmento-descricao">
              {{ segmento.descricao }}
            </p>
          </div>
        </div>
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

  <!-- DIALOG: Reenviar e-mail de ativação -->
  <v-dialog v-model="openResendDialog" persistent max-width="500">
    <v-card class="background-card">
      <v-card-title class="text-h6">Reenviar e-mail de ativação</v-card-title>
      <v-card-text>
        Foi encontrado um cadastro com o e-mail <strong>{{ email }}</strong> que ainda não foi ativado.
        Deseja reenviar o e-mail de ativação agora?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="openResendDialog = false">Cancelar</v-btn>
        <v-btn color="var(--text-color-laranja)" :loading="resendLoading" @click="resendActivation" class="text-white">Reenviar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref} from "vue";
import {toast} from "vue3-toastify";
import api from '@/services/api'
import { useRouter } from 'vue-router'
import {useSiteStore} from "@/stores/site";

const siteStore = useSiteStore();
const openModalTermo = ref(false);
const termoUso = ref(false);

const concordarTermo = () => {
  termoUso.value = true;
  openModalTermo.value = false;
}

const router = useRouter()

// Dialog para reenviar e-mail de ativação
const openResendDialog = ref(false)
const resendLoading = ref(false)

const resendActivation = async () => {
  resendLoading.value = true
  try {
    // Tentativa de reenviar ativação - endpoint assumido 'validaemail'
    await api.post('/validaemail', {
      nome: nome.value,
      email: email.value,
      telefone: telefone.value
    })
    toast.success('E-mail de ativação reenviado com sucesso.')
    openResendDialog.value = false
  } catch (e) {
    console.error('Erro ao reenviar e-mail de ativação:', e)
    toast.error('Erro ao reenviar e-mail de ativação. Tente novamente.')
  } finally {
    resendLoading.value = false
  }
}

// Dados Sobre Nós
const cardsSobreNos = ref([
  { icon: 'mdi-lightbulb-outline', titulo: 'Inovação', texto: 'Desenvolvemos soluções tecnológicas modernas e eficientes para simplificar seus processos.' },
  { icon: 'mdi-account-group-outline', titulo: 'Experiência', texto: 'Nossa equipe possui anos de experiência em gestão empresarial e desenvolvimento de software.' },
  { icon: 'mdi-headset', titulo: 'Suporte', texto: 'Oferecemos suporte completo e dedicado para garantir o sucesso do seu negócio.' },
  { icon: 'mdi-shield-check-outline', titulo: 'Segurança', texto: 'Seus dados estão protegidos com as mais avançadas tecnologias de segurança digital.' }
]);

// Dados dos segmentos atendidos
const segmentos = ref([
  {
    titulo: 'Varejo',
    descricao: 'Lojas físicas e e-commerce com gestão de vendas, estoque e relacionamento com o cliente.',
    imagem: require('@/assets/img/segmentos/varejo.jpg'),
  },
  {
    titulo: 'Restaurantes',
    descricao: 'Bares, restaurantes e lanchonetes com controle de comandas, delivery e operação integrada.',
    imagem: require('@/assets/img/segmentos/restaurante.jpg'),
  },
  {
    titulo: 'Serviços',
    descricao: 'Empresas prestadoras com agendamento, contratos e faturamento automatizado.',
    imagem: require('@/assets/img/segmentos/servicos.jpg'),
  },
  {
    titulo: 'Indústria',
    descricao: 'Controle de produção, matéria-prima e distribuição para o setor industrial.',
    imagem: require('@/assets/img/segmentos/industria.jpg'),
  },
  {
    titulo: 'Atacado',
    descricao: 'Distribuidoras e atacadistas com gestão de grandes volumes, pedidos e logística.',
    imagem: require('@/assets/img/segmentos/atacado.jpg'),
  }
]);

const activeSegmento = ref(2)

// Dados das funcionalidades
const funcionalidades = ref([
  {
    titulo: "Dashboard Intuitivo",
    descricao: "Acompanhe tudo que acontece no seu negócio em um só lugar. Com dashboards claros e organizados, você visualiza vendas, financeiro e desempenho em tempo real. Tenha acesso rápido às informações mais importantes e tome decisões com mais segurança, sem complicação.",
    imagem: require('@/assets/img/gif/video-dashboard.gif'),
    alt: "Imagem dashboard intuitivo"
  },
  {
    titulo: "Gestão Financeira",
    descricao: "Tenha controle total sobre suas finanças com relatórios detalhados, fluxo de caixa em tempo real e análises de performance. Gerencie receitas, despesas e planeje o futuro do seu negócio com inteligência.",
    imagem: require('@/assets/img/gif/video-financeiro.gif'),
    alt: "Imagem gestão financeira"
  },
  {
    titulo: "PDV Integrado",
    descricao: "Realize vendas de forma rápida e totalmente integrada ao seu negócio. Com o PDV do SimplesFique, cada venda já atualiza automaticamente o estoque e o financeiro, garantindo mais controle e agilidade no atendimento. Simplifique suas operações e tenha tudo conectado em tempo real.",
    imagem: require('@/assets/img/gif/video-pdv.gif'),
    alt: "Imagem pdv integrado"
  }
]);

// Dados do formulário
const nomeEmpresa = ref('');
const nome = ref('');
const telefone = ref('');
const email = ref('');

/** ENVIANDO O FORMULÁRIO **/
const enviarForms = async () => {

  if (siteStore.manutencao) {
    await router.push('/manutencao');
    return
  }

  if (!termoUso.value) {
    toast.info('Para prosseguir, é necessário concordar com os termos de uso.');
    return;
  }

  if (!nomeEmpresa.value || !nome.value || !telefone.value || !email.value || !termoUso.value) {
    toast.error('Por favor, preencha todos os campos');
    return;
  }

  try {
    // Preparar os dados para envio no formato esperado
    const dadosFormulario = {
      data: [
        {
          nome: nome.value,
          email: email.value,
          telefone: telefone.value,

        }
      ]
    };

    // Fazer a requisição POST para o webhook do n8n adicione aqui o link do webhook
    const response = await fetch('https://backend.simplesfique.com.br//saas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosFormulario)
    });

  if (response.ok) {
      // Após criar no /saas, também enviar dados para validação de e-mail/telefone
      try {
        await api.post('/validaemail', {
          nome: nome.value,
          email: email.value,
          telefone: telefone.value
        })
      } catch (ve) {
        // Não bloquear o fluxo principal para outros erros; log para diagnóstico
        console.error('Erro ao enviar /validaemail:', ve)
      }

      // Limpar o formulário após o envio bem-sucedido
      nomeEmpresa.value = '';
      nome.value = '';
      telefone.value = '';
      email.value = '';
      termoUso.value = false;

      toast.success('Formulário enviado com sucesso! Em breve entraremos em contato.');
    } else if (response.status === 409) {
      // E-mail cadastrado mas não ativo - abrir dialog para reenviar e-mail
      openResendDialog.value = true
    } else if (response.status === 405) {
      // Usuário cadastrado e ativo - redirecionar para login
      toast.info('Usuário já cadastrado e ativo. Redirecionando para o login...');
      router.push({ name: 'login' })
    } else {
      throw new Error('Erro ao enviar formulário');
    }
  } catch (error) {
    console.error('Erro ao enviar formulário:', error);
    toast.error('Erro ao enviar formulário. Tente novamente.');
  }
}

// FAZENDO CARD BRILHAR
const brilhoAtivo = ref(false)

const ativarBrilhoCard = () => {
  brilhoAtivo.value = false

  setTimeout(() => {
    brilhoAtivo.value = true
  }, 10)

  setTimeout(() => {
    brilhoAtivo.value = false
  }, 1800)
}
</script>

<style scoped lang="scss">
.titulo {
  font-weight: 900 !important;
}

// ================ SEGMENTOS =================

.segmentos-visual {
  position: relative;
  z-index: 10;
}

.segmentos-gallery {
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;
  display: flex;
  gap: 18px;
  min-height: 430px;
}

.segmento-expand-item {
  position: relative;
  flex: 1;
  min-width: 110px;
  height: 430px;
  border-radius: 42px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition:
      flex 0.55s ease,
      transform 0.35s ease,
      filter 0.35s ease;
  display: flex;
  align-items: flex-end;
}

.segmento-expand-item:hover {
  flex: 2.2;
  transform: translateY(-4px);
}

.segmento-overlay {
  position: absolute;
  inset: 0;
  background:
      linear-gradient(to top, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.15) 45%, rgba(0, 0, 0, 0.03) 100%);
  transition: background 0.35s ease;
}

.segmento-expand-item:hover .segmento-overlay {
  background:
      linear-gradient(to top, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.22) 45%, rgba(0, 0, 0, 0.04) 100%);
}

.segmento-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 26px 24px 28px;
}

.segmento-content-inner {
  transform: translateY(46px);
  opacity: 0;
  transition:
      transform 0.4s ease,
      opacity 0.3s ease;
}

.segmento-expand-item:hover .segmento-content-inner {
  transform: translateY(0);
  opacity: 1;
}

.segmento-titulo {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 10px;
}

.segmento-descricao {
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.08rem;
  line-height: 1.45;
  max-width: 320px;
}

.segmento-expand-item:not(:hover) .segmento-titulo {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 1.5rem;
  margin: 0 auto;
  opacity: 0.95;
  white-space: nowrap;
}

.segmento-expand-item:not(:hover) .segmento-content {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  padding: 22px 10px;
}

.segmento-expand-item:not(:hover) .segmento-content-inner {
  opacity: 1;
  transform: none;
}

.segmento-expand-item:not(:hover) .segmento-descricao {
  display: none;
}

.segmento-expand-item:hover .segmento-titulo {
  writing-mode: initial;
  transform: none;
}

@media (max-width: 1024px) {
  .segmentos-gallery {
    min-height: 360px;
  }

  .segmento-expand-item {
    height: 360px;
    border-radius: 30px;
  }

  .segmento-titulo {
    font-size: 1.6rem;
  }

  .segmento-descricao {
    font-size: 0.98rem;
  }
}

@media (max-width: 768px) {
  .segmentos-gallery {
    flex-direction: column;
    min-height: auto;
  }

  .segmento-expand-item,
  .segmento-expand-item:hover {
    flex: unset;
    height: 300px;
    border-radius: 24px;
  }

  .segmento-expand-item:not(:hover) .segmento-titulo {
    writing-mode: initial;
    transform: none;
    font-size: 1.5rem;
  }

  .segmento-expand-item:not(:hover) .segmento-content {
    justify-content: flex-end;
    align-items: flex-end;
    padding: 20px;
  }

  .segmento-expand-item .segmento-content-inner,
  .segmento-expand-item:hover .segmento-content-inner {
    opacity: 1;
    transform: none;
  }

  .segmento-expand-item .segmento-descricao {
    display: block;
  }
}

.segmento-expand-item:hover,
.segmento-expand-item.ativo {
  flex: 2.2;
  transform: translateY(-4px);
}

.segmento-expand-item:hover .segmento-content-inner,
.segmento-expand-item.ativo .segmento-content-inner {
  transform: translateY(0);
  opacity: 1;
}

.segmento-expand-item.ativo .segmento-titulo {
  writing-mode: initial;
  transform: none;
}

.segmento-expand-item:not(.ativo):not(:hover) .segmento-descricao {
  display: none;
}

// =============== CARD HOVER ===================

.card-hover-effect {
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  will-change: transform;
}

.card-hover-effect:hover {
  transform: translateY(-8px) !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.10),
  0 10px 10px -5px var(--text-color-laranja) !important;
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

.card-wrapper {
  transition: all 0.35s ease;
}

.card-glow-effect {
  animation: brilhoPulse 1.8s ease;
  border: 1px solid rgba(255, 153, 0, 0.35);
  box-shadow:
      0 0 0 1px rgba(255, 153, 0, 0.12),
      0 0 20px rgba(255, 153, 0, 0.18),
      0 0 45px rgba(255, 153, 0, 0.16),
      0 18px 40px rgba(255, 153, 0, 0.12);
}

@keyframes brilhoPulse {
  0% {
    transform: scale(1);
    box-shadow:
        0 0 0 rgba(255, 153, 0, 0),
        0 0 0 rgba(255, 153, 0, 0);
  }

  25% {
    transform: scale(1.015);
    box-shadow:
        0 0 18px rgba(255, 153, 0, 0.22),
        0 0 40px rgba(255, 153, 0, 0.18),
        0 18px 40px rgba(255, 153, 0, 0.12);
  }

  60% {
    transform: scale(1.02);
    box-shadow:
        0 0 28px rgba(255, 153, 0, 0.28),
        0 0 60px rgba(255, 153, 0, 0.2),
        0 20px 45px rgba(255, 153, 0, 0.14);
  }

  100% {
    transform: scale(1);
    box-shadow:
        0 0 0 rgba(255, 153, 0, 0),
        0 0 0 rgba(255, 153, 0, 0);
  }
}

// =============== SOBRE NÓS ===================

.sobre-box {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 56px;
  align-items: center;
  border-radius: 42px;
  padding: 28px;
  backdrop-filter: blur(10px);
}

.sobre-imagem-wrap {
  position: relative;
}

.sobre-imagem {
  min-height: 560px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.08);
}

.sobre-imagem-overlay-card {
  position: absolute;
  top: 28px;
  left: 28px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 24px;
  padding: 18px 20px;
  min-width: 220px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
}

.overlay-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-color);
}

.overlay-mini-item {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: var(--text-color);
  line-height: 1.4;
  margin-top: 8px;
}

.sobre-conteudo {
  padding-right: 10px;
}

.sobre-titulo {
  font-size: clamp(2.1rem, 4vw, 3.8rem);
  line-height: 1.1;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 16px;
}

.sobre-subtitulo {
  font-size: 1.08rem;
  line-height: 1.7;
  color: var(--text-color);
  opacity: 0.9;
  margin-bottom: 30px;
  max-width: 700px;
}

.sobre-lista {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 22px;
}

.sobre-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(69, 69, 69, 0.27);
  transition: all 0.3s ease;
}

.sobre-item:hover {
  transform: translateX(4px);
}

.sobre-item-icon {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 999px;
  border: 1px solid rgba(255, 153, 0, 0.35);
  background: rgba(255, 153, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sobre-item-titulo {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-color);
  margin-bottom: 6px;
}

.sobre-item-descricao {
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--text-color);
  opacity: 0.82;
}

.sobre-btn {
  min-width: 180px;
  height: 50px !important;
  box-shadow: 0 14px 28px rgba(255, 153, 0, 0.18) !important;
}

@media (max-width: 1200px) {
  .sobre-box {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .sobre-imagem {
    min-height: 420px;
  }
}

@media (max-width: 768px) {
  .sobre-box {
    border-radius: 26px;
    padding: 18px;
  }

  .sobre-imagem {
    min-height: 320px;
    border-radius: 24px;
  }

  .sobre-imagem-overlay-card {
    top: 16px;
    left: 16px;
    right: 16px;
    min-width: unset;
    padding: 14px 16px;
  }

  .sobre-lista {
    grid-template-columns: 1fr;
  }

  .sobre-titulo {
    font-size: 2.2rem;
  }

  .sobre-subtitulo {
    font-size: 1rem;
  }
}

// =============== FUNCIONALIDADES ===================

.funcionalidades-section {
  position: relative;
}

.funcionalidades-heading {
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  line-height: 1.1;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 14px;
}

.funcionalidades-subheading {
  max-width: 860px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-color);
  opacity: 0.9;
}

.feature-block {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 32px;
  align-items: center;
  padding: 28px;
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
  transition: all 0.35s ease;
}

.feature-block:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.06);
}

.feature-block-reverse {
  grid-template-columns: 1fr 1.05fr;
}

.feature-block-reverse .feature-content {
  order: 2;
}

.feature-block-reverse .feature-media {
  order: 1;
}

.feature-content {
  padding: 10px 8px 10px 8px;
}

.feature-kicker {
  display: inline-block;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-color-laranja);
  margin-bottom: 14px;
}

.feature-title {
  font-size: clamp(1.8rem, 3vw, 3rem);
  line-height: 1.15;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 18px;
}

.feature-description {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-color);
  opacity: 0.86;
  max-width: 620px;
}

.feature-actions {
  margin-top: 24px;
}

.feature-btn {
  min-width: 150px;
  height: 48px !important;
  box-shadow: 0 14px 26px rgba(255, 153, 0, 0.18) !important;
}

.feature-media {
  width: 100%;
}

.feature-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  min-height: 420px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
}

.feature-image {
  width: 100%;
  height: 420px;
  transition: transform 0.5s ease;
}

.feature-block:hover .feature-image {
  transform: scale(1.03);
}

@media (max-width: 1200px) {
  .feature-block,
  .feature-block-reverse {
    grid-template-columns: 1fr;
  }

  .feature-block-reverse .feature-content,
  .feature-block-reverse .feature-media {
    order: initial;
  }

  .feature-image-wrapper,
  .feature-image {
    min-height: 360px;
    height: 360px;
  }
}

@media (max-width: 768px) {
  .funcionalidades-section {
    padding-top: 72px;
    padding-bottom: 72px;
  }

  .feature-block {
    padding: 18px;
    border-radius: 24px;
    gap: 20px;
  }

  .feature-title {
    font-size: 1.8rem;
  }

  .feature-description {
    font-size: 1rem;
    line-height: 1.7;
  }

  .feature-image-wrapper,
  .feature-image {
    min-height: 260px;
    height: 260px;
    border-radius: 22px;
  }

  .funcionalidades-subheading {
    font-size: 1rem;
  }
}

// ================ HERO ================

.hero-lead-section {
  position: relative;
}

.hero-lead-box {
  display: grid;
  grid-template-columns: 1.2fr 0.88fr;
  gap: 28px;
  align-items: stretch;
  min-height: 620px;
  padding: 34px;
  border-radius: 38px;
  background:
      radial-gradient(circle at top right, rgba(255, 153, 0, 0.06), transparent 28%),
      rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
}

.hero-lead-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 12px 8px;
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  background: rgba(255, 153, 0, 0.08);
  border: 1px solid rgba(255, 153, 0, 0.16);
  color: var(--text-color-laranja);
  font-size: 0.92rem;
  font-weight: 700;
  margin-bottom: 18px;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.08;
  font-weight: 700;
  color: var(--text-color);
  max-width: 820px;
  letter-spacing: -0.03em;
}

.hero-description {
  margin-top: 22px;
  font-size: 1.12rem;
  line-height: 1.8;
  color: var(--text-color);
  opacity: 0.88;
  max-width: 650px;
}

.hero-actions {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.hero-main-btn {
  min-width: 220px;
  height: 54px !important;
  padding-inline: 22px !important;
  font-weight: 700;
  box-shadow: 0 16px 30px rgba(255, 153, 0, 0.22) !important;
}

.hero-mini-info {
  font-size: 0.96rem;
  color: var(--text-color);
  opacity: 0.72;
}

.hero-form-shell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 30px;
  padding: 28px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.06);
  transition: all 0.35s ease;
  position: relative;
  z-index: 3;
}

.hero-form-header {
  margin-bottom: 18px;
}

.hero-form-title {
  font-size: 1.65rem;
  line-height: 1.2;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 6px;
}

.hero-form-subtitle {
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--text-color);
  opacity: 0.78;
}

.hero-form-card {
  width: 100%;
}

.hero-checkbox-text {
  font-size: 0.92rem;
  line-height: 1.5;
}

.hero-submit-btn {
  height: 50px !important;
  font-weight: 700;
  box-shadow: 0 14px 28px rgba(255, 153, 0, 0.18) !important;
}

/* brilho do card */
.card-glow-effect {
  animation: brilhoPulse 1.8s ease;
  border: 1px solid rgba(255, 153, 0, 0.35);
  box-shadow:
      0 0 0 1px rgba(255, 153, 0, 0.10),
      0 0 24px rgba(255, 153, 0, 0.16),
      0 0 55px rgba(255, 153, 0, 0.12),
      0 20px 45px rgba(255, 153, 0, 0.10);
}

@keyframes brilhoPulse {
  0% {
    transform: scale(1);
    box-shadow:
        0 0 0 rgba(255, 153, 0, 0),
        0 0 0 rgba(255, 153, 0, 0);
  }

  30% {
    transform: scale(1.015);
    box-shadow:
        0 0 18px rgba(255, 153, 0, 0.18),
        0 0 36px rgba(255, 153, 0, 0.14),
        0 18px 40px rgba(255, 153, 0, 0.10);
  }

  60% {
    transform: scale(1.02);
    box-shadow:
        0 0 26px rgba(255, 153, 0, 0.24),
        0 0 60px rgba(255, 153, 0, 0.16),
        0 22px 44px rgba(255, 153, 0, 0.12);
  }

  100% {
    transform: scale(1);
    box-shadow:
        0 0 0 rgba(255, 153, 0, 0),
        0 0 0 rgba(255, 153, 0, 0);
  }
}

/* inputs vuetify */
:deep(.v-field) {
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.75) !important;
}

:deep(.v-field--variant-outlined .v-field__outline) {
  opacity: 0.8;
}

:deep(.v-label.v-field-label) {
  font-size: 0.96rem;
}

@media (max-width: 1200px) {
  .hero-lead-box {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 22px;
  }

  .hero-form-shell {
    max-width: 700px;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-lead-section {
    padding-top: 8px;
  }

  .hero-lead-box {
    border-radius: 24px;
    padding: 16px;
    gap: 18px;
  }

  .hero-title {
    font-size: 2.3rem;
  }

  .hero-description {
    font-size: 1rem;
    width: 100%;
    margin-top: 16px;
  }

  .hero-form-shell {
    border-radius: 22px;
    padding: 18px;
  }

  .hero-form-title {
    font-size: 1.3rem;
  }

  .hero-main-btn {
    width: 100%;
  }
}
</style>