import Foundation
import Testing
@testable import Exchanger

struct CatalogTests {
    let bank = Fixtures.bankRates.currencies
    let market = Fixtures.marketRates

    @Test func kinds() {
        #expect(CurrencyCatalog.kind(of: "BTC") == .crypto)
        #expect(CurrencyCatalog.kind(of: "XAU") == .metal)
        #expect(CurrencyCatalog.kind(of: "UAH") == .fiat)
        #expect(CurrencyCatalog.kind(of: "CNH") == .fiat)
        #expect(CurrencyCatalog.kind(of: "XDR") == .fiat)
        #expect(CurrencyCatalog.kind(of: "ZZQX") == .crypto)
    }

    @Test func names() {
        #expect(CurrencyCatalog.name(of: "UAH", market: nil, lang: "uk") == "Українська гривня")
        #expect(CurrencyCatalog.name(of: "XAU", market: nil, lang: "en") == "Gold (troy ounce)")
        #expect(CurrencyCatalog.name(of: "USD", market: nil, lang: "uk") == "Долар США")
        #expect(CurrencyCatalog.name(of: "USD", market: nil, lang: "en") == "US Dollar")
        #expect(CurrencyCatalog.name(of: "SOL", market: market, lang: "uk") == market.names["SOL"])
        #expect(CurrencyCatalog.name(of: "ZZQX", market: nil, lang: "en") == "ZZQX")
    }

    @Test func optionsFromFixtures() {
        var fakeMarket = market
        fakeMarket.rates["ZZQX"] = 1
        let options = CurrencyCatalog.options(bank: bank, market: fakeMarket, lang: "en")
        let codes = Set(options.map(\.code))
        #expect(codes.isSuperset(of: ["UAH", "USD", "BTC", "XAU"]))
        #expect(codes.isDisjoint(with: CurrencyCatalog.skip))
        #expect(!codes.contains("ZZQX"))
        #expect(codes.count == options.count)
        let names = options.map(\.name)
        #expect(names == names.sorted { $0.compare($1, locale: Locale(identifier: "en")) != .orderedDescending })
        #expect(options.first { $0.code == "XAU" }?.kind == .metal)
    }

    @Test func ukrainianOptionsAreLocalized() {
        let options = CurrencyCatalog.options(bank: bank, market: market, lang: "uk")
        #expect(options.first { $0.code == "EUR" }?.name == "Євро")
    }

    @Test func bankRates() {
        #expect(CurrencyCatalog.hasBankRates("USD", against: "UAH", bank: bank))
        #expect(CurrencyCatalog.hasBankRates("UAH", against: "USD", bank: bank))
        #expect(!CurrencyCatalog.hasBankRates("BTC", against: "UAH", bank: bank))
    }

    @Test func quickPick() {
        #expect(CurrencyCatalog.rankQuickPick(usage: [:]) == CurrencyCatalog.quickPickDefaults)
        let ranked = CurrencyCatalog.rankQuickPick(usage: ["JPY": 3, "EUR": 3, "PLN": 1, "CAD": 1])
        #expect(ranked == ["EUR", "JPY", "PLN", "CAD", "UAH", "USD", "GBP", "CHF"])
        #expect(ranked == CurrencyCatalog.rankQuickPick(usage: ["CAD": 1, "PLN": 1, "EUR": 3, "JPY": 3]))
    }

    // MARK: search

    var options: [CurrencyOption] { CurrencyCatalog.options(bank: bank, market: market, lang: "en") }

    @Test func searchByCode() {
        #expect(CurrencySearch.search("usd", in: options).first?.code == "USD")
        #expect(CurrencySearch.search("  ", in: options).count == options.count)
    }

    @Test func searchAcrossLanguages() {
        #expect(CurrencySearch.search("долар", in: options).map(\.code).contains("USD"))
        let dollar = CurrencySearch.search("dollar", in: options).map(\.code)
        #expect(dollar.contains("USD") && dollar.contains("CAD"))
        #expect(!dollar.contains("EUR"))
        let ukOptions = CurrencyCatalog.options(bank: bank, market: market, lang: "uk")
        #expect(CurrencySearch.search("dollar", in: ukOptions).map(\.code).contains("USD"))
    }

    @Test func searchMetalsAndCountries() {
        #expect(CurrencySearch.search("gold", in: options).first?.code == "XAU")
        #expect(CurrencySearch.search("золото", in: options).first?.code == "XAU")
        #expect(CurrencySearch.search("Poland", in: options).first?.code == "PLN")
        #expect(CurrencySearch.search("польща", in: options).first?.code == "PLN")
        #expect(CurrencySearch.search("germany", in: options).map(\.code).contains("EUR"))
    }

    @Test func searchRanking() {
        // code prefix beats name matches
        let results = CurrencySearch.search("us", in: options).map(\.code)
        #expect(results.first == "USD" || results.first == "USDT" || results.first == "USDC")
        // diacritics are ignored
        #expect(CurrencySearch.search("zloty", in: options).first?.code == "PLN")
    }
}
