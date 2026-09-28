import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, FileText, Send, Landmark } from 'lucide-react';
import api from '../../services/api';

export const StudentRenewalApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [renewalData, setRenewalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchRenewal = async () => {
      try {
        const res = await api.get(`/student/renewals/${id}`);
        if (res.data.success) {
          setRenewalData(res.data);
        }
      } catch (e) {
        console.error('Failed to load renewal application:', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRenewal();
  }, [id]);

  const handleSubmitRenewal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/student/renewals/${id}/submit`, { comments });
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit renewal application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-bold text-forest-800">Loading Renewal Application Form...</div>;
  }

  const renewal = renewalData?.renewal;
  const scholarship = renewal?.scholarship;

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-ivory-300 shadow-xs text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-forest-900">Renewal Application Submitted!</h2>
        <p className="text-xs text-charcoal-700 leading-relaxed">
          Your scholarship renewal for <strong className="text-forest-900">{scholarship?.title}</strong> has been submitted. It has been forwarded to the Institute Nodal Verification Cell for annual verification.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link to="/student/funding" className="bg-forest-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
            My Funding Journey
          </Link>
          <Link to="/student/renewals" className="bg-ivory-100 text-forest-900 font-bold text-xs px-5 py-2.5 rounded-xl">
            Renewal Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-ivory-300 shadow-xs">
        <Link to="/student/renewals" className="p-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-forest-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded">
            ANNUAL SCHOLARSHIP RENEWAL FORM
          </span>
          <h1 className="text-xl font-extrabold text-forest-900 mt-0.5">
            Renewal Application — {scholarship?.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Review */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Academic Info Confirmation */}
          <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-forest-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-forest-700" /> 1. Academic Record Confirmation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Current Degree Level</span>
                <p className="font-bold text-forest-900">{scholarship?.degreeLevel || 'Undergraduate'}</p>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Current Year & Semester</span>
                <p className="font-bold text-forest-900">Year 3 (Semester 5)</p>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Latest CGPA Record</span>
                <p className="font-bold text-emerald-700">8.6 / 10 (86%)</p>
              </div>
            </div>
          </div>

          {/* Step 2: Documents Verification */}
          <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-forest-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700" /> 2. Required Renewal Documents
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-ivory-100/90 border border-ivory-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-forest-900">ST Category Caste Certificate</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">VERIFIED</span>
              </div>

              <div className="p-3 rounded-xl bg-ivory-100/90 border border-ivory-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-forest-900">Family Income Certificate (2025-26)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">VERIFIED</span>
              </div>

              <div className="p-3 rounded-xl bg-ivory-100/90 border border-ivory-300 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-forest-900">Semester 4 Grade Sheet (NIT Rourkela)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">ATTACHED</span>
              </div>
            </div>
          </div>

          {/* Step 3: Remarks and Submission */}
          <form onSubmit={handleSubmitRenewal} className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-forest-900 border-b border-ivory-200 pb-2">
              3. Student Declaration & Final Submission
            </h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              I hereby declare that all academic marks and institutional information submitted for the renewal of <strong className="text-forest-900">{scholarship?.title}</strong> are true and correct.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-forest-900 block">Optional Student Comments / Notes for Institute Officer:</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter any additional clarification regarding your academic semester marks..."
                className="w-full bg-ivory-100 text-xs p-3 rounded-xl border border-ivory-300 focus:outline-hidden focus:border-forest-700"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs py-3 rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-gold-400" />
              {submitting ? 'Submitting Renewal Application...' : 'Submit Renewal Application'}
            </button>
          </form>
        </div>

        {/* Right Column: Scholarship Benefit Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-forest-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-forest-700" /> Scheme Overview
            </h3>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-[10px] font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                  {scholarship?.code}
                </span>
                <h4 className="font-extrabold text-forest-900 mt-1">{scholarship?.title}</h4>
              </div>
              <p className="text-charcoal-700 text-[11px] leading-relaxed">{scholarship?.description}</p>
              <div className="pt-2 border-t border-ivory-200 flex justify-between items-center font-bold">
                <span className="text-charcoal-700">Annual Benefit:</span>
                <strong className="text-forest-900">{scholarship?.benefitAmount}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
