import Link from "next/link";
import { ArrowRight, ChefHat, Coffee, QrCode, ShieldCheck } from "lucide-react";
import { buttonClasses } from "@/shared/components/ui/button-styles";
import { Card } from "@/shared/components/ui/card";
import { demoExperiencePillars, demoPalette, demoProducts } from "@/shared/mock/starcafe-demo";
import { ProductVisual } from "@/shared/components/ui/product-visual";

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
    <main className="relative overflow-hidden py-6">
      <div className="page-shell section-grid gap-6">
        <section className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="dark-panel rounded-[40px] border border-white/10 p-6 text-white shadow-[var(--shadow-soft)]">
            <div className="section-grid gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <Coffee className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-semibold">StarCafe</h1>
                  <p className="text-white/70">Modern. Warm. Fast.</p>
                </div>
              </div>
              <p className="text-base leading-7 text-white/70">
                Demo visual para administración, cocina y cliente QR inspirado en Starbucks y POS premium de cafetería.
              </p>
              <div className="grid gap-3">
                {demoPalette.map((color) => (
                  <div key={color.hex} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <span className="h-10 w-10 rounded-2xl border border-white/10" style={{ backgroundColor: color.hex }} />
                    <div>
                      <p className="font-medium">{color.name}</p>
                      <p className="text-xs text-white/50">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <section className="glass-panel rounded-[40px] border border-[var(--color-border)] px-6 py-8 shadow-[var(--shadow-soft)] md:px-8">
            <div className="section-grid gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="section-grid gap-3">
                  <span className="w-fit rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                    Hardcoded deploy demo
                  </span>
                  <div className="section-grid gap-3">
                    <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] md:text-6xl">
                      StarCafe <span className="app-gradient-text">Control Center</span>
                    </h2>
                    <p className="max-w-3xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
                      Todas las pantallas ya están diseñadas con datos mock: admin, kitchen y cliente QR listos para deploy visual.
                    </p>
                  </div>
                </div>
                <div className="rounded-[28px] bg-[var(--color-surface)] p-4">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">Principios</p>
                  <div className="mt-3 grid gap-2">
                    {demoExperiencePillars.slice(0, 3).map((item) => (
                      <p key={item} className="text-sm text-[var(--color-muted)]">{item}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/admin/login" className={buttonClasses({ size: "lg" })}>
                Entrar al panel
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/mesa/demo-qr-token" className={buttonClasses({ size: "lg", variant: "secondary" })}>
                Ver experiencia QR
              </Link>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="grid gap-4 md:grid-cols-3">
                  {quickLinks.map(({ href, icon: Icon, title, description }) => (
                    <Card key={href} className="section-grid gap-4 rounded-[30px] bg-white p-6 shadow-[var(--shadow-card)]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-strong)] text-[var(--color-primary)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="section-grid gap-2">
                        <h2 className="text-xl font-semibold text-[var(--color-ink)]">{title}</h2>
                        <p className="text-sm leading-6 text-[var(--color-muted)]">{description}</p>
                      </div>
                      <Link href={href} className={buttonClasses({ variant: "ghost", className: "justify-start px-0" })}>
                        Abrir módulo
                      </Link>
                    </Card>
                  ))}
                </div>
                <Card className="rounded-[30px] bg-white p-5 shadow-[var(--shadow-card)]">
                  <h3 className="text-xl font-semibold text-[var(--color-ink)]">Productos destacados</h3>
                  <div className="mt-4 grid gap-4">
                    {demoProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                        <ProductVisual accent={product.accent} category={product.category} className="min-h-[120px]" />
                        <div className="py-2">
                          <p className="text-lg font-semibold text-[var(--color-ink)]">{product.name}</p>
                          <p className="mt-1 text-sm text-[var(--color-muted)]">{product.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
