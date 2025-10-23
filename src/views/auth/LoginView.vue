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
          <v-text-field hide-details="auto" v-model="usuario" prepend-inner-icon="mdi-account-outline" placeholder="Usuário" variant="outlined" :rules="rules.usuario" />

          <v-text-field
              hide-details="auto" prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="!exibirSenha ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:appendInner="exibirSenha = !exibirSenha"
              :type="exibirSenha ? 'text' : 'password'"
              placeholder="Senha" variant="outlined"
              :rules="rules.senha" v-model="senha"
          />

          <router-link class="text-end text-decoration-underline texto-card texto-color-laranja text-sm" to="/resetar-senha">
            Esqueceu sua senha?
          </router-link>

          <v-btn
              class="w-[100%] text-none" color="var(--text-color-laranja)"
              size="large" variant="outlined"
              @click="login"
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


const themeStore = useThemeStore();
const router = useRouter();

const exibirSenha = ref(false);

const usuario = ref('');
const senha = ref('');

// const usuarioValido = ref({
//   usuario: 'admin',
//   senha: '123'
// })

const rules = ref({
  usuario: [
    v => !!v || 'O usuário é obrigatório',
  ],
  senha: [
    v => !!v || 'A senha é obrigatória',
  ]
});

const login = () => {
  // ========== CÓDIGO TEMPORÁRIO - API LOGIN ==========
  loginApi();
  // ===================================================
  
  // if (usuario.value === usuarioValido.value.usuario && senha.value === usuarioValido.value.senha) {
  //   toast.success('Login realizado com sucesso!');
  //   setTimeout(() => {
  //     router.push('/paginas/home');
  //   }, 1800);
  // } else {
  //   toast.error('Usuário ou senha inválidos!');
  // }
};

// ========== FUNÇÃO TEMPORÁRIA - API LOGIN ==========
const loginApi = async () => {
  try {
    // POST vazio para API temporária
    const response = await fetch('http://192.168.10.100:9005/vstsaaslogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
      // Sem body - POST vazio conforme solicitado
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      // Salvar token no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('login_timestamp', new Date().toISOString());
      
      console.log('Token salvo:', data.token); // DEBUG - remover depois
      console.log('Resposta da API:', data); // DEBUG - remover depois
      
      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        router.push('/paginas/home');
      }, 1800);
    } else {
      toast.error('Erro ao obter token do servidor!');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    toast.error('Erro ao conectar com o servidor!');
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