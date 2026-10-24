import React from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  FolderCheck, 
  FileText, 
  CheckCircle2, 
  FolderKanban,
  AlertTriangle
} from 'lucide-react';
import { GradeLevel } from '../types/edtech';

interface SmartGradeDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  detectedGrade: GradeLevel;
  currentGrade: GradeLevel;
  onConfirmSwitchAndSave: () => void;
  onConfirmSaveToDetectedGradeOnly: () => void;
  onConfirmKeepInCurrentGrade: () => void;
}

export const SmartGradeDetectionModal: React.FC<SmartGradeDetectionModalProps> = ({
  isOpen,
  onClose,
  fileName,
  detectedGrade,
  currentGrade,
  onConfirmSwitchAndSave,
  onConfirmSaveToDetectedGradeOnly,
  onConfirmKeepInCurrentGrade
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-300 w-full max-w-lg overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-950" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                Hệ Thống Tự Nhận Biết Khối Lớp
              </h3>
              <p className="text-[11px] text-blue-200 mt-0.5">
                Phát hiện tệp tài liệu thuộc khối lớp khác với không gian đang mở
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-5 sm:p-6 space-y-4 text-xs font-sans">
          {/* File match card */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-slate-900 truncate" title={fileName}>
                {fileName}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-blue-200/60 text-[11px]">
              <div>
                Khối nhận diện: <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">{detectedGrade}</span>
              </div>
              <div>
                Khối đang mở: <span className="font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">{currentGrade}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Thầy/Cô đang mở không gian soạn bài <strong>{currentGrade}</strong>, nhưng tệp tải lên được hệ thống nhận diện thuộc <strong>{detectedGrade}</strong>.
            Để đảm bảo tính khoa học và không bị lẫn lộn giữa các khối, Thầy/Cô muốn xử lý thế nào?
          </p>

          {/* 3 ACTION CHOICES */}
          <div className="space-y-2.5 pt-1">
            {/* CHOICE 1: SWITCH & SAVE */}
            <button
              type="button"
              onClick={onConfirmSwitchAndSave}
              className="w-full p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center justify-between transition shadow-md group text-left"
            >
              <div className="space-y-0.5">
                <div className="font-black text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>1. Lưu vào {detectedGrade} & Chuyển sang {detectedGrade} ngay (Khuyên dùng)</span>
                </div>
                <div className="text-[10px] text-blue-100">
                  Tự động lưu vào ngăn {detectedGrade}, chuyển giao diện sang {detectedGrade}. Dữ liệu {currentGrade} được bảo toàn nguyên vẹn.
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition shrink-0 ml-2" />
            </button>

            {/* CHOICE 2: SAVE TO DETECTED GRADE ONLY */}
            <button
              type="button"
              onClick={onConfirmSaveToDetectedGradeOnly}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold flex items-center justify-between transition text-left"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-xs flex items-center gap-1.5 text-slate-900">
                  <FolderCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. Chỉ lưu vào ngăn {detectedGrade}, tiếp tục ở {currentGrade}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Tài liệu sẽ nằm sẵn trong ngăn {detectedGrade} để dùng sau. Thầy/Cô tiếp tục soạn bài ở {currentGrade}.
                </div>
              </div>
            </button>

            {/* CHOICE 3: KEEP IN CURRENT GRADE */}
            <button
              type="button"
              onClick={onConfirmKeepInCurrentGrade}
              className="w-full p-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg text-[11px] font-semibold text-center transition"
            >
              3. Vẫn gán vào {currentGrade} (Tài liệu tham khảo chung)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
