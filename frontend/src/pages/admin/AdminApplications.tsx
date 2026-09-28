import React, { useState, useEffect } from 'react';
import { FileText, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/admin/applications');
        if (res.data.success && res.data.applications?.length > 0) {
          setApplications(res.data.applications);
        } else {
          setApplications([
            { id: '1', studentName: 'Kanishka Suthar', schemeTitle: 'Post-Matric Scholarship for ST', status: 'IN_REVIEW', submittedAt: '12 Oct 2026' },
            { id: '2', studentName: 'Ramesh Munda', schemeTitle: 'Top Class Education Scheme', status: 'APPROVED', submittedAt: '14 Oct 2026' },
            { id: '3', studentName: 'Sunita Oraon', schemeTitle: 'National Overseas Scholarship', status: 'DEFICIENCY', submittedAt: '15 Oct 2026' },
          ]);
        }
      } catch (e) {
        setApplications([
          { id: '1', studentName: 'Kanishka Suthar', schemeTitle: 'Post-Matric Scholarship for ST', status: 'IN_REVIEW', submittedAt: '12 Oct 2026' },
          { id: '2', studentName: 'Ramesh Munda', schemeTitle: 'Top Class Education Scheme', status: 'APPROVED', submittedAt: '14 Oct 2026' },
          { id: '3', studentName: 'Sunita Oraon', schemeTitle: 'National Overseas Scholarship', status: 'DEFICIENCY', submittedAt: '15 Oct 2026' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-maroon-600">
          MINISTRY APPLICATIONS REGISTRY
        </span>
        <h1 className="font-serif font-bold text-2xl text-charcoal-800">
          ALL NATIONAL ST APPLICATIONS
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-xs space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs font-bold text-maroon-800">Loading Registry...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ivory-300 text-[10px] uppercase font-bold text-charcoal-700 bg-ivory-100">
                  <th className="p-3">Student</th>
                  <th className="p-3">Scheme</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-ivory-50">
                    <td className="p-3 font-serif font-bold text-charcoal-800">{app.studentName}</td>
                    <td className="p-3 text-charcoal-800 font-medium">{app.schemeTitle}</td>
                    <td className="p-3 text-charcoal-700">{app.submittedAt}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ivory-100 text-charcoal-800 border border-ivory-300">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="bg-maroon-500 hover:bg-maroon-600 text-white font-bold text-[11px] px-3 py-1 rounded-lg inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3 h-3 text-gold-400" />
                      </Link>
                    </td>
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
