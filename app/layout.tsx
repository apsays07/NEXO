import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { NexoProvider } from "@/context/NexoContext";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NEXO • Private Investment Workspace",
  description:
    "Private wealth operating system for trusted group IPO discovery, evaluation, solo/combo participation, and performance tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#111318] font-sans antialiased">
        <NexoProvider>{children}</NexoProvider>
      </body>
    </html>
  );
}
