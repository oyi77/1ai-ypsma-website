import sharp from 'sharp';
import { existsSync } from 'fs';

const cwd = 'public/images';

// All broken (512x512) images with their JPG source
const fixes = [
  // Shared gallery images
  ...[1,2,3,4,5,6,7,8,9,10,11,12].map(i => ({
    src: `${cwd}/shared/shared-${i}.jpg`,
    dst: `${cwd}/shared/shared-${i}.webp`,
  })),
  // Sarana/sarpras
  ...[5,6,7,8,9,10].map(i => ({
    src: `${cwd}/sarana/sarpras-${i}.jpg`,
    dst: `${cwd}/sarana/sarpras-${i}.webp`,
  })),
  // Listrik tokoh
  {
    src: `${cwd}/listrik/muhammad-rizky-1.jpg`,
    dst: `${cwd}/listrik/muhammad-rizky-1.webp`,
  },
  // Drive-new/sarpras
  ...[1,3,4,5,6,7,8,9,10].map(i => ({
    src: `${cwd}/drive-new/sarpras/${i}.jpg`,
    dst: `${cwd}/drive-new/sarpras/${i}.webp`,
  })),
  // Drive-new/makan
  ...[1,2,3].map(i => ({
    src: `${cwd}/drive-new/makan/bagi-makan-${i}.jpg`,
    dst: `${cwd}/drive-new/makan/bagi-makan-${i}.webp`,
  })),
  // Home kondisi cards
  ...[
    'al-quran', 'anak-yatim', 'antrean', 'kelas', 'sampah'
  ].map(name => ({
    src: `${cwd}/home/${name}.jpg`,
    dst: `${cwd}/home/${name}.webp`,
  })),
];

async function main() {
  let ok = 0, fail = 0;
  for (const { src, dst } of fixes) {
    if (!existsSync(src)) {
      console.error(`MISSING source: ${src}`);
      fail++;
      continue;
    }
    const img = sharp(src);
    const meta = await img.metadata();
    // Resize to at most 2000px on longest edge, consistent with optimize-images.mjs
    const pipeline = meta.width > 2000 || meta.height > 2000
      ? img.resize({ width: 2000, withoutEnlargement: true })
      : img;
    await pipeline.webp({ quality: 85 }).toFile(dst);
    const outMeta = await sharp(dst).metadata();
    console.log(`OK: ${dst.replace(cwd+'/', '')}  ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height} (${(outMeta.size/1024).toFixed(0)}KB)`);
    ok++;
  }
  console.log(`\nDone: ${ok} OK, ${fail} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });
