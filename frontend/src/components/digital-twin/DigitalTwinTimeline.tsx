import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, Building, Send, DollarSign } from 'lucide-react';

export interface StageItem {
  stageKey: string;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  updatedAt?: string;
  comments?: string;
  updatedBy?: string;
}

interface DigitalTwinProps {
  applicationIdStr: string;
  scholarshipTitle: string;
  currentAuthority: string;
  submittedDate: string;
  totalAmount: string;
  stages: StageItem[];
  explanation: {
    current: string;
    next: string;
    actionRequiredFromUser: boolean;
    actionPrompt: string;
  };
}

export const DigitalTwinTimeline: React.FC<DigitalTwinProps> = ({
  applicationIdStr,
  scholarshipTitle,
  currentAuthority,
  submittedDate,
  totalAmount,
  stages,
  explanation,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-300 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-maroon-500 text-white p-5 rounded-xl border-l-4 border-gold-400 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 bg-maroon-600 px-2.5 py-1 rounded border border-maroon-400">
            SCHOLARSHIP APPLICATION DIGITAL TWIN
          </span>
          <h2 className="text-xl font-extrabold mt-1 text-white">{scholarshipTitle}</h2>
          <p className="text-xs text-ivory-100 mt-1">
            Application ID: <strong className="text-white">{applicationIdStr}</strong> • Submitted: {submittedDate}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-ivory-100">Sanctioned Benefit</p>
          <p className="text-2xl font-black text-gold-400">{totalAmount}</p>
          <span className="text-[10px] text-emerald-300 font-bold flex items-center justify-end gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" /> DBT Direct Transfer Mode
          </span>
        </div>
      </div>

      {/* Visual Interactive Lifecycle Timeline */}
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-maroon-600 mb-4">
          Application Lifecycle Stages
        </h3>

        <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-2 overflow-x-auto pb-2">
          {stages.map((stg, idx) => (
            <div key={stg.stageKey} className="flex-1 min-w-[120px] flex flex-col items-center text-center group">
              {/* Connector Line */}
              {idx > 0 && (
                <div
                  className={`hidden md:block absolute h-0.5 top-5 -translate-x-1/2 w-full max-w-[80px] ${
                    stg.isCompleted ? 'bg-forest-600' : 'bg-ivory-300'
                  }`}
                  style={{ left: `${(idx / (stages.length - 1)) * 100}%` }}
                ></div>
              )}

              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs z-10 ${
                  stg.isCompleted
                    ? 'bg-forest-800 text-white border-2 border-forest-600'
                    : stg.isCurrent
                    ? 'bg-maroon-500 text-white ring-4 ring-maroon-200 border-2 border-maroon-600 scale-110'
                    : 'bg-ivory-200 text-charcoal-700 border border-ivory-300'
                }`}
              >
                {stg.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                ) : stg.isCurrent ? (
                  <Clock className="w-5 h-5 text-gold-400" />
                ) : (
                  idx + 1
                )}
              </div>

              {/* Title & Status */}
              <p
                className={`text-[11px] font-bold mt-2 leading-tight ${
                  stg.isCurrent ? 'text-maroon-600 font-extrabold' : 'text-charcoal-800'
                }`}
              >
                {stg.title}
              </p>

              {stg.isCurrent && (
                <span className="mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-maroon-50 text-maroon-600 border border-maroon-200">
                  Current Stage
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Stage Breakdown Box */}
      <div className="bg-ivory-100 rounded-xl p-5 border border-ivory-300 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-maroon-600">Current Authority</span>
          <p className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 pt-0.5">
            <Building className="w-4 h-4 text-maroon-600" /> {currentAuthority}
          </p>
        </div>

        <div className="space-y-1 md:col-span-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-maroon-600">What's Happening?</span>
          <p className="text-xs text-charcoal-800 leading-relaxed font-medium">{explanation.current}</p>
        </div>
      </div>

      {/* Next Steps & Action Prompt */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-ivory-100 border border-ivory-300">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-maroon-600">What's Next?</span>
          <p className="text-xs text-charcoal-800 font-bold">{explanation.next}</p>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-lg border border-ivory-300 text-xs font-bold text-maroon-600 shadow-2xs">
          {explanation.actionPrompt}
        </div>
      </div>
    </div>
  );
};
