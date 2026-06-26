"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Coffee, ShieldCheck } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/modules/auth/application/schemas/login.schema";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useRouter } from "next/navigation";

export function LoginForm({
  role,
  title,
  description,
}: {
  role: "ADMIN" | "KITCHEN";
  title: string;
  description: string;
}) {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async () => {
    toast.success("Demo mode activado");
    router.push(role === "ADMIN" ? "/admin/dashboard" : "/kitchen/orders");
  });

  return (
    <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="dark-panel hidden rounded-[40px] border border-white/10 p-10 lg:grid">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
              <Coffee className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-4xl font-semibold">StarCafe</h2>
              <p className="text-white/70">Modern. Warm. Fast.</p>
            </div>
          </div>
          <p className="max-w-lg text-lg leading-8 text-white/72">
            Sistema premium para cafeterías con experiencia cálida para clientes, visibilidad total para administración y velocidad real en cocina.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Cálido", "Rápido", "Premium"].map((item) => (
              <div key={item} className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-sm uppercase tracking-[0.16em] text-white/60">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Card className="mx-auto w-full max-w-xl rounded-[40px] bg-white p-8 shadow-[var(--shadow-soft)] lg:p-10">
        <form className="section-grid gap-6" onSubmit={onSubmit}>
          <div className="section-grid gap-3">
            <span className="w-fit rounded-full bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Demo access
            </span>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{title}</h1>
                <p className="text-sm leading-6 text-[var(--color-muted)]">{description}</p>
              </div>
            </div>
          </div>

          <label className="section-grid gap-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">Correo</span>
            <Input type="email" placeholder={role === "ADMIN" ? "admin@starcafe.com" : "kitchen@starcafe.com"} {...form.register("email")} />
            {form.formState.errors.email ? (
              <span className="text-sm text-[var(--color-danger)]">{form.formState.errors.email.message}</span>
            ) : null}
          </label>

          <label className="section-grid gap-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">Clave</span>
            <Input type="password" placeholder="******" {...form.register("password")} />
            {form.formState.errors.password ? (
              <span className="text-sm text-[var(--color-danger)]">{form.formState.errors.password.message}</span>
            ) : null}
          </label>

          <div className="rounded-[24px] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
            Esta versión es totalmente hardcodeada para deploy visual. El botón solo navega entre pantallas demo.
          </div>

          <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
            Ingresar al demo
          </Button>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
            <span>Cliente QR</span>
            <Link className="font-semibold text-[var(--color-primary)]" href="/mesa/demo-qr-token">
              Ver experiencia pública
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
