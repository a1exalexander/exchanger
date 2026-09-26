# Exchanger iOS — notes for Claude

Native SwiftUI port of the web app in `../web` (exchanger.in.ua). iOS 18+, Swift 6, default MainActor isolation.

- Commits and pull requests are authored by Oleksandr Ratushnyi. Do not add
  `Co-Authored-By`, `Claude-Session`, "Generated with Claude Code" or any other
  mention of AI to commit messages, PR titles or PR descriptions.
- The Xcode project is generated: `xcodegen generate` (never commit `Exchanger.xcodeproj`, never edit project.yml unless the task is about it).
- Test: `xcodebuild -project Exchanger.xcodeproj -scheme Exchanger -destination "id=<simulator udid>" -derivedDataPath .dd test` (Swift Testing, `import Testing`).
- Launch arguments for screenshots: `-debugFixtures YES` (bundled API snapshots, no network), `-debugSheet picker|picker-to|settings`.
- Layout: `Models/` shared types, `Services/` network + cache, `Domain/` pure logic, `State/AppModel.swift` app state, `DesignSystem/`, `Features/<Feature>/` views, `App/RootView.swift` composition.
- Colors only via asset catalog symbols (`Color.surface`, `.textSecondary`, `.buy`, …). Strings only via String Catalogs (en + uk); `Localizable.xcstrings` holds the strings ported from the web; feature-specific new strings go in a table next to the feature (`Text("key", tableName: "Converter")`).
- No third-party dependencies besides PostHog.
- Web logic to mirror: `../web/src/utils/{resolveExchange,currencyMeta,formatCurrency}.ts`, reducer `../web/src/store/reducers/index.ts`.
