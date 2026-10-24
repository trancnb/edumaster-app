import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  Save, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Download, 
  AlertTriangle, 
  ShieldCheck,
  FileText,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { CurriculumEntry, GradeLevel } from '../types/edtech';

interface PPCTSaveExportConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: CurriculumEntry[];
  currentGrade: GradeLevel;
  onConfirmOverwrite: () => void;
  onConfirmExportWord: () => void;
  onConfirmBoth: () => void;
}

export const PPCTSaveExportConfirmModal: React.FC<PPCTSaveExportConfirmModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentGrade,
  onConfirmOverwrite,
  onConfirmExportWord,
  onConfirmBoth
}) => {
  const [selectedOption, setSelectedOption] = useState<'overwrite' | 'export' | 'both'>('both');

  if (!isOpen) return null;

  // Thống kê phân môn và định mức tuần
  const totalPeriods = entries.length;
  let countHK1 = 0;
  let countHK2 = 0;
  const weekCounts = new Map<number, number>();

  entries.forEach(e => {
    if (e.semester === 1) countHK1++;
    if (e.semester === 2) countHK2++;
    weekCounts.set(e.week, (weekCounts.get(e.week) || 0) + 1);
  });

  const unbalancedWeeks: number[] = [];
  weekCounts.forEach((count, w) => {
    if (count !== 4) unbalancedWeeks.push(w);
  });

  const isFullyBalanced = unbalancedWeeks.length === 0;

  const handleExecute = () => {
    if (selectedOption === 'overwrite') {
      onConfirmOverwrite();
    } else if (selectedOption === 'export') {
      onConfirmExportWord();
    } else {
      onConfirmBoth();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-600/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-bold shadow-inner">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  Lưu & Xuất Phân Phối Chương Trình
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30">
                  {currentGrade}
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Xác nhận ghi đè dữ liệu hệ thống hoặc xuất file Word DOCX nguyên mẫu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
          
          {/* Tóm tắt tình trạng phân phối chương trình */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-600 font-medium">
              <span>Định mức tổng số tiết:</span>
              <strong className="text-slate-900 text-sm">{totalPeriods} tiết (HK1: {countHK1} • HK2: {countHK2})</strong>
            </div>

            <div className="flex items-center justify-between text-slate-600 font-medium pt-1 border-t border-slate-200">
              <span>Ràng buộc định mức tuần (4 tiết/tuần):</span>
              {isFullyBalanced ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% các tuần đạt chuẩn 4 tiết/tuần</span>
                </span>
              ) : (
                <span className="text-amber-800 font-bold flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Có {unbalancedWeeks.length} tuần chưa đạt 4 tiết (Tuần {unbalancedWeeks.slice(0, 4).join(', ')}{unbalancedWeeks.length > 4 ? '...' : ''})</span>
                </span>
              )}
            </div>
          </div>

          {/* Câu hỏi lựa chọn hành động */}
          <div className="space-y-2">
            <label className="font-black text-xs uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Bạn muốn thực hiện thao tác nào với PPCT đã chỉnh sửa?</span>
            </label>

            {/* 3 Lựa chọn rõ ràng */}
            <div className="space-y-2.5">
              
              {/* Lựa chọn 1: GHI ĐÈ ĐỒNG THỜI XUẤT FILE (Khuyên dùng) */}
              <label 
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  selectedOption === 'both' 
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="ppct_action"
                  checked={selectedOption === 'both'}
                  onChange={() => setSelectedOption('both')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-blue-950">
                      1. Ghi đè lên PPCT hiện tại ĐỒNG THỜI Xuất file DOCX
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white uppercase">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Vừa lưu lại cấu trúc PPCT mới vào hệ thống để tiếp tục soạn bài ở Bước 4, vừa tự động tải về file Word .docx nguyên mẫu 100% chuẩn Bộ GD&ĐT (có khung, cột, viền, chữ ký).
                  </p>
                </div>
              </label>

              {/* Lựa chọn 2: CHỈ GHI ĐÈ LÊN PPCT HIỆN TẠI TRONG HỆ THỐNG */}
              <label 
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  selectedOption === 'overwrite' 
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="ppct_action"
                  checked={selectedOption === 'overwrite'}
                  onChange={() => setSelectedOption('overwrite')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      2. Ghi đè lên PPCT hiện tại trong hệ thống
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Cập nhật thay đổi vào kho lưu trữ PPCT đang kích hoạt của {currentGrade}. Tất cả các bài dạy, tuần, tiết sẽ đồng bộ ngay lập tức cho các bước tiếp theo.
                  </p>
                </div>
              </label>

              {/* Lựa chọn 3: CHỈ XUẤT RA FILE DOCX NGUYÊN MẪU ĐỂ XEM LẠI */}
              <label 
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  selectedOption === 'export' 
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="ppct_action"
                  checked={selectedOption === 'export'}
                  onChange={() => setSelectedOption('export')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      3. Xuất ra file DOCX nguyên mẫu để xem lại
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Tải về tệp Microsoft Word (.docx) đúng định dạng hành chính, đầy đủ bảng cột 140 tiết để giáo viên in ấn hoặc lưu trữ riêng, không làm thay đổi PPCT đang chạy trong hệ thống.
                  </p>
                </div>
              </label>

            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center gap-2 text-[11px] text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>File DOCX xuất ra bảo đảm 100% nguyên mẫu chuẩn Bộ GD&ĐT, đầy đủ cột, khung và có thể chỉnh sửa tự do trên Word.</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl transition text-xs cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleExecute}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            {selectedOption === 'overwrite' ? (
              <>
                <Save className="w-4 h-4" />
                <span>Xác nhận ghi đè PPCT</span>
              </>
            ) : selectedOption === 'export' ? (
              <>
                <FileDown className="w-4 h-4" />
                <span>Tải file Word (.docx)</span>
              </>
            ) : (
              <>
                <HardDrive className="w-4 h-4" />
                <span>Ghi đè & Tải file DOCX</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
