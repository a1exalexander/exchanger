import SwiftUI

// Unit 9 (Rates carousel + QuickPick + header) owns this folder and Features/Header.

/// Horizontal carousel of Monobank pairs; tap sets the pair.
struct RatesCarousel: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        ScrollView(.horizontal) {
            HStack {
                ForEach(model.bank?.currencies ?? []) { exchange in
                    Button("\(exchange.currencyA.code) → \(exchange.currencyB.code)") { model.setExchange(exchange) }
                        .card()
                }
            }
        }
    }
}

/// Usage-ranked currency chips; tap sets the "from" currency.
struct QuickPickView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        HStack {
            ForEach(model.quickPick, id: \.self) { code in
                Button(code) { model.setCurrency(code, side: .from) }
            }
        }
    }
}
