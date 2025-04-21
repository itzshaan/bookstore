import { createClient } from '@supabase/supabase-js';

   export async function getServerSideProps({ params, res }) {
     const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
     const { data, error } = await supabase
       .from('links')
       .select('*')
       .eq('id', params.id)
       .single();

     if (error || !data) {
       res.statusCode = 404;
       res.end('Link not found');
       return { props: {} };
     }

     const html = `
       <html>
         <head>
           <meta property="og:image" content="${data.image_url}">
           <meta property="og:title" content="Clickable Image">
           <meta property="og:description" content="Click to visit the link">
           <script>window.location.href = '${data.redirect_link}';</script>
         </head>
         <body>
           <img src="${data.image_url}" alt="Image" style="max-width: 100%;">
         </body>
       </html>
     `;

     res.setHeader('Content-Type', 'text/html');
     res.end(html);
     return { props: {} };
   }

   export default function RedirectPage() {
     return null;
   }
