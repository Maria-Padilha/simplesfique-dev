<template>
  <v-card class="w-[100%]" elevation="0" color="transparent">
    <v-card-item>
      <!-- Botão Confirmar Vinculação -->
      <div v-if="produtoSelecionadoTemp" class="flex justify-end position-absolute z-10 right-0 mt-3 mr-4">
        <v-btn color="green" variant="flat" size="small" prepend-icon="mdi-check" @click="confirmarVinculo">
          Vincular neste produto
        </v-btn>
      </div>

      <div :class="tituloPesquisa ? 'flex items-center justify-between' : ''">
        <p class="text-lg opacity-90">{{tituloPesquisa}}</p>
        <v-text-field
            v-model="pesquisa"
            label="Pesquisar Produto"
            max-width="250px"
            append-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="mt-4 custom-text-field"
        ></v-text-field>
      </div>

      <v-data-table
          height="auto"
          :items="props.todosProdutos"
          item-key="id"
          items-per-page="5"
          class="elevation-1 cursor-pointer bg-transparent minha-tabela"
          return-object
          select-strategy="single"
          show-select
          v-model="selecionado"
          :search="pesquisa"
      />
    </v-card-item>
  </v-card>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch, computed} from "vue"

const props = defineProps({
  modalItemAberto: Boolean,
  itemSelecionado: {type: Object, default: () => ({})},
  todosProdutos: {type: Array, default: () => []},
  search: {type: String, default: ""},
  tituloPesquisa: {type: String, default: null}
})

const emit = defineEmits(["update:modalItemAberto", "vincular", "adicionar", "update:search"])

const pesquisa = computed(({
  get: () => props.search,
  set: (value) => emit('update:search', value)
}))

const produtoSelecionadoTemp = ref(null)

const fecharModal = () => emit("update:modalItemAberto", false)

const selecionado = ref(null);

watch(selecionado, (val) => {
  produtoSelecionadoTemp.value = val?.[0] ?? null
  console.log("Produto Selecionado Temporariamente:", produtoSelecionadoTemp.value)
})


const confirmarVinculo = () => {
  if (!produtoSelecionadoTemp.value) return

  emit("vincular", {
    item: props.itemSelecionado,
    produto: produtoSelecionadoTemp.value
  })

  produtoSelecionadoTemp.value = null
  fecharModal()
}
</script>

<style scoped>
.bg-secondary {
  background-color: var(--text-color-laranja);
}

/* Linha selecionada */
.linha-selecionada {
  background-color: rgba(255, 165, 0, 0.25) !important; /* Laranja suave */
  font-weight: 600;
}
</style>