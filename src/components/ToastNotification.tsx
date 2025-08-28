import { useState, useEffect } from 'preact/hooks';
import { JSX } from 'preact';

interface IToast {
    id: string;
    message: string;
    type?: 'urgent' | 'warning' | 'offer' | 'pressure';
    duration?: number;
}

interface IToastNotificationProps {
    toasts: IToast[];
    onDismiss: (id: string) => void;
}

const TOAST_MESSAGES = [
    // High pressure / urgency
    "⏰ Hurry up - your content slop is getting cold!",
    "🔥 URGENT: Other users are completing levels faster than you!",
    "⚡ Quick! This exclusive free content expires in... uh... never actually",
    "🚨 WARNING: You're taking too long! Click something already!",
    "💥 BREAKING: Local person still reading cookie policies like it's 2018",
    
    // FOMO tactics
    "😱 You're missing out on targeted ads just for YOU!",
    "📢 83% of users just accept everything. Be different! ...or don't.",
    "🎯 Personalized experience loading... Just kidding, it's all ads",
    "💔 Your data broker is getting lonely without your info",
    "👥 Join 7 billion others who clicked 'Accept All' without reading!",
    
    // Fake urgency
    "⏳ Limited time offer: Accept cookies NOW! (Offer valid forever)",
    "🎪 TODAY ONLY: Free tracking across 847 advertising partners!",
    "💎 Premium surveillance package - normally $0, now just $0!",
    "🛡️ Your privacy is important* (*terms and conditions apply)",
    "🏃‍♂️ Running out of time! (We literally have all day)",
    
    // Guilt trips
    "😢 You're hurting our feelings by reading the fine print",
    "💸 Websites aren't free! (Neither is your data apparently)",
    "👨‍💻 Think of the poor data analysts who need your info to eat",
    "🥺 Cookies just want to help! (Help themselves to your data)",
    "💭 Don't you want a *personalized* experience? (We do)",
    
    // Absurd dark patterns
    "🤖 AI suggests you accept everything. Trust the machines!",
    "🔮 Fortune teller says your future involves targeted ads",
    "🧠 Psychology tip: Just clicking 'Accept' reduces decision fatigue!",
    "📊 Statistics show 99% of users don't read this anyway",
    "🎲 Feeling lucky? Hit 'Accept All' and see what happens!",
    
    // Meta commentary
    "🎮 This is exactly what real websites do, by the way",
    "📝 Pro tip: The cookie banner is designed to be annoying",
    "🎭 Plot twist: This notification is also tracking you",
    "🔍 Fun fact: You've been watched since you opened this page",
    "🎪 Welcome to the circus of modern web privacy!"
];

export default function ToastNotification({ toasts, onDismiss }: IToastNotificationProps): JSX.Element {
    const getToastStyle = (type: string) => {
        switch (type) {
            case 'urgent':
                return 'bg-red-500 border-red-600 text-white animate-pulse';
            case 'warning':
                return 'bg-yellow-500 border-yellow-600 text-black';
            case 'offer':
                return 'bg-green-500 border-green-600 text-white';
            case 'pressure':
                return 'bg-purple-500 border-purple-600 text-white';
            default:
                return 'bg-blue-500 border-blue-600 text-white';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        ${getToastStyle(toast.type || 'pressure')} 
                        border-l-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 
                        hover:scale-105 cursor-pointer select-none
                        animate-slide-in-right
                    `}
                    onClick={() => onDismiss(toast.id)}
                >
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-medium pr-2">{toast.message}</p>
                        <button 
                            className="text-xs opacity-70 hover:opacity-100 ml-2 flex-shrink-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDismiss(toast.id);
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
            <style jsx>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

// Hook for managing toasts
export const useToasts = () => {
    const [toasts, setToasts] = useState<IToast[]>([]);

    const addToast = (message: string, type: IToast['type'] = 'pressure', duration = 4000) => {
        const id = Date.now().toString();
        const toast: IToast = { id, message, type, duration };
        
        setToasts(prev => [...prev, toast]);
        
        // Auto-dismiss after duration
        setTimeout(() => {
            dismissToast(id);
        }, duration);
    };

    const addRandomToast = () => {
        const randomMessage = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
        const types: IToast['type'][] = ['urgent', 'warning', 'offer', 'pressure'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        addToast(randomMessage, randomType, Math.random() * 2000 + 3000); // 3-5 seconds
    };

    const dismissToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const clearAllToasts = () => {
        setToasts([]);
    };

    return {
        toasts,
        addToast,
        addRandomToast,
        dismissToast,
        clearAllToasts
    };
};

export { TOAST_MESSAGES };