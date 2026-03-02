import { parseAmounts } from "./parseAmounts";

const DECIMALS = 18;

describe("parseAmounts", () => {
    it("returns empty array for empty string", () => {
        expect(parseAmounts("", DECIMALS)).toEqual([]);
    });

    it("returns empty array for whitespace-only string", () => {
        expect(parseAmounts("   ", DECIMALS)).toEqual([]);
    });

    it("parses single amount (human)", () => {
        expect(parseAmounts("1", DECIMALS)).toEqual([BigInt("1000000000000000000")]);
    });

    it("parses comma-separated amounts (human)", () => {
        expect(parseAmounts("1, 2, 3", DECIMALS)).toEqual([
            BigInt("1000000000000000000"),
            BigInt("2000000000000000000"),
            BigInt("3000000000000000000"),
        ]);
    });

    it("parses newline-separated amounts", () => {
        expect(parseAmounts("1\n2\n3", DECIMALS)).toEqual([
            BigInt("1000000000000000000"),
            BigInt("2000000000000000000"),
            BigInt("3000000000000000000"),
        ]);
    });

    it("parses mixed separators", () => {
        expect(parseAmounts("1, 2\n3", DECIMALS)).toEqual([
            BigInt("1000000000000000000"),
            BigInt("2000000000000000000"),
            BigInt("3000000000000000000"),
        ]);
    });

    it("handles amounts with surrounding spaces", () => {
        expect(parseAmounts("  1  ,  2  ", DECIMALS)).toEqual([
            BigInt("1000000000000000000"),
            BigInt("2000000000000000000"),
        ]);
    });

    it("handles multiple separators in a row", () => {
        expect(parseAmounts("1,,2", DECIMALS)).toEqual([
            BigInt("1000000000000000000"),
            BigInt("2000000000000000000"),
        ]);
    });

    it("handles zero", () => {
        expect(parseAmounts("0, 1", DECIMALS)).toEqual([BigInt(0), BigInt("1000000000000000000")]);
    });

    it("handles decimal amounts", () => {
        expect(parseAmounts("1.5", DECIMALS)).toEqual([BigInt("1500000000000000000")]);
    });

    it("handles multiple decimal amounts", () => {
        expect(parseAmounts("1.5, 2.5, 0.1", DECIMALS)).toEqual([
            BigInt("1500000000000000000"),
            BigInt("2500000000000000000"),
            BigInt("100000000000000000"),
        ]);
    });

    it("uses default decimals 18 when not provided", () => {
        expect(parseAmounts("1")).toEqual([BigInt("1000000000000000000")]);
    });

    it("throws for non-numeric value", () => {
        expect(() => parseAmounts("1, abc", DECIMALS)).toThrow('Invalid amount: "abc"');
    });

    it("throws for partially numeric value", () => {
        expect(() => parseAmounts("74four", DECIMALS)).toThrow('Invalid amount: "74four"');
    });

    it("throws for negative amount", () => {
        expect(() => parseAmounts("-1", DECIMALS)).toThrow('Invalid amount: "-1"');
    });

    it("throws for too many decimal places", () => {
        expect(() => parseAmounts("1.1234567890123456789", DECIMALS)).toThrow(
            /has more decimal places than token/
        );
    });
});
