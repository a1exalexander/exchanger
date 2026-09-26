import SwiftUI
import UIKit

// Unit 10 (Settings / About) owns this folder.

/// Presented by RootView when `model.showSettings` is true.
struct SettingsView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL

    var body: some View {
        NavigationStack {
            Form {
                appearance
                language
                sources
                about
            }
            .scrollContentBackground(.hidden)
            .background(Color.pageBackground)
            .navigationTitle("settings.title")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button { dismiss() } label: { Text("settings.done", tableName: "Settings") }
                }
            }
        }
    }

    // MARK: Sections

    private var appearance: some View {
        Section {
            Picker("theme.label", selection: Binding(get: { model.theme }, set: { model.setTheme($0) })) {
                ForEach(ThemePreference.allCases, id: \.self) { theme in
                    Label(theme.title, systemImage: theme.icon).tag(theme)
                }
            }
            .pickerStyle(.inline)
            .labelsHidden()
            .sensoryFeedback(.selection, trigger: model.theme)
        } header: {
            Text("settings.appearance", tableName: "Settings")
        }
    }

    private var language: some View {
        Section {
            Button {
                if let url = URL(string: UIApplication.openSettingsURLString) { openURL(url) }
            } label: {
                LabeledContent {
                    HStack(spacing: 6) {
                        Text(currentLanguage)
                        Image(systemName: "arrow.up.right").font(.caption.weight(.semibold))
                    }
                    .foregroundStyle(Color.textSecondary)
                } label: {
                    Label("settings.language", systemImage: "globe").foregroundStyle(Color.textPrimary)
                }
            }
        } footer: {
            Text("settings.languageHint", tableName: "Settings")
        }
    }

    private var sources: some View {
        Section("footer.sources") {
            SourceLink(source: .bank, name: Text(verbatim: "Monobank"), note: "footer.monoNote",
                       url: "https://www.monobank.ua/rates")
            SourceLink(source: .nbu, name: Text("providers.nbuName"), note: "footer.nbuNote",
                       url: "https://bank.gov.ua/ua/markets/exchangerates")
            SourceLink(source: .market, name: Text(verbatim: "exchange-api"), note: "footer.marketNote",
                       url: "https://github.com/fawazahmed0/exchange-api")
        }
    }

    private var about: some View {
        Section {
            if let date = model.lastUpdate {
                LabeledContent {
                    Text(date.formatted(date: .long, time: .shortened))
                } label: {
                    Text("footer.updated")
                }
            }
            LabeledContent {
                Text(verbatim: appVersion)
            } label: {
                Text("settings.version", tableName: "Settings")
            }
            AboutLink(title: Text("settings.website", tableName: "Settings"), value: "exchanger.in.ua",
                      url: "https://exchanger.in.ua")
            AboutLink(title: Text("settings.author", tableName: "Settings"), value: "Oleksandr Ratushnyi",
                      url: "https://sashkoratushnyi.com")
        } header: {
            Text("settings.about", tableName: "Settings")
        } footer: {
            Text("footer.disclaimer")
        }
    }

    // MARK: Helpers

    private var currentLanguage: String {
        let code = Bundle.main.preferredLocalizations.first ?? "en"
        return Locale.current.localizedString(forLanguageCode: code)?.localizedCapitalized ?? code
    }

    private var appVersion: String {
        let info = Bundle.main.infoDictionary
        let version = info?["CFBundleShortVersionString"] as? String ?? "–"
        let build = info?["CFBundleVersion"] as? String ?? "–"
        return "\(version) (\(build))"
    }
}

private struct SourceLink: View {
    let source: ExchangeSource
    let name: Text
    let note: LocalizedStringKey
    let url: String

    var body: some View {
        Link(destination: URL(string: url)!) {
            HStack(spacing: 12) {
                SourceMark(source: source)
                    .frame(width: 28)
                VStack(alignment: .leading, spacing: 2) {
                    name.foregroundStyle(Color.textPrimary)
                    Text(note).font(.footnote).foregroundStyle(Color.textSecondary)
                }
                Spacer()
                Image(systemName: "arrow.up.right")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(Color.textSecondary)
            }
        }
    }
}

private struct AboutLink: View {
    let title: Text
    let value: String
    let url: String

    var body: some View {
        Link(destination: URL(string: url)!) {
            LabeledContent {
                HStack(spacing: 6) {
                    Text(verbatim: value)
                    Image(systemName: "arrow.up.right").font(.caption.weight(.semibold))
                }
                .foregroundStyle(Color.textSecondary)
            } label: {
                title.foregroundStyle(Color.textPrimary)
            }
        }
    }
}

private extension ThemePreference {
    var title: LocalizedStringKey {
        switch self {
        case .system: "theme.system"
        case .light: "theme.light"
        case .dark: "theme.dark"
        }
    }

    var icon: String {
        switch self {
        case .system: "circle.lefthalf.filled"
        case .light: "sun.max"
        case .dark: "moon"
        }
    }
}

#Preview {
    SettingsView().environment(AppModel(useFixtures: true))
}
