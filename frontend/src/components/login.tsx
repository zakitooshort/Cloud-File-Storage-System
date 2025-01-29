import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log('Sending login request...');
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });

            console.log('Login response:', response);

            if (response.status === 200) {
                localStorage.setItem('token', response.data.access_token);
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data.message || 'Login failed');
            } else {
                setError('An unexpected error occurred');
            }
        }finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <nav>
                <Link to="/" className="Link">
                    Home
                </Link>
            </nav>
            <h2 className='title'>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="loginForm" >
                <div className='divBT'>
                    <label htmlFor="username">Username: <br /></label>
                    <input className='inputBT'
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className='divBT'>
                    <label htmlFor="password">Password: <br /></label>
                    <input className='inputBT'
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button className='submitBTN' onClick={handleSubmit} disabled={loading} type="submit">{loading ? 'Logging in...' : 'Login'}</button>
            </form>
            <p className='pcenter'>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
};

export default Login;