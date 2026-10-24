import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Download,
  Share2,
  ChevronDown,
  Settings,
  Cloud,
  FolderKanban
} from 'lucide-react';
import { EducationLevel, GradeLevel, SubjectType, WorkspaceState } from '../types/edtech';
import { CURRICULUM_TOAN_9, buildStateFromCurriculumEntry } from '../data/curriculumToan9';
import { getCurriculumForGrade } from '../data/multiGradeCurriculum';
import { getTeacherAssignedGrades, getGradeWorkspace, setActiveGrade } from '../utils/gradeWorkspaceManager';

interface HeaderHeroProps {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
  onOpenCurriculumModal: () => void;
  onOpenMatrixModal: () => void;
  onOpenChecklistModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenMultiGradeModal?: () => void;
  devicePreview: 'laptop' | 'tablet' | 'mobile';
  setDevicePreview: (device: 'laptop' | 'tablet' | 'mobile') => void;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({
  state,
  setState,
  onOpenCurriculumModal,
  onOpenMatrixModal,
  onOpenChecklistModal,
  onOpenSettingsModal,
  onOpenMultiGradeModal,
  devicePreview,
  setDevicePreview
}) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [assignedGrades, setAssignedGrades] = useState<GradeLevel[]>(() => getTeacherAssignedGrades());

  // Lắng nghe sự kiện cập nhật danh sách khối có KHBD
  React.useEffect(() => {
    const handleGradesUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAssignedGrades(e.detail);
      }
    };
    window.addEventListener('assigned-grades-updated', handleGradesUpdated);
    return () => window.removeEventListener('assigned-grades-updated', handleGradesUpdated);
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800 shadow-xl no-print">
      
      {/* Top Navigation Bar (EduWeb / Modern EdTech Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between border-b border-slate-800/80">
        
        {/* Brand Logo & Tagline (Chuẩn theo ke-hoach-bai-day-nls.vercel.app) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg ring-2 ring-blue-400/30 shadow-blue-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 uppercase">
                SOẠN GIÁO ÁN NĂNG LỰC SỐ & AI
              </span>
              <span className="text-[10px] font-extrabold bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                v2026 Pro
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80 font-medium">
              Kế hoạch bài dạy tinh giản theo Công văn 5512 & Năng lực số TT 02/2025
            </p>
          </div>
        </div>

        {/* Middle Quick Subsystem Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => setState(p => ({ ...p, activeTab: 'khbd' }))}
            className={`px-3 py-1.5 rounded-lg transition ${
              state.activeTab === 'khbd'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            1. KHBD (CV 5512)
          </button>
          <button
            onClick={() => setState(p => ({ ...p, activeTab: 'slide' }))}
            className={`px-3 py-1.5 rounded-lg transition ${
              state.activeTab === 'slide'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            2. Slide Trình Chiếu
          </button>
          <button
            onClick={() => setState(p => ({ ...p, activeTab: 'exam' }))}
            className={`px-3 py-1.5 rounded-lg transition ${
              state.activeTab === 'exam'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            3. Đề Thi (CV 7991)
          </button>
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCurriculumModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Nạp bài theo PPCT</span>
          </button>
        </div>

      </div>

    </div>
  );
};
