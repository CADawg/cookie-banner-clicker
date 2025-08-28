import { useState, useEffect } from 'preact/hooks';
import {faTrophy} from '@fortawesome/free-solid-svg-icons/faTrophy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GameLevel from "./GameLevels";
import {JSX} from "preact";
import React from "preact/compat";
import { LEVEL_CONFIGS } from './data/GameData';
import { LeaderboardService } from './services/LeaderboardService';
import NameRegistrationModal from './components/NameRegistrationModal';
import RegionBlockedLeaderboard from './components/RegionBlockedLeaderboard';
import ToastNotification, { useToasts } from './components/ToastNotification';
import ExitIntentModal, { useExitIntent } from './components/ExitIntentModal';

interface IPlayer {
    name: string;
    identifier: string;
    score: number;
}

function GetNumberSuffix(number: number): string {
    if (number === 1) {
        return "st";
    } else if (number === 2) {
        return "nd";
    } else if (number === 3) {
        return "rd";
    } else {
        return "th";
    }
}

function randomElementId(): string {
    return Math.random().toString(36).substring(2, 15);
}

function Checkbox(props: {label?: string, checked: boolean, setChecked: (checked: boolean) => void}): React.ReactElement {
    function voidAction(e: React.FormEvent<HTMLFormElement>): false {
        e.preventDefault();
        e.stopPropagation();

        return false;
    }

    let checkboxId = randomElementId();

    return (
        <form onSubmit={voidAction} className="flex items-center space-x-2">
            <input 
                type="checkbox" 
                id={checkboxId} 
                checked={props.checked} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setChecked((e.target as HTMLInputElement).checked)}
                className="w-5 h-5"
            />
            <label htmlFor={checkboxId} className="text-sm sm:text-base">{props.label ? props.label : ""}</label>
        </form>
    );
}

