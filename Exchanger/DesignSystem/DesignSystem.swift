import SwiftUI

// Colors: use generated asset symbols, e.g. `Color.pageBackground`, `.surface`, `.textSecondary`, `.buy`.
// Raw colors below are decorative art (badges, metals, shadow) that has no semantic asset.

extension Font {
    /// Display font (Unbounded SemiBold) for titles and big amounts. Scales with Dynamic Type.
    static func display(_ size: CGFloat, relativeTo style: Font.TextStyle? = nil) -> Font {
        .custom("Unbounded-SemiBold", size: size, relativeTo: style ?? .closest(to: size))
    }
}

extension Font.TextStyle {
    /// Text style whose default size is nearest to `size`, so custom sizes scale like system text.
    static func closest(to size: CGFloat) -> Font.TextStyle {
        switch size {
        case 30...: .largeTitle
        case 24..<30: .title
        case 21..<24: .title2
        case 19..<21: .title3
        case 16..<19: .body
        case 14..<16: .subheadline
        case 12.5..<14: .footnote
        default: .caption
        }
    }
}

// MARK: - Card

private struct CardModifier: ViewModifier {
    @Environment(\.colorScheme) private var colorScheme

    func body(content: Content) -> some View {
        let shape = RoundedRectangle(cornerRadius: 20, style: .continuous)
        content
            .padding(16)
            .background(Color.surface, in: shape)
            .overlay(shape.strokeBorder(Color.border, lineWidth: 1))
            // Web: 0 5px 10px rgba(116,79,79,.12).
            .shadow(color: colorScheme == .dark ? .black.opacity(0.25) : Color(red: 116 / 255, green: 79 / 255, blue: 79 / 255).opacity(0.12),
                    radius: 5, y: colorScheme == .dark ? 2 : 5)
    }
}

extension View {
    /// Rounded surface card with border and soft shadow.
    func card() -> some View {
        modifier(CardModifier())
    }

    /// Loading placeholder: redacted content with a moving highlight (static under Reduce Motion).
    func shimmering(_ active: Bool = true) -> some View {
        modifier(Shimmer(active: active))
    }
}

// MARK: - Shimmer

private struct Shimmer: ViewModifier {
    let active: Bool
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private static let period: TimeInterval = 1.4

    func body(content: Content) -> some View {
        let animating = active && !reduceMotion
        TimelineView(.animation(paused: !animating)) { context in
            let phase = animating ? context.date.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: Self.period) / Self.period : 0
            content
                .redacted(reason: active ? .placeholder : [])
                .mask {
                    // Band sweeps from off-screen left (-0.5) to off-screen right (1.5).
                    let dim = animating ? 0.45 : 1
                    LinearGradient(
                        stops: [
                            .init(color: .black.opacity(dim), location: 0.3),
                            .init(color: .black, location: 0.5),
                            .init(color: .black.opacity(dim), location: 0.7),
                        ],
                        startPoint: UnitPoint(x: phase * 2 - 1, y: 0.5),
                        endPoint: UnitPoint(x: phase * 2, y: 0.5)
                    )
                }
        }
        .accessibilityElement(children: active ? .ignore : .contain)
    }
}

// MARK: - Buttons

/// Scales down with a spring while pressed.
struct PressableButtonStyle: ButtonStyle {
    var scale: CGFloat = 0.96

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? scale : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.6), value: configuration.isPressed)
    }
}

extension ButtonStyle where Self == PressableButtonStyle {
    static var pressable: PressableButtonStyle { PressableButtonStyle() }
}

// MARK: - Currency icon

/// Flag (fiat), coin (crypto), metal badge or a letter badge fallback.
struct CurrencyIcon: View {
    let code: String
    var size: CGFloat = 32

    @Environment(\.displayScale) private var displayScale

    var body: some View {
        content
            .frame(width: size, height: size)
            .clipShape(Circle())
            .overlay(Circle().strokeBorder(Color.border, lineWidth: 1 / displayScale))
            .accessibilityHidden(true)
    }

