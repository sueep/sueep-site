import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Sueep — Commercial Cleaning for Construction & Properties",
  description: "Commercial cleaning that keeps projects turnover‑ready: final cleans, unit turns, and janitorial programs across PA, NJ, and NY.",
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
    title: "Sueep — Commercial Cleaning for Construction & Properties",
    description: "Turnover‑ready final cleans, rapid unit turnovers, and janitorial programs across PA, NJ, and NY.",
  },
  twitter: {
    card: "summary",
    title: "Sueep — Commercial Cleaning for Construction & Properties",
    description: "Final cleans, unit turns, and janitorial programs delivered on schedule across PA, NJ, and NY.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-53QSN796');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53QSN796"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
