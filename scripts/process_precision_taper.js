const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const inputPath = 'C:/Users/user/.gemini/antigravity/brain/28bfd25b-2b74-4698-b8b5-faea4a51bd51/gen_precision_taper_1794407498976.jpg';
  const outputPath = 'e:/RbMakeovermansSalon/public/images/cutout-precision-taper.webp';

  const image = sharp(inputPath);
  const meta = await image.metadata();
  const { width, height } = meta;

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const rgbaBuffer = Buffer.alloc(width * height * 4);

  // Smooth border feathering
  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  const topFadeDist = height * 0.12;
  const bottomFadeDist = height * 0.18;
  const sideFadeDist = width * 0.12;

  for (let y = 0; y < height; y++) {
    let topFade = 1;
    if (y < topFadeDist) {
      topFade = smoothstep(0, topFadeDist, y);
    }

    let bottomFade = 1;
    if (y > height - bottomFadeDist) {
      bottomFade = smoothstep(height, height - bottomFadeDist, y);
    }

    for (let x = 0; x < width; x++) {
      let sideFade = 1;
      if (x < sideFadeDist) {
        sideFade = smoothstep(0, sideFadeDist, x);
      } else if (x > width - sideFadeDist) {
        sideFade = smoothstep(width, width - sideFadeDist, x);
      }

      // Also if background pixel is very close to pure black, blend it out even further
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Distance from center
      const nx = (x - width * 0.5) / (width * 0.5);
      const ny = (y - height * 0.5) / (height * 0.5);
      const radialDist = Math.sqrt(nx * nx + ny * ny);

      // Radial fade starting at 0.75 out to 0.98
      let radialFade = 1;
      if (radialDist > 0.75) {
        radialFade = smoothstep(0.98, 0.75, radialDist);
      }

      let totalFade = topFade * bottomFade * sideFade * radialFade;

      // In the outer regions (radialDist > 0.65), if luminance is low (background), fade to 0
      if (radialDist > 0.65 && lum < 15) {
        const bgFade = smoothstep(8, 15, lum);
        totalFade *= bgFade;
      }

      const outIdx = (y * width + x) * 4;
      rgbaBuffer[outIdx] = r;
      rgbaBuffer[outIdx + 1] = g;
      rgbaBuffer[outIdx + 2] = b;
      rgbaBuffer[outIdx + 3] = Math.round(255 * totalFade);
    }
  }

  await sharp(rgbaBuffer, { raw: { width, height, channels: 4 } })
    .webp({ quality: 96, alphaQuality: 96, lossless: false })
    .toFile(outputPath);

  console.log('Successfully created true pure-black cutout-precision-taper.webp with smooth feathered edges');
}

run().catch(console.error);
