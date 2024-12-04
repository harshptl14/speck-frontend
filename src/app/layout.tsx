import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Speck", "Microlearning", "Roadmap", "Step by step", "pathway"],
  authors: [
    {
      name: "Harsh & Smit",
      url: "https://arshpatel.me",
    },
  ],
  creator: "Harsh",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url_app || siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url_app || siteConfig.url}/speck-og.png`],
    creator: "@harshptl14",
  },
  icons: {
    icon: "./favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-icon.png",
  },
  manifest: `${siteConfig.url_app || siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <head>
        <script
          src="https://unpkg.com/react-scan/dist/auto.global.js"
          async
        ></script>
      </head> */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
