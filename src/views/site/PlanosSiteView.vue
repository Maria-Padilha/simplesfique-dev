<template>
  <section class="planos-page">
    <section class="planos-hero background-secondary">
      <div class="planos-hero-bg"></div>

      <div class="planos-container">
        <div class="planos-hero-content">
          <div class="hero-badge">
            Planos flexíveis para cada momento do seu negócio
          </div>

          <h1 class="hero-title">
            Escolha o
            <span class="texto-color-laranja">plano ideal</span>
            para sua empresa
          </h1>

          <p class="hero-description">
            Compare recursos, escolha o período que faz mais sentido para a sua operação
            e encontre a melhor combinação entre investimento, controle e crescimento.
          </p>
        </div>
      </div>
    </section>

    <section class="planos-content">
      <div class="planos-container">
        <div class="period-switch-wrapper">
          <div class="period-switch">
            <button
                v-for="opt in options"
                :key="opt.id"
                class="period-switch-item"
                :class="{ 'period-switch-item-active': choice === opt.id }"
                @click="onChangePeriod(opt.id)"
            >
              <span>{{ opt.text }}</span>
              <small v-if="opt.badge">{{ opt.badge }}</small>
            </button>
          </div>
        </div>

        <div class="period-info">
          <div class="period-info-pill">
            <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
            <span>Sem complicação para comparar</span>
          </div>

          <div class="period-info-pill">
            <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
            <span>Planos adaptados ao ritmo da sua empresa</span>
          </div>

          <div class="period-info-pill">
            <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
            <span>Mais previsibilidade para investir</span>
          </div>
        </div>

        <div class="planos-grid">
          <v-virtual-scroll
              :items="['div']"
              :height="700"
              item-height="700"
              class="pr-2"
          >
            <template #default>
              <div class="planos-list" data-aos="fade-right" data-aos-duration="1000">
                <div
                    v-for="plan in plansForPeriod"
                    :key="plan.id"
                    class="plan-card"
                    :class="{
                    'plan-card-selected': isSelected(plan),
                    'plan-card-highlight': !!plan.badge
                  }"
                    @click="selectPlan(plan)"
                >
                  <div class="plan-card-glow" v-if="isSelected(plan)"></div>

                  <div class="plan-card-top">
                    <div class="plan-card-title-wrap">
                      <div class="plan-card-mini-label">
                        {{ labelPeriodo(choice) }}
                      </div>

                      <h3 class="plan-card-title">
                        {{ plan.name }}
                      </h3>

                      <p class="plan-card-subtitle">
                        {{ planDescription(plan.name) }}
                      </p>
                    </div>

                    <v-chip
                        v-if="plan.badge"
                        size="small"
                        class="plan-badge"
                        color="var(--text-color-laranja)"
                        variant="flat"
                    >
                      {{ plan.badge }}
                    </v-chip>
                  </div>

                  <div class="plan-card-price">
                    <div class="plan-card-value">
                      {{ money(priceDisplay(plan).perPeriod) }}
                    </div>

                    <div class="plan-card-price-info">
                      {{ legendaPeriodo(choice) }}
                      <span v-if="choice !== 'mensal'">
                        • ~{{ money(priceDisplay(plan).perMonth) }}/mês
                      </span>
                    </div>
                  </div>

                  <div class="plan-card-highlights">
                    <div class="plan-card-highlight-item">
                      <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
                      <span>{{ quickHighlights(plan).one }}</span>
                    </div>

                    <div class="plan-card-highlight-item">
                      <v-icon size="18" class="texto-color-laranja">mdi-check-circle-outline</v-icon>
                      <span>{{ quickHighlights(plan).two }}</span>
                    </div>
                  </div>

                  <div class="plan-card-footer">
                    <v-btn
                        rounded="pill"
                        class="text-none plan-card-btn"
                        :color="isSelected(plan) ? 'var(--text-color-laranja)' : 'var(--text-color-laranja)'"
                        :variant="isSelected(plan) ? 'flat' : 'outlined'"
                        elevation="0"
                    >
                      {{ isSelected(plan) ? 'Plano selecionado' : 'Escolher plano' }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </template>
          </v-virtual-scroll>

          <aside class="planos-details-column">
            <div class="planos-details" data-aos="fade-left" data-aos-duration="1000">
              <div class="details-card">
                <div class="details-card-header">
                  <div>
                    <span class="details-mini-label">Comparativo de recursos</span>
                    <h3 class="details-title">
                      {{ selectedPlan?.name || 'Selecione um plano' }}
                    </h3>
                  </div>

                  <div class="details-price" v-if="selectedPlan">
                    {{ money(priceDisplay(selectedPlan).perPeriod) }}
                  </div>
                </div>

                <p v-if="selectedPlan" class="details-description">
                  {{ planDescription(selectedPlan.name) }}
                </p>

                <div v-if="selectedPlan" class="details-features">
                  <div
                      v-for="feat in featuresSchema"
                      :key="feat.key"
                      class="details-feature-row"
                  >
                    <div class="details-feature-label">
                      {{ feat.label }}
                    </div>

                    <div class="details-feature-value">
                      <span
                          v-if="selectedPlan.features[feat.key]"
                          class="feature-status feature-status-yes"
                      >
                        <v-icon size="18" color="success">mdi-check</v-icon>
                      </span>

                      <span
                          v-else
                          class="feature-status feature-status-no"
                      >
                        <v-icon size="18" color="error">mdi-close</v-icon>
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedPlan" class="details-actions">
                  <v-btn
                      rounded="pill"
                      class="text-none details-btn-primary"
                      color="var(--text-color-laranja)"
                      elevation="0"
                  >
                    Contratar {{ selectedPlan.name }}
                  </v-btn>

                  <v-btn
                      rounded="pill"
                      variant="outlined"
                      class="text-none details-btn-secondary"
                      elevation="0"
                  >
                    Falar com especialista
                  </v-btn>
                </div>

                <div v-else class="details-empty">
                  Selecione um plano para visualizar os detalhes.
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div class="planos-bottom-note">
          <div class="bottom-note-card">
            <div class="bottom-note-icon">
              <v-icon size="24" class="texto-color-laranja">mdi-lightning-bolt-outline</v-icon>
            </div>

            <div class="bottom-note-content">
              <h3>Escolha com mais clareza</h3>
              <p>
                Compare os planos de forma simples e identifique qual estrutura atende melhor
                o momento atual da sua empresa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import {ref, computed} from 'vue'

const options = [
  {id: 'mensal', text: 'Mensal'},
  {id: 'trimestral', text: 'Trimestral', badge: 'Economize mais'},
  {id: 'anual', text: 'Anual', badge: 'Melhor investimento'}
]

const choice = ref('mensal')

const featuresSchema = [
  {key: 'desktop', label: 'Versão desktop'},
  {key: 'online30', label: 'Acesso online'},
  {key: 'mobile', label: 'Uso em dispositivos móveis'},
  {key: 'topPlace', label: 'Destaque e prioridade'},
  {key: 'socialAds', label: 'Recursos para campanhas'},
  {key: 'mailAds', label: 'Automação de comunicação'}
]

const allPlans = ref([
  plan('m-basic', 'mensal', 'Básico', 12.99, 12.99, {
    desktop: true, online30: true, mobile: true, topPlace: false, socialAds: false, mailAds: false
  }),
  plan('m-prem', 'mensal', 'Premium', 23.99, 23.99, {
    desktop: true, online30: true, mobile: true, topPlace: true, socialAds: false, mailAds: false
  }, 'Mais Popular'),
  plan('m-pro', 'mensal', 'Profissional', 41.99, 41.99, {
    desktop: true, online30: true, mobile: true, topPlace: true, socialAds: true, mailAds: false
  }),

  plan('t-basic', 'trimestral', 'Básico', 34.90, 12.99, {
    desktop: true, online30: true, mobile: true, topPlace: false, socialAds: false, mailAds: false
  }),
  plan('t-prem', 'trimestral', 'Premium', 64.90, 23.99, {
    desktop: true, online30: true, mobile: true, topPlace: true, socialAds: false, mailAds: false
  }, 'Melhor Custo-Benefício'),
  plan('t-pro', 'trimestral', 'Profissional', 114.90, 41.99, {
    desktop: true, online30: true, mobile: true, topPlace: true, socialAds: true, mailAds: true
  }),

  plan('a-basic', 'anual', 'Básico', 139.90, 12.99, {
    desktop: true, online30: true, mobile: true, topPlace: false, socialAds: false, mailAds: false
  }),
  plan('a-prem', 'anual', 'Premium', 239.90, 23.99, {
    desktop: true, online30: true, mobile: true, topPlace: true, socialAds: false, mailAds: false
  }),
  plan('a-pro', 'anual', 'Profissional', 419.90, 41.99, {
    desktop: true, online30: true, mobile: true, topPlace: true, socialAds: true, mailAds: true
  }, 'Recomendado')
])

function plan(id, period, name, price, baseMonthly, features, badge = '') {
  return {id, period, name, price, baseMonthly, features, badge}
}

const plansForPeriod = computed(() => allPlans.value.filter(p => p.period === choice.value))
const selectedPlan = ref(null)

function onChangePeriod(period) {
  choice.value = period
  selectedPlan.value = plansForPeriod.value[0] || null
}

onChangePeriod(choice.value)

function selectPlan(plan) {
  selectedPlan.value = plan
}

function isSelected(plan) {
  return selectedPlan?.value?.id === plan.id
}

function labelPeriodo(p) {
  return p === 'mensal' ? 'Mensal' : p === 'trimestral' ? 'Trimestral' : 'Anual'
}

function legendaPeriodo(p) {
  return p === 'mensal' ? 'Por mês' : p === 'trimestral' ? 'Por trimestre' : 'Por ano'
}

function money(v) {
  return v.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}

function priceDisplay(plan) {
  if (!plan) return {perPeriod: 0, perMonth: 0}
  if (plan.period === 'mensal') return {perPeriod: plan.price, perMonth: plan.price}
  if (plan.period === 'trimestral') return {perPeriod: plan.price, perMonth: plan.price / 3}
  return {perPeriod: plan.price, perMonth: plan.price / 12}
}

function planDescription(name) {
  if (name === 'Básico') {
    return 'Ideal para empresas que querem começar com uma estrutura mais simples e organizada.'
  }
  if (name === 'Premium') {
    return 'Uma opção equilibrada para quem busca mais recursos e melhor custo-benefício.'
  }
  return 'Mais completo para operações que precisam de mais alcance, visibilidade e automações.'
}

function quickHighlights(plan) {
  if (plan.name === 'Básico') {
    return {
      one: 'Essencial para começar',
      two: 'Mais simplicidade na operação'
    }
  }

  if (plan.name === 'Premium') {
    return {
      one: 'Mais equilíbrio entre custo e recursos',
      two: 'Ótimo para crescer com mais controle'
    }
  }

  return {
    one: 'Mais recursos para expandir',
    two: 'Ideal para rotinas mais avançadas'
  }
}
</script>

<style lang="scss">
.v-virtual-scroll::-webkit-scrollbar {
  width: 10px;
}

/* Fundo da barra de rolagem */
.v-virtual-scroll::-webkit-scrollbar-track {
  background: var(--color-scroll-track);
  border-radius: 5px;
}

/* Cor da parte que "rola" */
.v-virtual-scroll::-webkit-scrollbar-thumb {
  background: var(--color-scroll);
  border-radius: 5px;
}

/* Quando passa o mouse por cima do scroll */
.v-virtual-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-scroll-hover);
}

