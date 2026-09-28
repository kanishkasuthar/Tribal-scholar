import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Clock, FileText, User, Landmark, Building, MapPin, Activity } from 'lucide-react';
import api from '../../services/api';

export const AdminApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [digitalTwin, setDigitalTwin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDigitalTwin = async () => {
      try {
        const res = await api.get(`/applications/${id}/digital-twin`);
        if (res.data.success) {
          setDigitalTwin(res.data.digitalTwin);
        }
      } catch (err) {
        console.error('Failed to load application Digital Twin:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDigitalTwin();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-xs font-bold text-maroon-800">Loading Application Digital Twin...</div>;
  }

  if (!digitalTwin) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-xs text-charcoal-700 font-bold">Application Record Not Found</p>
        <Link to="/admin/applications" className="text-xs font-bold text-maroon-800 hover:underline">
          Return to Applications List
        </Link>
      </div>
    );
  }

  const { application, currentResponsibility, verificationStage, documentReadinessScore, eligibilityAssessment, documents, officerReviews, statusHistory, dbtDisbursement } = digitalTwin;
  const user = application.user;
  const profile = user?.studentProfile;
  const scheme = application.scholarship || application.fellowship;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-ivory-300 shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/admin/applications" className="p-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-maroon-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-maroon-900 bg-maroon-50 px-2.5 py-0.5 rounded border border-maroon-200">
              NATIONAL DIGITAL TWIN REPOSITORY
            </span>
            <h1 className="font-serif text-xl font-bold text-maroon-900 flex items-center gap-2 mt-0.5">
              Application #{application.applicationIdStr}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-charcoal-600 font-bold uppercase block">Current Responsibility</span>
            <span className="text-xs font-extrabold text-maroon-950 bg-gold-100 border border-gold-300 px-3 py-1 rounded-lg">
              {currentResponsibility}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student & Scheme Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-maroon-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-terracotta-700" /> Scholar Profile
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-charcoal-600 uppercase block">Full Name</span>
                <p className="font-bold text-maroon-900 text-sm">{user?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-charcoal-600 uppercase block">Category</span>
                  <p className="font-bold text-maroon-900">{profile?.category || 'ST'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-charcoal-600 uppercase block">Annual Income</span>
                  <p className="font-bold text-maroon-900">₹{profile?.familyIncome?.toLocaleString() || '1,80,000'}</p>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-[10px] font-bold text-charcoal-600 uppercase block">Institution</span>
                <p className="font-bold text-maroon-900">{profile?.institutionName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-600 uppercase block">Course & Year</span>
                <p className="font-bold text-maroon-900">{profile?.courseName} ({profile?.currentYear})</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-charcoal-600 uppercase block">State & District</span>
                <p className="font-bold text-maroon-900">{profile?.state}, {profile?.district}</p>
              </div>
            </div>
          </div>

          {/* Scheme Card */}
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-maroon-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-terracotta-700" /> Scheme Details
            </h3>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-[10px] font-bold text-gold-800 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                  {scheme?.code}
                </span>
                <h4 className="font-serif font-bold text-maroon-900 mt-1">{scheme?.title}</h4>
              </div>
              <p className="text-[11px] text-charcoal-700 leading-relaxed">{scheme?.description}</p>
              <div className="pt-1 border-t border-ivory-200 flex justify-between items-center text-xs">
                <span className="font-bold text-charcoal-600">Financial Benefit:</span>
                <strong className="font-bold text-maroon-900">{scheme?.benefitAmount || scheme?.monthlyStipend}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis, Verification Ledger & Pipeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Eligibility & Readiness Score Header */}
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-maroon-50 border border-maroon-200 space-y-1">
              <span className="text-[10px] font-bold text-maroon-900 uppercase block">AI Document Readiness Score</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-maroon-900">{documentReadinessScore}%</span>
                <span className="text-xs font-extrabold text-maroon-900 bg-maroon-100 px-2.5 py-1 rounded border border-maroon-300">
                  High Readiness
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-200 space-y-1">
              <span className="text-[10px] font-bold text-gold-950 uppercase block">Eligibility System Check</span>
              <div className="flex items-center gap-2 pt-1">
                <CheckCircle2 className="w-5 h-5 text-govgreen-700" />
                <span className="text-xs font-bold text-maroon-900">
                  {eligibilityAssessment?.passed ? 'All Criteria Met (Eligible)' : 'Manual Review Required'}
                </span>
              </div>
            </div>
          </div>

          {/* Verified Document Checklist */}
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-maroon-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-terracotta-700" /> Document Verification Ledger
            </h3>

            <div className="space-y-2">
              {documents.map((doc: any) => (
                <div key={doc.id} className="p-3 rounded-xl bg-ivory-100/80 border border-ivory-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {doc.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-govgreen-700 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-maroon-900">{doc.name}</span>
                      <span className="text-[10px] text-charcoal-600 block">{doc.documentType}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${doc.verified ? 'bg-govgreen-100 text-govgreen-900' : 'bg-amber-100 text-amber-900'}`}>
                      {doc.verified ? 'VERIFIED BY OFFICER' : 'ATTENTION REQUIRED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Verification & Review Audit */}
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-maroon-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-terracotta-700" /> Institute Verification Audit Ledger
            </h3>

            {officerReviews.length === 0 ? (
              <p className="text-xs text-charcoal-600 italic py-2">No verification action recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {officerReviews.map((rev: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-ivory-100 border border-ivory-300 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-maroon-900">{rev.reviewerName} ({rev.reviewerRole})</span>
                      <span className="text-[10px] text-charcoal-600 font-mono">{new Date(rev.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="font-bold text-maroon-900">Decision: {rev.action}</p>
                    {rev.comments && <p className="text-charcoal-800 text-[11px] bg-white p-2 rounded border border-ivory-300 mt-1">{rev.comments}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PFMS Disbursement Details */}
          <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-maroon-900 border-b border-ivory-200 pb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-terracotta-700" /> PFMS Direct Benefit Transfer Status
            </h3>

            <div className="p-4 rounded-xl bg-maroon-50 border border-maroon-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-maroon-900 uppercase block">Disbursement Status</span>
                <strong className="text-base font-extrabold text-maroon-950">{dbtDisbursement?.status || 'PENDING DISBURSEMENT'}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-charcoal-600 uppercase block">Sanctioned Amount</span>
                <strong className="text-lg font-black text-gold-700">{dbtDisbursement?.amount || scheme?.benefitAmount || '₹1,20,000'}</strong>
              </div>
            </div>
            <p className="text-[10px] text-charcoal-600 italic">
              Note: Prototype Financial Payment Simulation Record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

