import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  User, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Upload, 
  FileText, 
  Check, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw, 
  Layers,
  FileCheck,
  Search,
  ExternalLink,
  Presentation,
  Send,
  HelpCircle,
  Download,
  FileCode,
  CheckSquare,
  Award,
  BookMarked,
  Eye,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FolderX,
  History,
  Sliders,
  ShieldCheck,
  Tag,
  Clock,
  Printer,
  FolderKanban,
  ImageIcon,
  Plus,
  Paperclip,
  FileSpreadsheet,
  Lock,
  X,
  Save,
  GripVertical,
  Edit3,
  ArrowLeftRight,
  FileDown,
  Undo2,
  Scale,
  PlusCircle,
  Compass,
  Calculator,
  Shapes,
  BarChart3
} from 'lucide-react';
import { downloadDirectFile } from '../utils/fileDownloader';
import { WorkspaceState, CurriculumEntry, KHBDData, GradeLevel } from '../types/edtech';
import { CURRICULUM_TOAN_9, buildStateFromCurriculumEntry } from '../data/curriculumToan9';
import { 
  getCurriculumForGrade, 
  getSavedCurriculumForGrade, 
  saveCurriculumForGrade,
  resetCurriculumForGrade 
} from '../data/multiGradeCurriculum';
import { 
  exportPPCTToWordDoc, 
  generatePPCTPreviewHtml, 
  generateUpdatedPPCTFileName, 
  incrementUpdatedPPCTVersion 
} from '../utils/ppctWordExporter';
import { parseUploadedPPCT } from '../utils/ppctParser';
import { EditCurriculumLessonModal } from './EditCurriculumLessonModal';
import { CreateCurriculumLessonModal, CreateLessonFormData } from './CreateCurriculumLessonModal';
import { DeleteCurriculumLessonModal } from './DeleteCurriculumLessonModal';
import { PPCTSaveExportConfirmModal } from './PPCTSaveExportConfirmModal';
import { 
  applySeparateBranchPeriodNumbering, 
  splitLessonTitle,
  ensureLessonTitleHasPeriodCount,
  rebalanceCurriculumWeeks,
  repairAndBalanceWeeklyCurriculum,
  isHinhEntry,
  isPeriodicExamEntry
} from '../utils/curriculumHelpers';
import { 
  computeAllWeekDates, 
  loadGradeWeekAnchors, 
  adjustWeekAnchor, 
  shiftWeekAnchor, 
  resetWeekAnchors,
  WeekDateInfo 
} from '../utils/weekDateManager';
import { WeekDatePickerPopover } from './WeekDatePickerPopover';
import { 
  GradeWorkspaceData, 
  getTeacherAssignedGrades, 
  saveTeacherAssignedGrades, 
  getGradeWorkspace, 
  updateGradeWorkspace, 
  saveGradeWorkspace,
  addFileToGradeWorkspace, 
  addPpctToGradeWorkspace, 
  clearGradeWorkspaceOnPpctDelete, 
  deleteGradeWorkspaceAndRemove,
  autoAddGradeFromKHBD,
  detectGradeFromFileName, 
  setActiveGrade,
  isMockDocument,
  getExistingFilesForGrade,
  clearGradeWorkspaceFiles
} from '../utils/gradeWorkspaceManager';
import { saveTeacherProfile, getSavedTeacherProfile } from '../utils/teacherStorage';
import { extractClassesForGrade } from '../utils/classHelpers';
import { 
  getStoredPPCTList, 
  saveStoredPPCTList, 
  downloadPPCTDoc, 
  deleteStoredPPCT, 
  clearAllStoredPPCT, 
  restoreDefaultPPCT, 
  getDefaultPPCTForGrade,
  StoredPPCT 
} from '../utils/ppctStorage';
import { PPCTDeleteWarningModal } from './PPCTDeleteWarningModal';
import type { OriginalFileItem } from './OriginalFileViewerModal';
const OriginalFileViewerModal = React.lazy(() => import('./OriginalFileViewerModal').then(m => ({ default: m.OriginalFileViewerModal })));
import { KHBDUpdatedPreviewModal } from './KHBDUpdatedPreviewModal';
import { SmartGradeDetectionModal } from './SmartGradeDetectionModal';
const TeacherMultiGradeDashboardModal = React.lazy(() => import('./TeacherMultiGradeDashboardModal').then(m => ({ default: m.TeacherMultiGradeDashboardModal })));
import { KHBDConflictModal } from './KHBDConflictModal';
import { 
  getStoredVersionHistory, 
  saveStoredVersionHistory, 
  generateUpdatedKHBDFromPrompt, 
  exportVersionedKHBDToWord, 
  KHBDVersionRecord 
} from '../utils/khbdVersionManager';
import { convertDocxToPdfView } from '../utils/docxToPdfHelper';
import { extractTextFromDataUrl } from '../utils/textDecoderHelper';
import { checkApiKeyForKHBDGeneration } from '../utils/geminiAiService';

export const MASTER_PROMPT_STANDARD = `[PROMPT MASTER SOẠN KẾ HOẠCH BÀI DẠY (KHBD) CHUẨN BGDĐT & PHÁT TRIỂN NĂNG LỰC]

1. MỤC TIÊU DẠY HỌC (YÊU CẦU CẦN ĐẠT):
- Căn cứ: Công văn 5512/BGDĐT-GDTrH và Chương trình GDPT 2018 môn Toán.
- Năng lực toán học: Tư duy & lập luận toán học, Mô hình hóa toán học, Giải quyết vấn đề toán học, Giao tiếp toán học, Sử dụng công cụ & phương tiện học toán.
- Năng lực số (NLS): Tích hợp chỉ số theo Quyết định 2422/QĐ-BGDĐT (NLS 1.1 Tìm kiếm & xử lý dữ liệu số; NLS 2.3 Sử dụng phần mềm GeoGebra/máy tính cầm tay; NLS 3.1 Trình bày và chia sẻ kết quả số).
- Phẩm chất: Rèn luyện tính trung thực, chăm chỉ, trách nhiệm và tính tự chủ trong học tập.

2. CẤU TRÚC 4 HOẠT ĐỘNG SƯ PHẠM CV 5512:
- Hoạt động 1: Mở đầu / Khởi động (Tạo tình huống có vấn đề từ thực tiễn hoặc đồ thị/hình ảnh minh họa đính kèm; khơi gợi hứng thú và kết nối tri thức cũ - mới).
- Hoạt động 2: Hình thành kiến thức mới (Gồm các nhiệm vụ học tập rõ ràng, sản phẩm học sinh cần đạt, câu hỏi dẫn dắt, chốt công thức, định lý, quy tắc trọng tâm).
- Hoạt động 3: Luyện tập (Hệ thống bài tập phân hóa theo 4 mức độ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao; bám sát dạng bài tập mẫu và đề hình học đính kèm).
- Hoạt động 4: Vận dụng (Tình huống thực tế liên môn, bài toán thực tiễn đời sống, hướng dẫn học sinh ứng dụng CNTT và tự học ở nhà).

3. ĐIỀU KIỆN ĐÁP ỨNG TÀI NGUYÊN MẪU BÁM THEO:
- Tích hợp triệt để toàn bộ tài nguyên mẫu đã nạp tại Bước 4 (hình ảnh sơ đồ, giáo án mẫu, bài tập mẫu, đề hình).
- Đưa hình ảnh/sơ đồ đã tải lên vào các hoạt động tương ứng và sử dụng bài tập mẫu làm phiếu bài tập cho học sinh.
- Đồng bộ chuẩn xác theo Phân phối chương trình (PPCT): Tuần dạy, Tiết dạy, Tên bài học.`;

export const DEFAULT_SAMPLE_REF_KHBD: OriginalFileItem = { 
  name: 'KHBD_TOAN9_KNTT_TAP1_FULL_5_CHUONG_NEW_VIP_2026_2027_MUC_TIEU_CHUAN_PL1_PL3.pdf', 
  size: '3.8 MB', 
  type: 'PDF', 
  note: 'KHBD VIP Toán 9 KNTT Tập 1 Chuẩn CV 5512 & PL1 - PL3 (Bám sát từ trang 7 đến trang 9: Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn - Tiết 2)', 
  uploadedAt: 'Mẫu chuẩn hệ thống',
  description: 'KHBD tham khảo VIP chuẩn 100% ruột kiến thức Toán 9 KNTT Tập 1 (Trang 7 đến 9: Bài 2 Tiết 2)'
};

export const DEFAULT_SAMPLE_LESSON_RESOURCES: OriginalFileItem[] = [
  { 
    name: 'Bai_Tap_Mau_He_Phuong_Trinh_2_An.docx', 
    size: '850 KB', 
    type: 'DOCX', 
    note: 'Bài tập mẫu phân hóa 4 mức độ bám theo Tuần 1', 
    uploadedAt: 'Mẫu chuẩn hệ thống' 
  },
  { 
    name: 'De_Hinh_Hoc_Minh_Hoa_Tam_Giac.docx', 
    size: '640 KB', 
    type: 'DOCX', 
    note: 'Đề hình học & bài tập rèn luyện kỹ năng vẽ hình', 
    uploadedAt: 'Mẫu chuẩn hệ thống' 
  },
  { 
    name: 'Hinh_Ve_Do_Thi_He_Phuong_Trinh.png', 
    size: '320 KB', 
    type: 'IMAGE', 
    note: 'Hình ảnh đồ thị 2 đường thẳng cắt nhau trong hệ Oxy', 
    uploadedAt: 'Mẫu chuẩn hệ thống',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f8fafc"/><line x1="50" y1="200" x2="550" y2="200" stroke="%23334155" stroke-width="2"/><line x1="300" y1="50" x2="300" y2="350" stroke="%23334155" stroke-width="2"/><text x="560" y="205" fill="%23334155" font-family="sans-serif" font-size="14" font-weight="bold">x</text><text x="305" y="45" fill="%23334155" font-family="sans-serif" font-size="14" font-weight="bold">y</text><text x="285" y="220" fill="%23334155" font-family="sans-serif" font-size="14">O</text><line x1="100" y1="320" x2="500" y2="80" stroke="%232563eb" stroke-width="3"/><text x="450" y="70" fill="%232563eb" font-family="sans-serif" font-size="13" font-weight="bold">(d1): 2x - y = 3</text><line x1="120" y1="100" x2="480" y2="320" stroke="%23dc2626" stroke-width="3"/><text x="440" y="340" fill="%23dc2626" font-family="sans-serif" font-size="13" font-weight="bold">(d2): x + 2y = 4</text><circle cx="340" cy="176" r="6" fill="%2316a34a"/><text x="355" y="170" fill="%2316a34a" font-family="sans-serif" font-size="14" font-weight="bold">M(2; 1)</text></svg>'
  },
  { 
    name: 'Phieu_Hoc_Tap_KNTT_Toan9.pdf', 
    size: '1.1 MB', 
    type: 'PDF', 
    note: 'Phiếu học tập nhóm & trang SGK Tuần 1', 
    uploadedAt: 'Mẫu chuẩn hệ thống' 
  }
];

export const DEFAULT_SAMPLE_RESOURCES: OriginalFileItem[] = [
  DEFAULT_SAMPLE_REF_KHBD,
  ...DEFAULT_SAMPLE_LESSON_RESOURCES
];

const PROMPT_PRESETS = [
  {
    label: '🎯 Chuẩn CV 5512 & NLS 2422 (Mặc định)',
    prompt: MASTER_PROMPT_STANDARD
  },
  {
    label: '💡 Dạy học phân hóa 4 mức độ',
    prompt: 'Cập nhật KHBD bám sát file bài tập mẫu đã tải lên tại Bước 4: phân chia hệ thống bài tập thành 4 mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao); bổ sung ma trận và bản đặc tả CV 7991; lồng ghép hoạt động nhóm thảo luận cặp đôi và sơ đồ tư duy tóm tắt bài.'
  },
  {
    label: '📐 Tích hợp Hình ảnh & Đề hình học',
    prompt: 'Bám sát hình ảnh đồ thị và đề hình học mẫu đã nạp tại Bước 4: Hoạt động 1 xuất phát từ hình ảnh trực quan; Hoạt động 2 dẫn dắt học sinh khám phá định lý từ hình vẽ; Hoạt động 3 đưa trọn bộ câu hỏi từ đề hình vào phiếu học tập có đáp án chi tiết và thang điểm chuẩn GDPT 2018.'
  },
  {
    label: '🧩 Tích hợp STEM & Thực tiễn',
    prompt: 'Bám sát tài nguyên mẫu, nâng cấp tình huống mở đầu và vận dụng gắn liền với kinh tế thực tế; bổ sung phiếu học tập khám phá và hướng dẫn học sinh mô hình hóa toán học với phần mềm GeoGebra theo Quyết định 2422.'
  },
  {
    label: '⏱️ Tinh giản 1 tiết 45 phút',
    prompt: 'Tối ưu hóa tiến trình theo form mẫu để dạy trọn vẹn trong 45 phút; tập trung vào cốt lõi định nghĩa, ví dụ mẫu và tăng thời lượng luyện tập củng cố trên lớp.'
  }
];

interface WorkflowThreeStepsProps {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
  onOpenPublishModal: () => void;
  onOpenCurriculumModal: () => void;
}

