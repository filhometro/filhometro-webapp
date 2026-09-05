import { createFileRoute } from "@tanstack/react-router";
import { Activity, Baby, CircleUserRound, UserCheck, UserX } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { tipoLabel, type RecordType } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Filhômetro" },
      { name: "description", content: "Indicadores gerais do Filhômetro." },
      { property: "og:title", content: "Dashboard — Filhômetro" },
      { property: "og:description", content: "Indicadores gerais do Filhômetro." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useStore();
  const usuariosAtivos = data.users.filter((usuario) => usuario.ativo).length;
  const usuariosInativos = data.users.length - usuariosAtivos;
  const usuariosOnline = data.sessionId ? 1 : 0;
  const meninos = data.children.filter((filho) => filho.sexo === "masculino").length;
  const meninas = data.children.filter((filho) => filho.sexo === "feminino").length;
  const totalRegistros = data.records.length;

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={UserCheck} label="Usuários ativos" value={usuariosAtivos} />
        <MetricCard icon={UserX} label="Usuários inativos" value={usuariosInativos} />
        <MetricCard icon={CircleUserRound} label="Usuários online" value={usuariosOnline} />
        <MetricCard icon={Activity} label="Total de registros" value={totalRegistros} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Baby className="size-5 text-primary" />
            <h2 className="text-sm font-semibold">Filhos por sexo</h2>
          </div>
          <div className="mt-5 space-y-4">
            <ProgressRow label="Meninos" value={meninos} total={data.children.length} color="bg-blue-500" />
            <ProgressRow label="Meninas" value={meninas} total={data.children.length} color="bg-pink-500" />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            <h2 className="text-sm font-semibold">Registros por tipo</h2>
          </div>
          <div className="mt-5 space-y-4">
            {(Object.keys(tipoLabel) as RecordType[]).map((tipo) => {
              const quantidade = data.records.filter((registro) => registro.tipo === tipo).length;
              return (
                <ProgressRow
                  key={tipo}
                  label={tipoLabel[tipo]}
                  value={quantidade}
                  total={totalRegistros}
                  color="bg-primary"
                />
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <Icon className="size-5 text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </section>
  );
}

function ProgressRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value} ({percentage}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
