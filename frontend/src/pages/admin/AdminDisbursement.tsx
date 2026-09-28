import React from 'react';
import { Landmark, CheckCircle2, Clock } from 'lucide-react';

export const AdminDisbursement: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-maroon-600">
          DIRECT BENEFIT TRANSFER (DBT)
        </span>
        <h1 className="font-serif font-bold text-2xl text-charcoal-800">
          NATIONAL FUND DISBURSEMENT TRACKER
        </h1>
        <p className="text-xs text-charcoal-700">Monitor central fund allocations, Aadhaar-seeded bank transfers, and PFMS payment gateways.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-charcoal-700 uppercase">Total Sanctioned</span>
          <strong className="font-serif text-2xl font-black text-maroon-900 block">₹2,450 Crores</strong>
          <span className="text-[10px] text-charcoal-700">Budget Allocation FY 2026</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-charcoal-700 uppercase">Disbursed to Scholars</span>
          <strong className="font-serif text-2xl font-black text-emerald-700 block">₹1,840 Crores</strong>
          <span className="text-[10px] text-emerald-700 font-semibold">75.1% Disbursal Rate</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-ivory-300 shadow-xs space-y-2">
          <span className="text-[10px] font-bold text-charcoal-700 uppercase">Pending Processing</span>
          <strong className="font-serif text-2xl font-black text-gold-600 block">₹610 Crores</strong>
          <span className="text-[10px] text-charcoal-700">State Treasury Verification</span>
        </div>
      </div>
    </div>
  );
};
