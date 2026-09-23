#!/usr/bin/env bash

set -u

SOURCE="/Users/lmiglioli/Downloads/Museu-CONSUDES-READY"
BUCKET="consudes-assets"
PREFIX="gallery-watermarked/museu"

if [ ! -d "$SOURCE" ]; then
  echo "ERRO: pasta não encontrada:"
  echo "$SOURCE"
  exit 1
fi

TOTAL=$(find "$SOURCE" -type f -name "*.webp" | wc -l | tr -d ' ')

if [ "$TOTAL" -ne 1062 ]; then
  echo "ERRO: esperávamos 1062 imagens, mas encontramos $TOTAL."
  echo "Upload cancelado."
  exit 1
fi

echo
echo "=========================================="
echo " CONSUDES — UPLOAD ACERVO PARA R2"
echo "=========================================="
echo
echo "Bucket:  $BUCKET"
echo "Prefixo: $PREFIX"
echo "Fotos:   $TOTAL"
echo

COUNT=0
FAILED=0

while IFS= read -r FILE; do
  COUNT=$((COUNT + 1))

  RELATIVE="${FILE#$SOURCE/}"
  KEY="$PREFIX/$RELATIVE"

  echo "[$COUNT/$TOTAL] $KEY"

  if npx wrangler r2 object put "$BUCKET/$KEY" \
      --file="$FILE" \
      --content-type="image/webp" \
      --remote >/dev/null 2>&1; then

    echo "    OK"

  else
    echo "    ERRO"
    FAILED=$((FAILED + 1))
  fi

done < <(find "$SOURCE" -type f -name "*.webp" | sort)

echo
echo "=========================================="
echo " UPLOAD CONCLUÍDO"
echo "=========================================="
echo
echo "Total:   $TOTAL"
echo "Sucesso: $((TOTAL - FAILED))"
echo "Falhas:  $FAILED"
echo

if [ "$FAILED" -gt 0 ]; then
  echo "ATENÇÃO: houve falhas no upload."
  exit 1
fi

echo "Todas as imagens foram enviadas com sucesso."