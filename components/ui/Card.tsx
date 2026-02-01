import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => (
  <motion.div
    whileHover={hover ? { y: -4, scale: 1.01 } : {}}
    className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);
