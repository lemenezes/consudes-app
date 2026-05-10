export interface FederationSocials {
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  flickr?: string;
}

export interface Federation {
  country: string;
  countryEs: string;
  countryEn: string;
  acronym: string;
  fullName: string;
  fullNameEs?: string;
  fullNameEn?: string;
  flag: string;
  logo: string | null;
  socials: FederationSocials;
}

export const federationsData: Federation[] = [
  {
    country: 'Argentina',
    countryEs: 'Argentina',
    countryEn: 'Argentina',
    acronym: 'CADES',
    fullName: 'Confederación Argentina de Deportes para Sordos',
    flag: '🇦🇷',
    logo: null,
    socials: {},
  },
  {
    country: 'Bolivia',
    countryEs: 'Bolivia',
    countryEn: 'Bolivia',
    acronym: 'FEBOS',
    fullName: 'Federación Boliviana de Deportes de Sordos',
    flag: '🇧🇴',
    logo: null,
    socials: {},
  },
  {
    country: 'Brasil',
    countryEs: 'Brasil',
    countryEn: 'Brazil',
    acronym: 'CBDS',
    fullName: 'Confederação Brasileira de Desporto de Surdos',
    fullNameEs: 'Confederación Brasileña de Deporte de Sordos',
    fullNameEn: 'Brazilian Confederation of Deaf Sports',
    flag: '🇧🇷',
    logo: null,
    socials: {
      website: 'https://www.cbds.org.br',
    },
  },
  {
    country: 'Chile',
    countryEs: 'Chile',
    countryEn: 'Chile',
    acronym: 'FEDENASC',
    fullName: 'Federación Nacional de Deportes del Sordo de Chile',
    flag: '🇨🇱',
    logo: null,
    socials: {},
  },
  {
    country: 'Colombia',
    countryEs: 'Colombia',
    countryEn: 'Colombia',
    acronym: 'FENASCOL',
    fullName: 'Federación Nacional de Sordos de Colombia',
    flag: '🇨🇴',
    logo: null,
    socials: {
      website: 'https://www.fenascol.org.co',
    },
  },
  {
    country: 'Ecuador',
    countryEs: 'Ecuador',
    countryEn: 'Ecuador',
    acronym: 'FEDEPDAL',
    fullName: 'Federación Deportiva de Personas con Discapacidad Auditiva',
    flag: '🇪🇨',
    logo: null,
    socials: {},
  },
  {
    country: 'Paraguay',
    countryEs: 'Paraguay',
    countryEn: 'Paraguay',
    acronym: 'FEDESPAR',
    fullName: 'Federación Deportiva de Sordos del Paraguay',
    flag: '🇵🇾',
    logo: null,
    socials: {},
  },
  {
    country: 'Perú',
    countryEs: 'Perú',
    countryEn: 'Peru',
    acronym: 'FDNSP',
    fullName: 'Federación Deportiva Nacional de Sordos del Perú',
    flag: '🇵🇪',
    logo: null,
    socials: {},
  },
  {
    country: 'Uruguay',
    countryEs: 'Uruguay',
    countryEn: 'Uruguay',
    acronym: 'ODSU',
    fullName: 'Organización Deportiva de Sordos del Uruguay',
    flag: '🇺🇾',
    logo: null,
    socials: {},
  },
  {
    country: 'Venezuela',
    countryEs: 'Venezuela',
    countryEn: 'Venezuela',
    acronym: 'FEPOSOR',
    fullName: 'Federación Polideportiva de Sordos de Venezuela',
    flag: '🇻🇪',
    logo: null,
    socials: {},
  },
];
