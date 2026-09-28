import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, Upload, FileCheck2, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export const StudentRenewals: React.FC = () => {
  const [renewals, setRenewals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenewals = async () => {
      try {
        const res = await api.get('/students/renewals');
        if (res.data.success) {
          setRenewals(res.data.renewals);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRenewals();
  }, []);

  const ren = renewals.length > 0 ? renewals[0] : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <RotateCw className="w-5 h-5 text-forest-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            SCHOLARSHIP RENEWAL CENTER
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-forest-900">Academic Year 2026-27 Renewal</h1>
        <p className="text-xs text-charcoal-700 leading-relaxed max-w-3xl">
          Submit your previous semester marksheets and college bonafide certificate to renew your ongoing Top Class Education Scholarship grant.
        </p>
      </div>

      {ren && (
        <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-ivory-300 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-2.5 py-1 rounded">
                CURRENT ACTIVE SCHOLARSHIP
              </span>
              <h2 className="text-lg font-extrabold text-forest-900 mt-1">Top Class Education Scheme for ST Students</h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-charcoal-700 block">Renewal Readiness</span>
              <strong className="text-xl font-black text-terracotta-700">{ren.readinessScore}% Score</strong>
            </div>
          </div>

          <div className="w-full bg-ivory-200 rounded-full h-3 overflow-hidden">
            <div className="bg-terracotta-700 h-full rounded-full" style={{ width: `${ren.readinessScore}%` }}></div>
          </div>

          <div className="bg-terracotta-50 rounded-xl p-4 border border-terracotta-200 space-y-2">
            <h4 className="text-xs font-bold text-terracotta-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-terracotta-700" /> Missing Renewal Requirements:
            </h4>
            <p className="text-xs text-terracotta-800 leading-relaxed">{ren.missingRequirements}</p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-charcoal-700 font-bold">Deadline: {ren.deadline}</span>
            <Link
              to="/student/documents"
              className="bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              Upload Pending Marksheets <Upload className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
