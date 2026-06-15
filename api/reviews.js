const PLACE_ID = 'ChIJs5m_bfFs9YgRH3Dj1IpHNR8';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Places API error:', response.status, text);
      return res.status(502).json({ error: 'Failed to fetch from Google' });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? null,
      reviews: (data.reviews || []).map((r) => ({
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
