import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import {Inter} from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";


const inter = Inter({
  subsets: ['latin'],
});

const BASEURL = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL ??
    process.env.METADATA_BASE ?? `http://localhost:${process.env.PORT || 3000}`

export const metadata: Metadata = {
  title: {default: "gitConnect", template: "%s  | gitConnect"},
  description: "gitConnect allows developers to  create a developer profile/portfolio, share posts and get help from others developers.",
  metadataBase: new URL(BASEURL.startsWith('http') ? BASEURL : `https://${BASEURL}`),
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
      <main className='flex-1'>{children}</main>
      <Footer/>
      </body>
      {process.env.ENABLE_VERCEL_ANALYTICS == 'true' && <Analytics/>}
    </html>
  );
}
