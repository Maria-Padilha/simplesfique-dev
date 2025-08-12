<template>
  <top-all-pages :items="['Home', 'Pagina Principal']" :route="'/paginas/home'" :btnAdicionar="true" :adicionar="addBtn">
    <template #titulo>Página Principal</template>

    <template #section>
      opa
    </template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from '@/components/base/TopAllPages.vue';

const addBtn = () => {
  alert('VAI CORINTHIANS!!!!!!!!!!!!!!!!')
}
</script>