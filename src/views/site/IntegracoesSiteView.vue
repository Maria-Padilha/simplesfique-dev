<template>
  <!-- HERO -->
  <section class="integracoes-hero background-secondary">
    <div class="integracoes-hero-bg"></div>

    <div class="integracoes-container">
      <div class="integracoes-hero-content">
        <div class="hero-badge">
          Integrações que conectam sua operação
        </div>

        <h1 class="hero-title">
          As melhores
          <span class="texto-color-laranja">integrações</span>
          para a sua empresa
        </h1>

        <p class="hero-description">
          Com o <span class="texto-color-laranja font-semibold">SimplesFique</span>,
          sua empresa conecta pagamentos, comunicação, contatos e marketing
          em uma rotina mais prática, organizada e eficiente.
        </p>

        <div class="hero-actions">
          <v-btn
              variant="flat"
              class="text-none hero-btn-primary"
              color="var(--text-color-laranja)"
              rounded="pill"
              size="x-large"
              elevation="0"
              @click="pushBottom"
          >
            Explorar integrações
          </v-btn>

          <v-btn
              variant="outlined"
              class="text-none hero-btn-secondary"
              rounded="pill"
              size="x-large"
              elevation="0"
          >
            Falar com especialista
          </v-btn>
        </div>
      </div>
    </div>
  </section>

  <main class="integracoes-main">
    <!-- BLOCO 1 -->
    <section class="integracoes-feature-block">
      <div class="integracoes-container">
        <div class="feature-grid">
          <div class="feature-visual" data-aos="fade-right" data-aos-duration="1000">
            <div class="feature-image-card">
              <v-img
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80"
                  cover
                  class="feature-main-image"
              >
                <template #placeholder>
                  <LazyImage />
                </template>
              </v-img>

              <div class="feature-floating-card">
                <span class="feature-floating-label">Integração em destaque</span>
                <h3>Operação conectada</h3>
                <p>Menos retrabalho, mais fluidez entre setores.</p>
              </div>
            </div>
          </div>

          <div class="feature-text" data-aos="fade-left" data-aos-duration="1000">
            <div class="section-badge">
              Conectividade inteligente
            </div>

            <h2 class="section-title">
              Integrações que melhoram as
              <span class="texto-color-laranja">operações</span>
              do seu negócio
            </h2>

            <p class="section-description">
              O SimplesFique foi pensado para centralizar processos importantes da empresa,
              conectando áreas que normalmente ficam separadas. Assim, sua equipe ganha
              mais agilidade, reduz erros e trabalha com mais previsibilidade.
            </p>

            <div class="section-points">
              <div class="section-point">
                <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
                <span>Pagamentos, contatos e campanhas em um fluxo mais integrado</span>
              </div>
              <div class="section-point">
                <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
                <span>Mais produtividade para equipes comerciais e administrativas</span>
              </div>
              <div class="section-point">
                <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
                <span>Menos processos manuais e mais controle sobre a rotina</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCO 2 / VITRINE DE INTEGRAÇÕES -->
    <section class="integracoes-showcase background-secondary py-10">
      <div class="integracoes-container">
        <div class="showcase-header">
          <div class="section-badge">Todas as integrações</div>
          <h2 class="section-title text-center">
            Recursos conectados para
            <span class="texto-color-laranja">acelerar</span>
            sua gestão
          </h2>
          <p class="showcase-description">
            Escolha uma categoria e veja como cada integração ajuda na prática.
          </p>
        </div>

        <div class="showcase-layout">
          <!-- MENU -->
          <div class="showcase-menu" data-aos="fade-right" data-aos-duration="1000">
            <button
                v-for="menu in menus"
                :key="menu.id"
                class="showcase-menu-item"
                :class="{ 'showcase-menu-item-active': menu.id === activeId }"
                @click="activeId = menu.id"
            >
              <div class="showcase-menu-item-icon">
                <v-icon size="22">
                  {{ menu.icon }}
                </v-icon>
              </div>

              <div class="showcase-menu-item-content">
                <strong>{{ menu.text }}</strong>
                <span>{{ menu.subtitulo }}</span>
              </div>

              <v-icon size="18" class="showcase-menu-arrow">mdi-arrow-right</v-icon>
            </button>
          </div>

          <!-- CONTEÚDO -->
          <div
              v-for="integracao in integracoes"
              :key="integracao.id"
              v-show="integracao.id === activeId"
              class="showcase-content"
              data-aos="fade-left"
              data-aos-duration="1000"
          >
            <div class="showcase-content-image">
              <v-img
                  :src="integracao.imagem"
                  cover
                  class="showcase-image"
              >
                <template #placeholder>
                  <LazyImage />
                </template>
              </v-img>
            </div>

            <div class="showcase-content-info">
              <div class="showcase-content-header">
                <div>
                  <span class="showcase-mini-label">Categoria selecionada</span>
                  <h3>{{ integracao.titulo }}</h3>
                </div>

                <div class="showcase-header-icon">
                  <v-icon size="24" class="texto-color-laranja">{{ integracao.icon }}</v-icon>
                </div>
              </div>

              <p class="showcase-content-description">
                {{ integracao.descricao }}
              </p>

              <div class="showcase-benefits">
                <div
                    v-for="(item, idx) in integracao.integracao"
                    :key="idx"
                    class="showcase-benefit-card"
                >
                  <div class="showcase-benefit-top">
                    <v-icon size="20" class="texto-color-laranja">{{ item.icone }}</v-icon>
                    <h4>{{ item.titulo }}</h4>
                  </div>
                  <p>{{ item.descricao }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOCO 3 -->
    <section class="integracoes-highlight">
      <div class="integracoes-container">
        <div class="highlight-grid">
          <div class="highlight-card" data-aos="fade-up" data-aos-duration="1000">
            <v-img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                cover
                class="highlight-image"
            >
              <template #placeholder>
                <LazyImage />
              </template>
            </v-img>

            <div class="highlight-content">
              <span class="highlight-label">Mais integração entre equipes</span>
              <h3>Dados mais organizados para decisões mais rápidas</h3>
              <p>
                Ao conectar setores e rotinas, sua empresa ganha uma visão mais clara
                do que está acontecendo e reduz gargalos na operação.
              </p>
            </div>
          </div>

          <div class="highlight-card" data-aos="fade-up" data-aos-duration="1200">
            <v-img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                cover
                class="highlight-image"
            >
              <template #placeholder>
                <LazyImage />
              </template>
            </v-img>

            <div class="highlight-content">
              <span class="highlight-label">Fluxos mais eficientes</span>
              <h3>Automação e conectividade para ganhar produtividade</h3>
              <p>
                Menos tarefas repetitivas, mais padronização e uma rotina muito mais
                fluida para quem vende, atende e administra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="integracoes-faq">
      <div class="integracoes-container faq-container">
        <div class="showcase-header">
          <div class="section-badge">Perguntas frequentes</div>
          <h2 class="section-title text-center">
            Tire dúvidas sobre as
            <span class="texto-color-laranja">integrações</span>
          </h2>
        </div>

        <v-expansion-panels class="faq-panels">
          <v-expansion-panel
              v-for="(pergunta, index) in perguntas"
              :key="index"
              elevation="0"
              class="faq-panel"
              :title="pergunta.titulo"
              :text="pergunta.resposta"
          />
        </v-expansion-panels>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";

const activeId = ref(1);

const menus = ref([
  {
    id: 1,
    text: "Meios de Pagamento",
    subtitulo: "Recebimentos mais fluidos",
    icon: "mdi-credit-card-outline",
  },
  {
    id: 2,
    text: "Automação de E-mail",
    subtitulo: "Comunicação automatizada",
    icon: "mdi-email-outline",
  },
  {
    id: 3,
    text: "Gerenciamento de Contatos",
    subtitulo: "Relacionamento mais organizado",
    icon: "mdi-account-group-outline",
  },
  {
    id: 4,
    text: "Campanhas de Marketing",
    subtitulo: "Mais alcance e acompanhamento",
    icon: "mdi-bullhorn-outline",
  },
]);

const integracoes = ref([
  {
    id: 1,
    titulo: "Meios de Pagamento",
    icon: "mdi-credit-card-outline",
    imagem:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    descricao:
        "Conecte sua operação aos meios de pagamento para receber com mais praticidade e organizar melhor o fluxo financeiro da empresa.",
    integracao: [
      {
        titulo: "Pagamentos Online",
        icone: "mdi-credit-card",
        descricao: "Aceite pagamentos online com mais praticidade e segurança.",
      },
      {
        titulo: "Integração com Bancos",
        icone: "mdi-bank-outline",
        descricao: "Conecte-se a instituições financeiras e organize recebimentos.",
      },
      {
        titulo: "Relatórios Financeiros",
        icone: "mdi-chart-line",
        descricao: "Visualize resultados e acompanhe movimentações com mais clareza.",
      },
      {
        titulo: "Configurações Personalizadas",
        icone: "mdi-cog-outline",
        descricao: "Ajuste regras e comportamentos conforme a rotina da empresa.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Automação de E-mail",
    icon: "mdi-email-outline",
    imagem:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    descricao:
        "Automatize comunicações importantes e mantenha clientes informados sem depender de envios manuais em toda etapa do processo.",
    integracao: [
      {
        titulo: "Envio Automático",
        icone: "mdi-email-outline",
        descricao: "Dispare mensagens com mais rapidez e consistência.",
      },
      {
        titulo: "Fluxos Programados",
        icone: "mdi-timer-outline",
        descricao: "Configure gatilhos e sequências para diferentes momentos da jornada.",
      },
      {
        titulo: "Gestão de Contatos",
        icone: "mdi-account-outline",
        descricao: "Mantenha listas organizadas para comunicações mais assertivas.",
      },
      {
        titulo: "Relatórios de E-mail",
        icone: "mdi-chart-bar",
        descricao: "Analise desempenho, frequência e eficiência das campanhas.",
      },
    ],
  },
  {
    id: 3,
    titulo: "Gerenciamento de Contatos",
    icon: "mdi-account-group-outline",
    imagem:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    descricao:
        "Tenha mais organização sobre clientes, leads e contatos estratégicos, facilitando atendimento, relacionamento e acompanhamento comercial.",
    integracao: [
      {
        titulo: "Gerenciamento de Leads",
        icone: "mdi-account-search-outline",
        descricao: "Centralize oportunidades e acompanhe potenciais clientes.",
      },
      {
        titulo: "Segmentação de Contatos",
        icone: "mdi-filter-outline",
        descricao: "Organize grupos para ações mais direcionadas e eficientes.",
      },
      {
        titulo: "Automação de Tarefas",
        icone: "mdi-robot-outline",
        descricao: "Reduza trabalho manual em processos repetitivos do relacionamento.",
      },
      {
        titulo: "Relatórios de CRM",
        icone: "mdi-chart-pie",
        descricao: "Obtenha mais visibilidade sobre o desempenho da base de contatos.",
      },
    ],
  },
  {
    id: 4,
    titulo: "Campanhas de Marketing",
    icon: "mdi-bullhorn-outline",
    imagem:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    descricao:
        "Crie campanhas com mais planejamento, acompanhe resultados e amplie o alcance das ações de comunicação da empresa.",
    integracao: [
      {
        titulo: "Criação de Campanhas",
        icone: "mdi-pencil-outline",
        descricao: "Estruture campanhas personalizadas para diferentes objetivos.",
      },
      {
        titulo: "Envio Programado",
        icone: "mdi-calendar-clock-outline",
        descricao: "Defina momentos estratégicos para disparos e ações.",
      },
      {
        titulo: "Análise de Resultados",
        icone: "mdi-chart-line-variant",
        descricao: "Acompanhe métricas importantes de desempenho.",
      },
      {
        titulo: "Integração com Redes",
        icone: "mdi-share-variant-outline",
        descricao: "Amplie alcance e conecte sua comunicação a outros canais.",
      },
    ],
  },
]);

const perguntas = ref([
  {
    titulo: "Como posso integrar meios de pagamento?",
    resposta:
        "Você pode configurar os meios de pagamento disponíveis dentro do sistema e adequar o fluxo conforme a necessidade da sua operação.",
  },
  {
    titulo: "É possível automatizar o envio de e-mails?",
    resposta:
        "Sim. O sistema permite configurar comunicações automáticas para etapas específicas da jornada do cliente ou da rotina administrativa.",
  },
  {
    titulo: "Como o gerenciamento de contatos ajuda no dia a dia?",
    resposta:
        "Ele centraliza informações importantes, melhora o relacionamento com clientes e facilita ações comerciais e operacionais.",
  },
  {
    titulo: "Quais benefícios as campanhas de marketing trazem?",
    resposta:
        "Elas ajudam sua empresa a ampliar alcance, manter relacionamento com a base e acompanhar melhor os resultados das ações.",
  },
]);

const pushBottom = () => {
  window.scrollBy({
    top: window.innerHeight - 50,
    behavior: "smooth",
  });
};
</script>

<style scoped lang="scss">
.integracoes-hero {
  position: relative;
  overflow: hidden;
  padding: 90px 0 70px;
  min-height: 78vh;
  display: flex;
  align-items: center;
}

.integracoes-hero-bg::before,
.integracoes-hero-bg::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.12;
  pointer-events: none;
}

.integracoes-hero-bg::before {
  width: 280px;
  height: 280px;
  background: var(--text-color-laranja);
  top: -80px;
  left: -80px;
}

.integracoes-hero-bg::after {
  width: 320px;
  height: 320px;
  background: var(--text-color-laranja);
  right: -80px;
  bottom: -100px;
}

.integracoes-container {
  width: 100%;
  max-width: 1520px;
  margin: 0 auto;
  padding: 0 24px;
}

.integracoes-hero-content {
  max-width: 920px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-badge,
.section-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  margin-bottom: 18px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color-laranja);
  background: rgba(255, 136, 0, 0.08);
  border: 1px solid rgba(255, 136, 0, 0.16);
  box-shadow: 0 8px 18px rgba(0,0,0,0.03);
}

.hero-title {
  font-size: clamp(2.8rem, 5vw, 5.5rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 700;
  color: var(--text-color-primary);
  margin: 0;
}

.hero-description {
  max-width: 820px;
  margin: 24px auto 0;
  font-size: clamp(1rem, 1.25vw, 1.28rem);
  line-height: 1.8;
  color: var(--text-color-primary);
  opacity: 0.84;
}

.hero-actions {
  margin-top: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-btn-primary {
  min-width: 220px;
  height: 56px !important;
  color: #fff !important;
  font-weight: 700 !important;
  box-shadow: 0 18px 36px rgba(255, 136, 0, 0.16);
}

.hero-btn-secondary {
  min-width: 220px;
  height: 56px !important;
  border-color: rgba(0,0,0,0.12) !important;
  color: var(--text-color-primary) !important;
  font-weight: 700 !important;
  background: rgba(255,255,255,0.55);
}

.integracoes-main {
  width: 100%;
  padding-bottom: 80px;
}

.integracoes-feature-block,
.integracoes-showcase,
.integracoes-highlight,
.integracoes-faq {
  margin-top: 80px;
}

.feature-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 42px;
  align-items: center;
}

.feature-image-card {
  position: relative;
  border-radius: 34px;
  overflow: hidden;
  background: var(--bg-color);
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 28px 60px rgba(0,0,0,0.08);
  padding: 14px;
}

.feature-main-image {
  min-height: 540px;
  border-radius: 24px;
}

.feature-floating-card {
  position: absolute;
  left: 34px;
  bottom: 34px;
  max-width: 280px;
  padding: 18px 18px 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.37);
  backdrop-filter: blur(10px);
  box-shadow: 0 14px 34px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.8);
}

