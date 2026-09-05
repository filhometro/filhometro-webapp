import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { isValidEmail } from "@/lib/utils";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Filhômetro" },
      { name: "description", content: "Crie sua conta gratuita no Filhômetro." },
      { property: "og:title", content: "Criar conta — Filhômetro" },
      { property: "og:description", content: "Crie sua conta gratuita no Filhômetro." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const { cadastrar } = useStore();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) return setErro("Informe um e-mail válido.");
    if (senha.length < 6) return setErro("A senha precisa ter ao menos 6 caracteres.");
    if (senha !== confirmarSenha) return setErro("As senhas não coincidem.");
    const u = cadastrar(nome, email, whatsapp, senha);
    if (!u) return setErro("Já existe uma conta com esse e-mail.");
    navigate({ to: "/login" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Filhômetro</span>
        </div>
        <Link to="/" className="mb-4 inline-block text-sm text-primary hover:underline">
          Voltar para início
        </Link>
        <h1 className="text-lg font-semibold">Criar conta</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="senha">Senha</Label>
            <PasswordInput
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmar-senha">Confirmar senha</Label>
            <PasswordInput
              id="confirmar-senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>
          {erro && <p className="text-sm text-destructive">{erro}</p>}
          <Button type="submit" className="w-full">
            Cadastrar
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
