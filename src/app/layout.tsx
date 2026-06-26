import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/shared/components/providers/app-providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-ink)]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
