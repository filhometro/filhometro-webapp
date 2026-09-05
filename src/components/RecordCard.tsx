import { Bell, FileText, Heart, Paperclip, Share2, Thermometer, Trash2 } from "lucide-react";
import { tipoLabel, type Child, type HealthRecord } from "@/lib/mock-data";

function formatar(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecordCard({
  registro,
  filho,
  onFavoritar,
  onRemover,
  onCompartilhar,
  onAbrir,
}: {
  registro: HealthRecord;
  filho?: Child | undefined;
  onFavoritar: () => void;
  onRemover: () => void;
  onCompartilhar: () => void;
  onAbrir?: () => void;
}) {
  const anexos = registro.anexos ?? [];
  const capa = registro.imagem ?? anexos.find((a) => a.tipo === "imagem")?.dados;
  const pdfs = anexos.filter((a) => a.tipo === "pdf").length;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <button type="button" onClick={onAbrir} className="block w-full text-left">
        <header className="flex items-center gap-3 px-4 py-3">
          <img
            src={filho?.foto}
            alt={filho?.nome ?? "Criança"}
            className="size-9 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{filho?.nome ?? "Sem filho"}</p>
            <p className="text-xs text-muted-foreground">{formatar(registro.data)}</p>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
            {tipoLabel[registro.tipo]}
          </span>
        </header>

        {capa && (
          <img
            src={capa}
            alt={registro.titulo}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        )}

        <div className="space-y-2 px-4 pt-3">
          <h3 className="text-sm font-semibold">{registro.titulo}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{registro.descricao}</p>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {registro.temperatura && (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                <Thermometer className="size-3.5" /> {registro.temperatura} °C
              </span>
            )}
            {registro.medicamento && (
              <span className="rounded-md bg-secondary px-2 py-1">{registro.medicamento}</span>
            )}
            {registro.lembreteHoras ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-primary">
                <Bell className="size-3.5" /> Lembrete a cada {registro.lembreteHoras}h
              </span>
            ) : null}
            {anexos.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                <Paperclip className="size-3.5" /> {anexos.length} anexo(s)
              </span>
            )}
            {pdfs > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                <FileText className="size-3.5" /> {pdfs} PDF
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="flex items-center gap-4 px-4 pb-3 pt-2">
        <button
          onClick={onCompartilhar}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#25D366]"
        >
          <Share2 className="size-4" /> WhatsApp
        </button>
        <button
          onClick={onFavoritar}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <Heart className={`size-4 ${registro.favorito ? "fill-primary text-primary" : ""}`} />
          {registro.favorito ? "Favorito" : "Favoritar"}
        </button>
        <button
          onClick={onRemover}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" /> Excluir
        </button>
      </div>
    </article>
  );
}
