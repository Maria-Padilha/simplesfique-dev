<template>
  <top-all-pages icon="mdi-package-variant">
    <template #titulo>Detalhes do Produto</template>
    <template #section>
      <v-sheet class="bg-transparent">
        <v-tabs v-model="tab" color="var(--text-color-laranja)">
          <v-tab value="one">Produtos</v-tab>
          <v-tab value="tributo">Tributo</v-tab>
          <v-tab value="emb">Embalagem</v-tab>
          <v-tab value="for">Fornecedor</v-tab>
          <v-tab value="sim">Produtos Similares</v-tab>
          <v-tab value="img">Imagens</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <v-form ref="formRef" class="mt-10">
              <div class="w-100 flex justify-between gap-3 mb-8">
                <v-chip
                    variant="outlined"
                    :prepend-icon="forms.ativo === 'S' ? 'mdi-check-circle-outline' : 'mdi-cancel' "
                    :color="forms.ativo === 'S' ? 'success' : 'error'"
                >
                  {{ `Ativo: ${forms.ativo === 'S' ? 'Sim' : 'Não'}` }}
                </v-chip>

                <div class="flex gap-3">
                  <v-btn
                      class="text-none" color="error" variant="tonal"
                      @click="openModalDelete = true" :loading="produtosStore.loading"
                      prepend-icon="mdi-delete-outline" size="small"
                  >
                    Excluir
                  </v-btn>

                  <v-btn
                      class="text-none text-white" color="var(--text-color-laranja)" variant="flat"
                      @click="atualizarProduto" :loading="produtosStore.loading"
                      prepend-icon="mdi-content-save-outline" size="small"
                  >
                    Atualizar
                  </v-btn>
                </div>
              </div>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Descrição do Produto"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.descproduto"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Aplicação"
                      item-title="title"
                      item-value="value"
                      :items="[
                        { title: 'Produto para comercialização - venda', value: 'V' },
                        { title: 'Produto para consumo', value: 'C' },
                        { title: 'Matéria-Prima', value: 'M' },
                        { title: 'Imobilizado', value: 'I' },
                      ]"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.aplicacao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Tipo"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.tipo"
                      item-title="title"
                      item-value="value"
                      :items="[
                        { title: 'Produto', value: 'P' },
                        { title: 'Serviço', value: 'S' },
                      ]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código GTIN"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_gtin"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código SKU"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_sku"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código Fabricação"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_fab"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código Referência"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_ref"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Grupo"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descgrupo"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione o Grupo"
                  >
                    <template #append-inner>
                      <grupos-menu @selecionar="selecionarGrupo"/>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                      density="compact"
                      variant="outlined"
                      :label="`Subgrupo ${forms.id_grupo ? '' : '(Selecione o Grupo primeiro)'}`"
                      item-title="descsubgrupo"
                      item-value="id"
                      :items="subgrupos"
                      hide-details="auto"
                      v-model="forms.id_subgrupo"
                      :loading="estoqueStore.loading"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      :readonly="!forms.id_grupo"
                  >
                    <template #no-data><p class="pa-3">Nenhum Subgrupo cadastrado!</p></template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Classe"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descclasse"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a classe"
                  >
                    <template #append-inner>
                      <classes-menu @selecionar="selecionarClasse"/>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="NCM"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.id_ncm"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione o NCM"
                  >
                    <template #append-inner>
                      <ncm-menu @selecionar="selecionarNcm"/>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Marca"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descmarca"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a marca"
                  >
                    <template #append-inner>
                      <marcas-menu @selecionar="selecionarMarca"/>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Garantia"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descgarantia"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a garantia"
                  >
                    <template #append-inner>
                      <garantia-menu @selecionar="selecionarGarantia"/>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Medida"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="descmedida"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a medida"
                  >
                    <template #append-inner>
                      <medidas-menu @selecionar="selecionarMedida"/>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea
                      density="compact"
                      variant="outlined"
                      label="Descrição do Produto"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.observacao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      rows="2"
                  />
                </v-col>

                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Balança? ${forms.utiliza_balanca ? 'Sim' : 'Não'}`"
                      v-model="utiliza_balanca"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Grade? ${forms.utiliza_grade ? 'Sim' : 'Não'}`"
                      v-model="utiliza_grade"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza N. Série? ${forms.utiliza_nrserie ? 'Sim' : 'Não'}`"
                      v-model="utiliza_nrserie"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Lote? ${forms.utiliza_lote ? 'Sim' : 'Não'}`"
                      v-model="utiliza_lote"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Em Promoção? ${forms.em_promocao ? 'Sim' : 'Não'}`"
                      v-model="em_promocao"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>

          <v-tabs-window-item value="tributo">
            <v-card elevation="0" class="background-secondary mt-10">
              <v-card-text class="pa-4">
                <botao-expand-transition
                    v-if="!exibirTributos"
                    :formulario-aberto="formularioAbertoTributo"
                    @toggle="toggleFormularioTributo"
                >
                  <template #default>{{ formularioAbertoTributo ? 'Cancelar' : 'Novo Tributo' }}</template>
                </botao-expand-transition>
              </v-card-text>

              <forms-expand-transition
                  :salvar-formulario="salvarFormularioTributo"
                  :cancelar-formulario="cancelarFormularioTributo"
                  :formulario-aberto="formularioAbertoTributo"
                  :editando="editandoTributo"
                  :loading="produtosStore.loading"
              >
                <template #form>
                  <v-form ref="formRefTributo">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Classificação Fiscal"
                            hide-details="auto"
                            v-model="formsTributo.classificacao_fiscal"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-select
                            density="compact"
                            variant="outlined"
                            label="Incidencia Fiscal"
                            item-title="label"
                            item-value="value"
                            :items="camposIncidenciaFiscal"
                            hide-details="auto"
                            v-model="formsTributo.incidenciafiscal"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-autocomplete
                            :readonly="formsTributo.incidenciafisca !== '02'"
                            density="compact"
                            variant="outlined"
                            label="CEST"
                            type="number"
                            min="0"
                            hide-details="auto"
                            :items="cests"
                            item-title="descricao"
                            item-value="id"
                            v-model="formsTributo.id_cest"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Margem Lucro Bruto"
                            v-mask-number suffix="%"
                            hide-details="auto"
                            v-model="formsTributo.margem_lucro_bruto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Margem Lucro CNAE"
                            v-mask-number suffix="%"
                            hide-details="auto"
                            v-model="formsTributo.margem_lucro_cnae"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </template>
              </forms-expand-transition>

              <tabela-padrao
                  :formulario-aberto="formularioAbertoTributo"
                  :headers="headersTributo"
                  :items="tributos"
                  :loading="produtosStore.loading"
                  :search="search"
                  @update:search="(value) => search = value"
                  search-label="Pesquisar Items"
                  item-key="id"
                  no-data-icon="mdi-database-off"
                  no-data-text="Nenhum item encontrado"

              >
                <template v-slot:[`item.acoes`]='{ item }'>
                  <v-btn
                      icon="mdi-pencil" size="small"
                      color="primary" variant="text"
                      @click="editarTributo(item)"
                  />

                  <v-btn
                      icon="mdi-delete" size="small"
                      color="error" variant="text"
                      @click="deletarTributo(item)"
                  />
                </template>
              </tabela-padrao>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="emb">
            <v-card elevation="0" class="background-secondary mt-10">
              <v-card-text class="pa-4">
                <botao-expand-transition
                    v-if="!exibirEmbalagens"
                    :formulario-aberto="formularioAberto"
                    @toggle="toggleFormulario"
                >
                  <template #default>{{ formularioAberto ? 'Cancelar' : 'Nova Embalagem' }}</template>
                </botao-expand-transition>
              </v-card-text>

              <forms-expand-transition
                  :salvar-formulario="salvarFormulario"
                  :cancelar-formulario="cancelarFormulario"
                  :formulario-aberto="formularioAberto"
                  :editando="editandoEmb"
                  :loading="produtosStore.loading"
              >
                <template #form>
                  <v-form ref="formRefEmbalagem">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Descrição da Embalagem"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsEmbalagem.descembalagem"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Quantidade na Embalagem"
                            type="number"
                            min="0"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsEmbalagem.qtd_embalagem"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </template>
              </forms-expand-transition>

              <tabela-padrao
                  :formulario-aberto="formularioAberto"
                  :headers="headers"
                  :items="embalagens"
                  :loading="produtosStore.loading"
                  :search="search"
                  @update:search="(value) => search = value"
                  search-label="Pesquisar Items"
                  item-key="id"
                  no-data-icon="mdi-database-off"
                  no-data-text="Nenhum item encontrado"

              >
                <template v-slot:[`item.acoes`]='{ item }'>
                  <v-btn
                      icon="mdi-pencil" size="small"
                      color="primary" variant="text"
                      @click="editarEmb(item)"
                  />

                  <v-btn
                      icon="mdi-delete" size="small"
                      color="error" variant="text"
                      @click="deletarEmb(item)"
                  />
                </template>
              </tabela-padrao>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="for">
            <v-card elevation="0" class="background-secondary mt-10">
              <v-card-text class="pa-4">
                <botao-expand-transition
                    v-if="!exibirFornecedores"
                    :formulario-aberto="formularioAbertoFor"
                    @toggle="toggleFormularioFor"
                >
                  <template #default>{{ formularioAberto ? 'Cancelar' : 'Novo Fornecedor' }}</template>
                </botao-expand-transition>
              </v-card-text>

              <forms-expand-transition
                  :salvar-formulario="salvarFormularioFor"
                  :cancelar-formulario="cancelarFormularioFor"
                  :formulario-aberto="formularioAbertoFor"
                  :editando="editandoFor"
                  :loading="produtosStore.loading"
              >
                <template #form>
                  <v-form ref="formRefFornecedor">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-autocomplete
                            density="compact"
                            variant="outlined"
                            label="Fornecedor"
                            item-value="id"
                            item-title="nome_razao"
                            hide-details="auto"
                            :rules="validacao"
                            :items="pessoa_for"
                            v-model="formsFornecedor.id_pessoa"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            type="number"
                            min="0"
                            label="Nota"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsFornecedor.id_nota"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            @input="Number(formsFornecedor.id_nota) "
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            min="0"
                            label="Série"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsFornecedor.id_serie"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Data Última Compra"
                            type="date"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsFornecedor.dtultima_compra"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            type="number"
                            min="0"
                            label="Qtd. Última Compra"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsFornecedor.qtde_ultima_compra"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            type="number"
                            min="0"
                            label="Custo Última Compra"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsFornecedor.custo_ultima_compra"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </template>
              </forms-expand-transition>

              <tabela-padrao
                  :formulario-aberto="formularioAbertoFor"
                  :headers="headersFor"
                  :items="fornecedores"
                  :loading="produtosStore.loading"
                  :search="search"
                  @update:search="(value) => search = value"
                  search-label="Pesquisar Items"
                  item-key="id"
                  no-data-icon="mdi-database-off"
                  no-data-text="Nenhum item encontrado"

              >
                <template v-slot:[`item.dtultima_compra`]="{ item }">
                  {{ formatarData(item.dtultima_compra) }}
                </template>

                <template v-slot:[`item.custo_ultima_compra`]="{ item }">
                  {{ formatarParaReal(item.custo_ultima_compra) }}
                </template>

                <template v-slot:[`item.id_pessoa`]="{ item }">
                  {{ buscarPessoa(item.id_pessoa)?.nome_razao || 'Fornecedor não encontrado' }}
                </template>

                <template v-slot:[`item.acoes`]='{ item }'>
                  <v-btn
                      icon="mdi-pencil" size="small"
                      color="primary" variant="text"
                      @click="editarFor(item)"
                  />
                </template>
              </tabela-padrao>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="sim">
            <v-card elevation="0" class="background-secondary mt-10">
              <v-card-text class="pa-4">
                <botao-expand-transition
                    v-if="!exibirSimilares"
                    :formulario-aberto="formularioAbertoSimilar"
                    @toggle="toggleFormularioSimilar"
                >
                  <template #default>{{ formularioAbertoSimilar ? 'Cancelar' : 'Novo Produto Similar' }}</template>
                </botao-expand-transition>
              </v-card-text>

              <forms-expand-transition
                  :salvar-formulario="salvarFormularioSimilar"
                  :cancelar-formulario="cancelarFormularioSimilar"
                  :formulario-aberto="formularioAbertoSimilar"
                  :editando="editandoSimilar"
                  :loading="produtosStore.loading"
              >
                <template #form>
                  <v-form ref="formRefSimilar">
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            type="number"
                            min="0"
                            label="ID Similar"
                            hide-details="auto"
                            v-model.number="formsSimilar.id_similar"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            :readonly="editandoSimilar"
                        />
                      </v-col>

                      <v-col cols="12" md="8">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Descrição do Produto Similar"
                            hide-details="auto"
                            :rules="validacao"
                            v-model="formsSimilar.descproduto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </template>
              </forms-expand-transition>

              <tabela-padrao
                  :formulario-aberto="formularioAbertoSimilar"
                  :headers="headersSimilar"
                  :items="similares"
                  :loading="produtosStore.loading"
                  :search="search"
                  @update:search="(value) => search = value"
                  search-label="Pesquisar Produtos"
                  item-key="id"
                  no-data-icon="mdi-database-off"
                  no-data-text="Nenhum produto similar encontrado"
              >
                <template v-slot:[`item.acoes`]="{ item }">
                  <v-btn
                      icon="mdi-pencil"
                      size="small"
                      color="primary"
                      variant="text"
                      @click="editarSimilar(item)"
                  />

                  <v-btn
                      icon="mdi-delete" size="small"
                      color="error" variant="text"
                      @click="deletarSimilar(item)"
                  />
                </template>
              </tabela-padrao>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="img">
            <v-card elevation="0" class="background-secondary mt-10">
              <v-card-text class="pa-4">
                <p>Em construção...</p>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-sheet>

      <!-- DELETAR PRODUTO -->
      <excluir-modal
          :cancelar="() => openModalDelete = false"
          :deletar="excluirProduto"
          :loading="produtosStore.loading"
          v-model:modal-excluir="openModalDelete"
      >
        <template #item>{{ forms.descproduto }}</template>
      </excluir-modal>

      <!-- DELETAR EMBALAGEM -->
      <excluir-modal
          :cancelar="() => openModalDeleteEmb = false"
          :deletar="excluirEmbalagem"
          :loading="produtosStore.loading"
          v-model:modal-excluir="openModalDeleteEmb"
      >
        <template #item>{{ itemSelecionado?.descembalagem }}</template>
      </excluir-modal>

      <!-- DELETAR SIMILAR -->
      <excluir-modal
          :cancelar="() => openModalDeleteSimilar = false"
          :deletar="excluirSimilar"
          :loading="produtosStore.loading"
          v-model:modal-excluir="openModalDeleteSimilar"
      >
        <template #item>{{ itemSelecionadoSimilar?.descproduto }}</template>
      </excluir-modal>
    </template>
  </top-all-pages>
</template>

<script setup>
import {useRoute} from "vue-router";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import {useThemeStore} from "@/stores/config-temas/theme";
import {usePessoasStore} from "@/stores/APIs/pessoas";
import {computed, reactive, ref, watchEffect} from "vue";
import GruposMenu from "@/components/base/menu/GruposMenu.vue";
import ClassesMenu from "@/components/base/menu/ClassesMenu.vue";
import NcmMenu from "@/components/base/menu/NcmMenu.vue";
import MedidasMenu from "@/components/base/menu/MedidasMenu.vue";
import MarcasMenu from "@/components/base/menu/MarcasMenu.vue";
import GarantiaMenu from "@/components/base/menu/GarantiaMenu.vue";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";

const route = useRoute();
const produtosStore = useProdutosStore();
const estoqueStore = useEstoqueStore();
const themeStore = useThemeStore();
const pessoasStore = usePessoasStore();

const id = route.params.id;
const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));

// STATE
const openModalDelete = ref(false);
const tab = ref('tributo');
const validacao = [(v) => !!v || 'Campo obrigatório'];
const forms = computed(() => produtosStore.produto || {});

// const loading = computed(() => produtosStore.loading);
const descgrupo = computed(() => {
  const grupo = estoqueStore.grupos.find(g => g.id === forms.value?.id_grupo);
  return grupo ? grupo.descgrupo : '';
});


const subgrupos = computed(() => estoqueStore.subgrupos);

const descclasse = computed(() => {
  const classe = estoqueStore.classes.find(c => c.id === forms.value.id_classe);
  return classe ? classe.descclasse : '';
});

const descmarca = computed(() => {
  const marca = produtosStore.marcas.find(m => m.id === forms.value.id_marca);
  return marca ? marca.descmarca : '';
});

const descgarantia = computed(() => {
  const garantia = produtosStore.garantias.find(g => g.id === forms.value.id_garantia);
  return garantia ? garantia.descgarantia : '';
});

const descmedida = computed(() => {
  const medida = produtosStore.medidas.find(m => m.id === forms.value.id_medida);
  return medida ? medida.descmedida : '';
});

const utiliza_balanca = computed({
  get: () => forms.value.utiliza_balanca === 'S',
  set: (val) => {
    forms.value.utiliza_balanca = val ? 'S' : 'N';
  }
});

const utiliza_grade = computed({
  get: () => forms.value.utiliza_grade === 'S',
  set: (val) => {
    forms.value.utiliza_grade = val ? 'S' : 'N';
  }
});

const utiliza_nrserie = computed({
  get: () => forms.value.utiliza_nrserie === 'S',
  set: (val) => {
    forms.value.utiliza_nrserie = val ? 'S' : 'N';
  }
});

const utiliza_lote = computed({
  get: () => forms.value.utiliza_lote === 'S',
  set: (val) => {
    forms.value.utiliza_lote = val ? 'S' : 'N';
  }
});

const em_promocao = computed({
  get: () => forms.value.em_promocao === 'S',
  set: (val) => {
    forms.value.em_promocao = val ? 'S' : 'N';
  }
});

/**
 * SELECIONAR NCM
 */

const selecionarNcm = (ncmSelecionado) => {
  forms.value.id_ncm = ncmSelecionado.id;
  console.log("NCM Selecionado: ", ncmSelecionado);
}

/**
 * SELECIONAR GRUPO
 */

const selecionarGrupo = async (grupoSelecionado) => {
  forms.value.id_grupo = grupoSelecionado.id;
  descgrupo.value = grupoSelecionado.descgrupo;
  await buscarSubgrupos(grupoSelecionado.id);
};

/**
 * SELECIONAR CLASSE
 */

const selecionarClasse = (classeSelecionada) => {
  forms.value.id_classe = classeSelecionada.id;
  descclasse.value = classeSelecionada.descclasse;
};

/**
 * SELECIONAR MARCA
 */

const selecionarMarca = (itemSelecionado) => {
  forms.value.id_marca = itemSelecionado.id;
  descmarca.value = itemSelecionado.descmarca;
};

/**
 * SELECIONAR GARANTIA
 */

const selecionarGarantia = (itemSelecionado) => {
  forms.value.id_garantia = itemSelecionado.id;
  descgarantia.value = itemSelecionado.descgarantia;
};

/**
 * SELECIONAR MEDIDA
 */

const selecionarMedida = (itemSelecionado) => {
  forms.value.id_medida = itemSelecionado.id;
  descmedida.value = itemSelecionado.descmedida;
};

const buscarSubgrupos = async (id_grupo) => {
  await estoqueStore.buscarTodosSubgrupos(id_grupo);
}

/**
 * EXCLUIR PRODUTO
 */

const excluirProduto = async () => {
  await produtosStore.deletarProduto(id);
  openModalDelete.value = false;
};

/**
 * ATUALIZAR PRODUTO
 */

const atualizarProduto = async () => {
  await produtosStore.atualizarProduto(id, {
    data: [
      forms.value
    ]
  });
};

/** ================== EMBALAGENS ================== **/

const embalagens = computed(() => produtosStore.embalagens || []);

// abrindo o formulário de nova embalagem

const formularioAberto = ref(false);
const exibirEmbalagens = ref(false);
const editandoEmb = ref(false);
const itemSelecionado = ref(null);

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
  if (editandoEmb.value) cancelarFormulario()
};

// formulário de embalagem

const formRefEmbalagem = ref(null);
const formsEmbalagem = reactive({
  id_produto: id,
  qtd_embalagem: null,
  descembalagem: '',
});

const cancelarFormulario = () => {
  formularioAberto.value = false;
  formRefEmbalagem.value.reset();
  editandoEmb.value = false;
};

// dados da tabela de embalagens
const search = ref('');
const headers = [
  {title: 'ID', key: 'id'},
  {title: 'Descrição da Embalagem', key: 'descembalagem'},
  {title: 'Quantidade', key: 'qtd_embalagem'},
  {title: 'Ativo', key: 'ativo'},
  {title: 'Ações', key: 'acoes', sortable: false},
];

/**
 * EDITANDO EMBALAGEM
 */

const editarEmb = (item) => {
  itemSelecionado.value = item;
  Object.assign(formsEmbalagem, item)
  editandoEmb.value = true;
  formularioAberto.value = true;
};

/**
 * DELETAR EMBALAGEM
 */

const openModalDeleteEmb = ref(false);
const deletarEmb = (item) => {
  itemSelecionado.value = item;
  openModalDeleteEmb.value = true;
};

const excluirEmbalagem = async () => {
  await produtosStore.deletarEmbalagem(id, itemSelecionado.value.id);
  openModalDeleteEmb.value = false;
};

/**
 * SALVAR EMBALAGEM
 */

const salvarFormulario = async () => {
  if (formRefEmbalagem.value && !(await formRefEmbalagem.value.validate())) {
    return;
  }

  if (editandoEmb.value) {
    await produtosStore.atualizarEmbalagem(id, itemSelecionado.value.id, {
      data: [
        formsEmbalagem
      ]
    });
  } else {
    await produtosStore.cadastrarEmbalagem({
      data: [
        formsEmbalagem
      ]
    }, id);
  }

  cancelarFormulario();
};


/** ================= FORNECEDOR ================ **/

// abrindo o formulário de novo fornecedor

const formularioAbertoFor = ref(false);
const exibirFornecedores = ref(false);
const editandoFor = ref(false);

const toggleFormularioFor = () => {
  formularioAbertoFor.value = !formularioAbertoFor.value;
  if (editandoFor.value) cancelarFormularioFor()
};

// formulário de fornecedor

const formRefFornecedor = ref(null);
const formsFornecedor = reactive({
  id_produto: id,
  id_pessoa: null,
  id_nota: null,
  id_serie: null,
  dtultima_compra: null,
  qtde_ultima_compra: null,
  custo_ultima_compra: null,
});

const cancelarFormularioFor = () => {
  formularioAbertoFor.value = false;
  formRefFornecedor.value.reset();
  editandoFor.value = false;
};

// dados da tabela de fornecedores
const fornecedores = computed(() => produtosStore.fornecedores || []);

const pessoa_for = computed(() => {
  return pessoasStore.pessoas.filter(p => p.tipo_pessoa === 'F');
});

const buscarPessoa = (id) => {
  return pessoasStore.pessoas.find(p => p.id === id);
};

const headersFor = [
  {title: 'ID', key: 'id'},
  {title: 'Nome do Fornecedor', key: 'id_pessoa'},
  {title: 'Nota', key: 'id_nota'},
  {title: 'Data última compra', key: 'dtultima_compra'},
  {title: 'Qtd. última compra', key: 'qtde_ultima_compra'},
  {title: 'Custo última compra', key: 'custo_ultima_compra'},
  {title: 'Ações', key: 'acoes', sortable: false},
];

/**
 * EDITANDO FORNECEDOR
 */

const itemSelecionadoFor = ref(null);

const editarFor = (item) => {
  itemSelecionadoFor.value = item;
  Object.assign(formsFornecedor, item)
  editandoFor.value = true;
  formularioAbertoFor.value = true;
};

/**
 * SALVAR FORNECEDOR
 */

const salvarFormularioFor = async () => {
  if (formRefFornecedor.value && !(await formRefFornecedor.value.validate())) {
    return;
  }

  if (editandoFor.value) {
    await produtosStore.atualizarFornecedor(id, itemSelecionadoFor.value.id_pessoa, {
      data: [
        formsFornecedor
      ]
    });
  } else {
    await produtosStore.cadastrarFornecedor({
      data: [
        formsFornecedor
      ]
    }, id);
  }

  cancelarFormularioFor();
};


/** ================ PRODUTOS SIMILARES ================ **/

// abrindo o formulário de novo produto similar

const formularioAbertoSimilar = ref(false);
const exibirSimilares = ref(false);
const editandoSimilar = ref(false);

const toggleFormularioSimilar = () => {
  formularioAbertoSimilar.value = !formularioAbertoSimilar.value;
  if (editandoSimilar.value) cancelarFormularioSimilar()
};

// formulário de produto similar

const formRefSimilar = ref(null);

const formsSimilar = reactive({
  id_produto: Number(id),
  id_similar: null,
  descproduto: '',
  ativo: 'S'
});

const cancelarFormularioSimilar = () => {
  formularioAbertoSimilar.value = false;
  formRefSimilar.value.reset();
  editandoSimilar.value = false;
};

// dados da tabela de produtos similares

const similares = computed(() => produtosStore.similar || []);

const headersSimilar = [
  {title: 'ID', key: 'id_similar'},
  {title: 'Descrição do Produto Similar', key: 'descproduto'},
  {title: 'Ativo', key: 'ativo'},
  {title: 'Ações', key: 'acoes', sortable: false},
];

/**
 * EDITANDO PRODUTO SIMILAR
 */

const itemSelecionadoSimilar = ref(null);
const editarSimilar = (item) => {
  itemSelecionadoSimilar.value = item;
  Object.assign(formsSimilar, item)
  editandoSimilar.value = true;
  formularioAbertoSimilar.value = true;
};

/**
 * DELETAR PRODUTO SIMILAR
 */

const openModalDeleteSimilar = ref(false);
const deletarSimilar = (item) => {
  itemSelecionadoSimilar.value = item;
  openModalDeleteSimilar.value = true;
};

const excluirSimilar = async () => {
  await produtosStore.deletarProdutoSimilar(id, itemSelecionadoSimilar.value.id_similar);
  openModalDeleteSimilar.value = false;
};

/**
 * SALVAR PRODUTO SIMILAR
 */

const salvarFormularioSimilar = async () => {
  if (formRefSimilar.value && !(await formRefSimilar.value.validate())) {
    return;
  }

  if (editandoSimilar.value) {
    await produtosStore.atualizarProdutoSimilar(id, itemSelecionadoSimilar.value.id_similar, {
      data: [
        formsSimilar
      ]
    });
  } else {
    await produtosStore.cadastrarProdutoSimilar({
      data: [
        formsSimilar
      ]
    }, id);
  }

  cancelarFormularioSimilar();
};

/** ================ TRIBUTOS ================ **/

const exibirTributos = ref(false);
const formularioAbertoTributo = ref(false);
const editandoTributo = ref(false);
const formRefTributo = ref(null);

const cests = computed(() => estoqueStore.cests);

const formsTributo = reactive({
  id_produto: Number(id),
  classificacao_fiscal: '',
  id_cest: null,
  margem_lucro_bruto: null,
  margem_lucro_cnae: null,
  incidenciafiscal: null,
});

const camposIncidenciaFiscal = [
  {label: 'Nenhuma', value: '00'},
  {label: 'Monofásica', value: '01'},
  {label: 'Subst. Tributária', value: '02'},
  {label: 'Aliquota 0', value: '03'},
  {label: 'Suspensão', value: '04'},
];

const toggleFormularioTributo = () => {
  formularioAbertoTributo.value = !formularioAbertoTributo.value;
  if (editandoTributo.value) cancelarFormularioTributo();
};

const headersTributo = [
  {title: 'ID', key: 'id'},
  {title: 'Descrição do Tributo', key: 'desctributo'},
  {title: 'Valor (%)', key: 'valor_tributo'},
  {title: 'Ações', key: 'acoes', sortable: false},
];

const tributos = computed(() => produtosStore.tributos || []);

const cancelarFormularioTributo = () => {
  formularioAbertoTributo.value = false;
  formRefTributo.value.reset();
  editandoTributo.value = false;
};

const salvarFormularioTributo = async () => {
  if (formRefTributo.value && !(await formRefTributo.value.validate())) {
    return;
  }

  if (editandoTributo.value) {
    await produtosStore.atualizarTributo(idEmpresa?.id, id, {
      data: [
        formsTributo
      ]
    });
  } else {
    await produtosStore.cadastrarTributo({
      data: [
        formsTributo
      ]
    }, idEmpresa?.id, id);
  }

  cancelarFormularioTributo();
};

const editarTributo = (item) => {
  itemSelecionado.value = item;
  Object.assign(formsTributo, item)
  editandoTributo.value = true;
  formularioAbertoTributo.value = true;
};

const deletarTributo = (item) => {
  console.log("Deletando tributo: ", item);
};


/**
 * FUNÇÕES AUXILIARES
 */

function formatarData(dataISO) {
  if (!dataISO) return "";

  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarParaReal(valor) {
  if (!valor && valor !== 0) return "";

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/**
 * CHAMANDO AS APIs
 */

watchEffect(async () => {
  if (id) {
    await produtosStore.buscarProdutoPorId(id);
    if (subgrupos.value.length === 0)
      await buscarSubgrupos(produtosStore.produto?.id_grupo);

    if (embalagens.value.length === 0)
      await produtosStore.buscarEmbalagens(id);

    if (fornecedores.value.length === 0)
      await produtosStore.buscarFornecedores(id);

    if (pessoasStore.pessoas.length === 0)
      await pessoasStore.buscarTodasPessoas();

    if (similares.value.length === 0)
      await produtosStore.buscarProdutosSimilares(id);
  }
  if (cests.value.length === 0) {
    await estoqueStore.buscarCests();
  }
  if (tributos.value.length === 0) {
    await produtosStore.buscarTributoPorId(idEmpresa?.id, id);
  }
});
</script>