import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  seedChildren,
  seedRecords,
  seedUsers,
  type Child,
  type HealthRecord,
  type User,
} from "./mock-data";
import { saveSharedPost, type SharedPost } from "./sharing";

type Data = {
  users: User[];
  children: Child[];
  records: HealthRecord[];
  sessionId: string | null;
};

export type AppToast = {
  id: number;
  message: string;
};

const KEY = "filhometro:data";

const initialData: Data = {
  users: seedUsers,
  children: seedChildren,
  records: seedRecords,
  sessionId: null,
};

type Ctx = {
  ready: boolean;
  data: Data;
  user: User | null;
  meusFilhos: Child[];
  tourPendente: boolean;
  toast: AppToast | null;
  consumirTour: () => void;
  mostrarToast: (message: string) => void;
  fecharToast: () => void;
  entrar: (email: string, senha: string) => User | null;
  cadastrar: (nome: string, email: string, whatsapp: string, senha: string) => User | null;
  redefinirSenha: (email: string, senha: string) => boolean;
  sair: () => void;
  addFilho: (nome: string, nascimento: string, sexo: Child["sexo"], foto: string) => void;
  atualizarFilho: (id: string, dados: Partial<Omit<Child, "id" | "userId">>) => void;
  removerFilho: (id: string) => void;
  addRegistro: (r: Omit<HealthRecord, "id" | "favorito">) => void;
  atualizarRegistro: (id: string, r: Partial<HealthRecord>) => void;
  compartilharRegistro: (id: string) => SharedPost | null;
  removerRegistro: (id: string) => void;
  toggleFavorito: (id: string) => void;
  salvarUsuario: (u: Omit<User, "id"> & { id?: string | undefined }) => void;
  removerUsuario: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 9);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(initialData);
  const [ready, setReady] = useState(false);
  const [tourPendente, setTourPendente] = useState(false);
  const [toast, setToast] = useState<AppToast | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData({ ...initialData, ...JSON.parse(raw) });
    } catch {
      /* ignora */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(data));
  }, [data, ready]);

  const user = useMemo(
    () => data.users.find((u) => u.id === data.sessionId) ?? null,
    [data.users, data.sessionId],
  );

  const meusFilhos = useMemo(
    () => (user ? data.children.filter((c) => c.userId === user.id) : []),
    [data.children, user],
  );

  const entrar = useCallback(
    (email: string, senha: string) => {
      const found = data.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha && u.ativo,
      );
      if (found) {
        setData((d) => ({ ...d, sessionId: found.id }));
        setTourPendente(found.role !== "admin");
      }
      return found ?? null;
    },
    [data.users],
  );

  const consumirTour = useCallback(() => setTourPendente(false), []);
  const mostrarToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);
  const fecharToast = useCallback(() => setToast(null), []);

  const cadastrar = useCallback(
    (nome: string, email: string, whatsapp: string, senha: string) => {
      if (data.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) return null;
      const novo: User = {
        id: uid(),
        nome,
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        senha,
        role: "user",
        ativo: true,
      };
      setData((d) => ({ ...d, users: [...d.users, novo], sessionId: null }));
      return novo;
    },
    [data.users],
  );

  const redefinirSenha = useCallback(
    (email: string, senha: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!data.users.some((u) => u.email.toLowerCase() === normalizedEmail)) return false;
      setData((d) => ({
        ...d,
        users: d.users.map((u) =>
          u.email.toLowerCase() === normalizedEmail ? { ...u, senha } : u,
        ),
      }));
      return true;
    },
    [data.users],
  );

  const value: Ctx = {
    ready,
    data,
    user,
    meusFilhos,
    tourPendente,
    toast,
    consumirTour,
    mostrarToast,
    fecharToast,
    entrar,
    cadastrar,
    redefinirSenha,
    sair: () => setData((d) => ({ ...d, sessionId: null })),
    addFilho: (nome, nascimento, sexo, foto) => {
      setData((d) => ({
        ...d,
        children: [
          ...d.children,
          { id: uid(), userId: d.sessionId ?? "", nome, nascimento, sexo, foto },
        ],
      }));
      mostrarToast("Filho criado com sucesso.");
    },
    atualizarFilho: (id, dados) => {
      setData((d) => ({
        ...d,
        children: d.children.map((c) => (c.id === id ? { ...c, ...dados } : c)),
      }));
      mostrarToast("Dados do filho atualizados.");
    },
    removerFilho: (id) => {
      setData((d) => ({
        ...d,
        children: d.children.filter((c) => c.id !== id),
        records: d.records.filter((r) => r.childId !== id),
      }));
      mostrarToast("Filho excluído com sucesso.");
    },
    addRegistro: (r) => {
      setData((d) => ({ ...d, records: [{ ...r, id: uid(), favorito: false }, ...d.records] }));
      mostrarToast("Registro criado com sucesso.");
    },
    atualizarRegistro: (id, patch) => {
      setData((d) => ({
        ...d,
        records: d.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      }));
      mostrarToast("Registro atualizado.");
    },
    compartilharRegistro: (id) => {
      const record = data.records.find((r) => r.id === id);
      if (!record) return null;
      const child = data.children.find((c) => c.id === record.childId) ?? null;
      return saveSharedPost(record, child);
    },
    removerRegistro: (id) => {
      setData((d) => ({ ...d, records: d.records.filter((r) => r.id !== id) }));
      mostrarToast("Registro excluído com sucesso.");
    },
    toggleFavorito: (id) => {
      const registro = data.records.find((r) => r.id === id);
      if (!registro) return;
      setData((d) => ({
        ...d,
        records: d.records.map((r) => (r.id === id ? { ...r, favorito: !r.favorito } : r)),
      }));
      mostrarToast(registro.favorito ? "Registro removido dos favoritos." : "Registro favoritado.");
    },
    salvarUsuario: (u) => {
      setData((d) =>
        u.id
          ? { ...d, users: d.users.map((x) => (x.id === u.id ? ({ ...x, ...u } as User) : x)) }
          : { ...d, users: [...d.users, { ...u, id: uid() } as User] },
      );
      mostrarToast(u.id ? "Dados do usuário atualizados." : "Usuário criado com sucesso.");
    },
    removerUsuario: (id) => {
      setData((d) => ({
        ...d,
        users: d.users.filter((u) => u.id !== id),
        children: d.children.filter((c) => c.userId !== id),
      }));
      mostrarToast("Usuário excluído com sucesso.");
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}
