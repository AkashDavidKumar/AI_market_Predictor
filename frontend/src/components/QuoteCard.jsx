import React, { useState, useEffect } from 'react';
import { quoteService } from '../services/quoteService';
import { Quote } from 'lucide-react';

const QuoteCard = () => {
    const [quote, setQuote] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const data = await quoteService.getDailyQuote();
                setQuote(data.quote);
            } catch (err) {
                console.error("Quote fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuote();
    }, []);

    if (loading) return <div className="p-4 animate-pulse bg-harvest/10 rounded-2xl h-24"></div>;
    if (!quote) return null;

    return (
        <div className="bg-gradient-to-br from-harvest/5 to-olive/5 p-4 rounded-2xl border border-harvest/20 relative overflow-hidden group">
            <Quote className="absolute -top-1 -left-1 w-12 h-12 text-harvest/10 -rotate-12 transition-transform group-hover:scale-110" />
            <p className="text-forest font-body italic text-sm relative z-10 leading-relaxed">
                "{quote}"
            </p>
            <div className="mt-2 text-[10px] font-bold text-harvest uppercase tracking-widest text-right">
                Daily Wisdom
            </div>
        </div>
    );
};

export default QuoteCard;
