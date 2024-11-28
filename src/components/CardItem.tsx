import { memo } from 'react';
import { motion } from 'motion/react';
import { EyeOff } from 'lucide-react';
import { Card } from '../types/Card';

interface Props {
    card: Card;
    index: number;
    onClick: (index: number) => void;
}

export default memo(function CardItem({ card, index, onClick }: Props) {
    return (
        <motion.div
            className="shadow-lg aspect-square sm:text-7xl text-5xl font-bold"
            whileHover={{
                scale: card.flipped || card.matched ? 1 : 1.08,
                transition: { duration: 0.2 },
            }}
            whileTap={{
                scale: card.flipped || card.matched ? 1 : 0.9,
                transition: { duration: 0.2 },
            }}
            onClick={() => onClick(index)}
            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div className="absolute w-full h-full flex justify-center items-center backface-hidden bg-gradient-to-br from-white/90 to-white/70 text-indigo-600 rounded-lg cursor-pointer border-4 boder-white/50">
                <EyeOff className="w-8 h-8 " />
            </div>
            <div className="absolute w-full h-full flex justify-center items-center backface-hidden [transform:rotateY(180deg)] bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg border-4 border-white/20">
                {card.num}
            </div>
        </motion.div>
    );
});
