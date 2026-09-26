import Foundation
import Synchronization
import Testing
@testable import Exchanger

/// Serves canned responses by absolute URL; anything unrouted fails as offline.
nonisolated final class StubProtocol: URLProtocol, @unchecked Sendable {
    static let routes = Mutex<[String: (status: Int, data: Data)]>([:])

    static func session(_ routes: [String: (status: Int, data: Data)]) -> URLSession {
        self.routes.withLock { $0 = routes }
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [StubProtocol.self]
        return URLSession(configuration: config)
    }

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func stopLoading() {}

    override func startLoading() {
        let url = request.url!
        guard let route = Self.routes.withLock({ $0[url.absoluteString] }) else {
            client?.urlProtocol(self, didFailWithError: URLError(.notConnectedToInternet))
            return
        }
        let response = HTTPURLResponse(url: url, statusCode: route.status, httpVersion: nil, headerFields: nil)!
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: route.data)
        client?.urlProtocolDidFinishLoading(self)
    }
}

@Suite(.serialized)
struct RatesAPITests {
    let own = RatesAPI.ownAPI.absoluteString
    let mono = RatesAPI.monobank.absoluteString
    let nbu = RatesAPI.nbu.absoluteString
    func mirror(_ i: Int, _ path: String) -> String {
        RatesAPI.marketMirrors[i].appending(path: path).absoluteString
    }

    @Test func ownAPIHappyPath() async throws {
        let api = RatesAPI(session: StubProtocol.session([own: (200, Fixtures.data("currencies"))]))
        #expect(try await api.fetchBankRates() == Fixtures.bankRates)
    }

    @Test(arguments: [(500, Data("{}".utf8)), (200, Data(#"{"date":"x","currencies":[]}"#.utf8)), (200, Data("<html>".utf8))])
    func fallbackMatchesOwnAPI(ownStatus: Int, ownBody: Data) async throws {
        let api = RatesAPI(session: StubProtocol.session([
            own: (ownStatus, ownBody),
            mono: (200, Fixtures.data("monobank")),
            nbu: (200, Fixtures.data("nbu")),
        ]))
        let got = try await api.fetchBankRates().currencies
        let want = Fixtures.bankRates.currencies
        #expect(got.map(\.id) == want.map(\.id))
        #expect(got.map(\.rateBuy) == want.map(\.rateBuy))
        #expect(got.map(\.rateSell) == want.map(\.rateSell))
        #expect(got.map(\.rateCross) == want.map(\.rateCross))
        #expect(got.map(\.nb?.rate) == want.map(\.nb?.rate))
        #expect(got.map(\.currencyA.code) == want.map(\.currencyA.code))
        #expect(got.map(\.currencyB.digits) == want.map(\.currencyB.digits))
        #expect(got.map(\.date) == want.map(\.date))
    }

    @Test func fallbackWithoutNBU() async throws {
        let api = RatesAPI(session: StubProtocol.session([mono: (200, Fixtures.data("monobank"))]))
        let got = try await api.fetchBankRates().currencies
        #expect(got.count == Fixtures.bankRates.currencies.count)
        #expect(got.allSatisfy { $0.nb == nil })
    }

    @Test func bankFailsWhenEverythingDown() async {
        let api = RatesAPI(session: StubProtocol.session([:]))
        await #expect(throws: (any Error).self) { try await api.fetchBankRates() }
    }

    @Test func marketFallsBackToSecondMirror() async throws {
        let api = RatesAPI(session: StubProtocol.session([
            mirror(0, "currencies/usd.min.json"): (404, Data()),
            mirror(1, "currencies/usd.min.json"): (200, Fixtures.data("market")),
            mirror(0, "currencies.min.json"): (200, Fixtures.data("names")),
        ]))
        let got = try await api.fetchMarketRates()
        let want = Fixtures.marketRates
        #expect(got.date == want.date)
        #expect(got.rates == want.rates)
        #expect(got.names == want.names)
    }

    @Test func marketNamesOptional() async throws {
        let api = RatesAPI(session: StubProtocol.session([
            mirror(1, "currencies/usd.min.json"): (200, Fixtures.data("market")),
        ]))
        let got = try await api.fetchMarketRates()
        #expect(got.rates == Fixtures.marketRates.rates)
        #expect(got.names.isEmpty)
    }

    @Test func cacheRoundTrip() {
        let bank = Fixtures.bankRates
        let market = Fixtures.marketRates
        RatesCache.saveBank(bank)
        RatesCache.saveMarket(market)
        #expect(RatesCache.loadBank() == bank)
        #expect(RatesCache.loadMarket() == market)
    }
}
