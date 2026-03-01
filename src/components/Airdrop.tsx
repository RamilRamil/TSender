"use client";

import { useState, useMemo } from "react";
import InputField from "./ui/InputField";
import { chainsToTSender, erc20Abi } from "../constants";
import { calculateTotalAmount } from "../utils/calculateTotal/calculateTotal";
import { useChainId, useConfig, useAccount, usePublicClient } from "wagmi";
import { readContract } from "wagmi/actions";

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const [totalAmount, setTotalAmount] = useState("")
    const chainId = useChainId()
    const account = useAccount()
    const config = useConfig()
    const publicClient = usePublicClient()
    const total: number = useMemo(() => calculateTotalAmount(amounts), [amounts])
    

    async function getApprovedAmount(tSenderAddress: string): Promise<bigint> {
        if (!account.address) {
            alert("Please connect your wallet");
            return BigInt(0);
        }

        try {
            const code = await publicClient?.getCode({ address: tokenAddress as `0x${string}` });
            if (!code || code === "0x") {
                alert("No contract found at this address on the current network.");
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
            alert("Failed to read token allowance. Make sure the token address is correct.");
            return BigInt(0);
        }
    }

    async function handleAirdrop() {
        if (!tokenAddress || !recipients || !amounts || !totalAmount) {
            alert("Please fill in all fields");
            return;
        }
        if (!chainsToTSender[chainId]) {
            alert("Unsupported network. Please switch to a supported chain.");
            return;
        }
        const tSenderAddress = chainsToTSender[chainId]["tsender"];
        const approvedAmount = await getApprovedAmount(tSenderAddress);
        if (approvedAmount < BigInt(totalAmount)) {
            alert("Not enough approved amount. Please approve the token first.");
            return;
        } else if (approvedAmount > BigInt(totalAmount)) {
    }
}

    return (
        <div>
            <InputField
                label="Token Address"
                placeholder="0x1234567890123456789012345678901234567890"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
            />
            <InputField
                label="Recipients"
                placeholder="0x123...,0x123..."
                value={recipients}
                large={true}
                onChange={e => setRecipients(e.target.value)}
            />
            <InputField
                label="Amounts"
                placeholder="1, 2, 3..."
                value={amounts}
                large={true}
                onChange={e => setAmounts(e.target.value)}
            />
            <InputField
                label="Total Amount"
                placeholder="1000"
                value={totalAmount}
                onChange={e => setTotalAmount(e.target.value)}
            />
            <button onClick={handleAirdrop} className="w-full rounded-lg bg-blue-500 text-white px-4 py-2">
                Airdrop
            </button>
        </div>
    )
}