import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Presentation, 
  CheckSquare, 
  Download, 
  Printer, 
  Code, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  PlusCircle, 
  BarChart3, 
  BookOpen, 
  FileSpreadsheet, 
  Settings, 
  Cloud, 
  User, 
  Upload, 
  Eye,
  Trash2,
  AlertTriangle,
  RotateCcw,
  FolderKanban,
  Key
} from 'lucide-react';
import { SystemTab, WorkspaceState, GradeLevel } from '../types/edtech';
import { CURRICULUM_TOAN_9, buildStateFromCurriculumEntry } from '../data/curriculumToan9';
import { SAMPLE_MATH_12, SAMPLE_PHYSICS_11 } from '../data/sampleLessons';
import { exportKHBDToWord, exportExamToWord, exportMatrixToWord, exportSlidesToPPTX, downloadStandaloneHTMLFile } from '../utils/exportHelpers';
import { saveTeacherProfile, getSavedTeacherProfile } from '../utils/teacherStorage';
import { extractClassesForGrade } from '../utils/classHelpers';
import { splitLessonTitle } from '../utils/curriculumHelpers';
import { getStoredPPCTList, saveStoredPPCTList, downloadPPCTDoc, deleteStoredPPCT, clearAllStoredPPCT, restoreDefaultPPCT, StoredPPCT } from '../utils/ppctStorage';
import { 
  clearGradeWorkspaceOnPpctDelete, 
  getGradeWorkspace, 
  deleteGradeWorkspaceAndRemove, 
  isMockDocument, 
  addPpctToGradeWorkspace,
  getExistingFilesForGrade,
  clearGradeWorkspaceFiles,
  detectGradeFromFileName
} from '../utils/gradeWorkspaceManager';
import { getCurriculumForGrade } from '../data/multiGradeCurriculum';
import { convertDocxToPdfView } from '../utils/docxToPdfHelper';
import { PPCTDeleteWarningModal } from './PPCTDeleteWarningModal';
import type { OriginalFileItem } from './OriginalFileViewerModal';
const OriginalFileViewerModal = React.lazy(() => import('./OriginalFileViewerModal').then(m => ({ default: m.OriginalFileViewerModal })));
import { KHBDConflictModal } from './KHBDConflictModal';
import { generatePPCTPreviewHtml } from '../utils/ppctWordExporter';

interface SidebarProps {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
  onOpenMatrix: () => void;
  onOpenChecklist: () => void;
  onOpenCurriculum: () => void;
  onOpenSettings: () => void;
  onOpenPublish?: () => void;
  onOpenMultiGradeModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  state,
  setState,
  onOpenMatrix,
  onOpenChecklist,
  onOpenCurriculum,
  onOpenSettings,
  onOpenPublish,
  onOpenMultiGradeModal
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [importJsonError, setImportJsonError] = useState<string | null>(null);

  const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';

  // Stored PPCT Files (lưu trữ theo đúng khối đang mở)
  const [ppctList, setPpctList] = useState<StoredPPCT[]>(() => {
    return getGradeWorkspace(currentGrade).ppctList;
  });
  const [isDraggingPpct, setIsDraggingPpct] = useState(false);
  const [ppctUploadSuccess, setPpctUploadSuccess] = useState<string | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState<StoredPPCT | null>(null);

  // Original File Viewer Modal state
  const [selectedFileToView, setSelectedFileToView] = useState<OriginalFileItem | null>(null);
  const [isOriginalViewerOpen, setIsOriginalViewerOpen] = useState(false);

