import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  AlertOctagon, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { OriginalFileItem } from './OriginalFileViewerModal';

interface KHBDConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverwrite: () => void;
  targetGrade: string;
  existingFiles: OriginalFileItem[];
  conflictType?: 'ppct' | 'khbd';
  newFile: {
    name: string;
    size: string;
    type?: string;
  } | null;
}

export const KHBDConflictModal: React.FC<KHBDConflictModalProps> = ({
  isOpen,
  onClose,
  onConfirmOverwrite,
  targetGrade,
  existingFiles,
  conflictType = 'khbd',
  newFile
}) => {
  const [level, setLevel] = useState<1 | 2>(1);
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);
  const [confirmKeyword, setConfirmKeyword] = useState('');

  if (!isOpen || !newFile) return null;

  const handleClose = () => {
    setLevel(1);
    setHasConfirmedCheckbox(false);
    setConfirmKeyword('');
    onClose();
  };

  const isLevel2Valid = hasConfirmedCheckbox && confirmKeyword.trim().toUpperCase() === 'XÁC NHẬN';

  const handleFinalConfirm = () => {
    if (!isLevel2Valid) return;
    setLevel(1);
    setHasConfirmedCheckbox(false);
    setConfirmKeyword('');
    onConfirmOverwrite();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border-2 border-rose-500 overflow-hidden transform transition-all animate-scaleUp flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white p-4 sm:p-5 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
              {level === 1 ? <AlertTriangle className="w-6 h-6 text-amber-300" /> : <ShieldAlert className="w-6 h-6 text-yellow-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded text-rose-100 border border-white/10">
                  {conflictType === 'ppct' ? 'Quy định: Mỗi khối chỉ có 1 PPCT (Nạp thêm là không được)' : 'Quy định: Mỗi khối chỉ có 1 KHBD'}
                </span>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  Xác nhận Cấp độ {level}/2
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1 leading-snug">
                {conflictType === 'ppct' 
                  ? `BÁO LỖI: TRÙNG LẶP PHÂN PHỐI CHƯƠNG TRÌNH (PPCT) ${targetGrade.toUpperCase()}`
                  : `BÁO LỖI: TRÙNG LẶP KẾ HOẠCH BÀI DẠY (KHBD) ${targetGrade.toUpperCase()}`
                }
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/15 transition"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEPPER PROGRESS BAR */}
        <div className="bg-rose-50/80 px-5 py-2.5 border-b border-rose-200 flex items-center justify-between text-xs shrink-0 font-bold">
          <div className={`flex items-center gap-1.5 ${level === 1 ? 'text-rose-700 font-black' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${level === 1 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              1
            </span>
            <span>Cấp độ 1: Cảnh báo mất toàn bộ file cũ</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-rose-300" />
          <div className={`flex items-center gap-1.5 ${level === 2 ? 'text-rose-700 font-black' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${level === 2 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span>Cấp độ 2: Cam kết & Xác nhận ghi đè</span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">

          {level === 1 ? (
            /* ================= LEVEL 1 ================= */
            <div className="space-y-4">
              <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-black text-rose-950 text-sm">
                    {conflictType === 'ppct' 
                      ? `Khối ${targetGrade} hiện đã có 1 file PPCT được nạp trước đó!`
                      : `Khối ${targetGrade} hiện đã có 1 file KHBD được nạp trước đó!`
                    }
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {conflictType === 'ppct' ? (
                      <>Quy định hệ thống: <strong>Mỗi khối chỉ có 1 PPCT, nạp thêm PPCT là không được phép</strong>. Khi bạn nạp thêm file PPCT mới mà bị trùng khối, hệ thống bắt buộc báo lỗi và kích hoạt quy trình xác nhận 2 cấp độ; đồng thời cảnh báo mất toàn bộ file PPCT cũ của {targetGrade}.</>
                    ) : (
                      <>Quy định hệ thống: <strong>Mỗi khối chỉ có 1 KHBD, nạp thêm KHBD là không được phép</strong>. Khi bạn nạp thêm KHBD mới mà bị trùng khối, hệ thống bắt buộc báo lỗi và yêu cầu xác nhận 2 cấp độ; đồng thời cảnh báo mất toàn bộ file cũ.</>
                    )}
                  </p>
                </div>
              </div>

              {/* So sánh File Cũ và File Mới */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Cũ Sẽ Bị Xóa */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-500">
                      File cũ đang có ({existingFiles.length} file):
                    </span>
                    <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold border border-rose-200">
                      Sẽ bị xóa sạch
                    </span>
                  </div>
                  {existingFiles.length > 0 ? (
                    <div className="space-y-1">
                      {existingFiles.slice(0, 3).map((f, i) => (
                        <div key={i} className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({f.size})</span>
                        </div>
                      ))}
                      {existingFiles.length > 3 && (
                        <span className="text-[10px] text-slate-400 italic block">
                          ...và {existingFiles.length - 3} file liên quan khác
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">KHBD chuẩn mặc định hệ thống</p>
                  )}
                </div>

                {/* File Mới Chuẩn Bị Nạp */}
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-emerald-800">
                      File mới muốn nạp:
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-white px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                      File thay thế
                    </span>
                  </div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{newFile.name}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Dung lượng: <strong>{newFile.size}</strong> • Định dạng: <strong>{newFile.type || 'DOCX'}</strong>
                  </div>
                </div>
              </div>

              {/* Hộp Cảnh Báo Mất Toàn Bộ File Cũ Nghiêm Trọng */}
              <div className="p-4 bg-red-100/80 border-2 border-red-500 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-red-900 font-black text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{conflictType === 'ppct' ? 'CẢNH BÁO MẤT TOÀN BỘ FILE PPCT CŨ:' : 'CẢNH BÁO MẤT TOÀN BỘ FILE CŨ:'}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-red-900 font-medium leading-relaxed pl-1">
                  <li>
                    {conflictType === 'ppct' ? (
                      <>Nếu tiếp tục, <strong>toàn bộ file PPCT và phân phối chương trình cũ của {targetGrade} sẽ bị XÓA HOÀN TOÀN</strong> và thay bằng file mới!</>
                    ) : (
                      <>Nếu tiếp tục, <strong>toàn bộ file tài liệu, bài tập mẫu và dữ liệu KHBD cũ của {targetGrade} sẽ bị XÓA HOÀN TOÀN</strong> và không thể khôi phục lại!</>
                    )}
                  </li>
                  <li>
                    Hệ thống sẽ dọn dẹp sạch sẽ không gian làm việc của {targetGrade} để nạp duy nhất 1 file mới: <strong>{newFile.name}</strong>.
                  </li>
                  <li>
                    Để tiếp tục thao tác nguy hiểm này, bạn bắt buộc phải hoàn thành <strong>Xác nhận Cấp độ 2</strong>.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* ================= LEVEL 2 ================= */
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-amber-950 text-sm">
                    Xác nhận cấp độ 2: Yêu cầu cam kết trước khi ghi đè
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    Bạn đang chuẩn bị xóa vĩnh viễn toàn bộ file {conflictType === 'ppct' ? 'PPCT' : 'KHBD'} cũ của <strong>{targetGrade}</strong> để thay thế bằng <strong>{newFile.name}</strong>.
                  </p>
                </div>
              </div>

              {/* Hộp kiểm Cam kết 1 */}
              <label className="flex items-start gap-3 p-3.5 bg-slate-50 hover:bg-rose-50/50 rounded-2xl border-2 border-slate-300 hover:border-rose-300 cursor-pointer transition select-none">
                <input
                  type="checkbox"
                  checked={hasConfirmedCheckbox}
                  onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
                  className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-slate-300 mt-0.5 cursor-pointer shrink-0"
                />
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                    Tôi xác nhận và đồng ý xóa sạch toàn bộ file {conflictType === 'ppct' ? 'PPCT' : 'KHBD'} cũ của {targetGrade}
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    Tôi hiểu rõ hành động ghi đè này không thể hoàn tác và chấp nhận mất toàn bộ file tài liệu cũ của khối này.
                  </span>
                </div>
              </label>

              {/* Ô Nhập Từ Khóa Bảo Vệ */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-300 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Nhập chính xác từ khóa <span className="font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">XÁC NHẬN</span> vào ô dưới đây để mở khóa:
                </label>
                <input
                  type="text"
                  value={confirmKeyword}
                  onChange={(e) => setConfirmKeyword(e.target.value)}
                  placeholder="Gõ chính xác: XÁC NHẬN"
                  className="w-full text-xs font-black p-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white tracking-widest text-slate-900 uppercase"
                />
                {confirmKeyword.trim() && confirmKeyword.trim().toUpperCase() !== 'XÁC NHẬN' && (
                  <p className="text-[11px] text-rose-600 font-bold">
                    ⚠️ Từ khóa chưa đúng! Vui lòng gõ chính xác: XÁC NHẬN
                  </p>
                )}
                {confirmKeyword.trim().toUpperCase() === 'XÁC NHẬN' && (
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã nhập đúng từ khóa!
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-slate-100 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Hủy bỏ (Giữ nguyên file cũ)
          </button>

          {level === 1 ? (
            <button
              type="button"
              onClick={() => setLevel(2)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md shadow-rose-600/30"
            >
              <span>Tôi hiểu cảnh báo mất file • Tiếp tục Cấp độ 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setLevel(1)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Quay lại Cấp 1</span>
              </button>
              <button
                type="button"
                disabled={!isLevel2Valid}
                onClick={handleFinalConfirm}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md ${
                  isLevel2Valid
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 cursor-pointer active:scale-95'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {conflictType === 'ppct' 
                    ? '⚠️ XÁC NHẬN THAY THẾ PPCT & XÓA SẠCH FILE CŨ' 
                    : '⚠️ XÁC NHẬN GHI ĐÈ & XÓA SẠCH FILE CŨ'}
                </span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
