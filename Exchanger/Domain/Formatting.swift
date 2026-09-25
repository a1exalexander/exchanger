import Foundation

// Unit 3 (Amount formatting/parsing) owns this file.

nonisolated enum AmountFormat {
    /// Normalizes user input ("1 000,5" → "1000.5", "." → "0."). `nil` when it is not a valid amount (max 16 chars).
    static func parse(_ input: String) -> String? {
        input
    }

    /// ≥ 1: 2 decimals without trailing ".00"; < 1: ~5 significant digits. Thousands grouped with a space.
    static func amount(_ value: Decimal) -> String {
        "\(value)"
    }

    /// ≥ 1000: 2 decimals grouped; ≥ 1: 4 decimals; < 1: ~4 significant digits.
    static func rate(_ value: Decimal) -> String {
        "\(value)"
    }

    /// Truncates (not rounds) to `places` decimals.
    static func truncate(_ value: Decimal, places: Int) -> String {
        "\(value)"
    }
}
