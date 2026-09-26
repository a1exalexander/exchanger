import SwiftUI

// Unit 7 (Converter + keypad) owns this folder.

/// Main converter card: from/to amounts, swap, buy/sell, rate summary.
struct ConverterView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Namespace private var methodThumb
    @State private var swapTurns = 0

    private var exchange: ResolvedExchange? { model.exchange }
    private var unavailable: Bool { exchange == nil && !model.isLoading }
    private var skeleton: Bool { exchange == nil && model.isLoading }

    /// Row identities follow the currency, so after a swap the rows visibly trade places.
    private var rows: [(id: String, side: Side)] {
        let pair = model.pair
        return pair.from == pair.to
            ? [("from", .from), ("to", .to)]
            : [(pair.from, .from), (pair.to, .to)]
    }

    var body: some View {
        VStack(spacing: 14) {
            VStack(spacing: 34) {
                ForEach(rows, id: \.id) { row in
                    AmountRow(side: row.side, skeleton: skeleton, disabled: unavailable)
                }
            }
            .overlay { swapButton }

            if exchange?.hasBankRates == true {
                methodPicker
                    .transition(.opacity.combined(with: .scale(scale: 0.96, anchor: .top)))
            }

            RateSummary(unavailable: unavailable, skeleton: skeleton)
        }
        .animation(.snappy, value: exchange?.hasBankRates)
        .card()
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text("card.label"))
    }

    // MARK: Swap

    private var swapButton: some View {
        Button(action: swap) {
                Image(systemName: "arrow.up.arrow.down")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(Color.accentColor)
                    .rotationEffect(.degrees(Double(swapTurns) * 180))
                    .frame(width: 44, height: 44)
                    .background(Color.surface, in: .circle)
                    .overlay(Circle().stroke(Color.border))
                    .shadow(color: .black.opacity(0.08), radius: 6, y: 2)
            }
            .buttonStyle(PressScale())
            .accessibilityLabel(Text("card.swap"))
            .sensoryFeedback(.impact(weight: .medium), trigger: swapTurns)
    }

    private func swap() {
        withAnimation(reduceMotion ? nil : .spring(duration: 0.46, bounce: 0.35)) {
            model.swap()
            swapTurns += 1
        }
    }

    // MARK: Buy / sell

    private var methodPicker: some View {
        HStack(spacing: 0) {
            ForEach([Method.buy, .sell], id: \.self) { item in
                let selected = model.method == item
                Button {
                    withAnimation(.spring(duration: 0.3, bounce: 0.2)) { model.setMethod(item) }
                } label: {
                    Text(verbatim: "\(String(localized: item == .buy ? "card.buy" : "card.sell")) \(model.pair.from)")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(selected ? Color.white : Color.textSecondary)
                        .frame(maxWidth: .infinity, minHeight: 36)
                        .background {
                            if selected {
                                Capsule()
                                    .fill(item == .buy ? Color.buy : Color.sell)
                                    .matchedGeometryEffect(id: "thumb", in: methodThumb)
                            }
                        }
                        .contentShape(.capsule)
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(selected ? .isSelected : [])
            }
        }
        .padding(3)
        .background(Color.surfaceSecondary, in: .capsule)
        .sensoryFeedback(.selection, trigger: model.method)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text("card.operation"))
    }
}

// MARK: - Amount row

private struct AmountRow: View {
    @Environment(AppModel.self) private var model
    let side: Side
    let skeleton: Bool
    let disabled: Bool

    private var code: String { side == .from ? model.pair.from : model.pair.to }
    private var isActive: Bool { model.activeSide == side }
    private var text: String { model.amountText(for: side) }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Button { model.pickerSide = side } label: {
                HStack(spacing: 10) {
                    CurrencyIcon(code: code, size: 28)
                    Text(verbatim: code)
                        .font(.headline)
                        .foregroundStyle(Color.textPrimary)
                    Text(verbatim: CurrencyCatalog.name(of: code, market: model.market))
                        .font(.subheadline)
                        .foregroundStyle(Color.textSecondary)
                        .lineLimit(1)
                    Image(systemName: "chevron.down")
                        .font(.caption.weight(.bold))
                        .foregroundStyle(Color.textSecondary)
                }
                .contentShape(.rect)
            }
            .buttonStyle(PressScale())
            .accessibilityElement(children: .combine)

            Button(action: activate) {
                amount
                    .frame(maxWidth: .infinity, minHeight: 48, alignment: .trailing)
                    .padding(.bottom, 4)
                    .overlay(alignment: .bottom) {
                        Capsule()
                            .fill(isActive && !disabled ? Color.accentColor : Color.border)
                            .frame(height: isActive && !disabled ? 2 : 1)
                    }
                    .contentShape(.rect)
            }
            .buttonStyle(.plain)
            .disabled(disabled)
            .accessibilityLabel(Text("card.amountIn \(code)"))
            .accessibilityValue(Text(verbatim: text.isEmpty ? "0" : text))
            .accessibilityAddTraits(isActive ? .isSelected : [])
        }
        .animation(.easeOut(duration: 0.2), value: isActive)
    }

    @ViewBuilder
    private var amount: some View {
        if skeleton {
            Text(verbatim: "0 000.00")
                .font(.display(34))
                .shimmering()
        } else {
            HStack(spacing: 2) {
                Text(verbatim: text.isEmpty ? "0" : text)
                    .font(.display(34))
                    .foregroundStyle(text.isEmpty || disabled ? Color.textSecondary : Color.textPrimary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.35)
                    .contentTransition(.numericText())
                    .animation(.snappy(duration: 0.25), value: text)
                if isActive && !disabled {
                    Caret()
                }
            }
        }
    }

    private func activate() {
        guard !isActive else { return }
        let plain = text.filter { !$0.isWhitespace }
        model.setInput(AmountFormat.parse(plain) ?? "", side: side)
        ConverterFocus.shared.replaceNext = true
    }
}

