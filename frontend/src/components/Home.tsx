import { Link } from 'react-router-dom';

const Home = () =>{
    return (
        <div>
           <h1>Shortyz</h1>
           <Link to="/Upload">Upload here</Link>
        </div>
       )
}

export default Home;