import React from 'react';
import { Bell, Clock, AlertTriangle, TrendingUp, Info } from 'lucide-react';

const NotificationPanel = ({ notifications, onClose }) => {
    const getIcon = (title) => {
        if (title.includes('Price')) return <TrendingUp className="w-4 h-4 text-forest" />;
        if (title.includes('Weather')) return <AlertTriangle className="w-4 h-4 text-rust" />;
        return <Info className="w-4 h-4 text-harvest" />;
    };

    return (
        <div className="absolute top-16 right-0 w-80 bg-white rounded-3xl shadow-xl border border-olive/20 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="bg-forest p-4 flex items-center justify-between">
                <h3 className="text-cream font-display font-bold">Notifications</h3>
                <span className="bg-harvest text-forest text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {notifications.length} New
                </span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm font-body">
                        All caught up!
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div key={n.id} className="p-4 border-b border-olive/10 hover:bg-cream/50 transition-colors cursor-pointer group">
                            <div className="flex gap-3">
                                <div className="mt-1 p-2 rounded-xl bg-gray-100 group-hover:bg-white transition-colors h-fit">
                                    {getIcon(n.title)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-forest">{n.title}</h4>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {n.time}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-body leading-relaxed">{n.message}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-cream/50 text-center">
                <button 
                    onClick={onClose}
                    className="text-xs font-bold text-forest hover:text-harvest transition-colors uppercase tracking-wider"
                >
                    Mark all as read
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;
