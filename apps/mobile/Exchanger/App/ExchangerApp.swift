import SwiftUI

@main
struct ExchangerApp: App {
    /// `-debugFixtures YES` loads bundled snapshots instead of the network.
    @State private var model = AppModel(useFixtures: UserDefaults.standard.bool(forKey: "debugFixtures"))

    init() {
        Analytics.setup()
    }

    var body: some Scene {
        WindowGroup {
            RootView().environment(model)
        }
    }
}
