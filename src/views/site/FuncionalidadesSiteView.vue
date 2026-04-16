<template>
  <section class="background-secondary min-h-[75vh] py-10 px-4 md:px-6 texto-color-primary flex items-center justify-center relative overflow-hidden z-10">
    <!-- detalhes visuais de fundo -->
    <div class="absolute inset-0 pointer-events-none">
      <div
          class="absolute top-[-80px] left-[-80px] w-[220px] h-[220px] rounded-full blur-3xl opacity-10"
          style="background: var(--text-color-laranja);"
      />
      <div
          class="absolute bottom-[-100px] right-[-60px] w-[260px] h-[260px] rounded-full blur-3xl opacity-10"
          style="background: var(--text-color-laranja);"
      />
    </div>

    <div class="relative w-full max-w-[100%] mx-auto">
      <div
          class="mx-auto max-w-[90%] text-center rounded-[32px] px-6 md:px-12 py-10 md:py-16"
      >
        <!-- badge -->
        <div class="flex justify-center mb-6">
        <span
            class="px-4 py-2 rounded-full text-sm md:text-base font-medium border"
            style="color: var(--text-color-laranja); border-color: rgba(230,126,34,0.25); background: rgba(230,126,34,0.08);"
        >
          Gestão inteligente em um só lugar
        </span>
        </div>

        <!-- título -->
        <h1 class="hero-title">
          Funcionalidades que
          <span class="texto-color-laranja">simplificam</span>
          <br class="hidden md:block" />
          sua gestão empresarial
        </h1>

        <!-- descrição -->
        <p class="hero-description">
          O
          <span class="texto-color-laranja font-semibold">SimplesFique</span>
          reúne tudo o que você precisa para administrar seu negócio com mais
          facilidade, agilidade e controle — tudo em poucos cliques.
        </p>

        <!-- divisor -->
        <div class="flex justify-center mt-8 md:mt-10">
          <div
              class="w-24 md:w-32 h-1.5 rounded-full"
              style="background: linear-gradient(90deg, rgba(230,126,34,0.35) 0%, var(--text-color-laranja) 50%, rgba(230,126,34,0.35) 100%);"
          />
        </div>

        <!-- ação -->
        <div class="mt-8 md:mt-10 flex justify-center">
          <v-btn
              variant="flat"
              class="text-none text-white font-semibold px-8 transition-all duration-300 hover:scale-[1.03]"
              color="var(--text-color-laranja)"
              rounded="pill"
              size="x-large"
              elevation="0"
              @click="pushBottom"
          >
            Saiba Mais
          </v-btn>
        </div>
      </div>
    </div>
  </section>

  <section
      ref="funcionalidadesSection"
      class="funcionalidades-ecossistema"
      :class="{ 'is-visible': secaoVisivel }"
  >
    <div class="container-ecossistema">
      <div class="mapa-wrapper hidden lg:block">
        <!-- linhas SVG -->
        <svg class="linhas-svg" viewBox="0 0 1400 900" preserveAspectRatio="none">
          <defs>
            <filter id="glowLine">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d="M700 450 C700 360, 700 280, 700 180" class="linha-principal linha-1" />
          <path d="M700 450 C640 390, 565 330, 445 300" class="linha-principal linha-2" />
          <path d="M700 450 C760 390, 835 330, 955 300" class="linha-principal linha-3" />
          <path d="M700 450 C615 470, 535 500, 430 580" class="linha-principal linha-4" />
          <path d="M700 450 C785 470, 865 500, 970 580" class="linha-principal linha-5" />
          <path d="M700 450 C700 540, 700 620, 700 710" class="linha-principal linha-6" />
        </svg>

        <!-- núcleo -->
        <div class="nucleo-central item-anim item-core">
          <div class="nucleo-inner">
            <div class="nucleo-logo">Simples</div>
            <div class="nucleo-sub">Gestão integrada</div>
          </div>
        </div>

        <!-- principais -->
        <div class="item-principal pos-top item-anim item-1">
          <div class="pill-principal">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-cash-multiple</v-icon>
            </div>
            <div class="pill-content">
              <h3>Financeiro</h3>
              <p>Controle entradas, saídas e fluxo de caixa com mais clareza.</p>
            </div>
          </div>
        </div>

        <div class="item-principal pos-left-top item-anim item-2">
          <div class="pill-principal">
            <div class="pill-icon">
              <v-icon size="24" class="texto-color-laranja">mdi-cart-outline</v-icon>
            </div>
            <div class="pill-content">
              <h3>Vendas</h3>
              <p>Gerencie vendas e pedidos com rapidez e organização.</p>
            </div>
          </div>
        </div>

        <div class="item-principal pos-right-top item-anim item-3">
          <div class="pill-principal">
            <div class="pill-icon">
              <v-icon size="24" class="texto-color-laranja">mdi-package-variant-closed</v-icon>
            </div>
            <div class="pill-content">
              <h3>Estoque</h3>
              <p>Acompanhe produtos, movimentações e disponibilidade em tempo real.</p>
            </div>
          </div>
        </div>

        <div class="item-principal pos-left-bottom item-anim item-4">
          <div class="pill-principal">
            <div class="pill-icon">
              <v-icon size="24" class="texto-color-laranja">mdi-monitor-dashboard</v-icon>
            </div>
            <div class="pill-content">
              <h3>PDV</h3>
              <p>Venda com mais praticidade através de um sistema ágil e intuitivo.</p>
            </div>
          </div>
        </div>

        <div class="item-principal pos-right-bottom item-anim item-5">
          <div class="pill-principal">
            <div class="pill-icon">
              <v-icon size="24" class="texto-color-laranja">mdi-cellphone-link</v-icon>
            </div>
            <div class="pill-content">
              <h3>Totem</h3>
              <p>Automatize atendimentos e ofereça mais autonomia ao cliente.</p>
            </div>
          </div>
        </div>

        <div class="item-principal pos-bottom item-anim item-6">
          <div class="pill-principal">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-chart-line</v-icon>
            </div>
            <div class="pill-content">
              <h3>Relatórios</h3>
              <p>Visualize indicadores e tome decisões com base em dados.</p>
            </div>
          </div>
        </div>

        <!-- secundários -->
        <div class="pill-secundaria sec-left-1 item-anim item-7">Controle</div>
        <div class="pill-secundaria sec-left-2 item-anim item-8">Produtividade</div>
        <div class="pill-secundaria sec-right-1 item-anim item-9">Automação</div>
        <div class="pill-secundaria sec-right-2 item-anim item-10">Escalabilidade</div>
        <div class="pill-secundaria sec-bottom item-anim item-11">Sua empresa</div>
      </div>

      <!-- mobile -->
      <div class="lg:hidden mobile-grid">
        <div class="nucleo-central mobile-core">
          <div class="nucleo-inner">
            <div class="nucleo-logo">Simples</div>
            <div class="nucleo-sub">Gestão integrada</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 mx-auto">
          <div class="pill-principal mobile-pill">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-cash-multiple</v-icon>
            </div>
            <div class="pill-content">
              <h3>Financeiro</h3>
              <p>Controle entradas, saídas e fluxo de caixa com mais clareza.</p>
            </div>
          </div>

          <div class="pill-principal mobile-pill">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-cart-outline</v-icon>
            </div>
            <div class="pill-content">
              <h3>Vendas</h3>
              <p>Gerencie vendas e pedidos com rapidez e organização.</p>
            </div>
          </div>

          <div class="pill-principal mobile-pill">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-package-variant-closed</v-icon>
            </div>
            <div class="pill-content">
              <h3>Estoque</h3>
              <p>Acompanhe produtos, movimentações e disponibilidade em tempo real.</p>
            </div>
          </div>

          <div class="pill-principal mobile-pill">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-monitor-dashboard</v-icon>
            </div>
            <div class="pill-content">
              <h3>PDV</h3>
              <p>Venda com mais praticidade através de um sistema ágil e intuitivo.</p>
            </div>
          </div>

          <div class="pill-principal mobile-pill">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-cellphone-link</v-icon>
            </div>
            <div class="pill-content">
              <h3>Totem</h3>
              <p>Automatize atendimentos e ofereça mais autonomia ao cliente.</p>
            </div>
          </div>

          <div class="pill-principal mobile-pill">
            <div class="pill-icon">
              <v-icon size="22" class="texto-color-laranja">mdi-chart-line</v-icon>
            </div>
            <div class="pill-content">
              <h3>Relatórios</h3>
              <p>Visualize indicadores e tome decisões com base em dados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="funcionalidades-showcase background-secondary py-10">
    <div class="funcionalidades-container">
      <div class="funcionalidades-header">
        <div class="funcionalidades-badge">
          Recursos que aceleram sua operação
        </div>

        <h2 class="funcionalidades-title">
          Simples <span class="texto-color-laranja">Fique</span>
        </h2>

        <p class="funcionalidades-subtitle">
          Um sistema de gestão comercial pensado para centralizar as operações do seu negócio
          com mais controle, produtividade e agilidade no dia a dia.
        </p>
      </div>

      <div
          data-aos="fade-up"
          data-aos-duration="1200"
          class="funcionalidades-grid"
      >
        <!-- IMAGEM / PREVIEW PRINCIPAL -->
        <div class="funcionalidades-preview order-1">
          <div class="preview-glow"></div>

          <div class="preview-card">
            <div class="preview-topbar">
              <div class="preview-topbar-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div class="preview-topbar-label">
                Módulo em destaque
              </div>
            </div>

            <div class="preview-image-wrapper">
              <v-img
                  :src="activeMenu.imagem || imageMenu"
                  :lazy-src="activeMenu.imagem || imageMenu"
                  cover
                  class="preview-image"
              >
                <template #placeholder>
                  <LazyImage />
                </template>
              </v-img>
            </div>

            <div class="preview-info">
              <div class="preview-info-header">
                <div>
                  <span class="preview-mini-label">Funcionalidade selecionada</span>
                  <h3 class="preview-title">{{ activeMenu.text }}</h3>
                </div>

                <div class="preview-icon-box">
                  <v-icon size="22" class="texto-color-laranja">
                    {{ activeMenu.icon }}
                  </v-icon>
                </div>
              </div>

              <p class="preview-description">
                {{ activeMenu.descricao }}
              </p>

              <div class="preview-highlights">
                <div
                    v-for="(beneficio, index) in activeMenu.beneficios"
                    :key="index"
                    class="preview-highlight"
                >
                  <v-icon size="16" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
                  <span>{{ beneficio }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- LISTA DE MÓDULOS -->
        <div class="funcionalidades-list">
          <div
              v-for="menu in menus"
              :key="menu.id"
              class="feature-card"
              :class="{ 'feature-card-active': activeId === menu.id }"
              @click="active(menu.id)"
          >
            <div class="feature-card-accent"></div>

            <div class="feature-card-icon">
              <v-icon size="24" :class="activeId === menu.id ? 'text-white' : 'texto-color-laranja'">
                {{ menu.icon }}
              </v-icon>
            </div>

            <div class="feature-card-content">
              <div class="feature-card-top">
                <h3
                    class="feature-card-title"
                    :class="{ 'feature-card-title-active': activeId === menu.id }"
                >
                  {{ menu.text }}
                </h3>

                <span class="feature-card-tag">
                {{ menu.tag }}
              </span>
              </div>

              <p class="feature-card-description">
                {{ menu.resumo }}
              </p>

              <div class="feature-card-footer">
                <button class="feature-card-link">
                  {{ menu.cta }}
                </button>

                <v-icon
                    size="18"
                    class="feature-card-arrow"
                    :class="{ 'feature-card-arrow-active': activeId === menu.id }"
                >
                  mdi-arrow-right
                </v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-final-olist">
    <div class="cta-final-container">
      <div class="cta-content">
        <h2 class="cta-title">
          Contrate o <strong>SimplesFique</strong> e veja o ritmo da sua operação mudar.
        </h2>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, computed} from "vue";

