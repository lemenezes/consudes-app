-- =============================================================================
-- CONSUDES — Seed dos 22 álbuns existentes da galeria
--
-- Estes álbuns já existiam em src/data/galleryData.ts,
-- mas nunca haviam sido inseridos em public.gallery_albums.
--
-- ON CONFLICT DO NOTHING preserva qualquer registro já existente no CMS.
-- =============================================================================

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'juegos-sudamericanos/2019-juegos-ii',
  'II Juegos Sudamericanos 2019',
  2019,
  NULL,
  'Ecuador',
  '{"es":"Segunda edición de los Juegos Sudamericanos de Sordos. Participaron delegaciones de toda Sudamérica en el mayor evento del deporte sordo continental.","pt":"Segunda edição dos Jogos Sul-Americanos de Surdos. Participaram delegações de toda a América do Sul no maior evento do esporte surdo continental.","en":"Second edition of the South American Deaf Games. Delegations from across South America participated in the largest continental deaf sports event."}'::jsonb,
  'juegos-sudamericanos',
  'T1',
  'cover.webp',
  'center',
  7,
  '[{"filename":"01.webp","isHero":true,"caption":"Portada oficial — II Juegos Sudamericanos 2019"},{"filename":"02.webp","isHero":true,"caption":"Delegación Argentina"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"}]'::jsonb,
  true
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'panamdes/2016-panamdes',
  'PANAMDES 2016',
  2016,
  NULL,
  NULL,
  '{"es":"Juegos Panamericanos de Sordos 2016. El álbum con el mejor registro fotográfico del acervo CONSUDES.","pt":"Jogos Pan-Americanos de Surdos 2016. O álbum com o melhor registro fotográfico do acervo CONSUDES.","en":"2016 Pan American Deaf Games. The album with the finest photographic record in the CONSUDES collection."}'::jsonb,
  'panamdes',
  'T1',
  'cover.webp',
  'center',
  8,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp","isHero":true},{"filename":"03.webp","isHero":true},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'historico/evento-ajedrez',
  'Campeonato de Ajedrez',
  NULL,
  NULL,
  NULL,
  '{"es":"Registro fotográfico profesional de un campeonato de ajedrez sordo. Las fotos de mayor resolución de todo el acervo histórico.","pt":"Registro fotográfico profissional de um campeonato de xadrez surdo. As fotos de maior resolução de todo o acervo histórico.","en":"Professional photographic record of a deaf chess championship. The highest-resolution photos in the entire historical archive."}'::jsonb,
  'historico',
  'T1',
  'cover.webp',
  'center',
  12,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp","isHero":true},{"filename":"03.webp","isHero":true},{"filename":"04.webp","isHero":true},{"filename":"05.webp","isHero":true},{"filename":"06.webp","isHero":true},{"filename":"07.webp","caption":"Campeón de Ajedrez"},{"filename":"08.webp","caption":"Vicecampeón de Ajedrez"},{"filename":"09.webp"},{"filename":"10.webp","caption":"Afiche del campeonato"},{"filename":"11.webp"},{"filename":"12.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'juegos-sudamericanos/2015-goiania',
  'I Juegos Sudamericanos — Goiânia 2015',
  2015,
  'Goiânia',
  'Brasil',
  '{"es":"Primera edición de los Juegos Sudamericanos de Sordos, realizada en Goiânia, Brasil. Un hito fundacional para el deporte sordo sudamericano.","pt":"Primeira edição dos Jogos Sul-Americanos de Surdos, realizada em Goiânia, Brasil. Um marco fundacional para o esporte surdo sul-americano.","en":"First edition of the South American Deaf Games, held in Goiânia, Brazil. A founding milestone for South American deaf sport."}'::jsonb,
  'juegos-sudamericanos',
  'T1',
  'cover.webp',
  'center',
  13,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp","isHero":true},{"filename":"03.webp","isHero":true},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"},{"filename":"11.webp"},{"filename":"12.webp"},{"filename":"13.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/2018-ic',
  'IC 2018',
  2018,
  NULL,
  NULL,
  '{"es":"Edición 2018 de los Interclubes CONSUDES. El registro fotográfico más completo de la historia de los interclubes.","pt":"Edição 2018 dos Interclubes CONSUDES. O registro fotográfico mais completo da história dos interclubes.","en":"2018 edition of the CONSUDES Interclubs. The most complete photographic record in the history of the interclubs."}'::jsonb,
  'interclubes',
  'T1',
  'cover.webp',
  'center',
  19,
  '[{"filename":"01.webp","isHero":true,"caption":"Foto general — IC 2018"},{"filename":"02.webp","isHero":true,"caption":"Directivos CONSUDES"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"},{"filename":"11.webp"},{"filename":"12.webp"},{"filename":"13.webp"},{"filename":"14.webp"},{"filename":"15.webp"},{"filename":"16.webp"},{"filename":"17.webp"},{"filename":"18.webp"},{"filename":"19.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/ic-chile',
  'IC Chile',
  NULL,
  NULL,
  'Chile',
  '{"es":"Interclubes realizados en Chile. El álbum más extenso de la serie, con fotos de equipos, árbitros, pódios masculino y femenino.","pt":"Interclubes realizados no Chile. O álbum mais extenso da série, com fotos de equipes, árbitros e pódios masculino e feminino.","en":"Interclubs held in Chile. The most extensive album in the series, featuring team photos, referees, and men''s and women''s podiums."}'::jsonb,
  'interclubes',
  'T2',
  '02.webp',
  'center',
  28,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"},{"filename":"11.webp","caption":"Árbitros"},{"filename":"12.webp","caption":"Asamblea"},{"filename":"13.webp"},{"filename":"14.webp"},{"filename":"15.webp"},{"filename":"16.webp"},{"filename":"17.webp","caption":"Campeón masculino"},{"filename":"18.webp","caption":"Campeón femenino"},{"filename":"19.webp"},{"filename":"20.webp"},{"filename":"21.webp"},{"filename":"22.webp","caption":"Subcampeón masculino"},{"filename":"23.webp","caption":"Subcampeón femenino"},{"filename":"24.webp","caption":"Tercer lugar masculino"},{"filename":"25.webp","caption":"Tercer lugar femenino"},{"filename":"26.webp"},{"filename":"27.webp"},{"filename":"28.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/2016-ic-ecuador-i',
  'IC Ecuador I — 2016',
  2016,
  NULL,
  'Ecuador',
  '{"es":"Primera edición de los Interclubes en Ecuador. Fotos de alta resolución del evento y afiche oficial.","pt":"Primeira edição dos Interclubes no Equador. Fotos em alta resolução do evento e cartaz oficial.","en":"First edition of the Interclubs in Ecuador. High-resolution photos of the event and official poster."}'::jsonb,
  'interclubes',
  'T2',
  'cover.webp',
  'center',
  7,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp","isHero":true},{"filename":"03.webp","isHero":true},{"filename":"04.webp","caption":"Afiche oficial"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'assembleias/reunion-miembros',
  'Reunión de Miembros',
  NULL,
  NULL,
  NULL,
  '{"es":"Encuentro institucional de los miembros y directivos de la CONSUDES. Un registro de las reuniones que dieron forma a las decisiones del deporte sordo sudamericano.","pt":"Encontro institucional dos membros e diretores da CONSUDES. Um registro das reuniões que moldaram as decisões do esporte surdo sul-americano.","en":"Institutional gathering of CONSUDES members and board. A record of the meetings that shaped the decisions of South American deaf sport."}'::jsonb,
  'assembleias',
  'T2',
  '05.webp',
  'center',
  13,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"},{"filename":"11.webp"},{"filename":"12.webp"},{"filename":"13.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'capacitacao/2016-gustavo-ecuador',
  'Capacitación — Ecuador 2016',
  2016,
  'Quito',
  'Ecuador',
  '{"es":"Capacitación en Deporte Sordolímpico conducida por Gustavo Perazzolo en Quito, Ecuador.","pt":"Capacitação em Esporte Surdolímpico conduzida por Gustavo Perazzolo em Quito, Equador.","en":"Deaflympic Sport training conducted by Gustavo Perazzolo in Quito, Ecuador."}'::jsonb,
  'capacitacao',
  'T2',
  'cover.webp',
  'center',
  10,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'futsal-feminino/i-futsal-femenino',
  'I Futsal Femenino CONSUDES',
  NULL,
  NULL,
  NULL,
  '{"es":"Primera edición del Campeonato de Futsal Femenino organizado por CONSUDES. Un hito histórico para el deporte femenino sordo.","pt":"Primeira edição do Campeonato de Futsal Feminino organizado pela CONSUDES. Um marco histórico para o esporte feminino surdo.","en":"First edition of the Women''s Futsal Championship organized by CONSUDES. A historic milestone for women''s deaf sport."}'::jsonb,
  'futsal-feminino',
  'T2',
  'cover.webp',
  'center',
  8,
  '[{"filename":"01.webp","isHero":true,"caption":"Delegación Chile"},{"filename":"02.webp","isHero":true,"caption":"Delegación Brasil"},{"filename":"03.webp","caption":"Delegación Argentina"},{"filename":"04.webp","caption":"Asamblea plena"},{"filename":"05.webp"},{"filename":"06.webp","caption":"Discurso del Presidente"},{"filename":"07.webp"},{"filename":"08.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/2017-ic',
  'IC 2017',
  2017,
  NULL,
  NULL,
  '{"es":"Edición 2017 de los Interclubes CONSUDES con equipos masculinos y femeninos.","pt":"Edição 2017 dos Interclubes CONSUDES com equipes masculinas e femininas.","en":"2017 edition of the CONSUDES Interclubs featuring men''s and women''s teams."}'::jsonb,
  'interclubes',
  'T2',
  '08.webp',
  'center',
  12,
  '[{"filename":"01.webp","isHero":true,"caption":"Foto general — IC 2017"},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"},{"filename":"11.webp"},{"filename":"12.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/2017-ic-ecuador-iii',
  'IC Ecuador III — 2017',
  2017,
  NULL,
  'Ecuador',
  '{"es":"Tercera edición de los Interclubes en Ecuador, 2017. Registro documental del torneo con equipos de la región en plena disputa de la competencia.","pt":"Terceira edição dos Interclubes no Equador, 2017. Registro documental do torneio com equipes da região em plena disputa da competição.","en":"Third edition of the Interclubs in Ecuador, 2017. Documentary record of the tournament featuring regional teams in full competition."}'::jsonb,
  'interclubes',
  'T2',
  'cover.webp',
  'center',
  8,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp","isHero":true},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/2005-ic',
  'IC 2005 — I Interclube',
  2005,
  'Asunción',
  'Paraguay',
  '{"es":"Primera edición documentada de los Interclubes CONSUDES, realizada en Asunción, Paraguay. Incluye cobertura de la prensa local.","pt":"Primeira edição documentada dos Interclubes CONSUDES, realizada em Assunção, Paraguai. Inclui cobertura da imprensa local.","en":"First documented edition of the CONSUDES Interclubs, held in Asunción, Paraguay. Includes local press coverage."}'::jsonb,
  'interclubes',
  'T3',
  'cover.webp',
  'center',
  14,
  '[{"filename":"01.webp","isHero":true,"caption":"Cobertura de prensa — I Interclube 2005"},{"filename":"02.webp","isHero":true,"caption":"Diario — I Interclube 2005"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp","caption":"Asamblea 2005"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"},{"filename":"11.webp"},{"filename":"12.webp"},{"filename":"13.webp"},{"filename":"14.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/2012-ic',
  'IC 2012',
  2012,
  NULL,
  NULL,
  '{"es":"Interclubes CONSUDES 2012. Fotografías de los equipos y delegaciones que disputaron esta edición de la competencia regional de clubes sordos.","pt":"Interclubes CONSUDES 2012. Fotografias das equipes e delegações que disputaram esta edição da competição regional de clubes surdos.","en":"CONSUDES Interclubs 2012. Photographs of the teams and delegations who competed in this edition of the regional deaf club tournament."}'::jsonb,
  'interclubes',
  'T3',
  'cover.webp',
  'center',
  6,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'assembleias/2017-xlviii-brasil',
  'XLVIII Asamblea 2017',
  2017,
  NULL,
  'Brasil',
  '{"es":"XLVIII Asamblea Ordinaria de la CONSUDES celebrada en Brasil, 2017. Registro de la reunión plenaria de máxima autoridad del organismo continental del deporte sordo.","pt":"XLVIII Assembleia Ordinária da CONSUDES realizada no Brasil, 2017. Registro da reunião plenária de máxima autoridade do organismo continental do esporte surdo.","en":"XLVIII Ordinary General Assembly of CONSUDES held in Brazil, 2017. Record of the plenary meeting of the highest governing body of continental deaf sport."}'::jsonb,
  'assembleias',
  'T3',
  'cover.webp',
  'center',
  3,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'historico',
  'Archivo Histórico',
  NULL,
  NULL,
  NULL,
  '{"es":"Fotografías históricas de la CONSUDES: directivos, delegaciones y eventos (2000–2013).","pt":"Fotografias históricas da CONSUDES: diretores, delegações e eventos (2000–2013).","en":"Historical photographs of CONSUDES: board members, delegations, and events (2000–2013)."}'::jsonb,
  'historico',
  'T3',
  'cover.webp',
  'center',
  9,
  '[{"filename":"01.webp","isHero":true,"caption":"Directorio CONSUDES"},{"filename":"02.webp","caption":"Goleadores históricos"},{"filename":"03.webp","caption":"CONSUDES 2013"},{"filename":"04.webp","caption":"Asunción 2001"},{"filename":"05.webp","caption":"2000"},{"filename":"06.webp","caption":"Reunión Caxias"},{"filename":"07.webp","caption":"Fixture 2013"},{"filename":"08.webp"},{"filename":"09.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'historico/afiches',
  'Afiches y Carteles',
  NULL,
  NULL,
  NULL,
  '{"es":"Colección de afiches oficiales de los grandes eventos CONSUDES: Juegos Sudamericanos, Interclubes y campeonatos continentales. Documentos gráficos que marcaron la historia del deporte sordo sudamericano.","pt":"Coleção de cartazes oficiais dos grandes eventos CONSUDES: Jogos Sul-Americanos, Interclubes e campeonatos continentais. Documentos gráficos que marcaram a história do esporte surdo sul-americano.","en":"Collection of official posters from major CONSUDES events: South American Games, Interclubs and continental championships. Graphic documents that marked the history of South American deaf sport."}'::jsonb,
  'historico',
  'T3',
  'cover.webp',
  'center',
  5,
  '[{"filename":"01.webp","isHero":true,"caption":"Afiche I Juegos Sudamericanos"},{"filename":"02.webp","isHero":true,"caption":"Afiche Juegos 2013"},{"filename":"03.webp","caption":"Afiche IC 2012"},{"filename":"04.webp","caption":"Afiche IC 2012 (v2)"},{"filename":"05.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'ex-presidentes',
  'Ex Presidentes CONSUDES',
  NULL,
  NULL,
  NULL,
  '{"es":"Archivo fotográfico de los presidentes que condujeron la CONSUDES a lo largo de su historia. Un reconocimiento a quienes construyeron y representaron el deporte sordo sudamericano.","pt":"Arquivo fotográfico dos presidentes que conduziram a CONSUDES ao longo de sua história. Um reconhecimento a quem construiu e representou o esporte surdo sul-americano.","en":"Photographic archive of the presidents who led CONSUDES throughout its history. A tribute to those who built and represented South American deaf sport."}'::jsonb,
  'historico',
  'T3',
  'cover.webp',
  'center',
  8,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'equipes',
  'Equipos Afiliados',
  NULL,
  NULL,
  NULL,
  '{"es":"Catálogo fotográfico de los equipos afiliados participantes en los Interclubes CONSUDES.","pt":"Catálogo fotográfico das equipes filiadas participantes nos Interclubes CONSUDES.","en":"Photographic catalogue of affiliated teams participating in the CONSUDES Interclubs."}'::jsonb,
  'interclubes',
  'T3',
  'cover.webp',
  'center',
  12,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"},{"filename":"07.webp"},{"filename":"08.webp"},{"filename":"09.webp"},{"filename":"10.webp"},{"filename":"11.webp"},{"filename":"12.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'membros',
  'Directivos CONSUDES',
  NULL,
  NULL,
  NULL,
  '{"es":"Galería de retratos de los integrantes de la directiva de la CONSUDES. Los rostros de quienes representaron y gobernaron el deporte sordo continental.","pt":"Galeria de retratos dos integrantes da diretoria da CONSUDES. Os rostos de quem representou e governou o esporte surdo continental.","en":"Portrait gallery of CONSUDES board members. The faces of those who represented and governed continental deaf sport."}'::jsonb,
  'historico',
  'T3',
  '03.webp',
  'center top',
  6,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp"},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"},{"filename":"06.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;

insert into public.gallery_albums (
  slug,
  title,
  year,
  city,
  country,
  description,
  category,
  tier,
  cover_file,
  cover_position,
  photo_count,
  photos,
  featured
) values (
  'interclubes/2019-ic-ecuador',
  'IC Ecuador 2019',
  2019,
  NULL,
  'Ecuador',
  '{"es":"Interclubes disputados en Ecuador, 2019. Registro fotográfico de la edición más reciente del torneo regional de clubes sordos antes de la pandemia.","pt":"Interclubes disputados no Equador, 2019. Registro fotográfico da edição mais recente do torneio regional de clubes surdos antes da pandemia.","en":"Interclubs held in Ecuador, 2019. Photographic record of the most recent edition of the regional deaf club tournament before the pandemic."}'::jsonb,
  'interclubes',
  'T3',
  'cover.webp',
  'center',
  5,
  '[{"filename":"01.webp","isHero":true},{"filename":"02.webp","isHero":true},{"filename":"03.webp"},{"filename":"04.webp"},{"filename":"05.webp"}]'::jsonb,
  false
)
on conflict (slug) do nothing;
