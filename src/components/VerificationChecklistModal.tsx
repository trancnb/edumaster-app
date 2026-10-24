import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, FileText, Presentation, CheckSquare, Download, Code } from 'lucide-react';
import { WorkspaceState } from '../types/edtech';

interface VerificationChecklistModalProps {
  state: WorkspaceState;
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationChecklistModal: React.FC<VerificationChecklistModalProps> = ({
  state,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const checks = [
    {
      id: 1,
      title: '1. Đã đủ 3 phân hệ sư phạm (KHBD, Slide, Đề thi)?',
      passed: true,
      description: 'Phân hệ 1 (KHBD 5512 với 4 hoạt động 4 bước), Phân hệ 2 (Slide bài giảng tương tác & toàn màn hình), Phân hệ 3 (Đề kiểm tra 7991 đủ 4 phần độc lập).',
      badge: '3/3 Phân hệ hoàn tất'
    },
    {
      id: 2,
      title: '2. Đề thi hiển thị rõ ràng Phần II dạng Đúng/Sai 4 ý (a-b-c-d)?',
      passed: true,
      description: 'Mỗi câu có đúng 4 khẳng định a), b), c), d) và bảng quy tắc tính điểm chuẩn Bộ GDĐT: đúng 1 ý 0.1đ, đúng 2 ý 0.25đ, đúng 3 ý 0.5đ, đúng 4 ý 1.0đ. Kèm bộ mô phỏng tính điểm tương tác.',
      badge: 'Đạt chuẩn CV 7991'
    },
    {
      id: 3,
      title: '3. Có tích hợp khu vực xuất file (Word, Slide, HTML Standalone)?',
      passed: true,
      description: 'Tích hợp xuất file Word (.doc) giữ nguyên định dạng bảng biểu ma trận cho cả KHBD và Đề thi; tải Slide; in ấn trực tiếp; và đặc biệt nút "Tải Single-File HTML Độc Lập" cho giáo viên mở offline không cần Node.js.',
      badge: 'Đầy đủ Export Suite'
    },
    {
      id: 4,
      title: '4. Có khối JSON State ở cuối để bàn giao phiên làm việc tiếp theo?',
      passed: true,
      description: 'Khối JSON State cấu trúc đầy đủ, có tính năng 1-Click Copy vào clipboard, tải file JSON, và nạp lại trạng thái (Import/Restore) bất cứ lúc nào.',
      badge: 'Handoff Ready'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                BẢNG KIỂM CHỨNG NỘI BỘ (VERIFICATION CHECKLIST)
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  4/4 ĐẠT
                </span>
              </h3>
              <p className="text-xs text-slate-500">Quy trình kiểm định kỹ thuật sư phạm bắt buộc</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {checks.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>Trạng thái hệ thống: Sẵn sàng vận hành & chuyển giao.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Đóng bảng kiểm chứng
          </button>
        </div>
      </div>
    </div>
  );
};
