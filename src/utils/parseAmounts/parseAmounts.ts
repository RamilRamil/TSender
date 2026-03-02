function humanToWei(amount: string, decimals: number): bigint {
    const trimmed = amount.trim();
    if (!trimmed) return BigInt(0);

    if (!/^\d+(\.\d+)?$/.test(trimmed)) {
        throw new Error(`Invalid amount: "${amount}"`);
    }

    const parts = trimmed.split(".");
    const integerPart = parts[0] || "0";
    const fractionalPart = parts[1] || "";

    if (integerPart.startsWith("-") || trimmed.startsWith("-")) {
        throw new Error(`Negative amounts are not allowed: "${amount}"`);
    }

    const integer = BigInt(integerPart);
    const fractionalLen = fractionalPart.length;

    if (fractionalLen > decimals) {
        throw new Error(`Amount "${amount}" has more decimal places than token (${decimals})`);
    }

    const fractional = fractionalPart ? BigInt(fractionalPart) : BigInt(0);
    const scale = BigInt(10) ** BigInt(decimals - fractionalLen);

    const result = integer * (BigInt(10) ** BigInt(decimals)) + fractional * scale;
    if (result < BigInt(0)) {
        throw new Error(`Negative amounts are not allowed: "${amount}"`);
    }
    return result;
}

export function parseAmounts(amounts: string, decimals: number = 18): bigint[] {
    if (!amounts.trim()) return [];

    return amounts
        .split(/[\n,]+/)
        .map((a) => a.trim())
        .filter((a) => a.length > 0)
        .map((a) => humanToWei(a, decimals));
}
