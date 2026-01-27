<template>
  <top-all-pages icon="mdi-shape-plus">
    <template #titulo>Grupo de Produtos</template>
    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <!-- GRUPO -->
          <botao-expand-transition
              v-if="!exibirSubGrupo"
              :formulario-aberto="formularioAberto"
              @toggle="toggleFormulario"
          >
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Novo Grupo' }}</template>
          </botao-expand-transition>

          <!-- SUBGRUPO -->
          <botao-expand-transition
              v-if="exibirSubGrupo"
              :formulario-aberto="formularioAbertoSub"
              @toggle="toggleFormularioSub"
          >
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Novo SubGrupo' }}</template>
          </botao-expand-transition>
        </v-card-text>

        <!-- GRUPO -->
        <v-expand-transition>
          <div v-if="formularioAberto && !exibirSubGrupo">
            <v-card class="background-card" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px"/>
                {{ editando ? 'Editar Grupo' : 'Novo Grupo' }}
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef">
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field
                          density="compact"
                          variant="outlined"
                          label="Descrição Grupo"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="form.descgrupo"
                          class="required-left-border"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-inner-icon="mdi-text"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-file-input
                          label="Foto do Grupo"
                          variant="outlined"
                          density="compact"
                          accept="image/png, image/jpeg, image/bmp"
                          hide-details="auto"
                          :rules="validacaoFile"
                          v-model="form.foto"
                          chips
                          class="required-left-border"
                          prepend-inner-icon="mdi-image-outline"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-icon="mdi-"
                          @change="converterBase64"
                          size="30kb"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn v-if="!editando" color="grey" variant="text" @click="cancelarFormulario" size="small">Cancelar</v-btn>

                <v-btn
                    color="var(--text-color-laranja)"
                    :loading="loading"
                    @click="salvarGrupo"
                    variant="flat" size="small"
                    class="text-white">
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- SUBGRUPO -->
        <v-expand-transition>
          <div v-if="formularioAbertoSub && exibirSubGrupo">
            <v-card class="background-card" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px"/>
                {{ editando ? 'Editar SubGrupo' : 'Novo SubGrupo' }}
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                          density="compact"
                          variant="outlined"
                          label="Descrição Grupo"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="formSub.descsubgrupo"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-inner-icon="mdi-text"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-file-input
                          label="Foto do SubGrupo"
                          variant="outlined"
                          density="compact"
                          accept="image/png, image/jpeg, image/bmp"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="formSub.foto"
                          chips
                          prepend-inner-icon="mdi-image-outline"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          @change="converterBase64"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                          density="compact"
                          variant="outlined"
                          label="Comissão Vendedor (%)"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="formSub.perc_comissao_vendedor"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-inner-icon="mdi-percent-outline"
                          v-mask-number
                          type="number"
                          min="0.1"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                          density="compact"
                          variant="outlined"
                          label="Comissão Tecnico (%)"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="formSub.perc_comissao_tecnico"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-inner-icon="mdi-percent-outline"
                          v-mask-number
                          type="number"
                          min="0.1"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                          density="compact"
                          variant="outlined"
                          label="Índice Custo (%)"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="formSub.indice_custo"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-inner-icon="mdi-percent-outline"
                          v-mask-number
                          type="number"
                          min="0.1"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                          density="compact"
                          variant="outlined"
                          label="Índice Venda (%)"
                          hide-details="auto"
                          :rules="validacao"
                          v-model="formSub.indice_venda"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          prepend-inner-icon="mdi-percent-outline"
                          v-mask-number
                          type="number"
                          min="0.1"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn v-if="!editando" color="grey" variant="text" @click="cancelarFormularioSub" size="small">Cancelar</v-btn>

                <v-btn
                    color="var(--text-color-laranja)"
                    :loading="loading"
                    @click="salvarSubgrupo"
                    variant="flat" size="small"
                    class="text-white">
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- GRUPO -->
        <v-expand-transition>
          <div v-if="!formularioAberto && !exibirSubGrupo">
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                    class="ml-3"
                    width="480"
                    v-model="search"
                    label="Pesquisar"
                    append-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
                :headers="headers"
                :items="grupos"
                :loading="loading"
                item-key="id"
                class="background-secondary"
            >

              <template v-slot:[`item.foto`]="{ item }">
                <v-sheet class="bg-transparent pa-2 cursor-pointer" width="70px" height="70px" @click="exibirImagem(item)">
                  <v-img
                      class="w-100 h-100 rounded-md"
                      cover
                      :alt="`Imagem do grupo - ${item.descgrupo}`"
                      :src="decodificarImagemBase64(item.foto)"
                  />
                </v-sheet>
              </template>

              <template v-slot:[`item.subgrupos`]="{ item }">
                <v-btn
                    icon="mdi-eye-off-outline" variant="tonal" color="var(--text-color-laranja)"
                    @click="exibirSubgrupos(item)" size="small" v-if="!exibirSubGrupo"
                />
              </template>

              <template v-slot:[`item.acoes`]='{ item }'>
                <v-btn
                    icon="mdi-pencil" size="small"
                    color="primary" variant="text"
                    @click="editar(item)"
                />

                <v-btn
                    icon="mdi-delete" size="small"
                    color="error" variant="text"
                    @click="confirmarExclusao(item, 'grupo')"
                />
              </template>

              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon icon="mdi-shape-plus" size="64" class="mb-2 opacity-60"></v-icon>
                  <p class="text-body-1">Nenhum Grupo Encontrado!</p>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-expand-transition>

        <!-- SUBGRUPO -->
        <v-expand-transition>
          <div v-if="exibirSubGrupo">
            <p class="text-xl font-semibold mx-3">Grupo - {{grupoSelecionado.descgrupo}}</p>

            <v-data-table
                :headers="headers"
                :items="[grupoSelecionado]"
                hide-default-footer
                :loading="loading"
                item-key="id"
                class="background-card my-5"
            >
              <template v-slot:[`item.foto`]="{ item }">
                <v-sheet class="bg-transparent pa-2 cursor-pointer" width="50px" height="50px" @click="exibirImagem(item)">
                  <v-img
                      class="w-100 h-100 rounded-md"
                      cover
                      :alt="`Imagem do subgrupo - ${item.descsubgrupo}`"
                      :src="decodificarImagemBase64(item.foto)"
                  />
                </v-sheet>
              </template>

              <template v-slot:[`item.subgrupos`]>
                <v-btn
                    icon="mdi-eye-outline" variant="tonal" color="var(--text-color-laranja)"
                    @click="ocultarSubgrupos" size="small"
                />
              </template>
            </v-data-table>

            <p class="text-xl font-semibold mx-3 mb-5">Subgrupos</p>
            <v-data-table
                :headers="headersSub"
                :items="subgrupos"
                :loading="loading"
                item-key="id"
                class="background-secondary"
            >
              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon icon="mdi-shape-plus" size="64" class="mb-2 opacity-60"></v-icon>
                  <p class="text-body-1">Nenhum SubGrupo Encontrado!</p>
                </div>
              </template>

              <template v-slot:[`item.foto`]="{ item }">
                <v-sheet class="bg-transparent pa-2 cursor-pointer" width="70px" height="70px" @click="exibirImagem(item)">
                  <v-img
                      class="w-100 h-100 rounded-md"
                      cover
                      :alt="`Imagem do subgrupo - ${item.descsubgrupo}`"
                      :src="decodificarImagemBase64(item.foto)"
                  />
                </v-sheet>
              </template>

              <template v-slot:[`item.acoes`]='{ item }'>
                <v-btn
                    icon="mdi-pencil" size="small"
                    color="primary" variant="text"
                    @click="editarSub(item)"
                />

                <v-btn
                    icon="mdi-delete" size="small"
                    color="error" variant="text"
                    @click="confirmarExclusao(item, 'subgrupo')"
                />
              </template>
            </v-data-table>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- MODAL EXIBIR IMAGEM -->
      <exibir-imagem-modal
          :fechar-modal="fecharModal"
          v-model:modal-imagem="modalImagem"
          :imagem-alt="imagemAlt"
          :imagem-src="decodificarImagemBase64(imagemSrc)"
      />

      <!-- MODAL CONFIRMAR EXCLUSÃO -->
      <excluir-modal
          v-model:modal-excluir="modalExcluir"
          :deletar="deletar"
          :loading="loading"
          :cancelar="cancelarModalExcluir"
      >
        <template #item>
          {{tipoSelecionado?.tipo === 'grupo' ?
            tipoSelecionado?.itemSelecionado?.descgrupo :
            tipoSelecionado?.tipo === 'subgrupo' ?
                tipoSelecionado?.itemSelecionado?.descsubgrupo : ''
          }}
        </template>
      </excluir-modal>
    </template>
  </top-all-pages>
