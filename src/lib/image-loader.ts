/**
 * next/image loader for the static GitHub Pages build (no image optimiser on the host).
 * scripts/build-images.mjs pre-renders every photo to WebP at these widths; this maps a
 * request to the nearest pre-rendered size. Keep `widths` in sync with that script.
 */
const widths = [420, 640, 828, 1080, 1440, 1920, 2560];

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (src.endsWith(".svg")) return src;
  const name = src.split("/").pop()!.split(".")[0];
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/img/${name}-${w}.webp`;
}
