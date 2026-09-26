import Foundation

// Port of ../exchanger/src/utils/currencyMeta.ts (lists, kinds, names, options, quick pick).

nonisolated enum CurrencyCatalog {
    static let popular: [String] = ["UAH", "USD", "EUR", "PLN", "GBP", "CHF", "CZK", "CAD", "JPY", "CNY", "TRY", "BTC"]
    static let quickPickDefaults: [String] = ["UAH", "USD", "EUR", "PLN", "GBP", "CHF", "CZK", "BTC"]
    static let quickPickSize = 8

    static let crypto: [String] = [
        "BTC", "ETH", "USDT", "USDC", "BNB", "SOL", "XRP", "TON", "ADA", "DOGE",
        "TRX", "DOT", "LTC", "LINK", "AVAX", "XLM", "XMR", "BCH", "ETC", "ATOM",
        "NEAR", "UNI", "SHIB", "PEPE", "SUI", "APT", "ARB", "OP", "DAI", "FIL",
        "ICP", "HBAR", "ALGO", "XTZ", "EOS", "ZEC", "DASH", "PAXG", "XAUT", "POL",
    ]
    static let metals: [String] = ["XAU", "XAG", "XPT", "XPD"]
    /// Unofficial codes with real use that are missing in ISO 4217
    static let extraFiat: Set<String> = ["CNH", "GGP", "IMP", "JEP"]
    /// ISO technical / fund codes nobody converts
    static let skip: Set<String> = [
        "XXX", "XTS", "XSU", "XUA", "XBA", "XBB", "XBC", "XBD", "BOV", "CHE",
        "CHW", "CLF", "COU", "MXV", "USN", "UYI", "UYW",
    ]

    private static let cryptoSet = Set(crypto)
    private static let metalSet = Set(metals)
    /// Apple's common list lacks the non-currency ISO codes the web's `currency-codes` has.
    private static let isoCodes = Set(Locale.commonISOCurrencyCodes)
        .union(metalSet).union(skip).union(["XDR", "SVC", "ZWL"])

    /// Names that `Locale` doesn't translate (or translates inconsistently)
    static let customNames: [String: [String: String]] = [
        "uk": [
            "UAH": "Українська гривня",
            "XAU": "Золото (тройська унція)",
            "XAG": "Срібло (тройська унція)",
            "XPT": "Платина (тройська унція)",
            "XPD": "Паладій (тройська унція)",
            "XDR": "Спеціальні права запозичення",
            "BTC": "Біткоїн",
            "ETH": "Ефіріум",
            "USDT": "Tether",
            "USDC": "USD Coin",
            "TON": "Toncoin",
        ],
        "en": [
            "UAH": "Ukrainian Hryvnia",
            "XAU": "Gold (troy ounce)",
            "XAG": "Silver (troy ounce)",
            "XPT": "Platinum (troy ounce)",
            "XPD": "Palladium (troy ounce)",
            "XDR": "Special Drawing Rights",
            "BTC": "Bitcoin",
            "ETH": "Ethereum",
            "USDT": "Tether",
            "USDC": "USD Coin",
            "TON": "Toncoin",
        ],
    ]

    static let locales: [String: Locale] = ["uk": Locale(identifier: "uk"), "en": Locale(identifier: "en")]

    /// "uk" or "en": the language iOS picked for the app.
    static var appLanguage: String {
        Bundle.main.preferredLocalizations.first?.hasPrefix("uk") == true ? "uk" : "en"
    }

    static func kind(of code: String) -> CurrencyKind {
        if metalSet.contains(code) { return .metal }
        if cryptoSet.contains(code) || !isoCodes.contains(code) {
            return extraFiat.contains(code) ? .fiat : .crypto
        }
        return .fiat
    }

    /// Localized name for the current app language.
    static func name(of code: String, market: MarketRates?) -> String {
        name(of: code, market: market, lang: appLanguage)
    }

    static func name(of code: String, market: MarketRates?, lang: String) -> String {
        if code.isEmpty { return "" }
        if let custom = customNames[lang]?[code] { return custom }
        if kind(of: code) != .crypto,
           let name = locales[lang]?.localizedString(forCurrencyCode: code), name != code {
            return name.prefix(1).uppercased() + name.dropFirst()
        }
        let english = englishName(of: code, market: market)
        return english.isEmpty ? code : english
    }

    static func englishName(of code: String, market: MarketRates?) -> String {
        if let name = market?.names[code], !name.isEmpty { return name }
        guard kind(of: code) != .crypto else { return "" }
        return locales["en"]?.localizedString(forCurrencyCode: code) ?? ""
    }

    /// UAH + bank codes + market codes, filtered and sorted by localized name.
    static func options(bank: [Exchange], market: MarketRates?) -> [CurrencyOption] {
        options(bank: bank, market: market, lang: appLanguage)
    }

    static func options(bank: [Exchange], market: MarketRates?, lang: String) -> [CurrencyOption] {
        var codes: Set<String> = ["UAH"]
        for pair in bank {
            codes.insert(pair.currencyA.code)
            codes.insert(pair.currencyB.code)
        }
        codes.remove("")
        for code in market?.rates.keys.map(\.self) ?? [] {
            if skip.contains(code) { continue }
            if kind(of: code) == .crypto && !cryptoSet.contains(code) { continue }
            codes.insert(code)
        }
        let locale = locales[lang]
        return codes
            .map { CurrencyOption(code: $0, name: name(of: $0, market: market, lang: lang), kind: kind(of: $0)) }
            .sorted {
                switch $0.name.compare($1.name, locale: locale) {
                case .orderedAscending: true
                case .orderedDescending: false
                case .orderedSame: $0.code < $1.code
                }
            }
    }

    /// Monobank has buy/sell for `code` against `other` (either direction).
    static func hasBankRates(_ code: String, against other: String, bank: [Exchange]) -> Bool {
        bank.contains {
            let pair = ($0.currencyA.code == code && $0.currencyB.code == other)
                || ($0.currencyA.code == other && $0.currencyB.code == code)
            return pair && $0.rateBuy != nil && $0.rateSell != nil
        }
    }

    /// Top 8 by usage count, ties by default order.
    static func rankQuickPick(usage: [String: Int]) -> [String] {
        let defaultIndex = { (code: String) in quickPickDefaults.firstIndex(of: code) ?? quickPickDefaults.count }
        let used = usage.keys.filter { !quickPickDefaults.contains($0) }.sorted()
        let ranked = (quickPickDefaults + used).sorted { a, b in
            let (ua, ub) = (usage[a] ?? 0, usage[b] ?? 0)
            if ua != ub { return ua > ub }
            let (ia, ib) = (defaultIndex(a), defaultIndex(b))
            return ia != ib ? ia < ib : a < b
        }
        return Array(ranked.prefix(quickPickSize))
    }
}
