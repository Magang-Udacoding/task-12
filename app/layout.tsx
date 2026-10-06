import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import React from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

// metadata docs
export const metadata: Metadata = {
  title: "Citizen's Help Board",
  description: "A Simple Platform to Help Everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={montserrat.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
