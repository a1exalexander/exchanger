#if DEBUG
import SwiftUI

/// Visual check of the design system components.
struct DesignSystemGallery: View {
    private let codes = ["USD", "EUR", "UAH", "GBP", "PLN", "CHF", "CZK", "JPY", "CNY", "TRY",
                         "CAD", "AUD", "KZT", "GEL", "ILS", "BTC", "ETH", "USDT", "USDC", "SOL",
                         "XRP", "DOGE", "POL", "TON", "PEPE", "XAU", "XAG", "XPT", "XPD", "ZZZ"]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text(verbatim: "Exchanger 41.25").font(.display(34))

                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: 12) {
                    ForEach(codes, id: \.self) { code in
                        VStack(spacing: 4) {
                            CurrencyIcon(code: code, size: 40)
                            Text(verbatim: code).font(.caption2).foregroundStyle(Color.textSecondary)
                        }
                    }
                }
                .card()

                HStack(spacing: 16) {
                    SourceMark(source: .bank)
                    SourceMark(source: .bankCross)
                    SourceMark(source: .nbu)
                    SourceMark(source: .market)
                }
                .card()

                VStack(alignment: .leading, spacing: 8) {
                    Text(verbatim: "1 000.00 USD").font(.display(28))
                    Text(verbatim: "Body text stays SF").font(.body)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .card()

                VStack(alignment: .leading, spacing: 8) {
                    Text(verbatim: "Loading placeholder").font(.display(22))
                    Text(verbatim: "41.2500 / 41.8000")
                    Text(verbatim: "Updated a moment ago").font(.caption)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .shimmering()
                .card()

                Button {} label: {
                    Text(verbatim: "Pressable").padding().frame(maxWidth: .infinity).background(Color.brand, in: .capsule).foregroundStyle(.white)
                }
                .buttonStyle(.pressable)
            }
            .padding(16)
        }
        .background(Color.pageBackground)
    }
}

#Preview { DesignSystemGallery() }
#endif