</template>

<script setup>
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import {ref, computed, watchEffect, reactive} from "vue";
import {toast} from "vue3-toastify";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import ExibirImagemModal from "@/components/base/modais/ExibirImagemModal.vue";

const themeStore = useThemeStore();
const estoqueStore = useEstoqueStore();

const grupos = computed(() => estoqueStore.grupos);
const subgrupos = computed(() => estoqueStore.subgrupos);
const loading = computed(() => estoqueStore.loading);

watchEffect(() => {
  if (grupos.value.length === 0) {
    estoqueStore.buscarTodos();
  }
});

// HEADERS DA TABELA
const headers = ref([
  {title: "ID", key: "id", align: "center"},
  {title: "Foto", key: "foto", align: "start"},
  {title: "Descrição do Grupo", key: "descgrupo", align: "start"},
  {title: "Ativo", key: "ativo", align: "start"},
  {title: "Ações", key: "acoes", align: "center", sortable: false},
  {title: "Sub Grupos", key: "subgrupos", align: "center", sortable: false},
]);

const headersSub = ref([
  {title: "ID", key: "id", align: "center"},
  {title: "Foto", key: "foto", align: "start"},
  {title: "Descrição do Subgrupo", key: "descsubgrupo", align: "start"},
  {title: "Pertence ao Grupo", key: "descgrupo", align: "start"},
  {title: "Comissão Vendedor", key: "perc_comissao_vendedor", align: "start"},
  {title: "Comissão Tecnico", key: "perc_comissao_tecnico", align: "start"},
  {title: "Ações", key: "acoes", align: "center", sortable: false},
]);

