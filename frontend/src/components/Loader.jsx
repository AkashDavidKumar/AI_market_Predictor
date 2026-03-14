import React from "react";
import { Loader2 } from "lucide-react";

export const Loader = ({ message = "Loading data..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[50vh]">
            <Loader2 className="w-12 h-12 text-olive animate-spin mb-4" />
            <p className="text-forest font-body font-medium">{message}</p>
        </div>
    );
};

export default Loader;