  // Gemini API Key state from localStorage (Nhịp 1)
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('user_gemini_key') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const syncApiKey = () => {
      try {
        setGeminiKey(localStorage.getItem('user_gemini_key') || '');
      } catch {
        setGeminiKey('');
      }
    };
    window.addEventListener('storage', syncApiKey);
    window.addEventListener('gemini_key_updated', syncApiKey);
    return () => {
      window.removeEventListener('storage', syncApiKey);
      window.removeEventListener('gemini_key_updated', syncApiKey);
    };
  }, []);

  const hasApiKey = Boolean(geminiKey && geminiKey.trim().length > 0);

  const handleViewOriginalPPCT = (ppctItem: StoredPPCT) => {
    const curriculumDataToUse = ppctItem.curriculumData || getCurriculumForGrade(currentGrade);
    const previewHtml = ppctItem.htmlContent || generatePPCTPreviewHtml(curriculumDataToUse, {
      grade: currentGrade,
      teacherName: state.khbd.teacherName || 'Châu Ngọc Bảo Trân',
      subject: state.khbd.subject || 'Toán học',
      schoolYear: state.khbd.schoolYear || '2026 - 2027',
      fileName: ppctItem.name
    });

    setSelectedFileToView({
      id: ppctItem.id,
      name: ppctItem.name,
      size: ppctItem.size,
      type: ppctItem.type.toUpperCase(),
      uploadedAt: ppctItem.uploadedAt,
      dataUrl: ppctItem.dataUrl,
      note: ppctItem.description,
      description: ppctItem.description,
      rawText: ppctItem.rawText,
      htmlContent: previewHtml,
      isConvertedFromWord: true,
      originalFileName: ppctItem.originalFileName
    });
    setIsOriginalViewerOpen(true);
  };

  // Synchronize PPCT list when switching grade or when changed
  useEffect(() => {
    setPpctList(getGradeWorkspace(currentGrade).ppctList);
  }, [currentGrade]);

  useEffect(() => {
    const handleStorageChange = (e: any) => {
      if (e.detail?.grade === currentGrade && Array.isArray(e.detail?.list)) {
        setPpctList(e.detail.list);
      } else {
        setPpctList(getGradeWorkspace(currentGrade).ppctList);
      }
    };
    window.addEventListener('ppct-storage-updated', handleStorageChange);
    return () => window.removeEventListener('ppct-storage-updated', handleStorageChange);
  }, [currentGrade]);

  // KHBD / PPCT Conflict Modal state in Sidebar
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState<{
    newFile: OriginalFileItem;
    targetGrade: GradeLevel;
    existingFiles: OriginalFileItem[];
    targetType?: 'ppct' | 'reference' | 'khbd';
  } | null>(null);

  const handlePpctUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;

      // Xử lý chuyển đổi Word sang PDF
      const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
      const finalName = file.name; // BẢO TOÀN 100% TÊN GỐC VÀ ĐỊNH DẠNG TẢI LÊN
      const finalType: 'docx' | 'pdf' | 'xlsx' = isWord ? 'docx' : (file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : file.name.toLowerCase().endsWith('.xlsx') ? 'xlsx' : 'docx');
      let htmlContent: string | undefined = undefined;
      let rawText: string | undefined = undefined;
      let isConverted = false;

      if (isWord) {
        try {
          const res = await convertDocxToPdfView(file);
          htmlContent = res.htmlContent;
          rawText = res.rawText;
          isConverted = true;
        } catch (err) {
          console.warn('Sidebar docx to pdf error', err);
        }
      }

      const newFileItem: OriginalFileItem = {
        name: finalName,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: isWord ? 'DOCX' : finalType.toUpperCase(),
        note: `Tài liệu PPCT do giáo viên tải lên (${file.name})${isConverted ? ' • Đã chuyển Word sang PDF' : ''}`,
        uploadedAt: 'Vừa xong',
        dataUrl,
        htmlContent,
        rawText,
        isConvertedFromWord: isConverted,
        originalFileName: file.name
      };

      // QUY ĐỊNH HỆ THỐNG: MỖI KHỐI CHỈ ĐƯỢC PHÉP CÓ 1 PPCT DUY NHẤT. NẠP THÊM LÀ KHÔNG ĐƯỢC (KIỂM 2 CẤP ĐỘ)
      const detected = detectGradeFromFileName(file.name);
      const targetGrade = detected || currentGrade;
      const existingFiles = getExistingFilesForGrade(targetGrade);

      if (existingFiles.length > 0) {
        setConflictData({
          newFile: newFileItem,
          targetGrade,
          existingFiles,
          targetType: 'ppct'
        });
        setShowConflictModal(true);
        return;
      }

      const newPpct: StoredPPCT = {
        id: `ppct-${Date.now()}`,
        name: finalName,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: 'Vừa xong',
        type: finalType,
        description: `Tài liệu PPCT do giáo viên tải lên (${file.name})${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`,
        totalPeriods: 140,
        dataUrl: dataUrl,
        htmlContent,
        rawText,
        isConvertedFromWord: isConverted,
        originalFileName: file.name
      };

      setPpctList([newPpct]);
      saveStoredPPCTList([newPpct], targetGrade);
      addPpctToGradeWorkspace(targetGrade, newPpct);
      setPpctUploadSuccess(`Đã lưu trữ PPCT cho ${targetGrade}: ${finalName}${isConverted ? ' (Đã chuyển sang PDF)' : ''}`);
      setTimeout(() => setPpctUploadSuccess(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmConflictOverwrite = () => {
    if (!conflictData) return;
    const { newFile, targetGrade } = conflictData;
    clearGradeWorkspaceFiles(targetGrade);

    const isWord = newFile.name.toLowerCase().endsWith('.docx') || newFile.name.toLowerCase().endsWith('.doc');
    const newPpct: StoredPPCT = {
      id: `ppct-${Date.now()}`,
      name: newFile.name,
      size: newFile.size,
      uploadedAt: 'Vừa xong',
      type: isWord ? 'docx' : newFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'xlsx',
      description: `Tài liệu PPCT do giáo viên tải lên (${newFile.name})`,
      totalPeriods: 140,
      dataUrl: newFile.dataUrl,
      htmlContent: newFile.htmlContent,
      rawText: newFile.rawText,
      isConvertedFromWord: newFile.isConvertedFromWord,
      originalFileName: newFile.originalFileName || newFile.name
    };

    saveStoredPPCTList([newPpct], targetGrade);
    addPpctToGradeWorkspace(targetGrade, newPpct);
    setPpctList([newPpct]);

    setShowConflictModal(false);
    setConflictData(null);
    setPpctUploadSuccess(`✓ Đã ghi đè thành công PPCT cho ${targetGrade}! Toàn bộ file cũ đã được xóa sạch và thay bằng: ${newFile.name}`);
    setTimeout(() => setPpctUploadSuccess(null), 4000);
  };

  // Delete PPCT handler
  const handleRequestDeletePPCT = (item: StoredPPCT) => {
    if (ppctList.length <= 1) {
      // Khi xóa hết file trong PPCT thì sẽ hiện cảnh báo: xóa thì tất cả bài nạp cũng sẽ mất hết theo và xóa luôn cả khối
      setItemPendingDelete(item);
      setShowDeleteWarning(true);
    } else {
      const updated = deleteStoredPPCT(item.id, currentGrade);
      setPpctList(updated);
      setPpctUploadSuccess(`Đã xóa file: ${item.name}`);
      setTimeout(() => setPpctUploadSuccess(null), 3000);
    }
  };

  const handleConfirmDeleteAll = () => {
    setShowDeleteWarning(false);
    setItemPendingDelete(null);

    // KHI XÓA KHBD THÌ XÓA LUÔN CẢ KHỐI ĐÓ
    const nextGrade = deleteGradeWorkspaceAndRemove(state.khbd.grade as GradeLevel);
    setPpctList([]);

    if (nextGrade) {
      // Chuyển sang khối còn lại
      const targetWs = getGradeWorkspace(nextGrade);
      const targetCurriculum = getCurriculumForGrade(nextGrade);
      const targetClass = targetWs.activeClass || `${nextGrade.replace('Lớp ', '')}A1`;

      if (targetWs.khbdState && targetWs.khbdState.lessonName) {
        setState(prev => ({
          ...prev,
          khbd: {
            ...targetWs.khbdState!,
            grade: nextGrade,
            className: targetClass
          },
          exam: {
            ...prev.exam,
            grade: nextGrade,
            examTitle: `Đề kiểm tra môn ${prev.khbd.subject || 'Toán học'} - ${nextGrade}`
          }
        }));
      } else {
        const newState = buildStateFromCurriculumEntry(targetCurriculum[0], targetClass);
        setState(prev => ({
          ...newState,
          khbd: {
            ...newState.khbd,
            grade: nextGrade,
            className: targetClass,
            teacherName: prev.khbd.teacherName,
            schoolYear: prev.khbd.schoolYear
          },
          exam: {
            ...newState.exam,
            grade: nextGrade
          }
        }));
      }
      setPpctUploadSuccess(`⚠️ Đã xóa toàn bộ KHBD & gỡ bỏ ${state.khbd.grade}! Đã chuyển sang ${nextGrade}.`);
    } else {
      // Đã xóa hết các khối
      setState(prev => ({
        ...prev,
        khbd: {
          ...prev.khbd,
          lessonName: '',
          chapter: '',
          curriculumRef: undefined,
          periodsCount: 0,
          currentPeriod: 0,
          objectives: {
            knowledge: [],
            coreCompetencies: [],
            subjectCompetencies: [],
            qualities: []
          },
          equipment: {
            teacher: [],
            students: [],
            digitalResources: []
          },
          activities: []
        },
        slides: [],
        exam: {
          ...prev.exam,
          examTitle: 'Đề kiểm tra (Chưa nạp bài dạy)',
          part1: { ...prev.exam.part1, questions: [], totalScore: 0 },
          part2: { ...prev.exam.part2, questions: [], totalScore: 0 },
          part3: { ...prev.exam.part3, questions: [], totalScore: 0 },
          part4: { ...prev.exam.part4, questions: [], totalScore: 0 },
        }
      }));
      setPpctUploadSuccess('⚠️ Đã xóa toàn bộ KHBD và khối lớp!');
    }
    setTimeout(() => setPpctUploadSuccess(null), 4500);
  };

  const handleRestoreDefaultPPCT = () => {
    const list = restoreDefaultPPCT(currentGrade);
    setPpctList(list);
    const curriculum = getCurriculumForGrade(currentGrade);
    const targetWs = getGradeWorkspace(currentGrade);
    const defaultState = buildStateFromCurriculumEntry(curriculum[0], targetWs.activeClass || `${currentGrade.replace('Lớp ', '')}A1`);
    setState(prev => ({
      ...defaultState,
      khbd: {
        ...defaultState.khbd,
        grade: currentGrade,
        teacherName: prev.khbd.teacherName,
        className: prev.khbd.className,
        subject: prev.khbd.subject,
        schoolYear: prev.khbd.schoolYear
      }
    }));
    setPpctUploadSuccess(`Đã khôi phục lại PPCT chuẩn cho ${currentGrade}.`);
    setTimeout(() => setPpctUploadSuccess(null), 3500);
  };

  // Switch Subsystem
  const handleTabChange = (tab: SystemTab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  // Switch Sample Lesson
  const handleSelectSample = (sample: 'math' | 'physics' | 'new') => {
    if (sample === 'math') {
      setState({
        ...SAMPLE_MATH_12,
        activeTab: state.activeTab,
        khbd: {
          ...SAMPLE_MATH_12.khbd,
          teacherName: state.khbd.teacherName,
          className: state.khbd.className,
          schoolYear: state.khbd.schoolYear
        }
      });
    } else if (sample === 'physics') {
      setState({
        ...SAMPLE_PHYSICS_11,
        activeTab: state.activeTab,
        khbd: {
          ...SAMPLE_PHYSICS_11.khbd,
          teacherName: state.khbd.teacherName,
          className: state.khbd.className,
          schoolYear: state.khbd.schoolYear
        }
      });
    } else {
      // Empty lesson boilerplate
      setState(prev => ({
        ...prev,
        khbd: {
          ...prev.khbd,
          lessonName: 'BÀI HỌC MỚI (TỰ SOẠN THẢO)',
          teacherName: state.khbd.teacherName || 'Giáo viên bộ môn',
          objectives: {
            knowledge: ['Mục tiêu kiến thức 1'],
            coreCompetencies: ['Tự chủ và tự học', 'Giao tiếp và hợp tác'],
            subjectCompetencies: ['Năng lực chuyên biệt môn học'],
            qualities: ['Chăm chỉ', 'Trách nhiệm']
          }
        }
      }));
    }
  };

  // Update teacher info with automatic persistence
  const handleTeacherInfoChange = (patch: { teacherName?: string; className?: string; assignedClasses?: string; subject?: any; schoolYear?: string }) => {
    let effectiveAssigned = patch.assignedClasses !== undefined ? patch.assignedClasses : state.khbd.assignedClasses;
    let effectiveClassName = patch.className;

    if (patch.assignedClasses !== undefined) {
      effectiveClassName = extractClassesForGrade(patch.assignedClasses, state.khbd.grade);
    } else if (patch.className !== undefined) {
      effectiveClassName = extractClassesForGrade(patch.className, state.khbd.grade);
      if (patch.className.includes(',') || patch.className.includes(';') || patch.className.includes('/')) {
        effectiveAssigned = patch.className;
      }
    }

    const fullPatch = {
      ...patch,
      ...(effectiveClassName ? { className: effectiveClassName } : {}),
      ...(effectiveAssigned ? { assignedClasses: effectiveAssigned } : {})
    };

    saveTeacherProfile(fullPatch);
    setState(prev => ({
      ...prev,
      khbd: {
        ...prev.khbd,
        ...fullPatch
      }
    }));
  };

  // Copy JSON State to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(state, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Export JSON State as file
  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EduMaster_State_${state.khbd.subject}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON State
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.khbd && parsed.exam) {
            setState(parsed);
            setImportJsonError(null);
            alert('Khôi phục trạng thái phiên làm việc thành công!');
          } else {
            setImportJsonError('File JSON không đúng định dạng EduMaster.');
          }
        } catch (err) {
          setImportJsonError('Không thể đọc file JSON.');
        }
      };
    }
  };

  // Calculate total exam score
  const totalExamScore = 
    state.exam.part1.totalScore + 
    state.exam.part2.totalScore + 
    state.exam.part3.totalScore + 
    state.exam.part4.totalScore;

  return (
    <aside className="w-[380px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen overflow-hidden text-slate-800 shadow-sm no-print">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 uppercase">
                SOẠN GIÁO ÁN NLS & AI
                <span className="text-[10px] font-extrabold bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-400/40">
                  v2026
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Kế hoạch bài dạy chuẩn CV 5512</p>
            </div>
          </div>

          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1 text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-1 rounded-md hover:bg-emerald-900 transition"
            title="Kiểm chứng 4 tiêu chuẩn bắt buộc"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>4/4 Đạt</span>
          </button>
        </div>
      </div>

      {/* Scrollable Control Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Subsystem Switcher - BƯỚC 1: CHỌN CHẾ ĐỘ SƯ PHẠM */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Bước 1: Chọn Chế Độ Sư Phạm
          </label>
          <div className="grid grid-cols-1 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => handleTabChange('khbd')}
              className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-xs font-bold transition text-left ${
                state.activeTab === 'khbd'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 bg-white'
              }`}
            >
              <FileText className={`w-4 h-4 ${state.activeTab === 'khbd' ? 'text-white' : 'text-blue-600'}`} />
              <span>Soạn KHBD 5512</span>
            </button>

            <button
              onClick={() => handleTabChange('slide')}
              className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-xs font-bold transition text-left ${
                state.activeTab === 'slide'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 bg-white'
              }`}
            >
              <Presentation className={`w-4 h-4 ${state.activeTab === 'slide' ? 'text-white' : 'text-indigo-600'}`} />
              <span>Trình Chiếu Slide Bài Giảng</span>
            </button>

            <button
              onClick={() => handleTabChange('exam')}
              className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-xs font-bold transition text-left ${
                state.activeTab === 'exam'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 bg-white'
              }`}
            >
              <CheckSquare className={`w-4 h-4 ${state.activeTab === 'exam' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Ngân Hàng Đề Thi 7991</span>
            </button>
          </div>

          {/* NÚT CÀI ĐẶT & QUẢN TRỊ HỆ THỐNG (Nhịp 3: 1 DÒNG DUY NHẤT RESPONSIVE) */}
          <button
            onClick={onOpenSettings}
            className="w-full mt-2 flex items-center justify-between px-2.5 py-2 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow transition hover:from-slate-800 hover:to-indigo-900 border border-slate-700 group relative gap-1.5 overflow-hidden cursor-pointer"
            title="Cài đặt: Quản lý Gemini API Key, Đồng bộ Google Drive, Khung PPCT và Sách"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
              <Settings className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-45 transition-transform duration-300 shrink-0" />
              <span className="text-[11px] font-bold tracking-tight whitespace-nowrap truncate select-none">
                Bấm để Cài đặt API, Google Drive & Cloud Storage
              </span>
            </div>
            {hasApiKey ? (
              <span className="text-[9.5px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono font-bold shadow-xs shrink-0 whitespace-nowrap">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                API Ready
              </span>
            ) : (
              <span className="text-[9.5px] bg-rose-500/25 text-rose-300 border border-rose-400/50 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono font-bold shadow-xs animate-pulse shrink-0 whitespace-nowrap">
                <Key className="w-3 h-3 text-rose-400 shrink-0" />
                0 Key
              </span>
            )}
          </button>
        </div>

        {/* BƯỚC 2: THÔNG TIN GIÁO VIÊN */}
        <div className="space-y-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Bước 2: Thông Tin Giáo Viên
            </label>
          </div>

          {/* 1. Tên giáo viên */}
          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">
              1. Tên giáo viên:
            </label>
            <input
              type="text"
              value={state.khbd.teacherName || ''}
              onChange={(e) => handleTeacherInfoChange({ teacherName: e.target.value })}
              placeholder="Nhập tên giáo viên..."
              className="w-full text-xs font-semibold p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* 2. Lớp dạy (ví dụ: 8/5; 9/3; 9/6) */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label className="text-[11px] text-slate-700 font-bold">
                2. Lớp dạy (ví dụ: 8/5; 9/3; 9/6):
              </label>
              <span className="text-[9px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-semibold">
                Tự động theo khối
              </span>
            </div>
            <input
              type="text"
              value={state.khbd.assignedClasses ?? (getSavedTeacherProfile().assignedClasses || state.khbd.className || '8/5; 9/3; 9/6')}
              onChange={(e) => {
                const val = e.target.value;
                handleTeacherInfoChange({
                  assignedClasses: val,
                  className: extractClassesForGrade(val, state.khbd.grade)
                });
              }}
              placeholder="Ví dụ: 8/5; 9/3; 9/6..."
              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex items-center justify-between text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="text-slate-500">Lớp trong KHBD {state.khbd.grade}:</span>
              <strong className="text-emerald-800 font-bold">{state.khbd.className || extractClassesForGrade(state.khbd.assignedClasses, state.khbd.grade)}</strong>
            </div>
          </div>

          {/* 3. Môn dạy */}
          <div className="text-xs">
            <label className="text-[11px] text-slate-600 font-medium block mb-1">
              3. Môn dạy:
            </label>
            <input
              type="text"
              list="sidebar-subjectlist"
              value={state.khbd.subject || ''}
              onChange={(e) => handleTeacherInfoChange({ subject: e.target.value as any })}
              placeholder="Nhập môn dạy..."
              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <datalist id="sidebar-subjectlist">
                <option value="Toán học" />
                <option value="Vật lí" />
                <option value="Hóa học" />
                <option value="Sinh học" />
                <option value="Ngữ văn" />
                <option value="Tin học" />
                <option value="Tiếng Anh" />
                <option value="Lịch sử" />
                <option value="Địa lí" />
                <option value="Khoa học tự nhiên" />
              </datalist>
            </div>

          {/* 4. Năm học */}
          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">
              4. Năm học:
            </label>
            <input
              type="text"
              list="sidebar-yearlist"
              value={state.khbd.schoolYear || ''}
              onChange={(e) => handleTeacherInfoChange({ schoolYear: e.target.value })}
              placeholder="Nhập năm học (vd: 2026-2027)..."
              className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <datalist id="sidebar-yearlist">
              <option value="2026-2027" />
              <option value="2025-2026" />
              <option value="2024-2025" />
            </datalist>
          </div>

          {/* Nút mở Quản trị đa khối lớp */}
          {onOpenMultiGradeModal && (
            <button
              type="button"
              onClick={onOpenMultiGradeModal}
              className="w-full mt-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold transition flex items-center justify-between shadow-2xs"
              title="Quản trị phân công giảng dạy nhiều khối lớp trong năm học (Lớp 6, 7, 8, 9)"
            >
              <div className="flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-indigo-600" />
                <span>Quản Trị Đa Khối Lớp</span>
              </div>
              <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full font-bold">
                {state.khbd.grade}
              </span>
            </button>
          )}
        </div>

        {/* BƯỚC 3: MÔN & BÀI DẠY PPCT */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Bước 3: Môn & Bài Dạy PPCT
            </span>
          </div>

          {/* HÀNG NÚT PPCT & LINK KÉO THẢ TẢI LÊN */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCurriculum}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black shadow-xs transition flex items-center gap-1.5 shrink-0"
              title="Mở phân phối chương trình để chọn bài dạy"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>PPCT</span>
            </button>

            {/* Quy định 1 PPCT / Khối */}
            <div className="w-full text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded-md font-bold flex items-center justify-between">
              <span>⚠️ Quy định: 1 PPCT / Khối</span>
              <span className="text-[9px] text-amber-700 font-medium">Nạp thêm = Lỗi 2 cấp độ</span>
            </div>

            {/* Link kéo thả up PPCT */}
            <label
              onDragOver={(e) => { e.preventDefault(); setIsDraggingPpct(true); }}
              onDragLeave={() => setIsDraggingPpct(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingPpct(false);
                handlePpctUpload(e.dataTransfer.files);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 border border-dashed rounded-lg cursor-pointer text-[11px] font-bold transition text-center truncate ${
                isDraggingPpct 
                  ? 'border-blue-600 bg-blue-100 text-blue-800' 
                  : 'border-blue-300 hover:border-blue-500 bg-white/90 hover:bg-white text-blue-700'
              }`}
              title="Kéo thả file PPCT (.docx, .pdf, .xlsx) hoặc bấm để tải lên"
            >
              <Upload className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span className="truncate">Kéo thả / Tải file PPCT lên</span>
              <input
                type="file"
                accept=".docx,.doc,.pdf,.xlsx"
                onChange={(e) => handlePpctUpload(e.target.files)}
                className="hidden"
              />
            </label>
          </div>

          {ppctUploadSuccess && (
            <div className="text-[10px] text-emerald-800 bg-emerald-100 p-1.5 rounded border border-emerald-300 flex items-center gap-1 font-semibold animate-fadeIn">
              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{ppctUploadSuccess}</span>
            </div>
          )}

          {/* LƯU TRỮ NGAY TRÊN ĐÂY: DANH SÁCH FILE PPCT CÓ NÚT XEM, TẢI VỀ VÀ XÓA */}
          <div className="pt-2 border-t border-blue-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
              <span>PPCT lưu trữ tại đây:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-blue-600 font-semibold">{ppctList.length} tài liệu</span>
                {ppctList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setItemPendingDelete(null); setShowDeleteWarning(true); }}
                    className="text-[9px] text-rose-600 hover:text-rose-800 hover:underline font-semibold"
                    title="Xóa tất cả file trong PPCT"
                  >
                    Xóa hết
                  </button>
                )}
              </div>
            </div>

            {ppctList.length === 0 ? (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1 text-amber-800 text-[10px] font-bold">
                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Kho PPCT trống • Tất cả bài nạp đã mất hết theo</span>
                </div>
                <button
                  type="button"
                  onClick={handleRestoreDefaultPPCT}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Khôi phục PPCT mẫu</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {ppctList.map((item) => (
                  <div
                    key={item.id}
                    className="p-1.5 bg-white rounded-lg border border-blue-200/80 text-xs flex items-center justify-between gap-1 shadow-2xs hover:border-blue-300 transition"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span
                        onClick={onOpenCurriculum}
                        className="font-bold text-slate-800 text-[11px] truncate cursor-pointer hover:text-blue-700 hover:underline"
                        title={`${item.name} (${item.size})`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Nút Xem file gốc */}
                      <button
                        type="button"
                        onClick={() => handleViewOriginalPPCT(item)}
                        className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold flex items-center gap-0.5 transition"
                        title="Xem lại chính xác file gốc nguyên bản (không chỉnh sửa)"
                      >
                        <Eye className="w-3 h-3 text-indigo-600" />
                        <span>File gốc</span>
                      </button>
                      {/* Nút Xem bảng */}
                      <button
                        type="button"
                        onClick={onOpenCurriculum}
                        className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[10px] font-bold flex items-center gap-0.5 transition"
                        title="Xem nội dung phân phối chương trình"
                      >
                        <BookOpen className="w-3 h-3 text-blue-600" />
                        <span>Xem bảng</span>
                      </button>
                      {/* Nút Tải về */}
                      <button
                        type="button"
                        onClick={() => downloadPPCTDoc(item)}
                        className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-0.5 transition"
                        title="Tải về file PPCT"
                      >
                        <Download className="w-3 h-3" />
                        <span>Tải về</span>
                      </button>
                      {/* Nút Xóa */}
                      <button
                        type="button"
                        onClick={() => handleRequestDeletePPCT(item)}
                        className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold flex items-center gap-0.5 transition"
                        title="Xóa file PPCT này"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Lesson Badge */}
          <div className="pt-2 border-t border-blue-200/60">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] text-slate-500">Bài dạy đang chọn:</span>
              <button
                type="button"
                onClick={onOpenCurriculum}
                className="text-[10px] text-blue-600 hover:underline font-semibold"
              >
                Đổi bài từ PPCT →
              </button>
            </div>
            <div className="bg-white p-2 rounded-lg border border-blue-200 space-y-1">
              {(() => {
                const { mainTitle, periodSubtitle } = splitLessonTitle(state.khbd.lessonName);
                const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;
                return (
                  <>
                    <div className="text-xs font-black text-blue-950 leading-snug">
                      {mainTitle}
                    </div>
                    {formattedSubtitle && (
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                        <span>{formattedSubtitle}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Exam Matrix Summary Badge */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              Ma Trận CV 7991 (40 - 30 - 30)
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              Math.abs(totalExamScore - 10.0) < 0.01 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-rose-100 text-rose-800'
            }`}>
              {totalExamScore.toFixed(1)} / 10.0 đ
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-center text-[10px] mt-2">
            <div className="p-1 bg-white rounded border border-blue-100">
              <span className="block text-slate-500">Nhận biết</span>
              <span className="font-bold text-blue-700">40% (4.0đ)</span>
            </div>
            <div className="p-1 bg-white rounded border border-blue-100">
              <span className="block text-slate-500">Thông hiểu</span>
              <span className="font-bold text-indigo-700">30% (3.0đ)</span>
            </div>
            <div className="p-1 bg-white rounded border border-blue-100">
              <span className="block text-slate-500">Vận dụng</span>
              <span className="font-bold text-emerald-700">30% (3.0đ)</span>
            </div>
          </div>

          <button
            onClick={onOpenMatrix}
            className="w-full mt-2.5 py-1.5 text-center text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            Xem bảng đặc tả ma trận chi tiết →
          </button>
        </div>

        {/* BƯỚC 4: KHU VỰC XUẤT BẢN & PHÂN PHỐI TÀI LIỆU */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center justify-between">
            <span>Bước 4: Xuất Bản & Tải Về</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold">Tạo / Publish</span>
          </label>
          <div className="space-y-1.5">
            {/* Nút Xuất Bản Trực Tiếp (Tạo / Publish & Hướng Dẫn Tải Về) */}
            {onOpenPublish && (
              <button
                onClick={onOpenPublish}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black transition shadow-md border border-emerald-400 group mb-2"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>XUẤT BẢN KHBD & SLIDE 🎉</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">Tạo / Publish</span>
              </button>
            )}

            {/* Export Word KHBD */}
            <button
              onClick={() => exportKHBDToWord(state)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Xuất Word (.doc) KHBD 5512</span>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>

            {/* Export Slide PowerPoint PPTX */}
            <button
              onClick={() => exportSlidesToPPTX(state)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-purple-600" />
                <span>Tải Slide PowerPoint (.pptx)</span>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
            </button>

            {/* Export Word Exam */}
            <button
              onClick={() => exportExamToWord(state)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Tải file Word chuẩn Bộ GD&ĐT (.doc)</span>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>

            {/* Export Matrix Specification Word */}
            <button
              onClick={() => exportMatrixToWord(state)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 text-xs font-medium transition group"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Tải Ma Trận Đặc Tả (.doc)</span>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
            </button>

            {/* Download Standalone Single-File HTML */}
            <button
              onClick={() => downloadStandaloneHTMLFile(state)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold transition group shadow-sm"
              title="Tải 1 file HTML hoàn chỉnh có sẵn Tailwind CDN và Alpine.js để mở trực tiếp trong trình duyệt offline"
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-700" />
                <div className="text-left">
                  <div className="leading-tight">Tải Single-File HTML Độc Lập</div>
                  <div className="text-[10px] text-emerald-700 font-normal">Chạy offline không cần cài đặt Node.js</div>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-emerald-700" />
            </button>

            {/* Print / PDF preview */}
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
            >
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-slate-600" />
                <span>In ấn trực tiếp / Lưu PDF A4</span>
              </div>
            </button>
          </div>
        </div>

        {/* JSON STATE SESSION HANDOFF (BÀN GIAO PHIÊN LÀM VIỆC TIẾP THEO) */}
        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              JSON State Handoff
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyJson}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1 border border-slate-700"
                title="Sao chép JSON State"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedJson ? 'Đã chép' : 'Sao chép'}
              </button>
              <button
                onClick={handleDownloadJson}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white p-1 rounded border border-slate-700"
                title="Tải file JSON State"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
            Khối trạng thái phiên làm việc chứa toàn bộ dữ liệu chuẩn sư phạm 5512, slides, đề thi 7991 để bàn giao kỹ thuật:
          </p>

          <button
            onClick={() => setShowJsonPreview(!showJsonPreview)}
            className="w-full text-center py-1 text-[10px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition border border-slate-700"
          >
            {showJsonPreview ? 'Ẩn xem trước JSON' : 'Xem nội dung JSON State ({...})'}
          </button>

          {showJsonPreview && (
            <div className="mt-2">
              <pre className="p-2 bg-black/60 rounded text-[9px] font-mono text-emerald-400 overflow-x-auto max-h-36 border border-slate-800">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          )}

          {/* Import JSON State button */}
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Nạp lại phiên làm việc:</span>
            <label className="cursor-pointer text-blue-400 hover:text-blue-300 font-semibold underline">
              Nhập file JSON
              <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
            </label>
          </div>
          {importJsonError && (
            <p className="text-[10px] text-rose-400 mt-1">{importJsonError}</p>
          )}
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Phiên bản: 2025.1.0</span>
        <span className="text-slate-400">CV 5512 & 7991/BGDĐT</span>
      </div>

      {/* CẢNH BÁO: Xóa hết file trong PPCT thì tất cả bài nạp cũng sẽ mất hết theo và xóa luôn cả khối */}
      <PPCTDeleteWarningModal
        isOpen={showDeleteWarning}
        onClose={() => { setShowDeleteWarning(false); setItemPendingDelete(null); }}
        onConfirm={handleConfirmDeleteAll}
        targetFileName={itemPendingDelete ? itemPendingDelete.name : undefined}
        gradeName={state.khbd.grade}
        isDeleteGrade={true}
      />

      {/* MODAL XEM FILE GỐC NGUYÊN BẢN (CHỈ ĐỌC - 100% KHÔNG CHỈNH SỬA) */}
      {isOriginalViewerOpen && (
        <React.Suspense fallback={null}>
          <OriginalFileViewerModal
            isOpen={isOriginalViewerOpen}
            onClose={() => {
              setIsOriginalViewerOpen(false);
              setSelectedFileToView(null);
            }}
            file={selectedFileToView}
          />
        </React.Suspense>
      )}

      {/* MODAL BÁO LỖI TRÙNG LẶP PPCT VÀ XÁC NHẬN 2 CẤP ĐỘ */}
      <KHBDConflictModal
        isOpen={showConflictModal}
        conflictType="ppct"
        onClose={() => {
          setShowConflictModal(false);
          setConflictData(null);
        }}
        onConfirmOverwrite={handleConfirmConflictOverwrite}
        targetGrade={conflictData?.targetGrade || currentGrade}
        existingFiles={conflictData?.existingFiles || []}
        newFile={conflictData?.newFile || null}
      />
    </aside>
  );
};
