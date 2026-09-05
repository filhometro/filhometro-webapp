import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Heart, LayoutList, PlusCircle, Settings, Stethoscope, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

const menus = [
  { to: "/app/novo", label: "Novo", icon: PlusCircle },
  { to: "/app/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/app/linha", label: "Linha do tempo", icon: LayoutList },
  { to: "/app/favoritos", label: "Favoritos", icon: Heart },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, ready, sair } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) return null;

  return (
    <div className="min-h-screen bg-secondary/40 pb-20">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="size-5 text-primary" />
            <span className="text-base font-semibold">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link to="/admin/usuarios" className="text-sm text-primary hover:underline">
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                sair();
                navigate({ to: "/login", replace: true });
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Sair"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-background">
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          {menus.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <m.icon className="size-5" />
              {m.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
