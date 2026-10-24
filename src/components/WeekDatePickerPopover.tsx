import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, RotateCcw, X, Check, Clock } from 'lucide-react';
import { 
  getMondayOfWeek, 
  getSaturdayOfWeek, 
  formatDateShort, 
  toISODateString,
  WeekDateInfo 
} from '../utils/weekDateManager';

interface WeekDatePickerPopoverProps {
  week: number;
  semester: number;
  weekInfo: WeekDateInfo;
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  onShiftWeek: (daysOffset: number) => void;
  onReset: () => void;
}

export const WeekDatePickerPopover: React.FC<WeekDatePickerPopoverProps> = ({
  week,
  semester,
  weekInfo,
  isOpen,
  onClose,
  onSelectDate,
  onShiftWeek,
  onReset
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ngày hiện tại đang được chọn (ISO YYYY-MM-DD)
  const [selectedIsoDate, setSelectedIsoDate] = useState<string>(toISODateString(weekInfo.monday));

  useEffect(() => {
    setSelectedIsoDate(toISODateString(weekInfo.monday));
  }, [weekInfo.monday]);

  // Tự động focus hoặc click vào input date khi mở
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Cho phép người dùng thấy input lịch ngay
      setTimeout(() => {
        try {
          if ('showPicker' in HTMLInputElement.prototype && inputRef.current) {
            inputRef.current.showPicker();
          }
        } catch {
          // Fallback nếu browser không cho showPicker tự động
        }
      }, 100);
    }
  }, [isOpen]);

  // Click outside để đóng
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Tính thử Thứ 2 và Thứ 7 theo ngày đang chọn
  const previewMonday = getMondayOfWeek(new Date(selectedIsoDate));
  const previewSaturday = getSaturdayOfWeek(previewMonday);
  const previewRangeStr = `(${formatDateShort(previewMonday)}-${formatDateShort(previewSaturday)})`;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    setSelectedIsoDate(val);
    const chosenDate = new Date(val);
    onSelectDate(chosenDate);
  };

  return (
    <div 
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute left-0 top-full mt-1.5 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-blue-200 p-4 text-slate-800 animate-fadeIn"
      style={{ filter: 'drop-shadow(0 10px 25px rgba(30, 58, 138, 0.18))' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-blue-950 flex items-center gap-1.5">
              <span>Tuần {week} • Học kì {semester}</span>
              {weekInfo.isOverridden && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                  Đã chỉnh
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-500">
              Chọn bất kì ngày nào trong tuần để áp dụng
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Bộ chọn lịch (Calendar input) */}
      <div className="mt-3 bg-blue-50/60 rounded-xl p-3 border border-blue-100">
        <label className="block text-xs font-bold text-blue-900 mb-1.5 flex items-center justify-between">
          <span>📅 Bấm mở Lịch chọn ngày:</span>
          <span className="text-[11px] text-blue-600 font-normal">Tự lấy Thứ 2 ➔ Thứ 7</span>
        </label>
        
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="date"
            value={selectedIsoDate}
            onChange={handleDateChange}
            className="w-full bg-white text-slate-800 font-bold text-xs sm:text-sm px-3 py-2 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
          />
        </div>

        {/* Kết quả tính toán Thứ 2 -> Thứ 7 */}
        <div className="mt-2.5 pt-2.5 border-t border-blue-200/60 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Khoảng ngày tuần:</span>
          <span className="font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
            {previewRangeStr}
          </span>
        </div>
      </div>

      {/* Thông báo quy tắc rải ngày tự động */}
      <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 leading-relaxed flex items-start gap-1.5">
        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Tự động rải ngày:</strong> Khi chỉnh tại Tuần {week}, ngày mới sẽ <strong>tự động có hiệu lực tiếp nối cho tất cả các tuần sau</strong> (từ Tuần {week} đến hết năm học).
        </div>
      </div>

      {/* Nút tác vụ nhanh: +1 tuần (nghỉ lễ / Tết), -1 tuần, khôi phục */}
      <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onShiftWeek(-7)}
            className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-0.5 transition shadow-2xs"
            title="Lùi 1 tuần (-7 ngày)"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>-1 Tuần</span>
          </button>

          <button
            type="button"
            onClick={() => onShiftWeek(7)}
            className="px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-0.5 transition shadow-2xs"
            title="Tăng 1 tuần (+7 ngày) - Dành cho nghỉ Tết, nghỉ lễ"
          >
            <span>+1 Tuần (Nghỉ)</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {weekInfo.isOverridden && (
            <button
              type="button"
              onClick={onReset}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Khôi phục ngày mặc định theo năm học"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition shadow-2xs"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};
