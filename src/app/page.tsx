import Link from "next/link";
import { ArrowRight, ChefHat, Coffee, QrCode, ShieldCheck } from "lucide-react";
import { buttonClasses } from "@/shared/components/ui/button-styles";
import { Card } from "@/shared/components/ui/card";
import { demoPalette } from "@/shared/mock/starcafe-demo";

const accessViews = [
  {
    href: "/admin/tables",
    icon: ShieldCheck,
    title: "ADMIN",
    description:
      "Gestion completa del sistema: mesas, productos, categorias, addons, pedidos, caja y usuarios.",
    details: [
      "Sidebar operativo con acceso casi total",
      "Vista sobria y orientada a gestion",
      "La primera pagina fuerte es Mesas",
    ],
  },
  {
    href: "/kitchen/orders",
    icon: ChefHat,
    title: "KITCHEN",
    description:
      "Tablero rapido de cocina con pedidos activos, cambio de estados y acciones grandes por item y pedido.",
    details: [
      "Solo pedidos activos e historial",
      "Pantalla de alto contraste y pocas distracciones",
      "Pensado para velocidad operativa",
    ],
  },
  {
    href: "/mesa/demo-qr-token",
    icon: QrCode,
    title: "CLIENTE QR",
    description:
      "Carta mobile-first para pedir desde la mesa, revisar pedidos activos y confirmar un nuevo pedido.",
    details: [
      "No comparte opciones con ADMIN ni KITCHEN",
      "Experiencia calida, simple y visual",
      "Entra directo al flujo de la mesa",
    ],
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden py-6">
      <div className="page-shell grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="dark-panel rounded-[40px] border border-white/10 p-6 text-white shadow-[var(--shadow-soft)]">
          <div className="grid gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <Coffee className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-semibold">StarCafe</h1>
                <p className="text-white/70">Acceso por vista</p>
              </div>
            </div>

            <p className="text-base leading-7 text-white/70">
              Aqui no deberia aparecer un dashboard inventado. Primero eliges con que vista quieres entrar:
              ADMIN, KITCHEN o Cliente QR.
            </p>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Paleta</p>
              <div className="mt-4 grid gap-3">
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
          </div>
        </Card>

        <section className="glass-panel rounded-[40px] border border-[var(--color-border)] px-6 py-8 shadow-[var(--shadow-soft)] md:px-8">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <span className="w-fit rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Seleccion de acceso
              </span>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-ink)] md:text-6xl">
                Escoge la vista correcta para entrar
              </h2>
              <p className="max-w-3xl text-base leading-7 text-[var(--color-muted)] md:text-lg">
                Las tres experiencias son distintas: el cliente no ve lo mismo que KITCHEN, y KITCHEN no
                tiene el acceso completo de ADMIN.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {accessViews.map(({ href, icon: Icon, title, description, details }) => (
                <Card key={href} className="grid gap-5 rounded-[32px] bg-white p-6 shadow-[var(--shadow-card)]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-strong)] text-[var(--color-primary)]">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-2xl font-semibold text-[var(--color-ink)]">{title}</h3>
                    <p className="text-sm leading-7 text-[var(--color-muted)]">{description}</p>
                  </div>

                  <div className="rounded-[24px] bg-[var(--color-surface)] p-4">
                    <div className="grid gap-2">
                      {details.map((detail) => (
                        <p key={detail} className="text-sm leading-6 text-[var(--color-muted)]">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>

                  <Link href={href} className={buttonClasses({ className: "w-full justify-between" })}>
                    Entrar a esta vista
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
