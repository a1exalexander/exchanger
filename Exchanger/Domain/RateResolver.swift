import Foundation

// Unit 2 (Rate resolution + conversion) owns this file.

nonisolated enum RateResolver {
    /// Direct Monobank pair, else reversed Monobank pair, else market rate. `nil` if from == to or no data.
    static func resolve(pair: Pair, bank: [Exchange], market: MarketRates?) -> ResolvedExchange? {
        nil
    }

    /// `sell` → rateBuy, `buy` → rateSell, `cross` → nbRate ?? rateCross; falls back to cross.
    static func rate(for exchange: ResolvedExchange, method: Method) -> Decimal? {
        nil
    }

    /// Typed on `.from`: amount × rate. Typed on `.to`: amount ÷ rate.
    static func convert(_ amount: Decimal, typedOn side: Side, exchange: ResolvedExchange, method: Method) -> Decimal? {
        nil
    }

    /// `cross` when there are no buy/sell rates; `buy` instead of `cross` when there are.
    static func validMethod(_ method: Method, for exchange: ResolvedExchange?) -> Method {
        method
    }
}
