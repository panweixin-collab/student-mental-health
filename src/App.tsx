import { useState, useEffect } from 'react';
import LoginPage from './sections/LoginPage';
import HospitalPage from './sections/HospitalPage';
import ParentPage from './sections/ParentPage';
import TeacherPage from './sections/TeacherPage';
import DataImporter from './components/DataImporter';

export interface StudentData {
  id: string;
  name: string;
  school: string;
  class: string;
  parentPhone: string;
  questionnaireScore: number;
  riskLevel: '优秀' | '良好' | '一般' | '需关注' | '需干预';
  emotionType: '开心' | '平静' | '焦虑' | '沮丧' | '愤怒' | '疲惫';
  emotionIntensity: number;
  aiUsageDate: string;
  aiUsageDuration: number;
  aiSatisfaction: number;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'hospital' | 'parent' | 'teacher' | null>(null);
  const [studentData, setStudentData] = useState<StudentData[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
      try {
        setStudentData(JSON.parse(savedData));
      } catch {
        console.error('Failed to parse saved data');
      }
    }
  }, []);

  const handleLogin = (role: 'hospital' | 'parent' | 'teacher') => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleDataImport = (data: StudentData[]) => {
    setStudentData(data);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  if (studentData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">学生心理健康数据管理系统</h1>
          <p className="text-gray-500 mt-2">请先导入学生数据</p>
        </div>
        <DataImporter onDataImport={handleDataImport} hasData={false} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  switch (userRole) {
    case 'hospital':
      return <HospitalPage data={studentData} onLogout={handleLogout} />;
    case 'parent':
      return <ParentPage data={studentData} onLogout={handleLogout} />;
    case 'teacher':
      return <TeacherPage data={studentData} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} />;
  }
}

export default App;
