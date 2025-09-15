<template>
  <main class='login-container'>
    <ParticleBackground />
    <div class='section_white'>
      <div class='section_white_card'>
        <div class="d-flex justify-center align-center">
          <v-sheet :width="65" class="bg-transparent mb-2">
            <v-img
                class="w-[100%] h-[100%]" cover alt="logo"
                :src="themeStore.darkMode ? require('@/assets/img/logo/logo.png') : require('@/assets/img/logo/logo-dark.png')"
            />
          </v-sheet>
        </div>
       
        <h3 class='text-center text-xl text-uppercase texto-card'>Simples <span>Fique</span></h3>
        <p class='mt-4 texto-card'>Login</p>

        <v-form class="mt-5 d-flex flex-column ga-4">
          <v-text-field hide-details prepend-inner-icon="mdi-account-outline" placeholder="Usuário" variant="outlined" />

          <v-text-field
              hide-details prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="!exibirSenha ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:appendInner="exibirSenha = !exibirSenha"
              :type="exibirSenha ? 'text' : 'password'"
              placeholder="Senha" variant="outlined"
          />

          <router-link class="text-end text-decoration-underline texto-card texto-color-laranja text-sm" to="/resetar-senha">
            Esqueceu sua senha?
          </router-link>

          <v-btn class="w-[100%] text-none" color="var(--text-color-laranja)" to="/paginas/home" size="large" variant="outlined">Entrar</v-btn>
        </v-form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import ParticleBackground from '@/components/particle/ParticleBackground.vue';

const themeStore = useThemeStore();
const exibirSenha = ref(false);
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.login-box {
  position: relative;
  z-index: 1;
}

.section_white_card {
  width: 400px;
  padding: 70px 30px;
  border-radius: 10px;
  background: var(--bg-color);
  border: 2px solid var(--text-secondary-laranja);
  backdrop-filter: blur(10px);
}

@media screen and (max-width: 647px) {
  .section_white_card {
    width: 90%;
    margin: 0 auto;
  }
}
</style>