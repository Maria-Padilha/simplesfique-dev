# Agent: UI Component

Cria e modifica componentes Vue do SimplesFique ERP.

## Padrão de página CRUD

```vue
<template>
  <TopAllPages icon="mdi-...">
    <template #titulo>Nome do Módulo</template>
    <template #acoes>
      <v-btn @click="abrirFormulario">Novo</v-btn>
    </template>
    <template #section>
      <v-card class="background-secondary mb-4">
        <v-card-text>{{ resumo }}</v-card-text>
      </v-card>
      <v-card>
        <v-tabs v-model="abaAtiva">...</v-tabs>
        <v-data-table :headers :items :loading show-select>
          <template #item.actions="{ item }">
            <v-btn icon @click="editarItem(item)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon @click="deletarItem(item)"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-expand-transition>
        <v-card v-if="mostrarFormulario">...</v-card>
      </v-expand-transition>
    </template>
  </TopAllPages>

  <CadastrarModal v-model="modalCadastro" ... />
  <ExcluirModal v-model="modalExcluir" ... />
</template>
```

## Componentes base disponíveis

### Wrappers de página
- `TopAllPages` — props: `icon`, slots: `#titulo`, `#acoes`, `#section`
- `TabelaPadrao` — props: `headers`, `items`, `loading`, `showSearch`, `expandable`, `showSelect`

### Modais
- `CadastrarModal` — v-model + slots `#titulo`, `#textfields`
- `ExcluirModal` — v-model + props `deletar`, `cancelar`
- `ExportacaoModal`, `ErrorAlertModal`, `AcessoNegadoModal`, `PdfPreviewModal`
- `VincularProdutos`, `LeitorCodigoBarrasModal`
- `BaixaCaixaModal`, `BaixaBancoModal`, `AberturaCaixaModal`
- `ConfigAcessosRapidosModal`

### Busca e filtros
- `BuscaAvancada`, `BuscaAvancadaBaixa`, `BuscaAvancadaAutorizacao`
- Menus: `NcmMenu`, `CidadeMenu`, `BairroMenu`, `MarcasMenu`, `MedidasMenu`, `GruposMenu`, `ClassesMenu`, `CfopMenu`, `TipoDocumentoMenu`, `PlanoContaMenu`, `AlmoxarifadoMenu`, `BuscaPadraoMenu`

### Transições
- `FormsExpandTransition`, `BotaoExpandTransition`

## Regras

1. **Composition API** com `<script setup>` — sem Options API
2. **Vuetify 3** + classes **Tailwind** — não HTML puro
3. **Ícones**: Material Design Icons (`mdi-`) ou `lucide-vue-next` no NavBar
4. **Tema**: usar classes `background-primary`, `background-secondary`, `text-primary`, `text-secondary`
5. **Responsividade**: usar grid Vuetify (`v-row`/`v-col`) + breakpoints Tailwind
6. **Modais**: sempre usar o componente modal existente, não criar `v-dialog` solto
7. **Slots nomeados**: seguir o padrão dos componentes base
8. **Eventos**: usar `@click`, `@update:model-value` — evitar emit manuais desnecessários
9. **Store**: componentes chamam stores — stores chamam API (componente nunca chama axios direto)

## Contexto

Leia `@projeto/PROJECT_OVERVIEW.md` e `@projeto/ARCHITECTURE.md` antes de criar ou modificar componentes para entender os módulos e padrões existentes.
