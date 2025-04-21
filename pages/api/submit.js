import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for server-side
  );

  const { link, publicURL } = req.body; // Assuming these come from the request

  // Insert data without specifying 'id'
  const { data, error: dbError } = await supabase
    .from('links')
    .insert([{ image_url: publicURL, redirect_link: link }])
    .select('id') // Get the generated ID
    .single();    // Expect a single row

  if (dbError) {
    console.error('Database error:', dbError.message);
    return res.status(500).json({ error: 'Failed to save link', details: dbError.message });
  }

  // Return the generated ID to use in your app
  return res.status(200).json({ id: data.id });
}
