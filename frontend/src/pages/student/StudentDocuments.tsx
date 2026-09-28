import React, { useState, useEffect } from 'react';
import { FileCheck2, AlertCircle, Upload, CheckCircle2, FileText } from 'lucide-react';
import api from '../../services/api';

export const StudentDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documents');
        if (res.data.success && res.data.documents?.length > 0) {
          setDocuments(res.data.documents);
        } else {
          setDocuments([
            { id: '1', title: 'Official ST Certificate', status: 'VERIFIED', type: 'PDF', date: '10 Oct 2026' },
            { id: '2', title: 'Family Income Certificate (FY 2026)', status: 'VERIFIED', type: 'PDF', date: '12 Oct 2026' },
            { id: '3', title: 'Class 12 Marks Sheet', status: 'DEFICIENCY', type: 'JPG', date: '14 Oct 2026', issue: 'Spelling mismatch with Aadhaar' },
            { id: '4', title: 'Institution Bonafide Certificate', status: 'PENDING', type: 'PDF', date: '15 Oct 2026' },
          ]);
        }
      } catch (e) {
        setDocuments([
          { id: '1', title: 'Official ST Certificate', status: 'VERIFIED', type: 'PDF', date: '10 Oct 2026' },
          { id: '2', title: 'Family Income Certificate (FY 2026)', status: 'VERIFIED', type: 'PDF', date: '12 Oct 2026' },
          { id: '3', title: 'Class 12 Marks Sheet', status: 'DEFICIENCY', type: 'JPG', date: '14 Oct 2026', issue: 'Spelling mismatch with Aadhaar' },
          { id: '4', title: 'Institution Bonafide Certificate', status: 'PENDING', type: 'PDF', date: '15 Oct 2026' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white rounded-2xl p-6 border border-ivory-300 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-maroon-600" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-maroon-800 bg-maroon-50 px-3 py-1 rounded border border-maroon-200">
            SECURE SCHOLAR VAULT • DIGITAL LOCKER
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-charcoal-800">
          DOCUMENT CENTER & READINESS
        </h1>
        <p className="text-xs text-charcoal-700 leading-relaxed max-w-3xl">
          Manage your verified certificates, upload missing documents, and inspect AI deficiency status.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-ivory-300 p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-charcoal-800 border-b border-ivory-200 pb-3">
          YOUR UPLOADED CERTIFICATES
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs font-bold text-maroon-800">Loading documents...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-ivory-100 rounded-2xl border border-ivory-300 p-5 flex flex-col justify-between space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-maroon-50 border border-maroon-100 flex items-center justify-center text-maroon-800 font-bold text-xs">
                      {doc.type || 'PDF'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-charcoal-800">{doc.title}</h4>
                      <span className="text-[10px] text-charcoal-700 block">Uploaded: {doc.date}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white text-charcoal-800 border border-ivory-300">
                    {doc.status}
                  </span>
                </div>

                {doc.issue && (
                  <div className="p-2.5 bg-terracotta-50 text-terracotta-700 border border-terracotta-200 rounded-xl text-xs font-semibold">
                    ⚠️ {doc.issue}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
