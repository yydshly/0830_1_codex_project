# Repository guidance for coding agents

## Scope

These instructions apply to the entire repository. A project may add a more specific AGENTS.md inside its own directory.

## Before changing a study

Read the root README, the target project's README and research-log, and docs/research-guide. Preserve unrelated studies and their toolchains.

## Working rules

- Keep each study inside projects/<project-name> unless a change is genuinely repository-wide.
- Do not introduce a root-level runtime or package manager solely for one study.
- Record exact upstream versions and license information for external code, models, and datasets.
- Turn functional conclusions into tests when possible; link other conclusions to evidence.
- Record meaningful failed experiments in the project's research-log.
- Update the root research index when a project's status, conclusion, or update date changes materially.
- Never commit secrets, personal data, dependency caches, or unexplained large binaries.

## Verification

Run node scripts/validate-repository.mjs for repository-wide changes, plus the target project's own tests and build commands.
