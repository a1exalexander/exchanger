import SwiftUI

// Unit 8 (Currency picker sheet) owns this folder.

/// Presented by RootView when `model.pickerSide` is set.
struct CurrencyPickerSheet: View {
    let side: Side
    @Environment(AppModel.self) private var model
    @Environment(\.dismiss) private var dismiss
    @State private var query = Self.initialQuery
    @State private var picked: String?

    private var current: String { side == .from ? model.pair.from : model.pair.to }
    private var other: String { side == .from ? model.pair.to : model.pair.from }

    var body: some View {
        let options = model.options
        let banks = model.bank?.currencies ?? []
        let searching = !query.trimmingCharacters(in: .whitespaces).isEmpty
        let results = searching ? CurrencySearch.search(query, in: options) : []
        NavigationStack {
            ScrollViewReader { proxy in
                List {
                    if !searching {
                        ForEach(sections(options), id: \.id) { section in
                            Section(section.title) {
                                ForEach(section.items) { row($0, banks: banks, scrollID: section.isMain ? $0.code : "\(section.id)#\($0.code)") }
                            }
                        }
                    } else if !results.isEmpty {
                        Section("picker.results") {
                            ForEach(results) { row($0, banks: banks, scrollID: $0.code) }
                        }
                    }
                }
                .listStyle(.insetGrouped)
                .scrollContentBackground(.hidden)
                .background(Color.pageBackground)
                .overlay {
                    if searching, results.isEmpty {
                        ContentUnavailableView("picker.empty \(query)", systemImage: "magnifyingglass")
                    }
                }
                .onAppear { proxy.scrollTo(current, anchor: .center) }
            }
            .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always), prompt: Text("picker.placeholder"))
            .autocorrectionDisabled()
            .navigationTitle(side == .from ? "select.from" : "select.to")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("picker.close", systemImage: "xmark") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .sensoryFeedback(.selection, trigger: picked)
    }

    private struct PickerSection {
        let id: String
        let items: [CurrencyOption]
        var title: LocalizedStringKey { LocalizedStringKey(id) }
        /// Recent/Popular repeat codes from the kind sections; scroll anchors live on the kind rows.
        var isMain: Bool { !["picker.recent", "picker.popular"].contains(id) }
    }

    private func sections(_ options: [CurrencyOption]) -> [PickerSection] {
        let byCode = Dictionary(options.map { ($0.code, $0) }, uniquingKeysWith: { a, _ in a })
        let recent = model.recent.prefix(4).compactMap { byCode[$0] }
        let popular = CurrencyCatalog.popular.compactMap { byCode[$0] }
        func of(_ kind: CurrencyKind) -> [CurrencyOption] { options.filter { $0.kind == kind } }
        return [
            PickerSection(id: "picker.recent", items: recent),
            PickerSection(id: "picker.popular", items: popular),
            PickerSection(id: "picker.all", items: of(.fiat)),
            PickerSection(id: "picker.crypto", items: of(.crypto)),
            PickerSection(id: "picker.metals", items: of(.metal)),
        ].filter { !$0.items.isEmpty }
    }

    @ViewBuilder
    private func row(_ option: CurrencyOption, banks: [Exchange], scrollID: String) -> some View {
        let selected = option.code == current
        let isSwap = option.code == other
        let mono = CurrencyCatalog.hasBankRates(option.code, against: other, bank: banks)
        Button {
            picked = option.code
            model.setCurrency(option.code, side: side)
            dismiss()
        } label: {
            HStack(spacing: 12) {
                CurrencyIcon(code: option.code, size: 36)
                VStack(alignment: .leading, spacing: 2) {
                    Text(option.code)
                        .font(.body.weight(.semibold))
                        .foregroundStyle(Color.textPrimary)
                    Text(option.name)
                        .font(.subheadline)
                        .foregroundStyle(Color.textSecondary)
                        .lineLimit(1)
                }
                Spacer(minLength: 8)
                if mono { Tag(text: Text(verbatim: "mono")) }
                if isSwap { Tag(text: Text("picker.swapTag")) }
                if selected {
                    Image(systemName: "checkmark")
                        .font(.body.weight(.semibold))
                        .foregroundStyle(Color.accentColor)
                }
            }
            .contentShape(.rect)
        }
        .buttonStyle(.plain)
        .listRowBackground(selected ? Color.accentSoft : Color.surface)
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(selected ? .isSelected : [])
        .accessibilityHint(isSwap ? Text("picker.swapTagTitle") : mono ? Text("picker.bankTag") : Text(verbatim: ""))
        .id(scrollID)
    }

    private static var initialQuery: String {
        #if DEBUG
        UserDefaults.standard.string(forKey: "debugQuery") ?? ""
        #else
        ""
        #endif
    }
}

private struct Tag: View {
    let text: Text

    var body: some View {
        text
            .font(.caption2.weight(.semibold))
            .foregroundStyle(Color.textSecondary)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(Color.surfaceSecondary, in: .capsule)
    }
}
