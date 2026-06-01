# CLAUDE.md

## Project
SimplesFique — ERP de gestão empresarial brasileiro (Vue 3 + Vuetify + Pinia + Electron).
Full context in @projeto/PROJECT_OVERVIEW.md e @projeto/ARCHITECTURE.md.

## Agents
Agentes especializados em .agents/. Use o agente correto por tarefa:
- Review → .agents/code-reviewer.md
- UI work → .agents/ui-component.md
- Store/state → .agents/state-flow.md

## Skills
Padrões reutilizáveis em .skills/. Sempre verifique antes de implementar componentes, stores ou correções.
- Anatomy → .skills/component-anatomy.md
- Store → .skills/pinia-store.md
- Novo componente → .skills/novo-component.md
- Revisão → .skills/review.md
- Correção → .skills/corrigir.md

## Rules
- Never use Options API — Composition API only
- Pinia for all state (no Vuex)
- Components must follow anatomy in .skills/component-anatomy.md
- Tests required for all composables and stores
- No direct DOM manipulation outside composables
- Read @projeto/ context before structural changes