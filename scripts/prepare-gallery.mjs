#!/usr/bin/env node
// scripts/prepare-gallery.mjs
// ─────────────────────────────────────────────────────────────────────────
// Prepara TODOS os álbuns CONSUDES (T1/T2/T3) para upload no Cloudflare R2.
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
// Opções de ambiente:
//   SKIP_EXISTING=1  — pula arquivos já processados (cover.webp / 01.webp…)
//   TIER=T1|T2|T3    — processa apenas o tier indicado
//   ALBUM=slug       — processa apenas um álbum específico
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

// ── Dados de todos os álbuns (T1 / T2 / T3) ──────────────────────────────
// Mirrors src/data/galleryData.ts — atualizar ambos ao mesmo tempo.
// Ordem dos photos define: 01.webp = fotos[0], 02.webp = fotos[1] …

const ALL_ALBUMS = [

  // ════════════════════════════════════════════════════════════════════════
  //  TIER 1 — Destaques (já processados; serão re-processados se necessário)
  // ════════════════════════════════════════════════════════════════════════

  {
    tier: 'T1',
    slug: 'juegos-sudamericanos/2019-juegos-ii',
    title: 'II Juegos Sudamericanos 2019',
    coverFile: 'Portada_2018.jpg',
    photos: [
      { filename: 'Portada_2018.jpg',           caption: 'Portada oficial — II Juegos Sudamericanos 2019', isHero: true },
      { filename: 'IMG_7694.jpg',               caption: 'Delegación Argentina',                           isHero: true },
      { filename: 'IMG_7695.jpg'  },
      { filename: 'IMG_7696.jpg'  },
      { filename: 'IMG_7697.jpg'  },
      { filename: 'Portada_segundo_Juegos.jpg' },
      { filename: 'IMG_4029.JPG'  },
    ],
  },
  {
    tier: 'T1',
    slug: 'panamdes/2016-panamdes',
    title: 'PANAMDES 2016',
    coverFile: '1.JPG',
    photos: [
      { filename: '1.JPG', isHero: true },
      { filename: '6.JPG', isHero: true },
      { filename: '5.JPG', isHero: true },
      { filename: '8.JPG' },
      { filename: '4.JPG' },
      { filename: '2.JPG' },
      { filename: '7.JPG' },
      { filename: '3.JPG' },
    ],
  },
  {
    tier: 'T1',
    slug: 'historico/evento-ajedrez',
    title: 'Campeonato de Ajedrez',
    coverFile: 'PZ018684.JPG',
    photos: [
      { filename: 'PZ018684.JPG',          isHero: true                      },
      { filename: 'PZ018751.JPG',          isHero: true                      },
      { filename: 'PZ018736.JPG',          isHero: true                      },
      { filename: 'PZ018692.JPG',          isHero: true                      },
      { filename: 'PZ018686.JPG',          isHero: true                      },
      { filename: 'PZ018687.JPG',          isHero: true                      },
      { filename: '11_CampeonAjedrez.JPG', caption: 'Campeón de Ajedrez'     },
      { filename: '10_ViceAjedrez.JPG',    caption: 'Vicecampeón de Ajedrez' },
      { filename: 'DSC00417.JPG'                                              },
      { filename: 'Afiche.jpg',            caption: 'Afiche del campeonato'  },
      { filename: '1.JPG'                                                     },
      { filename: '2.JPG'                                                     },
    ],
  },
  {
    tier: 'T1',
    slug: 'juegos-sudamericanos/2015-goiania',
    title: 'I Juegos Sudamericanos — Goiânia 2015',
    coverFile: '1.jpg',
    photos: [
      { filename: '1.jpg',   isHero: true },
      { filename: '12.jpeg', isHero: true },
      { filename: '2.JPG',   isHero: true },
      { filename: '11.jpeg' },
      { filename: '8.jpeg'  },
      { filename: '5.JPG'   },
      { filename: '6.JPG'   },
      { filename: '13.JPG'  },
      { filename: '10.jpeg' },
      { filename: '9.JPG'   },
      { filename: '3.JPG'   },
      { filename: '4.JPG'   },
      { filename: '7.JPG'   },
    ],
  },
  {
    tier: 'T1',
    slug: 'interclubes/2018-ic',
    title: 'IC 2018',
    coverFile: 'Gral.jpg',
    photos: [
      { filename: 'Gral.jpg',       isHero: true, caption: 'Foto general — IC 2018' },
      { filename: 'MIEMBROS.jpg',   isHero: true, caption: 'Directivos CONSUDES'    },
      { filename: 'ASOCH.jpg'       },
      { filename: 'INTER_SMP.jpg'   },
      { filename: 'ASSF.jpg'        },
      { filename: 'ASO.jpg'         },
      { filename: 'ASJF.jpg'        },
      { filename: 'ASB_F.jpg'       },
      { filename: 'ASMG_F.jpg'      },
      { filename: 'ALVORADA.jpg'    },
      { filename: 'ASB.jpg'         },
      { filename: 'ASG_F.jpg'       },
      { filename: 'GUAYAS.jpg'      },
      { filename: 'ODESPAR_F.jpg'   },
      { filename: 'ODESPAR.jpg'     },
      { filename: 'CONCE.jpg'       },
      { filename: 'FATIMA.jpg'      },
      { filename: 'CONGRESILLO.jpg' },
      { filename: 'MIEMBROS_1.jpg'  },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  //  TIER 2 — Galeria
  // ════════════════════════════════════════════════════════════════════════

  {
    tier: 'T2',
    slug: 'interclubes/ic-chile',
    title: 'IC Chile',
    coverFile: 'ICchile.jpg',
    photos: [
      { filename: 'ICchile.jpg',     isHero: true },
      { filename: '1.jpg'  },
      { filename: '2.jpg'  },
      { filename: '3.jpg'  },
      { filename: '4.jpg'  },
      { filename: '5.jpg'  },
      { filename: '6.jpg'  },
      { filename: '7.jpg'  },
      { filename: '8.jpg'  },
      { filename: '9.jpg'  },
      { filename: 'Arbitros.jpg',       caption: 'Árbitros' },
      { filename: 'asam.jpg',           caption: 'Asamblea' },
      { filename: 'asg.jpg'   },
      { filename: 'aso.jpg'   },
      { filename: 'asp.jpg'   },
      { filename: 'audaz.jpg' },
      { filename: 'Campeon.jpg',        caption: 'Campeón masculino'   },
      { filename: 'Campeonfem.jpg',     caption: 'Campeón femenino'    },
      { filename: 'Cresor.jpg'  },
      { filename: 'Cresorfem.jpg' },
      { filename: 'Inter smp.jpg' },
      { filename: 'Subcampeon.jpg',     caption: 'Subcampeón masculino' },
      { filename: 'Subcampeonfem.jpg',  caption: 'Subcampeón femenino'  },
      { filename: 'Tercer.jpg',         caption: 'Tercer lugar masculino' },
      { filename: 'Tercerfem.jpg',      caption: 'Tercer lugar femenino'  },
      { filename: 'Trebol.jpg'    },
      { filename: 'TrebolFem.jpg' },
      { filename: 'Union.jpg'     },
    ],
  },
  {
    tier: 'T2',
    slug: 'interclubes/2016-ic-ecuador-i',
    title: 'IC Ecuador I — 2016',
    coverFile: '6.JPG',
    photos: [
      { filename: '6.JPG', isHero: true },
      { filename: '3.JPG', isHero: true },
      { filename: '5.JPG', isHero: true },
      { filename: '2_AFICHE.jpg', caption: 'Afiche oficial' },
      { filename: '1.JPG' },
      { filename: '2.JPG' },
      { filename: '4.jpg' },
    ],
  },
  {
    tier: 'T2',
    slug: 'assembleias/reunion-miembros',
    title: 'Reunión de Miembros',
    coverFile: 'Gustavo.jpg',
    photos: [
      { filename: 'Gustavo.jpg',   isHero: true },
      { filename: '2.png'     },
      { filename: '3.png'     },
      { filename: '4.png'     },
      { filename: '5.png'     },
      { filename: 'Ana Lucia.png' },
      { filename: 'Bonna.JPG'    },
      { filename: 'Cachito.JPG'  },
      { filename: 'flash1.jpg'   },
      { filename: 'Norby.JPG'    },
      { filename: 'Ovidio.JPG'   },
      { filename: 'Perrone.JPG'  },
      { filename: 'Titi.jpg'     },
    ],
  },
  {
    tier: 'T2',
    slug: 'capacitacao/2016-gustavo-ecuador',
    title: 'Capacitación — Ecuador 2016',
    coverFile: '1.JPG',
    photos: [
      { filename: '1.JPG',  isHero: true },
      { filename: '2.JPG'  },
      { filename: '3.JPG'  },
      { filename: '4.JPG'  },
      { filename: '5.JPG'  },
      { filename: '6.JPG'  },
      { filename: '7.JPG'  },
      { filename: '8.JPG'  },
      { filename: '9.JPG'  },
      { filename: '10.JPG' },
    ],
  },
  {
    tier: 'T2',
    slug: 'futsal-feminino/i-futsal-femenino',
    title: 'I Futsal Femenino CONSUDES',
    coverFile: 'Chile.jpg',
    photos: [
      { filename: 'Chile.jpg',                    isHero: true, caption: 'Delegación Chile'       },
      { filename: 'Brasil.jpg',                   isHero: true, caption: 'Delegación Brasil'      },
      { filename: 'Argentina.jpg',                              caption: 'Delegación Argentina'   },
      { filename: 'Plena_Asamblea.jpg',                         caption: 'Asamblea plena'         },
      { filename: 'Asamblea.jpg'                                                                   },
      { filename: 'Discurso_Pdte_en Asamblea.jpg',              caption: 'Discurso del Presidente'},
      { filename: 'Miembros_en_Asamblea.jpg'                                                       },
      { filename: 'Logo.jpg'                                                                       },
    ],
  },
  {
    tier: 'T2',
    slug: 'interclubes/2017-ic',
    title: 'IC 2017',
    coverFile: 'gral.jpg',
    photos: [
      { filename: 'gral.jpg',        isHero: true, caption: 'Foto general — IC 2017' },
      { filename: 'ASAM_M.png'   },
      { filename: 'ASG_M.png'    },
      { filename: 'Cresor_M.png' },
      { filename: 'Trebol_M.jpg' },
      { filename: 'INTER_SMP_F.jpg' },
      { filename: 'APS_M.jpg'    },
      { filename: 'AUDAZ_M.jpg'  },
      { filename: 'INTER_SMP_M.jpg' },
      { filename: 'UnionF.jpg'   },
      { filename: 'ASO_M.jpg'    },
      { filename: 'CresorF.jpg'  },
    ],
  },
  {
    tier: 'T2',
    slug: 'interclubes/2017-ic-ecuador-iii',
    title: 'IC Ecuador III — 2017',
    coverFile: 'IMG_2109.JPG',
    photos: [
      { filename: 'IMG_2109.JPG', isHero: true },
      { filename: 'IMG_2127.JPG', isHero: true },
      { filename: 'IMG_2108.JPG' },
      { filename: 'IMG_2112.JPG' },
      { filename: 'IMG_2113.JPG' },
      { filename: 'IMG_2440.JPG' },
      { filename: 'img_4111.jpg' },
      { filename: 'IMG_2433.JPG' },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  //  TIER 3 — Arquivo Histórico
  // ════════════════════════════════════════════════════════════════════════

  {
    tier: 'T3',
    slug: 'interclubes/2005-ic',
    title: 'IC 2005 — I Interclube',
    coverFile: 'diario.jpg',
    photos: [
      { filename: 'disrio2.jpg',     isHero: true, caption: 'Cobertura de prensa — I Interclube 2005' },
      { filename: 'diario.jpg',      isHero: true, caption: 'Diario — I Interclube 2005'              },
      { filename: '6.jpg'    },
      { filename: '5.jpg'    },
      { filename: '3.jpg'    },
      { filename: 'asamblea2005.jpg', caption: 'Asamblea 2005' },
      { filename: 'asam.jpg' },
      { filename: 'aso.jpg'  },
      { filename: 'asorch.jpg' },
      { filename: 'aspy.jpg' },
      { filename: 'Asur.jpg' },
      { filename: 'cresor.jpg' },
      { filename: 'cspy.jpg' },
      { filename: 'socusor.jpg' },
    ],
  },
  {
    tier: 'T3',
    slug: 'interclubes/2012-ic',
    title: 'IC 2012',
    coverFile: '17_ASOMA.JPG',
    photos: [
      { filename: '17_ASOMA.JPG', isHero: true },
      { filename: '12_SOCUSOR.JPG' },
      { filename: '13_CRESOR.JPG'  },
      { filename: '14_AUDAZ.JPG'   },
      { filename: '15_ASG.JPG'     },
      { filename: '16_ASLP.JPG'    },
    ],
  },
  {
    tier: 'T3',
    slug: 'assembleias/2017-xlviii-brasil',
    title: 'XLVIII Asamblea 2017',
    coverFile: '2.jpg',
    photos: [
      { filename: '2.jpg', isHero: true },
      { filename: '1.jpg' },
      { filename: '3.jpg' },
    ],
  },
  {
    tier: 'T3',
    slug: 'historico',
    title: 'Archivo Histórico',
    coverFile: 'DIRECTORIO.jpg',
    photos: [
      { filename: 'DIRECTORIO.jpg',        isHero: true, caption: 'Directorio CONSUDES'  },
      { filename: 'Goleadores.jpg',                      caption: 'Goleadores históricos' },
      { filename: 'Quienes2013.png',                     caption: 'CONSUDES 2013'         },
      { filename: 'ASUNCION2001.jpg',                    caption: 'Asunción 2001'         },
      { filename: '2000.jpg',                            caption: '2000'                  },
      { filename: 'Reunion_Caxias.jpg',                  caption: 'Reunión Caxias'        },
      { filename: 'Fitxure2013.jpg',                     caption: 'Fixture 2013'          },
      { filename: 'deaflympicsturquia.jpg' },
      { filename: '23 ICSD.jpg' },
    ],
  },
  {
    tier: 'T3',
    slug: 'historico/afiches',
    title: 'Afiches y Carteles',
    coverFile: 'Afiche_Brasil_2014.jpg',
    photos: [
      { filename: 'Afiche_Brasil_2014.jpg',          isHero: true, caption: 'Afiche I Juegos Sudamericanos' },
      { filename: 'Afiche_Sudamericanos_2013-01.jpg', isHero: true, caption: 'Afiche Juegos 2013'          },
      { filename: 'Afiche_2012.jpg',                               caption: 'Afiche IC 2012'               },
      { filename: 'Afiche_2012 copia.jpg',                         caption: 'Afiche IC 2012 (v2)'          },
      { filename: 'Afiche.jpg'                                                                               },
    ],
  },
  {
    tier: 'T3',
    slug: 'ex-presidentes',
    title: 'Ex Presidentes CONSUDES',
    coverFile: 'Ex_Edith_Alicia_Libonati.jpg',
    photos: [
      { filename: 'Ex_Edith_Alicia_Libonati.jpg', isHero: true },
      { filename: 'EX_Cristina_Mongelos.jpg' },
      { filename: 'Ex_Libonatti.jpg'         },
      { filename: 'Ex_Perrone.jpg'           },
      { filename: 'Ex_Dellatorre.jpg'        },
      { filename: 'Ex_Leon_Rodriguez.jpg'    },
      { filename: 'Ex_Bonnassiolle.jpg'      },
      { filename: 'Ex_Roberto_Gonzalez.jpg'  },
    ],
  },
  {
    tier: 'T3',
    slug: 'equipes',
    title: 'Equipos Afiliados',
    coverFile: 'ASB.jpg',
    photos: [
      { filename: 'ASB.jpg',                          isHero: true },
      { filename: 'AGUILAS.JPG'                                    },
      { filename: 'ASB_(FEM).jpg'                                  },
      { filename: 'ASLP.jpg'                                       },
      { filename: 'ASOCH.jpg'                                      },
      { filename: 'C_D_CAMPAZ.JPG'                                 },
      { filename: 'GERREROS_DEL_SILENCIO (FEM).JPG'               },
      { filename: 'INMACULADA_CONCEPCION.JPG'                      },
      { filename: 'INTER_SMP_(FEM).JPG'                            },
      { filename: 'INTER_SMP.jpg'                                  },
      { filename: 'LAS_COBRAS_(FEM).jpg'                           },
      { filename: 'LSG.JPG'                                        },
    ],
  },
  {
    tier: 'T3',
    slug: 'membros',
    title: 'Directivos CONSUDES',
    coverFile: 'FATIMA.jpg',
    photos: [
      { filename: 'FATIMA.jpg',    isHero: true },
      { filename: 'Norby.JPG'    },
      { filename: 'JC.jpg'       },
      { filename: 'Deborah.jpeg' },
      { filename: 'Bonna.jpg'    },
      { filename: 'Cachito.jpg'  },
    ],
  },
  {
    tier: 'T3',
    slug: 'interclubes/2019-ic-ecuador',
    title: 'IC Ecuador 2019',
    coverFile: '5.jpg',
    photos: [
      { filename: '5.jpg',  isHero: true },
      { filename: 'IC.jpg', isHero: true },
      { filename: '4.jpg'  },
      { filename: '3.jpg'  },
      { filename: '2.jpg'  },
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
      totalAlbums:      0,
      totalPhotos:      0,
      totalOrigBytes:   0,
      totalOutputBytes: 0,
    },
    albums: [],
  };

  const SKIP_EXISTING = process.env.SKIP_EXISTING === '1';
  const TIER_FILTER   = process.env.TIER   ?? null;
  const ALBUM_FILTER  = process.env.ALBUM  ?? null;

  const albums = ALL_ALBUMS.filter(a => {
    if (TIER_FILTER  && a.tier  !== TIER_FILTER)  return false;
    if (ALBUM_FILTER && a.slug  !== ALBUM_FILTER) return false;
    return true;
  });

  if (TIER_FILTER || ALBUM_FILTER) {
    console.log(`  Filtro : ${TIER_FILTER ? 'TIER=' + TIER_FILTER : ''} ${ALBUM_FILTER ? 'ALBUM=' + ALBUM_FILTER : ''}`.trim());
  }
  console.log(`  Álbuns : ${albums.length} de ${ALL_ALBUMS.length} total\n`);

  let grandTotalPhotos      = 0;
  let grandTotalOrigBytes   = 0;
  let grandTotalOutputBytes = 0;
  let totalErrors           = 0;
  const albumsWithErrors    = [];
  const albumsSkipped       = [];

  for (const album of albums) {
    console.log(`\n▸ [${album.slug}]`);
    console.log(`  "${album.title}"\n`);

    const albumOutDir = path.join(OUTPUT_BASE, album.slug);
    fs.mkdirSync(albumOutDir, { recursive: true });

    const albumManifest = {
      slug:      album.slug,
      title:     album.title,
      tier:      album.tier,
      cover:     null,
      photos:    [],
      errors:    [],
    };

    // ── Cover ──────────────────────────────────────────────────────────
    const coverSrc  = findSourceFile(album.slug, album.coverFile);
    const coverDest = path.join(albumOutDir, 'cover.webp');
    if (SKIP_EXISTING && fs.existsSync(coverDest)) {
      console.log(`  ⏭ cover.webp  (já existe — pulado)`);
    } else if (coverSrc) {
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
      if (SKIP_EXISTING && fs.existsSync(destPath)) {
        albumsSkipped.push(destPath);
        console.log(`  ⏭ ${outName}  (já existe — pulado)`);
        grandTotalPhotos++;
        continue;
      }
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
    if (albumManifest.errors.length > 0) albumsWithErrors.push(album.slug);
    console.log(`\n  → ${albumManifest.photos.length} fotos, ${albumManifest.errors.length} erro(s)`);
  }

  // ── Summary ────────────────────────────────────────────────────────────
  manifest.summary = {
    totalAlbums:      albums.length,
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
  const byTier = { T1: 0, T2: 0, T3: 0 };
  for (const a of manifest.albums) byTier[a.tier] = (byTier[a.tier] ?? 0) + 1;

  console.log(`  Álbuns processados : ${albums.length}  (T1: ${byTier.T1}  T2: ${byTier.T2}  T3: ${byTier.T3})`);
  console.log(`  Fotos processadas  : ${grandTotalPhotos}`);
  console.log(`  Tamanho original   : ${formatBytes(grandTotalOrigBytes)}`);
  console.log(`  Tamanho WebP       : ${formatBytes(grandTotalOutputBytes)}`);
  console.log(`  Redução total      : ${formatBytes(grandTotalOrigBytes - grandTotalOutputBytes)} (${totalSavingsPct})`);
  console.log(`  Erros              : ${totalErrors}`);
  if (albumsWithErrors.length > 0) {
    console.warn(`\n  Álbuns com erros:`);
    albumsWithErrors.forEach(s => console.warn(`    • ${s}`));
  }
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