const activeId = ref(1)

const menus = ref([
  {
    id: 1,
    text: 'Financeiro',
    tag: 'Controle',
    icon: 'mdi-cash-multiple',
    imagem: require('@/assets/img/segmentos/financeira.jpeg'),
    resumo: 'Acompanhe receitas, despesas e fluxo de caixa em um só lugar.',
    descricao: 'O módulo financeiro oferece visão clara sobre entradas, saídas, contas a receber e movimentações, facilitando a gestão e a tomada de decisão.',
    beneficios: [
      'Fluxo de caixa mais organizado',
      'Controle de recebimentos e despesas',
      'Visão financeira em tempo real'
    ],
    cta: 'Ver detalhes'
  },
  {
    id: 2,
    text: 'Estoque',
    tag: 'Operação',
    icon: 'mdi-package-variant-closed',
    imagem: require('@/assets/img/segmentos/estoque.jpeg'),
    resumo: 'Gerencie produtos, saídas, entradas e disponibilidade com precisão.',
    descricao: 'Tenha controle total sobre o estoque da empresa, evitando faltas, excessos e erros operacionais que impactam as vendas.',
    beneficios: [
      'Movimentações centralizadas',
      'Redução de perdas e falhas',
      'Mais previsibilidade operacional'
    ],
    cta: 'Ver detalhes'
  },
  {
    id: 3,
    text: 'PDV',
    tag: 'Vendas',
    icon: 'mdi-monitor-dashboard',
    imagem: require('@/assets/img/segmentos/pdv.jpeg'),
    resumo: 'Mais agilidade e praticidade no atendimento e no fechamento das vendas.',
    descricao: 'O PDV simplifica a operação do caixa, acelera o processo de venda e melhora a experiência do cliente no atendimento.',
    beneficios: [
      'Atendimento mais rápido',
      'Operação intuitiva no caixa',
      'Integração com gestão comercial'
    ],
    cta: 'Ver detalhes'
  },
  {
    id: 4,
    text: 'Relatórios',
    tag: 'Análise',
    icon: 'mdi-chart-line',
    imagem: require('@/assets/img/segmentos/relatorios.jpeg'),
    resumo: 'Indicadores importantes para acompanhar a evolução do negócio.',
    descricao: 'Acompanhe os principais dados do sistema com relatórios visuais que ajudam a identificar oportunidades e corrigir gargalos.',
    beneficios: [
      'Mais clareza nos resultados',
      'Indicadores para decisões rápidas',
      'Acompanhamento da performance'
    ],
    cta: 'Ver detalhes'
  },
  {
    id: 5,
    text: 'Gestão de Pessoas',
    tag: 'Pessoas',
    icon: 'mdi-account-multiple-outline',
    imagem: require('@/assets/img/segmentos/pessoas.jpeg'),
    resumo: 'Centralize clientes, fornecedores e contatos em um único lugar.',
    descricao: 'Gerencie todas as pessoas do seu negócio com facilidade, organizando dados, histórico e relacionamentos para uma operação mais eficiente.',
    beneficios: [
      'Cadastro completo de clientes e fornecedores',
      'Histórico de compras e interações',
      'Mais organização e controle de contatos'
    ],
    cta: 'Ver detalhes'
  },
  {
    id: 6,
    text: 'Nota Fiscal (XML)',
    tag: 'Automação',
    icon: 'mdi-file-document-outline',
    imagem: require('@/assets/img/segmentos/fiscal.jpg'),
    resumo: 'Importe notas fiscais automaticamente via XML.',
    descricao: 'Ganhe tempo e reduza erros ao importar notas fiscais diretamente pelo XML, automatizando a entrada de produtos e informações no sistema.',
    beneficios: [
      'Importação automática de notas fiscais',
      'Redução de erros manuais',
      'Integração com estoque e financeiro'
    ],
    cta: 'Ver detalhes'
  }
])

