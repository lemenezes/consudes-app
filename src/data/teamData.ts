export type MemberGroup = 'presidency' | 'vicePresidency' | 'board' | 'advisors';

export interface TeamMember {
  id: string;
  name: string;
  /** Role key in translations (teamPage.roles.*) */
  roleKey: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2 for flag emoji
  photo: string; // URL
  group: MemberGroup;
}

function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

export const FLAG: Record<string, string> = {
  BR: flagEmoji('BR'), // 🇧🇷
  AR: flagEmoji('AR'), // 🇦🇷
  CO: flagEmoji('CO'), // 🇨🇴
  PY: flagEmoji('PY'), // 🇵🇾
  UY: flagEmoji('UY'), // 🇺🇾
};

export const teamMembers: TeamMember[] = [
  // ── Presidência ────────────────────────────────────────────────
  {
    id: 'rodrigo-malta',
    name: 'Rodrigo Rocha Malta',
    roleKey: 'president',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/rodrigo-malta.png',
    group: 'presidency',
  },

  // ── Vice-presidência ───────────────────────────────────────────
  {
    id: 'juan-castiglia',
    name: 'Juan Carlos Castiglia',
    roleKey: 'vicePresident1',
    country: 'Argentina',
    countryCode: 'AR',
    photo: '/images/team/juan-castiglia.png',
    group: 'vicePresidency',
  },
  {
    id: 'luz-carreno',
    name: 'Luz Mary Quintero Carreño',
    roleKey: 'vicePresident2',
    country: 'Colombia',
    countryCode: 'CO',
    photo: '/images/team/luz-carreno.png',
    group: 'vicePresidency',
  },

  // ── Diretoria ──────────────────────────────────────────────────
  {
    id: 'joselio-coelho',
    name: 'Josélio Ricardo Nunes Coelho',
    roleKey: 'treasurer',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/joselio-coelho.png',
    group: 'board',
  },
  {
    id: 'horacio-aleva',
    name: 'Horácio Daniel Aleva',
    roleKey: 'legal',
    country: 'Argentina',
    countryCode: 'AR',
    photo: '/images/team/horacio-aleva.png',
    group: 'board',
  },
  {
    id: 'daniel-perrone',
    name: 'Daniel Perrone',
    roleKey: 'institutional',
    country: 'Uruguay',
    countryCode: 'UY',
    photo: '/images/team/daniel-perrone.png',
    group: 'board',
  },
  {
    id: 'victor-hugo',
    name: 'Victor Hugo',
    roleKey: 'technical',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/victor-hugo.jpg',
    group: 'board',
  },
  {
    id: 'lourdes-carina',
    name: 'Lourdes Carina',
    roleKey: 'secretary',
    country: 'Uruguay',
    countryCode: 'UY',
    photo: '/images/team/lourdes-carina.jpg',
    group: 'board',
  },

  // ── Assessores ─────────────────────────────────────────────────
  {
    id: 'maria-mongelos',
    name: 'Maria Cristina Mongelos',
    roleKey: 'adminAdvisor',
    country: 'Paraguay',
    countryCode: 'PY',
    photo: '/images/team/maria-mongelos.png',
    group: 'advisors',
  },
  {
    id: 'gustavo-horst',
    name: 'Gustavo Brustolin Horst',
    roleKey: 'technicalAdvisor',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/gustavo-horst.png',
    group: 'advisors',
  },
  {
    id: 'leandro-miglioli',
    name: 'Leandro Miglioli',
    roleKey: 'itSupport',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/leandro-miglioli.jpg',
    group: 'advisors',
  },
];

export const teamByGroup = (group: MemberGroup) =>
  teamMembers.filter((m) => m.group === group);
