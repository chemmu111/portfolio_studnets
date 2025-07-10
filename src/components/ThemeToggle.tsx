import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-full bg-white dark:bg-gray-800/50 border border-purple-200 dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-500/60 transition-all duration-300 backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="relative w-6 h-6"
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ 
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="w-6 h-6 text-purple-400 dark:text-purple-400" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ 
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.5 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;