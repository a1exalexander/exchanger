import Foundation

// Unit 3 (Amount formatting/parsing) owns this file.
// Mirrors ../exchanger/src/utils/formatCurrency.ts (big.js, ROUND_HALF_UP).

nonisolated enum AmountFormat {
    /// Normalizes user input ("1 000,5" → "1000.5", "." → "0."). `nil` when it is not a valid amount (max 16 chars).
    static func parse(_ input: String) -> String? {
        let value = input.filter { !$0.isWhitespace }.replacingOccurrences(of: ",", with: ".")
        guard value.allSatisfy({ $0 == "." || ("0"..."9").contains($0) }),
              value.count(where: { $0 == "." }) <= 1,
              value.count <= 16 else { return nil }
        return value.hasPrefix(".") ? "0" + value : value
    }

    /// ≥ 1: 2 decimals without trailing ".00"; < 1: ~5 significant digits. Thousands grouped with a space.
    static func amount(_ value: Decimal) -> String {
        let decimals = significantDecimals(value, 5)
        let fixed = toFixed(value, decimals)
        if decimals > 2 { return groupThousands(stripZeros(fixed)) }
        return groupThousands(fixed.hasSuffix(".00") ? String(fixed.dropLast(3)) : fixed)
    }

    /// ≥ 1000: 2 decimals grouped; ≥ 1: 4 decimals; < 1: ~4 significant digits.
    static func rate(_ value: Decimal) -> String {
        let abs = value.magnitude
        if abs >= 1000 { return groupThousands(toFixed(value, 2)) }
        if abs >= 1 { return toFixed(value, 4) }
        return stripZeros(toFixed(value, significantDecimals(value, 4)))
    }

    /// Truncates (not rounds) to `places` decimals.
    static func truncate(_ value: Decimal, places: Int) -> String {
        let text = value.description
        guard let dot = text.firstIndex(of: ".") else { return text }
        if places <= 0 {
            // Web: Math.round, i.e. floor(x + 0.5).
            var shifted = value + Decimal(string: "0.5")!
            var result = Decimal()
            NSDecimalRound(&result, &shifted, 0, .down)
            return result.description
        }
        return String(text[...dot]) + String(text[text.index(after: dot)...].prefix(places))
    }

    // MARK: - Helpers

    private static func significantDecimals(_ value: Decimal, _ significant: Int) -> Int {
        let abs = value.magnitude
        if abs == 0 || abs >= 1 { return 2 }
        let exponent = Int(log10(Double(abs.description) ?? 0).rounded(.down))
        return min(12, -exponent + significant - 1)
    }

    /// big.js `toFixed`: half-up rounding, exactly `places` decimals, sign kept even when rounded to zero.
    private static func toFixed(_ value: Decimal, _ places: Int) -> String {
        var abs = value.magnitude
        var rounded = Decimal()
        NSDecimalRound(&rounded, &abs, places, .plain)
        let parts = rounded.description.split(separator: ".", omittingEmptySubsequences: false)
        let int = String(parts[0])
        let frac = parts.count > 1 ? String(parts[1]) : ""
        let body = places > 0 ? int + "." + frac.padding(toLength: places, withPad: "0", startingAt: 0) : int
        return (value < 0 ? "-" : "") + body
    }

    private static func stripZeros(_ value: String) -> String {
        guard value.contains(".") else { return value }
        var result = Substring(value)
        while result.hasSuffix("0") { result = result.dropLast() }
        if result.hasSuffix(".") { result = result.dropLast() }
        return String(result)
    }

    private static func groupThousands(_ value: String) -> String {
        let sign = value.hasPrefix("-") ? "-" : ""
        let unsigned = value.dropFirst(sign.count)
        let int = unsigned.prefix { $0 != "." }
        let rest = unsigned.dropFirst(int.count)
        var grouped = ""
        for (i, ch) in int.enumerated() {
            if i > 0 && (int.count - i) % 3 == 0 { grouped.append(" ") }
            grouped.append(ch)
        }
        return sign + grouped + rest
    }
}
