"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coffee, QrCode, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/modules/auth/application/schemas/login.schema";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

const accessOptions = [
  {
    key: "ADMIN",
    label: "ADMIN",
    href: "/admin/login",
    icon: ShieldCheck,
  },
  {
    key: "KITCHEN",
    label: "KITCHEN",
    href: "/kitchen/login",
    icon: UtensilsCrossed,
  },
  {
    key: "CLIENT",
    label: "CLIENTE",
    href: "/mesa/demo-qr-token",
    icon: QrCode,
  },
] as const;

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
    <div className="grid w-full max-w-6xl gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="dark-panel grid rounded-[28px] border border-white/10 p-5 sm:rounded-[40px] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)] sm:h-14 sm:w-14">
              <Coffee className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">StarCafe</h2>
              <p className="text-white/70">Selecciona tu vista</p>
            </div>
          </div>

          <p className="max-w-lg text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            Entra a la vista que quieras revisar para el deploy visual.
          </p>

          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {accessOptions.map((option) => {
              const Icon = option.icon;
              const active =
                (role === "ADMIN" && option.key === "ADMIN") ||
                (role === "KITCHEN" && option.key === "KITCHEN");

              return (
                <Link
                  key={option.key}
                  href={option.href}
                  className={cn(
                    "rounded-[22px] border p-3 text-center transition sm:rounded-[28px] sm:p-4",
                    active
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/18 text-white"
                      : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10",
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4" />
                    <p className="text-sm uppercase tracking-[0.16em]">{option.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Card className="mx-auto w-full max-w-xl rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:rounded-[40px] sm:p-8 lg:p-10">
        <form className="section-grid gap-6" onSubmit={onSubmit}>
          <div className="section-grid gap-3">
            <span className="w-fit rounded-full bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Demo access
            </span>
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">{title}</h1>
                <p className="text-sm leading-6 text-[var(--color-muted)]">{description}</p>
              </div>
            </div>
          </div>

          <label className="section-grid gap-2">
            <span className="text-sm font-medium text-[var(--color-ink)]">Correo</span>
            <Input
              type="email"
              placeholder={role === "ADMIN" ? "admin@starcafe.com" : "kitchen@starcafe.com"}
              {...form.register("email")}
            />
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

          <Button className="w-full" disabled={form.formState.isSubmitting} type="submit">
            Ingresar al demo
          </Button>
        </form>
      </Card>
    </div>
  );
}
