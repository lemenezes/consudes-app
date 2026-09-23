#!/usr/bin/env python3

from pathlib import Path
from PIL import Image, ImageOps
import re
import unicodedata

# ============================================================
# CONFIGURAÇÃO
# ============================================================

SOURCE_DIR = Path("/Users/lmiglioli/Downloads/Museu")

OUTPUT_DIR = Path(
    "/Users/lmiglioli/Downloads/Museu-CONSUDES-READY"
)

LOGO_FILE = Path("public/consudes-logo-watermark.png")

MAX_SIZE = 1800
WEBP_QUALITY = 92

LOGO_WIDTH_PERCENT = 0.20
MARGIN_PERCENT = 0.02

IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".heic",
}

# Pastas sem identificação histórica específica.
# Todas serão agrupadas no mesmo álbum público.
HISTORICAL_ARCHIVE_DIRS = {
    "Fichário4",
    "Fichário5",
    "Fichário6",
    "FOTOS DO ENVELOPE",
    "LIVROS GRANDES",
    "Originais",
}


# ============================================================
# UTILIDADES
# ============================================================

def normalize_key(value):
    return unicodedata.normalize("NFC", value).casefold()


HISTORICAL_ARCHIVE_KEYS = {
    normalize_key(name) for name in HISTORICAL_ARCHIVE_DIRS
}


def slugify(value):
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = value.lower()

    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")

    return value


def is_image(path):
    return (
        path.is_file()
        and path.suffix.lower() in IMAGE_EXTENSIONS
    )


# ============================================================
# WATERMARK
# ============================================================

def prepare_image(source_path, destination_path, logo_original):
    with Image.open(source_path) as opened:
        photo = ImageOps.exif_transpose(opened).convert("RGBA")

    # Reduz somente se ultrapassar o limite.
    # Nunca amplia uma imagem pequena.
    if max(photo.width, photo.height) > MAX_SIZE:
        ratio = MAX_SIZE / max(photo.width, photo.height)

        new_width = max(1, round(photo.width * ratio))
        new_height = max(1, round(photo.height * ratio))

        photo = photo.resize(
            (new_width, new_height),
            Image.Resampling.LANCZOS,
        )

    logo = logo_original.copy()

    target_width = max(
        1,
        round(photo.width * LOGO_WIDTH_PERCENT),
    )

    target_height = max(
        1,
        round(
            logo.height
            * target_width
            / logo.width
        ),
    )

    logo = logo.resize(
        (target_width, target_height),
        Image.Resampling.LANCZOS,
    )

    margin = max(
        4,
        round(photo.width * MARGIN_PERCENT),
    )

    x = photo.width - logo.width - margin
    y = photo.height - logo.height - margin

    photo.alpha_composite(
        logo,
        (x, y),
    )

    destination_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    photo.convert("RGB").save(
        destination_path,
        "WEBP",
        quality=WEBP_QUALITY,
        method=6,
    )


# ============================================================
# DESTINO / ÁLBUM
# ============================================================

def get_album_name(relative_path):
    top_directory = relative_path.parts[0]

    if normalize_key(top_directory) in HISTORICAL_ARCHIVE_KEYS:
        return "Acervo Histórico CONSUDES"

    return top_directory


def build_destination(source_path):
    relative_path = source_path.relative_to(SOURCE_DIR)

    album_name = get_album_name(relative_path)
    album_slug = slugify(album_name)

    #
    # Incluímos o nome da pasta original no arquivo para evitar
    # colisões quando Fichário4/Fichário5/etc. possuem arquivos
    # com nomes iguais.
    #
    original_directory = relative_path.parts[0]
    directory_slug = slugify(original_directory)

    filename_slug = slugify(source_path.stem)

    destination_name = (
        f"{directory_slug}-{filename_slug}.webp"
    )

    return (
        OUTPUT_DIR
        / album_slug
        / destination_name
    )


# ============================================================
# MAIN
# ============================================================

def main():
    if not SOURCE_DIR.exists():
        raise RuntimeError(
            f"Pasta de origem não encontrada: {SOURCE_DIR}"
        )

    if not LOGO_FILE.exists():
        raise RuntimeError(
            f"Logo não encontrada: {LOGO_FILE}"
        )

    logo_original = Image.open(LOGO_FILE).convert("RGBA")

    images = sorted(
        path
        for path in SOURCE_DIR.rglob("*")
        if is_image(path)
    )

    print()
    print("==========================================")
    print(" CONSUDES — PREPARAÇÃO DO ACERVO HISTÓRICO")
    print("==========================================")
    print()
    print(f"Origem:  {SOURCE_DIR}")
    print(f"Destino: {OUTPUT_DIR}")
    print(f"Imagens encontradas: {len(images)}")
    print()

    processed = 0
    failed = 0

    for index, source_path in enumerate(images, start=1):
        destination_path = build_destination(source_path)

        print(
            f"[{index}/{len(images)}] "
            f"{source_path.relative_to(SOURCE_DIR)}"
        )

        try:
            prepare_image(
                source_path,
                destination_path,
                logo_original,
            )

            processed += 1

        except Exception as error:
            failed += 1

            print(
                f"    ERRO: {error}"
            )

    print()
    print("==========================================")
    print(" CONCLUÍDO")
    print("==========================================")
    print()
    print(f"Encontradas:  {len(images)}")
    print(f"Processadas:  {processed}")
    print(f"Falhas:       {failed}")
    print(f"Destino:      {OUTPUT_DIR}")
    print()


if __name__ == "__main__":
    main()