
import React, { useState } from 'react';
import { Plus, Trash2, Calculator, Info, Sparkles, CheckCircle2, AlertTriangle, TrendingUp, Award } from 'lucide-react';
import { URR24_POLICIES } from '../constants.ts';
import { checkPromotionEligibility, predictCGPA, calculateSGPA, calculateGrade, getGradePoints } from '../utils/calculations';
import { motion } from 'framer-motion';

interface SubjectSim {
  id: string;
  name: string;
  credits: number;
  cie: number;
  ese: number;
}

interface SimulatorProps {
  studentData?: any;
}

const Simulator: React.FC<SimulatorProps> = ({ studentData }) => {
  const [subjects, setSubjects] = useState<SubjectSim[]>([
    { id: '1', name: 'Design & Analysis of Algorithms', credits: 4, cie: 35, ese: 45 },
    { id: '2', name: 'Operating Systems', credits: 3, cie: 30, ese: 50 },
  ]);
  
  const [currentCGPA, setCurrentCGPA] = useState(studentData?.cgpa || 8.5);
  const [currentCredits, setCurrentCredits] = useState((studentData?.semester || 2) * 16);
  const [backlogs, setBacklogs] = useState(studentData?.backlogs || 0);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now().toString(), name: '', credits: 3, cie: 0, ese: 0 }]);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof SubjectSim, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const getGradeInfo = (total: number) => {
    return URR24_POLICIES.GRADING_SCALE.find(g => total >= g.min) || URR24_POLICIES.GRADING_SCALE[URR24_POLICIES.GRADING_SCALE.length - 1];
  };

  const calculatePredictedSGPA = () => {
    const courses = subjects.map(s => ({
      name: s.name,
      cie: (s.cie / 40) * 150, // Convert normalized CIE back to 150 scale
      mse: 0,
      minors: [0, 0],
      gcbaa: 0,
      ese: (s.ese / 60) * 100, // Convert normalized ESE back to 100 scale
      credits: s.credits
    }));
    return parseFloat(calculateSGPA(courses).toFixed(2));
  };

  const predictedSGPA = calculatePredictedSGPA();
  const predictedCGPA = predictCGPA(currentCGPA, currentCredits, predictedSGPA, subjects.reduce((sum, s) => sum + s.credits, 0));
  
  const promotionCheck = checkPromotionEligibility({
    semester: Math.floor(currentCredits / 16) + 1,
    backlogs,
    cgpa: predictedCGPA,
    creditsEarned: currentCredits + subjects.reduce((sum, s) => sum + s.credits, 0)
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Grade Estimator</h3>
              <button onClick={addSubject} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors uppercase tracking-widest">
                <Plus size={16} /> Add Course
              </button>
            </div>

            <div className="space-y-3">
              {subjects.map((s) => (
                <div key={s.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                  <div className="col-span-12 md:col-span-4">
                    <input 
                      type="text" value={s.name} placeholder="Subject Name"
                      onChange={(e) => updateSubject(s.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder:text-slate-300"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Credits</label>
                    <input 
                      type="number" value={s.credits}
                      onChange={(e) => updateSubject(s.id, 'credits', parseInt(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-700"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">CIE (Max 40)</label>
                    <input 
                      type="number" value={s.cie} max={40}
                      onChange={(e) => updateSubject(s.id, 'cie', Math.min(40, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-700"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">ESE (Max 60)</label>
                    <input 
                      type="number" value={s.ese} max={60}
                      onChange={(e) => updateSubject(s.id, 'ese', Math.min(60, parseInt(e.target.value) || 0))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-700"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-3 mt-2 md:mt-0">
                    <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                      (s.cie + s.ese) >= 90 ? 'bg-indigo-100 text-indigo-600' : 
                      (s.cie + s.ese) >= 80 ? 'bg-blue-100 text-blue-600' :
                      (s.cie + s.ese) >= 70 ? 'bg-emerald-100 text-emerald-600' :
                      'bg-slate-200 text-slate-500'
                    }`}>
                      {getGradeInfo(s.cie + s.ese).grade}
                    </div>
                    <button onClick={() => removeSubject(s.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Predicted SGPA</span>
              <h2 className="text-6xl font-black mt-2 leading-none">{predictedSGPA.toFixed(2)}</h2>
              <p className="text-indigo-100 text-sm mt-4 leading-relaxed font-medium">Based on your URR24 configuration. This corresponds to approximately <span className="underline decoration-indigo-300">{(predictedSGPA * 9.5).toFixed(1)}%</span>.</p>
            </div>
            <Award className="absolute -bottom-6 -right-6 text-white/10" size={160} />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-600" />
              CGPA Prediction
            </h4>
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Predicted CGPA</p>
                <p className="text-2xl font-black text-indigo-700">{predictedCGPA.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1">From {currentCGPA.toFixed(2)} → {predictedCGPA.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Credits</p>
                <input 
                  type="number" 
                  value={currentCredits}
                  onChange={(e) => setCurrentCredits(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
                />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Backlogs</p>
                <input 
                  type="number" 
                  value={backlogs}
                  onChange={(e) => setBacklogs(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Promotion Checker */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <CheckCircle2 size={14} className={promotionCheck.eligible ? "text-emerald-600" : "text-rose-600"} />
              Promotion Eligibility
            </h4>
            <div className={`p-4 rounded-2xl border mb-4 ${
              promotionCheck.eligible 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {promotionCheck.eligible ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={18} className="text-rose-600" />
                )}
                <p className={`font-black text-sm ${
                  promotionCheck.eligible ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {promotionCheck.reason}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {promotionCheck.requirements.map((req, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-2 text-xs"
                >
                  <span className={req.startsWith('✓') ? 'text-emerald-600' : 'text-rose-600'}>
                    {req.startsWith('✓') ? '✓' : '✗'}
                  </span>
                  <span className="text-slate-600 font-medium">{req.replace(/^[✓✗]\s*/, '')}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Grade Scale Reference */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white">
            <h4 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} />
              URR24 Grade Scale
            </h4>
            <div className="space-y-2 text-xs">
              {URR24_POLICIES.GRADING_SCALE.map((grade, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-bold">{grade.grade}</span>
                  <span className="text-slate-400">{grade.min}%+</span>
                  <span className="text-indigo-400">{grade.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
