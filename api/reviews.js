// COA LLC Marietta GA — coordinates from verified Google Maps listing
const PLACE_LAT = 34.0671222;
const PLACE_LNG = -84.4949286;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Nearby search (no name filter) to see all places at these coordinates
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.rating,places.userRatingCount,places.displayName',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: { latitude: PLACE_LAT, longitude: PLACE_LNG },
            radius: 50.0,
          },
        },
      }),
    });

    if (!searchRes.ok) {
      const text = await searchRes.text();
      console.error('Nearby search error:', searchRes.status, text);
      return res.status(502).json({ error: 'Failed to search nearby places' });
    }

    const searchData = await searchRes.json();
    console.log('Nearby places found:', JSON.stringify(searchData.places?.map(p => p.displayName?.text)));

    // Find COA LLC specifically, fall back to first result
    const place = searchData.places?.find(p => p.displayName?.text === 'COA LLC')
      ?? searchData.places?.[0];

    if (!place) {
      return res.status(404).json({ error: 'No places found near business location' });
    }

    console.log('Using place:', place.displayName?.text, place.id);

    const detailRes = await fetch(`https://places.googleapis.com/v1/places/${place.id}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews',
      },
    });

    if (!detailRes.ok) {
      const text = await detailRes.text();
      console.error('Places detail error:', detailRes.status, text);
      return res.status(502).json({ error: 'Failed to fetch reviews' });
    }

    const detailData = await detailRes.json();

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({
      rating: place.rating ?? null,
      userRatingCount: place.userRatingCount ?? null,
      reviews: (detailData.reviews || []).map((r) => ({
        rating: r.rating,
        text: r.text?.text || '',
        authorName: r.authorAttribution?.displayName || 'Google Reviewer',
        relativeTime: r.relativePublishTimeDescription || '',
      })),
    });
  } catch (error) {
    console.error('Reviews API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
