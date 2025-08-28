import { useState, useEffect } from 'preact/hooks';
import { JSX } from 'preact';
import { LeaderboardService, ILeaderboardEntry, IPlayerStats } from '../services/LeaderboardService';

interface IRegionBlockedLeaderboardProps {
    playerId: string;
}

export default function RegionBlockedLeaderboard({ playerId }: IRegionBlockedLeaderboardProps): JSX.Element {
    const [leaderboard, setLeaderboard] = useState<ILeaderboardEntry[]>([]);
    const [playerStats, setPlayerStats] = useState<IPlayerStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showActualLeaderboard, setShowActualLeaderboard] = useState(false);

    useEffect(() => {
        loadLeaderboardData();
    }, [playerId]);

    const loadLeaderboardData = async () => {
        setIsLoading(true);
        
        try {
            const [topScores, stats] = await Promise.all([
                LeaderboardService.getTopLeaderboard(10),
                LeaderboardService.getPlayerStats(playerId)
            ]);
            
            setLeaderboard(topScores);
            setPlayerStats(stats as IPlayerStats);
        } catch (err) {
            console.error('Leaderboard error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';  
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    const getLevelBadge = (levelsCompleted: number) => {
        if (levelsCompleted === 20) return { emoji: '🏆', text: 'LEGEND', color: 'text-yellow-600' };
        if (levelsCompleted >= 15) return { emoji: '👑', text: 'MASTER', color: 'text-purple-600' };
        if (levelsCompleted >= 10) return { emoji: '🎯', text: 'EXPERT', color: 'text-blue-600' };
        if (levelsCompleted >= 5) return { emoji: '⭐', text: 'SKILLED', color: 'text-green-600' };
        return { emoji: '🌟', text: 'BEGINNER', color: 'text-gray-600' };
    };

    if (showActualLeaderboard) {
        // Show the real leaderboard content
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">🏆 Cookie Banner Leaderboard</h2>
                    <button 
                        onClick={() => setShowActualLeaderboard(false)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                        Hide from EU regulators
                    </button>
                </div>
                
                {/* Player's Rank */}
                {playerStats && playerStats.entry && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <h3 className="font-bold text-lg mb-2 text-center">Your Stats</h3>
                        <div className="flex justify-between items-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {playerStats.rank ? getRankIcon(playerStats.rank) : 'Unranked'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {playerStats.rank ? `Rank ${playerStats.rank}` : 'Pending Approval'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{playerStats.entry.score}</div>
                                <div className="text-sm text-gray-600">Score</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold">
                                    {playerStats.entry.levelsCompleted}/20
                                </div>
                                <div className="text-sm text-gray-600">Levels</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-sm font-bold ${getLevelBadge(playerStats.entry.levelsCompleted).color}`}>
                                    {getLevelBadge(playerStats.entry.levelsCompleted).emoji} {getLevelBadge(playerStats.entry.levelsCompleted).text}
                                </div>
                            </div>
                        </div>
                        {playerStats.totalPlayers > 0 && (
                            <div className="text-center mt-2 text-sm text-gray-600">
                                Out of {playerStats.totalPlayers} total players
                            </div>
                        )}
                    </div>
                )}

                {/* Top 10 Leaderboard */}
                <div className="space-y-3">
                    <h3 className="font-bold text-lg text-center mb-4">🔥 Hall of Fame</h3>
                    {isLoading ? (
                        <div className="text-center text-gray-500">Loading leaderboard...</div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No scores yet. Be the first to make the leaderboard!
                        </div>
                    ) : (
                        leaderboard.map((entry, index) => {
                            const rank = index + 1;
                            const badge = getLevelBadge(entry.levelsCompleted);
                            const isPlayer = playerStats?.entry?.id === entry.id;
                            
                            return (
                                <div 
                                    key={entry.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border ${
                                        isPlayer ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                                    } ${rank <= 3 ? 'shadow-md' : ''}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="text-2xl font-bold w-12 text-center">
                                            {getRankIcon(rank)}
                                        </div>
                                        <div>
                                            <div className={`font-bold ${isPlayer ? 'text-blue-600' : 'text-gray-800'}`}>
                                                {entry.name} {isPlayer && '(You!)'}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {entry.levelsCompleted}/20 levels completed
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-green-600">
                                            {entry.score.toLocaleString()}
                                        </div>
                                        <div className={`text-xs font-bold ${badge.color}`}>
                                            {badge.emoji} {badge.text}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }

    // Show the parody "region blocked" page
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Fake newspaper header */}
            <div className="bg-gray-900 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-serif font-bold">📰 The Cookie Chronicle</div>
                    <div className="text-xs">🗓️ Today's Date</div>
                </div>
                <div className="text-xs mt-1 text-gray-300">Your #1 Source for Cookie Banner News Since 2018</div>
            </div>

            {/* Navigation bar */}
            <div className="bg-gray-100 border-b px-4 py-2">
                <div className="flex space-x-6 text-sm font-medium text-gray-700">
                    <a href="#" className="hover:text-blue-600">🏠 Home</a>
                    <a href="#" className="hover:text-blue-600">📊 Leaderboards</a>
                    <a href="#" className="hover:text-blue-600">🍪 Cookie News</a>
                    <a href="#" className="hover:text-blue-600">🔒 Privacy</a>
                    <a href="#" className="hover:text-blue-600">💰 Subscribe</a>
                </div>
            </div>

            {/* Main blocked content */}
            <div className="p-6 text-center">
                <div className="mb-6">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        This content is not available in your region
                    </h1>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Due to GDPR and other privacy regulations, we are unable to display our 
                        leaderboard content to users in your region. We apologize for any inconvenience.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-lg mx-auto">
                    <h3 className="font-bold text-blue-800 mb-2">🌍 Available in:</h3>
                    <div className="text-sm text-blue-700 space-y-1">
                        <div>🇺🇸 United States</div>
                        <div>🇨🇦 Canada (except Quebec)</div>
                        <div>🇦🇺 Australia (mainland only)</div>
                        <div>🏴‍☠️ International Waters</div>
                        <div>🌙 The Moon (pending lunar legislation)</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => setShowActualLeaderboard(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        🔓 View Anyway
                    </button>
                    
                    <div className="text-xs text-gray-500 max-w-md mx-auto">
                        <p>By clicking above, you acknowledge that you are not in the EU, have disabled your VPN, 
                        cleared your cache, restarted your router, and performed a rain dance to appease the 
                        internet gods. Side effects may include: targeted advertising, loss of privacy, 
                        existential dread, and an inexplicable craving for cookies.</p>
                    </div>
                </div>

                {/* Fake ads */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-xs text-gray-400 mb-3">Advertisement</div>
                    <div className="bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 rounded p-4">
                        <div className="text-sm font-bold text-purple-800">🍪 Cookie Lawyers Near You!</div>
                        <div className="text-xs text-purple-600 mt-1">
                            Sued for cookie violations? Our team of GDPR specialists can help! 
                            Call 1-800-NO-CRUMB today!
                        </div>
                    </div>
                </div>
            </div>

            {/* Fake footer */}
            <div className="bg-gray-50 border-t px-4 py-3 text-xs text-gray-500">
                <div className="flex justify-between items-center">
                    <div>© 2024 Cookie Chronicle. All rights reserved (in some regions).</div>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-700">Terms*</a>
                        <a href="#" className="hover:text-gray-700">Privacy†</a>
                        <a href="#" className="hover:text-gray-700">Cookies‡</a>
                    </div>
                </div>
                <div className="mt-2 text-gray-400">
                    *Terms may vary by region. †Privacy not guaranteed. ‡We use 847 essential cookies for basic functionality.
                </div>
            </div>
        </div>
    );
}