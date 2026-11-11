const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/user/.gemini/antigravity/brain/28bfd25b-2b74-4698-b8b5-faea4a51bd51';
const OUTPUT_DIR = 'e:/RbMakeovermansSalon/public/images';

async function processImage(inputFilename, outputWebpName) {
  const inputPath = path.join(ARTIFACT_DIR, inputFilename);
  const outputPath = path.join(OUTPUT_DIR, outputWebpName);

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file does not exist: ${inputPath}`);
    return;
  }

  const image = sharp(inputPath);
  const meta = await image.metadata();
  const { width, height } = meta;

  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const rgbaBuffer = Buffer.alloc(width * height * 4);

  // Preserve all subject details (hair, beard, eyes, suit)!
  // Eliminate the rectangular bounding box completely by smoothly feathering
  // the outer perimeter (top 4%, bottom 16%, left 4%, right 4%) to 0 alpha.
  for (let y = 0; y < height; y++) {
    // Bottom feathering: fade out bottom 16% to 0
    const bottomFade = y > height * 0.84
      ? Math.max(0, 1 - (y - height * 0.84) / (height * 0.16))
      : 1;

    // Top feathering: fade out top 4% to 0
    const topFade = y < height * 0.04
      ? Math.max(0, y / (height * 0.04))
      : 1;

    // Side feathering margin: 4%
    const sideMargin = width * 0.04;

    for (let x = 0; x < width; x++) {
      let sideFade = 1;
      if (x < sideMargin) {
        sideFade = Math.min(sideFade, x / sideMargin);
      } else if (x > width - sideMargin) {
        sideFade = Math.min(sideFade, (width - x) / sideMargin);
      }

      const totalFade = bottomFade * topFade * sideFade;

      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

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

  console.log(`Successfully feathered: ${outputPath} (${width}x${height})`);
}

async function run() {
  await processImage('gen_executive_crop_1794392143005.jpg', 'cutout-executive-crop.webp');
  await processImage('gen_scalp_therapy_1794391970024.jpg', 'cutout-scalp-therapy.webp');
  await processImage('gen_keratin_silk_1794391994041.jpg', 'cutout-keratin-silk.webp');
  await processImage('gen_razor_lineup_1794392021540.jpg', 'cutout-razor-lineup.webp');
  await processImage('gen_executive_finish_1794392052097.jpg', 'cutout-master-finish.webp');
}

run().catch(console.error);
