import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/shared/components/providers/app-providers";

export const metadata: Metadata = {
  title: "Nova",
  description: "Plataforma web para administracion, cocina y pedidos por QR",
  icons: {
    icon: "/Nova-Logo.png",
    shortcut: "/Nova-Logo.png",
    apple: "/Nova-Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full text-[var(--color-ink)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
