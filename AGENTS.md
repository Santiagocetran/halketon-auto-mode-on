# AGENTS.md — working agreement for AI agents & contributors

This repo is built by a 4-person team (plus AI agents) during a ~10-hour hackathon.
The canonical playbook lives in [`docs/team/`](docs/team/README.md). **This file is the
short version agents must follow before committing or pushing** — it points to the full
docs rather than duplicating them, so the source of truth stays in one place.

> Trunk is **`main`**. It must always be demoable. Never push directly to `main` — every
> change lands via a small PR.

## Before you commit
1. **Stay in your lane.** Edit only files your role owns — see the file-ownership map in
   [`docs/team/roles-and-ownership.md`](docs/team/roles-and-ownership.md).
   `packages/core/**` is **shared**: coordinate before editing it.
2. **Conventional commit message:** `type: summary` where type ∈
   `feat | fix | docs | chore | refactor`. E.g. `feat: wire LLM extraction in task-capture`.
3. **Never commit secrets** (Supabase/Twilio/LLM keys). They live in n8n env vars and
   `.env.local` (git-ignored). See [`docs/team/git-workflow.md`](docs/team/git-workflow.md).

## Before you open a PR / push
1. **Run the unit tests** for the package you touched and make sure they're green —
   `packages/core` (pure logic) and/or `apps/dashboard-web` (components). See the testing
   guide: [`docs/team/testing.md`](docs/team/testing.md).
2. **Rebase onto the latest `main`**, resolving conflicts on your branch (never on `main`):
   ```bash
   git fetch origin
   git rebase origin/main
   git push --force-with-lease
   ```
3. **Branch naming:** `feat/<slice>`, `fix/<thing>`, `chore/<thing>`, `docs/<thing>`.
4. **PR description = one line:** what it does + how you tested it (unit + smoke).
5. **Keep PRs small and frequent** (merge ~every 2h). After a quick peer glance, the author
   merges their own PR — there is no gatekeeper.

## Definition of Done & the freeze
A slice is done only when its pure logic has passing unit tests, it's merged to `main`, and
it smoke-passes. Two hours before demo, `main` enters **freeze** (bugfix-only). Full detail,
the smoke checklist, and the cut list are in
[`docs/team/timeline-and-checkpoints.md`](docs/team/timeline-and-checkpoints.md).

---
*Humans: see [`docs/team/README.md`](docs/team/README.md) first. Agents: read the four
linked docs above before acting on this repo.*
