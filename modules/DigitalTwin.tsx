import React, { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface DigitalTwinProps {
  studentData: any;
}

const DigitalTwin: React.FC<DigitalTwinProps> = ({ studentData }) => {
  const [backlogSimCount, setBacklogSimCount] = useState(studentData.backlogs || 0);

  const futureProjection = [
    { sem: 'Sem 1', cgpa: 8.2 },
    { sem: 'Sem 2', cgpa: 8.4 },
    { sem: 'Sem 3', cgpa: 8.3 },
    { sem: `Sem ${studentData.semester} (Cur)`, cgpa: studentData.cgpa },
    { sem: 'Sem 5', cgpa: studentData.cgpa + 0.15 },
    { sem: 'Sem 6', cgpa: studentData.cgpa + 0.3 },
    { sem: 'Sem 7', cgpa: studentData.cgpa + 0.35 },
    { sem: 'Sem 8', cgpa: studentData.cgpa + 0.4 },
  ];

  const getRiskLevel = () => {
    if (backlogSimCount === 0) return { label: 'ELITE', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (backlogSimCount < 3) return { label: 'STABLE', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { label: 'CRITICAL', color: 'text-rose-500', bg: 'bg-rose-50' };
  };

  const risk = getRiskLevel();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-indigo-600/20 blur-[100px] rounded-full" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">AI Entity: {studentData.name}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none mb-4 tracking-tighter">Academic<br />Digital Twin</h2>
            <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-md font-medium">Modeling outcomes for {studentData.branch} B.Tech based on current {studentData.cgpa} CGPA trajectory.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TwinStat label="Predicted Final CGPA" value={(studentData.cgpa + 0.42).toFixed(2)} sub="± 0.12 Variance" />
            <TwinStat label="Placement Tier" value={studentData.cgpa > 8 ? "Tier-1" : "Tier-2"} sub="92% Confidence" />
            <TwinStat label="Graduation Risk" value={`${(backlogSimCount * 1.5).toFixed(1)}%`} sub="Secure Track" />
            <TwinStat label="Promotion Status" value="Safe" sub={`SEM ${studentData.semester} Compliant`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Skills Radar Chart */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 tracking-tight">
              <TrendingUp className="text-indigo-600" />
              Skill Assessment
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: 'Programming', A: 90, fullMark: 100 },
                  { subject: 'Mathematics', A: 85, fullMark: 100 },
                  { subject: 'Electronics', A: 65, fullMark: 100 },
                  { subject: 'Communication', A: 95, fullMark: 100 },
                  { subject: 'Problem Solving', A: 88, fullMark: 100 },
                  { subject: 'Research', A: 70, fullMark: 100 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Student" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 tracking-tight">
              <TrendingUp className="text-indigo-600" />
              Outcome Probability Chart
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={futureProjection}>
                  <defs>
                    <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                  <YAxis domain={[0, 10]} hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                  />
                  <Area type="monotone" dataKey="cgpa" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorCgpa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 tracking-tight">
              <ShieldCheck className="text-emerald-500" />
              Promotion "What-If" Simulator
            </h3>
            <div className="p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100 mb-6">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-4">Simulate Backlogs for Current Semester</p>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1 w-full">
                  <input
                    type="range" min="0" max="8" value={backlogSimCount}
                    onChange={(e) => setBacklogSimCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>0 Backlogs</span>
                    <span>4 Backlogs</span>
                    <span>8 Backlogs</span>
                  </div>
                </div>
                <div className={`px-8 py-4 rounded-2xl ${risk.bg} flex flex-col items-center justify-center border border-slate-200 min-w-[140px]`}>
                  <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Status</span>
                  <span className={`text-2xl font-black ${risk.color}`}>{risk.label}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <motion.div
                key={backlogSimCount}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`p-5 rounded-2xl text-sm font-medium ${backlogSimCount > 4 ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'} border border-slate-100`}
              >
                {backlogSimCount === 0 && `Maintaining zero backlogs preserves your eligibility for First Class with Distinction and Honors tracks in ${studentData.branch}.`}
                {backlogSimCount > 0 && backlogSimCount <= 4 && `With ${backlogSimCount} backlogs, your CGPA will likely drop below 7.5. Promotion remains safe, but placement eligibility is at risk.`}
                {backlogSimCount > 4 && "CRITICAL: URR24 Promotion rules (Clause 5.2) flag 5+ backlogs as high-risk for Year 3 promotion eligibility."}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 opacity-60">Honors Probability</h4>
            <div className="relative h-4 w-full bg-white/10 rounded-full overflow-hidden mb-4 border border-white/5">
              <div className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${studentData.cgpa > 7 ? 82 : 40}%` }} />
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed font-medium">
              {studentData.cgpa > 7 ? '82%' : '40%'} probability of Honors track.
              {studentData.cgpa > 7 ? ' Maintaining CGPA > 7.0 is key.' : ' Requires immediate SGPA boost in Sem ' + studentData.semester + '.'}
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-8">Semester Load Analysis</h4>
            <div className="space-y-8">
              <LoadBar label="Math Complexity" value={85} color="bg-rose-400" />
              <LoadBar label="Coding Complexity" value={studentData.branch?.includes('CS') ? 92 : 45} color="bg-indigo-400" />
              <LoadBar label="Core Theory" value={60} color="bg-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TwinStat: React.FC<{ label: string, value: string, sub: string }> = ({ label, value, sub }) => (
  <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10">
    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{label}</p>
    <p className="text-2xl font-black mb-1">{value}</p>
    <p className="text-[10px] font-bold opacity-30">{sub}</p>
  </div>
);

const LoadBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default DigitalTwin;