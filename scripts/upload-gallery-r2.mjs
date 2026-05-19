#!/usr/bin/env node
// scripts/upload-gallery-r2.mjs
// ─────────────────────────────────────────────────────────────────────────
// Faz upload de todos os WebP processados para o Cloudflare R2.
// Usa `npx wrangler r2 object put --remote` (não requer wrangler.toml).
//
// Uso:
//   node scripts/upload-gallery-r2.mjs
//
// Upload de álbum único:
//   ALBUM=interclubes/2018-ic node scripts/upload-gallery-r2.mjs
//
// Dry-run (sem upload real):
//   DRY_RUN=1 node scripts/upload-gallery-r2.mjs
// ─────────────────────────────────────────────────────────────────────────

import { spawnSync }          from 'child_process';
import { existsSync, statSync, readdirSync } from 'fs';
import path                   from 'path';

// ── Configuração ─────────────────────────────────────────────────────────

const BUCKET    = 'consudes-assets';
const LOCAL_DIR = '/Users/lmiglioli/Documents/images/CONSUDES_GALLERY_READY/gallery';
const R2_PREFIX = 'gallery';                                // prefixo no bucket
const DRY_RUN   = process.env.DRY_RUN === '1';
const ALBUM     = process.env.ALBUM ?? null;                // ex: "interclubes/2018-ic"

// Cache-control agressivo: 1 ano, imutável (arquivos são versionados pelo slug)
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

// ── MIME types ────────────────────────────────────────────────────────────

const MIME = {
  '.webp': 'image/webp',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
};

function mimeFor(file) {
  return MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
}

// ── Walk recursivo — coleta todos os arquivos (exclui ocultos) ───────────

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;      // ignora arquivos ocultos
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

// ── Formatter helpers ─────────────────────────────────────────────────────

function fmtBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function fmtDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ── Upload de um único arquivo ────────────────────────────────────────────

function upload(localPath, r2Key) {
  const contentType = mimeFor(localPath);
  const args = [
    '--yes', 'wrangler',
    'r2', 'object', 'put',
    `${BUCKET}/${r2Key}`,
    `--file=${localPath}`,
    `--content-type=${contentType}`,
    `--cache-control=${CACHE_CONTROL}`,
    '--remote',
  ];

  const result = spawnSync('npx', args, {
    encoding: 'utf-8',
    timeout:  30_000,   // 30s por arquivo
  });

  if (result.status !== 0) {
    const stderr = (result.stderr ?? '').trim();
    throw new Error(stderr || `exit code ${result.status}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  // Validar pasta de origem
  if (!existsSync(LOCAL_DIR)) {
    console.error(`\n❌  Pasta não encontrada: ${LOCAL_DIR}`);
    console.error('    Execute primeiro: node scripts/prepare-gallery.mjs\n');
    process.exit(1);
  }

  // Definir escopo do upload
  const scanDir = ALBUM
    ? path.join(LOCAL_DIR, ALBUM)
    : LOCAL_DIR;

  if (ALBUM && !existsSync(scanDir)) {
    console.error(`\n❌  Álbum não encontrado: ${scanDir}\n`);
    process.exit(1);
  }

  // Coletar arquivos
  const allFiles = walk(scanDir);
  if (allFiles.length === 0) {
    console.warn('\n⚠   Nenhum arquivo encontrado para upload.\n');
    process.exit(0);
  }

  // Calcular tamanho total
  const totalBytes = allFiles.reduce((sum, f) => sum + statSync(f).size, 0);

  // ── Header ──────────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  CONSUDES — Upload galeria → Cloudflare R2          ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log(`  Bucket   : ${BUCKET}`);
  console.log(`  Prefixo  : ${R2_PREFIX}/`);
  console.log(`  Escopo   : ${ALBUM ?? 'todos os álbuns'}`);
  console.log(`  Arquivos : ${allFiles.length}`);
  console.log(`  Tamanho  : ${fmtBytes(totalBytes)}`);
  if (DRY_RUN) console.log('  Modo     : DRY RUN — nenhum arquivo será enviado');
  console.log('');

  // ── Upload loop ──────────────────────────────────────────────────────────
  let uploaded  = 0;
  let errors    = 0;
  let bytesSent = 0;
  const failures = [];
  const startTime = Date.now();
  const pad = String(allFiles.length).length;

  for (const localPath of allFiles) {
    const relative = localPath.slice(LOCAL_DIR.length + 1); // remove base dir + /
    const r2Key    = `${R2_PREFIX}/${relative}`;
    const fileSize = statSync(localPath).size;
    const idx      = uploaded + errors + 1;

    process.stdout.write(
      `  [${String(idx).padStart(pad)}/${allFiles.length}] ${relative.padEnd(55)} `
    );

    if (DRY_RUN) {
      console.log('(dry-run)');
      uploaded++;
      bytesSent += fileSize;
      continue;
    }

    try {
      upload(localPath, r2Key);
      console.log(`✓  ${fmtBytes(fileSize)}`);
      uploaded++;
      bytesSent += fileSize;
    } catch (err) {
      console.log(`✗  ERRO`);
      console.error(`     ${err.message.split('\n')[0]}`);
      errors++;
      failures.push({ file: relative, error: err.message.split('\n')[0] });
    }
  }

  // ── Relatório final ──────────────────────────────────────────────────────
  const elapsed = Date.now() - startTime;

  console.log('\n────────────────────────────────────────────────────────');
  console.log('  RELATÓRIO FINAL');
  console.log('────────────────────────────────────────────────────────');
  console.log(`  Enviados    : ${uploaded}/${allFiles.length}`);
  console.log(`  Tamanho     : ${fmtBytes(bytesSent)}`);
  console.log(`  Tempo       : ${fmtDuration(elapsed)}`);
  console.log(`  Erros       : ${errors}`);

  if (failures.length > 0) {
    console.log('\n  Falhas:');
    for (const f of failures) {
      console.log(`    ✗ ${f.file}`);
      console.log(`      ${f.error}`);
    }
  }

  if (!DRY_RUN && errors === 0) {
    console.log(`\n  ✅  Upload completo — ${uploaded} arquivo(s) no R2.`);
    console.log('\n  Verificar:');
    console.log('  curl -I https://cdn.consudes.leandrom.com.br/gallery/interclubes/2018-ic/cover.webp');
  } else if (errors > 0) {
    console.log(`\n  ⚠   ${errors} arquivo(s) falharam. Tente novamente.\n`);
    process.exit(1);
  }

  console.log('');
}

main();
