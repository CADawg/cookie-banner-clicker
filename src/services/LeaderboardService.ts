export interface ILeaderboardEntry {
    id?: string;
    name: string;
    score: number;
    levelsCompleted: number;
    completionTime?: number; // milliseconds
    created?: string;
    approved?: boolean; // For moderation
}

interface IScoreSubmission {
    name: string;
    identifier: string; // Only used for submission
    score: number;
    levelsCompleted: number;
    completionTime?: number;
}

export interface IPlayerStats {
    rank: number | null;
    totalPlayers: number;
    entry: ILeaderboardEntry | null;
}

export class LeaderboardService {

    static calculateScore(levelsCompleted: number, timeSpent: number): number {
        // Base score: 100 points per level
        let score = levelsCompleted * 100;
        
        // Time bonus: faster completion = higher score
        // Max bonus of 50 points per level for very fast completion
        const timeBonus = Math.max(0, 50 - Math.floor(timeSpent / 1000 / 10)) * levelsCompleted;
        
        // Perfect completion bonus (all 20 levels)
        if (levelsCompleted === 20) {
            score += 1000; // Massive bonus for full completion
        }
        
        // Milestone bonuses
        if (levelsCompleted >= 10) score += 200; // Made it to advanced levels
        if (levelsCompleted >= 15) score += 300; // Reached dark patterns
        if (levelsCompleted >= 18) score += 500; // Almost perfect

        return score + timeBonus;
    }

    static generatePlayerId(): string {
        return 'player_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }

    static async getTopLeaderboard(limit: number = 10): Promise<ILeaderboardEntry[]> {
        try {
            const response = await fetch(`/api/leaderboard?limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('Failed to load leaderboard from backend:', error);
            return this.getFallbackLeaderboard();
        }
    }

    static async getPlayerStats(playerId: string): Promise<IPlayerStats> {
        try {
            const response = await fetch(`/api/leaderboard/player/${encodeURIComponent(playerId)}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn('Failed to get player stats:', error);
            return { rank: null, totalPlayers: 0, entry: null };
        }
    }

    static async addScore(entry: IScoreSubmission): Promise<boolean> {
        try {
            const response = await fetch('/api/leaderboard/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: entry.name,
                    identifier: entry.identifier,
                    score: entry.score,
                    levelsCompleted: entry.levelsCompleted,
                    completionTime: entry.completionTime || 0
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            return result.success || false;
        } catch (error) {
            console.warn('Failed to save score to backend:', error);
            // Fall back to localStorage
            return this.addScoreLocally(entry);
        }
    }


    // Fallback methods for when backend is unavailable
    private static addScoreLocally(entry: IScoreSubmission): boolean {
        try {
            const stored = localStorage.getItem('cookie-banner-scores') || '[]';
            const scores = JSON.parse(stored) as any[];
            
            const existingIndex = scores.findIndex(s => s.identifier === entry.identifier);
            const { identifier, ...publicEntry } = entry;
            const newEntry = { ...publicEntry, approved: true, created: new Date().toISOString() };
            
            if (existingIndex >= 0) {
                if (scores[existingIndex].score < entry.score) {
                    scores[existingIndex] = newEntry;
                } else {
                    return false;
                }
            } else {
                scores.push(newEntry);
            }
            
            localStorage.setItem('cookie-banner-scores', JSON.stringify(scores));
            return true;
        } catch {
            return false;
        }
    }

    private static getFallbackLeaderboard(): ILeaderboardEntry[] {
        try {
            const stored = localStorage.getItem('cookie-banner-scores') || '[]';
            const scores = JSON.parse(stored) as ILeaderboardEntry[];
            return scores.sort((a, b) => b.score - a.score).slice(0, 10);
        } catch {
            return [
                { name: "Cookie Monster", score: 2500, levelsCompleted: 20, approved: true },
                { name: "Privacy Ninja", score: 1950, levelsCompleted: 18, approved: true },
                { name: "Dark Pattern Destroyer", score: 1600, levelsCompleted: 16, approved: true },
                { name: "Banner Buster", score: 1200, levelsCompleted: 12, approved: true },
                { name: "GDPR Warrior", score: 900, levelsCompleted: 9, approved: true },
                { name: "Consent Champion", score: 700, levelsCompleted: 7, approved: true },
                { name: "Rookie Rejector", score: 500, levelsCompleted: 5, approved: true },
                { name: "Tutorial Tiger", score: 300, levelsCompleted: 3, approved: true }
            ];
        }
    }
}