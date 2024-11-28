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
        <div className="min-h-screen max-w-screen-sm mx-auto p-8">
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Brain className="w-10 h-10 text-white" />
                    <h1 className="text-5xl font-bold text-white">Number Pairs</h1>
                </div>
                <p className="text-lg text-white/90">
                    Find all pairs of numbers that add up to{' '}
                    <span className="font-bold text-white text-2xl">{target}</span>
                </p>
                {/* <p className="text-6xl text-white font-bold">{target}</p> */}
            </div>
            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl">
                <div className="flex justify-between items-center mb-4 p-6 rounded-lg bg-white/10 shadow-lg text-white">
                    <div className="sm:text-2xl flex items-center gap-2">
                        <Trophy />
                        Moves: <span className="text-white font-bold min-w-[40px] inline-block">{totalMoves}</span>
                    </div>
                    <div className="sm:text-2xl flex items-center gap-2">
                        <Clock />
                        Time:{' '}
                        <span className="text-white font-bold min-w-[86px] inline-block">{formattedElapsedTime}</span>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4">
                    {cards.map((card, index) => (
                        <CardItem key={`card-${index}`} card={card} index={index} onClick={flipCard} />
                    ))}
                </div>
                <button
                    onClick={startNewGame}
                    className="w-full px-4 py-2 rounded-lg text-lg font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 bg-indigo-600 text-white"
                >
                    <RefreshCw className="w-6 h-6 mr-2 inline" />
                    New Game
                </button>
            </div>
        </div>
    );
}

export default App;
