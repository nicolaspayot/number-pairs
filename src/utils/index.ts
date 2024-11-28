import { Card } from '../types/Card';

const GRID_SIZE = 4;
const TOTAL_PAIR_COUNT = (GRID_SIZE * GRID_SIZE) / 2;

function generateTarget() {
    // Random number between 10 and 20
    return Math.floor(Math.random() * 11 + 10);
}

function generateGrid(target: number): Card[] {
    const pairs = generatePairs(target);
    const grid = pairs.flatMap((pair) => [pair[0], pair[1]]);
    shuffleArray(grid);
    return grid.map((num) => ({ num, flipped: false, matched: false }));
}

function generatePairs(target: number) {
    const pairs: [number, number][] = [];
    // Array filled with numbers from 1 to target - 1
    const numbers = Array.from({ length: target - 1 }, (_, i) => i + 1);

    shuffleArray(numbers);

    for (let i = 0; i < TOTAL_PAIR_COUNT; i++) {
        const num1 = numbers.pop()!;
        const num2 = target - num1;
        pairs.push([num1, num2]);
    }

    return pairs;
}

function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export { generateTarget, generateGrid };
