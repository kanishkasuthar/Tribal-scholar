import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, HelpCircle, ExternalLink, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const StudentOpportunities: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [matchRes, profileRes] = await Promise.all([
          api.get('/matching/opportunities'),
          api.get('/students/profile').catch(() => null)
        ]);

        if (matchRes.data.success) {
          setMatches(matchRes.data.matches || []);
        }

        if (profileRes?.data?.success) {
          setProfile(profileRes.data.profile);
        }
      } catch (e: any) {
        console.error('Failed to fetch matched opportunities:', e);
        setError('We couldn’t load your scholarship matches. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-border shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-maroon">
            ST SCHOLAR ELIGIBILITY MATCHER
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-brand-dark font-serif">AI-Matched Scholarships & Fellowships</h1>
        <p className="text-xs text-charcoal leading-relaxed max-w-3xl">
          The deterministic eligibility engine cross-analyzed your profile {profile ? `(${profile.stCategory || 'ST Scholar'}, ${profile.courseName || 'Higher Education'}, ${profile.institutionName || 'Recognized Institute'}, Family Income ₹${(profile.familyIncome || 0).toLocaleString('en-IN')})` : `(${user?.name})`} against official published Ministry of Tribal Affairs schemes.
        </p>

        {/* Disclaimer Notice */}
        <div className="bg-ivory p-3 rounded-xl border border-border text-xs text-charcoal flex items-start gap-2 pt-2">
          <HelpCircle className="w-4 h-4 text-brand-maroon shrink-0 mt-0.5" />
          <p className="italic">
            Notice: Matches represent <strong className="not-italic">Potential Match / Potentially Eligible</strong> status based on published guidelines. Final eligibility is determined by the Authorized Sanctioning Authority.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-brand-dark flex justify-center items-center gap-2 bg-white rounded-2xl border border-border">
          <Sparkles className="w-5 h-5 animate-spin text-gold" /> Calculating verified scholarship matches...
        </div>
      ) : error ? (
        <div className="p-6 bg-terracotta/10 border border-terracotta/30 text-terracotta rounded-2xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-terracotta text-white rounded-lg text-xs font-bold hover:bg-terracotta/90"
          >
            Retry
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="py-12 px-6 text-center bg-white rounded-2xl border border-border space-y-3">
          <Sparkles className="w-8 h-8 text-muted-text mx-auto" />
          <h3 className="font-serif font-bold text-lg text-brand-dark">No matching opportunities found yet.</h3>
          <p className="text-xs text-muted-text max-w-md mx-auto">
            Update your profile details (e.g. academic marks, institution, or family income) in My Profile to discover relevant government scholarship schemes.
          </p>
          <Link
            to="/student/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-maroon text-white text-xs font-bold rounded-xl hover:bg-brand-dark"
          >
            Update My Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((m) => {
            const fulfilledReasons = (m.matchedCriteria || [])
              .filter((c: any) => c.isSatisfied)
              .map((c: any) => c.reason);

            return (
              <div
                key={m.scholarshipId}
                className="bg-white rounded-2xl p-6 border border-border shadow-xs hover:shadow-md transition-all space-y-5"
              >
                {/* Card Top Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-maroon-50 text-brand-maroon border border-maroon-200">
                        {m.code} • {m.provider}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-forest/10 text-forest border border-forest/30">
                        Potential Match
                      </span>
                    </div>
                    <h2 className="text-lg font-serif font-bold text-brand-dark mt-1.5">{m.title}</h2>
                    {m.officialName && (
                      <p className="text-xs text-muted-text italic font-medium">{m.officialName}</p>
                    )}
                  </div>

                  {/* Match Score Badge */}
                  <div className="bg-brand-dark text-white px-4 py-2 rounded-xl text-right flex items-center gap-2 border border-gold">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <div>
                      <span className="text-lg font-black text-gold">{m.matchPercentage}%</span>
                      <span className="text-[10px] block text-ivory/80">Profile Match</span>
                    </div>
                  </div>
                </div>

                {/* Criteria Match Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 bg-forest/5 p-4 rounded-xl border border-forest/20">
                    <h4 className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-forest shrink-0" /> Why you may match:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-charcoal">
                      {fulfilledReasons.length > 0 ? (
                        fulfilledReasons.map((r: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-forest font-bold">✓</span> {r}
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-text italic">Meets basic Scheduled Tribe eligibility criteria</li>
                      )}
                    </ul>

                    {m.missingInformation && m.missingInformation.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-forest/20">
                        <span className="text-[11px] font-bold text-terracotta">Missing info for verification:</span>
                        <ul className="text-[11px] text-muted-text list-disc list-inside mt-0.5">
                          {m.missingInformation.map((info: string, idx: number) => (
                            <li key={idx}>{info}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 bg-ivory p-4 rounded-xl border border-border">
                    <h4 className="text-xs font-bold text-brand-dark">Required Documents:</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(m.requiredDocs || []).map((doc: string, idx: number) => (
                        <span key={idx} className="text-[11px] font-medium bg-white px-2.5 py-1 rounded border border-border text-charcoal">
                          {doc}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 text-[11px] text-muted-text space-y-1">
                      <p><strong>Academic Year:</strong> {m.academicYear || '2026-27'}</p>
                      <p><strong>Deadline:</strong> {m.applicationDeadline || m.deadline || 'Active'}</p>
                      <p className="flex items-center gap-1">
                        <strong>Official Source:</strong>
                        <a href={m.officialApplicationUrl || 'https://scholarships.gov.in'} target="_blank" rel="noopener noreferrer" className="text-brand-maroon underline inline-flex items-center gap-0.5 font-bold">
                          Official Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-border/60">
                  <div className="text-xs">
                    <span className="text-muted-text">Financial Benefit: </span>
                    <strong className="text-brand-dark font-bold">{m.benefitAmount}</strong>
                    {m.lastVerifiedAt && (
                      <span className="text-[10px] text-muted-text block">Verified: {m.lastVerifiedAt}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link
                      to={`/student/eligibility/${m.scholarshipId}`}
                      className="text-xs font-bold text-brand-maroon hover:text-brand-dark px-3 py-2 rounded-lg border border-brand-maroon hover:bg-ivory"
                    >
                      View Explainable AI Report
                    </Link>

                    <Link
                      to={`/student/eligibility/${m.scholarshipId}`}
                      className="bg-brand-maroon hover:bg-brand-dark text-white text-xs font-bold px-5 py-2 rounded-lg shadow-xs flex items-center gap-1"
                    >
                      Proceed to Application <ArrowRight className="w-4 h-4 text-gold" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

