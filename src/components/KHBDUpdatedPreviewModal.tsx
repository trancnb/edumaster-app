import React from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Clock, 
  BookOpen, 
  Target, 
  ShieldCheck,
  Tag,
  Calendar,
  Layers
} from 'lucide-react';
import { KHBDData } from '../types/edtech';
import { exportVersionedKHBDToWord } from '../utils/khbdVersionManager';
import { extractClassesForGrade } from '../utils/classHelpers';

interface KHBDUpdatedPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  khbd: KHBDData;
  versionTag: string;
  promptUsed: string;
  referenceFile: string;
}

export const KHBDUpdatedPreviewModal: React.FC<KHBDUpdatedPreviewModalProps> = ({
  isOpen,
  onClose,
  khbd,
  versionTag,
  promptUsed,
  referenceFile
}) => {
  if (!isOpen) return null;

  const handleExportDocx = () => {
    exportVersionedKHBDToWord(khbd, {
      versionId: versionTag,
      promptUsed: promptUsed || 'Bám sát cấu trúc chuẩn theo form mẫu',
      referenceFile: referenceFile || 'File mẫu bám theo',
      createdAt: new Date().toLocaleDateString('vi-VN')
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-300 w-full max-w-5xl max-h-[92vh] h-[92vh] overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0 border-b border-indigo-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-white">
                  Xem Trước Form Mới Cập Nhật
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-400 text-slate-950 shadow-xs">
                  Phiên bản: {versionTag}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-blue-100">
                  Chuẩn CV 5512 BGDĐT
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                Kế hoạch bài dạy đã đồng bộ và tối ưu hóa tự động theo Prompt và Form tài liệu mẫu bám theo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportDocx}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md active:scale-95"
              title="Xuất file Word phiên bản này"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Form Mới (.DOCX)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* METADATA BANNER */}
        <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-200 text-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 flex-wrap text-slate-700">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold">File mẫu bám theo:</span>
              <span className="text-indigo-900 font-semibold bg-white px-2 py-0.5 rounded border border-indigo-200">
                {referenceFile || 'Tài liệu mẫu chuẩn'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold">Version:</span>
              <span className="font-black text-emerald-700">{versionTag}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic max-w-md truncate">
            Prompt: "{promptUsed || 'Bám sát cấu trúc chuẩn GDPT 2018'}"
          </div>
        </div>

        {/* BODY PREVIEW */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/90 flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-slate-300 p-6 sm:p-10 space-y-6 text-slate-900 font-serif leading-relaxed text-sm">
            {/* Header Document */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <div className="flex justify-between text-xs font-sans font-bold text-slate-600 mb-2">
                <div>{khbd.schoolName?.toUpperCase() || 'TRƯỜNG THCS'} - {khbd.department?.toUpperCase() || 'TỔ TOÁN'}</div>
                <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              </div>
              <h2 className="text-lg font-black uppercase text-slate-900">KẾ HOẠCH BÀI DẠY (BẢN CẬP NHẬT THEO FORM MẪU)</h2>
              <h3 className="text-base font-extrabold text-blue-900">{khbd.lessonName}</h3>
              <div className="text-xs italic text-slate-600 font-sans">
                Môn: {khbd.subject} • Lớp: {extractClassesForGrade(khbd.assignedClasses || khbd.className, khbd.grade)} • Thời lượng: {khbd.periodsCount} tiết (Tiết thực hiện: Tiết {khbd.currentPeriod}{khbd.curriculumRef ? ` • PPCT ${khbd.curriculumRef.branch === 'Hình học' ? 'Hình' : khbd.curriculumRef.branch === 'Đại số' ? 'Số' : khbd.curriculumRef.branch === 'Thống kê & Xác suất' ? 'Thống kê' : khbd.curriculumRef.branch}: Tiết ${khbd.curriculumRef.period}` : ''}) • Giáo viên: {khbd.teacherName}
              </div>
              <div className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold font-sans">
                ✓ PHIÊN BẢN CHÍNH THỨC: {versionTag} • CẬP NHẬT THEO FORM VÀ PROMPT TÙY BIẾN
              </div>
            </div>

            {/* I. Mục tiêu */}
            <div className="space-y-2">
              <h4 className="font-bold text-blue-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-1">
                I. MỤC TIÊU DẠY HỌC
              </h4>
              <div className="space-y-1.5 pl-2 text-xs sm:text-sm">
                <div>
                  <strong className="text-slate-800">1. Kiến thức:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    {khbd.objectives.knowledge.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-slate-800">2. Năng lực đặc thù & chung:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    {khbd.objectives.subjectCompetencies.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                    {khbd.objectives.coreCompetencies.map((c, i) => (
                      <li key={i} className="text-slate-600 italic">{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-slate-800">3. Phẩm chất:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    {khbd.objectives.qualities.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* II. Thiết bị và học liệu */}
            <div className="space-y-2">
              <h4 className="font-bold text-blue-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-1">
                II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
              </h4>
              <div className="pl-2 space-y-1 text-xs sm:text-sm">
                <p><strong>1. Giáo viên:</strong> {khbd.equipment.teacher.join('; ')}</p>
                <p><strong>2. Học sinh:</strong> {khbd.equipment.students.join('; ')}</p>
                <p><strong>3. Học liệu bám theo:</strong> {khbd.equipment.digitalResources.join('; ')}</p>
              </div>
            </div>

            {/* III. Tiến trình dạy học */}
            <div className="space-y-4">
              <h4 className="font-bold text-blue-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-1">
                III. TIẾN TRÌNH DẠY HỌC (CHUẨN 4 HOẠT ĐỘNG CÔNG VĂN 5512)
              </h4>

              <div className="space-y-4">
                {khbd.activities.map((act) => (
                  <div key={act.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-sans">
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-sm text-indigo-900">{act.title}</h5>
                      <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {act.durationMinutes} phút
                      </span>
                    </div>
                    <p className="text-xs text-slate-700"><strong>a) Mục tiêu:</strong> {act.objective}</p>
                    <p className="text-xs text-slate-700"><strong>b) Nội dung:</strong> {act.content}</p>
                    <p className="text-xs text-slate-700"><strong>c) Sản phẩm:</strong> {act.product}</p>
                    
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <strong className="text-xs text-slate-800 block mb-1">d) Tổ chức thực hiện:</strong>
                      <div className="space-y-1.5">
                        {act.steps.map((st, sIdx) => (
                          <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs bg-white p-2 rounded-lg border border-slate-200">
                            <div className="sm:col-span-3 font-bold text-blue-800">{st.name}</div>
                            <div className="sm:col-span-5 text-slate-700"><strong>GV:</strong> {st.teacherAction}</div>
                            <div className="sm:col-span-4 text-slate-600"><strong>HS:</strong> {st.studentAction}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IV. Phụ lục và Rubrics */}
            <div className="space-y-3 font-sans">
              <h4 className="font-bold text-blue-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-1">
                IV. PHỤ LỤC PHIẾU HỌC TẬP & TIÊU CHÍ RUBRICS (THEO VERSION {versionTag})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {khbd.appendix?.worksheets?.map((ws, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <span className="font-bold text-amber-900 block">{ws.title}</span>
                    <p className="text-slate-600">{ws.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0 font-sans">
          <span className="text-slate-600 text-[11px] font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Form mới đã sẵn sàng xuất ra định dạng Word (.DOCX) kèm thông tin phiên bản chính thức</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportDocx}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file Word ({versionTag})</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
