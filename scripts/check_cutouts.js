const sharp = require('sharp');
const fs = require('fs');

async function checkCutouts() {
  const files = fs.readdirSync('public/images').filter(f => f.startsWith('cutout-') && f.endsWith('.webp'));
  for (const file of files) {
    const filePath = `public/images/${file}`;
    const image = sharp(filePath);
    const meta = await image.metadata();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Check corners
    const channels = info.channels;
    const topLeftAlpha = channels === 4 ? data[3] : 255;
    const topRightAlpha = channels === 4 ? data[(info.width - 1) * 4 + 3] : 255;
    const botLeftAlpha = channels === 4 ? data[(info.width * (info.height - 1)) * 4 + 3] : 255;
    const botRightAlpha = channels === 4 ? data[(info.width * info.height - 1) * 4 + 3] : 255;
    
    console.log(`${file}: channels=${channels}, size=${info.width}x${info.height}, cornersAlpha=[${topLeftAlpha}, ${topRightAlpha}, ${botLeftAlpha}, ${botRightAlpha}]`);
  }
}

checkCutouts();
