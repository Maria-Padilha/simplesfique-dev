<template>
  <main class='duas_sections'>
    <section class='section_orange'>

      <div class="w-[100%] flex flex-col items-center mb-10">
        <v-sheet width="60px" class="bg-transparent">
          <v-img
              alt='imagem ecommerce' class='w-[100%] section_orange_image'
              :src="!themeStore.darkMode ? require('@/assets/img/logo/logo-dark.png') : require('@/assets/img/logo/logo.png')"
          />
        </v-sheet>

        <h3 class='text-center text-xl mt-2 texto-card text-semibold'>Simples <span>Fique</span></h3>
      </div>

      <v-sheet width="400px" class="bg-transparent">
        <v-img alt='imagem ecommerce' :src="require('@/assets/img/ecommerce.png')" class='w-[100%] section_orange_image' />
      </v-sheet>
    </section>

    <section class='section_white'>
      <div class='section_white_card'>
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

          <router-link class="text-end text-decoration-none texto-card texto-pequeno-15 opacity-70" to="/resetar-senha">
            Esqueceu sua senha?
          </router-link>

          <v-btn class="w-[100%] background-laranja" to="/paginas/home">Login</v-btn>
        </v-form>
      </div>
    </section>
  </main>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {ref} from "vue";

const themeStore = useThemeStore();

const exibirSenha = ref(false);
</script>