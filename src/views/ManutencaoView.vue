<template>
  <main class="launch-page background-secondary">
    <div class="launch-bg-glow launch-bg-glow-left"></div>
    <div class="launch-bg-glow launch-bg-glow-right"></div>

    <section class="launch-container">
      <div class="launch-grid">
        <!-- LADO ESQUERDO -->
        <div class="launch-content" data-aos="fade-right" data-aos-duration="1000">
          <div class="launch-badge">
            LANÇAMENTO EM BREVE
          </div>

          <h1 class="launch-title">
            O novo
            <span class="texto-color-laranja">SimplesFique</span>
            está chegando
          </h1>

          <p class="launch-description">
            Estamos preparando uma nova experiência para transformar a gestão da sua empresa
            com mais controle, produtividade e praticidade. Falta pouco para o lançamento oficial.
          </p>

          <div class="launch-countdown">
            <div class="countdown-card">
              <strong>{{ timeLeft.days }}</strong>
              <span>Dias</span>
            </div>

            <div class="countdown-card">
              <strong>{{ timeLeft.hours }}</strong>
              <span>Horas</span>
            </div>

            <div class="countdown-card">
              <strong>{{ timeLeft.minutes }}</strong>
              <span>Minutos</span>
            </div>

            <div class="countdown-card">
              <strong>{{ timeLeft.seconds }}</strong>
              <span>Segundos</span>
            </div>
          </div>

          <div class="launch-info-pill">
            <v-icon size="18" class="texto-color-laranja">mdi-calendar-star</v-icon>
            <span>Lançamento previsto para 01/07/2026</span>
          </div>

          <div class="launch-actions">
            <v-btn
                rounded="pill"
                elevation="0"
                class="text-none launch-btn-primary"
                color="var(--text-color-laranja)"
            >
              Quero saber do lançamento
            </v-btn>

            <v-btn
                rounded="pill"
                variant="outlined"
                elevation="0"
                class="text-none launch-btn-secondary"
            >
              Falar com o suporte
            </v-btn>
          </div>
        </div>

        <!-- LADO DIREITO -->
        <div class="launch-visual" data-aos="fade-left" data-aos-duration="1000">
          <div class="launch-visual-card">
            <div class="launch-visual-top">
              <div class="launch-visual-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div class="launch-visual-label">
                Em desenvolvimento
              </div>
            </div>

            <div class="launch-visual-image-wrap">
              <v-img
                  class="launch-visual-image"
                  cover
                  alt="Ilustração de lançamento do sistema"
                  :src="require('@/assets/img/not_found.png')"
              />
            </div>

            <div class="launch-visual-footer">
              <div class="launch-mini-card">
                <v-icon size="18" class="texto-color-laranja">mdi-rocket-launch-outline</v-icon>
                <span>Novo sistema em preparação</span>
              </div>

              <div class="launch-mini-card">
                <v-icon size="18" class="texto-color-laranja">mdi-cog-outline</v-icon>
                <span>Mais moderno e eficiente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const timeLeft = ref({
  days: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let timer = null

function updateCountdown() {
  const targetDate = new Date('2026-07-01T00:00:00')
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    timeLeft.value = {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    }
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  timeLeft.value = {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  }
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="scss">
.launch-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 40px 0;
  display: flex;
  align-items: center;
}

.launch-container {
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.launch-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 0.95fr);
  gap: 44px;
  align-items: center;
  min-height: calc(100vh - 80px);
}

.launch-content {
  max-width: 760px;
}

.launch-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  margin-bottom: 20px;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-color-laranja);
  background: rgba(255, 136, 0, 0.08);
  border: 1px solid rgba(255, 136, 0, 0.16);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.03);
}

.launch-title {
  margin: 0;
  font-size: clamp(2.8rem, 5vw, 5.4rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 500;
  color: var(--text-color-primary);
}

.launch-description {
  margin-top: 24px;
  max-width: 680px;
  font-size: clamp(1rem, 1.15vw, 1.2rem);
  line-height: 1.85;
  color: var(--text-color-primary);
  opacity: 0.82;
}

.launch-countdown {
  display: grid;
  grid-template-columns: repeat(4, minmax(110px, 1fr));
  gap: 16px;
  margin-top: 34px;
  max-width: 720px;
}

.countdown-card {
  padding: 22px 18px;
  border-radius: 26px;
  text-align: center;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
}

.countdown-card strong {
  display: block;
  font-size: clamp(2rem, 2.8vw, 3rem);
  line-height: 1;
  color: var(--text-color-laranja);
  font-weight: 800;
}

.countdown-card span {
  display: block;
  margin-top: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-color-primary);
  opacity: 0.74;
}

.launch-info-pill {
  margin-top: 22px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.03);
  color: var(--text-color-primary);
  font-size: 0.95rem;
  font-weight: 600;
}

.launch-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 28px;
}

.launch-btn-primary {
  min-width: 240px;
  height: 54px !important;
  font-weight: 700 !important;
  color: #fff !important;
  box-shadow: 0 18px 34px rgba(255, 122, 24, 0.18);
}

.launch-btn-secondary {
  min-width: 220px;
  height: 54px !important;
  font-weight: 700 !important;
  color: var(--text-color-primary) !important;
  border-color: rgba(0, 0, 0, 0.12) !important;
  background: rgba(255, 255, 255, 0.48);
}

/* VISUAL */
.launch-visual {
  min-width: 0;
}

.launch-visual-card {
  position: relative;
  border-radius: 34px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.07);
  backdrop-filter: blur(10px);
}

.launch-visual-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.launch-visual-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.launch-visual-dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
}

.launch-visual-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-color-laranja);
}

.launch-visual-image-wrap {
  padding: 18px 18px 0;
}

.launch-visual-image {
  min-height: 460px;
  border-radius: 24px;
}

.launch-visual-footer {
  display: grid;
  gap: 12px;
  padding: 22px 20px 24px;
}

.launch-mini-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(0, 0, 0, 0.04);
  color: var(--text-color-primary);
  font-size: 0.96rem;
  font-weight: 600;
}

/* GLOWS */
.launch-bg-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(80px);
  opacity: 0.12;
  pointer-events: none;
}

.launch-bg-glow-left {
  width: 280px;
  height: 280px;
  background: var(--text-color-laranja);
  top: -60px;
  left: -60px;
}

.launch-bg-glow-right {
  width: 320px;
  height: 320px;
  background: var(--text-color-laranja);
  right: -90px;
  bottom: -80px;
}

@media (max-width: 1280px) {
  .launch-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .launch-content {
    max-width: 100%;
    text-align: center;
    margin: 0 auto;
  }

  .launch-description {
    margin-left: auto;
    margin-right: auto;
  }

  .launch-countdown {
    margin-left: auto;
    margin-right: auto;
  }

  .launch-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .launch-page {
    padding: 28px 0;
  }

  .launch-container {
    padding: 0 16px;
  }

  .launch-grid {
    gap: 28px;
  }

  .launch-title {
    font-size: 2.6rem;
  }

  .launch-description {
    font-size: 0.98rem;
  }

  .launch-countdown {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .countdown-card {
    padding: 18px 12px;
    border-radius: 22px;
  }

  .launch-visual-image {
    min-height: 280px;
  }

  .launch-actions {
    flex-direction: column;
  }

  .launch-btn-primary,
  .launch-btn-secondary {
    width: 100%;
    min-width: 100%;
  }
}
</style>