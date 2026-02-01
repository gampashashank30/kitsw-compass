
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Award, BarChart4, Target, ShieldAlert, 
  Zap, Info, TrendingUp, ChevronDown, Sparkles,
  PieChart, Activity, CheckCircle2
} from 'lucide-react';

interface AcademicLedgerProps {
  studentData: any;
}

const AcademicLedger: React.FC<AcademicLedgerProps> = ({ studentData }) => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const courses = studentData.courses || [
    { name: 'BEE', cie: 128, mse: 45, minors: [19, 14], gcbaa: 50, status: 'Elite' },
    { name: 'COA', cie: 118, mse: 31, minors: [20, 17], gcbaa: 50, status: 'Stable' },
    { name: 'DCODE', cie: 141, mse: 46, minors: [24, 21], gcbaa: 50, status: 'Elite' },
    { name: 'EP', cie: 129, mse: 45, minors: [11, 23], gcbaa: 50, status: 'Elite' },
    { name: 'ES', cie: 123, mse: 35, minors: [20, 18], gcbaa: 50, status: 'Stable' },
    { name: 'PPSC', cie: 121, mse: 33, minors: [21, 17], gcbaa: 50, status: 'Stable' },
  ];

  // Logic for Grade Strike
  const getESEThreshold = (cie: number, targetTotal: number) => {
    const needed = targetTotal - cie;
    return needed > 60 ? 'Unreachable' : Math.max(0, needed);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header & Quick Audit */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Active Portal Sync</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Last Updated: Just now</span>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
            {studentData.name?.split(' ')[1] || 'Shashank'}'s <span className="text-indigo-600">Command Ledger</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-medium max-w-xl">
            Real-time URR24 compliance monitoring for {studentData.branch || 'CSE'} B.Tech Track.
          </p>
        </div>
        
        <div className="flex gap-4">
          <AuditCard label="Promotion Status" value="ELIGIBLE" color="text-emerald-500" icon={<CheckCircle2 size={16}/>} />
          <AuditCard label="Backlog Risk" value="ZERO" color="text-indigo-600" icon={<ShieldAlert size={16}/>} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Performance Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2">
                <PieChart className="text-indigo-600" size={20} />
                Component Breakdown (CIE 150)
              </h3>
              <div className="flex gap-4">
                <LegendItem color="bg-indigo-500" label="MSE" />
                <LegendItem color="bg-emerald-500" label="GCBAA" />
                <LegendItem color="bg-amber-500" label="Minors" />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {courses.map((course: any, idx: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={course.name}
                  onClick={() => setSelectedCourse(selectedCourse?.name === course.name ? null : course)}
                  className="p-6 hover:bg-slate-50/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-slate-200">
                        {course.name}
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
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform group-hover:rotate-180 ${selectedCourse?.name === course.name ? 'border-indigo-600 text-indigo-600' : 'border-slate-100 text-slate-300'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Multi-Component Progress Bar */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div style={{ width: `${(course.mse / 150) * 100}%` }} className="h-full bg-indigo-500 transition-all duration-1000" />
                    <div style={{ width: `${(course.gcbaa / 150) * 100}%` }} className="h-full bg-emerald-500 transition-all duration-1000" />
                    <div style={{ width: `${(15 - (course.mse + course.gcbaa) / 10)}%` }} className="h-full bg-amber-500 transition-all duration-1000" />
                  </div>

                  <AnimatePresence>
                    {selectedCourse?.name === course.name && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                          <GradeStrikeBox 
                            label="Target 'S' (190+)" 
                            value={getESEThreshold(course.cie, 190)} 
                            sub="ESE Points Needed"
                          />
                          <GradeStrikeBox 
                            label="Target 'A+' (175+)" 
                            value={getESEThreshold(course.cie, 175)} 
                            sub="ESE Points Needed"
                          />
                          <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-50">AI Strategy</p>
                            <p className="text-xs font-medium leading-relaxed italic">
                              {course.mse > 40 ? 'High MSE stability. Focus on Practicum documentation for max ROI.' : 'MSE gap identified. Double down on End-Sem Theory prep.'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles size={120} />
            </div>
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Zap className="text-indigo-400" />
              Strategic ROI
            </h3>
            <div className="space-y-6 mb-8">
              <ROIItem label="Theory Stability" value={82} color="bg-indigo-500" />
              <ROIItem label="Activity Efficiency" value={94} color="bg-emerald-500" />
              <ROIItem label="Exam Reliability" value={71} color="bg-amber-500" />
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] text-slate-400 italic">
              AI Suggestion: Your **SEA/Practicum** scores are elite. Maintaining this in Year 2 will secure your Honors Track eligibility regardless of minor MSE fluctuations.
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/40">
            <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2 tracking-tight">
              <Activity className="text-rose-500" size={20} />
              URR24 Regulation Auditor
            </h3>
            <div className="space-y-4">
              <RegulationRow 
                clause="Clause 4.1" 
                title="Attendance Compliance" 
                desc="Attendance matches CIE mark weightage." 
                status="COMPLIANT" 
              />
              <RegulationRow 
                clause="Clause 5.2" 
                title="Year-3 Promotion" 
                desc="Credit threshold check for next year." 
                status="ON-TRACK" 
              />
              <RegulationRow 
                clause="Clause 6.1" 
                title="Honors Eligibility" 
                desc="Zero backlog and CGPA > 7.0 check." 
                status="VERIFIED" 
              />
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center gap-2">
              <Info size={14} /> Full Regulation PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditCard: React.FC<{label: string, value: string, color: string, icon: React.ReactNode}> = ({label, value, color, icon}) => (
  <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`w-10 h-10 rounded-2xl bg-slate-50 ${color} flex items-center justify-center`}>
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
  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/50">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${value === 'Unreachable' ? 'text-rose-500' : 'text-slate-800'}`}>{value}</p>
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
      <motion.div 
        initial={{ width: 0 }} animate={{ width: `${value}%` }}
        className={`h-full ${color} rounded-full`} 
      />
    </div>
  </div>
);

const RegulationRow: React.FC<{clause: string, title: string, desc: string, status: string}> = ({clause, title, desc, status}) => (
  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
    <div className="flex justify-between items-start mb-1">
      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{clause}</span>
      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{status}</span>
    </div>
    <h5 className="text-sm font-black text-slate-800 mb-1">{title}</h5>
    <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default AcademicLedger;
