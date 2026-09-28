import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, Sparkles, FileText, Info } from 'lucide-react';

export interface EligibilityCriterion {
  name: string;
  status: 'SATISFIED' | 'ACTION_REQUIRED' | 'NEEDS_VERIFICATION';
  details: string;
  missingInfo?: string;
  recommendedAction?: string;
}

export interface EligibilityExplanationProps {
  scholarshipTitle: string;
  overallStatus: string;
  matchPercentage?: number;
  criteria: EligibilityCriterion[];
  disclaimer?: string;
  onApply?: () => void;
  submitting?: boolean;
}

export const EligibilityExplanation: React.FC<EligibilityExplanationProps> = ({
  scholarshipTitle,
  overallStatus,
  matchPercentage = 94,
  criteria,
  disclaimer,
  onApply,
  submitting = false,
}) => {
  const actionNeededItems = criteria.filter((c) => c.status !== 'SATISFIED');

  return (
    <div className="space-y-6">
      {/* 94% PROFILE MATCH BADGE BANNER */}
      <div className="bg-forest-900 text-white rounded-2xl p-6 border border-gold-500/50 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-[10px] font-black uppercase tracking-wider text-gold-400 bg-forest-800 px-2.5 py-0.5 rounded border border-forest-700">
              AI ELIGIBILITY ANALYSIS
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">{scholarshipTitle}</h2>
          <span className="text-xs text-ivory-300 block">Assessment Status: <strong className="text-gold-400">{overallStatus}</strong></span>
        </div>

        <div className="bg-forest-800 p-3.5 rounded-xl border border-gold-500/60 text-right shrink-0">
          <div className="flex items-center gap-1.5 justify-end text-gold-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-2xl font-black">{matchPercentage}%</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-ivory-200 block">PROFILE MATCH</span>
        </div>
      </div>

      {/* WHY THIS OPPORTUNITY MATCHES YOU TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
          <h3 className="text-sm font-extrabold text-forest-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Why this opportunity matches you
          </h3>
          <span className="text-[11px] font-bold text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
            Transparent Criteria Audit
          </span>
        </div>

        {/* Criteria Evaluation Table */}
        <div className="overflow-x-auto rounded-xl border border-ivory-300">
          <table className="w-full text-xs text-left">
            <thead className="bg-ivory-100 text-forest-900 uppercase tracking-wider font-extrabold text-[10px] border-b border-ivory-300">
              <tr>
                <th className="px-4 py-3">Requirement</th>
                <th className="px-4 py-3">Assessment</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200 bg-white">
              {criteria.map((c, idx) => {
                const isSatisfied = c.status === 'SATISFIED';
                return (
                  <tr key={idx} className={isSatisfied ? 'hover:bg-ivory-50/50' : 'bg-amber-50/30 hover:bg-amber-50/50'}>
                    <td className="px-4 py-3 font-bold text-forest-900 whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isSatisfied ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          ✓ Potentially satisfied
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          ⚠ Needs verification
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-charcoal-800 leading-relaxed">{c.details}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* WHAT NEEDS ATTENTION SECTION */}
      {actionNeededItems.length > 0 && (
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2 border-b border-amber-200 pb-2">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-700" /> What needs attention?
          </h3>

          <div className="space-y-3 text-xs">
            {actionNeededItems.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
                <p className="font-extrabold text-amber-900 text-xs">{item.name} Verification Pending</p>
                <p className="text-charcoal-800 leading-relaxed">
                  {item.missingInfo || item.details}
                </p>
                {item.recommendedAction && (
                  <div className="bg-ivory-100 p-2.5 rounded-lg border border-ivory-300 text-forest-900 font-medium">
                    <strong>Recommended Next Step:</strong> {item.recommendedAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WHAT YOU CAN DO SECTION */}
      <div className="bg-forest-900 text-white rounded-2xl p-6 border border-forest-800 shadow-md space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-forest-800 pb-2">
          <Sparkles className="w-4 h-4 text-gold-400" /> What you can do
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-forest-800 border border-forest-700 space-y-2">
            <h4 className="font-bold text-gold-400 text-xs">1. Verify Required Documents</h4>
            <p className="text-ivory-300 leading-relaxed">
              Ensure your ST caste certificate and income certificate are verified in your Document Center.
            </p>
            <Link
              to="/student/documents"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-forest-700 hover:bg-forest-600 px-3.5 py-2 rounded-lg border border-forest-600 mt-1 transition-colors"
            >
              Go to Documents <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-forest-800 border border-forest-700 space-y-2">
            <h4 className="font-bold text-gold-400 text-xs">2. Submit Formal Application</h4>
            <p className="text-ivory-300 leading-relaxed">
              Initiate state and institute verification workflow for instant sanction processing.
            </p>
            {onApply && (
              <button
                onClick={onApply}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 text-xs font-black text-forest-900 bg-gold-500 hover:bg-gold-600 px-4 py-2 rounded-lg mt-1 transition-all shadow-sm"
              >
                {submitting ? 'Submitting Application...' : 'Start Application Now'} <ArrowRight className="w-3.5 h-3.5 text-forest-900" />
              </button>
            )}
          </div>
        </div>

        {disclaimer && (
          <p className="text-[11px] text-ivory-300 italic pt-2 border-t border-forest-800">
            {disclaimer}
          </p>
        )}
      </div>
    </div>
  );
};
