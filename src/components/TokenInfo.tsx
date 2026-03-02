"use client";

import { useReadContract } from "wagmi";
import { erc20Abi } from "../constants";

interface TokenInfoProps {
    tokenAddress: `0x${string}`;
    userAddress: `0x${string}` | undefined;
}

export default function TokenInfo({ tokenAddress, userAddress }: TokenInfoProps) {
    const { data: name } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "name",
    });

    const { data: symbol } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
    });

    const { data: decimals } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
    });

    const { data: balance } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: userAddress ? [userAddress] : undefined,
        query: { enabled: !!userAddress },
    });

    const rows: { label: string; value: string }[] = [
        { label: "Name", value: name != null ? String(name) : "—" },
        { label: "Symbol", value: symbol != null ? String(symbol) : "—" },
        { label: "Decimals", value: decimals != null ? String(decimals) : "—" },
        {
            label: "Your Balance",
            value:
                balance != null && decimals != null
                    ? `${(Number(balance) / 10 ** Number(decimals)).toLocaleString()} ${symbol ?? ""}`
                    : "—",
        },
    ];

    return (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
                <tbody>
                    {rows.map(({ label, value }) => (
                        <tr key={label} className="border-b border-gray-100 last:border-0">
                            <td className="px-4 py-2 text-gray-500 font-medium w-1/3">{label}</td>
                            <td className="px-4 py-2 text-gray-900 font-mono">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
