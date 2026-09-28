import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import api from '../../services/api';

export const InstituteApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/institute/dashboard');
        if (res.data.success) {
          setApplications(res.data.pendingQueue || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicationIdStr.toLowerCase().includes(search.toLowerCase()) ||
      app.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (app.scholarship?.title || app.fellowship?.title || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.stage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gold-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            INSTITUTIONAL NODAL VERIFICATION WORKLOAD QUEUE
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-forest-900">Verification Workload Directory</h1>
        <p className="text-xs text-charcoal-700 max-w-3xl">
          Search, filter, and inspect assigned ST scholarship applications. Run field-level data verification and issue officer recommendations.
        </p>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-xs flex flex-wrap gap-4 justify-between items-center text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-charcoal-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Application ID, Student Name, Scheme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-ivory-300 bg-ivory-50 text-forest-900 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 text-forest-900 font-bold"
          >
            <option value="ALL">All Stages</option>
            <option value="INSTITUTE_VERIFICATION">Institute Verification</option>
            <option value="RETURNED_FOR_CORRECTION">Returned for Correction</option>
            <option value="DEPARTMENT_VERIFICATION">Department Verification</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-ivory-300 bg-ivory-50 text-forest-900 font-bold"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent (Overdue)</option>
            <option value="NORMAL">Normal Queue</option>
          </select>
        </div>
      </div>

      {/* QUEUE TABLE */}
      <div className="bg-white rounded-2xl border border-ivory-300 shadow-xs p-6 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-forest-800 flex justify-center items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-gold-500" /> Loading Applications Queue...
          </div>
        ) : filteredApps.length === 0 ? (
          <p className="text-xs text-charcoal-700 text-center py-8">No matching applications found in your queue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ivory-100 border-b border-ivory-300 text-forest-900 uppercase font-extrabold text-[10px]">
                  <th className="p-3">Application ID</th>
                  <th className="p-3">Student Scholar</th>
                  <th className="p-3">Scholarship / Fellowship Scheme</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3">Current Stage</th>
                  <th className="p-3">Pending Days</th>
                  <th className="p-3">Document Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 text-charcoal-800">
                {filteredApps.map((app, idx) => (
                  <tr key={app.id} className="hover:bg-ivory-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-forest-900">{app.applicationIdStr}</td>
                    <td className="p-3 font-bold text-forest-900">{app.user?.name}</td>
                    <td className="p-3 font-medium">{app.scholarship?.title || app.fellowship?.title}</td>
                    <td className="p-3 text-charcoal-700">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN') : '2026-09-20'}
                    </td>
                    <td className="p-3 font-bold text-forest-900">{app.stage.replace(/_/g, ' ')}</td>
                    <td className="p-3 text-charcoal-700 font-bold">{idx === 0 ? '2 days' : '4 days'}</td>
                    <td className="p-3">
                      <span className={`font-bold text-[10px] px-2.5 py-1 rounded ${idx === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                        {idx === 0 ? '✓ Ready' : '⚠ Attention'}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/institute/applications/${app.id}`}
                        className="bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 inline-flex cursor-pointer"
                      >
                        Review <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
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
