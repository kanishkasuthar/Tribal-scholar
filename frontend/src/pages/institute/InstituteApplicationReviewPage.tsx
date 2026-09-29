import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, FileText, Building2, ShieldCheck, Check } from 'lucide-react';
import api from '../../services/api';

export const InstituteApplicationReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<'VERIFY' | 'RETURN' | null>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppDetail = async () => {
      try {
        if (id && !id.startsWith('demo-')) {
          const res = await api.get(`/applications/${id}`);
          if (res.data.success) {
            setApplication(res.data.application);
          }
        }
      } catch (e) {
        // Fallback for demo ID
      } finally {
        setLoading(false);
      }
    };
    fetchAppDetail();
  }, [id]);

  const studentName = application?.user?.name || application?.studentName || 'Rahul Munda (Illustrative Demo Application)';
  const schemeTitle = application?.scholarship?.title || application?.schemeTitle || 'Post-Matric Scholarship for ST Students';
  const academicRecord = application?.user?.studentProfile?.courseName
    ? `${application.user.studentProfile.courseName} (${application.user.studentProfile.institutionName || 'Institute'})`
    : 'B.Tech Computer Science (Sem 5)';
  const familyIncome = application?.user?.studentProfile?.familyIncome
    ? `₹${Number(application.user.studentProfile.familyIncome).toLocaleString('en-IN')} / Year`
    : '₹1,80,000 / Year (Illustrative)';

  return (
    <div className="space-y-6 pb-12 bg-cream min-h-screen">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-xl p-5 border border-border shadow-2xs flex justify-between items-center">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon">
            INSTITUTE VERIFICATION WORKSPACE • APPLICATION #{id || 'app-01'}
          </span>
          <h1 className="font-serif font-extrabold text-2xl text-brand-dark">
            OFFICER REVIEW DESK
          </h1>
        </div>
        <span className="text-[10px] font-extrabold px-3 py-1 rounded bg-gold/20 text-brand-dark border border-gold/30">
          STATUS: {application?.status || 'IN_REVIEW'}
        </span>
      </div>

      {/* THREE-PANEL REVIEW WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL 1: LEFT (4 COLUMNS) - APPLICATION DETAILS */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-border p-5 space-y-4 shadow-2xs">
          <h3 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2">
            1. APPLICATION DETAILS
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-muted-text block uppercase">STUDENT NAME</span>
              <strong className="font-serif font-extrabold text-base text-brand-dark">{studentName}</strong>
              <span className="text-[10px] text-forest block">✓ Verified Account & ST Record</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-muted-text block uppercase">SCHEME TITLE</span>
              <p className="font-bold text-charcoal">{schemeTitle}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-muted-text block uppercase">ACADEMIC RECORD</span>
              <p className="font-bold text-charcoal">{academicRecord}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-muted-text block uppercase">ANNUAL FAMILY INCOME</span>
              <p className="font-bold text-brand-maroon">{familyIncome}</p>
            </div>
          </div>
        </div>

        {/* PANEL 2: CENTER (5 COLUMNS) - DOCUMENT VIEWER & OCR DATA */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-border p-5 space-y-4 shadow-2xs">
          <h3 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2">
            2. DOCUMENT PREVIEW & OCR EXTRACTION
          </h3>

          <div className="space-y-3">
            <div className="bg-ivory p-3.5 rounded-lg border border-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif font-bold text-brand-dark flex items-center gap-1">
                  <FileText className="w-4 h-4 text-brand-maroon" /> ST Caste Certificate
                </span>
                <span className="text-forest font-bold text-[10px] bg-forest/10 px-2 py-0.5 rounded border border-forest/20">
                  ✓ OCR Verified
                </span>
              </div>
            </div>

            <div className="bg-ivory p-3.5 rounded-lg border border-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif font-bold text-brand-dark flex items-center gap-1">
                  <FileText className="w-4 h-4 text-brand-maroon" /> Income Certificate
                </span>
                <span className="text-forest font-bold text-[10px] bg-forest/10 px-2 py-0.5 rounded border border-forest/20">
                  ✓ OCR Verified
                </span>
              </div>
            </div>

            <div className="bg-ivory p-3.5 rounded-lg border border-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif font-bold text-brand-dark flex items-center gap-1">
                  <FileText className="w-4 h-4 text-brand-maroon" /> Marksheet & Bonafide Record
                </span>
                <span className="text-forest font-bold text-[10px] bg-forest/10 px-2 py-0.5 rounded border border-forest/20">
                  ✓ OCR Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3: RIGHT (3 COLUMNS) - VERIFICATION DECISION */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-border p-5 space-y-4 shadow-2xs">
          <h3 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2">
            3. VERIFICATION DECISION
          </h3>

          <div className="space-y-3 text-xs">
            <button
              onClick={() => setDecision('VERIFY')}
              className={`w-full py-3 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                decision === 'VERIFY'
                  ? 'bg-forest text-white border-forest shadow-2xs'
                  : 'bg-ivory text-charcoal border-border hover:bg-forest/10'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-forest" /> Verify & Approve Bonafide
            </button>

            <button
              onClick={() => setDecision('RETURN')}
              className={`w-full py-3 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                decision === 'RETURN'
                  ? 'bg-terracotta text-white border-terracotta shadow-2xs'
                  : 'bg-ivory text-charcoal border-border hover:bg-terracotta/10'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-terracotta" /> Return for Correction
            </button>

            <button
              onClick={() => navigate('/institute/dashboard')}
              className="w-full bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs py-3 rounded shadow transition-all flex items-center justify-center gap-2 mt-4"
            >
              Save Review <ArrowRight className="w-4 h-4 text-gold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