.texto-color-laranja {
  color: #ff7a18;
}

.planos-page {
  position: relative;
  overflow: visible;
}

.planos-hero {
  position: relative;
  overflow: hidden;
  padding: 90px 0 60px;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.planos-hero-bg::before,
.planos-hero-bg::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.12;
  pointer-events: none;
}

.planos-hero-bg::before {
  width: 260px;
  height: 260px;
  background: var(--text-color-laranja);
  top: -70px;
  left: -70px;
}

.planos-hero-bg::after {
  width: 320px;
  height: 320px;
  background: var(--text-color-laranja);
  right: -80px;
  bottom: -100px;
}

.planos-container {
  width: 100%;
  max-width: 1520px;
  margin: 0 auto;
  padding: 0 24px;
}

.planos-hero-content {
  max-width: 920px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-badge {
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
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.03);
}

.hero-title {
  font-size: clamp(2.8rem, 5vw, 5.2rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 700;
  color: var(--text-color-primary);
  margin: 0;
}

.hero-description {
  max-width: 800px;
  margin: 22px auto 0;
  font-size: clamp(1rem, 1.2vw, 1.24rem);
  line-height: 1.8;
  color: var(--text-color-primary);
  opacity: 0.82;
}

.planos-content {
  padding: 20px;
  position: relative;
  overflow: visible;
  background: var(--bg-card);
}

.period-switch-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
}

