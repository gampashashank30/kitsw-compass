import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, MoreHorizontal, Briefcase, Sparkles } from 'lucide-react';

interface DashboardProps {
  studentData: any;
  onSyncClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ studentData, onSyncClick }) => {
  const attendanceData = [
    { name: 'Mon', value: 85 },
    { name: 'Tue', value: 92 },
    { name: 'Wed', value: studentData.attendance || 0 },
    { name: 'Thu', value: 78 },
    { name: 'Fri', value: 88 },
  ];

  const difficultyData = [
    { subject: 'DAA', A: 85, fullMark: 100 },
    { subject: 'OS', A: 70, fullMark: 100 },
    { subject: 'DBMS', A: 45, fullMark: 100 },
    { subject: 'COA', A: 90, fullMark: 100 },
    { subject: 'M-III', A: 65, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall Attendance" value={`${studentData.attendance}%`} status={studentData.attendance < 75 ? "warning" : "success"} subtitle={studentData.attendance < 75 ? `${(75 - studentData.attendance).toFixed(1)}% below safe margin` : "Above safety threshold"} />
        <StatCard title="Current CGPA" value={studentData.cgpa} status="success" subtitle={`Top percentile of ${studentData.branch}`} />
        <StatCard title="Active Backlogs" value={studentData.backlogs} status={studentData.backlogs > 0 ? "danger" : "success"} subtitle={studentData.backlogs > 0 ? "Requires attention" : "Eligible for Promotion"} />
        <StatCard title="Credits Earned" value={`${studentData.semester * 16} / 160`} status="neutral" subtitle={`Semester ${studentData.semester} Sync Active`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 text-lg tracking-tight">Engagement Trajectory</h3>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors"><MoreHorizontal /></button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px'}}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {attendanceData.map((entry, index) => (
                    <Cell key={index} fill={entry.value < 75 ? '#f43f5e' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg flex flex-col">
          <h3 className="font-black text-slate-800 text-lg mb-8 tracking-tight">Cognitive Map</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={difficultyData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: '800'}} />
                <Radar
                  name="Difficulty"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-6 font-bold uppercase tracking-widest italic leading-relaxed">
            Personalized for {studentData.branch} URR24 Track
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={onSyncClick} 
          className="text-left bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl hover:shadow-indigo-500/20 transition-all border border-slate-800"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 transition-opacity duration-500 group-hover:rotate-12">
            <Sparkles size={160} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tighter">AI Profile Sync <Sparkles size={24} className="text-indigo-400 animate-pulse" /></h3>
            <p className="text-slate-400 mb-8 text-sm max-w-xs font-medium leading-relaxed">Instantly update your attendance, CGPA, and personal details using Gemini Vision.</p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all group-hover:gap-5">
              Sync Now <TrendingUp size={16} />
            </div>
          </div>
        </button>

        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-indigo-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Briefcase size={160} />
          </div>
          <h3 className="text-2xl font-black mb-3 tracking-tighter">Placement Pulse</h3>
          <p className="text-indigo-100 mb-8 text-sm max-w-xs font-medium leading-relaxed">
            {studentData.cgpa >= 8.0 ? 'Elite' : 'Active'} opportunities matched for {studentData.branch} Semester {studentData.semester} students.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-700/20">
            Check Matches
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string | number, status: string, subtitle: string}> = ({title, value, status, subtitle}) => {
  const statusColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-indigo-500',
  };
  return (
    <div className="glass rounded-[2rem] p-7 transition-all hover:translate-y-[-6px] hover:shadow-2xl group border border-white/40">
      <div className="flex justify-between items-start mb-5">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</span>
        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-slate-300'} shadow-sm`} />
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-black text-slate-800 tracking-tighter">{value}</span>
        {status === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
        {(status === 'warning' || status === 'danger') && <AlertCircle size={18} className={status === 'warning' ? 'text-amber-500' : 'text-rose-500'} />}
      </div>
      <p className="text-[11px] font-bold text-slate-500 leading-tight">{subtitle}</p>
    </div>
  );
};

export default Dashboard;