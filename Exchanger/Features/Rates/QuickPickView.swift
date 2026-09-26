import SwiftUI

/// Usage-ranked currency chips; tap sets the "from" currency.
struct QuickPickView: View {
    @Environment(AppModel.self) private var model
    /// Displayed order. Re-ranked only when a code that isn't shown yet enters the ranking,
    /// so chips never jump around under the finger (same as the web).
    @State private var codes: [String] = []
    @State private var taps = 0

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("quickPick.title")
                .font(.display(17))
                .foregroundStyle(Color.textPrimary)
                .accessibilityAddTraits(.isHeader)

            ScrollView(.horizontal) {
                HStack(spacing: 8) {
                    ForEach(codes, id: \.self) { chip($0) }
                }
            }
            .scrollIndicators(.hidden)
            .contentMargins(.horizontal, 16, for: .scrollContent)
            .padding(.horizontal, -16)

            Text("quickPick.hint \(model.options.count)")
                .font(.footnote)
                .foregroundStyle(Color.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .onChange(of: model.quickPick, initial: true) { _, ranked in
            if ranked.contains(where: { !codes.contains($0) }) { codes = ranked }
        }
        .sensoryFeedback(.selection, trigger: taps)
    }

    private func chip(_ code: String) -> some View {
        let active = model.pair.from == code
        return Button {
            taps += 1
            model.setCurrency(code, side: .from)
        } label: {
            HStack(spacing: 6) {
                CurrencyIcon(code: code, size: 20)
                Text(verbatim: code).font(.subheadline.weight(.semibold))
            }
            .foregroundStyle(Color.textPrimary)
            .padding(.leading, 6)
            .padding(.trailing, 12)
            .padding(.vertical, 6)
            .background(active ? Color.accentSoft : Color.surface, in: .capsule)
            .overlay(Capsule().stroke(active ? Color.accentColor : Color.border))
            .contentShape(.capsule)
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(active ? .isSelected : [])
        .animation(.snappy, value: active)
    }
}
