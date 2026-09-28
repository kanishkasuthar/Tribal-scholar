import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle2, TrendingUp, Sparkles, Plus, Edit2 } from 'lucide-react';
import api from '../../services/api';

export const StudentAcademicProgressPage: React.FC = () => {
  const [progressData, setProgressData] = useState<any>(null);
  const [researchData, setResearchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [domain, setDomain] = useState('');
  const [interest, setInterest] = useState('');
  const [isEditingResearch, setIsEditingResearch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, resRes] = await Promise.all([
          api.get('/student/progress'),
          api.get('/student/research-interests'),
        ]);
        if (progRes.data.success) {
          setProgressData(progRes.data);
        }
        if (resRes.data.success) {
          setResearchData(resRes.data.researchInterest);
          setDomain(resRes.data.researchInterest?.domain || '');
          setInterest(resRes.data.researchInterest?.interest || '');
        }
      } catch (e) {
        console.error('Failed to load academic progress:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/student/research-interests', {
        id: researchData?.id,
        domain,
        interest,
        keywords: ['AI', 'NLP', 'Indigenous Knowledge', 'Tribal Governance'],
      });
      if (res.data.success) {
        setResearchData(res.data.researchInterest);
        setIsEditingResearch(false);
      }
    } catch (err: any) {
      alert('Failed to update research interests');
    }
  };

  const progress = progressData?.progress;
  const thresholdCheck = progressData?.renewalThresholdCheck;
  const profile = progressData?.profile;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-forest-900 text-white p-6 rounded-2xl border-l-4 border-gold-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-forest-800 px-2.5 py-1 rounded">
            ACADEMIC PROGRESS & SCHOLARSHIP THRESHOLD TRACKER
          </span>
          <h1 className="text-2xl font-extrabold mt-1">Academic Progress Record</h1>
          <p className="text-xs text-ivory-300 mt-1">
            Maintain your verified academic performance record and verify compliance against scholarship renewal thresholds.
          </p>
        </div>

        <div className="bg-forest-800 px-4 py-2.5 rounded-xl border border-forest-700 text-right">
          <span className="text-[10px] text-ivory-300 uppercase block font-bold">Current Grade Record</span>
          <strong className="text-2xl font-black text-gold-400">{progress?.cgpaOrPercentage || 8.6} CGPA</strong>
          <span className="text-[10px] text-emerald-400 block font-bold">({(progress?.cgpaOrPercentage || 8.6) * 10}%)</span>
        </div>
      </div>

      {/* Scholarship Renewal Threshold Connection */}
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
          <TrendingUp className="w-4 h-4 text-forest-700" /> Scholarship Renewal Criteria Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-ivory-100/90 border border-ivory-300 space-y-1">
            <span className="text-[10px] font-bold text-charcoal-700 uppercase block">Prescribed Minimum Threshold</span>
            <p className="text-lg font-black text-forest-900">{thresholdCheck?.requiredPercentage || '60.0%'}</p>
            <span className="text-[10px] text-charcoal-700 block">Stated in Scheme Guidelines</span>
          </div>

          <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 space-y-1">
            <span className="text-[10px] font-bold text-forest-800 uppercase block">Your Verified Performance</span>
            <p className="text-lg font-black text-forest-900">{thresholdCheck?.studentCurrentScore || '86%'}</p>
            <span className="text-[10px] text-forest-800 block">Semester 4 Grade Record</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-emerald-900 uppercase block">Status Check</span>
            <p className="font-extrabold text-emerald-800">{thresholdCheck?.statusLabel}</p>
          </div>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Academic Performance Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
            <BookOpen className="w-4 h-4 text-forest-700" /> Academic Information
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Institution</span>
              <p className="font-bold text-forest-900">{profile?.institutionName}</p>
            </div>
            <div>
              <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Course</span>
              <p className="font-bold text-forest-900">{profile?.courseName}</p>
            </div>
            <div>
              <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Academic Year</span>
              <p className="font-bold text-forest-900">{progress?.academicYear || '2025-26'}</p>
            </div>
            <div>
              <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Current Semester</span>
              <p className="font-bold text-forest-900">Semester {progress?.semester || 5}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-ivory-200">
            <span className="text-[10px] text-charcoal-700 font-bold uppercase block mb-1">Academic Achievements</span>
            <div className="flex flex-wrap gap-1.5">
              {progress?.achievements?.map((ach: string, idx: number) => (
                <span key={idx} className="text-[10px] font-bold text-forest-800 bg-forest-50 border border-forest-200 px-2.5 py-1 rounded-lg">
                  🏆 {ach}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Research Interests Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-ivory-200 pb-2">
            <h3 className="font-extrabold text-sm text-forest-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-600" /> Research & Career Domain
            </h3>
            <button
              onClick={() => setIsEditingResearch(!isEditingResearch)}
              className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> {isEditingResearch ? 'Cancel' : 'Update Interests'}
            </button>
          </div>

          {isEditingResearch ? (
            <form onSubmit={handleUpdateResearch} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-forest-900 block">Research Domain:</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-ivory-100 p-2 rounded-xl border text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-forest-900 block">Specific Research Interest:</label>
                <textarea
                  rows={2}
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-ivory-100 p-2 rounded-xl border text-xs"
                ></textarea>
              </div>
              <button type="submit" className="bg-forest-800 text-white font-bold text-xs px-4 py-2 rounded-xl">
                Save Research Interests
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Preferred Domain</span>
                <p className="font-bold text-forest-900">{researchData?.domain || 'Computer Science & AI'}</p>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-700 font-bold uppercase block">Research Focus</span>
                <p className="font-bold text-forest-900">{researchData?.interest || 'Artificial Intelligence for Tribal Language Preservation'}</p>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-700 font-bold uppercase block mb-1">Keywords</span>
                <div className="flex flex-wrap gap-1">
                  {researchData?.keywords?.map((kw: string, idx: number) => (
                    <span key={idx} className="text-[9px] font-bold text-gold-900 bg-gold-100 px-2 py-0.5 rounded border border-gold-300">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
