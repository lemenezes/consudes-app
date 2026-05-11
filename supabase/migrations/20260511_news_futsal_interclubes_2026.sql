-- ---------------------------------------------------------------------------
-- Notícia: Campeonato Sudamericano Interclubes de Futsal 2026 — Uruguay
-- ---------------------------------------------------------------------------

insert into
    public.news (
        title,
        slug,
        excerpt,
        content,
        cover_url,
        lang,
        status,
        published_at
    )
values (
        'Campeonato Sudamericano Interclubes de Futsal 2026 será realizado en Uruguay',
        'campeonato-sudamericano-interclubes-de-futsal-2026-sera-realizado-en-uruguay',
        'El Campeonato Sudamericano Interclubes de Futsal 2026 se llevará a cabo del 11 al 18 de octubre de 2026, en la ciudad de Florida, Uruguay, en conjunto con los Juegos Sudamericanos de Sordos.',
        '<p>El Campeonato Sudamericano Interclubes de Futsal 2026 se llevará a cabo del <strong>11 al 18 de octubre de 2026</strong>, en la ciudad de <strong>Florida, Uruguay</strong>.</p><p>El evento se desarrollará en conjunto con los <strong>Juegos Sudamericanos de Sordos</strong>, reuniendo atletas y delegaciones de distintos países de América del Sur en una importante instancia de integración deportiva y fortalecimiento de la comunidad sorda en el continente.</p><p>La organización del campeonato está siendo coordinada por la <strong>CONSUDES</strong>, en conjunto con la <strong>ODSU</strong> y el Comité Organizador local.</p><p>Actualmente, se encuentran en proceso de definición los últimos aspectos logísticos del evento, incluyendo hospedaje y alimentación de los participantes.</p><p>Más información oficial, como reglamento, inscripciones y programación detallada, será publicada próximamente en los canales oficiales de la CONSUDES.</p>',
        null,
        'es',
        'published',
        '2026-05-11T00:00:00Z'
    )
on conflict (slug) do nothing;