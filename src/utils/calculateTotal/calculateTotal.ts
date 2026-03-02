export function calculateTotalAmount(amounts: string): number {
    if (!amounts.trim()) return 0;

    return amounts
      .split(/[\n,]+/)
      .map((amt) => amt.trim())
      .filter((amt) => amt.length > 0)
      .reduce((sum, amt) => {
        const num = Number(amt);
        if (isNaN(num)) throw new Error(`Invalid amount: "${amt}"`);
        if (num < 0) throw new Error(`Negative amounts are not allowed: ${amt}`);
        return sum + num;
      }, 0);
}
