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

        <v-form class="mt-5 d-flex flex-column ga-4" @keyup.enter="login">
          <v-text-field
              hide-details="auto"
              v-model="email"
              prepend-inner-icon="mdi-email-outline"
              placeholder="E-mail" variant="outlined"
              :rules="rules.email"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
          />

          <v-text-field
              hide-details="auto" prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="!exibirSenha ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:appendInner="exibirSenha = !exibirSenha"
              :type="exibirSenha ? 'text' : 'password'"
              placeholder="Senha" variant="outlined"
              :rules="rules.senha" v-model="senha"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
          />

          <router-link class="text-end text-decoration-underline texto-card texto-color-laranja text-sm" to="/resetar-senha">
            Esqueceu sua senha?
          </router-link>

          <v-btn
              class="w-[100%] text-none" color="var(--text-color-laranja)"
              size="large" variant="outlined"
              @click="login" :loading="loading"
          >
            Entrar
          </v-btn>
        </v-form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import ParticleBackground from '@/components/particle/ParticleBackground.vue';
import { useRouter } from "vue-router";
import {toast} from "vue3-toastify";
import {useApiStore} from "@/stores/APIs/api";
import apiPhp from "@/services/apiPhp";


const themeStore = useThemeStore();
const router = useRouter();
const apiStore = useApiStore();

const exibirSenha = ref(false);

const email = ref('');
const senha = ref('');

const rules = ref({
  email: [
    v => !!v || 'O e-mail é obrigatório',
  ],
  senha: [
    v => !!v || 'A senha é obrigatória',
  ]
});

const loading = ref(false);

const login = async () => {
  loading.value = true;
  try {
    const response = await apiPhp.post('/auth/login', {
      email: email.value,
      senha: senha.value,
    });

    const data = response.data;

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('login_timestamp', new Date().toISOString());

      if (data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }
      if (data.saas) {
        localStorage.setItem('saas', JSON.stringify(data.saas));
      }
      if (data.empresas) {
        localStorage.setItem('empresas', JSON.stringify(data.empresas));
        apiStore.dataEmpresa = data.empresas;
      }

      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        router.push('/paginas/home');
      }, 800);
    } else {
      toast.error('Erro ao obter token do servidor!');
    }
  } catch (error) {
    const msg = error.validationMessage
      || error.response?.data?.message
      || 'E-mail ou senha inválidos!';
    toast.error(msg);
  } finally {
    loading.value = false;
  }
};
// ===================================================
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