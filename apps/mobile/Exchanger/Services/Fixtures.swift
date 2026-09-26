import Foundation

/// Snapshots of real API responses bundled with the app (Resources/Fixtures).
/// Used by tests and by the `-debugFixtures YES` launch argument.
nonisolated enum Fixtures {
    /// `name` without extension: currencies, monobank, nbu, market, names
    static func data(_ name: String) -> Data {
        guard let url = Bundle.main.url(forResource: name, withExtension: "json"),
              let data = try? Data(contentsOf: url) else {
            fatalError("Missing fixture \(name).json")
        }
        return data
    }

    static var bankRates: BankRates {
        try! JSONDecoder().decode(BankRates.self, from: data("currencies"))
    }

    static var marketRates: MarketRates {
        struct USD: Decodable { let date: String; let usd: [String: Decimal] }
        let usd = try! JSONDecoder().decode(USD.self, from: data("market"))
        let names = (try? JSONDecoder().decode([String: String].self, from: data("names"))) ?? [:]
        return MarketRates(
            date: usd.date,
            rates: Dictionary(uniqueKeysWithValues: usd.usd.map { ($0.key.uppercased(), $0.value) }),
            names: Dictionary(uniqueKeysWithValues: names.map { ($0.key.uppercased(), $0.value) }),
            fetchedAt: .now
        )
    }
}
