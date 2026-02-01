import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, LineChart, Line } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, MoreHorizontal, Briefcase, Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';
import { ACADEMIC_EVENTS, PLACEMENT_ALERTS } from '../constants';
import { motion } from 'framer-motion';

interface DashboardProps {
  studentData: any;
  onSyncClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ studentData, onSyncClick }) => {
  // Attendance data for chart
  const attendanceData = [
    { name: 'Mon', value: 85 },
    { name: 'Tue', value: 92 },
    { name: 'Wed', value: studentData.attendance || 0 },
    { name: 'Thu', value: 78 },
    { name: 'Fri', value: 88 },
  ];

  // Difficulty/performance data for radar chart
  const difficultyData = studentData.courses?.map((course: any) => {
    const cieTotal = course.minors[0] + course.minors[1] + course.mse + course.gcbaa;
    const percentage = ((cieTotal / 150) * 100);
    return {
      subject: course.name,
      A: percentage,
      fullMark: 100
    };
  }) || [
    { subject: 'DAA', A: 85, fullMark: 100 },
    { subject: 'OS', A: 70, fullMark: 100 },
    { subject: 'DBMS', A: 45, fullMark: 100 },
    { subject: 'COA', A: 90, fullMark: 100 },
    { subject: 'M-III', A: 65, fullMark: 100 },
  ];

  // CGPA trend data (semester-wise)
  const cgpaTrend = [
    { semester: 'S1', cgpa: 8.2 },
    { semester: 'S2', cgpa: studentData.cgpa || 8.84 },
    { semester: 'S3', cgpa: 8.9 },
    { semester: 'S4', cgpa: 8.7 },
  ];

  // Subject-wise grade distribution
  const gradeData = studentData.courses?.map((course: any) => {
    const cieTotal = course.minors[0] + course.minors[1] + course.mse + course.gcbaa;
    const percentage = ((cieTotal / 150) * 100).toFixed(1);
    return {
      subject: course.name,
      percentage: parseFloat(percentage),
      cie: cieTotal
    };
  }) || [];

  // Upcoming events (next 3-4)
  const upcomingEvents = ACADEMIC_EVENTS.slice(0, 3);
  
  // Top placement opportunities
  const topPlacements = PLACEMENT_ALERTS.filter(p => p.match >= 70).slice(0, 3);

  // Calculate credits earned
  const creditsEarned = (studentData.semester || 1) * 16;

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

      {/* Upcoming Events Section */}
      <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-800 text-lg tracking-tight flex items-center gap-2">
            <Calendar className="text-indigo-600" size={20} />
            Upcoming Events
          </h3>
          <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => {
            const eventDate = new Date(event.date);
            const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-indigo-50 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-black text-indigo-600 uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                  <span className="text-xl font-black text-indigo-900">{eventDate.getDate()}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 mb-1">{event.event}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      event.type === 'exam' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {daysUntil > 0 ? `${daysUntil} days away` : 'Today'}
                    </span>
                  </div>
                </div>
                <Clock size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Placement Opportunities */}
      {topPlacements.length > 0 && (
        <div className="glass rounded-[2rem] p-8 border border-white/40 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-800 text-lg tracking-tight flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={20} />
              Top Placement Matches
            </h3>
            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPlacements.map((placement, idx) => (
              <motion.div
                key={placement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm mb-1">{placement.company}</h4>
                    <p className="text-xs text-slate-500 font-medium">{placement.role}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                    placement.match >= 90 ? 'bg-emerald-100 text-emerald-700' :
                    placement.match >= 80 ? 'bg-indigo-100 text-indigo-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {placement.match}% match
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {placement.stipend && (
                    <p className="text-xs font-bold text-slate-700">💰 {placement.stipend}</p>
                  )}
                  {placement.lpa && (
                    <p className="text-xs font-bold text-slate-700">💰 {placement.lpa}</p>
                  )}
                  <p className="text-[10px] text-slate-400">Deadline: {new Date(placement.deadline).toLocaleDateString()}</p>
                </div>
                <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors group-hover:gap-2 flex items-center justify-center gap-1">
                  Apply <ArrowRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-indigo-500"
        >
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
        </motion.div>
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