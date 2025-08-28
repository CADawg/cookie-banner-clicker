import { JSX } from 'preact';
import CookieBanner from './components/CookieBanner';
import { LEVEL_CONFIGS } from './data/GameData';

// define level props
interface ILevelProps {
    level: number;
    setLevel: (level: number) => void;
    setFailed: (failed: boolean) => void;
}

function GameLevel(props: ILevelProps): JSX.Element | null {
    const levelConfig = LEVEL_CONFIGS.find(config => config.id === props.level);
    
    if (!levelConfig) {
        // No more levels - game completed
        props.setFailed(true);
        return null;
    }

    const handleSuccess = () => {
        const nextLevel = props.level + 1;
        const nextLevelConfig = LEVEL_CONFIGS.find(config => config.id === nextLevel);
        
        if (nextLevelConfig) {
            props.setLevel(nextLevel);
        } else {
            // Completed all levels - set level to next number so gameLevel - 1 = 20
            props.setLevel(nextLevel);
            props.setFailed(true);
        }
    };

    const handleFailure = () => {
        props.setFailed(true);
    };

    return (
        <CookieBanner 
            levelConfig={levelConfig}
            onSuccess={handleSuccess}
            onFailure={handleFailure}
        />
    );
}


export default GameLevel;