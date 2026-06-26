import { Plus } from "lucide-react";
import { demoUsers } from "@/shared/mock/starcafe-demo";
import { Button } from "@/shared/components/ui/button";
import { DemoTable } from "@/shared/components/ui/demo-table";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { StatusBadge } from "@/shared/components/ui/status-badge";

export function UsersScreen() {
  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Users"
        title="Equipo y permisos"
        description="Vista demo para administración de usuarios con roles ADMIN y KITCHEN, lista para convertirse luego en CRUD real."
        action={<Button><Plus className="h-4 w-4" />Crear usuario</Button>}
      />
      <DemoTable
        headers={["Nombre", "Correo", "Rol", "Estado"]}
        rows={demoUsers.map((user) => [
          <span key={`${user.id}-name`} className="font-semibold">{user.name}</span>,
          user.email,
          user.role,
          <StatusBadge key={`${user.id}-status`} status={user.status} label={user.status === "ACTIVE" ? "Activo" : "Inactivo"} />,
        ])}
      />
    </div>
  );
}
