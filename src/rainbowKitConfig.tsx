import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, zksync } from "wagmi/chains";

export default getDefaultConfig({
    chains: [anvil, zksync],
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    appName: "TSender UI",
    ssr: false,
});