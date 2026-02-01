
import React, { useState, useEffect } from 'react';
import { Info, Calculator, Flame } from 'lucide-react';
import { URR24_POLICIES } from '../constants.ts';

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
    let extraNeeded = 0;
    while (((attended + extraNeeded) / (total + extraNeeded)) * 100 < 75) {
      extraNeeded++;
    }
    return extraNeeded;
  };

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
            Condonation Survival
          </h4>
          <div className="space-y-4">
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
