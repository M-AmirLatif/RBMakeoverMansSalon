const sharp = require('sharp');
const path = require('path');

async function processCutout() {
  const inputPath = 'e:/RbMakeovermansSalon/public/images/hero-gentleman-profile.jpg';
  const outputPath = 'e:/RbMakeovermansSalon/public/images/cutout-precision-taper.webp';

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  // We want to create an alpha mask that keeps the subject intact,
  // but smoothly feathers out the background and feathers the bottom to 0 alpha.
  // The background of hero-gentleman-profile.jpg is dark grey/black (luminance < 40).
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const rgbaBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    // bottom gradient feather factor (fade out bottom 15% of image completely)
    const bottomFade = y > height * 0.82 
      ? Math.max(0, 1 - (y - height * 0.82) / (height * 0.18))
      : 1;

    // left edge slight feather (left 5%)
    const leftFade = y < height * 0.6 && (0 < width * 0.05)
      ? 1 // keep left
      : 1;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Luminance / brightness
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // In the background, background is dark textured (around 15-35)
      // Subject hair/skin/blazer has higher saturation or distinct colors
      // For black background blending, any pixel that is very dark (< 22) blends to 0
      let alpha = 255;
      if (x < width * 0.35 && y < height * 0.3) {
        // top-left empty space
        if (lum < 32) {
          alpha = Math.max(0, Math.min(255, (lum - 12) * 12));
        }
      }

      // Apply bottom fade
      alpha = Math.round(alpha * bottomFade);

      const outIdx = (y * width + x) * 4;
      rgbaBuffer[outIdx] = r;
      rgbaBuffer[outIdx + 1] = g;
      rgbaBuffer[outIdx + 2] = b;
      rgbaBuffer[outIdx + 3] = alpha;
    }
  }

  await sharp(rgbaBuffer, { raw: { width, height, channels: 4 } })
    .webp({ quality: 95, alphaQuality: 95, lossless: false })
    .toFile(outputPath);

  console.log('Successfully created cutout-precision-taper.webp');
}

processCutout().catch(err => {
  console.error(err);
  process.exit(1);
});
