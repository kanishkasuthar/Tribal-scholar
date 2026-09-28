import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Search, RefreshCcw, Sparkles, ArrowRight, BookOpen, Microscope, Globe } from 'lucide-react';
import api from '../../services/api';

const DEMO_FELLOWSHIPS = [
  {
    id: 'fel-nf-st-2026',
    code: 'MOTA-NF-01',
    title: 'National Fellowship for ST Students (M.Phil & Ph.D)',
    description: '750 annual fellowships offering monthly stipend plus HRA and research contingency for M.Phil and Ph.D scholars in Indian universities.',
    benefitAmount: '₹31,000 / Month JRF + HRA',
    degreeLevel: 'Doctoral',
    field: 'Humanities & Sciences',
    deadline: '31 Dec 2026',
    matchScore: 96,
  },
  {
    id: 'fel-nos-st-2026',
    code: 'MOTA-NOS-02',
    title: 'National Overseas Fellowship for ST Research Scholars',
    description: 'Financial assistance for ST research scholars admitted to top 500 QS ranked global universities for Ph.D & Post-Doctoral studies.',
    benefitAmount: '$15,400 / Year + Full Tuition',
    degreeLevel: 'Post-Doctoral',
    field: 'STEM & Medical',
    deadline: '31 Jan 2027',
    matchScore: 92,
  },
];

export const FellowshipsPage: React.FC = () => {
  const [fellowships, setFellowships] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const CATEGORIES = ['ALL', 'Doctoral', 'Post-Doctoral', 'Research', 'STEM', 'International'];

  const fetchFellowships = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await api.get(`/fellowships?${params.toString()}`);
      if (res.data.success && res.data.fellowships?.length > 0) {
        setFellowships(res.data.fellowships);
      } else {
        setFellowships(DEMO_FELLOWSHIPS);
      }
    } catch (e) {
      console.error(e);
      setFellowships(DEMO_FELLOWSHIPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFellowships();
  }, [search]);

  const filteredFellowships = (fellowships.length > 0 ? fellowships : DEMO_FELLOWSHIPS).filter((f) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        (f.field && f.field.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedCategory !== 'ALL') {
      const catMatch =
        f.degreeLevel?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        f.field?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        f.title.toLowerCase().includes(selectedCategory.toLowerCase());
      if (!catMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-12 pb-16 bg-cream min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-ivory border-b border-border py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-3 py-1 rounded-full text-xs text-dark-brown font-bold">
              <Microscope className="w-3.5 h-3.5 text-gold" /> NATIONAL RESEARCH & DOCTORAL GRANTS
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-brand-dark tracking-tight leading-tight">
              ST RESEARCH & FELLOWSHIP <br />
              <span className="text-brand-maroon">
                OPPORTUNITIES
              </span>
            </h1>
            <p className="text-sm text-muted-text max-w-xl leading-relaxed font-normal">
              Empowering Scheduled Tribe scholars pursuing M.Phil, Ph.D, Post-Doctoral research, and international higher education across premier research institutions.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-maroon-900 h-60 relative">
              <img
                src="/images/indian_scholar_hero.jpg"
                alt="Research Scholar"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-border text-[11px] font-bold text-charcoal flex justify-between items-center">
                <span>Doctoral & Overseas Fellowships</span>
                <Globe className="w-4 h-4 text-gold shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED FELLOWSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border-2 border-gold p-6 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold bg-brand-dark px-2.5 py-1 rounded">
              FLAGSHIP NATIONAL FELLOWSHIP
            </span>
            <span className="text-xs font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded">
              750 Slots Sanctioned
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-xl text-brand-dark">
            National Fellowship for ST PhD & Post-Doctoral Scholars
          </h2>
          <p className="text-xs text-muted-text max-w-3xl leading-relaxed">
            Monthly research stipend of ₹31,000 (JRF) / ₹35,000 (SRF) plus HRA and annual research contingency grants for ST candidates in UGC/AICTE recognized universities.
          </p>
          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="font-extrabold text-brand-maroon">₹31,000 / Month + Contingency</span>
            <Link
              to="/fellowships/fel-nf-st-2026"
              className="bg-brand-maroon hover:bg-brand-dark text-white font-bold text-xs px-4 py-2 rounded transition-all flex items-center gap-1"
            >
              Apply for Fellowship <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-xl p-4 border border-border shadow-2xs space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-muted-text mr-2">Research Track:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-maroon text-white border-brand-dark shadow-2xs'
                    : 'bg-ivory text-charcoal border-border hover:bg-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-brand-maroon bg-white rounded-xl border border-border">
            Loading Fellowships...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFellowships.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-border p-5 space-y-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gold bg-brand-dark px-2 py-0.5 rounded">
                      {f.code || 'MOTA-FEL'}
                    </span>
                    <span className="text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                      {f.degreeLevel}
                    </span>
                  </div>
                  <h3 className="font-serif font-extrabold text-sm text-brand-dark">{f.title}</h3>
                  <p className="text-xs text-muted-text line-clamp-2 leading-relaxed">{f.description}</p>
                </div>
                <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                  <span className="font-extrabold text-brand-maroon">{f.benefitAmount}</span>
                  <Link to={`/fellowships/${f.id}`} className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1">
                    Details <ArrowRight className="w-3.5 h-3.5 text-terracotta" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

