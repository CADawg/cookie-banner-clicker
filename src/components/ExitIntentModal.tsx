import { useState, useEffect } from 'preact/hooks';
import { JSX } from 'preact';

interface IExitIntentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FAKE_SIGNUP_MESSAGES = [
    {
        title: "WAIT! Don't Go Empty-Handed! 🎁",
        subtitle: "Get exclusive cookie banner insider secrets!",
        benefit: "Join 47,000+ privacy warriors fighting the good fight!"
    },
    {
        title: "Hold Up! Special Offer Just For You! 💥",
        subtitle: "Free Premium Dark Pattern Detection Course",
        benefit: "Learn to spot manipulation tactics like a pro!"
    },
    {
        title: "Before You Leave... 🚀",
        subtitle: "Get the Ultimate Cookie Rejection Cheat Sheet",
        benefit: "Never fall for 'Accept All' again!"
    },
    {
        title: "Last Chance! Don't Miss Out! ⏰",
        subtitle: "Exclusive Newsletter: 'Privacy Ninja Weekly'",
        benefit: "Tips, tricks, and GDPR memes delivered to your inbox!"
    },
    {
        title: "We See You Trying to Escape! 👁️",
        subtitle: "How about some premium surveillance tips?",
        benefit: "Learn what Big Tech doesn't want you to know!"
    }
];

const FAKE_TESTIMONIALS = [
    "\"This newsletter saved my data!\" - Definitely Real Person",
    "\"I went from cookie victim to privacy hero!\" - Not A Bot",
    "\"My grandma finally understands GDPR thanks to this!\" - Suspicious Account",
    "\"5 stars! Would recommend to my data broker!\" - Fake Review #47",
    "\"Life changing! Now I only accept essential cookies!\" - Paid Testimonial"
];

export default function ExitIntentModal({ isOpen, onClose }: IExitIntentModalProps): JSX.Element | null {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Randomly pick a message variant
    const [messageVariant] = useState(() => 
        FAKE_SIGNUP_MESSAGES[Math.floor(Math.random() * FAKE_SIGNUP_MESSAGES.length)]
    );
    
    const [testimonial] = useState(() => 
        FAKE_TESTIMONIALS[Math.floor(Math.random() * FAKE_TESTIMONIALS.length)]
    );

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        
        if (!email) return;
        
        setIsSubmitting(true);
        
        // Fake submission with delay
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            
            // Auto-close after showing success
            setTimeout(() => {
                onClose();
                setShowSuccess(false);
                setEmail('');
            }, 3000);
        }, 1500);
    };

    const handleClose = () => {
        onClose();
        setShowSuccess(false);
        setEmail('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full relative animate-bounce-in">
                {/* Deliberately annoying close button */}
                <button 
                    onClick={handleClose}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs font-bold z-10 shadow-lg"
                    style={{ fontSize: '10px' }}
                >
                    ✕
                </button>
                
                {showSuccess ? (
                    // Success state
                    <div className="p-8 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
                        <p className="text-gray-700">Thanks for signing up for our totally real newsletter!</p>
                        <p className="text-sm text-gray-500 mt-2">
                            (Just kidding - this is a parody! Your email wasn't actually collected)
                        </p>
                    </div>
                ) : (
                    // Main signup form
                    <div className="p-6">
                        {/* Header with gradient background */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 -m-6 mb-6 rounded-t-lg">
                            <h2 className="text-xl font-bold mb-1">{messageVariant.title}</h2>
                            <p className="text-purple-100 text-sm">{messageVariant.subtitle}</p>
                        </div>

                        <div className="space-y-4">
                            {/* Benefit highlight */}
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
                                <p className="text-sm font-medium text-yellow-800">
                                    ✨ {messageVariant.benefit}
                                </p>
                            </div>

                            {/* Fake testimonial */}
                            <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                                <p className="text-sm italic text-gray-700">"{testimonial}"</p>
                            </div>

                            {/* Email form */}
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                                        placeholder="Enter your email address..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Subscribing...
                                        </span>
                                    ) : (
                                        'Get My Free Privacy Secrets! 🚀'
                                    )}
                                </button>
                            </form>

                            {/* Fake urgency indicators */}
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>⏰ 23 people viewing</span>
                                <span>🔥 Limited time offer</span>
                                <span>✅ 100% Fake Promise</span>
                            </div>

                            {/* Fine print parody */}
                            <div className="text-xs text-gray-400 leading-tight">
                                By clicking above, you agree to receive our newsletters, promotional emails, 
                                targeted ads, location tracking, biometric analysis, and to let us sell your 
                                data to 847 "trusted" partners. You can unsubscribe by completing our 
                                47-step verification process.
                                <br /><br />
                                <strong>Psst:</strong> This is just a parody - no emails are actually collected!
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes bounce-in {
                    0% { 
                        transform: scale(0.3);
                        opacity: 0;
                    }
                    50% { 
                        transform: scale(1.05);
                    }
                    70% { 
                        transform: scale(0.9);
                    }
                    100% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                
                .animate-bounce-in {
                    animation: bounce-in 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}

// Hook for managing exit intent detection
export const useExitIntent = () => {
    const [hasTriggered, setHasTriggered] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (hasTriggered) return;

        let timeoutId: number;

        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger if cursor leaves from the top of the viewport
            // and we're not already showing a modal
            if (e.clientY <= 10 && e.relatedTarget == null && !showModal) {
                // Add a small delay to prevent accidental triggers
                timeoutId = window.setTimeout(() => {
                    setShowModal(true);
                    setHasTriggered(true);
                }, 100);
            }
        };

        const handleMouseEnter = () => {
            // Cancel the trigger if mouse comes back quickly
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };

        // Only track when playing the game (not on start screen)
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseout', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseout', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [hasTriggered, showModal]);

    const closeModal = () => {
        setShowModal(false);
    };

    const resetTrigger = () => {
        setShowModal(false);
        setHasTriggered(false);
    };

    return {
        showModal,
        closeModal,
        resetTrigger,
        hasTriggered
    };
};