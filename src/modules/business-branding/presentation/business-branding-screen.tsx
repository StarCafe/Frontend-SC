"use client";

import { useEffect, useMemo, useState } from "react";
import { Palette, Upload } from "lucide-react";
import {
  getBusinessBrandingUseCase,
  updateBusinessLogoUseCase,
  updateBusinessThemeUseCase,
} from "@/modules/business-branding/application/use-cases/business-branding.use-cases";
import { businessBrandingRepository } from "@/modules/business-branding/infrastructure/repositories/business-branding-http.repository";
import { useAuthGuard } from "@/modules/auth/presentation/hooks/use-auth-guard";
import { HttpError } from "@/shared/lib/api/http-client";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { Spinner } from "@/shared/components/ui/spinner";
import { useBusinessBrandingStore } from "@/shared/store/business-branding-store";
import { toast } from "sonner";

export function BusinessBrandingScreen() {
  const auth = useAuthGuard("ADMIN");
  const branding = useBusinessBrandingStore((state) => state.branding);
  const setBranding = useBusinessBrandingStore((state) => state.setBranding);
  const [loading, setLoading] = useState(true);
  const [savingTheme, setSavingTheme] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectedThemeKey, setSelectedThemeKey] = useState("");
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const themeOptions = useMemo(() => {
    if (!branding) {
      return [];
    }

    return branding.availableThemes.length
      ? branding.availableThemes
      : branding.themeKey
        ? [{ key: branding.themeKey, label: branding.themeKey }]
        : [];
  }, [branding]);

  async function loadBranding(token: string) {
    setLoading(true);

    try {
      const nextBranding = await getBusinessBrandingUseCase(businessBrandingRepository, token);
      setBranding(nextBranding);
      setSelectedThemeKey(nextBranding.themeKey || nextBranding.availableThemes[0]?.key || "");
    } catch (error) {
      const message =
        error instanceof HttpError ? error.message : "No se pudo cargar la configuracion de la cafetería.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }

    void loadBranding(auth.token);
  }, [auth]);

  useEffect(() => {
    if (!branding) {
      return;
    }

    setSelectedThemeKey(branding.themeKey || branding.availableThemes[0]?.key || "");
  }, [branding]);

  if (!auth) {
    return null;
  }

  const token = auth.token;

  async function handleThemeSave() {
    if (!selectedThemeKey) {
      toast.error("Selecciona un tema.");
      return;
    }

    setSavingTheme(true);

    try {
      await updateBusinessThemeUseCase(businessBrandingRepository, token, selectedThemeKey);
      await loadBranding(token);
      toast.success("Tema actualizado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo actualizar el tema.";
      toast.error(message);
    } finally {
      setSavingTheme(false);
    }
  }

  async function handleLogoSave() {
    if (!selectedLogo) {
      toast.error("Selecciona un archivo de logo.");
      return;
    }

    setUploadingLogo(true);

    try {
      await updateBusinessLogoUseCase(businessBrandingRepository, token, selectedLogo);
      setSelectedLogo(null);
      await loadBranding(token);
      toast.success("Logo actualizado");
    } catch (error) {
      const message = error instanceof HttpError ? error.message : "No se pudo actualizar el logo.";
      toast.error(message);
    } finally {
      setUploadingLogo(false);
    }
  }

  return (
    <div className="section-grid gap-5">
      <SectionHeading
        eyebrow="Branding"
        title="Ajustes por cafetería"
        description="Personaliza el tema y el logo de esta aplicación para la cafetería asociada a tu sesión."
      />

      {loading ? (
        <Card className="flex items-center gap-3 rounded-[24px] bg-white p-5">
          <Spinner />
          <span>Cargando ajustes...</span>
        </Card>
      ) : !branding ? (
        <EmptyState
          title="No se encontró branding"
          description="La cafetería no devolvió configuración visual desde el backend."
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-card)] sm:rounded-[30px]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-muted)]">Cafetería actual</p>
                <h3 className="text-2xl font-semibold text-[var(--color-ink)]">{branding.name}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Slug: {branding.slug || "Sin slug"}</p>
              </div>
              <div
                className="rounded-2xl px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: branding.primaryColor || "var(--color-primary)" }}
              >
                {branding.themeKey || "Tema actual"}
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-sm font-medium text-[var(--color-muted)]">Tema visual</p>
                <select
                  className="mt-3 h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-ink)]"
                  value={selectedThemeKey}
                  onChange={(event) => setSelectedThemeKey(event.target.value)}
                >
                  {themeOptions.map((theme) => (
                    <option key={theme.key} value={theme.key}>
                      {theme.label}
                    </option>
                  ))}
                </select>
                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <Palette className="h-4 w-4" />
                  <span>Color principal: {branding.primaryColor || "No definido"}</span>
                </div>
                <Button className="mt-4 w-full" disabled={savingTheme} onClick={handleThemeSave} type="button">
                  {savingTheme ? <Spinner /> : <Palette className="h-4 w-4" />}
                  Guardar tema
                </Button>
              </div>

              <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-sm font-medium text-[var(--color-muted)]">Logo de la cafetería</p>
                <div className="mt-3 flex h-44 items-center justify-center rounded-[22px] bg-white p-4">
                  {branding.logoUrl ? (
                    <img alt={branding.name} className="max-h-full max-w-full object-contain" src={branding.logoUrl} />
                  ) : (
                    <span className="text-sm text-[var(--color-muted)]">Todavía no hay logo cargado</span>
                  )}
                </div>
                <Input
                  className="mt-4"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setSelectedLogo(event.target.files?.[0] ?? null)}
                />
                <Button
                  className="mt-3 w-full"
                  disabled={!selectedLogo || uploadingLogo}
                  onClick={handleLogoSave}
                  type="button"
                >
                  {uploadingLogo ? <Spinner /> : <Upload className="h-4 w-4" />}
                  Actualizar logo
                </Button>
              </div>
            </div>
          </Card>

          <Card className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-card)] sm:rounded-[30px]">
            <h3 className="text-xl font-semibold text-[var(--color-ink)]">Vista previa</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Estos cambios afectan solo a la cafetería asociada a tu sesión de admin.
            </p>
            <div className="mt-5 rounded-[28px] bg-[var(--color-secondary)] p-5 text-white">
              <div className="flex items-center gap-3">
                {branding.logoUrl ? (
                  <img alt={branding.name} className="h-12 w-12 rounded-2xl object-cover" src={branding.logoUrl} />
                ) : (
                  <div
                    className="grid h-12 w-12 place-items-center rounded-2xl text-sm font-semibold text-white"
                    style={{ backgroundColor: branding.primaryColor || "var(--color-primary)" }}
                  >
                    {branding.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold">{branding.name}</p>
                  <p className="text-sm text-white/65">{branding.themeKey || "Tema actual"}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <div
                  className="rounded-2xl px-4 py-3 font-semibold text-white"
                  style={{ backgroundColor: branding.primaryColor || "var(--color-primary)" }}
                >
                  Botón principal
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/75">
                  Tarjeta secundaria
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
