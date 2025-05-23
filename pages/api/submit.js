import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { link, publicURL } = req.body;

  if (!publicURL || !link) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error: dbError } = await supabase
    .from('links')
    .insert([{ image_url: publicURL, redirect_link: link }])
    .select('id')
    .single();

  if (dbError) {
    console.error('Database error:', dbError.message);
    return res.status(500).json({ error: 'Failed to save link', details: dbError.message });
  }

  return res.status(200).json({ id: data.id });
}
