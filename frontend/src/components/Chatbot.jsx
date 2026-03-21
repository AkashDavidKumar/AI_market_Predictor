import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Leaf } from "lucide-react";
import api from "../services/api";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I am the FormarAsOwner Assistant. How can I help you today?", isBot: true },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = { text: input, isBot: false };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await api.post("/chat", { message: userMessage.text });
            setMessages((prev) => [...prev, { text: response.data.response || "I don't have an answer for that yet.", isBot: true }]);
        } catch (err) {
            setMessages((prev) => [...prev, { text: "Sorry, I am having trouble connecting to the server.", isBot: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-forest rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50 group"
                >
                    <MessageCircle className="w-6 h-6 text-harvest" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-rust rounded-full ring-2 ring-white animate-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 h-96 bg-cream rounded-2xl shadow-[0_10px_40px_rgba(74,92,26,0.2)] flex flex-col z-50 overflow-hidden border border-olive/20 animate-slide-up origin-bottom-right">

                    {/* Header */}
                    <div className="h-14 bg-forest flex items-center justify-between px-4 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-harvest/20 flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-harvest" />
                            </div>
                            <h3 className="font-display font-bold text-cream">Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-cream/80 hover:text-white transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.isBot ? "justify-start" : "justify-end"} items-end gap-2`}>
                                {msg.isBot && (
                                    <div className="w-6 h-6 rounded-full bg-forest flex-shrink-0 flex items-center justify-center mb-1">
                                        <Leaf className="w-3.5 h-3.5 text-harvest" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3 text-sm font-body shadow-sm ${msg.isBot
                                        ? "bg-white text-forest rounded-2xl rounded-bl-sm border border-olive/10"
                                        : "bg-harvest text-white rounded-2xl rounded-br-sm shadow-harvest/20"
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-forest flex-shrink-0 flex items-center justify-center">
                                    <Leaf className="w-3.5 h-3.5 text-harvest" />
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-bl-sm border border-olive/10 flex gap-1 items-center">
                                    <span className="text-xs text-olive italic">Assistant is thinking...</span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-olive rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1 h-1 bg-olive rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1 h-1 bg-olive rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-olive/20 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-cream/50 border border-olive focus:ring-2 focus:ring-harvest focus:outline-none rounded-xl px-4 py-2 text-sm font-body text-forest"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="w-10 h-10 bg-harvest rounded-xl flex items-center justify-center text-white disabled:opacity-50 transition shadow-sm hover:shadow-md"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
