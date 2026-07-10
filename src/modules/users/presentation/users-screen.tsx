"use client";

import { useEffect, useState } from "react";
import { Plus, Power } from "lucide-react";
import { createUserUseCase, deactivateUserUseCase, listUsersUseCase } from "@/modules/users/application/use-cases/users.use-cases";
import type { CreateUserPayload } from "@/modules/users/domain/user.types";
import type { UserEntity } from "@/modules/users/domain/user.entity";
import { usersRepository } from "@/modules/users/infrastructure/repositories/users-http.repository";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { DemoTable } from "@/shared/components/ui/demo-table";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { StatusBadge } from "@/shared/components/ui/status-badge";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";

const initialForm: CreateUserPayload = {
  name: "",
  email: "",
  password: "",
  role: "KITCHEN",
};

export function UsersScreen() {
  const auth = useAuthGuard("ADMIN");
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateUserPayload>(initialForm);

  async function loadUsers(token: string) {
    setLoading(true);

    try {
      setUsers(await listUsersUseCase(usersRepository, token));
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudieron cargar los usuarios.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadUsers(auth.token);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [auth]);

  if (!auth) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const created = await createUserUseCase(usersRepository, auth.token, form);
      setUsers((current) => [created, ...current]);
      setForm(initialForm);
      toast.success("Usuario creado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo crear el usuario.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(userId: number) {
    try {
      await deactivateUserUseCase(usersRepository, auth.token, userId);
      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, isActive: false } : user)),
      );
      toast.success("Usuario desactivado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo desactivar el usuario.";
      toast.error(message);
    }
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Users"
        title="Equipo y permisos"
        description="Gestiona usuarios ADMIN y KITCHEN usando el contexto real de la cafetería autenticada."
      />

      <Card className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-card)]">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5" onSubmit={handleSubmit}>
          <Input
            placeholder="Nombre"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            placeholder="Correo"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <Input
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <select
            className="h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({ ...current, role: event.target.value as CreateUserPayload["role"] }))
            }
          >
            <option value="KITCHEN">KITCHEN</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <Button disabled={submitting} type="submit">
            {submitting ? <Spinner /> : <Plus className="h-4 w-4" />}
            Crear usuario
          </Button>
        </form>
      </Card>

      {loading ? (
        <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
          <Spinner />
          <span>Cargando usuarios...</span>
        </Card>
      ) : users.length ? (
        <DemoTable
          headers={["Nombre", "Correo", "Rol", "Estado", "Acciones"]}
          rows={users.map((user) => [
            <span key={`${user.id}-name`} className="font-semibold">{user.name}</span>,
            user.email,
            user.role,
            <StatusBadge
              key={`${user.id}-status`}
              status={user.isActive ? "ACTIVE" : "INACTIVE"}
              label={user.isActive ? "Activo" : "Inactivo"}
            />,
            <Button
              key={`${user.id}-action`}
              disabled={!user.isActive}
              variant="ghost"
              onClick={() => handleDeactivate(user.id)}
              type="button"
            >
              <Power className="h-4 w-4" />
              Desactivar
            </Button>,
          ])}
        />
      ) : (
        <EmptyState
          title="No hay usuarios registrados"
          description="Crea tu primer usuario operativo para esta cafetería."
        />
      )}
    </div>
  );
}
