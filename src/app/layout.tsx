import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Suspense } from "react";
import { GetPagesAndVideos } from "@/helpers";
import { Config } from "@/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shitty Youtube",
  description: "Created by a bad developer",
};

const pages = GetPagesAndVideos(Config.PublicFolderPath)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body 
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          height: '100%',
          width: '100%',
          display:'flex',
          padding: '0 3rem',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className={`${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={<div>Loading search results...</div>}>
    
          <Providers
            videoDataFromServer={pages}>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
