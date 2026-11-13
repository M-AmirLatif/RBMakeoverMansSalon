async function verify() {
  const res = await fetch('https://rb-makeover-salon.vercel.app');
  const html = await res.text();
  
  const ogImgMatch = html.match(/property="og:image"\s+content="([^"]+)"/i) || html.match(/content="([^"]+)"\s+property="og:image"/i);
  const twImgMatch = html.match(/name="twitter:image"\s+content="([^"]+)"/i) || html.match(/content="([^"]+)"\s+name="twitter:image"/i);
  const ogWidth = html.match(/property="og:image:width"\s+content="([^"]+)"/i);
  const ogHeight = html.match(/property="og:image:height"\s+content="([^"]+)"/i);
  const ogType = html.match(/property="og:image:type"\s+content="([^"]+)"/i);

  console.log('Live Production Check:');
  console.log('- og:image:', ogImgMatch ? ogImgMatch[1] : 'none');
  console.log('- og:image:type:', ogType ? ogType[1] : 'none');
  console.log('- og:image dimensions:', ogWidth ? ogWidth[1] : '', 'x', ogHeight ? ogHeight[1] : '');
  console.log('- twitter:image:', twImgMatch ? twImgMatch[1] : 'none');
}

verify();