.period-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 999px;
  background: var(--bg-color-secondary);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
}

.period-switch-item {
  min-width: 132px;
  padding: 12px 18px;
  border-radius: 999px;
  border: 0;
  background: transparent;
  color: var(--text-color-primary);
  font-weight: 700;
  transition: all 0.28s ease;
}

.period-switch-item span {
  display: block;
}

.period-switch-item small {
  display: block;
  margin-top: 2px;
  font-size: 0.72rem;
  color: var(--text-color-laranja);
  font-weight: 700;
}

.period-switch-item-active {
  background: linear-gradient(180deg, rgba(255, 136, 0, 1), rgba(255, 122, 24, 0.92));
  color: white;
  box-shadow: 0 14px 24px rgba(255, 122, 24, 0.22);
}

.period-switch-item-active small {
  color: rgba(255, 255, 255, 0.86);
}

.period-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 38px;
}

.period-info-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 999px;
  background: var(--bg-color-secondary);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.03);
  color: var(--text-color-primary);
  font-size: 0.94rem;
}

.planos-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 480px;
  gap: 28px;
  align-items: start;
  overflow: visible;
}

.planos-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.plan-card {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 26px;
  cursor: pointer;
  background: var(--bg-color);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 26px 56px rgba(0, 0, 0, 0.08);
}

