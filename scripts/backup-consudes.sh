#!/usr/bin/env bash

set -euo pipefail

# ============================================================
# CONSUDES - Backup
# Supabase + Cloudflare R2 + Git
# ============================================================

DATE="$(date +%Y-%m-%d_%H-%M-%S)"

BACKUP_ROOT="$HOME/Library/CloudStorage/Dropbox/Leandro/Sites/CONSUDES/backups"
DATABASE_DIR="$BACKUP_ROOT/database"
R2_DIR="$BACKUP_ROOT/r2/$DATE"
SOURCE_DIR="$BACKUP_ROOT/source"

DB_URL="postgresql://postgres.fdlxafgubtsaijovrete@aws-1-us-west-2.pooler.supabase.com:5432/postgres"

R2_REMOTE="consudes-r2"
R2_BUCKET="consudes-assets"

echo
echo "========================================"
echo "  CONSUDES BACKUP - $DATE"
echo "========================================"
echo

# ------------------------------------------------------------
# Verificações
# ------------------------------------------------------------

for command in supabase rclone git; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "ERRO: '$command' não está instalado."
    exit 1
  fi
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERRO: execute este script dentro do repositório CONSUDES."
  exit 1
fi

mkdir -p "$DATABASE_DIR" "$R2_DIR" "$SOURCE_DIR"

# ------------------------------------------------------------
# Senha do Supabase
# ------------------------------------------------------------

echo "Digite a senha do banco Supabase:"
read -rs DB_PASSWORD
echo

export PGPASSWORD="$DB_PASSWORD"

# ------------------------------------------------------------
# 1. Supabase - Schema
# ------------------------------------------------------------

echo
echo "[1/6] Backup do schema do Supabase..."

supabase db dump \
  --db-url "$DB_URL" \
  -f "$DATABASE_DIR/consudes-$DATE.sql"

echo "✓ Schema concluído."

# ------------------------------------------------------------
# 2. Supabase - Dados
# ------------------------------------------------------------

echo
echo "[2/6] Backup dos dados do Supabase..."

supabase db dump \
  --db-url "$DB_URL" \
  --data-only \
  -f "$DATABASE_DIR/consudes-data-$DATE.sql"

echo "✓ Dados concluídos."

# Não precisamos mais manter a senha no ambiente.
unset PGPASSWORD
unset DB_PASSWORD

# ------------------------------------------------------------
# 3. Cloudflare R2
# ------------------------------------------------------------

echo
echo "[3/6] Backup do Cloudflare R2..."

rclone copy \
  "$R2_REMOTE:$R2_BUCKET" \
  "$R2_DIR" \
  --progress

echo "✓ R2 copiado."

# ------------------------------------------------------------
# 4. Validar R2
# ------------------------------------------------------------

echo
echo "[4/6] Validando backup do R2..."

rclone check \
  "$R2_REMOTE:$R2_BUCKET" \
  "$R2_DIR" \
  --one-way

echo "✓ R2 validado."

# ------------------------------------------------------------
# 5. Git
# ------------------------------------------------------------

echo
echo "[5/6] Criando backup completo do Git..."

git bundle create \
  "$SOURCE_DIR/consudes-app-$DATE.bundle" \
  --all

echo "✓ Git bundle criado."

# ------------------------------------------------------------
# 6. Validar Git
# ------------------------------------------------------------

echo
echo "[6/6] Validando Git bundle..."

git bundle verify \
  "$SOURCE_DIR/consudes-app-$DATE.bundle"

echo "✓ Git bundle validado."

# ------------------------------------------------------------
# Resumo
# ------------------------------------------------------------

echo
echo "========================================"
echo "  BACKUP CONCLUÍDO COM SUCESSO ✓"
echo "========================================"
echo
echo "Data: $DATE"
echo
echo "Supabase:"
ls -lh "$DATABASE_DIR/consudes-$DATE.sql"
ls -lh "$DATABASE_DIR/consudes-data-$DATE.sql"

echo
echo "R2:"
du -sh "$R2_DIR"

echo
echo "Git:"
ls -lh "$SOURCE_DIR/consudes-app-$DATE.bundle"

echo
echo "Destino:"
echo "$BACKUP_ROOT"
echo