import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Edit3, 
  Eye, 
  Save, 
  RotateCcw, 
  Plus, 
  Printer, 
  Download, 
  Check, 
  Calculator, 
  BookOpen, 
  Layers, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search,
  Code
} from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface VIPMathDocumentViewerProps {
  fileName: string;
  zoomLevel: number;
  searchKeyword?: string;
  onSaveContent?: (content: string) => void;
  onDownloadDoc?: () => void;
}

// Nội dung chuẩn bản gốc VIP từ trang 7 đến trang 9 với công thức Toán học KaTeX chuẩn mực
export const DEFAULT_VIP_PAGES_DATA = {
  header: {
    ministry: 'KHBD TOÁN 9-KNTT - TH NLS/AI NĂM HỌC 2026–2027',
    school: '',
    department: 'TỔ TOÁN',
    teacher: '',
    year: 'Năm học: 2026 - 2027',
    sourceFile: 'KHBD_TOAN9_KNTT_TAP1_FULL_5_CHUONG_NEW_VIP_2026_2027_MUC_TIEU_CHUAN_PL1_PL3.pdf'
  },
  lesson: {
    title: 'BÀI 2: GIẢI HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    subTitle: 'TIẾT 2: PHƯƠNG PHÁP CỘNG ĐẠI SỐ',
    subject: 'Toán học 9 (Bộ sách Kết nối tri thức với cuộc sống - Tập 1)',
    duration: 'Tiết 2 / 2 tiết (PPCT Tuần 2 - Phân môn Đại số: Tiết 6)',
    textbookPages: 'SGK Toán 9 KNTT Tập 1 - Trang 10, 11, 12'
  }
};

