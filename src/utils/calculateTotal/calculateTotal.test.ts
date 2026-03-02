import { calculateTotalAmount } from "./calculateTotal";

describe("calculateTotalAmount", () => {
    it("returns 0 for empty string", () => {
        expect(calculateTotalAmount("")).toBe(0);
    });

    it("returns 0 for whitespace-only string", () => {
        expect(calculateTotalAmount("   ")).toBe(0);
    });

    it("returns correct sum for comma-separated values", () => {
        expect(calculateTotalAmount("100, 200, 300")).toBe(600);
    });

    it("returns correct sum for newline-separated values", () => {
        expect(calculateTotalAmount("100\n200\n300")).toBe(600);
    });

    it("returns correct sum for mixed separators", () => {
        expect(calculateTotalAmount("100, 200\n300")).toBe(600);
    });

    it("handles multiple commas in a row", () => {
        expect(calculateTotalAmount("100,,200")).toBe(300);
    });

    it("handles multiple newlines in a row", () => {
        expect(calculateTotalAmount("100\n\n200")).toBe(300);
    });

    it("throws an error for non-numeric values", () => {
        expect(() => calculateTotalAmount("100, abc, 200")).toThrow('Invalid amount: "abc"');
    });

    it("throws an error for partially numeric values", () => {
        expect(() => calculateTotalAmount("74four, 74")).toThrow('Invalid amount: "74four"');
    });

    it("returns correct sum for a single value", () => {
        expect(calculateTotalAmount("42")).toBe(42);
    });

    it("handles large numbers", () => {
        expect(calculateTotalAmount("1000000000, 2000000000")).toBe(3000000000);
    });

    it("throws an error for negative numbers", () => {
        expect(() => calculateTotalAmount("-100, 200")).toThrow("Negative amounts are not allowed: -100");
    });

    it("handles floating point numbers", () => {
        expect(calculateTotalAmount("1.5, 2.5")).toBe(4);
    });

    it("throws an error when all values are non-numeric", () => {
        expect(() => calculateTotalAmount("abc, def")).toThrow('Invalid amount: "abc"');
    });

    it("handles values with surrounding spaces", () => {
        expect(calculateTotalAmount("  100  ,  200  ")).toBe(300);
    });

    it("handles zero values", () => {
        expect(calculateTotalAmount("0, 100")).toBe(100);
    });
});
