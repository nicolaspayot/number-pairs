import { useEffect, useRef, useState, useMemo } from 'react';

export function useGameTimer() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function startTimer() {
        timerRef.current = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);
    }

    function stopTimer(reset = false) {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (reset) {
            setElapsedTime(0);
        }
    }

    const formattedElapsedTime = useMemo(() => {
        return new Date(1000 * elapsedTime).toISOString().substring(14, 19);
    }, [elapsedTime]);

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, []);

    return { formattedElapsedTime, startTimer, stopTimer };
}
