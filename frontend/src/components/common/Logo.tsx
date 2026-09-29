import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC<{ variant?: 'light' | 'dark'; size?: 'sm' | 'md' | 'lg' }> = ({
  variant = 'dark',
  size = 'md',
}) => {
  const isDark = variant === 'dark';

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  return (
    <Link to="/" className="flex items-center gap-3 group focus:outline-none">
      <div className={`relative ${iconSizes[size]} rounded-lg bg-brand-maroon flex items-center justify-center text-white shadow-xs border border-brand-dark group-hover:scale-105 transition-transform duration-200`}>
        {/* National Emblem & Cap SVG */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4/5 h-4/5">
          <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#C49A44" strokeWidth="3" opacity="0.6" />
          <path d="M50 24L82 40L50 56L18 40L50 24Z" fill="#ffffff" />
          <path d="M30 46.5V64C30 64 40 72 50 72C60 72 70 64 70 64V46.5" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 35C50 35 62 48 62 60C62 66.6274 56.6274 72 50 72C43.3726 72 38 66.6274 38 60C38 48 50 35 50 35Z" fill="#C49A44" opacity="0.9" />
          <path d="M50 45V68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-serif font-extrabold tracking-tight ${textSizes[size]} ${isDark ? 'text-charcoal' : 'text-[#FFFDF8]'}`}>
          Tribal Scholar <span className={isDark ? 'text-terracotta' : 'text-gold'}>AI</span>
        </span>
        <span className={`text-[10px] uppercase tracking-widest font-semibold ${isDark ? 'text-muted-text' : 'text-[#D8CFC4]'}`}>
          SIH 2026 PROTOTYPE • SCHOLARSHIP COPILOT
        </span>
      </div>
    </Link>
  );
};
