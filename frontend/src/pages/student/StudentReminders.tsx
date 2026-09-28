import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertCircle, Clock, CheckCircle2, ArrowRight, Hourglass } from 'lucide-react';
import api from '../../services/api';

export const StudentReminders: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/students/tasks');
        if (res.data.success) {
          setTasks(res.data.tasks);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const urgentTasks = tasks.filter((t) => t.category === 'URGENT');
  const actionRequiredTasks = tasks.filter((t) => t.category === 'ACTION_REQUIRED');
  const upcomingTasks = tasks.filter((t) => t.category === 'UPCOMING');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-forest-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            PERSONALIZED ACTION ENGINE
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-forest-900">My Actions & Smart Reminders</h1>
        <p className="text-xs text-charcoal-700 leading-relaxed max-w-3xl">
          Grouped systematically by urgency. Every reminder outlines WHAT needs to be done, WHY it matters, the DEADLINE, and a direct ACTION button.
        </p>
      </div>

      {/* 1. URGENT SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-red-800 flex items-center gap-2 uppercase tracking-wider border-b border-ivory-200 pb-2">
          <AlertCircle className="w-4 h-4 text-red-600" /> URGENT — Action Needed Immediately
        </h3>

        <div className="space-y-3">
          {urgentTasks.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-red-900">WHAT: {t.title}</h4>
                <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded border border-red-300">
                  DEADLINE: {t.deadline}
                </span>
              </div>
              <p className="text-xs text-red-950 leading-relaxed">
                <strong>WHY: </strong>{t.description}
              </p>
              <div className="pt-1">
                <Link
                  to={t.linkUrl || '/student/deficiency-copilot'}
                  className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1 shadow-2xs"
                >
                  ACTION: Take Action Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ACTION REQUIRED SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-amber-900 flex items-center gap-2 uppercase tracking-wider border-b border-ivory-200 pb-2">
          <Clock className="w-4 h-4 text-amber-600" /> ACTION REQUIRED — Pending Document Submissions
        </h3>

        <div className="space-y-3">
          {actionRequiredTasks.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-amber-950">WHAT: {t.title}</h4>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                  DEADLINE: {t.deadline}
                </span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                <strong>WHY: </strong>{t.description}
              </p>
              <div className="pt-1">
                <Link
                  to={t.linkUrl || '/student/renewals'}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1 shadow-2xs"
                >
                  ACTION: Upload Required File →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WAITING SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 uppercase tracking-wider border-b border-ivory-200 pb-2">
          <Hourglass className="w-4 h-4 text-forest-700" /> WAITING — Institutional & Ministry Verification
        </h3>

        <div className="p-4 rounded-xl border border-ivory-300 bg-ivory-100 space-y-2 text-xs">
          <div className="flex justify-between items-center font-bold text-forest-900">
            <span>WHAT: Institute Verification on Application ST-2026-88910</span>
            <span className="bg-forest-200 text-forest-900 px-2.5 py-0.5 rounded">STATUS: Under Review</span>
          </div>
          <p className="text-charcoal-800 leading-relaxed">
            <strong>WHY: </strong>Your application has been submitted successfully and is currently under verification by Nodal Officer Dr. Ramesh Chandra at NIT Rourkela.
          </p>
          <p className="font-extrabold text-forest-800 pt-1">
            ACTION: No action required right now from you.
          </p>
        </div>
      </div>

      {/* 4. UPCOMING SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 uppercase tracking-wider border-b border-ivory-200 pb-2">
          <CheckCircle2 className="w-4 h-4 text-forest-700" /> UPCOMING — Fellowships & Renewal Milestones
        </h3>

        <div className="space-y-3">
          {upcomingTasks.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-forest-200 bg-forest-50/40 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-forest-900">WHAT: {t.title}</h4>
                <span className="text-[11px] font-bold text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded border border-forest-300">
                  TARGET: {t.deadline}
                </span>
              </div>
              <p className="text-xs text-forest-950 leading-relaxed">
                <strong>WHY: </strong>{t.description}
              </p>
              <div className="pt-1">
                <Link
                  to={t.linkUrl || '/student/opportunities'}
                  className="bg-forest-800 hover:bg-forest-900 text-white font-extrabold text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1 shadow-2xs"
                >
                  ACTION: Explore Fellowship →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
