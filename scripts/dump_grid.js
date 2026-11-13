const sharp = require('sharp');

async function dumpGrid(name) {
  const img = sharp(`public/images/${name}`);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  
  // Find where alpha becomes 255
  console.log(`Checking vertical line at x = 100 for ${name}:`);
  for (let y = 0; y < 200; y += 10) {
    const idx = (y * info.width + 100) * 4;
    console.log(`y=${y}: R=${data[idx]}, G=${data[idx+1]}, B=${data[idx+2]}, A=${data[idx+3]}`);
  }
}

dumpGrid('cutout-precision-taper.webp');
