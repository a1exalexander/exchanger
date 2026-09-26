# Project notes for Claude

- Commits and pull requests are authored by Oleksandr Ratushnyi. Do not add
  `Co-Authored-By`, `Claude-Session`, "Generated with Claude Code" or any other
  mention of AI to commit messages, PR titles or PR descriptions.
- Turborepo + yarn 1 workspaces. Node.js 24 (`.nvmrc`).
- `apps/web` — React web app (see `apps/web/CLAUDE.md`). `apps/mobile` — native iOS app (see `apps/mobile/CLAUDE.md`).
- Check web changes with `yarn turbo run build --filter=web` and `CI=true yarn workspace web test --watchAll=false`.
