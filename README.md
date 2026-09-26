# Exchanger

Currency converter — [exchanger.in.ua](https://exchanger.in.ua) and its iOS app, in one Turborepo.

| App | Path | Stack |
| --- | --- | --- |
| Web | [`apps/web`](apps/web) | React (CRA) + Vercel Function `api/currencies.ts` |
| iOS | [`apps/mobile`](apps/mobile) | SwiftUI, XcodeGen |

```sh
nvm use && corepack enable
yarn            # install
yarn dev        # web dev server
yarn build      # turbo run build
yarn test       # web + iOS tests (iOS needs Xcode + xcodegen)
yarn turbo run test --filter=web
```
