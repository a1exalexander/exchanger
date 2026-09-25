import SwiftUI

// Unit 10 (Settings / About) owns this folder.

/// Presented by RootView when `model.showSettings` is true.
struct SettingsView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        NavigationStack {
            Form {
                Text("footer.sources")
            }
        }
    }
}
