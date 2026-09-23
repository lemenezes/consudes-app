#!/usr/bin/env python3

from pathlib import Path
import json
import re
from datetime import datetime

SOURCE = Path("/Users/lmiglioli/Downloads/Museu-CONSUDES-READY")
TS_SOURCE = Path("src/data/museumGalleryData.ts")

# Data fixa desta integração.
OUTPUT = Path(
    "supabase/migrations/20260922040000_museum_gallery_albums.sql"
)

EXPECTED_ALBUMS = 13
EXPECTED_PHOTOS = 1073


def sql_string(value):
    if value is None:
        return "NULL"

    return "'" + str(value).replace("'", "''") + "'"


def extract_album_blocks(content):
    """
    Extrai os objetos principais do array museumGalleryAlbums.
    Faz leitura por balanceamento de chaves para não depender
    de regex sobre os arrays de fotos.
    """
    start = content.find("export const museumGalleryAlbums")

    if start == -1:
        raise RuntimeError(
            "museumGalleryAlbums não encontrado em "
            f"{TS_SOURCE}"
        )

    array_start = content.find("[", content.find("=", start))

    if array_start == -1:
        raise RuntimeError("Início do array não encontrado.")

    blocks = []
    depth = 0
    object_start = None
    in_string = False
    escaped = False

    for i in range(array_start + 1, len(content)):
        char = content[i]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
            continue

        if char == "{":
            if depth == 0:
                object_start = i
            depth += 1

        elif char == "}":
            depth -= 1

            if depth == 0 and object_start is not None:
                blocks.append(content[object_start:i + 1])
                object_start = None

        elif char == "]" and depth == 0:
            break

    return blocks


def extract_string(block, field):
    match = re.search(
        rf'{re.escape(field)}:\s*("(?:\\.|[^"\\])*")',
        block
    )

    if not match:
        return None

    return json.loads(match.group(1))


def extract_number(block, field):
    match = re.search(
        rf'{re.escape(field)}:\s*(null|\d+)',
        block
    )

    if not match:
        return None

    if match.group(1) == "null":
        return None

    return int(match.group(1))


def extract_description(block):
    match = re.search(
        r"description:\s*\{(.*?)\}\s*,\s*category:",
        block,
        re.DOTALL,
    )

    if not match:
        raise RuntimeError("description não encontrada.")

    desc_block = match.group(1)

    result = {}

    for lang in ("es", "pt", "en"):
        lang_match = re.search(
            rf'{lang}:\s*("(?:\\.|[^"\\])*")',
            desc_block,
        )

        if not lang_match:
            raise RuntimeError(
                f"Descrição '{lang}' não encontrada."
            )

        result[lang] = json.loads(lang_match.group(1))

    return result


def extract_photos(block):
    marker = "photos: ["
    start = block.find(marker)

    if start == -1:
        raise RuntimeError("Array photos não encontrado.")

    photos_block = block[start:]

    filenames = re.findall(
        r'filename:\s*("(?:\\.|[^"\\])*")',
        photos_block,
    )

    return [json.loads(value) for value in filenames]


