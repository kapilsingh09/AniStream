import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        // username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (formData.password !== formData.confirmPassword) {
            return setMessage(" Passwords do not match");
        }
        
        setLoading(true);
        
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setMessage("✅ Registered successfully!!");
                // Add a small delay to show success message
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else {
                setMessage(` ${data.message || 'Registration failed'}`);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setMessage(" Server error. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
            <div className="w-full max-w-md p-8 rounded-xl bg-zinc-800 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-zinc-100 mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm font-medium text-red-400">{message}</p>
                )}
            </div>
        </div>
    );    
};

export default Register;