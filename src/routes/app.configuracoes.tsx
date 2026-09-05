import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, BarChart3, Mars, Pencil, Trash2, Venus } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AttachmentPicker } from "@/components/AttachmentPicker";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Anexo } from "@/lib/files";
import { useStore } from "@/lib/store";
import type { Child, HealthRecord } from "@/lib/mock-data";
import { isValidEmail } from "@/lib/utils";

export const Route = createFileRoute("/app/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Filhômetro" },
      { name: "description", content: "Gerencie seus filhos e sua conta no Filhômetro." },
      { property: "og:title", content: "Configurações — Filhômetro" },
      { property: "og:description", content: "Gerencie seus filhos e sua conta." },
    ],
  }),
  component: ConfigPage,
});

const fotoPadrao =
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop";

function ConfigPage() {
  const { user, data, meusFilhos, addFilho, atualizarFilho, removerFilho, salvarUsuario, sair } =
    useStore();
  const navigate = useNavigate();
  const [editandoConta, setEditandoConta] = useState(false);
  const [contaNome, setContaNome] = useState("");
  const [contaEmail, setContaEmail] = useState("");
  const [contaWhatsapp, setContaWhatsapp] = useState("");
  const [contaSenha, setContaSenha] = useState("");
  const [contaConfirmarSenha, setContaConfirmarSenha] = useState("");
  const [erroConta, setErroConta] = useState("");
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [sexo, setSexo] = useState<"masculino" | "feminino" | "">("");
  const [foto, setFoto] = useState<Anexo[]>([]);
  const [filhoEditandoId, setFilhoEditandoId] = useState<string | null>(null);
  const [removerFilhoId, setRemoverFilhoId] = useState<string | null>(null);
  const [estatisticasFilhoId, setEstatisticasFilhoId] = useState<string | null>(null);

  function limparFormulario() {
    setNome("");
    setNascimento("");
    setSexo("");
    setFoto([]);
    setFilhoEditandoId(null);
  }

  function editarFilho(id: string) {
    const filho = meusFilhos.find((c) => c.id === id);
    if (!filho) return;
    setNome(filho.nome);
    setNascimento(filho.nascimento);
    setSexo(filho.sexo ?? "");
    setFoto(
      filho.foto
        ? [
            {
              id: `foto-${filho.id}`,
              nome: `Foto de ${filho.nome}`,
              tipo: "imagem",
              dados: filho.foto,
            },
          ]
        : [],
    );
    setFilhoEditandoId(filho.id);
  }

  function iniciarEdicaoConta() {
    if (!user) return;
    setContaNome(user.nome);
    setContaEmail(user.email);
    setContaWhatsapp(user.whatsapp);
    setContaSenha(user.senha);
    setContaConfirmarSenha(user.senha);
    setErroConta("");
    setEditandoConta(true);
  }

  function salvarDadosConta(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!isValidEmail(contaEmail)) {
      setErroConta("Informe um e-mail válido.");
      return;
    }
    if (contaSenha.length < 6) {
      setErroConta("A senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (contaSenha !== contaConfirmarSenha) {
      setErroConta("As senhas não coincidem.");
      return;
    }
    salvarUsuario({
      id: user.id,
      nome: contaNome.trim(),
      email: contaEmail.trim(),
      whatsapp: contaWhatsapp.trim(),
      senha: contaSenha,
      role: user.role,
      ativo: user.ativo,
    });
    setEditandoConta(false);
  }

  function calcularIdade(dataNascimento: string) {
    const nascimento = new Date(`${dataNascimento}T00:00:00`);
    const hoje = new Date();
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    if (hoje.getDate() < nascimento.getDate()) meses -= 1;
    if (meses < 0) {
      anos -= 1;
      meses += 12;
    }
    if (anos > 0) return `${anos} ${anos === 1 ? "ano" : "anos"}`;
    return `${Math.max(meses, 0)} ${meses === 1 ? "mês" : "meses"}`;
  }

  return (
    <AppShell title="Configurações">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Minha conta</h2>
        {editandoConta ? (
          <form onSubmit={salvarDadosConta} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="conta-nome">Nome</Label>
                <Input
                  id="conta-nome"
                  value={contaNome}
                  onChange={(e) => setContaNome(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="conta-email">E-mail</Label>
                <Input
                  id="conta-email"
                  type="email"
                  value={contaEmail}
                  onChange={(e) => setContaEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="conta-whatsapp">WhatsApp</Label>
                <Input
                  id="conta-whatsapp"
                  type="tel"
                  value={contaWhatsapp}
                  onChange={(e) => setContaWhatsapp(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="conta-senha">Senha</Label>
                <PasswordInput
                  id="conta-senha"
                  value={contaSenha}
                  onChange={(e) => setContaSenha(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="conta-confirmar-senha">Confirmar senha</Label>
                <PasswordInput
                  id="conta-confirmar-senha"
                  value={contaConfirmarSenha}
                  onChange={(e) => setContaConfirmarSenha(e.target.value)}
                  required
                />
              </div>
            </div>
            {erroConta && <p className="text-sm text-destructive">{erroConta}</p>}
            <div className="flex gap-2">
              <Button type="submit">Salvar alterações</Button>
              <Button type="button" variant="outline" onClick={() => setEditandoConta(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.nome} · {user?.email}
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={iniciarEdicaoConta}>
                Editar dados
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  sair();
                  navigate({ to: "/login", replace: true });
                }}
              >
                Sair da conta
              </Button>
            </div>
          </>
        )}
      </section>

      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Meus filhos</h2>
        <ul className="mt-3 space-y-3">
          {meusFilhos.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <img src={c.foto} alt={c.nome} className="size-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{c.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(`${c.nascimento}T00:00:00`).toLocaleDateString("pt-BR")} {"·"}{" "}
                  {calcularIdade(c.nascimento)}
                </p>
              </div>
              {c.sexo === "masculino" ? (
                <Mars className="size-5 text-blue-600" aria-label="Menino" />
              ) : c.sexo === "feminino" ? (
                <Venus className="size-5 text-pink-500" aria-label="Menina" />
              ) : null}
              <button
                type="button"
                onClick={() => setEstatisticasFilhoId(c.id)}
                className="text-muted-foreground hover:text-primary"
                aria-label={`Ver estatísticas de ${c.nome}`}
              >
                <BarChart3 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => editarFilho(c.id)}
                className="text-muted-foreground hover:text-primary"
                aria-label={`Editar ${c.nome}`}
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setRemoverFilhoId(c.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remover ${c.nome}`}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
          {meusFilhos.length === 0 && (
            <li className="text-sm text-muted-foreground">Nenhum filho cadastrado.</li>
          )}
        </ul>

        <form
          className="mt-5 space-y-4 border-t border-border pt-5"
          onSubmit={(e) => {
            e.preventDefault();
            const dados = {
              nome,
              nascimento,
              sexo: sexo as "masculino" | "feminino",
              foto: foto[0]?.dados || fotoPadrao,
            };
            if (filhoEditandoId) atualizarFilho(filhoEditandoId, dados);
            else addFilho(dados.nome, dados.nascimento, dados.sexo, dados.foto);
            limparFormulario();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fnome">Nome</Label>
              <Input id="fnome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fnasc">Nascimento</Label>
              <Input
                id="fnasc"
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fsexo">Sexo</Label>
              <select
                id="fsexo"
                value={sexo}
                onChange={(e) => setSexo(e.target.value as "masculino" | "feminino")}
                required
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="masculino">Menino</option>
                <option value="feminino">Menina</option>
              </select>
            </div>
          </div>
          <AttachmentPicker
            anexos={foto}
            onChange={setFoto}
            max={1}
            apenasImagem
            label="Foto (opcional)"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="outline">
              {filhoEditandoId ? "Salvar alterações" : "Adicionar filho"}
            </Button>
            {filhoEditandoId && (
              <Button type="button" variant="ghost" onClick={limparFormulario}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </section>
      <ConfirmationDialog
        open={removerFilhoId !== null}
        onOpenChange={(open) => !open && setRemoverFilhoId(null)}
        onConfirm={() => {
          if (removerFilhoId) removerFilho(removerFilhoId);
          setRemoverFilhoId(null);
        }}
        title="Remover filho?"
        description="Tem certeza de que deseja remover este filho? Esta ação não pode ser desfeita."
      />
      <EstatisticasFilhoDialog
        filhoId={estatisticasFilhoId}
        filhos={meusFilhos}
        registros={data.records}
        onClose={() => setEstatisticasFilhoId(null)}
      />
    </AppShell>
  );
}

function EstatisticasFilhoDialog({
  filhoId,
  filhos,
  registros,
  onClose,
}: {
  filhoId: string | null;
  filhos: Child[];
  registros: HealthRecord[];
  onClose: () => void;
}) {
  const filho = filhos.find((item) => item.id === filhoId);
  if (!filho) return null;

  const registrosDoFilho = registros
    .filter((registro) => registro.childId === filho.id)
    .sort((a, b) => +new Date(b.data) - +new Date(a.data));
  const sintomas = registrosDoFilho.filter((registro) => registro.tipo === "sintoma");
  const medicacoes = registrosDoFilho.filter((registro) => registro.tipo === "medicacao");
  const meses = new Map<string, number>();

  for (const sintoma of sintomas) {
    const mes = new Date(sintoma.data).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    meses.set(mes, (meses.get(mes) ?? 0) + 1);
  }

  const mesMaisDoente = [...meses.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            Estatísticas de {filho.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Activity} label="Vezes que ficou doente" value={sintomas.length} />
            <StatCard icon={BarChart3} label="Registros totais" value={registrosDoFilho.length} />
          </div>

          <section className="rounded-lg border border-border bg-secondary/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mês com mais sintomas
            </p>
            <p className="mt-2 text-base font-semibold capitalize">
              {mesMaisDoente ? `${mesMaisDoente[0]} (${mesMaisDoente[1]})` : "Ainda não há dados"}
            </p>
          </section>

          <StatList
            title="3 últimas doenças"
            empty="Nenhum sintoma registrado."
            registros={sintomas.slice(0, 3)}
          />
          <StatList
            title="3 últimas medicações"
            empty="Nenhuma medicação registrada."
            registros={medicacoes.slice(0, 3)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <Icon className="size-4 text-primary" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function StatList({
  title,
  empty,
  registros,
}: {
  title: string;
  empty: string;
  registros: HealthRecord[];
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold">{title}</h3>
      {registros.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
          {registros.map((registro) => (
            <li key={registro.id} className="flex items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{registro.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(registro.data).toLocaleDateString("pt-BR")}
                </p>
              </div>
              {registro.medicamento && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {registro.medicamento}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
