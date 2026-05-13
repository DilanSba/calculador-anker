import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
      <div className="flex items-center gap-3 md:gap-5">
        {/* Logo Windmar — protagonista */}
        <img
          src="https://i.postimg.cc/44pJ0vXw/logo.png"
          className="h-16 md:h-24 lg:h-28 w-auto transform hover:scale-105 transition-transform drop-shadow-sm"
          alt="Windmar Home"
          referrerPolicy="no-referrer"
        />

        {/* Divider */}
        <div className="h-12 md:h-16 w-px bg-slate-300 dark:bg-white/10 hidden md:block" />

        {/* Logo Anker — secundario */}
        <img
          src="https://cdn.freelogovectors.net/wp-content/uploads/2018/06/anker-logo.png"
          className="h-7 md:h-9 w-auto transform hover:scale-105 transition-transform"
          alt="Anker"
          referrerPolicy="no-referrer"
        />

        <div className="hidden sm:block ml-2">
          <h1 className="text-lg md:text-2xl font-black text-windmar-blue-dark dark:text-[#e8eaed] tracking-tight uppercase leading-none">
            Cotizador Anker PRO
          </h1>
          <p className="text-anker-blue dark:text-[#a0a4ad] text-xs md:text-sm font-medium mt-0.5">
            Power Stations · Solar Panels · Backup Energy
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1d25] p-1 pr-3 rounded-full border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <motion.button
          onClick={() => setIsDarkMode(!isDarkMode)}
          animate={{ rotate: isDarkMode ? 360 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`p-1.5 rounded-full transition-colors duration-500 ${
            isDarkMode
              ? 'bg-windmar-gold text-windmar-blue-dark shadow-[0_0_10px_rgba(248,155,36,0.3)]'
              : 'bg-anker-blue text-white shadow-[0_0_10px_rgba(0,174,239,0.3)]'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </motion.button>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[8px] font-black text-slate-400 dark:text-[#6b7280] uppercase tracking-tighter">
            Tema
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-windmar-gold' : 'text-anker-blue'}`}>
            {isDarkMode ? 'Oscuro' : 'Claro'}
          </span>
        </div>
      </div>
    </header>
  );
};
