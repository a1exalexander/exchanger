import Foundation
import Observation

// Unit 6 (App state + persistence + analytics) owns this folder.
// Other units may read any property and call any method below; keep these names.

@Observable
final class AppModel {
    // MARK: Data
    var bank: BankRates?
    var market: MarketRates?
    var isLoading = false
    var hasError = false

    // MARK: Converter
    var pair = Pair(from: "USD", to: "UAH") { didSet { save() } }
    var method: Method = .buy { didSet { save() } }
    /// The side the user types into; the other side is computed.
    var activeSide: Side = .from
    /// Raw text of the active side, already normalized by `AmountFormat.parse`.
    var input = "1"

    // MARK: Personalization
    /// Most recent first, max 6.
    var recent: [String] = [] { didSet { save() } }
    var usage: [String: Int] = [:] { didSet { save() } }
    var theme: ThemePreference = .system { didSet { save() } }

    // MARK: UI routing
    /// Non-nil presents the currency picker for that side.
    var pickerSide: Side?
    var showSettings = false

    let useFixtures: Bool
    @ObservationIgnored private let api: RatesAPI
    @ObservationIgnored private let defaults: UserDefaults
    @ObservationIgnored private var refreshTask: Task<Void, Never>?
    @ObservationIgnored private var rateValueTask: Task<Void, Never>?

    static let recentLimit = 6
    static let marketMaxAge: TimeInterval = 3 * 60 * 60
    private static let storageKey = "appState"

    init(api: RatesAPI = RatesAPI(), useFixtures: Bool = false, defaults: UserDefaults = .standard) {
        self.api = api
        self.useFixtures = useFixtures
        self.defaults = defaults
        if let data = defaults.data(forKey: Self.storageKey),
           let saved = try? JSONDecoder().decode(Persisted.self, from: data) {
            pair = saved.pair
            method = saved.method
            theme = saved.theme
            recent = saved.recent
            usage = saved.usage
        }
        #if DEBUG
        // `-debugPair EUR:PLN` launch argument, for screenshots / persistence checks.
        let parts = defaults.string(forKey: "debugPair")?.split(separator: ":").map(String.init) ?? []
        if parts.count == 2, parts[0] != parts[1] {
            pair = Pair(from: parts[0], to: parts[1])
            save()
        }
        #endif
    }

    // MARK: Derived
    var exchange: ResolvedExchange? {
        RateResolver.resolve(pair: pair, bank: bank?.currencies ?? [], market: market)
    }

    var options: [CurrencyOption] {
        CurrencyCatalog.options(bank: bank?.currencies ?? [], market: market)
    }

    var quickPick: [String] { CurrencyCatalog.rankQuickPick(usage: usage) }

    /// When bank rates were last fetched.
    var lastUpdate: Date? { bank.flatMap { ISO8601DateFormatter().date(from: $0.date) } }

    /// Formatted amount for a side: the raw input for the active side, the converted value for the other.
    func amountText(for side: Side) -> String {
        if side == activeSide { return input }
        guard let exchange, let value = Decimal(string: input, locale: Locale(identifier: "en_US_POSIX")),
              let result = RateResolver.convert(value, typedOn: activeSide, exchange: exchange, method: method)
        else { return "" }
        return AmountFormat.amount(result)
    }

    // MARK: Actions
    /// Restores the cached rates for an instant first paint, then refreshes.
    func load() async {
        if useFixtures {
            bank = Fixtures.bankRates
            market = Fixtures.marketRates
            applyValidMethod()
            return
        }
        if bank == nil { bank = RatesCache.loadBank() }
        if market == nil { market = RatesCache.loadMarket() }
        applyValidMethod()
        await refresh()
    }

    /// Concurrent calls share one in-flight refresh.
    func refresh() async {
        guard !useFixtures else { return }
        if let refreshTask { return await refreshTask.value }
        let task = Task { await performRefresh() }
        refreshTask = task
        await task.value
        refreshTask = nil
    }

    private func performRefresh() async {
        isLoading = true
        defer { isLoading = false }
        let api = api
        let needsMarket = Self.isMarketStale(market)
        async let bankResult = try? api.fetchBankRates()
        async let marketResult = needsMarket ? try? api.fetchMarketRates() : nil
        if let b = await bankResult {
            bank = b
            RatesCache.saveBank(b)
        }
        if let m = await marketResult {
            market = m
            RatesCache.saveMarket(m)
        }
        hasError = bank == nil && market == nil
        applyValidMethod()
    }

