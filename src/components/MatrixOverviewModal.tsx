import React from 'react';
import { X, BarChart3, CheckCircle, Scale, BookOpen } from 'lucide-react';
import { Exam7991Data } from '../types/edtech';

interface MatrixOverviewModalProps {
  exam: Exam7991Data;
  isOpen: boolean;
  onClose: () => void;
}

export const MatrixOverviewModal: React.FC<MatrixOverviewModalProps> = ({ exam, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                BẢNG MA TRẬN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ
              </h3>
              <p className="text-xs text-slate-500">Căn cứ Công văn 7991/BGDĐT-GDTrH ngày 17/12/2024</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 40-30-30 Matrix Breakdown */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-xs font-semibold text-blue-800">1. Nhận biết</span>
            <p className="text-2xl font-black text-blue-900 mt-1">4.0 điểm</p>
            <span className="text-[11px] text-blue-700 font-bold">Tỷ lệ: 40%</span>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-xs font-semibold text-indigo-800">2. Thông hiểu</span>
            <p className="text-2xl font-black text-indigo-900 mt-1">3.0 điểm</p>
            <span className="text-[11px] text-indigo-700 font-bold">Tỷ lệ: 30%</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-xs font-semibold text-emerald-800">3. Vận dụng</span>
            <p className="text-2xl font-black text-emerald-900 mt-1">3.0 điểm</p>
            <span className="text-[11px] text-emerald-700 font-bold">Tỷ lệ: 30%</span>
          </div>
        </div>

        {/* Legal Matrix Description */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <h4 className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-blue-600" />
            YÊU CẦU PHÁP LÝ SƯ PHẠM CÔNG VĂN 7991:
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cấu trúc 4 phần độc lập:</strong> Phần I (Trắc nghiệm nhiều lựa chọn), Phần II (Trắc nghiệm Đúng/Sai), Phần III (Trả lời ngắn), Phần IV (Tự luận).</li>
            <li><strong>Quy tắc điểm Phần II:</strong> Chọn đúng 1 ý được 0,1đ; đúng 2 ý được 0,25đ; đúng 3 ý được 0,5đ; đúng cả 4 ý được 1,0đ. Điểm tối đa mỗi câu hỏi là 1,0 điểm.</li>
            <li><strong>Tổng barem toàn đề:</strong> Bắt buộc đạt đúng $10.0$ điểm, đảm bảo phân hóa học sinh theo chuẩn đầu ra chương trình GDPT 2018.</li>
          </ul>
        </div>

        {/* Detailed Structure Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs">
          <table className="w-full text-left bg-white">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b">
              <tr>
                <th className="p-2.5">Phần thi</th>
                <th className="p-2.5">Hình thức câu hỏi</th>
                <th className="p-2.5 text-center">Số câu</th>
                <th className="p-2.5 text-center">Điểm/câu</th>
                <th className="p-2.5 text-center">Tổng điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-bold text-blue-700">Phần I</td>
                <td className="p-2.5">Trắc nghiệm nhiều lựa chọn (4 chọn 1)</td>
                <td className="p-2.5 text-center font-mono">12 câu</td>
                <td className="p-2.5 text-center font-mono">0,25đ</td>
                <td className="p-2.5 text-center font-bold text-blue-800">3,0 điểm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-indigo-700">Phần II</td>
                <td className="p-2.5">Trắc nghiệm Đúng / Sai (mỗi câu 4 lệnh a, b, c, d)</td>
                <td className="p-2.5 text-center font-mono">04 câu</td>
                <td className="p-2.5 text-center font-mono">0,1 - 1,0đ</td>
                <td className="p-2.5 text-center font-bold text-indigo-800">4,0 điểm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-emerald-700">Phần III</td>
                <td className="p-2.5">Trắc nghiệm trả lời ngắn (điền kết quả)</td>
                <td className="p-2.5 text-center font-mono">04 câu</td>
                <td className="p-2.5 text-center font-mono">0,50đ</td>
                <td className="p-2.5 text-center font-bold text-emerald-800">2,0 điểm</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-amber-700">Phần IV</td>
                <td className="p-2.5">Câu hỏi tự luận (giải chi tiết theo barem bước)</td>
                <td className="p-2.5 text-center font-mono">01 câu</td>
                <td className="p-2.5 text-center font-mono">1,00đ</td>
                <td className="p-2.5 text-center font-bold text-amber-800">1,0 điểm</td>
              </tr>
              <tr className="bg-blue-50 font-bold">
                <td colSpan={4} className="p-2.5 text-blue-900 uppercase">TỔNG ĐIỂM TOÀN BỘ ĐỀ THI:</td>
                <td className="p-2.5 text-center text-sm font-black text-blue-900">10,0 điểm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
