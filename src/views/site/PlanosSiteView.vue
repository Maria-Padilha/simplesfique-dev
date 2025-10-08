<template>
  <ParticleBackground />
  <section class="flex flex-col items-center pb-10">
    <div class="flex flex-col w-100 items-center justify-center py-10 px-5 background-secondary relative z-10">
      <h1 class="text-center md:text-4xl text-3xl font-bold">
        Escolha seu <span class="texto-color-laranja">Plano</span>
      </h1>
      <p class="mt-2 text-center">Escolha um período e compare os recursos de cada plano.</p>
      <v-divider color="var(--text-color-laranja)" class="w-[150px] rounded-lg mt-4 mx-auto border-opacity-50" :thickness="5" />
    </div>

    <div class="my-10 flex items-center justify-center relative z-10">
      <div class="inline-flex rounded-full background-card">
        <v-btn
            v-for="opt in options" :key="opt.id" rounded
            class="px-4 py-2 rounded-full transition-all text-none"
            :variant="choice === opt.id ? 'tonal' : 'text'"
            :class="choice === opt.id
                ? 'background-laranja text-white shadow-sm'
                : 'text-gray-300 hover:text-white'"
            @click="onChangePeriod(opt.id)"
        >
          {{ opt.text }}
        </v-btn>
      </div>
    </div>

    <!-- grid 2 colunas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full px-16">
      <!-- ESQUERDA: planos empilhados -->
      <div data-aos="fade-right" data-aos-duration="1000" class="flex flex-col gap-5">
        <v-card
            v-for="plan in plansForPeriod"
            :key="plan.id"
            class="pa-4 relative overflow-hidden cursor-pointer background-card transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/10"
            @click="selectPlan(plan)"
            :elevation="isSelected(plan) ? 4 : 0"
            :class="[
            'rounded-2xl border',
            isSelected(plan) ? 'border-orange-400 ring-2 ring-orange-400/60' : 'border-gray-200'
          ]"
        >
          <!-- barra de destaque lateral no selecionado -->
          <div
              class="absolute left-0 top-0 h-full w-1.5 transition-all"
              :class="isSelected(plan) ? 'bg-gradient-to-b from-orange-400 to-amber-400' : 'bg-transparent'"
          ></div>

          <div class="flex items-center justify-between flex-wrap">
            <div class="flex items-center gap-3">
              <div class="font-semibold">{{ plan.name }}</div>
              <v-chip size="x-small" variant="outlined" color="primary">
                {{ labelPeriodo(choice) }}
              </v-chip>
              <v-chip v-if="plan.badge" size="small" color="var(--text-color-laranja)" variant="flat">
                {{ plan.badge }}
              </v-chip>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-2xl font-extrabold texto-color-laranja">
                  {{ money(priceDisplay(plan).perPeriod) }}
                </div>
                <div class="text-[11px] text-gray-500 -mt-1">
                  {{ legendaPeriodo(choice) }}
                  <span v-if="priceDisplay(plan).perMonth">
                    • ~{{ money(priceDisplay(plan).perMonth) }}/mês
                  </span>
                </div>
              </div>
              <v-btn
                  rounded="xl"
                  class="text-none font-semibold transition-all hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-orange-500/20"
                  :color="isSelected(plan) ? 'var(--text-color-laranja)' : 'primary'"
                  :variant="isSelected(plan) ? 'flat' : 'outlined'"
              >
                Adquirir
              </v-btn>
            </div>
          </div>
        </v-card>
      </div>

      <!-- DIREITA: detalhes -->
      <div data-aos="fade-right" data-aos-duration="1000">
        <v-card elevation="0" class="rounded-2xl overflow-hidden background-card">
          <div class="px-4 py-3 background-laranja text-white flex items-center justify-between">
            <span class="font-semibold">Detalhes</span>
            <span class="font-semibold">{{ selectedPlan?.name || '—' }}</span>
          </div>

          <div v-if="selectedPlan" class="p-0">
            <div
                v-for="(feat, idx) in featuresSchema"
                :key="feat.key"
                class="flex items-center justify-between px-4 py-3 border-b last:border-b-0 transition-colors"
                :class="idx % 2 ? 'background-secondary' : 'background-card'"
            >
              <div class="text-sm">{{ feat.label }}</div>
              <div>
                <!-- ícones suaves em “bolhas” -->
                <span
                    v-if="selectedPlan.features[feat.key]"
                    class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/15"
                >
                  <v-icon size="18" color="success">mdi-check</v-icon>
                </span>
                <span
                    v-else
                    class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15"
                >
                  <v-icon size="18" color="error">mdi-close</v-icon>
                </span>
              </div>
            </div>
          </div>

          <div v-else class="p-6 text-sm text-gray-500">
            Selecione um plano à esquerda para ver os detalhes.
          </div>
        </v-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ParticleBackground from "@/components/particle/ParticleBackground.vue";

