// ── Gallery Data — CONSUDES ───────────────────────────────────────────────
// Storage: Cloudflare R2 — bucket: consudes-assets
// CDN: https://cdn.consudes.leandrom.com.br
// Estrutura R2: gallery/{albumSlug}/cover.webp | 01.webp | 02.webp …
// Configurar VITE_MEDIA_BASE_URL em .env.production

import type { Lang } from '../i18n/translations';

export const MEDIA_BASE =
  (import.meta.env as Record<string, string>).VITE_MEDIA_BASE_URL ?? '';

export function getPhotoUrl(albumSlug: string, filename: string): string {
  return `${MEDIA_BASE}/gallery/${albumSlug}/${filename}`;
}

// ─── Types ────────────────────────────────────────────────────────────────

export type GalleryTier = 'T1' | 'T2' | 'T3';

export type GalleryCategory =
  | 'interclubes'
  | 'juegos-sudamericanos'
  | 'assembleias'
  | 'panamdes'
  | 'capacitacao'
  | 'futsal-feminino'
  | 'historico';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'interclubes',
  'juegos-sudamericanos',
  'assembleias',
  'panamdes',
  'capacitacao',
  'futsal-feminino',
  'historico',
];

export interface GalleryPhoto {
  filename: string;
  caption?: string;
  isHero?: boolean;
}

export interface GalleryAlbum {
  slug: string;           // path em CONSUDES_ARCHIVE/photos/
  title: string;
  year: number | null;
  city: string | null;
  country: string | null;
  description: Record<Lang, string>;
  category: GalleryCategory;
  tier: GalleryTier;
  coverFile: string | null;
  coverPosition?: string;  // CSS object-position (default: 'center')
  photoCount: number;     // total incluindo curadoria futura
  photos: GalleryPhoto[]; // fotos já curadas (subset do photoCount)
  featured?: boolean;     // destaque principal da página
}

export function getDescription(album: GalleryAlbum, lang: Lang): string {
  return album.description[lang];
}

// ─── Álbuns ───────────────────────────────────────────────────────────────

