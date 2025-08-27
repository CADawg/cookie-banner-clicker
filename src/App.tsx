import { useState } from 'preact/hooks';
// @ts-ignore
import webp from './photos/cookie.webp';
// @ts-ignore
import jpg from './photos/cookie.jpg';
import {faTrophy} from '@fortawesome/free-solid-svg-icons/faTrophy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GameLevel from "./GameLevels";
import {JSX} from "preact";
import React from "preact/compat";

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
  const [leaderboard] = useState<IPlayer[]>([
      {name: "Doesn't work", identifier: "player1", score: 0},
        {name: "Too Lazy To Code it", identifier: "player2", score: 0},
        {name: "Sorry!", identifier: "player3", score: 0},
        {name: "Player 4", identifier: "player4", score: 0},
        {name: "Player 5", identifier: "player5", score: 0},
        {name: "Player 6", identifier: "player6", score: 0},
        {name: "Player 7", identifier: "player7", score: 0},
        {name: "Player 8", identifier: "player8", score: 0},
        {name: "Player 9", identifier: "player9", score: 0},
        {name: "Player 10", identifier: "player9", score: 0},
  ]);

  function Play(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
        e.stopPropagation();

      if (initialFailCheck) {
        setIsNinePlusTenTwentyOne(true);

        return;
      }

      setIsNinePlusTenTwentyOne(false);

      setGameLevel(1);
  }

  const [initialFailCheck, setInitialFailCheck] = useState(true);

  const [isNinePlusTenTwentyOne, setIsNinePlusTenTwentyOne] = useState(false);

  const [gameLevel, setGameLevel] = useState(0);

  const [failed, setFailed] = useState(false);

  // noinspection TypeScriptValidateTypes
    return (
    <div className="App min-h-screen">
        <nav className="bg-black text-white px-4 py-3 h-12">
          <div className="text-xl sm:text-2xl font-bold leading-6 select-none">Cookie Clicker</div>
        </nav>


        {failed ? null : gameLevel === 0 ? <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 sm:p-8 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">Cookie (Banner) Clicker</h1>
                <p className="mb-4 text-sm sm:text-base">A really dumb idea by <a href={"https://github.com/Snaddyvitch-Dispenser"} rel="noreferrer"
                                            target={"_blank"} className="text-blue-600 hover:underline">Snaddyvitch-Dispenser</a></p>
                <p className="mb-6 text-sm sm:text-base">Click through as many cookie banners as you
                    can <strong>without</strong> accepting <strong>any</strong> cookies.</p>

                <div className="mb-6">
                    <Checkbox label={"Accept Cookies"} checked={initialFailCheck} setChecked={(checked: boolean) => {
                        setInitialFailCheck(checked)
                    }}/>
                </div>

                <button onClick={Play} className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded text-lg font-medium w-full sm:w-auto">Let's Go!</button>
                <p className={`text-red-500 text-sm mt-4 ${isNinePlusTenTwentyOne ? "block" : "hidden"}`}>You have to uncheck
                    the "Accept Cookies" box!</p>
            </div>
        </div>
        : <GameLevel level={gameLevel} setLevel={setGameLevel} setFailed={setFailed} />}


        <div className="min-h-[calc(100vh-3rem)] bg-cover bg-no-repeat bg-center py-4 px-4 relative">
            <picture className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10">
                <source srcSet={webp} type="image/webp" />
                <source srcSet={jpg} type="image/jpeg" />
                <img src={jpg} alt="cookie" className="w-full h-full object-cover" />
            </picture>

            <div className="bg-white/80 w-full max-w-md mx-auto rounded-lg pointer-events-none select-none">
                <div className="bg-white text-center font-bold text-lg sm:text-xl rounded-t-lg p-3">
                    Leaderboard
                </div>

                <div className="rounded-b-lg">
                    {leaderboard.map((player, index) => {
                        const isTop3 = index < 3;
                        const trophyColors = ['text-yellow-500', 'text-gray-400', 'text-orange-600'];
                        const bgColors = ['bg-yellow-50', 'bg-gray-50', 'bg-orange-50'];
                        const textSizes = ['text-2xl sm:text-3xl', 'text-xl sm:text-2xl', 'text-lg sm:text-xl'];
                        
                        return (
                            <div className={`border-b border-black last:border-b-0 p-3 flex items-center ${
                                isTop3 ? bgColors[index] + ' ' + textSizes[index] : 'text-base'
                            }`} key={index}>
                                <span className="w-12 pr-3">
                                    {isTop3 ? <FontAwesomeIcon icon={faTrophy} className={trophyColors[index]} /> : null}
                                </span>
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="font-medium">{(index + 1) + GetNumberSuffix(index + 1)}</span>
                                    <span className="flex-1 px-2 text-left">{player.name}</span>
                                    <span>{player.score}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`bg-white p-4 rounded-lg w-full max-w-md mx-auto mt-4 ${failed ? "block" : "hidden"}`}>
                {gameLevel === 4 ? 
                    <p className="mb-2">You beat the whole game (well as much as I cared to finish)!</p> : 
                    <p className="mb-2">You beat {gameLevel - 1} levels of the game! Congratulations!</p>
                }
                <p className="mb-2 text-sm">If you want me to add more levels, let me know on the GitHub. If enough people want more, I'll make it!</p>
                <a href={"https://github.com/Snaddyvitch-Dispenser/cookie-banner-clicker"} target={"_blank"} rel="noreferrer" 
                   className="text-blue-600 hover:underline text-sm block">Visit this project on GitHub to view the code and contribute!</a>
            </div>
        </div>
    </div>
  );
}

export default App;
