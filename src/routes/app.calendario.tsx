import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DayButton } from "react-day-picker";
import { useMemo, useState, type ComponentProps } from "react";
import { AppShell } from "@/components/AppShell";
import { Calendar } from "@/components/ui/calendar";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { RecordCard } from "@/components/RecordCard";
import { RecordDetailDialog } from "@/components/RecordDetailDialog";
import { tipoLabel, type Child } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário — Filhômetro" },
      { name: "description", content: "Visualize os registros de saúde por dia." },
      { property: "og:title", content: "Calendário — Filhômetro" },
      { property: "og:description", content: "Visualize os registros de saúde por dia." },
    ],
  }),
  component: CalendarioPage,
});

type EventDay = {
  count: number;
  children: Child[];
};

function dateKey(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function CalendarioPage() {
  const { data, meusFilhos, toggleFavorito, removerRegistro, compartilharRegistro } = useStore();
  const navigate = useNavigate();
  const hoje = new Date();
  const hojeKey = dateKey(hoje);
  const [mes, setMes] = useState(hoje);
  const [selecionado, setSelecionado] = useState(hojeKey);
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [removerId, setRemoverId] = useState<string | null>(null);

  const ids = useMemo(() => new Set(meusFilhos.map((filho) => filho.id)), [meusFilhos]);
  const registros = data.records.filter((registro) => ids.has(registro.childId));
  const filhosPorId = useMemo(
    () => new Map(meusFilhos.map((filho) => [filho.id, filho])),
    [meusFilhos],
  );
  const eventosPorDia = useMemo(() => {
    const eventos = new Map<string, EventDay>();
    for (const registro of registros) {
      const chave = dateKey(new Date(registro.data));
      const evento = eventos.get(chave) ?? { count: 0, children: [] };
      const filho = filhosPorId.get(registro.childId);
      evento.count += 1;
      if (filho && !evento.children.some((item) => item.id === filho.id)) {
        evento.children.push(filho);
      }
      eventos.set(chave, evento);
    }
    return eventos;
  }, [filhosPorId, registros]);

  const registrosDoDia = registros
    .filter((registro) => dateKey(new Date(registro.data)) === selecionado)
    .sort((a, b) => +new Date(b.data) - +new Date(a.data));
  const dataSelecionada = new Date(`${selecionado}T12:00:00`);
  const diaFuturo = selecionado > hojeKey;

  return (
    <AppShell title="Calendário">
      <section className="rounded-xl border border-border bg-card p-3 sm:p-5">
        <Calendar
          mode="single"
          month={mes}
          onMonthChange={setMes}
          selected={dataSelecionada}
          onSelect={(date) => date && setSelecionado(dateKey(date))}
          modifiers={{
            comEvento: [...eventosPorDia.keys()].map((chave) => new Date(`${chave}T12:00:00`)),
          }}
          modifiersClassNames={{ comEvento: "font-semibold text-primary" }}
          components={{
            DayButton: (props) => <CalendarDayButton {...props} eventosPorDia={eventosPorDia} />,
          }}
          className="mx-auto w-full [--cell-size:3.8rem] sm:[--cell-size:4.5rem]"
        />
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" /> Dia com registros
          </span>
          <span>Hoje: {hoje.toLocaleDateString("pt-BR")}</span>
        </div>
      </section>

      <section className="mt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold capitalize">{formatDate(dataSelecionada)}</h2>
            <p className="text-sm text-muted-foreground">
              {registrosDoDia.length === 0
                ? "Nenhum registro neste dia."
                : `${registrosDoDia.length} registro(s) neste dia.`}
            </p>
          </div>
          <button
            type="button"
            disabled={diaFuturo}
            onClick={() => navigate({ to: "/app/novo", search: { data: selecionado } })}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Criar registro neste dia
          </button>
        </div>

        <div className="space-y-4">
          {registrosDoDia.map((registro) => (
            <RecordCard
              key={registro.id}
              registro={registro}
              filho={filhosPorId.get(registro.childId)}
              onFavoritar={() => toggleFavorito(registro.id)}
              onRemover={() => setRemoverId(registro.id)}
              onCompartilhar={() => {
                const post = compartilharRegistro(registro.id);
                if (!post) return;
                const url = `${window.location.origin}/compartilhar/${post.token}`;
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    `🩺 *Filhômetro*\n\n${tipoLabel[registro.tipo]}: ${registro.titulo}\n${url}`,
                  )}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              onAbrir={() => setAbertoId(registro.id)}
            />
          ))}
        </div>
      </section>

      <RecordDetailDialog
        registro={registrosDoDia.find((registro) => registro.id === abertoId) ?? null}
        filho={filhosPorId.get(
          registrosDoDia.find((registro) => registro.id === abertoId)?.childId ?? "",
        )}
        onClose={() => setAbertoId(null)}
      />
      <ConfirmationDialog
        open={removerId !== null}
        onOpenChange={(open) => !open && setRemoverId(null)}
        onConfirm={() => {
          if (removerId) removerRegistro(removerId);
          setRemoverId(null);
        }}
        description="Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita."
      />
    </AppShell>
  );
}

function CalendarDayButton({
  day,
  eventosPorDia,
  ...props
}: ComponentProps<typeof DayButton> & { eventosPorDia: Map<string, EventDay> }) {
  const evento = eventosPorDia.get(dateKey(day.date));

  return (
    <DayButton {...props} day={day} className="relative flex-col gap-0.5">
      <span>{day.date.getDate()}</span>
      {evento && (
        <span className="flex max-w-full items-center justify-center gap-0.5 overflow-hidden">
          <span className="rounded-full bg-primary px-1 text-[9px] leading-3 text-primary-foreground">
            {evento.count}
          </span>
          {evento.children.slice(0, 2).map((filho) => (
            <img
              key={filho.id}
              src={filho.foto}
              alt=""
              className="size-3 rounded-full object-cover"
            />
          ))}
        </span>
      )}
    </DayButton>
  );
}
