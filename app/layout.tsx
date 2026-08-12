import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NexoProvider } from "@/context/NexoContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Inline script to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nexo-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-page text-ink font-sans antialiased">
        <ThemeProvider>
          <NexoProvider>{children}</NexoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

