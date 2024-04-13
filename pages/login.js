import Head from 'next/head';
import { useState } from 'react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Assuming you have an API endpoint to verify username and password
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            // Handle login success here
            console.log('Login successful');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="bg-gray-100 font-sans antialiased">
            <Head>
                <title>Login</title>
            </Head>
            <nav className="bg-blue-600 p-4 text-white flex justify-between">
                <h1 className="text-3xl font-bold">AI Blog Generator</h1>
                <div>
                    <a href="/login" className="text-white hover:underline">Login</a>
                    <a href="/signup" className="text-white hover:underline">Signup</a>
                </div>
            </nav>

            <div className="flex items-center justify-center h-screen">
                <div className="bg-white p-8 shadow-md rounded-lg max-w-md w-full">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div align="center" style={{ color: 'red' }}>
                                <h2>{error}</h2>
                            </div>
                        )}
                        <h2 className="text-xl font-semibold">Login</h2>
                        <div>
                            <label htmlFor="username" className="block mb-1 font-medium">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username..."
                                className="w-full p-2 border rounded"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password..."
                                className="w-full p-2 border rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}




