import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DigitalTwinTimeline } from '../../components/digital-twin/DigitalTwinTimeline';
import { Activity, FileText, CheckCircle2, Clock, Building, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import api from '../../services/api';

export const StudentApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [digitalTwinData, setDigitalTwinData] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const [appRes, twinRes] = await Promise.all([
          api.get(`/applications/${id}`),
          api.get(`/applications/${id}/timeline`),
        ]);

        if (appRes.data.success) setApplication(appRes.data.application);
        if (twinRes.data.success) setDigitalTwinData(twinRes.data.digitalTwin);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-bold text-forest-800 flex justify-center items-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-gold-500" /> Loading Application Digital Twin...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded">
            SCHOLARSHIP APPLICATION DIGITAL TWIN
          </span>
          <h1 className="text-2xl font-extrabold text-forest-900 mt-1">
            Application {application?.applicationIdStr || id}
          </h1>
        </div>

        <Link
          to="/student/applications"
          className="bg-forest-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          ← Back to All Applications
        </Link>
      </div>

      {digitalTwinData && (
        <DigitalTwinTimeline
          applicationIdStr={digitalTwinData.applicationIdStr}
          scholarshipTitle={digitalTwinData.scholarshipTitle}
          currentAuthority={digitalTwinData.currentAuthority}
          submittedDate={digitalTwinData.submittedDate}
          totalAmount={digitalTwinData.totalAmount}
          stages={digitalTwinData.lifecycleFlow}
          explanation={digitalTwinData.stageExplanation}
        />
      )}

      {/* Applicant Details & Document Submission Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
          <h3 className="font-extrabold text-xs uppercase text-forest-900 tracking-wider border-b border-ivory-200 pb-2">
            Scholar & Scheme Summary
          </h3>
          <div className="text-xs space-y-2">
            <p><strong>Scholar Name:</strong> {application?.user?.name}</p>
            <p><strong>Category:</strong> Scheduled Tribe (Santhal)</p>
            <p><strong>Scheme Applied:</strong> {application?.scholarship?.title}</p>
            <p><strong>Sanction Amount:</strong> {application?.totalAmount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
          <h3 className="font-extrabold text-xs uppercase text-forest-900 tracking-wider border-b border-ivory-200 pb-2">
            Attached Documents & Checks
          </h3>
          <ul className="text-xs space-y-2">
            <li className="flex justify-between">
              <span>ST Caste Certificate</span>
              <span className="text-emerald-700 font-bold">✓ Verified</span>
            </li>
            <li className="flex justify-between">
              <span>Income Certificate</span>
              <span className="text-emerald-700 font-bold">✓ Verified</span>
            </li>
            <li className="flex justify-between">
              <span>NIT Rourkela Marksheet</span>
              <span className="text-emerald-700 font-bold">✓ Verified</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
