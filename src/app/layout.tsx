import type { Metadata } from "next";
import "./globals.css";
import { type ReactNode } from "react";
import { Providers } from "./providers";
import Header from "../components/Header";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TSender UI",
  description: "TSender UI",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {props.children}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
