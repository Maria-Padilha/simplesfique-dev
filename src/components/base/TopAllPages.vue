<template>
  <main class="my-12 mx-3">
    <div class="flex items-center gap-5 mb-10">
      <v-btn :to="routeBtn" variant="outlined" icon="mdi-chevron-left" size="x-small" />
      <div>
        <h1 class="text-2xl"><slot name="titulo" /></h1>

        <v-breadcrumbs disabled class="px-0 py-0 texto-pequeno opacity-70" :items="linkPages">
          <template v-slot:divider>
            <v-icon size="15px" icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
    </div>

    <div v-if="mostrarBotao" class="flex justify-end mb-3">
      <v-btn
          v-if="!editar" @click="editar = true"
          :variant="themeStore.tipoBtn ? 'tonal' : 'flat'"
          color="var(--text-color-laranja)" size="small"
          class="text-none w-[100px]"
      >
        Editar
      </v-btn>

      <v-btn
          v-else @click="handleSalvar"
          :variant="themeStore.tipoBtn ? 'tonal' : 'flat'"
          color="var(--text-color-laranja)" size="small"
          class="text-none"
      >
        Salvar Alterações
      </v-btn>
    </div>

    <slot name="section"></slot>
  </main>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {defineProps, computed, ref, defineEmits, watch} from 'vue';

const themeStore = useThemeStore();

const props = defineProps({
  route: { type: String, default: '/paginas/home' },
  items: { type: Array },
  salvar: { type: Function },
  botao: { type: Boolean, default: false }
});

const emit = defineEmits(['update-editar']);

const routeBtn = computed(() => props.route);
const linkPages = computed(() => props.items);
const salvarAtualizacao = computed(() => props.salvar);
const mostrarBotao = computed(() => props.botao);

const editar = ref(false);

watch(editar, (val) => {
  emit('update-editar', val);
});

const handleSalvar = () => {
  if (typeof salvarAtualizacao.value === 'function') {
    salvarAtualizacao.value();
  }
  editar.value = false;
};
</script>