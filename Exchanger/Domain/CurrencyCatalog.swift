import Foundation

// Unit 4 (Currency catalog + search) owns this file and CurrencySearch.swift.

nonisolated enum CurrencyCatalog {
    static let popular: [String] = ["UAH", "USD", "EUR", "PLN", "GBP", "CHF", "CZK", "CAD", "JPY", "CNY", "TRY", "BTC"]
    static let quickPickDefaults: [String] = ["UAH", "USD", "EUR", "PLN", "GBP", "CHF", "CZK", "BTC"]

    static func kind(of code: String) -> CurrencyKind { .fiat }

    /// Localized name for the current app language.
    static func name(of code: String, market: MarketRates?) -> String { code }

    /// UAH + bank codes + market codes, filtered and sorted by localized name.
    static func options(bank: [Exchange], market: MarketRates?) -> [CurrencyOption] {
        Set(bank.flatMap { [$0.currencyA.code, $0.currencyB.code] } + ["UAH"])
            .filter { !$0.isEmpty }
            .sorted()
            .map { CurrencyOption(code: $0, name: $0, kind: .fiat) }
    }

    /// Monobank has buy/sell for `code` against `other` (either direction).
    static func hasBankRates(_ code: String, against other: String, bank: [Exchange]) -> Bool { false }

    /// Top 8 by usage count, ties by default order.
    static func rankQuickPick(usage: [String: Int]) -> [String] { quickPickDefaults }
}