// ESTADO DO FORMULÁRIO
const formularioAberto = ref(false);
const formularioAbertoSub = ref(false);
const editando = ref(false);

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
  editando.value = false;
};

const toggleFormularioSub = () => {
  formularioAbertoSub.value = !formularioAbertoSub.value;
};

// CAMPOS DO FORMULÁRIO
const validacao = [(v) => !!v || "O campo é obrigatório"];
const validacaoFile = [(v) => !!v || "O campo é obrigatório"];

const search = ref("");
const base64 = ref("");
const formRef = ref(null);
const exibirSubGrupo = ref(false);

const form = reactive({
  "descgrupo": "",
  "foto": "",
});

const formSub = reactive({
  "descsubgrupo": "",
  "perc_comissao_vendedor": 0.1,
  "perc_comissao_tecnico": 0.1,
  "indice_custo": 0.1,
  "indice_venda": 0.1,
  "foto": "",
});

/**
 * CONVERTER IMAGEM PARA BASE64
 * @param event
 */

const erro = ref(false);

function converterBase64(event) {
  const arquivo = event.target.files[0]
  if (!arquivo) return

  if (arquivo.size > 150 * 1024) {
    toast.error('O arquivo excede o tamanho máximo de 150KB.');
    erro.value = true;
    validacaoFile.push(() => false || "O arquivo excede o tamanho máximo de 30KB.");
    return
  }

  const leitor = new FileReader()
  leitor.onload = () => {
    base64.value = leitor.result
  }
  leitor.readAsDataURL(arquivo)
  erro.value = false;
  validacaoFile.push(() => true || "");
}

function decodificarImagemBase64(base64String) {
  const decoded = atob(base64String);
  return decoded;
}

/**
 * CANCELAR FORMULÁRIOS
 */
const cancelarFormulario = () => {
  Object.assign(form, {
    descgrupo: "",
    foto: "",
  });
  if (formRef.value) formRef.value.resetValidation()
};

const cancelarFormularioSub = () => {
  Object.assign(formSub, {
    descsubgrupo: "",
    perc_comissao_vendedor: 0,
    perc_comissao_tecnico: 0,
    indice_custo: 0,
    indice_venda: 0,
    foto: "",
  });
  if (formRef.value) formRef.value.resetValidation()
};

/**
 * MODAL DE IMAGEM
 */
const modalImagem = ref(false);
const imagemSrc = ref("");
const imagemAlt = ref("");

const exibirImagem = (item) => {
  imagemSrc.value = item.foto;
  imagemAlt.value = `Grupo - ${item.descgrupo}`;
  modalImagem.value = true;
};

