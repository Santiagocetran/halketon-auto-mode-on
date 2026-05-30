import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Halketon Ops Memory",
  description: "WhatsApp-first operational memory dashboard for NGO teams."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

