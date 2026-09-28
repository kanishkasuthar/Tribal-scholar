import React, { useState, useEffect } from 'react';
import { Globe, Eye, Type, Volume2 } from 'lucide-react';
import api from '../../services/api';

export const AccessibilityControlPanel: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const fetchPref = async () => {
      try {
        const res = await api.get('/user/preferences');
        if (res.data.success) {
          const pref = res.data.preferences;
          setLanguage(pref.preferredLanguage || 'en');
          setFontSize(pref.fontSize || 'normal');
          setHighContrast(pref.highContrast || false);
          applyAccessibilityDOM(pref.fontSize, pref.highContrast);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPref();
  }, []);

  const applyAccessibilityDOM = (size: string, contrast: boolean) => {
    const root = document.documentElement;

    // Apply font size
    root.classList.remove('font-size-large', 'font-size-xlarge');
    if (size === 'large') root.classList.add('font-size-large');
    if (size === 'extra-large') root.classList.add('font-size-xlarge');

    // Apply high contrast
    if (contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  const handleLanguageChange = async (newLang: string) => {
    setLanguage(newLang);
    try {
      await api.put('/user/preferences', { preferredLanguage: newLang });
      window.location.reload(); // Refresh UI labels
    } catch (e) {
      console.error(e);
    }
  };

  const handleFontSizeChange = async (newSize: string) => {
    setFontSize(newSize);
    applyAccessibilityDOM(newSize, highContrast);
    try {
      await api.put('/user/preferences', { fontSize: newSize });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleHighContrast = async () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    applyAccessibilityDOM(fontSize, newContrast);
    try {
      await api.put('/user/preferences', { highContrast: newContrast });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Language Selector Dropdown */}
      <div className="flex items-center gap-1 bg-ivory-100 p-1.5 rounded-xl border border-ivory-300">
        <Globe className="w-3.5 h-3.5 text-forest-700" />
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          aria-label="Select Preferred Language"
          className="bg-transparent font-bold text-forest-900 text-xs focus:outline-hidden"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="bn">বাংলা (Bengali)</option>
        </select>
      </div>

      {/* Font Size Selector */}
      <div className="hidden sm:flex items-center gap-1 bg-ivory-100 p-1.5 rounded-xl border border-ivory-300">
        <Type className="w-3.5 h-3.5 text-forest-700" />
        <select
          value={fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
          aria-label="Select Text Size"
          className="bg-transparent font-bold text-forest-900 text-xs focus:outline-hidden"
        >
          <option value="normal">Text: Normal</option>
          <option value="large">Text: Large</option>
          <option value="extra-large">Text: Extra Large</option>
        </select>
      </div>

      {/* High Contrast Toggle Button */}
      <button
        onClick={handleToggleHighContrast}
        className={`p-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 ${
          highContrast ? 'bg-black text-white border-gold-400' : 'bg-ivory-100 text-forest-900 border-ivory-300'
        }`}
        title="Toggle High Contrast Mode"
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden md:inline">{highContrast ? 'Contrast: High' : 'Contrast: Normal'}</span>
      </button>
    </div>
  );
};
