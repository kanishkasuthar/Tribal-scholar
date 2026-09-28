import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { LogOut, LayoutDashboard, Sparkles, HelpCircle, Shield, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [highContrast, setHighContrast] = useState(false);

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-border">
      {/* 1. TOP GOVERNMENT BAR (Deep Maroon Background, White/Cream Text) */}
      <div className="bg-[#5B1720] text-[#FFFDF8] text-[11px] py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-maroon-700">
        <div className="flex items-center gap-2.5 font-medium tracking-wide">
          <span className="text-sm">🇮🇳</span>
          <span className="font-bold text-[#FFFDF8]">{t('govIndia')}</span>
          <span className="text-gold">•</span>
          <span className="text-[#FFFDF8] font-semibold">{t('motaName')}</span>
        </div>

        <div className="flex items-center gap-4 text-[#FFFDF8] text-[11px]">
          <Link to="/help" className="text-[#FFFDF8] hover:text-gold transition-colors flex items-center gap-1 font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-gold" /> {t('helpDesk')}
          </Link>

          <button
            onClick={toggleContrast}
            className="text-[#FFFDF8] hover:text-gold transition-colors flex items-center gap-1 font-semibold"
          >
            <Shield className="w-3.5 h-3.5 text-gold" /> {highContrast ? 'Normal' : t('accessibility')}
          </button>

          {/* Clean compact government-portal style selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-gold" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-[#471118] text-[#FFFDF8] text-[11px] border border-gold/40 rounded px-2 py-0.5 font-bold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer"
              aria-label={t('selectLanguage')}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION (Warm White / Pure White Base, Compact Height) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Subtitle */}
        <Logo size="sm" />

        {/* Center: Main Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-charcoal">
          <Link
            to="/"
            className={`py-1 transition-colors hover:text-brand-maroon ${
              isActive('/') ? 'text-brand-maroon font-extrabold' : ''
            }`}
          >
            {t('home')}
          </Link>
          <Link
            to="/scholarships"
            className={`py-1 transition-colors hover:text-brand-maroon ${
              isActive('/scholarships') ? 'text-brand-maroon font-extrabold' : ''
            }`}
          >
            {t('scholarships')}
          </Link>
          <Link
            to="/fellowships"
            className={`py-1 transition-colors hover:text-brand-maroon ${
              isActive('/fellowships') ? 'text-brand-maroon font-extrabold' : ''
            }`}
          >
            {t('fellowships')}
          </Link>
          <Link
            to="/how-it-works"
            className={`py-1 transition-colors hover:text-brand-maroon ${
              isActive('/how-it-works') ? 'text-brand-maroon font-extrabold' : ''
            }`}
          >
            {t('trackJourney')}
          </Link>
          <Link
            to="/help"
            className={`py-1 transition-colors hover:text-brand-maroon flex items-center gap-1 ${
              isActive('/help') ? 'text-brand-maroon font-extrabold' : ''
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-terracotta" /> {t('resourcesHelp')}
          </Link>
          <Link
            to="/about"
            className={`py-1 transition-colors hover:text-brand-maroon ${
              isActive('/about') ? 'text-brand-maroon font-extrabold' : ''
            }`}
          >
            {t('aboutMoTA')}
          </Link>
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to={
                  user.role === 'STUDENT'
                    ? '/student/dashboard'
                    : user.role === 'INSTITUTE'
                    ? '/institute/dashboard'
                    : '/admin/dashboard'
                }
                className="bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-gold" /> {t('dashboard')}
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 text-charcoal hover:text-terracotta rounded border border-border hover:border-terracotta transition-colors"
                title={t('signOut')}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-xs font-bold text-brand-maroon hover:bg-maroon-50 px-3.5 py-1.5 rounded border border-brand-maroon transition-all"
              >
                {t('signIn')}
              </Link>
              <Link
                to="/register"
                className="bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold px-3.5 py-1.5 rounded shadow-2xs hover:shadow transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" /> {t('studentPortal')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Thin Gold/Terracotta Separator Underneath Header */}
      <div className="header-gold-stripe"></div>
    </header>
  );
};