const activeMenu = computed(() => {
  return menus.value.find(menu => menu.id === activeId.value) || menus.value[0]
})

function active(id) {
  activeId.value = id
}

const pushBottom = () => {
  window.scrollBy({
    top: window.innerHeight - 50,
    behavior: 'smooth'
  })
}

const funcionalidadesSection = ref(null)
const secaoVisivel = ref(false)

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          secaoVisivel.value = true
          observer?.disconnect()
        }
      },
      {
        threshold: 0.28,
      }
  )

  if (funcionalidadesSection.value) {
    observer.observe(funcionalidadesSection.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped lang="scss">
.funcionalidades-showcase {
  position: relative;
  overflow: hidden;
}

.funcionalidades-container {
  width: 90%;
  max-width: 1540px;
  margin: 0 auto;
  padding: 0 24px;
  background: var(--background-primary);
}

.funcionalidades-header {
  max-width: 860px;
  margin: 0 auto 56px;
  text-align: center;
}

.funcionalidades-badge {
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

.funcionalidades-title {
  font-size: clamp(2.4rem, 4vw, 4.5rem);
  line-height: 1.02;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text-color-primary);
  margin: 0;
}

.funcionalidades-subtitle {
  margin: 20px auto 0;
  max-width: 760px;
  font-size: clamp(1rem, 1.2vw, 1.25rem);
  line-height: 1.75;
  color: var(--text-color-primary);
  opacity: 0.82;
}

.funcionalidades-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  gap: 32px;
  align-items: stretch;
}

/* PREVIEW */
.funcionalidades-preview {
  position: relative;
  min-width: 0;
}

.preview-glow {
  position: absolute;
  inset: auto auto 10% 8%;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  background: rgba(255, 136, 0, 0.10);
  filter: blur(70px);
  pointer-events: none;
}

.preview-card {
  position: relative;
  z-index: 2;
  height: 100%;
  border-radius: 34px;
  overflow: hidden;
  background:
      linear-gradient(180deg, var(--bg-color-secondary), var(--bg-color));
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow:
      0 30px 80px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
}

.preview-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  background: rgba(255,255,255,0.5);
}

