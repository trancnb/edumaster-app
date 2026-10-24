import React from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';

interface PPCTDeleteWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetFileName?: string;
  gradeName?: string;
  isDeleteGrade?: boolean;
}

export const PPCTDeleteWarningModal: React.FC<PPCTDeleteWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetFileName,
  gradeName,
  isDeleteGrade = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border-2 border-rose-400 overflow-hidden transform transition-all animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Alert styling */}
        <div className="bg-rose-50 border-b border-rose-200 p-4 sm:p-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-widest uppercase text-rose-600 block">
                Cảnh báo • Dữ liệu bài dạy & PPCT
              </span>
              <h3 className="text-base sm:text-lg font-black text-rose-950">
                XÁC NHẬN XÓA TÀI LIỆU PPCT
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-rose-100 transition"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-rose-900 leading-snug">
                Lưu ý khi xóa tài liệu PPCT:
              </p>
              <p className="text-xs text-rose-700 mt-1 font-medium leading-relaxed">
                Khi xóa hết tài liệu PPCT của {gradeName || 'khối này'}, các bài nạp và tài liệu mẫu bám theo sẽ được xóa sạch để đảm bảo tính đồng bộ theo Khối, Môn, Tuần, Tiết.
              </p>
            </div>
          </div>

          {targetFileName && (
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
              Tài liệu yêu cầu xóa: <strong className="text-slate-900">{targetFileName}</strong>
            </div>
          )}

          <div className="text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800">
              Các mục sẽ được dọn dẹp:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
              <li>Xóa tài liệu PPCT 140 tiết của {gradeName || 'khối này'}.</li>
              <li>Xóa các bài nạp mẫu và tài liệu bám theo tương ứng.</li>
              <li>Tự động đồng bộ lại không gian làm việc.</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xác nhận xóa tài liệu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
