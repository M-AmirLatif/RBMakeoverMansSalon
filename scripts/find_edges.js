const sharp = require('sharp');

async function findEdges(name) {
  const img = sharp(`public/images/${name}`);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  
  // Find where alpha becomes 255
  for (let y = 0; y < info.height; y += 50) {
    let firstX = -1, lastX = -1;
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      if (data[idx + 3] > 50) {
        if (firstX === -1) firstX = x;
        lastX = x;
      }
    }
    if (firstX !== -1) {
      const idxF = (y * info.width + firstX) * 4;
      console.log(`y=${y}: firstX=${firstX} (R=${data[idxF]}, G=${data[idxF+1]}, B=${data[idxF+2]}, A=${data[idxF+3]}), lastX=${lastX}`);
    }
  }
}

findEdges('cutout-precision-taper.webp');
