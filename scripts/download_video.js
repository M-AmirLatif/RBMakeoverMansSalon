const https = require('https');
const fs = require('fs');
const path = require('path');

const candidates = [
  'https://cdn.coverr.co/videos/coverr-cutting-hair-in-the-barbershop-6113/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-cutting-hair-in-the-barbershop-6113/720p.mp4',
  'https://cdn.coverr.co/videos/coverr-barber-cutting-hair-8748/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-barber-cutting-hair-8748/720p.mp4',
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return resolve(downloadFile(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function tryDownloads() {
  for (const url of candidates) {
    try {
      console.log(`Trying ${url}...`);
      const target = path.join(__dirname, '..', 'public', 'videos', 'hero-salon-loop.mp4');
      await downloadFile(url, target);
      const stat = fs.statSync(target);
      console.log(`Success! Downloaded ${stat.size} bytes to ${target}`);
      return;
    } catch (err) {
      console.warn(`Failed: ${err.message}`);
    }
  }
}

tryDownloads();
