import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { AttachmentPicker } from "@/components/AttachmentPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Anexo } from "@/lib/files";
import { tipoLabel, type RecordType } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/novo")({
  validateSearch: z.object({ data: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Novo registro — Filhômetro" },
      { name: "description", content: "Registre sintomas, medicações, consultas e documentos." },
      { property: "og:title", content: "Novo registro — Filhômetro" },
      { property: "og:description", content: "Registre sintomas, medicações e consultas." },
    ],
  }),
  component: NovoPage,
});

const tipos = Object.keys(tipoLabel) as RecordType[];

function NovoPage() {
  const { meusFilhos, addRegistro } = useStore();
  const navigate = useNavigate();
  const { data: dataInicial } = Route.useSearch();
  const [childId, setChildId] = useState("");
  const [tipo, setTipo] = useState<RecordType>("sintoma");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [medicamento, setMedicamento] = useState("");
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [lembrete, setLembrete] = useState("");
  const [lembreteDias, setLembreteDias] = useState("");
  const [lembreteAtivo, setLembreteAtivo] = useState(false);
  const [dataEvento, setDataEvento] = useState(() => {
    const hoje = new Date();
    const atual = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000);
    return dataInicial && dataInicial <= atual.toISOString().slice(0, 10)
      ? dataInicial
      : atual.toISOString().slice(0, 10);
  });
  const [erroData, setErroData] = useState("");

  const filhoSelecionado = childId || meusFilhos[0]?.id || "";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!filhoSelecionado) return;
    const hoje = new Date();
    const hojeLocal = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    if (dataEvento > hojeLocal) {
      setErroData("Só é possível criar registros para hoje ou datas passadas.");
      return;
    }
    addRegistro({
      childId: filhoSelecionado,
      tipo,
      data: new Date(`${dataEvento}T12:00:00`).toISOString(),
      titulo,
      descricao,
      temperatura: temperatura || undefined,
      medicamento: medicamento || undefined,
      anexos: anexos.length ? anexos : undefined,
      lembreteHoras: lembrete ? Number(lembrete) : undefined,
      lembreteDias: lembreteDias ? Number(lembreteDias) : undefined,
      lembreteAtivo: lembreteAtivo && Boolean(lembrete && lembreteDias),
    });
    navigate({ to: "/app/linha" });
  }

  return (
    <AppShell title="Novo registro">
      {meusFilhos.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Cadastre um filho em Configurações para começar.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label>Filho</Label>
            <div className="flex flex-wrap gap-2">
              {meusFilhos.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setChildId(c.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    filhoSelecionado === c.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {c.nome}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tipo de registro</Label>
            <div className="flex flex-wrap gap-2">
              {tipos.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    tipo === t
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
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Febre à tarde"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="data-evento">Data do evento</Label>
            <Input
              id="data-evento"
              type="date"
              value={dataEvento}
              max={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 10)}
              onChange={(e) => {
                setDataEvento(e.target.value);
                setErroData("");
              }}
              required
            />
            {erroData && <p className="text-sm text-destructive">{erroData}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="O que aconteceu, o que o médico disse, como a criança reagiu..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="temp">Temperatura (°C)</Label>
              <Input
                id="temp"
                value={temperatura}
                onChange={(e) => setTemperatura(e.target.value)}
                placeholder="38.2"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="med">Medicação</Label>
              <Input
                id="med"
                value={medicamento}
                onChange={(e) => setMedicamento(e.target.value)}
                placeholder="Dipirona 15 gotas"
              />
            </div>
          </div>

          <AttachmentPicker
            anexos={anexos}
            onChange={setAnexos}
            label="Anexos (receita, atestado, foto)"
          />

          <section className="space-y-4 rounded-lg border border-border bg-secondary/30 p-4">
            <div>
              <h2 className="text-sm font-semibold">Lembrete</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Configure a frequência e por quanto tempo deseja receber o lembrete.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lembrete">A cada (horas)</Label>
                <Input
                  id="lembrete"
                  type="number"
                  min={1}
                  value={lembrete}
                  onChange={(e) => setLembrete(e.target.value)}
                  placeholder="6"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lembrete-dias">Por (dias)</Label>
                <Input
                  id="lembrete-dias"
                  type="number"
                  min={1}
                  value={lembreteDias}
                  onChange={(e) => setLembreteDias(e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
              <div>
                <Label htmlFor="lembrete-ativo">Status do lembrete</Label>
                <p className="text-xs text-muted-foreground">
                  {lembreteAtivo ? "Ativo" : "Inativo"}
                </p>
              </div>
              <Switch
                id="lembrete-ativo"
                checked={lembreteAtivo}
                onCheckedChange={setLembreteAtivo}
                aria-label="Ativar lembrete"
              />
            </div>
          </section>

          <Button type="submit" className="w-full">
            Salvar registro
          </Button>
        </form>
      )}
    </AppShell>
  );
}
