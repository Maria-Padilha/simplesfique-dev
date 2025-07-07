<template>
  <main class='duas_sections'>
    <section class='section_orange px-5'>
      <h3 class='section_orange_text'>
        Encontre tudo que precisa em
        <span> um só lugar!</span>
      </h3>

      <v-sheet width="330px" class="bg-transparent">
        <v-img alt='imagem ecommerce' :src="require('@/assets/img/ecommerce.png')" class='w-[60%] section_orange_image' />
      </v-sheet>
    </section>

    <section class='section_white'>
      <div class='section_white_card'>
        <h3 class='text-center mt-2 texto-card'>Simples <span>Fique</span></h3>
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
import {ref} from "vue";

const exibirSenha = ref(false);
</script>