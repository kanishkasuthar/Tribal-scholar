import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Send, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import api from '../../services/api';

export const StudentGrievances: React.FC = () => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Document Verification Delay');
  const [description, setDescription] = useState('');
  const [commentText, setCommentText] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    try {
      const res = await api.post('/grievances', { category, subject, description });
      if (res.data.success) {
        setSubject('');
        setDescription('');
        setShowModal(false);
        fetchGrievances();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !selectedGrievance) return;

    try {
      const res = await api.post(`/grievances/${selectedGrievance.id}/comment`, { text: commentText });
      if (res.data.success) {
        setCommentText('');
        fetchGrievances();
        setSelectedGrievance(res.data.grievance);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Comment failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded">
            NATIONAL GRIEVANCE REDRESSAL DESK
          </span>
          <h1 className="text-2xl font-extrabold text-forest-900 mt-1">My Grievance Tickets</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-gold-400" /> Submit New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          {grievances.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-border text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-muted-text mx-auto" />
              <h3 className="font-serif font-bold text-base text-brand-dark">No grievances submitted yet.</h3>
              <p className="text-xs text-muted-text">
                If you face issues with document verification or scholarship disbursement, click below to submit a ticket.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-maroon text-white text-xs font-bold rounded-xl hover:bg-brand-dark"
              >
                <Plus className="w-4 h-4 text-gold" /> Submit Ticket
              </button>
            </div>
          ) : (
            grievances.map((g) => (
              <div
                key={g.id}
                onClick={() => setSelectedGrievance(g)}
                className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all space-y-2 ${
                  selectedGrievance?.id === g.id
                    ? 'border-brand-maroon ring-2 ring-maroon-100 shadow-xs'
                    : 'border-border hover:bg-ivory'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-brand-maroon bg-maroon-50 px-2 py-0.5 rounded border border-maroon-100">{g.ticketId}</span>
                  <span className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">{g.status}</span>
                </div>
                <h3 className="font-bold text-xs text-brand-dark">{g.subject}</h3>
                <p className="text-[11px] text-muted-text line-clamp-1">{g.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Selected Ticket Thread */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
          {selectedGrievance ? (
            <>
              <div className="border-b border-ivory-300 pb-3">
                <span className="text-[10px] font-bold text-forest-800 bg-forest-100 px-2.5 py-1 rounded">
                  TICKET: {selectedGrievance.ticketId}
                </span>
                <h2 className="text-base font-extrabold text-forest-900 mt-2">{selectedGrievance.subject}</h2>
                <p className="text-xs text-charcoal-700 mt-1">Authority: {selectedGrievance.currentAuthority}</p>
              </div>

              {/* Thread Comments */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto p-2 bg-ivory-100 rounded-xl border border-ivory-300 text-xs">
                {JSON.parse(selectedGrievance.commentsJson || '[]').map((c: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-ivory-300 space-y-1">
                    <div className="flex justify-between items-center font-bold text-forest-900">
                      <span>{c.author} ({c.role})</span>
                      <span className="text-[10px] text-charcoal-700">{new Date(c.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-charcoal-800 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Response */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Reply to nodal officer..."
                  className="flex-1 bg-ivory-100 text-xs border border-ivory-300 rounded-xl px-3 py-2 focus:outline-none"
                />
                <button type="submit" className="bg-forest-800 text-white px-4 py-2 rounded-xl text-xs font-bold">
                  Send Reply
                </button>
              </form>
            </>
          ) : (
            <p className="text-xs text-charcoal-700 text-center py-8">Select a ticket to view thread.</p>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-ivory-400">
            <h3 className="font-extrabold text-base text-forest-900">Submit New Grievance Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded-lg p-2"
                >
                  <option value="Document Verification Delay">Document Verification Delay</option>
                  <option value="DBT Fund Credit Issue">DBT Fund Credit Issue</option>
                  <option value="Renewal Technical Failure">Renewal Technical Failure</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Brief summary of issue..."
                  className="w-full bg-ivory-100 border border-ivory-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Explain your issue clearly..."
                  className="w-full bg-ivory-100 border border-ivory-300 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-forest-800 text-white px-5 py-2 rounded-lg font-bold">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
