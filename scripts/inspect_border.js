const sharp = require('sharp');

async function inspectImage(name) {
  const img = sharp(`public/images/${name}`);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  console.log(`Inspecting ${name} (${info.width}x${info.height}):`);
  
  // check edge alpha along left column, right column, top row
  let nonZeroLeft = 0;
  for (let y = 0; y < info.height; y++) {
    const idx = (y * info.width + 0) * 4;
    if (data[idx + 3] > 0) nonZeroLeft++;
  }
  let nonZeroRight = 0;
  for (let y = 0; y < info.height; y++) {
    const idx = (y * info.width + (info.width - 1)) * 4;
    if (data[idx + 3] > 0) nonZeroRight++;
  }
  let nonZeroTop = 0;
  for (let x = 0; x < info.width; x++) {
    const idx = (0 * info.width + x) * 4;
    if (data[idx + 3] > 0) nonZeroTop++;
  }
  console.log(`  Border alpha>0 count: Left=${nonZeroLeft}/${info.height}, Right=${nonZeroRight}/${info.height}, Top=${nonZeroTop}/${info.width}`);
}

async function run() {
  await inspectImage('cutout-precision-taper.webp');
  await inspectImage('cutout-skin-fade.webp');
  await inspectImage('cutout-beard-sculpt.webp');
}
run();
