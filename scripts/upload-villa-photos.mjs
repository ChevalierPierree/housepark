/**
 * Upload villa photos to Supabase Storage
 * Usage: node scripts/upload-villa-photos.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';

const SUPABASE_URL = 'https://gohfzkopbwbnkcchuhta.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaGZ6a29wYndibmtjY2h1aHRhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjExOTAwMCwiZXhwIjoyMDg3Njk1MDAwfQ.TM7zZG59NVFaW9thqeg0HXwMoXoVL1z43dTM_yIBoi0';
const BUCKET = 'villa-photos';
const PHOTOS_DIR = '/Users/pierrechevalier/Desktop/Photos villas';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(`Erreur création bucket: ${error.message}`);
    console.log(`✅ Bucket "${BUCKET}" créé`);
  } else {
    console.log(`✅ Bucket "${BUCKET}" existant`);
  }
}

async function getPhotoFiles(villaDir) {
  const files = await readdir(villaDir);
  return files
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort() // ordre chronologique (par nom = par timestamp)
    .slice(0, 8); // max 8 photos
}

async function uploadPhoto(localPath, storagePath) {
  const data = await readFile(localPath);
  const ext = extname(localPath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

  // Supprimer si existe déjà
  await supabase.storage.from(BUCKET).remove([storagePath]);

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, data, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Upload ${storagePath}: ${error.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return urlData.publicUrl;
}

async function main() {
  await ensureBucket();

  const results = {}; // { villa1: [url0, url1, ...], ... }

  for (let v = 1; v <= 6; v++) {
    const villaDir = join(PHOTOS_DIR, `Villa ${v}`);
    let files;
    try {
      files = await getPhotoFiles(villaDir);
    } catch {
      console.warn(`⚠️  Villa ${v} : dossier introuvable ou vide`);
      results[v] = [];
      continue;
    }

    if (files.length === 0) {
      console.warn(`⚠️  Villa ${v} : aucune photo trouvée`);
      results[v] = [];
      continue;
    }

    console.log(`\n📁 Villa ${v} — ${files.length} photos`);
    results[v] = [];

    for (let i = 0; i < files.length; i++) {
      const localPath = join(villaDir, files[i]);
      const ext = extname(files[i]).toLowerCase();
      const storagePath = `villa-${v}/${String(i).padStart(2, '0')}${ext}`;
      try {
        const url = await uploadPhoto(localPath, storagePath);
        results[v].push(url);
        console.log(`  ✅ ${i} → ${url.split('/').pop()}`);
      } catch (err) {
        console.error(`  ❌ ${files[i]}: ${err.message}`);
      }
    }
  }

  // Afficher les URLs groupées par villa pour copier-coller dans seed.sql
  console.log('\n\n========== URLS PAR VILLA ==========');
  for (let v = 1; v <= 6; v++) {
    console.log(`\n-- Villa ${v}`);
    (results[v] || []).forEach((url, i) => console.log(`  [${i}] ${url}`));
  }

  // Écrire un fichier JSON avec les résultats
  const { writeFile } = await import('fs/promises');
  await writeFile(
    '/Users/pierrechevalier/Desktop/Housespark/housespark-app/scripts/upload-results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\n✅ Résultats sauvegardés dans scripts/upload-results.json');
}

main().catch(err => {
  console.error('ERREUR FATALE:', err);
  process.exit(1);
});
