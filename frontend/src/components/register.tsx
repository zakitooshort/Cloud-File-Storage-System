import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () =>{
    const [username, setUsername]=useState('');
    const [password, setPassword]=useState('');
    const [error, setError]=useState('');
    const navigate=useNavigate();
 const handleSubmit = async (e: React.FormEvent)=>{
  e.preventDefault();
 };
 return (
    <form onSubmit={handleSubmit}></form>
 );
};
export default RegisterForm; 