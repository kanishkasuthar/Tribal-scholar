import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Landmark, Sparkles, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export const StudentFundingJourney: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED' | 'RENEWAL' | 'FUTURE'>('ACTIVE');
  const [fundingData, setFundingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunding = async () => {
      try {
        const res = await api.get('/student/funding');
        if (res.data.success) {
          setFundingData(res.data);
        }
      } catch (e) {
        console.error('Failed to load funding journey:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFunding();
  }, []);

  const activeApps = fundingData?.activeApplications || [];
  const activeRenewals = fundingData?.activeRenewals || [];
  const futureOpportunities = fundingData?.futureOpportunities || [];
  const aiInsights = fundingData?.aiInsights || [];

  const lifecycleSteps = [
    { label: 'Opportunity Found', done: true },
    { label: 'Application Submitted', done: true },
    { label: 'Ministry Approved', done: true },
    { label: 'DBT Disbursed', done: true },
    { label: 'Active Scholarship', done: true, current: true },
    { label: 'Academic Progress', done: true },
    { label: 'Renewal Due', done: activeRenewals.length > 0 },
    { label: 'Continued Support', done: false },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-forest-900 text-white p-6 rounded-2xl border-l-4 border-gold-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-forest-800 px-2.5 py-1 rounded">
            CONTINUOUS ACADEMIC FUNDING JOURNEY
          </span>
          <h1 className="text-2xl font-extrabold mt-1">My Funding Journey</h1>
          <p className="text-xs text-ivory-300 mt-1">
            Track your active scholarships, manage annual renewals, record academic progress, and discover future funding milestones.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/student/funding/history"
            className="bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-forest-600 transition-colors"
          >
            Funding History
          </Link>
          <Link
            to="/student/renewals"
            className="bg-gold-500 hover:bg-gold-600 text-forest-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5 text-forest-950" /> Renewal Center
          </Link>
        </div>
      </div>

      {/* Visual Lifecycle Stepper */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
          <BookOpen className="w-4 h-4 text-forest-700" /> Scholarship Lifecycle Pipeline
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {lifecycleSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center space-y-1 ${
                step.current
                  ? 'bg-forest-800 text-white border-forest-900 ring-2 ring-gold-400'
                  : step.done
                  ? 'bg-forest-50 text-forest-900 border-forest-200'
                  : 'bg-ivory-100 text-charcoal-700 border-ivory-300'
              }`}
            >
              <span className={`text-[9px] font-extrabold uppercase block ${step.current ? 'text-gold-400' : 'text-charcoal-700'}`}>
                Stage {idx + 1}
              </span>
              <p className="font-bold text-xs leading-snug">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Lifecycle Insights Alert */}
      {aiInsights.length > 0 && (
        <div className="bg-gold-50/80 border border-gold-300 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-forest-900 font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-gold-600" /> AI Lifecycle Advisory
          </div>
          <ul className="space-y-1 text-xs text-charcoal-800 font-medium">
            {aiInsights.map((msg: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gold-600 font-bold">•</span>
                <span>{msg}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-ivory-300 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors ${
            activeTab === 'ACTIVE' ? 'bg-forest-800 text-white' : 'text-forest-900 hover:bg-ivory-100'
          }`}
        >
          Active Scholarships ({activeApps.length})
        </button>
        <button
          onClick={() => setActiveTab('RENEWAL')}
          className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors ${
            activeTab === 'RENEWAL' ? 'bg-forest-800 text-white' : 'text-forest-900 hover:bg-ivory-100'
          }`}
        >
          Renewal Due ({activeRenewals.length})
        </button>
        <button
          onClick={() => setActiveTab('FUTURE')}
          className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors ${
            activeTab === 'FUTURE' ? 'bg-forest-800 text-white' : 'text-forest-900 hover:bg-ivory-100'
          }`}
        >
          Future Opportunities ({futureOpportunities.length})
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors ${
            activeTab === 'COMPLETED' ? 'bg-forest-800 text-white' : 'text-forest-900 hover:bg-ivory-100'
          }`}
        >
          Completed Grants (1)
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'ACTIVE' && (
        <div className="space-y-4">
          {activeApps.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-border text-center space-y-3">
              <BookOpen className="w-8 h-8 text-muted-text mx-auto" />
              <h3 className="font-serif font-bold text-base text-brand-dark">No applications yet</h3>
              <p className="text-xs text-muted-text max-w-md mx-auto">
                You haven't submitted any scholarship applications yet. Explore matched schemes and start your application journey.
              </p>
              <Link
                to="/student/opportunities"
                className="inline-flex items-center gap-1.5 bg-brand-maroon hover:bg-brand-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Explore Scholarships <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          ) : (
            activeApps.map((app: any) => (
              <div key={app.id} className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-ivory-200 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                      ACTIVE SCHOLARSHIP
                    </span>
                    <h3 className="font-extrabold text-base text-forest-900 mt-1">
                      {app.scholarship?.title || app.fellowship?.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Sanction Benefit</span>
                    <strong className="text-lg font-black text-forest-900">{app.totalAmount}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Academic Year</span>
                    <p className="font-extrabold text-forest-900">Year 3 (Sem 5)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Renewal Deadline</span>
                    <p className="font-extrabold text-amber-800">18 October 2026</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Renewal Readiness</span>
                    <p className="font-extrabold text-forest-900">78% Ready</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Documents Verified</span>
                    <p className="font-extrabold text-emerald-700">4 / 4 Documents</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-ivory-200">
                  <span className="text-xs font-bold text-forest-800">Application ID: {app.applicationIdStr}</span>
                  <div className="flex gap-2">
                    <Link
                      to={`/student/digital-twin/${app.id}`}
                      className="bg-ivory-100 hover:bg-ivory-200 text-forest-900 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                    >
                      View Digital Twin
                    </Link>
                    <Link
                      to="/student/renewals"
                      className="bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                    >
                      Manage Renewal
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'RENEWAL' && (
        <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-ivory-200 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-forest-900">Scholarship Renewal Required</h3>
              <p className="text-xs text-charcoal-700">Top Class Education Scheme for ST Students (FY 2026-27)</p>
            </div>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded border border-amber-300">
              78% READY
            </span>
          </div>

          <p className="text-xs text-charcoal-800 leading-relaxed">
            Your annual renewal period is open. Complete two pending documents to reach 100% readiness before the 18 October 2026 deadline.
          </p>

          <Link
            to="/student/renewals"
            className="inline-flex items-center gap-1.5 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            Open Renewal Center <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {activeTab === 'FUTURE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {futureOpportunities.map((op: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-xs space-y-3">
              <span className="text-[9px] font-bold text-gold-900 bg-gold-100 px-2 py-0.5 rounded border border-gold-300">
                FUTURE MILESTONE MATCH
              </span>
              <h4 className="font-extrabold text-sm text-forest-900">{op.title}</h4>
              <p className="text-xs text-charcoal-700 line-clamp-2">{op.description}</p>
              <div className="pt-2 border-t border-ivory-200 flex justify-between items-center">
                <span className="text-xs font-bold text-forest-900">{op.benefitAmount}</span>
                <Link to="/student/roadmap" className="text-xs font-bold text-forest-800 hover:underline">
                  View Roadmap →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'COMPLETED' && (
        <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-sm text-forest-900">Post-Matric ST Scholarship 2024-25</h4>
            <span className="text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded">COMPLETED</span>
          </div>
          <p className="text-xs text-charcoal-700">Fully disbursed via PFMS direct benefit credit of ₹1,20,000 on 5 Dec 2025.</p>
        </div>
      )}
    </div>
  );
};
