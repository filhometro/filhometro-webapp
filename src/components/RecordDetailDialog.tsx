import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { AttachmentPicker } from "@/components/AttachmentPicker";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Anexo } from "@/lib/files";
import { tipoLabel, type Child, type HealthRecord, type RecordType } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

const tipos = Object.keys(tipoLabel) as RecordType[];

export function RecordDetailDialog({
  registro,
  filho,
  onClose,
}: {
  registro: HealthRecord | null;
  filho?: Child | undefined;
  onClose: () => void;
}) {
  const { atualizarRegistro } = useStore();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<HealthRecord | null>(registro);

  useEffect(() => {
    setForm(registro);
    setEditando(false);
  }, [registro]);

  if (!registro || !form) return null;

  const anexos: Anexo[] = form.anexos ?? [];
  const visualizacoes = [
    ...(form.imagem
      ? [{ id: "imagem-principal", tipo: "imagem" as const, dados: form.imagem, nome: form.titulo }]
      : []),
    ...anexos,
  ];

  function salvar() {
    if (!form || !registro) return;
    atualizarRegistro(registro.id, {
      tipo: form.tipo,
      titulo: form.titulo,
      descricao: form.descricao,
      data: form.data,
      temperatura: form.temperatura,
      medicamento: form.medicamento,
      lembreteHoras: form.lembreteHoras,
      lembreteDias: form.lembreteDias,
      lembreteAtivo: form.lembreteAtivo,
      anexos: form.anexos,
    });
    setEditando(false);
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar registro" : form.titulo}</DialogTitle>
        </DialogHeader>

        {editando ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <div className="flex flex-wrap gap-2">
                {tipos.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, tipo: t })}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      form.tipo === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {tipoLabel[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ed-titulo">Título</Label>
              <Input
                id="ed-titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ed-desc">Descrição</Label>
              <Textarea
                id="ed-desc"
                rows={3}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ed-temp">Temperatura (°C)</Label>
                <Input
                  id="ed-temp"
                  value={form.temperatura ?? ""}
                  onChange={(e) => setForm({ ...form, temperatura: e.target.value || undefined })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ed-med">Medicação</Label>
                <Input
                  id="ed-med"
                  value={form.medicamento ?? ""}
                  onChange={(e) => setForm({ ...form, medicamento: e.target.value || undefined })}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-border bg-secondary/30 p-4">
              <div>
                <p className="text-sm font-semibold">Lembrete</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Frequência, duração e status do lembrete.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ed-lemb">A cada (horas)</Label>
                  <Input
                    id="ed-lemb"
                    type="number"
                    min={1}
                    value={form.lembreteHoras ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lembreteHoras: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ed-lemb-dias">Por (dias)</Label>
                  <Input
                    id="ed-lemb-dias"
                    type="number"
                    min={1}
                    value={form.lembreteDias ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lembreteDias: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                <div>
                  <Label htmlFor="ed-lemb-ativo">Status do lembrete</Label>
                  <p className="text-xs text-muted-foreground">
                    {form.lembreteAtivo ? "Ativo" : "Inativo"}
                  </p>
                </div>
                <Switch
                  id="ed-lemb-ativo"
                  checked={form.lembreteAtivo ?? false}
                  onCheckedChange={(checked) => setForm({ ...form, lembreteAtivo: checked })}
                  aria-label="Ativar lembrete"
                />
              </div>
            </div>

            <AttachmentPicker anexos={anexos} onChange={(a) => setForm({ ...form, anexos: a })} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={filho?.foto}
                alt={filho?.nome ?? "Criança"}
                className="size-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{filho?.nome ?? "Sem filho"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(form.data).toLocaleString("pt-BR")}
                </p>
              </div>
              <span className="ml-auto rounded-full bg-secondary px-2.5 py-1 text-xs">
                {tipoLabel[form.tipo]}
              </span>
            </div>

            {form.descricao && <p className="text-sm text-muted-foreground">{form.descricao}</p>}

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info
                titulo="Temperatura"
                valor={form.temperatura ? `${form.temperatura} °C` : "—"}
              />
              <Info titulo="Medicação" valor={form.medicamento ?? "—"} />
              <Info
                titulo="Lembrete"
                valor={
                  form.lembreteHoras
                    ? `A cada ${form.lembreteHoras}h${form.lembreteDias ? ` por ${form.lembreteDias} dias` : ""} (${form.lembreteAtivo ? "Ativo" : "Inativo"})`
                    : "—"
                }
              />
              <Info titulo="Favorito" valor={form.favorito ? "Sim" : "Não"} />
            </dl>

            {(anexos.length > 0 || form.imagem) && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Anexos</p>
                <Carousel className="mx-8" opts={{ loop: visualizacoes.length > 1 }}>
                  <CarouselContent>
                    {visualizacoes.map((anexo) => (
                      <CarouselItem key={anexo.id}>
                        {anexo.tipo === "imagem" ? (
                          <a href={anexo.dados} target="_blank" rel="noreferrer">
                            <img
                              src={anexo.dados}
                              alt={anexo.nome}
                              className="aspect-[4/3] w-full rounded-md border border-border object-contain"
                            />
                          </a>
                        ) : (
                          <a
                            href={anexo.dados}
                            target="_blank"
                            rel="noreferrer"
                            className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-md border border-border bg-secondary p-4 text-center text-sm text-muted-foreground"
                          >
                            <FileText className="size-10" />
                            <span className="max-w-full break-all">{anexo.nome}</span>
                          </a>
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {visualizacoes.length > 1 && (
                    <>
                      <CarouselPrevious className="left-[-2.5rem]" />
                      <CarouselNext className="right-[-2.5rem]" />
                    </>
                  )}
                </Carousel>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {editando ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(registro);
                  setEditando(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={salvar}>Salvar alterações</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button onClick={() => setEditando(true)}>Editar</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{titulo}</dt>
      <dd className="font-medium">{valor}</dd>
    </div>
  );
}
