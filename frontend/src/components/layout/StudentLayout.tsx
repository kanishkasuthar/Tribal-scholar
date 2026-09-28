import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { Logo } from '../common/Logo';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';
import { AccessibilityControlPanel } from '../common/AccessibilityControlPanel';
import {
  LayoutDashboard,
  User,
  Sparkles,
  FileCheck2,
  AlertCircle,
  Activity,
  RotateCw,
  Award,
  Compass,
  HelpCircle,
  LogOut,
  ShieldCheck,
  BookOpen,
  Globe
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: t('dashboard'), path: '/student/dashboard', icon: LayoutDashboard },
        { label: t('myProfile'), path: '/student/profile', icon: User },
      ],
    },
    {
      title: 'OPPORTUNITIES',
      items: [
        { label: t('matchedSchemes'), path: '/student/opportunities', icon: Sparkles },
        { label: t('fellowships'), path: '/student/fellowships', icon: Award },
      ],
    },
    {
      title: 'APPLICATION',
      items: [
        { label: t('myFunding'), path: '/student/funding', icon: BookOpen, badge: 'Active' },
        { label: t('documentCenter'), path: '/student/documents', icon: FileCheck2 },
        { label: t('deficiencyCopilot'), path: '/student/deficiency-copilot', icon: AlertCircle, badge: 'Fix Now', highlight: true },
        { label: t('applicationTwin'), path: '/student/applications', icon: Activity },
      ],
    },
    {
      title: 'PLANNING',
      items: [
        { label: t('renewalCenter'), path: '/student/renewals', icon: RotateCw },
        { label: t('progressTracker'), path: '/student/progress', icon: Activity },
        { label: t('academicRoadmap'), path: '/student/roadmap', icon: Compass },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { label: t('grievances'), path: '/student/grievances', icon: HelpCircle },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* 1. TOP GOVERNMENT BAR */}
      <div className="bg-[#5B1720] text-[#FFFDF8] text-[11px] py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-maroon-700">
        <div className="flex items-center gap-2.5 font-medium tracking-wide">
          <span className="text-sm">🇮🇳</span>
          <span className="font-bold text-[#FFFDF8]">{t('govIndia')}</span>
          <span className="text-gold">•</span>
          <span className="text-[#FFFDF8] font-semibold">{t('motaName')}</span>
        </div>
        <div className="flex items-center gap-4 text-[#FFFDF8]">
          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-gold" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-[#471118] text-[#FFFDF8] text-[11px] border border-gold/40 rounded px-2 py-0.5 font-bold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-gold bg-[#471118] px-2.5 py-0.5 rounded border border-gold/40">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" /> {t('studentPortal')}
          </span>
          <AccessibilityControlPanel />
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <header className="bg-white border-b border-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="w-8 h-8 rounded-full bg-brand-maroon text-white font-extrabold text-xs flex items-center justify-center border border-gold shadow-2xs">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-extrabold text-brand-dark leading-tight">{user?.name}</p>
                <p className="text-[10px] text-brand-maroon font-bold">{t('studentPortal')}</p>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 text-charcoal hover:text-terracotta rounded-lg hover:bg-ivory border border-border transition-colors"
                title={t('signOut')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="header-gold-stripe"></div>
      </header>

      {/* Main App Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-4">
          <div className="bg-white rounded-xl shadow-2xs border border-border p-3 space-y-3 sticky top-24">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <div className="px-3 text-[9px] font-extrabold uppercase tracking-widest text-[#6B6259] pt-1">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                        isActive
                          ? 'bg-maroon-50 text-[#7A1F2B] border-l-4 border-[#7A1F2B] font-extrabold'
                          : item.highlight
                          ? 'bg-terracotta/10 text-terracotta hover:bg-terracotta/20 border border-terracotta/30'
                          : 'text-charcoal hover:bg-ivory'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7A1F2B]' : 'text-brand-maroon'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-[#7A1F2B] text-white'
                              : item.highlight
                              ? 'bg-terracotta text-white'
                              : 'bg-ivory text-charcoal border border-border'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <AIAssistantDrawer />
    </div>
  );
};
