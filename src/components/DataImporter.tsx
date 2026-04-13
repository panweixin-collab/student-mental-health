import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';

interface StudentData {
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

interface DataImporterProps {
  onDataImport: (data: StudentData[]) => void;
  hasData: boolean;
}

export default function DataImporter({ onDataImport, hasData }: DataImporterProps) {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = [
      {
        '学生姓名/学号': '张小明',
        '学校': '阳光小学',
        '班级': '二年级1班',
        '家长手机号': '13800138001',
        '问卷得分': 78,
        '风险等级': '低风险',
        '情绪类型': '平静',
        '情绪强度': 6,
        'AI使用日期': '2025-03-20',
        'AI使用时长(分钟)': 15
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '学生数据模板');
    XLSX.writeFile(wb, '学生心理健康数据模板.xlsx');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError('Excel文件为空');
          return;
        }

        const mapRiskLevel = (level: string): StudentData['riskLevel'] => {
          const normalized = String(level).trim().toLowerCase();
          if (normalized.includes('高')) return '需干预';
          if (normalized.includes('中')) return '需关注';
          if (normalized.includes('低')) return '良好';
          if (normalized === '优秀') return '优秀';
          return '一般';
        };

        const mapEmotionType = (emotion: string): StudentData['emotionType'] => {
          const normalized = String(emotion).trim();
          if (['快乐', '开心', '兴奋', '愉快', '高兴', '激动'].includes(normalized)) return '开心';
          if (['平静', '平和', '稳定'].includes(normalized)) return '平静';
          if (['焦虑', '紧张', '担忧'].includes(normalized)) return '焦虑';
          if (['沮丧', '低落', '难过', '悲伤'].includes(normalized)) return '沮丧';
          if (['愤怒', '生气', '烦躁'].includes(normalized)) return '愤怒';
          if (['疲惫', '累', '困倦'].includes(normalized)) return '疲惫';
          return '平静';
        };

        const formatDate = (dateValue: any): string => {
          if (!dateValue) return new Date().toISOString().split('T')[0];
          if (typeof dateValue === 'number') {
            const excelEpoch = new Date(1899, 11, 30);
            const date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
            return date.toISOString().split('T')[0];
          }
          const dateStr = String(dateValue);
          if (dateStr.includes(' ')) return dateStr.split(' ')[0];
          return dateStr;
        };

        const students: StudentData[] = jsonData.map((row: any, index: number) => ({
          id: `S${String(index + 1).padStart(3, '0')}`,
          name: String(row['学生姓名/学号'] || row['学生姓名'] || row['姓名'] || '').trim(),
          school: String(row['学校'] || '').trim(),
          class: String(row['班级'] || '').trim(),
          parentPhone: String(row['家长手机号'] || row['手机号'] || '').trim(),
          questionnaireScore: Number(row['问卷得分'] || row['得分'] || 0),
          riskLevel: mapRiskLevel(row['风险等级']),
          emotionType: mapEmotionType(row['情绪类型']),
          emotionIntensity: Number(row['情绪强度'] || 5),
          aiUsageDate: formatDate(row['AI使用日期'] || row['日期']),
          aiUsageDuration: Number(row['AI使用时长(分钟)'] || row['AI使用时长'] || 0),
          aiSatisfaction: Number(row['AI满意度(1-5)'] || row['AI满意度'] || 3)
        }));

        onDataImport(students);
        setSuccess(`成功导入 ${students.length} 条学生数据！`);
        localStorage.setItem('studentData', JSON.stringify(students));
      } catch (err) {
        setError('文件解析失败，请检查Excel格式');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileSpreadsheet className="w-5 h-5" />
        数据导入
      </h2>
      
      {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4">{success}</div>}

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-blue-900 mb-2">使用说明</h4>
        <ol className="text-sm text-blue-800 list-decimal list-inside">
          <li>先下载Excel模板</li>
          <li>按照模板格式填写学生数据</li>
          <li>上传填写好的Excel文件</li>
        </ol>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={downloadTemplate}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          下载Excel模板
        </button>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload className="w-4 h-4" />
          上传Excel文件
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {hasData && (
        <div className="text-center text-green-600 text-sm mt-4">
          已有数据，可以开始使用系统了！
        </div>
      )}
    </div>
  );
}