.feature-floating-label,
.showcase-mini-label,
.highlight-label {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-color-laranja);
  margin-bottom: 8px;
}

.feature-floating-card h3,
.showcase-content-header h3,
.highlight-content h3 {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.15;
  color: var(--text-color-primary);
  font-weight: 700;
}

.feature-floating-card p {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-color-primary);
  opacity: 0.78;
}

.section-title {
  font-size: clamp(2rem, 3vw, 3.6rem);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text-color-primary);
  margin: 0;
}

.section-description,
.showcase-description {
  max-width: 760px;
  margin: 18px auto 0;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-color-primary);
  opacity: 0.82;
}

.feature-text .section-description {
  margin-top: 20px;
}

.section-points {
  display: grid;
  gap: 14px;
  margin-top: 28px;
}

.section-point {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--bg-color-secondary);
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 10px 22px rgba(0,0,0,0.03);
}

.section-point span {
  line-height: 1.6;
}

.showcase-header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto 36px;
}

.showcase-layout {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 26px;
  align-items: start;
}

.showcase-menu {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.showcase-menu-item {
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(0,0,0,0.05);
  background: var(--bg-color-secondary);
  backdrop-filter: blur(8px);
  box-shadow: 0 14px 30px rgba(0,0,0,0.04);
  transition: all .28s ease;
}

.showcase-menu-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 40px rgba(0,0,0,0.07);
}

