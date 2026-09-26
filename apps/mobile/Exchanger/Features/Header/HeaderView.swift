import SwiftUI

/// Logo + "Exchanger" title and the settings button, floating over the top of the scroll view.
/// Collapses to a small logo on a bar once the content scrolls.
struct HeaderView: View {
    static let expandedHeight: CGFloat = 52
    static let collapsedHeight: CGFloat = 30

    let collapsed: Bool
    let onSettings: () -> Void

    var body: some View {
        ZStack {
            HStack(spacing: 8) {
                AppLogo(size: collapsed ? 16 : 26)
                if !collapsed {
                    Text(verbatim: "Exchanger")
                        .font(.display(20))
                        .foregroundStyle(Color.textPrimary)
                        .transition(.scale(scale: 0.6, anchor: .leading).combined(with: .opacity))
                }
            }
            .accessibilityElement(children: .combine)
            .accessibilityAddTraits(.isHeader)

            if !collapsed {
                Button(action: onSettings) {
                    Image(systemName: "gearshape")
                        .font(.system(size: 17, weight: .medium))
                        .foregroundStyle(Color.textPrimary)
                        .frame(width: 36, height: 36)
                        .background(Color.surface, in: .circle)
                        .overlay(Circle().strokeBorder(Color.border))
                        .contentShape(.circle)
                }
                .buttonStyle(.pressable)
                .accessibilityLabel(Text("settings.title"))
                .frame(maxWidth: .infinity, alignment: .trailing)
                .transition(.scale(scale: 0.5).combined(with: .opacity))
            }
        }
        .padding(.horizontal, 16)
        .frame(maxWidth: .infinity)
        .frame(height: collapsed ? Self.collapsedHeight : Self.expandedHeight)
        .background {
            if collapsed {
                Rectangle()
                    .fill(.bar)
                    .overlay(alignment: .bottom) { Divider() }
                    .ignoresSafeArea(edges: .top)
                    .transition(.opacity)
            }
        }
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
