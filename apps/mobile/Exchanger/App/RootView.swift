import SwiftUI
import UIKit

// Owned by the scaffold. Composes the feature views; units should not need to edit it.

struct RootView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        @Bindable var model = model
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    ConverterView()
                    QuickPickView()
                    RatesCarousel()
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
            }
            .scrollDismissesKeyboard(.immediately)
            .background(Color.pageBackground)
            .refreshable { await model.refresh() }
            .safeAreaInset(edge: .bottom, spacing: 0) { KeypadView() }
            .toolbar {
                ToolbarItem(placement: .principal) { HeaderView() }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("settings.title", systemImage: "gearshape") { model.showSettings = true }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
        .sheet(item: $model.pickerSide) { side in CurrencyPickerSheet(side: side) }
        .sheet(isPresented: $model.showSettings) { SettingsView() }
        .onChange(of: model.theme, initial: true) { _, theme in applyTheme(theme) }
        .task {
            await model.load()
            openDebugSheet()
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { Task { await model.refresh() } }
        }
    }

    /// Set on the window rather than via `preferredColorScheme`, so an open sheet follows every change.
    private func applyTheme(_ theme: ThemePreference) {
        for case let scene as UIWindowScene in UIApplication.shared.connectedScenes {
            for window in scene.windows {
                UIView.transition(with: window, duration: 0.3, options: .transitionCrossDissolve) {
                    window.overrideUserInterfaceStyle = theme.interfaceStyle
                }
            }
        }
    }

    /// `-debugSheet picker|picker-to|settings` launch argument, for screenshots.
    private func openDebugSheet() {
        switch UserDefaults.standard.string(forKey: "debugSheet") {
        case "picker": model.pickerSide = .from
        case "picker-to": model.pickerSide = .to
        case "settings": model.showSettings = true
        default: break
        }
    }
}

extension ThemePreference {
    var interfaceStyle: UIUserInterfaceStyle {
        switch self {
        case .system: .unspecified
        case .light: .light
        case .dark: .dark
        }
    }
}
