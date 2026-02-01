
import React from 'react';
import { Calendar, Bell, Download, Clock, AlertTriangle } from 'lucide-react';
import { ACADEMIC_EVENTS } from '../constants';

const ExamHub: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Calendar className="text-indigo-600" />
              Academic Countdown
            </h3>
            <div className="space-y-4">
              {ACADEMIC_EVENTS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{item.date.split('-')[1]}</span>
                    <span className="text-2xl font-black text-slate-800">{item.date.split('-')[2]}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{item.event}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full mt-1 inline-block ${item.type === 'exam' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                      {item.type}
                    </span>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                    <Bell size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100">
            <div className="flex items-center gap-3 text-rose-700 font-black text-sm mb-4">
              <AlertTriangle size={20} />
              CRITICAL DEADLINES
            </div>
            <div className="space-y-4">
              <DeadlineBox label="MSE-II Answer Script" date="Tomorrow, 4 PM" />
              <DeadlineBox label="Revaluation Request (Sem 3)" date="May 12, 2024" />
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 text-white">
            <Clock className="text-indigo-200 mb-4" size={32} />
            <h4 className="text-lg font-black mb-2 tracking-tight">Make-up & Improvement</h4>
            <p className="text-indigo-100 text-xs leading-relaxed mb-6">
              Missing an exam? Under URR24 Clause 6.4, you are eligible for Make-up exams if your attendance is >75%.
            </p>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
              Check Eligibility
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest">
          <Download className="text-slate-400" />
          Resources Vault
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard title="URR24 Full Regulations" type="PDF" size="2.4 MB" />
          <ResourceCard title="Previous ESE Papers (CSE)" type="ZIP" size="45 MB" />
          <ResourceCard title="MSE-II Syllabus (Sem 4)" type="DOCX" size="120 KB" />
        </div>
      </div>
    </div>
  );
};

const DeadlineBox: React.FC<{label: string, date: string}> = ({label, date}) => (
  <div className="bg-white/60 p-4 rounded-2xl border border-rose-200/50">
    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-rose-900">{date}</p>
  </div>
);

const ResourceCard: React.FC<{title: string, type: string, size: string}> = ({title, type, size}) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all cursor-pointer group">
    <div>
      <h4 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{title}</h4>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{type} • {size}</p>
    </div>
    <Download size={18} className="text-slate-300 group-hover:text-indigo-600" />
  </div>
);

export default ExamHub;
