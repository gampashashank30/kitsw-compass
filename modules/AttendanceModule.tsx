
import React, { useState, useEffect } from 'react';
import { Info, Calculator, Flame, Calendar, TrendingUp, AlertTriangle, BarChart as BarChartIcon } from 'lucide-react';
import { URR24_POLICIES } from '../constants.ts';
import { calculateAttendanceRequired, checkCondonationEligibility, calculateClassesToAttend } from '../utils/calculations';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface AttendanceModuleProps {
  studentData: any;
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ studentData }) => {
  const totalDays = URR24_POLICIES.ATTENDANCE.TOTAL_WORKING_DAYS;
  const initialAttended = Math.round((studentData.attendance / 100) * totalDays);
  const [attended, setAttended] = useState(initialAttended);
  const [total, setTotal] = useState(totalDays);

  useEffect(() => {
    setAttended(Math.round((studentData.attendance / 100) * total));
  }, [studentData.attendance, total]);

  const percentage = (attended / total) * 100;
  const isSafe = percentage >= URR24_POLICIES.ATTENDANCE.MIN_REQUIRED;
  const isCondonation = percentage >= URR24_POLICIES.ATTENDANCE.CONDONATION_MIN && percentage < URR24_POLICIES.ATTENDANCE.MIN_REQUIRED;

  const getBunksLeft = () => {
    let currentBunks = 0;
    while (((attended) / (total + currentBunks + 1)) * 100 >= 75) {
      currentBunks++;
    }
    return currentBunks;
  };

  const getNeededClasses = () => {
    return calculateAttendanceRequired(percentage, 75, total);
  };

  const condonationStatus = checkCondonationEligibility(percentage);
  
  // Subject-wise attendance (mock data - in real app, this would come from studentData)
  const subjectAttendance = studentData.courses?.map((course: any) => {
    const baseAttendance = percentage + (Math.random() * 10 - 5); // Vary by ±5%
    return {
      subject: course.name,
      attendance: Math.max(0, Math.min(100, baseAttendance)),
      status: baseAttendance >= 75 ? 'safe' : (baseAttendance >= 65 ? 'condonation' : 'danger')
    };
  }) || [];

  // Attendance trend over semester (mock data)
  const attendanceTrend = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    attendance: Math.max(65, percentage - 5 + (i * 2) + (Math.random() * 5 - 2.5))
  }));

  // Prediction: What if I miss X more classes?
  const [missedClasses, setMissedClasses] = useState(0);
  const predictedAttendance = ((attended) / (total + missedClasses)) * 100;
  
  // Prediction: How many classes to reach target?
  const [targetAttendance, setTargetAttendance] = useState(80);
  const classesNeeded = calculateClassesToAttend(percentage, targetAttendance, total, attended);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="14" fill="none" />
              <circle 
                cx="96" cy="96" r="88" stroke={isSafe ? '#10b981' : (isCondonation ? '#f59e0b' : '#ef4444')} 
                strokeWidth="14" fill="none" strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - percentage/100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800 tracking-tighter">{percentage.toFixed(1)}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Attendance</span>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                Status: {isSafe ? 'Safe Zone' : (isCondonation ? 'Condonation Risk' : 'Detention Imminent')}
              </h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                URR24 Regulation 4.1 applied for <strong>{studentData.name}</strong>. You have attended {attended} out of {total} estimated classes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Target 75%</p>
                <p className={`text-2xl font-black ${getNeededClasses() > 0 ? 'text-indigo-600' : 'text-emerald-500'}`}>
                  {getNeededClasses() > 0 ? `+${getNeededClasses()}` : 'GOAL MET'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold">Classes required</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Safe Bunks</p>
                <p className="text-2xl font-black text-slate-800">{getBunksLeft()}</p>
                <p className="text-[10px] text-slate-400 font-bold">Classes missable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
          <h4 className="flex items-center gap-2 font-black text-slate-800 mb-6 uppercase tracking-widest text-xs">
            <Calculator size={16} className="text-indigo-600" />
            Bunk Simulator
          </h4>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-4">
                <label className="text-xs font-bold text-slate-500">Manual Attendance Input</label>
                <span className="text-xs font-black text-indigo-600">{attended} / {total}</span>
              </div>
              <input 
                type="range" min="0" max={total} value={attended} 
                onChange={(e) => setAttended(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-3 block">Semester Working Days</label>
              <input 
                type="number" value={total} 
                onChange={(e) => setTotal(parseInt(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Flame size={120} />
          </div>
          <h4 className="flex items-center gap-2 font-black mb-6 uppercase tracking-widest text-xs">
            <Flame size={16} className="text-amber-400" />
            Condonation Status
          </h4>
          <div className="space-y-4 mb-6">
            <div className={`p-4 rounded-xl ${condonationStatus.eligible ? 'bg-amber-500/20 border border-amber-400/30' : 'bg-slate-800/50 border border-slate-700'}`}>
              <p className="text-sm font-bold mb-1">{condonationStatus.eligible ? '✅ Eligible for Condonation' : '❌ Not Eligible'}</p>
              <p className="text-xs text-indigo-200 leading-relaxed">{condonationStatus.reason}</p>
            </div>
            <SurvivalStep number="01" text="Maintain >65% for medical eligibility." />
            <SurvivalStep number="02" text="Authored medical certificate required." />
            <SurvivalStep number="03" text="Pay fee within 7 days of Sem-End." />
          </div>
          <div className="mt-8 p-4 bg-white/5 rounded-2xl text-[10px] text-indigo-200 italic flex items-start gap-2 border border-white/10 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5" />
            Simulation based on official URR24 regulations published by KITSW Dean Academic Affairs.
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
        <h3 className="font-black text-slate-800 text-lg mb-6 tracking-tight flex items-center gap-2">
          <BarChartIcon size={20} className="text-indigo-600" />
          Subject-wise Attendance
        </h3>
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectAttendance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
              <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} width={120} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', padding: '10px'}}
                formatter={(value: any) => `${value.toFixed(1)}%`}
              />
              <Bar dataKey="attendance" radius={[0, 8, 8, 0]} barSize={30}>
                {subjectAttendance.map((entry: any, index: number) => (
                  <Cell key={index} fill={
                    entry.status === 'safe' ? '#10b981' : 
                    entry.status === 'condonation' ? '#f59e0b' : 
                    '#ef4444'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {subjectAttendance.map((subject: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-white rounded-xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">{subject.subject}</span>
                <span className={`text-xs font-black ${
                  subject.status === 'safe' ? 'text-emerald-600' :
                  subject.status === 'condonation' ? 'text-amber-600' :
                  'text-rose-600'
                }`}>
                  {subject.attendance.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    subject.status === 'safe' ? 'bg-emerald-500' :
                    subject.status === 'condonation' ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${subject.attendance}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Attendance Trend Chart */}
      <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
        <h3 className="font-black text-slate-800 text-lg mb-6 tracking-tight flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-600" />
          Attendance Trend (Semester)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
              <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', padding: '10px'}}
                formatter={(value: any) => `${value.toFixed(1)}%`}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={() => 75} 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prediction Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
          <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2">
            <Calculator size={18} className="text-indigo-600" />
            What if I miss X more classes?
          </h4>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-3 block">Additional Classes to Miss</label>
              <input 
                type="number" 
                min="0" 
                max={total - attended}
                value={missedClasses}
                onChange={(e) => setMissedClasses(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Predicted Attendance</p>
              <p className={`text-3xl font-black ${predictedAttendance >= 75 ? 'text-emerald-600' : (predictedAttendance >= 65 ? 'text-amber-600' : 'text-rose-600')}`}>
                {predictedAttendance.toFixed(1)}%
              </p>
              {predictedAttendance < 75 && (
                <p className="text-xs text-slate-500 mt-2">
                  {predictedAttendance >= 65 ? '⚠️ Condonation eligible' : '❌ Detention risk'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
          <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2">
            <Target size={18} className="text-indigo-600" />
            How many classes to reach target?
          </h4>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-3 block">Target Attendance %</label>
              <input 
                type="number" 
                min="0" 
                max="100"
                value={targetAttendance}
                onChange={(e) => setTargetAttendance(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Classes Needed</p>
              <p className="text-3xl font-black text-indigo-600">
                {classesNeeded.classesNeeded}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Estimated {classesNeeded.daysRemaining} days remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SurvivalStep: React.FC<{number: string, text: string}> = ({number, text}) => (
  <div className="flex gap-4 items-center group">
    <span className="text-lg font-black text-indigo-400/50 group-hover:text-indigo-400 transition-colors">{number}</span>
    <p className="text-sm font-medium text-indigo-100">{text}</p>
  </div>
);

export default AttendanceModule;
