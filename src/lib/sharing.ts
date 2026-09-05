import { tipoLabel, type Child, type HealthRecord } from "@/lib/mock-data";

export type SharedPost = {
  token: string;
  record: HealthRecord;
  child: Child | null;
  createdAt: string;
};

const SHARED_POSTS_KEY = "filhometro:shared-posts";

function createToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function saveSharedPost(record: HealthRecord, child: Child | null) {
  const sharedPost: SharedPost = {
    token: createToken(),
    record: structuredClone(record),
    child: child ? structuredClone(child) : null,
    createdAt: new Date().toISOString(),
  };
  const saved = JSON.parse(localStorage.getItem(SHARED_POSTS_KEY) ?? "{}") as Record<
    string,
    SharedPost
  >;
  saved[sharedPost.token] = sharedPost;
  localStorage.setItem(SHARED_POSTS_KEY, JSON.stringify(saved));
  return sharedPost;
}

export function getSharedPost(token: string) {
  const saved = JSON.parse(localStorage.getItem(SHARED_POSTS_KEY) ?? "{}") as Record<
    string,
    SharedPost
  >;
  return saved[token] ?? null;
}

export function shareMessage(post: SharedPost, url: string) {
  const { record, child } = post;
  const quantidadeAnexos = (record.anexos?.length ?? 0) + (record.imagem ? 1 : 0);
  const tipoEmoji = {
    sintoma: "🌡️",
    medicacao: "💊",
    consulta: "🩺",
    documento: "📄",
    foto: "📸",
  }[record.tipo];
  const detalhes = [
    `👶 *${child?.nome ?? "Registro de saúde"}*`,
    `${tipoEmoji} *${tipoLabel[record.tipo]}*`,
    `📝 *${record.titulo}*`,
    `📅 ${new Date(record.data).toLocaleString("pt-BR")}`,
    record.descricao ? `\n💬 ${record.descricao}` : null,
    record.temperatura ? `🌡️ Temperatura: *${record.temperatura} °C*` : null,
    record.medicamento ? `💊 Medicação: *${record.medicamento}*` : null,
    quantidadeAnexos > 0
      ? `\n📎 ${quantidadeAnexos} ${quantidadeAnexos === 1 ? "anexo" : "anexos"} disponível${quantidadeAnexos === 1 ? "" : "eis"} no post`
      : null,
  ].filter((linha): linha is string => Boolean(linha));

  return [
    "🩺 *FILHÔMETRO*",
    "━━━━━━━━━━━━━━",
    ...detalhes,
    "",
    "🔗 *Ver post completo e anexos:*",
    url,
  ].join("\n");
}
