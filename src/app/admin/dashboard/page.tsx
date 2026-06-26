import { demoCategoryBreakdown, demoOrders, demoProducts, demoStats, demoTables } from "@/shared/mock/starcafe-demo";
import { Card } from "@/shared/components/ui/card";
import { MetricCard } from "@/shared/components/ui/metric-card";
import { ProductVisual } from "@/shared/components/ui/product-visual";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { TopbarSearch } from "@/shared/components/ui/topbar-search";

export default function AdminDashboardPage() {
  return (
    <div className="section-grid gap-5">
      <TopbarSearch />
      <SectionHeading
        eyebrow="Admin area"
        title="Resumen del día"
        description="Dashboard premium estilo POS con foco en ventas, pedidos, mesas y lectura rápida de la operación."
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {demoStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
        <Card className="rounded-[32px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Pedidos en curso</h2>
          <div className="mt-4 grid gap-3">
            {demoOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-[22px] border border-[var(--color-border)] px-4 py-4">
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">#{order.id} · {order.table}</p>
                  <p className="text-sm text-[var(--color-muted)]">{order.items[0]?.productName}</p>
                </div>
                <StatusBadge status={order.status} label={order.shortStatus} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Mesas activas</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {demoTables.map((table) => (
              <div key={table.id} className={`rounded-[24px] p-4 ${table.active ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-ink)]"}`}>
                <p className="font-semibold">Mesa {table.tableNumber}</p>
                <p className={`mt-2 text-sm ${table.active ? "text-white/75" : "text-[var(--color-muted)]"}`}>{table.occupancyLabel}</p>
                <p className={`text-sm ${table.active ? "text-white/75" : "text-[var(--color-muted)]"}`}>{table.minutesLabel}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Productos más vendidos</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {demoProducts.slice(0, 4).map((product) => (
              <div key={product.id}>
                <ProductVisual accent={product.accent} category={product.category} className="min-h-[180px]" />
                <p className="mt-3 font-semibold text-[var(--color-ink)]">{product.name}</p>
                <p className="text-sm text-[var(--color-muted)]">{product.subtitle}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px] bg-white p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Ventas por categoría</h2>
          <div className="mt-5 flex items-center justify-center">
            <div className="relative h-52 w-52 rounded-full bg-[conic-gradient(#006241_0_62%,#c89a58_62%_90%,#a9beae_90%_100%)]">
              <div className="absolute inset-8 rounded-full bg-white" />
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {demoCategoryBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[var(--color-muted)]">{item.label}</span>
                </div>
                <span className="font-semibold text-[var(--color-ink)]">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
