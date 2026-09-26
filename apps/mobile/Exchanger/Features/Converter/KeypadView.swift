import SwiftUI

nonisolated enum KeypadKey: Hashable, Sendable {
    case digit(Int), decimal, backspace
}

/// Pure text editing for the keypad. The result still goes through `AmountFormat.parse`.
nonisolated enum KeypadEditor {
    /// `replacing`: the current text is "selected" (fresh row), so a typed key starts over.
    static func apply(_ key: KeypadKey, to text: String, replacing: Bool = false) -> String? {
        let text = replacing ? "" : text
        switch key {
        case .digit(let d):
            return text == "0" ? "\(d)" : text + "\(d)"
        case .decimal:
            if text.contains(".") { return nil }
            return text.isEmpty ? "0." : text + "."
        case .backspace:
            return String(text.dropLast())
        }
    }
}

/// Shared between the card and the keypad (they sit in different parts of RootView).
@Observable
final class ConverterFocus {
    static let shared = ConverterFocus()
    /// The active amount was just focused: the next key replaces it, like a selected web input.
    var replaceNext = true
}

/// Custom numeric keypad pinned to the bottom of the screen.
struct KeypadView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.verticalSizeClass) private var verticalSizeClass
    private let focus = ConverterFocus.shared

    @State private var taps = 0
    @State private var rejects = 0
    @State private var clears = 0
    @State private var longPressed = false

    private var disabled: Bool { model.exchange == nil }

    private let rows: [[KeypadKey]] = [
        [.digit(1), .digit(2), .digit(3)],
        [.digit(4), .digit(5), .digit(6)],
        [.digit(7), .digit(8), .digit(9)],
        [.decimal, .digit(0), .backspace],
    ]

    var body: some View {
        Grid(horizontalSpacing: 8, verticalSpacing: 8) {
            ForEach(rows, id: \.self) { row in
                GridRow {
                    ForEach(row, id: \.self) { key($0) }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 10)
        .padding(.bottom, 6)
        .background(.bar)
        .overlay(alignment: .top) { Divider() }
        .disabled(disabled)
        .opacity(disabled ? 0.45 : 1)
        .animation(.easeInOut(duration: 0.2), value: disabled)
        .sensoryFeedback(.impact(weight: .light), trigger: taps)
        .sensoryFeedback(.warning, trigger: rejects)
        .sensoryFeedback(.impact(weight: .heavy), trigger: clears)
    }

    @ViewBuilder
    private func key(_ key: KeypadKey) -> some View {
        let button = Button {
            if key == .backspace && longPressed {
                longPressed = false
                return
            }
            press(key)
        } label: {
            label(key)
                .frame(maxWidth: .infinity, minHeight: verticalSizeClass == .compact ? 36 : 48)
                .contentShape(.rect)
        }
        .buttonStyle(KeyStyle(secondary: key == .backspace || key == .decimal))
        .accessibilityLabel(accessibilityLabel(key))

        if key == .backspace {
            button
                .simultaneousGesture(LongPressGesture(minimumDuration: 0.45).onEnded { _ in
                    longPressed = true
                    clear()
                })
                .accessibilityAction(named: Text("keypad.clear", tableName: "Converter")) { clear() }
        } else {
            button
        }
    }

    @ViewBuilder
    private func label(_ key: KeypadKey) -> some View {
        switch key {
        case .digit(let d): Text("\(d)").font(.display(26))
        case .decimal: Text(verbatim: ".").font(.display(26))
        case .backspace: Image(systemName: "delete.left").font(.system(size: 22, weight: .medium))
        }
    }

    private func accessibilityLabel(_ key: KeypadKey) -> Text {
        switch key {
        case .digit(let d): Text(verbatim: "\(d)")
        case .decimal: Text("keypad.decimal", tableName: "Converter")
        case .backspace: Text("keypad.delete", tableName: "Converter")
        }
    }

    private func press(_ key: KeypadKey) {
        guard let raw = KeypadEditor.apply(key, to: model.input, replacing: focus.replaceNext && key != .backspace),
              let text = AmountFormat.parse(raw)
        else {
            rejects += 1
            return
        }
        focus.replaceNext = false
        taps += 1
        model.setInput(text, side: model.activeSide)
    }

    private func clear() {
        focus.replaceNext = false
        clears += 1
        model.setInput("", side: model.activeSide)
    }
}

private struct KeyStyle: ButtonStyle {
    var secondary: Bool

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(Color.textPrimary)
            .background(
                configuration.isPressed ? Color.surfaceHover : (secondary ? Color.surfaceSecondary : Color.surface),
                in: .rect(cornerRadius: 14)
            )
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.border.opacity(0.6)))
            .scaleEffect(configuration.isPressed ? 0.94 : 1)
            .animation(.spring(duration: 0.25, bounce: 0.4), value: configuration.isPressed)
    }
}
