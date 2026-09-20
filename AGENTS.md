# AGENTS.md

Conventions for anyone (human or AI) working in this repository.

- Work on the branch you were given. Commit in small steps with clear messages; stage explicit paths
  (never `git add -A` or `git add .`).
- Never push. When the task is done and committed, hand it back with `submit_work`
  (include the test output). If you cannot finish, use `task_blocked` and say exactly what you need.
- Keep `npm test`, `npm run build` and `npm run lint` passing. Add tests for new behaviour and for every bug fix.
- Do not weaken or delete existing tests to make them pass.
- Do not add runtime dependencies unless the task asks for them.
