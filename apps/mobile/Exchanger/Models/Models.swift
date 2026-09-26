import Foundation

/// ISO 4217 currency as returned by `/api/currencies` (from the `currency-codes` package).
/// Monobank sometimes reports codes that package does not know, which come back as `{}`.
nonisolated struct CurrencyInfo: Codable, Hashable, Sendable {
    var code: String
    var number: String?
    var digits: Int?
    var currency: String?
    var countries: [String]?
    var country: String?

    init(code: String, number: String? = nil, digits: Int? = nil, currency: String? = nil,
         countries: [String]? = nil, country: String? = nil) {
        self.code = code
        self.number = number
        self.digits = digits
        self.currency = currency
        self.countries = countries
        self.country = country
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        code = try c.decodeIfPresent(String.self, forKey: .code) ?? ""
        number = try c.decodeIfPresent(String.self, forKey: .number)
        digits = try c.decodeIfPresent(Int.self, forKey: .digits)
        currency = try c.decodeIfPresent(String.self, forKey: .currency)
        countries = try c.decodeIfPresent([String].self, forKey: .countries)
        country = try c.decodeIfPresent(String.self, forKey: .country)
    }
}

/// Official National Bank of Ukraine rate: `rate` UAH for 1 unit of `cc`.
nonisolated struct NBRate: Codable, Hashable, Sendable {
    var r030: Int
    var txt: String
    var rate: Decimal
    var cc: String
    var exchangedate: String
}

/// One Monobank pair: `rateBuy`/`rateSell`/`rateCross` are units of B for 1 unit of A.
nonisolated struct Exchange: Codable, Hashable, Sendable, Identifiable {
    /// "840:980"
    var id: String
    var currencyCodeA: Int
    var currencyCodeB: Int
    /// "26 September 2026"
    var date: String?
    var rateBuy: Decimal?
    var rateSell: Decimal?
    var rateCross: Decimal?
    var precision: Int?
    var currencyA: CurrencyInfo
    var currencyB: CurrencyInfo
    var nb: NBRate?

    enum CodingKeys: String, CodingKey {
        case id, currencyCodeA, currencyCodeB, date, rateBuy, rateSell, rateCross, precision, currencyA, currencyB
        case nb = "NB"
    }
}

/// Response of `GET https://exchanger.in.ua/api/currencies`.
nonisolated struct BankRates: Codable, Hashable, Sendable {
    /// ISO 8601 time the server built the response
    var date: String
    var currencies: [Exchange]
}

/// fawazahmed0/exchange-api snapshot.
nonisolated struct MarketRates: Codable, Hashable, Sendable {
    /// "YYYY-MM-DD"
    var date: String
    /// Units of currency per 1 USD, upper-case codes
    var rates: [String: Decimal]
    /// English names, upper-case codes
    var names: [String: String]
    var fetchedAt: Date
}

nonisolated enum Side: String, Codable, Hashable, Sendable, Identifiable {
    case from, to
    var id: String { rawValue }
    var other: Side { self == .from ? .to : .from }
}

/// The user's operation. Note: `buy` uses Monobank `rateSell`, `sell` uses `rateBuy`.
nonisolated enum Method: String, Codable, Hashable, Sendable {
    case buy, sell, cross
}

nonisolated enum ExchangeSource: String, Codable, Hashable, Sendable {
    case bank, nbu
    case bankCross = "bank-cross"
    case market
}

nonisolated struct Pair: Codable, Hashable, Sendable {
    var from: String
    var to: String
    var swapped: Pair { Pair(from: to, to: from) }
}

/// Rate for the current pair after resolution (direct, reversed or market). Units of `to` per 1 `from`.
nonisolated struct ResolvedExchange: Hashable, Sendable {
    var from: String
    var to: String
    var rateBuy: Decimal?
    var rateSell: Decimal?
    var rateCross: Decimal?
    /// NBU official rate converted to this pair's direction
    var nbRate: Decimal?
    var nbDate: String?
    /// Date of the rate as shown to the user
    var date: String?
    var source: ExchangeSource
    var reversed: Bool
    var precision: Int

    var hasBankRates: Bool { rateBuy != nil && rateSell != nil }
}

nonisolated enum CurrencyKind: String, Codable, Hashable, Sendable {
    case fiat, crypto, metal
}

/// A currency the user can pick, with its name localized for the current app language.
nonisolated struct CurrencyOption: Hashable, Sendable, Identifiable {
    var code: String
    var name: String
    var kind: CurrencyKind
    var id: String { code }
}

nonisolated enum ThemePreference: String, Codable, CaseIterable, Sendable {
    case system, light, dark
}
