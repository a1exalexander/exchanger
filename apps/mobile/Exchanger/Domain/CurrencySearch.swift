import Foundation
import Synchronization

nonisolated enum CurrencySearch {
    /// Ranked: exact code, code prefix, name prefix, word prefix, then the rest. Matches code, uk/en names, countries.
    static func search(_ query: String, in options: [CurrencyOption]) -> [CurrencyOption] {
        let q = fold(query.trimmingCharacters(in: .whitespacesAndNewlines))
        guard !q.isEmpty else { return options }
        return options.enumerated()
            .filter { haystack(for: $0.element).contains(q) }
            .map { (rank: rank($0.element, q), index: $0.offset, option: $0.element) }
            .sorted { ($0.rank, $0.index) < ($1.rank, $1.index) }
            .map(\.option)
    }

    static func fold(_ text: String) -> String {
        text.folding(options: [.caseInsensitive, .diacriticInsensitive], locale: nil)
    }

    private static func rank(_ option: CurrencyOption, _ q: String) -> Int {
        let code = fold(option.code)
        let name = fold(option.name)
        if code == q { return 0 }
        if code.hasPrefix(q) { return 1 }
        if name.hasPrefix(q) { return 2 }
        if name.split(whereSeparator: \.isWhitespace).contains(where: { $0.hasPrefix(q) }) { return 3 }
        return 4
    }

    private static let metalKeywords: [String: String] = [
        "XAU": "gold золото метал",
        "XAG": "silver срібло метал",
        "XPT": "platinum платина метал",
        "XPD": "palladium паладій метал",
    ]

    /// Currency code -> ISO regions using it, derived from each region's default currency.
    private static let regionsByCurrency: [String: [String]] = {
        var map: [String: [String]] = [:]
        for region in Locale.Region.isoRegions where region.identifier.count == 2 {
            if let currency = Locale(identifier: "und_\(region.identifier)").currency?.identifier {
                map[currency, default: []].append(region.identifier)
            }
        }
        return map
    }()

    /// Search text per code + displayed name; built once, the picker searches on every keystroke.
    private static let cache = Mutex<[String: String]>([:])

    static func haystack(for option: CurrencyOption) -> String {
        let key = option.code + "|" + option.name
        if let hit = cache.withLock({ $0[key] }) { return hit }
        let value = buildHaystack(for: option)
        cache.withLock { $0[key] = value }
        return value
    }

    private static func buildHaystack(for option: CurrencyOption) -> String {
        let code = option.code
        var parts = [
            code,
            option.name,
            CurrencyCatalog.name(of: code, market: nil, lang: "uk"),
            CurrencyCatalog.name(of: code, market: nil, lang: "en"),
            CurrencyCatalog.englishName(of: code, market: nil),
            metalKeywords[code] ?? "",
        ]
        if CurrencyCatalog.kind(of: code) == .fiat {
            var regions = regionsByCurrency[code] ?? []
            if !code.hasPrefix("X") { regions.append(String(code.prefix(2))) }
            for locale in CurrencyCatalog.locales.values {
                for region in regions {
                    if let name = locale.localizedString(forRegionCode: region), name != region {
                        parts.append(name)
                    }
                }
            }
        }
        return fold(parts.joined(separator: " "))
    }
}
