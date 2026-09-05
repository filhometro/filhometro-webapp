import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Check, ClipboardList, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { RecordCard } from "@/components/RecordCard";
import { RecordDetailDialog } from "@/components/RecordDetailDialog";
import { tipoLabel, type RecordType } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { shareMessage } from "@/lib/sharing";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/linha")({
  head: () => ({
    meta: [
      { title: "Linha do tempo — Filhômetro" },
      { name: "description", content: "Todos os registros de saúde dos seus filhos em ordem." },
      { property: "og:title", content: "Linha do tempo — Filhômetro" },
      { property: "og:description", content: "Todos os registros de saúde dos seus filhos." },
    ],
  }),
  component: LinhaPage,
});

function LinhaPage() {
  const {
    data,
    meusFilhos,
    toggleFavorito,
    removerRegistro,
    compartilharRegistro,
    tourPendente,
    consumirTour,
  } = useStore();
  const [filtro, setFiltro] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState<RecordType | "todos">("todos");
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [removerId, setRemoverId] = useState<string | null>(null);
  const [tourAberto, setTourAberto] = useState(false);
  const [etapaTour, setEtapaTour] = useState(0);

  useEffect(() => {
    if (!tourPendente) return;
    setTourAberto(true);
    consumirTour();
  }, [consumirTour, tourPendente]);

  function fecharTour() {
    setTourAberto(false);
    setEtapaTour(0);
  }

  function aceitarMensagens() {
    const mensagem = encodeURIComponent(
      "🩺 *FILHÔMETRO*\n━━━━━━━━━━━━━━\n✅ *Aceite de comunicação*\n\nOlá! Aceito receber mensagens do Filhômetro pelo WhatsApp sobre:\n📰 Notícias\n⏰ Lembretes\n✨ Novidades\n\nAutorizo o envio dessas mensagens para este número.",
    );
    window.open(`https://wa.me/558594245460?text=${mensagem}`, "_blank", "noopener,noreferrer");
    fecharTour();
  }

  const ids = meusFilhos.map((c) => c.id);
  const registros = data.records
    .filter((r) => ids.includes(r.childId))
    .filter((r) => filtro === "todos" || r.childId === filtro)
    .filter((r) => filtroTipo === "todos" || r.tipo === filtroTipo)
    .sort((a, b) => +new Date(b.data) - +new Date(a.data));

  return (
    <AppShell title="Linha do tempo">
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
            Nenhum registro ainda.{" "}
            <Link to="/app/novo" className="text-primary hover:underline">
              Criar o primeiro
            </Link>
          </p>
        )}
      </div>

      <RecordDetailDialog
        registro={registros.find((r) => r.id === abertoId) ?? null}
        filho={meusFilhos.find((c) => c.id === registros.find((r) => r.id === abertoId)?.childId)}
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

      <Dialog open={tourAberto} onOpenChange={(open) => !open && fecharTour()}>
        <DialogContent className="overflow-hidden border-0 bg-card p-0 shadow-2xl sm:max-w-lg">
          <div className="bg-primary px-6 pb-7 pt-8 text-primary-foreground">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-foreground/15">
                {etapaTour === 0 ? (
                  <Sparkles className="size-6" />
                ) : etapaTour === 1 ? (
                  <ClipboardList className="size-6" />
                ) : (
                  <MessageCircle className="size-6" />
                )}
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-primary-foreground/75">
                Guia rápido · {etapaTour + 1}/3
              </span>
            </div>
            <DialogHeader className="text-primary-foreground">
              <DialogTitle className="text-2xl font-semibold text-primary-foreground">
                {etapaTour === 0
                  ? "Bem-vindo ao Filhômetro"
                  : etapaTour === 1
                    ? "Tudo organizado"
                    : "Fique por dentro"
                }
              </DialogTitle>
            </DialogHeader>
            <div className="mt-5 flex gap-1.5" aria-label={`Etapa ${etapaTour + 1} de 3`}>
              {[0, 1, 2].map((etapa) => (
                <span
                  key={etapa}
                  className={`h-1 flex-1 rounded-full ${
                    etapa <= etapaTour ? "bg-primary-foreground" : "bg-primary-foreground/25"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5 px-6 py-6">
            {etapaTour === 0 && (
              <>
                <p className="text-sm leading-6 text-muted-foreground">
                  Um espaço simples para acompanhar a saúde dos seus filhos com mais clareza e
                  tranquilidade.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <TourFeature icon={ClipboardList} title="Registre" text="Sintomas e cuidados" />
                  <TourFeature icon={CalendarDays} title="Acompanhe" text="Sua rotina por dia" />
                  <TourFeature icon={Sparkles} title="Organize" text="Tudo em um só lugar" />
                </div>
              </>
            )}
            {etapaTour === 1 && (
              <div className="space-y-3 text-sm leading-6 text-muted-foreground">
                <TourTip title="Novo registro" text="Anote sintomas, medicações, consultas, documentos e fotos." />
                <TourTip title="Linha do tempo" text="Consulte os registros, filtre por filho ou tipo e favorite o que importa." />
                <TourTip title="Calendário" text="Veja como foi o mês e crie registros para hoje ou datas passadas." />
              </div>
            )}
            {etapaTour === 2 && (
              <div className="rounded-2xl border border-[#25D366]/20 bg-[#25D366]/10 p-4">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">Aceite receber novidades</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Você poderá receber notícias, lembretes e novidades do Filhômetro pelo
                      WhatsApp. A conversa será aberta com o aceite já preenchido.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex-row justify-between gap-2 border-t border-border pt-4">
              <Button type="button" variant="ghost" onClick={fecharTour}>
                Agora não
              </Button>
              {etapaTour < 2 ? (
                <Button onClick={() => setEtapaTour((etapa) => etapa + 1)}>
                  Continuar <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={aceitarMensagens} className="bg-[#25D366] text-white hover:bg-[#20bd5a]">
                  <Check className="size-4" /> Aceito receber
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function TourFeature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Sparkles;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 p-3">
      <Icon className="size-4 text-primary" />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}

function TourTip({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-3">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p>{text}</p>
      </div>
    </div>
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
