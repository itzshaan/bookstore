import { createClient } from '@supabase/supabase-js';
   import { v4 as uuidv4 } from 'uuid';
   import multer from 'multer';
   import { promisify } from 'util';

   export const config = {
     api: {
       bodyParser: false,
     },
   };

   const upload = multer({ storage: multer.memoryStorage() });
   const uploadMiddleware = promisify(upload.single('image'));

   export default async function handler(req, res) {
     if (req.method === 'POST') {
       await uploadMiddleware(req, res);

       const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
       const file = req.file;
       const { link } = req.body;

       if (!file || !link) {
         return res.status(400).json({ error: 'Image and link are required' });
       }

       const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
       const { error: uploadError } = await supabase.storage
         .from('images')
         .upload(fileName, file.buffer);

       if (uploadError) {
         return res.status(500).json({ error: 'Failed to upload image' });
       }

       const { publicURL } = supabase.storage.from('images').getPublicUrl(fileName);
       const id = uuidv4();

       const { error: dbError } = await supabase
         .from('links')
         .insert([{ id, image_url: publicURL, redirect_link: link }]);

       if (dbError) {
         return res.status(500).json({ error: 'Failed to save link' });
       }

       res.status(200).json({ id });
     } else {
       res.setHeader('Allow', ['POST']);
       res.status(405).end(`Method ${req.method} Not Allowed`);
     }
   }
