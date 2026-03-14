import React from "react";
import { AlertTriangle } from "lucide-react";

export const ErrorMessage = ({ message = "An error occurred while fetching data." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 m-4 bg-rust/10 border-l-4 border-rust rounded-2xl w-full max-w-2xl mx-auto shadow-sm">
            <AlertTriangle className="w-10 h-10 text-rust mb-3" />
            <h3 className="text-rust font-display text-xl font-semibold mb-2">Notice</h3>
            <p className="text-forest font-body text-center">{message}</p>
        </div>
    );
};

export default ErrorMessage;
