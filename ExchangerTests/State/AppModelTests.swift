import Foundation
import Testing
@testable import Exchanger

@MainActor
struct AppModelTests {
    let defaults: UserDefaults

    init() {
        let suite = "AppModelTests.\(UUID().uuidString)"
        defaults = UserDefaults(suiteName: suite)!
        defaults.removePersistentDomain(forName: suite)
    }

    func makeModel() async -> AppModel {
        let model = AppModel(useFixtures: true, defaults: defaults)
        await model.load()
        return model
    }

    // MARK: Pure rules

    @Test func setCurrencyOnSameCodeSwaps() {
        let pair = Pair(from: "USD", to: "UAH")
        #expect(AppModel.pair(pair, setting: "UAH", on: .from) == Pair(from: "UAH", to: "USD"))
        #expect(AppModel.pair(pair, setting: "USD", on: .to) == Pair(from: "UAH", to: "USD"))
        #expect(AppModel.pair(pair, setting: "EUR", on: .from) == Pair(from: "EUR", to: "UAH"))
        #expect(AppModel.pair(pair, setting: "EUR", on: .to) == Pair(from: "USD", to: "EUR"))
    }

    @Test func swappedMethodFlipsBuySell() {
        #expect(AppModel.swappedMethod(.buy) == .sell)
        #expect(AppModel.swappedMethod(.sell) == .buy)
        #expect(AppModel.swappedMethod(.cross) == .cross)
    }

    @Test func pushRecentDedupesAndCaps() {
        var recent: [String] = []
        for code in ["A", "B", "C", "D", "E", "F", "G"] { recent = AppModel.pushRecent(code, to: recent) }
        #expect(recent == ["G", "F", "E", "D", "C", "B"])
        recent = AppModel.pushRecent("D", to: recent)
        #expect(recent == ["D", "G", "F", "E", "C", "B"])
    }

    @Test func marketStaleness() {
        let now = Date()
        let fresh = MarketRates(date: "", rates: [:], names: [:], fetchedAt: now.addingTimeInterval(-3600))
        let old = MarketRates(date: "", rates: [:], names: [:], fetchedAt: now.addingTimeInterval(-4 * 3600))
        #expect(AppModel.isMarketStale(nil, now: now))
        #expect(!AppModel.isMarketStale(fresh, now: now))
        #expect(AppModel.isMarketStale(old, now: now))
    }

    // MARK: Model

    @Test func defaultState() async {
        let model = await makeModel()
        #expect(model.pair == Pair(from: "USD", to: "UAH"))
        #expect(model.method == .buy)
        #expect(model.theme == .system)
    }

    @Test func setCurrencySwapsOnSameAndTracksUsage() async {
        let model = await makeModel()
        model.setCurrency("UAH", side: .from)
        #expect(model.pair == Pair(from: "UAH", to: "USD"))
        model.setCurrency("EUR", side: .to)
        model.setCurrency("EUR", side: .to)
        #expect(model.pair == Pair(from: "UAH", to: "EUR"))
        #expect(model.recent == ["EUR", "UAH"])
        #expect(model.usage == ["UAH": 1, "EUR": 2])
    }

    @Test func swapFlipsMethodAndActiveSide() async {
        let model = await makeModel()
        model.setInput("100", side: .from)
        model.swap()
        #expect(model.pair == Pair(from: "UAH", to: "USD"))
        #expect(model.activeSide == .to)
        #expect(model.input == "100")
        #expect(model.amountText(for: .to) == "100")
        // buy → sell, unless validMethod forces cross for this pair
        #expect(model.method == RateResolver.validMethod(.sell, for: model.exchange))
    }

    @Test func setExchangeSetsPairAndUsage() async {
        let model = await makeModel()
        let eur = Fixtures.bankRates.currencies.first { $0.id == "978:980" }!
        model.setExchange(eur)
        #expect(model.pair == Pair(from: "EUR", to: "UAH"))
        #expect(model.usage["EUR"] == 1)
        #expect(model.recent.first == "EUR")
    }

    @Test func methodIsAlwaysValid() async {
        let model = await makeModel()
        for method in [Method.buy, .sell, .cross] {
            model.setMethod(method)
            #expect(model.method == RateResolver.validMethod(method, for: model.exchange))
        }
        model.setCurrency("BTC", side: .from)
        #expect(model.method == RateResolver.validMethod(model.method, for: model.exchange))
    }

    @Test func amountTextEmptyForInvalidInput() async {
        let model = await makeModel()
        model.setInput("", side: .from)
        #expect(model.amountText(for: .from) == "")
        #expect(model.amountText(for: .to) == "")
    }

    @Test func persistenceRoundTrip() async {
        let model = await makeModel()
        model.setCurrency("EUR", side: .from)
        model.setCurrency("PLN", side: .to)
        model.setTheme(.dark)
        let restored = AppModel(useFixtures: true, defaults: defaults)
        #expect(restored.pair == Pair(from: "EUR", to: "PLN"))
        #expect(restored.theme == .dark)
        #expect(restored.method == model.method)
        #expect(restored.recent == ["PLN", "EUR"])
        #expect(restored.usage == ["EUR": 1, "PLN": 1])
    }
}
