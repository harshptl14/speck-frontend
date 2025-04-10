import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

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
    icon: "/favicon.ico",  // Updated path
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
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "G-EWBJ209B17";
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {children}
        <Analytics />
        <Toaster />

        
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                c[a].q=c[a].q||[];t=l.createElement(r);t.async=1;
                t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "r1ly2hrp40");
          `,
            }}
          />)}

        
        {process.env.NODE_ENV === 'production' && (<>
        
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-EWBJ209B17"
          />

          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
          </Script>
          
        </>)}
      </body>
    </html>
  );
}