.preview-topbar-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-topbar-dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(0,0,0,0.12);
}

.preview-topbar-label {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-color-primary);
  opacity: 0.7;
}

.preview-image-wrapper {
  position: relative;
  padding: 18px 18px 0;
}

.preview-image {
  border-radius: 24px;
  min-height: 430px;
  box-shadow:
      0 18px 40px rgba(0,0,0,0.08);
}

.preview-info {
  padding: 26px 24px 28px;
}

.preview-info-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.preview-mini-label {
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-color-laranja);
  margin-bottom: 8px;
}

.preview-title {
  margin: 0;
  font-size: clamp(1.6rem, 2vw, 2.4rem);
  line-height: 1.05;
  color: var(--text-color-primary);
  font-weight: 700;
}

.preview-icon-box {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 136, 0, 0.08);
  border: 1px solid rgba(255, 136, 0, 0.14);
}

.preview-description {
  margin: 14px 0 0;
  font-size: 1.04rem;
  line-height: 1.75;
  color: var(--text-color-primary);
  opacity: 0.82;
}

.preview-highlights {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.preview-highlight {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 8px 18px rgba(0,0,0,0.03);
}

.preview-highlight span {
  font-size: 0.98rem;
  line-height: 1.5;
  color: var(--text-color-primary);
}

/* LISTA DE CARDS */
.funcionalidades-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-card {
  position: relative;
  display: flex;
  gap: 18px;
  align-items: flex-start;
  padding: 18px 22px 18px 20px;
  border-radius: 26px;
  cursor: pointer;
  overflow: hidden;
  transition:
      transform .32s ease,
      box-shadow .32s ease,
      border-color .32s ease,
      background .32s ease;
  background:
      linear-gradient(180deg, var(--bg-color-secondary), var(--bg-color-secondary));
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow:
      0 18px 36px rgba(0,0,0,0.05),
      inset 0 1px 0 rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow:
      0 24px 50px rgba(0,0,0,0.08),
      0 0 0 6px rgba(255, 136, 0, 0.04);
}

.feature-card-active {
  background:
      linear-gradient(180deg, rgba(255, 250, 245, 0.61), rgba(255, 246, 236, 0.4));
  border-color: rgba(255, 136, 0, 0.18);
  box-shadow:
      0 26px 56px rgba(0,0,0,0.08),
      0 0 0 6px rgba(255, 136, 0, 0.05);
}

.feature-card-accent {
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,136,0,0.2), var(--text-color-laranja), rgba(255,136,0,0.15));
  opacity: 0;
  transition: opacity .3s ease;
}

