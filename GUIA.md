# 🧠 GUIA PARA OS PROGRAMADORES


## 🛠️ Configuração do Projeto
### Projeto feito com **Vue 3**, **Vite**, **Vuetify 3**, **Tailwind** e **Pinia**.

#### Comando para rodar o projeto:
```bash
npm run serve
```

#### Comando para instalar as dependências:
```bash
npm install
```

#### Comando para buildar o projeto:
```bash
npm run build
```

#### Comando para instalar o **Tailwind**:
```bash
npm install tailwindcss @tailwindcss/postcss postcss
npx tailwindcss init -p
```

#### Comando para instalar o **Vuetify**:
Escolher o Vuetify 3 (Preview)
```bash
vue add vuetify
```

#### Comando para instalar o **Pinia**:
```bash
npm install pinia
```


## 📁 Diretórios

### `ASSETS`

Espaço para colocar arquivos estáticos, como imagens, fontes e arquivos SCSS.

#### `assets/scss`
- `index.scss` → Importa todos os arquivos SCSS.
- `tailwind.css` → Importa o tailwind.
- `theme.css` → Contém a paleta de cores para **modo claro** e **modo escuro**.
- `1-components/auth.scss` → Css da página de login.
- `1-components/components` → Css dos componentes que irão se repetir (backgrounds, textos, botões, etc).
- `2-utilities/media_screen.scss` → Media screen para alguns componentes.
- `2-utilities/mixins.scss` → Mixins padrão usado em diferentes lugares.

#### `assets/img`
- `assets/img/logo` → Logos usadas no sistema.
- `assets/img/site` → Imagens usadas no site/landing page.


### `COMPONENTS`

Componentes reutilizáveis que poderão ser usados em mais de uma página

#### `components/base` → Componentes base, que serão reutilizados em diversas páginas.
- `base/alerts` → Componente padrão de alertas.
- `base/image` → Componente padrão de upload de imagem.
- `base/modais` → Componente padrão de modais.
- `base/sidebar` → Componente padrão do sidebar do sistema.
- `base/TopAllPages.vue` → Componente padrão do topo de todas as páginas.

#### `components/particle` → Toda a funcionalidade do particle.js.

#### `components/site` → Componentes que são usados no site/landing page.
- `site/FooterBar.vue` → Componente padrão do footer do site.
- `site/NavBar.vue` → Componente padrão do navbar do site.
- `site/TitleSections.vue` → Componente padrão dos títulos do site.

### `PLUGINS`

Plugins padrão da instalação do vuetify e plugin do particle.js.


### `ROUTER`

Contém todas as rotas do sistema

- `index.js` → Configuração das rotas do sistema.

### `STORES`

Todas as aplicações **pinia** do sistema <br>
Pinia é uma biblioteca de armazenamento para Vue que permite compartilhar um estado entre componentes/páginas.

- `site.js` → Verifica se o site está em manutenção ou rodando.
- `config-temas/theme.js` → Configuração do tema do site: modo escuro/modo claro, brilho, etc.


### `VIEWS`

Todas as páginas do sistema

#### `auth` → páginas de autenticação: login, criar conta, etc.
#### `pages` → páginas individuais que compoem o sistema.
#### `site` → páginas do site/landing page.
#### `NotFound.vue` → Página 404.
#### `ManutencaoView.vue` → Página de manutenção.