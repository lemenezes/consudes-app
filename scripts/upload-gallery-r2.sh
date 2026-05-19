#!/usr/bin/env bash
# scripts/upload-gallery-r2.sh
# ─────────────────────────────────────────────────────────────────────────
# Faz upload dos WebP processados para o bucket Cloudflare R2 consudes-assets.
#
# Pré-requisitos:
#   1. wrangler instalado (npx wrangler ou global)
#   2. Autenticado: npx wrangler login
#   3. Bucket 'consudes-assets' já criado no Cloudflare
#   4. Domínio cdn.consudes.leandrom.com.br configurado no R2
#
# Uso:
#   chmod +x scripts/upload-gallery-r2.sh
#   ./scripts/upload-gallery-r2.sh
#
# Para upload seletivo de um álbum:
#   ALBUM=interclubes/2018-ic ./scripts/upload-gallery-r2.sh
# ─────────────────────────────────────────────────────────────────────────

set -euo pipefail

BUCKET="consudes-assets"
LOCAL_DIR="/Users/lmiglioli/Documents/images/CONSUDES_GALLERY_READY/gallery"
WRANGLER="npx --yes wrangler"

# ── Validações ────────────────────────────────────────────────────────────

if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌  Pasta de origem não encontrada: $LOCAL_DIR"
  echo "    Execute primeiro: node scripts/prepare-gallery.mjs"
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  CONSUDES — Upload galeria → Cloudflare R2          ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Bucket  : $BUCKET"
echo "  Origem  : $LOCAL_DIR"
echo "  CDN     : https://cdn.consudes.leandrom.com.br"
echo ""

# Verificar autenticação wrangler (whoami falha se não logado)
if ! $WRANGLER whoami &>/dev/null; then
  echo "❌  Wrangler não autenticado."
  echo "    Execute: npx wrangler login"
  exit 1
fi

# ── Coletar arquivos ───────────────────────────────────────────────────────

if [ -n "${ALBUM:-}" ]; then
  # Upload de álbum específico
  SEARCH_DIR="$LOCAL_DIR/$ALBUM"
  if [ ! -d "$SEARCH_DIR" ]; then
    echo "❌  Álbum não encontrado: $SEARCH_DIR"
    exit 1
  fi
  echo "  Modo     : álbum único → $ALBUM"
  WEBP_FILES=$(find "$SEARCH_DIR" -name "*.webp" | sort)
else
  # Upload completo
  echo "  Modo     : todos os álbuns processados"
  WEBP_FILES=$(find "$LOCAL_DIR" -name "*.webp" | sort)
fi

TOTAL=$(echo "$WEBP_FILES" | wc -l | tr -d ' ')
echo "  Arquivos : $TOTAL WebP"
echo ""

# ── Upload ────────────────────────────────────────────────────────────────

COUNT=0
ERRORS=0

while IFS= read -r filepath; do
  # Caminho relativo a partir de LOCAL_DIR
  relative="${filepath#$LOCAL_DIR/}"
  r2_key="gallery/$relative"

  COUNT=$((COUNT + 1))
  printf "  [%3d/%3d] %s\n" "$COUNT" "$TOTAL" "$r2_key"

  if $WRANGLER r2 object put "$BUCKET/$r2_key" \
      --file="$filepath" \
      --content-type="image/webp" \
      --cache-control="public, max-age=31536000, immutable" \
      2>/dev/null; then
    : # ok
  else
    echo "    ⚠  Erro no upload: $filepath"
    ERRORS=$((ERRORS + 1))
  fi

done <<< "$WEBP_FILES"

# ── Relatório ─────────────────────────────────────────────────────────────

echo ""
echo "────────────────────────────────────────────────────────"
if [ "$ERRORS" -eq 0 ]; then
  echo "  ✅  $COUNT arquivo(s) enviados com sucesso."
else
  echo "  ⚠   $COUNT arquivo(s) processados — $ERRORS erro(s)."
  echo "      Verifique a autenticação e tente novamente."
fi
echo ""
echo "  Verificar (exemplo):"
echo "  curl -I https://cdn.consudes.leandrom.com.br/gallery/interclubes/2018-ic/cover.webp"
echo ""
