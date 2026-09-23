#!/usr/bin/env python3

from pathlib import Path
import json
import re

SOURCE = Path("/Users/lmiglioli/Downloads/Museu-CONSUDES-READY")
OUTPUT = Path("src/data/museumGalleryData.ts")

EXPECTED_ALBUMS = 18
EXPECTED_PHOTOS = 1062

# Metadados que conseguimos afirmar a partir dos nomes dos álbuns.
ALBUMS = {
    "album-01-copa-america-09-1995": {
        "title": "Copa América — Setembro de 1995",
        "year": 1995,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registro histórico da Copa América realizada em setembro de 1995.",
            "es": "Registro histórico de la Copa América realizada en septiembre de 1995.",
            "en": "Historical photographic record of the Copa América held in September 1995.",
        },
    },

    "album-10-sulamericano-chile-1990": {
        "title": "Sul-Americano — Chile 1990",
        "year": 1990,
        "city": None,
        "country": "Chile",
        "description": {
            "pt": "Registro histórico do campeonato Sul-Americano realizado no Chile em 1990.",
            "es": "Registro histórico del campeonato Sudamericano realizado en Chile en 1990.",
            "en": "Historical photographic record of the South American championship held in Chile in 1990.",
        },
    },

    "album-11-sulamericano-chile-1990": {
        "title": "Sul-Americano — Chile 1990 — Álbum 2",
        "year": 1990,
        "city": None,
        "country": "Chile",
        "description": {
            "pt": "Segundo conjunto de registros históricos do campeonato Sul-Americano realizado no Chile em 1990.",
            "es": "Segundo conjunto de registros históricos del campeonato Sudamericano realizado en Chile en 1990.",
            "en": "Second collection of historical photographs from the South American championship held in Chile in 1990.",
        },
    },

    "album-12-sulamericano-uruguai-1989": {
        "title": "Sul-Americano — Uruguai 1989",
        "year": 1989,
        "city": None,
        "country": "Uruguai",
        "description": {
            "pt": "Registro histórico do campeonato Sul-Americano realizado no Uruguai em 1989.",
            "es": "Registro histórico del campeonato Sudamericano realizado en Uruguay en 1989.",
            "en": "Historical photographic record of the South American championship held in Uruguay in 1989.",
        },
    },

    "album-2-04-1989": {
        "title": "Acervo — Abril de 1989",
        "year": 1989,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registro histórico da CONSUDES datado de abril de 1989.",
            "es": "Registro histórico de la CONSUDES fechado en abril de 1989.",
            "en": "Historical CONSUDES photographic record dated April 1989.",
        },
    },

    "album-3-sulamericano-paraguai-futsal-04-1989": {
        "title": "Sul-Americano de Futsal — Paraguai 1989",
        "year": 1989,
        "city": None,
        "country": "Paraguai",
        "description": {
            "pt": "Registro histórico do Sul-Americano de Futsal realizado no Paraguai em abril de 1989.",
            "es": "Registro histórico del Sudamericano de Futsal realizado en Paraguay en abril de 1989.",
            "en": "Historical photographic record of the South American Futsal Championship held in Paraguay in April 1989.",
        },
    },

    "album-4-copa-america-sao-paulo-08-1995": {
        "title": "Copa América — São Paulo 1995",
        "year": 1995,
        "city": "São Paulo",
        "country": "Brasil",
        "description": {
            "pt": "Registro histórico da Copa América realizada em São Paulo, Brasil, em agosto de 1995.",
            "es": "Registro histórico de la Copa América realizada en São Paulo, Brasil, en agosto de 1995.",
            "en": "Historical photographic record of the Copa América held in São Paulo, Brazil, in August 1995.",
        },
    },

    "album-5-1991": {
        "title": "Acervo — 1991",
        "year": 1991,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registro histórico da CONSUDES referente ao ano de 1991.",
            "es": "Registro histórico de la CONSUDES correspondiente al año 1991.",
            "en": "Historical CONSUDES photographic record from 1991.",
        },
    },

    "album-6-sulamericano-paraguai-04-1989": {
        "title": "Sul-Americano — Paraguai 1989",
        "year": 1989,
        "city": None,
        "country": "Paraguai",
        "description": {
            "pt": "Registro histórico do campeonato Sul-Americano realizado no Paraguai em abril de 1989.",
            "es": "Registro histórico del campeonato Sudamericano realizado en Paraguay en abril de 1989.",
            "en": "Historical photographic record of the South American championship held in Paraguay in April 1989.",
        },
    },

    "album-7-sulamericano-paraguai-06-1992": {
        "title": "Sul-Americano — Paraguai 1992",
        "year": 1992,
        "city": None,
        "country": "Paraguai",
        "description": {
            "pt": "Registro histórico do campeonato Sul-Americano realizado no Paraguai em junho de 1992.",
            "es": "Registro histórico del campeonato Sudamericano realizado en Paraguay en junio de 1992.",
            "en": "Historical photographic record of the South American championship held in Paraguay in June 1992.",
        },
    },

    "album-8-sulamericano-baires-1991": {
        "title": "Sul-Americano — Buenos Aires 1991",
        "year": 1991,
        "city": "Buenos Aires",
        "country": "Argentina",
        "description": {
            "pt": "Registro histórico do campeonato Sul-Americano realizado em Buenos Aires, Argentina, em 1991.",
            "es": "Registro histórico del campeonato Sudamericano realizado en Buenos Aires, Argentina, en 1991.",
            "en": "Historical photographic record of the South American championship held in Buenos Aires, Argentina, in 1991.",
        },
    },

    "album-9-sulamericano-ibirapuera-sao-paulo-11-1991": {
        "title": "Sul-Americano — Ibirapuera, São Paulo 1991",
        "year": 1991,
        "city": "São Paulo",
        "country": "Brasil",
        "description": {
            "pt": "Registro histórico do campeonato Sul-Americano realizado no Ibirapuera, em São Paulo, em novembro de 1991.",
            "es": "Registro histórico del campeonato Sudamericano realizado en Ibirapuera, São Paulo, en noviembre de 1991.",
            "en": "Historical photographic record of the South American championship held at Ibirapuera in São Paulo in November 1991.",
        },
    },

    "fotos-do-envelope": {
        "title": "Fotos do Envelope",
        "year": None,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registros fotográficos históricos preservados em envelope.",
            "es": "Registros fotográficos históricos preservados en un sobre.",
            "en": "Historical photographic records preserved in an envelope.",
        },
    },

    "fichario4": {
        "title": "Fichário 4",
        "year": None,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registros fotográficos históricos preservados no Fichário 4.",
            "es": "Registros fotográficos históricos preservados en el Fichário 4.",
            "en": "Historical photographic records preserved in File 4.",
        },
    },

    "fichario5": {
        "title": "Fichário 5",
        "year": None,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registros fotográficos históricos preservados no Fichário 5.",
            "es": "Registros fotográficos históricos preservados en el Fichário 5.",
            "en": "Historical photographic records preserved in File 5.",
        },
    },

    "fichario6": {
        "title": "Fichário 6",
        "year": None,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registros fotográficos históricos preservados no Fichário 6.",
            "es": "Registros fotográficos históricos preservados en el Fichário 6.",
            "en": "Historical photographic records preserved in File 6.",
        },
    },

    "livros-grandes": {
        "title": "Livros Grandes",
        "year": None,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registros fotográficos históricos preservados nos livros grandes.",
            "es": "Registros fotográficos históricos preservados en los libros grandes.",
            "en": "Historical photographic records preserved in the large books.",
        },
    },

    "originais": {
        "title": "Originais",
        "year": None,
        "city": None,
        "country": None,
        "description": {
            "pt": "Registros fotográficos originais preservados no acervo histórico.",
            "es": "Registros fotográficos originales preservados en el archivo histórico.",
            "en": "Original photographic records preserved in the historical archive.",
        },
    },


}


