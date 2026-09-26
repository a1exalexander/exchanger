import Foundation
import Testing
@testable import Exchanger

struct FixturesTests {
    @Test func bankRatesDecode() {
        let bank = Fixtures.bankRates
        #expect(!bank.currencies.isEmpty)
        let usd = bank.currencies.first { $0.id == "840:980" }
        #expect(usd?.currencyA.code == "USD")
        #expect(usd?.rateBuy != nil)
        #expect(usd?.nb?.cc == "USD")
    }

    @Test func marketRatesDecode() {
        let market = Fixtures.marketRates
        #expect(market.rates["EUR"] != nil)
        #expect(market.names["UAH"] != nil)
    }
}
