# CLAUDE.md

## Project
SimplesFique — ERP de gestão empresarial brasileiro (Vue 3 + Vuetify + Pinia + Electron).
Full context in @projeto/PROJECT_OVERVIEW.md e @projeto/ARCHITECTURE.md.

## Agents
Agentes especializados em .agents/. Use o agente correto por tarefa:
- Orchestrator → .agents/orchestrator.md (delega para os demais)
- Review → .agents/code-reviewer.md
- UI work → .agents/ui-component.md
- Store/state → .agents/state-flow.md
- Testing → .agents/testing.md

## Skills
Padrões reutilizáveis em .skills/. Sempre verifique antes de implementar componentes, stores ou correções.
- Anatomy → .skills/component-anatomy.md
- Store → .skills/pinia-store.md
- Novo componente → .skills/novo-component.md
- Revisão → .skills/review.md
- Test → .skills/test.md

## Project Docs
- @projeto/PROJECT_OVERVIEW.md — visão geral do produto
- @projeto/ARCHITECTURE.md — guia de arquitetura
- @projeto/SPEC.md — especificação de requisitos
- @projeto/ADR.md — decisões arquiteturais (leia ao criar nova funcionalidade)

## Rules
- Never use Options API — Composition API only
- Pinia for all state (no Vuex)
- Components must follow anatomy in .skills/component-anatomy.md
- Tests required for all composables and stores
- No direct DOM manipulation outside composables
- Read @projeto/ context before structural changes