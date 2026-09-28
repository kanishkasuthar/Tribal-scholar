import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export const FellowshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fellowship, setFellowship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/fellowships/${id}`);
        if (res.data.success && res.data.fellowship) {
          setFellowship(res.data.fellowship);
        } else {
          setFellowship({
            id,
            code: 'MOTA-FEL-01',
            title: 'National Fellowship for ST Students (Doctoral & M.Phil)',
            provider: 'Ministry of Tribal Affairs',
            degreeLevel: 'Doctorate',
            deadline: '15 Dec 2026',
            benefitAmount: '₹31,000 / month JRF + ₹35,000 / month SRF + HRA',
            description: 'Financial support for Scheduled Tribe candidates pursuing M.Phil and Ph.D in Humanities, Sciences, Engineering, and Technology in recognized Indian universities.',
          });
        }
      } catch (e) {
        setFellowship({
          id,
          code: 'MOTA-FEL-01',
          title: 'National Fellowship for ST Students (Doctoral & M.Phil)',
          provider: 'Ministry of Tribal Affairs',
          degreeLevel: 'Doctorate',
          deadline: '15 Dec 2026',
          benefitAmount: '₹31,000 / month JRF + ₹35,000 / month SRF + HRA',
          description: 'Financial support for Scheduled Tribe candidates pursuing M.Phil and Ph.D in Humanities, Sciences, Engineering, and Technology in recognized Indian universities.',
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-bold text-primary flex justify-center items-center gap-2 bg-surface min-h-screen">
        <Sparkles className="w-5 h-5 animate-spin text-gold" /> Loading Grant Details...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 bg-background min-h-screen">
      <section className="bg-maroon-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-gold shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <span className="text-[10px] font-bold text-gold bg-maroon-800 px-3 py-1 rounded border border-maroon-700">
              {fellowship.code || 'MOTA-FEL'} • {fellowship.degreeLevel}
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif text-ivory-100">{fellowship.title}</h1>
            <p className="text-xs text-ivory-300">
              Deadline: <strong className="text-gold">{fellowship.deadline}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-gold hover:bg-gold-600 text-charcoal-800 font-extrabold text-xs px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            Apply for Research Grant <ArrowRight className="w-4 h-4 text-charcoal-800" />
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-xl text-charcoal-800">Fellowship Description</h3>
          <p className="text-xs text-muted leading-relaxed">{fellowship.description}</p>
          <div className="bg-background p-4 rounded-xl border border-border space-y-1">
            <span className="text-[10px] font-bold text-muted uppercase">Stipend & Financial Grant</span>
            <p className="font-serif font-bold text-primary text-base">{fellowship.benefitAmount}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