def ts_string(value):
    return json.dumps(value, ensure_ascii=False)


def ts_nullable(value):
    if value is None:
        return "null"
    return ts_string(value)


def natural_key(filename):
    return [
        int(part) if part.isdigit() else part.lower()
        for part in re.split(r"(\d+)", filename)
    ]


def main():
    if not SOURCE.exists():
        raise RuntimeError(f"Pasta não encontrada: {SOURCE}")

    album_dirs = sorted(
        [p for p in SOURCE.iterdir() if p.is_dir()],
        key=lambda p: p.name,
    )

    if len(album_dirs) != EXPECTED_ALBUMS:
        raise RuntimeError(
            f"Esperávamos {EXPECTED_ALBUMS} álbuns, "
            f"mas encontramos {len(album_dirs)}."
        )

    actual_slugs = {p.name for p in album_dirs}
    configured_slugs = set(ALBUMS)

    missing = actual_slugs - configured_slugs
    extra = configured_slugs - actual_slugs

    if missing:
        raise RuntimeError(
            "Faltam metadados para: " + ", ".join(sorted(missing))
        )

    if extra:
        raise RuntimeError(
            "Configuração possui álbuns inexistentes: "
            + ", ".join(sorted(extra))
        )

    total_photos = sum(
        len(list(album.glob("*.webp")))
        for album in album_dirs
    )

    if total_photos != EXPECTED_PHOTOS:
        raise RuntimeError(
            f"Esperávamos {EXPECTED_PHOTOS} fotos, "
            f"mas encontramos {total_photos}."
        )

    lines = [
        "// AUTO-GENERATED FILE.",
        "// Gerado por scripts/generate-museum-gallery-data.py",
        "// Não editar manualmente a lista de fotos.",
        "",
        'import type { GalleryAlbum } from "./galleryData";',
        "",
        "export const museumGalleryAlbums: GalleryAlbum[] = [",
    ]

    for album_dir in album_dirs:
        slug = album_dir.name
        metadata = ALBUMS[slug]

        photos = sorted(
            [p.name for p in album_dir.glob("*.webp")],
            key=natural_key,
        )

        if not photos:
            raise RuntimeError(f"Álbum sem fotos: {slug}")

        cover = photos[0]

        lines.extend([
            "  {",
            f'    slug: "museu/{slug}",',
            f"    title: {ts_string(metadata['title'])},",
            f"    year: {metadata['year'] if metadata['year'] is not None else 'null'},",
            f"    city: {ts_nullable(metadata['city'])},",
            f"    country: {ts_nullable(metadata['country'])},",
            "    description: {",
            f"      es: {ts_string(metadata['description']['es'])},",
            f"      pt: {ts_string(metadata['description']['pt'])},",
            f"      en: {ts_string(metadata['description']['en'])}",
            "    },",
            '    category: "historico",',
            '    tier: "T3",',
            f"    coverFile: {ts_string(cover)},",
            f"    photoCount: {len(photos)},",
            "    photos: [",
        ])

        for filename in photos:
            if filename == cover:
                lines.append(
                    f"      {{ filename: {ts_string(filename)}, isHero: true }},"
                )
            else:
                lines.append(
                    f"      {{ filename: {ts_string(filename)} }},"
                )

        lines.extend([
            "    ]",
            "  },",
        ])

    lines.extend([
        "];",
        "",
    ])

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")

    print()
    print("==========================================")
    print(" CONSUDES — DADOS DA GALERIA GERADOS")
    print("==========================================")
    print()
    print(f"Álbuns: {len(album_dirs)}")
    print(f"Fotos:  {total_photos}")
    print(f"Arquivo: {OUTPUT}")
    print()


if __name__ == "__main__":
    main()