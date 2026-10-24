import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  FolderKanban, 
  Layers, 
  ArrowRight, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';
import { GradeLevel } from '../types/edtech';
import { 
  getTeacherAssignedGrades, 
  saveTeacherAssignedGrades, 
  getGradeWorkspace, 
  setActiveGrade,
  updateGradeWorkspace
} from '../utils/gradeWorkspaceManager';

interface TeacherMultiGradeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGrade: GradeLevel;
  onSwitchGrade: (grade: GradeLevel) => void;
  teacherName: string;
}

export const TeacherMultiGradeDashboardModal: React.FC<TeacherMultiGradeDashboardModalProps> = ({
  isOpen,
  onClose,
  activeGrade,
  onSwitchGrade,
  teacherName
}) => {
  const [assignedGrades, setAssignedGrades] = useState<GradeLevel[]>(() => getTeacherAssignedGrades());
  const [editingGrade, setEditingGrade] = useState<GradeLevel | null>(null);
  const [newClassInput, setNewClassInput] = useState<string>('');

  if (!isOpen) return null;

  const handleAddClassToGrade = (grade: GradeLevel) => {
    if (!newClassInput.trim()) return;
    const ws = getGradeWorkspace(grade);
    const updatedClasses = Array.from(new Set([...ws.assignedClasses, newClassInput.trim().toUpperCase()]));
    updateGradeWorkspace(grade, { assignedClasses: updatedClasses });
    setNewClassInput('');
    setEditingGrade(null);
  };

  const calculateTotalWeeklyPeriods = () => {
    return assignedGrades.reduce((sum, g) => {
      const ws = getGradeWorkspace(g);
      return sum + (ws.assignedClasses.length * 4); // 4 tiết/tuần/lớp môn Toán chuẩn
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-300 w-full max-w-5xl max-h-[92vh] h-[92vh] overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-6 flex items-center justify-between gap-3 shrink-0 border-b border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <FolderKanban className="w-6 h-6 text-indigo-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base sm:text-lg text-white">
                  Quản Trị Hồ Sơ Giảng Dạy Đa Khối Lớp
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-400 text-slate-950 shadow-xs">
                  {assignedGrades.length} Khối có KHBD
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Giáo viên: <strong>{teacherName || 'Giáo viên bộ môn'}</strong> • Định mức: <strong>{calculateTotalWeeklyPeriods()} tiết/tuần</strong> • Chỉ hiển thị khối đã có KHBD.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SUMMARY STATS BAR */}
        <div className="px-6 py-3.5 bg-indigo-50/80 border-b border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Khối đang mở soạn bài:</span>
              <span className="font-black text-indigo-950 bg-white px-2 py-0.5 rounded border border-indigo-300">
                {activeGrade}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Tổng số lớp phụ trách:</span>
              <span className="font-bold text-slate-900">
                {assignedGrades.reduce((sum, g) => sum + getGradeWorkspace(g).assignedClasses.length, 0)} lớp
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span>Dữ liệu KHBD & PPCT theo từng khối</span>
          </div>
        </div>

        {/* BODY CARDS GRID: MỖI KHỐI MỘT THẺ QUẢN LÝ RIÊNG BIỆT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/90 space-y-4">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            <span>DANH SÁCH CÁC KHỐI LỚP CÓ KHBD (BẢO TOÀN DỮ LIỆU ĐỘC LẬP TỪNG KHỐI):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedGrades.map((grade) => {
              const ws = getGradeWorkspace(grade);
              const isActive = activeGrade === grade;
              const hasPpct = ws.ppctList.length > 0;

              return (
                <div
                  key={grade}
                  className={`rounded-2xl p-5 border-2 transition shadow-sm flex flex-col justify-between gap-4 ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-white border-blue-600 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Top Title & Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {grade.replace('Lớp ', 'K')}
                        </div>
                        <div>
                          <h4 className="font-black text-base text-slate-900">{grade}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Môn Toán • GDPT 2018 (Dữ liệu độc lập)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span>Đang soạn</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Classes assigned */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-bold flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                          <span>Các lớp phụ trách:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingGrade(grade === editingGrade ? null : grade)}
                          className="text-[11px] text-blue-600 hover:underline font-bold"
                        >
                          + Thêm lớp
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        {ws.assignedClasses.map((cls, cIdx) => (
                          <span key={cIdx} className="px-2 py-0.5 bg-white border border-slate-300 text-slate-800 rounded-md text-xs font-black shadow-2xs">
                            {cls}
                          </span>
                        ))}
                      </div>

                      {/* Inline add class */}
                      {editingGrade === grade && (
                        <div className="pt-2 flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="vd: 8A3, 8A4..."
                            value={newClassInput}
                            onChange={(e) => setNewClassInput(e.target.value)}
                            className="text-xs p-1 px-2 border border-blue-300 rounded-md w-28 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddClassToGrade(grade)}
                            className="px-2 py-1 bg-blue-600 text-white rounded-md text-[11px] font-bold"
                          >
                            Lưu lớp
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Status grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* PPCT Status */}
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-bold block">PPCT 140 tiết:</span>
                        <div className="flex items-center gap-1">
                          {hasPpct ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-bold text-emerald-900 truncate">
                                {ws.ppctList.length} tệp đã nạp
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="font-bold text-amber-800">Chưa nạp</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Uploads status */}
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-bold block">Tài liệu mẫu:</span>
                        <span className="font-bold text-slate-800 block truncate">
                          {ws.uploadedFiles.length} tài liệu bám theo
                        </span>
                      </div>
                    </div>

                    {/* Current Lesson snippet */}
                    <div className="text-[11px] text-slate-600 truncate bg-white p-2 rounded-lg border border-slate-200">
                      Bài đang soạn: <strong className="text-blue-900">{ws.khbdState?.lessonName || 'Đang chọn bài từ PPCT'}</strong>
                    </div>
                  </div>

                  {/* Card Action: Switch to this grade */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Phiên bản: <strong>{ws.currentVersion}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onSwitchGrade(grade);
                        onClose();
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                        isActive
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                    >
                      <span>{isActive ? 'Đang mở khối này' : 'Chuyển sang soạn khối này'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0 font-sans">
          <span className="text-slate-600 text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mỗi khối lớp đều có ngăn lưu trữ độc lập: Đảm bảo tuyệt đối không đè dữ liệu lẫn nhau.</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition"
          >
            Đóng bảng quản trị
          </button>
        </div>
      </div>
    </div>
  );
};
