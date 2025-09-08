import * as React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider,ThemeProvider } from "@/components/providers";

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

// app/layout.tsx
export const metadata = {
  title: 'Todo List by manuTech',
  appleWebApp: {
    title: 'todo-list',
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en"  className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <body
          className={`${roboto.variable} antialiased`}
          suppressHydrationWarning
        >
          <AuthSessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthSessionProvider>
        </body>
      </html>
    </>
  );
}
