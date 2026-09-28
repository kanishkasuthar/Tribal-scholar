import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, Sparkles, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export const AdminAIInsights: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 bg-cream min-h-screen">
      {/* 1. HEADER BANNER */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-maroon" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded border border-maroon-100">
            MINISTRY PROCESS INTELLIGENCE ENGINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark">
          SCHOLARSHIP PROCESS INTELLIGENCE
        </h1>
        <p className="text-xs text-muted-text max-w-2xl leading-relaxed">
          National bottleneck detection engine identifying verification lags, recurring document mismatches, and district resolution efficiency.
        </p>
      </div>

      {/* 2. PROCESS HEALTH STRIP (5 COMPACT BLOCKS) */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-2xs space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon block">
          PROCESS HEALTH & SYSTEMIC METRICS
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-ivory p-4 rounded-lg border border-border space-y-1">
            <span className="text-[10px] font-bold text-muted-text uppercase block">Total Queue</span>
            <strong className="font-serif font-extrabold text-2xl text-brand-maroon block">128 Apps</strong>
            <span className="text-[10px] text-forest font-bold">Active in Queue</span>
          </div>

          <div className="bg-ivory p-4 rounded-lg border border-border space-y-1">
            <span className="text-[10px] font-bold text-muted-text uppercase block">Avg Processing</span>
            <strong className="font-serif font-extrabold text-2xl text-brand-dark block">4.8 Days</strong>
            <span className="text-[10px] text-forest font-bold font-mono">1.2 Days Faster</span>
          </div>

          <div className="bg-terracotta/10 p-4 rounded-lg border border-terracotta/30 space-y-1">
            <span className="text-[10px] font-bold text-terracotta uppercase block">Potential Bottleneck</span>
            <strong className="font-serif font-bold text-sm text-terracotta block">Institute Verification</strong>
            <span className="text-[10px] text-terracotta font-semibold">14 Institutes Delayed</span>
          </div>

          <div className="bg-gold/10 p-4 rounded-lg border border-gold/30 space-y-1">
            <span className="text-[10px] font-bold text-dark-brown uppercase block">Recurring Deficiency</span>
            <strong className="font-serif font-bold text-sm text-dark-brown block">Name Mismatch</strong>
            <span className="text-[10px] text-dark-brown font-semibold">34% of Flagged Cases</span>
          </div>

          <div className="bg-forest/10 p-4 rounded-lg border border-forest/30 space-y-1">
            <span className="text-[10px] font-bold text-forest uppercase block">Resolution Rate</span>
            <strong className="font-serif font-extrabold text-2xl text-forest block">78% Rate</strong>
            <span className="text-[10px] text-forest font-bold">Auto-Resolved by AI</span>
          </div>
        </div>
      </div>

      {/* 3. INSIGHT CARDS (INSIGHT, EVIDENCE, IMPACT, ACTION) */}
      <div className="space-y-4">
        <h3 className="font-serif font-extrabold text-lg text-brand-dark px-1">
          SYSTEMIC INSIGHTS & RECOMMENDED ACTIONS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* INSIGHT CARD 1 */}
          <div className="bg-white rounded-xl border-2 border-terracotta/40 p-6 shadow-2xs space-y-4 relative">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-[10px] font-extrabold uppercase text-terracotta bg-terracotta/10 px-2.5 py-0.5 rounded border border-terracotta/20">
                BOTTLENECK DETECTED
              </span>
              <AlertTriangle className="w-4 h-4 text-terracotta" />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-extrabold text-muted-text uppercase block">INSIGHT</span>
                <p className="font-serif font-extrabold text-brand-dark text-sm">
                  Verification Lag at Tier-2 Polytechnic Colleges
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-muted-text uppercase block">EVIDENCE</span>
                <p className="text-muted-text">Average verification time exceeds 7.4 days across 14 state polytechnic institutes.</p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-muted-text uppercase block">POSSIBLE IMPACT</span>
                <p className="text-terracotta font-semibold">Risk of delayed Q3 tuition disbursals for 420 ST scholars.</p>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-[10px] font-extrabold text-forest uppercase block">RECOMMENDED ACTION</span>
                <p className="text-brand-dark font-bold">Issue automated Ministry reminder & dispatch nodal verification officer.</p>
              </div>
            </div>
          </div>

          {/* INSIGHT CARD 2 */}
          <div className="bg-white rounded-xl border-2 border-forest/40 p-6 shadow-2xs space-y-4 relative">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <span className="text-[10px] font-extrabold uppercase text-forest bg-forest/10 px-2.5 py-0.5 rounded border border-forest/20">
                OPTIMIZATION VICTORY
              </span>
              <CheckCircle2 className="w-4 h-4 text-forest" />
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-extrabold text-muted-text uppercase block">INSIGHT</span>
                <p className="font-serif font-extrabold text-brand-dark text-sm">
                  78% AI Self-Resolution Rate for Name Spelling Discrepancies
                </p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-muted-text uppercase block">EVIDENCE</span>
                <p className="text-muted-text">312 students successfully resolved certificate spelling issues via Deficiency Copilot before submitting.</p>
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-muted-text uppercase block">POSSIBLE IMPACT</span>
                <p className="text-forest font-semibold">Prevented an estimated 240 formal application rejections this quarter.</p>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-[10px] font-extrabold text-forest uppercase block">RECOMMENDED ACTION</span>
                <p className="text-brand-dark font-bold">Expand Deficiency Copilot OCR rules to cover Income Certificate expiry dates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

