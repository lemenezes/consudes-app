export interface Standing {
  place?: number;
  club: string;
  country: string;
  note?: string;
}

export interface SportSection {
  sport: string;
  standings: Standing[];
  note?: string;
}

export interface Edition {
  year: number;
  roman: string;
  hostCountry: string;
  flag: string;
  title: string;
  dateText?: string;
  cityText?: string;
  sports: SportSection[];
  teams?: Array<{ name: string; country: string }>;
  relator?: string;
  pdfRelato?: string;
  pdfFixture?: string;
  note?: string;
  pending?: boolean;
}

export interface ChampionRecord {
  roman: string;
  year: number;
  first: { club: string; country: string };
  second: { club: string; country: string };
  third: { club: string; country: string };
}

export const editions: Edition[] = [
  {
    year: 2005,
    roman: 'I',
    hostCountry: 'Paraguay',
    flag: '🇵🇾',
    title: 'I Juegos Sudamericanos Interclubes 2005 — Paraguay',
    dateText: '10 al 14 de octubre de 2005',
    sports: [
      {
        sport: 'Futsal',
        standings: [
          { place: 1, club: 'ASPY', country: 'Paraguay' },
          { place: 2, club: 'ASAM', country: 'Argentina' },
          { place: 3, club: 'ASO', country: 'Argentina' },
          { place: 4, club: 'CRESOR', country: 'Chile' },
        ],
      },
    ],
    teams: [
      { name: 'ASPY', country: 'Paraguay' },
      { name: 'ASAM', country: 'Argentina' },
      { name: 'ASO', country: 'Argentina' },
      { name: 'CRESOR', country: 'Chile' },
      { name: 'CSPY', country: 'Paraguay' },
      { name: 'SOCUSOR', country: 'Chile' },
      { name: 'ASORCH', country: 'Chile' },
      { name: 'ASUR', country: 'Uruguay' },
    ],
    relator: 'Pedro Pablo Bonnassiolle',
  },
  {
    year: 2008,
    roman: 'II',
    hostCountry: 'Uruguay',
    flag: '🇺🇾',
    title: 'II Juegos Sudamericanos Interclubes 2008 — Uruguay',
    sports: [
      {
        sport: 'Futsal',
        standings: [
          { place: 1, club: 'ASSP', country: 'Brasil' },
          { place: 2, club: 'ASUR', country: 'Uruguay' },
          { place: 3, club: 'APS', country: 'Paraguay' },
          { place: 4, club: 'CSPY', country: 'Paraguay' },
        ],
      },
      {
        sport: 'Ajedrez',
        standings: [],
        note: 'Sin datos completos de clasificación en el registro enviado.',
      },
      {
        sport: 'Tenis de Mesa Masculino',
        standings: [],
        note: 'Sin datos completos de clasificación en el registro enviado.',
      },
      {
        sport: 'Tenis de Mesa Femenino',
        standings: [
          { place: 1, club: 'CRESOR', country: 'Chile', note: 'Diana Ramos' },
          { place: 2, club: '—', country: '—', note: 'Sin dato informado' },
        ],
      },
    ],
    relator: 'Daniel Perrone',
  },
  {
    year: 2010,
    roman: 'III',
    hostCountry: 'Paraguay',
    flag: '🇵🇾',
    title: 'III Juegos Sudamericanos Interclubes 2010 — Paraguay',
    sports: [
      {
        sport: 'Futsal',
        standings: [
          { place: 1, club: 'ASSP', country: 'Brasil' },
          { place: 2, club: 'SSRS', country: 'Brasil' },
          { place: 3, club: 'ADSSCRUZ', country: 'Bolivia' },
        ],
      },
      {
        sport: 'Ajedrez',
        standings: [
          { place: 1, club: 'ASSP', country: 'Brasil', note: 'Bruno Montanha' },
          { place: 2, club: 'UAS', country: 'Argentina', note: 'Daniel Levaggi' },
        ],
      },
      {
        sport: 'Tenis de Mesa Masculino',
        standings: [
          { place: 1, club: 'ASURJ', country: 'Brasil', note: 'Joao Wellington' },
          { place: 2, club: 'CSPY', country: 'Paraguay', note: 'Francisca Almada' },
        ],
      },
    ],
    relator: 'María Cristina Mongelós',
  },
  {
    year: 2012,
    roman: 'IV',
    hostCountry: 'Chile',
    flag: '🇨🇱',
    title: 'IV Juegos Sudamericanos Interclubes 2012 — Chile',
    sports: [],
    teams: [
      { name: 'SOCUSOR', country: 'Chile' },
      { name: 'CRESOR', country: 'Chile' },
      { name: 'AUDAZ', country: 'Chile' },
      { name: 'ASOMA', country: 'Uruguay' },
      { name: 'ASLP', country: 'Argentina' },
      { name: 'ASG', country: 'Brasil' },
    ],
    relator: 'Pedro Pablo Bonnassiolle',
    pdfRelato: '/docs/relato-interclubes-2012.pdf',
    pdfFixture: '/docs/fixture-interclubes-2012.pdf',
  },
  {
    year: 2016,
    roman: 'V',
    hostCountry: 'Ecuador',
    flag: '🇪🇨',
    title: 'V Torneo Sudamericano Interclubes 2016 — Ecuador',
    sports: [
      {
        sport: 'Futsal Femenino',
        standings: [
          { club: 'ASB', country: 'Brasil' },
          { club: 'GUEREROS', country: 'Ecuador' },
          { club: 'INTER SMP', country: 'Perú' },
          { club: 'LAS COBRAS', country: 'Perú' },
        ],
      },
      {
        sport: 'Futsal Masculino',
        standings: [
          { club: 'AGUILAS', country: 'Ecuador' },
          { club: 'ASB', country: 'Brasil' },
          { club: 'ASLP', country: 'Argentina' },
          { club: 'ASOCH', country: 'Chile' },
          { club: 'C.D. CAMPAZ', country: 'Colombia' },
          { club: 'INMACULADA CONCEPCION', country: 'Perú' },
          { club: 'INTER SMP', country: 'Perú' },
          { club: 'LSG', country: 'Ecuador' },
        ],
      },
    ],
    relator: 'Pedro Pablo Bonnassiolle',
  },
  {
    year: 2017,
    roman: 'VI',
    hostCountry: 'Chile',
    flag: '🇨🇱',
    title: 'VI Torneo Sudamericano Interclubes 2017 — Chile',
    sports: [
      {
        sport: 'Futsal Masculino',
        standings: [
          { club: 'APS', country: 'Paraguay' },
          { club: 'ASAM', country: 'Argentina' },
          { club: 'ASG', country: 'Brasil' },
          { club: 'ASO', country: 'Argentina' },
          { club: 'AUDAZ', country: 'Chile' },
          { club: 'CRESOR', country: 'Chile' },
          { club: 'INTER SMP', country: 'Perú' },
          { club: 'TREBOL', country: 'Perú' },
        ],
      },
      {
        sport: 'Futsal Femenino',
        standings: [
          { club: 'CRESOR', country: 'Chile' },
          { club: 'UNIÓN', country: 'Chile' },
          { club: 'INTER SMP', country: 'Perú' },
          { club: 'DIFA', country: '—' },
        ],
      },
    ],
    relator: 'Pedro Pablo Bonnassiolle',
  },
  {
    year: 2018,
    roman: 'VII',
    hostCountry: 'Brasil',
    flag: '🇧🇷',
    title: 'VII Torneo Sudamericano Interclubes 2018 — Brasil',
    sports: [
      {
        sport: 'Futsal Masculino',
        standings: [
          { club: 'ALVORADA', country: 'Brasil' },
          { club: 'ASG', country: 'Brasil' },
          { club: 'ASJF', country: 'Brasil' },
          { club: 'ASO', country: 'Argentina' },
          { club: 'ASOCH', country: 'Chile' },
          { club: 'ASSF', country: 'Argentina' },
          { club: 'CONCE', country: 'Chile' },
          { club: 'LSG', country: 'Ecuador' },
          { club: 'INTER SMP', country: 'Perú' },
          { club: 'ODESPAR', country: 'Paraguay' },
        ],
      },
      {
        sport: 'Futsal Femenino',
        standings: [
          { club: 'ASG', country: 'Brasil' },
          { club: 'ASB', country: 'Brasil' },
          { club: 'ASMG', country: 'Brasil' },
          { club: 'ODESPAR', country: 'Paraguay' },
        ],
      },
    ],
    relator: 'Pedro Pablo Bonnassiolle',
  },
  {
    year: 2020,
    roman: 'VIII',
    hostCountry: 'Argentina',
    flag: '🇦🇷',
    title: 'VIII Torneo Sudamericano Interclubes de Futsal — San Juan, Argentina',
    dateText: '21 al 31 de octubre de 2020',
    cityText: 'San Juan, Argentina',
    sports: [],
    note: 'Registro informativo publicado en el sitio anterior.',
  },
  {
    year: 2021,
    roman: 'IX',
    hostCountry: '—',
    flag: '🏳️',
    title: 'IX Torneo Sudamericano Interclubes 2021',
    sports: [],
    pending: true,
    note: 'Espacio reservado para resultados oficiales del torneo 2021.',
  },
];

