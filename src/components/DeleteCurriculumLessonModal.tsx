import React, { useMemo } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Layers, 
  AlertCircle, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CurriculumEntry } from '../types/edtech';
import { splitLessonTitle } from '../utils/curriculumHelpers';

interface DeleteCurriculumLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: CurriculumEntry | null;
  allEntries: CurriculumEntry[];
  onConfirmDelete: (deleteAllSister: boolean) => void;
}

export const DeleteCurriculumLessonModal: React.FC<DeleteCurriculumLessonModalProps> = ({
  isOpen,
  onClose,
  entry,
  allEntries,
  onConfirmDelete
}) => {
  const lessonName = entry?.lessonName || '';

  // Tách tiêu đề gốc và tìm các tiết anh em cùng bài
  const { mainTitle, periodSubtitle } = useMemo(() => splitLessonTitle(lessonName), [lessonName]);
  
  const cleanBase = useMemo(() => {
    return mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim();
  }, [mainTitle]);

  const sisterEntries = useMemo(() => {
    if (!cleanBase) return [];
    return (allEntries || []).filter(e => {
      const eParsed = splitLessonTitle(e.lessonName);
      const eClean = eParsed.mainTitle
        .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
        .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
        .trim();
      return eClean.toLowerCase() === cleanBase.toLowerCase();
    });
  }, [allEntries, cleanBase]);

  const sisterCount = sisterEntries.length > 0 ? sisterEntries.length : (entry?.periodsCount || 1);
  const isMultiPeriod = sisterCount > 1;

  // Tiết hiện tại đang bấm xóa
  const matchPeriod = entry ? entry.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i) : null;
  const currentPeriodNum = matchPeriod ? parseInt(matchPeriod[1], 10) : 1;

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border-2 border-rose-400 overflow-hidden animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        {/* Header với phong cách cảnh báo sư phạm rõ ràng */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-rose-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-bold shadow-inner shrink-0">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase text-rose-200 block">
                Phân phối chương trình • Điều chỉnh tiết
              </span>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                {isMultiPeriod ? `Xác nhận xóa bài học (${sisterCount} tiết)` : 'Xác nhận xóa tiết học'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung thông tin bài học cần xóa */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Card tóm tắt bài */}
          <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-md">
                {entry.branch} • Tuần {entry.week}
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-white border border-rose-300 px-2 py-0.5 rounded-md">
                {isMultiPeriod ? `Cả bài gồm ${sisterCount} tiết` : 'Bài 1 tiết'}
              </span>
            </div>

            <div className="text-sm font-black text-slate-900 leading-snug">
              {cleanBase}
            </div>

            {periodSubtitle && (
              <div className="text-[11px] text-rose-900 font-semibold bg-white/90 p-1.5 rounded-lg border border-rose-200 inline-block">
                Thẻ này: {periodSubtitle}
              </div>
            )}

            <div className="text-[11px] text-slate-600 line-clamp-1">
              Chương: {entry.chapter}
            </div>
          </div>

          {/* Nếu bài có từ 2 tiết trở lên: hiển thị danh sách các tiết cùng bài */}
          {isMultiPeriod && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-[11px]">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Chi tiết các tiết của bài này trong PPCT:</span>
              </div>
              <ul className="space-y-1 pl-1 text-slate-700">
                {sisterEntries.map((s, idx) => (
                  <li key={s.id} className="flex items-center justify-between bg-white/80 px-2 py-1 rounded border border-amber-200/60 font-medium">
                    <span className="truncate max-w-[70%]">
                      • {s.lessonName.replace(/\n/g, ' ')}
                    </span>
                    <span className="font-bold text-slate-800 shrink-0">
                      Tuần {s.week} ({s.branch === 'Hình học' ? `Hình: T${s.periodNumber}` : `Số: T${s.periodNumber}`})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Giải thích quy trình tự động sư phạm sau khi xóa */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-[11px] text-blue-900">
            <p className="font-bold">Quy tắc tự động cập nhật sau khi xóa:</p>
            <p className="text-slate-600">
              • Toàn bộ các tiết phía sau sẽ <strong>tự động dồn lên</strong> để bảo đảm thứ tự liên tục 4 tiết/tuần.
            </p>
            <p className="text-slate-600">
              • Bạn có thể dùng tính năng <strong>"+ Tạo mới tiết"</strong> để bổ sung tiết bài mới cho đúng định mức 140 tiết.
            </p>
          </div>

          {/* Các nút lựa chọn xóa */}
          <div className="pt-2 space-y-2">
            {isMultiPeriod ? (
              <>
                {/* Lựa chọn 1: Xóa TOÀN BỘ CẢ 2 TIẾT (theo đúng yêu cầu người dùng: 'nếu 2 tiết thì xóa cả hai') */}
                <button
                  type="button"
                  onClick={() => onConfirmDelete(true)}
                  className="w-full p-3 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-xl font-black text-xs flex items-center justify-between shadow-md shadow-rose-600/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-white shrink-0" />
                    <span>✓ Xóa toàn bộ bài (Cả {sisterCount} tiết)</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold">
                    Khuyên dùng
                  </span>
                </button>

                {/* Lựa chọn 2: Chỉ xóa riêng tiết đang chọn */}
                <button
                  type="button"
                  onClick={() => onConfirmDelete(false)}
                  className="w-full p-2.5 bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 rounded-xl font-bold text-xs flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Chỉ xóa riêng tiết này (Tiết {currentPeriodNum})</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Giữ lại các tiết khác
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onConfirmDelete(false)}
                className="w-full p-3 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>Xác nhận xóa tiết học này</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
