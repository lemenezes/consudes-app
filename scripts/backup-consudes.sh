#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="consudes"
DATE="$(date +%Y-%m-%d_%H-%M)"
BACKUP_ROOT="$HOME/Dropbox/BACKUPS/$PROJECT_NAME/$DATE"

DB_HOST="aws-1-us-west-2.pooler.supabase.com"
DB_PORT="6543"
DB_USER="postgres.fdlxafgubtsaijovrete"
DB_NAME="postgres"

BUCKETS=(
  "cms-news"
  "cms-gallery"
  "cms-reports"
  "cms-avatars"
)

mkdir -p "$BACKUP_ROOT/database"
mkdir -p "$BACKUP_ROOT/storage"

if [ -z "${PGPASSWORD:-}" ]; then
  echo "Erro: defina PGPASSWORD antes de rodar."
  echo "Exemplo:"
  echo "export PGPASSWORD='sua_senha_do_banco'"
  exit 1
fi

echo "Iniciando backup do banco..."
docker run --rm \
  -e PGPASSWORD="$PGPASSWORD" \
  -v "$BACKUP_ROOT/database:/backups" \
  postgres:17 \
  pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -f "/backups/${PROJECT_NAME}-${DATE}.sql"

echo "Banco salvo em: $BACKUP_ROOT/database"

echo "Copiando arquivos locais de public/images, se existirem..."
if [ -d "public/images" ]; then
  mkdir -p "$BACKUP_ROOT/public-images"
  rsync -av public/images/ "$BACKUP_ROOT/public-images/"
fi

echo "Backup inicial concluído."
echo ""
echo "IMPORTANTE:"
echo "- O banco foi salvo."
echo "- Imagens locais em public/images foram salvas."
echo "- Buckets Supabase ainda precisam de automação via API/CLI."
echo ""
echo "Destino:"
echo "$BACKUP_ROOT"
