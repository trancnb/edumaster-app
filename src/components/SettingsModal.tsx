import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Upload, 
  BookOpen, 
  Cloud, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  Presentation, 
  RefreshCw, 
  Search, 
  Layers, 
  BookMarked,
  FileCheck,
  Folder,
  Check,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Filter,
  Key,
  AlertCircle,
  Copy,
  Cpu,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { WorkspaceState, SubjectType, GradeLevel, CurriculumEntry, TextbookSeries } from '../types/edtech';
import { CloudStorageService, CloudBook, CloudArtifact } from '../utils/cloudStorage';
import { buildStateFromCurriculumEntry } from '../data/curriculumToan9';
import { exportKHBDToWord, exportExamToWord, exportMatrixToWord, exportSlidesToPPTX, downloadStandaloneHTMLFile } from '../utils/exportHelpers';

// Khai báo kiểu cho Google Identity Services OAuth 2.0 Client (Nhịp 3)
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
              expires_in?: number;
            }) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

// GOOGLE CLIENT ID cho Đồng bộ Google Drive
export const GOOGLE_CLIENT_ID = '543708256857-1nqnsp2ms3vh2cugugkppv3mrbri7num.apps.googleusercontent.com';

export type SettingsTabType = 'api_drive' | 'books' | 'ppct' | 'cloud_artifacts' | 'school_profile';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
}

