const sharp = require('sharp');

async function analyzeAlphaMap(name) {
  const img = sharp(`public/images/${name}`);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  
  // Find bounding box of alpha > 10
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`${name}: Alpha bbox = [minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}] in ${info.width}x${info.height}`);
  
  // Sample what color exists around (minX + 5, minY + 5)
  const idx = ((minY + 5) * info.width + (minX + 5)) * 4;
  console.log(`Color near top-left of bbox: R=${data[idx]}, G=${data[idx+1]}, B=${data[idx+2]}, A=${data[idx+3]}`);
}

async function run() {
  await analyzeAlphaMap('cutout-precision-taper.webp');
  await analyzeAlphaMap('cutout-skin-fade.webp');
  await analyzeAlphaMap('cutout-beard-sculpt.webp');
  await analyzeAlphaMap('cutout-executive-crop.webp');
}
run();
