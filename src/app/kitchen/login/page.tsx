import { LoginForm } from "@/modules/auth/presentation/components/login-form";

export default function KitchenLoginPage() {
  return (
    <main className="min-h-screen bg-[#111111] px-4 py-8">
      <div className="page-shell grid min-h-screen place-items-center">
        <LoginForm
          role="KITCHEN"
          title="Acceso cocina"
          description="Panel operativo para ver tickets activos y actualizar estados de preparacion."
        />
      </div>
    </main>
  );
}
