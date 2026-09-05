import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Role, User } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários — Filhômetro" },
      { name: "description", content: "Gerenciamento de usuários do Filhômetro." },
      { property: "og:title", content: "Usuários — Filhômetro" },
      { property: "og:description", content: "Gerenciamento de usuários do Filhômetro." },
    ],
  }),
  component: UsuariosPage,
});

const vazio = { nome: "", email: "", senha: "", role: "user" as Role, ativo: true };

export function UsuariosPage() {
  const { user, data, salvarUsuario, removerUsuario } = useStore();
  const [form, setForm] = useState<{ id?: string } & typeof vazio>(vazio);
  const [removerUsuarioId, setRemoverUsuarioId] = useState<string | null>(null);

  function editar(usuario: User) {
    setForm({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      role: usuario.role,
      ativo: usuario.ativo,
    });
  }

  return (
    <AdminShell title="Usuários">
      <div className="space-y-5">
        <section className="rounded-xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {data.users.map((usuario) => (
              <li key={usuario.id} className="flex items-center gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{usuario.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">{usuario.email}</p>
                </div>
                <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                  {usuario.role === "admin" ? "Admin" : "Usuário"}
                </span>
                <span className={`text-xs ${usuario.ativo ? "text-primary" : "text-muted-foreground"}`}>
                  {usuario.ativo ? "Ativo" : "Inativo"}
                </span>
                <button type="button" onClick={() => editar(usuario)} aria-label={`Editar ${usuario.nome}`}>
                  <Pencil className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={() => setRemoverUsuarioId(usuario.id)}
                  disabled={usuario.id === user?.id}
                  aria-label={`Remover ${usuario.nome}`}
                  className="disabled:opacity-30"
                >
                  <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">{form.id ? "Editar usuário" : "Novo usuário"}</h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              salvarUsuario(form);
              setForm(vazio);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="anome">Nome</Label>
                <Input id="anome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aemail">E-mail</Label>
                <Input id="aemail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="asenha">Senha</Label>
                <PasswordInput id="asenha" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="arole">Perfil</Label>
                <select id="arole" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="user">Usuário</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
              Usuário ativo
            </label>
            <div className="flex gap-2">
              <Button type="submit">{form.id ? "Salvar alterações" : "Criar usuário"}</Button>
              {form.id && <Button type="button" variant="outline" onClick={() => setForm(vazio)}>Cancelar</Button>}
            </div>
          </form>
        </section>
      </div>

      <ConfirmationDialog
        open={removerUsuarioId !== null}
        onOpenChange={(open) => !open && setRemoverUsuarioId(null)}
        onConfirm={() => {
          if (removerUsuarioId) removerUsuario(removerUsuarioId);
          setRemoverUsuarioId(null);
        }}
        title="Remover usuário?"
        description="Tem certeza de que deseja remover este usuário? Esta ação não pode ser desfeita."
      />
    </AdminShell>
  );
}