.feature-card-active .feature-card-accent,
.feature-card:hover .feature-card-accent {
  opacity: 1;
}

.feature-card-icon {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 136, 0, 0.08);
  border: 1px solid rgba(255, 136, 0, 0.14);
  transition: all .3s ease;
}

.feature-card-active .feature-card-icon {
  background: var(--text-color-laranja);
  border-color: var(--text-color-laranja);
  box-shadow: 0 14px 28px rgba(255, 136, 0, 0.22);
}

.feature-card-content {
  flex: 1;
  min-width: 0;
}

.feature-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.feature-card-title {
  margin: 0;
  font-size: 1.38rem;
  line-height: 1.15;
  font-weight: 700;
  color: var(--text-color-primary);
  transition: color .3s ease;
}

.feature-card-title-active {
  color: var(--text-color-laranja);
}

.feature-card-tag {
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color-laranja);
  background: rgba(255, 136, 0, 0.08);
  border: 1px solid rgba(255, 136, 0, 0.12);
}

.feature-card-description {
  margin: 12px 0 0;
  font-size: 0.98rem;
  line-height: 1.65;
  color: var(--text-color-primary);
  opacity: 0.78;
}

.feature-card-footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.feature-card-link {
  padding: 0;
  background: transparent;
  border: 0;
  font-size: 0.96rem;
  font-weight: 700;
  color: var(--text-color-laranja);
  cursor: pointer;
}

