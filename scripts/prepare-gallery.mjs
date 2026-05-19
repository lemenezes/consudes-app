#!/usr/bin/env node
// scripts/prepare-gallery.mjs
// ─────────────────────────────────────────────────────────────────────────
// Prepara álbuns Tier 1 da CONSUDES para upload no Cloudflare R2.
//
// O que faz:
//   • Redimensiona imagens para largura máxima 1800px (mantém proporção)
//   • Converte para WebP (qualidade 85)
//   • Nomeia: cover.webp (capa) + 01.webp, 02.webp, … (fotos curadas)
//   • Gera manifest.json com metadados completos
//
// Não faz upload. Preserva originais.
//
// Uso: node scripts/prepare-gallery.mjs
// ─────────────────────────────────────────────────────────────────────────

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// ── Caminhos ─────────────────────────────────────────────────────────────

const ARCHIVE_BASE  = '/Users/lmiglioli/Documents/images/CONSUDES_ARCHIVE/photos';
const OUTPUT_BASE   = '/Users/lmiglioli/Documents/images/CONSUDES_GALLERY_READY/gallery';
const MANIFEST_PATH = '/Users/lmiglioli/Documents/images/CONSUDES_GALLERY_READY/manifest.json';
const CDN_BASE      = 'https://r2.consudes.org';    // URL futura — preencher antes do upload
const R2_PREFIX     = 'gallery';                    // prefixo no bucket R2

// ── Parâmetros de processamento ───────────────────────────────────────────

const MAX_WIDTH    = 1800;
const WEBP_QUALITY = 85;

// ── Dados dos álbuns T1 ───────────────────────────────────────────────────
// Mirrors src/data/galleryData.ts (apenas Tier 1)
// Atualizar aqui se galleryData.ts mudar.

const T1_ALBUMS = [
  {
    slug: 'juegos-sudamericanos/2019-juegos-ii',
    title: 'II Juegos Sudamericanos 2019',
    coverFile: 'Portada_2018.jpg',
    photos: [
      { filename: 'Portada_2018.jpg',           caption: 'Portada oficial — II Juegos Sudamericanos 2019', isHero: true  },
      { filename: 'IMG_7694.jpg',               caption: 'Delegación Argentina',                           isHero: true  },
      { filename: 'IMG_7695.jpg'                                                                                          },
      { filename: 'IMG_7696.jpg'                                                                                          },
      { filename: 'IMG_7697.jpg'                                                                                          },
      { filename: 'Portada_segundo_Juegos.jpg'                                                                            },
      { filename: 'IMG_4029.JPG'                                                                                          },
    ],
  },
  {
    slug: 'panamdes/2016-panamdes',
    title: 'PANAMDES 2016',
    coverFile: '1.JPG',
    photos: [
      { filename: '1.JPG', isHero: true  },
      { filename: '6.JPG', isHero: true  },
      { filename: '5.JPG', isHero: true  },
      { filename: '8.JPG'                },
      { filename: '4.JPG'                },
      { filename: '2.JPG'                },
      { filename: '7.JPG'                },
      { filename: '3.JPG'                },
    ],
  },
  {
    slug: 'historico/evento-ajedrez',
    title: 'Campeonato de Ajedrez',
    coverFile: 'PZ018684.JPG',
    photos: [
      { filename: 'PZ018684.JPG',          isHero: true                         },
      { filename: 'PZ018751.JPG',          isHero: true                         },
      { filename: 'PZ018736.JPG',          isHero: true                         },
      { filename: 'PZ018692.JPG',          isHero: true                         },
      { filename: 'PZ018686.JPG',          isHero: true                         },
      { filename: 'PZ018687.JPG',          isHero: true                         },
      { filename: '11_CampeonAjedrez.JPG', caption: 'Campeón de Ajedrez'        },
      { filename: '10_ViceAjedrez.JPG',    caption: 'Vicecampeón de Ajedrez'    },
      { filename: 'DSC00417.JPG'                                                 },
      { filename: 'Afiche.jpg',            caption: 'Afiche del campeonato'     },
      { filename: '1.JPG'                                                        },
      { filename: '2.JPG'                                                        },
    ],
  },
  {
    slug: 'juegos-sudamericanos/2015-goiania',
    title: 'I Juegos Sudamericanos — Goiânia 2015',
    coverFile: '1.jpg',
    photos: [
      { filename: '1.jpg',   isHero: true },
      { filename: '12.jpeg', isHero: true },
      { filename: '2.JPG',   isHero: true },
      { filename: '11.jpeg'               },
      { filename: '8.jpeg'                },
      { filename: '5.JPG'                 },
      { filename: '6.JPG'                 },
      { filename: '13.JPG'                },
      { filename: '10.jpeg'               },
      { filename: '9.JPG'                 },
      { filename: '3.JPG'                 },
      { filename: '4.JPG'                 },
      { filename: '7.JPG'                 },
    ],
  },
  {
    slug: 'interclubes/2018-ic',
    title: 'IC 2018',
    coverFile: 'Gral.jpg',
    photos: [
      { filename: 'Gral.jpg',        isHero: true, caption: 'Foto general — IC 2018'  },
      { filename: 'MIEMBROS.jpg',    isHero: true, caption: 'Directivos CONSUDES'     },
      { filename: 'ASOCH.jpg'        },
      { filename: 'INTER_SMP.jpg'    },
      { filename: 'ASSF.jpg'         },
      { filename: 'ASO.jpg'          },
      { filename: 'ASJF.jpg'         },
      { filename: 'ASB_F.jpg'        },
      { filename: 'ASMG_F.jpg'       },
      { filename: 'ALVORADA.jpg'     },
      { filename: 'ASB.jpg'          },
      { filename: 'ASG_F.jpg'        },
      { filename: 'GUAYAS.jpg'       },
      { filename: 'ODESPAR_F.jpg'    },
      { filename: 'ODESPAR.jpg'      },
      { filename: 'CONCE.jpg'        },
      { filename: 'FATIMA.jpg'       },
      { filename: 'CONGRESILLO.jpg'  },
      { filename: 'MIEMBROS_1.jpg'   },
    ],
  },
];

