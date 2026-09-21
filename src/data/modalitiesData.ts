import type { Lang } from "../i18n/translations";

// Storage: Cloudflare R2 — pasta: modalities/
const MEDIA_BASE =
  import.meta.env.VITE_MEDIA_BASE_URL || "https://cdn.consudes.leandrom.com.br";

export interface LocalizedText {
  es: string;
  pt: string;
  en: string;
}

export interface Modality {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  categories: {
    male: boolean;
    female: boolean;
  };
  regulationUrl?: string;
}

export const modalities: Modality[] = [
  {
    slug: "baloncesto",
    name: {
      es: "Baloncesto",
      pt: "Basquete",
      en: "Basketball"
    },
    description: {
      es: "Modalidad de baloncesto para atletas sordos en las competiciones de CONSUDES.",
      pt: "Modalidade de basquete para atletas surdos nas competições da CONSUDES.",
      en: "Basketball for deaf athletes in CONSUDES competitions."
    },
    categories: {
      male: true,
      female: true
    },
    regulationUrl: `${MEDIA_BASE}/modalities/baloncesto-reglamento-tecnico-2026.pdf`
  },
  {
    slug: "futsal",
    name: {
      es: "Fútbol Sala",
      pt: "Futsal",
      en: "Futsal"
    },
    description: {
      es: "Modalidad de fútbol sala para atletas sordos en las competiciones de CONSUDES.",
      pt: "Modalidade de futsal para atletas surdos nas competições da CONSUDES.",
      en: "Futsal for deaf athletes in CONSUDES competitions."
    },
    categories: {
      male: true,
      female: false
    },
    regulationUrl: `${MEDIA_BASE}/modalities/futsal-sub21-reglamento-tecnico-2026.pdf`
  },
  {
    slug: "balonmano",
    name: {
      es: "Balonmano",
      pt: "Handebol",
      en: "Handball"
    },
    description: {
      es: "Modalidad de balonmano para atletas sordos en las competiciones de CONSUDES.",
      pt: "Modalidade de handebol para atletas surdos nas competições da CONSUDES.",
      en: "Handball for deaf athletes in CONSUDES competitions."
    },
    categories: {
      male: true,
      female: false
    },
    regulationUrl: `${MEDIA_BASE}/modalities/balonmano-reglamento-tecnico-2026.pdf`
  },
  {
    slug: "voleibol",
    name: {
      es: "Voleibol",
      pt: "Vôlei",
      en: "Volleyball"
    },
    description: {
      es: "Modalidad de voleibol de interior para atletas sordos.",
      pt: "Modalidade de vôlei de quadra para atletas surdos.",
      en: "Indoor volleyball for deaf athletes."
    },
    categories: {
      male: true,
      female: true
    },
    regulationUrl: `${MEDIA_BASE}/modalities/voleibol-reglamento-tecnico-2026.pdf`
  },
  {
    slug: "voleibol-playa",
    name: {
      es: "Voleibol de Playa",
      pt: "Vôlei de Praia",
      en: "Beach Volleyball"
    },
    description: {
      es: "Modalidad de voleibol de playa para atletas sordos.",
      pt: "Modalidade de vôlei de praia para atletas surdos.",
      en: "Beach volleyball for deaf athletes."
    },
    categories: {
      male: true,
      female: true
    },
    regulationUrl: `${MEDIA_BASE}/modalities/voleibol-playa-reglamento-tecnico-2026.pdf`
  }
];

export function getModalityName(modality: Modality, lang: Lang): string {
  return modality.name[lang];
}

export function getModalityDescription(modality: Modality, lang: Lang): string {
  return modality.description[lang];
}
