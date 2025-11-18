
import React from 'react';
import { InfoIcon, MoonIcon, SunIcon } from './icons';

interface HeaderProps {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    onOpenInfo: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onOpenInfo }) => {
    return (
        <header className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-wider">
                EmotionSense AI
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
                 <button onClick={onOpenInfo} className="p-2 rounded-full text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                    <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                    {theme === 'dark' ? <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
            </div>
        </header>
    );
};

export default Header;