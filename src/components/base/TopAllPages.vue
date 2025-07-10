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

    <div v-if="mostrarBotao" class="flex justify-end gap-3 mb-3">
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

    <div v-if="botaoAdicionar" class="flex justify-end gap-3 mb-3">
      <v-btn
          @click="funcaoCancelar"
          :variant="themeStore.tipoBtn ? 'tonal' : 'flat'"
          color="red" size="small"
          class="text-none w-[100px]"
      >
        Cancelar
      </v-btn>

      <v-btn
          @click="funcaoAdicionar"
          :variant="themeStore.tipoBtn ? 'tonal' : 'flat'"
          color="green" size="small"
          class="text-none"
      >
        Adicionar <slot name="btnAdicionar" />
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
  route: { type: String, default: '/paginas/home' }, // para qual pagina vai voltar
  items: { type: Array }, // em qual página estamos, exemplo = home/perfil

  // função dos botões
  salvar: { type: Function }, // funcao executado pelo botao 'salvar alterações'
  cancel: { type: Function }, // funcao executado pelo botao 'cancelar'
  adicionar: { type: Function }, // funcao executado pelo botao 'adicionar'

  // mostrando os botões
  botao: { type: Boolean, default: false }, // paginas para editar algo
  btnAdicionar: { type: Boolean, default: false }, // paginas para adicionar algo
});

const emit = defineEmits(['update-editar']);

const routeBtn = computed(() => props.route);
const linkPages = computed(() => props.items);

const salvarAtualizacao = computed(() => props.salvar);
const funcaoCancelar = computed(() => props.cancel);
const funcaoAdicionar = computed(() => props.adicionar);

const mostrarBotao = computed(() => props.botao);
const botaoAdicionar = computed(() => props.btnAdicionar);

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