export const championsM: ChampionRecord[] = [
  { roman: 'I', year: 2005, first: { club: 'ASPY', country: 'Paraguay' }, second: { club: 'ASAM', country: 'Argentina' }, third: { club: 'ASO', country: 'Argentina' } },
  { roman: 'II', year: 2008, first: { club: 'ASSP', country: 'Brasil' }, second: { club: 'ASUR', country: 'Uruguay' }, third: { club: 'APS', country: 'Paraguay' } },
  { roman: 'III', year: 2010, first: { club: 'ASSP', country: 'Brasil' }, second: { club: 'SSRS', country: 'Brasil' }, third: { club: 'ADSSCRUZ', country: 'Bolivia' } },
  { roman: 'IV', year: 2012, first: { club: 'SOCUSOR', country: 'Chile' }, second: { club: 'CRESOR', country: 'Chile' }, third: { club: 'ASG', country: 'Brasil' } },
  { roman: 'V', year: 2016, first: { club: 'ASB', country: 'Brasil' }, second: { club: 'L.S.G.', country: 'Ecuador' }, third: { club: 'CAMPAZ', country: 'Colombia' } },
  { roman: 'VI', year: 2017, first: { club: 'ASO', country: 'Argentina' }, second: { club: 'ASG', country: 'Brasil' }, third: { club: 'ASAM', country: 'Argentina' } },
  { roman: 'VII', year: 2018, first: { club: 'ALVORADA', country: 'Brasil' }, second: { club: 'ASB', country: 'Brasil' }, third: { club: 'L.S.G.', country: 'Ecuador' } },
];

export const championsF: ChampionRecord[] = [
  { roman: 'V', year: 2016, first: { club: 'ASB', country: 'Brasil' }, second: { club: 'G.D.S.', country: 'Ecuador' }, third: { club: 'C.D.S.L.', country: 'Perú' } },
  { roman: 'VI', year: 2017, first: { club: 'CRESOR', country: 'Chile' }, second: { club: 'INTER', country: 'Perú' }, third: { club: 'UNION', country: 'Chile' } },
  { roman: 'VII', year: 2018, first: { club: 'ASG', country: 'Brasil' }, second: { club: 'ASB', country: 'Brasil' }, third: { club: 'ASMG', country: 'Brasil' } },
];
