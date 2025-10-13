<template>
  <main class="display-grid-2-col h-100 px-5">
    <section class="display-flex-all-center">
      <v-sheet width="85%" class="bg-transparent">
        <v-img class="w-[100%] h-[100%]" cover alt="imagem ilustrativa - erro 404" :src="require('@/assets/img/not_found.png')" />
      </v-sheet>
    </section>

    <section class="display-flex-start-col">
      <h1 class="texto-4xl">Oops!</h1>
      <h2 class="texto-2xl texto-color-laranja mb-5 mt-2">Página em Construção</h2>
      <p class="mt-4">Essa página pode estar em construção ou manutenção. Sentimos Muito!</p>

      <div class="d-flex align-center ga-3 mt-7">
        <v-sheet width="80" class="bg-transparent">
          <v-img class="w-[100%] h-[100%]" cover alt="imagem ilustrativa - suporte" :src="require('@/assets/img/suporte.png')" />
        </v-sheet>

        <div>
          <p class="texto-pequeno-15">Não se preocupe, entre em contato com o suporte caso haja alguma dúvida</p>
          <a href="#" class="texto-color-laranja text-decoration-none texto-pequeno-15">Entrar em contato com o Suporte</a>
        </div>
      </div>
    </section>
  </main>
</template>