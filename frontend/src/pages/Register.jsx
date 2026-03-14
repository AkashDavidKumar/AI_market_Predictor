import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Leaf, UserPlus } from "lucide-react";
import { authService } from "../services/authService";
import { useToast } from "../components/Toast";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.register(formData);
            addToast("Registration successful! Please sign in.", "success");
            navigate("/login");
        } catch (err) {
            addToast(err.response?.data?.error || "Registration failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_32px_rgba(74,92,26,0.15)] overflow-hidden border-t-8 border-harvest">

                <div className="p-8 pb-6 flex flex-col items-center border-b border-cream">
                    <div className="w-16 h-16 bg-forest rounded-2xl flex items-center justify-center mb-4 shadow-md -rotate-3">
                        <Leaf className="w-8 h-8 text-cream rotate-3" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-forest text-center">Join FormarAsOwner</h2>
                    <p className="text-gray-500 font-body text-sm mt-1 text-center">Create your account to access agricultural intelligence.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block font-body text-forest font-bold text-sm mb-1.5" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                className="w-full bg-cream border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none"
                                placeholder="Ramesh Kumar"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block font-body text-forest font-bold text-sm mb-1.5" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full bg-cream border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none"
                                placeholder="farmer@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block font-body text-forest font-bold text-sm mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full bg-cream border-2 border-olive rounded-xl px-4 py-3 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-harvest text-white font-body font-bold text-lg py-3.5 rounded-xl hover:bg-forest transition-colors flex justify-center items-center gap-2 mt-6 disabled:opacity-70"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center font-body text-gray-500 text-sm mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-forest font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
