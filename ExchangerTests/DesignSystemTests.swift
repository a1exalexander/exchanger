import Testing
import UIKit
@testable import Exchanger

struct DesignSystemTests {
    @Test func bundledAssetsResolve() {
        for name in ["flag-usd", "flag-eur", "flag-uah", "coin-btc", "coin-pol"] {
            #expect(UIImage(named: name) != nil, "\(name)")
        }
    }

    @Test func displayFontIsBundled() {
        #expect(UIFont(name: "Unbounded-SemiBold", size: 20) != nil)
    }

    @Test func badgeTintIsStable() {
        #expect(CurrencyIcon.stableHash("ZZZ") == CurrencyIcon.stableHash("zzz"))
        #expect(CurrencyIcon.stableHash("ZZZ") != CurrencyIcon.stableHash("ZZY"))
    }
}
