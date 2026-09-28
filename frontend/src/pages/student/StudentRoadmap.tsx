import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CheckCircle2, ArrowRight, Award, GraduationCap } from 'lucide-react';
import api from '../../services/api';

export const StudentRoadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await api.get('/students/roadmap');
        if (res.data.success) {
          setRoadmap(res.data.roadmap);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-gold-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
            FUTURE OPPORTUNITY ENGINE
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-forest-900">My Academic Funding Roadmap</h1>
        <p className="text-xs text-charcoal-700 leading-relaxed max-w-3xl">
          Visualizing your educational trajectory from current undergraduate degree to doctoral research grants. Clearly distinguishes <strong>Currently Eligible</strong> opportunities from <strong>Potential Future Targets</strong>.
        </p>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-1 before:bg-forest-600">
        {roadmap.map((step, idx) => {
          const isCurrentlyEligible = step.status === 'ACTIVE' || step.status === 'IN_PROGRESS';
          return (
            <div key={idx} className="relative bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
              {/* Step Marker Badge */}
              <div className="absolute -left-[41px] top-6 w-9 h-9 rounded-full bg-forest-900 text-gold-400 font-extrabold text-xs flex items-center justify-center border-2 border-gold-500 shadow-sm z-10">
                {idx + 1}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-2.5 py-1 rounded">
                  {step.stage}
                </span>

                {/* Clear Distinction Badge */}
                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                    isCurrentlyEligible
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-gold-100 text-gold-900 border-gold-300'
                  }`}
                >
                  {isCurrentlyEligible ? '✓ CURRENTLY ELIGIBLE' : '⭐ POTENTIAL FUTURE OPPORTUNITY'}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-forest-900">{step.title}</h3>
              {step.institution && <p className="text-xs text-charcoal-800 font-medium">{step.institution} • {step.year}</p>}
              {step.amount && <p className="text-xs font-bold text-forest-900">Sanctioned Support: {step.amount}</p>}
              {step.action && <p className="text-xs text-charcoal-800 italic bg-ivory-100 p-2.5 rounded-lg border border-ivory-300">{step.action}</p>}
              {step.stipend && <p className="text-xs font-bold text-forest-900">Projected Stipend: {step.stipend}</p>}
              {step.eligibility && (
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {step.eligibility}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
