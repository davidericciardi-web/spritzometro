import axios from 'axios';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'No query' });

  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    {
      params: {
        input: query,
        key: process.env.GOOGLE_MAPS_API_KEY,
        components: 'country:it',
        types: 'establishment',
        language: 'it'
      }
    }
  );

  const predictions = response.data.predictions || [];
  
  const results = await Promise.all(
    predictions.slice(0, 5).map(async p => {
      const detail = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: p.place_id,
            key: process.env.GOOGLE_MAPS_API_KEY,
            fields: 'name,formatted_address,geometry,address_components'
          }
        }
      );
      const d = detail.data.result;
      let city = '';
      for (const c of (d.address_components || [])) {
        if (c.types.includes('locality') || c.types.includes('administrative_area_level_3')) {
          city = c.long_name; break;
        }
      }
      return {
        name: d.name,
        address: d.formatted_address,
        city,
        lat: d.geometry?.location?.lat,
        lng: d.geometry?.location?.lng
      };
    })
  );

  return res.json({ results });
}
