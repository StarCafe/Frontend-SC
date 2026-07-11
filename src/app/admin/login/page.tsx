import { LoginForm } from "@/modules/auth/presentation/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#111111] px-4 py-8">
      <div className="page-shell grid min-h-screen place-items-center">
        <LoginForm
          role="ADMIN"
          title="Acceso administrador"
          description="Gestiona productos, mesas, caja y usuarios desde una base frontend organizada por dominios."
        />
      </div>
    </main>
  );
}
