import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { HeaderHero } from './components/HeaderHero';
import { KHBDView } from './components/KHBDView';
const SlideDeckView = React.lazy(() => import('./components/SlideDeckView').then(m => ({ default: m.SlideDeckView })));
const Exam7991View = React.lazy(() => import('./components/Exam7991View').then(m => ({ default: m.Exam7991View })));
const MatrixOverviewModal = React.lazy(() => import('./components/MatrixOverviewModal').then(m => ({ default: m.MatrixOverviewModal })));
const VerificationChecklistModal = React.lazy(() => import('./components/VerificationChecklistModal').then(m => ({ default: m.VerificationChecklistModal })));
const CurriculumPickerModal = React.lazy(() => import('./components/CurriculumPickerModal').then(m => ({ default: m.CurriculumPickerModal })));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const WorkflowThreeSteps = React.lazy(() => import('./components/WorkflowThreeSteps').then(m => ({ default: m.WorkflowThreeSteps })));
const PublishCelebrationModal = React.lazy(() => import('./components/PublishCelebrationModal').then(m => ({ default: m.PublishCelebrationModal })));
const TeacherMultiGradeDashboardModal = React.lazy(() => import('./components/TeacherMultiGradeDashboardModal').then(m => ({ default: m.TeacherMultiGradeDashboardModal })));
import { buildStateFromCurriculumEntry, CURRICULUM_TOAN_9 } from './data/curriculumToan9';
import { getCurriculumForGrade } from './data/multiGradeCurriculum';
import { getGradeWorkspace, setActiveGrade } from './utils/gradeWorkspaceManager';
import { WorkspaceState, GradeLevel } from './types/edtech';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Laptop,
  Tablet,
  Smartphone,
  Presentation,
  Settings,
  Cloud
} from 'lucide-react';
import { downloadStandaloneHTMLFile, exportKHBDToWord, exportExamToWord, exportSlidesToPPTX } from './utils/exportHelpers';
import { getSavedTeacherProfile } from './utils/teacherStorage';
import { extractClassesForGrade } from './utils/classHelpers';

