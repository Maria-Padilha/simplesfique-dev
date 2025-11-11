<template>
  <v-dialog v-model="modalImagem" max-width="450">
    <v-card class="background-secondary" elevation="0">
      <v-card-title class="background-laranja">
        <div class="flex items-center justify-between text-white">
          <p class="text-xl font-semibold">{{ imagemAlt }}</p>
          <v-btn icon="mdi-close" @click="fecharModal" variant="text" />
        </div>
      </v-card-title>

      <v-card-text>
        <v-img
            aspect-ratio="1.75" class="rounded-md"
            :src="imagemSrc"
            :alt="imagemAlt"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  imagemSrc: {
    type: String,
    required: true
  },
  imagemAlt: {
    type: String,
    required: true
  },
  modalImagem: {
    type: Boolean,
    required: true
  },
  fecharModal: {
    type: Function,
    required: true
  }
});

const modalImagem = computed(() => props.modalImagem);
const imagemSrc = computed(() => props.imagemSrc);
const imagemAlt = computed(() => props.imagemAlt);

const fecharModal = () => {
  props.fecharModal();
}
</script>