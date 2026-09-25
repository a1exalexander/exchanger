import SwiftUI

// Unit 7 (Converter + keypad) owns this folder.

/// Main converter card: from/to amounts, swap, buy/sell, rate summary.
struct ConverterView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach([Side.from, .to]) { side in
                HStack {
                    Button(side == .from ? model.pair.from : model.pair.to) { model.pickerSide = side }
                    Spacer()
                    Text(model.amountText(for: side)).font(.display(28))
                }
            }
            Button("card.swap") { model.swap() }
        }
        .card()
    }
}

/// Custom numeric keypad pinned to the bottom of the screen.
struct KeypadView: View {
    var body: some View {
        EmptyView()
    }
}
