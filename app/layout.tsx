import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Vintage Prague",
  description: "Curated vintage fashion from Prague — bags, clothing, shoes & wallets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-offwhite antialiased">
        {children}
      </body>
    </html>
  );
}
