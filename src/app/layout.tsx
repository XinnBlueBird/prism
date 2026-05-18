import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prism — Refract any thought into clarity",
  description:
    "A reasoning canvas powered by MiMo V2.5 Pro. Ten lenses. One engine. Turn any input — wallet, paper, idea — into structured insight.",
  metadataBase: new URL("https://prism.vercel.app"),
  openGraph: {
    title: "Prism",
    description: "Refract any thought into clarity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} antialiased`}>
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
