import { useNavigate } from "@tanstack/react-router";
import { LogOut, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { ready, user, sair } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && (!user || user.role !== "admin")) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <p className="text-sm text-muted-foreground">Carregando área administrativa...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="size-5 text-primary" />
            <span className="font-semibold">Filhômetro · Admin</span>
          </div>
          <button
            onClick={() => {
              sair();
              navigate({ to: "/login", replace: true });
            }}
            aria-label="Sair"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-5 text-xl font-semibold">{title}</h1>
        {children}
      </main>

    </div>
  );
}
