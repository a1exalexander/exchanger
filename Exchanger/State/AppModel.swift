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
    var pair = Pair(from: "USD", to: "UAH")
    var method: Method = .buy
    /// The side the user types into; the other side is computed.
    var activeSide: Side = .from
    /// Raw text of the active side, already normalized by `AmountFormat.parse`.
    var input = "1"

    // MARK: Personalization
    /// Most recent first, max 6.
    var recent: [String] = []
    var usage: [String: Int] = [:]
    var theme: ThemePreference = .system

    // MARK: UI routing
    /// Non-nil presents the currency picker for that side.
    var pickerSide: Side?
    var showSettings = false

    let useFixtures: Bool
    private let api: RatesAPI

    init(api: RatesAPI = RatesAPI(), useFixtures: Bool = false) {
        self.api = api
        self.useFixtures = useFixtures
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
        guard let exchange, let value = Decimal(string: input),
              let result = RateResolver.convert(value, typedOn: activeSide, exchange: exchange, method: method)
        else { return "" }
        return AmountFormat.amount(result)
    }

    // MARK: Actions
    func load() async {
        if useFixtures {
            bank = Fixtures.bankRates
            market = Fixtures.marketRates
            return
        }
        await refresh()
    }

    func refresh() async {
        guard !useFixtures else { return }
        isLoading = true
        defer { isLoading = false }
        async let bankResult = try? api.fetchBankRates()
        async let marketResult = try? api.fetchMarketRates()
        if let b = await bankResult { bank = b }
        if let m = await marketResult { market = m }
        hasError = bank == nil && market == nil
    }

    /// Picking the other side's currency swaps the pair.
    func setCurrency(_ code: String, side: Side) {
        if side == .from { pair.from = code } else { pair.to = code }
    }

    /// Flips the pair and buy↔sell, keeping the typed amount with its currency.
    func swap() {
        pair = pair.swapped
        activeSide = activeSide.other
    }

    /// From the rates carousel: pair A → B.
    func setExchange(_ exchange: Exchange) {
        pair = Pair(from: exchange.currencyA.code, to: exchange.currencyB.code)
    }

    func setMethod(_ method: Method) {
        self.method = method
    }

    func setInput(_ text: String, side: Side) {
        activeSide = side
        input = text
    }

    func setTheme(_ theme: ThemePreference) {
        self.theme = theme
    }
}
