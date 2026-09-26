import Foundation
import PostHog

// Unit 6 owns this folder.

/// PostHog, mirroring the web app's events. Off in DEBUG builds and fixtures mode.
enum Analytics {
    private static var enabled = false

    static func setup() {
        #if !DEBUG
        guard !UserDefaults.standard.bool(forKey: "debugFixtures") else { return }
        let config = PostHogConfig(apiKey: "phc_CeBzgWAv4REctcDyf9tlqaS6uUbY1tgzywGxw4YNeHF", host: "https://eu.posthog.com")
        PostHogSDK.shared.setup(config)
        enabled = true
        #endif
    }

    static func track(_ event: String, _ properties: [String: Any] = [:]) {
        guard enabled else { return }
        PostHogSDK.shared.capture(event, properties: properties)
    }
}
