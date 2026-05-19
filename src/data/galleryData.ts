// ── Gallery Data — CONSUDES ───────────────────────────────────────────────
// Storage: Cloudflare R2 — bucket: consudes-assets
// CDN: https://cdn.consudes.leandrom.com.br
// Estrutura R2: gallery/{albumSlug}/cover.webp | 01.webp | 02.webp …
// Configurar VITE_MEDIA_BASE_URL em .env.production

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
  description: string;    // institucional (ES)
  category: GalleryCategory;
  tier: GalleryTier;
  coverFile: string | null;
  photoCount: number;     // total incluindo curadoria futura
  photos: GalleryPhoto[]; // fotos já curadas (subset do photoCount)
  featured?: boolean;     // destaque principal da página
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
    description:
      'Segunda edición de los Juegos Sudamericanos de Sordos. Participaron delegaciones de toda Sudamérica en el mayor evento del deporte sordo continental.',
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
    description:
      'Juegos Panamericanos de Sordos 2016. El álbum con el mejor registro fotográfico del acervo CONSUDES.',
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
    description:
      'Registro fotográfico profesional de un campeonato de ajedrez sordo. Las fotos de mayor resolución de todo el acervo histórico.',
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
    description:
      'Primera edición de los Juegos Sudamericanos de Sordos, realizada en Goiânia, Brasil. Un hito fundacional para el deporte sordo sudamericano.',
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
    description:
      'Edición 2018 de los Interclubes CONSUDES. El registro fotográfico más completo de la historia de los interclubes.',
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
    description:
      'Interclubes realizados en Chile. El álbum más extenso de la serie, con fotos de equipos, árbitros, pódios masculino y femenino.',
    category: 'interclubes',
    tier: 'T2',
    coverFile: '1.jpg',
    photoCount: 28,
    photos: [],
  },
  {
    slug: 'interclubes/2016-ic-ecuador-i',
    title: 'IC Ecuador I — 2016',
    year: 2016,
    city: null,
    country: 'Ecuador',
    description:
      'Primera edición de los Interclubes en Ecuador. Fotos de alta resolución del evento y afiche oficial.',
    category: 'interclubes',
    tier: 'T2',
    coverFile: '6.JPG',
    photoCount: 6,
    photos: [
      { filename: '6.JPG', isHero: true },
      { filename: '3.JPG', isHero: true },
      { filename: '5.JPG', isHero: true },
      { filename: '2_AFICHE.jpg', caption: 'Afiche oficial' },
      { filename: '1.JPG' },
      { filename: '2.JPG' },
    ],
  },
  {
    slug: 'assembleias/reunion-miembros',
    title: 'Reunión de Miembros',
    year: null,
    city: null,
    country: null,
    description:
      'Reunión de los miembros y directivos de la CONSUDES.',
    category: 'assembleias',
    tier: 'T2',
    coverFile: 'Gustavo.jpg',
    photoCount: 13,
    photos: [],
  },
  {
    slug: 'capacitacao/2016-gustavo-ecuador',
    title: 'Capacitación — Ecuador 2016',
    year: 2016,
    city: 'Quito',
    country: 'Ecuador',
    description:
      'Capacitación en Deporte Sordolímpico conducida por Gustavo Perazzolo en Quito, Ecuador.',
    category: 'capacitacao',
    tier: 'T2',
    coverFile: '1.JPG',
    photoCount: 10,
    photos: [],
  },
  {
    slug: 'futsal-feminino/i-futsal-femenino',
    title: 'I Futsal Femenino CONSUDES',
    year: null,
    city: null,
    country: null,
    description:
      'Primera edición del Campeonato de Futsal Femenino organizado por CONSUDES. Un hito histórico para el deporte femenino sordo.',
    category: 'futsal-feminino',
    tier: 'T2',
    coverFile: 'Chile.jpg',
    photoCount: 7,
    photos: [
      { filename: 'Chile.jpg', isHero: true, caption: 'Delegación Chile' },
      { filename: 'Brasil.jpg', isHero: true, caption: 'Delegación Brasil' },
      { filename: 'Argentina.jpg', caption: 'Delegación Argentina' },
      { filename: 'Plena_Asamblea.jpg', caption: 'Asamblea plena' },
      { filename: 'Asamblea.jpg' },
      { filename: 'Discurso_Pdte_en Asamblea.jpg', caption: 'Discurso del Presidente' },
      { filename: 'Miembros_en_Asamblea.jpg' },
    ],
  },
  {
    slug: 'interclubes/2017-ic',
    title: 'IC 2017',
    year: 2017,
    city: null,
    country: null,
    description:
      'Edición 2017 de los Interclubes CONSUDES con equipos masculinos y femeninos.',
    category: 'interclubes',
    tier: 'T2',
    coverFile: 'gral.jpg',
    photoCount: 13,
    photos: [
      { filename: 'gral.jpg', isHero: true, caption: 'Foto general — IC 2017' },
      { filename: 'ASAM_M.png' },
      { filename: 'ASG_M.png' },
      { filename: 'Cresor_M.png' },
      { filename: 'Trebol_M.jpg' },
      { filename: 'INTER_SMP_F.jpg' },
      { filename: 'APS_M.jpg' },
      { filename: 'AUDAZ_M.jpg' },
      { filename: 'INTER_SMP_M.jpg' },
      { filename: 'UnionF.jpg' },
      { filename: 'ASO_M.jpg' },
      { filename: 'CresorF.jpg' },
    ],
  },
  {
    slug: 'interclubes/2017-ic-ecuador-iii',
    title: 'IC Ecuador III — 2017',
    year: 2017,
    city: null,
    country: 'Ecuador',
    description:
      'Tercera edición de los Interclubes en Ecuador. Fotos de cámara digital del evento.',
    category: 'interclubes',
    tier: 'T2',
    coverFile: 'IMG_2109.JPG',
    photoCount: 8,
    photos: [
      { filename: 'IMG_2109.JPG', isHero: true },
      { filename: 'IMG_2127.JPG', isHero: true },
      { filename: 'IMG_2108.JPG' },
      { filename: 'IMG_2112.JPG' },
      { filename: 'IMG_2113.JPG' },
      { filename: 'IMG_2440.JPG' },
      { filename: 'img_4111.jpg' },
      { filename: 'IMG_2433.JPG' },
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
    description:
      'Primera edición documentada de los Interclubes CONSUDES, realizada en Asunción, Paraguay. Incluye cobertura de la prensa local.',
    category: 'interclubes',
    tier: 'T3',
    coverFile: 'diario.jpg',
    photoCount: 7,
    photos: [
      { filename: 'disrio2.jpg', isHero: true, caption: 'Cobertura de prensa — I Interclube 2005' },
      { filename: 'diario.jpg', isHero: true, caption: 'Diario — I Interclube 2005' },
      { filename: '6.jpg' },
      { filename: '5.jpg' },
      { filename: '3.jpg' },
      { filename: 'asamblea2005.jpg', caption: 'Asamblea 2005' },
      { filename: 'asam.jpg' },
    ],
  },
  {
    slug: 'interclubes/2012-ic',
    title: 'IC 2012',
    year: 2012,
    city: null,
    country: null,
    description:
      'Edición 2012 de los Interclubes CONSUDES. Registro fotográfico de los equipos participantes.',
    category: 'interclubes',
    tier: 'T3',
    coverFile: '17_ASOMA.JPG',
    photoCount: 6,
    photos: [],
  },
  {
    slug: 'assembleias/2017-xlviii-brasil',
    title: 'XLVIII Asamblea 2017',
    year: 2017,
    city: null,
    country: 'Brasil',
    description:
      'XLVIII Asamblea Ordinaria de la CONSUDES, realizada en Brasil.',
    category: 'assembleias',
    tier: 'T3',
    coverFile: '2.jpg',
    photoCount: 3,
    photos: [
      { filename: '2.jpg', isHero: true },
      { filename: '1.jpg' },
      { filename: '3.jpg' },
    ],
  },
  {
    slug: 'historico',
    title: 'Archivo Histórico',
    year: null,
    city: null,
    country: null,
    description:
      'Fotografías históricas de la CONSUDES: directivos, delegaciones y eventos (2000–2013).',
    category: 'historico',
    tier: 'T3',
    coverFile: 'DIRECTORIO.jpg',
    photoCount: 7,
    photos: [
      { filename: 'DIRECTORIO.jpg', isHero: true, caption: 'Directorio CONSUDES' },
      { filename: 'Goleadores.jpg', caption: 'Goleadores históricos' },
      { filename: 'Quienes2013.png', caption: 'CONSUDES 2013' },
      { filename: 'ASUNCION2001.jpg', caption: 'Asunción 2001' },
      { filename: '2000.jpg', caption: '2000' },
      { filename: 'Reunion_Caxias.jpg', caption: 'Reunión Caxias' },
      { filename: 'Fitxure2013.jpg', caption: 'Fixture 2013' },
    ],
  },
  {
    slug: 'historico/afiches',
    title: 'Afiches y Carteles',
    year: null,
    city: null,
    country: null,
    description:
      'Afiches oficiales de eventos históricos de la CONSUDES.',
    category: 'historico',
    tier: 'T3',
    coverFile: 'Afiche_Brasil_2014.jpg',
    photoCount: 4,
    photos: [
      { filename: 'Afiche_Brasil_2014.jpg', isHero: true, caption: 'Afiche I Juegos Sudamericanos' },
      { filename: 'Afiche_Sudamericanos_2013-01.jpg', isHero: true, caption: 'Afiche Juegos 2013' },
      { filename: 'Afiche_2012 copia.jpg', caption: 'Afiche IC 2012' },
      { filename: 'Afiche.jpg' },
    ],
  },
  {
    slug: 'ex-presidentes',
    title: 'Ex Presidentes CONSUDES',
    year: null,
    city: null,
    country: null,
    description:
      'Galería fotográfica de los ex presidentes de la CONSUDES.',
    category: 'historico',
    tier: 'T3',
    coverFile: 'Ex_Edith_Alicia_Libonati.jpg',
    photoCount: 7,
    photos: [
      { filename: 'Ex_Edith_Alicia_Libonati.jpg', isHero: true },
      { filename: 'EX_Cristina_Mongelos.jpg' },
      { filename: 'Ex_Libonatti.jpg' },
      { filename: 'Ex_Perrone.jpg' },
      { filename: 'Ex_Dellatorre.jpg' },
      { filename: 'Ex_Leon_Rodriguez.jpg' },
      { filename: 'Ex_Bonnassiolle.jpg' },
    ],
  },
  {
    slug: 'equipes',
    title: 'Equipos Afiliados',
    year: null,
    city: null,
    country: null,
    description:
      'Catálogo fotográfico de los equipos afiliados participantes en los Interclubes CONSUDES.',
    category: 'interclubes',
    tier: 'T3',
    coverFile: 'ASB.jpg',
    photoCount: 12,
    photos: [],
  },
  {
    slug: 'membros',
    title: 'Directivos CONSUDES',
    year: null,
    city: null,
    country: null,
    description:
      'Retratos de los miembros de la directiva de la CONSUDES.',
    category: 'historico',
    tier: 'T3',
    coverFile: 'FATIMA.jpg',
    photoCount: 6,
    photos: [
      { filename: 'FATIMA.jpg', isHero: true },
      { filename: 'Norby.JPG' },
      { filename: 'JC.jpg' },
      { filename: 'Deborah.jpeg' },
      { filename: 'Bonna.jpg' },
      { filename: 'Cachito.jpg' },
    ],
  },
  {
    slug: 'interclubes/2019-ic-ecuador',
    title: 'IC Ecuador 2019',
    year: 2019,
    city: null,
    country: 'Ecuador',
    description:
      'Interclubes en Ecuador, 2019.',
    category: 'interclubes',
    tier: 'T3',
    coverFile: '5.jpg',
    photoCount: 4,
    photos: [
      { filename: '5.jpg', isHero: true },
      { filename: '4.jpg' },
      { filename: '3.jpg' },
      { filename: '2.jpg' },
    ],
  },
];