export const galleryAlbums: GalleryAlbum[] = [
  // ════════════════════════════════════════════════════════
  //  TIER 1 — Destaques  (WebP processados — prontos para R2)
  // ════════════════════════════════════════════════════════
  {
    slug: 'juegos-sudamericanos/2019-juegos-ii',
    title: 'II Juegos Sudamericanos 2019',
    year: 2019,
    city: null,
    country: 'Ecuador',
    description: {
      es: 'Segunda edición de los Juegos Sudamericanos de Sordos. Participaron delegaciones de toda Sudamérica en el mayor evento del deporte sordo continental.',
      pt: 'Segunda edição dos Jogos Sul-Americanos de Surdos. Participaram delegações de toda a América do Sul no maior evento do esporte surdo continental.',
      en: 'Second edition of the South American Deaf Games. Delegations from across South America participated in the largest continental deaf sports event.',
    },
    category: 'juegos-sudamericanos',
    tier: 'T1',
    featured: true,
    coverFile: 'cover.webp',
    photoCount: 7,
    photos: [
      { filename: '01.webp', isHero: true, caption: 'Portada oficial — II Juegos Sudamericanos 2019' },
      { filename: '02.webp', isHero: true, caption: 'Delegación Argentina' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
    ],
  },
  {
    slug: 'panamdes/2016-panamdes',
    title: 'PANAMDES 2016',
    year: 2016,
    city: null,
    country: null,
    description: {
      es: 'Juegos Panamericanos de Sordos 2016. El álbum con el mejor registro fotográfico del acervo CONSUDES.',
      pt: 'Jogos Pan-Americanos de Surdos 2016. O álbum com o melhor registro fotográfico do acervo CONSUDES.',
      en: '2016 Pan American Deaf Games. The album with the finest photographic record in the CONSUDES collection.',
    },
    category: 'panamdes',
    tier: 'T1',
    coverFile: 'cover.webp',
    photoCount: 8,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp', isHero: true },
      { filename: '03.webp', isHero: true },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
    ],
  },
  {
    slug: 'historico/evento-ajedrez',
    title: 'Campeonato de Ajedrez',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Registro fotográfico profesional de un campeonato de ajedrez sordo. Las fotos de mayor resolución de todo el acervo histórico.',
      pt: 'Registro fotográfico profissional de um campeonato de xadrez surdo. As fotos de maior resolução de todo o acervo histórico.',
      en: 'Professional photographic record of a deaf chess championship. The highest-resolution photos in the entire historical archive.',
    },
    category: 'historico',
    tier: 'T1',
    coverFile: 'cover.webp',
    photoCount: 12,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp', isHero: true },
      { filename: '03.webp', isHero: true },
      { filename: '04.webp', isHero: true },
      { filename: '05.webp', isHero: true },
      { filename: '06.webp', isHero: true },
      { filename: '07.webp', caption: 'Campeón de Ajedrez' },
      { filename: '08.webp', caption: 'Vicecampeón de Ajedrez' },
      { filename: '09.webp' },
      { filename: '10.webp', caption: 'Afiche del campeonato' },
      { filename: '11.webp' },
      { filename: '12.webp' },
    ],
  },
  {
    slug: 'juegos-sudamericanos/2015-goiania',
    title: 'I Juegos Sudamericanos — Goiânia 2015',
    year: 2015,
    city: 'Goiânia',
    country: 'Brasil',
    description: {
      es: 'Primera edición de los Juegos Sudamericanos de Sordos, realizada en Goiânia, Brasil. Un hito fundacional para el deporte sordo sudamericano.',
      pt: 'Primeira edição dos Jogos Sul-Americanos de Surdos, realizada em Goiânia, Brasil. Um marco fundacional para o esporte surdo sul-americano.',
      en: 'First edition of the South American Deaf Games, held in Goiânia, Brazil. A founding milestone for South American deaf sport.',
    },
    category: 'juegos-sudamericanos',
    tier: 'T1',
    coverFile: 'cover.webp',
    photoCount: 13,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp', isHero: true },
      { filename: '03.webp', isHero: true },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
      { filename: '11.webp' },
      { filename: '12.webp' },
      { filename: '13.webp' },
    ],
  },
  {
    slug: 'interclubes/2018-ic',
    title: 'IC 2018',
    year: 2018,
    city: null,
    country: null,
    description: {
      es: 'Edición 2018 de los Interclubes CONSUDES. El registro fotográfico más completo de la historia de los interclubes.',
      pt: 'Edição 2018 dos Interclubes CONSUDES. O registro fotográfico mais completo da história dos interclubes.',
      en: '2018 edition of the CONSUDES Interclubs. The most complete photographic record in the history of the interclubs.',
    },
    category: 'interclubes',
    tier: 'T1',
    coverFile: 'cover.webp',
    photoCount: 19,
    photos: [
      { filename: '01.webp', isHero: true, caption: 'Foto general — IC 2018' },
      { filename: '02.webp', isHero: true, caption: 'Directivos CONSUDES' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
      { filename: '11.webp' },
      { filename: '12.webp' },
      { filename: '13.webp' },
      { filename: '14.webp' },
      { filename: '15.webp' },
      { filename: '16.webp' },
      { filename: '17.webp' },
      { filename: '18.webp' },
      { filename: '19.webp' },
    ],
  },

  // ════════════════════════════════════════════════════════
  //  TIER 2 — Galeria
  // ════════════════════════════════════════════════════════
  {
    slug: 'interclubes/ic-chile',
    title: 'IC Chile',
    year: null,
    city: null,
    country: 'Chile',
    description: {
      es: 'Interclubes realizados en Chile. El álbum más extenso de la serie, con fotos de equipos, árbitros, pódios masculino y femenino.',
      pt: 'Interclubes realizados no Chile. O álbum mais extenso da série, com fotos de equipes, árbitros e pódios masculino e feminino.',
      en: 'Interclubs held in Chile. The most extensive album in the series, featuring team photos, referees, and men\'s and women\'s podiums.',
    },
    category: 'interclubes',
    tier: 'T2',
    coverFile: '02.webp',
    photoCount: 28,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
      { filename: '11.webp', caption: 'Árbitros' },
      { filename: '12.webp', caption: 'Asamblea' },
      { filename: '13.webp' },
      { filename: '14.webp' },
      { filename: '15.webp' },
      { filename: '16.webp' },
      { filename: '17.webp', caption: 'Campeón masculino' },
      { filename: '18.webp', caption: 'Campeón femenino' },
      { filename: '19.webp' },
      { filename: '20.webp' },
      { filename: '21.webp' },
      { filename: '22.webp', caption: 'Subcampeón masculino' },
      { filename: '23.webp', caption: 'Subcampeón femenino' },
      { filename: '24.webp', caption: 'Tercer lugar masculino' },
      { filename: '25.webp', caption: 'Tercer lugar femenino' },
      { filename: '26.webp' },
      { filename: '27.webp' },
      { filename: '28.webp' },
    ],
  },
  {
    slug: 'interclubes/2016-ic-ecuador-i',
    title: 'IC Ecuador I — 2016',
    year: 2016,
    city: null,
    country: 'Ecuador',
    description: {
      es: 'Primera edición de los Interclubes en Ecuador. Fotos de alta resolución del evento y afiche oficial.',
      pt: 'Primeira edição dos Interclubes no Equador. Fotos em alta resolução do evento e cartaz oficial.',
      en: 'First edition of the Interclubs in Ecuador. High-resolution photos of the event and official poster.',
    },
    category: 'interclubes',
    tier: 'T2',
    coverFile: 'cover.webp',
    photoCount: 7,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp', isHero: true },
      { filename: '03.webp', isHero: true },
      { filename: '04.webp', caption: 'Afiche oficial' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
    ],
  },
  {
    slug: 'assembleias/reunion-miembros',
    title: 'Reunión de Miembros',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Reunión de los miembros y directivos de la CONSUDES.',
      pt: 'Reunião dos membros e diretores da CONSUDES.',
      en: 'Meeting of CONSUDES members and board of directors.',
    },
    category: 'assembleias',
    tier: 'T2',
    coverFile: '05.webp',
    photoCount: 13,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
      { filename: '11.webp' },
      { filename: '12.webp' },
      { filename: '13.webp' },
    ],
  },
  {
    slug: 'capacitacao/2016-gustavo-ecuador',
    title: 'Capacitación — Ecuador 2016',
    year: 2016,
    city: 'Quito',
    country: 'Ecuador',
    description: {
      es: 'Capacitación en Deporte Sordolímpico conducida por Gustavo Perazzolo en Quito, Ecuador.',
      pt: 'Capacitação em Esporte Surdolímpico conduzida por Gustavo Perazzolo em Quito, Equador.',
      en: 'Deaflympic Sport training conducted by Gustavo Perazzolo in Quito, Ecuador.',
    },
    category: 'capacitacao',
    tier: 'T2',
    coverFile: 'cover.webp',
    photoCount: 10,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
    ],
  },
  {
    slug: 'futsal-feminino/i-futsal-femenino',
    title: 'I Futsal Femenino CONSUDES',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Primera edición del Campeonato de Futsal Femenino organizado por CONSUDES. Un hito histórico para el deporte femenino sordo.',
      pt: 'Primeira edição do Campeonato de Futsal Feminino organizado pela CONSUDES. Um marco histórico para o esporte feminino surdo.',
      en: "First edition of the Women's Futsal Championship organized by CONSUDES. A historic milestone for women's deaf sport.",
    },
    category: 'futsal-feminino',
    tier: 'T2',
    coverFile: 'cover.webp',
    photoCount: 8,
    photos: [
      { filename: '01.webp', isHero: true, caption: 'Delegación Chile'       },
      { filename: '02.webp', isHero: true, caption: 'Delegación Brasil'      },
      { filename: '03.webp',               caption: 'Delegación Argentina'   },
      { filename: '04.webp',               caption: 'Asamblea plena'         },
      { filename: '05.webp' },
      { filename: '06.webp',               caption: 'Discurso del Presidente' },
      { filename: '07.webp' },
      { filename: '08.webp' },
    ],
  },
  {
    slug: 'interclubes/2017-ic',
    title: 'IC 2017',
    year: 2017,
    city: null,
    country: null,
    description: {
      es: 'Edición 2017 de los Interclubes CONSUDES con equipos masculinos y femeninos.',
      pt: 'Edição 2017 dos Interclubes CONSUDES com equipes masculinas e femininas.',
      en: '2017 edition of the CONSUDES Interclubs featuring men\'s and women\'s teams.',
    },
    category: 'interclubes',
    tier: 'T2',
    coverFile: '08.webp',
    photoCount: 12,
    photos: [
      { filename: '01.webp', isHero: true, caption: 'Foto general — IC 2017' },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
      { filename: '11.webp' },
      { filename: '12.webp' },
    ],
  },
  {
    slug: 'interclubes/2017-ic-ecuador-iii',
    title: 'IC Ecuador III — 2017',
    year: 2017,
    city: null,
    country: 'Ecuador',
    description: {
      es: 'Tercera edición de los Interclubes en Ecuador. Fotos de cámara digital del evento.',
      pt: 'Terceira edição dos Interclubes no Equador. Fotos de câmera digital do evento.',
      en: 'Third edition of the Interclubs in Ecuador. Digital camera photos from the event.',
    },
    category: 'interclubes',
    tier: 'T2',
    coverFile: 'cover.webp',
    photoCount: 8,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp', isHero: true },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
    ],
  },

  // ════════════════════════════════════════════════════════
  //  TIER 3 — Arquivo Histórico
  // ════════════════════════════════════════════════════════
  {
    slug: 'interclubes/2005-ic',
    title: 'IC 2005 — I Interclube',
    year: 2005,
    city: 'Asunción',
    country: 'Paraguay',
    description: {
      es: 'Primera edición documentada de los Interclubes CONSUDES, realizada en Asunción, Paraguay. Incluye cobertura de la prensa local.',
      pt: 'Primeira edição documentada dos Interclubes CONSUDES, realizada em Assunção, Paraguai. Inclui cobertura da imprensa local.',
      en: 'First documented edition of the CONSUDES Interclubs, held in Asunción, Paraguay. Includes local press coverage.',
    },
    category: 'interclubes',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 14,
    photos: [
      { filename: '01.webp', isHero: true, caption: 'Cobertura de prensa — I Interclube 2005' },
      { filename: '02.webp', isHero: true, caption: 'Diario — I Interclube 2005'              },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp', caption: 'Asamblea 2005' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
      { filename: '11.webp' },
      { filename: '12.webp' },
      { filename: '13.webp' },
      { filename: '14.webp' },
    ],
  },
  {
    slug: 'interclubes/2012-ic',
    title: 'IC 2012',
    year: 2012,
    city: null,
    country: null,
    description: {
      es: 'Edición 2012 de los Interclubes CONSUDES. Registro fotográfico de los equipos participantes.',
      pt: 'Edição 2012 dos Interclubes CONSUDES. Registro fotográfico das equipes participantes.',
      en: '2012 edition of the CONSUDES Interclubs. Photographic record of the participating teams.',
    },
    category: 'interclubes',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 6,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
    ],
  },
  {
    slug: 'assembleias/2017-xlviii-brasil',
    title: 'XLVIII Asamblea 2017',
    year: 2017,
    city: null,
    country: 'Brasil',
    description: {
      es: 'XLVIII Asamblea Ordinaria de la CONSUDES, realizada en Brasil.',
      pt: 'XLVIII Assembleia Ordinária da CONSUDES, realizada no Brasil.',
      en: 'XLVIII Ordinary General Assembly of CONSUDES, held in Brazil.',
    },
    category: 'assembleias',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 3,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
    ],
  },
  {
    slug: 'historico',
    title: 'Archivo Histórico',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Fotografías históricas de la CONSUDES: directivos, delegaciones y eventos (2000–2013).',
      pt: 'Fotografias históricas da CONSUDES: diretores, delegações e eventos (2000–2013).',
      en: 'Historical photographs of CONSUDES: board members, delegations, and events (2000–2013).',
    },
    category: 'historico',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 9,
    photos: [
      { filename: '01.webp', isHero: true, caption: 'Directorio CONSUDES'  },
      { filename: '02.webp',               caption: 'Goleadores históricos' },
      { filename: '03.webp',               caption: 'CONSUDES 2013'         },
      { filename: '04.webp',               caption: 'Asunción 2001'         },
      { filename: '05.webp',               caption: '2000'                  },
      { filename: '06.webp',               caption: 'Reunión Caxias'        },
      { filename: '07.webp',               caption: 'Fixture 2013'          },
      { filename: '08.webp' },
      { filename: '09.webp' },
    ],
  },
  {
    slug: 'historico/afiches',
    title: 'Afiches y Carteles',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Afiches oficiales de eventos históricos de la CONSUDES.',
      pt: 'Cartazes oficiais de eventos históricos da CONSUDES.',
      en: 'Official posters from historic CONSUDES events.',
    },
    category: 'historico',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 5,
    photos: [
      { filename: '01.webp', isHero: true, caption: 'Afiche I Juegos Sudamericanos' },
      { filename: '02.webp', isHero: true, caption: 'Afiche Juegos 2013'            },
      { filename: '03.webp',               caption: 'Afiche IC 2012'                },
      { filename: '04.webp',               caption: 'Afiche IC 2012 (v2)'           },
      { filename: '05.webp' },
    ],
  },
  {
    slug: 'ex-presidentes',
    title: 'Ex Presidentes CONSUDES',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Galería fotográfica de los ex presidentes de la CONSUDES.',
      pt: 'Galeria fotográfica dos ex-presidentes da CONSUDES.',
      en: 'Photo gallery of former CONSUDES presidents.',
    },
    category: 'historico',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 8,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
    ],
  },
  {
    slug: 'equipes',
    title: 'Equipos Afiliados',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Catálogo fotográfico de los equipos afiliados participantes en los Interclubes CONSUDES.',
      pt: 'Catálogo fotográfico das equipes filiadas participantes nos Interclubes CONSUDES.',
      en: 'Photographic catalogue of affiliated teams participating in the CONSUDES Interclubs.',
    },
    category: 'interclubes',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 12,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
      { filename: '07.webp' },
      { filename: '08.webp' },
      { filename: '09.webp' },
      { filename: '10.webp' },
      { filename: '11.webp' },
      { filename: '12.webp' },
    ],
  },
  {
    slug: 'membros',
    title: 'Directivos CONSUDES',
    year: null,
    city: null,
    country: null,
    description: {
      es: 'Retratos de los miembros de la directiva de la CONSUDES.',
      pt: 'Retratos dos membros da diretoria da CONSUDES.',
      en: 'Portraits of the CONSUDES board of directors members.',
    },
    category: 'historico',
    tier: 'T3',
    coverFile: '03.webp',
    coverPosition: 'center top',
    photoCount: 6,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp' },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
      { filename: '06.webp' },
    ],
  },
  {
    slug: 'interclubes/2019-ic-ecuador',
    title: 'IC Ecuador 2019',
    year: 2019,
    city: null,
    country: 'Ecuador',
    description: {
      es: 'Interclubes en Ecuador, 2019.',
      pt: 'Interclubes no Equador, 2019.',
      en: 'Interclubs in Ecuador, 2019.',
    },
    category: 'interclubes',
    tier: 'T3',
    coverFile: 'cover.webp',
    photoCount: 5,
    photos: [
      { filename: '01.webp', isHero: true },
      { filename: '02.webp', isHero: true },
      { filename: '03.webp' },
      { filename: '04.webp' },
      { filename: '05.webp' },
    ],
  },
];
