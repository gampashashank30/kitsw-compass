import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './modules/Dashboard';
import AttendanceModule from './modules/AttendanceModule';
import AIAdvisor from './modules/AIAdvisor';
import DigitalTwin from './modules/DigitalTwin';
import Simulator from './modules/Simulator';
import PlacementPulse from './modules/PlacementPulse';
import ExamHub from './modules/ExamHub';
import AcademicLedger from './modules/AcademicLedger';
import ProfileSyncModal from './components/ProfileSyncModal';
import { MOCK_STUDENT_DATA } from './constants';
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
    setActiveTab('academic-ledger');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard studentData={studentData} onSyncClick={() => setIsSyncModalOpen(true)} />;
      case 'attendance': return <AttendanceModule studentData={studentData} />;
      case 'ai-advisor': return <AIAdvisor studentData={studentData} />;
      case 'digital-twin': return <DigitalTwin studentData={studentData} />;
      case 'simulator': return <Simulator studentData={studentData} />;
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