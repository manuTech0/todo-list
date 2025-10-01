import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto_Mono({
  variable: "--font-roboto-mono",
})

export const metadata: Metadata = {
  title: "My Paper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <>
          <Toaster position="top-center"/>
            {children}
        </>
    );
}
