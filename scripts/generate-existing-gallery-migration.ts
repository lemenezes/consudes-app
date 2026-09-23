import { writeFileSync } from "node:fs";
import { galleryAlbums } from "../src/data/galleryData";

const OUTPUT = "supabase/migrations/20260922050000_existing_gallery_albums.sql";

const existingAlbums = galleryAlbums.filter(
  album => !album.slug.startsWith("museu/")
);

if (existingAlbums.length !== 21) {
  throw new Error(
    `Esperávamos 21 álbuns antigos, mas encontramos ${existingAlbums.length}.`
  );
}

function sqlString(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${value.replace(/'/g, "''")}'`;
}

function sqlJson(value: unknown): string {
  const json = JSON.stringify(value);
  return `${sqlString(json)}::jsonb`;
}

const lines: string[] = [
  "-- =============================================================================",
  "-- CONSUDES — Seed dos 22 álbuns existentes da galeria",
  "--",
  "-- Estes álbuns já existiam em src/data/galleryData.ts,",
  "-- mas nunca haviam sido inseridos em public.gallery_albums.",
  "--",
  "-- ON CONFLICT DO NOTHING preserva qualquer registro já existente no CMS.",
  "-- =============================================================================",
  ""
];

for (const album of existingAlbums) {
  lines.push(
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
    `  ${sqlString(album.slug)},`,
    `  ${sqlString(album.title)},`,
    `  ${album.year ?? "NULL"},`,
    `  ${sqlString(album.city)},`,
    `  ${sqlString(album.country)},`,
    `  ${sqlJson(album.description)},`,
    `  ${sqlString(album.category)},`,
    `  ${sqlString(album.tier)},`,
    `  ${sqlString(album.coverFile)},`,
    `  ${sqlString(album.coverPosition ?? "center")},`,
    `  ${album.photoCount},`,
    `  ${sqlJson(album.photos)},`,
    `  ${album.featured ? "true" : "false"}`,
    ")",
    "on conflict (slug) do nothing;",
    ""
  );
}

writeFileSync(OUTPUT, lines.join("\n"), "utf8");

const totalPhotos = existingAlbums.reduce(
  (total, album) => total + album.photos.length,
  0
);

console.log("");
console.log("==========================================");
console.log(" CONSUDES — GALERIA EXISTENTE");
console.log("==========================================");
console.log("");
console.log(`Álbuns antigos: ${existingAlbums.length}`);
console.log(`Fotos listadas: ${totalPhotos}`);
console.log(`Arquivo: ${OUTPUT}`);
console.log("");
