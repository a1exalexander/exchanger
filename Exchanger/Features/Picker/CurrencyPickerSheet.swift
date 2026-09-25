import SwiftUI

// Unit 8 (Currency picker sheet) owns this folder.

/// Presented by RootView when `model.pickerSide` is set.
struct CurrencyPickerSheet: View {
    let side: Side
    @Environment(AppModel.self) private var model
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(model.options) { option in
                Button(option.code) {
                    model.setCurrency(option.code, side: side)
                    dismiss()
                }
            }
            .navigationTitle(side == .from ? "select.from" : "select.to")
        }
    }
}
