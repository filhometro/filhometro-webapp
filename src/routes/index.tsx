import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Filhômetro — registro de saúde dos seus filhos" },
      {
        name: "description",
        content:
          "Registre febre, medicações, consultas, receitas e fotos dos seus filhos em uma linha do tempo simples.",
      },
      { property: "og:title", content: "Filhômetro — registro de saúde dos seus filhos" },
      {
        property: "og:description",
        content: "Sintomas, medicações, lembretes e documentos das crianças em um só lugar.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url(https://files.ndeal.app/api/images/proxy?format=webp&quality=100&src=https://www.netdeal.com.br/api/images/producao.spayce.com.br/1774872690456_2024_05_09_edicasea_febre_e_um_dos_sintomas_mais_comuns_nesta_doenca_imagem_ground_picture_shutterstock_x1ahx4.jpg)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Filhômetro</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 pb-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          A saúde dos seus filhos, registrada do jeito simples
        </h1>
        <p className="mt-4 text-muted-foreground">
          Anote febre, medicações e consultas, guarde receitas e atestados e acompanhe tudo em uma
          linha do tempo.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Entrar
          </Link>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-4 text-center text-xs text-muted-foreground">
        Dados de demonstração — nenhuma informação real é armazenada.
      </footer>
    </div>
  );
}
