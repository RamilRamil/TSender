export function parseRecipients(recipients: string): `0x${string}`[] {
    if (!recipients.trim()) return [];

    return recipients
        .split(/[\n,]+/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0)
        .map((r) => {
            if (!/^0x[0-9a-fA-F]{40}$/.test(r)) {
                throw new Error(`Invalid recipient address: "${r}"`);
            }
            return r as `0x${string}`;
        });
}
