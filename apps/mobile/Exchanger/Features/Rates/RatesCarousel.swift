import SwiftUI

// Unit 9 (Rates carousel + QuickPick + header) owns this folder and Features/Header.

/// Horizontal carousel of Monobank pairs; tap sets the pair. Autoplays every 4 s like the web slider.
struct RatesCarousel: View {
    @Environment(AppModel.self) private var model
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var position: String?
    @State private var isDragging = false
    @State private var taps = 0

    private var items: [Exchange] { model.bank?.currencies ?? [] }
    private var autoplay: Bool { !isDragging && !reduceMotion && items.count > 1 }

    var body: some View {
        ScrollView(.horizontal) {
            LazyHStack(spacing: 12) {
                if items.isEmpty {
                    if model.isLoading {
                        ForEach(0..<3, id: \.self) { _ in
                            RateSlide(exchange: nil).shimmering()
                        }
                    }
                } else {
                    ForEach(items) { exchange in
                        Button {
                            taps += 1
                            model.setExchange(exchange)
                        } label: {
                            RateSlide(exchange: exchange)
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel(Text("slide.open \(exchange.currencyA.code) \(exchange.currencyB.code)"))
                    }
                }
            }
            .scrollTargetLayout()
        }
        .scrollIndicators(.hidden)
        .scrollTargetBehavior(.viewAligned)
        .scrollPosition(id: $position)
        .contentMargins(.horizontal, 32, for: .scrollContent)
        // bleed to the screen edges through RootView's 16 pt padding so neighbours peek in
        .padding(.horizontal, -16)
        .onScrollPhaseChange { _, phase in
            isDragging = phase == .tracking || phase == .interacting || phase == .decelerating
        }
        .task(id: autoplay) {
            guard autoplay else { return }
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(4))
                guard !Task.isCancelled else { return }
                advance()
            }
        }
        .sensoryFeedback(.selection, trigger: taps)
    }

    /// Next slide, looping back to the first.
    private func advance() {
        let ids = items.map(\.id)
        guard !ids.isEmpty else { return }
        let index = position.flatMap(ids.firstIndex(of:)) ?? 0
        withAnimation(.smooth(duration: 0.6)) { position = ids[(index + 1) % ids.count] }
    }
}

/// One card: B currency, the rates, A currency. `nil` renders a placeholder for the skeleton.
private struct RateSlide: View {
    @Environment(AppModel.self) private var model
    let exchange: Exchange?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            currencyRow(exchange?.currencyB.code ?? "UAH")
            rates
            currencyRow(exchange?.currencyA.code ?? "USD")
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .card()
        .containerRelativeFrame(.horizontal)
        .scrollTransition(.interactive) { content, phase in
            content
                .scaleEffect(phase.isIdentity ? 1 : 0.92)
                .opacity(phase.isIdentity ? 1 : 0.6)
        }
    }

    private func currencyRow(_ code: String) -> some View {
        HStack(spacing: 10) {
            CurrencyIcon(code: code, size: 28)
            Text(verbatim: code)
                .font(.display(16))
                .foregroundStyle(Color.textPrimary)
            Text(verbatim: CurrencyCatalog.name(of: code, market: model.market))
                .font(.subheadline)
                .foregroundStyle(Color.textSecondary)
                .lineLimit(1)
        }
    }

    @ViewBuilder private var rates: some View {
        if let exchange, let buy = exchange.rateBuy, let sell = exchange.rateSell {
            // web: "Sell: rateBuy ⇄ Buy: rateSell"
            HStack(spacing: 8) {
                rate("slide.sell", AmountFormat.truncate(buy, places: 2), color: .sell)
                Image(systemName: "arrow.left.arrow.right")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(Color.textSecondary)
                rate("slide.buy", AmountFormat.truncate(sell, places: 2), color: .buy)
            }
        } else if let cross = exchange?.rateCross {
            rate("slide.cross", AmountFormat.rate(cross), color: .cross)
        } else {
            rate("slide.cross", "00.00", color: .cross)
        }
    }

    private func rate(_ label: LocalizedStringKey, _ value: String, color: Color) -> some View {
        HStack(spacing: 4) {
            Text(label).foregroundStyle(color)
            Text(verbatim: value)
                .foregroundStyle(Color.textPrimary)
                .monospacedDigit()
                .contentTransition(.numericText())
        }
        .font(.subheadline.weight(.semibold))
        .lineLimit(1)
    }
}
