import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, CheckCircle2, Sparkles, BookOpen, Award } from 'lucide-react';
import api from '../../services/api';

export const StudentOpportunityRoadmapPage: React.FC = () => {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.get('/student/roadmap');
        if (res.data.success) {
          setRoadmapData(res.data);
        }
      } catch (e) {
        console.error('Failed to load opportunity roadmap:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const milestoneFlow = roadmapData?.milestoneFlow || [];
  const currentOps = roadmapData?.currentOpportunities || [];
  const futureOps = roadmapData?.futureOpportunities || [];
  const profile = roadmapData?.profile;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-maroon" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-1 rounded border border-maroon-100">
            PERSONALIZED ACADEMIC PROGRESSION
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-dark">
          OPPORTUNITY ROADMAP & FUTURE FUNDING
        </h1>
        <p className="text-xs text-muted-text leading-relaxed max-w-3xl">
          Personalized milestone roadmap mapping your academic progression from {profile?.degreeLevel || 'Undergraduate'} studies to future national fellowships and research funding.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-brand-dark bg-white rounded-2xl border border-border flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 animate-spin text-gold" /> Generating personalized opportunity roadmap...
        </div>
      ) : (
        <div className="space-y-6">
          {/* 2. PROGRESSION FLOW STAGES */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-3">
              <Compass className="w-4 h-4 text-brand-maroon" /> Your Academic Funding Progression
            </h3>

            <div className="space-y-4">
              {milestoneFlow.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-ivory border border-border rounded-xl text-xs relative"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-maroon text-gold font-bold flex items-center justify-center shrink-0">
                    0{m.step || idx + 1}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-maroon uppercase tracking-wider block">
                      {m.title}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-brand-dark">{m.subtitle}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. VERIFIED FUTURE OPPORTUNITIES */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-3">
              <Award className="w-4 h-4 text-brand-maroon" /> Verified Next-Stage Opportunities
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {futureOps.map((op: any, idx: number) => (
                <div key={idx} className="p-4 bg-ivory rounded-xl border border-border space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold/20 text-brand-dark border border-gold/40">
                    {op.type || 'SCHOLARSHIP'} • {op.degreeLevel || 'Higher Education'}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-brand-dark">{op.title}</h4>
                  <p className="text-xs text-muted-text line-clamp-2">{op.description}</p>
                  <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
                    <span className="font-bold text-brand-dark">{op.benefitAmount || 'Financial Support'}</span>
                    <Link to="/student/opportunities" className="text-brand-maroon font-bold underline">
                      Explore Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

