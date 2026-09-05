import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getSharedPost, type SharedPost } from "@/lib/sharing";
import { tipoLabel } from "@/lib/mock-data";

export const Route = createFileRoute("/compartilhar/$token")({
  head: () => ({
    meta: [
      { title: "Post compartilhado — Filhômetro" },
      { name: "description", content: "Um registro de saúde compartilhado pelo Filhômetro." },
    ],
  }),
  component: SharedPostPage,
});

function SharedPostPage() {
  const { token } = Route.useParams();
  const [post, setPost] = useState<SharedPost | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setPost(getSharedPost(token));
    setCarregando(false);
  }, [token]);

  if (carregando) return null;

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">Post indisponível</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Este link não existe ou o post não está disponível neste dispositivo.
          </p>
          <Link to="/" className="mt-5 inline-block text-sm text-primary hover:underline">
            Ir para o início
          </Link>
        </div>
      </div>
    );
  }

  const { record, child } = post;
  const anexos = [
    ...(record.imagem
      ? [{ id: "imagem-principal", nome: record.titulo, tipo: "imagem" as const, dados: record.imagem }]
      : []),
    ...(record.anexos ?? []),
  ];

  return (
    <div className="min-h-screen bg-secondary/40 px-4 py-6">
      <main className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-border bg-card">
        <header className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Filhômetro</span>
          <span className="ml-auto text-xs text-muted-foreground">Post compartilhado</span>
        </header>

        <div className="space-y-5 p-5">
          <div className="flex items-center gap-3">
            {child?.foto && (
              <img src={child.foto} alt={child.nome} className="size-10 rounded-full object-cover" />
            )}
            <div>
              <p className="text-sm font-medium">{child?.nome ?? "Registro de saúde"}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(record.data).toLocaleString("pt-BR")}
              </p>
            </div>
            <span className="ml-auto rounded-full bg-secondary px-2.5 py-1 text-xs">
              {tipoLabel[record.tipo]}
            </span>
          </div>

          <div>
            <h1 className="text-xl font-semibold">{record.titulo}</h1>
            {record.descricao && <p className="mt-2 text-sm text-muted-foreground">{record.descricao}</p>}
          </div>

          {(record.temperatura || record.medicamento) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {record.temperatura && (
                <span className="rounded-md bg-secondary px-2.5 py-1">
                  Temperatura: {record.temperatura} °C
                </span>
              )}
              {record.medicamento && (
                <span className="rounded-md bg-secondary px-2.5 py-1">
                  Medicação: {record.medicamento}
                </span>
              )}
            </div>
          )}

          {anexos.length > 0 && (
            <Carousel className="mx-8" opts={{ loop: anexos.length > 1 }}>
              <CarouselContent>
                {anexos.map((anexo) => (
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
                        <span className="break-all">{anexo.nome}</span>
                      </a>
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
              {anexos.length > 1 && (
                <>
                  <CarouselPrevious className="left-[-2.5rem]" />
                  <CarouselNext className="right-[-2.5rem]" />
                </>
              )}
            </Carousel>
          )}
        </div>
      </main>
    </div>
  );
}
