import React from 'react';
import { Landmark, TrendingUp, AlertTriangle, FileSpreadsheet, ShieldCheck, ArrowRight, BarChart3, PieChart, MapPin, Building2, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 bg-cream min-h-screen">
      {/* 1. HEADER BANNER */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-2xs flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon">
            MINISTRY OF TRIBAL AFFAIRS • CENTRAL CONTROL CENTER
          </span>
          <h1 className="font-serif font-extrabold text-2xl text-brand-dark">
            MINISTRY ADMIN OVERVIEW & ANALYTICS
          </h1>
          <p className="text-xs text-muted-text">
            National overview of scholarship applications, state processing speed, and DBT disbursal progress.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-maroon-50 border border-maroon-100 px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-maroon">
          <ShieldCheck className="w-4 h-4 text-brand-maroon" /> MoTA Joint Secretary Desk
        </div>
      </div>

      {/* 2. TOP METRICS (4 COMPACT KPI BLOCKS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Total Applications</span>
          <strong className="font-serif text-2xl font-black text-brand-maroon block">1,248 Schemes</strong>
          <span className="text-[10px] text-muted-text">Academic Year 2026-27</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Total DBT Disbursed</span>
          <strong className="font-serif text-2xl font-black text-forest block">₹142.8 Crores</strong>
          <span className="text-[10px] text-forest font-semibold">Direct Bank Credit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Flagged Bottlenecks</span>
          <strong className="font-serif text-2xl font-black text-terracotta block">14 Institutes</strong>
          <span className="text-[10px] text-terracotta font-semibold">Institute Review Delay</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Resolved Grievances</span>
          <strong className="font-serif text-2xl font-black text-gold block">94.2% Rate</strong>
          <span className="text-[10px] text-muted-text">Avg Resolution: 2.4 Days</span>
        </div>
      </div>

      {/* 3. VISUAL ANALYTICS GRID (MEANINGFUL VISUAL SPACE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL 1: APPLICATION FUNNEL (6 COLUMNS) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-border p-5 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h3 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-brand-maroon" /> National Application Funnel
            </h3>
            <span className="text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">Live Data</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span>Submitted Applications</span>
                <span>1,248 (100%)</span>
              </div>
              <div className="w-full bg-ivory h-3 rounded-full overflow-hidden border border-border">
                <div className="bg-brand-maroon h-full w-full"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span>Institute Verified</span>
                <span>942 (75.4%)</span>
              </div>
              <div className="w-full bg-ivory h-3 rounded-full overflow-hidden border border-border">
                <div className="bg-gold h-full w-[75.4%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span>State Nodal Approved</span>
                <span>810 (64.9%)</span>
              </div>
              <div className="w-full bg-ivory h-3 rounded-full overflow-hidden border border-border">
                <div className="bg-terracotta h-full w-[64.9%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-forest">
                <span>DBT Disbursed</span>
                <span>748 (59.9%)</span>
              </div>
              <div className="w-full bg-ivory h-3 rounded-full overflow-hidden border border-border">
                <div className="bg-forest h-full w-[59.9%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: PROCESSING TIME & SLA (6 COLUMNS) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-border p-5 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h3 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold" /> Processing Speed & SLA Compliance
            </h3>
            <span className="text-[10px] font-bold text-brand-maroon bg-maroon-50 px-2 py-0.5 rounded">Avg: 4.8 Days</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-ivory p-3.5 rounded-lg border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-text uppercase block">INSTITUTE VERIFICATION</span>
              <strong className="font-serif font-extrabold text-lg text-brand-dark">2.1 Days</strong>
              <span className="text-[10px] text-forest font-bold block">✓ SLA: 5 Days</span>
            </div>

            <div className="bg-ivory p-3.5 rounded-lg border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-text uppercase block">STATE NODAL SANCTION</span>
              <strong className="font-serif font-extrabold text-lg text-brand-dark">1.8 Days</strong>
              <span className="text-[10px] text-forest font-bold block">✓ SLA: 5 Days</span>
            </div>

            <div className="bg-ivory p-3.5 rounded-lg border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-text uppercase block">MINISTRY DISBURSAL</span>
              <strong className="font-serif font-extrabold text-lg text-brand-dark">0.9 Days</strong>
              <span className="text-[10px] text-forest font-bold block">✓ SLA: 3 Days</span>
            </div>

            <div className="bg-forest/10 p-3.5 rounded-lg border border-forest/30 space-y-1">
              <span className="text-[10px] font-bold text-forest uppercase block">TOTAL CYCLE TIME</span>
              <strong className="font-serif font-extrabold text-lg text-forest">4.8 Days</strong>
              <span className="text-[10px] text-forest font-bold block">Target SLA Met ✓</span>
            </div>
          </div>
        </div>

        {/* PANEL 3: DEFICIENCY PATTERNS (4 COLUMNS) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-border p-5 space-y-3 shadow-2xs">
          <h3 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-terracotta" /> Deficiency Patterns
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
              <span className="font-medium text-charcoal">Name Spelling Mismatch</span>
              <strong className="text-terracotta font-bold">34%</strong>
            </div>
            <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
              <span className="font-medium text-charcoal">Income Expiry Date</span>
              <strong className="text-gold font-bold">22%</strong>
            </div>
            <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
              <span className="font-medium text-charcoal">Income Cutoff Exceeded</span>
              <strong className="text-brand-maroon font-bold">18%</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-charcoal">Other Minor Issues</span>
              <strong className="text-muted-text font-bold">26%</strong>
            </div>
          </div>
        </div>

        {/* PANEL 4: GEOGRAPHIC INSIGHTS (4 COLUMNS) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-border p-5 space-y-3 shadow-2xs">
          <h3 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-forest" /> Top State Coverage
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
              <span className="font-medium text-charcoal">Jharkhand</span>
              <strong className="text-forest font-bold">412 Applications</strong>
            </div>
            <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
              <span className="font-medium text-charcoal">Odisha</span>
              <strong className="text-forest font-bold">328 Applications</strong>
            </div>
            <div className="flex justify-between items-center border-b border-border/60 pb-1.5">
              <span className="font-medium text-charcoal">Chhattisgarh</span>
              <strong className="text-forest font-bold">245 Applications</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-charcoal">Madhya Pradesh</span>
              <strong className="text-forest font-bold">198 Applications</strong>
            </div>
          </div>
        </div>

        {/* PANEL 5: FEATURED INTELLIGENCE ENGINE LINK (4 COLUMNS) */}
        <div className="lg:col-span-4 bg-brand-dark text-white rounded-xl border border-maroon-900 p-5 space-y-3 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase text-gold tracking-widest block">
              PROCESS INTELLIGENCE ENGINE
            </span>
            <h3 className="font-serif font-extrabold text-base text-white">
              Systemic Lags & Bottlenecks
            </h3>
            <p className="text-xs text-cream/80 leading-relaxed">
              Open deep intelligence analytics to inspect 14 institute delay alerts and resolution bottlenecks.
            </p>
          </div>

          <Link
            to="/admin/process-intelligence"
            className="bg-gold hover:bg-gold/90 text-brand-dark font-extrabold text-xs px-4 py-2.5 rounded shadow transition-all flex items-center justify-center gap-1.5"
          >
            Explore Process Intelligence <ArrowRight className="w-4 h-4 text-brand-dark" />
          </Link>
        </div>
      </div>
    </div>
  );
};

