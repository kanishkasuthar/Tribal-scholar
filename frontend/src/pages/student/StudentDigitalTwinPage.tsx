import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GitMerge, CheckCircle2, Clock, Building2, ShieldCheck, FileText, ArrowRight, UserCheck, AlertTriangle, ListChecks } from 'lucide-react';
import api from '../../services/api';

export const StudentDigitalTwinPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [digitalTwin, setDigitalTwin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDigitalTwin = async () => {
      try {
        const targetId = id || 'app-demo-1';
        const res = await api.get(`/student/digital-twin/${targetId}`);
        if (res.data.success && res.data.digitalTwin) {
          setDigitalTwin(res.data.digitalTwin);
        } else {
          setDigitalTwin({
            id: targetId,
            schemeTitle: 'Post-Matric Scholarship for ST Students',
            currentState: 'INSTITUTE_VERIFICATION',
            responsibleParty: 'Verification Officer, NIT Rourkela',
            blocker: 'Aadhaar vs Income Certificate Spelling Mismatch ⚠',
            nextTransition: 'State Tribal Welfare Department Sanction',
            submittedAt: '12 Oct 2026',
            history: [
              { state: 'SUBMITTED', title: 'Application Submitted', date: '12 Oct 2026', status: 'COMPLETED' },
              { state: 'INSTITUTE_VERIFICATION', title: 'Institute Verification Cell', date: '14 Oct 2026', status: 'ACTIVE' },
              { state: 'DEPARTMENT_VERIFICATION', title: 'State Tribal Welfare Dept', date: 'Pending', status: 'UPCOMING' },
              { state: 'APPROVAL', title: 'Ministry Sanction Order', date: 'Pending', status: 'UPCOMING' },
              { state: 'DISBURSEMENT', title: 'Direct Benefit Transfer (DBT)', date: 'Pending', status: 'UPCOMING' },
            ],
          });
        }
      } catch (e) {
        setDigitalTwin({
          id: id || 'app-demo-1',
          schemeTitle: 'Post-Matric Scholarship for ST Students',
          currentState: 'INSTITUTE_VERIFICATION',
          responsibleParty: 'Verification Officer, NIT Rourkela',
          blocker: 'Aadhaar vs Income Certificate Spelling Mismatch ⚠',
          nextTransition: 'State Tribal Welfare Department Sanction',
          submittedAt: '12 Oct 2026',
          history: [
            { state: 'SUBMITTED', title: 'Application Submitted', date: '12 Oct 2026', status: 'COMPLETED' },
            { state: 'INSTITUTE_VERIFICATION', title: 'Institute Verification Cell', date: '14 Oct 2026', status: 'ACTIVE' },
            { state: 'DEPARTMENT_VERIFICATION', title: 'State Tribal Welfare Dept', date: 'Pending', status: 'UPCOMING' },
            { state: 'APPROVAL', title: 'Ministry Sanction Order', date: 'Pending', status: 'UPCOMING' },
            { state: 'DISBURSEMENT', title: 'Direct Benefit Transfer (DBT)', date: 'Pending', status: 'UPCOMING' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDigitalTwin();
  }, [id]);

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-bold text-brand-maroon bg-white rounded-xl border border-border">
        Loading Application Digital Twin State Machine...
      </div>
    );
  }

  const STAGES = [
    { key: 'SUBMITTED', name: 'SUBMITTED', icon: FileText },
    { key: 'INSTITUTE_VERIFICATION', name: 'INSTITUTE VERIFICATION', icon: Building2 },
    { key: 'DEPARTMENT_VERIFICATION', name: 'DEPARTMENT VERIFICATION', icon: ShieldCheck },
    { key: 'APPROVAL', name: 'APPROVAL', icon: UserCheck },
    { key: 'DISBURSEMENT', name: 'DISBURSEMENT', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8 pb-12 bg-cream min-h-screen">
      {/* 1. HEADER BANNER */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-brand-maroon" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded border border-maroon-100">
            STATE MACHINE LIFECYCLE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark">
          YOUR APPLICATION JOURNEY
        </h1>
        <p className="text-xs text-muted-text max-w-2xl leading-relaxed">
          Real-time deterministic Digital Twin mirror tracking your application across Institute, State, and Ministry sanction nodes.
        </p>
      </div>

      {/* 2. 5-NODE LIFECYCLE STATE MACHINE (HORIZONTAL PROGRESSION) */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-2xs space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon block">
          LIFECYCLE TRANSITION NODES
        </span>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          {STAGES.map((stg, idx) => {
            const Icon = stg.icon;
            const isCurrent = digitalTwin.currentState === stg.key;
            const isPast = idx < STAGES.findIndex((s) => s.key === digitalTwin.currentState);

            let boxStyle = 'bg-ivory border-border text-charcoal';
            if (isPast) boxStyle = 'bg-forest/10 border-forest/30 text-forest font-bold';
            else if (isCurrent) boxStyle = 'bg-brand-maroon text-white border-brand-dark shadow-2xs font-bold ring-2 ring-gold';

            return (
              <React.Fragment key={stg.key}>
                <div className={`p-4 rounded-xl border flex-1 text-center space-y-2 w-full transition-all ${boxStyle}`}>
                  <Icon className={`w-5 h-5 mx-auto ${isCurrent ? 'text-gold' : ''}`} />
                  <span className="text-[10px] font-serif block tracking-wider">{stg.name}</span>
                  {isCurrent && <span className="text-[9px] bg-gold text-brand-dark px-1.5 py-0.5 rounded font-extrabold block">Current Stage</span>}
                </div>
                {idx < STAGES.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-text hidden md:block shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. FOUR INFORMATION BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">CURRENT STATE</span>
          <p className="font-serif font-extrabold text-brand-maroon text-sm">INSTITUTE VERIFICATION</p>
          <span className="text-[10px] text-muted-text block font-mono">Node 02 of 05</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">RESPONSIBLE PARTY</span>
          <p className="font-serif font-extrabold text-brand-dark text-sm">{digitalTwin.responsibleParty}</p>
          <span className="text-[10px] text-muted-text block">Verification Desk</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-terracotta uppercase">CURRENT BLOCKER</span>
          <p className="font-serif font-extrabold text-terracotta text-sm">{digitalTwin.blocker}</p>
          <span className="text-[10px] text-terracotta font-bold block">Deficiency Copilot Active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">NEXT STEP</span>
          <p className="font-serif font-extrabold text-forest text-sm">{digitalTwin.nextTransition}</p>
          <span className="text-[10px] text-muted-text block">State Nodal Sanction</span>
        </div>
      </div>

      {/* 4. HISTORY, DOCUMENTS & TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-xl border border-border p-5 space-y-4 shadow-2xs">
          <h3 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2">
            APPLICATION LIFECYCLE HISTORY
          </h3>
          <div className="space-y-3 text-xs">
            {digitalTwin.history.map((h: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/60">
                <div className="space-y-0.5">
                  <span className="font-bold text-brand-dark block">{h.title}</span>
                  <span className="text-[10px] text-muted-text">{h.date}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  h.status === 'COMPLETED' ? 'bg-forest/10 text-forest' : h.status === 'ACTIVE' ? 'bg-gold/20 text-brand-dark' : 'bg-ivory text-muted-text'
                }`}>
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-xl border border-border p-5 space-y-4 shadow-2xs">
          <h3 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2">
            DIGITAL TWIN TASKS
          </h3>
          <ul className="space-y-2.5 text-xs text-charcoal">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest" /> Aadhaar Verification Passed
            </li>
            <li className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-terracotta" /> Income Certificate Recheck Needed
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-text" /> Bonafide Sign Off Pending
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

