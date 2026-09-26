import Foundation

// Unit 2 (Rate resolution + conversion) owns this file.

nonisolated enum RateResolver {
    /// Direct Monobank pair, else reversed Monobank pair, else market rate. `nil` if from == to or no data.
    static func resolve(pair: Pair, bank: [Exchange], market: MarketRates?) -> ResolvedExchange? {
        let (from, to) = (pair.from, pair.to)
        guard !from.isEmpty, !to.isEmpty, from != to else { return nil }

        if let direct = findPair(bank, from, to) {
            return resolved(direct, from: from, to: to, reversed: false,
                            rateBuy: nonZero(direct.rateBuy), rateSell: nonZero(direct.rateSell),
                            rateCross: nonZero(direct.rateCross), nbRate: nbRate(of: direct))
        }
        // Bank quotes "1 A = rate B"; the other way round the bank sells B at 1/rateBuy and buys it at 1/rateSell.
        if let opposite = findPair(bank, to, from) {
            return resolved(opposite, from: from, to: to, reversed: true,
                            rateBuy: invert(opposite.rateSell), rateSell: invert(opposite.rateBuy),
                            rateCross: invert(opposite.rateCross), nbRate: invert(nbRate(of: opposite)))
        }
        guard let market, let rateFrom = nonZero(market.rates[from]), let rateTo = nonZero(market.rates[to])
        else { return nil }
        return ResolvedExchange(
            from: from, to: to,
            rateCross: significant(rateTo / rateFrom),
            date: market.date, source: .market, reversed: false, precision: 8
        )
    }

    /// `sell` → rateBuy, `buy` → rateSell, `cross` → nbRate ?? rateCross; falls back to cross.
    static func rate(for exchange: ResolvedExchange, method: Method) -> Decimal? {
        let cross = nonZero(exchange.nbRate) ?? nonZero(exchange.rateCross)
        switch method {
        case .sell: return nonZero(exchange.rateBuy) ?? cross
        case .buy: return nonZero(exchange.rateSell) ?? cross
        case .cross: return cross
        }
    }

    /// Typed on `.from`: amount × rate. Typed on `.to`: amount ÷ rate.
    static func convert(_ amount: Decimal, typedOn side: Side, exchange: ResolvedExchange, method: Method) -> Decimal? {
        guard let rate = rate(for: exchange, method: method) else { return nil }
        return side == .from ? amount * rate : amount / rate
    }

    /// `cross` when there are no buy/sell rates; `buy` instead of `cross` when there are.
    static func validMethod(_ method: Method, for exchange: ResolvedExchange?) -> Method {
        guard let exchange else { return method }
        if !exchange.hasBankRates { return .cross }
        return method == .cross ? .buy : method
    }

    // MARK: Helpers

    private static func findPair(_ bank: [Exchange], _ a: String, _ b: String) -> Exchange? {
        bank.first { $0.currencyA.code == a && $0.currencyB.code == b }
    }

    /// NBU quotes UAH per 1 unit of `cc`, so it only matches the pair's direction for `cc`→UAH pairs.
    /// (The web shows it for any pair with currencyA == cc, e.g. 51 for EUR→USD; dropped here.)
    private static func nbRate(of exchange: Exchange) -> Decimal? {
        guard let nb = exchange.nb, nb.cc == exchange.currencyA.code, exchange.currencyB.code == "UAH"
        else { return nil }
        return nonZero(nb.rate)
    }

    private static func resolved(_ exchange: Exchange, from: String, to: String, reversed: Bool,
                                 rateBuy: Decimal?, rateSell: Decimal?, rateCross: Decimal?,
                                 nbRate: Decimal?) -> ResolvedExchange {
        ResolvedExchange(
            from: from, to: to,
            rateBuy: rateBuy, rateSell: rateSell, rateCross: rateCross,
            nbRate: nbRate,
            nbDate: nbRate == nil ? nil : exchange.nb?.exchangedate,
            date: exchange.date,
            source: rateBuy != nil ? .bank : nbRate != nil ? .nbu : .bankCross,
            reversed: reversed,
            precision: exchange.precision ?? 4
        )
    }

    private static func nonZero(_ value: Decimal?) -> Decimal? {
        guard let value, value != 0, !value.isNaN else { return nil }
        return value
    }

    private static func invert(_ value: Decimal?) -> Decimal? {
        nonZero(value).map { significant(1 / $0) }
    }

    /// Rounds to `digits` significant digits, like `Big#toPrecision`.
    static func significant(_ value: Decimal, digits: Int = 10) -> Decimal {
        guard value != 0, !value.isNaN else { return value }
        let mantissaDigits = "\(value.significand.magnitude)".count
        let order = mantissaDigits + Int(value.exponent) - 1
        var input = value
        var result = Decimal()
        NSDecimalRound(&result, &input, digits - 1 - order, .plain)
        return result
    }
}
