export type Anexo = {
  id: string;
  nome: string;
  tipo: "imagem" | "pdf";
  dados: string; // data URL
};

const MAX_LADO = 1200;

function lerComoDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.readAsDataURL(file);
  });
}

function comprimirImagem(dataUrl: string) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, MAX_LADO / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function arquivoParaAnexo(file: File): Promise<Anexo | null> {
  const ehImagem = file.type.startsWith("image/");
  const ehPdf = file.type === "application/pdf";
  if (!ehImagem && !ehPdf) return null;

  const bruto = await lerComoDataUrl(file);
  const dados = ehImagem ? await comprimirImagem(bruto) : bruto;

  return {
    id: Math.random().toString(36).slice(2, 9),
    nome: file.name || (ehImagem ? "foto.jpg" : "documento.pdf"),
    tipo: ehImagem ? "imagem" : "pdf",
    dados,
  };
}
