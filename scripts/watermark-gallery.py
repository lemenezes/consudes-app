#!/usr/bin/env python3

import argparse
import json
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.parse import urlencode

from PIL import Image, ImageOps


# ============================================================
# CONFIGURAÇÃO
# ============================================================

BASE_URL = "http://localhost:8787"

LIST_FILE = Path("/tmp/consudes-gallery.json")

LOGO_FILE = Path(
    "/tmp/consudes-watermark-test/logo-site.webp"
)

SOURCE_PREFIX = "gallery/"
DESTINATION_PREFIX = "gallery-watermarked/"

LOGO_WIDTH_PERCENT = 0.20
MARGIN_PERCENT = 0.02

DOWNLOAD_TIMEOUT = 20
UPLOAD_TIMEOUT = 30
MAX_ATTEMPTS = 3

IMAGE_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
)


# ============================================================
# CURL
# ============================================================

def run_curl(args):
    return subprocess.run(
        ["curl", "-fsS"] + args,
        capture_output=True,
        text=True,
    )


# ============================================================
# DOWNLOAD
# ============================================================

def download_image(key, destination):
    url = (
        BASE_URL
        + "/image?"
        + urlencode({"key": key})
    )

    for attempt in range(1, MAX_ATTEMPTS + 1):
        result = run_curl([
            "--max-time",
            str(DOWNLOAD_TIMEOUT),
            url,
            "-o",
            str(destination),
        ])

        if result.returncode == 0:
            return True

        print(
            f"      download falhou "
            f"(tentativa {attempt}/{MAX_ATTEMPTS})"
        )

        time.sleep(1)

    return False


# ============================================================
# WATERMARK
# ============================================================

def apply_watermark(
    source_path,
    destination_path,
    logo_original,
):
    photo = ImageOps.exif_transpose(
        Image.open(source_path)
    ).convert("RGBA")

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

    photo.convert("RGB").save(
        destination_path,
        "WEBP",
        quality=92,
        method=6,
    )

    return photo.width, photo.height


# ============================================================
# UPLOAD
# ============================================================

def upload_image(source_path, key):
    url = (
        BASE_URL
        + "/watermarked?"
        + urlencode({"key": key})
    )

    for attempt in range(1, MAX_ATTEMPTS + 1):
        result = subprocess.run(
            [
                "curl",
                "-sS",
                "--max-time",
                str(UPLOAD_TIMEOUT),
                "-X",
                "PUT",
                "-H",
                "Content-Type: image/webp",
                "--data-binary",
                f"@{source_path}",
                "-w",
                "\n%{http_code}",
                url,
            ],
            capture_output=True,
            text=True,
        )

        # Se curl teve problema de conexão/timeout
        if result.returncode != 0:
            print(
                f"      upload falhou "
                f"(tentativa {attempt}/{MAX_ATTEMPTS})"
            )
            time.sleep(1)
            continue

        # Separar body e HTTP status
        try:
            body, status_code = result.stdout.rsplit("\n", 1)
            status_code = int(status_code.strip())
        except (ValueError, TypeError):
            print(
                f"      resposta inválida "
                f"(tentativa {attempt}/{MAX_ATTEMPTS})"
            )
            time.sleep(1)
            continue

        # Upload realizado
        if 200 <= status_code < 300:
            try:
                response = json.loads(body)

                if response.get("ok"):
                    return "uploaded"
            except json.JSONDecodeError:
                pass

        # Já existe = sucesso do ponto de vista do lote
        if status_code == 409:
            return "exists"

        print(
            f"      HTTP {status_code} "
            f"(tentativa {attempt}/{MAX_ATTEMPTS})"
        )

        if body:
            print(f"      {body[:300]}")

        time.sleep(1)

    return "failed"


# ============================================================
# CARREGAR LISTA
# ============================================================

