import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    value: number;
    max?: number;
    color?: 'indigo' | 'green' | 'red' | 'amber';
    height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, color = 'indigo', height = 'h-2' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const colors = {
        indigo: 'from-indigo-500 to-purple-500',
        green: 'from-green-500 to-emerald-500',
        red: 'from-red-500 to-rose-500',
        amber: 'from-amber-500 to-orange-500',
    };

    return (
        <div className={`${height} bg-gray-100 rounded-full overflow-hidden`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
            />
        </div>
    );
};
