import { useState, useEffect, useCallback } from 'react';
import { Brain, RefreshCw, Trophy, Clock } from 'lucide-react';
import { useGameTimer } from './hooks/useGameTimer';
import CardItem from './components/CardItem';
import { generateTarget, generateGrid } from './utils';

function App() {
    const [target, setTarget] = useState(generateTarget());
    const [cards, setCards] = useState(generateGrid(target));
    const [totalMoves, setTotalMoves] = useState(0);
    const { formattedElapsedTime, startTimer, stopTimer } = useGameTimer();
    const [gameStatus, setGameStatus] = useState<'IDLE' | 'IN_PROGRESS' | 'WON'>('IDLE');

    function startNewGame() {
        setGameStatus('IDLE');

        setTotalMoves(0);
        stopTimer(true);

        const newTarget = generateTarget();
        setTarget(newTarget);
        setCards(generateGrid(newTarget));
    }

    const flipCard = useCallback(
        (cardIndex: number) => {
            if (cards[cardIndex].flipped || cards[cardIndex].matched) {
                return;
            }

            const candidates = cards.filter((card) => card.flipped && !card.matched);
            if (candidates.length === 2) {
                return;
            }

            const newCards = [...cards];
            newCards[cardIndex] = { ...newCards[cardIndex], flipped: true };
            setCards(newCards);

            if (gameStatus === 'IDLE') {
                setGameStatus('IN_PROGRESS');
                startTimer();
            }

            candidates.push(newCards[cardIndex]);
            if (candidates.length === 2) {
                setTotalMoves((totalMoves) => totalMoves + 1);

                if (candidates[0].num + candidates[1].num === target) {
                    setCards(
                        newCards.map((card) => {
                            if (card.flipped && !card.matched) {
                                return { ...card, matched: true };
                            }
                            return card;
                        }),
                    );
                } else {
                    setTimeout(() => {
                        setCards(
                            newCards.map((card) => {
                                return { ...card, flipped: false };
                            }),
                        );
                    }, 1000);
                }
            }
        },
        [cards, gameStatus, startTimer, target, setCards, setTotalMoves],
    );

    useEffect(() => {
        if (cards.every((card) => card.matched)) {
            console.log('You won!');
            stopTimer();
        }
    }, [cards, stopTimer]);

    return (
        <div className="h-[100dvh] max-w-screen-sm mx-auto p-8 flex flex-col">
            <div className="text-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">Number Pairs</h1>
                </div>
                <p className="sm:text-lg text-white/90 flex flex-col sm:flex-row sm:gap-2 sm:justify-center sm:items-baseline">
                    Find all pairs of numbers that add up to{' '}
                    <span className="font-bold text-white text-2xl">{target}</span>
                </p>
            </div>
            <div className="w-full sm:bg-white/10 sm:backdrop-blur-md sm:rounded-2xl sm:p-8 sm:shadow-xl">
                <div className="flex justify-between items-center mb-4 p-6 rounded-lg bg-white/10 text-white">
                    <div className="sm:text-2xl flex items-center gap-2">
                        <Trophy />
                        Moves: <span className="text-white font-bold min-w-[40px] inline-block">{totalMoves}</span>
                    </div>
                    <div className="sm:text-2xl flex items-center gap-2">
                        <Clock />
                        Time:{' '}
                        <span className="text-white font-bold min-w-[60px] sm:min-w-[86px] inline-block">
                            {formattedElapsedTime}
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
                    {cards.map((card, index) => (
                        <CardItem key={`card-${index}`} card={card} index={index} onClick={flipCard} />
                    ))}
                </div>
                <button
                    onClick={startNewGame}
                    className="w-full px-4 py-2 rounded-lg text-lg font-bold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 bg-white/20 text-white"
                >
                    <RefreshCw className="w-6 h-6 mr-2 inline" />
                    New Game
                </button>
            </div>
        </div>
    );
}

export default App;