const fecharModal = () => {
  modalImagem.value = false;
  imagemSrc.value = "";
  imagemAlt.value = "";
};


/**
 * CADASTRANDO NOVO GRUPO
 * @param item
 */
const grupoSelecionado = ref(null);

const salvarGrupo = () => {
  form.foto = base64.value;

  if (erro.value) {
    toast.error('Corrija os erros antes de salvar.');
    return;
  }

  if (!editando.value) {
    estoqueStore.cadastrarGrupo({
      data: [
        {
          descgrupo: form.descgrupo,
          foto: form.foto,
        }
      ]
    });
  }
  else {
    estoqueStore.editarGrupo({
      data: [
        {
          descgrupo: form.descgrupo,
          foto: form.foto,
        }
      ]
    }, grupoSelecionado.value);
  }
  cancelarFormulario();
  formularioAberto.value = false;
};

/**
 * EDITANDO GRUPO
 * @param item
 */
const editar = (item) => {
  editando.value = true
  grupoSelecionado.value = item.id;

  Object.assign(form, item)
  formularioAberto.value = true
  console.log('Editando item:', item)
}

/**
 * SUBGRUPOS
 */
const subgrupoSelecionado = ref(null);

const exibirSubgrupos = async (item) => {
  exibirSubGrupo.value = !exibirSubGrupo.value;
  grupoSelecionado.value = item;
  if (subgrupos.value.map(sg => sg.descgrupo === item.descgrupo).length === 0)
  await estoqueStore.buscarTodosSubgrupos(item.id);
};

const ocultarSubgrupos = () => {
  exibirSubGrupo.value = false;
  grupoSelecionado.value = null;
  estoqueStore.subgrupos = [];
};

/**
 * CADASTRAR SUBGRUPO
 */
const salvarSubgrupo = () => {
  formSub.foto = base64.value;

  if (!editando.value) {
    estoqueStore.cadastrarSubgrupo({
      data: [
        {
          descsubgrupo: formSub.descsubgrupo,
          perc_comissao_vendedor: formSub.perc_comissao_vendedor,
          perc_comissao_tecnico: formSub.perc_comissao_tecnico,
          indice_custo: formSub.indice_custo,
          indice_venda: formSub.indice_venda,
          foto: formSub.foto,
          grupo_id: grupoSelecionado.value.id
        }
      ]
    }, grupoSelecionado.value.id);
  }
  else {
    estoqueStore.editarSubgrupo({
      data: [
        {
          descsubgrupo: formSub.descsubgrupo,
          perc_comissao_vendedor: formSub.perc_comissao_vendedor,
          perc_comissao_tecnico: formSub.perc_comissao_tecnico,
          indice_custo: formSub.indice_custo,
          indice_venda: formSub.indice_venda,
          foto: formSub.foto,
          grupo_id: grupoSelecionado.value.id
        }
      ]
    }, grupoSelecionado.value.id, subgrupoSelecionado.value);
  }
  cancelarFormularioSub();
  formularioAbertoSub.value = false;
};

/**
 * EDITAR SUBGRUPO
 */
const editarSub = (item) => {
  editando.value = true
  subgrupoSelecionado.value = item.id;

  Object.assign(formSub, item)
  formularioAbertoSub.value = true
  console.log('Editando item:', item)
};

/**
 * EXCLUINDO GRUPO / SUBGRUPO
 */
const modalExcluir = ref(false);
const tipoSelecionado = ref({});

const cancelarModalExcluir = () => {
  modalExcluir.value = false;
};

const confirmarExclusao = (item, tipo) => {
  modalExcluir.value = true;
  tipoSelecionado.value = {
    tipo: tipo,
    itemSelecionado: item
  };
};

const deletar = async () => {
  console.log(tipoSelecionado.value);
  if (tipoSelecionado.value?.tipo === 'grupo') {
    await estoqueStore.deletarGrupo(tipoSelecionado.value?.itemSelecionado?.id);
    grupoSelecionado.value = null;
  }
  if (tipoSelecionado.value?.tipo === 'subgrupo') {
    await estoqueStore.deletarSubgrupo(grupoSelecionado.value.id, tipoSelecionado.value?.itemSelecionado?.id);
    subgrupoSelecionado.value = null;
  }
  modalExcluir.value = false;
};
</script>