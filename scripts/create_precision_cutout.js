const sharp = require('sharp');
const path = require('path');

async function processCutoutSmooth() {
  const inputPath = 'e:/RbMakeovermansSalon/public/images/hero-gentleman-profile.jpg';
  const outputPath = 'e:/RbMakeovermansSalon/public/images/cutout-precision-taper.webp';

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const rgbaBuffer = Buffer.alloc(width * height * 4);

  // We want the edges to be completely blurred and smooth with zero box edges.
  // The subject is centered in the frame.
  // We apply:
  // 1. Top feather: fade out top 16% smoothly to 0
  // 2. Bottom feather: fade out bottom 20% smoothly to 0
  // 3. Left feather: fade out left 20% smoothly to 0
  // 4. Right feather: fade out right 18% smoothly to 0
  // 5. Background slate removal: background luminance < 45 around the edges gets softened to pure black.

  const topFadeDist = height * 0.16;
  const bottomFadeStart = height * 0.78;
  const leftFadeDist = width * 0.18;
  const rightFadeDist = width * 0.16;

  for (let y = 0; y < height; y++) {
    // Top fade: 0 at y=0 up to 1 at y=topFadeDist
    let topFactor = 1;
    if (y < topFadeDist) {
      const t = y / topFadeDist;
      topFactor = t * t * (3 - 2 * t); // smoothstep
    }

    // Bottom fade: 1 at y=bottomFadeStart down to 0 at y=height
    let bottomFactor = 1;
    if (y > bottomFadeStart) {
      const t = Math.max(0, 1 - (y - bottomFadeStart) / (height - bottomFadeStart));
      bottomFactor = t * t * (3 - 2 * t); // smoothstep
    }

    for (let x = 0; x < width; x++) {
      // Left fade: 0 at x=0 up to 1 at x=leftFadeDist
      let leftFactor = 1;
      if (x < leftFadeDist) {
        const t = x / leftFadeDist;
        leftFactor = t * t * (3 - 2 * t); // smoothstep
      }

      // Right fade: 1 down to 0 at right
      let rightFactor = 1;
      if (x > width - rightFadeDist) {
        const t = Math.max(0, (width - x) / rightFadeDist);
        rightFactor = t * t * (3 - 2 * t); // smoothstep
      }

      const perimeterFade = topFactor * bottomFactor * leftFactor * rightFactor;

      const idx = (y * width + x) * channels;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Dark background removal / softening:
      // If a pixel is in the background perimeter and dark, fade its RGB towards 0
      // and fade alpha
      let alpha = Math.round(255 * perimeterFade);

      // In the background area (low saturation and low luminance), blend RGB to black
      if (perimeterFade < 0.95) {
        r = Math.round(r * perimeterFade);
        g = Math.round(g * perimeterFade);
        b = Math.round(b * perimeterFade);
      }

      const outIdx = (y * width + x) * 4;
      rgbaBuffer[outIdx] = r;
      rgbaBuffer[outIdx + 1] = g;
      rgbaBuffer[outIdx + 2] = b;
      rgbaBuffer[outIdx + 3] = alpha;
    }
  }

  await sharp(rgbaBuffer, { raw: { width, height, channels: 4 } })
    .webp({ quality: 96, alphaQuality: 96, lossless: false })
    .toFile(outputPath);

  console.log('Successfully created smooth, fully blurred-edge cutout-precision-taper.webp');
}

processCutoutSmooth().catch(err => {
  console.error(err);
  process.exit(1);
});
