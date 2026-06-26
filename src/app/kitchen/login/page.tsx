import { LoginForm } from "@/modules/auth/presentation/components/login-form";

export default function KitchenLoginPage() {
  return (
    <main className="page-shell grid min-h-screen place-items-center py-8">
      <LoginForm
        role="KITCHEN"
        title="Acceso cocina"
        description="Panel operativo para ver tickets activos y actualizar estados de preparacion."
      />
    </main>
  );
}
