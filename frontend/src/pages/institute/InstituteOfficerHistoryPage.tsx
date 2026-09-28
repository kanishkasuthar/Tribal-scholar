import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { History, ArrowLeft, Sparkles } from 'lucide-react';
import api from '../../services/api';

export const InstituteOfficerHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!id) return;
        const res = await api.get(`/applications/${id}`);
        if (res.data.success) {
          setApplication(res.data.application);
        }
      } catch (e) {
        console.error('History fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-forest-800 flex justify-center items-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-gold-500" /> Loading Officer Audit History Ledger...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-forest-900">Application Record Not Found</h2>
        <Link to="/institute/applications" className="text-xs font-bold text-forest-800 underline">
          Return to Queue
        </Link>
      </div>
    );
  }

  const historyLogs = application.history || [];

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
              OFFICER AUDIT HISTORY LEDGER
            </span>
          </div>
          <h1 className="text-2xl font-black text-forest-900">
            Audit History for Application {application.applicationIdStr}
          </h1>
          <p className="text-xs text-charcoal-700">
            Scholar: <strong>{application.user?.name}</strong> • Current Stage: <strong className="text-forest-900">{application.stage}</strong>
          </p>
        </div>

        <Link
          to={`/institute/applications/${id}`}
          className="bg-forest-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-forest-900"
        >
          <ArrowLeft className="w-4 h-4 text-gold-400" /> Back to Review Workspace
        </Link>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-forest-900 uppercase tracking-wider border-b border-ivory-200 pb-2">
          CHRONOLOGICAL OFFICER AUDIT TRAIL
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-ivory-100 border-b border-ivory-300 text-forest-900 uppercase font-extrabold text-[10px]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actor / Authority</th>
                <th className="p-3">Role</th>
                <th className="p-3">Official Remarks / Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200 text-charcoal-800">
              {historyLogs.map((log: any, idx: number) => (
                <tr key={idx} className="hover:bg-ivory-50 transition-colors">
                  <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 font-bold text-forest-900">{log.stage.replace(/_/g, ' ')}</td>
                  <td className="p-3 font-bold text-emerald-800">{log.status}</td>
                  <td className="p-3">{log.updatedBy}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ivory-200 text-charcoal-800">
                      {log.actorRole || 'SYSTEM'}
                    </span>
                  </td>
                  <td className="p-3 text-charcoal-700">{log.comments || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
