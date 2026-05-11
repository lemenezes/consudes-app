export interface FormerPresident {
  id: number;
  name: string;
  countryCode: string;
  mandateStart: number;
  mandateEnd: number;
  photo?: string;
}

export const FLAG: Record<string, string> = {
  BR: '🇧🇷',
  AR: '🇦🇷',
  UY: '🇺🇾',
  PY: '🇵🇾',
  CL: '🇨🇱',
};

export const formerPresidents: FormerPresident[] = [
  {
    id: 1,
    name: 'Sentil Dellatorre',
    countryCode: 'BR',
    mandateStart: 1985,
    mandateEnd: 1998,
    photo: '/images/former-presidents/sentil-dellatorre.webp',
  },
  {
    id: 2,
    name: 'Oscar Leon Rodríguez',
    countryCode: 'AR',
    mandateStart: 1999,
    mandateEnd: 2000,
    photo: '/images/former-presidents/oscar-rodriguez.webp',
  },
  {
    id: 3,
    name: 'Edith Alicia Libonatti',
    countryCode: 'AR',
    mandateStart: 2000,
    mandateEnd: 2001,
    photo: '/images/former-presidents/edith-libonatti.webp',
  },
  {
    id: 4,
    name: 'Daniel Perrone',
    countryCode: 'UY',
    mandateStart: 2002,
    mandateEnd: 2005,
    photo: '/images/former-presidents/daniel-perrone-ex.webp',
  },
  {
    id: 5,
    name: 'Roberto González',
    countryCode: 'AR',
    mandateStart: 2005,
    mandateEnd: 2006,
    photo: '/images/former-presidents/roberto-gonzalez.webp',
  },
  {
    id: 6,
    name: 'Edith Alicia Libonatti',
    countryCode: 'AR',
    mandateStart: 2006,
    mandateEnd: 2007,
    photo: '/images/former-presidents/edith-libonatti.webp',
  },
  {
    id: 7,
    name: 'Maria Cristina Mongelos',
    countryCode: 'PY',
    mandateStart: 2007,
    mandateEnd: 2012,
    photo: '/images/former-presidents/maria-mongelos-ex.webp',
  },
  {
    id: 8,
    name: 'Pedro Pablo Bonnassiolle',
    countryCode: 'CL',
    mandateStart: 2012,
    mandateEnd: 2016,
    photo: '/images/former-presidents/pedro-bonnassiolle.webp',
  },
  {
    id: 9,
    name: 'Horacio Daniel Aleva',
    countryCode: 'AR',
    mandateStart: 2016,
    mandateEnd: 2020,
    photo: '/images/former-presidents/horacio-aleva-ex.webp',
  },
];
