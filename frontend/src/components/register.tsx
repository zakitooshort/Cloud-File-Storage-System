import React,{useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () =>{
    const [username, setUsername]=useState('');
    const [password, setPassword]=useState('');
    const [error, setError]=useState('');
    const navigate=useNavigate();


   const handleSubmit = async (e: React.FormEvent)=>{
     e.preventDefault();

     try{
      const response = await axios.post('http://localhost:5000/register',{
         username,
         password,
      });

      if (response.status === 201){
         navigate('/login');
      }
     }catch(err) {
      if (axios.isAxiosError(err)) {
         setError(err.response?.data.message || 'Registration Failed');
      }else{
         setError('An unexpected error occured');
      }
     }
 };
 return (
   <div>
    <nav>
        <Link to="/" className="Link">
            Home
        </Link>
    </nav>
   <h2 className='title'>Register</h2>
   {error && <p style={{ color: 'red' }}>{error}</p>}
   <form className="loginForm" onSubmit={handleSubmit}>
       <div className='divBT'>
           <label htmlFor="username">Username:</label>
           <input className='inputBT'
               type="text"
               id="username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               required
           />
       </div>
       <div className='divBT'>
           <label htmlFor="password">Password:</label>
           <input className='inputBT'
               type="password"
               id="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
           />
       </div>
       <button className='submitBTN' type="submit">Register</button>
   </form>
   <p className='pcenter'>
       Already have an account? <Link to="/login">Login here</Link>
   </p>
</div>
 );
};
export default RegisterForm; 