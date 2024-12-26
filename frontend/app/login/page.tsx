"use client"; 

import React, { useState } from 'react';
import appApi from '../api/appApi';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    const router = useRouter();
    const api = appApi();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfoMessage(null);

        if(validateInputs()) {
            try {
                const { data } = await api.post('/auth/login', {
                    username,
                    password,
                });
    
                if(data.access_token){
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', data.user);
                    router.push('/');
                } else {
                    setError('Failed to login');
                }
                
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to login');
            }
        }

        
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setInfoMessage(null);

        if(validateInputs()){
            try {
                const { data } = await api.post('/users', {
                    username,
                    password,
                });

                if (data.id) {
                    setUsername('');
                    setPassword('');
                    setInfoMessage('User created successfully')
                } else {
                    setError('Error creating user');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Error creating user');
            }
        }
    };

    const validateInputs = () => {
        let isValid = true;
    
        if (!username || username.length < 3) {
            setUsernameError('Please enter a valid User Name.');
            isValid = false;
        } else {
            setUsernameError(null);
        }
    
        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(null);
        }
    
        return isValid;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-md shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Sign In to your Account</h1>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {usernameError && <p className="text-red-500 mb-4">{usernameError}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
                    </div>
                    <button
                        onClick={handleLogin}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignUp}
                        type="submit"
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Create Account
                    </button>
                </form>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {infoMessage && <p className="text-green-500 mb-4">{infoMessage}</p>}
            </div>
        </div>
    );
};

export default LoginPage;