function App(): JSX.Element {
  const [playerId] = useState(() => {
    let stored = localStorage.getItem('cookie-banner-player-id');
    if (!stored) {
      stored = LeaderboardService.generatePlayerId();
      localStorage.setItem('cookie-banner-player-id', stored);
    }
    return stored;
  });

  const [initialFailCheck, setInitialFailCheck] = useState(true);
  const [isNinePlusTenTwentyOne, setIsNinePlusTenTwentyOne] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameLevel, setGameLevel] = useState(0);
  const [failed, setFailed] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameCompletionTime, setGameCompletionTime] = useState(0);
  const [submittedScore, setSubmittedScore] = useState(false);
  
  // Toast notification system
  const { toasts, addRandomToast, dismissToast, clearAllToasts } = useToasts();
  
  // Exit-intent modal system
  const { showModal: showExitModal, closeModal: closeExitModal, resetTrigger: resetExitTrigger } = useExitIntent();

  const handleGameComplete = async (levelsCompleted: number) => {
    if (!gameStartTime) return;

    const timeSpent = Date.now() - gameStartTime;
    const score = LeaderboardService.calculateScore(levelsCompleted, timeSpent);
    setGameScore(score);
    setGameCompletionTime(timeSpent);
    
    // Show name registration for significant achievements
    if (levelsCompleted >= 3 && !submittedScore) {
      setShowNameModal(true);
    }
  };

  const handleNameSubmit = async (name: string) => {
    const success = await LeaderboardService.addScore({
      name,
      identifier: playerId,
      score: gameScore,
      levelsCompleted: gameLevel - 1,
      completionTime: gameCompletionTime
    });
    
    setSubmittedScore(true);
    setShowNameModal(false);
    
    if (success) {
      // Optional: Show success message
      console.log('Score submitted successfully!');
    }
  };

  useEffect(() => {
    if (failed && gameStartTime && !submittedScore) {
      handleGameComplete(gameLevel - 1);
      clearAllToasts(); // Clear toasts when game ends
    }
  }, [failed, gameLevel, gameStartTime, submittedScore]);

  // Toast triggering logic during gameplay
  useEffect(() => {
    if (gameLevel > 0 && !failed) {
      // Show toast when entering a level
      const welcomeTimer = setTimeout(() => {
        addRandomToast();
      }, 1000); // 1 second after level starts

      // Show periodic pressure toasts during gameplay
      const pressureTimer = setTimeout(() => {
        addRandomToast();
      }, 5000); // 5 seconds into level

      // Show increasingly urgent toasts for longer levels
      const urgentTimer = setTimeout(() => {
        addRandomToast();
      }, 10000); // 10 seconds into level

      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(pressureTimer);
        clearTimeout(urgentTimer);
      };
    }
  }, [gameLevel, failed]);

  // Check screen size for mobile responsiveness
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  function Play(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
        e.stopPropagation();

      if (initialFailCheck) {
        setIsNinePlusTenTwentyOne(true);

        return;
      }

      setIsNinePlusTenTwentyOne(false);
      setGameStartTime(Date.now());
      setGameLevel(1);
      setFailed(false);
      setShowLeaderboard(false);
      resetExitTrigger(); // Reset exit intent for new game
  }

  // noinspection TypeScriptValidateTypes
    return (
    <div className="App min-h-screen">
        <nav className="bg-black text-white px-4 py-3 h-12">
          <div className="text-xl sm:text-2xl font-bold leading-6 select-none">Cookie Clicker</div>
        </nav>


        {failed ? null : gameLevel === 0 ? (
            showLeaderboard ? (
                // Leaderboard view
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 mr-2" />
                                    Leaderboard
                                </h2>
                                <button 
                                    onClick={() => setShowLeaderboard(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <RegionBlockedLeaderboard playerId={playerId} />
                        </div>
                    </div>
                </div>
            ) : (
                // Start screen
                <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sm:p-8 rounded-t-2xl">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🍪</div>
                                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Cookie Banner Clicker</h1>
                                <p className="text-blue-100 text-lg">Navigate the maze of modern web privacy</p>
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="p-6 sm:p-8">
                            {/* Game description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-3 text-gray-800">🎯 The Challenge</h2>
                                <p className="text-gray-700 mb-4">
                                    Navigate through <strong>20 levels</strong> of increasingly complex cookie banners 
                                    without accepting any non-essential cookies. Can you outsmart the dark patterns?
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="text-green-500 mr-2">✅</span>
                                        Essential cookies OK
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-red-500 mr-2">❌</span>
                                        Marketing cookies bad
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-blue-500 mr-2">🎯</span>
                                        20 challenging levels
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-purple-500 mr-2">🏆</span>
                                        Global leaderboard
                                    </div>
                                </div>
                            </div>

                            {/* Tutorial checkpoint */}
                            <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                                <h3 className="font-semibold text-yellow-800 mb-2">📝 Tutorial Checkpoint</h3>
                                <p className="text-yellow-700 text-sm mb-3">
                                    Before you start, prove you understand the rules:
                                </p>
                                <div className="bg-white p-3 rounded border">
                                    <Checkbox 
                                        label="Accept Cookies" 
                                        checked={initialFailCheck} 
                                        setChecked={setInitialFailCheck}
                                    />
                                </div>
                                <p className={`text-red-600 text-sm mt-2 ${isNinePlusTenTwentyOne ? "block" : "hidden"}`}>
                                    ⚠️ Uncheck the box to proceed! This is the whole point of the game.
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-4">
                                <button 
                                    onClick={Play} 
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    🚀 Start Playing
                                </button>
                                
                                <button 
                                    onClick={() => setShowLeaderboard(true)}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-medium transition-all flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faTrophy} className="mr-2 text-yellow-500" />
                                    View Leaderboard
                                </button>
                            </div>

                            {/* Creator credit */}
                            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                                <p className="text-gray-600 text-sm">
                                    Created by{' '}
                                    <a 
                                        href="https://github.com/CADawg" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                    >
                                        CADawg
                                    </a>
                                    {' '}• View source on{' '}
                                    <a 
                                        href="https://github.com/CADawg/cookie-banner-clicker" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                    >
                                        GitHub
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Disclaimer footer */}
                        <div className="bg-gray-50 px-6 sm:px-8 py-4 rounded-b-2xl border-t border-gray-200">
                            <div className="text-xs text-gray-500 space-y-2">
                                <div className="flex items-start">
                                    <span className="text-green-500 mr-2 mt-0.5">🔒</span>
                                    <p>
                                        <strong>Privacy Notice:</strong> This website does NOT use any real dark patterns, 
                                        tracking cookies, or data collection. All "dark patterns" shown in the game are 
                                        educational parodies to teach users about privacy manipulation tactics.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-blue-500 mr-2 mt-0.5">📚</span>
                                    <p>
                                        The toast notifications, exit-intent popups, and fake email forms are purely 
                                        comedic and educational - no real data is collected or stored.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-orange-500 mr-2 mt-0.5">📊</span>
                                    <p>
                                        <strong>Analytics:</strong> This site uses{' '}
                                        <a 
                                            href="https://plausible.io" 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Plausible Analytics
                                        </a>
                                        , a privacy-focused, cookieless analytics service that doesn't track users 
                                        or collect personal data - just basic page views and referrers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        )
        : <><GameLevel level={gameLevel} setLevel={setGameLevel} setFailed={setFailed} />
                {/* Exit-intent email signup modal */}
                <ExitIntentModal
                    isOpen={showExitModal}
                    onClose={closeExitModal}
                />
            </>}


        <div className="min-h-[calc(100vh-3rem)] bg-cover bg-no-repeat bg-center py-4 px-4 relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="w-full max-w-md mx-auto">
                <RegionBlockedLeaderboard playerId={playerId} />
            </div>

            <div className={`bg-white p-4 rounded-lg w-full max-w-md mx-auto mt-4 ${failed ? "block" : "hidden"}`}>
                {gameLevel > LEVEL_CONFIGS.length ? 
                    <div>
                        <p className="mb-3 text-lg font-bold text-green-600">🎉 LEGENDARY ACHIEVEMENT!</p>
                        <p className="mb-2">You beat all {LEVEL_CONFIGS.length} levels of cookie banner chaos!</p>
                        <p className="mb-3 text-sm">You've conquered every dark pattern known to the internet. You're officially a Cookie Banner Legend! 🏆</p>
                        <div className="text-center p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg mb-3">
                            <div className="text-2xl font-bold text-yellow-700">Final Score: {gameScore}</div>
                            <div className="text-sm text-yellow-600">Time spent: {Math.round(gameCompletionTime / 1000)}s</div>
                        </div>
                    </div> : 
                    <div>
                        <p className="mb-2 text-lg font-bold">Level {gameLevel - 1} Complete!</p>
                        <p className="mb-2">You beat {gameLevel - 1} levels! {gameLevel > 10 ? "Incredible!" : gameLevel > 5 ? "Amazing!" : "Great job!"}</p>
                        <div className="text-center p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg mb-3">
                            <div className="text-xl font-bold text-blue-700">Score: {gameScore}</div>
                            <div className="text-sm text-blue-600">Time: {Math.round(gameCompletionTime / 1000)}s</div>
                            <button onClick={e => {setInitialFailCheck(false); Play(e);}} className={"bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"}>Try Again</button>
                        </div>
                    </div>
                }
                <p className="mb-2 text-sm text-gray-600">Want more levels? This game is now easily extensible! Check out the GitHub to see how levels are configured and add your own.</p>
                <a href={"https://github.com/CADawg/cookie-banner-clicker"} target={"_blank"} rel="noreferrer" 
                   className="text-blue-600 hover:underline text-sm block">Visit this project on GitHub to view the code and contribute!</a>
            </div>
        </div>

        <NameRegistrationModal
            isOpen={showNameModal}
            score={gameScore}
            levelsCompleted={gameLevel - 1}
            onSubmit={handleNameSubmit}
            onCancel={() => setShowNameModal(false)}
        />
        
        {/* Toast notifications - hidden on mobile for space */}
        {!isMobile && (
            <ToastNotification 
                toasts={toasts} 
                onDismiss={dismissToast} 
            />
        )}
    </div>
  );
}

export default App;
