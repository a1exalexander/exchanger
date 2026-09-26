import Foundation
import Testing
@testable import Exchanger

struct RateResolverTests {
    private static func currency(_ code: String) -> CurrencyInfo { CurrencyInfo(code: code) }

    // Mirrors the fixture in the web's resolveExchange.test.ts
    let bank: [Exchange] = [
        Exchange(id: "840:980", currencyCodeA: 840, currencyCodeB: 980, date: "26 September 2026",
                 rateBuy: 40, rateSell: 50, currencyA: currency("USD"), currencyB: currency("UAH"),
                 nb: NBRate(r030: 840, txt: "Долар США", rate: 45, cc: "USD", exchangedate: "26.09.2026")),
        Exchange(id: "826:980", currencyCodeA: 826, currencyCodeB: 980,
                 rateCross: 55, currencyA: currency("GBP"), currencyB: currency("UAH")),
    ]
    let market = MarketRates(date: "2026-09-25", rates: ["USD": 1, "UAH": 45, "EUR": 0.9, "BTC": 0.00001],
                             names: [:], fetchedAt: .now)

    private func resolve(_ from: String, _ to: String) -> ResolvedExchange? {
        RateResolver.resolve(pair: Pair(from: from, to: to), bank: bank, market: market)
    }

    private func resolveFixture(_ from: String, _ to: String) -> ResolvedExchange? {
        RateResolver.resolve(pair: Pair(from: from, to: to), bank: Fixtures.bankRates.currencies,
                             market: Fixtures.marketRates)
    }

    private func close(_ a: Decimal?, _ b: Decimal, _ eps: Decimal = 0.000_000_01) -> Bool {
        guard let a else { return false }
        return abs(a - b) < eps
    }

    // MARK: resolveExchange.test.ts

    @Test func usesMonobankPairAsIs() throws {
        let e = try #require(resolve("USD", "UAH"))
        #expect(e.source == .bank)
        #expect(e.rateSell == 50)
        #expect(e.nbRate == 45)
        #expect(e.nbDate == "26.09.2026")
        #expect(!e.reversed)
    }

    @Test func reversesPairAndSwapsSides() throws {
        let e = try #require(resolve("UAH", "USD"))
        #expect(e.source == .bank)
        #expect(e.reversed)
        #expect(e.from == "UAH" && e.to == "USD")
        // buying UAH = selling USD at the bank buy rate
        #expect(e.rateSell == Decimal(string: "0.025"))
        #expect(e.rateBuy == Decimal(string: "0.02"))
        #expect(e.nbRate == Decimal(string: "0.02222222222"))
    }

    @Test func marksMonobankCrossRates() {
        #expect(resolve("GBP", "UAH")?.source == .bankCross)
        #expect(resolve("UAH", "GBP")?.rateCross == Decimal(string: "0.01818181818"))
    }

    @Test func fallsBackToMarket() throws {
        let e = try #require(resolve("EUR", "BTC"))
        #expect(e.source == .market)
        #expect(e.date == "2026-09-25")
        #expect(e.precision == 8)
        #expect(close(e.rateCross, Decimal(string: "0.00001")! / Decimal(string: "0.9")!, 0.000_000_000_001))
    }

    @Test func nothingWithoutDataOrSameCurrency() {
        #expect(RateResolver.resolve(pair: Pair(from: "EUR", to: "BTC"), bank: bank, market: nil) == nil)
        #expect(resolve("USD", "USD") == nil)
        #expect(resolve("EUR", "XYZ") == nil)
    }

    @Test func knowsWhichPairsHaveBankRates() {
        #expect(resolve("UAH", "USD")?.hasBankRates == true)
        #expect(resolve("GBP", "UAH")?.hasBankRates == false)
    }

    @Test func swappingKeepsTheSameDeal() throws {
        let before = try #require(resolve("USD", "UAH"))
        let after = try #require(resolve("UAH", "USD"))
        // user pays 50 UAH per USD in both views
        #expect(RateResolver.rate(for: before, method: .buy) == 50)
        let afterRate = try #require(RateResolver.rate(for: after, method: .sell))
        #expect(close(1 / afterRate, 50))
    }

    // MARK: getRate / convert / validMethod

    @Test func rateByMethod() throws {
        let usd = try #require(resolve("USD", "UAH"))
        #expect(RateResolver.rate(for: usd, method: .sell) == 40)
        #expect(RateResolver.rate(for: usd, method: .buy) == 50)
        #expect(RateResolver.rate(for: usd, method: .cross) == 45)
        let gbp = try #require(resolve("GBP", "UAH"))
        #expect(RateResolver.rate(for: gbp, method: .buy) == 55) // falls back to cross
    }

    @Test func convertsBothWays() throws {
        let usd = try #require(resolve("USD", "UAH"))
        #expect(RateResolver.convert(2, typedOn: .from, exchange: usd, method: .buy) == 100)
        #expect(RateResolver.convert(100, typedOn: .to, exchange: usd, method: .buy) == 2)
        let empty = ResolvedExchange(from: "A", to: "B", source: .market, reversed: false, precision: 8)
        #expect(RateResolver.convert(1, typedOn: .from, exchange: empty, method: .cross) == nil)
    }

    @Test func validMethod() {
        #expect(RateResolver.validMethod(.cross, for: resolve("USD", "UAH")) == .buy)
        #expect(RateResolver.validMethod(.sell, for: resolve("USD", "UAH")) == .sell)
        #expect(RateResolver.validMethod(.buy, for: resolve("GBP", "UAH")) == .cross)
        #expect(RateResolver.validMethod(.sell, for: nil) == .sell)
    }

    @Test func significantDigits() {
        #expect(RateResolver.significant(Decimal(string: "123.456789012345")!) == Decimal(string: "123.456789"))
        #expect(RateResolver.significant(Decimal(string: "0.000123456789012345")!) == Decimal(string: "0.000123456789"))
        #expect(RateResolver.significant(1 / Decimal(3)) == Decimal(string: "0.3333333333"))
        #expect(RateResolver.significant(Decimal(string: "12345678901234")!) == Decimal(string: "12345678900000"))
    }

    // MARK: Fixtures

    @Test func fixturesDirectBank() throws {
        let e = try #require(resolveFixture("USD", "UAH"))
        #expect(e.source == .bank)
        #expect(e.rateBuy == Decimal(string: "44.635"))
        #expect(e.nbRate == Decimal(string: "44.8414"))
        #expect(e.date == "25 September 2026")
        #expect(RateResolver.convert(1, typedOn: .from, exchange: e, method: .buy) == Decimal(string: "45.0349"))
    }

    @Test func fixturesReversed() throws {
        let e = try #require(resolveFixture("UAH", "USD"))
        #expect(e.reversed)
        #expect(e.source == .bank)
        #expect(close(e.rateSell, 1 / Decimal(string: "44.635")!))
    }

    @Test func fixturesNonUAHPairHasNoNB() throws {
        let e = try #require(resolveFixture("EUR", "USD"))
        #expect(e.source == .bank)
        #expect(e.nbRate == nil)
    }

    @Test(arguments: [("UAH", "XAU"), ("BTC", "EUR")])
    func fixturesMarket(from: String, to: String) throws {
        let m = Fixtures.marketRates
        let e = try #require(resolveFixture(from, to))
        #expect(e.source == .market)
        #expect(e.date == m.date)
        let expected = try #require(m.rates[to]) / #require(m.rates[from])
        #expect(close(e.rateCross, expected, expected / 1_000_000_000))
    }

    @Test func fixturesSameCurrency() {
        #expect(resolveFixture("EUR", "EUR") == nil)
    }
}