/* ===== períodos ===== */
const options = [
  { id: 'mensal', text: 'Mensal' },
  { id: 'trimestral', text: 'Trimestral' },
  { id: 'anual', text: 'Anual' }
]
const choice = ref('mensal')

/* ===== schema features ===== */
const featuresSchema = [
  { key: 'desktop',   label: 'Desktop Version' },
  { key: 'online30',  label: '30 Days Online' },
  { key: 'mobile',    label: 'Mobile Optimized' },
  { key: 'topPlace',  label: 'Top Placement' },
  { key: 'socialAds', label: 'Social Media Ads' },
  { key: 'mailAds',   label: 'Mailing Ads' }
]

/* ===== dados ===== */
const allPlans = ref([
  // MENSAL
  plan('m-basic', 'mensal', 'Básico', 12.99, 12.99, { desktop: true, online30: true, mobile: true, topPlace: false, socialAds: false, mailAds: false }),
  plan('m-prem',  'mensal', 'Premium', 23.99, 23.99, { desktop: true, online30: true, mobile: true, topPlace: true,  socialAds: false, mailAds: false }, 'Mais Popular'),
  plan('m-pro',   'mensal', 'Profissional', 41.99, 41.99, { desktop: true, online30: true, mobile: true, topPlace: true,  socialAds: true,  mailAds: false }),

  // TRIMESTRAL
  plan('t-basic', 'trimestral', 'Básico', 34.90, 12.99, { desktop: true, online30: true, mobile: true, topPlace: false, socialAds: false, mailAds: false }),
  plan('t-prem',  'trimestral', 'Premium', 64.90, 23.99, { desktop: true, online30: true, mobile: true, topPlace: true,  socialAds: false, mailAds: false }, 'Melhor Custo-Benefício'),
  plan('t-pro',   'trimestral', 'Profissional', 114.90, 41.99, { desktop: true, online30: true, mobile: true, topPlace: true,  socialAds: true,  mailAds: true }),

  // ANUAL
  plan('a-basic', 'anual', 'Básico', 139.90, 12.99, { desktop: true, online30: true, mobile: true, topPlace: false, socialAds: false, mailAds: false }),
  plan('a-prem',  'anual', 'Premium', 239.90, 23.99, { desktop: true, online30: true, mobile: true, topPlace: true,  socialAds: false, mailAds: false }),
  plan('a-pro',   'anual', 'Profissional', 419.90, 41.99, { desktop: true, online30: true, mobile: true, topPlace: true,  socialAds: true,  mailAds: true }, 'Recomendado')
])
function plan(id, period, name, price, baseMonthly, features, badge = '') {
  return { id, period, name, price, baseMonthly, features, badge }
}

/* ===== derivados ===== */
const plansForPeriod = computed(() => allPlans.value.filter(p => p.period === choice.value))
const selectedPlan = ref(null)
function onChangePeriod(period) {
  choice.value = period
  selectedPlan.value = plansForPeriod.value[0] || null
}
onChangePeriod(choice.value) // init
function selectPlan(plan) { selectedPlan.value = plan }
function isSelected(plan) { return selectedPlan?.value?.id === plan.id }

/* ===== helpers UI ===== */
function labelPeriodo(p) { return p === 'mensal' ? 'Mensal' : p === 'trimestral' ? 'Trimestral' : 'Anual' }
function legendaPeriodo(p) { return p === 'mensal' ? 'Por mês' : p === 'trimestral' ? 'Por trimestre' : 'Por ano' }
function money(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function priceDisplay(plan) {
  if (!plan) return { perPeriod: 0, perMonth: 0 }
  if (plan.period === 'mensal') return { perPeriod: plan.price, perMonth: plan.price }
  if (plan.period === 'trimestral') return { perPeriod: plan.price, perMonth: plan.price / 3 }
  return { perPeriod: plan.price, perMonth: plan.price / 12 }
}
</script>

<style scoped>
.texto-color-laranja { color: #ff7a18; }

/* foco acessível nos botões do toggle (opcional) */
:deep(button:focus-visible) {
  outline: 2px solid rgba(251,146,60,.8);
  outline-offset: 2px;
  border-radius: 9999px;
}
</style>