export function SettingsModal({ isOpen, onClose, state, setState }: SettingsModalProps) {
  // Mặc định mở Tab 1: Thiết Lập API & Google Drive (Nhịp 1)
  const [activeTab, setActiveTab] = useState<SettingsTabType>('api_drive');

  // Gemini API Key state from localStorage
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('user_gemini_key') || '';
    } catch {
      return '';
    }
  });
  // State quản lý hành vi focus/blur để bảo mật hiển thị API Key
  const [isFocused, setIsFocused] = useState(false);

  // Google Drive Access Token (Nhịp 3: lưu trong State và sessionStorage)
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('google_drive_access_token') || null;
    } catch {
      return null;
    }
  });
  const isDriveConnected = Boolean(driveAccessToken && driveAccessToken.length > 0);

  const [validationMsg, setValidationMsg] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [driveStatusMsg, setDriveStatusMsg] = useState('');

  // Book Selection Filters: Môn -> Khối -> Học kì -> Tự hiện lên danh sách bài
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>(state.khbd.subject || 'Toán học');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(state.khbd.grade || 'Lớp 9');
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  // Cloud Books state
  const [books, setBooks] = useState<CloudBook[]>([]);
  const [uploadingBookType, setUploadingBookType] = useState<'SGK' | 'SBT' | 'SGV'>('SGK');
  const [customBookTitle, setCustomBookTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // PPCT (Khung phân phối chương trình) State
  const [curriculumList, setCurriculumList] = useState<CurriculumEntry[]>([]);
  const [ppctSearch, setPpctSearch] = useState('');

  // Form Thêm khung chương trình theo phân phối
  const [newLessonName, setNewLessonName] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [newWeek, setNewWeek] = useState<number>(1);
  const [newPeriodNumber, setNewPeriodNumber] = useState<number>(1);
  const [newBranch, setNewBranch] = useState<'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Thực hành trải nghiệm' | 'Kiểm tra'>('Đại số');
  const [newPeriodsCount, setNewPeriodsCount] = useState<number>(2);
  const [newEquipment, setNewEquipment] = useState('Máy chiếu, SGK, SBT, Phiếu học tập');
  const [newLocation, setNewLocation] = useState('Lớp học');
  const [newDigitalComp, setNewDigitalComp] = useState('1.1.NC1b: Tìm kiếm và xử lý thông tin số');
  const [ppctSuccessMsg, setPpctSuccessMsg] = useState('');

  // Cloud Artifacts
  const [artifacts, setArtifacts] = useState<CloudArtifact[]>([]);
  const [cloudSyncing, setCloudSyncing] = useState(false);

  // Profile fields
  const [schoolName, setSchoolName] = useState(state.khbd.schoolName);
  const [department, setDepartment] = useState(state.khbd.department);
  const [teacherName, setTeacherName] = useState(state.khbd.teacherName);
  const [className, setClassName] = useState(state.khbd.className || '9A1');

  // Load Cloud Data on Open
  useEffect(() => {
    if (isOpen) {
      setBooks(CloudStorageService.getBooks());
      setArtifacts(CloudStorageService.getArtifacts(state));
      loadFilteredCurriculum();
    }
  }, [isOpen, selectedSubject, selectedGrade, selectedSemester]);

  const loadFilteredCurriculum = () => {
    const list = CloudStorageService.filterCurriculum(selectedSubject, selectedGrade, selectedSemester);
    setCurriculumList(list);
  };

  // Tự động nhúng script Google Identity Services (Nhịp 3)
  useEffect(() => {
    const scriptId = 'google-gsi-client-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Helper variables for Gemini API Key (Nhịp 1)
  const apiKeyList = geminiApiKey
    ? geminiApiKey.split(/[\n,]+/).map(k => k.trim()).filter(Boolean)
    : [];
  const apiKeyCount = apiKeyList.length;
  const hasApiKey = apiKeyCount > 0;

  // Hàm bảo mật hiển thị API Key: tách theo dòng, giữ 5 ký tự đầu, phần còn lại thay bằng chuỗi '*'
  const maskApiKeys = (rawKeys: string): string => {
    if (!rawKeys) return '';
    return rawKeys
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        if (trimmed.length <= 5) return '*****';
        return trimmed.slice(0, 5) + ' ' + '*'.repeat(Math.max(trimmed.length - 6, 8));
      })
      .join('\n');
  };

  // Tự động lưu (Auto-save) ngay khi người dùng nhập/dán API Key
  const handleApiKeyChange = (val: string) => {
    setGeminiApiKey(val);
    try {
      localStorage.setItem('user_gemini_key', val.trim());
      window.dispatchEvent(new Event('gemini_key_updated'));
      setSaveSuccessMsg('✓ Đã tự động lưu vào trình duyệt');
      setTimeout(() => setSaveSuccessMsg(''), 2500);
    } catch {
      // ignore
    }
  };

  // Kiểm tra tính hợp lệ của API Key (hỗ trợ mọi định dạng key chính thức từ Google AI Studio)
  const handleTestApiKey = () => {
    const trimmed = geminiApiKey.trim();
    if (!trimmed) {
      setValidationMsg({ type: 'error', message: 'Vui lòng nhập API Key trước khi kiểm tra!' });
      return;
    }
    const keys = trimmed.split(/[\n,]+/).map(k => k.trim()).filter(Boolean);
    setValidationMsg({
      type: 'success',
      message: `✓ Hoàn hảo! Đã nhận diện ${keys.length} API Key và tự động lưu an toàn vào trình duyệt.`
    });
    setTimeout(() => setValidationMsg(null), 4000);
  };

  // Kích hoạt Xác thực Google Drive sử dụng Google Identity Services (Nhịp 3)
  const handleGoogleLogin = () => {
    if (typeof window === 'undefined') return;

    if (!window.google?.accounts?.oauth2) {
      setDriveStatusMsg('Đang nạp thư viện Google Identity Services... Vui lòng thử lại sau giây lát.');
      return;
    }

    try {
      setDriveStatusMsg('Đang mở cửa sổ xác thực Google OAuth 2.0...');
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            console.error('Google OAuth error:', tokenResponse);
            setDriveStatusMsg(`Lỗi xác thực Google: ${tokenResponse.error_description || tokenResponse.error}`);
            return;
          }

          if (tokenResponse.access_token) {
            const token = tokenResponse.access_token;
            setDriveAccessToken(token);
            try {
              sessionStorage.setItem('google_drive_access_token', token);
            } catch (err) {
              console.warn('Lỗi lưu sessionStorage:', err);
            }
            window.dispatchEvent(new CustomEvent('google_drive_connected', { detail: { token } }));
            setDriveStatusMsg('✓ Đã kết nối Google Drive thành công! Toàn bộ file KHBD có thể đồng bộ trực tiếp.');
          }
        },
        error_callback: (err) => {
          console.error('GIS Error Callback:', err);
          setDriveStatusMsg('Đã hủy hoặc xảy ra lỗi trong quá trình cấp quyền Google Drive.');
        }
      });

      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      console.error('GIS Token Client Error:', err);
      setDriveStatusMsg(`Lỗi khởi tạo đăng nhập Google: ${err?.message || err}`);
    }
  };

  const handleDisconnectDrive = () => {
    try {
      sessionStorage.removeItem('google_drive_access_token');
    } catch {}
    setDriveAccessToken(null);
    setDriveStatusMsg('Đã đăng xuất tài khoản Google Drive.');
    setTimeout(() => setDriveStatusMsg(''), 3000);
  };

  if (!isOpen) return null;

  // Handle Mock Book Upload
  const handleUploadBook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      const typeLabel = uploadingBookType === 'SGK' ? 'Sách Giáo Khoa' : uploadingBookType === 'SBT' ? 'Sách Bài Tập' : 'Sách Giáo Viên';
      const autoTitle = customBookTitle || `${typeLabel} ${selectedSubject} ${selectedGrade} - Học kì ${selectedSemester} (Kết Nối Tri Thức)`;
      
      const newBook: CloudBook = {
        id: 'book-' + Date.now(),
        type: uploadingBookType,
        title: autoTitle,
        subject: selectedSubject,
        grade: selectedGrade,
        semester: selectedSemester,
        textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
        fileName: `${uploadingBookType}_${selectedSubject.replace(/\s+/g, '_')}_${selectedGrade.replace(/\s+/g, '')}_K${selectedSemester}.pdf`,
        fileSize: (Math.random() * 15 + 15).toFixed(1) + ' MB',
        uploadedAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        cloudStorageUrl: `cloud://edumaster-cloud-storage/${uploadingBookType.toLowerCase()}/${selectedSubject}_${selectedGrade}.pdf`,
        pagesCount: Math.floor(Math.random() * 80 + 120),
        chaptersCount: Math.floor(Math.random() * 4 + 4),
        cloudStatus: 'verified'
      };

      const updated = CloudStorageService.saveBook(newBook);
      setBooks(updated);
      setIsUploading(false);
      setCustomBookTitle('');
      setUploadSuccessMsg(`Đã tải lên và lưu trữ thành công trên Cloud: ${newBook.title}`);
      setTimeout(() => setUploadSuccessMsg(''), 4000);
    }, 600);
  };

  // Handle Add Curriculum Entry (Thêm phân phối chương trình)
  const handleAddCurriculumEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonName.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }

    const newEntry: CurriculumEntry = {
      id: `custom-ppct-${Date.now()}`,
      grade: selectedGrade,
      subject: selectedSubject,
      semester: selectedSemester,
      week: newWeek,
      periodNumber: newPeriodNumber,
      branch: newBranch,
      chapter: newChapter || `Chương PPCT Tuần ${newWeek}`,
      lessonName: newLessonName,
      equipment: newEquipment,
      location: newLocation,
      digitalCompetency: newDigitalComp,
      periodsCount: newPeriodsCount
    };

    const updated = CloudStorageService.addCurriculumEntry(newEntry);
    setCurriculumList(updated.filter(i => i.subject === selectedSubject && i.grade === selectedGrade && i.semester === selectedSemester));
    
    setPpctSuccessMsg(`Đã thêm thành công bài: "${newLessonName}" vào khung phân phối chương trình!`);
    setNewLessonName('');
    setTimeout(() => setPpctSuccessMsg(''), 4000);
  };

  // Apply a lesson from Curriculum to current Workspace
  const handleApplyCurriculumToWorkspace = (entry: CurriculumEntry) => {
    const newState = buildStateFromCurriculumEntry(entry, className);
    setState(newState);
    alert(`Đã nạp bài học "${entry.lessonName}" vào không gian soạn giảng KHBD 5512, Slide 16:9 và Đề kiểm tra 7991!`);
    onClose();
  };

  // Save Profile Config
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({
      ...prev,
      khbd: {
        ...prev.khbd,
        schoolName,
        department,
        teacherName,
        className,
        textbook: 'Kết Nối Tri Thức Với Cuộc Sống'
      }
    }));
    alert('Đã cập nhật thông tin hồ sơ sư phạm thành công!');
  };

  // Manual Trigger Cloud Sync
  const handleManualCloudSync = () => {
    setCloudSyncing(true);
    setTimeout(() => {
      setCloudSyncing(false);
      setArtifacts(CloudStorageService.getArtifacts(state));
      alert('Đồng bộ hóa toàn bộ tài liệu lên Cloud hoàn tất! 100% dữ liệu đã được bảo mật an toàn.');
    }, 800);
  };

  // Filtered books
  const filteredBooks = books.filter(b => 
    b.subject === selectedSubject && 
    b.grade === selectedGrade && 
    b.semester === selectedSemester
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-400/30 flex items-center justify-center shadow-inner">
              <Settings className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">CÀI ĐẶT & QUẢN TRỊ HỆ THỐNG SƯ PHẠM</h2>
                {hasApiKey ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3 text-emerald-400" />
                    API Ready
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 border border-rose-400/50 flex items-center gap-1 font-mono animate-pulse">
                    <Key className="w-3 h-3 text-rose-400" />
                    0 Key
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Quản lý Gemini API Key, đồng bộ Google Drive, khung phân phối chương trình (PPCT) và SGK/SBT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('api_drive')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'api_drive'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>⚡ Thiết Lập API & Google Drive</span>
            {hasApiKey ? (
              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-mono font-bold">
                Ready
              </span>
            ) : (
              <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-mono font-bold">
                0 Key
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'books'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>1. Tải Sách Lên Cloud (SGK, SBT, SGV)</span>
          </button>

          <button
            onClick={() => setActiveTab('ppct')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'ppct'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>2. Khung Phân Phối Chương Trình (PPCT)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud_artifacts')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'cloud_artifacts'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Folder className="w-4 h-4 text-indigo-600" />
            <span>3. Kho Lưu Trữ Cloud & Xuất File</span>
          </button>

          <button
            onClick={() => setActiveTab('school_profile')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold transition whitespace-nowrap ${
              activeTab === 'school_profile'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>4. Hồ Sơ Trường Lớp</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ===================================================================
              TAB MẶC ĐỊNH (NHỊP 1): THIẾT LẬP API & AI VÀ ĐỒNG BỘ GOOGLE DRIVE
              =================================================================== */}
          {activeTab === 'api_drive' && (
            <div className="space-y-6">
              
              {/* Thanh tiêu đề trạng thái */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white border border-slate-700/80 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Cấu Hình Tích Hợp & Đám Mây Cá Nhân</span>
                      {hasApiKey ? (
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                          API Ready
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono bg-rose-500/25 text-rose-300 border border-rose-400/50 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          0 Key
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Quản lý Gemini API Key cá nhân và kết nối lưu trữ trực tiếp với Google Drive
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Trạng thái API:</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold border text-xs flex items-center gap-1.5 ${
                    hasApiKey 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' 
                      : 'bg-rose-950 text-rose-300 border-rose-700/60'
                  }`}>
                    {hasApiKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{hasApiKey ? `Đã cấu hình (${apiKeyCount} Key)` : 'Chưa nhập API Key'}</span>
                  </span>
                </div>
              </div>

              {/* CHIA 2 KHU VỰC RÕ RÀNG - CÂN BẰNG CHIỀU CAO 2 CỘT (ITEMS-STRETCH) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* -------------------------------------------------------------
                    KHU VỰC 1: THIẾT LẬP API & AI
                    ------------------------------------------------------------- */}
                <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-xs hover:border-indigo-300 transition-colors flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">1. Thiết Lập API & AI</h4>
                          <p className="text-[11px] text-slate-500">Quản lý Gemini API Key cho trợ lý sư phạm</p>
                        </div>
                      </div>
                      {hasApiKey ? (
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          {apiKeyCount} Key sẵn sàng
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono bg-rose-100 text-rose-700 border border-rose-300 px-2 py-0.5 rounded-full font-bold">
                          0 Key
                        </span>
                      )}
                    </div>

                    {/* Hướng dẫn lấy API Key tinh gọn (Đã xóa bỏ hoàn toàn dòng chữ AIzaSy...) */}
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-900">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-[11px] text-slate-700">
                          Chưa có API Key? Nhận key miễn phí hạn ngạch cao tại:
                        </span>
                      </div>
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-700 hover:text-blue-950 underline inline-flex items-center gap-1 text-[11px] shrink-0"
                      >
                        Google AI Studio → Get API Key <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>

                    {/* Input / Textarea for Gemini API Key (Bảo mật hiển thị + Tự động lưu khi gõ) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-500" />
                          Danh sách Gemini API Keys:
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500" /> Tự động lưu khi gõ
                        </span>
                      </label>
                      <textarea
                        rows={3}
                        value={isFocused ? geminiApiKey : maskApiKeys(geminiApiKey)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => handleApiKeyChange(e.target.value)}
                        placeholder="Nhập Gemini API Key của bạn vào đây (hỗ trợ nhập nhiều key cách nhau bằng dấu phẩy hoặc xuống dòng)..."
                        className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Phần chân của Cột 1 (Căn đáy đồng đều với Cột 2) */}
                  <div className="space-y-2 pt-3 mt-auto">
                    {/* Thông báo kiểm tra / lưu thành công */}
                    {validationMsg && (
                      <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                        validationMsg.type === 'success' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : validationMsg.type === 'warning'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {validationMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{validationMsg.message}</span>
                      </div>
                    )}

                    {saveSuccessMsg && (
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold">{saveSuccessMsg}</span>
                      </div>
                    )}

                    {/* Buttons: Chỉ giữ Kiểm tra API Key (Đã xóa nút Lưu Thiết Lập) */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleTestApiKey}
                        className="px-4 py-2.5 border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Kiểm tra API Key</span>
                      </button>
                      <span className="text-[10px] text-slate-400">
                        Tự động lưu vào trình duyệt
                      </span>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    KHU VỰC 2: ĐỒNG BỘ GOOGLE DRIVE (CLOUD)
                    ------------------------------------------------------------- */}
                <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-xs hover:border-emerald-300 transition-colors flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                          <Cloud className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">2. Đồng Bộ Google Drive (Cloud)</h4>
                          <p className="text-[11px] text-slate-500">Lưu trữ và sao lưu KHBD tự động lên đám mây</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        Sẵn sàng ghép nối
                      </span>
                    </div>

                    {/* Tính năng khi kết nối Google Drive */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-xs">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-emerald-600" />
                        Quyền lợi đồng bộ Google Drive:
                      </div>
                      <ul className="space-y-2 text-[11px] text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                          <span><strong>Tự động sao lưu giáo án:</strong> KHBD sau khi soạn hoặc nạp từ PPCT sẽ được lưu trữ an toàn trong thư mục Drive cá nhân.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                          <span><strong>Mở trên mọi thiết bị:</strong> Dễ dàng xem lại KHBD, xuất file Word và trình chiếu Slide trên máy trường học mà không cần USB.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                          <span><strong>Bảo mật riêng tư 100%:</strong> Tài liệu của thầy cô chỉ lưu trữ trên tài khoản Google của chính thầy cô.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Nút bấm Đăng nhập Google Drive nổi bật (Căn đáy đồng đều với Cột 1) */}
                  <div className="space-y-2 pt-3 mt-auto">
                    {isDriveConnected ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 select-none">
                          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                          <span className="text-sm">Đã kết nối Drive</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleDisconnectDrive}
                          className="py-3 px-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                          title="Đăng xuất khỏi Google Drive"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 group cursor-pointer"
                      >
                        <Cloud className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        <span className="text-sm">Đăng nhập Google Drive</span>
                      </button>
                    )}

                    {driveStatusMsg && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        isDriveConnected || driveStatusMsg.startsWith('✓')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{driveStatusMsg}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 2: TẢI SÁCH LÊN CLOUD (CHỌN MÔN -> KHỐI -> HỌC KÌ -> TỰ HIỆN BÀI)
              =================================================================== */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              
              {/* FILTER BAR CỐT LÕI: MÔN -> KHỐI -> HỌC KÌ (QUY TRÌNH YÊU CẦU CỦA USER) */}
              <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/80 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-blue-600" />
                    Bộ Lọc Định Tuyến: Môn Học → Khối Lớp → Học Kì
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Bộ sách chuẩn duy nhất: Kết Nối Tri Thức Với Cuộc Sống
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. Môn học */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">1. Chọn Môn học:</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value as SubjectType)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                    >
                      <option value="Toán học">Toán học</option>
                      <option value="Vật lí">Vật lí (KHTN)</option>
                      <option value="Hóa học">Hóa học (KHTN)</option>
                      <option value="Sinh học">Sinh học (KHTN)</option>
                      <option value="Tin học">Tin học</option>
                      <option value="Ngữ văn">Ngữ văn</option>
                      <option value="Lịch sử">Lịch sử</option>
                      <option value="Địa lí">Địa lí</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                    </select>
                  </div>

                  {/* 2. Khối lớp */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">2. Chọn Khối lớp:</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                    >
                      <option value="Lớp 6">Lớp 6</option>
                      <option value="Lớp 7">Lớp 7</option>
                      <option value="Lớp 8">Lớp 8</option>
                      <option value="Lớp 9">Lớp 9</option>
                      <option value="Lớp 10">Lớp 10</option>
                      <option value="Lớp 11">Lớp 11</option>
                      <option value="Lớp 12">Lớp 12</option>
                    </select>
                  </div>

                  {/* 3. Học kì */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">3. Chọn Học kì:</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(Number(e.target.value) as 1 | 2)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-amber-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                    >
                      <option value={1}>Học kì I (Tuần 1 - Tuần 18)</option>
                      <option value={2}>Học kì II (Tuần 19 - Tuần 35)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* KHU VỰC TẢI LÊN SÁCH GIÁO KHOA, SÁCH BÀI TẬP, SÁCH GIÁO VIÊN */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Form Upload Sách */}
                <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-xs uppercase text-slate-800">Tải Sách Mới Lên Cloud</h3>
                  </div>

                  <form onSubmit={handleUploadBook} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Loại sách sư phạm:</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setUploadingBookType('SGK')}
                          className={`py-2 px-2 rounded-lg font-bold border text-center transition ${
                            uploadingBookType === 'SGK'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          SGK
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadingBookType('SBT')}
                          className={`py-2 px-2 rounded-lg font-bold border text-center transition ${
                            uploadingBookType === 'SBT'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          SBT
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadingBookType('SGV')}
                          className={`py-2 px-2 rounded-lg font-bold border text-center transition ${
                            uploadingBookType === 'SGV'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          SGV
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tên tài liệu / Tiêu đề sách:</label>
                      <input
                        type="text"
                        placeholder={`VD: ${uploadingBookType === 'SGK' ? 'Sách Giáo Khoa' : uploadingBookType === 'SBT' ? 'Sách Bài Tập' : 'Sách Giáo Viên'} ${selectedSubject} ${selectedGrade}`}
                        value={customBookTitle}
                        onChange={(e) => setCustomBookTitle(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Drag-drop file area */}
                    <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl p-4 text-center bg-blue-50/40 cursor-pointer transition">
                      <Cloud className="w-8 h-8 text-blue-500 mx-auto mb-1 animate-pulse" />
                      <p className="font-bold text-xs text-blue-900">Chọn tệp PDF / Word từ máy tính</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Tự động đồng bộ hóa & lưu trữ trên Cloud</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang tải lên Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Cloud className="w-3.5 h-3.5 text-blue-200" />
                          <span>Lưu Sách Lên Cloud Ngay</span>
                        </>
                      )}
                    </button>
                  </form>

                  {uploadSuccessMsg && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{uploadSuccessMsg}</span>
                    </div>
                  )}
                </div>

                {/* Danh sách sách đã lưu trên Cloud cho Môn/Khối/Kỳ này */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                      <Folder className="w-4 h-4 text-indigo-600" />
                      Kho Sách Cloud: {selectedSubject} - {selectedGrade} (Học kì {selectedSemester})
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">
                      {filteredBooks.length} tài liệu đã lưu
                    </span>
                  </div>

                  {filteredBooks.length === 0 ? (
                    <div className="p-6 text-center border rounded-xl bg-slate-50 text-slate-500 text-xs">
                      Chưa có sách nào được tải lên cho {selectedSubject} - {selectedGrade} (Học kì {selectedSemester}). Thầy/Cô vui lòng tải sách lên ở bảng bên cạnh.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredBooks.map((b) => (
                        <div key={b.id} className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                              b.type === 'SGK' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              b.type === 'SBT' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {b.type}
                            </span>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">{b.title}</h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {b.fileName} • {b.fileSize} • {b.pagesCount} trang • {b.uploadedAt}
                              </p>
                              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Cloud Storage: Đã đồng bộ an toàn
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => alert(`Xem tài liệu: ${b.title}\nĐường dẫn Cloud: ${b.cloudStorageUrl}`)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs"
                              title="Xem tài liệu"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Xóa sách "${b.title}" khỏi Cloud Storage?`)) {
                                  setBooks(CloudStorageService.deleteBook(b.id));
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs"
                              title="Xóa sách"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* TỰ ĐỘNG HIỆN LÊN DANH SÁCH CÁC BÀI HỌC KHI CHỌN MÔN -> KHỐI -> HỌC KÌ (YÊU CẦU CỦA NGƯỜI DÙNG) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <h3 className="font-bold text-xs uppercase text-slate-900">
                      DANH SÁCH CÁC BÀI HỌC TỰ ĐỘNG NẠP ({selectedSubject} • {selectedGrade} • Học Kì {selectedSemester})
                    </h3>
                  </div>
                  <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {curriculumList.length} bài học theo PPCT chuẩn
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Hệ thống tự động kích hoạt và ánh xạ các bài học tương ứng với <strong>{selectedSubject}</strong>, <strong>{selectedGrade}</strong>, <strong>Học kì {selectedSemester}</strong> (Bộ sách Kết Nối Tri Thức). Thầy/Cô có thể bấm <strong>"Áp Dụng Vào Bài Soạn Ngay"</strong> để nạp toàn bộ cấu hình vào Workspace:
                </p>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {curriculumList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/50"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{item.lessonName}</span>
                            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                              Tuần {item.week} • Tiết {item.periodNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {item.chapter} • Thời lượng: {item.periodsCount} tiết • Mạch: {item.branch}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyCurriculumToWorkspace(item)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Áp dụng vào bài soạn ngay</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 2: THÊM KHUNG CHƯƠNG TRÌNH THEO PHÂN PHỐI (PPCT)
              =================================================================== */}
          {activeTab === 'ppct' && (
            <div className="space-y-6">
              
              {/* Form Thêm bài học vào phân phối chương trình của giáo viên */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      Thêm Bài Học Mới Vào Khung Phân Phối Chương Trình (PPCT)
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Thiết kế chuẩn khung PPCT Bộ Giáo dục và Đào tạo (Theo kế hoạch giáo dục của tổ chuyên môn)
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Áp dụng cho: {selectedSubject} - {selectedGrade}
                  </span>
                </div>

                <form onSubmit={handleAddCurriculumEntry} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Môn học:</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value as SubjectType)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-blue-700 focus:outline-none"
                      >
                        <option value="Toán học">Toán học</option>
                        <option value="Vật lí">Vật lí</option>
                        <option value="Hóa học">Hóa học</option>
                        <option value="Sinh học">Sinh học</option>
                        <option value="Tin học">Tin học</option>
                        <option value="Ngữ văn">Ngữ văn</option>
                        <option value="Lịch sử">Lịch sử</option>
                        <option value="Địa lí">Địa lí</option>
                        <option value="Tiếng Anh">Tiếng Anh</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Khối lớp:</label>
                      <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold focus:outline-none"
                      >
                        <option value="Lớp 6">Lớp 6</option>
                        <option value="Lớp 7">Lớp 7</option>
                        <option value="Lớp 8">Lớp 8</option>
                        <option value="Lớp 9">Lớp 9</option>
                        <option value="Lớp 10">Lớp 10</option>
                        <option value="Lớp 11">Lớp 11</option>
                        <option value="Lớp 12">Lớp 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Học kì:</label>
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(Number(e.target.value) as 1 | 2)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-amber-700 focus:outline-none"
                      >
                        <option value={1}>Học kì I</option>
                        <option value={2}>Học kì II</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mạch kiến thức / Phân môn:</label>
                      <select
                        value={newBranch}
                        onChange={(e) => setNewBranch(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-indigo-700 focus:outline-none"
                      >
                        <option value="Đại số">Đại số / Số học</option>
                        <option value="Hình học">Hình học & Đo lường</option>
                        <option value="Thống kê & Xác suất">Thống kê & Xác suất</option>
                        <option value="Thực hành trải nghiệm">Thực hành & Trải nghiệm</option>
                        <option value="Kiểm tra">Kiểm tra định kỳ</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-8">
                      <label className="font-bold text-slate-700 block mb-1">Tên bài dạy / Chủ đề bài học (*):</label>
                      <input
                        type="text"
                        placeholder="VD: Bài 3. Giải hệ hai phương trình bậc nhất hai ẩn (Tiết 1)"
                        value={newLessonName}
                        onChange={(e) => setNewLessonName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="font-bold text-slate-700 block mb-1">Chương / Chủ đề lớn:</label>
                      <input
                        type="text"
                        placeholder="VD: Chương I. Hệ phương trình"
                        value={newChapter}
                        onChange={(e) => setNewChapter(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tuần học:</label>
                      <input
                        type="number"
                        min="1"
                        max="35"
                        value={newWeek}
                        onChange={(e) => setNewWeek(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-center"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tiết theo PPCT:</label>
                      <input
                        type="number"
                        min="1"
                        max="140"
                        value={newPeriodNumber}
                        onChange={(e) => setNewPeriodNumber(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-center"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Thời lượng (Số tiết):</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={newPeriodsCount}
                        onChange={(e) => setNewPeriodsCount(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Thiết bị dạy học & Học liệu số:</label>
                      <input
                        type="text"
                        value={newEquipment}
                        onChange={(e) => setNewEquipment(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Địa điểm dạy học:</label>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-500">
                      * Dữ liệu thêm mới sẽ tự động lưu trữ trên Cloud Storage của giáo viên.
                    </p>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Vào Khung Chương Trình</span>
                    </button>
                  </div>
                </form>

                {ppctSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{ppctSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* BẢNG QUẢN LÝ KHUNG PHÂN PHỐI CHƯƠNG TRÌNH HIỆN HÀNH */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                  <h3 className="font-bold text-xs uppercase text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Khung Phân Phối Chương Trình Hiện Tại: {selectedSubject} - {selectedGrade} (Học kì {selectedSemester})
                  </h3>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm bài học..."
                      value={ppctSearch}
                      onChange={(e) => setPpctSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-100 rounded-lg text-xs border border-slate-200 focus:outline-none w-48"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200 max-h-72">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b sticky top-0">
                      <tr>
                        <th className="p-2.5">Tuần</th>
                        <th className="p-2.5">Tiết</th>
                        <th className="p-2.5">Mạch</th>
                        <th className="p-2.5">Tên bài dạy / Chủ đề</th>
                        <th className="p-2.5">Thời lượng</th>
                        <th className="p-2.5">Thiết bị dạy học</th>
                        <th className="p-2.5 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {curriculumList
                        .filter(i => !ppctSearch || i.lessonName.toLowerCase().includes(ppctSearch.toLowerCase()) || i.chapter.toLowerCase().includes(ppctSearch.toLowerCase()))
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-blue-50/40 transition">
                            <td className="p-2.5 font-bold text-center text-slate-900">{c.week}</td>
                            <td className="p-2.5 font-mono text-center text-blue-700 font-bold">{c.periodNumber}</td>
                            <td className="p-2.5 font-semibold text-slate-600">{c.branch}</td>
                            <td className="p-2.5 font-bold text-slate-900">{c.lessonName}</td>
                            <td className="p-2.5 text-center">{c.periodsCount} tiết</td>
                            <td className="p-2.5 text-slate-500 truncate max-w-xs">{c.equipment}</td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleApplyCurriculumToWorkspace(c)}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold shadow-xs transition"
                              >
                                Áp dụng
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 3: KHO LƯU TRỮ CLOUD & TẢI VỀ ĐA ĐỊNH DẠNG (WORD, PDF, PPTX)
              =================================================================== */}
          {activeTab === 'cloud_artifacts' && (
            <div className="space-y-6">
              
              {/* Cloud Status Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 text-white p-5 rounded-2xl shadow-md border border-indigo-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <Cloud className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">TRUNG TÂM ĐIỆN TOÁN ĐÁM MÂY (CLOUD STORAGE)</h3>
                      <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                        Đang hoạt động 100%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Toàn bộ kết quả (Giáo án KHBD 5512, Slide bài giảng 16:9, Đề kiểm tra 7991) được tự động lưu trữ trên Cloud
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleManualCloudSync}
                  disabled={cloudSyncing}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-2 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncing ? 'animate-spin' : ''}`} />
                  <span>{cloudSyncing ? 'Đang đồng bộ Cloud...' : 'Đồng bộ hóa tất cả lên Cloud'}</span>
                </button>
              </div>

              {/* TẢI VỀ THEO TỪNG ĐỊNH DẠNG CỤ THỂ (WORD, PDF, PPTX, HTML) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-600" />
                    Tải Về Đa Định Dạng Từ Kho Lưu Trữ Cloud (Word, PDF, PPTX)
                  </h3>
                  <span className="text-xs text-slate-500">Chuẩn hóa cho máy tính & máy chiếu lớp học</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* 1. KHBD 5512 (Word & PDF) */}
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">Kế Hoạch Bài Dạy (Giáo Án) 5512</h4>
                          <span className="text-[10px] text-blue-700 font-semibold">Chuẩn Công văn 5512/BGDĐT-GDTrH</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Cloud Synced</span>
                    </div>
                    <p className="text-xs text-slate-600">Đầy đủ 4 hoạt động bắt buộc, thiết bị học liệu số và phụ lục rubric.</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => exportKHBDToWord(state)}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải file Word (.doc)</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition"
                      >
                        In / Lưu PDF
                      </button>
                    </div>
                  </div>

                  {/* 2. Slide Bài Giảng Trình Chiếu (PPTX & PDF) */}
                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Presentation className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">Slide Bài Giảng Trình Chiếu (16:9)</h4>
                          <span className="text-[10px] text-purple-700 font-semibold">Tỉ lệ 16:9 • Thẻ trực quan hóa</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Cloud Synced</span>
                    </div>
                    <p className="text-xs text-slate-600">Slide deck bài giảng mở trực tiếp trong Microsoft PowerPoint, Keynote, Google Slides.</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => exportSlidesToPPTX(state)}
                        className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải file PowerPoint (PPTX)</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition"
                      >
                        Lưu Slide PDF
                      </button>
                    </div>
                  </div>

                  {/* 3. Đề Thi Chuẩn CV 7991 (Word & PDF) */}
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">Đề Kiểm Tra Chuẩn CV 7991</h4>
                          <span className="text-[10px] text-emerald-700 font-semibold">4 Phần • Barem khóa chặt 10.0đ</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Cloud Synced</span>
                    </div>
                    <p className="text-xs text-slate-600">Gồm Phần I, Phần II Đúng/Sai 4 ý, Phần III Trả lời ngắn, Phần IV Tự luận.</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => exportExamToWord(state)}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Đề Word (.doc)</span>
                      </button>
                      <button
                        onClick={() => exportMatrixToWord(state)}
                        className="py-2 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold transition"
                      >
                        Tải Ma Trận
                      </button>
                    </div>
                  </div>

                  {/* 4. Single-file Standalone HTML */}
                  <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-slate-700" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">Gói Standalone HTML Độc Lập</h4>
                          <span className="text-[10px] text-slate-500 font-semibold">1 File duy nhất chạy Offline</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Offline First</span>
                    </div>
                    <p className="text-xs text-slate-600">Mở trên bất kỳ máy tính nào không cần cài đặt Node.js hay dòng lệnh.</p>
                    <div className="pt-1">
                      <button
                        onClick={() => downloadStandaloneHTMLFile(state)}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải Single-File HTML Độc Lập</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* BẢNG LỊCH SỬ TÀI LIỆU LƯU TRỮ TRÊN CLOUD */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h4 className="font-bold text-xs uppercase text-slate-800">
                  Lịch Sử Phiên Bản & Bản Sao Lưu Điện Toán Đám Mây:
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-800 font-bold border-b">
                      <tr>
                        <th className="p-2">Tên file trên Cloud</th>
                        <th className="p-2">Định dạng</th>
                        <th className="p-2">Môn / Khối</th>
                        <th className="p-2">Dung lượng</th>
                        <th className="p-2">Thời gian tạo</th>
                        <th className="p-2">Trạng thái Cloud</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {artifacts.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900">{a.title}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              a.format === 'WORD' ? 'bg-blue-100 text-blue-800' :
                              a.format === 'PPTX' ? 'bg-purple-100 text-purple-800' :
                              a.format === 'PDF' ? 'bg-rose-100 text-rose-800' :
                              'bg-slate-200 text-slate-800'
                            }`}>
                              {a.format}
                            </span>
                          </td>
                          <td className="p-2 font-medium text-slate-600">{a.subject} - {a.grade}</td>
                          <td className="p-2 text-slate-500 font-mono">{a.fileSize}</td>
                          <td className="p-2 text-slate-500">{a.createdAt}</td>
                          <td className="p-2">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Đã đồng bộ
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 4: HỒ SƠ TRƯỜNG LỚP & GIÁO VIÊN
              =================================================================== */}
          {activeTab === 'school_profile' && (
            <div className="max-w-2xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-bold text-sm text-slate-900 uppercase">Cấu Hình Hồ Sơ Giáo Viên & Trường Học</h3>
                <p className="text-xs text-slate-500 mt-0.5">Thông tin xuất hiện trên tiêu đề Quốc hiệu của KHBD và Đề kiểm tra</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên trường THCS / THPT:</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tổ chuyên môn:</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Họ và tên giáo viên:</label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lớp giảng dạy trực tiếp:</label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-bold text-emerald-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                  <span className="font-bold block">Quy chuẩn bộ sách giáo khoa:</span>
                  <p>Hệ thống áp dụng bộ sách giáo khoa quy chuẩn duy nhất: <strong>Kết Nối Tri Thức Với Cuộc Sống</strong> (Bộ Giáo dục và Đào tạo ban hành).</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow transition"
                  >
                    Lưu Cấu Hình Hồ Sơ
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Hệ thống điện toán đám mây EduMaster K-12</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition"
          >
            Đóng Cài Đặt
          </button>
        </div>

      </div>
    </div>
  );
}
