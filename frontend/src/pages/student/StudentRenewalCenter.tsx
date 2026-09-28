import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, CheckCircle2, AlertTriangle, Clock, ArrowRight, ShieldCheck, FileCheck2 } from 'lucide-react';
import api from '../../services/api';

export const StudentRenewalCenter: React.FC = () => {
  const [renewalData, setRenewalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchRenewals = async () => {
      try {
        const res = await api.get('/student/renewals');
        if (res.data.success && res.data.renewal) {
          setRenewalData(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch renewals:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRenewals();
  }, []);

  const handleSubmitRenewal = async () => {
    if (!renewalData?.renewal?.id) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/student/renewals/${renewalData.renewal.id}/submit`, {
        comments: 'Verified annual academic marksheet and updated income statement.'
      });
      if (res.data.success) {
        setSubmitSuccess('Renewal application submitted successfully!');
        // Refresh
        const updated = await api.get('/student/renewals');
        if (updated.data.success) setRenewalData(updated.data);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const ren = renewalData?.renewal;
  const attention = renewalData?.attention;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-brand-maroon" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-1 rounded border border-maroon-100">
            SCHOLARSHIP CONTINUATION & RENEWAL
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-dark">
          RENEWAL READINESS CENTER
        </h1>
        <p className="text-xs text-muted-text leading-relaxed max-w-3xl">
          Track annual renewal readiness, inspect required academic criteria, and submit verified documentation to ensure continuous scholarship funding without lapses.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-brand-dark bg-white rounded-2xl border border-border flex items-center justify-center gap-2">
          <RotateCw className="w-5 h-5 animate-spin text-gold" /> Loading scholarship renewal readiness...
        </div>
      ) : !ren ? (
        <div className="bg-white rounded-2xl p-8 border border-border text-center space-y-3">
          <RotateCw className="w-8 h-8 text-muted-text mx-auto" />
          <h3 className="font-serif font-bold text-base text-brand-dark">Renewal information is not currently verified.</h3>
          <p className="text-xs text-muted-text max-w-md mx-auto">
            No active scholarship renewals require immediate submission. Check back during your institution's annual renewal window.
          </p>
          <Link
            to="/student/funding"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-maroon text-white text-xs font-bold rounded-xl hover:bg-brand-dark"
          >
            View Funding Journey
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-muted-text uppercase">Renewal Readiness</span>
              <strong className="font-serif text-3xl font-black text-gold block">
                {ren.readinessPercentage}%
              </strong>
              <span className="text-[10px] text-muted-text">Verified Requirements</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-muted-text uppercase">Renewal Deadline</span>
              <strong className="font-serif text-2xl font-black text-brand-maroon block">
                {ren.renewalDeadline || 'Not specified'}
              </strong>
              <span className="text-[10px] text-muted-text">{ren.daysRemaining} days remaining</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-muted-text uppercase">Status</span>
              <strong className="font-serif text-xl font-extrabold text-brand-dark block">
                {ren.status}
              </strong>
              <span className="text-[10px] text-forest font-bold block">{attention?.label || 'Action Required'}</span>
            </div>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-forest/10 border border-forest/30 text-forest text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {/* Scheme Detail Card */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-maroon-50 text-brand-maroon border border-maroon-100">
                  SCHOLARSHIP RENEWAL
                </span>
                <h3 className="font-serif font-bold text-lg text-brand-dark mt-1">
                  {ren.scholarship?.title || 'ST Scholarship Renewal'}
                </h3>
              </div>

              <span className="text-xs font-extrabold px-3 py-1 rounded bg-forest/10 text-forest border border-forest/30">
                {ren.readinessPercentage >= 80 ? '✓ Ready for Submission' : '⚠ Action Required'}
              </span>
            </div>

            {/* Checklist of Requirements */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Renewal Requirements Checklist:
              </h4>

              <div className="space-y-2 text-xs">
                {(ren.requirements || []).map((req: any) => (
                  <div
                    key={req.id}
                    className="p-3 bg-ivory rounded-xl border border-border flex justify-between items-center"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileCheck2 className={`w-4 h-4 shrink-0 mt-0.5 ${req.status === 'PASSED' ? 'text-forest' : 'text-amber-800'}`} />
                      <div>
                        <span className="font-bold text-brand-dark block">{req.title}</span>
                        <span className="text-[11px] text-muted-text">{req.description}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded ${
                      req.status === 'PASSED' ? 'bg-forest/10 text-forest' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-text font-medium">
                Ensure marksheets and income details are updated before submitting.
              </span>

              {ren.status === 'SUBMITTED' || ren.status === 'APPROVED' ? (
                <span className="text-xs font-extrabold text-forest bg-forest/10 px-4 py-2 rounded-xl">
                  ✓ Renewal Submitted
                </span>
              ) : (
                <button
                  onClick={handleSubmitRenewal}
                  disabled={submitting}
                  className="bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? 'Submitting Renewal...' : <>Submit Scholarship Renewal <ArrowRight className="w-4 h-4 text-gold" /></>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

