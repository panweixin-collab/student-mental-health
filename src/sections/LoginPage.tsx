import { useState } from 'react';
import { Building2, Users, GraduationCap, Stethoscope } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'hospital' | 'parent' | 'teacher') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'hospital' | 'parent' | 'teacher' | null>(null);

  const roles = [
    {
      id: 'hospital' as const,
      title: '医院端',
      description: '查看所有学校学生数据',
      icon: Stethoscope,
      color: 'bg-blue-500',
    },
    {
      id: 'parent' as const,
      title: '家长端',
      description: '查看自己孩子的数据',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      id: 'teacher' as const,
      title: '教师端',
      description: '查看学校班级学生数据',
      icon: GraduationCap,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">学生心理健康数据管理系统</h1>
          </div>
          <p className="text-gray-600">学生心理健康数据管理平台</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <div
                key={role.id}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
                  isSelected ? 'ring-4 ring-blue-400 scale-105' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{role.title}</h3>
                  <p className="text-gray-500 text-sm mt-2">{role.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {selectedRole && (
          <div className="text-center">
            <button
              onClick={() => onLogin(selectedRole)}
              className="px-12 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              进入系统
            </button>
          </div>
        )}

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>学生心理健康数据管理平台</p>
        </div>
      </div>
    </div>
  );
}
