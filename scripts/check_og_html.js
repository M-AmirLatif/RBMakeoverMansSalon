async function checkHead() {
  const userAgents = [
    'WhatsApp/2.21.12.21 i',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  ];

  for (const ua of userAgents) {
    console.log('\n--- Checking UA:', ua, '---');
    const res = await fetch('https://rb-makeover-salon.vercel.app/', {
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    const metaTags = html.match(/<meta[^>]+>/g) || [];
    metaTags.filter(m => m.includes('og:') || m.includes('twitter:') || m.includes('description')).forEach(m => console.log(m));
  }
}

checkHead();