def main():
    if not SOURCE.exists():
        raise RuntimeError(
            f"Pasta de origem não encontrada: {SOURCE}"
        )

    if not TS_SOURCE.exists():
        raise RuntimeError(
            f"Arquivo não encontrado: {TS_SOURCE}"
        )

    content = TS_SOURCE.read_text(encoding="utf-8")
    blocks = extract_album_blocks(content)

    if len(blocks) != EXPECTED_ALBUMS:
        raise RuntimeError(
            f"Esperávamos {EXPECTED_ALBUMS} álbuns no TypeScript, "
            f"mas encontramos {len(blocks)}."
        )

    albums = []
    total_photos = 0

    for block in blocks:
        slug = extract_string(block, "slug")
        title = extract_string(block, "title")
        year = extract_number(block, "year")
        city = extract_string(block, "city")
        country = extract_string(block, "country")
        cover_file = extract_string(block, "coverFile")
        photo_count = extract_number(block, "photoCount")
        description = extract_description(block)
        filenames = extract_photos(block)

        if not slug or not title:
            raise RuntimeError(
                "Álbum encontrado sem slug ou title."
            )

        if photo_count != len(filenames):
            raise RuntimeError(
                f"{slug}: photoCount={photo_count}, "
                f"mas foram encontradas {len(filenames)} fotos."
            )

        # Confere também contra a pasta física usada no upload.
        folder_slug = slug.removeprefix("museu/")
        folder = SOURCE / folder_slug

        if not folder.exists():
            raise RuntimeError(
                f"Pasta local não encontrada para {slug}: {folder}"
            )

        local_files = sorted(
            p.name for p in folder.glob("*.webp")
        )

        if set(local_files) != set(filenames):
            raise RuntimeError(
                f"As fotos do TypeScript não correspondem "
                f"à pasta local de {slug}."
            )

        photos_json = []

        for filename in filenames:
            photo = {"filename": filename}

            if filename == cover_file:
                photo["isHero"] = True

            photos_json.append(photo)
        total_photos += len(photos_json)

        albums.append({
            "slug": slug,
            "title": title,
            "year": year,
            "city": city,
            "country": country,
            "description": description,
            "category": "historico",
            "tier": "T3",
            "cover_file": cover_file,
            "cover_position": "center",
            "photo_count": photo_count,
            "photos": photos_json,
            "featured": False,
        })

    if total_photos != EXPECTED_PHOTOS:
        raise RuntimeError(
            f"Esperávamos {EXPECTED_PHOTOS} fotos, "
            f"mas encontramos {total_photos}."
        )

    lines = [
        "-- =============================================================================",
        "-- CONSUDES — Acervo Histórico Digitalizado",
        "-- 13 álbuns / 1.062 fotografias",
        "-- Imagens armazenadas no Cloudflare R2:",
        "-- gallery-watermarked/museu/{albumSlug}/{filename}",
        "-- =============================================================================",
        "",
        "-- Esta migration apenas adiciona os novos álbuns.",
        "-- ON CONFLICT DO NOTHING evita sobrescrever alterações futuras feitas no CMS.",
        "",
    ]

    for album in albums:
        description_json = json.dumps(
            album["description"],
            ensure_ascii=False,
            separators=(",", ":"),
        )

        photos_json = json.dumps(
            album["photos"],
            ensure_ascii=False,
            separators=(",", ":"),
        )

        lines.extend([
            "insert into public.gallery_albums (",
            "  slug,",
            "  title,",
            "  year,",
            "  city,",
            "  country,",
            "  description,",
            "  category,",
            "  tier,",
            "  cover_file,",
            "  cover_position,",
            "  photo_count,",
            "  photos,",
            "  featured",
            ") values (",
            f"  {sql_string(album['slug'])},",
            f"  {sql_string(album['title'])},",
            f"  {album['year'] if album['year'] is not None else 'NULL'},",
            f"  {sql_string(album['city'])},",
            f"  {sql_string(album['country'])},",
            f"  {sql_string(description_json)}::jsonb,",
            f"  {sql_string(album['category'])},",
            f"  {sql_string(album['tier'])},",
            f"  {sql_string(album['cover_file'])},",
            f"  {sql_string(album['cover_position'])},",
            f"  {album['photo_count']},",
            f"  {sql_string(photos_json)}::jsonb,",
            "  false",
            ")",
            "on conflict (slug) do nothing;",
            "",
        ])

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        "\n".join(lines),
        encoding="utf-8",
    )

    print()
    print("==========================================")
    print(" CONSUDES — MIGRATION GERADA")
    print("==========================================")
    print()
    print(f"Álbuns: {len(albums)}")
    print(f"Fotos:  {total_photos}")
    print(f"Arquivo: {OUTPUT}")
    print()


if __name__ == "__main__":
    main()