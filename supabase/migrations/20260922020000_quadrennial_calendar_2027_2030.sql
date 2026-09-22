-- Calendario Cuatrienal Propuesto CONSUDES / PANAMDES 2027–2030
-- Propuesta para discusión y aprobación.
--
-- Los eventos incluidos abajo son propuestas de planificación y
-- no deben interpretarse como eventos confirmados.
--
-- Los hitos exclusivamente ICSD no se insertan como eventos propios
-- de CONSUDES. Permanecen como referencia del documento cuatrienal.

-- ============================================================
-- REGISTROS 2027 ANTERIORES
-- ============================================================

-- Estos registros pertenecían a la planificación anterior y no
-- corresponden directamente al nuevo calendario cuatrienal.
-- Se conservan en el historial, pero dejan de publicarse.

UPDATE public.calendar_events
SET
    status = 'archived',
    updated_at = now()
WHERE slug IN (
    'interclubes-futsal-paraguay-2027',
    'campeonato-sudamericano-futsal-adulto-2027'
);

-- El Sub-21 continúa formando parte de la propuesta.
UPDATE public.calendar_events
SET
    description = 'Evento incluido en el Calendario Cuatrienal Propuesto 2027–2030. Sede y organización pendientes de definición.',
    country = '',
    city = null,
    venue = null,
    location_open = true,
    event_status = 'proposed',
    federation = 'CONSUDES',
    status = 'published',
    updated_at = now()
WHERE slug = 'campeonato-sudamericano-futsal-sub21-2027';


-- ============================================================
-- EVENTOS PROPUESTOS 2027–2030
-- ============================================================

INSERT INTO public.calendar_events (
    title,
    slug,
    description,
    start_date,
    end_date,
    date_precision,
    country,
    city,
    sport,
    category,
    event_type,
    event_status,
    federation,
    status,
    location_open,
    sort_order
)
VALUES

-- ============================================================
-- 2027
-- ============================================================

(
    'Juegos Abiertos Sudamericanos de Sordos',
    'juegos-abiertos-sudamericanos-sordos-2027',
    'Edición propuesta con participación de clubes en fútbol sala, baloncesto, voleibol, balonmano, voleibol de playa y deportes individuales. Sede y organización por definir.',
    '2027-03-01',
    '2027-04-30',
    'month',
    '',
    null,
    'Multideportivo',
    'interclubes',
    'interclubs',
    'proposed',
    'CONSUDES',
    'published',
    true,
    110
),

(
    'Campeonato Sudamericano de Voleibol de Playa',
    'campeonato-sudamericano-voleibol-playa-2027',
    'Campeonato sudamericano masculino y femenino incluido en la propuesta del ciclo 2027–2030. Sede y organización por definir.',
    '2027-01-01',
    '2027-12-31',
    'year',
    '',
    null,
    'Voleibol de Playa',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    120
),

(
    'Campeonato Sudamericano Abierto de Baloncesto 3x3',
    'campeonato-sudamericano-abierto-baloncesto-3x3-2027',
    'Campeonato sudamericano abierto de baloncesto 3x3 masculino y femenino propuesto para noviembre de 2027. Sede y organización por definir.',
    '2027-11-01',
    '2027-11-30',
    'month',
    '',
    null,
    'Baloncesto 3x3',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    130
),

(
    'Congreso Técnico 2028',
    'congreso-tecnico-2028-preparacion',
    'Congreso técnico propuesto para la preparación y coordinación del calendario deportivo 2028.',
    '2027-11-01',
    '2027-12-31',
    'month',
    '',
    null,
    'Institucional',
    'institucional',
    'congress',
    'proposed',
    'PANAMDES + CONSUDES',
    'published',
    true,
    140
),

-- ============================================================
-- 2028
-- ============================================================

(
    'Campeonato Sudamericano de Bádminton y Tenis de Mesa',
    'campeonato-sudamericano-badminton-tenis-mesa-2028',
    'Campeonato sudamericano propuesto de bádminton y tenis de mesa. Sede y organización por definir.',
    '2028-03-01',
    '2028-03-31',
    'month',
    '',
    null,
    'Bádminton / Tenis de Mesa',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    210
),

(
    'Campeonato Sudamericano de Atletismo y Natación',
    'campeonato-sudamericano-atletismo-natacion-2028',
    'Campeonato sudamericano propuesto de atletismo y natación. Sede y organización por definir.',
    '2028-04-01',
    '2028-04-30',
    'month',
    '',
    null,
    'Atletismo / Natación',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    220
),

