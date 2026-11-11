const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\28bfd25b-2b74-4698-b8b5-faea4a51bd51';
const publicImagesDir = path.resolve(__dirname, '..', 'public', 'images');

const assets = [
  { src: 'barber_chair_centerpiece_1794370102766.jpg', dest: 'vintage-barber-chair' },
  { src: 'menu_classic_cut_1794370142090.jpg', dest: 'menu-classic-cut' },
  { src: 'menu_skin_fade_1794370193296.jpg', dest: 'menu-skin-fade' },
  { src: 'menu_beard_sculpt_1794370258266.jpg', dest: 'menu-beard-sculpt' },
  { src: 'menu_hair_beard_combo_1794370331858.jpg', dest: 'menu-hair-beard-combo' },
];

async function copyAndConvert() {
  for (const item of assets) {
    const srcPath = path.join(brainDir, item.src);
    const destJpg = path.join(publicImagesDir, `${item.dest}.jpg`);
    const destWebp = path.join(publicImagesDir, `${item.dest}.webp`);

    fs.copyFileSync(srcPath, destJpg);
    console.log(`Copied ${destJpg}`);

    await sharp(destJpg)
      .webp({ quality: 85 })
      .toFile(destWebp);
    console.log(`Converted to ${destWebp}`);
  }
  console.log('All 5 assets processed successfully!');
}

copyAndConvert().catch(err => {
  console.error(err);
  process.exit(1);
});
