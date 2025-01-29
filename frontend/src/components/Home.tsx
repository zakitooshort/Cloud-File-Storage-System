import { Link } from 'react-router-dom';

const Home = () =>{
    return (
        <div>
           <h1 className="title">Shortyz</h1>
           <h3><Link to="/register">Sign Up</Link></h3>
           <h3><Link to="/login">Log In</Link></h3>
           <h2 className="title2">This project directly involves working with cloud storage services like AWS S3 or Google Cloud Storage although the cloud storage service used here was cloudinary
            it's mainly because i don't own an international credit card and cloudinary doesn't require owning ones</h2>
            <ol>
                <h1>Core Features</h1>
                <h2>
                <li className='h2li'>File Upload: Users can upload files to the cloud.</li>
                <li className='h2li'>File Download: Users can Download files from the cloud.</li>
                <li className='h2li'>File List: Display a list of uploaded files with options to download or delete them.</li>
                </h2>
            </ol>
            <ol>
                <h1>Tech Stack</h1>
                <h2>
                <li className='h2li'>Front-end:React vite + Typescript.</li>
                <li className='h2li'>Back-end: Python (Flask).</li>
                <li className='h2li'>Cloud Storage: <a className='linkC' href="https://console.cloudinary.com/users/login?RelayState=%2Fconsole%2Fmedia_library%2Ffolders%2Fhome%3Fconsole_customer_external_id%3Dc-2411f68dad38090d5e66d286210336%26view_mode%3Dmosaic">CLoudinary</a> which unfortunately allows only images or gifs to be uploaded.</li>
                <li className='h2li'>Database: Optional SQLite added it for conveinent purposes</li>
                </h2>
            </ol>
           <Link to="/Upload" className='Links'>Start Uploading here</Link>
           <h1>Challenges faced:</h1>
           <ol>
            <h2>
            <li className='h2li'>da</li>
            </h2>
           </ol>
        </div>
       )
}

export default Home;