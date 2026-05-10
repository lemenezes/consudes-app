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

/**
 * Précisão da data do evento:
 * - 'full'  → datas exatas conhecidas (YYYY-MM-DD)
 * - 'month' → apenas mês/ano conhecidos (use dia 01)
 * - 'year'  → apenas o ano é conhecido (use 01-01)
 */
export type DatePrecision = 'full' | 'month' | 'year';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD (use 01 quando dia/mês desconhecido)
  endDate: string;
  datePrecision: DatePrecision;
  country: string;
  city?: string;
  locationOpen?: boolean; // true quando sede ainda não definida
  sport: string;
  category?: string;  // e.g. 'Interclubes', 'Sub-21', 'Adulto'
  type: EventType;
  status: EventStatus;
  description?: string;
  federation?: string;
  link?: string;
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Torneo Interclubes de Fútbol Sala',
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    datePrecision: 'month',
    country: 'Argentina',
    city: 'Buenos Aires',
    sport: 'Fútbol Sala',
    category: 'Interclubes',
    type: 'interclubs',
    status: 'finished',
    description:
      'Torneo interclubes de fútbol sala disputado en Buenos Aires, reuniendo los principales clubes de sordos de Sudamérica.',
    federation: 'FASDS',
  },
  {
    id: '2',
    title: 'Campeonato Sudamericano de Fútbol Sala – Sub-21',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    datePrecision: 'month',
    country: 'Brasil',
    city: 'São José dos Pinhais',
    sport: 'Fútbol Sala',
    category: 'Sub-21',
    type: 'championship',
    status: 'finished',
    description:
      'Campeonato sudamericano de fútbol sala categoría Sub-21, disputado en São José dos Pinhais, Brasil.',
    federation: 'CBDS',
  },
  {
    id: '3',
    title: 'Torneo Interclubes de Fútbol Sala',
    startDate: '2026-10-11',
    endDate: '2026-10-18',
    datePrecision: 'full',
    country: 'Uruguay',
    city: 'Florida',
    sport: 'Fútbol Sala',
    category: 'Interclubes',
    type: 'interclubs',
    status: 'confirmed',
    description:
      'Torneo interclubes de fútbol sala en Florida, Uruguay. Fechas confirmadas: 11 al 18 de octubre de 2026.',
    federation: 'CONSUDES',
  },
  {
    id: '4',
    title: 'Torneo Interclubes de Fútbol Sala',
    startDate: '2027-06-01',
    endDate: '2027-06-30',
    datePrecision: 'month',
    country: 'Paraguay',
    sport: 'Fútbol Sala',
    category: 'Interclubes',
    type: 'interclubs',
    status: 'upcoming',
    description:
      'Torneo interclubes de fútbol sala con sede en Paraguay, programado para junio de 2027.',
    federation: 'CONSUDES',
  },
  {
    id: '5',
    title: 'Campeonato Sudamericano de Fútbol Sala – Sub-21',
    startDate: '2027-01-01',
    endDate: '2027-12-31',
    datePrecision: 'year',
    country: '',
    locationOpen: true,
    sport: 'Fútbol Sala',
    category: 'Sub-21',
    type: 'championship',
    status: 'upcoming',
    description:
      'Sede abierta a propuestas. Las federaciones interesadas pueden enviar su candidatura a CONSUDES.',
    federation: 'CONSUDES',
  },
  {
    id: '6',
    title: 'Campeonato Sudamericano de Fútbol Sala',
    startDate: '2027-01-01',
    endDate: '2027-12-31',
    datePrecision: 'year',
    country: '',
    locationOpen: true,
    sport: 'Fútbol Sala',
    category: 'Adulto',
    type: 'championship',
    status: 'upcoming',
    description:
      'Sede abierta a propuestas. Las federaciones interesadas pueden enviar su candidatura a CONSUDES.',
    federation: 'CONSUDES',
  },
];

