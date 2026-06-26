import { LoginForm } from "@/modules/auth/presentation/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="page-shell grid min-h-screen place-items-center py-8">
      <LoginForm
        role="ADMIN"
        title="Acceso administrador"
        description="Gestiona productos, mesas, caja y usuarios desde una base frontend organizada por dominios."
      />
    </main>
  );
}
