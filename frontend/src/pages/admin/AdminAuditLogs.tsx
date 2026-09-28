import React, { useState, useEffect } from 'react';
import { History, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        if (res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-maroon-900 bg-maroon-50 px-3 py-1 rounded border border-maroon-200">
          SYSTEM AUDIT TRAIL
        </span>
        <h1 className="font-serif text-2xl font-extrabold text-maroon-900">Immutable Action Audit Trail</h1>
        <p className="text-xs text-charcoal-600">Every state change, verification action, document check, and admin update is recorded with timestamp & user role.</p>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 shadow-xs p-6">
        {loading ? (
          <div className="py-8 text-center text-xs font-bold text-maroon-800">Loading Audit Trail...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory-100 text-maroon-950 font-serif font-bold border-b border-ivory-300">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Performed By</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {logs.map((lg) => (
                  <tr key={lg.id} className="hover:bg-ivory-100/70 transition-colors">
                    <td className="p-3 text-charcoal-600 font-mono">{new Date(lg.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-bold text-maroon-900">{lg.action}</td>
                    <td className="p-3 font-medium text-charcoal-900">{lg.performedBy}</td>
                    <td className="p-3 font-bold text-govgreen-700">{lg.userRole}</td>
                    <td className="p-3 text-charcoal-800">{lg.details}</td>
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