export const WorkflowThreeSteps: React.FC<WorkflowThreeStepsProps> = ({
  state,
  setState,
  onOpenPublishModal,
  onOpenCurriculumModal
}) => {
  // 4 Steps Workflow: Bước 1: Mẫu KHBD -> Bước 2: Thông tin GV -> Bước 3: Môn & Bài dạy PPCT + Upload mẫu -> Bước 4: Xuất bản
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(2);
  const [ppctSearch, setPpctSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'all' | '1' | '2'>('all');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<'cv5512' | 'nls' | 'allinone'>('cv5512');
  
  // Danh sách tài liệu mẫu hệ thống đang bám theo (tải theo đúng khối lớp đang mở)
  const [uploadedFiles, setUploadedFiles] = useState<OriginalFileItem[]>(() => {
    const ws = getGradeWorkspace((state.khbd.grade as GradeLevel) || 'Lớp 9');
    return ws.uploadedFiles;
  });
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  // Original File Viewer Modal state (Xem file gốc chính xác 100%, không chỉnh sửa)
  const [selectedFileToView, setSelectedFileToView] = useState<OriginalFileItem | null>(null);
  const [isOriginalViewerOpen, setIsOriginalViewerOpen] = useState(false);

  // Prompt configuration & Versioning state (Chạy file KHBD theo form và xuất form mới kèm version)
  const [selectedRefFile, setSelectedRefFile] = useState<string>(() => {
    const ws = getGradeWorkspace((state.khbd.grade as GradeLevel) || 'Lớp 9');
    return ws.uploadedFiles[0]?.name || '';
  });
  const [masterPromptFile, setMasterPromptFile] = useState<OriginalFileItem | null>(() => {
    try {
      const saved = localStorage.getItem('master_prompt_file_item');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          // Tự động khôi phục rawText từ dataUrl nếu rawText bị thiếu hoặc bằng đúng tên file
          if ((!parsed.rawText || parsed.rawText.trim() === parsed.name) && parsed.dataUrl) {
            const recovered = extractTextFromDataUrl(parsed.dataUrl);
            if (recovered && recovered.trim() && recovered !== parsed.name) {
              parsed.rawText = recovered.trim();
              if (parsed.type === 'MD' || parsed.name.toLowerCase().endsWith('.md')) {
                parsed.htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; white-space: pre-wrap; font-size: 13px;">${recovered}</div>`;
              }
              try {
                localStorage.setItem('master_prompt_file_item', JSON.stringify(parsed));
              } catch (e) {
                console.warn(e);
              }
            }
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return {
      name: 'PROMPT-MASTER-SOAN-KHBD-CHUAN-BGDDT.docx',
      size: '18.4 KB',
      type: 'DOCX',
      uploadedAt: 'Mặc định Bộ GD&ĐT',
      note: 'File Prompt Master chuẩn CV 5512 & GDPT 2018 điều khiển việc tạo KHBD',
      rawText: MASTER_PROMPT_STANDARD,
      htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">PROMPT MASTER SOẠN KẾ HOẠCH BÀI DẠY (KHBD) CHUẨN BGDĐT & GDPT 2018</h2>
        <p><strong>Căn cứ pháp lý:</strong> Công văn 5512/BGDĐT-GDTrH và Chương trình GDPT 2018 môn Toán.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 13px; white-space: pre-wrap;">${MASTER_PROMPT_STANDARD}</div>
      </div>`,
      isConvertedFromWord: true,
      originalFileName: 'PROMPT-MASTER-SOAN-KHBD-CHUAN-BGDDT.docx'
    };
  });
  const [customPrompt, setCustomPrompt] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('master_prompt_file_item');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.rawText && parsed.rawText.trim() && parsed.rawText !== parsed.name) {
          return parsed.rawText.trim();
        }
        if (parsed?.dataUrl) {
          const recovered = extractTextFromDataUrl(parsed.dataUrl);
          if (recovered && recovered.trim() && recovered !== parsed.name) {
            return recovered.trim();
          }
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return MASTER_PROMPT_STANDARD;
  });
  const [promptFileName, setPromptFileName] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('master_prompt_file_item');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.name || 'PROMPT-MASTER-SOAN-KHBD-CHUAN-BGDDT.docx';
      }
    } catch (e) {
      console.warn(e);
    }
    return 'PROMPT-MASTER-SOAN-KHBD-CHUAN-BGDDT.docx';
  });
  const [isDraggingPrompt, setIsDraggingPrompt] = useState(false);
  const [isDraggingUnified, setIsDraggingUnified] = useState(false);
  const [isDraggingResource, setIsDraggingResource] = useState(false);
  const [isDraggingRefKHBD, setIsDraggingRefKHBD] = useState(false);
  const [showPromptInfoModal, setShowPromptInfoModal] = useState(false);

  // 1. Tài nguyên đưa vào bài: (ảnh, công thức, bài tập, trang SGK,...)
  const [lessonResources, setLessonResources] = useState<OriginalFileItem[]>(() => {
    try {
      const saved = localStorage.getItem(`lesson_resources_${state.khbd.grade}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    const ws = getGradeWorkspace((state.khbd.grade as GradeLevel) || 'Lớp 9');
    const filtered = ws.uploadedFiles.filter(f => !f.name.toLowerCase().includes('khbd') && !f.name.toLowerCase().includes('chuong_1_bai_1'));
    return filtered.length > 0 ? filtered : DEFAULT_SAMPLE_LESSON_RESOURCES;
  });

  // 2. KHBD tham khảo (soạn theo các bài tập trong KHBD tham khảo)
  const [referenceKHBD, setReferenceKHBD] = useState<OriginalFileItem | null>(() => {
    try {
      const saved = localStorage.getItem(`ref_khbd_item_${state.khbd.grade}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    const ws = getGradeWorkspace((state.khbd.grade as GradeLevel) || 'Lớp 9');
    const found = ws.uploadedFiles.find(f => f.name.toLowerCase().includes('khbd') || f.name.toLowerCase().includes('chuong_1_bai_1'));
    return found || DEFAULT_SAMPLE_REF_KHBD;
  });
  const [currentVersionTag, setCurrentVersionTag] = useState<string>(state.version || 'v1.0');
  const [nextVersionTag, setNextVersionTag] = useState<string>('v1.1');
  const [isRunningPrompt, setIsRunningPrompt] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [runStepText, setRunStepText] = useState('');
  const [promptExecutionSuccess, setPromptExecutionSuccess] = useState<string | null>(null);
  const [versionHistory, setVersionHistory] = useState<KHBDVersionRecord[]>(() => getStoredVersionHistory());
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPreviewUpdatedModal, setShowPreviewUpdatedModal] = useState(false);

  // Multi-Grade management state (Quản trị đa khối lớp)
  const [assignedGrades, setAssignedGrades] = useState<GradeLevel[]>(() => getTeacherAssignedGrades());
  const [showSmartGradeModal, setShowSmartGradeModal] = useState(false);
  const [showMultiGradeDashboard, setShowMultiGradeDashboard] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{
    file: File;
    dataUrl: string;
    detectedGrade: GradeLevel;
    targetType: 'ppct' | 'reference';
  } | null>(null);

  // KHBD Conflict state: Quy định chỉ cho phép nạp 1 KHBD cho 1 khối (báo lỗi & xác nhận 2 cấp độ)
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState<{
    newFile: OriginalFileItem;
    targetGrade: GradeLevel;
    existingFiles: OriginalFileItem[];
    targetType?: 'reference' | 'ppct';
  } | null>(null);

  // Stored PPCT Files (lưu trữ theo đúng khối đang mở)
  const [ppctList, setPpctList] = useState<StoredPPCT[]>(() => {
    const ws = getGradeWorkspace((state.khbd.grade as GradeLevel) || 'Lớp 9');
    return ws.ppctList;
  });
  const [isDraggingPpct, setIsDraggingPpct] = useState(false);
  const [ppctUploadSuccess, setPpctUploadSuccess] = useState<string | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState<StoredPPCT | null>(null);
  const [gradePendingDelete, setGradePendingDelete] = useState<GradeLevel | null>(null);

  // Trạng thái hiển thị file "PPCT Được cập nhật mới & Đang lưu hành" ngay bên dưới file gốc
  const [isUpdatedPPCTDeleted, setIsUpdatedPPCTDeleted] = useState(false);
  const [showConfirmDeleteUpdatedModal, setShowConfirmDeleteUpdatedModal] = useState(false);

  // ĐỒNG BỘ TUYỆT ĐỐI KHI ĐỔI KHỐI: CHỌN KHỐI 8 THÌ CHỈ DÙNG DỮ LIỆU KHỐI 8, KHÔNG LẪN LỘN
  useEffect(() => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const ws = getGradeWorkspace(currentGrade);
    setPpctList(ws.ppctList);
    setUploadedFiles(ws.uploadedFiles);
    if (ws.uploadedFiles.length > 0) {
      setSelectedRefFile(ws.uploadedFiles[0].name);
    } else {
      setSelectedRefFile('');
    }
  }, [state.khbd.grade]);

  // Sync assigned grades from custom events
  useEffect(() => {
    const handleGradesUpdated = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAssignedGrades(e.detail);
      }
    };
    window.addEventListener('assigned-grades-updated', handleGradesUpdated);
    return () => window.removeEventListener('assigned-grades-updated', handleGradesUpdated);
  }, []);

  // QUẢN LÝ MỐC NGÀY VÀ LỊCH TỰ ĐỘNG CHO TỪNG TUẦN (TUẦN 1 -> TUẦN 35)
  const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
  const [weekAnchors, setWeekAnchors] = useState<Record<number, string>>(() => loadGradeWeekAnchors(currentGrade));
  const [activeDatePickerWeek, setActiveDatePickerWeek] = useState<number | null>(null);

  // Tự động load mốc ngày theo khối lớp đang mở
  useEffect(() => {
    setWeekAnchors(loadGradeWeekAnchors(currentGrade));
    setActiveDatePickerWeek(null);
  }, [currentGrade]);

  // Tính toán toàn bộ thông tin ngày Thứ 2 -> Thứ 7 của các tuần (Tuần 1 đến Tuần 35)
  const allWeekDatesMap = useMemo(() => {
    return computeAllWeekDates(35, weekAnchors);
  }, [weekAnchors]);

  // TÍNH TOÁN TUẦN TƯƠNG ỨNG VỚI NGÀY HIỆN TẠI HỆ THỐNG
  const currentSystemWeek = useMemo(() => {
    const now = new Date();
    for (const [w, info] of allWeekDatesMap.entries()) {
      const satEnd = new Date(info.saturday);
      satEnd.setHours(23, 59, 59, 999);
      if (now >= info.monday && now <= satEnd) {
        return w;
      }
    }
    const week1 = allWeekDatesMap.get(1);
    if (week1 && now < week1.monday) return 1;
    const week35 = allWeekDatesMap.get(35);
    if (week35 && now > week35.saturday) return 35;
    return 1;
  }, [allWeekDatesMap]);

  // Accordion state: TỰ ĐỘNG MỞ TUẦN TƯƠNG ỨNG NGÀY HIỆN TẠI HỆ THỐNG THAY VÌ LUÔN MỞ TUẦN 1
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setExpandedWeeks({ [currentSystemWeek]: true });
  }, [currentSystemWeek, currentGrade]);

  // Cuộn mượt đến tuần hiện tại của hệ thống khi mở Bước 3 (thay vì luôn mở Tuần 1)
  const currentWeekCardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (currentStep === 3) {
      setExpandedWeeks(prev => ({ ...prev, [currentSystemWeek]: true }));
      const timer = setTimeout(() => {
        if (currentWeekCardRef.current) {
          currentWeekCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentSystemWeek]);

  // Cập nhật ngày cho 1 tuần (chọn bất kì ngày nào trong tuần, tự lấy T2 -> T7 và tự động rải tiếp cho các tuần sau)
  const handleSelectWeekDate = (week: number, date: Date) => {
    const updated = adjustWeekAnchor(currentGrade, week, date, weekAnchors);
    setWeekAnchors(updated);
    setUploadSuccessToast(`✓ Đã cập nhật ngày cho Tuần ${week} và tự động rải ngày cho tất cả các tuần tiếp theo!`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  // Dời tuần (+1 tuần hoặc -1 tuần) khi có lịch nghỉ lễ / Tết
  const handleShiftWeek = (week: number, daysOffset: number, currentMonday: Date) => {
    const updated = shiftWeekAnchor(currentGrade, week, daysOffset, currentMonday, weekAnchors);
    setWeekAnchors(updated);
    const label = daysOffset > 0 ? `+${daysOffset / 7} tuần` : `${daysOffset / 7} tuần`;
    setUploadSuccessToast(`✓ Đã dời lịch ${label} từ Tuần ${week} trở về sau!`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  // Khôi phục ngày chuẩn của năm học
  const handleResetWeekDates = (week: number) => {
    const updated = resetWeekAnchors(currentGrade);
    setWeekAnchors(updated);
    setUploadSuccessToast(`✓ Đã khôi phục ngày chuẩn của năm học cho toàn bộ các tuần!`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  // TỰ ĐỘNG HÓA TRẠNG THÁI ĐỢT KIỂM TRA ĐỊNH KỲ DỰA VÀO MỐC THỜI GIAN: CHƯA TỚI (CHỚP ĐỎ) VS ĐÃ QUA (MÀU XÁM BÌNH THƯỜNG)
  const isExamPassed = useCallback((weekNum: number): boolean => {
    const weekInfo = allWeekDatesMap.get(weekNum);
    if (weekInfo) {
      const satEnd = new Date(weekInfo.saturday);
      satEnd.setHours(23, 59, 59, 999);
      return new Date() > satEnd;
    }
    return weekNum < currentSystemWeek;
  }, [allWeekDatesMap, currentSystemWeek]);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  const handleExpandAll = () => {
    const allWeeks: Record<number, boolean> = {};
    for (let i = 1; i <= 35; i++) {
      allWeeks[i] = true;
    }
    setExpandedWeeks(allWeeks);
  };

  const handleCollapseAll = () => {
    setExpandedWeeks({});
  };

  // =========================================================================
  // DỮ LIỆU PHÂN PHỐI CHƯƠNG TRÌNH (PPCT) CÓ THỂ KÉO THẢ & CHỈNH SỬA TRỰC TIẾP
  // =========================================================================
  const [customCurriculum, setCustomCurriculum] = useState<CurriculumEntry[]>(() => {
    return getSavedCurriculumForGrade((state.khbd.grade as GradeLevel) || 'Lớp 9');
  });

  // Lịch sử hoàn tác kéo thả / chỉnh sửa PPCT
  const [curriculumHistory, setCurriculumHistory] = useState<CurriculumEntry[][]>([]);

  // State kéo thả trực tiếp trên giao diện tuần tiết
  const [draggedEntry, setDraggedEntry] = useState<CurriculumEntry | null>(null);
  const [dragOverWeek, setDragOverWeek] = useState<number | null>(null);
  const [dragMoveWholeLesson, setDragMoveWholeLesson] = useState<boolean>(true);

  // Modal chỉnh sửa bài / tiết PPCT
  const [isEditCurriculumModalOpen, setIsEditCurriculumModalOpen] = useState(false);
  const [editingCurriculumEntry, setEditingCurriculumEntry] = useState<CurriculumEntry | null>(null);

  // Modal tạo mới bài / tiết PPCT (theo yêu cầu và ảnh minh họa)
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);
  const [createLessonTargetWeek, setCreateLessonTargetWeek] = useState<number>(1);

  // Modal xác nhận xóa bài / tiết PPCT (hỗ trợ xóa cả bài gồm 2 tiết)
  const [entryToDelete, setEntryToDelete] = useState<CurriculumEntry | null>(null);

  // Modal hỏi Ghi đè hay Xuất file DOCX khi hoàn tất
  const [isSaveExportModalOpen, setIsSaveExportModalOpen] = useState(false);

  // Đồng bộ khi đổi khối lớp
  useEffect(() => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setCustomCurriculum(getSavedCurriculumForGrade(currentGrade));
    setCurriculumHistory([]);
  }, [state.khbd.grade]);

  // Nghe sự kiện curriculum-updated từ các nơi khác
  useEffect(() => {
    const handleCurriculumUpdated = (e: any) => {
      const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
      if (!e.detail?.grade || e.detail.grade === currentGrade) {
        if (e.detail?.source === 'internal') return;
        setCustomCurriculum(getSavedCurriculumForGrade(currentGrade));
      }
    };
    window.addEventListener('curriculum-updated', handleCurriculumUpdated);
    return () => window.removeEventListener('curriculum-updated', handleCurriculumUpdated);
  }, [state.khbd.grade]);

  // Bắt đầu kéo một tiết / bài dạy
  const handleDragStart = (e: React.DragEvent, entry: CurriculumEntry) => {
    setDraggedEntry(entry);
    e.dataTransfer.setData('text/plain', entry.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Kéo qua một tuần đích
  const handleDragOverWeek = (e: React.DragEvent, week: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverWeek !== week) {
      setDragOverWeek(week);
    }
  };

  const handleDragLeaveWeek = (e: React.DragEvent, week: number) => {
    if (dragOverWeek === week) {
      setDragOverWeek(null);
    }
  };

  // Thả bài dạy vào tuần đích với RÀNG BUỘC ĐỊNH MỨC SỐ TIẾT (4 tiết/tuần)
  const handleDropOnWeek = (targetWeek: number) => {
    setDragOverWeek(null);
    if (!draggedEntry || draggedEntry.week === targetWeek) {
      setDraggedEntry(null);
      return;
    }

    const sourceWeek = draggedEntry.week;
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';

    // Lưu snapshot để hoàn tác (Undo)
    setCurriculumHistory(prev => [...prev.slice(-10), [...customCurriculum]]);

    // Tên bài gốc sạch
    const cleanName = draggedEntry.lessonName.replace(/\s*\((?:tiết|Tiết)\s*\d+[^)]*\)/i, '').trim();

    // Tìm các tiết cùng bài trong tuần nguồn (ví dụ bài có 2 tiết)
    const sisterEntriesInWeek = customCurriculum.filter(e => 
      e.week === sourceWeek && 
      e.lessonName.replace(/\s*\((?:tiết|Tiết)\s*\d+[^)]*\)/i, '').trim().toLowerCase() === cleanName.toLowerCase()
    );

    // Xác định các tiết sẽ chuyển đi (nếu dragMoveWholeLesson và có >= 2 tiết thì chuyển cả cụm bài)
    const entriesToMove = (dragMoveWholeLesson && sisterEntriesInWeek.length > 1)
      ? sisterEntriesInWeek
      : [draggedEntry];
    
    const countToMove = entriesToMove.length;
    const entriesToMoveIds = new Set(entriesToMove.map(e => e.id));

    // RÀNG BUỘC VỀ TỔNG SỐ TIẾT QUY ĐỊNH (4 TIẾT / TUẦN):
    // Để tuần đích không bị dư tiết và tuần nguồn không bị hụt tiết:
    // Tìm các tiết đối ứng ở targetWeek để hoán đổi trả lại cho sourceWeek!
    const targetWeekEntries = customCurriculum.filter(e => e.week === targetWeek);
    
    // Ưu tiên chọn các tiết ở cuối tuần đích để đổi lại
    const swapBackEntries = targetWeekEntries.slice(-countToMove);
    const swapBackIds = new Set(swapBackEntries.map(e => e.id));

    const updated = customCurriculum.map(entry => {
      if (entriesToMoveIds.has(entry.id)) {
        return {
          ...entry,
          week: targetWeek,
          semester: (targetWeek <= 18 ? 1 : 2) as (1 | 2)
        };
      }
      if (swapBackIds.has(entry.id)) {
        return {
          ...entry,
          week: sourceWeek,
          semester: (sourceWeek <= 18 ? 1 : 2) as (1 | 2)
        };
      }
      return entry;
    });

    const standardized = applySeparateBranchPeriodNumbering(updated);
    setCustomCurriculum(standardized);
    saveCurriculumForGrade(currentGrade, standardized);

    const swapNames = swapBackEntries.map(e => e.lessonName.split('(')[0].trim()).filter((v, i, a) => a.indexOf(v) === i).join(', ');

    setUploadSuccessToast(
      `✓ Đã kéo bài "${cleanName}" (${countToMove} tiết) từ Tuần ${sourceWeek} sang Tuần ${targetWeek} và chuyển trả đối ứng ${swapBackEntries.length} tiết (${swapNames}) về Tuần ${sourceWeek} (Đảm bảo định mức 4 tiết/tuần)!`
    );
    setTimeout(() => setUploadSuccessToast(null), 5000);
    setDraggedEntry(null);
  };

  // Chỉnh sửa bài dạy / quy định số tiết từ Modal
  const handleSaveCurriculumEntry = (
    updatedEntry: CurriculumEntry, 
    moveWholeLesson: boolean, 
    swapWithWeek?: number,
    sisterPeriodSubtitles?: Record<number, string>
  ) => {
    if (!editingCurriculumEntry) return;
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const sourceWeek = editingCurriculumEntry.week;
    const targetWeek = updatedEntry.week;

    // Lưu snapshot để hoàn tác
    setCurriculumHistory(prev => [...prev.slice(-10), [...customCurriculum]]);

    const oldParsed = splitLessonTitle(editingCurriculumEntry.lessonName);
    const oldClean = oldParsed.mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim();
    const newParsed = splitLessonTitle(updatedEntry.lessonName);
    const newClean = newParsed.mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim();

    // Các tiết cùng bài trong toàn bộ PPCT hiện tại
    const sisterEntries = customCurriculum.filter(e => {
      const eClean = splitLessonTitle(e.lessonName).mainTitle
        .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
        .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
        .trim().toLowerCase();
      return eClean === oldClean.toLowerCase();
    });

    const currentCount = sisterEntries.length > 0 ? sisterEntries.length : 1;
    const targetPeriodCount = updatedEntry.periodsCount || 1;

    let workingList = [...customCurriculum];

    // TRƯỜNG HỢP 1: SỐ TIẾT TĂNG LÊN (ví dụ: từ 1 lên 2, hoặc 2 lên 3,...)
    if (targetPeriodCount > currentCount) {
      const neededExtra = targetPeriodCount - currentCount;
      // Tìm vị trí của tiết cuối cùng của bài này trong danh sách
      let lastIndex = -1;
      if (sisterEntries.length > 0) {
        lastIndex = Math.max(...sisterEntries.map(s => workingList.findIndex(e => e.id === s.id)));
      } else {
        lastIndex = workingList.findIndex(e => e.id === updatedEntry.id);
      }
      if (lastIndex === -1) lastIndex = workingList.length - 1;

      // Cập nhật các tiết hiện có của bài này
      workingList = workingList.map(e => {
        const isSelf = e.id === updatedEntry.id;
        const isSister = sisterEntries.some(s => s.id === e.id);
        if (!isSelf && !isSister) return e;

        let pNum = 1;
        if (isSelf) {
          const match = updatedEntry.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i);
          pNum = match ? parseInt(match[1], 10) : 1;
        } else {
          const match = e.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i);
          pNum = match ? parseInt(match[1], 10) : 2;
        }

        let sub = (sisterPeriodSubtitles && sisterPeriodSubtitles[pNum])
          ? sisterPeriodSubtitles[pNum].trim()
          : splitLessonTitle(e.lessonName).periodSubtitle || `(Tiết ${pNum})`;
        if (!sub.startsWith('(')) sub = `(${sub}`;
        if (!sub.endsWith(')')) sub = `${sub})`;

        return {
          ...e,
          chapter: updatedEntry.chapter,
          branch: updatedEntry.branch,
          equipment: updatedEntry.equipment,
          digitalCompetency: updatedEntry.digitalCompetency,
          periodsCount: targetPeriodCount,
          lessonName: `${newClean} (${targetPeriodCount} Tiết)\n${sub}`
        };
      });

      // Tạo các tiết mới được bổ sung thêm
      const newEntriesToAdd: CurriculumEntry[] = [];
      for (let i = 0; i < neededExtra; i++) {
        const newPeriodInLesson = currentCount + 1 + i;
        let sub = (sisterPeriodSubtitles && sisterPeriodSubtitles[newPeriodInLesson])
          ? sisterPeriodSubtitles[newPeriodInLesson].trim()
          : `(Tiết ${newPeriodInLesson})`;
        if (!sub.startsWith('(')) sub = `(${sub}`;
        if (!sub.endsWith(')')) sub = `${sub})`;

        const addedEntry: CurriculumEntry = {
          id: `${updatedEntry.id}-p${newPeriodInLesson}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          grade: updatedEntry.grade || currentGrade,
          subject: updatedEntry.subject || 'Toán học',
          semester: updatedEntry.semester,
          week: updatedEntry.week,
          periodNumber: 1, // Sẽ được tự động đánh số lại
          branch: updatedEntry.branch,
          chapter: updatedEntry.chapter,
          lessonName: `${newClean} (${targetPeriodCount} Tiết)\n${sub}`,
          equipment: updatedEntry.equipment,
          location: updatedEntry.location || 'Lớp học',
          digitalCompetency: updatedEntry.digitalCompetency,
          aiRoleCode: updatedEntry.aiRoleCode || '9.A3.1',
          periodsCount: targetPeriodCount
        };
        newEntriesToAdd.push(addedEntry);
      }

      // Tự động chèn tiết mới ngay sau tiết cuối của bài, đẩy toàn bộ các tiết sau lùi xuống
      workingList.splice(lastIndex + 1, 0, ...newEntriesToAdd);

      // Cân bằng lại tuần: chuẩn 4 tiết 1 tuần
      workingList = workingList.map((entry, idx) => {
        const calcWeek = Math.floor(idx / 4) + 1;
        return {
          ...entry,
          week: calcWeek,
          semester: (calcWeek <= 18 ? 1 : 2) as (1 | 2)
        };
      });
    }
    // TRƯỜNG HỢP 2: SỐ TIẾT GIẢM XUỐNG (ví dụ: từ 3 xuống 2, hoặc 2 xuống 1,...)
    else if (targetPeriodCount < currentCount) {
      // Sắp xếp các sisterEntries theo thứ tự xuất hiện trong workingList
      const sisterIndices = sisterEntries
        .map(s => workingList.findIndex(e => e.id === s.id))
        .filter(idx => idx !== -1)
        .sort((a, b) => a - b);

      // Giữ lại targetPeriodCount tiết đầu, loại bỏ các tiết thừa ở đuôi
      const indicesToRemove = new Set(sisterIndices.slice(targetPeriodCount));
      workingList = workingList.filter((_, idx) => !indicesToRemove.has(idx));

      // Cập nhật lại các tiết còn lại của bài
      workingList = workingList.map(e => {
        const isSelf = e.id === updatedEntry.id;
        const isSister = sisterEntries.some(s => s.id === e.id);
        if (!isSelf && !isSister) return e;

        let sub = '';
        if (targetPeriodCount === 1) {
          sub = '';
        } else {
          const match = e.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i);
          const pNum = match ? parseInt(match[1], 10) : 1;
          sub = (sisterPeriodSubtitles && sisterPeriodSubtitles[pNum])
            ? sisterPeriodSubtitles[pNum].trim()
            : splitLessonTitle(e.lessonName).periodSubtitle || `(Tiết ${pNum})`;
          if (!sub.startsWith('(')) sub = `(${sub}`;
          if (!sub.endsWith(')')) sub = `${sub})`;
        }

        return {
          ...e,
          chapter: updatedEntry.chapter,
          branch: updatedEntry.branch,
          equipment: updatedEntry.equipment,
          digitalCompetency: updatedEntry.digitalCompetency,
          periodsCount: targetPeriodCount,
          lessonName: sub ? `${newClean} (${targetPeriodCount} Tiết)\n${sub}` : `${newClean} (${targetPeriodCount} Tiết)`
        };
      });

      // Cân bằng lại tuần: chuẩn 4 tiết 1 tuần
      workingList = workingList.map((entry, idx) => {
        const calcWeek = Math.floor(idx / 4) + 1;
        return {
          ...entry,
          week: calcWeek,
          semester: (calcWeek <= 18 ? 1 : 2) as (1 | 2)
        };
      });
    }
    // TRƯỜNG HỢP 3: SỐ TIẾT KHÔNG ĐỔI (Chỉnh sửa nội dung hoặc tuần)
    else {
      const isWeekChanged = targetWeek !== sourceWeek;
      const sisterIds = new Set(sisterEntries.map(s => s.id));
      const countToMove = (isWeekChanged && moveWholeLesson) ? sisterEntries.length : 1;
      let swapBackIds = new Set<string>();

      if (isWeekChanged && swapWithWeek) {
        const targetEntries = workingList.filter(e => e.week === targetWeek && !sisterIds.has(e.id));
        const chosen = targetEntries.slice(-countToMove);
        swapBackIds = new Set(chosen.map(c => c.id));
      }

      workingList = workingList.map(entry => {
        if (entry.id === updatedEntry.id) {
          return {
            ...updatedEntry,
            periodsCount: targetPeriodCount,
            lessonName: updatedEntry.lessonName,
            week: targetWeek,
            semester: (targetWeek <= 18 ? 1 : 2) as (1 | 2)
          };
        }
        if (sisterIds.has(entry.id)) {
          const matchP = entry.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i);
          const pNum = matchP ? parseInt(matchP[1], 10) : 2;
          let sSub = (sisterPeriodSubtitles && sisterPeriodSubtitles[pNum])
            ? sisterPeriodSubtitles[pNum].trim()
            : splitLessonTitle(entry.lessonName).periodSubtitle || `(Tiết ${pNum})`;
          if (!sSub.startsWith('(')) sSub = `(${sSub}`;
          if (!sSub.endsWith(')')) sSub = `${sSub})`;

          return {
            ...entry,
            chapter: updatedEntry.chapter,
            branch: updatedEntry.branch,
            periodsCount: targetPeriodCount,
            digitalCompetency: updatedEntry.digitalCompetency,
            equipment: updatedEntry.equipment,
            lessonName: `${newClean} (${targetPeriodCount} Tiết)\n${sSub}`,
            week: (isWeekChanged && moveWholeLesson) ? targetWeek : entry.week,
            semester: ((isWeekChanged && moveWholeLesson) ? (targetWeek <= 18 ? 1 : 2) : entry.semester) as (1 | 2)
          };
        }
        if (swapBackIds.has(entry.id)) {
          return {
            ...entry,
            week: sourceWeek,
            semester: (sourceWeek <= 18 ? 1 : 2) as (1 | 2)
          };
        }
        return entry;
      });
    }

    const standardized = applySeparateBranchPeriodNumbering(workingList);
    setCustomCurriculum(standardized);
    saveCurriculumForGrade(currentGrade, standardized);

    // 1. TẠO TIÊU ĐỀ FILE THEO ĐÚNG YÊU CẦU: "PPCT Được cập nhật mới & Đang lưu hành"
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const updateTitle = `PPCT Được cập nhật mới & Đang lưu hành`;
    const newFileName = `${updateTitle}.docx`;

    setIsUpdatedPPCTDeleted(false);

    // 2. TẠO FILE MỚI ĐẦY ĐỦ THÔNG TIN, LƯU HÀNH NGAY (isCirculating: true)
    const newPpctItem: StoredPPCT = {
      id: `ppct-update-${Date.now()}`,
      name: newFileName,
      originalFileName: newFileName,
      size: '138.5 KB',
      uploadedAt: `${dateStr} ${timeStr}`,
      type: 'docx',
      description: `Bản PPCT được cập nhật mới hiệu lực cho ${currentGrade}`,
      totalPeriods: 140,
      isDefault: false,
      isConvertedFromWord: true,
      isCirculating: true, // Lưu hành ngay PPCT mới!
      isOriginal: false,
      curriculumData: standardized
    };

    // 3. ĐẶT NGAY BÊN DƯỚI FILE GỐC
    let originalItem: StoredPPCT;
    let otherItems: StoredPPCT[] = [];

    if (ppctList.length > 0) {
      originalItem = { ...ppctList[0], isOriginal: true, isCirculating: false };
      otherItems = ppctList.slice(1).map(item => ({ ...item, isCirculating: false }));
    } else {
      const defaults = getDefaultPPCTForGrade(currentGrade);
      originalItem = defaults[0] || {
        id: `ppct-${currentGrade.replace(/\s+/g, '_').toLowerCase()}-goc`,
        name: `PPCT ${currentGrade} (140 tiết) - Năm học 2026-2027.docx`,
        originalFileName: `PPCT ${currentGrade} (140 tiết) - Năm học 2026-2027.docx`,
        size: '142.5 KB',
        uploadedAt: 'File gốc ban đầu',
        type: 'docx',
        description: `Kế hoạch dạy học môn Toán ${currentGrade} (140 tiết) - Trường THCS Mỹ Hóa`,
        totalPeriods: 140,
        isOriginal: true,
        isCirculating: false,
        isConvertedFromWord: true
      };
    }

    // Danh sách mới: File gốc -> File mới cập nhật (ngay bên dưới file gốc) -> Các bản cập nhật cũ hơn
    const newPpctList: StoredPPCT[] = [
      originalItem,
      newPpctItem,
      ...otherItems
    ];

    setPpctList(newPpctList);
    saveStoredPPCTList(newPpctList, currentGrade);

    // Đồng bộ vào GradeWorkspace
    const ws = getGradeWorkspace(currentGrade);
    ws.ppctList = newPpctList;
    saveGradeWorkspace(currentGrade, ws);

    // 4. LƯU HÀNH NGAY: Đồng bộ lại bài học đang mở nếu bài đang mở bị đổi tên
    if (state.khbd.lessonName.toLowerCase().includes(oldClean.toLowerCase())) {
      setState(prev => ({
        ...prev,
        khbd: {
          ...prev.khbd,
          lessonName: updatedEntry.lessonName,
          chapter: updatedEntry.chapter,
          periodNumber: updatedEntry.periodNumber,
          periodsCount: updatedEntry.periodsCount
        }
      }));
    }

    if (standardized.length !== 140) {
      setUploadSuccessToast(
        `✓ Đã cập nhật bài "${newClean}" (${currentCount} tiết → ${targetPeriodCount} tiết, chuẩn 4 tiết/tuần). ⚠️ CẢNH BÁO: Tổng số tiết hiện tại là ${standardized.length} tiết (${standardized.length > 140 ? `vượt quá ${standardized.length - 140} tiết` : `thiếu ${140 - standardized.length} tiết`}). Hệ thống tạm khóa soạn KHBD cho đến khi điều chỉnh đúng 140 tiết như ban đầu!`
      );
    } else {
      setUploadSuccessToast(`🎉 Đã xác nhận cập nhật và lưu hành ngay: "${updateTitle}"! Toàn bộ 140 tiết học và danh sách bài dạy đã được đồng bộ hiệu lực.`);
    }
    setTimeout(() => setUploadSuccessToast(null), 6000);
    setIsEditCurriculumModalOpen(false);
    setEditingCurriculumEntry(null);
  };

  // 1. DI CHUYỂN TIẾT THEO TỪNG PHÂN MÔN (Số chỉ lên/xuống theo Số, Hình chỉ lên/xuống theo Hình)
  // Tự động bảo đảm quy tắc 4 tiết/tuần:
  // - Nếu đẩy lên 4 tiết số thì 0 tiết hình (tiết hình bị đẩy sang tuần sau)
  // - Nếu giảm còn 3 tiết số thì kéo lên 1 tiết hình
  // - Nếu giảm còn 1 tiết số thì kéo lên 3 tiết hình
  // 1. DI CHUYỂN TIẾT THEO TỪNG PHÂN MÔN (Số chỉ lên/xuống theo Số, Hình chỉ lên/xuống theo Hình)
  // Tự động bảo đảm quy tắc chuẩn: 140 tiết/năm, 4 tiết/tuần
  // - Nội bộ trong tuần: hoán đổi vị trí thứ tự tiết để sắp xếp lại bài giảng
  // - Sang tuần khác (lên tuần trước hoặc xuống tuần sau): hoán đổi đối ứng với tuần liền kề để cả 2 tuần luôn duy trì chuẩn 4 tiết
  const handleMoveBranchEntry = (entry: CurriculumEntry, direction: 'up' | 'down') => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const isHinh = isHinhEntry(entry);
    const targetWeek = entry.week;

    if (isPeriodicExamEntry(entry).isExam) {
      setUploadSuccessToast('Tiết kiểm tra định kỳ được định vị cố định song song giữa Đại số và Hình học, không di chuyển lẻ.');
      setTimeout(() => setUploadSuccessToast(null), 3000);
      return;
    }

    // Lưu snapshot để hoàn tác
    setCurriculumHistory(prev => [...prev.slice(-10), [...customCurriculum]]);

    let newList = customCurriculum.map(e => ({ ...e }));

    // Chỉ lọc các tiết DẠY THÔNG THƯỜNG cùng phân môn trong tuần hiện tại (bỏ qua bài thi định kỳ)
    const regularBranchEntriesInWeek = newList.filter(
      e => e.week === targetWeek && isHinhEntry(e) === isHinh && !isPeriodicExamEntry(e).isExam
    );
    const idxInWeek = regularBranchEntriesInWeek.findIndex(e => e.id === entry.id);

    if (direction === 'up') {
      if (idxInWeek > 0) {
        // Đổi chỗ nội bộ trong tuần giữa 2 tiết cùng phân môn
        const prevEntry = regularBranchEntriesInWeek[idxInWeek - 1];
        const idxA = newList.findIndex(e => e.id === entry.id);
        const idxB = newList.findIndex(e => e.id === prevEntry.id);
        if (idxA !== -1 && idxB !== -1) {
          const temp = newList[idxA];
          newList[idxA] = newList[idxB];
          newList[idxB] = temp;
        }
      } else {
        // Tiết đầu tiên của phân môn trong tuần: ĐẨY LÊN TUẦN TRƯỚC (W - 1)
        if (targetWeek <= 1) {
          setUploadSuccessToast('Tiết học đã ở Tuần 1 (đầu năm học)!');
          setTimeout(() => setUploadSuccessToast(null), 2500);
          return;
        }
        const prevWeek = targetWeek - 1;
        const prevHasExam = newList.some(e => e.week === prevWeek && isPeriodicExamEntry(e).isExam);
        const prevMaxBranch = prevHasExam ? 3 : 4;
        const prevBranchCount = newList.filter(e => e.week === prevWeek && isHinhEntry(e) === isHinh).length;

        if (prevBranchCount >= prevMaxBranch) {
          setUploadSuccessToast(
            prevHasExam 
              ? `Tuần ${prevWeek} có bài kiểm tra định kỳ: phân môn này đã đạt tối đa ${prevMaxBranch} tiết!` 
              : `Tuần ${prevWeek} đã đạt tối đa 4 tiết cho phân môn ${isHinh ? 'Hình' : 'Số'}!`
          );
          setTimeout(() => setUploadSuccessToast(null), 3000);
          return;
        }

        // Lấy 1 bài dạy thông thường đối ứng từ tuần W-1 để đẩy xuống tuần W
        const prevOppositeEntries = newList.filter(
          e => e.week === prevWeek && isHinhEntry(e) !== isHinh && !isPeriodicExamEntry(e).isExam
        );
        if (prevOppositeEntries.length > 0) {
          const oppositeToPush = prevOppositeEntries[prevOppositeEntries.length - 1];
          oppositeToPush.week = targetWeek;
          oppositeToPush.semester = (targetWeek <= 18 ? 1 : 2) as (1 | 2);

          const entryToMove = newList.find(e => e.id === entry.id);
          if (entryToMove) {
            entryToMove.week = prevWeek;
            entryToMove.semester = (prevWeek <= 18 ? 1 : 2) as (1 | 2);
          }
        } else {
          setUploadSuccessToast(`Tuần ${prevWeek} không còn bài đối ứng để hoán đổi!`);
          setTimeout(() => setUploadSuccessToast(null), 3000);
          return;
        }
      }
    } else {
      // direction === 'down'
      if (idxInWeek < regularBranchEntriesInWeek.length - 1) {
        // Đổi chỗ nội bộ trong tuần giữa 2 tiết cùng phân môn
        const nextEntry = regularBranchEntriesInWeek[idxInWeek + 1];
        const idxA = newList.findIndex(e => e.id === entry.id);
        const idxB = newList.findIndex(e => e.id === nextEntry.id);
        if (idxA !== -1 && idxB !== -1) {
          const temp = newList[idxA];
          newList[idxA] = newList[idxB];
          newList[idxB] = temp;
        }
      } else {
        // Tiết cuối của phân môn trong tuần: ĐẨY XUỐNG TUẦN SAU (W + 1)
        if (targetWeek >= 35) {
          setUploadSuccessToast('Tiết học đã ở Tuần 35 (cuối năm học)!');
          setTimeout(() => setUploadSuccessToast(null), 2500);
          return;
        }
        const nextWeek = targetWeek + 1;
        const nextHasExam = newList.some(e => e.week === nextWeek && isPeriodicExamEntry(e).isExam);
        const nextMaxBranch = nextHasExam ? 3 : 4;
        const nextBranchCount = newList.filter(e => e.week === nextWeek && isHinhEntry(e) === isHinh).length;

        if (nextBranchCount >= nextMaxBranch) {
          setUploadSuccessToast(
            nextHasExam
              ? `Tuần ${nextWeek} có bài kiểm tra định kỳ: phân môn này đã đạt tối đa ${nextMaxBranch} tiết!`
              : `Tuần ${nextWeek} đã đạt tối đa 4 tiết cho phân môn ${isHinh ? 'Hình' : 'Số'}!`
          );
          setTimeout(() => setUploadSuccessToast(null), 3000);
          return;
        }

        // Lấy 1 bài dạy thông thường đối ứng từ tuần W+1 để kéo lên tuần W
        const nextOppositeEntries = newList.filter(
          e => e.week === nextWeek && isHinhEntry(e) !== isHinh && !isPeriodicExamEntry(e).isExam
        );
        if (nextOppositeEntries.length > 0) {
          const oppositeToPull = nextOppositeEntries[0];
          oppositeToPull.week = targetWeek;
          oppositeToPull.semester = (targetWeek <= 18 ? 1 : 2) as (1 | 2);

          const entryToMove = newList.find(e => e.id === entry.id);
          if (entryToMove) {
            entryToMove.week = nextWeek;
            entryToMove.semester = (nextWeek <= 18 ? 1 : 2) as (1 | 2);
          }
        } else {
          setUploadSuccessToast(`Tuần ${nextWeek} không còn bài đối ứng để hoán đổi!`);
          setTimeout(() => setUploadSuccessToast(null), 3000);
          return;
        }
      }
    }

    const standardized = applySeparateBranchPeriodNumbering(newList);
    setCustomCurriculum(standardized);
    saveCurriculumForGrade(currentGrade, standardized, 'internal');

    const cleanTitle = splitLessonTitle(entry.lessonName).mainTitle.replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '').trim();
    const branchLabel = isHinh ? 'Hình học' : 'Số & Đại số';
    setUploadSuccessToast(`✓ Đã chuyển tiết ${branchLabel} "${cleanTitle}" (${direction === 'up' ? 'Lên' : 'Xuống'}). Cả 2 tuần vẫn đảm bảo chuẩn 4 tiết!`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  const handleMoveEntryUp = (entry: CurriculumEntry) => handleMoveBranchEntry(entry, 'up');
  const handleMoveEntryDown = (entry: CurriculumEntry) => handleMoveBranchEntry(entry, 'down');

  // 2. THIẾT LẬP TRỰC TIẾP TỶ LỆ TIẾT SỐ / HÌNH CHO TUẦN (4-0, 3-1, 2-2, 1-3, 0-4 HOẶC 3-1, 2-2, 1-3 KHI CÓ KIỂM TRA)
  const handleSetWeekBranchRatio = (targetWeek: number, targetSo: number, targetHinh: number) => {
    if (targetSo + targetHinh !== 4) return;
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';

    setCurriculumHistory(prev => [...prev.slice(-10), [...customCurriculum]]);

    let current = customCurriculum.map(e => ({ ...e }));
    const hasExam = current.some(e => e.week === targetWeek && isPeriodicExamEntry(e).isExam);
    if (hasExam && (targetSo > 3 || targetHinh > 3 || targetSo < 1 || targetHinh < 1)) {
      setUploadSuccessToast(`Tuần ${targetWeek} có bài kiểm tra: mỗi cột tối đa 3 tiết và tối thiểu 1 tiết (3-1, 2-2, hoặc 1-3)!`);
      setTimeout(() => setUploadSuccessToast(null), 3000);
      return;
    }

    // Candidate donor weeks: prefer adjacent weeks in same semester
    const candidateWeeks: number[] = [];
    const targetSem = targetWeek <= 18 ? 1 : 2;
    for (let offset = 1; offset <= 35; offset++) {
      const after = targetWeek + offset;
      const before = targetWeek - offset;
      if (after <= 35 && (after <= 18 ? 1 : 2) === targetSem) candidateWeeks.push(after);
      if (before >= 1 && (before <= 18 ? 1 : 2) === targetSem) candidateWeeks.push(before);
    }
    for (let w = 1; w <= 35; w++) {
      if (w !== targetWeek && !candidateWeeks.includes(w)) candidateWeeks.push(w);
    }

    let iterations = 0;
    while (iterations < 10) {
      iterations++;
      const curSo = current.filter(e => e.week === targetWeek && !isHinhEntry(e)).length;
      const curHinh = current.filter(e => e.week === targetWeek && isHinhEntry(e)).length;

      if (curSo === targetSo && curHinh === targetHinh) break;

      const wantMoreHinh = curHinh < targetHinh;
      const branchToPushIsHinh = !wantMoreHinh;
      const branchToPullIsHinh = wantMoreHinh;

      // Tìm bài thông thường trong targetWeek để đẩy đi
      const pushCandidates = current.filter(
        e => e.week === targetWeek && isHinhEntry(e) === branchToPushIsHinh && !isPeriodicExamEntry(e).isExam
      );
      if (pushCandidates.length === 0) break;
      const entryToPush = pushCandidates[pushCandidates.length - 1];

      let donorWeek: number | null = null;
      let entryToPull: CurriculumEntry | undefined;

      for (const w of candidateWeeks) {
        const wHasExam = current.some(e => e.week === w && isPeriodicExamEntry(e).isExam);
        const wMaxPushBranch = wHasExam ? 3 : 4;
        const wMinPushBranch = wHasExam ? 1 : 0;
        const wPushBranchCount = current.filter(e => e.week === w && isHinhEntry(e) === branchToPushIsHinh).length;
        if (wPushBranchCount >= wMaxPushBranch) continue;

        const wPullBranchCount = current.filter(e => e.week === w && isHinhEntry(e) === branchToPullIsHinh).length;
        if (wPullBranchCount <= wMinPushBranch) continue;

        const pullCandidates = current.filter(
          e => e.week === w && isHinhEntry(e) === branchToPullIsHinh && !isPeriodicExamEntry(e).isExam
        );
        if (pullCandidates.length > 0) {
          donorWeek = w;
          entryToPull = pullCandidates[0];
          break;
        }
      }

      if (!donorWeek || !entryToPull) break;

      entryToPush.week = donorWeek;
      entryToPush.semester = (donorWeek <= 18 ? 1 : 2) as (1 | 2);

      entryToPull.week = targetWeek;
      entryToPull.semester = (targetWeek <= 18 ? 1 : 2) as (1 | 2);
    }

    const standardized = applySeparateBranchPeriodNumbering(current);
    setCustomCurriculum(standardized);
    saveCurriculumForGrade(currentGrade, standardized, 'internal');

    const finalSo = standardized.filter(e => e.week === targetWeek && !isHinhEntry(e)).length;
    const finalHinh = standardized.filter(e => e.week === targetWeek && isHinhEntry(e)).length;
    setUploadSuccessToast(`✓ Đã đặt tỷ lệ Tuần ${targetWeek}: ${finalSo} Số • ${finalHinh} Hình (Đảm bảo đúng 4 tiết/tuần, tổng 140 tiết).`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // 3. TĂNG / GIẢM TIẾT CỦA MỘT PHÂN MÔN TRONG TUẦN (+ / - TRÊN HEADER PHÂN MÔN)
  const handleAdjustBranchForWeek = (targetWeek: number, branchType: 'so' | 'hinh', delta: number) => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    if (targetWeek < 1 || targetWeek > 35) return;

    let current = customCurriculum.map(e => ({ ...e }));
    const hasExam = current.some(e => e.week === targetWeek && isPeriodicExamEntry(e).isExam);
    const maxBranchCount = hasExam ? 3 : 4;
    const minBranchCount = hasExam ? 1 : 0;

    const isTargetHinh = branchType === 'hinh';
    const currentBranchCount = current.filter(e => e.week === targetWeek && isHinhEntry(e) === isTargetHinh).length;

    if (delta > 0 && currentBranchCount >= maxBranchCount) {
      setUploadSuccessToast(
        hasExam
          ? `Tuần ${targetWeek} có bài kiểm tra định kỳ: phân môn này chỉ được tối đa ${maxBranchCount} tiết!`
          : `Tuần ${targetWeek} đã đạt tối đa 4 tiết cho phân môn ${branchType === 'so' ? 'Số' : 'Hình'}!`
      );
      setTimeout(() => setUploadSuccessToast(null), 3000);
      return;
    }

    if (delta < 0 && currentBranchCount <= minBranchCount) {
      setUploadSuccessToast(
        hasExam
          ? `Tuần ${targetWeek} có bài kiểm tra định kỳ: phân môn này cần giữ tối thiểu ${minBranchCount} tiết!`
          : `Tuần ${targetWeek} hiện có 0 tiết cho phân môn ${branchType === 'so' ? 'Số' : 'Hình'}!`
      );
      setTimeout(() => setUploadSuccessToast(null), 3000);
      return;
    }

    const curSo = current.filter(e => e.week === targetWeek && !isHinhEntry(e)).length;
    const curHinh = current.filter(e => e.week === targetWeek && isHinhEntry(e)).length;
    const targetSo = branchType === 'so' ? curSo + delta : curSo - delta;
    const targetHinh = branchType === 'hinh' ? curHinh + delta : curHinh - delta;

    handleSetWeekBranchRatio(targetWeek, targetSo, targetHinh);
  };

  // 3. MỞ MODAL TẠO MỚI TIẾT DẠY (theo yêu cầu vẽ chữ đỏ của người dùng)
  const handleOpenCreateLessonModal = (week?: number) => {
    setCreateLessonTargetWeek(week || currentSystemWeek || 1);
    setIsCreateLessonModalOpen(true);
  };

  // 4. XỬ LÝ TẠO MỚI TIẾT DẠY VÀ BỔ SUNG VÀO PPCT
  const handleCreateLesson = (data: CreateLessonFormData) => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    
    // Lưu snapshot để hoàn tác
    setCurriculumHistory(prev => [...prev.slice(-10), [...customCurriculum]]);

    const newCount = data.periodsCount || 1;
    const newClean = data.mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim();

    const newEntriesToAdd: CurriculumEntry[] = [];
    for (let p = 1; p <= newCount; p++) {
      let sub = data.subtitles[p] ? data.subtitles[p].trim() : `Tiết ${p}`;
      if (!sub.startsWith('(')) sub = `(${sub}`;
      if (!sub.endsWith(')')) sub = `${sub})`;

      const formattedLessonName = newCount === 1 
        ? `${newClean} (1 Tiết)`
        : `${newClean} (${newCount} Tiết)\n${sub}`;

      const newEntry: CurriculumEntry = {
        id: `created-lesson-${Date.now()}-${p}-${Math.random().toString(36).substring(2, 6)}`,
        grade: currentGrade,
        subject: 'Toán học',
        semester: (data.week <= 18 ? 1 : 2) as (1 | 2),
        week: data.week,
        periodNumber: 1, // Sẽ được tự động đánh số lại
        branch: data.branch,
        chapter: data.chapter,
        lessonName: formattedLessonName,
        equipment: data.equipment || 'Máy tính, tivi kết nối mạng, SGK Toán 9',
        location: 'Lớp học',
        digitalCompetency: data.digitalCompetency || '3.1TC2a: Tìm kiếm và xử lý dữ liệu số',
        aiRoleCode: '9.A3.1',
        periodsCount: newCount
      };
      newEntriesToAdd.push(newEntry);
    }

    // Chèn vào vị trí thích hợp trong customCurriculum (cuối tuần được chọn)
    let insertIndex = -1;
    const weekIndices = customCurriculum
      .map((e, idx) => ({ e, idx }))
      .filter(({ e }) => e.week === data.week)
      .map(item => item.idx);

    if (weekIndices.length > 0) {
      insertIndex = Math.max(...weekIndices) + 1;
    } else {
      const prevWeekIndices = customCurriculum
        .map((e, idx) => ({ e, idx }))
        .filter(({ e }) => e.week < data.week)
        .map(item => item.idx);
      if (prevWeekIndices.length > 0) {
        insertIndex = Math.max(...prevWeekIndices) + 1;
      } else {
        insertIndex = 0;
      }
    }

    let workingList = [...customCurriculum];
    workingList.splice(insertIndex, 0, ...newEntriesToAdd);

    // Cân bằng lại tuần: chuẩn 4 tiết 1 tuần
    workingList = workingList.map((entry, idx) => {
      const calcWeek = Math.floor(idx / 4) + 1;
      return {
        ...entry,
        week: calcWeek,
        semester: (calcWeek <= 18 ? 1 : 2) as (1 | 2)
      };
    });

    const standardized = applySeparateBranchPeriodNumbering(workingList);
    setCustomCurriculum(standardized);
    saveCurriculumForGrade(currentGrade, standardized);

    // Tự động mở rộng tuần vừa tạo
    setExpandedWeeks(prev => ({ ...prev, [data.week]: true }));

    if (standardized.length !== 140) {
      setUploadSuccessToast(
        `✓ Đã thêm bài "${newClean}" (${newCount} tiết) vào Tuần ${data.week}. ⚠️ PPCT hiện có ${standardized.length} tiết (chuẩn là 140 tiết). Cần đạt đúng 140 tiết để hoàn thành!`
      );
    } else {
      setUploadSuccessToast(`🎉 Đã thêm thành công bài "${newClean}" (${newCount} tiết) vào Tuần ${data.week}. PPCT đạt chuẩn 140 tiết!`);
    }
    setTimeout(() => setUploadSuccessToast(null), 6000);
    setIsCreateLessonModalOpen(false);
  };

  // 5. YÊU CẦU XÓA BÀI HỌC / TIẾT HỌC
  const handleRequestDeleteLesson = (entry: CurriculumEntry) => {
    setEntryToDelete(entry);
  };

  // 6. XÁC NHẬN XÓA BÀI HỌC / TIẾT HỌC (Hỗ trợ: "nếu 2 tiết thì xóa cả hai")
  const handleConfirmDeleteLesson = (deleteAllSister: boolean) => {
    if (!entryToDelete) return;
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';

    // Lưu snapshot để hoàn tác
    setCurriculumHistory(prev => [...prev.slice(-10), [...customCurriculum]]);

    const { mainTitle } = splitLessonTitle(entryToDelete.lessonName);
    const cleanMain = mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim();

    let idsToRemove = new Set<string>();
    if (deleteAllSister) {
      const sisterEntries = customCurriculum.filter(e => {
        const c = splitLessonTitle(e.lessonName).mainTitle
          .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
          .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
          .trim().toLowerCase();
        return c === cleanMain.toLowerCase();
      });
      sisterEntries.forEach(s => idsToRemove.add(s.id));
    } else {
      idsToRemove.add(entryToDelete.id);
    }

    let newList = customCurriculum.filter(e => !idsToRemove.has(e.id));

    // Cân bằng lại tuần: chuẩn 4 tiết 1 tuần
    newList = newList.map((item, idx) => {
      const calcWeek = Math.floor(idx / 4) + 1;
      return {
        ...item,
        week: calcWeek,
        semester: (calcWeek <= 18 ? 1 : 2) as (1 | 2)
      };
    });

    const standardized = applySeparateBranchPeriodNumbering(newList);
    setCustomCurriculum(standardized);
    saveCurriculumForGrade(currentGrade, standardized);

    const removedCount = idsToRemove.size;
    setUploadSuccessToast(
      `🗑️ Đã xóa bài "${cleanMain}" (${removedCount} tiết). PPCT hiện có ${standardized.length} tiết (chuẩn là 140 tiết). Bấm "+ Tạo mới tiết" để bổ sung hoặc khôi phục 140 tiết.`
    );
    setTimeout(() => setUploadSuccessToast(null), 6000);

    setEntryToDelete(null);
    setIsEditCurriculumModalOpen(false);
  };

  // Chuyển đổi trạng thái lưu hành sang một bản PPCT cụ thể
  const handleCirculatePPCT = (targetItem: StoredPPCT) => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const updatedList = ppctList.map(item => ({
      ...item,
      isCirculating: item.id === targetItem.id
    }));
    setPpctList(updatedList);
    saveStoredPPCTList(updatedList, currentGrade);

    const ws = getGradeWorkspace(currentGrade);
    ws.ppctList = updatedList;
    saveGradeWorkspace(currentGrade, ws);

    if (targetItem.curriculumData && targetItem.curriculumData.length > 0) {
      setCustomCurriculum(targetItem.curriculumData);
      saveCurriculumForGrade(currentGrade, targetItem.curriculumData);
    }

    setUploadSuccessToast(`🎉 Đã kích hoạt lưu hành ngay: "${targetItem.name}"! Toàn bộ 140 tiết học đã được đồng bộ hiệu lực.`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  // Tải về file PPCT chính xác 100% native .docx không lỗi
  const handleDownloadPPCTItem = async (item: StoredPPCT) => {
    if (item.dataUrl) {
      downloadPPCTDoc(item);
      return;
    }
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const isUpdatedItem = item.id.includes('updated') || item.name.includes('cập nhật') || item.name.includes('CAP_NHAT');
    const targetFileName = isUpdatedItem 
      ? generateUpdatedPPCTFileName(currentGrade)
      : (item.name.endsWith('.docx') ? item.name : `${item.name}.docx`);

    const entriesToExport = item.curriculumData || customCurriculum;
    try {
      await exportPPCTToWordDoc(entriesToExport, {
        grade: currentGrade,
        teacherName: state.khbd.teacherName || 'Châu Ngọc Bảo Trân',
        subject: state.khbd.subject || 'Toán học',
        schoolYear: state.khbd.schoolYear || '2026 - 2027',
        fileName: targetFileName
      });
      if (isUpdatedItem) {
        incrementUpdatedPPCTVersion(currentGrade);
      }
      setUploadSuccessToast(`✓ Đã tải về thành công file Word .docx: ${targetFileName}!`);
      setTimeout(() => setUploadSuccessToast(null), 4000);
    } catch (err) {
      console.error('Lỗi xuất file Word PPCT:', err);
      downloadPPCTDoc(item);
    }
  };

  // Xem file "PPCT Được cập nhật mới & Đang lưu hành"
  const handleViewUpdatedPPCT = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const updatedFileName = generateUpdatedPPCTFileName(currentGrade);
    const previewHtml = generatePPCTPreviewHtml(customCurriculum, {
      grade: currentGrade,
      teacherName: state.khbd.teacherName || 'Châu Ngọc Bảo Trân',
      subject: state.khbd.subject || 'Toán học',
      schoolYear: state.khbd.schoolYear || '2026 - 2027',
      fileName: updatedFileName
    });

    setSelectedFileToView({
      id: 'ppct-updated-circulating',
      name: updatedFileName,
      size: '138.5 KB',
      type: 'DOCX',
      uploadedAt: 'Bản cập nhật mới',
      note: `Phân phối chương trình môn Toán ${currentGrade} (140 tiết) - Bản cập nhật mới & Đang lưu hành`,
      description: `Phân phối chương trình môn Toán ${currentGrade} (140 tiết) - Bản cập nhật mới & Đang lưu hành`,
      isConvertedFromWord: true,
      originalFileName: updatedFileName,
      htmlContent: previewHtml
    });
    setIsOriginalViewerOpen(true);
  };

  // Xóa file "PPCT Được cập nhật mới & Đang lưu hành"
  const handleDeleteUpdatedPPCT = () => {
    setShowConfirmDeleteUpdatedModal(true);
  };

  const handleConfirmDeleteUpdatedPPCT = () => {
    setShowConfirmDeleteUpdatedModal(false);
    setIsUpdatedPPCTDeleted(true);
    setUploadSuccessToast('✓ Đã xóa file: PPCT Được cập nhật mới & Đang lưu hành');
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Hoàn tác thao tác trước đó
  const handleUndoCurriculum = () => {
    if (curriculumHistory.length === 0) return;
    const previous = curriculumHistory[curriculumHistory.length - 1];
    setCurriculumHistory(prev => prev.slice(0, -1));
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setCustomCurriculum(previous);
    saveCurriculumForGrade(currentGrade, previous);
    setUploadSuccessToast('✓ Đã hoàn tác thao tác trước đó trên PPCT!');
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Tự động cân bằng tất cả các tuần theo chuẩn định mức 4 tiết/tuần
  const handleAutoBalanceWeeks = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setCurriculumHistory(prev => [...prev.slice(-10), [...customCurriculum]]);

    const standard = getCurriculumForGrade(currentGrade);
    const balanced = repairAndBalanceWeeklyCurriculum(customCurriculum, standard);
    setCustomCurriculum(balanced);
    saveCurriculumForGrade(currentGrade, balanced);
    setUploadSuccessToast('✓ Đã tự động cân bằng toàn bộ 35 tuần đúng chuẩn định mức 4 tiết/tuần (140 tiết)!');
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  // Khôi phục PPCT mẫu chuẩn ban đầu
  const handleRestoreStandardCurriculum = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    resetCurriculumForGrade(currentGrade);
    const standard = getCurriculumForGrade(currentGrade);
    setCustomCurriculum(standard);
    setUploadSuccessToast(`✓ Đã khôi phục Phân phối chương trình ${currentGrade} mẫu chuẩn ban đầu (140 tiết)!`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  // Ghi đè hệ thống
  const handleConfirmOverwritePPCT = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    saveCurriculumForGrade(currentGrade, customCurriculum);
    setUploadSuccessToast(`✓ Đã ghi đè và kích hoạt Phân phối chương trình ${currentGrade} mới nhất trong toàn bộ hệ thống!`);
    setTimeout(() => setUploadSuccessToast(null), 5000);
  };

  // Xuất file Word DOCX cập nhật chuẩn BGDĐT: PPCT_LỚP_9_CHUAN_BGDDT_140TIET_CAP_NHAT_dd_mm_yy_tt.docx
  const handleConfirmExportWordPPCT = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const exportFileName = generateUpdatedPPCTFileName(currentGrade);
    exportPPCTToWordDoc(customCurriculum, {
      grade: currentGrade,
      teacherName: state.khbd.teacherName || 'Châu Ngọc Bảo Trân',
      subject: state.khbd.subject || 'Toán học',
      schoolYear: state.khbd.schoolYear || '2026 - 2027',
      fileName: exportFileName
    });
    incrementUpdatedPPCTVersion(currentGrade);
    setUploadSuccessToast(`✓ Đã tải về thành công file Word (.docx): ${exportFileName}! Có thể mở chỉnh sửa trên Word.`);
    setTimeout(() => setUploadSuccessToast(null), 5000);
  };

  // Ghi đè đồng thời xuất file DOCX
  const handleConfirmBothPPCT = () => {
    handleConfirmOverwritePPCT();
    handleConfirmExportWordPPCT();
  };

  // Group curriculum entries (khi ppctList trống, toàn bộ bài nạp được xóa sạch để đảm bảo đồng bộ)
  const curriculumLessons = useMemo(() => {
    if (ppctList.length === 0) return [];

    return customCurriculum.filter(e => {
      const matchSearch = 
        e.lessonName.toLowerCase().includes(ppctSearch.toLowerCase()) ||
        e.chapter.toLowerCase().includes(ppctSearch.toLowerCase()) ||
        e.periodNumber.toString() === ppctSearch.trim() ||
        e.branch.toLowerCase().includes(ppctSearch.toLowerCase());
      const matchSem = selectedSemester === 'all' || e.semester.toString() === selectedSemester;
      const matchWeek = selectedWeekFilter === 'all' || e.week.toString() === selectedWeekFilter;
      return matchSearch && matchSem && matchWeek;
    });
  }, [customCurriculum, ppctList.length, ppctSearch, selectedSemester, selectedWeekFilter]);

  // Nhóm toàn bộ các tiết theo từng TUẦN (Tuần 1 -> Tuần 35, ưu tiên hiển thị theo tuần, có sổ xuống xem)
  const lessonsByWeek = useMemo(() => {
    if (ppctList.length === 0) return [];

    const map = new Map<number, CurriculumEntry[]>();
    curriculumLessons.forEach(entry => {
      if (!map.has(entry.week)) {
        map.set(entry.week, []);
      }
      map.get(entry.week)!.push(entry);
    });

    return Array.from(map.entries())
      .sort(([w1], [w2]) => w1 - w2)
      .map(([week, entries]) => {
        const soEntries = entries.filter(e => !isHinhEntry(e));
        const hinhEntries = entries.filter(e => isHinhEntry(e));

        // Kiểm tra xem tuần này có đợt kiểm tra định kỳ (giữa kì 1, cuối kì 1, giữa kì 2, cuối năm) không
        const examEntries = entries.filter(e => isPeriodicExamEntry(e).isExam);
        const hasPeriodicExam = examEntries.length > 0;
        const examSoEntry = soEntries.find(e => isPeriodicExamEntry(e).isExam);
        const examHinhEntry = hinhEntries.find(e => isPeriodicExamEntry(e).isExam);
        const primaryExamEntry = examSoEntry || examHinhEntry || examEntries[0] || null;
        const examInfo = primaryExamEntry ? isPeriodicExamEntry(primaryExamEntry) : null;

        // Nếu tuần có bài kiểm tra định kỳ: tự động định vị ngang hàng 2 tiết song song
        // (Xếp bài học / ôn tập lên trước, bài kiểm tra xuống cùng hàng đối xứng)
        const sortedSoEntries = hasPeriodicExam
          ? [...soEntries].sort((a, b) => {
              const aExam = isPeriodicExamEntry(a).isExam ? 1 : 0;
              const bExam = isPeriodicExamEntry(b).isExam ? 1 : 0;
              return aExam - bExam;
            })
          : soEntries;

        const sortedHinhEntries = hasPeriodicExam
          ? [...hinhEntries].sort((a, b) => {
              const aExam = isPeriodicExamEntry(a).isExam ? 1 : 0;
              const bExam = isPeriodicExamEntry(b).isExam ? 1 : 0;
              return aExam - bExam;
            })
          : hinhEntries;

        const soPeriods = sortedSoEntries.map(e => e.periodNumber);
        const hinhPeriods = sortedHinhEntries.map(e => e.periodNumber);

        const regularSoEntries = sortedSoEntries.filter(e => !isPeriodicExamEntry(e).isExam);
        const regularHinhEntries = sortedHinhEntries.filter(e => !isPeriodicExamEntry(e).isExam);
        const regularSoPeriods = regularSoEntries.map(e => e.periodNumber);
        const regularHinhPeriods = regularHinhEntries.map(e => e.periodNumber);

        // Hiển thị khoảng tiết: Trong tuần kiểm tra định kỳ (ví dụ Tuần 9), hiển thị "Tiết 17 + kiểm tra" theo đúng chữ xanh người dùng yêu cầu
        let soRange = '0 tiết';
        if (hasPeriodicExam) {
          if (regularSoPeriods.length === 1) {
            soRange = `Tiết ${regularSoPeriods[0]} + kiểm tra`;
          } else if (regularSoPeriods.length > 1) {
            soRange = `Tiết ${Math.min(...regularSoPeriods)} - ${Math.max(...regularSoPeriods)} + kiểm tra`;
          } else {
            soRange = 'Tiết kiểm tra';
          }
        } else if (soPeriods.length > 0) {
          soRange = Math.min(...soPeriods) === Math.max(...soPeriods)
            ? `Tiết ${Math.min(...soPeriods)}`
            : `Tiết ${Math.min(...soPeriods)} - ${Math.max(...soPeriods)}`;
        }

        let hinhRange = '0 tiết';
        if (hasPeriodicExam) {
          if (regularHinhPeriods.length === 1) {
            hinhRange = `Tiết ${regularHinhPeriods[0]} + kiểm tra`;
          } else if (regularHinhPeriods.length > 1) {
            hinhRange = `Tiết ${Math.min(...regularHinhPeriods)} - ${Math.max(...regularHinhPeriods)} + kiểm tra`;
          } else {
            hinhRange = 'Tiết kiểm tra';
          }
        } else if (hinhPeriods.length > 0) {
          hinhRange = Math.min(...hinhPeriods) === Math.max(...hinhPeriods)
            ? `Tiết ${Math.min(...hinhPeriods)}`
            : `Tiết ${Math.min(...hinhPeriods)} - ${Math.max(...hinhPeriods)}`;
        }

        let periodRange = '';
        if (hasPeriodicExam) {
          const soPart = regularSoPeriods.length === 1
            ? `Số: Tiết ${regularSoPeriods[0]} + Kiểm tra`
            : regularSoPeriods.length > 1
              ? `Số: Tiết ${Math.min(...regularSoPeriods)} - ${Math.max(...regularSoPeriods)} + Kiểm tra`
              : `Số: Tiết Kiểm tra`;
          const hinhPart = regularHinhPeriods.length === 1
            ? `Hình: Tiết ${regularHinhPeriods[0]} + Kiểm tra`
            : regularHinhPeriods.length > 1
              ? `Hình: Tiết ${Math.min(...regularHinhPeriods)} - ${Math.max(...regularHinhPeriods)} + Kiểm tra`
              : `Hình: Tiết Kiểm tra`;
          periodRange = `${soPart} • ${hinhPart}`;
        } else {
          const branchRangeParts: string[] = [];
          if (soPeriods.length > 0) {
            const minS = Math.min(...soPeriods);
            const maxS = Math.max(...soPeriods);
            const soLabel = entries.some(e => !isHinhEntry(e) && e.branch === 'Thống kê & Xác suất') ? 'Số & Thống kê' : 'Số';
            branchRangeParts.push(minS === maxS ? `${soLabel}: Tiết ${minS}` : `${soLabel}: Tiết ${minS} - ${maxS}`);
          }
          if (hinhPeriods.length > 0) {
            const minH = Math.min(...hinhPeriods);
            const maxH = Math.max(...hinhPeriods);
            branchRangeParts.push(minH === maxH ? `Hình: Tiết ${minH}` : `Hình: Tiết ${minH} - ${maxH}`);
          }
          periodRange = branchRangeParts.join(' • ');
        }

        return {
          week,
          semester: entries[0]?.semester || (week <= 18 ? 1 : 2),
          entries,
          soEntries: sortedSoEntries,
          hinhEntries: sortedHinhEntries,
          soCount: sortedSoEntries.length,
          hinhCount: sortedHinhEntries.length,
          soRange,
          hinhRange,
          totalPeriods: entries.length,
          periodRange,
          summaryBranches: Array.from(new Set(entries.map(e => e.branch))).join(', '),
          hasPeriodicExam,
          examName: examInfo?.name || null,
          examTitle: examInfo?.title || null,
          examSoEntry,
          examHinhEntry,
          primaryExamEntry
        };
      });
  }, [curriculumLessons, ppctList.length]);

  // CHUYỂN ĐỔI KHỐI LỚP KHOA HỌC: BẢO TOÀN DỮ LIỆU RIÊNG TỪNG KHỐI
  const handleSwitchGrade = (targetGrade: GradeLevel) => {
    if (targetGrade === state.khbd.grade) return;

    // 1. Lưu workspace hiện tại của khối đang mở vào storage
    updateGradeWorkspace(state.khbd.grade as GradeLevel, {
      uploadedFiles: uploadedFiles,
      ppctList: ppctList,
      khbdState: state.khbd,
      currentVersion: currentVersionTag,
      versionHistory: versionHistory,
      activeClass: state.khbd.className
    });

    // 2. Tải workspace của khối mục tiêu
    const targetWs = getGradeWorkspace(targetGrade);
    setActiveGrade(targetGrade);

    // 3. Cập nhật state nội bộ
    setPpctList(targetWs.ppctList);
    setUploadedFiles(targetWs.uploadedFiles);
    setCurrentVersionTag(targetWs.currentVersion || 'v1.0');
    setVersionHistory(targetWs.versionHistory || []);
    if (targetWs.uploadedFiles.length > 0) {
      setSelectedRefFile(targetWs.uploadedFiles[0].name);
    }

    // 4. Cập nhật state hệ thống (KHBD, PPCT và Lớp dạy)
    const targetCurriculum = getCurriculumForGrade(targetGrade);
    const saved = getSavedTeacherProfile();
    const assigned = state.khbd.assignedClasses || saved.assignedClasses || saved.className || '8/5, 9/1, 9/2';
    const targetClass = extractClassesForGrade(assigned, targetGrade);
    targetWs.activeClass = targetClass;

    if (targetWs.khbdState && targetWs.khbdState.lessonName) {
      setState(prev => ({
        ...prev,
        khbd: {
          ...targetWs.khbdState!,
          grade: targetGrade,
          className: targetClass,
          assignedClasses: assigned
        },
        exam: {
          ...prev.exam,
          grade: targetGrade,
          examTitle: `Đề kiểm tra môn ${prev.khbd.subject || 'Toán học'} - ${targetGrade}`
        }
      }));
    } else {
      const newState = buildStateFromCurriculumEntry(targetCurriculum[0], targetClass);
      setState(prev => ({
        ...newState,
        khbd: {
          ...newState.khbd,
          grade: targetGrade,
          className: targetClass,
          assignedClasses: assigned,
          teacherName: prev.khbd.teacherName || saved.teacherName,
          schoolYear: prev.khbd.schoolYear || saved.schoolYear
        },
        exam: {
          ...newState.exam,
          grade: targetGrade
        }
      }));
    }

    setUploadSuccessToast(`✓ Đã chuyển sang không gian làm việc ${targetGrade} (${targetClass})! Toàn bộ PPCT & tài liệu bám theo được bảo toàn.`);
    setTimeout(() => setUploadSuccessToast(null), 3500);
  };

  // CÁC HÀNH ĐỘNG KHI TỰ NHẬN DIỆN KHỐI (SMART GRADE MODAL CHOICES)
  const handleConfirmSwitchAndSave = async () => {
    if (!pendingUpload) return;
    const { file, dataUrl, detectedGrade, targetType } = pendingUpload;
    setShowSmartGradeModal(false);
    setPendingUpload(null);

    // 1. Tự động thêm khối vào danh sách nếu khối này chưa có
    autoAddGradeFromKHBD(detectedGrade);

    // 2. Xử lý bảo toàn 100% tệp gốc (chuyển đổi HTML đọc trực tuyến nhưng giữ nguyên tên và định dạng file gốc)
    const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
    const finalName = file.name; // BẢO TOÀN 100% TÊN GỐC, KHÔNG ĐỔI SANG .PDF
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
        console.warn('Word to PDF conversion notice:', err);
      }
    }

    const cleanKey = file.name.toLowerCase().replace(/\.(docx?|doc|pdf|xlsx)$/i, '').trim();

    // 3. Quy định hệ thống: Chỉ cho phép nạp 1 KHBD cho 1 khối -> Kiểm tra trùng lặp toàn diện
    const existingFiles = getExistingFilesForGrade(detectedGrade);
    const newFileItem: OriginalFileItem = {
      name: finalName,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: isWord ? 'DOCX' : finalType.toUpperCase(),
      note: targetType === 'reference' 
        ? `Tài liệu bài dạy do giáo viên tải lên${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`
        : `Tài liệu PPCT do giáo viên tải lên (${file.name})${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`,
      uploadedAt: 'Vừa xong',
      dataUrl,
      htmlContent,
      rawText,
      isConvertedFromWord: isConverted,
      originalFileName: file.name
    };

    if (existingFiles.length > 0) {
      setConflictData({
        newFile: newFileItem,
        targetGrade: detectedGrade,
        existingFiles,
        targetType
      });
      setShowConflictModal(true);
      return;
    }

    if (targetType === 'reference') {
      updateGradeWorkspace(detectedGrade, { uploadedFiles: [newFileItem] });
    } else {
      const newPpct: StoredPPCT = {
        id: `ppct-${Date.now()}`,
        name: finalName,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: 'Vừa xong',
        type: finalType,
        description: `Tài liệu PPCT do giáo viên tải lên (${file.name})${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`,
        totalPeriods: 140,
        dataUrl,
        htmlContent,
        rawText,
        isConvertedFromWord: isConverted,
        originalFileName: file.name
      };
      saveStoredPPCTList([newPpct], detectedGrade);
      addPpctToGradeWorkspace(detectedGrade, newPpct);
    }

    // 4. Chuyển sang khối nhận diện (tải sạch sẽ dữ liệu của khối đó)
    handleSwitchGrade(detectedGrade);

    setUploadSuccessToast(`✓ Đã lưu trữ tệp ${finalName} vào khối ${detectedGrade}!`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  const handleConfirmSaveToDetectedGradeOnly = async () => {
    if (!pendingUpload) return;
    const { file, dataUrl, detectedGrade, targetType } = pendingUpload;
    setShowSmartGradeModal(false);
    setPendingUpload(null);

    // Tự động thêm khối vào danh sách phân công
    autoAddGradeFromKHBD(detectedGrade);

    // Xử lý bảo toàn 100% tệp gốc
    const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
    const finalName = file.name; // BẢO TOÀN 100% TÊN GỐC
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
        console.warn('Word to PDF notice:', err);
      }
    }

    const cleanKey = file.name.toLowerCase().replace(/\.(docx?|doc|pdf|xlsx)$/i, '').trim();

    // Quy định hệ thống: Chỉ cho phép nạp 1 KHBD cho 1 khối -> Kiểm tra trùng lặp toàn diện
    const existingFiles = getExistingFilesForGrade(detectedGrade);
    const newFileItem: OriginalFileItem = {
      name: finalName,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: isWord ? 'DOCX' : finalType.toUpperCase(),
      note: targetType === 'reference'
        ? `Tài liệu bài dạy do giáo viên tải lên${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`
        : `Tài liệu PPCT do giáo viên tải lên (${file.name})${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`,
      uploadedAt: 'Vừa xong',
      dataUrl,
      htmlContent,
      rawText,
      isConvertedFromWord: isConverted,
      originalFileName: file.name
    };

    if (existingFiles.length > 0) {
      setConflictData({
        newFile: newFileItem,
        targetGrade: detectedGrade,
        existingFiles,
        targetType
      });
      setShowConflictModal(true);
      return;
    }

    if (targetType === 'reference') {
      updateGradeWorkspace(detectedGrade, { uploadedFiles: [newFileItem] });
    } else {
      const newPpct: StoredPPCT = {
        id: `ppct-${Date.now()}`,
        name: finalName,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: 'Vừa xong',
        type: finalType,
        description: `PPCT do giáo viên tải lên (${file.name})${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`,
        totalPeriods: 140,
        dataUrl,
        htmlContent,
        rawText,
        isConvertedFromWord: isConverted,
        originalFileName: file.name
      };
      saveStoredPPCTList([newPpct], detectedGrade);
      addPpctToGradeWorkspace(detectedGrade, newPpct);
    }

    setUploadSuccessToast(`✓ Đã lưu tệp ${finalName}${isConverted ? ' (Đã chuyển sang PDF)' : ''} vào kho của ${detectedGrade}!`);
    setTimeout(() => setUploadSuccessToast(null), 4500);
  };

  const handleConfirmKeepInCurrentGrade = () => {
    if (!pendingUpload) return;
    const { file, dataUrl, targetType } = pendingUpload;
    setShowSmartGradeModal(false);
    setPendingUpload(null);

    if (targetType === 'reference') {
      const newFile: OriginalFileItem = {
        name: file.name,
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
        type: file.name.endsWith('.pdf') ? 'PDF' : file.name.endsWith('.docx') ? 'DOCX' : 'FILE',
        note: `Tài liệu liên khối lưu tại ${state.khbd.grade}`,
        uploadedAt: 'Vừa xong',
        dataUrl
      };
      setUploadedFiles(prev => [newFile, ...prev]);
      setSelectedRefFile(file.name);
    } else {
      const newPpct: StoredPPCT = {
        id: `ppct-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: 'Vừa xong',
        type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.xlsx') ? 'xlsx' : 'docx',
        description: `Tài liệu PPCT lưu tại ${state.khbd.grade}`,
        totalPeriods: 140,
        dataUrl
      };
      const updated = [newPpct, ...ppctList];
      setPpctList(updated);
      saveStoredPPCTList(updated);
    }

    setUploadSuccessToast(`Đã lưu tệp vào không gian ${state.khbd.grade}!`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Xử lý xác nhận ghi đè 2 cấp độ khi nạp trùng KHBD cho khối
  const handleConfirmConflictOverwrite = () => {
    if (!conflictData) return;
    const { newFile, targetGrade, targetType } = conflictData;

    // 1. Quy định: Chỉ cho phép nạp 1 KHBD cho 1 khối -> XÓA SẠCH TOÀN BỘ FILE CŨ
    clearGradeWorkspaceFiles(targetGrade);

    // 2. Lưu duy nhất file mới
    if (targetType === 'ppct') {
      const isWord = newFile.name.toLowerCase().endsWith('.docx') || newFile.name.toLowerCase().endsWith('.doc');
      const newPpct: StoredPPCT = {
        id: `ppct-${Date.now()}`,
        name: newFile.name,
        size: newFile.size,
        uploadedAt: 'Vừa xong',
        type: isWord ? 'docx' : newFile.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'xlsx',
        description: `Tài liệu PPCT / Kế hoạch dạy học do giáo viên tải lên (${newFile.name})`,
        totalPeriods: 140,
        dataUrl: newFile.dataUrl,
        htmlContent: newFile.htmlContent,
        rawText: newFile.rawText,
        isConvertedFromWord: newFile.isConvertedFromWord,
        originalFileName: newFile.originalFileName || newFile.name
      };
      saveStoredPPCTList([newPpct], targetGrade);
      addPpctToGradeWorkspace(targetGrade, newPpct);

      if (state.khbd.grade === targetGrade) {
        setPpctList([newPpct]);
      }
    } else {
      updateGradeWorkspace(targetGrade, { uploadedFiles: [newFile] });
      if (state.khbd.grade === targetGrade) {
        setUploadedFiles([newFile]);
        setSelectedRefFile(newFile.name);
      }
    }

    // 3. Tự động chuyển giao diện sang khối đó nếu chưa ở khối đó
    if (state.khbd.grade !== targetGrade) {
      handleSwitchGrade(targetGrade);
    }

    setShowConflictModal(false);
    setConflictData(null);

    setUploadSuccessToast(`✓ Đã ghi đè thành công KHBD cho ${targetGrade}! Toàn bộ file cũ đã được xóa sạch và thay thế bằng file mới: ${newFile.name}`);
    setTimeout(() => setUploadSuccessToast(null), 4500);
  };

  // Handle file upload for reference documents (tự động chuyển đổi Word sang PDF & lưu nguyên bản 100% nội dung)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (loadEvt) => {
        const dataUrl = loadEvt.target?.result as string;

        // TỰ ĐỘNG CHUYỂN ĐỔI WORD (.doc, .docx) SANG BẢN ĐỌC TRỰC TUYẾN (BẢO TOÀN 100% TỆP GỐC KHI TẢI VỀ)
        const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
        const finalName = file.name; // BẢO TOÀN 100% TÊN GỐC, KHÔNG ĐỔI TÊN THÀNH .PDF
        const finalType = isWord ? 'DOCX' : (file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : file.name.toLowerCase().endsWith('.pptx') ? 'PPTX' : 'FILE');
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
            console.warn('Word to PDF notice:', err);
          }
        }

        const exactSize = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(1)} KB`;

        const newFile: OriginalFileItem = {
          name: finalName,
          size: exactSize,
          type: finalType,
          note: `Tài liệu bài dạy do giáo viên tải lên${isConverted ? ' • Sẵn sàng đọc trực tuyến' : ''}`,
          uploadedAt: 'Vừa xong',
          dataUrl,
          htmlContent,
          rawText,
          isConvertedFromWord: isConverted,
          originalFileName: file.name
        };

        // QUY ĐỊNH HỆ THỐNG: CHỈ CHO PHÉP NẠP 1 KHBD CHO 1 KHỐI
        // 1. TỰ ĐỘNG NHẬN DIỆN KHỐI LỚP:
        const detected = detectGradeFromFileName(file.name);
        const targetGrade = detected || (state.khbd.grade as GradeLevel);
        const existingFiles = getExistingFilesForGrade(targetGrade);

        // 2. Báo lỗi trùng KHBD ngay lập tức khi khối đó đã có file (bất kể tên file cũ và tên mới khác nhau hay giống nhau)
        if (existingFiles.length > 0) {
          setConflictData({
            newFile,
            targetGrade,
            existingFiles,
            targetType: 'reference'
          });
          setShowConflictModal(true);
          return;
        }

        // 3. Nếu chưa có file nào và phát hiện khác khối hiện tại: Hỏi chuyển khối
        if (detected && detected !== state.khbd.grade) {
          setPendingUpload({
            file,
            dataUrl,
            detectedGrade: detected,
            targetType: 'reference'
          });
          setShowSmartGradeModal(true);
          return;
        }

        // 4. Nếu khối chưa có file KHBD nào: Lưu duy nhất 1 KHBD cho khối này
        setUploadedFiles([newFile]);
        setSelectedRefFile(finalName);
        updateGradeWorkspace(targetGrade, { uploadedFiles: [newFile] });
        setUploadSuccessToast(`Đã tải lên KHBD cho ${targetGrade}: ${finalName}${isConverted ? ' (Bảo toàn 100% nội dung & sẵn sàng đọc trực tuyến)' : ''}`);
        setTimeout(() => setUploadSuccessToast(null), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xem file gốc chính xác 100%, không chỉnh sửa
  const handleViewOriginalFile = (fileItem: OriginalFileItem) => {
    setSelectedFileToView(fileItem);
    setIsOriginalViewerOpen(true);
  };

  // Xem file gốc PPCT
  // Xem file gốc PPCT (chạy nhanh và mở đúng file gốc nguyên bản của giáo viên)
  const handleViewOriginalPPCT = (ppctItem: StoredPPCT) => {
    const isPdf = ppctItem.type === 'pdf' || 
                  ppctItem.name.toLowerCase().endsWith('.pdf') || 
                  Boolean(ppctItem.dataUrl && ppctItem.dataUrl.includes('application/pdf'));

    const isWord = ppctItem.type === 'docx' || 
                   ppctItem.name.toLowerCase().endsWith('.docx') || 
                   ppctItem.name.toLowerCase().endsWith('.doc') ||
                   Boolean(ppctItem.dataUrl && (ppctItem.dataUrl.includes('wordprocessingml') || ppctItem.dataUrl.includes('msword')));

    // 1. NẾU LÀ FILE PDF GỐC (như AI_KHDH TOÁN 9 HK2 (26-27 KNTT).pdf trong Image 2):
    // Giữ nguyên 100% định dạng PDF gốc, KHÔNG ghi đè htmlContent, KHÔNG ép isConvertedFromWord!
    if (isPdf) {
      setSelectedFileToView({
        id: ppctItem.id,
        name: ppctItem.name,
        size: ppctItem.size,
        type: 'PDF',
        uploadedAt: ppctItem.uploadedAt,
        dataUrl: ppctItem.dataUrl,
        note: ppctItem.description,
        description: ppctItem.description,
        rawText: ppctItem.rawText,
        htmlContent: undefined, // Để PDFCanvasViewer kết xuất đúng file PDF gốc của người dùng
        isConvertedFromWord: false,
        originalFileName: ppctItem.originalFileName || ppctItem.name
      });
      setIsOriginalViewerOpen(true);
      return;
    }

    // 2. NẾU LÀ FILE WORD GỐC DO GIÁO VIÊN TẢI LÊN CÓ DATAURL:
    if (isWord && ppctItem.dataUrl && !ppctItem.isDefault) {
      setSelectedFileToView({
        id: ppctItem.id,
        name: ppctItem.name,
        size: ppctItem.size,
        type: 'DOCX',
        uploadedAt: ppctItem.uploadedAt,
        dataUrl: ppctItem.dataUrl,
        note: ppctItem.description,
        description: ppctItem.description,
        rawText: ppctItem.rawText,
        htmlContent: ppctItem.htmlContent,
        isConvertedFromWord: true,
        originalFileName: ppctItem.originalFileName || ppctItem.name
      });
      setIsOriginalViewerOpen(true);
      return;
    }

    // 3. FILE GỐC MẪU CHUẨN CỦA HỆ THỐNG:
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const baseCurriculum = getCurriculumForGrade(currentGrade);
    const curriculumDataToUse = (ppctItem.curriculumData && ppctItem.curriculumData.length > 0)
      ? ppctItem.curriculumData
      : (baseCurriculum && baseCurriculum.length > 0 ? baseCurriculum : customCurriculum);

    const previewHtml = generatePPCTPreviewHtml(curriculumDataToUse, {
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
      originalFileName: ppctItem.originalFileName || ppctItem.name
    });
    setIsOriginalViewerOpen(true);
  };

  // Xóa tài liệu mẫu trong mục 3
  const handleDeleteReferenceFile = (index: number) => {
    const target = uploadedFiles[index];
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    if (selectedRefFile === target?.name && updated.length > 0) {
      setSelectedRefFile(updated[0].name);
    }
    setUploadSuccessToast(`Đã xóa tài liệu: ${target?.name}`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Chạy file KHBD theo form & Prompt (tạo version mới)
  const handleRunKHBDWithPrompt = () => {
    if (!checkApiKeyForKHBDGeneration()) return;
    if (isRunningPrompt || uploadedFiles.length === 0) return;
    setIsRunningPrompt(true);
    setRunProgress(15);
    setRunStepText('Đang phân tích cấu trúc form mẫu và phong cách bài tập...');
    setPromptExecutionSuccess(null);

    setTimeout(() => {
      setRunProgress(45);
      setRunStepText(`Đang áp dụng Prompt chỉ dẫn vào bài "${state.khbd.lessonName || 'Toán 9'}"...`);
    }, 450);

    setTimeout(() => {
      setRunProgress(80);
      setRunStepText('Đang tối ưu 4 hoạt động CV 5512, tích hợp năng lực số và phiếu học tập...');
    }, 950);

    setTimeout(() => {
      setRunProgress(100);
      setRunStepText('Hoàn tất! Đang tạo bản ghi phiên bản mới...');

      const versionToUse = nextVersionTag.trim() || `v${(parseFloat(currentVersionTag.replace('v', '')) + 0.1).toFixed(1)}`;
      const { updatedKHBD, summary } = generateUpdatedKHBDFromPrompt(
        state.khbd,
        customPrompt,
        selectedRefFile || uploadedFiles[0]?.name || 'Tài liệu mẫu',
        versionToUse
      );

      const newRecord: KHBDVersionRecord = {
        versionId: versionToUse,
        versionName: `Phiên bản ${versionToUse} - Form bám theo ${selectedRefFile || 'Tài liệu mẫu'}`,
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        promptUsed: customPrompt,
        referenceFile: selectedRefFile || uploadedFiles[0]?.name || 'Tài liệu mẫu',
        summary,
        khbdSnapshot: JSON.parse(JSON.stringify(updatedKHBD))
      };

      const newHistory = [newRecord, ...versionHistory];
      setVersionHistory(newHistory);
      saveStoredVersionHistory(newHistory);

      setState(prev => ({
        ...prev,
        version: versionToUse,
        lastUpdated: new Date().toISOString(),
        khbd: updatedKHBD
      }));

      setCurrentVersionTag(versionToUse);
      const num = parseFloat(versionToUse.replace('v', ''));
      if (!isNaN(num)) {
        setNextVersionTag(`v${(num + 0.1).toFixed(1)}`);
      } else {
        setNextVersionTag(`${versionToUse}.1`);
      }

      setIsRunningPrompt(false);
      setPromptExecutionSuccess(`Đã chạy thành công KHBD theo form mẫu! Đã tạo phiên bản ${versionToUse}!`);
      setTimeout(() => setPromptExecutionSuccess(null), 6000);
    }, 1500);
  };

  // Xuất Form Mới kèm Version (.DOCX)
  const handleExportNewVersionWord = () => {
    exportVersionedKHBDToWord(state.khbd, {
      versionId: currentVersionTag,
      promptUsed: customPrompt,
      referenceFile: selectedRefFile || uploadedFiles[0]?.name || 'Tài liệu mẫu',
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
    setUploadSuccessToast(`Đã xuất file Word KHBD phiên bản ${currentVersionTag} thành công!`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Khôi phục về version cũ trong lịch sử
  const handleRollbackVersion = (rec: KHBDVersionRecord) => {
    setState(prev => ({
      ...prev,
      version: rec.versionId,
      khbd: JSON.parse(JSON.stringify(rec.khbdSnapshot)),
      lastUpdated: new Date().toISOString()
    }));
    setCurrentVersionTag(rec.versionId);
    setUploadSuccessToast(`Đã chuyển về Kế hoạch bài dạy phiên bản ${rec.versionId}`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // =========================================================================
  // MỤC 2: QUẢN LÝ 1 FILE PROMPT GỐC DUY NHẤT (HỖ TRỢ .PDF, .DOCX, .MD, .TXT)
  // Giống như PPCT: cho phép xem file gốc, xóa, tải về & nạp đúng 1 prompt
  // =========================================================================
  const handleUploadMasterPromptFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Yêu cầu: Không cho phép tải lên thêm prompt tạo KHBD khi hệ thống đã có prompt sẵn.
    if (masterPromptFile) {
      setUploadSuccessToast('⚠️ Hệ thống đã có sẵn 1 File Prompt gốc đang kích hoạt. Không cho phép nạp thêm (vui lòng bấm nút "Xóa" file hiện tại trước nếu muốn thay thế).');
      setTimeout(() => setUploadSuccessToast(null), 4000);
      return;
    }

    const file = files[0];
    const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isMd = file.name.toLowerCase().endsWith('.md');
    const isText = file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.prompt') || file.name.toLowerCase().endsWith('.json') || file.name.toLowerCase().endsWith('.yaml') || file.name.toLowerCase().endsWith('.yml') || file.type.startsWith('text/');
    const fileType = isWord ? 'DOCX' : isPdf ? 'PDF' : isMd ? 'MD' : 'TXT';

    let htmlContent: string | undefined = undefined;
    let rawText: string | undefined = undefined;
    let isConverted = false;

    // 1. Đọc văn bản chính xác 100% từ file gốc
    if (isMd || isText || (!isWord && !isPdf)) {
      try {
        rawText = await file.text();
        if (rawText) {
          htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; white-space: pre-wrap; font-size: 13px;">${rawText}</div>`;
        }
      } catch (err) {
        console.warn('Lỗi đọc text file prompt:', err);
      }
    } else if (isWord) {
      try {
        const res = await convertDocxToPdfView(file);
        htmlContent = res.htmlContent;
        rawText = res.rawText;
        isConverted = true;
      } catch (err) {
        console.warn('Word conversion err:', err);
      }
    }

    // 2. Tạo DataURL cho preview và download nguyên bản
    const dataUrl = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = (e) => resolve((e.target?.result as string) || '');
      r.onerror = () => resolve('');
      r.readAsDataURL(file);
    });

    // Nếu chưa có rawText nhưng có dataUrl: thử giải mã UTF-8
    if (!rawText && (isMd || isText) && dataUrl) {
      rawText = extractTextFromDataUrl(dataUrl);
    }

    const exactSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(1)} KB`;

    const finalRawText = (rawText && rawText.trim()) ? rawText.trim() : '';

    const newPromptItem: OriginalFileItem = {
      name: file.name,
      size: exactSize,
      type: fileType,
      note: `File Prompt gốc do giáo viên nạp (${file.name})`,
      uploadedAt: 'Vừa xong',
      dataUrl,
      htmlContent,
      rawText: finalRawText,
      isConvertedFromWord: isConverted,
      originalFileName: file.name
    };

    // QUY ĐỊNH HỆ THỐNG: CHỈ NẠP 1 PROMPT GỐC DUY NHẤT
    setMasterPromptFile(newPromptItem);
    try {
      localStorage.setItem('master_prompt_file_item', JSON.stringify(newPromptItem));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    if (finalRawText) {
      setCustomPrompt(finalRawText);
    } else {
      setCustomPrompt(`[HỆ THỐNG BIÊN SOẠN KHBD BÁM THEO FILE PROMPT GỐC: ${file.name}]\n\n${MASTER_PROMPT_STANDARD}`);
    }
    setPromptFileName(file.name);
    setUploadSuccessToast(`✓ Đã nạp thành công 1 File Prompt gốc: ${file.name}!`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  // Xóa File Prompt gốc
  const handleDeleteMasterPromptFile = () => {
    setMasterPromptFile(null);
    localStorage.removeItem('master_prompt_file_item');
    setCustomPrompt('');
    setPromptFileName(null);
    setUploadSuccessToast('Đã xóa File Prompt gốc. Bạn có thể tải file prompt mới hoặc nạp lại mẫu chuẩn.');
    setTimeout(() => setUploadSuccessToast(null), 3500);
  };

  // Khôi phục Prompt Master mẫu chuẩn Bộ GD&ĐT
  const handleRestoreDefaultMasterPrompt = () => {
    const defaultPromptItem: OriginalFileItem = {
      name: 'PROMPT-MASTER-SOAN-KHBD-CHUAN-BGDDT.docx',
      size: '18.4 KB',
      type: 'DOCX',
      uploadedAt: 'Mặc định Bộ GD&ĐT',
      note: 'File Prompt Master chuẩn CV 5512 & GDPT 2018 điều khiển việc tạo KHBD',
      rawText: MASTER_PROMPT_STANDARD,
      htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">PROMPT MASTER SOẠN KẾ HOẠCH BÀI DẠY (KHBD) CHUẨN BGDĐT & GDPT 2018</h2>
        <p><strong>Căn cứ pháp lý:</strong> Công văn 5512/BGDĐT-GDTrH và Chương trình GDPT 2018 môn Toán.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: monospace; font-size: 13px; white-space: pre-wrap;">${MASTER_PROMPT_STANDARD}</div>
      </div>`,
      isConvertedFromWord: true,
      originalFileName: 'PROMPT-MASTER-SOAN-KHBD-CHUAN-BGDDT.docx'
    };
    setMasterPromptFile(defaultPromptItem);
    try {
      localStorage.setItem('master_prompt_file_item', JSON.stringify(defaultPromptItem));
    } catch (err) {
      console.warn(err);
    }
    setCustomPrompt(MASTER_PROMPT_STANDARD);
    setPromptFileName(defaultPromptItem.name);
    setUploadSuccessToast('✓ Đã khôi phục File Prompt Master mẫu chuẩn!');
    setTimeout(() => setUploadSuccessToast(null), 3500);
  };

  // =========================================================================
  // 1. TÀI NGUYÊN ĐƯA VÀO BÀI (ẢNH, CÔNG THỨC, BÀI TẬP, TRANG SGK...)
  // Hỗ trợ mọi định dạng: Ảnh, Word, PDF, Excel, PPTX, Text...
  // =========================================================================
  const handleUploadLessonResources = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const newItems: OriginalFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      const isPptx = file.name.toLowerCase().endsWith('.pptx');
      const isExcel = file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.csv');
      const isImage = !!file.name.match(/\.(png|jpe?g|svg|webp|gif|bmp)$/i) || file.type.startsWith('image/');

      const exactSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;

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
          console.warn('Word conversion err:', err);
        }
      } else if (file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.json') || file.name.toLowerCase().endsWith('.csv') || file.name.toLowerCase().endsWith('.prompt') || file.type.startsWith('text/')) {
        try {
          rawText = await file.text();
          if (rawText) {
            htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; white-space: pre-wrap; font-size: 13px;">${rawText}</div>`;
          }
        } catch (err) {
          console.warn('Text file read error:', err);
        }
      }

      // Read as DataURL for preview
      const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = (e) => resolve((e.target?.result as string) || '');
        r.onerror = () => resolve('');
        r.readAsDataURL(file);
      });

      const itemType = isImage ? 'IMAGE' : isWord ? 'DOCX' : isPdf ? 'PDF' : isExcel ? 'XLSX' : isPptx ? 'PPTX' : 'FILE';
      const itemNote = isImage ? 'Hình ảnh / Đồ thị' : isWord ? 'Tài liệu bài tập' : isPdf ? 'Tài liệu SGK / PDF' : isExcel ? 'Bảng tính dữ liệu' : 'Tài nguyên dạy học';

      newItems.push({
        name: file.name,
        size: exactSize,
        type: itemType,
        note: itemNote,
        uploadedAt: 'Vừa xong',
        dataUrl,
        htmlContent,
        rawText,
        isConvertedFromWord: isConverted,
        originalFileName: file.name
      });
    }

    setLessonResources(prev => {
      const newNames = new Set(newItems.map(it => it.name));
      const filtered = prev.filter(f => !newNames.has(f.name));
      const updated = [...newItems, ...filtered];
      try {
        localStorage.setItem(`lesson_resources_${currentGrade}`, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      // Đồng bộ vào uploadedFiles
      const allFiles = [...(referenceKHBD ? [referenceKHBD] : []), ...updated];
      setUploadedFiles(allFiles);
      updateGradeWorkspace(currentGrade, { uploadedFiles: allFiles });
      return updated;
    });

    setUploadSuccessToast(`✓ Đã nạp ${newItems.length} tài nguyên đưa vào bài!`);
    setTimeout(() => setUploadSuccessToast(null), 3500);
  };

  const handleDeleteLessonResource = (index: number) => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setLessonResources(prev => {
      const updated = prev.filter((_, i) => i !== index);
      try {
        localStorage.setItem(`lesson_resources_${currentGrade}`, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      const allFiles = [...(referenceKHBD ? [referenceKHBD] : []), ...updated];
      setUploadedFiles(allFiles);
      updateGradeWorkspace(currentGrade, { uploadedFiles: allFiles });
      return updated;
    });
    setUploadSuccessToast('Đã xóa 1 tệp tài nguyên.');
    setTimeout(() => setUploadSuccessToast(null), 2500);
  };

  const handleClearAllLessonResources = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setLessonResources([]);
    try {
      localStorage.setItem(`lesson_resources_${currentGrade}`, JSON.stringify([]));
    } catch (err) {
      console.warn(err);
    }
    const allFiles = referenceKHBD ? [referenceKHBD] : [];
    setUploadedFiles(allFiles);
    updateGradeWorkspace(currentGrade, { uploadedFiles: allFiles });
    setUploadSuccessToast('Đã xóa tất cả tài nguyên đưa vào bài.');
    setTimeout(() => setUploadSuccessToast(null), 2500);
  };

  const handleLoadDefaultLessonResources = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setLessonResources(DEFAULT_SAMPLE_LESSON_RESOURCES);
    try {
      localStorage.setItem(`lesson_resources_${currentGrade}`, JSON.stringify(DEFAULT_SAMPLE_LESSON_RESOURCES));
    } catch (err) {
      console.warn(err);
    }
    const allFiles = [...(referenceKHBD ? [referenceKHBD] : []), ...DEFAULT_SAMPLE_LESSON_RESOURCES];
    setUploadedFiles(allFiles);
    updateGradeWorkspace(currentGrade, { uploadedFiles: allFiles });
    setUploadSuccessToast('✓ Đã nạp bộ tài nguyên mẫu chuẩn (ảnh đồ thị, đề bài tập, phiếu học tập)!');
    setTimeout(() => setUploadSuccessToast(null), 3500);
  };

  // =========================================================================
  // 2. KHBD THAM KHẢO (SOẠN THEO CÁC BÀI TẬP TRONG KHBD THAM KHẢO)
  // =========================================================================
  const handleUploadReferenceKHBD = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';

    const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const exactSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(1)} KB`;

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
        console.warn('Word conversion err:', err);
      }
    } else if (file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.prompt') || file.type.startsWith('text/')) {
      try {
        rawText = await file.text();
        if (rawText) {
          htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; white-space: pre-wrap; font-size: 13px;">${rawText}</div>`;
        }
      } catch (err) {
        console.warn('Text read error:', err);
      }
    }

    const dataUrl = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = (e) => resolve((e.target?.result as string) || '');
      r.onerror = () => resolve('');
      r.readAsDataURL(file);
    });

    const refType = isPdf ? 'PDF' : isWord ? 'DOCX' : file.name.toLowerCase().endsWith('.md') ? 'MD' : 'TXT';

    const newRefKHBD: OriginalFileItem = {
      name: file.name,
      size: exactSize,
      type: refType,
      note: 'KHBD tham khảo (soạn theo các bài tập trong file này)',
      uploadedAt: 'Vừa xong',
      dataUrl,
      htmlContent,
      rawText,
      isConvertedFromWord: isConverted,
      originalFileName: file.name,
      description: 'KHBD tham khảo - Hệ thống soạn theo các bài tập và hoạt động trong file này'
    };

    setReferenceKHBD(newRefKHBD);
    setSelectedRefFile(newRefKHBD.name);
    try {
      localStorage.setItem(`ref_khbd_item_${currentGrade}`, JSON.stringify(newRefKHBD));
    } catch (err) {
      console.warn(err);
    }

    // Đồng bộ vào uploadedFiles & GradeWorkspace
    const allFiles = [newRefKHBD, ...lessonResources];
    setUploadedFiles(allFiles);
    updateGradeWorkspace(currentGrade, { uploadedFiles: allFiles });

    setUploadSuccessToast(`✓ Đã nạp KHBD tham khảo: ${file.name} (Hệ thống sẽ soạn theo các bài tập trong file này)!`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  const handleDeleteReferenceKHBD = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setReferenceKHBD(null);
    setSelectedRefFile('');
    try {
      localStorage.removeItem(`ref_khbd_item_${currentGrade}`);
    } catch (err) {
      console.warn(err);
    }
    setUploadedFiles(lessonResources);
    updateGradeWorkspace(currentGrade, { uploadedFiles: lessonResources });
    setUploadSuccessToast('Đã xóa KHBD tham khảo.');
    setTimeout(() => setUploadSuccessToast(null), 2500);
  };

  const handleRestoreDefaultReferenceKHBD = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    setReferenceKHBD(DEFAULT_SAMPLE_REF_KHBD);
    setSelectedRefFile(DEFAULT_SAMPLE_REF_KHBD.name);
    try {
      localStorage.setItem(`ref_khbd_item_${currentGrade}`, JSON.stringify(DEFAULT_SAMPLE_REF_KHBD));
    } catch (err) {
      console.warn(err);
    }
    const allFiles = [DEFAULT_SAMPLE_REF_KHBD, ...lessonResources];
    setUploadedFiles(allFiles);
    updateGradeWorkspace(currentGrade, { uploadedFiles: allFiles });
    setUploadSuccessToast('✓ Đã khôi phục KHBD tham khảo mẫu chuẩn!');
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  // Tạo / Xuất bản dựa trên Prompt Master, Tài nguyên và KHBD tham khảo
  const handlePublishWithMasterPrompt = () => {
    if (!checkApiKeyForKHBDGeneration()) return;
    const refKhbdName = referenceKHBD?.name || 'KHBD_TOAN9_KNTT_TAP1_FULL_5_CHUONG_NEW_VIP_2026_2027_MUC_TIEU_CHUAN_PL1_PL3.pdf';
    const isVipRef = refKhbdName.includes('KHBD_TOAN9') || refKhbdName.includes('VIP') || refKhbdName.includes('PL1_PL3');

    // Tìm bài trong PPCT tương ứng để lấy trọn vẹn ruột kiến thức sư phạm
    const targetEntry = CURRICULUM_TOAN_9.find(c => 
      c.lessonName.toLowerCase().trim() === state.khbd.lessonName.toLowerCase().trim() ||
      c.lessonName.toLowerCase().includes(state.khbd.lessonName.toLowerCase().slice(0, 20))
    ) || (isVipRef ? CURRICULUM_TOAN_9.find(c => c.id === 't9-w2-p6') : undefined);

    if (targetEntry) {
      const enriched = buildStateFromCurriculumEntry(targetEntry, state.khbd.className);
      setState(prev => ({
        ...prev,
        khbd: {
          ...enriched.khbd,
          schoolName: prev.khbd.schoolName || enriched.khbd.schoolName,
          teacherName: prev.khbd.teacherName || enriched.khbd.teacherName,
          className: prev.khbd.className || enriched.khbd.className,
          grade: prev.khbd.grade || enriched.khbd.grade,
          notes: `Biên soạn theo Prompt gốc (${masterPromptFile?.name || promptFileName || 'Mẫu chuẩn BGDĐT'}) + ${lessonResources.length} tài nguyên đưa vào bài + KHBD tham khảo (${refKhbdName}) • Bám sát 100% ruột kiến thức chuẩn SGK KNTT & CV 5512 (Trang 7-9).`
        },
        slides: enriched.slides
      }));
    } else {
      setState(prev => ({
        ...prev,
        khbd: {
          ...prev.khbd,
          notes: `Biên soạn theo Prompt gốc (${masterPromptFile?.name || promptFileName || 'Mẫu chuẩn BGDĐT'}) + ${lessonResources.length} tài nguyên đưa vào bài + KHBD tham khảo (${refKhbdName}) • Chuẩn hóa 100% ruột kiến thức CV 5512.`
        }
      }));
    }
    onOpenPublishModal();
  };

  // Synchronize PPCT list when changed from other components (e.g., Sidebar)
  useEffect(() => {
    const handleStorageChange = (e: any) => {
      const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
      if (!e.detail?.grade || e.detail.grade === currentGrade) {
        setPpctList(getStoredPPCTList(currentGrade));
      }
    };
    window.addEventListener('ppct-storage-updated', handleStorageChange);
    return () => window.removeEventListener('ppct-storage-updated', handleStorageChange);
  }, [state.khbd.grade]);

  const handlePpctUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;

      // XỬ LÝ BẢO TOÀN 100% FILE GỐC (SẴN SÀNG ĐỌC TRỰC TUYẾN)
      const isWord = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc');
      const finalName = file.name; // BẢO TOÀN 100% TÊN GỐC, KHÔNG ĐỔI TÊN THÀNH .PDF
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
          console.warn('Word to PDF conversion notice:', err);
        }
      }

      const newFileItem: OriginalFileItem = {
        name: finalName,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: isWord ? 'DOCX' : finalType.toUpperCase(),
        note: `Tài liệu PPCT / Kế hoạch dạy học do giáo viên tải lên (${file.name})${isConverted ? ' • Đã chuyển Word sang PDF' : ''}`,
        uploadedAt: 'Vừa xong',
        dataUrl,
        htmlContent,
        rawText,
        isConvertedFromWord: isConverted,
        originalFileName: file.name
      };

      // QUY ĐỊNH HỆ THỐNG: CHỈ CHO PHÉP NẠP 1 KHBD CHO 1 KHỐI
      // 1. TỰ ĐỘNG NHẬN DIỆN KHỐI LỚP TỪ TÊN FILE PPCT
      const detected = detectGradeFromFileName(file.name);
      const targetGrade = detected || ((state.khbd.grade as GradeLevel) || 'Lớp 9');
      const existingFiles = getExistingFilesForGrade(targetGrade);

      // 2. BÁO LỖI TRÙNG LẶP KHBD KHI KHỐI ĐÃ CÓ FILE (YÊU CẦU XÁC NHẬN 2 CẤP ĐỘ)
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

      // 3. Nếu chưa có file nào và phát hiện khác khối hiện tại: Hỏi chuyển khối
      if (detected && detected !== state.khbd.grade) {
        setPendingUpload({
          file,
          dataUrl,
          detectedGrade: detected,
          targetType: 'ppct'
        });
        setShowSmartGradeModal(true);
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

      // ĐỌC & TRÍCH XUẤT PPCT TỰ ĐỘNG TỪ TỆP WORD/PDF NGUYÊN MẪU
      const parsedResult = parseUploadedPPCT({ name: file.name, htmlContent, rawText }, targetGrade);
      let activeEntries = customCurriculum;
      if (parsedResult.success && parsedResult.entries.length >= 10) {
        activeEntries = parsedResult.entries;
        setCustomCurriculum(parsedResult.entries);
        saveCurriculumForGrade(targetGrade, parsedResult.entries);
      }

      // Tự động đồng bộ nạp bài học đầu tiên từ PPCT nếu bài học hiện tại đang trống
      if (!state.khbd.lessonName && activeEntries.length > 0) {
        const gradeNum = targetGrade.replace('Lớp ', '');
        const defaultState = buildStateFromCurriculumEntry(activeEntries[0], state.khbd.className || `${gradeNum}A1`);
        setState(prev => ({
          ...defaultState,
          khbd: {
            ...defaultState.khbd,
            teacherName: prev.khbd.teacherName,
            className: prev.khbd.className,
            subject: prev.khbd.subject,
            schoolYear: prev.khbd.schoolYear
          }
        }));
      }

      // Mở sẵn Tuần 1 để giáo viên xem ngay
      setExpandedWeeks(prev => ({ ...prev, 1: true }));
      const parsedNotice = parsedResult.success ? ` • Đã nhận diện ${parsedResult.totalPeriods} tiết phân phối chương trình` : '';
      setPpctUploadSuccess(`Đã lưu trữ PPCT: ${finalName}${isConverted ? ' (Đã chuyển sang PDF & bảo toàn nội dung)' : ''}${parsedNotice}!`);
      setTimeout(() => setPpctUploadSuccess(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  // Yêu cầu xóa một khối lớp cụ thể (xóa KHBD thì xóa luôn cả khối đó khỏi hệ thống)
  const handleRequestDeleteGrade = (grade: GradeLevel) => {
    setGradePendingDelete(grade);
    setShowDeleteWarning(true);
  };

  // Delete PPCT handlers
  const handleRequestDeletePPCT = (item: StoredPPCT) => {
    const currentGrade = state.khbd.grade as GradeLevel;
    if (ppctList.length <= 1) {
      // Khi xóa hết các file trong PPCT thì sẽ hiện cảnh báo: xóa thì tất cả bài nạp cũng sẽ mất hết theo và xóa luôn cả khối
      setItemPendingDelete(item);
      setGradePendingDelete(currentGrade);
      setShowDeleteWarning(true);
    } else {
      let updated = deleteStoredPPCT(item.id, currentGrade);
      // Nếu file bị xóa đang là bản lưu hành, chuyển lưu hành cho bản đầu tiên còn lại
      if (item.isCirculating && updated.length > 0) {
        updated = updated.map((f, i) => i === 0 ? { ...f, isCirculating: true } : f);
        saveStoredPPCTList(updated, currentGrade);
        if (updated[0].curriculumData && updated[0].curriculumData.length > 0) {
          setCustomCurriculum(updated[0].curriculumData);
          saveCurriculumForGrade(currentGrade, updated[0].curriculumData);
        }
      }
      setPpctList(updated);
      const ws = getGradeWorkspace(currentGrade);
      ws.ppctList = updated;
      saveGradeWorkspace(currentGrade, ws);
      setPpctUploadSuccess(`Đã xóa file: ${item.name}`);
      setTimeout(() => setPpctUploadSuccess(null), 3000);
    }
  };

  const handleConfirmDeleteAll = () => {
    setShowDeleteWarning(false);
    const targetGrade = (gradePendingDelete || state.khbd.grade) as GradeLevel;
    setGradePendingDelete(null);
    setItemPendingDelete(null);

    // KHI XÓA KHBD THÌ XÓA LUÔN CẢ KHỐI ĐÓ:
    const nextGrade = deleteGradeWorkspaceAndRemove(targetGrade);
    setUploadedFiles([]);
    setPpctList([]);
    setExpandedWeeks({});

    if (nextGrade) {
      // Tự động chuyển ngay sang khối còn lại
      handleSwitchGrade(nextGrade);
      setUploadSuccessToast(`⚠️ Đã xóa toàn bộ KHBD & gỡ bỏ khối ${targetGrade}! Hệ thống đã tự động chuyển sang làm việc cho ${nextGrade}.`);
    } else {
      // Đã xóa hết các khối, đưa về trạng thái trống
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
      setUploadSuccessToast(`⚠️ Đã xóa toàn bộ KHBD và khối lớp! Vui lòng kéo thả hoặc nạp file KHBD mới để tự động tạo lại khối.`);
    }
    setTimeout(() => setUploadSuccessToast(null), 5000);
  };

  const handleRestoreDefaultPPCT = () => {
    const currentGrade = (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const list = restoreDefaultPPCT(currentGrade);
    setPpctList(list);

    // Tự động nạp lại các file tài liệu mẫu đồng bộ theo Khối đang mở
    const ws = getGradeWorkspace(currentGrade);
    setUploadedFiles(ws.uploadedFiles);
    if (ws.uploadedFiles.length > 0) {
      setSelectedRefFile(ws.uploadedFiles[0].name);
    }

    // Tự động nạp lại bài học chuẩn từ PPCT
    const curriculum = getCurriculumForGrade(currentGrade);
    const saved = getSavedTeacherProfile();
    const assigned = state.khbd.assignedClasses || saved.assignedClasses || saved.className || '8/5, 9/1, 9/2';
    const targetClass = extractClassesForGrade(assigned, currentGrade);
    const defaultState = buildStateFromCurriculumEntry(curriculum[0], targetClass);
    setState(prev => ({
      ...defaultState,
      khbd: {
        ...defaultState.khbd,
        grade: currentGrade,
        teacherName: prev.khbd.teacherName || saved.teacherName,
        className: targetClass,
        assignedClasses: assigned,
        subject: prev.khbd.subject || (saved.subject as any) || 'Toán học',
        schoolYear: prev.khbd.schoolYear || saved.schoolYear
      }
    }));
    // Mở sẵn Tuần 1 để giáo viên xem ngay
    setExpandedWeeks({ 1: true });

    setPpctUploadSuccess(`Đã khôi phục lại PPCT & tài liệu chuẩn cho ${currentGrade}.`);
    setTimeout(() => setPpctUploadSuccess(null), 3500);
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

  const handleSelectLesson = (entry: CurriculumEntry) => {
    // Ràng buộc quy định: nếu số tiết vượt quá hoặc khác 140 tiết thì không cho soạn KHBD
    if (customCurriculum.length !== 140) {
      setUploadSuccessToast(
        `⚠️ CẢNH BÁO: Phân phối chương trình hiện có ${customCurriculum.length} tiết (chuẩn quy định là 140 tiết). Bạn cần điều chỉnh lại đúng 140 tiết như ban đầu mới có thể soạn thảo KHBD!`
      );
      setTimeout(() => setUploadSuccessToast(null), 5000);
      return;
    }

    const saved = getSavedTeacherProfile();
    const assigned = state.khbd.assignedClasses || saved.assignedClasses || saved.className || '8/5, 9/1, 9/2';
    const targetGrade = entry.grade || (state.khbd.grade as GradeLevel) || 'Lớp 9';
    const targetClass = extractClassesForGrade(assigned, targetGrade);
    const newState = buildStateFromCurriculumEntry(entry, targetClass);

    // 1. Tự động nạp bài được chọn vào State & đặt chế độ soạn KHBD
    setState({
      ...newState,
      activeTab: 'khbd', // Chuyển luôn sang chế độ soạn KHBD 5512
      khbd: {
        ...newState.khbd,
        grade: targetGrade,
        teacherName: state.khbd.teacherName || saved.teacherName,
        className: targetClass,
        assignedClasses: assigned,
        subject: state.khbd.subject || entry.subject || (saved.subject as any) || 'Toán học',
        schoolYear: state.khbd.schoolYear || saved.schoolYear
      }
    });

    // 2. Chuyển luôn qua Bước 4: Prompt Master, Tài Nguyên & Xuất Bản KHBD
    setCurrentStep(4);

    // 3. Thông báo xuất sắc nạp bài thành công
    setUploadSuccessToast(
      `✓ Đã nạp thành công bài: "${entry.lessonName}" (Tiết ${entry.periodNumber} • ${entry.branch} • Tuần ${entry.week}) vào Bước 4 để bắt đầu soạn KHBD!`
    );
    setTimeout(() => setUploadSuccessToast(null), 4500);

    // 4. Cuộn mượt màn hình lên đầu Bước 4 để giáo viên thao tác ngay
    try {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (e) {
      // ignore
    }
  };

  // Render thẻ bài dạy bên trong mỗi cột phân môn (Số hoặc Hình)
  const renderCurriculumCard = (entry: CurriculumEntry, branchType: 'so' | 'hinh') => {
    const isSelected = state.khbd.lessonName.includes(entry.lessonName.split('(')[0].trim());
    const isBeingDragged = draggedEntry?.id === entry.id;
    const isHinh = branchType === 'hinh';
    const isSystemCurrentWeek = entry.week === currentSystemWeek;

    const branchColor = 
      entry.branch === 'Đại số' ? 'bg-blue-100 text-blue-800 border-blue-200' :
      entry.branch === 'Hình học' ? 'bg-purple-100 text-purple-800 border-purple-200' :
      entry.branch === 'Thống kê & Xác suất' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
      entry.branch === 'Kiểm tra' ? 'bg-rose-100 text-rose-800 border-rose-200' :
      'bg-amber-100 text-amber-800 border-amber-200';

    const periodBadgeBg = 
      isHinh ? 'bg-purple-900 text-white' :
      entry.branch === 'Thống kê & Xác suất' ? 'bg-emerald-900 text-white' :
      'bg-blue-950 text-white';

    const periodLabel = 
      entry.branch === 'Hình học' ? `Hình: Tiết ${entry.periodNumber}` :
      entry.branch === 'Thống kê & Xác suất' ? `Thống kê: Tiết ${entry.periodNumber}` :
      entry.branch === 'Đại số' ? `Số: Tiết ${entry.periodNumber}` :
      `Tiết ${entry.periodNumber}`;

    const { mainTitle, periodSubtitle } = splitLessonTitle(entry.lessonName);
    const formattedMainTitle = ensureLessonTitleHasPeriodCount(mainTitle, entry.periodsCount || 1);
    const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;

    return (
      <div
        key={entry.id}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, entry)}
        onDragEnd={() => {
          setDraggedEntry(null);
          setDragOverWeek(null);
        }}
        onClick={() => handleSelectLesson(entry)}
        className={`p-3 rounded-xl border transition cursor-pointer text-left flex flex-col justify-between group ${
          isBeingDragged
            ? 'opacity-40 border-dashed border-indigo-500 scale-95'
            : isSelected
            ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-300'
            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-1.5 mb-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Nút bấm LÊN / XUỐNG di chuyển riêng cho đúng phân môn này */}
              <div 
                className="flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg p-0.5 shrink-0" 
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleMoveBranchEntry(entry, 'up')}
                  className="p-1 rounded hover:bg-blue-600 hover:text-white text-slate-700 active:scale-90 transition cursor-pointer"
                  title={`Bấm để di chuyển tiết này LÊN (về trước) trong phân môn ${isHinh ? 'Hình' : 'Số'}`}
                >
                  <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveBranchEntry(entry, 'down')}
                  className="p-1 rounded hover:bg-blue-600 hover:text-white text-slate-700 active:scale-90 transition cursor-pointer"
                  title={`Bấm để di chuyển tiết này XUỐNG (về sau) trong phân môn ${isHinh ? 'Hình' : 'Số'}`}
                >
                  <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${periodBadgeBg}`}>
                {periodLabel}
              </span>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${branchColor}`}>
                {entry.branch}
              </span>

              {entry.periodsCount > 1 && (
                <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                  Bài {entry.periodsCount} tiết
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingCurriculumEntry(entry);
                  setIsEditCurriculumModalOpen(true);
                }}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                title="Chỉnh sửa tên bài, quy định Tiết 1 / Tiết 2 hoặc đổi tuần"
              >
                <Edit3 className="w-3 h-3 text-amber-600" />
                <span>Sửa bài</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRequestDeleteLesson(entry);
                }}
                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                title="Xóa tiết hoặc toàn bộ bài này khỏi PPCT (nếu 2 tiết xóa cả hai)"
              >
                <Trash2 className="w-3 h-3 text-rose-600" />
                <span>Xóa</span>
              </button>

              {isSystemCurrentWeek && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-2xs flex items-center gap-1 shrink-0">
                  Đang diễn ra
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5 my-1">
            <div className="text-xs font-black text-slate-900 leading-snug">
              {formattedMainTitle}
            </div>
            {formattedSubtitle && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-[11px] font-sans shadow-2xs ${
                isHinh 
                  ? 'bg-purple-50/90 text-purple-900 border border-purple-200/90' 
                  : 'bg-indigo-50/90 text-indigo-900 border border-indigo-200/90'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${isHinh ? 'bg-purple-600' : 'bg-indigo-600'}`}></span>
                <span>{formattedSubtitle}</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {entry.chapter}
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 truncate max-w-[65%]">
            {entry.digitalCompetency ? (
              <span className="text-slate-600 font-medium">NLS: {entry.digitalCompetency.split(':')[0]}</span>
            ) : (
              <span>Mã NL: {entry.aiRoleCode || '9.A3.1'}</span>
            )}
          </span>
          <span className={`font-bold shrink-0 flex items-center gap-1 transition ${
            customCurriculum.length !== 140
              ? 'text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200'
              : isSelected 
              ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300' 
              : 'text-blue-600 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200/60'
          }`}>
            {customCurriculum.length !== 140
              ? '⚠️ Cần đúng 140 tiết'
              : isSelected
              ? '✓ Đang chọn • Nạp sang Bước 4 →'
              : 'Nạp bài & Soạn ở Bước 4 →'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
      
      {/* Top Workflow Stepper Bar (Đồng bộ chuẩn giao diện ke-hoach-bai-day-nls.vercel.app) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-200 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-7 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Thông tin Kế hoạch bài dạy
            </h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200/60 shadow-2xs">
              Quy trình chuẩn tinh giản
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-4.5">
            Soạn giáo án Năng lực số & AI theo các bước: Thông Tin Giáo Viên • Môn & Bài Dạy PPCT • Xuất Bản
          </p>
        </div>

        {/* Interactive Stepper Indicator: Bước 2, Bước 3, Bước 4 (kèm Bước 1 tùy chọn) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
          {[
            { step: 2, label: 'Bước 2: Thông Tin Giáo Viên' },
            { step: 3, label: 'Bước 3: Môn & Bài Dạy PPCT' },
            { step: 4, label: 'Bước 4: Prompt Master, Tài Nguyên & Xuất Bản' },
            { step: 1, label: 'Bước 1: Chọn Mẫu (Nâng Cao)' }
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = (currentStep === 3 && item.step === 2) || (currentStep === 4 && (item.step === 2 || item.step === 3));
            return (
              <button
                key={item.step}
                onClick={() => {
                  if (item.step === 4 && customCurriculum.length !== 140) {
                    setUploadSuccessToast(
                      `⚠️ CẢNH BÁO: Phân phối chương trình hiện có ${customCurriculum.length} tiết (chuẩn quy định là 140 tiết). Bạn cần điều chỉnh lại đúng 140 tiết như ban đầu mới có thể soạn thảo KHBD!`
                    );
                    setTimeout(() => setUploadSuccessToast(null), 5000);
                    return;
                  }
                  setCurrentStep(item.step as any);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                    : isCompleted
                    ? 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                  isActive ? 'bg-white text-blue-700' : isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {isCompleted ? '✓' : item.step}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          BƯỚC 1: CHỌN MẪU KẾ HOẠCH BÀI DẠY (KHUNG CÔNG VĂN 5512 & GDPT 2018)
          ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shrink-0">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  BƯỚC 1: CHỌN MẪU KẾ HOẠCH BÀI DẠY & CẤU TRÚC ĐỊNH DẠNG
                </h3>
                <p className="text-xs text-slate-600">
                  Chọn khung mẫu chuẩn theo Công văn 5512/BGDĐT hoặc tích hợp Năng lực số NLS GDPT 2018
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              Mẫu hiện hành: Công văn 5512
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Template 1 */}
            <div 
              onClick={() => setSelectedTemplate('cv5512')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition text-left space-y-2.5 ${
                selectedTemplate === 'cv5512'
                  ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Khuyên Dùng
                </span>
                {selectedTemplate === 'cv5512' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                1. Mẫu Chuẩn Công Văn 5512/BGDĐT
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đầy đủ 4 hoạt động: Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng. Căn chỉnh lề Word .doc chuẩn in ấn A4.
              </p>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                • Tiêu chuẩn bắt buộc toàn quốc
              </div>
            </div>

            {/* Template 2 */}
            <div 
              onClick={() => setSelectedTemplate('nls')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition text-left space-y-2.5 ${
                selectedTemplate === 'nls'
                  ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  NLS Model
                </span>
                {selectedTemplate === 'nls' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                2. Tích Hợp Năng Lực Số (NLS)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Theo định hướng mô hình https://ke-hoach-bai-day-nls.vercel.app/ gắn chỉ số năng lực số vào từng bước sư phạm.
              </p>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                • Đổi mới phương pháp dạy học
              </div>
            </div>

            {/* Template 3 */}
            <div 
              onClick={() => setSelectedTemplate('allinone')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition text-left space-y-2.5 ${
                selectedTemplate === 'allinone'
                  ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Bộ 3 Toàn Diện
                </span>
                {selectedTemplate === 'allinone' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                3. Đồng Bộ KHBD 5512 + Slide + Đề 7991
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tự động đồng bộ nội dung bài giảng giữa Giáo án Word, Bộ Slide PowerPoint trình chiếu và Ngân hàng câu hỏi ma trận.
              </p>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                • Tiết kiệm 90% thời gian soạn giáo án
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <span>Tiếp tục sang Bước 2: Khai Báo Giáo Viên</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          BƯỚC 2: THÔNG TIN GIÁO VIÊN: 1. TÊN GV, 2. LỚP DẠY, 3. MÔN DẠY, 4. NĂM HỌC
          ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                  BƯỚC 2: THÔNG TIN GIÁO VIÊN
                </h3>
                <p className="text-xs text-blue-800">
                  Các mục tự nhập: 1. Tên giáo viên • 2. Lớp dạy • 3. Môn dạy • 4. Năm học
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Tên giáo viên */}
            <div className="space-y-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Tên giáo viên:</span>
              </label>
              <input
                type="text"
                value={state.khbd.teacherName || ''}
                onChange={(e) => handleTeacherInfoChange({ teacherName: e.target.value })}
                placeholder="Nhập họ và tên..."
                className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
              />
            </div>

            {/* 2. Lớp dạy */}
            <div className="space-y-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Lớp dạy (ví dụ: 8/5; 9/3; 9/6):</span>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-100/80 font-bold px-1.5 py-0.5 rounded">
                  Tự động theo khối
                </span>
              </label>
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
                placeholder="Ví dụ: 8/5; 9/3; 9/6 (phân cách bằng dấu chấm phẩy hoặc phẩy)..."
                className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
              />
              <div className="flex items-center justify-between gap-1 text-[11px] bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-slate-700">
                <span className="text-[10px] text-slate-500 font-medium">Lớp lấy vào KHBD {state.khbd.grade}:</span>
                <strong className="text-emerald-800 font-bold">{state.khbd.className || extractClassesForGrade(state.khbd.assignedClasses, state.khbd.grade)}</strong>
              </div>
            </div>

            {/* 3. Môn dạy */}
            <div className="space-y-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>3. Môn dạy:</span>
              </label>
              <input
                type="text"
                list="wf-subjectlist"
                value={state.khbd.subject || ''}
                onChange={(e) => handleTeacherInfoChange({ subject: e.target.value as any })}
                placeholder="Nhập môn dạy..."
                className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
              />
              <datalist id="wf-subjectlist">
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
            <div className="space-y-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>4. Năm học:</span>
              </label>
              <input
                type="text"
                list="wf-yearlist"
                value={state.khbd.schoolYear || ''}
                onChange={(e) => handleTeacherInfoChange({ schoolYear: e.target.value })}
                placeholder="Nhập năm học..."
                className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
              />
              <datalist id="wf-yearlist">
                <option value="2026-2027" />
                <option value="2025-2026" />
                <option value="2024-2025" />
              </datalist>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              ← Quay lại Bước 1: Chọn mẫu KHBD
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <span>Tiếp tục sang Bước 3: Môn & Bài Dạy PPCT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          BƯỚC 3: MÔN & BÀI DẠY PPCT & UPLOAD TÀI LIỆU BÁM THEO
          ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">
                  BƯỚC 3: MÔN & BÀI DẠY PPCT
                </h3>
                <p className="text-xs text-indigo-800">
                  Gồm: 1. Môn học • 2. PPCT (Mỗi khối chỉ có 1 PPCT duy nhất) & Chọn bài dạy từ chương trình. (Tài nguyên mẫu & Prompt Master đã được chuyển sang Bước 4).
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCurriculumModal}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem Toàn Bộ 140 Tiết PPCT</span>
            </button>
          </div>

          {/* =========================================================================
              THANH HIỂN THỊ KHỐI LỚP LÀM VIỆC (GHI NGẮN GỌN THEO YÊU CẦU)
              ========================================================================= */}
          <div className="flex items-center justify-between gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Khối đang soạn:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold border border-blue-200">
                {state.khbd.grade}
              </span>
              {assignedGrades.length > 1 && (
                <div className="flex items-center gap-1.5 ml-2 border-l border-slate-300 pl-2">
                  <span className="text-[11px] text-slate-500">Chuyển khối:</span>
                  {assignedGrades.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleSwitchGrade(g)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                        g === state.khbd.grade
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              Đồng bộ dữ liệu riêng cho {state.khbd.grade}
            </span>
          </div>

          {/* 1. Môn học (mặc định Toán học) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">1. Môn học:</span>
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-300 rounded-xl">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  ∑
                </span>
                <span className="text-sm font-black text-slate-900">
                  {state.khbd.subject || 'Toán học'} (Mặc định)
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Bài học đang chọn:</span>
              <div className="p-2.5 bg-white border border-blue-300 rounded-xl min-h-[42px] flex flex-col justify-center">
                {state.khbd.lessonName ? (
                  <>
                    {(() => {
                      const { mainTitle, periodSubtitle } = splitLessonTitle(state.khbd.lessonName);
                      const formattedMainTitle = ensureLessonTitleHasPeriodCount(mainTitle, state.khbd.periodsCount || 1);
                      const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;
                      return (
                        <div className="space-y-1">
                          <div className="text-xs font-black text-blue-950 leading-snug">
                            {formattedMainTitle}
                          </div>
                          {formattedSubtitle && (
                            <div className="text-[11px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1.5 font-sans shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                              <span>{formattedSubtitle}</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {state.khbd.chapter && (
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {state.khbd.chapter}
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">Thông số phân phối:</span>
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 min-h-[42px]">
                {state.khbd.lessonName && state.khbd.curriculumRef?.week ? (
                  <>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Tuần: {state.khbd.curriculumRef.week}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      Tiết PPCT: {state.khbd.curriculumRef.period}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {state.khbd.periodsCount || 2} tiết
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* KHU VỰC PPCT: NÚT PPCT, LINK KÉO THẢ TẢI LÊN & LƯU TRỰC TIẾP (1 KHỐI CHỈ CÓ 1 PPCT) */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shadow-xs">
                  PPCT
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Phân Phối Chương Trình Môn Học (Mỗi khối chỉ có 1 PPCT)
                </span>
              </div>
              <span className="text-[11px] text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full font-bold border border-rose-300">
                Quy định: Mỗi khối chỉ có 1 PPCT • Nạp thêm PPCT là không được
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Link kéo thả PPCT */}
              <div className="md:col-span-5">
                <label
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingPpct(true); }}
                  onDragLeave={() => setIsDraggingPpct(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPpct(false);
                    handlePpctUpload(e.dataTransfer.files);
                  }}
                  className={`flex flex-col items-center justify-center p-3.5 border-2 border-dashed rounded-xl cursor-pointer transition text-center ${
                    isDraggingPpct 
                      ? 'border-blue-600 bg-blue-100 text-blue-800' 
                      : 'border-blue-300 hover:border-blue-500 bg-white hover:bg-blue-50/50 text-blue-700'
                  }`}
                  title="Kéo thả hoặc bấm để tải lên file PPCT (.docx, .pdf, .xlsx)"
                >
                  <Upload className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">
                    Kéo thả hoặc bấm để tải file PPCT lên
                  </span>
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold border border-rose-200 mt-1">
                    Quy định: Mỗi khối chỉ lưu 1 PPCT • Trùng khối sẽ báo lỗi & kiểm 2 cấp độ
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Hỗ trợ .docx, .pdf, .xlsx • Tự động nhận diện khối lớp
                  </span>
                  <input
                    type="file"
                    accept=".docx,.doc,.pdf,.xlsx"
                    onChange={(e) => handlePpctUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Danh sách PPCT lưu trữ ngay trên đây có nút Xem, Tải về và Xóa */}
              <div className="md:col-span-7 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    Tài liệu PPCT lưu trữ trực tiếp tại đây:
                  </span>
                  {ppctList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => { setItemPendingDelete(null); setShowDeleteWarning(true); }}
                      className="text-[10px] text-rose-600 hover:text-rose-800 hover:underline font-bold flex items-center gap-1 transition"
                      title="Xóa tất cả file trong PPCT"
                    >
                      <Trash2 className="w-3 h-3 text-rose-500" />
                      <span>Xóa hết</span>
                    </button>
                  )}
                </div>

                {ppctList.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-amber-800 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Kho PPCT hiện đang trống • Tất cả bài nạp đã mất hết theo</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Thầy/Cô hãy kéo thả tải lên file PPCT mới ở bên trái hoặc bấm nút dưới đây để khôi phục PPCT mẫu chuẩn ban đầu:
                    </p>
                    <button
                      type="button"
                      onClick={handleRestoreDefaultPPCT}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs inline-flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Khôi phục PPCT mẫu chuẩn (140 tiết)</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* DÒNG 1: FILE GỐC (BẤM VÀO XEM LUÔN NHANH VÀ ĐẸP NHƯ BẢN BÊN DƯỚI, BỎ CHỨC NĂNG NGÂN HÀNG PPCT) */}
                    {ppctList.length > 0 && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-blue-200 bg-white text-xs shadow-2xs hover:border-blue-300 transition">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span 
                            onClick={() => handleViewOriginalPPCT(ppctList[0])}
                            className="font-bold text-slate-800 truncate cursor-pointer hover:text-blue-700 hover:underline"
                            title={`Bấm để xem trực tiếp ${ppctList[0].name}`}
                          >
                            {ppctList[0].name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">({ppctList[0].size})</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                            File gốc
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDownloadPPCTItem(ppctList[0])}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                            title="Tải về file PPCT gốc"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải về</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRequestDeletePPCT(ppctList[0])}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                            title="Xóa file PPCT này"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* DÒNG 2: NGAY BÊN DƯỚI FILE GỐC - "PPCT Được cập nhật mới & Đang lưu hành" (ĐÃ BỎ NÚT XEM FILE, BẤM VÀO TÊN LÀ XEM NGAY) */}
                    {!isUpdatedPPCTDeleted && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/85 text-xs shadow-2xs hover:border-emerald-400 transition ring-1 ring-emerald-400/40 animate-fadeIn">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span 
                            onClick={handleViewUpdatedPPCT}
                            className="font-black text-emerald-950 truncate cursor-pointer hover:text-emerald-700 hover:underline"
                            title="Bấm để xem trực tiếp PPCT Được cập nhật mới & Đang lưu hành"
                          >
                            PPCT Được cập nhật mới & Đang lưu hành
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold shrink-0">(.docx)</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleConfirmExportWordPPCT}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                            title="Tải về file Word (.docx) chuẩn 100% không lỗi Word"
                          >
                            <Download className="w-3.5 h-3.5 text-white" />
                            <span>Tải về</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleDeleteUpdatedPPCT}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                            title="Xóa file PPCT cập nhật này"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Xóa file</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Các file tải lên bổ sung khác (nếu có ngoài file gốc) */}
                    {ppctList.slice(1).filter(item => !item.id.includes('updated') && !item.name.includes('cập nhật')).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs shadow-2xs hover:border-slate-300 transition"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                          <span 
                            onClick={() => handleViewOriginalPPCT(item)}
                            className="font-bold text-slate-700 truncate cursor-pointer hover:text-blue-700 hover:underline"
                            title={`Bấm để xem trực tiếp ${item.name}`}
                          >
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">({item.size})</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDownloadPPCTItem(item)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải về</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestDeletePPCT(item)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {ppctUploadSuccess && (
              <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{ppctUploadSuccess}</span>
              </div>
            )}
          </div>

          {/* 2. KHỐI DANH SÁCH BÀI DẠY PICKUP TỪ PHÂN PHỐI CHƯƠNG TRÌNH */}
          <div className="space-y-4">
            {/* Header mục 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5 tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>2. Danh Sách Bài Dạy Pickup Từ Phân Phối Chương Trình (Tự Động Đọc Ra & Chia Tiết):</span>
              </label>
              
              {ppctList.length > 0 && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  ✓ Đã đồng bộ đầy đủ 140 tiết theo Khối, Môn, Tuần, Tiết
                </span>
              )}
            </div>

            {ppctList.length === 0 ? (
              /* THÔNG BÁO KHI PPCT ĐÃ XÓA: CÁC FILE VÀ BÀI NẠP ĐÃ TỰ ĐỘNG XÓA ĐỂ ĐỒNG BỘ */
              <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-950">
                    Kho PPCT hiện đang trống (Đã xóa) • Tất cả bài nạp & file đã được tự động làm sạch
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
                    Khi PPCT đã xóa, các bài dạy và file đã load cũng được tự động xóa đi để khi tải lại đảm bảo tính đồng bộ chính xác theo <strong>Khối, Môn, Tuần, Tiết</strong>.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleRestoreDefaultPPCT}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-2 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Nạp lại PPCT chuẩn (140 tiết • HK1: 72 tiết, HK2: 68 tiết)</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* VIỆC ĐẦU TIÊN TRÊN CÙNG: GHI TÓM TẮT THÔNG TIN SỐ TIẾT HỌC KÌ 1, KÌ 2, CẢ NĂM */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-800 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider">
                          TỔNG KẾT PPCT CHUẨN BGD&ĐT
                        </span>
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          ✓ Đồng bộ theo Khối, Môn, Tuần, Tiết
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white mt-1">
                        Phân Phối Chương Trình Môn {state.khbd.subject || 'Toán học'} - {state.khbd.grade} ({state.khbd.className || `${(state.khbd.grade || 'Lớp 9').replace('Lớp ', '')}A1`}) (Năm học {state.khbd.schoolYear || '2026-2027'})
                      </h3>
                    </div>
                    
                    <div className="sm:text-right shrink-0">
                      <span className="text-[10px] text-slate-300 block">Trạng thái dữ liệu nạp:</span>
                      <span className="text-xs font-black text-amber-300">
                        Đầy đủ 100% (140/140 tiết • 35 tuần)
                      </span>
                    </div>
                  </div>

                  {/* 3 Thẻ tóm tắt số tiết: Cả năm, Học kì 1, Học kì 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Thẻ 1: CẢ NĂM */}
                    <div 
                      onClick={() => setSelectedSemester('all')}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        selectedSemester === 'all' 
                          ? 'bg-blue-600/30 border-blue-400 shadow-md ring-1 ring-blue-400' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      title="Xem toàn bộ 140 tiết cả năm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">📅 CẢ NĂM HỌC</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                          35 tuần thực học
                        </span>
                      </div>
                      <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
                        <span>140</span>
                        <span className="text-xs font-medium text-slate-300">tiết</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 flex items-center justify-between">
                        <span>Trung bình 4 tiết / tuần</span>
                        <span className="text-emerald-400 font-semibold">100% chương trình</span>
                      </div>
                    </div>

                    {/* Thẻ 2: HỌC KÌ 1 */}
                    <div 
                      onClick={() => setSelectedSemester('1')}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        selectedSemester === '1' 
                          ? 'bg-indigo-600/30 border-indigo-400 shadow-md ring-1 ring-indigo-400' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      title="Lọc xem 72 tiết Học kì 1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">📘 HỌC KÌ 1</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                          Tuần 1 → Tuần 18 (18 tuần)
                        </span>
                      </div>
                      <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
                        <span>72</span>
                        <span className="text-xs font-medium text-slate-300">tiết</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 flex items-center justify-between">
                        <span>Đại số: 40 tiết</span>
                        <span>Hình học: 32 tiết</span>
                      </div>
                    </div>

                    {/* Thẻ 3: HỌC KÌ 2 */}
                    <div 
                      onClick={() => setSelectedSemester('2')}
                      className={`p-3 rounded-xl border transition cursor-pointer ${
                        selectedSemester === '2' 
                          ? 'bg-amber-600/30 border-amber-400 shadow-md ring-1 ring-amber-400' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      title="Lọc xem 68 tiết Học kì 2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">📙 HỌC KÌ 2</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                          Tuần 19 → Tuần 35 (17 tuần)
                        </span>
                      </div>
                      <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1.5">
                        <span>68</span>
                        <span className="text-xs font-medium text-slate-300">tiết</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 flex items-center justify-between">
                        <span>Đại số & Thống kê: 38 tiết</span>
                        <span>Hình & Trải nghiệm: 30 tiết</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BỘ LỌC TOÀN BỘ THEO 3 LOẠI: CẢ NĂM, HỌC KÌ 1, HỌC KÌ 2 + TÌM KIẾM */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
                  {/* 3 Loại Tabs chuyển đổi */}
                  <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedSemester('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                        selectedSemester === 'all'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>🌟 Cả năm</span>
                      <span className="text-[10px] opacity-80">(140 tiết)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSemester('1')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                        selectedSemester === '1'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>📘 Học kì 1</span>
                      <span className="text-[10px] opacity-80">(72 tiết)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSemester('2')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                        selectedSemester === '2'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>📙 Học kì 2</span>
                      <span className="text-[10px] opacity-80">(68 tiết)</span>
                    </button>
                  </div>

                  {/* THANH ĐIỀU KHIỂN & TÌM KIẾM PPCT NÂNG CAO */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={ppctSearch}
                        onChange={(e) => setPpctSearch(e.target.value)}
                        placeholder="Tìm tên bài, số tiết, tuần..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={handleExpandAll}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs whitespace-nowrap cursor-pointer"
                        title="Mở rộng tất cả các tuần"
                      >
                        Mở tất cả
                      </button>
                      <button
                        type="button"
                        onClick={handleCollapseAll}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs whitespace-nowrap cursor-pointer"
                        title="Thu gọn tất cả các tuần"
                      >
                        Thu gọn
                      </button>
                    </div>
                  </div>
                </div>

                {/* THANH CÔNG CỤ TÁC VỤ PPCT: TẠO MỚI, HOÁN ĐỔI, CÂN BẰNG TIẾT, KHÔI PHỤC */}
                <div className="p-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2 flex-wrap text-xs">

                    {/* NÚT TẠO MỚI TIẾT PPCT (THEO YÊU CẦU & ẢNH MINH HỌA) */}
                    <button
                      type="button"
                      onClick={() => handleOpenCreateLessonModal()}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-black flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                      title="Tạo mới một bài dạy hoặc tiết học bổ sung vào PPCT"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Tạo mới tiết</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAutoBalanceWeeks}
                      className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                      title="Tự động cân bằng tất cả các tuần đúng chuẩn 4 tiết/tuần"
                    >
                      <Scale className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Cân bằng 4 tiết/tuần</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRestoreStandardCurriculum}
                      className="px-2.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 rounded-xl font-medium flex items-center gap-1 transition cursor-pointer"
                      title="Khôi phục phân phối chương trình mẫu chuẩn ban đầu"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>Khôi phục gốc</span>
                    </button>

                    {curriculumHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={handleUndoCurriculum}
                        className="px-2.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
                        title="Hoàn tác thay đổi vừa thực hiện"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Hoàn tác ({curriculumHistory.length})</span>
                      </button>
                    )}
                  </div>

                  {/* Lựa chọn chế độ di chuyển cả cụm bài hoặc 1 tiết */}
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 shrink-0">
                    <span className="text-slate-500">Chế độ di chuyển:</span>
                    <button
                      type="button"
                      onClick={() => setDragMoveWholeLesson(prev => !prev)}
                      className={`px-2.5 py-1 rounded-lg border font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        dragMoveWholeLesson 
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs' 
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                      title={dragMoveWholeLesson ? 'Đang di chuyển cả cụm bài (ví dụ bài 2 tiết di chuyển cả 2)' : 'Đang di chuyển riêng lẻ từng tiết'}
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>{dragMoveWholeLesson ? 'Di chuyển cả bài (2 tiết)' : 'Di chuyển từng tiết'}</span>
                    </button>
                  </div>
                </div>

                {/* Hướng dẫn thao tác: Bố cục 2 cột Số/Hình & Tự động cân bằng 4 tiết/tuần */}
                <div className="px-3.5 py-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between gap-2 text-[11px] text-blue-900">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      <strong>Bố cục 2 Cột (Số / Hình) & Cân bằng 4 tiết/tuần:</strong> Mỗi tuần được tách biệt thành 2 cột <em>(Phân môn Số & Đại số / Phân môn Hình học)</em>. Nút <ChevronUp className="w-3.5 h-3.5 inline text-blue-700 font-bold" /> và <ChevronDown className="w-3.5 h-3.5 inline text-blue-700 font-bold" /> chỉ điều chỉnh cho đúng phân môn đó. Khi đẩy lên 4 tiết Số thì 0 tiết Hình (tiết Hình tự động dời sang tuần sau); có thể chọn nhanh các tỷ lệ 4-0, 3-1, 2-2, 1-3, 0-4 bằng 1 chạm.
                    </span>
                  </div>
                  {draggedEntry && (
                    <span className="text-emerald-700 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded animate-pulse shrink-0">
                      Đang giữ: {draggedEntry.lessonName.split('(')[0].trim()}
                    </span>
                  )}
                </div>

                {/* CẢNH BÁO VƯỢT QUÁ HOẶC THIẾU 140 TIẾT: KHÓA SOẠN KHBD CHO ĐẾN KHI SỬA LẠI ĐÚNG 140 TIẾT */}
                {customCurriculum.length !== 140 && (
                  <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-950 shadow-md animate-fadeIn">
                    <div className="flex items-start sm:items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-black shadow-xs">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black">
                          CẢNH BÁO: Phân phối chương trình hiện có {customCurriculum.length} tiết (chuẩn quy định là 140 tiết, {customCurriculum.length > 140 ? `vượt quá ${customCurriculum.length - 140} tiết` : `thiếu ${140 - customCurriculum.length} tiết`})!
                        </div>
                        <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                          Hệ thống tạm khóa tính năng soạn thảo KHBD cho đến khi điều chỉnh về đúng 140 tiết như ban đầu. Bạn có thể sửa lại số tiết của các bài hoặc bấm khôi phục.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleRestoreStandardCurriculum}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
                      >
                        Khôi phục 140 tiết gốc
                      </button>
                      <button
                        type="button"
                        onClick={handleAutoBalanceWeeks}
                        className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                      >
                        Cân bằng 4 tiết/tuần
                      </button>
                    </div>
                  </div>
                )}

                {/* DANH SÁCH BÀI DẠY: ƯU TIÊN THEO TUẦN, ĐẢM BẢO LOAD ĐỦ SỐ TIẾT, CÓ SỔ XUỐNG XEM */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {lessonsByWeek.map((weekGroup) => {
                    const isExpanded = !!expandedWeeks[weekGroup.week];
                    const hasCurrentLesson = weekGroup.entries.some(e => 
                      state.khbd.lessonName.includes(e.lessonName.split('(')[0].trim())
                    );
                    const isDropTarget = dragOverWeek === weekGroup.week;
                    const isBalancedWeek = weekGroup.totalPeriods === 4;
                    const isSystemCurrentWeek = weekGroup.week === currentSystemWeek;
                    const weekInfo = allWeekDatesMap.get(weekGroup.week) || {
                      week: weekGroup.week,
                      monday: new Date(),
                      saturday: new Date(),
                      rangeString: '(07/09/26-12/09/26)',
                      isOverridden: false
                    };

                    return (
                      <div 
                        key={weekGroup.week}
                        ref={isSystemCurrentWeek ? currentWeekCardRef : undefined}
                        onDragOver={(e) => handleDragOverWeek(e, weekGroup.week)}
                        onDragLeave={(e) => handleDragLeaveWeek(e, weekGroup.week)}
                        onDrop={() => handleDropOnWeek(weekGroup.week)}
                        className={`rounded-2xl border transition-all overflow-hidden shadow-2xs ${
                          isDropTarget 
                            ? 'border-2 border-dashed border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-400 scale-[1.01]' 
                            : isSystemCurrentWeek
                            ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-300 shadow-sm'
                            : hasCurrentLesson 
                            ? 'border-blue-400 bg-blue-50/20 ring-1 ring-blue-300' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* Weekly Accordion Header (Sổ xuống xem chi tiết các tiết + Drop Zone) */}
                        <div 
                          onClick={() => toggleWeek(weekGroup.week)}
                          className={`p-3 sm:px-4 cursor-pointer flex items-center justify-between gap-3 select-none transition ${
                            isExpanded ? 'bg-slate-50/90 border-b border-slate-200' : 'bg-white hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-2xs ${
                              weekGroup.semester === 1 ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'
                            }`}>
                              Tuần {weekGroup.week}
                            </span>

                            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              Học kì {weekGroup.semester}
                            </span>

                            {/* NÚT THỜI GIAN TUẦN (dd/mm/yy-dd/mm/yy) & CALENDAR POPUP */}
                            <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setActiveDatePickerWeek(activeDatePickerWeek === weekGroup.week ? null : weekGroup.week)}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition flex items-center gap-1 cursor-pointer shadow-2xs ${
                                  weekInfo.isOverridden 
                                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                                }`}
                                title={`Bấm để chọn ngày cho Tuần ${weekGroup.week} (Tự động tính từ Thứ 2 đến Thứ 7 và rải đều các tuần sau)`}
                              >
                                <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                                <span className="font-extrabold">{weekInfo.rangeString}</span>
                              </button>

                              {/* POPOVER LỊCH (CALENDAR) */}
                              <WeekDatePickerPopover
                                week={weekGroup.week}
                                semester={weekGroup.semester}
                                weekInfo={weekInfo}
                                isOpen={activeDatePickerWeek === weekGroup.week}
                                onClose={() => setActiveDatePickerWeek(null)}
                                onSelectDate={(date) => handleSelectWeekDate(weekGroup.week, date)}
                                onShiftWeek={(offset) => handleShiftWeek(weekGroup.week, offset, weekInfo.monday)}
                                onReset={() => handleResetWeekDates(weekGroup.week)}
                              />
                            </div>

                            {/* Chỉ báo Tuần đang diễn ra theo ngày hệ thống */}
                            {isSystemCurrentWeek && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                <span>Đang diễn ra</span>
                              </span>
                            )}

                            {/* Badge chỉ báo Tuần Kiểm Tra Định Kỳ (tự động: chớp đỏ nếu chưa tới, màu xám nếu đã qua) */}
                            {weekGroup.hasPeriodicExam && (
                              (() => {
                                const isPassed = isExamPassed(weekGroup.week);
                                return isPassed ? (
                                  <span
                                    className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 shadow-2xs"
                                    title="Đợt kiểm tra đã qua theo mốc thời gian hệ thống (màu xám bình thường)"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                    <span>⚪ Đợt kiểm tra {weekGroup.examName || 'định kỳ'} (Đã qua)</span>
                                  </span>
                                ) : (
                                  <span
                                    className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-rose-600 to-red-600 text-white flex items-center gap-1 shadow-xs ring-1 ring-rose-400"
                                    title="Đợt kiểm tra chưa tới (chớp đỏ nổi bật)"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                    <span>🔴 Đợt kiểm tra {weekGroup.examName || 'định kỳ'} (90p)</span>
                                  </span>
                                );
                              })()
                            )}

                            {/* Badge định mức số tiết tuần */}
                            {isBalancedWeek ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>4/4 tiết (Đạt chuẩn)</span>
                              </span>
                            ) : weekGroup.totalPeriods > 4 ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>{weekGroup.totalPeriods}/4 tiết (Thừa {weekGroup.totalPeriods - 4} tiết)</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>{weekGroup.totalPeriods}/4 tiết (Thiếu {4 - weekGroup.totalPeriods} tiết)</span>
                              </span>
                            )}

                            {/* Badge tỷ lệ Số / Hình trực quan */}
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs">
                              {weekGroup.soCount} Số • {weekGroup.hinhCount} Hình
                            </span>

                            <span className="text-xs font-bold text-slate-800">
                              {weekGroup.periodRange}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* NÚT TẠO MỚI TIẾT THEO YÊU CẦU & ẢNH MINH HỌA (chữ đỏ của người dùng) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenCreateLessonModal(weekGroup.week);
                              }}
                              className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-2xs transition cursor-pointer"
                              title={`Tạo mới tiết / bài dạy cho Tuần ${weekGroup.week}`}
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>Tạo mới tiết</span>
                            </button>

                            {isDropTarget && (
                              <span className="text-[11px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md animate-pulse">
                                🎯 Thả bài vào Tuần {weekGroup.week}
                              </span>
                            )}
                            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
                              {isExpanded ? 'Thu gọn' : 'Sổ xuống xem'}
                            </span>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                              isExpanded ? 'bg-blue-100 text-blue-700 rotate-180' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Drop Cue Banner khi đang kéo bài lướt qua tuần */}
                        {isDropTarget && (
                          <div className="p-2.5 bg-indigo-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
                            <ArrowLeftRight className="w-4 h-4 text-amber-300 animate-spin" />
                            <span>Thả chuột để chuyển bài vào Tuần {weekGroup.week} (Tự động hoán đổi đối ứng để giữ định mức 4 tiết)</span>
                          </div>
                        )}

                        {/* Weekly Content (Khi sổ xuống: hiển thị đầy đủ tất cả các tiết của tuần đó theo 2 CỘT SỐ / HÌNH) */}
                        {isExpanded && (
                          <div className="p-3.5 bg-slate-50/70 border-t border-slate-200 space-y-3">
                            {/* THANH ĐIỀU PHỐI ĐỊNH MỨC 4 TIẾT / TUẦN (theo yêu cầu 3: tự động đáp ứng 4 tiết: 4-0, 3-1, 2-2, 1-3, 0-4) */}
                            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                                  <Scale className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Tỷ lệ phân bổ Tuần {weekGroup.week} (Chuẩn 4 tiết):</span>
                                </span>
                                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                                  {weekGroup.soCount} Số + {weekGroup.hinhCount} Hình = {weekGroup.totalPeriods} tiết
                                </span>
                              </div>

                              {/* Nút chuyển đổi nhanh tỷ lệ: Khi có kiểm tra thì 3-1, 2-2, 1-3. Khi bình thường thì 4-0, 3-1, 2-2, 1-3, 0-4 */}
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[10px] text-slate-500 font-semibold mr-1">Chuyển nhanh:</span>
                                {(weekGroup.hasPeriodicExam
                                  ? [
                                      { so: 3, hinh: 1, label: '3 Số - 1 Hình' },
                                      { so: 2, hinh: 2, label: '2 Số - 2 Hình' },
                                      { so: 1, hinh: 3, label: '1 Số - 3 Hình' },
                                    ]
                                  : [
                                      { so: 4, hinh: 0, label: '4 Số - 0 Hình' },
                                      { so: 3, hinh: 1, label: '3 Số - 1 Hình' },
                                      { so: 2, hinh: 2, label: '2 Số - 2 Hình' },
                                      { so: 1, hinh: 3, label: '1 Số - 3 Hình' },
                                      { so: 0, hinh: 4, label: '0 Số - 4 Hình' },
                                    ]
                                ).map((ratio) => {
                                  const isActive = weekGroup.soCount === ratio.so && weekGroup.hinhCount === ratio.hinh;
                                  return (
                                    <button
                                      key={ratio.label}
                                      type="button"
                                      onClick={() => handleSetWeekBranchRatio(weekGroup.week, ratio.so, ratio.hinh)}
                                      className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition cursor-pointer border ${
                                        isActive
                                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs ring-1 ring-indigo-400'
                                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                                      }`}
                                      title={`Đặt định mức Tuần ${weekGroup.week} thành ${ratio.label} (tự động hoán đổi đối ứng với các tuần sau)`}
                                    >
                                      {ratio.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>


                            {/* BỐ CỤC 2 CỘT CHÍNH: CỘT 1 PHÂN MÔN SỐ & ĐẠI SỐ / THỐNG KÊ - CỘT 2 PHÂN MÔN HÌNH HỌC & ĐO LƯỜNG */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
                              {/* ===== CỘT 1: PHÂN MÔN SỐ & ĐẠI SỐ ===== */}
                              <div className="rounded-2xl border border-blue-200/90 bg-blue-50/20 overflow-hidden shadow-2xs flex flex-col">
                                {/* Header Cột Số */}
                                <div className="p-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between gap-2 shadow-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-black">
                                      <Calculator className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                                        <span>PHÂN MÔN SỐ & ĐẠI SỐ</span>
                                        {weekGroup.soEntries.some(e => e.branch === 'Thống kê & Xác suất') && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400/30 text-emerald-100 font-bold">
                                            + Thống kê
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[10px] text-blue-100 font-semibold tracking-wide">
                                        Tuần {weekGroup.week}: {weekGroup.soRange}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full bg-white text-blue-900 text-xs font-black shadow-2xs">
                                      {weekGroup.soCount} tiết
                                    </span>
                                    {/* Nút tăng / giảm tiết Số */}
                                    <div className="flex items-center bg-black/20 rounded-lg p-0.5">
                                      <button
                                        type="button"
                                        disabled={weekGroup.hasPeriodicExam ? weekGroup.soCount <= 1 : weekGroup.soCount <= 0}
                                        onClick={() => handleAdjustBranchForWeek(weekGroup.week, 'so', -1)}
                                        className="w-5 h-5 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent font-black text-xs transition cursor-pointer"
                                        title={weekGroup.hasPeriodicExam ? "Giảm 1 tiết Số (tối thiểu 1 tiết trong tuần kiểm tra)" : "Giảm 1 tiết Số (đẩy về tuần sau, kéo 1 tiết Hình lên)"}
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        disabled={weekGroup.hasPeriodicExam ? weekGroup.soCount >= 3 : weekGroup.soCount >= 4}
                                        onClick={() => handleAdjustBranchForWeek(weekGroup.week, 'so', +1)}
                                        className="w-5 h-5 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent font-black text-xs transition cursor-pointer"
                                        title={weekGroup.hasPeriodicExam ? "Tăng 1 tiết Số (tối đa 3 tiết trong tuần kiểm tra)" : "Tăng 1 tiết Số (kéo 1 tiết Số từ tuần sau lên, đẩy 1 tiết Hình về sau)"}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Nội dung Cột Số (Chỉ hiển thị các bài dạy thông thường, 2 tiết kiểm tra 90 phút ghép thành 1 thẻ lớn phía dưới) */}
                                <div className="p-2.5 space-y-2.5 flex-1">
                                  {(() => {
                                    const regularSoEntries = weekGroup.soEntries.filter(e => !isPeriodicExamEntry(e).isExam);
                                    return regularSoEntries.length > 0 ? (
                                      regularSoEntries.map((entry, idxInBranch) => {
                                        const isSelected = state.khbd.lessonName.includes(entry.lessonName.split('(')[0].trim());
                                        const isBeingDragged = draggedEntry?.id === entry.id;
                                        const isSystemCurrentWeek = weekGroup.week === currentSystemWeek;
                                        const branchColor = entry.branch === 'Thống kê & Xác suất' 
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                          : 'bg-blue-100 text-blue-800 border-blue-200';
                                        const { mainTitle, periodSubtitle } = splitLessonTitle(entry.lessonName);
                                        const formattedMainTitle = ensureLessonTitleHasPeriodCount(mainTitle, entry.periodsCount || 1);
                                        const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;

                                        return (
                                          <div
                                            key={entry.id}
                                            draggable={true}
                                            onDragStart={(e) => handleDragStart(e, entry)}
                                            onDragEnd={() => {
                                              setDraggedEntry(null);
                                              setDragOverWeek(null);
                                            }}
                                            onClick={() => handleSelectLesson(entry)}
                                            className={`p-3 rounded-xl border transition cursor-pointer text-left flex flex-col justify-between group shadow-2xs ${
                                              isBeingDragged
                                                ? 'opacity-40 border-dashed border-indigo-500 scale-95'
                                                : isSelected
                                                ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-300'
                                                : 'bg-white border-blue-200/80 hover:border-blue-400 hover:shadow-xs'
                                            }`}
                                          >
                                            <div>
                                              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                  {/* Nút bấm LÊN / XUỐNG di chuyển riêng cho phân môn Số */}
                                                  <div className="flex items-center bg-slate-100 hover:bg-slate-200/90 border border-slate-300 rounded-lg p-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                      type="button"
                                                      disabled={entry.week <= 1 && idxInBranch === 0}
                                                      onClick={() => handleMoveBranchEntry(entry, 'up')}
                                                      className="p-1 rounded hover:bg-blue-600 hover:text-white text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition cursor-pointer"
                                                      title={idxInBranch === 0 ? "Đẩy tiết Số này lên tuần trước (tự động hoán đổi 1 tiết Hình xuống để giữ 4 tiết)" : "Di chuyển tiết Số này LÊN trước"}
                                                    >
                                                      <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      disabled={entry.week >= 35 && idxInBranch >= regularSoEntries.length - 1}
                                                      onClick={() => handleMoveBranchEntry(entry, 'down')}
                                                      className="p-1 rounded hover:bg-blue-600 hover:text-white text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition cursor-pointer"
                                                      title={idxInBranch >= regularSoEntries.length - 1 ? "Đẩy tiết Số này xuống tuần sau (tự động kéo 1 tiết Hình lên để giữ 4 tiết)" : "Di chuyển tiết Số này XUỐNG sau"}
                                                    >
                                                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                                                    </button>
                                                  </div>

                                                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-blue-950 text-white shadow-2xs">
                                                    {entry.branch === 'Thống kê & Xác suất' ? `Thống kê: Tiết ${entry.periodNumber}` : `Số: Tiết ${entry.periodNumber}`}
                                                  </span>

                                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${branchColor}`}>
                                                    {entry.branch}
                                                  </span>

                                                  {entry.periodsCount > 1 && (
                                                    <span className="text-[10px] text-blue-800 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                                      Bài {entry.periodsCount} tiết
                                                    </span>
                                                  )}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setEditingCurriculumEntry(entry);
                                                      setIsEditCurriculumModalOpen(true);
                                                    }}
                                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                                    title="Chỉnh sửa tên bài, quy định Tiết 1 / Tiết 2 hoặc đổi tuần"
                                                  >
                                                    <Edit3 className="w-3 h-3 text-amber-600" />
                                                    <span>Sửa bài</span>
                                                  </button>

                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleRequestDeleteLesson(entry);
                                                    }}
                                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                                    title="Xóa tiết hoặc toàn bộ bài này khỏi PPCT (nếu 2 tiết xóa cả hai)"
                                                  >
                                                    <Trash2 className="w-3 h-3 text-rose-600" />
                                                    <span>Xóa</span>
                                                  </button>

                                                  {isSystemCurrentWeek && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-2xs flex items-center gap-1 shrink-0">
                                                      Đang diễn ra
                                                    </span>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="space-y-1.5 my-1">
                                                <div className="text-xs font-black leading-snug text-slate-900">
                                                  {formattedMainTitle}
                                                </div>
                                                {formattedSubtitle && (
                                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-[11px] font-sans shadow-2xs bg-blue-50 text-blue-900 border border-blue-200">
                                                    <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0 bg-blue-600"></span>
                                                    <span>{formattedSubtitle}</span>
                                                  </div>
                                                )}
                                              </div>

                                              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                                {entry.chapter}
                                              </div>
                                            </div>

                                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                              <span className="text-slate-500 truncate max-w-[65%]">
                                                {entry.digitalCompetency ? (
                                                  <span className="text-slate-600 font-medium">NLS: {entry.digitalCompetency.split(':')[0]}</span>
                                                ) : (
                                                  <span>Mã NL: {entry.aiRoleCode || '9.A3.1'}</span>
                                                )}
                                              </span>
                                              <span className={`font-bold shrink-0 flex items-center gap-1 transition ${
                                                customCurriculum.length !== 140
                                                  ? 'text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200'
                                                  : isSelected 
                                                  ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300' 
                                                  : 'text-blue-600 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200/60'
                                              }`}>
                                                {customCurriculum.length !== 140
                                                  ? '⚠️ Cần đúng 140 tiết'
                                                  : isSelected
                                                  ? '✓ Đang chọn • Nạp sang Bước 4 →'
                                                  : 'Nạp bài & Soạn ở Bước 4 →'}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="p-4 rounded-xl border border-dashed border-blue-300 bg-white/80 text-center space-y-2 py-6">
                                        <div className="text-xs font-bold text-slate-700">
                                          Tuần {weekGroup.week}: 0 tiết Số bài mới {weekGroup.hasPeriodicExam ? '(Dành trọn cho Hình học & 2 tiết kiểm tra định kỳ 90 phút)' : '(Đã chuyển 4 tiết cho Hình học)'}
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                          {weekGroup.hasPeriodicExam 
                                            ? 'Bấm nút "+" để tăng lên 1 hoặc 2 tiết dạy Số trong tuần này.' 
                                            : 'Bấm nút dưới để kéo 1 tiết Số từ tuần sau lên tuần này.'}
                                        </p>
                                        <button
                                          type="button"
                                          disabled={weekGroup.hasPeriodicExam ? weekGroup.soCount >= 3 : weekGroup.soCount >= 4}
                                          onClick={() => handleAdjustBranchForWeek(weekGroup.week, 'so', +1)}
                                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer inline-flex items-center gap-1"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                          <span>+ Kéo 1 tiết Số lên tuần này</span>
                                        </button>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>

                              {/* ===== CỘT 2: PHÂN MÔN HÌNH HỌC ===== */}
                              <div className="rounded-2xl border border-purple-200/90 bg-purple-50/20 overflow-hidden shadow-2xs flex flex-col">
                                {/* Header Cột Hình */}
                                <div className="p-2.5 px-3 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between gap-2 shadow-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-black">
                                      <Shapes className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-black tracking-wide">
                                        PHÂN MÔN HÌNH HỌC & ĐO LƯỜNG
                                      </div>
                                      <div className="text-[10px] text-purple-200 font-semibold tracking-wide">
                                        Tuần {weekGroup.week}: {weekGroup.hinhRange}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full bg-white text-purple-950 text-xs font-black shadow-2xs">
                                      {weekGroup.hinhCount} tiết
                                    </span>
                                    {/* Nút tăng / giảm tiết Hình */}
                                    <div className="flex items-center bg-black/20 rounded-lg p-0.5">
                                      <button
                                        type="button"
                                        disabled={weekGroup.hasPeriodicExam ? weekGroup.hinhCount <= 1 : weekGroup.hinhCount <= 0}
                                        onClick={() => handleAdjustBranchForWeek(weekGroup.week, 'hinh', -1)}
                                        className="w-5 h-5 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent font-black text-xs transition cursor-pointer"
                                        title={weekGroup.hasPeriodicExam ? "Giảm 1 tiết Hình (tối thiểu 1 tiết trong tuần kiểm tra)" : "Giảm 1 tiết Hình (đẩy về tuần sau, kéo 1 tiết Số lên)"}
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        disabled={weekGroup.hasPeriodicExam ? weekGroup.hinhCount >= 3 : weekGroup.hinhCount >= 4}
                                        onClick={() => handleAdjustBranchForWeek(weekGroup.week, 'hinh', +1)}
                                        className="w-5 h-5 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent font-black text-xs transition cursor-pointer"
                                        title={weekGroup.hasPeriodicExam ? "Tăng 1 tiết Hình (tối đa 3 tiết trong tuần kiểm tra)" : "Tăng 1 tiết Hình (kéo 1 tiết Hình từ tuần sau lên, đẩy 1 tiết Số về sau)"}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Nội dung Cột Hình (Chỉ hiển thị các bài dạy thông thường, 2 tiết kiểm tra 90 phút ghép thành 1 thẻ lớn phía dưới) */}
                                <div className="p-2.5 space-y-2.5 flex-1">
                                  {(() => {
                                    const regularHinhEntries = weekGroup.hinhEntries.filter(e => !isPeriodicExamEntry(e).isExam);
                                    return regularHinhEntries.length > 0 ? (
                                      regularHinhEntries.map((entry, idxInBranch) => {
                                        const isSelected = state.khbd.lessonName.includes(entry.lessonName.split('(')[0].trim());
                                        const isBeingDragged = draggedEntry?.id === entry.id;
                                        const isSystemCurrentWeek = weekGroup.week === currentSystemWeek;
                                        const branchColor = 'bg-purple-100 text-purple-800 border-purple-200';
                                        const { mainTitle, periodSubtitle } = splitLessonTitle(entry.lessonName);
                                        const formattedMainTitle = ensureLessonTitleHasPeriodCount(mainTitle, entry.periodsCount || 1);
                                        const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;

                                        return (
                                          <div
                                            key={entry.id}
                                            draggable={true}
                                            onDragStart={(e) => handleDragStart(e, entry)}
                                            onDragEnd={() => {
                                              setDraggedEntry(null);
                                              setDragOverWeek(null);
                                            }}
                                            onClick={() => handleSelectLesson(entry)}
                                            className={`p-3 rounded-xl border transition cursor-pointer text-left flex flex-col justify-between group shadow-2xs ${
                                              isBeingDragged
                                                ? 'opacity-40 border-dashed border-indigo-500 scale-95'
                                                : isSelected
                                                ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-300'
                                                : 'bg-white border-purple-200/80 hover:border-purple-400 hover:shadow-xs'
                                            }`}
                                          >
                                            <div>
                                              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                  {/* Nút bấm LÊN / XUỐNG di chuyển riêng cho phân môn Hình */}
                                                  <div className="flex items-center bg-slate-100 hover:bg-slate-200/90 border border-slate-300 rounded-lg p-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                      type="button"
                                                      disabled={entry.week <= 1 && idxInBranch === 0}
                                                      onClick={() => handleMoveBranchEntry(entry, 'up')}
                                                      className="p-1 rounded hover:bg-purple-700 hover:text-white text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition cursor-pointer"
                                                      title={idxInBranch === 0 ? "Đẩy tiết Hình này lên tuần trước (tự động hoán đổi 1 tiết Số xuống để giữ 4 tiết)" : "Di chuyển tiết Hình này LÊN trước"}
                                                    >
                                                      <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      disabled={entry.week >= 35 && idxInBranch >= regularHinhEntries.length - 1}
                                                      onClick={() => handleMoveBranchEntry(entry, 'down')}
                                                      className="p-1 rounded hover:bg-purple-700 hover:text-white text-slate-700 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition cursor-pointer"
                                                      title={idxInBranch >= regularHinhEntries.length - 1 ? "Đẩy tiết Hình này xuống tuần sau (tự động kéo 1 tiết Số lên để giữ 4 tiết)" : "Di chuyển tiết Hình này XUỐNG sau"}
                                                    >
                                                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                                                    </button>
                                                  </div>

                                                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-purple-950 text-white shadow-2xs">
                                                    {`Hình: Tiết ${entry.periodNumber}`}
                                                  </span>

                                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${branchColor}`}>
                                                    {entry.branch}
                                                  </span>

                                                  {entry.periodsCount > 1 && (
                                                    <span className="text-[10px] text-purple-800 font-bold bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                                                      Bài {entry.periodsCount} tiết
                                                    </span>
                                                  )}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setEditingCurriculumEntry(entry);
                                                      setIsEditCurriculumModalOpen(true);
                                                    }}
                                                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                                    title="Chỉnh sửa tên bài, quy định Tiết 1 / Tiết 2 hoặc đổi tuần"
                                                  >
                                                    <Edit3 className="w-3 h-3 text-amber-600" />
                                                    <span>Sửa bài</span>
                                                  </button>

                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleRequestDeleteLesson(entry);
                                                    }}
                                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                                    title="Xóa tiết hoặc toàn bộ bài này khỏi PPCT (nếu 2 tiết xóa cả hai)"
                                                  >
                                                    <Trash2 className="w-3 h-3 text-rose-600" />
                                                    <span>Xóa</span>
                                                  </button>

                                                  {isSystemCurrentWeek && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-2xs flex items-center gap-1 shrink-0">
                                                      Đang diễn ra
                                                    </span>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="space-y-1.5 my-1">
                                                <div className="text-xs font-black leading-snug text-slate-900">
                                                  {formattedMainTitle}
                                                </div>
                                                {formattedSubtitle && (
                                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-[11px] font-sans shadow-2xs bg-purple-50 text-purple-900 border border-purple-200">
                                                    <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0 bg-purple-600"></span>
                                                    <span>{formattedSubtitle}</span>
                                                  </div>
                                                )}
                                              </div>

                                              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                                                {entry.chapter}
                                              </div>
                                            </div>

                                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                              <span className="text-slate-500 truncate max-w-[65%]">
                                                {entry.digitalCompetency ? (
                                                  <span className="text-slate-600 font-medium">NLS: {entry.digitalCompetency.split(':')[0]}</span>
                                                ) : (
                                                  <span>Mã NL: {entry.aiRoleCode || '9.A3.1'}</span>
                                                )}
                                              </span>
                                              <span className={`font-bold shrink-0 flex items-center gap-1 transition ${
                                                customCurriculum.length !== 140
                                                  ? 'text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200'
                                                  : isSelected 
                                                  ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300' 
                                                  : 'text-purple-700 hover:text-purple-900 bg-purple-50/70 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200/60'
                                              }`}>
                                                {customCurriculum.length !== 140
                                                  ? '⚠️ Cần đúng 140 tiết'
                                                  : isSelected
                                                  ? '✓ Đang chọn • Nạp sang Bước 4 →'
                                                  : 'Nạp bài & Soạn ở Bước 4 →'}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="p-4 rounded-xl border border-dashed border-purple-300 bg-white/80 text-center space-y-2 py-6">
                                        <div className="text-xs font-bold text-slate-700">
                                          Tuần {weekGroup.week}: 0 tiết Hình bài mới {weekGroup.hasPeriodicExam ? '(Dành trọn cho Số học & 2 tiết kiểm tra định kỳ 90 phút)' : '(Đã chuyển 4 tiết cho Số học)'}
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                          {weekGroup.hasPeriodicExam 
                                            ? 'Bấm nút "+" để tăng lên 1 hoặc 2 tiết dạy Hình trong tuần này.' 
                                            : 'Bấm nút dưới để kéo 1 tiết Hình từ tuần sau lên tuần này.'}
                                        </p>
                                        <button
                                          type="button"
                                          disabled={weekGroup.hasPeriodicExam ? weekGroup.hinhCount >= 3 : weekGroup.hinhCount >= 4}
                                          onClick={() => handleAdjustBranchForWeek(weekGroup.week, 'hinh', +1)}
                                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 disabled:hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer inline-flex items-center gap-1"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                          <span>+ Kéo 1 tiết Hình lên tuần này</span>
                                        </button>
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>

                            {/* THẺ BÀI KIỂM TRA ĐỊNH KỲ 90 PHÚT (2 TIẾT LIỀN GHÉP THÀNH 1 CỘT LỚN NẰM DƯỚI 2 CỘT ĐẠI SỐ & HÌNH HỌC THEO ĐÚNG ẢNH MINH HỌA) */}
                            {weekGroup.hasPeriodicExam && (weekGroup.primaryExamEntry || weekGroup.examSoEntry || weekGroup.examHinhEntry) && (() => {
                              const isPassed = isExamPassed(weekGroup.week);
                              const examEntry = weekGroup.primaryExamEntry || weekGroup.examSoEntry || weekGroup.examHinhEntry!;
                              const isSelected = state.khbd.lessonName.includes(examEntry.lessonName.split('(')[0].trim());
                              const examSeason = weekGroup.examName ? weekGroup.examName.toUpperCase() : (weekGroup.week <= 10 ? 'GIỮA KỲ 1' : weekGroup.week <= 18 ? 'CUỐI KỲ 1' : weekGroup.week <= 28 ? 'GIỮA KỲ 2' : 'CUỐI NĂM');

                              // Lấy chính xác số tiết của 2 nhánh
                              const soP = weekGroup.examSoEntry?.periodNumber ?? 18;
                              const hinhP = weekGroup.examHinhEntry?.periodNumber ?? 18;

                              return (
                                <div
                                  onClick={() => handleSelectLesson(examEntry)}
                                  className={`rounded-2xl border-2 transition cursor-pointer text-left overflow-hidden shadow-sm group ${
                                    isPassed
                                      ? (isSelected
                                          ? 'bg-slate-100 border-slate-500 shadow-md ring-2 ring-slate-300'
                                          : 'bg-slate-100/90 border-slate-300 hover:border-slate-400')
                                      : (isSelected
                                          ? 'bg-rose-50/95 border-rose-600 shadow-md ring-2 ring-rose-400'
                                          : 'bg-gradient-to-br from-rose-50/70 via-white to-red-50/40 border-rose-500 hover:border-rose-600')
                                  }`}
                                >
                                  {/* Header đỏ rực rỡ (khi chưa tới) hoặc xám dịu (khi đã qua) */}
                                  <div className={`p-2.5 px-4 flex items-center justify-between text-white font-black text-xs shadow-xs ${
                                    isPassed ? 'bg-slate-600' : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700'
                                  }`}>
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2.5 h-2.5 rounded-full ${isPassed ? 'bg-slate-300' : 'bg-white animate-ping'}`} />
                                      <span className="tracking-wide">
                                        {isPassed ? '⚪' : '🔴'} BÀI KIỂM TRA ĐỊNH KỲ {examSeason} (90 PHÚT)
                                      </span>
                                    </div>
                                    <span className="text-[10px] bg-black/25 px-2.5 py-0.5 rounded-md font-bold tracking-wide">
                                      2 tiết liền (90 phút)
                                    </span>
                                  </div>

                                  {/* Thân thẻ kiểm tra 2 tiết nhập làm 1 */}
                                  <div className="p-3.5 sm:p-4 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md">
                                          Đánh giá định kỳ 90p
                                        </span>
                                        <span className="text-[11px] font-medium text-slate-500">
                                          Khảo sát tập trung 90 phút (2 tiết liền)
                                        </span>
                                      </div>

                                      {/* Các nút thao tác Sửa bài & Xóa */}
                                      <div className="flex items-center gap-1.5 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingCurriculumEntry(examEntry);
                                            setIsEditCurriculumModalOpen(true);
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                          title="Chỉnh sửa thông tin bài kiểm tra"
                                        >
                                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                                          <span>Sửa bài</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRequestDeleteLesson(examEntry)}
                                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                          title="Xóa bài kiểm tra này khỏi phân phối"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                          <span>Xóa</span>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Tiêu đề bài kiểm tra: thể hiện rõ (2 tiết) theo đúng nét bút xanh người dùng viết */}
                                    <div>
                                      {(() => {
                                        const rawTitle = weekGroup.examTitle || 'Kiểm tra đánh giá giữa Học kì 1';
                                        const cleanTitle = rawTitle
                                          .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
                                          .replace(/\s*\(\s*2\s*tiết\s*\)$/i, '')
                                          .trim();
                                        return (
                                          <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                                            {cleanTitle} (2 tiết)
                                          </h4>
                                        );
                                      })()}
                                      <p className="text-xs text-slate-600 mt-1">
                                        Khảo sát toàn diện kiến thức & năng lực Toán học (Đại số, Hình học và Thống kê) • Thời gian làm bài: 90 phút (2 tiết liền).
                                      </p>
                                    </div>

                                    {/* Chân thẻ: NLS & Nút Nạp bài sang Bước 4 */}
                                    <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                                      <div className="flex items-center gap-2 text-slate-600 truncate">
                                        <span className="font-semibold text-slate-700">
                                          {examEntry.digitalCompetency ? `NLS: ${examEntry.digitalCompetency.split(':')[0]}` : `Mã NL: ${examEntry.aiRoleCode || '9.A3.1'}`}
                                        </span>
                                        <span className="hidden sm:inline text-slate-400">•</span>
                                        <span className="hidden sm:inline text-slate-500">Chuẩn hóa ma trận & bản đặc tả CV 5512 / TT 22</span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectLesson(examEntry);
                                        }}
                                        className={`px-4 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                          isSelected
                                            ? 'bg-emerald-600 text-white shadow-emerald-200'
                                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                                        }`}
                                      >
                                        <span>{isSelected ? '✓ Đang chọn bài này' : 'Nạp bài & Soạn ở Bước 4 →'}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              ← Quay lại Bước 2: Thông tin giáo viên
            </button>

            <button
              disabled={customCurriculum.length !== 140}
              onClick={() => {
                if (customCurriculum.length !== 140) {
                  setUploadSuccessToast(
                    `⚠️ CẢNH BÁO: Phân phối chương trình hiện có ${customCurriculum.length} tiết (chuẩn quy định là 140 tiết). Bạn cần điều chỉnh lại đúng 140 tiết mới có thể tiếp tục soạn thảo KHBD!`
                  );
                  setTimeout(() => setUploadSuccessToast(null), 5000);
                  return;
                }
                setCurrentStep(4);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 ${
                customCurriculum.length !== 140
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              }`}
            >
              <span>
                {customCurriculum.length !== 140
                  ? `⚠️ Chưa thể soạn KHBD: PPCT ${customCurriculum.length}/140 tiết (Cần đúng 140 tiết)`
                  : 'Chuyển sang Bước 4: Prompt Master, Tài Nguyên & Xuất Bản KHBD'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          BƯỚC 4: PROMPT MASTER, TÀI NGUYÊN MẪU & XUẤT BẢN KHBD (TẠO / PUBLISH)
          ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* HEADER & THÔNG TIN TIẾT BÀI DẠY (GỌN GÀNG, KẾT HỢP TINH TẾ) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      BƯỚC 4: BIÊN SOẠN & XUẤT BẢN KHBD
                    </h3>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {state.khbd.grade} • Lớp: {state.khbd.className || '9/1, 9/2'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Tạo KHBD theo <strong>1 Prompt gốc</strong> • Tích hợp <strong>tài nguyên đưa vào bài</strong> • Bám sát <strong>KHBD tham khảo</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                  title="Quay lại Bước 3 để chọn bài dạy khác từ PPCT"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Đổi bài từ PPCT</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublishWithMasterPrompt}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                  title="Bấm để hệ thống biên soạn và xuất bản Kế hoạch bài dạy"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tạo / Publish KHBD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thông tin bài dạy đã tự động nạp từ Bước 3 */}
            <div className="p-2.5 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
              <div className="space-y-1 min-w-0">
                {(() => {
                  const { mainTitle, periodSubtitle } = splitLessonTitle(state.khbd.lessonName);
                  const formattedMainTitle = ensureLessonTitleHasPeriodCount(mainTitle, state.khbd.periodsCount || 1);
                  const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;
                  return (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider shrink-0">Bài dạy:</span>
                        <h4 className="text-xs sm:text-sm font-black text-blue-950 leading-snug">
                          {formattedMainTitle}
                        </h4>
                      </div>
                      {formattedSubtitle && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold text-xs shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                          <span>{formattedSubtitle}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <p className="text-[11px] text-slate-500 truncate">
                  {state.khbd.chapter || 'Chương trình GDPT 2018 môn Toán'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap shrink-0 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-bold">
                  {state.khbd.curriculumRef?.branch ? `${state.khbd.curriculumRef.branch}: ` : ''}Tiết {state.khbd.curriculumRef?.period || state.khbd.currentPeriod || 1} (Tuần {state.khbd.curriculumRef?.week || 1})
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                  Thời lượng: {state.khbd.periodsCount || 1} tiết
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  {state.khbd.curriculumRef?.digitalCompetency 
                    ? `NLS: ${state.khbd.curriculumRef.digitalCompetency.split(':')[0]}` 
                    : 'Tích hợp NLS & AI (QĐ 2422)'}
                </span>
              </div>
            </div>
          </div>

          {/* 1. MỤC PROMPT GỐC: GOM GỌN GÀNG DUY NHẤT 1 HÀNG - GIẢI THÍCH CHI TIẾT QUA POPUP */}
          <div className="bg-slate-50 hover:bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs transition">
            {/* Vế trái: Badge + Thông tin file Prompt + Nút mở popup giải thích */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="px-2.5 py-1 bg-indigo-600 text-white font-black text-xs rounded-lg shadow-2xs shrink-0 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>PROMPT GỐC</span>
              </span>

              {masterPromptFile ? (
                <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                  <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                    masterPromptFile.type === 'PDF' ? 'bg-rose-100 text-rose-700' :
                    masterPromptFile.type === 'DOCX' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {masterPromptFile.type === 'DOCX' ? 'DOC' : masterPromptFile.type}
                  </span>
                  <span 
                    onClick={() => handleViewOriginalFile(masterPromptFile)}
                    className="font-bold text-xs text-slate-900 truncate max-w-[180px] sm:max-w-xs md:max-w-md hover:text-indigo-600 cursor-pointer"
                    title={masterPromptFile.name}
                  >
                    {masterPromptFile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">({masterPromptFile.size})</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0 hidden md:inline-flex items-center gap-0.5 border border-emerald-200">
                    ✓ Đang kích hoạt
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic truncate">
                  Chưa nạp Prompt gốc. Bấm tải lên hoặc nạp mẫu chuẩn.
                </span>
              )}

              {/* Nút Popup giải thích chi li (Không bỏ - hiển thị dạng popup khi tương tác) */}
              <button
                type="button"
                onClick={() => setShowPromptInfoModal(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 text-[11px] font-semibold border border-indigo-200 transition cursor-pointer shrink-0 ml-auto sm:ml-1"
                title="Bấm để xem giải thích chi tiết quy định 1 Prompt gốc & căn cứ 5512, GDPT 2018, QĐ 2422"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Quy định & Giải thích</span>
              </button>
            </div>

            {/* Vế phải: Các nút thao tác nhanh trên cùng 1 hàng */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              {masterPromptFile ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleViewOriginalFile(masterPromptFile)}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    title="Xem file gốc nguyên bản"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>File gốc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadDirectFile(masterPromptFile)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs active:scale-95"
                    title="Tải liền file prompt này về máy tính"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteMasterPromptFile}
                    className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                    title="Xóa file prompt gốc này để đổi prompt khác"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </>
              ) : (
                <>
                  <label
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
                    title="Tải file Prompt gốc (.docx, .pdf, .md, .txt)"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải file Prompt</span>
                    <input
                      type="file"
                      accept=".docx,.doc,.pdf,.md,.txt,.prompt,.json"
                      onChange={(e) => handleUploadMasterPromptFile(e.target.files)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRestoreDefaultMasterPrompt}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                    title="Nạp Prompt Master mẫu chuẩn Bộ GD&ĐT"
                  >
                    <span>Mẫu BGD&ĐT</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 2. KHU VỰC TÀI NGUYÊN BÀI GIẢNG: CHIA LÀM 2 PHẦN RÕ RÀNG, CÂN ĐỐI */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
            
            {/* PHẦN TRÊN: CHIA 2 CỘT
                - CỘT TRÁI: Tài nguyên đưa vào bài (ảnh .png, .jpg, file word .docx, pdf, excel .xlsx, pptx...). AI sẽ trích xuất và tích hợp trực tiếp vào các hoạt động dạy học.
                - CỘT PHẢI: KHBD tham khảo: (bám sát KHBD) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
              
              {/* CỘT TRÁI: TÀI NGUYÊN ĐƯA VÀO BÀI */}
              <div className="flex flex-col bg-slate-50/80 border border-slate-200 rounded-xl p-3 space-y-2 h-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      Tài nguyên đưa vào bài:
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">
                      ({lessonResources.length} tệp)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <label 
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer active:scale-95"
                      title="Tải lên tệp tài nguyên mới (hỗ trợ mọi định dạng)"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm tệp</span>
                      <input
                        type="file"
                        multiple
                        accept="*"
                        onChange={(e) => handleUploadLessonResources(e.target.files)}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleLoadDefaultLessonResources}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold transition border border-slate-300 shadow-2xs cursor-pointer"
                      title="Nạp bộ tài nguyên mẫu chuẩn"
                    >
                      <RotateCcw className="w-3 h-3 inline mr-0.5 text-slate-500" />
                      <span>Bộ mẫu</span>
                    </button>

                    {lessonResources.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllLessonResources}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold px-1 cursor-pointer"
                        title="Xóa tất cả tài nguyên đã nạp"
                      >
                        Xóa hết
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight">
                  (ảnh .png, .jpg, file word .docx, pdf, excel .xlsx, pptx...). AI sẽ trích xuất và tích hợp trực tiếp vào các hoạt động dạy học.
                </p>

                {/* Dropzone & List */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingResource(true); }}
                  onDragLeave={() => setIsDraggingResource(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingResource(false);
                    handleUploadLessonResources(e.dataTransfer.files);
                  }}
                  className={`p-2.5 rounded-xl border-2 border-dashed transition flex-1 flex flex-col justify-center min-h-[110px] ${
                    isDraggingResource ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-white'
                  }`}
                >
                  {lessonResources.length === 0 ? (
                    <div className="py-2.5 text-center text-xs text-slate-400 space-y-1">
                      <Paperclip className="w-4 h-4 mx-auto text-slate-400" />
                      <p className="text-[11px] font-medium text-slate-600">
                        Kéo thả hoặc bấm <strong>+ Thêm tệp</strong>
                      </p>
                      <p className="text-[9px] text-slate-400">Ảnh đồ thị, sơ đồ, công thức, đề bài tập, trang SGK...</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto p-0.5">
                      {lessonResources.map((file, idx) => {
                        const isImg = file.type === 'IMAGE' || !!file.name.match(/\.(png|jpe?g|svg|webp|gif|bmp)$/i) || (Boolean(file.dataUrl && file.dataUrl.startsWith('data:image/')));
                        const isDoc = file.type === 'DOCX' || file.name.endsWith('.docx') || file.name.endsWith('.doc');
                        const isPdf = file.type === 'PDF' || file.name.endsWith('.pdf');
                        const isXls = file.type === 'XLSX' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');

                        return (
                          <div 
                            key={idx}
                            className="group relative flex items-center gap-1.5 px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs shadow-2xs max-w-full"
                          >
                            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
                              {isImg ? (
                                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                              ) : isPdf ? (
                                <FileText className="w-3.5 h-3.5 text-rose-600" />
                              ) : isXls ? (
                                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </div>
                            <span 
                              onClick={() => handleViewOriginalFile(file)}
                              className="font-bold text-[11px] text-slate-800 truncate max-w-[130px] cursor-pointer hover:text-blue-600"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                            <span className="text-[9px] text-slate-400">({file.size})</span>
                            <div className="flex items-center gap-0.5 ml-1">
                              <button
                                type="button"
                                onClick={() => handleViewOriginalFile(file)}
                                className="w-4 h-4 rounded hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                                title="Xem tệp gốc"
                              >
                                <Eye className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLessonResource(idx)}
                                className="w-4 h-4 rounded hover:bg-rose-100 flex items-center justify-center text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Xóa tệp này"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT PHẢI: KHBD THAM KHẢO (BÁM SÁT KHBD THAM KHẢO) */}
              <div className="flex flex-col bg-emerald-50/40 border border-emerald-200 rounded-xl p-3 space-y-2 h-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      KHBD tham khảo: <span className="font-semibold text-emerald-800">(bám sát KHBD)</span>
                    </h4>
                  </div>

                  <span className="text-[10px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold border border-emerald-300 shrink-0">
                    ⭐ Bám sát bài tập
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight">
                  Hệ thống biên soạn bám sát 100% các bài tập, câu hỏi và tiến trình hoạt động của file KHBD tham khảo này.
                </p>

                {/* Content: Active File Card or Dropzone */}
                <div className="flex-1 flex flex-col justify-center min-h-[110px]">
                  {referenceKHBD ? (
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            referenceKHBD.type === 'PDF' ? 'bg-rose-100 text-rose-700' :
                            referenceKHBD.type === 'DOCX' ? 'bg-blue-100 text-blue-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {referenceKHBD.type === 'DOCX' ? 'DOC' : referenceKHBD.type}
                          </span>
                          <div className="min-w-0">
                            <div 
                              onClick={() => handleViewOriginalFile(referenceKHBD)}
                              className="font-bold text-xs text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                              title={referenceKHBD.name}
                            >
                              {referenceKHBD.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {referenceKHBD.size} • Đang bám sát bài tập
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleViewOriginalFile(referenceKHBD)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Xem nguyên bản KHBD tham khảo"
                          >
                            <Eye className="w-3 h-3" />
                            <span>File gốc</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadDirectFile(referenceKHBD)}
                            className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs active:scale-95"
                            title="Tải liền file KHBD tham khảo về máy tính"
                          >
                            <Download className="w-3 h-3" />
                            <span>Tải về</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteReferenceKHBD}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                            title="Xóa KHBD tham khảo"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-emerald-700 bg-emerald-50/70 px-2 py-1 rounded-md border border-emerald-100 font-medium">
                        ✓ AI sẽ lấy toàn bộ bài tập và mô hình từ file này vào KHBD mới.
                      </div>
                    </div>
                  ) : (
                    <label
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingRefKHBD(true); }}
                      onDragLeave={() => setIsDraggingRefKHBD(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingRefKHBD(false);
                        handleUploadReferenceKHBD(e.dataTransfer.files);
                      }}
                      className={`flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-xl cursor-pointer transition text-center ${
                        isDraggingRefKHBD 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                          : 'border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-emerald-700'
                      }`}
                      title="Kéo thả hoặc bấm để nạp KHBD tham khảo (.docx, .pdf, .md, .txt)"
                    >
                      <Upload className="w-4 h-4 text-emerald-600 mb-1" />
                      <span className="text-xs font-bold text-slate-800">
                        Tải lên KHBD tham khảo
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Hỗ trợ .docx, .pdf, .md, .txt • Soạn bám sát bài tập trong file
                      </span>
                      <input
                        type="file"
                        accept=".docx,.doc,.pdf,.md,.txt"
                        onChange={(e) => handleUploadReferenceKHBD(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

            </div>

            {/* PHẦN DƯỚI: NHẬP NHỮNG TÙY CHỈNH MONG MUỐN BẮT BUỘC 100% PHẢI TUÂN THỦ */}
            <div className="pt-2.5 border-t border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Nhập những tùy chỉnh mong muốn mà bắt buộc 100% phải tuân thủ:</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black">
                    Bắt buộc 100% tuân thủ
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  (Để trống nếu muốn chạy 100% bám theo Prompt gốc & KHBD tham khảo)
                </span>
              </div>

              <textarea
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Nhập những tùy chỉnh mong muốn mà hệ thống bắt buộc 100% phải tuân thủ (ví dụ: chú trọng các bài toán thực tiễn gắn với đời sống, thiết kế phiếu bài tập phân hóa 4 mức độ, phân bố thời gian hợp lý cho từng hoạt động...)..."
                className="w-full p-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-500 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-400 transition shadow-2xs"
              />

              {/* Hàng thanh trạng thái & Nút Tạo / Publish KHBD */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700">Đã sẵn sàng nạp:</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                    1 Prompt gốc
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                    {lessonResources.length} tài nguyên đưa vào bài
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    {referenceKHBD ? `1 KHBD tham khảo (${referenceKHBD.name})` : 'KHBD chuẩn BGDĐT'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handlePublishWithMasterPrompt}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer shrink-0"
                  title="Biên soạn Kế hoạch bài dạy"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tạo / Publish KHBD</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              ← Quay lại Bước 3: Môn & Bài dạy PPCT
            </button>
          </div>
        </div>
      )}

      {/* CẢNH BÁO: Xóa hết file trong PPCT thì tất cả bài nạp cũng sẽ mất hết theo và xóa luôn cả khối */}
      <PPCTDeleteWarningModal
        isOpen={showDeleteWarning}
        onClose={() => { 
          setShowDeleteWarning(false); 
          setItemPendingDelete(null); 
          setGradePendingDelete(null); 
        }}
        onConfirm={handleConfirmDeleteAll}
        targetFileName={itemPendingDelete ? itemPendingDelete.name : undefined}
        gradeName={gradePendingDelete || (state.khbd.grade as string)}
        isDeleteGrade={!!gradePendingDelete || ppctList.length <= 1}
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

      {/* MODAL XEM TRƯỚC FORM MỚI CẬP NHẬT KÈM VERSION */}
      <KHBDUpdatedPreviewModal
        isOpen={showPreviewUpdatedModal}
        onClose={() => setShowPreviewUpdatedModal(false)}
        khbd={state.khbd}
        versionTag={currentVersionTag}
        promptUsed={customPrompt}
        referenceFile={selectedRefFile}
      />

      {/* MODAL TỰ ĐỘNG NHẬN DIỆN KHỐI LỚP KHI NẠP TỆP */}
      <SmartGradeDetectionModal
        isOpen={showSmartGradeModal}
        onClose={() => {
          setShowSmartGradeModal(false);
          setPendingUpload(null);
        }}
        fileName={pendingUpload?.file.name || ''}
        detectedGrade={pendingUpload?.detectedGrade || 'Lớp 8'}
        currentGrade={state.khbd.grade}
        onConfirmSwitchAndSave={handleConfirmSwitchAndSave}
        onConfirmSaveToDetectedGradeOnly={handleConfirmSaveToDetectedGradeOnly}
        onConfirmKeepInCurrentGrade={handleConfirmKeepInCurrentGrade}
      />

      {/* MODAL QUẢN TRỊ HỒ SƠ GIẢNG DẠY ĐA KHỐI LỚP */}
      {showMultiGradeDashboard && (
        <React.Suspense fallback={null}>
          <TeacherMultiGradeDashboardModal
            isOpen={showMultiGradeDashboard}
            onClose={() => setShowMultiGradeDashboard(false)}
            activeGrade={state.khbd.grade}
            onSwitchGrade={(grade) => {
              setShowMultiGradeDashboard(false);
              handleSwitchGrade(grade);
            }}
            teacherName={state.khbd.teacherName || 'Giáo viên bộ môn'}
          />
        </React.Suspense>
      )}

      {/* MODAL BÁO LỖI TRÙNG LẶP PPCT / KHBD THEO KHỐI & XÁC NHẬN 2 CẤP ĐỘ GHI ĐÈ */}
      <KHBDConflictModal
        isOpen={showConflictModal}
        conflictType={conflictData?.targetType === 'ppct' ? 'ppct' : 'khbd'}
        onClose={() => {
          setShowConflictModal(false);
          setConflictData(null);
        }}
        onConfirmOverwrite={handleConfirmConflictOverwrite}
        targetGrade={conflictData?.targetGrade || (state.khbd.grade as string)}
        existingFiles={conflictData?.existingFiles || []}
        newFile={conflictData?.newFile || null}
      />

      {/* MODAL POPUP GIẢI THÍCH CHI TIẾT QUY ĐỊNH PROMPT GỐC */}
      {showPromptInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Quy Định & Giải Thích File Prompt Gốc</h4>
                  <p className="text-[11px] text-slate-400">Chuẩn hóa cấu trúc điều khiển biên soạn KHBD 5512</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptInfoModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-950">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Quy định bắt buộc: Chỉ nạp 1 File Prompt gốc duy nhất</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  Hệ thống khóa nạp thêm để đảm bảo tính nhất quán tuyệt đối. Toàn bộ tiến trình tạo KHBD sẽ bám sát 100% theo các chỉ dẫn sư phạm trong file prompt này.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Căn cứ pháp lý & Cấu trúc tích hợp:</span>
                </h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                  <li>Công văn 5512/BGDĐT-GDTrH về xây dựng kế hoạch bài dạy.</li>
                  <li>Chương trình GDPT 2018 môn Toán học (hình thành 5 phẩm chất, 10 năng lực).</li>
                  <li>Quyết định 2422/QĐ-BGDĐT về khung Năng lực số (NLS) và Trí tuệ nhân tạo (AI).</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>Cách thức thay đổi hoặc nạp lại:</span>
                </h5>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Để thay thế prompt khác, bạn chỉ cần bấm nút <strong className="text-rose-600 font-bold">Xóa</strong> ở dòng Prompt gốc, ô tải file sẽ mở ra ngay. Bạn cũng có thể bấm <strong>"Nạp mẫu chuẩn BGD&ĐT"</strong> bất cứ lúc nào.
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPromptInfoModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Đã hiểu quy định
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA BÀI HỌC, QUY ĐỊNH TIẾT 1, TIẾT 2 & ĐỔI TUẦN CÂN BẰNG */}
      {isEditCurriculumModalOpen && editingCurriculumEntry && (
        <EditCurriculumLessonModal
          isOpen={isEditCurriculumModalOpen}
          onClose={() => {
            setIsEditCurriculumModalOpen(false);
            setEditingCurriculumEntry(null);
          }}
          entry={editingCurriculumEntry}
          allEntries={customCurriculum}
          onSaveEntry={handleSaveCurriculumEntry}
          onDeleteRequest={(entry) => setEntryToDelete(entry)}
        />
      )}

      {/* MODAL TẠO MỚI BÀI DẠY / TIẾT HỌC (THEO ẢNH MINH HỌA) */}
      {isCreateLessonModalOpen && (
        <CreateCurriculumLessonModal
          isOpen={isCreateLessonModalOpen}
          onClose={() => setIsCreateLessonModalOpen(false)}
          targetWeek={createLessonTargetWeek}
          currentGrade={(state.khbd.grade as GradeLevel) || 'Lớp 9'}
          allEntries={customCurriculum}
          onCreateLesson={handleCreateLesson}
        />
      )}

      {/* MODAL XÁC NHẬN XÓA BÀI HỌC / TIẾT (HỖ TRỢ: "nếu 2 tiết thì xóa cả hai") */}
      {!!entryToDelete && (
        <DeleteCurriculumLessonModal
          isOpen={!!entryToDelete}
          onClose={() => setEntryToDelete(null)}
          entry={entryToDelete}
          allEntries={customCurriculum}
          onConfirmDelete={handleConfirmDeleteLesson}
        />
      )}

      {/* MODAL XÁC NHẬN LƯU & XUẤT PPCT (HỎI GHI ĐÈ HỆ THỐNG HAY XUẤT WORD .DOCX) */}
      {isSaveExportModalOpen && (
        <PPCTSaveExportConfirmModal
          isOpen={isSaveExportModalOpen}
          onClose={() => setIsSaveExportModalOpen(false)}
          entries={customCurriculum}
          currentGrade={(state.khbd.grade as GradeLevel) || 'Lớp 9'}
          onConfirmOverwrite={handleConfirmOverwritePPCT}
          onConfirmExportWord={handleConfirmExportWordPPCT}
          onConfirmBoth={handleConfirmBothPPCT}
        />
      )}

      {/* MODAL XÁC NHẬN XÓA FILE PPCT ĐƯỢC CẬP NHẬT MỚI & ĐANG LƯU HÀNH */}
      {showConfirmDeleteUpdatedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-rose-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Xác nhận xóa file PPCT</h3>
                  <p className="text-[11px] text-rose-100">Bản cập nhật mới</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmDeleteUpdatedModal(false)}
                className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <p>
                Thầy/Cô có chắc chắn muốn xóa file:
              </p>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl font-bold text-rose-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                <span>PPCT Được cập nhật mới & Đang lưu hành</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Lưu ý: File gốc nguyên bản vẫn được bảo toàn nguyên vẹn trong hệ thống.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDeleteUpdatedModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteUpdatedPPCT}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xác nhận xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
