import React from 'react';
import { Clock, CheckCircle2, RotateCcw, AlertTriangle, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InstituteDashboard: React.FC = () => {
  const QUEUE = [
    { id: 'app-01', student: 'Kanishka Suthar', scheme: 'Post-Matric Scholarship for ST', docs: '4/4 Verified', days: '2 Days', status: 'DEFICIENCY' },
    { id: 'app-02', student: 'Ramesh Munda', scheme: 'Top Class Education Scheme', docs: '5/5 Verified', days: '1 Day', status: 'IN_REVIEW' },
    { id: 'app-03', student: 'Sunita Oraon', scheme: 'National Overseas Scholarship', docs: '6/6 Verified', days: '3 Days', status: 'SUBMITTED' },
  ];

  return (
    <div className="space-y-8 pb-12 bg-cream min-h-screen">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-2xs flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon">
            INSTITUTE VERIFICATION PORTAL • NIT ROURKELA
          </span>
          <h1 className="font-serif font-extrabold text-2xl text-brand-dark">
            VERIFICATION QUEUE
          </h1>
          <p className="text-xs text-muted-text">
            Review student bonafide status, verify academic certificates, and resolve document deficiency flags.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-maroon-50 border border-maroon-100 px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-maroon">
          <Building className="w-4 h-4 text-brand-maroon" /> Active Officer Desk
        </div>
      </div>

      {/* VERIFICATION QUEUE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Pending Review</span>
          <strong className="font-serif text-2xl font-black text-gold block">18 Applications</strong>
          <span className="text-[10px] text-muted-text">Avg time: 2.1 days</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Verified & Passed</span>
          <strong className="font-serif text-2xl font-black text-forest block">142 Applications</strong>
          <span className="text-[10px] text-forest font-semibold">Forwarded to State Dept</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Returned for Correction</span>
          <strong className="font-serif text-2xl font-black text-terracotta block">6 Applications</strong>
          <span className="text-[10px] text-terracotta font-semibold">Deficiency flagged</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">Escalated Tickets</span>
          <strong className="font-serif text-2xl font-black text-brand-maroon block">2 Tickets</strong>
          <span className="text-[10px] text-muted-text">MoTA Support Desk</span>
        </div>
      </div>

      {/* REVIEW QUEUE TABLE */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-2xs space-y-4">
        <h3 className="font-serif font-extrabold text-lg text-brand-dark border-b border-border pb-3">
          APPLICATION REVIEW QUEUE
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase font-bold text-muted-text bg-ivory">
                <th className="p-3">Student Name</th>
                <th className="p-3">Scheme Title</th>
                <th className="p-3">Documents</th>
                <th className="p-3">Days Pending</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {QUEUE.map((q) => (
                <tr key={q.id} className="hover:bg-ivory/50 transition-colors">
                  <td className="p-3 font-serif font-extrabold text-brand-dark text-sm">{q.student}</td>
                  <td className="p-3 font-medium text-charcoal">{q.scheme}</td>
                  <td className="p-3 text-forest font-bold">{q.docs}</td>
                  <td className="p-3 text-muted-text">{q.days}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ivory text-charcoal border border-border">
                      {q.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/institute/applications/${q.id}`}
                      className="bg-brand-maroon hover:bg-brand-dark text-white font-bold text-[11px] px-3 py-1.5 rounded inline-flex items-center gap-1 shadow-2xs"
                    >
                      Review Form <ArrowRight className="w-3 h-3 text-gold" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

