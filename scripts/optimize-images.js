import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename } from 'path';

const DIRS    = ['src/assets/clients', 'src/assets/portfolio'];
const QUALITY = 82;
const EXTS    = new Set(['.png', '.jpg', '.jpeg']);

async function convert(inputPath) {
  const ext        = extname(inputPath).toLowerCase();
  const outputPath = inputPath.replace(ext, '.webp');

  await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);

  const [inSize, outSize] = await Promise.all([
    stat(inputPath).then(s => s.size),
    stat(outputPath).then(s => s.size),
  ]);

  const saving = ((1 - outSize / inSize) * 100).toFixed(1);
  console.log(`  ${basename(inputPath).padEnd(30)} ${(inSize/1024).toFixed(1).padStart(7)} KB → ${(outSize/1024).toFixed(1).padStart(7)} KB  (-${saving}%)`);

  await unlink(inputPath);
}

let totalIn = 0, totalOut = 0;

for (const dir of DIRS) {
  console.log(`\n📁 ${dir}`);
  const files = await readdir(dir);

  for (const file of files) {
    if (!EXTS.has(extname(file).toLowerCase())) continue;
    const inputPath = join(dir, file);
    const s = await stat(inputPath);
    totalIn += s.size;
    await convert(inputPath);
    const outPath = inputPath.replace(extname(inputPath), '.webp');
    const outStat = await stat(outPath);
    totalOut += outStat.size;
  }
}

const saved = totalIn - totalOut;
console.log(`\nTotal: ${(totalIn/1024).toFixed(1)} KB → ${(totalOut/1024).toFixed(1)} KB  (economizou ${(saved/1024).toFixed(1)} KB)`);
console.log('\nPróximo passo: atualize os imports nos componentes (troque .png/.jpg por .webp)');
