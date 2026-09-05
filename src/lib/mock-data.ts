export type Role = "admin" | "user";

export type User = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  senha: string;
  role: Role;
  ativo: boolean;
};

export type Child = {
  id: string;
  userId: string;
  nome: string;
  nascimento: string;
  sexo: "masculino" | "feminino";
  foto: string;
};

export type RecordType = "sintoma" | "medicacao" | "consulta" | "documento" | "foto";

export type HealthRecord = {
  id: string;
  childId: string;
  tipo: RecordType;
  data: string; // ISO
  titulo: string;
  descricao: string;
  temperatura?: string | undefined;
  medicamento?: string | undefined;
  imagem?: string | undefined;
  anexos?: import("./files").Anexo[] | undefined;
  favorito: boolean;
  lembreteHoras?: number | undefined;
};

export const tipoLabel: Record<RecordType, string> = {
  sintoma: "Sintoma",
  medicacao: "Medicação",
  consulta: "Consulta",
  documento: "Documento",
  foto: "Foto",
};

export const seedUsers: User[] = [
  {
    id: "u1",
    nome: "Administrador",
    email: "admin@filhometro.com",
    whatsapp: "11999990000",
    senha: "123456",
    role: "admin",
    ativo: true,
  },
  {
    id: "u2",
    nome: "Leonardo Anjos",
    email: "leonardo@email.com",
    whatsapp: "11999990001",
    senha: "123456",
    role: "user",
    ativo: true,
  },
  {
    id: "u3",
    nome: "Marina Costa",
    email: "marina@email.com",
    whatsapp: "11999990002",
    senha: "123456",
    role: "user",
    ativo: true,
  },
];

export const seedChildren: Child[] = [
  {
    id: "c1",
    userId: "u2",
    nome: "Sofia",
    nascimento: "2020-03-14",
    sexo: "feminino",
    foto: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=200&h=200&fit=crop",
  },
  {
    id: "c2",
    userId: "u2",
    nome: "Bento",
    nascimento: "2023-08-02",
    sexo: "masculino",
    foto: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=200&h=200&fit=crop",
  },
];

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const seedRecords: HealthRecord[] = [
  {
    id: "r1",
    childId: "c1",
    tipo: "sintoma",
    data: hoursAgo(3),
    titulo: "Febre à noite",
    descricao: "Acordou quente e com pouca disposição. Deu 38,7 °C às 22h.",
    temperatura: "38.7",
    favorito: false,
    lembreteHoras: 6,
  },
  {
    id: "r2",
    childId: "c1",
    tipo: "medicacao",
    data: hoursAgo(2),
    titulo: "Dipirona 500mg/mL",
    descricao: "15 gotas. Próxima dose somente após 6 horas.",
    medicamento: "Dipirona 15 gotas",
    favorito: true,
    lembreteHoras: 6,
  },
  {
    id: "r3",
    childId: "c1",
    tipo: "consulta",
    data: hoursAgo(30),
    titulo: "Consulta com Dra. Helena (pediatra)",
    descricao:
      "Três dias sem comer direito e febre persistente. Diagnóstico de faringite viral, repouso e hidratação.",
    imagem:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&h=700&fit=crop",
    favorito: true,
  },
  {
    id: "r4",
    childId: "c1",
    tipo: "documento",
    data: hoursAgo(29),
    titulo: "Receita médica",
    descricao: "Amoxicilina 250mg/5mL — 5 mL de 8 em 8 horas por 7 dias.",
    imagem:
      "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=900&h=700&fit=crop",
    favorito: false,
  },
  {
    id: "r5",
    childId: "c2",
    tipo: "foto",
    data: hoursAgo(70),
    titulo: "Primeiro dia na creche",
    descricao: "Sem sintomas, apenas registro do dia.",
    imagem:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&h=700&fit=crop",
    favorito: false,
  },
  {
    id: "r6",
    childId: "c2",
    tipo: "sintoma",
    data: hoursAgo(96),
    titulo: "Tosse seca",
    descricao: "Tosse durante a madrugada, sem febre.",
    temperatura: "36.6",
    favorito: false,
  },
];