.showcase-menu-item-active {
  border-color: rgba(255,136,0,0.18);
  background: linear-gradient(180deg, rgba(255, 250, 245, 0.53), rgba(255, 245, 235, 0.72));
  box-shadow: 0 22px 44px rgba(0,0,0,0.07), 0 0 0 6px rgba(255,136,0,0.04);
}

.showcase-menu-item-icon {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,136,0,0.08);
  color: var(--text-color-laranja);
  border: 1px solid rgba(255,136,0,0.14);
}

.showcase-menu-item-active .showcase-menu-item-icon {
  background: var(--text-color-laranja);
  color: white;
}

.showcase-menu-item-content {
  flex: 1;
  min-width: 0;
}

.showcase-menu-item-content strong {
  display: block;
  font-size: 1.05rem;
  color: var(--text-color-primary);
}

.showcase-menu-item-content span {
  display: block;
  margin-top: 4px;
  font-size: 0.92rem;
  opacity: 0.72;
  color: var(--text-color-primary);
}

.showcase-menu-arrow {
  opacity: 0.45;
  transition: all .25s ease;
}

.showcase-menu-item:hover .showcase-menu-arrow,
.showcase-menu-item-active .showcase-menu-arrow {
  opacity: 1;
  transform: translateX(3px);
}

