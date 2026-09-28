import React, { useState, useEffect } from 'react';
import { Award, Plus, Layers, Filter, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import api from '../../services/api';

export const AdminScholarships: React.FC = () => {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.get('/admin/schemes');
        if (res.data.success) {
          setSchemes(res.data.schemePerformance || []);
        }
      } catch (e) {
        console.error('Failed to load scheme performance:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-maroon-900 text-white p-6 rounded-2xl border-l-4 border-gold-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-300 bg-maroon-950/80 px-3 py-1 rounded border border-maroon-700">
            NATIONAL SCHEME PORTFOLIO MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl font-extrabold mt-1 text-white">Scholarship & Fellowship Scheme Performance</h1>
          <p className="text-xs text-ivory-200 mt-1 max-w-3xl">
            Performance analytics, turnaround benchmarks, document correction rates, and fund allocation across all national ST schemes.
          </p>
        </div>

        <button className="bg-gold-500 hover:bg-gold-600 text-maroon-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
          <Plus className="w-4 h-4 text-maroon-950" /> Publish New National Scheme
        </button>
      </div>

      {/* Scheme Performance Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 shadow-xs overflow-hidden">
        <div className="p-4 bg-ivory-100/80 border-b border-ivory-300 flex justify-between items-center">
          <h3 className="font-serif font-bold text-base text-maroon-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-terracotta-700" /> Ministry Scheme Performance Ledger
          </h3>
          <span className="text-[10px] font-bold text-charcoal-600 uppercase">
            {schemes.length} Active Schemes
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-maroon-800">Loading Scheme Metrics...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-100 text-maroon-950 font-serif font-bold border-b border-ivory-300">
                <tr>
                  <th className="p-3.5">Scheme Code</th>
                  <th className="p-3.5">Scheme Title & Type</th>
                  <th className="p-3.5">Applications</th>
                  <th className="p-3.5">Approved</th>
                  <th className="p-3.5">Pending</th>
                  <th className="p-3.5">Returned</th>
                  <th className="p-3.5">Completion Rate</th>
                  <th className="p-3.5">Avg Processing Time</th>
                  <th className="p-3.5">Correction Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {schemes.map((sch) => (
                  <tr key={sch.id} className="hover:bg-ivory-100/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-maroon-900">{sch.code}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-charcoal-900">{sch.title}</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${sch.type === 'FELLOWSHIP' ? 'bg-gold-100 text-gold-900' : 'bg-maroon-100 text-maroon-900'}`}>
                        {sch.type} • {sch.degreeLevel}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-maroon-900">{sch.totalApplications}</td>
                    <td className="p-3.5 font-bold text-govgreen-700">{sch.approved}</td>
                    <td className="p-3.5 font-bold text-amber-700">{sch.pending}</td>
                    <td className="p-3.5 font-bold text-terracotta-700">{sch.returned}</td>
                    <td className="p-3.5 font-black text-maroon-900">{sch.completionRate}</td>
                    <td className="p-3.5 font-medium text-charcoal-800">{sch.avgDays} Days</td>
                    <td className="p-3.5 font-bold text-terracotta-700">{sch.correctionRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

