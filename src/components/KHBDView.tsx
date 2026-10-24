import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  FileText, 
  Clock, 
  HelpCircle, 
  BookOpen, 
  Target, 
  Laptop, 
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Presentation,
  Sparkles,
  Sliders
} from 'lucide-react';
import { KHBDActivity, SlideItem, WorkspaceState } from '../types/edtech';
import { generateStaticSlides } from '../utils/slideGenerator';
import { extractClassesForGrade } from '../utils/classHelpers';
import { checkApiKeyForSlideGeneration } from '../utils/geminiAiService';

interface KHBDViewProps {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
}

export const KHBDView: React.FC<KHBDViewProps> = ({ state, setState }) => {
  const { khbd } = state;
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [expandedActivity, setExpandedActivity] = useState<string | null>('act-1');
  const [isInlineEditing, setIsInlineEditing] = useState(true);
  const [selectedSlideCount, setSelectedSlideCount] = useState<number>(20);

  // Handle updates to KHBD
  const updateKHBD = (updater: (prev: typeof khbd) => typeof khbd) => {
    setState(prev => ({
      ...prev,
      khbd: updater(prev.khbd)
    }));
  };

  // Convert KHBD directly to 16:9 Slide Deck with user-selected count
  const handleQuickConvertToSlides = () => {
    if (!checkApiKeyForSlideGeneration()) return;
    const newSlides = generateStaticSlides(khbd, selectedSlideCount);
    setState(prev => ({
      ...prev,
      slides: newSlides,
      activeTab: 'slide'
    }));
  };

  // Inline updater for Activity fields
  const handleActivityFieldChange = (actId: string, field: 'title' | 'objective' | 'content' | 'product' | 'durationMinutes', val: any) => {
    updateKHBD(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === actId ? { ...a, [field]: val } : a)
    }));
  };

  // Inline updater for Activity Steps (GV & HS actions)
  const handleStepActionChange = (actId: string, stepIndex: number, role: 'teacherAction' | 'studentAction', val: string) => {
    updateKHBD(prev => ({
      ...prev,
      activities: prev.activities.map(a => {
        if (a.id !== actId) return a;
        const newSteps = [...a.steps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], [role]: val };
        return { ...a, steps: newSteps };
      })
    }));
  };

  // Add new activity
  const handleAddActivity = () => {
    const newAct: KHBDActivity = {
      id: `act-${Date.now()}`,
      code: 'hd3',
      title: 'Hoạt động bổ sung: Luyện tập mở rộng & Phân hóa',
      durationMinutes: 10,
      objective: 'Củng cố thêm kỹ năng nâng cao cho học sinh khá giỏi.',
      content: 'Thực hiện bài toán phân hóa tình huống mở rộng.',
      product: 'Lời giải chi tiết trên bảng phụ nhóm.',
      steps: [
        {
          name: 'Bước 1: Chuyển giao nhiệm vụ',
          teacherAction: 'Giao bài toán mở rộng trên màn chiếu.',
          studentAction: 'Tiếp nhận đề bài và lập kế hoạch giải quyết.'
        },
        {
          name: 'Bước 2: Thực hiện nhiệm vụ',
          teacherAction: 'Quan sát và hỗ trợ các nhóm gặp khó khăn.',
          studentAction: 'Thực hiện giải toán theo cặp đôi.'
        },
        {
          name: 'Bước 3: Báo cáo, thảo luận',
          teacherAction: 'Mời đại diện nhóm lên trình bày lời giải.',
          studentAction: 'Trình bày và giải thích hướng suy luận.'
        },
        {
          name: 'Bước 4: Kết luận, nhận định',
          teacherAction: 'Đánh giá, nhận xét và chuẩn hóa phương pháp giải tối ưu.',
          studentAction: 'Ghi chép kinh nghiệm vào vở.'
        }
      ]
    };

    updateKHBD(prev => ({
      ...prev,
      activities: [...prev.activities, newAct]
    }));
    setExpandedActivity(newAct.id);
  };

  // Delete activity
  const handleDeleteActivity = (actId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
      updateKHBD(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a.id !== actId)
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Công văn 5512/BGDĐT-GDTrH
            </span>
            <span className="text-xs text-slate-500 font-medium">
              4 Hoạt động bắt buộc: Khởi động - Khám phá - Luyện tập - Vận dụng
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Kế Hoạch Bài Dạy: {khbd.lessonName}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Nút Chuyển Đổi Nhanh KHBD Thành Slide */}
          <button
            onClick={handleQuickConvertToSlides}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            title="Chuyển đổi 4 hoạt động thành Slide Deck 16:9 với các thẻ trực quan hóa"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-300" />
            <span>Chuyển Đổi Nhanh KHBD Thành Slide</span>
          </button>

          {/* Toggle Inline Editable */}
          <button
            onClick={() => setIsInlineEditing(!isInlineEditing)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isInlineEditing 
                ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold' 
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isInlineEditing ? 'Chế độ: Chỉnh sửa trực tiếp' : 'Chế độ: Xem cố định'}</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'preview' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Văn Bản Chuẩn A4
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'edit' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quản Lý Hoạt Động
            </button>
          </div>

          <button
            onClick={handleAddActivity}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm hoạt động</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW (CHUẨN VĂN BẢN QUẢN LÝ GIÁO DỤC A4) */}
      {activeTab === 'preview' && (
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-md max-w-5xl mx-auto text-slate-800 leading-relaxed font-sans text-sm">
          
          {/* Header Quốc hiệu & Trường */}
          <div className="grid grid-cols-2 text-center pb-6 border-b border-slate-300">
            <div>
              <p className="font-bold text-xs uppercase text-slate-700">{khbd.schoolName}</p>
              <p className="font-bold text-xs uppercase text-blue-800">{khbd.department}</p>
              <div className="w-16 h-0.5 bg-slate-400 mx-auto mt-1"></div>
            </div>
            <div>
              <p className="font-bold text-xs uppercase text-slate-800">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-bold text-xs text-slate-700">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1"></div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-6">
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-slate-900">
              KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
            </h1>
            <p className="text-base font-bold text-blue-800 mt-1 uppercase">
              {khbd.lessonName.replace(/\s*\((?:tiết|Tiết)\s*\d+[^)]*\)/i, '')}
            </p>
            <p className="text-xs text-slate-600 italic mt-1">
              Môn học: <span className="font-semibold text-slate-800">{khbd.subject}</span> | Cấp: <span className="font-semibold text-slate-800">{khbd.grade}</span> | Lớp: <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{extractClassesForGrade(khbd.assignedClasses || khbd.className, khbd.grade)}</span> | Thời lượng: <span className="font-semibold text-slate-800">{khbd.periodsCount} tiết</span> (Tiết thực hiện: Tiết {khbd.currentPeriod}{khbd.curriculumRef ? ` • PPCT ${khbd.curriculumRef.branch === 'Hình học' ? 'Hình' : khbd.curriculumRef.branch === 'Đại số' ? 'Số' : khbd.curriculumRef.branch === 'Thống kê & Xác suất' ? 'Thống kê' : khbd.curriculumRef.branch}: Tiết ${khbd.curriculumRef.period}` : ''})
            </p>
            <p className="text-xs text-slate-500 italic mt-0.5">
              Giáo viên thực hiện: {khbd.teacherName} | Khung thời gian: {khbd.timeframe}
            </p>

            {/* Official PPCT Reference & AI Integration Banner */}
            {khbd.curriculumRef && (
              <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-slate-600">
                  PPCT: <strong>Tuần {khbd.curriculumRef.week}</strong> • <strong>{khbd.curriculumRef.branch === 'Hình học' ? 'Hình' : khbd.curriculumRef.branch === 'Đại số' ? 'Số' : khbd.curriculumRef.branch === 'Thống kê & Xác suất' ? 'Thống kê' : khbd.curriculumRef.branch}: Tiết {khbd.curriculumRef.period}</strong> • Mạch: <strong className="text-blue-700">{khbd.curriculumRef.branch}</strong>
                </span>
                {khbd.curriculumRef.digitalCompetency && (
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium">
                    {khbd.curriculumRef.digitalCompetency}
                  </span>
                )}
                {khbd.curriculumRef.aiRoleCode && (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[11px] font-bold">
                    Tích hợp AI: {khbd.curriculumRef.aiRoleCode}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* I. MỤC TIÊU */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-600 pb-1 mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              I. MỤC TIÊU BÀI DẠY (YÊU CẦU CẦN ĐẠT THEO CT GDPT 2018)
            </h2>

            <div className="space-y-3 pl-2">
              <div>
                <h3 className="font-bold text-slate-900 text-xs">1. Về kiến thức:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 mt-1 text-xs">
                  {khbd.objectives.knowledge.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs">2. Về năng lực:</h3>
                <div className="mt-1 pl-3 space-y-2">
                  <div>
                    <span className="font-semibold text-blue-800 text-xs">• Năng lực chung:</span>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700 text-xs">
                      {khbd.objectives.coreCompetencies.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-800 text-xs">• Năng lực đặc thù môn học:</span>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-700 text-xs">
                      {khbd.objectives.subjectCompetencies.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs">3. Về phẩm chất:</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 mt-1 text-xs">
                  {khbd.objectives.qualities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-600 pb-1 mb-3 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-blue-600" />
              II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
            </h2>
            <div className="pl-2 space-y-1.5 text-xs text-slate-700">
              <p><strong className="text-slate-900">1. Giáo viên:</strong> {khbd.equipment.teacher.join('; ')}.</p>
              <p><strong className="text-slate-900">2. Học sinh:</strong> {khbd.equipment.students.join('; ')}.</p>
              <p><strong className="text-slate-900">3. Thiết bị công nghệ & Học liệu số:</strong> {khbd.equipment.digitalResources.join('; ')}.</p>
            </div>
          </div>

          {/* III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG CHUẨN 5512) */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-600 pb-1 mb-4 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              III. TIẾN TRÌNH DẠY HỌC (CHUẨN 4 HOẠT ĐỘNG CÔNG VĂN 5512)
            </h2>

            <div className="space-y-6">
              {khbd.activities.map((act, index) => (
                <div key={act.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 relative group">
                  
                  {/* Activity Title & Time Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-3 gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      {isInlineEditing ? (
                        <input
                          type="text"
                          value={act.title}
                          onChange={(e) => handleActivityFieldChange(act.id, 'title', e.target.value)}
                          className="font-bold text-blue-950 text-xs md:text-sm uppercase bg-white border border-blue-200 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <h3 className="font-bold text-blue-950 text-xs md:text-sm uppercase">
                          {act.title}
                        </h3>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {isInlineEditing ? (
                          <input
                            type="number"
                            min="1"
                            max="45"
                            value={act.durationMinutes}
                            onChange={(e) => handleActivityFieldChange(act.id, 'durationMinutes', Number(e.target.value))}
                            className="w-12 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                          />
                        ) : (
                          <span>{act.durationMinutes}</span>
                        )}
                        <span>phút</span>
                      </span>
                    </div>
                  </div>

                  {/* 3 Mục a) Mục tiêu - b) Nội dung - c) Sản phẩm */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
                    
                    {/* a) Mục tiêu */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-700">a) Mục tiêu:</span>
                        {isInlineEditing && <span className="text-[10px] text-blue-500 font-mono">Sửa trực tiếp</span>}
                      </div>
                      {isInlineEditing ? (
                        <textarea
                          rows={3}
                          value={act.objective}
                          onChange={(e) => handleActivityFieldChange(act.id, 'objective', e.target.value)}
                          className="w-full text-slate-700 bg-blue-50/20 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs resize-none"
                        />
                      ) : (
                        <p className="text-slate-700 leading-relaxed">{act.objective}</p>
                      )}
                    </div>

                    {/* b) Nội dung */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-700">b) Nội dung:</span>
                        {isInlineEditing && <span className="text-[10px] text-amber-500 font-mono">Sửa trực tiếp</span>}
                      </div>
                      {isInlineEditing ? (
                        <textarea
                          rows={3}
                          value={act.content}
                          onChange={(e) => handleActivityFieldChange(act.id, 'content', e.target.value)}
                          className="w-full text-slate-700 bg-amber-50/20 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs resize-none"
                        />
                      ) : (
                        <p className="text-slate-700 leading-relaxed">{act.content}</p>
                      )}
                    </div>

                    {/* c) Sản phẩm */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-700">c) Sản phẩm:</span>
                        {isInlineEditing && <span className="text-[10px] text-emerald-500 font-mono">Sửa trực tiếp</span>}
                      </div>
                      {isInlineEditing ? (
                        <textarea
                          rows={3}
                          value={act.product}
                          onChange={(e) => handleActivityFieldChange(act.id, 'product', e.target.value)}
                          className="w-full text-slate-700 bg-emerald-50/20 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs resize-none"
                        />
                      ) : (
                        <p className="text-slate-700 leading-relaxed">{act.product}</p>
                      )}
                    </div>
                  </div>

                  {/* d) Tổ chức thực hiện (Bảng tiến trình 4 bước chuẩn 5512) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-xs">
                        d) Tổ chức thực hiện (Chuẩn 4 bước Công văn 5512):
                      </span>
                      {isInlineEditing && (
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                          Bảng tiến trình Inline Editable (Gõ trực tiếp vào các ô)
                        </span>
                      )}
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                      <table className="w-full text-xs text-left bg-white">
                        <thead className="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold">
                          <tr>
                            <th className="p-2.5 w-1/4">Các bước chuẩn</th>
                            <th className="p-2.5 w-2/5 border-l border-slate-200">Hoạt động của Giáo viên</th>
                            <th className="p-2.5 w-1/3 border-l border-slate-200">Hoạt động của Học sinh</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                          {act.steps.map((step, sIdx) => (
                            <tr key={sIdx} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold text-blue-900 bg-slate-50/50 align-top">
                                {step.name}
                              </td>

                              {/* Giáo viên */}
                              <td className="p-2 border-l border-slate-200 align-top">
                                {isInlineEditing ? (
                                  <textarea
                                    rows={2}
                                    value={step.teacherAction}
                                    onChange={(e) => handleStepActionChange(act.id, sIdx, 'teacherAction', e.target.value)}
                                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded p-1.5 text-xs text-slate-800 focus:outline-none transition resize-none"
                                  />
                                ) : (
                                  <span>{step.teacherAction}</span>
                                )}
                              </td>

                              {/* Học sinh */}
                              <td className="p-2 border-l border-slate-200 align-top">
                                {isInlineEditing ? (
                                  <textarea
                                    rows={2}
                                    value={step.studentAction}
                                    onChange={(e) => handleStepActionChange(act.id, sIdx, 'studentAction', e.target.value)}
                                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded p-1.5 text-xs text-slate-800 focus:outline-none transition resize-none"
                                  />
                                ) : (
                                  <span>{step.studentAction}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* IV. HỒ SƠ DẠY HỌC VÀ PHỤ LỤC */}
          <div>
            <h2 className="text-sm font-bold text-blue-900 uppercase border-b-2 border-blue-600 pb-1 mb-3 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              IV. PHỤ LỤC & HỒ SƠ DẠY HỌC KÈM THEO
            </h2>

            {khbd.appendix.worksheets.map((ws, idx) => (
              <div key={idx} className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="font-bold text-xs uppercase text-slate-900 mb-2">{ws.title}</h3>
                <div className="bg-white p-3 rounded border border-slate-200 text-xs font-mono whitespace-pre-line text-slate-700">
                  {ws.content}
                </div>
              </div>
            ))}

            {khbd.appendix.rubrics.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold text-xs uppercase text-slate-900 mb-2">BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRICS)</h3>
                <table className="w-full text-xs text-left border border-slate-200 bg-white">
                  <thead className="bg-slate-100 text-slate-800 font-semibold border-b">
                    <tr>
                      <th className="p-2 border-r">Tiêu chí</th>
                      <th className="p-2 border-r">Mức 1 (Chưa đạt)</th>
                      <th className="p-2 border-r">Mức 2 (Đạt)</th>
                      <th className="p-2">Mức 3 (Tốt / Xuất sắc)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {khbd.appendix.rubrics.map((r, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-2 font-semibold text-slate-900 border-r">{r.criterion}</td>
                        <td className="p-2 text-slate-600 border-r">{r.level1}</td>
                        <td className="p-2 text-slate-700 border-r">{r.level2}</td>
                        <td className="p-2 text-emerald-800 font-medium">{r.level3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* EDIT MODE (SOẠN THẢO TRỰC TIẾP TỪNG HOẠT ĐỘNG) */}
      {activeTab === 'edit' && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {khbd.activities.map((act, index) => {
            const isExpanded = expandedActivity === act.id;
            return (
              <div key={act.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div 
                  onClick={() => setExpandedActivity(isExpanded ? null : act.id)}
                  className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                      <p className="text-xs text-slate-500">Thời lượng: {act.durationMinutes} phút</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteActivity(act.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Xóa hoạt động"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 space-y-4 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-3">
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Tên hoạt động:</label>
                        <input
                          type="text"
                          value={act.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateKHBD(p => ({
                              ...p,
                              activities: p.activities.map(a => a.id === act.id ? { ...a, title: val } : a)
                            }));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Thời lượng (phút):</label>
                        <input
                          type="number"
                          value={act.durationMinutes}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            updateKHBD(p => ({
                              ...p,
                              activities: p.activities.map(a => a.id === act.id ? { ...a, durationMinutes: val } : a)
                            }));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs font-medium text-center"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-blue-700 block mb-1">a) Mục tiêu:</label>
                        <textarea
                          rows={3}
                          value={act.objective}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateKHBD(p => ({
                              ...p,
                              activities: p.activities.map(a => a.id === act.id ? { ...a, objective: val } : a)
                            }));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-amber-700 block mb-1">b) Nội dung:</label>
                        <textarea
                          rows={3}
                          value={act.content}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateKHBD(p => ({
                              ...p,
                              activities: p.activities.map(a => a.id === act.id ? { ...a, content: val } : a)
                            }));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-emerald-700 block mb-1">c) Sản phẩm:</label>
                        <textarea
                          rows={3}
                          value={act.product}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateKHBD(p => ({
                              ...p,
                              activities: p.activities.map(a => a.id === act.id ? { ...a, product: val } : a)
                            }));
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    {/* 4 Steps Editor */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-2">
                        d) Tổ chức thực hiện (4 Bước chuẩn):
                      </label>
                      <div className="space-y-3">
                        {act.steps.map((step, sIdx) => (
                          <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                            <span className="text-xs font-bold text-blue-900">{step.name}</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <span className="text-[11px] text-slate-600 block">Hoạt động Giáo viên:</span>
                                <textarea
                                  rows={2}
                                  value={step.teacherAction}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateKHBD(p => ({
                                      ...p,
                                      activities: p.activities.map(a => {
                                        if (a.id !== act.id) return a;
                                        const newSteps = [...a.steps];
                                        newSteps[sIdx].teacherAction = val;
                                        return { ...a, steps: newSteps };
                                      })
                                    }));
                                  }}
                                  className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-[11px] text-slate-600 block">Hoạt động Học sinh:</span>
                                <textarea
                                  rows={2}
                                  value={step.studentAction}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateKHBD(p => ({
                                      ...p,
                                      activities: p.activities.map(a => {
                                        if (a.id !== act.id) return a;
                                        const newSteps = [...a.steps];
                                        newSteps[sIdx].studentAction = val;
                                        return { ...a, steps: newSteps };
                                      })
                                    }));
                                  }}
                                  className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
