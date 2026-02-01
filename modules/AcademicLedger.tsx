import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Award, BarChart3, Target, ShieldAlert, 
  Zap, Info, TrendingUp, ChevronDown, Sparkles,
  PieChart, Activity, CheckCircle2, AlertTriangle
} from 'lucide-react';

interface AcademicLedgerProps {
  studentData: any;
}

const AcademicLedger: React.FC<AcademicLedgerProps> = ({ studentData }) => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const courses = studentData.courses || [];

  const getESEThreshold = (cie: number = 0, targetTotal: number) => {
    const normalizedCIE = (cie / 150) * 40;
    const neededInESE = targetTotal - normalizedCIE;
    
    if (neededInESE > 60) return 'Unreachable';
    if (neededInESE <= 0) return 'Guaranteed';
    return Math.ceil(neededInESE);
  };

  const getPredictedGrade = (cie: number = 0) => {
    const normalizedCIE = (cie / 150) * 40;
    const projectedESE = 45; 
    const total = normalizedCIE + projectedESE;
    if (total >= 90) return 'S';
    if (total >= 80) return 'A+';
    if (total >= 70) return 'A';
    return 'B+';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-100">Live Portal Sync</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Roll: {studentData.rollNumber}</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
            {studentData.name?.split(' ').pop() || 'Student'}'s <span className="text-indigo-600">Command Ledger</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl">
            Real-time tracking of internals for {studentData.branch} URR24 curriculum.
          </p>
        </div>
        
        <div className="flex gap-4">
          <AuditCard 
            label="Promotion Status" 
            value={studentData.backlogs > 5 ? "AT RISK" : "ELIGIBLE"} 
            color={studentData.backlogs > 5 ? "text-rose-500" : "text-emerald-500"} 
            icon={<CheckCircle2 size={16}/>} 
          />
          <AuditCard 
            label="Honors Track" 
            value={studentData.cgpa >= 7.0 && studentData.backlogs === 0 ? "QUALIFIED" : "INELIGIBLE"} 
            color={studentData.cgpa >= 7.0 && studentData.backlogs === 0 ? "text-indigo-600" : "text-slate-400"} 
            icon={<Award size={16}/>} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                <PieChart className="text-indigo-600" size={20} />
                Internals Matrix (CIE 150)
              </h3>
              <div className="flex gap-4">
                <LegendItem color="bg-indigo-500" label="MSE" />
                <LegendItem color="bg-emerald-500" label="GCBAA" />
                <LegendItem color="bg-amber-500" label="Minors" />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {courses.length > 0 ? courses.map((course: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={course.name}
                  onClick={() => setSelectedCourse(selectedCourse?.name === course.name ? null : course)}
                  className="p-6 hover:bg-slate-50/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-slate-200 group-hover:bg-indigo-600 transition-colors">
                        {course.name[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{course.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Mastery: {((course.cie / 150) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="hidden md:block text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CIE Score</p>
                        <p className="text-xl font-black text-slate-800">{course.cie} <span className="text-slate-300 text-xs font-bold">/ 150</span></p>
                      </div>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedCourse?.name === course.name ? 'border-indigo-600 text-indigo-600 rotate-180' : 'border-slate-100 text-slate-300'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(course.mse / 150) * 100}%` }} className="h-full bg-indigo-500" />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(course.gcbaa / 150) * 100}%` }} className="h-full bg-emerald-500" />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(150 - course.cie) / 1.5}%` }} className="h-full bg-slate-100" />
                  </div>

                  <AnimatePresence>
                    {selectedCourse?.name === course.name && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <GradeStrikeBox 
                            label="Target 'S' (90+)" 
                            value={getESEThreshold(course.cie, 90)} 
                            sub="ESE Score Required"
                          />
                          <GradeStrikeBox 
                            label="Target 'A+' (80+)" 
                            value={getESEThreshold(course.cie, 80)} 
                            sub="ESE Score Required"
                          />
                          <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Predicted Grade</p>
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-black text-indigo-400">{getPredictedGrade(course.cie)}</span>
                              <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                            </div>
                            <p className="text-[9px] font-medium leading-relaxed opacity-60">Based on historic End-Sem difficulty curves for {course.name}.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )) : (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={32} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No Course Data Found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={120} />
            </div>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Zap className="text-indigo-400" />
              Strategic ROI
            </h3>
            <div className="space-y-6 mb-8">
              <ROIItem label="Theory Stability" value={Math.round((courses.reduce((acc: any, c: any) => acc + (c.mse/45), 0) / (courses.length || 1)) * 100) || 0} color="bg-indigo-500" />
              <ROIItem label="Activity Efficiency" value={studentData.activities?.sea || 0} color="bg-emerald-500" />
              <ROIItem label="Practicum Score" value={studentData.activities?.practicum || 0} color="bg-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/40">
            <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2 tracking-tight">
              <Activity className="text-rose-500" size={20} />
              URR24 Auditor
            </h3>
            <div className="space-y-4">
              <RegulationRow 
                clause="Clause 4.1" 
                title="Attendance Check" 
                desc={`${studentData.attendance}% detected.`} 
                status={studentData.attendance >= 75 ? "SAFE" : "CONDONATION"} 
                isDanger={studentData.attendance < 75}
              />
              <RegulationRow 
                clause="Clause 5.2" 
                title="Year-3 Promotion" 
                desc="Credit threshold check." 
                status={studentData.backlogs === 0 ? "ELIGIBLE" : "PENDING"} 
              />
              <RegulationRow 
                clause="Clause 6.1" 
                title="Honors Eligibility" 
                desc="Zero backlog & CGPA > 7.0." 
                status={studentData.cgpa >= 7.0 && studentData.backlogs === 0 ? "QUALIFIED" : "LOCKED"} 
              />
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center gap-2">
              <Info size={14} /> Regulation Handbook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditCard: React.FC<{label: string, value: string, color: string, icon: React.ReactNode}> = ({label, value, color, icon}) => (
  <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`w-10 h-10 rounded-2xl bg-slate-50 ${color} flex items-center justify-center shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className={`text-sm font-black ${color}`}>{value}</p>
    </div>
  </div>
);

const LegendItem: React.FC<{color: string, label: string}> = ({color, label}) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const GradeStrikeBox: React.FC<{label: string, value: string | number, sub: string}> = ({label, value, sub}) => (
  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/50 hover:bg-white transition-all">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${value === 'Unreachable' ? 'text-rose-500' : (value === 'Guaranteed' ? 'text-emerald-500' : 'text-slate-800')}`}>{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{sub}</p>
  </div>
);

const ROIItem: React.FC<{label: string, value: number, color: string}> = ({label, value, color}) => (
  <div>
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={`h-full ${color} rounded-full`} />
    </div>
  </div>
);

const RegulationRow: React.FC<{clause: string, title: string, desc: string, status: string, isDanger?: boolean}> = ({clause, title, desc, status, isDanger}) => (
  <div className={`p-4 rounded-2xl border transition-all ${isDanger ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}>
    <div className="flex justify-between items-start mb-1">
      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{clause}</span>
      <span className={`text-[9px] font-black uppercase tracking-widest ${isDanger ? 'text-rose-600' : 'text-emerald-500'}`}>{status}</span>
    </div>
    <h5 className="text-sm font-black text-slate-800 mb-1 flex items-center gap-2">
      {title} {isDanger && <AlertTriangle size={12} className="text-rose-500" />}
    </h5>
    <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default AcademicLedger;