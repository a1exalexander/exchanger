import Foundation

// Unit 6 owns this folder. PostHog key phc_CeBzgWAv4REctcDyf9tlqaS6uUbY1tgzywGxw4YNeHF, host https://eu.posthog.com

enum Analytics {
    static func setup() {}
    static func track(_ event: String, _ properties: [String: Any] = [:]) {}
}
