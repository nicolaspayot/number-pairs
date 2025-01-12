import { useState } from 'react';

const LOCAL_STORAGE_KEY = 'highestScore';

export function useHighScore() {
    const [highScore, setHighScore] = useState(() => {
        try {
            if (window.localStorage) {
                const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
                return saved ? parseInt(saved, 10) : 0;
            }
            return 0;
        } catch (_) {
            return 0;
        }
    });

    const updateHighScore = (newScore: number) => {
        const newHighScore = Math.max(highScore, newScore);
        setHighScore(newHighScore);
        try {
            if (window.localStorage) {
                localStorage.setItem(LOCAL_STORAGE_KEY, newHighScore.toString());
            }
        } catch (_) {
            // Ignore errors
        }
    };

    return { highScore, updateHighScore };
}
