import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Award,
  MapPin,
  AlertTriangle,
  FileSpreadsheet,
  ShieldCheck,
  History,
  LogOut,
  Globe
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Ministry Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Scheme Manager', path: '/admin/scholarships', icon: Award },
    { label: 'State/District Heatmap', path: '/admin/districts', icon: MapPin },
    { label: 'AI Process Intelligence', path: '/admin/ai-insights', icon: AlertTriangle, badge: '3 Alerts' },
    { label: 'DBT Fund Disbursement', path: '/admin/disbursement', icon: Award },
    { label: 'Grievances Redressal', path: '/admin/grievances', icon: FileSpreadsheet },
    { label: 'System Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top Government Bar */}
      <div className="bg-[#5B1720] text-[#FFFDF8] text-[11px] py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-maroon-700">
        <div className="flex items-center gap-2.5 font-medium tracking-wide">
          <span className="text-sm">🇮🇳</span>
          <span className="font-bold text-[#FFFDF8]">{t('govIndia')}</span>
          <span className="text-gold">•</span>
          <span className="text-[#FFFDF8] font-semibold">{t('motaName')}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#FFFDF8]">
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
          <span className="flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Joint Secretary Desk • MoTA
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <header className="bg-white border-b border-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="hidden sm:block text-right text-xs">
                <p className="font-extrabold text-brand-dark leading-tight">{user?.name}</p>
                <p className="text-[10px] text-brand-maroon font-bold">{t('adminPortalTitle')}</p>
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

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl shadow-2xs border border-border p-3 space-y-1 sticky top-24">
            <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-maroon border-b border-border mb-2">
              {t('adminPortalTitle')}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive ? 'bg-brand-maroon text-white shadow-2xs' : 'text-charcoal hover:bg-ivory'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-brand-maroon'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-terracotta text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
