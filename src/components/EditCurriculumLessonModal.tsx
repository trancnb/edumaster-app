import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Save, 
  Layers, 
  Clock, 
  Calendar, 
  Sparkles, 
  Check, 
  AlertCircle, 
  HelpCircle,
  ArrowRight,
  BookOpen,
  ArrowLeftRight,
  Eye,
  CornerDownLeft,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Send,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { CurriculumEntry } from '../types/edtech';
import { splitLessonTitle, formatLessonTitle } from '../utils/curriculumHelpers';

interface EditCurriculumLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: CurriculumEntry | null;
  allEntries: CurriculumEntry[];
  onSaveEntry: (
    updatedEntry: CurriculumEntry, 
    moveWholeLesson: boolean, 
    swapWithWeek?: number,
    sisterPeriodSubtitles?: Record<number, string>
  ) => void;
  onDeleteRequest?: (entry: CurriculumEntry) => void;
}

export const EditCurriculumLessonModal: React.FC<EditCurriculumLessonModalProps> = ({
  isOpen,
  onClose,
  entry,
  allEntries,
  onSaveEntry,
  onDeleteRequest
}) => {
  const lessonName = entry?.lessonName || '';

  // Tách tiêu đề gốc: mainTitle (dòng 1) & periodSubtitle (dòng 2)
  const initialParsed = useMemo(() => splitLessonTitle(lessonName), [lessonName]);

  const matchPeriod = entry ? entry.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i) : null;
  const initialPeriodInLesson = matchPeriod ? parseInt(matchPeriod[1], 10) : 1;

  // State các trường
  const [mainTitle, setMainTitle] = useState(initialParsed.mainTitle);
  const [periodSubtitle, setPeriodSubtitle] = useState(() => {
    if (initialParsed.periodSubtitle) {
      return initialParsed.periodSubtitle.replace(/^\(|\)$/g, '').trim();
    }
    return `Tiết ${initialPeriodInLesson}`;
  });

  // State phụ cho các tiết anh em trong cùng bài (ví dụ Tiết 2)
  const [sisterSubtitles, setSisterSubtitles] = useState<Record<number, string>>({});

  // Khung nhập liệu tổng hợp (Hỗ trợ gõ Enter xuống hàng để phân tách tiêu đề)
  const [rawMultilineText, setRawMultilineText] = useState(() => {
    if (initialParsed.periodSubtitle) {
      const sub = initialParsed.periodSubtitle.startsWith('(') ? initialParsed.periodSubtitle : `(${initialParsed.periodSubtitle})`;
      return `${initialParsed.mainTitle}\n${sub}`;
    }
    return `${initialParsed.mainTitle}\n(Tiết ${initialPeriodInLesson})`;
  });

  const [chapter, setChapter] = useState(entry?.chapter || '');
  const [branch, setBranch] = useState<'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Kiểm tra' | 'Thực hành trải nghiệm'>(
    ((entry?.branch as any) || 'Đại số')
  );
  const [targetWeek, setTargetWeek] = useState<number>(entry?.week || 1);
  const [periodInLesson, setPeriodInLesson] = useState<number>(initialPeriodInLesson);
  const [totalPeriodsInLesson, setTotalPeriodsInLesson] = useState<number>(entry?.periodsCount || 2);
  const [moveWholeLesson, setMoveWholeLesson] = useState<boolean>(true);
  const [swapWithTargetWeek, setSwapWithTargetWeek] = useState<boolean>(true);
  const [digitalCompetency, setDigitalCompetency] = useState(entry?.digitalCompetency || '');
  const [equipment, setEquipment] = useState(entry?.equipment || 'Máy chiếu, SGK, MTCT');

  // Tìm các tiết cùng bài trong toàn bộ PPCT
  const sisterEntries = useMemo(() => {
    if (!initialParsed.mainTitle) return [];
    const cleanBase = initialParsed.mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim().toLowerCase();
    return (allEntries || []).filter(e => {
      const eParsed = splitLessonTitle(e.lessonName);
      const otherBase = eParsed.mainTitle
        .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
        .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
        .trim().toLowerCase();
      return otherBase === cleanBase;
    });
  }, [allEntries, initialParsed.mainTitle]);

  const hasMultiplePeriods = sisterEntries.length > 1 || totalPeriodsInLesson > 1;

  useEffect(() => {
    if (entry) {
      const parsed = splitLessonTitle(entry.lessonName);
      const cleanMain = parsed.mainTitle
        .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
        .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
        .trim();
      const mPeriod = entry.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i);
      const pInLesson = mPeriod ? parseInt(mPeriod[1], 10) : 1;

      setMainTitle(cleanMain);
      const sub = parsed.periodSubtitle ? parsed.periodSubtitle.replace(/^\(|\)$/g, '').trim() : `Tiết ${pInLesson}`;
      setPeriodSubtitle(sub);

      const formatted = parsed.periodSubtitle
        ? `${cleanMain}\n${parsed.periodSubtitle.startsWith('(') ? parsed.periodSubtitle : `(${parsed.periodSubtitle})`}`
        : `${cleanMain}\n(Tiết ${pInLesson})`;
      setRawMultilineText(formatted);

      setPeriodInLesson(pInLesson);
      setChapter(entry.chapter || '');
      setBranch((entry.branch as any) || 'Đại số');
      setTargetWeek(entry.week);
      const currentCount = sisterEntries.length > 0 ? sisterEntries.length : (entry.periodsCount || 1);
      setTotalPeriodsInLesson(entry.periodsCount || currentCount);
      setDigitalCompetency(entry.digitalCompetency || '');
      setEquipment(entry.equipment || 'Máy chiếu, SGK, MTCT');

      // Khởi tạo tên cho các tiết anh em
      const sMap: Record<number, string> = {};
      sisterEntries.forEach(s => {
        const sMatch = s.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i);
        const sNum = sMatch ? parseInt(sMatch[1], 10) : 1;
        if (sNum !== pInLesson) {
          const sParsed = splitLessonTitle(s.lessonName);
          sMap[sNum] = sParsed.periodSubtitle ? sParsed.periodSubtitle.replace(/^\(|\)$/g, '').trim() : `Tiết ${sNum}`;
        }
      });
      setSisterSubtitles(sMap);
    }
  }, [entry, sisterEntries.length]);

  // Trạng thái modal xác nhận cập nhật PPCT
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState<{
    updated: CurriculumEntry;
    moveWholeLesson: boolean;
    swapWithTargetWeek?: number;
    finalSisterSubtitles: Record<number, string>;
  } | null>(null);

  // Xử lý khi người dùng gõ trực tiếp trong ô Textarea (hỗ trợ gõ Enter xuống hàng phân tách rõ ràng)
  const handleMultilineChange = (val: string) => {
    setRawMultilineText(val);

    if (val.includes('\n')) {
      const lines = val.split('\n').map(l => l.trim()).filter(Boolean);
      const firstLine = lines[0] || '';
      const secondLine = lines[1] || '';
      const thirdLine = lines[2] || '';

      setMainTitle(firstLine);
      if (secondLine) {
        setPeriodSubtitle(secondLine.replace(/^\(|\)$/g, '').trim());
      }
      if (thirdLine) {
        const m = thirdLine.match(/\((?:tiết|Tiết)\s*(\d+)/i) || thirdLine.match(/(?:tiết|Tiết)\s*(\d+)/i);
        const pNum = m ? parseInt(m[1], 10) : (periodInLesson === 1 ? 2 : 1);
        setSisterSubtitles(prev => ({
          ...prev,
          [pNum]: thirdLine.replace(/^\(|\)$/g, '').trim()
        }));
      }
    } else {
      // Nếu chưa gõ Enter: thử phân tách theo ngoặc (Tiết X: ...) hoặc gạch ngang
      const parsed = splitLessonTitle(val);
      setMainTitle(parsed.mainTitle);
      if (parsed.periodSubtitle) {
        setPeriodSubtitle(parsed.periodSubtitle.replace(/^\(|\)$/g, '').trim());
      }
    }
  };

  // Cập nhật khi sửa ô tên tiết 1 cụ thể
  const handlePeriodSubtitleChange = (newSub: string) => {
    setPeriodSubtitle(newSub);
    const subClean = newSub.trim();
    const subWithParen = subClean.startsWith('(') && subClean.endsWith(')') ? subClean : `(${subClean})`;
    
    // Nếu có tiết 2 thì cập nhật luôn vào khung multiline để trực quan
    const sister2Text = sisterSubtitles[periodInLesson === 1 ? 2 : 1];
    if (sister2Text && sister2Text.trim()) {
      const s2Clean = sister2Text.trim();
      const s2Paren = s2Clean.startsWith('(') && s2Clean.endsWith(')') ? s2Clean : `(${s2Clean})`;
      setRawMultilineText(`${mainTitle}\n${subWithParen}\n${s2Paren}`);
    } else {
      setRawMultilineText(`${mainTitle}\n${subWithParen}`);
    }
  };

  // Cập nhật khi sửa ô tiết anh em (ví dụ Tiết 2)
  const handleSisterSubtitleChange = (pNum: number, newSub: string) => {
    setSisterSubtitles(prev => ({ ...prev, [pNum]: newSub }));
    const sClean = newSub.trim();
    const sParen = sClean.startsWith('(') && sClean.endsWith(')') ? sClean : `(${sClean})`;
    const subClean = periodSubtitle.trim();
    const subWithParen = subClean.startsWith('(') && subClean.endsWith(')') ? subClean : `(${subClean})`;
    setRawMultilineText(`${mainTitle}\n${subWithParen}\n${sParen}`);
  };

  const isWeekChanged = entry ? targetWeek !== entry.week : false;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    // Chuẩn hóa tiêu đề tiết (Dòng 2)
    let cleanSub = periodSubtitle.trim();
    if (cleanSub) {
      if (!cleanSub.startsWith('(')) cleanSub = `(${cleanSub}`;
      if (!cleanSub.endsWith(')')) cleanSub = `${cleanSub})`;
    } else if (totalPeriodsInLesson > 1) {
      cleanSub = `(Tiết ${periodInLesson})`;
    }

    const finalLessonName = cleanSub
      ? `${mainTitle.trim()}\n${cleanSub}`
      : mainTitle.trim();

    const updated: CurriculumEntry = {
      ...entry,
      lessonName: finalLessonName,
      chapter: chapter.trim(),
      branch,
      week: targetWeek,
      semester: (targetWeek <= 18 ? 1 : 2) as (1 | 2),
      periodsCount: totalPeriodsInLesson,
      digitalCompetency: digitalCompetency.trim(),
      equipment: equipment.trim()
    };

    // Chuẩn hóa tên các tiết anh em
    const finalSisterSubtitles: Record<number, string> = {};
    for (let p = 1; p <= totalPeriodsInLesson; p++) {
      if (p === periodInLesson) continue;
      const text = sisterSubtitles[p] ? sisterSubtitles[p].trim() : `Tiết ${p}`;
      let sText = text;
      if (!sText.startsWith('(')) sText = `(${sText}`;
      if (!sText.endsWith(')')) sText = `${sText})`;
      finalSisterSubtitles[p] = sText;
    }

    // Bổ sung chức năng xác nhận cập nhật khi chỉnh sửa: Mở modal xác nhận
    setPendingUpdateData({
      updated, 
      moveWholeLesson: hasMultiplePeriods && moveWholeLesson && isWeekChanged,
      swapWithTargetWeek: isWeekChanged && swapWithTargetWeek ? targetWeek : undefined,
      finalSisterSubtitles
    });
    setShowConfirmModal(true);
  };

  // Xác nhận cập nhật và lưu hành ngay
  const handleConfirmAndSave = () => {
    if (!pendingUpdateData) return;
    onSaveEntry(
      pendingUpdateData.updated, 
      pendingUpdateData.moveWholeLesson,
      pendingUpdateData.swapWithTargetWeek,
      pendingUpdateData.finalSisterSubtitles
    );
    setShowConfirmModal(false);
    onClose();
  };

  // Preview hiển thị 2 dòng cho tiết hiện tại
  const previewSubtitle = periodSubtitle ? (periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') ? periodSubtitle : `(${periodSubtitle})`) : `(Tiết ${periodInLesson})`;

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh]">
        
        {/* Header modal */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-4 flex items-center justify-between border-b border-blue-600/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Chỉnh Sửa Tiết & Phân Phối Chương Trình
              </h3>
              <p className="text-[11px] text-blue-100">
                Tuần {entry.week} • {entry.branch} (Tiết phân môn {entry.periodNumber} • Tiết {periodInLesson} trong bài)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
          
          {/* KHUNG NHẬP LIỆU ĐA DÒNG HỖ TRỢ PHÍM ENTER XUỐNG HÀNG */}
          <div className="space-y-1.5 p-3.5 bg-blue-50/60 border-2 border-blue-300 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label className="font-black text-blue-950 flex items-center gap-1.5 text-xs">
                <CornerDownLeft className="w-4 h-4 text-blue-600" />
                <span>Khung nhập liệu tiêu đề (Gõ Enter xuống hàng):</span>
              </label>
              <span className="text-[11px] text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                ↵ Phím Enter để xuống dòng phân tách tiêu đề
              </span>
            </div>

            <textarea
              rows={3}
              value={rawMultilineText}
              onChange={(e) => handleMultilineChange(e.target.value)}
              placeholder={"Dòng 1: Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn\nDòng 2: (Tiết 1: Phương trình bậc nhất 2 ẩn)\nDòng 3: (Tiết 2: Hệ phương trình bậc nhất 2 ẩn) [Tùy chọn]"}
              className="w-full px-3 py-2.5 rounded-xl border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs sm:text-sm bg-white shadow-inner resize-y leading-relaxed font-sans"
              required
            />

            <div className="flex items-center justify-between text-[11px] text-slate-600 italic">
              <span>* <strong>Dòng 1:</strong> Tên bài dạy chung • <strong>Dòng 2:</strong> Nội dung Tiết 1 • <strong>Dòng 3:</strong> Nội dung Tiết 2.</span>
              <span className="text-indigo-700 font-bold not-italic">Tự động đồng bộ với 2 ô bên dưới</span>
            </div>
          </div>

          {/* HỘP XEM TRƯỚC TRỰC QUAN GIAO DIỆN CỦA CẢ TIẾT 1 & TIẾT 2 (LIVE PREVIEW) */}
          <div className="p-3.5 bg-gradient-to-r from-slate-50 via-indigo-50/50 to-purple-50/40 border border-indigo-200 rounded-2xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-black text-indigo-950">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Trực quan hóa hiển thị trên thẻ bài dạy (Màu sắc & Font chữ tách biệt):</span>
              </span>
              <span className="text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-black">
                ✓ Chuẩn giao diện 2 dòng phân tách
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Card Xem trước Tiết 1 */}
              <div className="p-3 bg-white border-2 border-indigo-300 rounded-xl shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Thẻ hiển thị Tiết {periodInLesson}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Tuần {targetWeek}</span>
                </div>
                {/* Dòng 1: Tiêu đề bài học */}
                <div className="text-xs font-black text-slate-900 leading-snug">
                  {mainTitle || 'Tên bài học...'}
                </div>
                {/* Dòng 2: Tiết 1 với font chữ & màu sắc nổi bật khác biệt */}
                {previewSubtitle && (
                  <div className="text-indigo-900 font-bold text-xs bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 font-sans shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block shrink-0"></span>
                    <span>{previewSubtitle}</span>
                  </div>
                )}
              </div>

              {/* Card Xem trước Tiết 2 (hoặc các tiết khác trong bài) */}
              {totalPeriodsInLesson > 1 && (
                <div className="p-3 bg-white border border-purple-300 rounded-xl shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Thẻ hiển thị Tiết {periodInLesson === 1 ? 2 : 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Tuần {targetWeek}</span>
                  </div>
                  {/* Dòng 1 */}
                  <div className="text-xs font-black text-slate-900 leading-snug">
                    {mainTitle || 'Tên bài học...'}
                  </div>
                  {/* Dòng 2 */}
                  {(() => {
                    const otherP = periodInLesson === 1 ? 2 : 1;
                    const subOther = sisterSubtitles[otherP] || `Tiết ${otherP}`;
                    const formattedOther = subOther.startsWith('(') && subOther.endsWith(')') ? subOther : `(${subOther})`;
                    return (
                      <div className="text-purple-900 font-bold text-xs bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 font-sans shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-purple-600 inline-block shrink-0"></span>
                        <span>{formattedOther}</span>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* QUY ĐỊNH TÊN RIÊNG CHO TỪNG TIẾT TRONG BÀI (HỖ TRỢ ĐỒNG BỘ CẢ TIẾT 1 & TIẾT 2) */}
          {hasMultiplePeriods && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black text-slate-900">Chi tiết tên gọi cho từng tiết của bài ({totalPeriodsInLesson} tiết):</span>
                </span>
                <span className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-bold">
                  Đồng bộ tự động
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Tiết hiện tại đang chỉnh sửa */}
                <div className="space-y-1.5 p-2.5 bg-white border-2 border-indigo-400 rounded-xl shadow-2xs">
                  <label className="font-extrabold text-indigo-950 text-[11px] flex items-center justify-between">
                    <span>Nội dung Tiết {periodInLesson} (Thẻ đang sửa):</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-black">Đang chọn</span>
                  </label>
                  <input
                    type="text"
                    value={periodSubtitle}
                    onChange={(e) => handlePeriodSubtitleChange(e.target.value)}
                    placeholder={`Ví dụ: Tiết ${periodInLesson}: Phương trình bậc nhất 2 ẩn`}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-indigo-300 font-bold text-xs text-indigo-900 bg-indigo-50/40 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-indigo-600 italic">
                    Gợi ý: Tiết {periodInLesson}: Phương trình bậc nhất 2 ẩn
                  </p>
                </div>

                {/* Các tiết anh em khác trong bài */}
                {Array.from({ length: totalPeriodsInLesson }, (_, i) => i + 1)
                  .filter(p => p !== periodInLesson)
                  .map(otherP => (
                    <div key={otherP} className="space-y-1.5 p-2.5 bg-white border-2 border-purple-300 rounded-xl shadow-2xs">
                      <label className="font-extrabold text-purple-950 text-[11px] flex items-center justify-between">
                        <span>Nội dung Tiết {otherP} (Đồng bộ bài):</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-black">Cùng bài</span>
                      </label>
                      <input
                        type="text"
                        value={sisterSubtitles[otherP] || `Tiết ${otherP}`}
                        onChange={(e) => handleSisterSubtitleChange(otherP, e.target.value)}
                        placeholder={`Ví dụ: Tiết ${otherP}: Hệ phương trình bậc nhất 2 ẩn`}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 font-bold text-xs text-purple-900 bg-purple-50/40 focus:bg-white focus:ring-1 focus:ring-purple-500"
                      />
                      <p className="text-[10px] text-purple-600 italic">
                        Gợi ý: Tiết {otherP}: Hệ phương trình bậc nhất 2 ẩn
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Chương / Chủ đề */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Chương / Chủ đề:</label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Phân môn & Tuần học */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Phân môn:</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-xs bg-white cursor-pointer"
              >
                <option value="Đại số">Đại số (Số & Đại số)</option>
                <option value="Hình học">Hình học</option>
                <option value="Thống kê & Xác suất">Thống kê & Xác suất</option>
                <option value="Kiểm tra">Kiểm tra định kỳ</option>
                <option value="Thực hành trải nghiệm">Thực hành trải nghiệm</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center justify-between">
                <span>Tuần dạy:</span>
                <span className="text-slate-500 font-normal">Học kì {targetWeek <= 18 ? 1 : 2}</span>
              </label>
              <select
                value={targetWeek}
                onChange={(e) => setTargetWeek(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xs bg-white cursor-pointer"
              >
                {Array.from({ length: 35 }, (_, i) => i + 1).map(w => (
                  <option key={w} value={w}>
                    Tuần {w} (Học kì {w <= 18 ? 1 : 2}) {w === entry.week ? '• [Hiện tại]' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quy định số tiết trong bài & Thứ tự tiết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
            <div className="space-y-1">
              <label className="font-bold text-blue-950">Tổng số tiết của bài này:</label>
              <select
                value={totalPeriodsInLesson}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTotalPeriodsInLesson(val);
                  if (periodInLesson > val) setPeriodInLesson(val);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-blue-300 bg-white font-bold text-xs cursor-pointer"
              >
                <option value={1}>1 tiết</option>
                <option value={2}>2 tiết (Mặc định)</option>
                <option value={3}>3 tiết</option>
                <option value={4}>4 tiết</option>
                <option value={5}>5 tiết</option>
                <option value={6}>6 tiết</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-blue-950">Tiết thực hiện của thẻ này:</label>
              <select
                value={periodInLesson}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setPeriodInLesson(val);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-blue-300 bg-white font-bold text-xs cursor-pointer"
              >
                {Array.from({ length: totalPeriodsInLesson }, (_, i) => i + 1).map(p => (
                  <option key={p} value={p}>
                    Tiết {p} / {totalPeriodsInLesson}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tùy chọn chuyển tuần & ràng buộc tiết */}
          {isWeekChanged && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bạn đang đổi từ Tuần {entry.week} sang Tuần {targetWeek}</span>
              </div>

              {hasMultiplePeriods && (
                <label className="flex items-start gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={moveWholeLesson}
                    onChange={(e) => setMoveWholeLesson(e.target.checked)}
                    className="mt-0.5 rounded border-amber-400 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-800">
                      Chuyển cả cụm bài ({sisterEntries.length || totalPeriodsInLesson} tiết của "{mainTitle}") sang Tuần {targetWeek}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      (Đảm bảo bài dạy nhiều tiết đi liền nhau theo đúng mạch sư phạm)
                    </p>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={swapWithTargetWeek}
                  onChange={(e) => setSwapWithTargetWeek(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hoán đổi cân bằng: Đổi tiết tương ứng từ Tuần {targetWeek} trả lại cho Tuần {entry.week}</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    (Luôn đảm bảo ràng buộc định mức: Mỗi tuần đúng 4 tiết, cả năm đúng 140 tiết)
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* NLS & Thiết bị */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Tích hợp Năng lực số (NLS) / AI:</label>
            <input
              type="text"
              value={digitalCompetency}
              onChange={(e) => setDigitalCompetency(e.target.value)}
              placeholder="Ví dụ: 1.1.NC1b: Tìm kiếm trực tuyến ứng dụng thực tế"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Thiết bị dạy học:</label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="Ví dụ: Máy chiếu, SGK, máy tính cầm tay Casio"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
            <div>
              {onDeleteRequest && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteRequest(entry);
                  }}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Xóa tiết hoặc toàn bộ bài này khỏi PPCT"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Xóa bài này</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Cập nhật tiết này</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL XÁC NHẬN CẬP NHẬT KHI CHỈNH SỬA & LƯU HÀNH NGAY */}
      {showConfirmModal && pendingUpdateData && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border-2 border-emerald-500 overflow-hidden animate-scaleUp">
            
            {/* Header modal xác nhận */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-bold shadow-inner">
                  <ShieldCheck className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-1.5">
                    <span>Xác Nhận Cập Nhật & Lưu Hành PPCT</span>
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    Bổ sung chức năng xác nhận cập nhật khi chỉnh sửa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung xác nhận */}
            <div className="p-4 sm:p-5 space-y-3.5 text-xs text-slate-800">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nội dung cập nhật đã sẵn sàng:</span>
                </div>
                
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                  <div className="font-black text-slate-900 text-xs">
                    {pendingUpdateData.updated.lessonName.split('\n')[0]}
                  </div>
                  {previewSubtitle && (
                    <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                      {previewSubtitle}
                    </div>
                  )}
                  {Object.entries(pendingUpdateData.finalSisterSubtitles).map(([p, text]) => (
                    <div key={p} className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block ml-1.5">
                      {text}
                    </div>
                  ))}
                  <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-2">
                    <span>Tuần: <strong>Tuần {pendingUpdateData.updated.week}</strong></span>
                    <span>•</span>
                    <span>Phân môn: <strong>{pendingUpdateData.updated.branch}</strong></span>
                    <span>•</span>
                    <span>Tiết: <strong>{pendingUpdateData.updated.periodNumber}</strong></span>
                  </div>
                </div>
              </div>

              {/* Thông tin file mới sẽ tạo & đặt ngay bên dưới file gốc */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-slate-700">
                <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Quy trình tự động sau khi xác nhận:</span>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">1.</span>
                    <span>
                      Tạo và lưu thành <strong>1 file mới</strong> đặt <strong>ngay bên dưới file gốc</strong> với tên tiêu đề:
                      <span className="block font-black text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-0.5 mt-0.5">
                        PPCT Được cập nhật mới & Đang lưu hành
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">2.</span>
                    <span>
                      File mới được trang bị đầy đủ các nút: <strong>Xem file, Tải về, Xóa file</strong> (100% chuẩn Word .docx không lỗi).
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">3.</span>
                    <span>
                      <strong>Lưu hành ngay:</strong> Kích hoạt hiệu lực áp dụng ngay lập tức cho toàn bộ 140 tiết học và danh sách bài dạy giảng dạy.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Nút hành động */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Quay lại chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndSave}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Xác nhận cập nhật & Lưu hành ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
