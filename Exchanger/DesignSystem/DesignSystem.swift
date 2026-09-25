import SwiftUI

// Unit 5 (Design system + assets) owns this folder.
// Colors: use generated asset symbols, e.g. `Color.pageBackground`, `.surface`, `.textSecondary`, `.buy`.

extension Font {
    /// Display font (Unbounded SemiBold) for titles and big amounts.
    static func display(_ size: CGFloat) -> Font {
        .system(size: size, weight: .semibold, design: .rounded)
    }
}

extension View {
    /// Rounded surface card with border and soft shadow.
    func card() -> some View {
        padding(16)
            .background(Color.surface, in: .rect(cornerRadius: 20))
            .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color.border))
    }

    /// Loading placeholder shimmer.
    func shimmering(_ active: Bool = true) -> some View {
        redacted(reason: active ? .placeholder : [])
    }
}

/// Flag (fiat), coin (crypto) or a letter badge fallback.
struct CurrencyIcon: View {
    let code: String
    var size: CGFloat = 32

    var body: some View {
        Circle()
            .fill(Color.surfaceSecondary)
            .overlay(Text(code.prefix(3)).font(.system(size: size * 0.3, weight: .bold)).foregroundStyle(Color.textSecondary))
            .frame(width: size, height: size)
    }
}

/// Small mark of where a rate comes from: "m", "NBU", globe.
struct SourceMark: View {
    let source: ExchangeSource

    var body: some View {
        Text(source.rawValue).font(.caption2)
    }
}
