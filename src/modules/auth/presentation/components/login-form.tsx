"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { QrCode, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginUseCase } from "@/modules/auth/application/use-cases/auth.use-cases";
import { loginSchema, type LoginFormValues } from "@/modules/auth/application/schemas/login.schema";
import { authRepository } from "@/modules/auth/infrastructure/repositories/auth-http.repository";
import { Input } from "@/shared/components/ui/input";
import { useAuthStore } from "@/shared/store/auth-store";
import { HttpError } from "@/shared/lib/api/http-client";
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
  const setSession = useAuthStore((state) => state.setSession);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const session = await loginUseCase(authRepository, values);

      if (session.user.role !== role) {
        toast.error(`Este usuario pertenece al rol ${session.user.role}.`);
        return;
      }

      setSession(session);
      toast.success("Sesion iniciada");
      router.push(role === "ADMIN" ? "/admin/dashboard" : "/kitchen/orders");
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "No se pudo iniciar sesion.";
      toast.error(message);
    }
  });

  return (
    <div className="grid w-full max-w-6xl gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="grid rounded-[28px] border border-[#2D2D2D] bg-[#111111] p-5 text-[#FFFFFF] shadow-none sm:rounded-[40px] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-4 text-[#FFFFFF] sm:gap-6">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[28px] sm:h-28 sm:w-28">
              <Image
                alt="Logo de Nova"
                className="h-full w-full scale-125 object-cover"
                height={112}
                priority
                src="/Nova-Logo.png"
                width={112}
              />
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Nova</h2>
              <p className="mt-1 text-base text-[#D7D7D7] sm:text-lg">Acceso a la plataforma</p>
            </div>
          </div>

          <p className="max-w-lg text-base leading-7 text-[#D7D7D7] sm:text-lg sm:leading-8">
            Inicia sesion en la plataforma Nova y entra a la vista que corresponda a tu rol.
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
                      ? "border-[#555555] bg-[#2D2D2D] text-[#FFFFFF]"
                      : "border-[#2D2D2D] bg-[#111111] text-[#D7D7D7] hover:bg-[#2D2D2D]",
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

      <section className="mx-auto w-full max-w-xl rounded-[28px] border border-[#555555] bg-[#D7D7D7] p-5 shadow-none sm:rounded-[40px] sm:p-8 lg:p-10">
        <form className="section-grid gap-6" onSubmit={onSubmit}>
          <div className="section-grid gap-3">
            <span className="w-fit rounded-full bg-[#FFFFFF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#555555]">
              Acceso seguro
            </span>
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2D2D2D] text-[#FFFFFF]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">{title}</h1>
                <p className="text-sm leading-6 text-[#555555]">{description}</p>
              </div>
            </div>
          </div>

          <label className="section-grid gap-2">
            <span className="text-sm font-medium text-[#111111]">Correo</span>
            <Input
              className="border-[#555555] bg-[#FFFFFF] text-[#111111] caret-[#111111] placeholder:text-[#555555] focus:border-[#2D2D2D] focus:ring-4 focus:ring-[rgba(85,85,85,0.12)]"
              type="email"
              placeholder={role === "ADMIN" ? "admin@starcafe.com" : "kitchen@starcafe.com"}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <span className="text-sm text-[#555555]">{form.formState.errors.email.message}</span>
            ) : null}
          </label>

          <label className="section-grid gap-2">
            <span className="text-sm font-medium text-[#111111]">Clave</span>
            <Input
              className="border-[#555555] bg-[#FFFFFF] text-[#111111] caret-[#111111] placeholder:text-[#555555] focus:border-[#2D2D2D] focus:ring-4 focus:ring-[rgba(85,85,85,0.12)]"
              type="password"
              placeholder="******"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <span className="text-sm text-[#555555]">{form.formState.errors.password.message}</span>
            ) : null}
          </label>

          <button
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#2D2D2D] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </div>
  );
}
