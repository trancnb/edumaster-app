import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  Presentation, 
  CheckSquare, 
  FileSpreadsheet, 
  Code, 
  Share2, 
  HelpCircle, 
  ArrowRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkspaceState } from '../types/edtech';
import { 
  exportKHBDToWord, 
  exportExamToWord, 
  exportMatrixToWord, 
  exportSlidesToPPTX, 
  downloadStandaloneHTMLFile 
} from '../utils/exportHelpers';

interface PublishCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: WorkspaceState;
}

export const PublishCelebrationModal: React.FC<PublishCelebrationModalProps> = ({
  isOpen,
  onClose,
  state
}) => {
  const [publishingState, setPublishingState] = useState<'processing' | 'done'>('processing');
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setPublishingState('processing');
      setSecondsElapsed(0);
      setShowGuide(true);
      return;
    }

    setPublishingState('processing');
    setSecondsElapsed(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const current = ((Date.now() - startTime) / 1000);
      setSecondsElapsed(Number(current.toFixed(1)));
    }, 100);

    // Simulate completion in 2.4s then fire fireworks
    const timer = setTimeout(() => {
      clearInterval(interval);
      setPublishingState('done');
      triggerCelebrationFireworks();
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isOpen]);

  const triggerCelebrationFireworks = () => {
    // Canvas confetti fireworks display
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#2563EB', '#10B981', '#F59E0B']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#8B5CF6', '#EC4899', '#06B6D4']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#10B981', '#F59E0B', '#3B82F6']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {publishingState === 'processing' ? 'Đang Xúc Tiến Xuất Bản...' : '🎉 Xuất Bản Kế Hoạch Bài Dạy Thành Công!'}
              </h2>
              <p className="text-xs text-blue-100">
                Hệ thống số hóa sư phạm KNTT • Chuẩn CV 5512 & 7991 BGDĐT
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Status Counter */}
          {publishingState === 'processing' ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-600 border-t-transparent animate-spin flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800 font-mono">
                  {secondsElapsed.toFixed(1)}s
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Đang biên dịch giáo án, tích hợp công thức LaTeX, tạo slide trình chiếu và xuất ma trận...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Congratulation Banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                      HOÀN TẤT TRONG {secondsElapsed.toFixed(1)} GIÂY!
                    </div>
                    <div className="text-xs text-emerald-800 font-medium">
                      {state.khbd.lessonName} • {state.khbd.teacherName ? `GV: ${state.khbd.teacherName} ` : ''}({state.khbd.className || '9A1'})
                    </div>
                    {state.khbd.notes && (
                      <div className="text-[11px] text-indigo-900 font-semibold bg-white/80 px-2 py-0.5 rounded-md mt-1 border border-indigo-200 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>{state.khbd.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{showGuide ? 'Ẩn Hướng Dẫn' : 'Xem Hướng Dẫn'}</span>
                </button>
              </div>

              {/* Pop-up Hướng dẫn người dùng Download về máy */}
              {showGuide && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs space-y-2 text-amber-950 animate-fadeIn">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>HƯỚNG DẪN TẢI VỀ & SỬ DỤNG TRÊN MÁY TÍNH:</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1 font-medium text-amber-900/90 leading-relaxed">
                    <li>
                      <strong>Tải Word (.doc):</strong> Mở trực tiếp bằng Microsoft Word 2016 trở lên hoặc Google Docs. Tất cả bảng biểu, 4 hoạt động CV 5512 đã căn lề chuẩn A4.
                    </li>
                    <li>
                      <strong>Tải PowerPoint (.pptx):</strong> Sử dụng cho giờ dạy trên lớp, có thể chỉnh sửa font chữ, hình ảnh, sơ đồ và chiếu trực tiếp máy chiếu.
                    </li>
                    <li>
                      <strong>Tải Single-File HTML Độc Lập:</strong> File duy nhất chứa toàn bộ KHBD, Slide có hiệu ứng, chạy offline 100% không cần Internet hoặc phần mềm cài đặt.
                    </li>
                    <li>
                      <strong>Tải Đề Kiểm Tra & Ma Trận:</strong> Bám sát quy chuẩn CV 7991 (40% NB - 30% TH - 30% VD) kèm bản đặc tả câu hỏi và đáp án chi tiết.
                    </li>
                  </ol>
                </div>
              )}

              {/* Action Buttons to Download */}
              <div className="space-y-2.5">
                <div className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  DANH MỤC TÀI LIỆU SẴN SÀNG TẢI VỀ:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Download Word KHBD */}
                  <button
                    onClick={() => exportKHBDToWord(state)}
                    className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-blue-200 hover:border-blue-600 bg-white hover:bg-blue-50/60 transition group shadow-xs text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Kế Hoạch Bài Dạy (Word)</div>
                        <div className="text-[10px] text-slate-500 font-medium">Chuẩn CV 5512 BGD&ĐT (.doc)</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>

                  {/* Download PPTX Slides */}
                  <button
                    onClick={() => exportSlidesToPPTX(state)}
                    className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-white hover:bg-purple-50/60 transition group shadow-xs text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                        <Presentation className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Slide Trình Chiếu (PPTX)</div>
                        <div className="text-[10px] text-slate-500 font-medium">Toán 9 Mẫu Chuẩn GDPT 2018</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  </button>

                  {/* Download Exam Word */}
                  <button
                    onClick={() => exportExamToWord(state)}
                    className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/60 transition group shadow-xs text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Đề Thi & Đáp Án (Word)</div>
                        <div className="text-[10px] text-slate-500 font-medium">Chuẩn CV 7991 BGD&ĐT (.doc)</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                  </button>

                  {/* Download Matrix Word */}
                  <button
                    onClick={() => exportMatrixToWord(state)}
                    className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-amber-200 hover:border-amber-600 bg-white hover:bg-amber-50/60 transition group shadow-xs text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Bảng Đặc Tả Ma Trận</div>
                        <div className="text-[10px] text-slate-500 font-medium">Tỷ lệ 40-30-30 (.doc)</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                  </button>
                </div>

                {/* Single file HTML download */}
                <button
                  onClick={() => downloadStandaloneHTMLFile(state)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs hover:from-emerald-500 hover:to-teal-600 transition shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    <Code className="w-4 h-4 text-amber-300" />
                    <span>Tải Gói Single-File HTML Độc Lập (Chạy offline không cần mạng)</span>
                  </div>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Hệ thống sẵn sàng xuất bản và phân phối tài liệu</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerCelebrationFireworks}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Bắn pháo hoa 🎉</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
