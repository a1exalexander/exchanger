import Foundation

// Unit 1 (Networking + cache) owns this folder.

/// Fetches bank (Monobank + NBU) and market rates.
nonisolated struct RatesAPI: Sendable {
    var session: URLSession = .shared

    /// `GET https://exchanger.in.ua/api/currencies`; falls back to Monobank + NBU directly.
    func fetchBankRates() async throws -> BankRates {
        throw URLError(.unsupportedURL)
    }

    /// fawazahmed0 exchange-api, two mirrors.
    func fetchMarketRates() async throws -> MarketRates {
        throw URLError(.unsupportedURL)
    }
}

/// Last good responses on disk, for offline start and instant first paint.
nonisolated enum RatesCache {
    static func loadBank() -> BankRates? { nil }
    static func saveBank(_ rates: BankRates) {}
    static func loadMarket() -> MarketRates? { nil }
    static func saveMarket(_ rates: MarketRates) {}
}
