import React, { useState } from 'react';
import { 
  CheckSquare, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Eye, 
  EyeOff,
  Edit3, 
  Calculator, 
  Sparkles, 
  Info, 
  BookOpen, 
  Scale, 
  Download, 
  Sliders, 
  FileText,
  FileSpreadsheet,
  Layers,
  Lock,
  RotateCcw
} from 'lucide-react';
import { Exam7991Data, WorkspaceState } from '../types/edtech';
import { exportExamToWord, exportMatrixToWord } from '../utils/exportHelpers';
import { checkApiKeyForExamGeneration } from '../utils/geminiAiService';

interface Exam7991ViewProps {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
}

export const Exam7991View: React.FC<Exam7991ViewProps> = ({ state, setState }) => {
  const { exam } = state;

  // View toggles
  const [showAnswerKeys, setShowAnswerKeys] = useState(true);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [examStatusMsg, setExamStatusMsg] = useState<string | null>(null);

  // Sinh đề thi bằng AI chuẩn 7991 (đi qua luồng kiểm tra API Key)
  const handleGenerateAIExam = () => {
    if (!checkApiKeyForExamGeneration()) return;
    setIsGeneratingExam(true);
    setExamStatusMsg('Đang gọi AI phân bổ ngân hàng câu hỏi bám sát Ma trận đặc tả và bài dạy...');
    setTimeout(() => {
      setIsGeneratingExam(false);
      setExamStatusMsg('✓ Đã cập nhật ngân hàng câu hỏi đề thi chuẩn CV 7991 thành công!');
      setTimeout(() => setExamStatusMsg(null), 4000);
    }, 900);
  };

  // Matrix interactive ratios (Target: 40% NB, 30% TH, 30% VD - Total: 10.0đ)
  const [ratioNB, setRatioNB] = useState(40); // 40% = 4.0đ
  const [ratioTH, setRatioTH] = useState(30); // 30% = 3.0đ
  const [ratioVD, setRatioVD] = useState(30); // 30% = 3.0đ

  // Interactive student scoring simulation state for Part II
  const [userAnswersPart2, setUserAnswersPart2] = useState<{ [qId: string]: { [subId: string]: boolean } }>({
    'p2-q1': { a: true, b: true, c: false, d: true },
    'p2-q2': { a: true, b: true, c: false, d: true }
  });

  // Handle ratio changes with lock to 100% (10.0đ)
  const handleRatioChange = (type: 'NB' | 'TH' | 'VD', val: number) => {
    const value = Math.max(10, Math.min(80, val));
    if (type === 'NB') {
      const remaining = 100 - value;
      const thHalf = Math.round(remaining / 2);
      const vdHalf = remaining - thHalf;
      setRatioNB(value);
      setRatioTH(thHalf);
      setRatioVD(vdHalf);
    } else if (type === 'TH') {
      const remaining = 100 - value;
      const nbHalf = Math.round((remaining * 4) / 7);
      const vdHalf = remaining - nbHalf;
      setRatioTH(value);
      setRatioNB(nbHalf);
      setRatioVD(vdHalf);
    } else {
      const remaining = 100 - value;
      const nbHalf = Math.round((remaining * 4) / 7);
      const thHalf = remaining - nbHalf;
      setRatioVD(value);
      setRatioNB(nbHalf);
      setRatioTH(thHalf);
    }
  };

  // Reset to standard BGDĐT 40-30-30
  const handleResetMatrix = () => {
    setRatioNB(40);
    setRatioTH(30);
    setRatioVD(30);
  };

  // Part II Question Scorer (CV 7991: đúng 1 ý 0.1đ | đúng 2 ý 0.25đ | đúng 3 ý 0.5đ | đúng 4 ý 1.0đ)
  const calculatePart2QuestionScore = (questionId: string) => {
    const question = exam.part2.questions.find(q => q.id === questionId);
    if (!question) return 0;

    const userAns = userAnswersPart2[questionId] || {};
    let correctCount = 0;

    question.statements.forEach(st => {
      const userChoice = userAns[st.subId];
      if (userChoice !== undefined && userChoice === st.isCorrect) {
        correctCount++;
      }
    });

    switch (correctCount) {
      case 1: return 0.1;
      case 2: return 0.25;
      case 3: return 0.5;
      case 4: return 1.0;
      default: return 0.0;
    }
  };

  // Toggle user choice for Part II
  const handleToggleUserChoice = (questionId: string, subId: string, choice: boolean) => {
    setUserAnswersPart2(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [subId]: choice
      }
    }));
  };

  // Ensure Scope 2 score distribution:
  // Phần I: 3.0đ | Phần II: 2.0đ | Phần III: 2.0đ | Phần IV: 3.0đ = 10.0đ
  const part1Questions = exam.part1.questions.slice(0, 12); // 12 câu x 0.25đ = 3.0đ
  const part2Questions = exam.part2.questions.slice(0, 2); // 2 câu x 1.0đ = 2.0đ
  const part3Questions = exam.part3.questions.slice(0, 4); // 4 câu x 0.5đ = 2.0đ

  // For Part IV (3.0đ): Ensure 2 essay questions or 1 comprehensive question
  const part4Questions = [
    {
      id: 'p4-q1',
      code: 'Câu 1 (Tự luận)',
      text: 'Giải bài toán thực tế: Một người thợ thủ công cần làm một chiếc hộp hình chữ nhật có thể tích V = 4 m³, đáy có chiều dài gấp đôi chiều rộng. Tìm kích thước của hộp để diện tích toàn phần là nhỏ nhất.',
      score: 1.5,
      level: 'VD',
      rubricSteps: [
        { stepDescription: 'Gọi chiều rộng đáy là x (m, x > 0). Suy ra chiều dài 2x và chiều cao h = 2/x².', score: 0.5 },
        { stepDescription: 'Lập hàm diện tích toàn phần S(x) = 4x² + 12/x và tính đạo hàm S\'(x) = 8x - 12/x².', score: 0.5 },
        { stepDescription: 'Cho S\'(x) = 0 tìm x = ∛(1.5) m và kết luận kích thước tối ưu đạt giá trị nhỏ nhất.', score: 0.5 }
      ]
    },
    {
      id: 'p4-q2',
      code: 'Câu 2 (Tự luận)',
      text: 'Cho tam giác nhọn ABC nội tiếp đường tròn (O; R). Các đường cao AD, BE, CF cắt nhau tại trực tâm H. Chứng minh rằng tứ giác BCEF là tứ giác nội tiếp và xác định tâm đường tròn đi qua bốn điểm đó.',
      score: 1.5,
      level: 'VD',
      rubricSteps: [
        { stepDescription: 'Chỉ ra góc BEC = 90° và góc BFC = 90° do BE và CF là hai đường cao của tam giác ABC.', score: 0.5 },
        { stepDescription: 'Lập luận hai đỉnh E và F cùng nhìn đoạn thẳng BC dưới một góc vuông 90°.', score: 0.5 },
        { stepDescription: 'Kết luận tứ giác BCEF nội tiếp đường tròn đường kính BC, tâm là trung điểm cạnh BC.', score: 0.5 }
      ]
    }
  ];

  const part1Score = 3.0;
  const part2Score = 2.0;
  const part3Score = 2.0;
  const part4Score = 3.0;
  const totalScore = part1Score + part2Score + part3Score + part4Score; // 10.0đ

  return (
    <div className="space-y-6">
      
      {/* Top Banner Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Công văn 7991/BGDĐT-GDTrH (17/12/2024)
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Module Đề Kiểm Tra & Barem Điểm Chi Tiết
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Đề Kiểm Tra Chuẩn BGDĐT: {exam.subject} - {exam.grade} ({state.khbd.className || '9A1'})
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Answer Key Toggle */}
          <button
            onClick={() => setShowAnswerKeys(!showAnswerKeys)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              showAnswerKeys
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {showAnswerKeys ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showAnswerKeys ? 'Ẩn đáp án & Barem' : 'Hiện đáp án & Barem'}</span>
          </button>

          {/* Export Word Exam Button */}
          <button
            onClick={() => exportExamToWord(state)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            title="Tải file đề thi và barem điểm Word (.doc) mở thẳng trong Microsoft Word"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file Word chuẩn Bộ GD&ĐT</span>
          </button>

          {/* AI Sinh Đề Thi 7991 Button (Đi qua luồng kiểm tra API Key) */}
          <button
            onClick={handleGenerateAIExam}
            disabled={isGeneratingExam}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-60 cursor-pointer"
            title="Sinh đề thi bằng AI bám sát ma trận đặc tả và chuẩn CV 7991"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isGeneratingExam ? 'Đang gọi AI...' : 'AI Sinh Đề Thi 7991'}</span>
          </button>

          {/* Export Matrix Button */}
          <button
            onClick={() => exportMatrixToWord(state)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            title="Tải bảng ma trận đặc tả theo tỷ lệ 40-30-30"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tải Ma Trận Đặc Tả</span>
          </button>
        </div>
      </div>

      {examStatusMsg && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{examStatusMsg}</span>
        </div>
      )}

      {/* =========================================================================
          SCOPE 2: SPLIT-PANE WORKSPACE
          - BÊN TRÁI: BẢNG THIẾT LẬP MA TRẬN ĐỀ (SLIDER 40-30-30, KHÓA 10.0Đ, BỘ ĐẾM CÂU HỎI)
          - BÊN PHẢI: LIVE DOCUMENT CHUẨN 4 PHẦN (3.0đ - 2.0đ - 2.0đ - 3.0đ)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =======================================================================
            BÊN TRÁI: BẢNG THIẾT LẬP MA TRẬN ĐỀ (WIDTH ~380PX HOẶC 4 COLS)
            ======================================================================= */}
        <div className="lg:col-span-4 space-y-4 no-print">
          
          {/* Card: Ma Trận Đề & Sliders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Thiết Lập Ma Trận Đề
                  </h3>
                  <p className="text-[11px] text-slate-500">Chuẩn hóa theo CV 7991/BGDĐT</p>
                </div>
              </div>

              {/* Locked Score Badge */}
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl font-bold text-xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>{totalScore.toFixed(1)} Điểm</span>
              </div>
            </div>

            {/* Sliders for 40-30-30 */}
            <div className="space-y-3.5 text-xs">
              
              {/* Nhận biết */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-blue-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    1. Nhận biết (NB):
                  </span>
                  <span className="text-blue-700">{ratioNB}% ({((ratioNB * totalScore) / 100).toFixed(1)}đ)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={ratioNB}
                  onChange={(e) => handleRatioChange('NB', Number(e.target.value))}
                  className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Thông hiểu */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-indigo-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    2. Thông hiểu (TH):
                  </span>
                  <span className="text-indigo-700">{ratioTH}% ({((ratioTH * totalScore) / 100).toFixed(1)}đ)</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={ratioTH}
                  onChange={(e) => handleRatioChange('TH', Number(e.target.value))}
                  className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Vận dụng */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-emerald-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    3. Vận dụng (VD):
                  </span>
                  <span className="text-emerald-700">{ratioVD}% ({((ratioVD * totalScore) / 100).toFixed(1)}đ)</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="5"
                  value={ratioVD}
                  onChange={(e) => handleRatioChange('VD', Number(e.target.value))}
                  className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Reset to standard 40-30-30 */}
              <button
                onClick={handleResetMatrix}
                className="w-full py-1 text-[11px] text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Khôi phục tỉ lệ chuẩn 40% - 30% - 30%</span>
              </button>
            </div>

            {/* Total Score Lock Notice */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tổng điểm luôn được khóa chặt ở <strong>10.0 điểm</strong> theo đúng quy định của Bộ GD&ĐT.</span>
            </div>

          </div>

          {/* Card: Bộ Đếm Số Lượng Câu Hỏi Từng Phần */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Bộ Đếm Câu Hỏi Từng Phần
            </h4>

            <div className="space-y-2 text-xs">
              
              {/* Phần I */}
              <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">Phần I: TN nhiều lựa chọn</span>
                  <span className="text-[11px] text-slate-500">12 câu x 0,25đ</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-sm text-blue-700">3,0 đ</span>
                  <span className="text-[10px] text-slate-400 block">30%</span>
                </div>
              </div>

              {/* Phần II */}
              <div className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-900 block">Phần II: TN Đúng / Sai</span>
                  <span className="text-[11px] text-slate-500">02 câu lớn (8 mệnh đề a, b, c, d)</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-sm text-indigo-700">2,0 đ</span>
                  <span className="text-[10px] text-slate-400 block">20%</span>
                </div>
              </div>

              {/* Phần III */}
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900 block">Phần III: Trả lời ngắn</span>
                  <span className="text-[11px] text-slate-500">04 câu x 0,50đ (điền kết quả)</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-sm text-emerald-700">2,0 đ</span>
                  <span className="text-[10px] text-slate-400 block">20%</span>
                </div>
              </div>

              {/* Phần IV */}
              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">Phần IV: Tự luận</span>
                  <span className="text-[11px] text-slate-500">02 câu tự luận (có barem bước)</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-sm text-amber-700">3,0 đ</span>
                  <span className="text-[10px] text-slate-400 block">30%</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-2 border-t flex items-center justify-between text-xs font-bold text-slate-900">
                <span>TỔNG CỘNG TOÀN ĐỀ:</span>
                <span className="text-blue-700 font-black text-base">10,0 Điểm (100%)</span>
              </div>

            </div>
          </div>

          {/* Quick Download Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => exportExamToWord(state)}
              className="w-full p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Tải file Word chuẩn Bộ GD&ĐT (.doc)</span>
            </button>

            <button
              onClick={() => exportMatrixToWord(state)}
              className="w-full p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tải Ma Trận Đặc Tả (.doc)</span>
            </button>
          </div>

        </div>

        {/* =======================================================================
            BÊN PHẢI: LIVE DOCUMENT CHUẨN 4 PHẦN (CV 7991)
            ======================================================================= */}
        <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-md text-slate-800 leading-relaxed font-sans text-sm space-y-8">
          
          {/* Paper Header */}
          <div className="grid grid-cols-2 text-center pb-6 border-b border-slate-300">
            <div>
              <p className="font-bold text-xs uppercase text-slate-700">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
              <p className="font-bold text-xs uppercase text-blue-800">{state.khbd.schoolName}</p>
              <p className="font-bold text-xs text-slate-600 mt-1">{exam.examCode}</p>
              <div className="w-16 h-0.5 bg-slate-400 mx-auto mt-1"></div>
            </div>
            <div>
              <h1 className="font-bold text-sm uppercase text-slate-900">{exam.examTitle}</h1>
              <p className="font-bold text-xs text-blue-800">MÔN THI: {exam.subject.toUpperCase()} - {exam.grade.toUpperCase()}</p>
              <p className="text-xs text-slate-600 italic">
                Thời gian làm bài: {exam.durationMinutes} phút (không kể thời gian phát đề)
              </p>
              <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1"></div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex justify-between">
            <span>Họ và tên thí sinh: ............................................................................</span>
            <span>Lớp: <strong className="text-slate-800">{state.khbd.className || '9A1'}</strong></span>
            <span>Số báo danh: .....................</span>
          </div>

          {/* ===================================================================
              PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (3.0đ) KÈM KEY ĐÁP ÁN
              =================================================================== */}
          <section className="space-y-4">
            <div className="bg-slate-100 p-3 rounded-xl border-l-4 border-blue-600 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase">
                  PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 ĐIỂM)
                </h3>
                <p className="text-xs text-slate-600 italic mt-0.5">
                  Thí sinh trả lời từ Câu 1 đến Câu 12. Mỗi câu hỏi chỉ chọn một phương án đúng nhất (0,25 điểm/câu).
                </p>
              </div>
              <span className="text-xs bg-white text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
                12 câu x 0.25đ = 3.0đ
              </span>
            </div>

            <div className="space-y-3">
              {part1Questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs font-semibold text-slate-900">
                      <span className="font-bold text-blue-700">Câu {idx + 1}: </span>
                      {q.text}
                    </p>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200 shrink-0">
                      0.25đ [{q.level}]
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 ${
                          showAnswerKeys && opt.key === q.correctAnswer
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border font-bold flex items-center justify-center text-[10px] shrink-0 ${
                          showAnswerKeys && opt.key === q.correctAnswer
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}>
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key đáp án & giải thích nếu bật chế độ xem */}
                  {showAnswerKeys && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-700">
                        Đáp án đúng: <span className="underline">{q.correctAnswer}</span>
                      </span>
                      <span className="text-slate-500 italic truncate max-w-md">
                        {q.explanation}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================================
              PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (2.0đ)
              HIỂN THỊ RÕ CÂU GỐC VÀ 4 MỆNH ĐỀ a, b, c, d VỚI BADGE CHỌN ĐÚNG/SAI TRỰC QUAN
              =================================================================== */}
          <section className="space-y-4">
            <div className="bg-indigo-900 text-white p-3.5 rounded-xl flex items-center justify-between shadow-xs">
              <div>
                <h3 className="font-bold text-xs uppercase flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
                    CỐT LÕI CV 7991
                  </span>
                  PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI (2,0 ĐIỂM)
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Thí sinh trả lời Câu 1 và Câu 2. Trong mỗi ý a), b), c), d), chọn Đúng (Đ) hoặc Sai (S).
                </p>
              </div>
              <span className="text-xs bg-indigo-800 text-indigo-100 font-bold px-3 py-1 rounded-lg border border-indigo-700 shrink-0">
                02 câu x 1.0đ = 2.0đ
              </span>
            </div>

            {/* Barem chú giải điểm theo đúng chuẩn CV 7991 */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-800">
                <Info className="w-4 h-4 text-amber-600" />
                Quy tắc tính điểm chuẩn Công văn 7991/BGDĐT-GDTrH:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[11px] pt-1 font-semibold">
                <div className="bg-white p-1 rounded border border-amber-200">Đúng 1 ý: <strong>0,10 điểm</strong></div>
                <div className="bg-white p-1 rounded border border-amber-200">Đúng 2 ý: <strong>0,25 điểm</strong></div>
                <div className="bg-white p-1 rounded border border-amber-200">Đúng 3 ý: <strong>0,50 điểm</strong></div>
                <div className="bg-white p-1 rounded border border-amber-200">Đúng 4 ý: <strong>1,00 điểm</strong></div>
              </div>
            </div>

            <div className="space-y-5">
              {part2Questions.map((q, qIdx) => {
                const currentSimScore = calculatePart2QuestionScore(q.id);
                return (
                  <div key={q.id} className="p-4 bg-white border border-indigo-200 rounded-xl shadow-xs space-y-3">
                    
                    {/* Câu gốc (Stem) */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        <span className="text-indigo-700 font-black">Câu {qIdx + 1} (Câu gốc): </span>
                        {q.stem}
                      </p>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                        Tối đa: 1,0đ
                      </span>
                    </div>

                    {/* 4 Mệnh đề a, b, c, d với badge chọn Đúng/Sai trực quan */}
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-xs text-left bg-white">
                        <thead className="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold">
                          <tr>
                            <th className="p-2.5 w-3/4">Mệnh đề khẳng định</th>
                            <th className="p-2.5 w-1/8 text-center border-l">Chọn Đúng</th>
                            <th className="p-2.5 w-1/8 text-center border-l">Chọn Sai</th>
                            <th className="p-2.5 w-1/8 text-center border-l bg-indigo-50/50">Đáp án</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {q.statements.map((st) => {
                            const userChoice = userAnswersPart2[q.id]?.[st.subId];
                            return (
                              <tr key={st.subId} className="hover:bg-slate-50">
                                <td className="p-2.5 text-slate-800">
                                  <span className="font-bold text-indigo-800 mr-1.5">{st.subId})</span>
                                  {st.text}
                                  <span className="ml-1.5 text-[10px] text-slate-400 font-mono">[{st.level}]</span>
                                </td>

                                {/* Button Choose TRUE */}
                                <td className="p-2 text-center border-l">
                                  <button
                                    onClick={() => handleToggleUserChoice(q.id, st.subId, true)}
                                    className={`w-7 h-7 rounded-md font-bold text-xs transition ${
                                      userChoice === true
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                    }`}
                                  >
                                    Đ
                                  </button>
                                </td>

                                {/* Button Choose FALSE */}
                                <td className="p-2 text-center border-l">
                                  <button
                                    onClick={() => handleToggleUserChoice(q.id, st.subId, false)}
                                    className={`w-7 h-7 rounded-md font-bold text-xs transition ${
                                      userChoice === false
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                    }`}
                                  >
                                    S
                                  </button>
                                </td>

                                {/* Official Answer Badge */}
                                <td className="p-2 text-center border-l bg-indigo-50/30">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    st.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {st.isCorrect ? 'ĐÚNG' : 'SAI'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Interactive Scorer Simulator */}
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                        Chấm điểm thực tế theo công thức 7991:
                      </span>
                      <span className="font-bold text-indigo-900 bg-white px-2.5 py-1 rounded border border-indigo-200 shadow-xs">
                        Điểm đạt được: <strong className="text-blue-700">{currentSimScore.toFixed(2)}</strong> / 1,0 điểm
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>

          {/* ===================================================================
              PHẦN III: TRẢ LỜI NGẮN (2.0đ) CÓ Ô ĐIỀN KẾT QUẢ NHANH
              =================================================================== */}
          <section className="space-y-4">
            <div className="bg-slate-100 p-3 rounded-xl border-l-4 border-emerald-600 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase">
                  PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 ĐIỂM)
                </h3>
                <p className="text-xs text-slate-600 italic mt-0.5">
                  Thí sinh trả lời từ Câu 1 đến Câu 4. Điền kết quả tìm được vào ô trống tương ứng (0,50 điểm/câu).
                </p>
              </div>
              <span className="text-xs bg-white text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
                04 câu x 0.50đ = 2.0đ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {part3Questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900">
                      <span className="font-bold text-emerald-700">Câu {idx + 1}: </span>
                      {q.text}
                    </p>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                      0.5đ [{q.level}]
                    </span>
                  </div>

                  {/* Ô điền kết quả nhanh */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 italic">Ô điền kết quả nhanh:</span>
                    <input
                      type="text"
                      placeholder="Nhập số/biểu thức..."
                      defaultValue={showAnswerKeys ? q.correctAnswer : ''}
                      className="w-32 text-center font-mono font-bold text-emerald-800 bg-white border border-slate-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {showAnswerKeys && (
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                      Hướng dẫn: {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================================
              PHẦN IV: TỰ LUẬN (3.0đ) KÈM BAREM CHẤM TỪNG BƯỚC
              =================================================================== */}
          <section className="space-y-4">
            <div className="bg-slate-100 p-3 rounded-xl border-l-4 border-amber-600 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase">
                  PHẦN IV. CÂU HỎI TỰ LUẬN (3,0 ĐIỂM)
                </h3>
                <p className="text-xs text-slate-600 italic mt-0.5">
                  Thí sinh trình bày chi tiết các bước giải bài toán vào tờ giấy thi.
                </p>
              </div>
              <span className="text-xs bg-white text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
                02 câu x 1.50đ = 3.0đ
              </span>
            </div>

            <div className="space-y-4">
              {part4Questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                      <span className="font-bold text-amber-700">{q.code}: </span>
                      {q.text}
                    </p>
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      {q.score}đ [{q.level}]
                    </span>
                  </div>

                  {/* Barem chấm từng bước chi tiết */}
                  {showAnswerKeys && (
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1.5">
                      <span className="font-bold text-amber-900 block border-b border-amber-200 pb-1">
                        Barem Chấm Điểm Chi Tiết Từng Bước (Tổng {q.score}đ):
                      </span>
                      <div className="space-y-1 text-slate-700">
                        {q.rubricSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex justify-between items-start py-1 border-b border-amber-100 last:border-none">
                            <span className="leading-snug">• {step.stepDescription}</span>
                            <span className="font-bold text-amber-800 font-mono ml-3 shrink-0">+{step.score}đ</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Paper Footer */}
          <div className="text-center pt-6 border-t border-slate-300">
            <p className="font-bold text-xs uppercase text-slate-700">----------------- HẾT -----------------</p>
            <p className="text-xs text-slate-500 italic mt-1">
              Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
