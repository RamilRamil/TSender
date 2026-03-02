"use client";

import { useState, useMemo, useEffect } from "react";
import InputField from "./ui/InputField";
import TokenInfo from "./TokenInfo";
import { chainsToTSender, erc20Abi, tsenderAbi } from "../constants";
import { calculateTotalAmount } from "../utils/calculateTotal/calculateTotal";
import { parseRecipients } from "../utils/parseRecipients/parseRecipients";
import { parseAmounts } from "../utils/parseAmounts/parseAmounts";
import { useChainId, useConfig, useAccount, usePublicClient, useWriteContract, useReadContract } from "wagmi";
import { toast } from "sonner";
import { readContract, waitForTransactionReceipt } from "wagmi/actions";

function useLocalStorage(key: string, initial: string) {
    const [value, setValue] = useState(initial);

    useEffect(() => {
        const stored = localStorage.getItem(key);
        if (stored !== null) setValue(stored);
    }, [key]);

    const set = (v: string) => {
        setValue(v);
        localStorage.setItem(key, v);
    };
    return [value, set] as const;
}

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useLocalStorage("tsender_tokenAddress", "");
    const [recipients, setRecipients] = useLocalStorage("tsender_recipients", "");
    const [amounts, setAmounts] = useLocalStorage("tsender_amounts", "");
    const [status, setStatus] = useState("");

    const chainId = useChainId();
    const account = useAccount();
    const config = useConfig();
    const publicClient = usePublicClient();
    const { data: decimals } = useReadContract({
        address: tokenAddress ? (tokenAddress as `0x${string}`) : undefined,
        abi: erc20Abi,
        functionName: "decimals",
    });
    const decimalsNum = decimals != null ? Number(decimals) : 18;
    const total: number = useMemo(() => {
        try { return calculateTotalAmount(amounts); } catch { return 0; }
    }, [amounts]);
    const amountsWei = useMemo(() => {
        try { return parseAmounts(amounts, decimalsNum); } catch { return []; }
    }, [amounts, decimalsNum]);
    const totalAmountWei = useMemo(() => amountsWei.reduce((a, b) => a + b, BigInt(0)), [amountsWei]);
    const recipientsCount = useMemo(() => {
        try { return parseRecipients(recipients).length; } catch { return -1; }
    }, [recipients]);
    const countsMatch = recipientsCount >= 0 && amountsWei.length > 0 && recipientsCount === amountsWei.length;
    const { writeContractAsync } = useWriteContract();

    const isLoading = status !== "";

    async function getApprovedAmount(tSenderAddress: string): Promise<bigint> {
        if (!account.address) {
            toast.error("Please connect your wallet");
            return BigInt(0);
        }

        try {
            const code = await publicClient?.getCode({ address: tokenAddress as `0x${string}` });
            if (!code || code === "0x") {
                toast.error("No contract found at this address on the current network.");
                return BigInt(0);
            }

            const response = await readContract(config, {
                address: tokenAddress as `0x${string}`,
                abi: erc20Abi,
                functionName: "allowance",
                args: [account.address, tSenderAddress as `0x${string}`],
            });
            return response as bigint;
        } catch (error) {
            console.error("Failed to read allowance:", error);
            toast.error("Failed to read token allowance. Make sure the token address is correct.");
            return BigInt(0);
        }
    }

    async function handleAirdrop() {
        if (!tokenAddress || !recipients || !amounts || totalAmountWei === BigInt(0)) {
            toast.warning("Please fill in all fields");
            return;
        }
        try {
            const recList = parseRecipients(recipients);
            if (amountsWei.length !== recList.length) {
                toast.warning("Recipients and amounts count must match");
                return;
            }
        } catch {
            toast.warning("Invalid recipients or amounts format");
            return;
        }
        if (!chainsToTSender[chainId]) {
            toast.error("Unsupported network. Please switch to a supported chain.");
            return;
        }

        try {
            const tSenderAddress = chainsToTSender[chainId]["tsender"];

            setStatus("Checking allowance...");
            const approvedAmount = await getApprovedAmount(tSenderAddress);

            if (approvedAmount < totalAmountWei) {
                setStatus("Confirming approval in wallet...");
                const approvalHash = await writeContractAsync({
                    address: tokenAddress as `0x${string}`,
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [tSenderAddress as `0x${string}`, totalAmountWei],
                });
                setStatus("Waiting for approval...");
                await waitForTransactionReceipt(config, { hash: approvalHash });
                toast.success("Token approval confirmed");
            }

            setStatus("Confirming airdrop in wallet...");
            const airdropHash = await writeContractAsync({
                address: tSenderAddress as `0x${string}`,
                abi: tsenderAbi,
                functionName: "airdropERC20",
                args: [
                    tokenAddress as `0x${string}`,
                    parseRecipients(recipients),
                    amountsWei,
                    totalAmountWei,
                ],
            });
            setStatus("Sending airdrop...");
            await waitForTransactionReceipt(config, { hash: airdropHash });
            setStatus("");
            toast.success("Airdrop completed successfully!");
        } catch (error) {
            console.error("Airdrop failed:", error);
            toast.error("Transaction failed. Check the console for details.");
            setStatus("");
        }
    }

    return (
        <div className="flex flex-col gap-4 p-6 max-w-2xl mx-auto">
            <InputField
                label="Token Address"
                placeholder="0x1234567890123456789012345678901234567890"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
                disabled={isLoading}
            />
            <InputField
                label="Recipients"
                placeholder="0x123...,0x123..."
                value={recipients}
                large={true}
                onChange={e => setRecipients(e.target.value)}
                disabled={isLoading}
            />
            <InputField
                label="Amounts"
                placeholder="1, 2, 3..."
                value={amounts}
                large={true}
                onChange={e => setAmounts(e.target.value)}
                disabled={isLoading}
            />
            <InputField
                label="Total Amount"
                placeholder="0"
                value={String(total)}
                onChange={() => {}}
                readOnly={true}
                disabled={isLoading}
            />
            {tokenAddress && (
                <TokenInfo
                    tokenAddress={tokenAddress as `0x${string}`}
                    userAddress={account.address}
                />
            )}
            <button
                onClick={handleAirdrop}
                disabled={isLoading || !countsMatch}
                className="w-full rounded-lg bg-blue-500 text-white px-4 py-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
                {isLoading && (
                    <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {isLoading ? status : "Airdrop"}
            </button>
        </div>
    );
}
