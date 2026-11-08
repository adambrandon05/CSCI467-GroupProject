
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Login existing user
    const handleLogin = async () => {
        setError('');

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // Successful login
            navigate('/home');

        } catch (error) {
            console.error(error);
            setError('Could not connect to server');
        }
    };

    // Register new user
    const handleRegister = async () => {
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            alert('Account created successfully!');

            setPassword('');
            setConfirmPassword('');
            setIsLogin(true);

        } catch (error) {
            console.error(error);
            setError('Could not connect to server');
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <div className='form-toggle'>
                    <button
                        className={isLogin ? 'active' : ''}
                        onClick={() => {
                            setIsLogin(true);
                            setError('');
                        }}>
                        Login
                    </button>

                    <button
                        className={!isLogin ? 'active' : ''}
                        onClick={() => {
                            setIsLogin(false);
                            setError('');
                        }}>
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <div className='form'>
                        <h2>Login</h2>

                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <a href='#' onClick={(e) => e.preventDefault()}>
                            Forgot Password?
                        </a>

                        {error && <p style={{color: 'red'}}>{error}</p>}

                        <button onClick={handleLogin}>
                            Login
                        </button>

                        <p>
                            Not a Member?
                            <a href='#' onClick={(e) => {
                                e.preventDefault();
                                setIsLogin(false);
                                setError('');
                            }}> Sign Up</a>
                        </p>
                    </div>
                ) : (
                    <div className='form'>
                        <h2>Sign Up</h2>

                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {error && <p style={{color: 'red'}}>{error}</p>}

                        <button onClick={handleRegister}>
                            Sign Up
                        </button>

                        <p>
                            Already a Member?
                            <a href='#' onClick={(e) => {
                                e.preventDefault();
                                setIsLogin(true);
                                setError('');
                            }}> Login</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
