const BUSINESS_QUERY = 'COA Auditing Marietta GA';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Find the verified business listing
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.rating,places.userRatingCount',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textQuery: BUSINESS_QUERY, maxResultCount: 1 }),
    });

    if (!searchRes.ok) {
      const text = await searchRes.text();
      console.error('Places search error:', searchRes.status, text);
      return res.status(502).json({ error: 'Failed to search Google Places' });
    }

    const searchData = await searchRes.json();
    const place = searchData.places?.[0];
    if (!place) {
      return res.status(404).json({ error: 'Business not found in Google Places' });
    }

    // Fetch reviews for the found listing
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
