import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../../components/common/Logo';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@mota.gov.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'STUDENT' | 'INSTITUTE' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoSwitch = (selectedRole: 'STUDENT' | 'INSTITUTE' | 'ADMIN') => {
    setRole(selectedRole);
    if (selectedRole === 'STUDENT') {
      setEmail('student@mota.gov.in');
    } else if (selectedRole === 'INSTITUTE') {
      setEmail('institute@mota.gov.in');
    } else {
      setEmail('admin@mota.gov.in');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedInUser = await login(email, password, role);
      const userRole = loggedInUser?.role || role;
      if (userRole === 'STUDENT') navigate('/student/dashboard');
      else if (userRole === 'INSTITUTE') navigate('/institute/dashboard');
      else if (userRole === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-cream flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-border shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* LEFT COLUMN */}
        <div className="md:col-span-5 bg-[#5B1720] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <Logo size="md" variant="light" />
            <div className="inline-flex items-center gap-1.5 text-gold text-xs font-extrabold bg-[#471118] px-3 py-1 rounded-full border border-gold/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Scholar Portal
            </div>
          </div>

          <div className="relative z-10 space-y-3 pt-12">
            <h2 className="font-serif font-bold text-2xl text-[#FFFDF8] leading-tight">
              Single-Sign-On Portal
            </h2>
            <p className="text-xs text-[#F2E9DC] leading-relaxed font-normal">
              Secure authentication for Scheduled Tribe scholars, recognized educational institutions, and Ministry of Tribal Affairs officials.
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-[#D8CFC4] pt-6 border-t border-maroon-700 flex items-center justify-between">
            <span>Encrypted 256-Bit SSL</span>
            <span>Aadhaar Verified</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon">
              {t('motaName')}
            </span>
            <h2 className="font-serif font-bold text-2xl text-brand-dark">{t('signIn')}</h2>
            <p className="text-xs text-muted-text">Select your portal role and enter your registered credentials.</p>
          </div>

          {/* DEMO ROLE SWITCHER */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-text block">
              Quick Demo Account Switcher
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSwitch('STUDENT')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  role === 'STUDENT'
                    ? 'bg-brand-maroon text-white border-brand-maroon shadow-2xs'
                    : 'bg-ivory text-charcoal border-border hover:bg-cream'
                }`}
              >
                🎓 {t('studentPortal')}
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('INSTITUTE')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  role === 'INSTITUTE'
                    ? 'bg-brand-maroon text-white border-brand-maroon shadow-2xs'
                    : 'bg-ivory text-charcoal border-border hover:bg-cream'
                }`}
              >
                🏫 Institute
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('ADMIN')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  role === 'ADMIN'
                    ? 'bg-brand-maroon text-white border-brand-maroon shadow-2xs'
                    : 'bg-ivory text-charcoal border-border hover:bg-cream'
                }`}
              >
                🏛️ Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-terracotta/10 text-terracotta border border-terracotta/20 rounded-xl text-xs font-bold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Portal Email ID / Aadhaar</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-text absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-ivory border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-brand-maroon"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-text absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-ivory border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-brand-maroon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  {t('signIn')} → {role} <ArrowRight className="w-4 h-4 text-gold" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 text-center text-xs text-muted-text border-t border-border">
            New Scholar?{' '}
            <Link to="/register" className="text-brand-maroon font-extrabold hover:underline">
              Create Account / Register →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
