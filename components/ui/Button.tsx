import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};
