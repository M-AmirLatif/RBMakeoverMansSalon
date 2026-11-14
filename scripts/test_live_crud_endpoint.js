async function testLiveApi() {
  const baseUrl = 'https://rb-makeover-salon.vercel.app';

  console.log('Testing live /api/admin/crud endpoint...');
  
  // 1. Test saving barber Qasim Ali with his uploaded photo
  const barberRes = await fetch(`${baseUrl}/api/admin/crud`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save_barber',
      payload: {
        id: 'qasim-ali',
        name: 'Qasim Ali',
        title: 'Master Barber & Stylist',
        category: 'haircut',
        initials: 'QA',
        experience: '5 Years',
        rating: 5.0,
        reviewCount: 10,
        avatar_url: 'https://rkfqzokuofvztofkpzxs.supabase.co/storage/v1/object/public/salon-media/uploads/1794572483861-100000000.jpg',
        rates: {
          haircut: 1000,
          beard: 600,
          hairAndBeard: 1500,
          facial: 1800,
          groomingPackage: 3500
        },
        is_popular: true
      }
    })
  });
  const barberData = await barberRes.json();
  console.log('Live save_barber response:', barberRes.status, barberData);

  // 2. Test saving service "fade-haircuts"
  const serviceRes = await fetch(`${baseUrl}/api/admin/crud`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save_service',
      payload: {
        id: 'fade-haircuts',
        name: 'Haircuts & Fades',
        category: 'Haircuts & Styling',
        price: 'Rs. 1,000',
        numeric_price: 1000,
        duration: '45 mins',
        description: 'Precision scissor and clipper fades tailored to bone structure.',
        display_order: 1
      }
    })
  });
  const serviceData = await serviceRes.json();
  console.log('Live save_service response:', serviceRes.status, serviceData);

  // 3. Test saving hero video
  const videoRes = await fetch(`${baseUrl}/api/admin/crud`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save_hero_video',
      payload: {
        url: '/videos/hero-salon-loop-720p.mp4'
      }
    })
  });
  const videoData = await videoRes.json();
  console.log('Live save_hero_video response:', videoRes.status, videoData);

  console.log('ALL LIVE CRUD API TESTS COMPLETE!');
}

testLiveApi().catch(console.error);
