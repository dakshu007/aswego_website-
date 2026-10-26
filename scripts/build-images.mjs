// Pre-render src/assets/photos/*.jpg to responsive WebP files in public/img/ for the static
// (GitHub Pages) build, where no runtime image optimiser exists. Widths match src/lib/image-loader.ts.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const widths = [420, 640, 828, 1080, 1440, 1920, 2560];
const srcDir = "src/assets/photos";
const outDir = "public/img";
fs.mkdirSync(outDir, { recursive: true });

for (const file of fs.readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
  const name = path.parse(file).name;
  const input = sharp(path.join(srcDir, file));
  const { width: original } = await input.metadata();
  for (const w of widths) {
    const out = path.join(outDir, `${name}-${w}.webp`);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(path.join(srcDir, file)).mtimeMs) continue;
    await sharp(path.join(srcDir, file)).resize({ width: Math.min(w, original) }).webp({ quality: 72 }).toFile(out);
  }
  console.log("img", name);
}
