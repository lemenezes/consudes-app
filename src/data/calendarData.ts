export type EventType =
  | 'championship'
  | 'interclubs'
  | 'congress'
  | 'assembly'
  | 'institutional';

export type EventStatus =
  | 'upcoming'
  | 'registrationsOpen'
  | 'confirmed'
  | 'finished';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;
  country: string;
  city: string;
  sport?: string;
  type: EventType;
  status: EventStatus;
  description: string;
  federation?: string;
  link?: string;
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Campeonato Sul-Americano de Natação',
    startDate: '2026-03-10',
    endDate: '2026-03-15',
    country: 'Brasil',
    city: 'São Paulo',
    sport: 'Natação',
    type: 'championship',
    status: 'finished',
    description:
      'Competição continental de natação para atletas surdos, com representação de todas as federações afiliadas à CONSUDES.',
    federation: 'CBDS',
  },
  {
    id: '2',
    title: 'Interclubes Sul-Americano de Futsal',
    startDate: '2026-05-20',
    endDate: '2026-05-25',
    country: 'Argentina',
    city: 'Buenos Aires',
    sport: 'Futsal',
    type: 'interclubs',
    status: 'registrationsOpen',
    description:
      'Torneio interclubes de futsal reunindo os principais clubes de surdos da América do Sul em disputa pelo título continental.',
    federation: 'FASDS',
  },
  {
    id: '3',
    title: 'Assembleia Geral Ordinária CONSUDES 2026',
    startDate: '2026-06-12',
    endDate: '2026-06-13',
    country: 'Uruguai',
    city: 'Montevidéu',
    type: 'assembly',
    status: 'confirmed',
    description:
      'Assembleia anual com votações, prestação de contas e planejamento estratégico para o biênio 2026–2028.',
    federation: 'CONSUDES',
  },
  {
    id: '4',
    title: 'Campeonato Sul-Americano de Atletismo',
    startDate: '2026-07-08',
    endDate: '2026-07-14',
    country: 'Chile',
    city: 'Santiago',
    sport: 'Atletismo',
    type: 'championship',
    status: 'confirmed',
    description:
      'Maior competição de atletismo do calendário sul-americano de surdos, válida como classificatória para os Deaflympics.',
    federation: 'FDSOCH',
  },
  {
    id: '5',
    title: 'Congresso Técnico de Arbitragem CONSUDES',
    startDate: '2026-08-03',
    endDate: '2026-08-04',
    country: 'Peru',
    city: 'Lima',
    type: 'congress',
    status: 'upcoming',
    description:
      'Congresso técnico para capacitação e certificação de árbitros e juízes esportivos nas modalidades reconhecidas pela CONSUDES.',
    federation: 'CONSUDES',
  },
  {
    id: '6',
    title: 'Campeonato Sul-Americano de Tênis de Mesa',
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    country: 'Colômbia',
    city: 'Bogotá',
    sport: 'Tênis de Mesa',
    type: 'championship',
    status: 'upcoming',
    description:
      'Disputa pelo título continental de tênis de mesa nas categorias individual, duplas e mistas, masculino e feminino.',
    federation: 'FEDESDES',
  },
  {
    id: '7',
    title: 'Fórum Internacional de Esporte Surdo',
    startDate: '2026-10-22',
    endDate: '2026-10-24',
    country: 'Brasil',
    city: 'Rio de Janeiro',
    type: 'institutional',
    status: 'upcoming',
    description:
      'Evento de debate, troca de experiências e difusão de boas práticas no esporte surdo latino-americano.',
    federation: 'CONSUDES',
  },
  {
    id: '8',
    title: 'Campeonato Sul-Americano de Futebol',
    startDate: '2026-11-10',
    endDate: '2026-11-18',
    country: 'Equador',
    city: 'Quito',
    sport: 'Futebol',
    type: 'championship',
    status: 'upcoming',
    description:
      'Competição de futebol de campo masculino e feminino reunindo as seleções nacionais sul-americanas da comunidade surda.',
    federation: 'CONSUDES',
  },
];
