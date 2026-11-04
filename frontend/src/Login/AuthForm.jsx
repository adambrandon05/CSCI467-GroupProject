import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleLogin = () => {
        // Navigate to homepage
        navigate('/home');
    };

    return (
        <div className='container'>
            <div className='form-container'>
                <div className='form-toggle'>
                    <button
                        className={isLogin ? 'active' : ""}
                        onClick={() => setIsLogin(true)}>
                        Login
                    </button>

                    <button
                        className={!isLogin ? 'active' : ""}
                        onClick={() => setIsLogin(false)}>
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <div className='form'>
                        <h2>Login</h2>
                        <input type='email' placeholder='Email' />
                        <input type='password' placeholder='Password' />
                        <a href='#'>Forgot Password?</a>

                        <button onClick={handleLogin}>Login</button>

                        <p>
                            Not a Member? 
                            <a href='#' onClick={() => setIsLogin(false)}> Sign Up</a>
                        </p>
                    </div>
                ) : (
                    <div className='form'>
                        <h2>Sign Up</h2>
                        <input type='email' placeholder='Email' />
                        <input type='password' placeholder='Password' />
                        <input type='password' placeholder='Confirm Password' />

                        <button>Sign Up</button>

                        <p>
                            Already a Member?
                            <a href='#' onClick={() => setIsLogin(true)}> Login</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}