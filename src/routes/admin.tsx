import { createFileRoute } from "@tanstack/react-router";
import { UsuariosPage } from "./admin.usuarios";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Filhômetro" },
      { name: "description", content: "Gerenciamento de usuários do Filhômetro." },
      { property: "og:title", content: "Administração — Filhômetro" },
      { property: "og:description", content: "Gerenciamento de usuários do Filhômetro." },
    ],
  }),
  component: UsuariosPage,
});
