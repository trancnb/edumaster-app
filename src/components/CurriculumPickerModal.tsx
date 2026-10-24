import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Filter, 
  Sparkles, 
  Check, 
  Clock, 
  Cpu, 
  Laptop, 
  ChevronRight,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CURRICULUM_TOAN_9, buildStateFromCurriculumEntry } from '../data/curriculumToan9';
import { getCurriculumForGrade } from '../data/multiGradeCurriculum';
import { CurriculumEntry, GradeLevel, WorkspaceState } from '../types/edtech';
import { getSavedTeacherProfile } from '../utils/teacherStorage';
import { extractClassesForGrade } from '../utils/classHelpers';
import { splitLessonTitle } from '../utils/curriculumHelpers';

interface CurriculumPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntry: (newState: WorkspaceState) => void;
  currentGrade: string;
}

export const CurriculumPickerModal: React.FC<CurriculumPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectEntry,
  currentGrade
}) => {
  const gradeKey = (currentGrade as GradeLevel) || 'Lớp 9';
  const gradeNumber = gradeKey.replace('Lớp ', '');
  const curriculumList = useMemo(() => getCurriculumForGrade(gradeKey), [gradeKey]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'all' | '1' | '2'>('all');
  const [selectedBranch, setSelectedBranch] = useState<'all' | 'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Thực hành trải nghiệm' | 'Kiểm tra'>('all');
  const getInitialClass = () => {
    const profile = getSavedTeacherProfile();
    return extractClassesForGrade(profile.assignedClasses || profile.className, gradeKey);
  };

  const [selectedClass, setSelectedClass] = useState<string>(getInitialClass);
  const [previewEntry, setPreviewEntry] = useState<CurriculumEntry | null>(curriculumList[0] || null);

  React.useEffect(() => {
    setSelectedClass(getInitialClass());
    setPreviewEntry(curriculumList[0] || null);
  }, [gradeKey, curriculumList]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return curriculumList.filter(entry => {
      const matchSearch = 
        entry.lessonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.digitalCompetency && entry.digitalCompetency.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.aiRoleCode && entry.aiRoleCode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchSemester = 
        selectedSemester === 'all' || 
        entry.semester.toString() === selectedSemester;

      const matchBranch = 
        selectedBranch === 'all' || 
        entry.branch === selectedBranch;

      return matchSearch && matchSemester && matchBranch;
    });
  }, [curriculumList, searchQuery, selectedSemester, selectedBranch]);

  if (!isOpen) return null;

  const handleApply = (entry: CurriculumEntry) => {
    const newState = buildStateFromCurriculumEntry(entry, selectedClass);
    onSelectEntry({
      ...newState,
      activeTab: 'khbd'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Top Header */}
        <div className="p-4 md:px-6 md:py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  Ngân Hàng Phân Phối Chương Trình (PPCT) & Nạp Bài Dạy Tự Động
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  {gradeKey} (140 Tiết Chuẩn)
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Tự động chuyển mạch theo khối
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Trường THCS Mỹ Hóa - Chuẩn GDPT 2018 tích hợp Năng lực số & AI (QĐ 2422/BGDĐT)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Class Selection Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Tìm bài học ${gradeKey}, chương, hoặc mã AI...`}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Semester Filter */}
            <div className="md:col-span-3 flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 text-xs">
              <button
                onClick={() => setSelectedSemester('all')}
                className={`flex-1 py-1 px-2 rounded-lg font-medium transition ${
                  selectedSemester === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cả năm
              </button>
              <button
                onClick={() => setSelectedSemester('1')}
                className={`flex-1 py-1 px-2 rounded-lg font-medium transition ${
                  selectedSemester === '1' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Học kì 1
              </button>
              <button
                onClick={() => setSelectedSemester('2')}
                className={`flex-1 py-1 px-2 rounded-lg font-medium transition ${
                  selectedSemester === '2' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Học kì 2
              </button>
            </div>

            {/* Target Class Pickup */}
            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 shrink-0">Áp dụng lớp:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full text-xs font-bold p-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={`${gradeNumber}A1`}>Lớp {gradeNumber}A1 (Sĩ số: 42)</option>
                <option value={`${gradeNumber}A2`}>Lớp {gradeNumber}A2 (Sĩ số: 40)</option>
                <option value={`${gradeNumber}A3`}>Lớp {gradeNumber}A3 (Sĩ số: 41)</option>
                <option value={`${gradeNumber}A4`}>Lớp {gradeNumber}A4 (Sĩ số: 39)</option>
                <option value={`${gradeNumber}A5`}>Lớp {gradeNumber}A5 (Sĩ số: 43)</option>
              </select>
            </div>

          </div>

          {/* Branch Pills Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold uppercase text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Mạch kiến thức:
            </span>
            {[
              { id: 'all', label: 'Tất cả mạch' },
              { id: 'Đại số', label: 'Số & Đại số' },
              { id: 'Hình học', label: 'Hình học & Đo lường' },
              { id: 'Thống kê & Xác suất', label: 'Thống kê & Xác suất' },
              { id: 'Thực hành trải nghiệm', label: 'Thực hành trải nghiệm' },
              { id: 'Kiểm tra', label: 'Kiểm tra định kì' }
            ].map((br) => (
              <button
                key={br.id}
                onClick={() => setSelectedBranch(br.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  selectedBranch === br.id
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {br.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-500 font-medium">
              Tìm thấy <strong className="text-blue-700">{filteredEntries.length}</strong> bài học
            </span>
          </div>
        </div>

        {/* Modal Main Body (Split Pane: List on Left, Preview Card on Right) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          {/* Entries List (7 cols) */}
          <div className="md:col-span-7 h-full overflow-y-auto p-4 space-y-2.5 bg-slate-50/50">
            {filteredEntries.map((entry) => {
              const isSelected = previewEntry?.id === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => setPreviewEntry(entry)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative text-left ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Tuần {entry.week} • {entry.branch === 'Hình học' ? `Hình: Tiết ${entry.periodNumber}` : entry.branch === 'Đại số' ? `Số: Tiết ${entry.periodNumber}` : entry.branch === 'Thống kê & Xác suất' ? `Thống kê: Tiết ${entry.periodNumber}` : `Tiết ${entry.periodNumber}`}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        entry.branch === 'Đại số' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        entry.branch === 'Hình học' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        entry.branch === 'Thống kê & Xác suất' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        entry.branch === 'Thực hành trải nghiệm' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                        'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {entry.branch}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(entry);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shrink-0 shadow-xs"
                      title="Nạp ngay bài học này vào không gian làm việc"
                    >
                      <span>Nạp bài này</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {(() => {
                    const { mainTitle, periodSubtitle } = splitLessonTitle(entry.lessonName);
                    const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;
                    return (
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-900 leading-snug">
                          {mainTitle}
                        </h4>
                        {formattedSubtitle && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                            <span>{formattedSubtitle}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {entry.chapter}
                  </p>

                  {/* Badges for Digital & AI integration */}
                  {(entry.digitalCompetency || entry.aiRoleCode) && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                      {entry.digitalCompetency && (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                          <Laptop className="w-3 h-3 text-slate-500" />
                          {entry.digitalCompetency.split(':')[0]}
                        </span>
                      )}
                      {entry.aiRoleCode && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-emerald-600" />
                          Mã AI: {entry.aiRoleCode.split(':')[0]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Preview Card (5 cols) */}
          <div className="md:col-span-5 h-full overflow-y-auto p-5 bg-white space-y-4">
            {previewEntry ? (
              <div className="space-y-4 text-xs">
                <div className="border-b pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Xem trước thông tin phân phối
                  </span>
                  {(() => {
                    const { mainTitle, periodSubtitle } = splitLessonTitle(previewEntry.lessonName);
                    const formattedSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : null;
                    return (
                      <div className="space-y-1 mt-2">
                        <h3 className="text-sm font-black text-slate-900 leading-snug">
                          {mainTitle}
                        </h3>
                        {formattedSubtitle && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                            <span>{formattedSubtitle}</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <p className="text-xs text-slate-500 mt-1">{previewEntry.chapter}</p>
                </div>

                <div className="space-y-2.5">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 block text-[11px]">Tiết theo PPCT & Thời lượng:</span>
                    <p className="text-slate-800 font-bold">
                      {previewEntry.branch === 'Hình học' ? `Hình học: Tiết ${previewEntry.periodNumber}` : previewEntry.branch === 'Đại số' ? `Số & Đại số: Tiết ${previewEntry.periodNumber}` : `Tiết ${previewEntry.periodNumber}`} • Học kỳ {previewEntry.semester} • Tuần {previewEntry.week} ({previewEntry.periodsCount} tiết)
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700 block text-[11px]">Thiết bị & Học liệu dạy học (TBDH):</span>
                    <p className="text-slate-800">{previewEntry.equipment}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Địa điểm: {previewEntry.location}</span>
                  </div>

                  {previewEntry.digitalCompetency && (
                    <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                      <span className="font-bold text-blue-800 block text-[11px] flex items-center gap-1">
                        <Laptop className="w-3.5 h-3.5" />
                        Năng lực số tích hợp:
                      </span>
                      <p className="text-slate-700 mt-0.5">{previewEntry.digitalCompetency}</p>
                    </div>
                  )}

                  {previewEntry.aiRoleCode && (
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-900 block text-[11px] flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                        Tích hợp AI theo Quyết định 2422/BGDĐT:
                      </span>
                      <p className="text-slate-800 mt-0.5">{previewEntry.aiRoleCode}</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-bold text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Khi bấm "Nạp bài học vào Không gian làm việc":
                  </span>
                  <ul className="list-disc pl-4 text-[10px] space-y-0.5 text-amber-800">
                    <li>Tự động tạo KHBD 5512 với đầy đủ 4 hoạt động & 4 bước chuẩn Bộ.</li>
                    <li>Tự động thiết lập 5 slide bài giảng điện tử đồng bộ.</li>
                    <li>Tự động sinh đề kiểm tra chuẩn CV 7991 đủ 4 phần (10.0 điểm).</li>
                    <li>Gắn thẻ năng lực số & mã AI vào hồ sơ sư phạm của lớp <strong>{selectedClass}</strong>.</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleApply(previewEntry)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Nạp bài học này vào lớp {selectedClass}</span>
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Chọn một bài học từ danh sách bên trái để xem trước
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <span>Dữ liệu: Quyết định phê duyệt KHGD Trường THCS Mỹ Hóa - 2026-2027</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