.feature-card-arrow {
  opacity: 0.45;
  transform: translateX(0);
  transition: all .25s ease;
}

.feature-card:hover .feature-card-arrow,
.feature-card-active .feature-card-arrow-active {
  opacity: 1;
  transform: translateX(4px);
}

/* RESPONSIVO */
@media (max-width: 1280px) {
  .funcionalidades-grid {
    grid-template-columns: 1fr;
  }

  .preview-image {
    min-height: 360px;
  }
}

@media (max-width: 768px) {
  .funcionalidades-showcase {
    padding: 80px 0 60px;
  }

  .funcionalidades-container {
    padding: 0 16px;
  }

  .funcionalidades-header {
    margin-bottom: 34px;
  }

  .feature-card {
    padding: 18px;
    border-radius: 22px;
  }

  .feature-card-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .feature-card-title {
    font-size: 1.18rem;
  }

  .preview-info {
    padding: 20px 18px 22px;
  }

  .preview-image {
    min-height: 260px;
    border-radius: 20px;
  }

  .preview-info-header {
    align-items: flex-start;
  }

  .preview-title {
    font-size: 1.5rem;
  }

  .preview-description {
    font-size: 0.96rem;
  }
}

// FUNCIONALIDADES
/* =========================
   FUNCIONALIDADES ECOSSISTEMA
========================= */

.funcionalidades-ecossistema {
  position: relative;
  overflow: hidden;
  padding-bottom: 20px;
}

.container-ecossistema {
  width: 100%;
  max-width: 1560px;
  margin: 0 auto;
  padding: 0 24px;
}

.mapa-wrapper {
  position: relative;
  width: 100%;
  height: 980px;
  max-width: 1500px;
  margin: 0 auto;
}

/* =========================
   LINHAS SVG
========================= */

.linhas-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

.linha-principal {
  fill: none;
  stroke: color-mix(in srgb, var(--text-color-laranja) 52%, transparent);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 2 8;
  filter: url(#glowLine);
  opacity: 0.95;

  stroke-dasharray: 1400;
  stroke-dashoffset: 1400;
  transition:
      stroke-dashoffset 1.35s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.8s ease;
}

.is-visible .linha-principal {
  stroke-dashoffset: 0;
}

.is-visible .linha-1 { transition-delay: 0.12s; }
.is-visible .linha-2 { transition-delay: 0.24s; }
.is-visible .linha-3 { transition-delay: 0.36s; }
.is-visible .linha-4 { transition-delay: 0.48s; }
.is-visible .linha-5 { transition-delay: 0.60s; }
.is-visible .linha-6 { transition-delay: 0.72s; }

/* =========================
   NÚCLEO CENTRAL
========================= */

.nucleo-central {
  position: absolute;
  left: 50%;
  top: 470px;
  transform: translate(-50%, -50%);
  width: 250px;
  height: 250px;
  border-radius: 999px;
  padding: 10px;
  z-index: 8;
  isolation: isolate;
  background: var(--bg-color-secondary);
  box-shadow:
      0 28px 80px rgba(0, 0, 0, 0.10),
      0 0 0 1px rgba(255,255,255,0.7);
}

.nucleo-inner {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background:
      radial-gradient(circle at top, var(--bg-color-secondary), var(--bg-color));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.9),
      inset 0 -10px 30px rgba(0,0,0,0.015);
}

.nucleo-logo {
  font-size: 3.2rem;
  line-height: 1;
  font-weight: 700;
  color: var(--text-color-laranja);
  letter-spacing: -0.04em;
}

.nucleo-sub {
  margin-top: 10px;
  font-size: 1.3rem;
  color: var(--text-color-primary);
  font-weight: 500;
  text-align: center;
}

/* =========================
   ITENS PRINCIPAIS
========================= */

.item-principal {
  position: absolute;
  z-index: 12;
}