export const VIPMathDocumentViewer: React.FC<VIPMathDocumentViewerProps> = ({
  fileName,
  zoomLevel,
  searchKeyword = '',
  onSaveContent,
  onDownloadDoc
}) => {
  const storageKey = `vip_edited_doc_${fileName}`;

  // Tab mode: 'preview' (KaTeX VIP rendered pages) or 'editor' (Live Math Editor) or 'split'
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'split'>('preview');
  const [currentPage, setCurrentPage] = useState<number>(0); // 0: All, 7: Page 7, 8: Page 8, 9: Page 9
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Content state for editable text
  const [rawText, setRawText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    } catch (e) {
      console.warn(e);
    }
    return getInitialVIPContent();
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setRawText(saved);
    } catch (e) {
      console.warn(e);
    }
  }, [storageKey]);

  // Insert formula snippet at cursor in editor
  const insertFormula = (snippet: string) => {
    const textarea = document.getElementById('vip-math-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      setRawText(prev => prev + '\n' + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = rawText;
    const updated = current.substring(0, start) + snippet + current.substring(end);
    setRawText(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 50);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(storageKey, rawText);
      setSavedSuccess(true);
      if (onSaveContent) onSaveContent(rawText);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục lại toàn bộ nội dung bản gốc VIP chuẩn từ trang 7 đến trang 9?')) {
      const initial = getInitialVIPContent();
      setRawText(initial);
      localStorage.removeItem(storageKey);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    if (onDownloadDoc) {
      onDownloadDoc();
      return;
    }
    const html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${DEFAULT_VIP_PAGES_DATA.lesson.title}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
    th { background-color: #f1f5f9; font-weight: bold; text-align: center; }
    h1 { font-size: 15pt; text-align: center; font-weight: bold; margin-bottom: 4px; }
    h2 { font-size: 13.5pt; font-weight: bold; color: #1e3a8a; margin-top: 14px; }
    h3 { font-size: 13pt; font-weight: bold; margin-top: 8px; }
    .box { border: 1.5px solid #1e3a8a; background-color: #f8fafc; padding: 10px; margin: 10px 0; }
    .equation { font-family: 'Cambria Math', 'Times New Roman', serif; font-style: italic; font-weight: bold; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 20px;">
    <p><strong>KHBD TOÁN 9-KNTT - TH NLS/AI NĂM HỌC 2026–2027</strong><br>
    Năm học: 2026 - 2027</p>
    <h1>KẾ HOẠCH BÀI DẠY (CHUẨN CÔNG VĂN 5512 & PL1 - PL3)</h1>
    <h2 style="text-align: center;">${DEFAULT_VIP_PAGES_DATA.lesson.title}</h2>
    <p style="text-align: center; font-style: italic;">${DEFAULT_VIP_PAGES_DATA.lesson.subTitle} • ${DEFAULT_VIP_PAGES_DATA.lesson.duration}</p>
  </div>
  <div style="white-space: pre-wrap; font-family: 'Times New Roman', serif;">
    ${rawText.replace(/\n/g, '<br/>')}
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'KHBD_TOAN9_KNTT_Bai2_Tiet2_CongDaiSo_VIP_Trang7_9.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col space-y-3 font-sans print:m-0 print:p-0">
      {/* VIP VIEWER NAVIGATION & CONTROL BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3 rounded-2xl shadow-lg border border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 print:hidden">
        {/* Left: Document details */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                BẢN GỐC CHUẨN VIP: TRANG 7 ĐẾN TRANG 9
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                100% RUỘT KIẾN THỨC TOÁN 9 KNTT
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Toán học Equation KaTeX • Chuẩn CV 5512 &amp; PL1 - PL3 • Không câu chữ hình thức
            </p>
          </div>
        </div>

        {/* Center: Tabs Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Trực quan Equation KaTeX (VIP)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'editor'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Chỉnh sửa trực tiếp &amp; Công thức</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 hidden lg:flex ${
              activeTab === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Xem song song (Chia đôi)</span>
          </button>
        </div>

        {/* Right: Quick Page Filter and Actions */}
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setCurrentPage(0)}
              className={`px-2 py-1 rounded font-semibold text-[11px] ${
                currentPage === 0 ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cả 3 trang
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(7)}
              className={`px-2 py-1 rounded font-semibold text-[11px] ${
                currentPage === 7 ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Trang 7
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(8)}
              className={`px-2 py-1 rounded font-semibold text-[11px] ${
                currentPage === 8 ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Trang 8
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(9)}
              className={`px-2 py-1 rounded font-semibold text-[11px] ${
                currentPage === 9 ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Trang 9
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadWord}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
            title="Tải bản Word .doc chuẩn với công thức và bảng biểu"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất Word</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
            title="In hoặc lưu file PDF sắc nét không vỡ chữ"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In / PDF</span>
          </button>
        </div>
      </div>

      {/* EDITOR MATH TOOLBAR (visible when in editor or split mode) */}
      {(activeTab === 'editor' || activeTab === 'split') && (
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm print:hidden">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1 mr-1">
              <Calculator className="w-4 h-4 text-amber-700" />
              <span>Chèn nhanh công thức Toán (Equation):</span>
            </span>

            <button
              type="button"
              onClick={() => insertFormula('$$\\begin{cases} 2x + y = 4 \\\\ x - y = 1 \\end{cases}$$')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-mono text-[11px] font-bold shadow-2xs transition"
              title="Chèn hệ hai phương trình bậc nhất hai ẩn"
            >
              {`{ Hệ 2 pt }`}
            </button>

            <button
              type="button"
              onClick={() => insertFormula('$$\\frac{a}{b}$$')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-mono text-[11px] font-bold shadow-2xs transition"
              title="Chèn phân số"
            >
              {"\\frac{a}{b}"}
            </button>

            <button
              type="button"
              onClick={() => insertFormula('$$\\Leftrightarrow$$')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-mono text-[11px] font-bold shadow-2xs transition"
              title="Dấu tương đương"
            >
              {"\\Leftrightarrow"}
            </button>

            <button
              type="button"
              onClick={() => insertFormula('$$\\Rightarrow$$')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-mono text-[11px] font-bold shadow-2xs transition"
              title="Dấu suy ra"
            >
              {"\\Rightarrow"}
            </button>

            <button
              type="button"
              onClick={() => insertFormula('$$\\sqrt{x}$$')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-mono text-[11px] font-bold shadow-2xs transition"
              title="Căn bậc hai"
            >
              {"\\sqrt{x}"}
            </button>

            <button
              type="button"
              onClick={() => insertFormula('MENU $\\to$ 9 $\\to$ 1 $\\to$ 2')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-mono text-[11px] font-bold shadow-2xs transition"
              title="Phím bấm máy tính Casio fx-580VN X"
            >
              Casio fx-580
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Đã lưu thay đổi' : 'Lưu chỉnh sửa'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 shadow-2xs"
              title="Khôi phục nguyên gốc trang 7-9 ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Khôi phục gốc</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTENT CONTAINER */}
      <div 
        className="w-full flex justify-center transition-all duration-200"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
      >
        {activeTab === 'preview' && (
          <div className="w-full max-w-4xl space-y-8">
            {(currentPage === 0 || currentPage === 7) && <VIPPage7 />}
            {(currentPage === 0 || currentPage === 8) && <VIPPage8 />}
            {(currentPage === 0 || currentPage === 9) && <VIPPage9 />}
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow border border-slate-300 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Trình soạn thảo trực tiếp ruột kiến thức &amp; Công thức KaTeX:</span>
              </span>
              <span className="text-slate-500 text-[11px]">
                Hỗ trợ cú pháp LaTeX: $ công thức inline $ hoặc $$ công thức block $$
              </span>
            </div>
            <textarea
              id="vip-math-textarea"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={26}
              className="w-full p-4 font-mono text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-900 leading-relaxed resize-y"
              placeholder="Nhập nội dung kế hoạch bài dạy và công thức toán..."
            />
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 italic">
                * Mọi chỉnh sửa được tự động lưu trong bộ nhớ trình duyệt cho bài dạy này.
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Lưu văn bản &amp; Cập nhật xem trước</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'split' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor column */}
            <div className="bg-white rounded-2xl shadow border border-slate-300 p-4 space-y-3 flex flex-col h-[75vh]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs shrink-0">
                <span className="font-bold text-slate-800">Soạn thảo nội dung</span>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  <span>Lưu</span>
                </button>
              </div>
              <textarea
                id="vip-math-textarea"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full flex-1 p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden text-slate-900 leading-relaxed resize-none"
              />
            </div>

            {/* Live KaTeX Preview column */}
            <div className="bg-white rounded-2xl shadow border border-slate-300 p-4 overflow-y-auto h-[75vh] space-y-4 font-serif text-slate-900 text-sm leading-relaxed">
              <div className="pb-2 border-b border-slate-200 text-xs font-sans font-bold text-indigo-950 flex items-center justify-between">
                <span>Xem trước trực tiếp (KaTeX Live Preview)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  Sư phạm HD
                </span>
              </div>
              <MathRenderer text={rawText} block={true} className="whitespace-pre-line" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// A4 SIMULATION COMPONENTS FOR PAGES 7, 8, 9
// ==========================================

const VIPPage7: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-300 p-8 sm:p-12 font-serif text-slate-900 relative overflow-hidden print:border-none print:shadow-none print:p-0 print:m-0">
      {/* Official Header matching original */}
      <div className="flex justify-between items-center border-b-2 border-blue-600 pb-3 text-xs font-sans">
        <div>
          <p className="font-black text-blue-900 tracking-wide text-sm">KHBD TOÁN 9-KNTT - TH NLS/AI NĂM HỌC 2026–2027</p>
          <p className="text-slate-600 font-medium">Kế hoạch bài dạy chuẩn Công văn 5512/BGDĐT-GDTrH &amp; PL1 - PL3</p>
        </div>
        <div className="text-right">
          <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
            Toán 9 KNTT • Tập 1
          </span>
        </div>
      </div>

      {/* Page Badge & Watermark */}
      <div className="flex items-center justify-between my-4 font-sans text-xs">
        <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-black border border-blue-300 tracking-wider">
          TRANG 7 / 248 (BẢN GỐC VIP TOÁN 9 KNTT)
        </span>
        <span className="text-slate-500 italic">
          Khung kế hoạch dạy học chuẩn Công văn 5512/BGDĐT-GDTrH &amp; PL1 - PL3
        </span>
      </div>

      {/* Lesson Title */}
      <div className="text-center space-y-1 mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
          BÀI 2: GIẢI HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN (TIẾT 2)
        </h1>
        <p className="font-sans font-bold text-sm text-blue-900 uppercase">
          Mục 2: Phương pháp cộng đại số (SGK Toán 9 KNTT Tập 1 - Trang 10, 11, 12)
        </p>
        <p className="text-xs text-slate-600 font-sans italic">
          Thời lượng: 02 tiết (Thực hiện tiết: 02) • PPCT: Tuần 2 - Tiết 6
        </p>
      </div>

      {/* Content Section I: Objectives */}
      <div className="space-y-4 text-sm leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-blue-950 uppercase border-b border-blue-200 pb-1 mb-2 font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
            I. MỤC TIÊU DẠY HỌC
          </h2>

          <div className="space-y-3 pl-2">
            <div>
              <h3 className="font-bold text-slate-900 font-sans text-xs uppercase text-blue-800">1. Về kiến thức:</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-800">
                <li>Hiểu rõ quy tắc cộng đại số và các bước giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp cộng đại số.</li>
                <li>
                  Vận dụng thành thạo phương pháp cộng đại số trong cả 2 trường hợp cốt lõi:
                  <ul className="list-circle pl-5 mt-1 space-y-0.5 text-xs text-slate-700">
                    <li><strong>Trường hợp 1 (Hệ số bằng nhau hoặc đối nhau):</strong> Trừ từng vế khi các hệ số của cùng một ẩn bằng nhau; Cộng từng vế khi các hệ số của cùng một ẩn đối nhau để triệt tiêu một ẩn.</li>
                    <li><strong>Trường hợp 2 (Hệ số không bằng nhau và không đối nhau):</strong> Nhân cả hai vế của mỗi phương trình với một số thích hợp để đưa về hệ phương trình mới có các hệ số của cùng một ẩn bằng nhau hoặc đối nhau (quy về Trường hợp 1).</li>
                  </ul>
                </li>
                <li>Sử dụng máy tính cầm tay (Casio fx-580VN X / fx-880BTG) kiểm tra nghiệm chính xác của hệ phương trình.</li>
                <li>Nhận diện các trường hợp đặc biệt: Hệ phương trình vô nghiệm (xuất hiện phương trình dạng $0x = k$ với $k \neq 0$) hoặc vô số nghiệm (xuất hiện $0x = 0$).</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 font-sans text-xs uppercase text-blue-800">2. Về năng lực:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 font-sans text-xs">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                  <p className="font-bold text-blue-900 mb-1">a) Năng lực đặc thù toán học:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li><strong>Tư duy và lập luận toán học:</strong> Phân tích hệ số của các ẩn $x$ và $y$ để quyết định nhân thêm số nào và cộng hay trừ từng vế.</li>
                    <li><strong>Giải quyết vấn đề toán học:</strong> Biến đổi hệ phương trình hai ẩn về phương trình một ẩn duy nhất.</li>
                    <li><strong>Mô hình hóa toán học:</strong> Lập hệ phương trình biểu diễn bài toán thực tế giá bánh mì, phân tích bài toán hóa học hoặc chuyển động.</li>
                  </ul>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
                  <p className="font-bold text-indigo-900 mb-1">b) Năng lực chung &amp; Năng lực số:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li><strong>Tự chủ và tự học:</strong> Tự hoàn thiện Phiếu học tập số 1 và ghi chép có hệ thống vào vở.</li>
                    <li><strong>Giao tiếp và hợp tác:</strong> Thảo luận nhóm đôi và nhóm 4 giải quyết bài toán Tranh luận SGK trang 12.</li>
                    <li><strong>Năng lực số:</strong> Bấm phím máy tính Casio fx-580VN X kiểm tra nghiệm nhanh: <span className="font-mono font-bold text-indigo-900">MENU 9 1 2</span>.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 font-sans text-xs uppercase text-blue-800">3. Về phẩm chất:</h3>
              <p className="text-slate-800 text-xs">
                Chăm chỉ suy nghĩ tìm phương pháp giải tối ưu; Trung thực trong đánh giá chéo giữa các nhóm; Có tinh thần trách nhiệm và tương trợ bạn bè cùng tiến bộ.
              </p>
            </div>
          </div>
        </div>

        {/* Section II: Equipment */}
        <div className="pt-2">
          <h2 className="text-base font-bold text-blue-950 uppercase border-b border-blue-200 pb-1 mb-2 font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
            II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">1. Giáo viên:</strong>
              <p className="text-slate-700 leading-relaxed">
                Giáo án Word chuẩn CV 5512, slide trình chiếu bài giảng, bảng phụ nhóm A3, bút dạ, Phiếu học tập số 1 (Khám phá phương pháp cộng) &amp; Phiếu học tập số 2 (Luyện tập).
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">2. Học sinh:</strong>
              <p className="text-slate-700 leading-relaxed">
                SGK Toán 9 KNTT Tập 1 (trang 10-12), vở ghi chép, máy tính cầm tay fx-580VN X/fx-880BTG, thước kẻ thẳng, bút màu làm nổi bật hệ số.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] font-sans text-slate-500">
        <span>KHBD VIP Toán 9 KNTT Tập 1 • CV 5512 &amp; QĐ 2422/BGDĐT</span>
        <span className="font-bold">Trang 7 / 248</span>
      </div>
    </div>
  );
};

const VIPPage8: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-300 p-8 sm:p-12 font-serif text-slate-900 relative overflow-hidden print:border-none print:shadow-none print:p-0 print:m-0">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-sans text-xs">
        <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-black border border-blue-300 tracking-wider">
          TRANG 8 / 248 (BẢN GỐC VIP TOÁN 9 KNTT)
        </span>
        <span className="text-slate-600 font-bold">
          BÀI 2. GIẢI HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN (TIẾT 2)
        </span>
      </div>

      <div className="my-5">
        <h2 className="text-base font-black text-blue-950 uppercase border-b-2 border-blue-900 pb-1 mb-4 font-sans">
          III. TIẾN TRÌNH DẠY HỌC (CHUẨN 4 HOẠT ĐỘNG CV 5512 - RUỘT KIẾN THỨC CHI TIẾT)
        </h2>

        {/* HOẠT ĐỘNG 1: KHỞI ĐỘNG */}
        <div className="mb-6 p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3 text-xs font-sans">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-indigo-950 uppercase flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[11px]">HĐ 1</span>
              <span>HOẠT ĐỘNG 1: MỞ ĐẦU / KHỞI ĐỘNG (5 phút)</span>
            </h3>
            <span className="text-indigo-700 font-semibold">Tạo nhu cầu giải nhanh</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-800">
            <div>
              <p className="font-bold text-slate-900 mb-1">a) Mục tiêu &amp; Nhiệm vụ:</p>
              <p className="text-slate-700 leading-relaxed mb-2">
                Học sinh nhận thấy giải bằng phương pháp thế đối với hệ sau có thể mất nhiều bước, kích hoạt phát hiện phép cộng hai phương trình triệt tiêu ẩn $y$:
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-indigo-200 text-center font-serif text-sm">
                <MathRenderer text="$$\begin{cases} 2x + y = 4 \quad (1) \\ x - y = 1 \quad (2) \end{cases}$$" block={true} />
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900 mb-1">b) Sản phẩm &amp; So sánh hai cách giải:</p>
              <div className="p-2.5 bg-white rounded-lg border border-indigo-200 space-y-1 font-serif text-xs">
                <p><strong>• Cách 1 (Phương pháp Thế):</strong> Từ (2) $\Rightarrow x = y + 1$. Thế vào (1): $2(y + 1) + y = 4 \Leftrightarrow 3y = 2 \Leftrightarrow y = \frac{2}{3} \Rightarrow x = \frac{5}{3}$.</p>
                <p className="text-emerald-800 font-semibold">
                  <strong>• Cách 2 (Cộng từng vế):</strong> Do hệ số của $y$ đối nhau ($+1$ và $-1$):
                </p>
                <div className="text-center py-1">
                  <MathRenderer text="$$(2x + y) + (x - y) = 4 + 1 \Leftrightarrow 3x = 5 \Leftrightarrow x = \frac{5}{3} \Rightarrow y = \frac{2}{3}$$" />
                </div>
                <p className="text-indigo-900 font-bold text-[11px]">
                  =&gt; Kết luận của HS: Cách cộng từng vế làm biến mất ngay ẩn $y$, nhanh và đỡ nhầm dấu hơn rất nhiều!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI */}
        <div className="space-y-4 text-xs font-sans">
          <div className="flex items-center justify-between pb-1 border-b border-blue-300">
            <h3 className="font-bold text-sm text-blue-950 uppercase flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px]">HĐ 2</span>
              <span>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (20 phút)</span>
            </h3>
            <span className="text-blue-800 font-bold">Mục 2: Phương pháp cộng đại số</span>
          </div>

          {/* Khung quy tắc SGK trang 10 */}
          <div className="p-3.5 bg-amber-50 rounded-xl border-2 border-amber-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Quy tắc cộng đại số (SGK Toán 9 KNTT Tập 1 - Trang 10)</span>
            </div>
            <div className="text-slate-800 pl-4 space-y-1">
              <p><strong>Bước 1:</strong> Cộng hay trừ từng vế hai phương trình của hệ đã cho để được một phương trình có một ẩn duy nhất.</p>
              <p><strong>Bước 2:</strong> Giải phương trình một ẩn vừa nhận được, rồi suy ra nghiệm của hệ phương trình đã cho.</p>
            </div>
            <div className="p-2 bg-white/80 rounded-lg border border-amber-200 text-amber-950 font-bold text-center text-[11px]">
              Bí quyết nhớ nhanh: Hệ số BẰNG NHAU thì TRỪ • Hệ số ĐỐI NHAU thì CỘNG
            </div>
          </div>

          {/* Trường hợp 1: Hệ số bằng nhau hoặc đối nhau */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-300 space-y-3 font-serif">
            <p className="font-sans font-bold text-blue-900 text-xs uppercase">
              1. Trường hợp 1: Các hệ số của cùng một ẩn bằng nhau hoặc đối nhau
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
              {/* Ví dụ 2 */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-sans font-bold text-slate-900 block text-xs">
                  * Ví dụ 2 (SGK KNTT trang 11) - Hệ số bằng nhau:
                </span>
                <p className="text-slate-600 font-sans text-[11px]">Giải hệ phương trình:</p>
                <div className="text-center py-1">
                  <MathRenderer text="$$\\begin{cases} 2x + 3y = 7 \\quad (1) \\\\ 2x - y = -1 \\quad (2) \\end{cases}$$" block={true} />
                </div>
                <div className="text-slate-800 text-xs space-y-1">
                  <p><strong>Lời giải:</strong> Nhận thấy hệ số của $x$ ở hai phương trình bằng nhau (đều bằng $2$).</p>
                  <p>Trừ từng vế pt (1) cho pt (2):</p>
                  <div className="text-center font-bold text-blue-900 py-1">
                    <MathRenderer text="$$(2x + 3y) - (2x - y) = 7 - (-1) \\Leftrightarrow 4y = 8 \\Leftrightarrow y = 2$$" />
                  </div>
                  <p>Thay $y = 2$ vào (1): $2x + 3(2) = 7 \Leftrightarrow 2x = 1 \Leftrightarrow x = \frac{1}{2}$.</p>
                  <p className="font-bold text-emerald-800">Vậy hệ phương trình có nghiệm duy nhất là $(\frac{1}{2}; 2)$.</p>
                </div>
              </div>

              {/* Ví dụ 3 */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-sans font-bold text-slate-900 block text-xs">
                  * Ví dụ 3 (SGK KNTT trang 11) - Hệ số đối nhau:
                </span>
                <p className="text-slate-600 font-sans text-[11px]">Giải hệ phương trình:</p>
                <div className="text-center py-1">
                  <MathRenderer text="$$\\begin{cases} 3x - 2y = 4 \\quad (1) \\\\ 2x + 2y = 6 \\quad (2) \\end{cases}$$" block={true} />
                </div>
                <div className="text-slate-800 text-xs space-y-1">
                  <p><strong>Lời giải:</strong> Hệ số của $y$ ở hai phương trình đối nhau ($-2$ và $+2$).</p>
                  <p>Cộng từng vế phương trình (1) và (2):</p>
                  <div className="text-center font-bold text-blue-900 py-1">
                    <MathRenderer text="$$(3x - 2y) + (2x + 2y) = 4 + 6 \\Leftrightarrow 5x = 10 \\Leftrightarrow x = 2$$" />
                  </div>
                  <p>Thay $x = 2$ vào (2): $2(2) + 2y = 6 \Leftrightarrow 2y = 2 \Leftrightarrow y = 1$.</p>
                  <p className="font-bold text-emerald-800">Vậy hệ phương trình có nghiệm duy nhất là $(2; 1)$.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trường hợp 2: Hệ số không bằng và không đối */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2 font-serif">
            <p className="font-sans font-bold text-blue-950 text-xs uppercase">
              2. Trường hợp 2: Các hệ số của cùng một ẩn không bằng nhau và không đối nhau
            </p>
            <div className="p-3 bg-white rounded-lg border border-blue-200 text-xs space-y-2">
              <span className="font-sans font-bold text-slate-900 block text-xs">
                * Ví dụ 4 (SGK KNTT trang 12) - Nhân hai vế để cân bằng hệ số:
              </span>
              <p className="text-slate-600 font-sans text-[11px]">Giải hệ phương trình:</p>
              <div className="text-center py-1">
                <MathRenderer text="$$\\begin{cases} 3x + 2y = 7 \\quad (1) \\\\ 2x + 3y = 3 \\quad (2) \\end{cases}$$" block={true} />
              </div>
              <div className="text-slate-800 space-y-1.5 leading-relaxed">
                <p><strong>Lời giải chi tiết:</strong> Các hệ số của $x$ và $y$ đều không bằng và không đối nhau. Ta nhân cả hai vế của (1) với $2$ và cả hai vế của (2) với $3$ để hệ số của $x$ cùng bằng $6$:</p>
                <div className="text-center py-1">
                  <MathRenderer text="$$\\begin{cases} 6x + 4y = 14 \\quad (1') \\\\ 6x + 9y = 9 \\quad (2') \\end{cases}$$" block={true} />
                </div>
                <p>Trừ từng vế phương trình (2') cho phương trình (1'):</p>
                <div className="text-center font-bold text-blue-900 py-1">
                  <MathRenderer text="$$(6x + 9y) - (6x + 4y) = 9 - 14 \\Leftrightarrow 5y = -5 \\Leftrightarrow y = -1$$" />
                </div>
                <p>Thay $y = -1$ vào phương trình (1): $3x + 2(-1) = 7 \Leftrightarrow 3x - 2 = 7 \Leftrightarrow 3x = 9 \Leftrightarrow x = 3$.</p>
                <p className="font-bold text-emerald-800">Vậy hệ phương trình có nghiệm duy nhất là $(3; -1)$.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] font-sans text-slate-500">
        <span>KHBD VIP Toán 9 KNTT Tập 1 • CV 5512 &amp; QĐ 2422/BGDĐT</span>
        <span className="font-bold">Trang 8 / 248</span>
      </div>
    </div>
  );
};

const VIPPage9: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-300 p-8 sm:p-12 font-serif text-slate-900 relative overflow-hidden print:border-none print:shadow-none print:p-0 print:m-0">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-sans text-xs">
        <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-black border border-blue-300 tracking-wider">
          TRANG 9 / 248 (BẢN GỐC VIP TOÁN 9 KNTT)
        </span>
        <span className="text-slate-600 font-bold">
          LUYỆN TẬP, VẬN DỤNG &amp; PHỤ LỤC CV 5512
        </span>
      </div>

      <div className="my-5 space-y-6">
        {/* HOẠT ĐỘNG 3: LUYỆN TẬP */}
        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-950 uppercase flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px]">HĐ 3</span>
              <span>HOẠT ĐỘNG 3: LUYỆN TẬP CỦNG CỐ (13 phút)</span>
            </h3>
            <span className="text-emerald-800 font-bold">Luyện tập 2, 3 &amp; Bài 1.6 SGK</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-serif">
            {/* Luyện tập 2 */}
            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1.5 text-xs">
              <p className="font-sans font-bold text-emerald-900">
                • Luyện tập 2 (SGK trang 11): Giải hệ
              </p>
              <div className="text-center py-0.5">
                <MathRenderer text="$$\\begin{cases} 3x + 2y = 6 \\\\ 2x - 2y = 14 \\end{cases}$$" block={true} />
              </div>
              <p className="text-slate-700">Cộng từng vế: $5x = 20 \Leftrightarrow x = 4$.</p>
              <p className="text-slate-700">Thay vào: $3(4) + 2y = 6 \Leftrightarrow 2y = -6 \Leftrightarrow y = -3$.</p>
              <p className="font-bold text-emerald-800 font-sans">Nghiệm: $(4; -3)$.</p>
            </div>

            {/* Luyện tập 3 */}
            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1.5 text-xs">
              <p className="font-sans font-bold text-emerald-900">
                • Luyện tập 3 (SGK trang 12): Giải hệ
              </p>
              <div className="text-center py-0.5">
                <MathRenderer text="$$\\begin{cases} 4x + 3y = 6 \\\\ 2x + y = 4 \\end{cases}$$" block={true} />
              </div>
              <p className="text-slate-700">Nhân phương trình 2 với 2: $4x + 2y = 8$.</p>
              <p className="text-slate-700">Trừ từng vế: $y = -2 \Rightarrow 2x + (-2) = 4 \Leftrightarrow x = 3$.</p>
              <p className="font-bold text-emerald-800 font-sans">Nghiệm: $(3; -2)$.</p>
            </div>
          </div>

          {/* Máy tính Casio */}
          <div className="p-2.5 bg-white rounded-lg border border-slate-300 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 font-sans">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Thực hành Casio fx-580VN X:</span>
            </span>
            <span className="font-mono text-indigo-900 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              MENU &rarr; 9 &rarr; 1 &rarr; 2 &rarr; Nhập hệ số &rarr; Bấm =
            </span>
          </div>
        </div>

        {/* HOẠT ĐỘNG 4: VẬN DỤNG & THỰC TIỄN */}
        <div className="p-4 rounded-xl border border-blue-300 bg-blue-50/40 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-blue-950 uppercase flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px]">HĐ 4</span>
              <span>HOẠT ĐỘNG 4: VẬN DỤNG &amp; THỰC TẾ (7 phút)</span>
            </h3>
            <span className="text-blue-800 font-bold">Tranh luận &amp; Tiệm bánh mì</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-serif">
            {/* Tranh luận */}
            <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-1.5 text-xs">
              <p className="font-sans font-bold text-blue-900">
                1. Tranh luận (SGK KNTT trang 12):
              </p>
              <div className="text-center py-0.5">
                <MathRenderer text="$$\\begin{cases} x - 2y = 1 \\\\ 3x + 2y = 11 \\end{cases}$$" block={true} />
              </div>
              <p className="text-slate-700 text-[11px]">
                <strong>Tròn:</strong> Giải bằng phương pháp thế (rút $x = 2y + 1$).<br />
                <strong>Vuông:</strong> Giải bằng phương pháp cộng đại số (cộng vế mất $y$).
              </p>
              <p className="text-indigo-900 font-bold text-[11px] font-sans">
                =&gt; Kết luận: Cả hai cách đều đúng! Nhưng Vuông nhanh hơn vì hệ số của $y$ đối nhau sẵn.
              </p>
            </div>

            {/* Bài toán thực tế */}
            <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-1.5 text-xs">
              <p className="font-sans font-bold text-blue-900">
                2. Bài toán thực tế Tiệm bánh mì:
              </p>
              <p className="text-slate-700 text-[11px]">
                30 bánh pate + 20 bánh trứng = 1.100 nghìn đồng.<br />
                20 bánh pate + 20 bánh trứng = 900 nghìn đồng.
              </p>
              <div className="text-center py-0.5">
                <MathRenderer text="$$\\begin{cases} 30x + 20y = 1100 \\\\ 20x + 20y = 900 \\end{cases} \\Rightarrow \\begin{cases} x = 20 \\\\ y = 25 \\end{cases}$$" block={true} />
              </div>
              <p className="font-bold text-emerald-800 text-[11px] font-sans">
                Giá bánh mì pate: 20.000đ; bánh mì trứng: 25.000đ.
              </p>
            </div>
          </div>
        </div>

        {/* PHỤ LỤC I & PHỤ LỤC III (CV 5512) */}
        <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-3 font-sans text-xs">
          <h3 className="font-bold text-sm text-slate-900 uppercase">
            IV. HỒ SƠ DẠY HỌC &amp; PHỤ LỤC (CHUẨN PL1 &amp; PL3 BGDĐT)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
            {/* Phiếu học tập số 1 */}
            <div className="p-3 bg-white rounded-lg border border-slate-300 space-y-1.5 text-xs">
              <strong className="text-blue-900 block font-bold">
                • PHỤ LỤC I: PHIẾU HỌC TẬP SỐ 1 (KHÁM PHÁ QUY TẮC)
              </strong>
              <table className="w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-1 text-left">Hệ phương trình</th>
                    <th className="border border-slate-300 p-1">Hệ số</th>
                    <th className="border border-slate-300 p-1">Phép tính triệt tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1 font-mono">{`{ 2x + 3y = 7 ; 2x - y = -1 }`}</td>
                    <td className="border border-slate-300 p-1 text-center">x cùng là 2</td>
                    <td className="border border-slate-300 p-1 text-center font-bold text-blue-700">Trừ từng vế</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-mono">{`{ 3x - 2y = 4 ; 2x + 2y = 6 }`}</td>
                    <td className="border border-slate-300 p-1 text-center">y đối (-2 và +2)</td>
                    <td className="border border-slate-300 p-1 text-center font-bold text-emerald-700">Cộng từng vế</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rubrics */}
            <div className="p-3 bg-white rounded-lg border border-slate-300 space-y-1.5 text-xs">
              <strong className="text-indigo-900 block font-bold">
                • PHỤ LỤC III: BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRICS)
              </strong>
              <div className="space-y-1 text-[11px] text-slate-700">
                <p><strong>- Tiêu chí 1 (Nhận diện hệ số):</strong> Chọn chính xác phép cộng/trừ để triệt tiêu biến (Mức 1: Cần cố gắng; Mức 2: Đạt; Mức 3: Tốt).</p>
                <p><strong>- Tiêu chí 2 (Kỹ năng tính toán):</strong> Biến đổi tương đương chính xác, không nhầm dấu trừ khi trừ đa thức (Mức 1, 2, 3).</p>
                <p><strong>- Tiêu chí 3 (Sử dụng MTCT):</strong> Bấm máy Casio fx-580VN X kiểm tra và kết luận đúng tập nghiệm (Mức 1, 2, 3).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] font-sans text-slate-500">
        <span>KHBD VIP Toán 9 KNTT Tập 1 • CV 5512 &amp; QĐ 2422/BGDĐT</span>
        <span className="font-bold">Trang 9 / 248</span>
      </div>
    </div>
  );
};

// Helper: Provide standard initial text for VIP pages 7-9
function getInitialVIPContent(): string {
  return `KHBD TOÁN 9-KNTT - TH NLS/AI NĂM HỌC 2026–2027
Năm học: 2026 - 2027

BÀI 2: GIẢI HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN (TIẾT 2)
Môn học: Toán học - Lớp: 9 (Bộ sách Kết nối tri thức với cuộc sống - Tập 1)
Thời lượng: 02 tiết (Thực hiện tiết: 02) • PPCT: Tuần 2 - Phân môn Đại số: Tiết 6

I. MỤC TIÊU DẠY HỌC (CHUẨN CÔNG VĂN 5512 & PL1 - PL3)
1. Về kiến thức:
- Hiểu rõ quy tắc cộng đại số và các bước giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp cộng đại số.
- Vận dụng thành thạo phương pháp cộng đại số trong cả 2 trường hợp:
  + TH1: Hệ số của cùng một ẩn bằng nhau (trừ từng vế) hoặc đối nhau (cộng từng vế).
  + TH2: Hệ số của cùng một ẩn không bằng nhau và không đối nhau (nhân hai vế với số thích hợp để quy về TH1).
- Sử dụng máy tính cầm tay Casio fx-580VN X / fx-880BTG kiểm tra nghiệm chính xác.
- Nhận biết trường hợp vô nghiệm ($0x = k, k \\neq 0$) hoặc vô số nghiệm ($0x = 0$).

2. Về năng lực:
a) Năng lực đặc thù: Tư duy và lập luận toán học; Giải quyết vấn đề toán học; Mô hình hóa toán học.
b) Năng lực chung & năng lực số: Tự chủ và tự học; Giao tiếp và hợp tác; Bấm máy Casio MENU 9 1 2.

3. Về phẩm chất: Chăm chỉ, trung thực, tinh thần trách nhiệm.

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
1. Giáo viên: KHBD chuẩn CV 5512, slide trình chiếu, Phiếu học tập số 1 & 2, bảng phụ nhóm A3.
2. Học sinh: SGK Toán 9 KNTT tập 1 (trang 10-12), máy tính cầm tay Casio fx-580VN X.

III. TIẾN TRÌNH DẠY HỌC

1. HOẠT ĐỘNG 1: MỞ ĐẦU / KHỞI ĐỘNG (5 phút)
a) Mục tiêu: Kích hoạt nhu cầu tìm phương pháp cộng đại số nhanh gọn hơn phương pháp thế.
b) Nội dung: Xét hệ phương trình:
$$\\begin{cases} 2x + y = 4 \\quad (1) \\\\ x - y = 1 \\quad (2) \\end{cases}$$
- Cách 1 (Thế): Rút $x = y + 1$ từ (2), thế vào (1) thu được nghiệm $(\\frac{5}{3}; \\frac{2}{3})$.
- Cách 2 (Cộng từng vế): Do hệ số $y$ đối nhau ($+1$ và $-1$):
$$(2x + y) + (x - y) = 4 + 1 \\Leftrightarrow 3x = 5 \\Leftrightarrow x = \\frac{5}{3} \\Rightarrow y = \\frac{2}{3}$$
=> Cộng từng vế làm biến mất ngay ẩn $y$, nhanh hơn rất nhiều!

2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (20 phút)
* MỤC 2: PHƯƠNG PHÁP CỘNG ĐẠI SỐ
[Quy tắc cộng đại số - SGK KNTT trang 10]
- Bước 1: Cộng hay trừ từng vế hai phương trình để được phương trình một ẩn.
- Bước 2: Giải phương trình một ẩn vừa nhận được, rồi suy ra nghiệm của hệ.
Bí quyết: Hệ số BẰNG NHAU thì TRỪ • Hệ số ĐỐI NHAU thì CỘNG.

[Trường hợp 1: Hệ số bằng nhau hoặc đối nhau]
* Ví dụ 2 (SGK trang 11): Giải hệ:
$$\\begin{cases} 2x + 3y = 7 \\quad (1) \\\\ 2x - y = -1 \\quad (2) \\end{cases}$$
Trừ từng vế (1) cho (2): $4y = 8 \\Leftrightarrow y = 2 \\Rightarrow x = \\frac{1}{2}$. Nghiệm: $(\\frac{1}{2}; 2)$.

* Ví dụ 3 (SGK trang 11): Giải hệ:
$$\\begin{cases} 3x - 2y = 4 \\quad (1) \\\\ 2x + 2y = 6 \\quad (2) \\end{cases}$$
Cộng từng vế (1) và (2): $5x = 10 \\Leftrightarrow x = 2 \\Rightarrow y = 1$. Nghiệm: $(2; 1)$.

[Trường hợp 2: Hệ số không bằng và không đối]
* Ví dụ 4 (SGK trang 12): Giải hệ:
$$\\begin{cases} 3x + 2y = 7 \\quad (1) \\\\ 2x + 3y = 3 \\quad (2) \\end{cases}$$
Nhân (1) với 2 và nhân (2) với 3:
$$\\begin{cases} 6x + 4y = 14 \\\\ 6x + 9y = 9 \\end{cases}$$
Trừ từng vế: $5y = -5 \\Leftrightarrow y = -1 \\Rightarrow x = 3$. Nghiệm: $(3; -1)$.

3. HOẠT ĐỘNG 3: LUYỆN TẬP (13 phút)
- Luyện tập 2 (SGK trang 11): Giải hệ $\\begin{cases} 3x + 2y = 6 \\\\ 2x - 2y = 14 \\end{cases} \\Rightarrow$ Nghiệm $(4; -3)$.
- Luyện tập 3 (SGK trang 12): Giải hệ $\\begin{cases} 4x + 3y = 6 \\\\ 2x + y = 4 \\end{cases} \\Rightarrow$ Nghiệm $(3; -2)$.
- Máy tính Casio fx-580VN X: MENU -> 9 -> 1 -> 2.

4. HOẠT ĐỘNG 4: VẬN DỤNG (7 phút)
- Tranh luận (SGK trang 12): Hệ $\\begin{cases} x - 2y = 1 \\\\ 3x + 2y = 11 \\end{cases}$. Cả Tròn và Vuông đều đúng.
- Bài toán thực tế tiệm bánh mì: Hệ $\\begin{cases} 30x + 20y = 1100 \\\\ 20x + 20y = 900 \\end{cases} \\Rightarrow x = 20, y = 25$ (nghìn đồng).

IV. HỒ SƠ DẠY HỌC & PHỤ LỤC (CHUẨN PL1 & PL3)
- Phụ lục I: Phiếu học tập số 1 (Khám phá quy tắc cộng đại số).
- Phụ lục III: Rubrics đánh giá 3 tiêu chí 4 mức độ.`;
}