// ── Utilitários ───────────────────────────────────────────────────────────

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatBytes(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function findSourceFile(albumSlug, filename) {
  const candidate = path.join(ARCHIVE_BASE, albumSlug, filename);
  if (fs.existsSync(candidate)) return candidate;

  // Fallback: case-insensitive search na pasta
  const dir = path.join(ARCHIVE_BASE, albumSlug);
  if (!fs.existsSync(dir)) return null;
  const entries = fs.readdirSync(dir);
  const match = entries.find(e => e.toLowerCase() === filename.toLowerCase());
  return match ? path.join(dir, match) : null;
}

async function processImage(srcPath, destPath) {
  const meta = await sharp(srcPath).metadata();
  const originalSize = fs.statSync(srcPath).size;

  const pipeline = sharp(srcPath).rotate(); // auto-orient via EXIF

  if (meta.width > MAX_WIDTH) {
    pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(destPath);

  const outMeta  = await sharp(destPath).metadata();
  const newSize  = fs.statSync(destPath).size;
  const savings  = Math.round((1 - newSize / originalSize) * 100);

  return {
    width:        outMeta.width,
    height:       outMeta.height,
    sizeBytes:    newSize,
    sizeOriginal: originalSize,
    savings:      `${savings}%`,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  CONSUDES Gallery — Preparação para upload R2       ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  fs.mkdirSync(OUTPUT_BASE, { recursive: true });

  const manifest = {
    generatedAt:      new Date().toISOString(),
    tool:             'prepare-gallery.mjs',
    version:          '1.0.0',
    cdnBase:          CDN_BASE,
    r2Prefix:         R2_PREFIX,
    settings: {
      maxWidth:     MAX_WIDTH,
      webpQuality:  WEBP_QUALITY,
    },
    summary: {
      totalAlbums:      T1_ALBUMS.length,
      totalPhotos:      0,
      totalOrigBytes:   0,
      totalOutputBytes: 0,
    },
    albums: [],
  };

  let grandTotalPhotos      = 0;
  let grandTotalOrigBytes   = 0;
  let grandTotalOutputBytes = 0;
  let totalErrors           = 0;

  for (const album of T1_ALBUMS) {
    console.log(`\n▸ [${album.slug}]`);
    console.log(`  "${album.title}"\n`);

    const albumOutDir = path.join(OUTPUT_BASE, album.slug);
    fs.mkdirSync(albumOutDir, { recursive: true });

    const albumManifest = {
      slug:      album.slug,
      title:     album.title,
      tier:      'T1',
      cover:     null,
      photos:    [],
      errors:    [],
    };

    // ── Cover ──────────────────────────────────────────────────────────
    const coverSrc = findSourceFile(album.slug, album.coverFile);
    if (coverSrc) {
      const coverDest = path.join(albumOutDir, 'cover.webp');
      try {
        const info = await processImage(coverSrc, coverDest);
        albumManifest.cover = {
          outputFile:    'cover.webp',
          sourceFile:    album.coverFile,
          width:         info.width,
          height:        info.height,
          sizeBytes:     info.sizeBytes,
          sizeOriginal:  info.sizeOriginal,
          savings:       info.savings,
          url:           `${CDN_BASE}/${R2_PREFIX}/${album.slug}/cover.webp`,
        };
        console.log(`  ✓ cover.webp  ← ${album.coverFile}  (${info.width}×${info.height}, ${formatBytes(info.sizeBytes)}, −${info.savings})`);
        grandTotalOrigBytes   += info.sizeOriginal;
        grandTotalOutputBytes += info.sizeBytes;
      } catch (err) {
        console.error(`  ✗ cover.webp  ← ${album.coverFile}  ERRO: ${err.message}`);
        albumManifest.errors.push({ file: album.coverFile, role: 'cover', error: err.message });
        totalErrors++;
      }
    } else {
      console.warn(`  ⚠ cover.webp  ← ${album.coverFile}  ARQUIVO NÃO ENCONTRADO`);
      albumManifest.errors.push({ file: album.coverFile, role: 'cover', error: 'Source file not found' });
      totalErrors++;
    }

    // ── Photos ─────────────────────────────────────────────────────────
    for (let i = 0; i < album.photos.length; i++) {
      const photo    = album.photos[i];
      const index    = i + 1;
      const outName  = `${pad(index)}.webp`;
      const srcPath  = findSourceFile(album.slug, photo.filename);

      if (!srcPath) {
        console.warn(`  ⚠ ${outName}  ← ${photo.filename}  ARQUIVO NÃO ENCONTRADO`);
        albumManifest.errors.push({ file: photo.filename, role: outName, error: 'Source file not found' });
        albumManifest.photos.push({
          index,
          outputFile:   outName,
          sourceFile:   photo.filename,
          caption:      photo.caption ?? null,
          isHero:       photo.isHero ?? false,
          url:          `${CDN_BASE}/${R2_PREFIX}/${album.slug}/${outName}`,
          error:        'Source file not found',
        });
        totalErrors++;
        continue;
      }

      const destPath = path.join(albumOutDir, outName);
      try {
        const info = await processImage(srcPath, destPath);
        albumManifest.photos.push({
          index,
          outputFile:    outName,
          sourceFile:    photo.filename,
          caption:       photo.caption  ?? null,
          isHero:        photo.isHero   ?? false,
          width:         info.width,
          height:        info.height,
          sizeBytes:     info.sizeBytes,
          sizeOriginal:  info.sizeOriginal,
          savings:       info.savings,
          url:           `${CDN_BASE}/${R2_PREFIX}/${album.slug}/${outName}`,
        });
        console.log(`  ✓ ${outName}  ← ${photo.filename}  (${info.width}×${info.height}, ${formatBytes(info.sizeBytes)}, −${info.savings})`);
        grandTotalOrigBytes   += info.sizeOriginal;
        grandTotalOutputBytes += info.sizeBytes;
        grandTotalPhotos++;
      } catch (err) {
        console.error(`  ✗ ${outName}  ← ${photo.filename}  ERRO: ${err.message}`);
        albumManifest.errors.push({ file: photo.filename, role: outName, error: err.message });
        albumManifest.photos.push({
          index,
          outputFile:  outName,
          sourceFile:  photo.filename,
          caption:     photo.caption ?? null,
          isHero:      photo.isHero  ?? false,
          url:         `${CDN_BASE}/${R2_PREFIX}/${album.slug}/${outName}`,
          error:       err.message,
        });
        totalErrors++;
      }
    }

    manifest.albums.push(albumManifest);
    console.log(`\n  → ${albumManifest.photos.length} fotos, ${albumManifest.errors.length} erro(s)`);
  }

  // ── Summary ────────────────────────────────────────────────────────────
  manifest.summary = {
    totalAlbums:      T1_ALBUMS.length,
    totalPhotos:      grandTotalPhotos,
    totalOrigBytes:   grandTotalOrigBytes,
    totalOutputBytes: grandTotalOutputBytes,
    totalSaved:       formatBytes(grandTotalOrigBytes - grandTotalOutputBytes),
    savings:          grandTotalOrigBytes
                        ? `${Math.round((1 - grandTotalOutputBytes / grandTotalOrigBytes) * 100)}%`
                        : '0%',
    totalErrors,
  };

  // ── Write manifest ─────────────────────────────────────────────────────
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');

  // ── Final report ───────────────────────────────────────────────────────
  const totalSavingsPct = manifest.summary.savings;
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  RELATÓRIO FINAL                                     ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`  Álbuns processados : ${T1_ALBUMS.length}`);
  console.log(`  Fotos processadas  : ${grandTotalPhotos}`);
  console.log(`  Tamanho original   : ${formatBytes(grandTotalOrigBytes)}`);
  console.log(`  Tamanho WebP       : ${formatBytes(grandTotalOutputBytes)}`);
  console.log(`  Redução total      : ${formatBytes(grandTotalOrigBytes - grandTotalOutputBytes)} (${totalSavingsPct})`);
  console.log(`  Erros              : ${totalErrors}`);
  console.log(`  Manifest gerado    : ${MANIFEST_PATH}`);
  console.log(`\n  Output: ${OUTPUT_BASE}`);
  console.log();

  if (totalErrors > 0) {
    console.warn(`  ⚠ ${totalErrors} arquivo(s) não processado(s). Verificar manifest.json para detalhes.\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\nErro fatal:', err);
  process.exit(1);
});