.pos-top {
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
}

.pos-left-top {
  top: 230px;
  left: 200px;
}

.pos-right-top {
  top: 230px;
  right: 200px;
}

.pos-left-bottom {
  top: 540px;
  left: 200px;
}

.pos-right-bottom {
  top: 540px;
  right: 200px;
}

.pos-bottom {
  top: 760px;
  left: 50%;
  transform: translateX(-50%);
}

.pill-principal {
  width: 390px;
  min-height: 132px;
  padding: 22px 26px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
  isolation: isolate;
  backdrop-filter: blur(8px);
  background: var(--bg-color-secondary);
  border: 1px solid rgba(255,255,255,0.96);
  box-shadow:
      0 24px 54px rgba(0,0,0,0.08),
      0 0 0 1px rgba(255,255,255,0.55),
      inset 0 1px 0 rgba(255,255,255,0.92);
  transition:
      transform .4s ease,
      box-shadow .4s ease,
      border-color .4s ease,
      background .4s ease;
}

.pill-principal:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow:
      0 34px 74px rgba(0,0,0,0.12),
      0 0 0 1px rgba(255,255,255,0.86),
      0 0 0 8px rgba(255, 136, 0, 0.05);
  border-color: rgba(255, 136, 0, 0.20);
  background: var(--bg-color);
}

.pill-icon {
  width: 58px;
  height: 58px;
  min-width: 58px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 136, 0, 0.08);
  border: 1px solid rgba(255, 136, 0, 0.18);
  transition:
      transform .35s ease,
      background .35s ease,
      border-color .35s ease,
      box-shadow .35s ease;
}

.pill-principal:hover .pill-icon {
  transform: scale(1.07);
  background: rgba(255, 136, 0, 0.13);
  border-color: rgba(255, 136, 0, 0.28);
  box-shadow: 0 0 0 8px rgba(255, 136, 0, 0.05);
}

.pill-content {
  flex: 1;
  min-width: 0;
  max-width: 260px;
}

.pill-content h3 {
  margin: 0;
  font-size: 1.9rem;
  line-height: 1.05;
  font-weight: 600;
  color: var(--text-color-primary);
  transition: color .3s ease;
}

.pill-content p {
  margin: 10px 0 0;
  font-size: 1.06rem;
  line-height: 1.5;
  color: var(--text-color-primary);
  opacity: 0.78;
  transition: opacity .3s ease;
}

.pill-principal:hover .pill-content h3 {
  color: var(--text-color-laranja);
}

.pill-principal:hover .pill-content p {
  opacity: 0.95;
}

/* =========================
   PILLS SECUNDÁRIAS
========================= */

.pill-secundaria {
  position: absolute;
  z-index: 3;
  isolation: isolate;
  padding: 15px 28px;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--text-color-primary);
  opacity: 0.65;
  transform: scale(0.95);
  cursor: pointer;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.12),
      0 10px 25px rgba(0,0,0,0.04);
  transition:
      transform .3s ease,
      opacity .3s ease,
      background .3s ease,
      border-color .3s ease,
      color .3s ease,
      box-shadow .3s ease;
}

.pill-secundaria:hover {
  opacity: 1;
  transform: scale(1) translateY(-4px);
  background: rgba(255, 136, 0, 0.08);
  border-color: rgba(255, 136, 0, 0.18);
  color: var(--text-color-laranja);
  box-shadow:
      0 18px 32px rgba(0,0,0,0.06),
      0 0 0 5px rgba(255, 136, 0, 0.04);
}

.sec-left-1 {
  left: 40px;
  top: 470px;
}

.sec-left-2 {
  left: 80px;
  top: 700px;
}

.sec-right-1 {
  right: 40px;
  top: 470px;
}

.sec-right-2 {
  right: 80px;
  top: 700px;
}

.sec-bottom {
  left: 44%;
  top: 910px;
  transform: translateX(-50%) scale(0.95);
}

.sec-bottom:hover {
  transform: translateX(-50%) scale(1) translateY(-4px);
}

/* =========================
   ANIMAÇÃO DE ENTRADA
========================= */

.item-anim {
  opacity: 0;
  will-change: transform, opacity;
}

.item-core {
  transform: translate(-50%, -50%) scale(0.92);
}

.item-1,
.item-6 {
  transform: translateY(24px);
}

