
import React from 'react';
import { Briefcase, MapPin, Calendar, ArrowUpRight, CheckCircle2, Star, Sparkles, Filter, Lock } from 'lucide-react';
import { PLACEMENT_ALERTS } from '../constants.ts';

interface PlacementPulseProps {
  studentData: any;
}

const PlacementPulse: React.FC<PlacementPulseProps> = ({ studentData }) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Opportunity Pulse</h2>
          <p className="text-slate-500 text-sm">Automated matching for {studentData.branch} Semester {studentData.semester} students.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Sparkles size={16} /> Resume Builder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {PLACEMENT_ALERTS.map((job: any) => {
            const isEligible = studentData.cgpa >= (job.minCgpa || 0);
            return (
              <div key={job.id} className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all group relative overflow-hidden ${!isEligible ? 'opacity-60 saturate-50' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'}`}>
                {!isEligible && (
                  <div className="absolute inset-0 bg-slate-50/10 backdrop-blur-[1px] flex items-center justify-center z-20">
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl">
                      <Lock size={12} /> CGPA Locked (Min: {job.minCgpa})
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {job.company[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{job.role}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-bold text-slate-600">{job.company}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                          {'stipend' in job ? job.stipend : 'lpa' in job ? job.lpa : 'TBD'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-black ${isEligible ? 'text-emerald-600' : 'text-slate-400'} flex items-center justify-end gap-1`}>
                      <Star size={14} fill="currentColor" /> {job.match}% Match
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1 block">Based on Skill Profile</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex gap-4 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1"><MapPin size={14} /> Global</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> Ends: {job.deadline}</span>
                  </div>
                  {isEligible && (
                    <button className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                      Apply Now <ArrowUpRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <h4 className="text-lg font-black mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" />
              Eligibility Tracker
            </h4>
            <div className="space-y-6">
              <EligibilityItem label="CGPA Threshold" value={studentData.cgpa} target={7.5} />
              <EligibilityItem label="Attendance Compliance" value={studentData.attendance} target={75} />
              <EligibilityItem label="Backlog Count" value={studentData.backlogs} target={0} reverse />
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors border border-white/10">
              Refresh skill map
            </button>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
            <h4 className="text-emerald-900 font-black text-sm mb-4">Talent Scout Recommendation</h4>
            <p className="text-emerald-700 text-xs leading-relaxed italic">
              "{studentData.name.split(' ').pop()}, your {studentData.cgpa} CGPA in {studentData.branch} puts you in the elite bracket for Tier-1 placements. Focus on NPTEL certifications to maintain this edge."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EligibilityItem: React.FC<{label: string, value: number, target: number, reverse?: boolean}> = ({label, value, target, reverse}) => {
  const isPassing = reverse ? value <= target : value >= target;
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium opacity-80">{label}</span>
      <span className={`text-xs font-black uppercase tracking-widest ${isPassing ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPassing ? 'Pass' : 'Warning'}
      </span>
    </div>
  );
};

export default PlacementPulse;
