"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/modules/auth/application/schemas/login.schema";
import { loginUseCase } from "@/modules/auth/application/use-cases/auth.use-cases";
import { authRepository } from "@/modules/auth/infrastructure/repositories/auth-http.repository";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import { useAuthStore } from "@/shared/store/auth-store";
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
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      const session = await loginUseCase(authRepository, values);

      if (session.user.role !== role) {
        setServerError(`Esta cuenta pertenece al modulo ${session.user.role}.`);
        return;
      }

      setSession(session);
      toast.success(`Bienvenido, ${session.user.name}`);
      router.push(role === "ADMIN" ? "/admin/dashboard" : "/kitchen/orders");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo iniciar sesion";
      setServerError(message);
      toast.error(message);
    }
  });

  return (
    <Card className="mx-auto w-full max-w-md p-8">
      <form className="section-grid gap-5" onSubmit={onSubmit}>
        <div className="section-grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Acceso seguro
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm leading-6 text-[var(--color-muted)]">{description}</p>
        </div>

        <label className="section-grid gap-2">
          <span className="text-sm font-medium">Correo</span>
          <Input type="email" placeholder="admin@starcafe.com" {...form.register("email")} />
          {form.formState.errors.email ? (
            <span className="text-sm text-[var(--color-danger)]">{form.formState.errors.email.message}</span>
          ) : null}
        </label>

        <label className="section-grid gap-2">
          <span className="text-sm font-medium">Clave</span>
          <Input type="password" placeholder="******" {...form.register("password")} />
          {form.formState.errors.password ? (
            <span className="text-sm text-[var(--color-danger)]">{form.formState.errors.password.message}</span>
          ) : null}
        </label>

        {serverError ? <p className="text-sm text-[var(--color-danger)]">{serverError}</p> : null}

        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? <Spinner /> : null}
          Ingresar
        </Button>
      </form>
    </Card>
  );
}