def load_objects():
    if not LIST_FILE.exists():
        raise RuntimeError(
            f"Lista não encontrada: {LIST_FILE}"
        )

    with LIST_FILE.open() as file:
        data = json.load(file)

    return [
        obj
        for obj in data["objects"]
        if obj["key"]
        .lower()
        .endswith(IMAGE_EXTENSIONS)
    ]


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description=(
            "Aplica watermark CONSUDES "
            "nas imagens da galeria."
        )
    )

    parser.add_argument(
        "--limit",
        type=int,
        help="Processar somente N imagens.",
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help=(
            "Processa localmente, "
            "mas não envia ao R2."
        ),
    )

    args = parser.parse_args()

    # --------------------------------------------------------
    # Validações
    # --------------------------------------------------------

    if not LOGO_FILE.exists():
        raise RuntimeError(
            f"Logo não encontrado: {LOGO_FILE}"
        )

    objects = load_objects()

    if args.limit:
        objects = objects[:args.limit]

    logo_original = Image.open(
        LOGO_FILE
    ).convert("RGBA")

    total = len(objects)

    uploaded = 0
    exists = 0
    local_only = 0
    failed = []

    print()
    print("=" * 65)
    print("CONSUDES — WATERMARK DA GALERIA")
    print("=" * 65)
    print(f"Imagens: {total}")
    print(
        f"Logo: {int(LOGO_WIDTH_PERCENT * 100)}%"
    )
    print(
        f"Margem: {int(MARGIN_PERCENT * 100)}%"
    )

    if args.dry_run:
        print("Modo: DRY RUN — sem upload")
    else:
        print(
            f"Destino R2: {DESTINATION_PREFIX}"
        )

    print("=" * 65)
    print()

    # --------------------------------------------------------
    # Processamento
    # --------------------------------------------------------

    for number, obj in enumerate(objects, 1):
        source_key = obj["key"]

        if not source_key.startswith(SOURCE_PREFIX):
            print(
                f"[{number:03d}/{total:03d}] "
                "❌ prefixo inválido"
            )
            failed.append(
                (source_key, "Prefixo inválido")
            )
            continue

        relative_key = source_key[
            len(SOURCE_PREFIX):
        ]

        destination_key = (
            DESTINATION_PREFIX
            + relative_key
        )

        print(
            f"[{number:03d}/{total:03d}] "
            f"{source_key}"
        )

        try:
            with tempfile.TemporaryDirectory() as tmp:
                tmp_dir = Path(tmp)

                original_path = (
                    tmp_dir / "original"
                )

                watermarked_path = (
                    tmp_dir / "watermarked.webp"
                )

                # --------------------------------------------
                # Download
                # --------------------------------------------

                if not download_image(
                    source_key,
                    original_path,
                ):
                    raise RuntimeError(
                        "Falha no download "
                        "após 3 tentativas"
                    )

                # --------------------------------------------
                # Watermark
                # --------------------------------------------

                width, height = apply_watermark(
                    original_path,
                    watermarked_path,
                    logo_original,
                )

                # --------------------------------------------
                # Dry run
                # --------------------------------------------

                if args.dry_run:
                    local_only += 1

                    print(
                        f"    🧪 OK "
                        f"{width}x{height} "
                        "(sem upload)"
                    )

                    continue

                # --------------------------------------------
                # Upload
                # --------------------------------------------

                status = upload_image(
                    watermarked_path,
                    destination_key,
                )

                if status == "uploaded":
                    uploaded += 1

                    print(
                        f"    ✅ {width}x{height}"
                    )
                    print(
                        f"       → {destination_key}"
                    )

                elif status == "exists":
                    exists += 1

                    print(
                        "    ⏭️  já existe"
                    )

                else:
                    raise RuntimeError(
                        "Falha no upload "
                        "após 3 tentativas"
                    )

        except Exception as error:
            failed.append(
                (source_key, str(error))
            )

            print(
                f"    ❌ ERRO: {error}"
            )

    # --------------------------------------------------------
    # Resultado
    # --------------------------------------------------------

    print()
    print("=" * 65)
    print("RESULTADO")
    print("=" * 65)

    print(f"Total:        {total}")

    if args.dry_run:
        print(f"Processadas:  {local_only}")
    else:
        print(f"Enviadas:     {uploaded}")
        print(f"Já existiam:  {exists}")

    print(f"Erros:        {len(failed)}")

    if failed:
        print()
        print("ARQUIVOS COM ERRO:")

        for key, error in failed:
            print(f"- {key}")
            print(f"  {error}")

    print()
    print(
        "gallery/ NÃO foi alterada."
    )

    print("=" * 65)


if __name__ == "__main__":
    main()