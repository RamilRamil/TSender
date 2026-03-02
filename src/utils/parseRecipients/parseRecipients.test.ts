import { parseRecipients } from "./parseRecipients";

const ADDR_1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const ADDR_2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const ADDR_3 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

describe("parseRecipients", () => {
    it("returns empty array for empty string", () => {
        expect(parseRecipients("")).toEqual([]);
    });

    it("returns empty array for whitespace-only string", () => {
        expect(parseRecipients("   ")).toEqual([]);
    });

    it("parses single address", () => {
        expect(parseRecipients(ADDR_1)).toEqual([ADDR_1]);
    });

    it("parses comma-separated addresses", () => {
        expect(parseRecipients(`${ADDR_1}, ${ADDR_2}`)).toEqual([ADDR_1, ADDR_2]);
    });

    it("parses newline-separated addresses", () => {
        expect(parseRecipients(`${ADDR_1}\n${ADDR_2}`)).toEqual([ADDR_1, ADDR_2]);
    });

    it("parses mixed separators", () => {
        expect(parseRecipients(`${ADDR_1}, ${ADDR_2}\n${ADDR_3}`)).toEqual([ADDR_1, ADDR_2, ADDR_3]);
    });

    it("handles addresses with surrounding spaces", () => {
        expect(parseRecipients(`  ${ADDR_1}  ,  ${ADDR_2}  `)).toEqual([ADDR_1, ADDR_2]);
    });

    it("handles multiple separators in a row", () => {
        expect(parseRecipients(`${ADDR_1},,${ADDR_2}`)).toEqual([ADDR_1, ADDR_2]);
    });

    it("throws for invalid address (too short)", () => {
        expect(() => parseRecipients("0x1234")).toThrow('Invalid recipient address: "0x1234"');
    });

    it("throws for address without 0x prefix", () => {
        expect(() => parseRecipients("f39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).toThrow("Invalid recipient address");
    });

    it("throws for non-hex characters in address", () => {
        expect(() => parseRecipients("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")).toThrow("Invalid recipient address");
    });

    it("throws if any one address in the list is invalid", () => {
        expect(() => parseRecipients(`${ADDR_1}, invalid`)).toThrow("Invalid recipient address");
    });
});
