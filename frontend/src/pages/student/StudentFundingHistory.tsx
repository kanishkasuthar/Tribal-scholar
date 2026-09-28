import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Calendar, CheckCircle2, Landmark, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export const StudentFundingHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/student/funding/history');
        if (res.data.success) {
          setHistory(res.data.history || []);
        }
      } catch (e) {
        console.error('Failed to load funding history:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const timelineMilestones = [
    { year: '2024', title: 'Post-Matric ST Scholarship', status: 'Completed', amount: '₹1,20,000', detail: 'Disbursed via PFMS (SBI 1012)' },
    { year: '2025', title: 'Top Class Education Scheme', status: 'Completed', amount: '₹1,65,000', detail: 'Tuition + Living Allowance Credited' },
    { year: '2026', title: 'Top Class Education Scheme (Year 3)', status: 'Active (Renewal Due)', amount: '₹1,65,000', detail: 'Renewal readiness 78%' },
    { year: 'Future', title: 'National Overseas Fellowship', status: 'Potential Future Match', amount: '$15,400 USD', detail: 'Postgraduate / Doctoral Opportunity' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-ivory-300 shadow-xs">
        <Link to="/student/funding" className="p-2 rounded-xl bg-ivory-100 hover:bg-ivory-200 text-forest-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded">
            FINANCIAL AUDIT LEDGER
          </span>
          <h1 className="text-xl font-extrabold text-forest-900 mt-0.5">Student Funding History & Timeline</h1>
        </div>
      </div>

      {/* Chronological Visual Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
          <Calendar className="w-4 h-4 text-forest-700" /> Chronological Funding Progression
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {timelineMilestones.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-ivory-100/80 border border-ivory-300 space-y-2 relative">
              <span className="text-xs font-black text-forest-900 bg-forest-100 px-2 py-0.5 rounded">{m.year}</span>
              <h4 className="font-extrabold text-xs text-forest-900 mt-1">{m.title}</h4>
              <p className="text-[11px] font-bold text-forest-800">{m.amount}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded block ${m.year === 'Future' ? 'bg-gold-100 text-gold-900' : 'bg-emerald-100 text-emerald-900'}`}>
                {m.status}
              </span>
              <p className="text-[10px] text-charcoal-700">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Funding History Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 shadow-xs overflow-hidden">
        <div className="p-4 bg-ivory-100/80 border-b border-ivory-300 flex justify-between items-center">
          <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2">
            <History className="w-4 h-4 text-forest-700" /> Complete Funding Ledger
          </h3>
          <span className="text-[10px] font-bold text-charcoal-700 uppercase">
            Demo Transaction Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-forest-900 font-extrabold border-b border-ivory-300">
              <tr>
                <th className="p-3.5">Application ID</th>
                <th className="p-3.5">Scholarship Scheme</th>
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Amount / Benefit</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-ivory-100/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-forest-900">{item.applicationIdStr}</td>
                  <td className="p-3.5 font-bold text-charcoal-900">{item.title}</td>
                  <td className="p-3.5 font-bold text-charcoal-800">{item.year}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-forest-100 text-forest-900">
                      {item.overallStatus}
                    </span>
                  </td>
                  <td className="p-3.5 font-black text-forest-900">{item.totalAmount}</td>
                  <td className="p-3.5 text-right">
                    <Link to={`/student/digital-twin/${item.id}`} className="text-xs font-bold text-forest-800 underline">
                      Digital Twin
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
