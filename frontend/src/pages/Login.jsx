import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, LogIn } from "lucide-react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authService.login({ email, password });
            login(data.token, data.user);
            addToast("Login successful!", "success");
            navigate("/dashboard");
        } catch (err) {
            addToast(err.response?.data?.error || "Login failed. Please check your credentials.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_32px_rgba(74,92,26,0.15)] overflow-hidden border-t-8 border-harvest">

                <div className="p-8 pb-6 flex flex-col items-center border-b border-cream">
                    <div className="w-16 h-16 bg-forest rounded-2xl flex items-center justify-center mb-4 shadow-md rotate-3">
                        <Leaf className="w-8 h-8 text-harvest -rotate-3" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-forest text-center">FormarAsOwner</h2>
                    <p className="text-gray-500 font-body text-sm mt-1 text-center">Welcome back! Please login to your account.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block font-body text-forest font-bold text-sm mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full bg-cream border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none"
                                placeholder="farmer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block font-body text-forest font-bold text-sm mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full bg-cream border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-forest text-cream font-body font-bold text-lg py-3.5 rounded-xl hover:bg-harvest transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center font-body text-gray-500 text-sm mt-8">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-harvest font-bold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
