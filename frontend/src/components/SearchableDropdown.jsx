import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const SearchableDropdown = ({ 
    items, 
    value, 
    onChange, 
    placeholder = "Search...", 
    label,
    isCategorized = false,
    priorityKeywords = []
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (item, category = null) => {
        onChange(item, category);
        setSearchTerm("");
        setIsOpen(false);
    };

    const renderList = (list, category = null) => {
        const filtered = (list || []).filter(item => {
            if (typeof item !== 'string') return false;
            return item.toLowerCase().includes((searchTerm || "").toLowerCase());
        }).sort((a, b) => {
            if (priorityKeywords.length === 0) return 0;
            const aStr = String(a).toLowerCase();
            const bStr = String(b).toLowerCase();
            const aPriority = priorityKeywords.some(k => aStr.includes(String(k).toLowerCase()));
            const bPriority = priorityKeywords.some(k => bStr.includes(String(k).toLowerCase()));
            if (aPriority && !bPriority) return -1;
            if (!aPriority && bPriority) return 1;
            return 0;
        });

        if (filtered.length === 0) return null;

        return (
            <div key={category || "list"} className="p-2">
                {category && (
                    <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-harvest bg-harvest/5 rounded-md mb-1 flex justify-between items-center">
                        <span>{category.replace("_", " ")}</span>
                        {priorityKeywords.length > 0 && list.some(item => {
                            if (typeof item !== 'string') return false;
                            return priorityKeywords.some(k => item.toLowerCase().includes(String(k).toLowerCase()));
                        }) && (
                            <span className="text-[10px] bg-olive text-white px-1.5 py-0.5 rounded italic">Recommended</span>
                        )}
                    </div>
                )}
                <div className="space-y-1">
                    {filtered.map((item, idx) => {
                        const itemStr = String(item).toLowerCase();
                        const isPriority = priorityKeywords.some(k => itemStr.includes(String(k).toLowerCase()));
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelect(item, category)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-body text-sm ${
                                    isPriority 
                                    ? "bg-olive/5 text-olive font-bold hover:bg-olive hover:text-white underline decoration-harvest/30" 
                                    : "text-forest hover:bg-forest hover:text-cream"
                                }`}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full">
            {label && <label className="block text-forest font-bold mb-2 text-sm">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={isOpen ? searchTerm : (value || "")}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    className="w-full bg-white border-2 border-olive rounded-xl px-4 py-3 pr-10 font-body text-forest focus:ring-4 focus:ring-harvest/20 focus:border-harvest transition-all focus:outline-none text-sm"
                />
                <div className="absolute right-4 top-3.5 flex items-center gap-2 pointer-events-none">
                    <Search className="w-4 h-4 text-harvest" />
                    <ChevronDown className={`w-4 h-4 text-harvest transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {isOpen && (
                <>
                    <div className="absolute z-[100] w-full mt-2 max-h-80 overflow-y-auto bg-white border-2 border-olive rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
                        {isCategorized ? (
                            Object.entries(items).map(([category, list]) => renderList(list, category))
                        ) : (
                            renderList(items)
                        )}

                        {((isCategorized && items && Object.values(items).every(list => 
                            Array.isArray(list) && list.filter(i => 
                                typeof i === 'string' && i.toLowerCase().includes((searchTerm || "").toLowerCase())
                            ).length === 0
                          )) ||
                          (!isCategorized && Array.isArray(items) && items.filter(i => 
                            typeof i === 'string' && i.toLowerCase().includes((searchTerm || "").toLowerCase())
                          ).length === 0)) && (
                            <div className="p-6 text-center text-gray-400 font-body italic text-sm">
                                No matching results found.
                            </div>
                        )}
                    </div>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-[90]" 
                        onClick={() => {
                            setIsOpen(false);
                            setSearchTerm("");
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default SearchableDropdown;
