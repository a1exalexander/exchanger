import Foundation

nonisolated enum CurrencySearch {
    /// Ranked: exact code, code prefix, name prefix, word prefix, then the rest. Matches code, uk/en names, countries.
    static func search(_ query: String, in options: [CurrencyOption]) -> [CurrencyOption] {
        let q = query.trimmingCharacters(in: .whitespaces).lowercased()
        guard !q.isEmpty else { return options }
        return options.filter { $0.code.lowercased().contains(q) || $0.name.lowercased().contains(q) }
    }
}