.item-2,
.item-4,
.item-7,
.item-8 {
  transform: translateX(-34px);
}

.item-3,
.item-5,
.item-9,
.item-10 {
  transform: translateX(34px);
}

.item-11 {
  transform: translateY(22px);
}

.is-visible .item-anim {
  opacity: 1;
  transition:
      opacity .75s ease,
      transform .9s cubic-bezier(0.22, 1, 0.36, 1);
}

.is-visible .item-core {
  transform: translate(-50%, -50%) scale(1);
  transition-delay: .10s;
}

.is-visible .item-1 { transform: translateY(0); transition-delay: .28s; }
.is-visible .item-2 { transform: translateX(0); transition-delay: .38s; }
.is-visible .item-3 { transform: translateX(0); transition-delay: .48s; }
.is-visible .item-4 { transform: translateX(0); transition-delay: .58s; }
.is-visible .item-5 { transform: translateX(0); transition-delay: .68s; }
.is-visible .item-6 { transform: translateY(0); transition-delay: .78s; }
.is-visible .item-7 { transform: translateX(0) scale(0.95); transition-delay: .88s; }
.is-visible .item-8 { transform: translateX(0) scale(0.95); transition-delay: .96s; }
.is-visible .item-9 { transform: translateX(0) scale(0.95); transition-delay: 1.04s; }
.is-visible .item-10 { transform: translateX(0) scale(0.95); transition-delay: 1.12s; }
.is-visible .item-11 { transform: translateY(0) scale(0.95); transition-delay: 1.20s; }

/* =========================
   MOBILE
========================= */

.mobile-grid {
  margin-top: 20px;
  justify-content: center;
}

.mobile-core {
  position: relative;
  left: auto;
  top: auto;
  transform: none;
  margin: 0 auto 24px;
}

.mobile-pill {
  width: 100%;
  min-height: 108px;
  border-radius: 32px;
}

/* =========================
   RESPONSIVIDADE
========================= */

@media (max-width: 1480px) {
  .pos-left-top { left: 120px; }
  .pos-right-top { right: 120px; }
  .pos-left-bottom { left: 120px; }
  .pos-right-bottom { right: 120px; }

  .pill-principal {
    width: 360px;
  }
}

@media (max-width: 1280px) {
  .pill-principal {
    width: 320px;
    min-height: 118px;
    padding: 20px 22px;
  }

  .pill-content h3 {
    font-size: 1.7rem;
  }

  .pill-content p {
    font-size: 1rem;
  }

  .pill-icon {
    width: 52px;
    height: 52px;
    min-width: 52px;
  }

  .sec-left-1,
  .sec-left-2,
  .sec-right-1,
  .sec-right-2 {
    display: none;
  }
}

@media (max-width: 1024px) {

  .container-ecossistema {
    padding: 0 18px;
  }
}

@media (max-width: 768px) {
  .container-ecossistema {
    padding: 0 16px;
  }

  .nucleo-central {
    width: 180px;
    height: 180px;
  }

  .nucleo-logo {
    font-size: 2.2rem;
  }

  .nucleo-sub {
    font-size: 1rem;
  }

  .pill-content h3 {
    font-size: 1.35rem;
  }

  .pill-content p {
    font-size: 0.95rem;
  }

  .pill-principal {
    border-radius: 30px;
  }

  .pill-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
  }
}

.item-1,
.item-6 {
  transform: translateX(-50%) translateY(24px);
}

.is-visible .item-1 {
  transform: translateX(-50%) translateY(0);
  transition-delay: .28s;
}

.is-visible .item-6 {
  transform: translateX(-50%) translateY(0);
  transition-delay: .78s;
}

// SESSÃO FINAL

.cta-final-olist {
  padding: 60px 0;
  background: var(--bg-card);
}

.cta-final-container {
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.cta-title {
  font-size: clamp(2.2rem, 3vw, 2rem);
  text-align: center;
  font-weight: 900;
  line-height: 1; /* mais colado ainda */
  letter-spacing: -0.02em;
  color: var(--text-color-laranja);
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .cta-side {
    display: none;
  }

  .cta-title {
    font-size: 1.8rem;
  }

  .cta-middle {
    flex-direction: column;
    gap: 8px;
  }
}

// hero

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

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.3rem;
  }

  .hero-description {
    font-size: 1rem;
  }
}
</style>