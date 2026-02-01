
import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Download, Clock, AlertTriangle, CheckCircle2, BookOpen, Target } from 'lucide-react';
import { ACADEMIC_EVENTS } from '../constants.ts';
import { motion } from 'framer-motion';

const ExamHub: React.FC = () => {
  const [studyProgress, setStudyProgress] = useState<{[key: string]: boolean}>({});
  
  const examEvents = ACADEMIC_EVENTS.filter(e => e.type === 'exam');
  const nextExam = examEvents[0];
  
  const calculateDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntil = nextExam ? calculateDaysUntil(nextExam.date) : 0;

  // Study topics (mock data - in real app, this would come from studentData)
  const studyTopics = [
    { subject: 'DAA', topics: ['Graph Algorithms', 'Dynamic Programming', 'Greedy Algorithms'], completed: 0 },
    { subject: 'OS', topics: ['Process Scheduling', 'Memory Management', 'File Systems'], completed: 0 },
    { subject: 'DBMS', topics: ['Normalization', 'SQL Queries', 'Transactions'], completed: 0 },
  ];

  const toggleTopic = (subject: string, topic: string) => {
    const key = `${subject}-${topic}`;
    setStudyProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Countdown Timer */}
      {nextExam && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2rem] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Clock size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-amber-300" />
              <span className="text-xs font-black uppercase tracking-widest">Next Exam</span>
            </div>
            <h2 className="text-3xl font-black mb-2">{nextExam.event}</h2>
            <div className="flex items-center gap-6 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <p className="text-4xl font-black">{daysUntil > 0 ? daysUntil : 0}</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-1">Days Left</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <p className="text-4xl font-black">{new Date(nextExam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                <p className="text-xs font-bold uppercase tracking-widest mt-1">Exam Date</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Calendar className="text-indigo-600" />
              Academic Calendar
            </h3>
            <div className="space-y-4">
              {ACADEMIC_EVENTS.map((item, idx) => {
                const days = calculateDaysUntil(item.date);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                      <span className="text-[10px] font-black text-slate-400 uppercase leading-none">{item.date.split('-')[1]}</span>
                      <span className="text-2xl font-black text-slate-800">{item.date.split('-')[2]}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.event}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${item.type === 'exam' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {days > 0 ? `${days} days away` : days === 0 ? 'Today' : 'Past'}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                      <Bell size={20} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Study Planner */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <BookOpen className="text-indigo-600" />
              Preparation Tracker
            </h3>
            <div className="space-y-6">
              {studyTopics.map((subject, idx) => {
                const completed = subject.topics.filter(t => studyProgress[`${subject.subject}-${t}`]).length;
                const progress = (completed / subject.topics.length) * 100;
                return (
                  <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-black text-slate-800">{subject.subject}</h4>
                      <span className="text-xs font-black text-indigo-600">{completed}/{subject.topics.length} Topics</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="space-y-2">
                      {subject.topics.map((topic, tIdx) => {
                        const isCompleted = studyProgress[`${subject.subject}-${topic}`];
                        return (
                          <button
                            key={tIdx}
                            onClick={() => toggleTopic(subject.subject, topic)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                              isCompleted 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200'
                            }`}
                          >
                            <CheckCircle2 
                              size={18} 
                              className={isCompleted ? 'text-emerald-600 fill-emerald-600' : 'text-slate-300'} 
                            />
                            <span className="text-sm font-medium flex-1 text-left">{topic}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
              Missing an exam? Under URR24 Clause 6.4, you are eligible for Make-up exams if your attendance is &gt;75%.
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
