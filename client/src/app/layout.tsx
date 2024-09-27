import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import {Inter} from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";
import env from "@/env";
import App from "@/components/app";


const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {default: "gitConnect", template: "%s  | gitConnect"},
  description: "gitConnect allows developers to  create a developer profile/portfolio, share posts and get help from others developers.",
  metadataBase: new URL(env.BASE_URL.startsWith('http') ? env.BASE_URL : `https://${env.BASE_URL}`),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white dark:bg-gray-800 antialiased flex flex-col min-h-screen max-w-screen-2xl`} suppressHydrationWarning={true}
      >
      <Header/>
      <main className='flex-1 flex flex-col'>
          <App>{children}</App>
      </main>
      <Footer/>
      </body>
      {env.ENABLE_VERCEL_ANALYTICS && <Analytics/>}
    </html>
  );
}
