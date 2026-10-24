import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Layers, 
  Calendar, 
  Sparkles, 
  Check, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { CurriculumEntry, GradeLevel } from '../types/edtech';
import { ensureLessonTitleHasPeriodCount } from '../utils/curriculumHelpers';

export interface CreateLessonFormData {
  mainTitle: string;
  chapter: string;
  branch: 'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Kiểm tra' | 'Thực hành trải nghiệm';
  week: number;
  periodsCount: number;
  subtitles: Record<number, string>;
  digitalCompetency: string;
  equipment: string;
}

interface CreateCurriculumLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWeek: number;
  currentGrade: GradeLevel;
  allEntries: CurriculumEntry[];
  onCreateLesson: (data: CreateLessonFormData) => void;
}

export const CreateCurriculumLessonModal: React.FC<CreateCurriculumLessonModalProps> = ({
  isOpen,
  onClose,
  targetWeek: initialTargetWeek,
  currentGrade,
  allEntries,
  onCreateLesson
}) => {
  // Lấy gợi ý chương từ các bài trong tuần được chọn
  const defaultChapter = (() => {
    const weekEntries = (allEntries || []).filter(e => e.week === initialTargetWeek);
    if (weekEntries.length > 0 && weekEntries[0].chapter) {
      return weekEntries[0].chapter;
    }
    return 'Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn';
  })();

  const [mainTitle, setMainTitle] = useState('');
  const [chapter, setChapter] = useState(defaultChapter);
  const [branch, setBranch] = useState<'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Kiểm tra' | 'Thực hành trải nghiệm'>('Đại số');
  const [targetWeek, setTargetWeek] = useState<number>(initialTargetWeek || 1);
  const [totalPeriodsInLesson, setTotalPeriodsInLesson] = useState<number>(2);
  const [subtitles, setSubtitles] = useState<Record<number, string>>({
    1: 'Tiết 1: Khái niệm và phương pháp',
    2: 'Tiết 2: Luyện tập và vận dụng'
  });
  const [digitalCompetency, setDigitalCompetency] = useState('3.1TC2a: Tìm kiếm và xử lý dữ liệu số bằng bảng tính');
  const [equipment, setEquipment] = useState('Máy tính, ti vi kết nối mạng, MTCT, SGK Toán 9');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cập nhật khi targetWeek ban đầu thay đổi
  useEffect(() => {
    setTargetWeek(initialTargetWeek || 1);
    const weekEntries = allEntries.filter(e => e.week === initialTargetWeek);
    if (weekEntries.length > 0 && weekEntries[0].chapter) {
      setChapter(weekEntries[0].chapter);
    }
  }, [initialTargetWeek, allEntries]);

  // Cập nhật khi thay đổi số tiết bài
  const handlePeriodCountChange = (count: number) => {
    setTotalPeriodsInLesson(count);
    const newSubs: Record<number, string> = { ...subtitles };
    for (let i = 1; i <= count; i++) {
      if (!newSubs[i]) {
        newSubs[i] = `Tiết ${i}`;
      }
    }
    setSubtitles(newSubs);
  };

  const handleSubtitleChange = (pNum: number, text: string) => {
    setSubtitles(prev => ({ ...prev, [pNum]: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainTitle.trim()) {
      setErrorMsg('Vui lòng nhập Tên bài dạy!');
      return;
    }
    setErrorMsg(null);

    // Chuẩn hóa tên từng tiết
    const cleanSubtitles: Record<number, string> = {};
    for (let p = 1; p <= totalPeriodsInLesson; p++) {
      let sub = subtitles[p] ? subtitles[p].trim() : `Tiết ${p}`;
      if (!sub.startsWith('(')) sub = `(${sub}`;
      if (!sub.endsWith(')')) sub = `${sub})`;
      cleanSubtitles[p] = sub;
    }

    onCreateLesson({
      mainTitle: mainTitle.trim(),
      chapter: chapter.trim() || 'Chương học',
      branch,
      week: targetWeek,
      periodsCount: totalPeriodsInLesson,
      subtitles: cleanSubtitles,
      digitalCompetency: digitalCompetency.trim(),
      equipment: equipment.trim()
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-4 flex items-center justify-between border-b border-blue-600/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Tạo Mới Bài Dạy & Tiết Học PPCT
              </h3>
              <p className="text-[11px] text-blue-200">
                Tuần {targetWeek} • {currentGrade} (Tự động thêm vào phân phối và dồn các tiết tiếp theo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* 1. Tên bài dạy */}
          <div className="space-y-1.5 p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
            <label className="font-extrabold text-blue-950 flex items-center justify-between">
              <span>Tên bài dạy:</span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded">
                Tự động gắn ({totalPeriodsInLesson} Tiết)
              </span>
            </label>
            <input
              type="text"
              required
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              placeholder="Ví dụ: Bài 4. Định lý Viète và ứng dụng"
              className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white font-bold text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {mainTitle.trim() && (
              <p className="text-[11px] text-slate-600 font-medium">
                Tên hiển thị: <strong>{ensureLessonTitleHasPeriodCount(mainTitle, totalPeriodsInLesson)}</strong>
              </p>
            )}
          </div>

          {/* 2. Chương / Chủ đề (như ảnh minh họa) */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800 text-xs">Chương / Chủ đề:</label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="Chương I. Phương trình và hệ hai phương trình bậc nhất hai ẩn"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/60 font-medium text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3. Phân môn & Tuần dạy (như ảnh minh họa) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 text-xs">Phân môn:</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Đại số">Đại số (Số & Đại số)</option>
                <option value="Hình học">Hình học</option>
                <option value="Thống kê & Xác suất">Thống kê & Xác suất</option>
                <option value="Kiểm tra">Kiểm tra định kỳ</option>
                <option value="Thực hành trải nghiệm">Thực hành trải nghiệm</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs">Tuần dạy:</label>
                <span className="text-[11px] text-slate-500">
                  Học kì {targetWeek <= 18 ? 1 : 2}
                </span>
              </div>
              <select
                value={targetWeek}
                onChange={(e) => setTargetWeek(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 35 }, (_, i) => i + 1).map(w => (
                  <option key={w} value={w}>
                    Tuần {w} (Học kì {w <= 18 ? 1 : 2}){w === initialTargetWeek ? ' • [Hiện tại]' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Tổng số tiết của bài này & Tiết thực hiện của thẻ này (khung bo viền xanh nhạt chuẩn như ảnh minh họa) */}
          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-blue-950 text-xs">Tổng số tiết của bài này:</label>
                <select
                  value={totalPeriodsInLesson}
                  onChange={(e) => handlePeriodCountChange(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white font-medium text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 tiết</option>
                  <option value={2}>2 tiết</option>
                  <option value={3}>3 tiết</option>
                  <option value={4}>4 tiết</option>
                  <option value={5}>5 tiết</option>
                  <option value={6}>6 tiết</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-blue-950 text-xs">Tiết thực hiện của thẻ này:</label>
                <div className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white font-medium text-xs text-slate-700 flex items-center justify-between">
                  <span>Tiết 1 / {totalPeriodsInLesson}</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">Khởi tạo</span>
                </div>
              </div>
            </div>

            {/* Chi tiết tên gọi từng tiết */}
            <div className="space-y-2 pt-2 border-t border-indigo-100">
              <span className="text-[11px] font-black text-indigo-900 block">
                Chi tiết tên gọi cho từng tiết học ({totalPeriodsInLesson} tiết):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: totalPeriodsInLesson }, (_, i) => i + 1).map(p => (
                  <div key={p} className="p-2 bg-white rounded-lg border border-indigo-200 space-y-1">
                    <label className="font-bold text-[10px] text-indigo-900 block">
                      Tiết {p} trong bài:
                    </label>
                    <input
                      type="text"
                      value={subtitles[p] || ''}
                      onChange={(e) => handleSubtitleChange(p, e.target.value)}
                      placeholder={`Ví dụ: Tiết ${p}: Nội dung trọng tâm`}
                      className="w-full px-2 py-1 rounded border border-indigo-200 text-xs font-medium focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Năng lực số / AI */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Tích hợp Năng lực số (NLS) / AI:</label>
            <input
              type="text"
              value={digitalCompetency}
              onChange={(e) => setDigitalCompetency(e.target.value)}
              placeholder="Ví dụ: 3.1TC2a: Dùng MTCT hoặc GeoGebra..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 6. Thiết bị dạy học */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Thiết bị dạy học:</label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="Ví dụ: Máy tính, ti vi, SGK..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Quy tắc sư phạm tự động */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-[11px] text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Quy trình tự động sau khi tạo:</span>
            </div>
            <p className="text-slate-600">
              • Chèn bài mới vào Tuần {targetWeek} và <strong>tự động dồn toàn bộ các tiết tiếp theo lùi xuống</strong> (vẫn giữ chuẩn 4 tiết/tuần).
            </p>
            <p className="text-slate-600">
              • Tự động cập nhật bản PPCT lưu hành và đồng bộ dữ liệu.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>✓ Tạo mới bài dạy ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
