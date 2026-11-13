const puppeteer = require('puppeteer-core');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function findVideo() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Navigating to Coverr barbershop search...');
    await page.goto('https://coverr.co/s?q=barbershop', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Extract video elements or mp4 links
    const videoSources = await page.evaluate(() => {
      const links = [];
      const videos = document.querySelectorAll('video source, video, a[href$=".mp4"]');
      videos.forEach(v => {
        if (v.src && v.src.includes('.mp4')) links.push(v.src);
        if (v.href && v.href.includes('.mp4')) links.push(v.href);
      });
      return links;
    });

    console.log('Found video sources:', videoSources);
  } catch (err) {
    console.error('Error finding video:', err);
  } finally {
    await browser.close();
  }
}

findVideo();
