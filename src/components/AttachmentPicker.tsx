import { FileText, Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";
import { arquivoParaAnexo, type Anexo } from "@/lib/files";

export function AttachmentPicker({
  anexos,
  onChange,
  max = 5,
  apenasImagem = false,
  label = "Anexos",
}: {
  anexos: Anexo[];
  onChange: (a: Anexo[]) => void;
  max?: number;
  apenasImagem?: boolean;
  label?: string;
}) {
  const arquivoRef = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState("");

  const accept = apenasImagem ? "image/*" : "image/*,application/pdf";
  const cheio = anexos.length >= max;

  async function receber(lista: FileList | null) {
    if (!lista?.length) return;
    setErro("");
    const espaco = max - anexos.length;
    const novos: Anexo[] = [];
    let invalido = false;

    for (const file of Array.from(lista).slice(0, espaco)) {
      const anexo = await arquivoParaAnexo(file);
      if (!anexo || (apenasImagem && anexo.tipo !== "imagem")) invalido = true;
      else novos.push(anexo);
    }

    if (invalido) setErro(apenasImagem ? "Envie apenas imagens." : "Envie apenas imagens ou PDF.");
    else if (lista.length > espaco) setErro(`Máximo de ${max} anexo(s).`);

    if (novos.length) onChange(apenasImagem ? novos.slice(0, 1) : [...anexos, ...novos]);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={cheio}
          onClick={() => arquivoRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm disabled:opacity-50"
        >
          <Paperclip className="size-4" /> Anexar do dispositivo
        </button>
      </div>

      <input
        ref={arquivoRef}
        type="file"
        accept={accept}
        multiple={!apenasImagem}
        className="hidden"
        onChange={(e) => {
          void receber(e.target.files);
          e.target.value = "";
        }}
      />
      {!apenasImagem && (
        <p className="text-xs text-muted-foreground">
          Imagens ou PDF · {anexos.length}/{max}
        </p>
      )}
      {erro && <p className="text-xs text-destructive">{erro}</p>}

      {anexos.length > 0 && (
        <ul className="flex flex-wrap gap-3 pt-1">
          {anexos.map((a) => (
            <li key={a.id} className="relative">
              {a.tipo === "imagem" ? (
                <img
                  src={a.dados}
                  alt={a.nome}
                  className="size-20 rounded-md border border-border object-cover"
                />
              ) : (
                <span className="flex size-20 flex-col items-center justify-center gap-1 rounded-md border border-border bg-secondary p-1 text-center text-[10px] text-muted-foreground">
                  <FileText className="size-5" />
                  <span className="line-clamp-2 break-all">{a.nome}</span>
                </span>
              )}
              <button
                type="button"
                aria-label={`Remover ${a.nome}`}
                onClick={() => onChange(anexos.filter((x) => x.id !== a.id))}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
