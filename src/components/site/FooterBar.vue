<template>
  <footer class="footer-landing relative z-10">
    <div class="footer-container">
      <div class="footer-left">
        <p class="footer-copy">
          © 2026 SimplesFique. Todos os direitos reservados.
        </p>
      </div>

      <div class="footer-social">
        <v-btn
            v-for="icon in icons"
            :key="icon.id"
            :icon="icon.icon"
            :to="icon.link"
            size="small"
            variant="text"
            class="footer-social-btn"
            color="var(--text-color)"
        />
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

// loop de repetição para a criação dos icons sociais
const icons = ref([
  { id: 1, icon: 'mdi-linkedin', link: '' },
  { id: 2, icon: 'mdi-twitter', link: '' },
  { id: 3, icon: 'mdi-instagram', link: '' },
])
</script>

<style scoped>
.footer-landing {
  width: 100%;
  padding: 14px 20px;
  background: color-mix(in srgb, var(--bg-color-secondary) 88%, transparent);
  border-top: 1px solid rgba(255, 153, 0, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.footer-copy {
  margin: 0;
  font-size: 0.92rem;
  color: var(--text-color);
  opacity: 0.72;
  font-weight: 500;
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-social-btn {
  width: 38px !important;
  height: 38px !important;
  border-radius: 12px !important;
  background: rgba(255, 153, 0, 0.05);
  border: 1px solid rgba(255, 153, 0, 0.10);
  transition: all 0.3s ease;
}

.footer-social-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 153, 0, 0.10);
  border-color: rgba(255, 153, 0, 0.18);
}

@media (max-width: 640px) {
  .footer-landing {
    padding: 16px;
  }

  .footer-container {
    flex-direction: column-reverse;
    justify-content: center;
    text-align: center;
    gap: 10px;
  }

  .footer-copy {
    font-size: 0.85rem;
  }
}
</style>