import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidEmail } from "@/lib/utils";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Filhômetro" },
      { name: "description", content: "Acesse sua conta do Filhômetro." },
      { property: "og:title", content: "Entrar — Filhômetro" },
      { property: "og:description", content: "Acesse sua conta do Filhômetro." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { entrar } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) return setErro("Informe um e-mail válido.");
    const u = entrar(email, senha);
    if (!u) return setErro("E-mail ou senha inválidos.");
    navigate({ to: u.role === "admin" ? "/admin" : "/app/linha" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm p-6">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Filhômetro</span>
        </Link>
        <h1 className="text-center text-lg font-semibold">Entrar</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
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
            <Label htmlFor="senha">Senha</Label>
            <PasswordInput
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
            Esqueci minha senha
          </Link>
          {erro && <p className="text-sm text-destructive">{erro}</p>}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
        <div className="mt-4 rounded-md bg-secondary p-3 text-xs text-muted-foreground">
          Acesso de teste — usuário: leonardo@email.com / 123456 · admin: admin@filhometro.com /
          123456
        </div>
      </div>
    </div>
  );
}
