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
  fullNamePt?: string;
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
    fullName: 'Confederación Argentina de Deportes de Sordos',
    fullNamePt: 'Confederação Argentina de Esportes de Surdos',
    fullNameEn: 'Argentine Confederation of Deaf Sports',
    flag: '🇦🇷',
    logo: '/images/federations/cades.webp',
    socials: {
      website:   'http://www.cades.org.ar/',
      instagram: 'https://www.instagram.com/cades_argentina/',
      facebook:  'https://www.facebook.com/CadesARG',
      youtube:   'https://www.youtube.com/@cadesARG',
      twitter:   'https://x.com/CADES_Argentina',
    },
  },
  {
    country: 'Bolivia',
    countryEs: 'Bolivia',
    countryEn: 'Bolivia',
    acronym: 'FEBOS',
    fullName: 'Federación Boliviana de Sordos',
    fullNamePt: 'Federação Boliviana de Surdos',
    fullNameEn: 'Bolivian Federation of the Deaf',
    flag: '🇧🇴',
    logo: '/images/federations/febos.webp',
    socials: {
      facebook: 'https://www.facebook.com/Febos.Bolivia/',
    },
  },
  {
    country: 'Brasil',
    countryEs: 'Brasil',
    countryEn: 'Brazil',
    acronym: 'CBDS',
    fullName: 'Confederação Brasileira de Desportos de Surdos',
    fullNameEs: 'Confederación Brasileña de Deportes de Sordos',
    fullNamePt: 'Confederação Brasileira de Desportos de Surdos',
    fullNameEn: 'Brazilian Confederation of Deaf Sports',
    flag: '🇧🇷',
    logo: '/images/federations/cbds.webp',
    socials: {
      website:   'https://www.cbds.org.br/cbds/',
      instagram: 'https://www.instagram.com/cbdsbrasil/',
      facebook:  'https://www.facebook.com/cbdsbrasil/',
      youtube:   'https://www.youtube.com/c/cbdsbrasil',
      twitter:   'https://x.com/cbdsbrasil/',
      flickr:    'https://www.flickr.com/photos/cbdsbrasil/albums/',
    },
  },
  {
    country: 'Chile',
    countryEs: 'Chile',
    countryEn: 'Chile',
    acronym: 'FEDENASC',
    fullName: 'Federación Deportiva Nacional de Sordos de Chile',
    fullNamePt: 'Federação Esportiva Nacional de Surdos do Chile',
    fullNameEn: 'Chilean National Sports Federation of the Deaf',
    flag: '🇨🇱',
    logo: '/images/federations/fedenasc.webp',
    socials: {
      website:   'https://fedenaschile.cl/',
      instagram: 'https://www.instagram.com/fedenaschile/',
      facebook:  'https://www.facebook.com/fedenaschile.cl/',
      youtube:   'https://www.youtube.com/channel/UCQAupEQi_vr4I-lj67cQhoA',
    },
  },
  {
    country: 'Colombia',
    countryEs: 'Colombia',
    countryEn: 'Colombia',
    acronym: 'FENASCOL',
    fullName: 'Federación Nacional de Sordos de Colombia',
    fullNamePt: 'Federação Nacional de Surdos da Colômbia',
    fullNameEn: 'National Federation of the Deaf of Colombia',
    flag: '🇨🇴',
    logo: '/images/federations/fenascol.webp',
    socials: {
      website:   'https://fenascol.org.co/',
      instagram: 'https://www.instagram.com/fenascol/',
      facebook:  'https://www.facebook.com/fenascol',
      youtube:   'https://www.youtube.com/channel/UCBFKvAm40Wq9VdIRVCUzmMQ',
      twitter:   'https://x.com/fenascol',
      linkedin:  'https://www.linkedin.com/company/fenascol/',
      tiktok:    'https://www.tiktok.com/@fenascol',
    },
  },
  {
    country: 'Ecuador',
    countryEs: 'Ecuador',
    countryEn: 'Ecuador',
    acronym: 'FEDEPDAL',
    fullName: 'Federación Ecuatoriana de Deporte para Personas Sordas',
    fullNamePt: 'Federação Equatoriana de Esporte para Pessoas Surdas',
    fullNameEn: 'Ecuadorian Sports Federation for Deaf Persons',
    flag: '🇪🇨',
    logo: '/images/federations/fedepdal.webp',
    socials: {
      instagram: 'https://www.instagram.com/fedepdal_ec_oficial/',
      facebook:  'https://www.facebook.com/FEDEPDAL',
      tiktok:    'https://www.tiktok.com/@fedepdal',
    },
  },
  {
    country: 'Paraguay',
    countryEs: 'Paraguay',
    countryEn: 'Paraguay',
    acronym: 'FEDESPAR',
    fullName: 'Federación Deportiva de Sordos del Paraguay',
    fullNamePt: 'Federação Esportiva dos Surdos do Paraguai',
    fullNameEn: 'Sports Federation of the Deaf of Paraguay',
    flag: '🇵🇾',
    logo: '/images/federations/fedespar.webp',
    socials: {
      instagram: 'https://www.instagram.com/fedespar005/',
      facebook:  'https://www.facebook.com/100069831503386/videos/',
    },
  },
  {
    country: 'Perú',
    countryEs: 'Perú',
    countryEn: 'Peru',
    acronym: 'FDNSP',
    fullName: 'Federación Deportiva Nacional de Sordos del Perú',
    fullNamePt: 'Federação Esportiva Nacional dos Surdos do Peru',
    fullNameEn: 'National Sports Federation of the Deaf of Peru',
    flag: '🇵🇪',
    logo: '/images/federations/fdnsp.webp',
    socials: {
      facebook: 'https://www.facebook.com/profile.php?id=100087425774271',
    },
  },
  {
    country: 'Uruguay',
    countryEs: 'Uruguay',
    countryEn: 'Uruguay',
    acronym: 'ODSU',
    fullName: 'Organización Deportiva de Sordos del Uruguay',
    fullNamePt: 'Organização Esportiva dos Surdos do Uruguai',
    fullNameEn: 'Sports Organization of the Deaf of Uruguay',
    flag: '🇺🇾',
    logo: '/images/federations/odsu.webp',
    socials: {
      website:   'http://sordos.org.uy/',
      instagram: 'https://www.instagram.com/odsusordos/',
      youtube:   'https://www.youtube.com/channel/UCBg1rQx51PAEg6cRxPKgl9g',
    },
  },
  {
    country: 'Venezuela',
    countryEs: 'Venezuela',
    countryEn: 'Venezuela',
    acronym: 'FEPOSOR',
    fullName: 'Federación Venezolana Polideportiva de Sordos',
    fullNamePt: 'Federação Poliesportiva Venezuelana de Surdos',
    fullNameEn: 'Venezuelan Multisports Federation of the Deaf',
    flag: '🇻🇪',
    logo: '/images/federations/feposor.webp',
    socials: {
      instagram: 'https://www.instagram.com/feposor_ve/',
      facebook:  'https://www.facebook.com/p/Feposor-Venezuela-100054981262698/',
    },
  },
];