export default function App() {
  // Initial state initialized from the official Toán 9 curriculum (Week 1, Period 1) with saved teacher profile
  const [state, setState] = useState<WorkspaceState>(() => {
    const saved = getSavedTeacherProfile();
    const assigned = saved.assignedClasses || saved.className;
    const initialClass = extractClassesForGrade(assigned, 'Lớp 9');
    const base = buildStateFromCurriculumEntry(CURRICULUM_TOAN_9[0], initialClass);
    return {
      ...base,
      khbd: {
        ...base.khbd,
        teacherName: saved.teacherName,
        className: initialClass,
        subject: (saved.subject as any) || base.khbd.subject,
        schoolYear: saved.schoolYear
      }
    };
  });

  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isMultiGradeDashboardOpen, setIsMultiGradeDashboardOpen] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'laptop' | 'tablet' | 'mobile'>('laptop');
  const [copiedHandoff, setCopiedHandoff] = useState(false);

  // Mở SettingsModal khi nhận thông báo thiếu API Key
  React.useEffect(() => {
    const handleKeyMissing = () => {
      setIsSettingsOpen(true);
    };
    window.addEventListener('gemini_key_missing', handleKeyMissing);
    return () => window.removeEventListener('gemini_key_missing', handleKeyMissing);
  }, []);

  // Global switch grade handler
  const handleSwitchGradeGlobal = (grade: GradeLevel) => {
    setActiveGrade(grade);
    const ws = getGradeWorkspace(grade);
    const curriculum = getCurriculumForGrade(grade);
    const saved = getSavedTeacherProfile();
    const assigned = state.khbd.assignedClasses || saved.assignedClasses || saved.className || '8/5, 9/1, 9/2';
    const targetClass = extractClassesForGrade(assigned, grade);

    if (ws.khbdState && ws.khbdState.lessonName) {
      setState(prev => ({
        ...prev,
        khbd: {
          ...ws.khbdState!,
          grade,
          className: targetClass,
          assignedClasses: assigned
        },
        exam: {
          ...prev.exam,
          grade,
          examTitle: `Đề kiểm tra môn ${prev.khbd.subject || 'Toán học'} - ${grade}`
        }
      }));
    } else {
      const newState = buildStateFromCurriculumEntry(curriculum[0], targetClass);
      setState(prev => ({
        ...newState,
        khbd: {
          ...newState.khbd,
          grade,
          className: targetClass,
          assignedClasses: assigned,
          teacherName: prev.khbd.teacherName || saved.teacherName,
          schoolYear: prev.khbd.schoolYear || saved.schoolYear
        },
        exam: {
          ...newState.exam,
          grade
        }
      }));
    }
  };

  // Đồng bộ khi có sự kiện xóa khối hoặc chuyển khối từ các module
  React.useEffect(() => {
    const handleGradeDeletedGlobal = (e: any) => {
      if (e.detail?.nextGrade) {
        handleSwitchGradeGlobal(e.detail.nextGrade);
      }
    };
    const handleActiveGradeChanged = (e: any) => {
      if (e.detail && e.detail !== state.khbd.grade) {
        handleSwitchGradeGlobal(e.detail);
      }
    };
    window.addEventListener('grade-deleted', handleGradeDeletedGlobal);
    window.addEventListener('active-grade-changed', handleActiveGradeChanged);
    return () => {
      window.removeEventListener('grade-deleted', handleGradeDeletedGlobal);
      window.removeEventListener('active-grade-changed', handleActiveGradeChanged);
    };
  }, [state.khbd.grade]);

  // Copy JSON State from handoff block
  const handleCopyHandoff = () => {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    setCopiedHandoff(true);
    setTimeout(() => setCopiedHandoff(false), 2000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      
      {/* LEFT CONTROL PANEL (380PX FIXED WIDTH - AS SPECIFIED IN UI SPECS) */}
      <Sidebar
        state={state}
        setState={setState}
        onOpenMatrix={() => setIsMatrixOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onOpenCurriculum={() => setIsCurriculumOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        onOpenMultiGradeModal={() => setIsMultiGradeDashboardOpen(true)}
      />

      {/* RIGHT VISUAL WORKSPACE (RESPONSIVE FLEXIBLE CANVAS WITH HERO & DEVICE PREVIEWS) */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col">
        
        {/* TOP MODERN HERO BAR (LIKE THE USER'S PROVIDED SCREENSHOT) */}
        <HeaderHero
          state={state}
          setState={setState}
          onOpenCurriculumModal={() => setIsCurriculumOpen(true)}
          onOpenMatrixModal={() => setIsMatrixOpen(true)}
          onOpenChecklistModal={() => setIsChecklistOpen(true)}
          onOpenSettingsModal={() => setIsSettingsOpen(true)}
          onOpenMultiGradeModal={() => setIsMultiGradeDashboardOpen(true)}
          devicePreview={devicePreview}
          setDevicePreview={setDevicePreview}
        />

        {/* MAIN VISUAL WORKSPACE CONTENT (WITH RESPONSIVE DEVICE SIMULATION IF SELECTED) */}
        <main className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* 3 BƯỚC SOẠN KHBD TINH GIẢN (BƯỚC 1: GIÁO VIÊN, BƯỚC 2: MÔN & BÀI DẠY, BƯỚC 3: XUẤT BẢN) */}
          <React.Suspense fallback={
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
              <div className="text-xs font-semibold text-slate-500">Đang chuẩn bị không gian làm việc sư phạm...</div>
            </div>
          }>
            <WorkflowThreeSteps
              state={state}
              setState={setState}
              onOpenPublishModal={() => setIsPublishModalOpen(true)}
              onOpenCurriculumModal={() => setIsCurriculumOpen(true)}
            />
          </React.Suspense>

          {/* DEVICE PREVIEW WRAPPER */}
          {devicePreview === 'laptop' && (
            <div className="w-full space-y-8 transition-all">
              {state.activeTab === 'workflow' && (
                <KHBDView state={state} setState={setState} />
              )}
              {state.activeTab === 'khbd' && <KHBDView state={state} setState={setState} />}
              {state.activeTab === 'slide' && (
                <React.Suspense fallback={<div className="p-12 text-center text-slate-500 font-sans">Đang tải trình chiếu Slide...</div>}>
                  <SlideDeckView state={state} setState={setState} />
                </React.Suspense>
              )}
              {state.activeTab === 'exam' && (
                <React.Suspense fallback={<div className="p-12 text-center text-slate-500 font-sans">Đang tải Đề kiểm tra 7991...</div>}>
                  <Exam7991View state={state} setState={setState} />
                </React.Suspense>
              )}
            </div>
          )}

          {/* TABLET MOCKUP FRAME (LIKE THE TABLET IN THE HERO IMAGE) */}
          {devicePreview === 'tablet' && (
            <div className="max-w-3xl mx-auto bg-slate-900 p-5 rounded-[2.5rem] shadow-2xl border-4 border-slate-700 transition-all">
              <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>
              <div className="bg-slate-50 rounded-2xl overflow-hidden p-4 max-h-[78vh] overflow-y-auto">
                {state.activeTab === 'khbd' && <KHBDView state={state} setState={setState} />}
                {state.activeTab === 'slide' && (
                  <React.Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Đang tải slide...</div>}>
                    <SlideDeckView state={state} setState={setState} />
                  </React.Suspense>
                )}
                {state.activeTab === 'exam' && (
                  <React.Suspense fallback={<div className="p-8 text-center text-slate-500 text-xs">Đang tải đề thi...</div>}>
                    <Exam7991View state={state} setState={setState} />
                  </React.Suspense>
                )}
              </div>
            </div>
          )}

          {/* MOBILE PHONE MOCKUP FRAME (LIKE THE SMARTPHONE IN THE HERO IMAGE) */}
          {devicePreview === 'mobile' && (
            <div className="max-w-sm mx-auto bg-slate-900 p-4 rounded-[3rem] shadow-2xl border-4 border-slate-700 transition-all">
              <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              </div>
              <div className="bg-slate-50 rounded-[2rem] overflow-hidden p-3 max-h-[75vh] overflow-y-auto">
                {state.activeTab === 'khbd' && <KHBDView state={state} setState={setState} />}
                {state.activeTab === 'slide' && (
                  <React.Suspense fallback={<div className="p-6 text-center text-slate-500 text-xs">Đang tải slide...</div>}>
                    <SlideDeckView state={state} setState={setState} />
                  </React.Suspense>
                )}
                {state.activeTab === 'exam' && (
                  <React.Suspense fallback={<div className="p-6 text-center text-slate-500 text-xs">Đang tải đề thi...</div>}>
                    <Exam7991View state={state} setState={setState} />
                  </React.Suspense>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              JSON STATE SESSION HANDOFF BLOCK (KHỐI BÀN GIAO PHIÊN LÀM VIỆC TIẾP THEO)
              BẮT BUỘC THEO QUY TRÌNH KIỂM CHỨNG SỐ 4
             ========================================================================= */}
          <section className="bg-slate-900 text-slate-100 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800 no-print space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    KHỐI JSON STATE BÀN GIAO PHIÊN LÀM VIỆC TIẾP THEO
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold">
                      Harness Ready
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dữ liệu trạng thái có cấu trúc đầy đủ bao gồm KHBD 5512, Slide trình chiếu và Đề kiểm tra 7991.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyHandoff}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  {copiedHandoff ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedHandoff ? 'Đã sao chép JSON' : 'Sao chép JSON State'}</span>
                </button>

                <button
                  onClick={() => exportSlidesToPPTX(state)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow transition"
                  title="Tải slide bài giảng dạng tệp PowerPoint (.pptx)"
                >
                  <Presentation className="w-4 h-4" />
                  <span>Xuất Slide PPTX</span>
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 rounded-lg text-xs font-semibold shadow transition"
                >
                  <Settings className="w-4 h-4 text-blue-400" />
                  <span>Quản Lý Cloud Storage</span>
                </button>

                <button
                  onClick={() => downloadStandaloneHTMLFile(state)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
                  title="Tải 1 file HTML đơn nhất chạy offline trên mọi trình duyệt mà không cần cài đặt Node.js hay dòng lệnh"
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất Single-HTML Độc Lập</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Môn học & Khối lớp:</span>
                <span className="font-bold text-white text-sm">{state.khbd.subject} - {state.khbd.grade} ({state.khbd.className})</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Số hoạt động 5512:</span>
                <span className="font-bold text-blue-400 text-sm">{state.khbd.activities.length} hoạt động</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Số lượng Slide:</span>
                <span className="font-bold text-indigo-400 text-sm">{state.slides.length} slides</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Tổng điểm Đề 7991:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {(state.exam.part1.totalScore + state.exam.part2.totalScore + state.exam.part3.totalScore + state.exam.part4.totalScore).toFixed(1)} / 10.0 đ
                </span>
              </div>
            </div>

            {/* JSON Display Area */}
            <div className="relative">
              <pre className="p-4 bg-black/70 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56 border border-slate-800 leading-relaxed">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </section>

        </main>
      </div>

      {/* MODALS (TỐI ƯU TẢI THEO NHU CẦU - SIÊU NHANH) */}
      {isCurriculumOpen && (
        <React.Suspense fallback={null}>
          <CurriculumPickerModal
            isOpen={isCurriculumOpen}
            onClose={() => setIsCurriculumOpen(false)}
            onSelectEntry={(newState) => setState(newState)}
            currentGrade={state.khbd.grade}
          />
        </React.Suspense>
      )}

      {isMatrixOpen && (
        <React.Suspense fallback={null}>
          <MatrixOverviewModal
            exam={state.exam}
            isOpen={isMatrixOpen}
            onClose={() => setIsMatrixOpen(false)}
          />
        </React.Suspense>
      )}

      {isChecklistOpen && (
        <React.Suspense fallback={null}>
          <VerificationChecklistModal
            state={state}
            isOpen={isChecklistOpen}
            onClose={() => setIsChecklistOpen(false)}
          />
        </React.Suspense>
      )}

      {isSettingsOpen && (
        <React.Suspense fallback={null}>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            state={state}
            setState={setState}
          />
        </React.Suspense>
      )}

      {isPublishModalOpen && (
        <React.Suspense fallback={null}>
          <PublishCelebrationModal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            state={state}
          />
        </React.Suspense>
      )}

      {isMultiGradeDashboardOpen && (
        <React.Suspense fallback={null}>
          <TeacherMultiGradeDashboardModal
            isOpen={isMultiGradeDashboardOpen}
            onClose={() => setIsMultiGradeDashboardOpen(false)}
            activeGrade={state.khbd.grade}
            onSwitchGrade={(grade) => {
              setIsMultiGradeDashboardOpen(false);
              handleSwitchGradeGlobal(grade);
            }}
            teacherName={state.khbd.teacherName || 'Giáo viên bộ môn'}
          />
        </React.Suspense>
      )}

    </div>
  );
}
