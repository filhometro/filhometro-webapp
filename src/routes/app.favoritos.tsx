import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { RecordCard } from "@/components/RecordCard";
import { RecordDetailDialog } from "@/components/RecordDetailDialog";
import { tipoLabel, type RecordType } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { shareMessage } from "@/lib/sharing";

export const Route = createFileRoute("/app/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Filhômetro" },
      { name: "description", content: "Registros marcados como favoritos." },
      { property: "og:title", content: "Favoritos — Filhômetro" },
      { property: "og:description", content: "Registros marcados como favoritos." },
    ],
  }),
  component: FavoritosPage,
});

function FavoritosPage() {
  const { data, meusFilhos, toggleFavorito, removerRegistro, compartilharRegistro } = useStore();
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [removerId, setRemoverId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState<RecordType | "todos">("todos");
  const ids = meusFilhos.map((c) => c.id);
  const registros = data.records
    .filter(
      (r) =>
        ids.includes(r.childId) &&
        r.favorito &&
        (filtro === "todos" || r.childId === filtro) &&
        (filtroTipo === "todos" || r.tipo === filtroTipo),
    )
    .sort((a, b) => +new Date(b.data) - +new Date(a.data));

  const aberto = data.records.find((r) => r.id === abertoId) ?? null;

  return (
    <AppShell title="Favoritos">
      <div className="mb-4 space-y-2 overflow-x-auto">
        {meusFilhos.length > 1 && (
          <div className="flex gap-2">
            <FiltroBtn ativo={filtro === "todos"} onClick={() => setFiltro("todos")}>
              Todos os filhos
            </FiltroBtn>
            {meusFilhos.map((c) => (
              <FiltroBtn key={c.id} ativo={filtro === c.id} onClick={() => setFiltro(c.id)}>
                {c.nome}
              </FiltroBtn>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <FiltroBtn ativo={filtroTipo === "todos"} onClick={() => setFiltroTipo("todos")}>
            Todos os tipos
          </FiltroBtn>
          {Object.entries(tipoLabel).map(([tipo, label]) => (
            <FiltroBtn
              key={tipo}
              ativo={filtroTipo === tipo}
              onClick={() => setFiltroTipo(tipo as RecordType)}
            >
              {label}
            </FiltroBtn>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {registros.map((r) => (
          <RecordCard
            key={r.id}
            registro={r}
            filho={meusFilhos.find((c) => c.id === r.childId)}
            onFavoritar={() => toggleFavorito(r.id)}
            onRemover={() => setRemoverId(r.id)}
            onCompartilhar={() => {
              const post = compartilharRegistro(r.id);
              if (!post) return;
              const url = `${window.location.origin}/compartilhar/${post.token}`;
              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareMessage(post, url))}`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            onAbrir={() => setAbertoId(r.id)}
          />
        ))}
        {registros.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Você ainda não favoritou nenhum registro.
          </p>
        )}
      </div>

      <RecordDetailDialog
        registro={aberto}
        filho={meusFilhos.find((c) => c.id === aberto?.childId)}
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

function FiltroBtn({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
        ativo
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}
