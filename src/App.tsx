import React from 'react';
import './App.scss';
import webp from './photos/cookie.webp';
import jpg from './photos/cookie.jpg';
import {faTrophy} from '@fortawesome/free-solid-svg-icons/faTrophy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function Checkbox(props: {label?: string, checked: boolean, setChecked: (checked: boolean) => void}) {
    function voidAction(e: React.SyntheticEvent): false {
        e.preventDefault();
        e.stopPropagation();

        return false;
    }

    let checkboxId = randomElementId();

    return (
        <form onSubmit={voidAction}>
            <div className="checkbox">
                <input type="checkbox" id={checkboxId} checked={props.checked} onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setChecked(e.target.checked)} />
                <label htmlFor={checkboxId}>{props.label ? props.label : ""}</label>
            </div>
        </form>
    );
}

function App() {
  const [leaderboard, setLeaderboard] = React.useState<IPlayer[]>([
      {name: "Player 1", identifier: "player1", score: 0},
        {name: "Player 2", identifier: "player2", score: 0},
        {name: "Player 3", identifier: "player3", score: 0},
        {name: "Player 4", identifier: "player4", score: 0},
        {name: "Player 5", identifier: "player5", score: 0},
        {name: "Player 6", identifier: "player6", score: 0},
        {name: "Player 7", identifier: "player7", score: 0},
        {name: "Player 8", identifier: "player8", score: 0},
        {name: "Player 9", identifier: "player9", score: 0},
        {name: "Player 10", identifier: "player9", score: 0},
  ]);

  function Play(e: React.SyntheticEvent) {
      e.preventDefault();
        e.stopPropagation();

      if (initialFailCheck) {
        setIsNinePlusTenTwentyOne(true);

        return;
      }

      setIsNinePlusTenTwentyOne(false);

      setGameLevel(1);
  }

  const [currentScore, setCurrentScore] = React.useState(0);

  const [initialFailCheck, setInitialFailCheck] = React.useState(true);

  const [isNinePlusTenTwentyOne, setIsNinePlusTenTwentyOne] = React.useState(false);

  const [gameLevel, setGameLevel] = React.useState(0);

  return (
    <div className="App">
        <nav>
          <div className={"nav-brand"}>Cookie Clicker</div>
        </nav>

        <div className={"olay-70"}>
            <div className={"olay-content"}>
                <h1>Cookie (Banner) Clicker</h1>
                <p>A really dumb idea by <a href={"https://github.com/Snaddyvitch-Dispenser"} rel="noreferrer" target={"_blank"}>Snaddyvitch-Dispenser</a></p>
                <p>Click through as many cookie banners as you can <strong>without</strong> accepting <strong>any</strong> cookies.</p>

                {/*checkbox*/}
                <Checkbox label={"Accept Cookies"} checked={initialFailCheck} setChecked={(checked: boolean) => {setInitialFailCheck(checked)}} />

                <button onClick={Play}>Let's Go!</button>
                <p className={"error"} style={{display: isNinePlusTenTwentyOne ? "block" : "none"}}>You have to uncheck the "Accept Cookies" box!</p>
            </div>
        </div>


        <div className={"container"}>
            <picture className={"background"}>
                <source srcSet={webp} type="image/webp" />
                <source srcSet={jpg} type="image/jpeg" />
                <img src={jpg} alt="cookie" />
            </picture>

            <div className={"leaderboard"}>
                <div className={"leaderboard-header"}>
                    <div className={"leaderboard-header-title"}>Leaderboard</div>
                </div>

                <div className={"leaderboard-body"}>
                    {leaderboard.map((player, index) => (
                        <div className={`leaderboard-body-player rank-${index + 1}`} key={index}>
                            <span className={"trophy"}>{index < 3 ? <FontAwesomeIcon icon={faTrophy} className="trophy-white" /> : null}</span>
                            <div className={"flex-player-info"}>
                                <span className={`leaderboard-body-player-rank rank-${index + 1}`}>{(index + 1) + GetNumberSuffix(index + 1)}</span>
                                <span className={"leaderboard-body-player-name"}>{player.name}</span>
                                <span className={"leaderboard-body-player-score"}>{player.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}

export default App;
