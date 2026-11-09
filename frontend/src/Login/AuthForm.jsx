
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Send login credentials to backend
            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            // Check for login errors
            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // Login successful
            console.log('Logged in:', data.user);
            navigate('/home');

        } catch (error) {
            console.error(error);
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    // Handle Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Verify passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            // Check for registration errors
            if (!response.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            // Registration successful
            alert('Account created successfully! Please login.');

            setPassword('');
            setConfirmPassword('');
            setIsLogin(true);

        } catch (error) {
            console.error(error);
            setError('Could not connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className='form-container'>

                <div className='form-toggle'>
                    <button
                        type='button'
                        className={isLogin ? 'active' : ''}
                        onClick={() => {
                            setIsLogin(true);
                            setError('');
                        }}>
                        Login
                    </button>

                    <button
                        type='button'
                        className={!isLogin ? 'active' : ''}
                        onClick={() => {
                            setIsLogin(false);
                            setError('');
                        }}>
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <form className='form' onSubmit={handleLogin}>
                        <h2>Login</h2>

                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <a
                            href='#'
                            onClick={(e) => e.preventDefault()}>
                            Forgot Password?
                        </a>

                        {error && (
                            <p style={{ color: 'red' }}>
                                {error}
                            </p>
                        )}

                        <button type='submit' disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <p>
                            Not a Member?
                            <a
                                href='#'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsLogin(false);
                                    setError('');
                                }}>
                                {' '}Sign Up
                            </a>
                        </p>
                    </form>
                ) : (
                    <form className='form' onSubmit={handleRegister}>
                        <h2>Sign Up</h2>

                        <input
                            type='text'
                            placeholder='Full Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <p style={{ color: 'red' }}>
                                {error}
                            </p>
                        )}

                        <button type='submit' disabled={loading}>
                            {loading ? 'Registering...' : 'Sign Up'}
                        </button>

                        <p>
                            Already a Member?
                            <a
                                href='#'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsLogin(true);
                                    setError('');
                                }}>
                                {' '}Login
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