.showcase-content {
  border-radius: 32px;
  padding: 16px;
  background: var(--bg-color);
  border: 1px solid rgba(255,255,255,0.85);
  box-shadow: 0 24px 54px rgba(0,0,0,0.06);
}

.showcase-content-image {
  margin-bottom: 18px;
}

.showcase-image {
  min-height: 380px;
  border-radius: 24px;
}

.showcase-content-info {
  padding: 6px 8px 8px;
}

.showcase-content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.showcase-header-icon {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,136,0,0.08);
  border: 1px solid rgba(255,136,0,0.14);
}

.showcase-content-description {
  margin: 16px 0 0;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text-color-primary);
  opacity: 0.82;
}

.showcase-benefits {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.showcase-benefit-card {
  padding: 18px;
  border-radius: 22px;
  background: var(--bg-color-secondary);
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 10px 22px rgba(0,0,0,0.03);
}

.showcase-benefit-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.showcase-benefit-top h4 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.3;
  color: var(--text-color-primary);
  font-weight: 700;
}

.showcase-benefit-card p {
  margin: 10px 0 0;
  font-size: 0.94rem;
  line-height: 1.65;
  color: var(--text-color-primary);
  opacity: 0.76;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px;
}

.highlight-card {
  overflow: hidden;
  border-radius: 30px;
  background: var(--bg-color);
  border: 1px solid rgba(255,255,255,0.82);
  box-shadow: 0 24px 48px rgba(0,0,0,0.06);
}

