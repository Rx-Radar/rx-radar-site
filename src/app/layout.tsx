import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from 'next/head'
import Script from 'next/script'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rx-Radar",
  description: "Find your medication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-98YDGN7F36"></Script>
        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-98YDGN7F36');
          `}
        </Script>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