    @ViewBuilder private var content: some View {
        let key = code.lowercased()
        if let image = UIImage(named: "flag-\(key)") ?? UIImage(named: "coin-\(key)") {
            Image(uiImage: image).resizable().scaledToFill()
        } else if let metal = Self.metals[code.uppercased()] {
            Circle()
                .fill(LinearGradient(colors: metal.colors, startPoint: .topLeading, endPoint: .bottomTrailing))
                .overlay(badgeText(metal.symbol, color: metal.ink))
        } else {
            let tint = Self.palette[Self.stableHash(code) % Self.palette.count]
            Circle()
                .fill(tint.opacity(0.16))
                .overlay(badgeText(String(code.uppercased().prefix(3)), color: tint))
        }
    }

    private func badgeText(_ text: String, color: Color) -> some View {
        Text(verbatim: text)
            .font(.system(size: size * (text.count > 2 ? 0.3 : 0.38), weight: .bold, design: .rounded))
            .foregroundStyle(color)
            .minimumScaleFactor(0.5)
            .lineLimit(1)
            .padding(size * 0.08)
    }

    /// Deterministic across launches (unlike `hashValue`).
    static func stableHash(_ code: String) -> Int {
        code.uppercased().unicodeScalars.reduce(5381) { ($0 &* 33 &+ Int($1.value)) & 0x7fff_ffff }
    }

    static let palette: [Color] = [
        Color(red: 0.16, green: 0.36, blue: 1.00), // brand blue
        Color(red: 0.00, green: 0.62, blue: 0.29), // green
        Color(red: 0.93, green: 0.42, blue: 0.00), // orange
        Color(red: 0.55, green: 0.27, blue: 0.94), // violet
        Color(red: 0.86, green: 0.15, blue: 0.42), // pink
        Color(red: 0.00, green: 0.58, blue: 0.64), // teal
    ]

    private struct Metal {
        let symbol: String
        let colors: [Color]
        let ink: Color
    }

    private static let metals: [String: Metal] = [
        "XAU": Metal(symbol: "Au", colors: [Color(red: 1.00, green: 0.87, blue: 0.45), Color(red: 0.85, green: 0.62, blue: 0.13)], ink: Color(red: 0.42, green: 0.28, blue: 0.00)),
        "XAG": Metal(symbol: "Ag", colors: [Color(red: 0.95, green: 0.96, blue: 0.97), Color(red: 0.66, green: 0.69, blue: 0.73)], ink: Color(red: 0.25, green: 0.28, blue: 0.32)),
        "XPT": Metal(symbol: "Pt", colors: [Color(red: 0.90, green: 0.93, blue: 0.96), Color(red: 0.55, green: 0.62, blue: 0.70)], ink: Color(red: 0.18, green: 0.24, blue: 0.32)),
        "XPD": Metal(symbol: "Pd", colors: [Color(red: 0.93, green: 0.91, blue: 0.88), Color(red: 0.64, green: 0.60, blue: 0.56)], ink: Color(red: 0.30, green: 0.26, blue: 0.22)),
    ]
}

// MARK: - Source mark

/// Small mark of where a rate comes from: "m" (Monobank), "NBU", globe (market).
struct SourceMark: View {
    let source: ExchangeSource

    @ScaledMetric(relativeTo: .caption) private var side: CGFloat = 18

    var body: some View {
        switch source {
        case .bank, .bankCross:
            Text(verbatim: "m")
                .font(.system(size: side * 0.72, weight: .heavy, design: .rounded))
                .foregroundStyle(.white)
                .frame(width: side, height: side)
                .background(.black, in: .rect(cornerRadius: side * 0.28, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: side * 0.28, style: .continuous).strokeBorder(Color.border, lineWidth: 0.5))
                .accessibilityLabel(Text(verbatim: "Monobank"))
        case .nbu:
            Text("providers.nbuName")
                .font(.system(size: side * 0.55, weight: .bold, design: .rounded))
                .foregroundStyle(Color.textPrimary)
                .padding(.horizontal, side * 0.25)
                .frame(minWidth: side, minHeight: side)
                .background(Color.surfaceSecondary, in: .rect(cornerRadius: side * 0.28, style: .continuous))
        case .market:
            Image(systemName: "globe")
                .font(.system(size: side * 0.8, weight: .medium))
                .foregroundStyle(Color.brand)
                .frame(width: side, height: side)
                .accessibilityLabel(Text("providers.marketName"))
        }
    }
}
