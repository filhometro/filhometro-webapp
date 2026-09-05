import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidEmail } from "@/lib/utils";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({
    meta: [
      { title: "Esqueci minha senha — Filhômetro" },
      { name: "description", content: "Solicite a recuperação da sua senha do Filhômetro." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!sucesso) return;
    const timer = window.setTimeout(() => navigate({ to: "/" }), 2500);
    return () => window.clearTimeout(timer);
  }, [navigate, sucesso]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setErro("Informe um e-mail válido.");
      return;
    }
    setErro("");
    setSucesso(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Filhômetro</span>
        </div>
        <Link to="/" className="mb-4 inline-block text-sm text-primary hover:underline">
          Voltar para início
        </Link>
        <h1 className="text-lg font-semibold">Esqueci minha senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Informe seu e-mail para receber as instruções de recuperação.
        </p>

        {sucesso ? (
          <p className="mt-5 rounded-md bg-primary/10 p-3 text-sm text-primary">
            E-mail enviado com sucesso. Você receberá as instruções para recuperar sua senha.
            <br />
            Você será redirecionado para a página inicial.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email-recuperacao">E-mail</Label>
              <Input
                id="email-recuperacao"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {erro && <p className="text-sm text-destructive">{erro}</p>}
            <Button type="submit" className="w-full">
              Enviar instruções
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
