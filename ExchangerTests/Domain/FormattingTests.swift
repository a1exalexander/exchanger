import Foundation
import Testing
@testable import Exchanger

// Expected values mirror ../exchanger/src/tests/formatCurrency.test.ts and outputs of the web implementation.
struct FormattingTests {
    private func d(_ s: String) -> Decimal { Decimal(string: s)! }

    @Test(arguments: [
        ("1 234,5", "1234.5"), (".5", "0.5"), ("", ""),
        ("1 000,5", "1000.5"), (".", "0."), ("12.", "12."), ("0.", "0."),
        ("\u{00A0}1\u{202F}000", "1000"), ("1234567890123456", "1234567890123456"),
    ])
    func parseValid(input: String, expected: String) {
        #expect(AmountFormat.parse(input) == expected)
    }

    @Test(arguments: ["12a", "1.2.3", "12345678901234567", "-1", "1,2,3", "١٢"])
    func parseInvalid(input: String) {
        #expect(AmountFormat.parse(input) == nil)
    }

    @Test(arguments: [
        ("45417.5", "45 417.50"), ("100", "100"), ("0.000132241234", "0.00013224"),
        ("0", "0"), ("1", "1"), ("1.5", "1.50"), ("1.005", "1.01"),
        ("1234567.891", "1 234 567.89"), ("0.000000001", "0.000000001"), ("0.9999999", "1"),
        ("-1234.5", "-1 234.50"), ("-0.00012345", "-0.00012345"), ("0.1", "0.1"),
        ("123456789012345678901234.5", "123 456 789 012 345 678 901 234.50"),
    ])
    func amount(input: String, expected: String) {
        #expect(AmountFormat.amount(d(input)) == expected)
    }

    @Test(arguments: [
        ("45.41752", "45.4175"), ("0.0220180", "0.02202"), ("3781023.3", "3 781 023.30"),
        ("0", "0"), ("1000", "1 000.00"), ("999.99999", "1000.0000"),
        ("0.00000026", "0.00000026"), ("1", "1.0000"), ("-45.41752", "-45.4175"),
    ])
    func rate(input: String, expected: String) {
        #expect(AmountFormat.rate(d(input)) == expected)
    }

    @Test(arguments: [
        ("1.23456", 2, "1.23"), ("1.5", 4, "1.5"), ("1.99", 0, "2"), ("2.5", 0, "3"),
        ("-2.5", 0, "-2"), ("-1.23456", 3, "-1.234"), ("12", 2, "12"), ("1.9999", 2, "1.99"),
    ])
    func truncate(input: String, places: Int, expected: String) {
        #expect(AmountFormat.truncate(d(input), places: places) == expected)
    }
}