.highlight-image {
  min-height: 320px;
}

.highlight-content {
  padding: 24px;
}

.highlight-content p {
  margin: 12px 0 0;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text-color-primary);
  opacity: 0.8;
}

.faq-container {
  max-width: 980px;
}

.faq-panels {
  margin-top: 26px;
}

.faq-panel {
  background: var(--bg-color-secondary) !important;
  color: var(--text-color-primary) !important;
  border: 1px solid rgba(0,0,0,0.04);
  border-radius: 20px !important;
  margin-bottom: 14px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.03);
}

@media (max-width: 1280px) {
  .feature-grid,
  .showcase-layout,
  .highlight-grid {
    grid-template-columns: 1fr;
  }

  .showcase-benefits {
    grid-template-columns: 1fr;
  }

  .feature-main-image {
    min-height: 420px;
  }
}

@media (max-width: 768px) {
  .integracoes-hero {
    padding: 70px 0 50px;
    min-height: auto;
  }

  .integracoes-container {
    padding: 0 16px;
  }

  .hero-title {
    font-size: 2.3rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    gap: 10px;
  }

  .hero-btn-primary,
  .hero-btn-secondary {
    width: 100%;
  }

  .feature-main-image,
  .showcase-image,
  .highlight-image {
    min-height: 240px;
  }

  .feature-floating-card {
    position: static;
    max-width: 100%;
    margin: 14px 14px 0;
  }

  .showcase-content-header {
    flex-direction: column;
  }
}
</style>