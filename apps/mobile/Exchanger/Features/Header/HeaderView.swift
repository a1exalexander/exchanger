import SwiftUI

/// Logo + "Exchanger" title, shown in the navigation bar.
struct HeaderView: View {
    var body: some View {
        HStack(spacing: 8) {
            AppLogo(size: 26)
            Text(verbatim: "Exchanger")
                .font(.display(20))
                .foregroundStyle(Color.textPrimary)
        }
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isHeader)
    }
}

/// Port of the web `AppLogo` SVG: gradient tile with two opposite arrows (32×32 viewBox).
struct AppLogo: View {
    var size: CGFloat = 32

    var body: some View {
        RoundedRectangle(cornerRadius: size * 10 / 32, style: .continuous)
            .fill(Color.brand.gradient)
            .overlay {
                Arrows().stroke(.white, style: StrokeStyle(lineWidth: size * 2.75 / 32, lineCap: .round, lineJoin: .round))
            }
            .frame(width: size, height: size)
            .accessibilityHidden(true)
    }

    nonisolated private struct Arrows: Shape {
        func path(in rect: CGRect) -> Path {
            let s = rect.width / 32
            func p(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: x * s, y: y * s) }
            var path = Path()
            path.addLines([p(8.5, 13), p(23.5, 13), p(18.5, 8)])
            path.addLines([p(23.5, 19), p(8.5, 19), p(13.5, 24)])
            return path
        }
    }
}
