import Link from "next/link";
import { ArrowRight, ChefHat, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

const quickLinks = [
  {
    href: "/admin/login",
    icon: ShieldCheck,
    title: "Administrador",
    description: "Gestiona mesas, productos, pedidos y caja desde un panel ordenado.",
  },
  {
    href: "/kitchen/login",
    icon: ChefHat,
    title: "Cocina",
    description: "Visualiza pedidos activos con estados claros y acciones rapidas.",
  },
  {
    href: "/mesa/demo-qr-token",
    icon: QrCode,
    title: "Cliente por QR",
    description: "Explora la experiencia mobile-first para pedidos publicos por mesa.",
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden py-10">
      <div className="page-shell section-grid gap-8">
        <section className="glass-panel rounded-[32px] border border-[var(--color-border)] px-6 py-10 shadow-[var(--shadow-soft)] md:px-10">
          <div className="max-w-3xl section-grid gap-5">
            <span className="w-fit rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Frontend DDD listo para crecer
            </span>
            <div className="section-grid gap-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
                StarCafe <span className="app-gradient-text">Control Center</span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
                Base moderna con Next.js App Router, TypeScript y arquitectura por dominios para
                admin, cocina y pedidos publicos por QR.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/admin/login">
                  Entrar al panel
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/mesa/demo-qr-token">Ver experiencia QR</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickLinks.map(({ href, icon: Icon, title, description }) => (
            <Card key={href} className="section-grid gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-strong)] text-[var(--color-primary)]">
                <Icon className="h-6 w-6" />
              </div>
              <div className="section-grid gap-2">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm leading-6 text-[var(--color-muted)]">{description}</p>
              </div>
              <Button asChild variant="ghost" className="justify-start px-0">
                <Link href={href}>Abrir modulo</Link>
              </Button>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
