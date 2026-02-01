
import React, { useState } from 'react';
import { LayoutDashboard, Calendar, MessageSquare, Target, User, BarChart3, GraduationCap, Briefcase, Menu, X, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentData: any;
  onSyncProfile: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'academic-ledger', label: 'Academic Ledger', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', icon: BarChart3 },
  { id: 'simulator', label: 'Simulator', icon: Target },
  { id: 'ai-advisor', label: 'AI Advisor', icon: MessageSquare },
  { id: 'digital-twin', label: 'Digital Twin', icon: GraduationCap },
  { id: 'placement', label: 'Placements', icon: Briefcase },
  { id: 'exams', label: 'Exam Hub', icon: Calendar },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, studentData, onSyncProfile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">K</div>
          <h1 className="font-bold text-slate-800 text-lg leading-tight tracking-tight">KITSW<br /><span className="text-indigo-600">Compass</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-medium translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button
            onClick={onSyncProfile}
            className="w-full mb-4 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors"
          >
            <Sparkles size={14} /> AI Profile Sync
          </button>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border-2 border-white shadow-sm">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`} alt="Avatar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{studentData.name || 'Student'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{studentData.rollNumber || 'Not Synced'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden md:flex items-center gap-3 mr-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800">{studentData.name}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{studentData.rollNumber}</span>
              </div>

              <div className="flex gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                  <Sparkles size={10} /> {studentData.cgpa} CGPA
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${studentData.attendance >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {studentData.attendance}% Att.
                </div>
              </div>
            </div>

            <button
              onClick={onSyncProfile}
              className="p-2 rounded-xl bg-slate-100 text-indigo-600 hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
              title="Sync Profile"
            >
              <Sparkles size={20} />
            </button>

            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 overflow-hidden border border-slate-200">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`} alt="Avatar" className="w-full h-full" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[60] flex flex-col lg:hidden shadow-2xl"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">K</div>
                    <h1 className="font-bold text-slate-800 text-lg">Compass</h1>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                    <X size={24} />
                  </button>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === item.id
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;
