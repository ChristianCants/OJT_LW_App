import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customSignIn, customSignInByEmail } from '../services';



const SignIn = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isEmail = identifier.includes('@');
        let result;

        if (isEmail) {
            // Login with email
            result = await customSignInByEmail(identifier, password);
        } else {
            // Login with username
            result = await customSignIn(identifier, password);
        }

        const { data, error } = result;

        if (error || !data) {
            setError("Login failed. Please check your credentials.");
        } else {
            localStorage.setItem('user', JSON.stringify(data));
            navigate(data.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full flex font-sans bg-[#050505] text-white">
            {/* Left Panel - Form (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col justify-center p-8 lg:p-20 relative z-10">
                <div className="max-w-md w-full mx-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-[#888] hover:text-white transition-colors mb-6 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 mb-8">
                            <span className="h-4 w-4 rounded-full bg-yellow-400"></span>
                            <span className="font-bold text-xl tracking-tight">lifewood</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-3 tracking-tight">Sign In</h1>
                        <p className="text-[#888] text-sm">Enter your credentials to access your dashboard</p>
                    </div>

                    {/* Social Login Buttons (Visual Only) */}
                    <div className="flex gap-4 mb-8">
                        <button className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded-xl py-2.5 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
                        </button>
                        <button className="flex-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] rounded-xl py-2.5 flex items-center justify-center transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#333]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#050505] text-[#666]">or</span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 text-sm border border-red-500/20 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[#888] ml-1">USERNAME OR EMAIL</label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:ring-0 transition-all"
                                placeholder="Enter your username or email"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between ml-1">
                                <label className="text-xs font-medium text-[#888]">PASSWORD</label>
                                <button type="button" className="text-xs text-[#888] hover:text-white transition-colors">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:ring-0 transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transform transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Panel - Visuals Overlay (60%) */}
            <div className="hidden lg:block w-[60%] p-3 h-screen max-h-screen">
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative border border-white/5 bg-[#111]">
                    {/* Background Video */}
                    <div className="absolute inset-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/assets/background_1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Bento Grid Overlay */}
                    <div className="absolute inset-0 z-20 grid grid-cols-4 grid-rows-4 gap-3 p-6 pointer-events-none">
                        {/* Large Card */}
                        <div className="col-span-2 row-span-2 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors duration-500">
                            <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center mb-4">
                                <span className="text-2xl">✨</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Innovative Design</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">Harness the power of AI for cutting-edge 3D creations.</p>
                            </div>
                        </div>

                        {/* Small cards */}
                        <div className="col-span-1 row-span-1 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"></div>
                        <div className="col-span-1 row-span-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>

                        <div className="col-span-1 row-span-2 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10"></div>

                        {/* Colored Card */}
                        <div className="col-span-2 row-span-1 bg-[#D0F050] rounded-3xl border border-[#D0F050]/20 p-6 flex flex-col justify-center">
                            <h3 className="text-black text-xl font-bold mb-1">User-Friendly</h3>
                            <p className="text-black/60 text-xs">Intuitive platform for everyone.</p>
                        </div>

                        {/* Bottom Cards */}
                        <div className="col-span-1 row-span-1 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"></div>
                        <div className="col-span-2 row-span-1 bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Join the future</span>
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
