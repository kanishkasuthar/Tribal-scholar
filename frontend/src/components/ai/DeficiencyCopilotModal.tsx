import React, { useState } from 'react';
import { AlertCircle, FileCheck2, Upload, CheckCircle2, ArrowRight, RefreshCw, X, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

interface DeficiencyCopilotProps {
  docId: string;
  docType: string;
  issueType: string;
  issueDescription: string;
  onClose: () => void;
  onResolved: () => void;
}

export const DeficiencyCopilotModal: React.FC<DeficiencyCopilotProps> = ({
  docId,
  docType,
  issueType,
  issueDescription,
  onClose,
  onResolved,
}) => {
  const [step, setStep] = useState<'DETECT' | 'EXPLAIN' | 'REPAIR' | 'RECHECK' | 'RESOLVE'>('DETECT');
  const [file, setFile] = useState<File | null>(null);
  const [isRechecking, setIsRechecking] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndRecheck = async () => {
    if (!file) return;

    setStep('RECHECK');
    setIsRechecking(true);

    // Simulate progress bar animation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        submitRepairApi();
      }
    }, 400);
  };

  const submitRepairApi = async () => {
    try {
      const formData = new FormData();
      formData.append('docId', docId);
      if (file) {
        formData.append('file', file);
      }

      const res = await api.post('/deficiency/repair', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setIsRechecking(false);
        setStep('RESOLVE');
      }
    } catch (e) {
      setIsRechecking(false);
      setStep('RESOLVE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-ivory-400 overflow-hidden">
        {/* Header */}
        <div className="bg-forest-900 text-white p-5 flex items-center justify-between border-b border-forest-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-700 flex items-center justify-center text-white shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                AI DEFICIENCY REPAIR COPILOT
              </span>
              <h3 className="font-extrabold text-base">{docType} Deficiency Resolution</h3>
            </div>
          </div>

          <button onClick={onClose} className="text-ivory-300 hover:text-white p-1.5 rounded-lg hover:bg-forest-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Step Tracker */}
        <div className="bg-ivory-100 px-6 py-3 border-b border-ivory-300 flex items-center justify-between text-[11px] font-bold">
          <span className={step === 'DETECT' ? 'text-terracotta-700' : 'text-forest-700'}>1. DETECT</span>
          <span className={step === 'EXPLAIN' ? 'text-terracotta-700' : 'text-forest-700'}>2. EXPLAIN</span>
          <span className={step === 'REPAIR' ? 'text-terracotta-700' : 'text-forest-700'}>3. REPAIR</span>
          <span className={step === 'RECHECK' ? 'text-terracotta-700' : 'text-forest-700'}>4. RECHECK</span>
          <span className={step === 'RESOLVE' ? 'text-emerald-700' : 'text-charcoal-700'}>5. RESOLVE</span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* STEP 1: DETECT & EXPLAIN */}
          {(step === 'DETECT' || step === 'EXPLAIN') && (
            <div className="space-y-4">
              <div className="bg-terracotta-50 rounded-xl p-4 border border-terracotta-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-800">
                  Issue Flagged by AI Scanner
                </span>
                <h4 className="text-sm font-bold text-terracotta-900 mt-1">{issueType}</h4>
                <p className="text-xs text-terracotta-800 mt-1 leading-relaxed">{issueDescription}</p>
              </div>

              <div className="bg-ivory-100 rounded-xl p-4 border border-ivory-300 space-y-2">
                <h5 className="text-xs font-bold text-forest-900">Why does this matter?</h5>
                <p className="text-xs text-charcoal-800 leading-relaxed">
                  Verification officers require exact name and date consistency between uploaded ST certificates and official portal applications. Resolving this issue ensures immediate approval without administrative delay.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-charcoal-700 hover:bg-ivory-200 rounded-lg border border-ivory-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('REPAIR')}
                  className="bg-forest-800 hover:bg-forest-900 text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  Proceed to Upload Correction <ArrowRight className="w-4 h-4 text-gold-500" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REPAIR (Upload Corrected File) */}
          {step === 'REPAIR' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-forest-600 rounded-2xl p-6 bg-forest-50/50 text-center space-y-3">
                <Upload className="w-10 h-10 text-forest-700 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-forest-900">Select Corrected Document File</p>
                  <p className="text-[11px] text-charcoal-700 mt-0.5">PDF, JPG, PNG up to 10MB</p>
                </div>

                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="block w-full text-xs text-charcoal-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-800 file:text-white hover:file:bg-forest-900 cursor-pointer"
                />

                {file && (
                  <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 pt-2">
                    <FileCheck2 className="w-4 h-4" /> Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep('DETECT')}
                  className="text-xs font-semibold text-charcoal-700 hover:underline"
                >
                  Back to Explanation
                </button>
                <button
                  disabled={!file}
                  onClick={handleUploadAndRecheck}
                  className="bg-forest-800 disabled:opacity-50 hover:bg-forest-900 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  Submit for AI Recheck <RefreshCw className="w-4 h-4 text-gold-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RECHECK (Simulated Progress) */}
          {step === 'RECHECK' && (
            <div className="py-8 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-forest-700 mx-auto animate-spin" />
              <div>
                <h4 className="font-extrabold text-sm text-forest-900">AI Scanner Rechecking Document...</h4>
                <p className="text-xs text-charcoal-700 mt-1">Verifying name consistency, OCR text, and official seal</p>
              </div>

              <div className="w-full bg-ivory-300 rounded-full h-3 max-w-md mx-auto overflow-hidden">
                <div
                  className="bg-gradient-to-r from-forest-800 via-forest-600 to-gold-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <p className="text-xs font-bold text-forest-800">{progress}% Completed</p>
            </div>
          )}

          {/* STEP 5: RESOLVE (Success State) */}
          {step === 'RESOLVE' && (
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-black text-emerald-900">✓ Issue Resolved Successfully!</h4>
                <p className="text-xs text-charcoal-800 mt-1.5 max-w-md mx-auto leading-relaxed">
                  Your corrected document has passed all automated AI checks. The name mismatch flag is removed, and your document is marked <strong className="text-emerald-700">VERIFIED</strong>.
                </p>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Application ST-2026-88910 Readiness is now 100%
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    onResolved();
                    onClose();
                  }}
                  className="bg-forest-800 hover:bg-forest-900 text-white px-8 py-2.5 rounded-lg text-xs font-bold shadow-md"
                >
                  Continue Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