private struct Caret: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var visible = true

    var body: some View {
        Capsule()
            .fill(Color.accentColor)
            .frame(width: 2.5, height: 34)
            .opacity(visible ? 1 : 0)
            .onAppear {
                guard !reduceMotion else { return }
                withAnimation(.easeInOut(duration: 0.55).repeatForever()) { visible = false }
            }
            .accessibilityHidden(true)
    }
}

// MARK: - Rate summary

private struct RateSummary: View {
    @Environment(AppModel.self) private var model
    let unavailable: Bool
    let skeleton: Bool
    @State private var showInfo = false

    private var exchange: ResolvedExchange? { model.exchange }

    private var tint: Color {
        guard let exchange, exchange.hasBankRates else { return .cross }
        return model.method == .sell ? .sell : .buy
    }

    var body: some View {
        HStack(spacing: 8) {
            if unavailable {
                Label { Text("card.unavailable") } icon: { Image(systemName: "exclamationmark.circle") }
                    .font(.subheadline)
                    .foregroundStyle(Color.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
            } else if let exchange, let line = RateLine(exchange: exchange, method: model.method) {
                Text(verbatim: line.text)
                    .font(.subheadline.weight(.semibold).monospacedDigit())
                    .lineLimit(1)
                    .minimumScaleFactor(0.7)
                    .contentTransition(.numericText())
                    .animation(.snappy, value: line.text)
                Spacer(minLength: 4)
                sourceButton(exchange, line: line)
            } else if skeleton {
                Text(verbatim: "1 USD = 00.0000 UAH").font(.subheadline).shimmering()
                Spacer()
            } else {
                Spacer()
            }
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 14)
        .frame(minHeight: 44)
        .background(unavailable ? Color.surfaceSecondary : tint, in: .rect(cornerRadius: 12))
        .animation(.easeInOut(duration: 0.3), value: model.method)
        .accessibilityElement(children: .contain)
    }

    private func sourceButton(_ exchange: ResolvedExchange, line: RateLine) -> some View {
        Button { showInfo = true } label: {
            HStack(spacing: 5) {
                SourceMark(source: exchange.source)
                Text(verbatim: exchange.source.label)
                    .font(.footnote)
                    .lineLimit(1)
                Image(systemName: "info.circle").font(.caption)
            }
            .foregroundStyle(.white.opacity(0.9))
            .contentShape(.rect)
        }
        .buttonStyle(PressScale())
        .popover(isPresented: $showInfo) {
            SourceInfo(exchange: exchange, line: line)
                .presentationCompactAdaptation(.popover)
        }
    }
}

private struct SourceInfo: View {
    let exchange: ResolvedExchange
    let line: RateLine

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 6) {
                SourceMark(source: exchange.source)
                Text(verbatim: exchange.source.label).font(.headline)
            }
            Text(exchange.source.descriptionKey)
                .font(.subheadline)
                .foregroundStyle(Color.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
            if exchange.source == .market, let date = exchange.date {
                Text(verbatim: "\(String(localized: "card.rateDate")): \(date)").font(.footnote)
            }
            if exchange.source == .bank, let nbu = line.nbuText {
                Text(verbatim: "\(String(localized: "card.nbuRate")): \(nbu)").font(.footnote)
            }
        }
        .padding(16)
        .frame(idealWidth: 280, maxWidth: 320, alignment: .leading)
    }
}

/// "1 USD = 45.41 UAH" rather than "1 UAH = 0.022 USD".
private struct RateLine {
    let text: String
    let nbuText: String?

    init?(exchange: ResolvedExchange, method: Method) {
        guard let rate = RateResolver.rate(for: exchange, method: method), rate > 0 else { return nil }
        let direct = rate >= 1
        let (base, quote) = direct ? (exchange.from, exchange.to) : (exchange.to, exchange.from)
        text = "1 \(base) = \(AmountFormat.rate(direct ? rate : 1 / rate)) \(quote)"
        nbuText = exchange.nbRate.flatMap { nbu in
            guard nbu > 0 else { return nil }
            return "1 \(base) = \(AmountFormat.rate(direct ? nbu : 1 / nbu)) \(quote)"
        }
    }
}

private extension ExchangeSource {
    var label: String {
        switch self {
        case .bank: "Monobank"
        case .bankCross: String(localized: "card.bankCross")
        case .nbu: String(localized: "card.official")
        case .market: String(localized: "card.market")
        }
    }

    var descriptionKey: LocalizedStringKey {
        switch self {
        case .bank, .bankCross: "providers.monoDescription"
        case .nbu: "providers.nbuDescription"
        case .market: "providers.marketDescription"
        }
    }
}

// MARK: - Helpers

private struct PressScale: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.9 : 1)
            .animation(.spring(duration: 0.25, bounce: 0.4), value: configuration.isPressed)
    }
}
