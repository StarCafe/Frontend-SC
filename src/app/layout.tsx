import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/shared/components/providers/app-providers";

export const metadata: Metadata = {
  title: "StarCafe Control Center",
  description: "Frontend DDD para administracion, cocina y pedidos por QR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-ink)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
