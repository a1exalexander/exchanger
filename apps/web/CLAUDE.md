# Web app — notes for Claude

- CRA (react-app-rewired) + Vercel Function in `api/`. Vercel project Root Directory is `apps/web`.
- Check changes with `yarn build` and `CI=true yarn test --watchAll=false` (run in this folder).
- The iOS app in `../mobile` mirrors `src/utils/{resolveExchange,currencyMeta,formatCurrency}.ts` — keep behaviour in sync.
