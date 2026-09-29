import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 bg-cream min-h-screen">
      {/* HEADER BANNER */}
      <div className="bg-white border-b border-border py-10 px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-brand-maroon" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded border border-maroon-100">
              COOKIE & STORAGE TRANSPARENCY
            </span>
          </div>
          <h1 className="text-3xl font-serif font-black text-brand-dark">Cookie & Local Storage Policy</h1>
          <p className="text-xs text-muted-text leading-relaxed">
            Effective Date: September 29, 2026
          </p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="max-w-4xl mx-auto px-6 space-y-6 text-xs text-charcoal leading-relaxed">
        <div className="bg-white p-6 rounded-2xl border border-border space-y-3 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <ShieldCheck className="w-4 h-4 text-brand-maroon" /> Essential Technical Cookies Only
          </h2>
          <p>
            Tribal Scholar AI uses only essential session authentication tokens and local browser storage required for platform functionality.
          </p>
          <div className="space-y-2 pt-2">
            <div className="p-3 bg-ivory rounded-xl border border-border space-y-1">
              <strong className="font-bold text-brand-dark block">Authentication Token (`token`)</strong>
              <p className="text-muted-text">Stored in LocalStorage to maintain secure user sessions after login.</p>
            </div>
            <div className="p-3 bg-ivory rounded-xl border border-border space-y-1">
              <strong className="font-bold text-brand-dark block">Language Preference (`language`)</strong>
              <p className="text-muted-text">Stored in LocalStorage to persist your selected language (English or Hindi).</p>
            </div>
          </div>
          <p className="text-muted-text pt-2">
            We do NOT use third-party advertising cookies, cross-site tracking beacons, or commercial data profiling scripts.
          </p>
        </div>
      </div>
    </div>
  );
};