    /// Picking the other side's currency swaps the pair.
    func setCurrency(_ code: String, side: Side) {
        pair = Self.pair(pair, setting: code, on: side)
        noteUsed(code)
        applyValidMethod()
        trackExchange()
    }

    /// Flips the pair and buy↔sell, keeping the typed amount with its currency.
    func swap() {
        pair = pair.swapped
        method = Self.swappedMethod(method)
        activeSide = activeSide.other
        applyValidMethod()
        trackExchange()
    }

    /// From the rates carousel: pair A → B.
    func setExchange(_ exchange: Exchange) {
        let from = exchange.currencyA.code, to = exchange.currencyB.code
        guard !from.isEmpty, !to.isEmpty, from != to else { return }
        pair = Pair(from: from, to: to)
        noteUsed(from)
        applyValidMethod()
        trackExchange()
    }

    func setMethod(_ method: Method) {
        self.method = method
        applyValidMethod()
        Analytics.track("SET_METHOD", ["method": self.method.rawValue])
    }

    func setInput(_ text: String, side: Side) {
        activeSide = side
        input = text
        trackRateValue()
    }

    func setTheme(_ theme: ThemePreference) {
        self.theme = theme
        Analytics.track("SET_THEME", ["theme": theme.rawValue])
    }

    // MARK: Rules (pure, tested)

    /// Web `SET_CURRENCY`: choosing the other side's currency swaps the pair.
    static func pair(_ pair: Pair, setting code: String, on side: Side) -> Pair {
        let other = side == .from ? pair.to : pair.from
        if code == other { return pair.swapped }
        var next = pair
        if side == .from { next.from = code } else { next.to = code }
        return next
    }

    /// Web `SWAP_PAIR`: buying USD for UAH is selling UAH.
    static func swappedMethod(_ method: Method) -> Method {
        switch method {
        case .buy: .sell
        case .sell: .buy
        case .cross: .cross
        }
    }

    /// Web `pushRecent`: most recent first, deduplicated, max 6.
    static func pushRecent(_ code: String, to recent: [String]) -> [String] {
        Array(([code] + recent.filter { $0 != code }).prefix(recentLimit))
    }

    static func isMarketStale(_ market: MarketRates?, now: Date = .now) -> Bool {
        guard let market else { return true }
        return now.timeIntervalSince(market.fetchedAt) > marketMaxAge
    }

    // MARK: Private

    private func applyValidMethod() {
        let valid = RateResolver.validMethod(method, for: exchange)
        if valid != method { method = valid }
    }

    private func noteUsed(_ code: String) {
        recent = Self.pushRecent(code, to: recent)
        usage[code, default: 0] += 1
    }

    private func save() {
        let state = Persisted(pair: pair, method: method, theme: theme, recent: recent, usage: usage)
        if let data = try? JSONEncoder().encode(state) { defaults.set(data, forKey: Self.storageKey) }
    }

    private func trackExchange() {
        let e = exchange
        var props: [String: Any] = ["codeFrom": pair.from, "codeTo": pair.to, "codes": "\(pair.from):\(pair.to)"]
        props["source"] = e?.source.rawValue
        props["rateBuy"] = (e?.rateBuy ?? e?.rateCross).map(Self.number)
        props["rateSell"] = (e?.rateSell ?? e?.rateCross).map(Self.number)
        props["rateNB"] = e?.nbRate.map(Self.number)
        Analytics.track("SET_EXCHANGE", props)
    }

    /// Web: `SET_RATE_VALUE` 1 s after the user stops typing.
    private func trackRateValue() {
        rateValueTask?.cancel()
        rateValueTask = Task { [weak self] in
            try? await Task.sleep(for: .seconds(1))
            guard !Task.isCancelled, let self,
                  let value = Decimal(string: input, locale: Locale(identifier: "en_US_POSIX")) else { return }
            Analytics.track("SET_RATE_VALUE", [
                "SET_RATE_VALUE/value": Self.number(value),
                "SET_RATE_VALUE/method": method.rawValue,
                "SET_RATE_VALUE/code": activeSide == .from ? pair.from : pair.to,
            ])
        }
    }

    private static func number(_ value: Decimal) -> Double { NSDecimalNumber(decimal: value).doubleValue }
}

extension AppModel {
    /// What survives relaunches.
    nonisolated struct Persisted: Codable, Equatable, Sendable {
        var pair: Pair
        var method: Method
        var theme: ThemePreference
        var recent: [String]
        var usage: [String: Int]
    }
}
