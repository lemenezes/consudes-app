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
};

export const teamMembers: TeamMember[] = [
  // ── Presidência ────────────────────────────────────────────────
  {
    id: 'rodrigo-malta',
    name: 'Rodrigo Rocha Malta',
    roleKey: 'president',
    country: 'Brasil',
    countryCode: 'BR',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/RoderigoMalta.png',
    group: 'presidency',
  },

  // ── Vice-presidência ───────────────────────────────────────────
  {
    id: 'juan-castiglia',
    name: 'Juan Carlos Castiglia',
    roleKey: 'vicePresident1',
    country: 'Argentina',
    countryCode: 'AR',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/JuanCastiglia.png',
    group: 'vicePresidency',
  },
  {
    id: 'luz-carreno',
    name: 'Luz Mary Quintero Carreño',
    roleKey: 'vicePresident2',
    country: 'Colombia',
    countryCode: 'CO',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/LurzCarreno.png',
    group: 'vicePresidency',
  },

  // ── Diretoria ──────────────────────────────────────────────────
  {
    id: 'joselio-coelho',
    name: 'Josélio Ricardo Nunes Coelho',
    roleKey: 'treasurer',
    country: 'Brasil',
    countryCode: 'BR',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/JoselioCoelho.png',
    group: 'board',
  },
  {
    id: 'horacio-aleva',
    name: 'Horácio Daniel Aleva',
    roleKey: 'legal',
    country: 'Argentina',
    countryCode: 'AR',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/HoracioAleva.png',
    group: 'board',
  },
  {
    id: 'daniel-perrone',
    name: 'Daniel Perrone',
    roleKey: 'institutional',
    country: 'Argentina',
    countryCode: 'AR',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/DanielPerrone.png',
    group: 'board',
  },
  {
    id: 'victor-hugo',
    name: 'Victor Hugo',
    roleKey: 'technical',
    country: 'Brasil',
    countryCode: 'BR',
    photo: 'https://consudes.com/wp-content/uploads/2026/03/VictorHugo.jpeg',
    group: 'board',
  },
  {
    id: 'lourdes-carina',
    name: 'Lourdes Carina',
    roleKey: 'secretary',
    country: 'Brasil',
    countryCode: 'BR',
    photo: 'https://consudes.com/wp-content/uploads/2026/03/LourdesCarina.jpeg',
    group: 'board',
  },

  // ── Assessores ─────────────────────────────────────────────────
  {
    id: 'maria-mongelos',
    name: 'Maria Cristina Mongelos',
    roleKey: 'adminAdvisor',
    country: 'Paraguay',
    countryCode: 'PY',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/MariaMongelos.png',
    group: 'advisors',
  },
  {
    id: 'gustavo-horst',
    name: 'Gustavo Brustolin Horst',
    roleKey: 'technicalAdvisor',
    country: 'Brasil',
    countryCode: 'BR',
    photo: 'https://consudes.com/wp-content/uploads/2025/12/GustavoHorst.png',
    group: 'advisors',
  },
];

export const teamByGroup = (group: MemberGroup) =>
  teamMembers.filter((m) => m.group === group);
