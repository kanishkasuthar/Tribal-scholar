import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { EligibilityExplanation } from '../../components/ai/EligibilityExplanation';
import api from '../../services/api';

export const StudentEligibilityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const res = await api.get(`/eligibility/${id}`);
        if (res.data.success) {
          setReport(res.data.report);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEligibility();
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await api.post('/applications/apply', { scholarshipId: id });
      if (res.data.success) {
        navigate('/student/applications');
      }
    } catch (e: any) {
      alert(e.response?.data?.message || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-bold text-forest-800 flex justify-center items-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-gold-500" /> Generating Explainable AI Eligibility Report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-12 text-center text-xs font-bold text-forest-800">
        Eligibility analysis not available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EligibilityExplanation
        scholarshipTitle={report.scholarshipTitle}
        overallStatus={report.overallStatus}
        matchPercentage={94}
        criteria={report.criteria}
        disclaimer={report.disclaimer}
        onApply={handleApply}
        submitting={submitting}
      />
    </div>
  );
};

