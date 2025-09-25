import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sueep — Commercial Cleaning & Construction Services",
  description: "Commercial Cleaning services for construction final cleans, janitorial, and painting across PA, NJ, and NY.",
  icons: {
    icon: [
      { url: "/sueepicon.jpeg?v=2", sizes: "32x32" },
      { url: "/sueepicon.jpeg?v=2", sizes: "16x16" },
    ],
    shortcut: "/sueepicon.jpeg?v=2",
    apple: "/sueepicon.jpeg?v=2",
    other: [
      // Safari pinned tab (will be ignored if not found)
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#E73C6E" },
    ],
  },
  openGraph: {
    title: "Sueep — Commercial Cleaning & Construction Services",
    description: "Commercial Cleaning services for construction final cleans, janitorial, and painting across PA, NJ, and NY.",
  },
  twitter: {
    card: "summary",
    title: "Sueep — Commercial Cleaning & Construction Services",
    description: "Commercial Cleaning services for construction final cleans, janitorial, and painting across PA, NJ, and NY.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
