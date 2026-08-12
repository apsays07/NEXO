import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NexoProvider } from "@/context/NexoContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#111318] font-sans antialiased">
        <NexoProvider>{children}</NexoProvider>
      </body>
    </html>
  );
}
