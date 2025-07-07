<template>
  <main class="display-grid-2-col h-100 px-5">
    <section class="display-flex-all-center">
      <v-sheet width="85%" class="bg-transparent">
        <v-img class="w-[100%] h-[100%]" cover alt="imagem ilustrativa - erro 404" :src="require('@/assets/img/not found-2.png')" />
      </v-sheet>
    </section>

    <section class="display-flex-start-col">
      <h1 class="texto-4xl">Oops!</h1>
      <h2 class="texto-2xl texto-color-laranja mb-5 mt-2">Página não encontrada</h2>
      <p class="mt-4">Essa página pode estar em construção, manutenção ou fora do ar. Sentimos muito.</p>

      <div class="d-flex align-center ga-3 mt-7">
        <v-sheet width="80" class="bg-transparent">
          <v-img class="w-[100%] h-[100%]" cover alt="imagem ilustrativa - suporte" :src="require('@/assets/img/suporte.png')" />
        </v-sheet>

        <div>
          <p class="texto-pequeno-15">Não se preocupe, volte a navegação normal ou entre em contato com o suporte.</p>
          <a href="#" class="texto-color-laranja text-decoration-none texto-pequeno-15">Entrar em contato com o Suporte</a>
        </div>
      </div>

      <v-btn
         to="/paginas/home" elevation="1"
          class="text-none w-100 mt-5 mb-16 background-navbar" variant="flat"
      >
        Continuar Navegando
      </v-btn>

<!--      <v-btn-->
<!--          v-else to="/" class="text-none w-100 mt-5 mb-16 background-navbar-primary"-->
<!--          variant="flat" elevation="1"-->
<!--      >-->
<!--        Continuar Navegando-->
<!--      </v-btn>-->
    </section>
  </main>
</template>

<script setup>
</script>

<style scoped>

</style>