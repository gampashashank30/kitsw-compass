
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { extractStudentDetailsFromImage } from '../services/gemini';

interface ProfileSyncModalProps {
  onClose: () => void;
  onSync: (data: any) => void;
}

const ProfileSyncModal: React.FC<ProfileSyncModalProps> = ({ onClose, onSync }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'confirm'>('upload');
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        processImage(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string, mimeType: string) => {
    setStep('scanning');
    setError(null);
    try {
      const data = await extractStudentDetailsFromImage(base64, mimeType);
      if (data) {
        setExtractedData(data);
        setStep('confirm');
      } else {
        throw new Error("Could not extract data");
      }
    } catch (err) {
      setError("AI failed to read the document. Please ensure it's clear and try again.");
      setStep('upload');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 z-10">
          <X size={24} />
        </button>

        <div className="p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">AI Profile Sync</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">Upload a photo of your Student ID or Scorecard. Gemini Vision will automatically personalize your dashboard.</p>
                
                {error && (
                  <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-rose-100">
                    <AlertCircle size={18} /> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                  >
                    <Upload className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={32} />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">Upload Photo</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-slate-100 bg-slate-50 rounded-3xl opacity-50 cursor-not-allowed">
                    <Camera className="text-slate-300" size={32} />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Open Camera</span>
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              </motion.div>
            )}

            {step === 'scanning' && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-100 mb-8 border border-slate-200">
                  {preview && <img src={preview} alt="Scan preview" className="w-full h-full object-cover" />}
                  <motion.div 
                    initial={{ top: 0 }} animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10"
                  />
                  <div className="absolute inset-0 bg-indigo-500/10" />
                </div>
                <div className="flex items-center justify-center gap-3 text-indigo-600">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm font-black uppercase tracking-widest">Gemini is parsing document...</span>
                </div>
              </motion.div>
            )}

            {step === 'confirm' && extractedData && (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Details Found</h3>
                </div>

                <div className="space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                  <DetailRow label="Name" value={extractedData.name} />
                  <DetailRow label="Roll No" value={extractedData.rollNumber} />
                  <DetailRow label="Branch" value={extractedData.branch} />
                  <DetailRow label="Semester" value={extractedData.semester} />
                  <DetailRow label="CGPA" value={extractedData.cgpa} />
                </div>

                <button 
                  onClick={() => onSync(extractedData)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                >
                  Apply to Profile
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DetailRow: React.FC<{label: string, value: any}> = ({label, value}) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-200/50 last:border-0">
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <span className="text-sm font-bold text-slate-700">{value || 'N/A'}</span>
  </div>
);

export default ProfileSyncModal;
