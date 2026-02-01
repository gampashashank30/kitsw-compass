
import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './modules/Dashboard.tsx';
import AttendanceModule from './modules/AttendanceModule.tsx';
import AIAdvisor from './modules/AIAdvisor.tsx';
import DigitalTwin from './modules/DigitalTwin.tsx';
import Simulator from './modules/Simulator.tsx';
import PlacementPulse from './modules/PlacementPulse.tsx';
import ExamHub from './modules/ExamHub.tsx';
import AcademicLedger from './modules/AcademicLedger.tsx';
import ProfileSyncModal from './components/ProfileSyncModal.tsx';
import { MOCK_STUDENT_DATA } from './constants.ts';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentData, setStudentData] = useState(MOCK_STUDENT_DATA);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const handleSync = (newData: any) => {
    setStudentData(prev => ({
      ...prev,
      ...newData
    }));
    setIsSyncModalOpen(false);
    setActiveTab('academic-ledger'); // Switch to results view after sync
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard studentData={studentData} onSyncClick={() => setIsSyncModalOpen(true)} />;
      case 'attendance': return <AttendanceModule studentData={studentData} />;
      case 'ai-advisor': return <AIAdvisor studentData={studentData} />;
      case 'digital-twin': return <DigitalTwin studentData={studentData} />;
      case 'simulator': return <Simulator />;
      case 'placement': return <PlacementPulse studentData={studentData} />;
      case 'exams': return <ExamHub />;
      case 'academic-ledger': return <AcademicLedger studentData={studentData} />;
      default: return <Dashboard studentData={studentData} onSyncClick={() => setIsSyncModalOpen(true)} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        studentData={studentData}
        onSyncProfile={() => setIsSyncModalOpen(true)}
      >
        {renderContent()}
      </Layout>

      <AnimatePresence>
        {isSyncModalOpen && (
          <ProfileSyncModal 
            onClose={() => setIsSyncModalOpen(false)} 
            onSync={handleSync} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
