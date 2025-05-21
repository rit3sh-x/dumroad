import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dumroad | The only Marketplace for Digital Goods",
  description: "Dumroad is a digital goods marketplace that allows creators to sell their products directly to consumers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.svg" sizes="any" />
      <body className={`antialiased ${dmSans.className} w-screen min-h-screen`}>
        {children}
      </body>
    </html>
  );
}