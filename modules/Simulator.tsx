
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Info, Target, Sparkles } from 'lucide-react';
import { URR24_POLICIES } from '../constants';

interface SubjectSim {
  id: string;
  name: string;
  credits: number;
  cie: number;
  ese: number;
}

const Simulator: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectSim[]>([
    { id: '1', name: 'Design & Analysis of Algorithms', credits: 4, cie: 35, ese: 45 },
    { id: '2', name: 'Operating Systems', credits: 3, cie: 30, ese: 50 },
  ]);

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

  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(s => {
      const total = s.cie + s.ese;
      const grade = getGradeInfo(total);
      totalPoints += grade.points * s.credits;
      totalCredits += s.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

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
                    <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${s.cie + s.ese >= 90 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
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
              <h2 className="text-6xl font-black mt-2 leading-none">{calculateSGPA()}</h2>
              <p className="text-indigo-100 text-sm mt-4 leading-relaxed font-medium">Based on your URR24 configuration. This corresponds to approximately <span className="underline decoration-indigo-300">{(parseFloat(calculateSGPA()) * 9.5).toFixed(1)}%</span>.</p>
            </div>
            <Target className="absolute -bottom-6 -right-6 text-white/10" size={160} />
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-600" />
              ESE Target Solver
            </h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">AI analysis: To maintain your current CGPA (8.42), you need an average of <span className="font-bold text-slate-800">48/60</span> in your ESE across all subjects.</p>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Maximum Potential</p>
                <p className="text-lg font-bold text-slate-700">9.82 SGPA</p>
                <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[98%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
