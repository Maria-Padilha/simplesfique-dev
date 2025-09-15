<template>
  <top-all-pages :items="['Página Principal']" :route="'/paginas/home'">
    <template #titulo>Home</template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from '@/components/base/TopAllPages.vue';
</script>