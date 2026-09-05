import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { AttachmentPicker } from "@/components/AttachmentPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

          <div className="space-y-1.5">
            <Label htmlFor="lembrete">Lembrete a cada (horas)</Label>
            <Input
              id="lembrete"
              type="number"
              min={1}
              value={lembrete}
              onChange={(e) => setLembrete(e.target.value)}
              placeholder="6"
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar registro
          </Button>
        </form>
      )}
    </AppShell>
  );
}
