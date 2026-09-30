import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Logo } from '../../components/common/Logo';
import { User, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2, KeyRound, RefreshCw } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { sendOtp, verifyOtp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Form step: 1 = Enter Details, 2 = Enter OTP, 3 = Verified
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Status & Timers
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Helper to mask email address (e.g. k********@gmail.com)
  const maskEmail = (str: string) => {
    if (!str || !str.includes('@')) return str;
    const [namePart, domainPart] = str.split('@');
    if (namePart.length <= 2) {
      return `${namePart[0]}*@${domainPart}`;
    }
    const masked = namePart[0] + '*'.repeat(Math.max(3, namePart.length - 2)) + namePart[namePart.length - 1];
    return `${masked}@${domainPart}`;
  };

  // Step 1: Submit Details & Request Email OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await sendOtp(email, password, name);
      setSuccessMsg(res.message || `We've sent a 6-digit verification code to ${maskEmail(email)}`);
      if (res?.demoOtp || res?.devOtp) {
        setDemoOtp(res.demoOtp || res.devOtp || null);
      } else {
        setDemoOtp(null);
      }
      setStep(2);
      setCooldown(60); // 60s resend cooldown
    } catch (err: any) {
      setError(err.message || "We couldn't send the verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-Digit OTP & Create Account
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await verifyOtp(email, otp);
      setStep(3);
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Incorrect OTP code. Please check your inbox and try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[85vh] bg-cream flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-border shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* LEFT COLUMN: BRANDING & STEP COUNTER */}
        <div className="md:col-span-5 bg-[#5B1720] text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <Logo size="md" variant="light" />
            <div className="inline-flex items-center gap-1.5 text-gold text-xs font-extrabold bg-[#471118] px-3 py-1 rounded-full border border-gold/40">
              <ShieldCheck className="w-3.5 h-3.5" /> ST Scholar Verification
            </div>
            {demoOtp && (
              <div className="text-[10px] uppercase tracking-widest font-extrabold bg-gold/20 text-gold px-2.5 py-1 rounded border border-gold/30 block w-fit">
                SIH SEMIFINAL DEMO
              </div>
            )}
          </div>

          <div className="relative z-10 space-y-4 pt-8">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-gold uppercase tracking-widest block">
                STEP {step} OF 3
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#FFFDF8] leading-tight">
                {step === 1 && 'Enter Registration Details'}
                {step === 2 && 'Email OTP Verification'}
                {step === 3 && 'Email Verified ✓'}
              </h2>
            </div>

            {/* Stepper Visual Pills */}
            <div className="space-y-2 text-xs font-bold text-[#F2E9DC]">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-gold font-extrabold' : 'opacity-60'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-gold text-brand-dark' : 'bg-maroon-800'}`}>1</div>
                <span>Enter Legal Credentials</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-gold font-extrabold' : 'opacity-60'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-gold text-brand-dark' : 'bg-maroon-800'}`}>2</div>
                <span>6-Digit Email OTP</span>
              </div>
              <div className={`flex items-center gap-2 ${step === 3 ? 'text-gold font-extrabold' : 'opacity-60'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-gold text-brand-dark' : 'bg-maroon-800'}`}>3</div>
                <span>Account Activated</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-[#D8CFC4] pt-6 border-t border-maroon-700">
            Already registered? <Link to="/login" className="text-gold font-bold underline">{t('signIn')}</Link>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM & OTP VERIFIER */}
        <div className="md:col-span-7 p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon">
              {t('motaName')} • SECURE AUTHENTICATION
            </span>
            <h2 className="font-serif font-bold text-2xl text-brand-dark">
              {step === 1 && 'Scholar Account Registration'}
              {step === 2 && 'Enter 6-Digit Email OTP'}
              {step === 3 && 'Registration Complete!'}
            </h2>
          </div>

          {error && (
            <div className="p-3 bg-terracotta/10 text-terracotta border border-terracotta/20 rounded-xl text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-forest/10 text-forest border border-forest/20 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0" /> <span>{successMsg}</span>
            </div>
          )}

          {/* SIH SEMIFINAL DEMO OTP DISPLAY BOX */}
          {step === 2 && demoOtp && (
            <div className="p-4 bg-[#FCFAF5] border border-gold/40 rounded-2xl space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between font-bold text-brand-dark">
                <span className="flex items-center gap-1.5 font-extrabold text-brand-maroon">
                  🏛️ DEMO MODE
                </span>
                <span className="text-[10px] bg-gold/20 text-brand-dark px-2.5 py-0.5 rounded font-extrabold border border-gold/40 uppercase tracking-wider">
                  SIH SEMIFINAL DEMO
                </span>
              </div>
              <div className="bg-white border border-border rounded-xl p-3 space-y-1">
                <div className="text-[11px] text-muted-text font-semibold">Verification Code:</div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono font-black text-2xl tracking-widest text-brand-maroon">
                    {demoOtp}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp(demoOtp);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3.5 py-1.5 bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
                  >
                    {copied ? 'Filled ✓' : 'Use Code'}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-muted-text font-medium leading-relaxed">
                For semifinal demonstration only. In production, this code is sent by email.
              </p>
            </div>
          )}

          {/* STEP 1: ENTER DETAILS */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Full Legal Name (as in Aadhaar)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-text absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Munda"
                    className="w-full bg-ivory border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-brand-maroon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-text absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="scholar@domain.com"
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
                    placeholder="Create secure password (min 6 characters)"
                    className="w-full bg-ivory border border-border rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-charcoal focus:outline-none focus:border-brand-maroon"
                  />
                </div>
              </div>

              <p className="text-[11px] text-muted-text text-center font-medium">
                By creating an account, I agree to the <Link to="/terms" className="text-brand-maroon font-bold underline">Terms & Conditions</Link> and acknowledge the <Link to="/privacy-policy" className="text-brand-maroon font-bold underline">Privacy Policy</Link>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP Code...' : <>Send Verification OTP <ArrowRight className="w-4 h-4 text-gold" /></>}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-brand-dark">
                  We've sent a 6-digit verification code to <span className="text-brand-maroon font-extrabold">{maskEmail(email)}</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-muted-text absolute left-3 top-3.5" />
                  <input
                    type="text"
                    maxLength={6}

                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-ivory text-center font-mono font-black text-xl tracking-widest border border-border rounded-xl pl-9 pr-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-maroon"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : <>Verify Email & Create Account <CheckCircle2 className="w-4 h-4 text-gold" /></>}
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={() => handleSendOtp()}
                  className="w-full sm:w-auto px-4 py-3.5 bg-ivory hover:bg-cream text-brand-dark font-bold text-xs rounded-xl border border-border flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-maroon" />
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-xs text-muted-text hover:underline block font-semibold text-center w-full"
              >
                ← Back to Edit Email
              </button>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-forest/10 text-forest rounded-full flex items-center justify-center mx-auto border border-forest/30">
                <CheckCircle2 className="w-8 h-8 text-forest" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-extrabold text-xl text-brand-dark">EMAIL VERIFIED & ACCOUNT CREATED!</h3>
                <p className="text-xs text-muted-text">Logging you into your Scholar Portal Dashboard...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
