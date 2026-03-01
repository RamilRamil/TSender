export function calculateTotalAmount(amounts: string): number {
    if (!amounts.trim()) return 0;

    return amounts
      .split(/[\n,]+/)
      .map((amt) => amt.trim())
      .filter((amt) => amt.length > 0)
      .reduce((sum, amt) => {
        const num = Number(amt);
        return isNaN(num) ? sum : sum + num;
      }, 0);
}