(
    'Campeonato Sudamericano Sub-21 de Baloncesto',
    'campeonato-sudamericano-baloncesto-sub21-2028',
    'Campeonato sudamericano Sub-21 masculino y femenino de baloncesto. Sede y organización por definir.',
    '2028-05-01',
    '2028-05-31',
    'month',
    '',
    null,
    'Baloncesto',
    'sub21',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    230
),

(
    'Campeonato Sudamericano Sub-21 de Fútbol Sala',
    'campeonato-sudamericano-futsal-sub21-2028',
    'Campeonato sudamericano Sub-21 masculino y femenino de fútbol sala propuesto para mayo/junio de 2028.',
    '2028-05-01',
    '2028-06-30',
    'month',
    '',
    null,
    'Fútbol Sala',
    'sub21',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    240
),

(
    'Campeonato Sudamericano Sub-21 de Voleibol',
    'campeonato-sudamericano-voleibol-sub21-2028',
    'Campeonato sudamericano Sub-21 masculino y femenino de voleibol. Sede y organización por definir.',
    '2028-06-01',
    '2028-06-30',
    'month',
    '',
    null,
    'Voleibol',
    'sub21',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    250
),

(
    'Juegos Panamericanos de Sordos',
    'juegos-panamericanos-sordos-2028',
    'Ventana prioritaria propuesta para los Juegos Panamericanos de Sordos dentro del calendario integrado 2027–2030.',
    '2028-01-01',
    '2028-12-31',
    'year',
    '',
    null,
    'Multideportivo',
    'outro',
    'championship',
    'proposed',
    'PANAMDES',
    'published',
    true,
    260
),

(
    'Juegos Abiertos Sudamericanos de Sordos / Interclubes',
    'juegos-abiertos-sudamericanos-interclubes-2028',
    'Edición completa propuesta para noviembre de 2028, con deportes colectivos, individuales y categorías máster.',
    '2028-11-01',
    '2028-11-30',
    'month',
    '',
    null,
    'Multideportivo',
    'interclubes',
    'interclubs',
    'proposed',
    'CONSUDES',
    'published',
    true,
    270
),

(
    'Evaluación y Planificación Sordolímpicos 2029',
    'evaluacion-planificacion-sordolimpicos-2029',
    'Período institucional propuesto para evaluación y planificación del ciclo rumbo a los Sordolímpicos de Verano 2029.',
    '2028-12-01',
    '2028-12-31',
    'month',
    '',
    null,
    'Institucional',
    'institucional',
    'institutional',
    'proposed',
    'PANAMDES + CONSUDES',
    'published',
    true,
    280
),

-- ============================================================
-- 2029
-- ============================================================

(
    'Preparación y Clasificatorios para Sordolímpicos 2029',
    'preparacion-clasificatorios-sordolimpicos-2029',
    'Período propuesto para preparación final y clasificatorios estrictamente necesarios rumbo a los Sordolímpicos de Verano 2029.',
    '2029-01-01',
    '2029-03-31',
    'month',
    '',
    null,
    'Multideportivo',
    'outro',
    'institutional',
    'proposed',
    'PANAMDES',
    'published',
    true,
    310
),

(
    'Juegos Abiertos CONSUDES – Edición Reducida',
    'juegos-abiertos-consudes-edicion-reducida-2029',
    'Edición reducida propuesta de los Juegos Abiertos CONSUDES, priorizando clubes y modalidades que no entren en conflicto con el calendario internacional.',
    '2029-04-01',
    '2029-05-31',
    'month',
    '',
    null,
    'Multideportivo',
    'interclubes',
    'interclubs',
    'proposed',
    'CONSUDES',
    'published',
    true,
    320
),

(
    'Torneos Sudamericanos Máster e Interclubes',
    'torneos-sudamericanos-master-interclubes-2029',
    'Torneos propuestos de fútbol sala, baloncesto, voleibol, voleibol de playa y otras modalidades para categorías máster e interclubes.',
    '2029-11-01',
    '2029-11-30',
    'month',
    '',
    null,
    'Multideportivo',
    'interclubes',
    'interclubs',
    'proposed',
    'CONSUDES',
    'published',
    true,
    330
),

