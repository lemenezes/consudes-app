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
    photo: '/images/team/rodrigo-malta.webp',
    group: 'presidency',
  },

  // ── Vice-presidência ───────────────────────────────────────────
  {
    id: 'juan-castiglia',
    name: 'Juan Carlos Castiglia',
    roleKey: 'vicePresident1',
    country: 'Argentina',
    countryCode: 'AR',
    photo: '/images/team/juan-castiglia.webp',
    group: 'vicePresidency',
  },
  {
    id: 'luz-carreno',
    name: 'Luz Mary Quintero Carreño',
    roleKey: 'vicePresident2',
    country: 'Colombia',
    countryCode: 'CO',
    photo: '/images/team/luz-carreno.webp',
    group: 'vicePresidency',
  },

  // ── Diretoria ──────────────────────────────────────────────────
  {
    id: 'joselio-coelho',
    name: 'Josélio Ricardo Nunes Coelho',
    roleKey: 'treasurer',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/joselio-coelho.webp',
    group: 'board',
  },
  {
    id: 'horacio-aleva',
    name: 'Horácio Daniel Aleva',
    roleKey: 'legal',
    country: 'Argentina',
    countryCode: 'AR',
    photo: '/images/team/horacio-aleva.webp',
    group: 'board',
  },
  {
    id: 'daniel-perrone',
    name: 'Daniel Perrone',
    roleKey: 'institutional',
    country: 'Uruguay',
    countryCode: 'UY',
    photo: '/images/team/daniel-perrone.webp',
    group: 'board',
  },
  {
    id: 'victor-hugo',
    name: 'Victor Hugo',
    roleKey: 'technical',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/victor-hugo.webp',
    group: 'board',
  },
  {
    id: 'lourdes-carina',
    name: 'Lourdes Carina',
    roleKey: 'secretary',
    country: 'Uruguay',
    countryCode: 'UY',
    photo: '/images/team/lourdes-carina.webp',
    group: 'board',
  },

  // ── Assessores ─────────────────────────────────────────────────
  {
    id: 'maria-mongelos',
    name: 'Maria Cristina Mongelos',
    roleKey: 'adminAdvisor',
    country: 'Paraguay',
    countryCode: 'PY',
    photo: '/images/team/maria-mongelos.webp',
    group: 'advisors',
  },
  {
    id: 'gustavo-horst',
    name: 'Gustavo Brustolin Horst',
    roleKey: 'technicalAdvisor',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/gustavo-horst.webp',
    group: 'advisors',
  },
  {
    id: 'leandro-miglioli',
    name: 'Leandro Miglioli',
    roleKey: 'itSupport',
    country: 'Brasil',
    countryCode: 'BR',
    photo: '/images/team/leandro-miglioli.webp',
    group: 'advisors',
  },
];

export const teamByGroup = (group: MemberGroup) =>
  teamMembers.filter((m) => m.group === group);
