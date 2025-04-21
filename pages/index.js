import { useState } from 'react';

   export default function Home() {
     const [image, setImage] = useState(null);
     const [link, setLink] = useState('');
     const [generatedLink, setGeneratedLink] = useState('');

     const handleSubmit = async (e) => {
       e.preventDefault();
       const formData = new FormData();
       formData.append('image', image);
       formData.append('link', link);

       const res = await fetch('/api/submit', {
         method: 'POST',
         body: formData,
       });

       const data = await res.json();
       if (data.error) {
         alert(data.error);
       } else {
         setGeneratedLink(`https://${window.location.hostname}/redirect/${data.id}`);
       }
     };

     return (
       <div style={{ padding: '20px', fontFamily: 'Arial' }}>
         <h1>Generate Clickable Image Link</h1>
         <form onSubmit={handleSubmit}>
           <input
             type="file"
             accept="image/*"
             onChange={(e) => setImage(e.target.files[0])}
             style={{ display: 'block', margin: '10px 0' }}
           />
           <input
             type="text"
             value={link}
             onChange={(e) => setLink(e.target.value)}
             placeholder="Adsterra Link"
             style={{ display: 'block', margin: '10px 0', width: '300px' }}
           />
           <button type="submit" style={{ padding: '5px 10px' }}>
             Generate Link
           </button>
         </form>
         {generatedLink && (
           <p>
             Your link: <a href={generatedLink}>{generatedLink}</a>
           </p>
         )}
       </div>
     );
   }
