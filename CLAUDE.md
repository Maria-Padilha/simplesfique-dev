# CLAUDE.md

## Project
SimplesFique — ERP de gestão empresarial brasileiro (Vue 3 + Vuetify + Pinia + Electron).
Full context in @projeto/PROJECT_OVERVIEW.md e @projeto/ARCHITECTURE.md.

## Agents
Agentes especializados em `.opencode/agents/`. Use o agente correto por tarefa:
- Orchestrator → `.opencode/agents/orchestrator.md` (delega para os demais via `task`)
- UI work → `.opencode/agents/ui-component.md`
- Store/state → `.opencode/agents/state-flow.md`
- Review → `.opencode/agents/code-reviewer.md` (read-only: aponta problemas sem editar)
- Testing → `.opencode/agents/testing.md`
- API Migration → `.opencode/agents/api-migration.md` (migração THorse → PHP)

## Skills
Padrões reutilizáveis em .skills/. Sempre verifique antes de implementar componentes, stores ou correções.
- Rules → .skills/rules.md (regras obrigatórias do projeto — LEIA PRIMEIRO)
- Anatomy → .skills/component-anatomy.md
- Store → .skills/pinia-store.md
- Novo componente → .skills/novo-component.md
- Nova tela → .skills/nova-tela.md
- Revisão → .skills/review.md
- Test → .skills/test.md
- API Migration → .skills/api-migration.md (padrões de migração THorse → PHP)

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
- Follow .skills/rules.md for all new code and changes
- After completing any implementation, bug fix, refactor, or architectural decision, use the `store_memory` tool to register it in the RAG. Include: title, type, problem/context, solution, affected files, and relevant tags.