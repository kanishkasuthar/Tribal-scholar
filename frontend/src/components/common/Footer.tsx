import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, HelpCircle, FileText, Lock, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#5B1720] text-[#F2E9DC] border-t border-maroon-700 pt-10 pb-6 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-maroon-700">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="sm" variant="light" />
            <p className="text-[#F2E9DC] text-xs leading-relaxed font-medium">
              AI-enabled scholarship assistance platform empowering Scheduled Tribe students across India.
            </p>
          </div>

          {/* Column 2: Core Schemes */}
          <div className="space-y-2">
            <h4 className="font-serif font-extrabold text-[#FFFDF8] text-sm tracking-wide">{t('scholarships')}</h4>
            <ul className="space-y-1.5 text-[#FFFDF8] text-xs font-medium">
              <li><Link to="/scholarships" className="text-[#FFFDF8] hover:text-gold transition-colors">{t('school')}</Link></li>
              <li><Link to="/scholarships" className="text-[#FFFDF8] hover:text-gold transition-colors">{t('undergraduate')}</Link></li>
              <li><Link to="/scholarships" className="text-[#FFFDF8] hover:text-gold transition-colors">{t('postgraduate')}</Link></li>
              <li><Link to="/fellowships" className="text-[#FFFDF8] hover:text-gold transition-colors">{t('research')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance */}
          <div className="space-y-2">
            <h4 className="font-serif font-extrabold text-[#FFFDF8] text-sm tracking-wide">Legal & Transparency</h4>
            <ul className="space-y-1.5 text-[#FFFDF8] text-xs font-medium">
              <li><Link to="/privacy-policy" className="text-[#FFFDF8] hover:text-gold transition-colors flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-gold" /> Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[#FFFDF8] hover:text-gold transition-colors flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-gold" /> Terms & Conditions</Link></li>
              <li><Link to="/cookie-policy" className="text-[#FFFDF8] hover:text-gold transition-colors flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-gold" /> Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Help & Portals */}
          <div className="space-y-2">
            <h4 className="font-serif font-extrabold text-[#FFFDF8] text-sm tracking-wide">{t('resourcesHelp')}</h4>
            <ul className="space-y-1.5 text-[#FFFDF8] text-xs font-medium">
              <li><Link to="/help" className="text-[#FFFDF8] hover:text-gold transition-colors flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-gold" /> {t('helpDesk')}</Link></li>
              <li><Link to="/about" className="text-[#FFFDF8] hover:text-gold transition-colors">{t('aboutMoTA')}</Link></li>
              <li><Link to="/login" className="text-[#FFFDF8] hover:text-gold transition-colors">{t('institutePortalTitle')}</Link></li>
              <li><Link to="/login" className="text-[#FFFDF8] hover:text-gold transition-colors">{t('adminPortalTitle')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#E8DED2] font-semibold gap-3">
          <p className="text-[#E8DED2]">© 2026 Tribal Scholar AI Initiative. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#D8CFC4]">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-gold" /> Accessibility Compliant</span>
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-gold" /> Protected REST Streaming</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-gold" /> Verified MoTA Schemes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