(
    'Foro Técnico Post-Sordolímpicos',
    'foro-tecnico-post-sordolimpicos-2029',
    'Foro técnico propuesto para evaluación del ciclo deportivo después de los Sordolímpicos de Verano 2029.',
    '2029-11-01',
    '2029-12-31',
    'month',
    '',
    null,
    'Institucional',
    'institucional',
    'congress',
    'proposed',
    'PANAMDES + CONSUDES',
    'published',
    true,
    340
),

-- ============================================================
-- 2030
-- ============================================================

(
    'Campeonatos Sudamericanos Sub-21 / Sub-23',
    'campeonatos-sudamericanos-sub21-sub23-2030',
    'Ciclo propuesto para categorías de base: baloncesto Sub-21, fútbol sala Sub-21, voleibol Sub-21 y fútbol Sub-23.',
    '2030-03-01',
    '2030-03-31',
    'month',
    '',
    null,
    'Multideportivo',
    'sub21',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    410
),

(
    'Campeonato Sudamericano Adulto de Balonmano y Baloncesto',
    'campeonato-sudamericano-balonmano-baloncesto-2030',
    'Campeonato sudamericano adulto propuesto de balonmano y baloncesto. Sede y organización por definir.',
    '2030-04-01',
    '2030-04-30',
    'month',
    '',
    null,
    'Balonmano / Baloncesto',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    420
),

(
    'Campeonato Sudamericano de Voleibol y Voleibol de Playa',
    'campeonato-sudamericano-voleibol-playa-2030',
    'Campeonato sudamericano propuesto de voleibol de sala y voleibol de playa. Sede y organización por definir.',
    '2030-05-01',
    '2030-05-31',
    'month',
    '',
    null,
    'Voleibol / Voleibol de Playa',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    430
),

(
    'Campeonato Sudamericano Adulto de Fútbol y Fútbol Sala',
    'campeonato-sudamericano-futbol-futsal-2030',
    'Campeonato sudamericano adulto propuesto de fútbol y fútbol sala. Sede y organización por definir.',
    '2030-06-01',
    '2030-06-30',
    'month',
    '',
    null,
    'Fútbol / Fútbol Sala',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    440
),

(
    'Juegos / Campeonatos Panamericanos de Sordos',
    'juegos-campeonatos-panamericanos-sordos-2030',
    'Ventana prioritaria propuesta para competición panamericana dentro del calendario integrado del ciclo 2027–2030.',
    '2030-01-01',
    '2030-12-31',
    'year',
    '',
    null,
    'Multideportivo',
    'outro',
    'championship',
    'proposed',
    'PANAMDES',
    'published',
    true,
    450
),

(
    'Campeonato Sudamericano de Deportes Individuales',
    'campeonato-sudamericano-deportes-individuales-2030',
    'Campeonato propuesto con modalidades individuales como bádminton, bowling, judo, karate, taekwondo, tenis, tenis de mesa, tiro y otras.',
    '2030-01-01',
    '2030-12-31',
    'year',
    '',
    null,
    'Deportes Individuales',
    'adulto',
    'championship',
    'proposed',
    'CONSUDES',
    'published',
    true,
    460
),

(
    'Juegos Abiertos Sudamericanos de Sordos / Interclubes',
    'juegos-abiertos-sudamericanos-interclubes-2030',
    'Edición completa propuesta para noviembre de 2030, incluyendo modalidades viables y categorías máster.',
    '2030-11-01',
    '2030-11-30',
    'month',
    '',
    null,
    'Multideportivo',
    'interclubes',
    'interclubs',
    'proposed',
    'CONSUDES',
    'published',
    true,
    470
),

(
    'Congreso del Ciclo 2031–2034',
    'congreso-ciclo-2031-2034',
    'Congreso propuesto para evaluación y planificación del próximo ciclo deportivo 2031–2034.',
    '2030-12-01',
    '2030-12-31',
    'month',
    '',
    null,
    'Institucional',
    'institucional',
    'congress',
    'proposed',
    'PANAMDES + CONSUDES',
    'published',
    true,
    480
)

ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    date_precision = EXCLUDED.date_precision,
    country = EXCLUDED.country,
    city = EXCLUDED.city,
    sport = EXCLUDED.sport,
    category = EXCLUDED.category,
    event_type = EXCLUDED.event_type,
    event_status = EXCLUDED.event_status,
    federation = EXCLUDED.federation,
    status = EXCLUDED.status,
    location_open = EXCLUDED.location_open,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();