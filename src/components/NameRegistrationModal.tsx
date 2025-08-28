import { useState } from 'preact/hooks';
import { JSX } from 'preact';

interface INameRegistrationModalProps {
    isOpen: boolean;
    score: number;
    levelsCompleted: number;
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

export default function NameRegistrationModal({ 
    isOpen, 
    score, 
    levelsCompleted, 
    onSubmit, 
    onCancel 
}: INameRegistrationModalProps): JSX.Element | null {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        if (name.trim().length < 2) return;
        
        setIsSubmitting(true);
        onSubmit(name.trim());
    };

    const getScoreRating = () => {
        if (levelsCompleted === 20) return "🏆 LEGENDARY";
        if (levelsCompleted >= 15) return "👑 MASTER";
        if (levelsCompleted >= 10) return "🎯 EXPERT";
        if (levelsCompleted >= 5) return "⭐ SKILLED";
        return "🌟 BEGINNER";
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🍪</div>
                    <h2 className="text-2xl font-bold mb-2">Amazing Score!</h2>
                    <div className="text-lg mb-2">
                        <span className="font-bold text-green-600">{score}</span> points
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                        Completed {levelsCompleted}/20 levels
                    </div>
                    <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        {getScoreRating()}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your name for the leaderboard:
                        </label>
                        <input
                            id="playerName"
                            type="text"
                            value={name}
                            onChange={(e: JSX.TargetedEvent<HTMLInputElement>) => 
                                setName((e.target as HTMLInputElement).value)
                            }
                            placeholder="Your awesome name..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={20}
                            disabled={isSubmitting}
                            autoFocus
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            Names are moderated before appearing on the leaderboard
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={name.trim().length < 2 || isSubmitting}
                            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            {isSubmitting ? '🚀 Submitting...' : '🏆 Submit to Leaderboard'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 transition-colors"
                        >
                            Skip
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-xs text-gray-500 text-center">
                    <p>🎉 You've conquered {levelsCompleted} levels of cookie banner chaos!</p>
                    {levelsCompleted === 20 && (
                        <p className="mt-1 font-bold text-purple-600">
                            You've beaten every single dark pattern! You're a legend! 🔥
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}