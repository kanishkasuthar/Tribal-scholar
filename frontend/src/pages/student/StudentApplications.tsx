import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Sparkles,
  FileText,
  ArrowRight,
  ShieldAlert,
  Building2,
  UserCheck,
  Award,
  CreditCard,
  Landmark,
  Wrench,
} from 'lucide-react';
import api from '../../services/api';

export const StudentApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications');
        if (res.data.success) {
          setApplications(res.data.applications || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'DRAFT':
        return 'bg-ivory-200 text-charcoal-800 border-ivory-300';
      case 'SUBMITTED':
      case 'DOCUMENT_REVIEW':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'INSTITUTE_VERIFICATION':
        return 'bg-forest-100 text-forest-900 border-forest-300';
      case 'RETURNED_FOR_CORRECTION':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'DEPARTMENT_VERIFICATION':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'DISBURSEMENT':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-extrabold';
      default:
        return 'bg-forest-100 text-forest-900 border-forest-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gold-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            SCHOLARSHIP APPLICATION DIGITAL TWIN SYSTEM
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-forest-900">My Applications Directory</h1>
        <p className="text-xs text-charcoal-700 leading-relaxed max-w-3xl">
          View and track every scholarship and fellowship application in real-time with full transparency across institute verification, state screening, ministry approval, and direct bank disbursement.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-bold text-forest-800 flex justify-center items-center gap-2">
          <Sparkles className="w-5 h-5 animate-spin text-gold-500" /> Loading Applications...
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const schemeTitle = app.scholarship?.title || app.fellowship?.title || 'Scholarship Application';
            const isActionReq = app.stage === 'RETURNED_FOR_CORRECTION' || app.stage === 'DRAFT';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-ivory-200 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-forest-900 text-gold-400 font-mono">
                        {app.applicationIdStr}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${getStageBadge(app.stage)}`}>
                        Stage: {app.stage.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-forest-900 mt-1">{schemeTitle}</h2>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-[10px] text-charcoal-700 block uppercase">Sanction Amount</span>
                    <strong className="text-base font-black text-forest-900">{app.totalAmount}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-ivory-100 border border-ivory-200">
                    <span className="text-[10px] font-bold text-charcoal-700 uppercase block">Current Authority</span>
                    <strong className="text-forest-900">{app.currentAuthority}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory-100 border border-ivory-200">
                    <span className="text-[10px] font-bold text-charcoal-700 uppercase block">Submission Date</span>
                    <span className="text-forest-900 font-medium">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN') : 'Draft Preparation'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-ivory-100 border border-ivory-200">
                    <span className="text-[10px] font-bold text-charcoal-700 uppercase block">Overall Status</span>
                    <span className="text-emerald-800 font-bold">{app.overallStatus}</span>
                  </div>
                </div>

                {app.remarks && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950">
                    <strong>Officer Remark / Discrepancy Note:</strong> "{app.remarks}"
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-charcoal-700 font-medium">
                    Last Updated: {new Date(app.lastUpdatedAt).toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center gap-2">
                    {app.stage === 'DRAFT' ? (
                      <Link
                        to={`/student/applications/${app.id}`}
                        className="bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        Prepare & Submit <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                      </Link>
                    ) : app.stage === 'RETURNED_FOR_CORRECTION' ? (
                      <Link
                        to="/student/deficiency-copilot"
                        className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5 text-gold-300" /> Fix Issue with AI Copilot
                      </Link>
                    ) : (
                      <Link
                        to={`/student/digital-twin/${app.id}`}
                        className="bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" /> View Application Digital Twin
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-ivory-300 space-y-3">
          <FileText className="w-10 h-10 text-charcoal-700 mx-auto" />
          <h3 className="font-extrabold text-sm text-forest-900">No Active Applications Found</h3>
          <p className="text-xs text-charcoal-700">Explore AI-matched schemes to submit your first scholarship application.</p>
          <Link
            to="/student/opportunities"
            className="bg-forest-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-block mt-2"
          >
            Explore Opportunities
          </Link>
        </div>
      )}
    </div>
  );
};
