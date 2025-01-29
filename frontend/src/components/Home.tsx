import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () =>{
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); 
  }, []);

  const logout = () => {
    localStorage.removeItem("token"); 
    setIsAuthenticated(false); 
  };
    return (
        <div>      
            <nav>
      {isAuthenticated ? (
        <h3>
          <a onClick={logout} style={{ cursor: "pointer" }}>Log out</a>
        </h3>
      ) : (
        <>
        <div className='buttons'>
          <h3 className="buttons1">
            <Link to="/register">Sign Up</Link>
          </h3>
          <h3 className="buttons2">
            <Link to="/login">Log In</Link>
          </h3>
          </div>
        </>
      )}
    </nav>
 
           <h1 className="title">Shortyz</h1>
           <h2 className="title2">This project directly involves working with cloud storage services like AWS S3 or Google Cloud Storage although the cloud storage service used here was cloudinary
            it's mainly because i don't own an international credit card and cloudinary doesn't require owning ones</h2>
            <ol>
                <h1>Core Features</h1>
                <h2>
                <li className='h2li'>File Upload: Users can upload files to the cloud.</li>
                <li className='h2li'>File Download: Users can Download after uploading them files from the cloud.</li>
                <li className='h2li'>File List: Display a list of uploaded files with options to download or delete them.</li>
                <li className='h2li'>Unique: Each user has his own space to upload on.</li>
                </h2>
                <p>ps: consider using it if you're wiping your pc clean but wanna keep photos of great memories</p>
            </ol>
            <ol>
                <h1>Tech Stack</h1>
                <h2>
                <li className='h2li'>Front-end:React vite + Typescript.</li>
                <li className='h2li'>Back-end: Python (Flask).</li>
                <li className='h2li'>Cloud Storage: <a className='linkC' href="https://console.cloudinary.com/users/login?RelayState=%2Fconsole%2Fmedia_library%2Ffolders%2Fhome%3Fconsole_customer_external_id%3Dc-2411f68dad38090d5e66d286210336%26view_mode%3Dmosaic">CLoudinary</a> which unfortunately allows only images or gifs to be uploaded.</li>
                <li className='h2li'>Database: SQLite added it for conveinent purposes</li>
                </h2>
            </ol>
        <div className=' Upload'>
           <Link to="/Upload" className='Links'>Start Uploading here</Link>
           </div>

           <h1>Challenges faced:</h1>
           <ol className='lastol'>
            <h2>
            <li className='h2li'>Implementing the RESTful APIs:
                <ul>
                    <li className='h2li'>Since i had no past experience with RESTful APIs, making this project helped me understanding and use these APIs with diffrent tools like <a href="https://www.postman.com/">Postman</a> </li>
                </ul>
            </li>
            <li className='h2li'>User Authentication and separating each user spaces:
                <ul>
                    <li className='h2li'>Implementing JWT tokens to protect file access so users can feel safe and secure.</li>
                </ul>
            </li>
            <li className='h2li'>Using Flask with SQLight:
                <ul>
                    <li className='h2li'>I had never used Flask before so i had to learn Flask's structure, routing, request handling, and how to integrate it with your frontend helped me grasp a new framework and add it to my skills list.</li>
                    <li className='h2li'> and about Database Management I stored files metadata, so i had to set up Flask with SQLAlchemy which helped figure out more about flask.</li>
                </ul>
            </li>
            </h2>
           </ol>
           <div>
            <h1 className="title">In conclusion building this mini project was fun helped me understand how cloud related systems function with cloud services like aws S3 or google Cloud storage system or any other cloud service in general</h1>
           </div>
           <h1>Warning !! : This is only a demo test it and delete your photos</h1>
        </div>
       )
}

export default Home;