import React from "react";
import { Link } from "react-router-dom";
import { Map, ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
            <div className="bg-white p-12 rounded-3xl shadow-[0_8px_32px_rgba(74,92,26,0.12)] text-center max-w-lg border-t-8 border-harvest">
                <div className="w-24 h-24 bg-olive/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Map className="w-12 h-12 text-forest" />
                </div>

                <h1 className="font-display font-bold text-6xl text-forest mb-4">404</h1>
                <h2 className="font-body font-bold text-2xl text-rust mb-4">Page Not Found</h2>

                <p className="text-gray-500 font-body mb-8 leading-relaxed">
                    The field you are looking for seems to be empty. It might have been moved, deleted, or never existed in the FormarAsOwner system.
                </p>

                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-cream font-body font-bold rounded-xl hover:bg-harvest transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