.plan-card-selected {
  border-color: rgba(255, 136, 0, 0.24);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.08), 0 0 0 6px rgba(255, 136, 0, 0.05);
}

.plan-card-highlight {
  background: var(--bg-color-secondary);
}

.plan-card-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  right: -40px;
  top: -60px;
  background: rgba(255, 136, 0, 0.1);
  filter: blur(40px);
  pointer-events: none;
}

.plan-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.plan-card-mini-label,
.details-mini-label {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-color-laranja);
  margin-bottom: 8px;
}

.plan-card-title {
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.1;
  color: var(--text-color-primary);
  font-weight: 700;
}

.plan-card-subtitle {
  margin: 10px 0 0;
  max-width: 520px;
  font-size: 0.98rem;
  line-height: 1.65;
  color: var(--text-color-primary);
  opacity: 0.78;
}

.plan-badge {
  color: white !important;
  font-weight: 700 !important;
}

.plan-card-price {
  margin-top: 22px;
}

.plan-card-value {
  font-size: clamp(2rem, 2.2vw, 2.8rem);
  line-height: 1;
  font-weight: 800;
  color: var(--text-color-laranja);
}

.plan-card-price-info {
  margin-top: 8px;
  font-size: 0.92rem;
  color: var(--text-color-primary);
  opacity: 0.68;
}

.plan-card-highlights {
  display: grid;
  gap: 12px;
  margin-top: 22px;
}

.plan-card-highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-radius: 18px;
  background: var(--bg-color-secondary);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.plan-card-highlight-item span {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--text-color-primary);
}

.plan-card-footer {
  margin-top: 22px;
}

.plan-card-btn {
  min-width: 180px;
  font-weight: 700 !important;
}

.planos-details-column {
  position: relative;
  min-width: 0;
  align-self: start;
}

.planos-details {
  position: sticky;
  top: 24px;
  align-self: start;
  z-index: 5;
}

.details-card {
  border-radius: 30px;
  padding: 26px;
  background: var(--bg-color);
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 54px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  overflow-x: hidden;
}

.details-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.details-title {
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.1;
  font-weight: 700;
  color: var(--text-color-primary);
}

.details-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-color-laranja);
  white-space: nowrap;
}

.details-description {
  margin: 14px 0 0;
  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--text-color-primary);
  opacity: 0.8;
}

.details-features {
  margin-top: 24px;
  display: grid;
  gap: 12px;
}

.details-feature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--bg-color-secondary);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.details-feature-label {
  font-size: 0.96rem;
  line-height: 1.5;
  color: var(--text-color-primary);
}

.feature-status {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.feature-status-yes {
  background: rgba(34, 197, 94, 0.14);
}

.feature-status-no {
  background: rgba(239, 68, 68, 0.14);
}

.details-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.details-btn-primary,
.details-btn-secondary {
  min-width: 180px;
  font-weight: 700 !important;
}

.details-empty {
  padding: 20px 0 4px;
  font-size: 0.96rem;
  color: var(--text-color-primary);
  opacity: 0.7;
}

.planos-bottom-note {
  margin-top: 34px;
}

.bottom-note-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 24px;
  border-radius: 24px;
  background: var(--bg-color-secondary);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.04);
}

.bottom-note-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 136, 0, 0.08);
  border: 1px solid rgba(255, 136, 0, 0.14);
}

.bottom-note-content h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-color-primary);
}

.bottom-note-content p {
  margin: 8px 0 0;
  font-size: 0.96rem;
  line-height: 1.7;
  color: var(--text-color-primary);
  opacity: 0.78;
}

:deep(button:focus-visible) {
  outline: 2px solid rgba(251, 146, 60, 0.8);
  outline-offset: 2px;
  border-radius: 9999px;
}

@media (max-width: 1280px) {
  .planos-grid {
    grid-template-columns: 1fr;
  }

  .planos-details {
    position: static;
    top: auto;
  }

  .details-card {
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .planos-hero {
    padding: 70px 0 46px;
    min-height: auto;
  }

  .planos-container {
    padding: 0 16px;
  }

  .hero-title {
    font-size: 2.3rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .period-switch {
    width: 100%;
    flex-wrap: wrap;
    border-radius: 24px;
  }

  .period-switch-item {
    flex: 1 1 calc(50% - 8px);
    min-width: 140px;
  }

  .plan-card,
  .details-card {
    padding: 20px;
    border-radius: 24px;
  }

  .plan-card-top,
  .details-card-header {
    flex-direction: column;
  }

  .details-actions {
    flex-direction: column;
  }

  .details-btn-primary,
  .details-btn-secondary,
  .plan-card-btn {
    width: 100%;
  }

  .bottom-note-card {
    flex-direction: column;
  }
}
</style>