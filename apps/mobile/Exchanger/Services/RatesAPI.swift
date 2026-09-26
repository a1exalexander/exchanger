import Foundation

// Unit 1 (Networking + cache) owns this folder.

/// Fetches bank (Monobank + NBU) and market rates.
nonisolated struct RatesAPI: Sendable {
    var session: URLSession = .shared
    var timeout: TimeInterval = 8

    static let ownAPI = URL(string: "https://exchanger.in.ua/api/currencies")!
    static let monobank = URL(string: "https://api.monobank.ua/bank/currency")!
    static let nbu = URL(string: "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")!
    static let marketMirrors = [
        URL(string: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1")!,
        URL(string: "https://latest.currency-api.pages.dev/v1")!,
    ]

    /// `GET https://exchanger.in.ua/api/currencies`; falls back to Monobank + NBU directly.
    func fetchBankRates() async throws -> BankRates {
        if let own = try? await get(Self.ownAPI, as: BankRates.self), !own.currencies.isEmpty {
            return own
        }
        return try await fetchBankRatesDirect()
    }

    /// Port of `../exchanger/api/currencies.ts`.
    func fetchBankRatesDirect() async throws -> BankRates {
        async let mono = get(Self.monobank, as: [MonobankRate].self)
        async let nb = try? get(Self.nbu, as: [NBRate].self)
        let monobank = try await mono
        guard !monobank.isEmpty else { throw URLError(.zeroByteResource) }
        let currencies = Self.syncCash(monobank.map(Self.mapCurrency).filter(Self.hasCodes), await nb ?? [])
        return BankRates(date: Date.now.ISO8601Format(), currencies: currencies)
    }

    /// fawazahmed0 exchange-api, two mirrors.
    func fetchMarketRates() async throws -> MarketRates {
        struct USD: Decodable { let date: String; let usd: [String: Decimal] }
        async let usd = fromMirrors("currencies/usd.min.json", as: USD.self)
        async let names = try? fromMirrors("currencies.min.json", as: [String: String].self)
        let rates = try await usd
        return MarketRates(date: rates.date, rates: Self.upperKeys(rates.usd),
                           names: Self.upperKeys(await names ?? [:]), fetchedAt: .now)
    }

    // MARK: - Networking

    private func get<T: Decodable>(_ url: URL, as: T.Type) async throws -> T {
        // ponytail: per-request idle timeout, not a hard 8s deadline like the web's AbortSignal.
        let (data, response) = try await session.data(for: URLRequest(url: url, timeoutInterval: timeout))
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
        return try JSONDecoder().decode(T.self, from: data)
    }

    private func fromMirrors<T: Decodable>(_ path: String, as type: T.Type) async throws -> T {
        var lastError: Error = URLError(.cannotFindHost)
        for root in Self.marketMirrors {
            do { return try await get(root.appending(path: path), as: type) } catch { lastError = error }
        }
        throw lastError
    }

    // MARK: - Port of `../exchanger/src/utils/formatCurrency.ts`

    struct MonobankRate: Decodable {
        var currencyCodeA: Int
        var currencyCodeB: Int
        var date: Int
        var rateBuy: Decimal?
        var rateSell: Decimal?
        var rateCross: Decimal?
    }

    static func formatDate(_ unix: Int) -> String {
        // "dd MMMM yyyy" like moment's 'DD MMMM YYYY' on the (UTC) server.
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = .gmt
        f.dateFormat = "dd MMMM yyyy"
        return f.string(from: Date(timeIntervalSince1970: TimeInterval(unix)))
    }

    /// `cc.number(code)` compares against zero-padded strings, so codes below 100 (ALL, AUD, ...) don't match
    /// and end up `{}` and are filtered out. Kept as is so the fallback returns the same pairs as the own API.
    static func currencyInfo(_ number: Int) -> CurrencyInfo {
        guard let iso = ISO4217.byNumber[String(number)] else { return CurrencyInfo(code: "") }
        return CurrencyInfo(code: iso.code, number: String(number), digits: iso.digits, currency: iso.name)
    }

    static func mapCurrency(_ item: MonobankRate) -> Exchange {
        Exchange(id: "\(item.currencyCodeA):\(item.currencyCodeB)",
                 currencyCodeA: item.currencyCodeA, currencyCodeB: item.currencyCodeB,
                 date: formatDate(item.date),
                 rateBuy: item.rateBuy, rateSell: item.rateSell, rateCross: item.rateCross,
                 precision: 4,
                 currencyA: currencyInfo(item.currencyCodeA), currencyB: currencyInfo(item.currencyCodeB))
    }

    static func hasCodes(_ item: Exchange) -> Bool {
        !item.currencyA.code.isEmpty && !item.currencyB.code.isEmpty
    }

    /// Attaches the NBU rate of `currencyA` (UAH per 1 unit) to every pair.
    static func syncCash(_ mono: [Exchange], _ nb: [NBRate]) -> [Exchange] {
        mono.map { item in
            var item = item
            if let extra = nb.first(where: { $0.cc == item.currencyA.code }) { item.nb = extra }
            return item
        }
    }

    static func upperKeys<V>(_ dict: [String: V]) -> [String: V] {
        Dictionary(dict.map { ($0.key.uppercased(), $0.value) }, uniquingKeysWith: { _, last in last })
    }
}

/// Last good responses on disk, for offline start and instant first paint.
nonisolated enum RatesCache {
    private static let directory = URL.cachesDirectory
    static let bankURL = directory.appending(path: "bank-rates.json")
    static let marketURL = directory.appending(path: "market-rates.json")

    static func loadBank() -> BankRates? { load(bankURL) }
    static func saveBank(_ rates: BankRates) { save(rates, to: bankURL) }
    static func loadMarket() -> MarketRates? { load(marketURL) }
    static func saveMarket(_ rates: MarketRates) { save(rates, to: marketURL) }

    private static func load<T: Decodable>(_ url: URL) -> T? {
        guard let data = try? Data(contentsOf: url) else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }

    private static func save<T: Encodable>(_ value: T, to url: URL) {
        guard let data = try? JSONEncoder().encode(value) else { return }
        try? data.write(to: url, options: .atomic)
    }
}
