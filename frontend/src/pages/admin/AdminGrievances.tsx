import React, { useState, useEffect } from 'react';
import { HelpCircle, Send } from 'lucide-react';
import api from '../../services/api';

export const AdminGrievances: React.FC = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGrievances = async () => {
    try {
      const res = await api.get('/grievances');
      if (res.data.success) {
        setGrievances(res.data.grievances);
        if (res.data.grievances.length > 0 && !selectedGrievance) {
          setSelectedGrievance(res.data.grievances[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !selectedGrievance) return;

    try {
      const res = await api.post(`/grievances/${selectedGrievance.id}/comment`, { text: commentText, newStatus: 'IN_PROGRESS' });
      if (res.data.success) {
        setCommentText('');
        fetchGrievances();
        setSelectedGrievance(res.data.grievance);
      }
    } catch (err: any) {
      alert('Comment failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-maroon-900 bg-maroon-50 px-3 py-1 rounded border border-maroon-200">
          MINISTRY REDRESSAL DESK
        </span>
        <h1 className="font-serif text-2xl font-extrabold text-maroon-900 mt-1">National Grievances Control</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {grievances.map((g) => (
            <div
              key={g.id}
              onClick={() => setSelectedGrievance(g)}
              className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all ${
                selectedGrievance?.id === g.id ? 'border-maroon-700 ring-2 ring-maroon-200 shadow-sm' : 'border-ivory-300 hover:border-ivory-400'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-maroon-900 bg-maroon-50 px-2 py-0.5 rounded border border-maroon-200">{g.ticketId}</span>
                <span className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">{g.status}</span>
              </div>
              <h3 className="font-serif font-bold text-xs text-maroon-900 mt-1">{g.subject}</h3>
              <p className="text-[11px] text-charcoal-600">Scholar: {g.user?.name}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
          {selectedGrievance ? (
            <>
              <div className="border-b border-ivory-300 pb-3">
                <h3 className="font-serif font-bold text-base text-maroon-900">{selectedGrievance.subject}</h3>
                <p className="text-xs text-charcoal-600">Scholar: {selectedGrievance.user?.name} ({selectedGrievance.user?.email})</p>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto p-3 bg-ivory-100 rounded-xl border border-ivory-300 text-xs">
                {JSON.parse(selectedGrievance.commentsJson || '[]').map((c: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-ivory-300 space-y-1">
                    <p className="font-bold text-maroon-900">{c.author} ({c.role})</p>
                    <p className="text-charcoal-800">{c.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Official Ministry Response..."
                  className="flex-1 bg-ivory-100 text-xs border border-ivory-300 rounded-xl p-2.5 focus:outline-hidden focus:border-maroon-700"
                />
                <button type="submit" className="bg-maroon-900 hover:bg-maroon-950 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors">
                  Respond
                </button>
              </form>
            </>
          ) : (
            <p className="text-xs text-charcoal-600 text-center py-6">Select a ticket to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
};

