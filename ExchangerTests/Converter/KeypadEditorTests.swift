import Testing
@testable import Exchanger

struct KeypadEditorTests {
    @Test func digits() {
        #expect(KeypadEditor.apply(.digit(5), to: "12") == "125")
        #expect(KeypadEditor.apply(.digit(5), to: "0") == "5")
        #expect(KeypadEditor.apply(.digit(0), to: "") == "0")
        #expect(KeypadEditor.apply(.digit(7), to: "0.") == "0.7")
        #expect(KeypadEditor.apply(.digit(3), to: "45 000", replacing: true) == "3")
    }

    @Test func decimal() {
        #expect(KeypadEditor.apply(.decimal, to: "") == "0.")
        #expect(KeypadEditor.apply(.decimal, to: "12") == "12.")
        #expect(KeypadEditor.apply(.decimal, to: "1.5") == nil)
        #expect(KeypadEditor.apply(.decimal, to: "1.5", replacing: true) == "0.")
    }

    @Test func backspace() {
        #expect(KeypadEditor.apply(.backspace, to: "12") == "1")
        #expect(KeypadEditor.apply(.backspace, to: "") == "")
    }
}
