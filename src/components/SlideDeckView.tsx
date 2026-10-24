import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Download, 
  FileText, 
  Sliders, 
  Printer,
  Gift,
  HelpCircle,
  Award,
  CheckCircle,
  Star,
  ExternalLink,
  Info,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  PenTool,
  Eraser,
  Tv,
  Check,
  X,
  Flame,
  Layout,
  BookOpen,
  MousePointer,
  HelpCircle as QuestionIcon,
  Eye
} from 'lucide-react';
import { SlideItem, WorkspaceState } from '../types/edtech';
import { exportSlidesToPPTX, generateStandardSlideFileName } from '../utils/exportHelpers';
import { generateStaticSlides } from '../utils/slideGenerator';
import { checkApiKeyForSlideGeneration } from '../utils/geminiAiService';
import { SlideIllustration } from './SlideIllustration';
import { MathRenderer } from './MathRenderer';
import { 
  playCorrectSound, 
  playIncorrectSound, 
  playGiftFanfare, 
  playCountdownTick, 
  playTimeUpBell,
  setSoundEnabled,
  isSoundEnabled
} from '../utils/soundEffects';

interface SlideDeckViewProps {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
}

export const SlideDeckView: React.FC<SlideDeckViewProps> = ({ state, setState }) => {
  const { slides, khbd } = state;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 45-minute lesson timer
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Target slide count selector (4, 6, 8, 10, 12, 16, 20)
  const [targetSlideCount, setTargetSlideCount] = useState<number>(slides.length || 8);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState('');

  // =========================================================================
  // RESPONSIVE SCALING & ASPECT RATIO STATE (CO GIÃN KHỚP KHUNG TRÌNH CHIẾU)
  // =========================================================================
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3'>('16:9');
  const [zoomMode, setZoomMode] = useState<'fit' | '100%' | 'custom'>('fit');
  const [customZoom, setCustomZoom] = useState<number>(100);
  
  // Stage container dimensions & scale calculations
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 960, height: 540 });
  const [fsContainerSize, setFsContainerSize] = useState<{ width: number; height: number }>({ width: 1920, height: 1080 });

  // Base canvas resolution:
  // 16:9 -> 1280 x 720
  // 4:3  -> 1024 x 768
  const baseWidth = aspectRatio === '16:9' ? 1280 : 1024;
  const baseHeight = aspectRatio === '16:9' ? 720 : 768;

  // Sound effects enabled
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // =========================================================================
  // INTERACTIVE TOOLS (DƯƠNG HÙNG MATH & KNTT PEDAGOGICAL PRESENTATION)
  // =========================================================================
  // 1. Click-To-Reveal for quiz slides
  const [revealedQuizIds, setRevealedQuizIds] = useState<Record<string, boolean>>({});
  // 2. Selected option per quiz slide
  const [selectedQuizOptions, setSelectedQuizOptions] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  // 3. Quiz feedback per slide (isCorrect, message)
  const [quizFeedbacks, setQuizFeedbacks] = useState<Record<string, { isCorrect: boolean; key: string } | null>>({});
  // 4. Question countdown timer (15s, 30s, 60s)
  const [quizTimerSecs, setQuizTimerSecs] = useState<number>(30);
  const [quizTimerActive, setQuizTimerActive] = useState<boolean>(false);
  const [quizTimerMax, setQuizTimerMax] = useState<number>(30);

  // 5. Lucky Gift Box Game Show Modal State
  const [luckyModalOpen, setLuckyModalOpen] = useState<boolean>(false);
  const [openedGiftBox, setOpenedGiftBox] = useState<{ num: number; name: string; reward: string; icon: string; symbol: string } | null>(null);

  // 6. Step-by-step discovery progression per slide
  const [stepRevealIndices, setStepRevealIndices] = useState<Record<string, number>>({});

  // 7. Interactive Live Widgets for Toán 9
  const [interactiveEqX, setInteractiveEqX] = useState<number>(1);
  const [interactiveEqY, setInteractiveEqY] = useState<number>(3);
  const [geoRelationMode, setGeoRelationMode] = useState<'intersect' | 'parallel' | 'coincident'>('intersect');

  // 8. Virtual Laser Pointer
  const [laserActive, setLaserActive] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  // 9. Interactive Pen / Drawing Annotation Overlay
  const [penActive, setPenActive] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#FACC15'); // Yellow highlighter
  const [penWidth, setPenWidth] = useState<number>(4);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // 10. Quick Scratch Blackboard / Whiteboard Overlay
  const [scratchBoard, setScratchBoard] = useState<'none' | 'blackboard' | 'whiteboard'>('none');

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const standardFileName = generateStandardSlideFileName(khbd);

  // Measure stage containers with ResizeObserver for fluid auto-scaling
  useEffect(() => {
    const el = stageContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const el = fullscreenContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setFsContainerSize({ width, height });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isFullscreen]);

  // Compute uniform scaling factor for the stage canvas
  const computeScale = useCallback((availW: number, availH: number) => {
    if (availW <= 0 || availH <= 0) return 0.7;

    const scaleFit = Math.min((availW - 16) / baseWidth, (availH - 16) / baseHeight);
    
    if (zoomMode === 'fit') {
      return Math.max(0.2, Math.min(2.5, scaleFit));
    } else if (zoomMode === '100%') {
      return 1.0;
    } else {
      return Math.max(0.2, Math.min(2.5, scaleFit * (customZoom / 100)));
    }
  }, [baseWidth, baseHeight, zoomMode, customZoom]);

  const normalScale = computeScale(containerSize.width, containerSize.height);
  const fsScale = computeScale(fsContainerSize.width, fsContainerSize.height);

  // Lesson 45-min timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => Math.max(0, sec - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Quiz 30s countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (quizTimerActive && quizTimerSecs > 0) {
      interval = setInterval(() => {
        setQuizTimerSecs(sec => {
          if (sec <= 6 && sec > 1) {
            playCountdownTick();
          } else if (sec === 1) {
            playTimeUpBell();
          }
          return Math.max(0, sec - 1);
        });
      }, 1000);
    } else if (quizTimerSecs === 0) {
      setQuizTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [quizTimerActive, quizTimerSecs]);

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !penActive)) {
        e.preventDefault();
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex(i => i + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex(i => i - 1);
        }
      } else if (e.key === 'Escape') {
        if (scratchBoard !== 'none') {
          setScratchBoard('none');
        } else if (luckyModalOpen) {
          setLuckyModalOpen(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        }
      } else if (e.key === 'F5') {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      } else if (e.key.toLowerCase() === 'l') {
        setLaserActive(prev => !prev);
      } else if (e.key.toLowerCase() === 'p') {
        setPenActive(prev => !prev);
      } else if (e.key.toLowerCase() === 'b') {
        setScratchBoard(prev => prev === 'blackboard' ? 'none' : 'blackboard');
      } else if (e.key.toLowerCase() === 'w') {
        setScratchBoard(prev => prev === 'whiteboard' ? 'none' : 'whiteboard');
      } else if (e.key.toLowerCase() === 'r') {
        toggleRevealQuiz(currentSlide.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length, isFullscreen, scratchBoard, luckyModalOpen, penActive, currentSlide.id]);

  // Handle Add Blank Slide
  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: `slide-custom-${Date.now()}`,
      title: 'Hoạt động bổ trợ mới',
      phase: 'Luyện tập',
      layout: 'content-left-image-right',
      bullets: ['Nhiệm vụ học tập tương tác', 'Thảo luận nhóm và báo cáo kết quả'],
      schoolName: khbd.schoolName,
      teacherName: khbd.teacherName
    };
    setState(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    setCurrentSlideIndex(slides.length);
  };

  // Handle Delete Slide
  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter(s => s.id !== id);
    setState(prev => ({
      ...prev,
      slides: newSlides
    }));
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
  };

  // Quick Convert KHBD to Slide Deck with user-selected count
  const handleGenerateStaticSlides = (countToGenerate: number = targetSlideCount) => {
    if (!checkApiKeyForSlideGeneration()) return;
    const newSlides = generateStaticSlides(khbd, countToGenerate);
    setState(prev => ({
      ...prev,
      slides: newSlides
    }));
    setCurrentSlideIndex(0);
    setRevealedQuizIds({});
    setSelectedQuizOptions({});
    setQuizFeedbacks({});
    setDownloadSuccessMsg(`Đã tạo thành công ${newSlides.length} slide chuẩn KNTT theo mẫu PDF!`);
    setTimeout(() => setDownloadSuccessMsg(''), 5000);
  };

  // Download PPTX Native Presentation
  const handleDownloadPPTX = async () => {
    setIsExporting(true);
    try {
      const fileName = await exportSlidesToPPTX(state);
      setDownloadSuccessMsg(`Đã xuất file PowerPoint (.pptx) chuẩn quy chuẩn Bộ Giáo Dục:\n${fileName}`);
      setTimeout(() => setDownloadSuccessMsg(''), 7000);
    } catch (err) {
      console.error(err);
      setDownloadSuccessMsg('Có lỗi xảy ra khi tạo tệp PowerPoint. Vui lòng thử lại.');
      setTimeout(() => setDownloadSuccessMsg(''), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  // =========================================================================
  // QUIZ INTERACTIVE CLICK HANDLERS (DƯƠNG HÙNG MATH QUIZ SYSTEM)
  // =========================================================================
  const toggleRevealQuiz = (slideId: string) => {
    setRevealedQuizIds(prev => ({
      ...prev,
      [slideId]: !prev[slideId]
    }));
  };

  const handleSelectQuizOption = (slide: SlideItem, chosenKey: 'A' | 'B' | 'C' | 'D') => {
    const qData = slide.giftQuiz || {
      correctKey: (['A', 'B', 'C', 'D'][slide.quizData?.correctIndex || 0] || 'A') as 'A' | 'B' | 'C' | 'D',
    };
    const isCorrect = chosenKey === qData.correctKey;

    setSelectedQuizOptions(prev => ({
      ...prev,
      [slide.id]: chosenKey
    }));

    setQuizFeedbacks(prev => ({
      ...prev,
      [slide.id]: { isCorrect, key: chosenKey }
    }));

    if (isCorrect) {
      playCorrectSound();
      // Auto reveal full answer
      setRevealedQuizIds(prev => ({ ...prev, [slide.id]: true }));
    } else {
      playIncorrectSound();
    }
  };

  const handleResetQuiz = (slideId: string) => {
    setSelectedQuizOptions(prev => ({ ...prev, [slideId]: null }));
    setQuizFeedbacks(prev => ({ ...prev, [slideId]: null }));
    setRevealedQuizIds(prev => ({ ...prev, [slideId]: false }));
    setQuizTimerSecs(quizTimerMax);
    setQuizTimerActive(false);
  };

  // Lucky gift boxes data
  const luckyGiftBoxes = [
    { num: 1, name: 'Hộp Đỏ Rực Rỡ', color: 'from-red-600 to-rose-700', border: 'border-red-400', reward: '10 Điểm môn Toán + Tràng pháo tay giòn giã! 🌟', icon: '🌟', symbol: 'π' },
    { num: 2, name: 'Hộp Xanh Dương Thần Kỳ', color: 'from-blue-600 to-sky-700', border: 'border-sky-400', reward: 'Huy hiệu Nhà Toán Học Nhí Xuất Sắc! 🏆', icon: '🏆', symbol: 'Σ' },
    { num: 3, name: 'Hộp Lục May Mắn', color: 'from-emerald-600 to-teal-700', border: 'border-emerald-400', reward: 'Thẻ miễn bài tập về nhà 1 buổi! 🎫', icon: '🎫', symbol: '∫' },
    { num: 4, name: 'Hộp Tím Trí Tuệ', color: 'from-purple-600 to-indigo-700', border: 'border-purple-400', reward: 'Cây bút chì may mắn + 1 điểm cộng miệng! ✏️', icon: '✏️', symbol: 'AI' }
  ];

  const handleOpenGiftBox = (box: typeof luckyGiftBoxes[0]) => {
    playGiftFanfare();
    setOpenedGiftBox(box);
    setLuckyModalOpen(true);
  };

  // Step-by-step advance
  const handleAdvanceStep = (slideId: string, maxSteps: number) => {
    setStepRevealIndices(prev => {
      const curr = prev[slideId] || 1;
      return {
        ...prev,
        [slideId]: curr < maxSteps ? curr + 1 : 1
      };
    });
  };

  // Laser pointer mouse move tracking
  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!laserActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Canvas drawing / annotation handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!penActive) return;
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!penActive || !isDrawing) return;
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearAnnotation = () => {
    [canvasRef.current, fsCanvasRef.current].forEach(cv => {
      if (cv) {
        const ctx = cv.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, cv.width, cv.height);
      }
    });
  };

  // =========================================================================
  // RENDER SLIDE CANVAS INTERIOR (1280 x 720 OR 1024 x 768 BASE VIEWPORT)
  // =========================================================================
  const renderSlideStageContent = (s: SlideItem, isFs: boolean = false) => {
    const isQuizRevealed = revealedQuizIds[s.id] || false;
    const selectedOpt = selectedQuizOptions[s.id] || null;
    const quizFeedback = quizFeedbacks[s.id] || null;

    // 1. WELCOME SLIDE (Bảng phấn xanh lá, phong cách lớp học thông minh)
    if (s.slideType === 'welcome') {
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-8 bg-gradient-to-br from-emerald-950 via-[#0F3F2E] to-emerald-900 rounded-xl overflow-hidden select-none border-8 border-[#92400E] shadow-2xl">
          {/* Top Banner Tag */}
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-amber-400 text-emerald-950 shadow-md">
              TIẾT HỌC THÔNG MINH • NĂNG LỰC SỐ
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-800/80 text-emerald-200 border border-emerald-500/30">
              KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
            </span>
          </div>

          {/* Main Title Center */}
          <div className="text-center my-auto space-y-4 max-w-4xl">
            <h1 className="text-5xl font-black text-amber-300 drop-shadow-lg tracking-tight uppercase">
              CHÀO MỪNG CÁC EM
            </h1>
            <h2 className="text-4xl font-extrabold text-white tracking-wide">
              ĐẾN VỚI TIẾT HỌC MỚI HÔM NAY!
            </h2>

            <div className="bg-emerald-900/90 border-2 border-emerald-400/50 rounded-2xl p-6 shadow-2xl text-white max-w-3xl mx-auto backdrop-blur-sm">
              <div className="text-amber-300 font-black text-2xl uppercase tracking-wider mb-2">
                {khbd.subject || 'MÔN TOÁN'} • {khbd.lessonName}
              </div>
              <div className="text-base text-emerald-100 flex items-center justify-center gap-6 font-medium">
                <span>Giáo viên: <strong className="text-white font-bold">{khbd.teacherName || 'Bộ môn Toán'}</strong></span>
                <span>•</span>
                <span>Lớp: <strong className="text-white font-bold">{khbd.className || '9A1'}</strong></span>
                <span>•</span>
                <span>Tiết: <strong className="text-amber-300 font-bold">{khbd.currentPeriod || 1}</strong></span>
              </div>
            </div>
          </div>

          {/* Bottom Blackboard Chalk Message */}
          <div className="w-full flex items-center justify-between text-xs text-emerald-300/80 border-t border-emerald-700/60 pt-3">
            <span className="font-mono">🎓 {s.schoolName || khbd.schoolName || 'TRƯỜNG THCS'}</span>
            <span className="italic">"Chủ động - Tích cực - Sáng tạo - Hợp tác hiệu quả"</span>
          </div>
        </div>
      );
    }

    // 2. HERO TITLE SLIDE (Navy block bên trái, tranh lớp học bên phải)
    if (s.slideType === 'hero-title') {
      return (
        <div className="w-full h-full flex flex-col justify-between p-8 bg-white select-none">
          {/* Top Line */}
          <div className="w-full h-1.5 bg-[#0EA5E9] rounded-full mb-3"></div>

          <div className="grid grid-cols-12 gap-8 my-auto flex-1 items-stretch">
            {/* Left Navy Hero Card */}
            <div className="col-span-8 bg-[#0F2942] border-4 border-[#F59E0B] rounded-2xl p-8 text-white flex flex-col justify-between shadow-2xl">
              <div>
                <div className="inline-block bg-[#F59E0B] text-white px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider mb-4 shadow-md">
                  {s.chapterTag || 'CHƯƠNG I • PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN'}
                </div>

                <h1 className="text-4xl font-black text-white leading-tight uppercase mb-3">
                  <MathRenderer text={s.title} />
                </h1>

                {s.subtitle && (
                  <div className="bg-[#0284C7] text-white px-4 py-2 rounded-xl font-bold text-lg mb-4 inline-block shadow-sm">
                    <MathRenderer text={s.subtitle} />
                  </div>
                )}

                <p className="text-slate-300 text-base italic leading-relaxed mb-4 border-l-4 border-amber-400 pl-4 bg-slate-800/40 py-2 rounded-r-xl">
                  "<MathRenderer text={s.philosophyQuote || 'Từ trực quan sinh động đến tư duy trừu tượng, vận dụng sáng tạo vào giải quyết vấn đề toán học và đời sống.'} />"
                </p>
              </div>

              <div className="inline-block bg-[#F59E0B] text-[#0F2942] px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wide w-fit mt-auto shadow-md">
                {s.ppctTag || `${(khbd.subject || 'TOÁN').toUpperCase()} • TIẾT 1 • KNTT`}
              </div>
            </div>

            {/* Right Illustration Card */}
            <div className="col-span-4 bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-between text-center shadow-inner">
              <div className="text-sm font-black text-[#0284C7] uppercase tracking-wider bg-sky-100 px-4 py-1 rounded-full">
                Học liệu số trực quan KNTT
              </div>
              <SlideIllustration type={s.illustrationType || 'thcs-linear-equation'} className="max-h-[280px] my-auto" />
              <div className="text-xs font-semibold text-slate-500">
                Phòng học thông minh chuẩn 2026-2027
              </div>
            </div>
          </div>

          {/* Footer Line */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500 mt-2">
            <span>{s.schoolName || khbd.schoolName} • GV: {s.teacherName || khbd.teacherName}</span>
            <div className="flex items-center gap-2">
              <span className="w-16 h-1 bg-[#0EA5E9] rounded-full"></span>
              <span className="w-10 h-1 bg-[#F59E0B] rounded-full"></span>
              <span className="font-mono font-bold text-slate-700 text-sm">{currentSlideIndex + 1}</span>
            </div>
          </div>
        </div>
      );
    }

    // 3. OBJECTIVES / AGENDA SLIDE
    if (s.slideType === 'objectives' || s.slideType === 'agenda') {
      const boxes = s.numberedBoxes || (s.bullets || []).map((b, idx) => ({
        num: `0${idx + 1}`,
        text: b
      }));

      return (
        <div className="w-full h-full flex flex-col justify-between p-8 bg-white select-none">
          {/* Top Line */}
          <div className="w-full h-1.5 bg-[#0EA5E9] rounded-full mb-3"></div>

          {/* Header Bar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#F59E0B] text-white px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider shrink-0 shadow-md">
              ĐỊNH HƯỚNG BÀI HỌC
            </div>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center justify-between shadow-xs">
              <span className="text-2xl font-black text-[#0F2942]">
                <MathRenderer text={s.title} />
              </span>
              <span className="w-4 h-4 rounded-full bg-[#0EA5E9] animate-pulse"></span>
            </div>
          </div>

          {/* Numbered Cards */}
          <div className="space-y-3.5 my-auto flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
            {boxes.map((b, bIdx) => (
              <div 
                key={bIdx}
                className="bg-white border-2 border-[#38BDF8] hover:border-[#0284C7] rounded-2xl p-5 flex items-center gap-6 shadow-md transition-all hover:translate-x-2"
              >
                <span className="text-3xl font-black text-[#0F2942] shrink-0 font-mono bg-sky-50 w-16 h-16 rounded-xl flex items-center justify-center border border-sky-200">
                  {b.num}
                </span>
                <span className="text-lg font-bold text-[#0F2942] leading-snug">
                  <MathRenderer text={b.text} />
                </span>
              </div>
            ))}
          </div>

          {/* Footer Line */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
            <span>{s.schoolName || khbd.schoolName} • GV: {s.teacherName || khbd.teacherName}</span>
            <div className="flex items-center gap-2">
              <span className="w-16 h-1 bg-[#0EA5E9] rounded-full"></span>
              <span className="w-10 h-1 bg-[#F59E0B] rounded-full"></span>
              <span className="font-mono font-bold text-slate-700 text-sm">{currentSlideIndex + 1}</span>
            </div>
          </div>
        </div>
      );
    }

    // 4. LUCKY GIFT BOX GAME SHOW SLIDE (HỘP QUÀ MAY MẮN)
    if (s.slideType === 'lucky-gift') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-between p-8 bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 select-none">
          {/* Top Line */}
          <div className="w-full h-1.5 bg-[#F59E0B] rounded-full mb-3"></div>

          {/* Banner */}
          <div className="bg-gradient-to-r from-[#B45309] to-[#92400E] border-4 border-amber-300 rounded-3xl px-8 py-3.5 shadow-2xl text-center max-w-3xl w-full">
            <h1 className="text-3xl font-black text-amber-300 tracking-wide uppercase drop-shadow-md">
              HỘP QUÀ MAY MẮN
            </h1>
            <p className="text-white text-sm font-bold mt-1">
              Chọn hộp quà – trả lời câu hỏi – rinh quà hấp dẫn! 🎁
            </p>
          </div>

          {/* 4 Interactive Gift Boxes */}
          <div className="grid grid-cols-4 gap-6 my-auto w-full max-w-5xl px-4">
            {luckyGiftBoxes.map((box) => (
              <div
                key={box.num}
                onClick={() => handleOpenGiftBox(box)}
                className={`bg-gradient-to-b ${box.color} border-4 ${box.border} rounded-3xl p-6 text-white cursor-pointer shadow-2xl hover:scale-105 transition-all flex flex-col items-center justify-between relative group h-64`}
              >
                <div className="absolute top-3 right-3 text-sm font-mono text-amber-200 font-bold bg-black/20 px-2 py-0.5 rounded-full">
                  {box.symbol}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-amber-300 text-amber-950 font-black text-3xl flex items-center justify-center shadow-lg border-2 border-white">
                  {box.num}
                </div>
                <Gift className="w-16 h-16 text-amber-200 group-hover:scale-110 group-hover:rotate-6 transition-transform animate-bounce" />
                <div className="text-center">
                  <div className="text-xs font-black uppercase text-amber-300 tracking-wider">{box.name}</div>
                  <div className="text-[11px] font-medium text-white/90 mt-1 line-clamp-1">Click để mở quà!</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Slogan */}
          <div className="flex items-center justify-between w-full border-t border-slate-200 pt-3 text-xs">
            <div className="bg-[#0F2942] text-amber-300 px-5 py-2 rounded-xl font-bold border border-amber-400 shadow-sm">
              f(x) = Tri thức + Tư duy + Sáng tạo = Thành công 🌟
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 h-1 bg-[#0EA5E9] rounded-full"></span>
              <span className="w-10 h-1 bg-[#F59E0B] rounded-full"></span>
              <span className="font-mono font-bold text-slate-700 text-sm">{currentSlideIndex + 1}</span>
            </div>
          </div>
        </div>
      );
    }

    // 5. INTERACTIVE QUIZ CLICK-TO-REVEAL SLIDE (THẦY DƯƠNG HÙNG FORMAT)
    if (s.slideType === 'interactive-quiz' || s.giftQuiz) {
      const qData = s.giftQuiz || {
        questionNumber: 1,
        level: 'NB 1',
        question: s.quizData?.question || s.title,
        options: (s.quizData?.options || ['A. Phương án 1', 'B. Phương án 2', 'C. Phương án 3', 'D. Phương án 4']).map((t, oIdx) => ({
          key: ['A', 'B', 'C', 'D'][oIdx] as any,
          text: t
        })),
        correctKey: ['A', 'B', 'C', 'D'][s.quizData?.correctIndex || 0] as any,
        reward: 'Ngôi sao chăm chỉ 🌟',
        explanation: s.quizData?.explanation
      };

      const optBadges: Record<string, string> = {
        'A': 'bg-blue-600',
        'B': 'bg-amber-500',
        'C': 'bg-purple-600',
        'D': 'bg-emerald-600'
      };

      return (
        <div className="w-full h-full flex flex-col justify-between p-8 bg-white select-none relative">
          {/* Top Line */}
          <div className="w-full h-1.5 bg-[#0EA5E9] rounded-full mb-3"></div>

          {/* Top Bar with Level & Countdown Timer */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#F59E0B] text-white px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider shrink-0 shadow-md">
                HỘP QUÀ MAY MẮN
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-2 flex items-center gap-4">
                <span className="text-base font-bold text-[#0F2942]">
                  {khbd.lessonName} • Tiết {khbd.currentPeriod || 1}
                </span>
                <span className="bg-emerald-600 text-white px-3 py-0.5 rounded-lg text-xs font-bold uppercase shadow-xs">
                  {qData.level}
                </span>
              </div>
            </div>

            {/* Interactive Thinking Countdown Timer Widget */}
            <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-mono shadow-md">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span className={`font-black text-sm ${quizTimerSecs <= 5 ? 'text-red-400 animate-ping' : 'text-white'}`}>
                {quizTimerSecs}s
              </span>
              <button
                onClick={() => setQuizTimerActive(!quizTimerActive)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300 ml-1"
                title={quizTimerActive ? 'Tạm dừng' : 'Bắt đầu đếm ngược'}
              >
                {quizTimerActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => { setQuizTimerActive(false); setQuizTimerSecs(quizTimerMax); }}
                className="p-1 text-slate-400 hover:text-white"
                title="Đặt lại 30s"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 shadow-sm mb-3">
            <h2 className="text-xl font-black text-[#0F2942] leading-snug">
              Câu {qData.questionNumber}. <MathRenderer text={qData.question} />
            </h2>
          </div>

          {/* 4 Interactive Clickable Options */}
          <div className="grid grid-cols-2 gap-3.5 my-auto flex-1 items-stretch">
            {qData.options.slice(0, 4).map((opt) => {
              const isCorrectKey = opt.key === qData.correctKey;
              const isSelected = selectedOpt === opt.key;
              const isRevealedKey = isQuizRevealed && isCorrectKey;
              const isWrongSelected = isSelected && !isCorrectKey;

              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelectQuizOption(s, opt.key)}
                  className={`border-2 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all relative ${
                    isRevealedKey
                      ? 'bg-emerald-50 border-emerald-500 shadow-lg ring-4 ring-emerald-300 scale-[1.02]'
                      : isWrongSelected
                      ? 'bg-red-50 border-red-500 shadow-md ring-2 ring-red-200'
                      : 'bg-white border-sky-200 hover:border-blue-500 hover:bg-sky-50/50 shadow-sm'
                  }`}
                >
                  <span className={`w-11 h-11 rounded-xl text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md ${optBadges[opt.key] || 'bg-slate-700'}`}>
                    {opt.key}
                  </span>
                  <span className={`text-base font-bold flex-1 ${isRevealedKey ? 'text-emerald-950 font-black' : isWrongSelected ? 'text-red-900' : 'text-[#0F2942]'}`}>
                    <MathRenderer text={opt.text} />
                  </span>

                  {isRevealedKey && (
                    <div className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-black shadow-md animate-bounce shrink-0">
                      <Check className="w-4 h-4" />
                      <span>ĐÚNG!</span>
                    </div>
                  )}

                  {isWrongSelected && (
                    <div className="flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-md shrink-0">
                      <X className="w-4 h-4" />
                      <span>Thử lại</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation if revealed */}
          {isQuizRevealed && qData.explanation && (
            <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 px-4 py-2.5 rounded-2xl text-xs font-medium shadow-xs my-1">
              <span className="font-black text-emerald-800 mr-1.5 uppercase">💡 Lời giải chi tiết:</span>
              <MathRenderer text={qData.explanation} />
            </div>
          )}

          {/* Interactive Teacher Action Bar (Click-To-Reveal & Reward) */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 mt-2">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => toggleRevealQuiz(s.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition shadow-md ${
                  isQuizRevealed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{isQuizRevealed ? 'ĐÁP ÁN: ' + qData.correctKey : 'CLICK ĐỂ MỞ ĐÁP ÁN (GV)'}</span>
                {isQuizRevealed ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleResetQuiz(s.id)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 flex items-center gap-1 transition"
                title="Làm lại câu hỏi này"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </button>
            </div>

            {/* Lucky Reward Box Button (Interactive click opens gift popup) */}
            <button
              onClick={() => {
                const box = luckyGiftBoxes[(qData.questionNumber - 1) % 4] || luckyGiftBoxes[0];
                handleOpenGiftBox(box);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition shadow-lg ${
                isQuizRevealed 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white animate-pulse' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-200" />
              <span>BỐC HỘP QUÀ: {qData.reward}</span>
            </button>
          </div>
        </div>
      );
    }

    // 6. QUIZ RESULTS SLIDE (BẢNG TỔNG KẾT THỬ THÁCH)
    if (s.slideType === 'quiz-results') {
      const quizSlides = slides.filter(sl => sl.giftQuiz);
      const results = [
        { 
          q: 'Câu 1', 
          ans: quizSlides[0]?.giftQuiz?.correctKey ? `Đáp án: ${quizSlides[0].giftQuiz.correctKey}` : 'Đáp án: B', 
          border: 'border-blue-500', 
          text: 'text-blue-700', 
          bg: 'bg-blue-50' 
        },
        { 
          q: 'Câu 2', 
          ans: quizSlides[1]?.giftQuiz?.correctKey ? `Đáp án: ${quizSlides[1].giftQuiz.correctKey}` : 'Đáp án: A', 
          border: 'border-amber-500', 
          text: 'text-amber-700', 
          bg: 'bg-amber-50' 
        },
        { 
          q: 'Câu 3', 
          ans: quizSlides[2]?.giftQuiz?.correctKey ? `Đáp án: ${quizSlides[2].giftQuiz.correctKey}` : 'Đáp án: A', 
          border: 'border-green-500', 
          text: 'text-green-700', 
          bg: 'bg-green-50' 
        },
        { 
          q: 'Câu 4', 
          ans: quizSlides[3]?.giftQuiz?.correctKey ? `Đáp án: ${quizSlides[3].giftQuiz.correctKey}` : 'Đáp án: B', 
          border: 'border-purple-500', 
          text: 'text-purple-700', 
          bg: 'bg-purple-50' 
        }
      ];

      return (
        <div className="w-full h-full flex flex-col justify-between p-8 bg-white select-none text-center">
          {/* Top Line */}
          <div className="w-full h-1.5 bg-[#10B981] rounded-full mb-3"></div>

          {/* Header */}
          <div className="bg-emerald-600 text-white py-3 px-8 rounded-2xl shadow-xl max-w-2xl mx-auto w-full">
            <h1 className="text-3xl font-black uppercase tracking-wide">ĐÁP ÁN THỬ THÁCH</h1>
            <p className="text-sm text-emerald-100 mt-0.5">{khbd.lessonName} • Bảng tổng kết kết quả học tập</p>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-4 gap-6 my-auto max-w-5xl mx-auto w-full px-4">
            {results.map((r, rIdx) => (
              <div key={rIdx} className={`${r.bg} border-4 ${r.border} rounded-3xl p-6 shadow-md flex flex-col justify-center items-center h-44 hover:scale-105 transition-transform`}>
                <div className="text-xl font-black text-[#0F2942] mb-2">{r.q}</div>
                <div className={`text-2xl font-black ${r.text}`}>{r.ans}</div>
                <div className="mt-2 text-xs font-bold text-slate-500">Chính xác 100% ✨</div>
              </div>
            ))}
          </div>

          {/* Congratulation Box */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 max-w-3xl mx-auto w-full text-[#0F2942] shadow-sm">
            <div className="font-black text-base text-amber-900 mb-0.5">
              Chúc mừng các em đã hoàn thành xuất sắc thử thách "Hộp quà may mắn"! 🎉
            </div>
            <div className="text-xs text-slate-600 font-medium">
              Hãy tiếp tục giữ vững tinh thần tự học, thảo luận tích cực và tư duy sáng tạo!
            </div>
          </div>
        </div>
      );
    }

    // 7. DEFAULT / CONTENT-SPLIT PEDAGOGICAL SLIDES
    const statusLabel = s.statusBadge?.label || (
      s.phase.includes('Khởi động') ? 'KHỞI ĐỘNG' :
      s.phase.includes('Khám phá') ? 'KIẾN THỨC MỚI' :
      s.phase.includes('Luyện tập') ? 'LUYỆN TẬP' :
      s.phase.includes('Vận dụng') ? 'VẬN DỤNG' : 'BÀI HỌC KNTT'
    );

    const stepIdx = stepRevealIndices[s.id] || 1;

    return (
      <div className="w-full h-full flex flex-col justify-between p-8 bg-white select-none">
        {/* Top Accent Line */}
        <div className="w-full h-1.5 bg-[#0EA5E9] rounded-full mb-3"></div>

        {/* Top Status Bar with Cyan indicator dot & Step advance button */}
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-[#F59E0B] text-white px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider shrink-0 shadow-md">
            {statusLabel}
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center justify-between shadow-xs">
            <span className="text-xl font-black text-[#0F2942]">
              <MathRenderer text={s.title} />
            </span>
            <div className="flex items-center gap-3">
              {/* Step by Step Reveal Interactive Pill */}
              <button
                onClick={() => handleAdvanceStep(s.id, s.stepByStep?.length || 3)}
                className="px-3 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs"
                title="Bấm để dẫn dắt từng bước lời giải / kiến thức"
              >
                <Sparkles className="w-3 h-3 text-sky-600" />
                <span>Bước {stepIdx}/{s.stepByStep?.length || 3}</span>
              </button>
              <span className="w-3.5 h-3.5 rounded-full bg-[#0EA5E9] animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Main Content Split: Left (Formulas/Bullets/StepByStep) and Right (Callout Boxes/Widgets/Illustration) */}
        <div className="grid grid-cols-12 gap-6 my-auto flex-1 items-stretch">
          {/* Left Column */}
          <div className="col-span-6 bg-slate-50/80 border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-inner">
            <div>
              {s.subtitle && (
                <div className="text-base font-black text-[#0284C7] mb-4 border-b border-slate-200 pb-2">
                  <MathRenderer text={s.subtitle} />
                </div>
              )}

              {/* Step By Step Structured Pedagogical Guide */}
              {s.stepByStep && s.stepByStep.length > 0 ? (
                <div className="space-y-3 my-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-xs font-black text-amber-700 uppercase tracking-wide">
                      TIẾN TRÌNH LỜI GIẢI PHÂN TẦNG SƯ PHẠM
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Bước {Math.min(stepIdx, s.stepByStep.length)}/{s.stepByStep.length}
                    </span>
                  </div>
                  {s.stepByStep.map((step, idx) => (
                    <div
                      key={step.step}
                      className={`p-3.5 rounded-2xl border-2 transition-all ${
                        idx < stepIdx
                          ? 'bg-white border-amber-400 shadow-md translate-x-0 opacity-100'
                          : 'bg-slate-100 border-dashed border-slate-300 opacity-30 translate-x-1'
                      }`}
                    >
                      <div className="text-xs font-black text-[#0F2942] uppercase mb-1">
                        {step.title}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 leading-relaxed">
                        <MathRenderer text={step.content} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : s.mathProblems && s.mathProblems.length >= 4 ? (
                <div className="grid grid-cols-2 gap-4 my-2">
                  {s.mathProblems.slice(0, 4).map((prob, pIdx) => (
                    <div 
                      key={pIdx} 
                      className={`text-xl font-black p-4 bg-white rounded-2xl border-2 border-slate-200 text-center shadow-md ${
                        pIdx % 2 === 0 ? 'text-[#0284C7]' : 'text-[#0F2942]'
                      } ${pIdx < stepIdx * 2 ? 'opacity-100' : 'opacity-40'}`}
                    >
                      <MathRenderer text={prob} />
                    </div>
                  ))}
                </div>
              ) : s.numberedBoxes && s.numberedBoxes.length > 0 ? (
                <div className="space-y-3 my-2">
                  {s.numberedBoxes.map((nb, nIdx) => (
                    <div key={nIdx} className="bg-white border-2 border-sky-200 rounded-2xl p-3 flex items-center gap-4 shadow-xs">
                      <span className="w-10 h-10 rounded-xl bg-sky-100 font-black text-sky-900 flex items-center justify-center font-mono shrink-0">
                        {nb.num}
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        <MathRenderer text={nb.text} />
                      </span>
                    </div>
                  ))}
                </div>
              ) : s.bullets && s.bullets.length > 0 ? (
                <ul className="space-y-3 text-base text-slate-800 font-semibold leading-relaxed">
                  {s.bullets.map((b, bIdx) => (
                    <li 
                      key={bIdx} 
                      className={`flex items-start gap-3 transition-opacity ${
                        bIdx < stepIdx ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-1'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#0284C7] mt-1.5 shrink-0 shadow-xs"></span>
                      <span><MathRenderer text={b} /></span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Mint Green Callout Bar */}
            {s.bannerPrompt && (
              <div className="bg-[#6EE7B7] text-[#064E3B] px-5 py-3 rounded-2xl font-black text-sm shadow-md mt-4 border border-emerald-400">
                💡 <MathRenderer text={s.bannerPrompt} />
              </div>
            )}
          </div>

          {/* Right Column: Interactive Widgets / Callout Boxes / Illustration */}
          <div className="col-span-6 flex flex-col justify-between space-y-4">
            {s.interactiveWidget === 'check-equation-root' ? (
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 border-3 border-emerald-400 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                    <span className="font-black text-sm text-emerald-950 uppercase tracking-wide">
                      BỘ THỬ NGHIỆM TƯƠNG TÁC SỐ
                    </span>
                  </div>
                  <span className="bg-emerald-600 text-white text-xs font-mono font-black px-3 py-1 rounded-full shadow-xs">
                    2x + y = 5
                  </span>
                </div>

                {/* Preset quick test buttons */}
                <div className="my-2">
                  <div className="text-xs font-bold text-slate-700 mb-1.5">Bấm thử nhanh các cặp số (x; y):</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { x: 1, y: 3, label: '(1; 3)' },
                      { x: 2, y: 2, label: '(2; 2)' },
                      { x: 0, y: 5, label: '(0; 5)' },
                      { x: 3, y: -1, label: '(3; -1)' },
                      { x: 2, y: 1, label: '(2; 1)' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInteractiveEqX(preset.x);
                          setInteractiveEqY(preset.y);
                          if (2 * preset.x + preset.y === 5) playCorrectSound();
                          else playIncorrectSound();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition border ${
                          interactiveEqX === preset.x && interactiveEqY === preset.y
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105'
                            : 'bg-white hover:bg-emerald-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stepper controls */}
                <div className="grid grid-cols-2 gap-4 bg-white/90 p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
                  <div>
                    <div className="text-xs font-bold text-slate-600 mb-1">Giá trị ẩn x:</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const nx = interactiveEqX - 1;
                          setInteractiveEqX(nx);
                          if (2 * nx + interactiveEqY === 5) playCorrectSound();
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 font-black text-slate-800 flex items-center justify-center text-sm shadow-xs"
                      >-</button>
                      <span className="font-mono font-black text-xl text-[#0F2942] w-12 text-center bg-slate-50 py-1 rounded-lg border border-slate-200">
                        {interactiveEqX}
                      </span>
                      <button
                        onClick={() => {
                          const nx = interactiveEqX + 1;
                          setInteractiveEqX(nx);
                          if (2 * nx + interactiveEqY === 5) playCorrectSound();
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 font-black text-slate-800 flex items-center justify-center text-sm shadow-xs"
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-600 mb-1">Giá trị ẩn y:</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const ny = interactiveEqY - 1;
                          setInteractiveEqY(ny);
                          if (2 * interactiveEqX + ny === 5) playCorrectSound();
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 font-black text-slate-800 flex items-center justify-center text-sm shadow-xs"
                      >-</button>
                      <span className="font-mono font-black text-xl text-[#0F2942] w-12 text-center bg-slate-50 py-1 rounded-lg border border-slate-200">
                        {interactiveEqY}
                      </span>
                      <button
                        onClick={() => {
                          const ny = interactiveEqY + 1;
                          setInteractiveEqY(ny);
                          if (2 * interactiveEqX + ny === 5) playCorrectSound();
                        }}
                        className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 font-black text-slate-800 flex items-center justify-center text-sm shadow-xs"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Calculation box */}
                <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-md my-2 text-center font-mono">
                  <div className="text-[11px] text-slate-400 mb-0.5">Vế trái: 2x + y</div>
                  <div className="text-lg font-bold">
                    2 · ({interactiveEqX}) + ({interactiveEqY}) = <span className="text-amber-400 text-xl font-black">{2 * interactiveEqX + interactiveEqY}</span>
                  </div>
                </div>

                {/* Live Verdict */}
                {2 * interactiveEqX + interactiveEqY === 5 ? (
                  <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
                    <CheckCircle className="w-6 h-6 shrink-0 text-amber-300" />
                    <div>
                      <div className="font-black text-sm uppercase">CHÍNH XÁC! LÀ NGHIỆM!</div>
                      <div className="text-xs text-emerald-100">
                        Cặp số ({interactiveEqX}; {interactiveEqY}) thỏa mãn đẳng thức 2x + y = 5.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-100 border border-amber-300 text-amber-950 p-3 rounded-2xl shadow-xs flex items-center gap-3">
                    <X className="w-5 h-5 shrink-0 text-red-500" />
                    <div>
                      <div className="font-black text-xs uppercase text-amber-900">CHƯA PHẢI LÀ NGHIỆM</div>
                      <div className="text-xs text-amber-800">
                        Kết quả bằng {2 * interactiveEqX + interactiveEqY} ≠ 5. Thử cặp số khác nhé!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : s.interactiveWidget === 'graph-intersection' ? (
              <div className="bg-slate-900 border-3 border-sky-400 rounded-3xl p-6 shadow-xl flex flex-col justify-between text-white h-full">
                {/* Mode selector buttons */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                  <span className="text-xs font-black uppercase text-sky-300">
                    MÔ PHỎNG VỊ TRÍ TƯƠNG ĐỐI TRÊN Oxy
                  </span>
                  <span className="text-[11px] text-slate-400">Click chọn:</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { mode: 'intersect', label: 'Cắt nhau', badge: '1 nghiệm' },
                    { mode: 'parallel', label: 'Song song', badge: 'Vô nghiệm' },
                    { mode: 'coincident', label: 'Trùng nhau', badge: 'Vô số nghiệm' }
                  ].map((tab) => (
                    <button
                      key={tab.mode}
                      onClick={() => {
                        setGeoRelationMode(tab.mode as any);
                        playCountdownTick();
                      }}
                      className={`p-2 rounded-xl text-xs font-bold transition flex flex-col items-center ${
                        geoRelationMode === tab.mode
                          ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[10px] opacity-80">{tab.badge}</span>
                    </button>
                  ))}
                </div>

                {/* Graph SVG */}
                <div className="relative bg-slate-950 rounded-2xl p-2 border border-slate-800 my-auto h-48 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 400 220" className="w-full h-full" fill="none">
                    <g stroke="#334155" strokeWidth="0.8" opacity="0.35">
                      <line x1="50" y1="20" x2="50" y2="200" />
                      <line x1="125" y1="20" x2="125" y2="200" />
                      <line x1="200" y1="20" x2="200" y2="200" />
                      <line x1="275" y1="20" x2="275" y2="200" />
                      <line x1="350" y1="20" x2="350" y2="200" />
                      <line x1="20" y1="50" x2="380" y2="50" />
                      <line x1="20" y1="110" x2="380" y2="110" />
                      <line x1="20" y1="170" x2="380" y2="170" />
                    </g>
                    {/* Axes */}
                    <line x1="20" y1="110" x2="380" y2="110" stroke="#94A3B8" strokeWidth="2" />
                    <polygon points="385,110 375,106 375,114" fill="#94A3B8" />
                    <text x="370" y="128" fill="#94A3B8" fontSize="11" fontWeight="bold">x</text>

                    <line x1="200" y1="200" x2="200" y2="20" stroke="#94A3B8" strokeWidth="2" />
                    <polygon points="200,15 196,25 204,25" fill="#94A3B8" />
                    <text x="208" y="28" fill="#94A3B8" fontSize="11" fontWeight="bold">y</text>
                    <text x="188" y="124" fill="#94A3B8" fontSize="10">O</text>

                    {geoRelationMode === 'intersect' && (
                      <>
                        <line x1="130" y1="190" x2="270" y2="30" stroke="#FB923C" strokeWidth="3" />
                        <text x="260" y="25" fill="#FB923C" fontSize="10" fontWeight="bold">d₁</text>
                        <line x1="120" y1="40" x2="300" y2="180" stroke="#38BDF8" strokeWidth="3" />
                        <text x="290" y="195" fill="#38BDF8" fontSize="10" fontWeight="bold">d₂</text>
                        <circle cx="220" cy="90" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" className="animate-ping" />
                        <circle cx="220" cy="90" r="5" fill="#EF4444" />
                        <text x="230" y="88" fill="#FCA5A5" fontSize="11" fontWeight="bold">M(2; 3)</text>
                      </>
                    )}

                    {geoRelationMode === 'parallel' && (
                      <>
                        <line x1="120" y1="190" x2="260" y2="30" stroke="#FB923C" strokeWidth="3" />
                        <text x="250" y="25" fill="#FB923C" fontSize="10" fontWeight="bold">d₁: 2x-y=1</text>
                        <line x1="170" y1="190" x2="310" y2="30" stroke="#F43F5E" strokeWidth="3" strokeDasharray="5 3" />
                        <text x="300" y="25" fill="#F43F5E" fontSize="10" fontWeight="bold">d₃: 2x-y=5</text>
                      </>
                    )}

                    {geoRelationMode === 'coincident' && (
                      <>
                        <line x1="130" y1="190" x2="270" y2="30" stroke="#34D399" strokeWidth="5" strokeOpacity="0.85" />
                        <text x="260" y="25" fill="#34D399" fontSize="11" fontWeight="bold">d₁ ≡ d₄ (Trùng nhau)</text>
                      </>
                    )}
                  </svg>
                </div>

                {/* Conclusion card */}
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-xs text-center font-bold">
                  {geoRelationMode === 'intersect' && (
                    <span className="text-emerald-400">
                      Hai đường thẳng cắt nhau tại điểm M(2; 3) ➔ Hệ có nghiệm duy nhất (2; 3).
                    </span>
                  )}
                  {geoRelationMode === 'parallel' && (
                    <span className="text-amber-400">
                      Hai đường thẳng song song không có điểm chung ➔ Hệ phương trình vô nghiệm!
                    </span>
                  )}
                  {geoRelationMode === 'coincident' && (
                    <span className="text-sky-400">
                      Hai đường thẳng trùng nhau có vô số điểm chung ➔ Hệ có vô số nghiệm!
                    </span>
                  )}
                </div>
              </div>
            ) : s.calloutBoxes && s.calloutBoxes.length > 0 ? (
              s.calloutBoxes.slice(0, 2).map((cb, cbIdx) => {
                const badgeColor = cb.tagColor === 'green' ? 'bg-emerald-600' :
                                   cb.tagColor === 'cyan' ? 'bg-[#0284C7]' :
                                   cb.tagColor === 'purple' ? 'bg-purple-600' : 'bg-[#F59E0B]';
                const borderColor = cb.tagColor === 'green' ? 'border-emerald-500' :
                                    cb.tagColor === 'cyan' ? 'border-[#0284C7]' :
                                    cb.tagColor === 'purple' ? 'border-purple-500' : 'border-[#F59E0B]';

                return (
                  <div key={cbIdx} className={`bg-white border-3 ${borderColor} rounded-3xl p-6 shadow-md relative flex-1 flex flex-col justify-center`}>
                    <div className={`absolute -top-3.5 left-6 ${badgeColor} text-white px-4 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm`}>
                      {cb.tag}
                    </div>
                    <div className="text-base font-bold text-[#0F2942] leading-relaxed mt-2">
                      <MathRenderer text={cb.text} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center h-full shadow-inner">
                <SlideIllustration 
                  type={s.illustrationType || (currentSlideIndex % 2 === 0 ? 'thcs-linear-equation' : 'thcs-group-discussion')} 
                  className="max-h-[300px]" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer with Dual Accent Lines */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500 relative mt-2">
          <div className="text-xs text-slate-600 font-medium">
            {s.schoolName || khbd.schoolName || 'TRƯỜNG THCS'} • GV: {s.teacherName || khbd.teacherName || 'Bộ môn Toán'}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-0.5">
              <span className="w-16 h-1 bg-[#0EA5E9] rounded-full"></span>
              <span className="w-10 h-1 bg-[#F59E0B] rounded-full"></span>
            </div>
            <span className="font-mono font-black text-slate-800 text-sm">
              {currentSlideIndex + 1}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Row 1: Title, Lesson Timer & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-black rounded-lg">
                BÀI GIẢNG SƯ PHẠM KNTT
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-lg font-mono">
                {slides.length} SLIDE
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md flex items-center gap-1">
                <Check className="w-3 h-3" /> Co giãn khớp khung 100%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Bài Giảng Trình Chiếu Chuẩn Mẫu GDPT 2018 (Co Giãn & Tương Tác)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Lesson Timer Widget */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-mono shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{formatTime(timerSeconds)}</span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="ml-1 text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-bold"
              >
                {timerRunning ? 'Tạm dừng' : 'Bắt đầu'}
              </button>
              <button
                onClick={() => { setTimerRunning(false); setTimerSeconds(45 * 60); }}
                className="text-slate-400 hover:text-white p-0.5"
                title="Đặt lại 45 phút"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                soundOn ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={soundOn ? 'Âm thanh: Đang Bật' : 'Âm thanh: Đang Tắt'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Toàn màn hình F5 */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition"
              title="Bật chế độ trình chiếu toàn màn hình (Phím F5)"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Trình Chiếu (F5)</span>
            </button>

            {/* NÚT DOWNLOAD SLIDES VỀ MÁY (PPTX CHUẨN NATIVE VÀ ĐÚNG QUY CHUẨN TÊN FILE) */}
            <button
              onClick={handleDownloadPPTX}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md transition"
              title="Tải toàn bộ slide về máy tính dạng tệp PowerPoint (.pptx) chuẩn quy định"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>{isExporting ? 'Đang xuất PPTX...' : 'Download Slide (.pptx)'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition"
              title="In hoặc lưu dạng PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Lưu PDF</span>
            </button>
          </div>
        </div>

        {/* Row 2: Standard Filename Preview Badge */}
        <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold text-slate-700 flex items-center gap-1 shrink-0">
              <FileText className="w-4 h-4 text-purple-700" />
              Quy chuẩn đặt tên file:
            </span>
            <span className="font-mono text-purple-800 font-bold bg-white px-2.5 py-0.5 rounded border border-purple-200 truncate">
              {standardFileName}.pptx
            </span>
          </div>
          <span className="text-[11px] text-slate-500 shrink-0 font-medium">
            Cấu trúc: MONxx_HOCKIxx_CHUONGxx_BAIxx+tênbài_GV_xxxxx
          </span>
        </div>

        {/* Row 3: BỘ CHỌN SỐ SLIDE & TỶ LỆ KHUNG CHIẾU (16:9 / 4:3) */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 shrink-0">
              <Sliders className="w-4 h-4 text-purple-600" />
              Số lượng slide:
            </span>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {[4, 6, 8, 10, 12, 16, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTargetSlideCount(num)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                    targetSlideCount === num
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {num} slide {num === 4 ? '(Cơ bản)' : num === 8 ? '(Chuẩn PDF)' : num === 12 ? '(Đầy đủ)' : num === 20 ? '(Trọn bộ)' : ''}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-1 ml-1">
              <span className="text-slate-500 text-[11px]">Tùy chỉnh:</span>
              <input
                type="number"
                min="4"
                max="24"
                value={targetSlideCount}
                onChange={(e) => setTargetSlideCount(Math.max(4, Math.min(24, Number(e.target.value))))}
                className="w-12 p-1 text-center bg-white border border-slate-300 rounded font-bold text-xs"
              />
              <span className="text-slate-500 text-[11px]">slide</span>
            </div>
          </div>

          {/* Projection Ratio & Scale Control */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5 shadow-xs">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 ${
                  aspectRatio === '16:9' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Tỉ lệ 16:9 - Chuẩn Widescreen TV / Máy chiếu hiện đại"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>16:9 (Rộng)</span>
              </button>
              <button
                onClick={() => setAspectRatio('4:3')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1 ${
                  aspectRatio === '4:3' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Tỉ lệ 4:3 - Máy chiếu lớp học truyền thống"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>4:3 (Chuẩn)</span>
              </button>
            </div>

            {/* Zoom / Fit Control */}
            <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5 shadow-xs">
              <button
                onClick={() => { setZoomMode('fit'); setCustomZoom(100); }}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                  zoomMode === 'fit' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Tự động co giãn vừa vặn khung hình"
              >
                Khớp khung
              </button>
              <button
                onClick={() => { setZoomMode('100%'); setCustomZoom(100); }}
                className={`px-2 py-1 rounded-lg font-bold text-xs transition ${
                  zoomMode === '100%' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Kích thước gốc 100%"
              >
                100%
              </button>
              <button
                onClick={() => {
                  setZoomMode('custom');
                  setCustomZoom(z => Math.max(50, z - 10));
                }}
                className="p-1 text-slate-600 hover:text-slate-900"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 font-bold text-slate-600">
                {Math.round((zoomMode === 'fit' ? normalScale : zoomMode === '100%' ? 1 : (normalScale * customZoom) / 100) * 100)}%
              </span>
              <button
                onClick={() => {
                  setZoomMode('custom');
                  setCustomZoom(z => Math.min(180, z + 10));
                }}
                className="p-1 text-slate-600 hover:text-slate-900"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleGenerateStaticSlides(targetSlideCount)}
              className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tạo {targetSlideCount} Slide</span>
            </button>

            <button
              onClick={handleAddSlide}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Slide</span>
            </button>
          </div>
        </div>

        {downloadSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 shadow-xs whitespace-pre-line">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{downloadSuccessMsg}</span>
          </div>
        )}

      </div>

      {/* Main Slide Stage (Normal Embedded View with Responsive Scaling Engine) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Slide Stage Canvas (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* THE RESPONSIVE SCALING STAGE CONTAINER (CO GIÃN KHỚP KHUNG) */}
          <div 
            ref={stageContainerRef}
            onMouseMove={handleStageMouseMove}
            className="w-full h-[540px] sm:h-[600px] md:h-[660px] bg-slate-900/90 rounded-3xl p-3 flex items-center justify-center relative overflow-hidden border-2 border-slate-700 shadow-2xl"
          >
            {/* The scaled slide canvas frame */}
            <div
              style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `scale(${normalScale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              className="rounded-2xl shadow-2xl overflow-hidden relative select-none flex flex-col justify-between shrink-0"
            >
              {renderSlideStageContent(currentSlide, false)}

              {/* Drawing Annotation Canvas Overlay */}
              <canvas
                ref={canvasRef}
                width={baseWidth}
                height={baseHeight}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={`absolute inset-0 z-20 ${penActive ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
              />

              {/* Laser Pointer Overlay */}
              {laserActive && laserPos && (
                <div 
                  style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
                  className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_#EF4444] animate-ping" />
                  <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_#DC2626] -mt-3.5 ml-0.5" />
                </div>
              )}
            </div>

            {/* Floating In-Stage Quick Tools Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-950/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full border border-slate-700 shadow-2xl flex items-center gap-3 text-xs">
              {/* Laser button */}
              <button
                onClick={() => setLaserActive(!laserActive)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  laserActive ? 'bg-red-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
                title="Bút Laser ảo (Phím L)"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <span>Laser (L)</span>
              </button>

              {/* Pen button */}
              <button
                onClick={() => setPenActive(!penActive)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  penActive ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
                title="Bút vẽ ghi chú trực tiếp (Phím P)"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Bút (P)</span>
              </button>

              {penActive && (
                <button
                  onClick={clearAnnotation}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  title="Xóa nét vẽ"
                >
                  <Eraser className="w-3 h-3" />
                  <span>Xóa</span>
                </button>
              )}

              {/* Blackboard Scratch toggle */}
              <button
                onClick={() => setScratchBoard(scratchBoard === 'blackboard' ? 'none' : 'blackboard')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  scratchBoard === 'blackboard' ? 'bg-emerald-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
                title="Mở Bảng đen nháp phấn trắng (Phím B)"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bảng đen (B)</span>
              </button>

              {/* Reveal answer button */}
              <button
                onClick={() => toggleRevealQuiz(currentSlide.id)}
                className="text-slate-300 hover:text-amber-300 text-xs font-bold"
                title="Hiện/Ẩn đáp án trắc nghiệm (Phím R)"
              >
                Đáp án (R)
              </button>
            </div>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => {
                if (currentSlideIndex > 0) {
                  setCurrentSlideIndex(i => i - 1);
                }
              }}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-xl text-xs font-bold transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Slide trước</span>
            </button>

            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg font-mono">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <span>• {currentSlide.title}</span>
            </span>

            <button
              onClick={() => {
                if (currentSlideIndex < slides.length - 1) {
                  setCurrentSlideIndex(i => i + 1);
                }
              }}
              disabled={currentSlideIndex === slides.length - 1}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <span>Slide tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail Sidebar (Right 1 col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4 text-indigo-600" />
              Danh Sách Slide ({slides.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                }}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition text-left relative ${
                  idx === currentSlideIndex
                    ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    idx === currentSlideIndex ? 'bg-[#F6C768] text-[#162E44]' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{idx + 1} • {s.slideType || s.phase}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(s.id);
                    }}
                    disabled={slides.length <= 1}
                    className="text-slate-400 hover:text-red-500 disabled:opacity-20 p-1"
                    title="Xóa slide này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-black text-slate-800 line-clamp-1">{s.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {s.subtitle || s.bannerPrompt || (s.bullets && s.bullets[0]) || 'Bài giảng KNTT'}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN THEATER PRESENTATION MODE (F5 - KHỚP 100% KHUNG MÁY CHIẾU) */}
      {/* ========================================================================= */}
      {isFullscreen && (
        <div 
          ref={fullscreenContainerRef}
          onMouseMove={handleStageMouseMove}
          className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none overflow-hidden"
        >
          {/* Top Bar Fullscreen */}
          <div className="flex items-center justify-between bg-slate-950/90 text-white px-6 py-3 border-b border-slate-800 z-50">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-[#F6C768] text-[#162E44]">
                {currentSlide.badgeText || `${(khbd.subject || 'TOÁN').toUpperCase()} • TIẾT ${khbd.currentPeriod || 1}`}
              </span>
              <span className="text-sm font-bold text-slate-200">
                {khbd.lessonName}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Aspect Ratio Switcher */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-2.5 py-1 rounded font-bold ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  16:9
                </button>
                <button
                  onClick={() => setAspectRatio('4:3')}
                  className={`px-2.5 py-1 rounded font-bold ${aspectRatio === '4:3' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                >
                  4:3
                </button>
              </div>

              {/* Sound Button */}
              <button onClick={toggleSound} className="p-1.5 text-slate-300 hover:text-white">
                {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2 font-mono text-sm bg-slate-900 text-white px-3 py-1 rounded-lg border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{formatTime(timerSeconds)}</span>
              </div>

              <span className="text-sm font-mono font-bold text-slate-300">
                Slide {currentSlideIndex + 1} / {slides.length}
              </span>

              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white border border-slate-700"
                title="Thoát toàn màn hình (ESC)"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Stage Presentation Viewport (Fluid Auto Scaling) */}
          <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
            <div
              style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `scale(${fsScale})`,
                transformOrigin: 'center center',
              }}
              className="rounded-2xl shadow-2xl overflow-hidden relative select-none flex flex-col justify-between shrink-0"
            >
              {renderSlideStageContent(currentSlide, true)}

              {/* Drawing Canvas Overlay in Fullscreen */}
              <canvas
                ref={fsCanvasRef}
                width={baseWidth}
                height={baseHeight}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={`absolute inset-0 z-20 ${penActive ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
              />

              {/* Laser Pointer in Fullscreen */}
              {laserActive && laserPos && (
                <div 
                  style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
                  className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-5 h-5 rounded-full bg-red-500 shadow-[0_0_20px_#EF4444] animate-ping" />
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_12px_#DC2626] -mt-4 ml-0.5" />
                </div>
              )}
            </div>
          </div>

          {/* Floating Presenter Bar at Bottom */}
          <div className="flex items-center justify-between bg-slate-950/95 text-slate-300 px-6 py-3 border-t border-slate-800 text-xs z-50">
            <div className="flex items-center gap-4">
              <span>Phím: [←] Trước • [→ / Space] Tiếp • [L] Laser • [P] Bút • [B] Bảng đen • [ESC] Thoát</span>
              
              <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                <button
                  onClick={() => setLaserActive(!laserActive)}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    laserActive ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <span>Laser</span>
                </button>

                <button
                  onClick={() => setPenActive(!penActive)}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    penActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Bút vẽ</span>
                </button>

                {penActive && (
                  <button
                    onClick={clearAnnotation}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                  >
                    Xóa nét
                  </button>
                )}

                <button
                  onClick={() => setScratchBoard(scratchBoard === 'blackboard' ? 'none' : 'blackboard')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition ${
                    scratchBoard === 'blackboard' ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bảng đen</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (currentSlideIndex > 0) {
                    setCurrentSlideIndex(i => i - 1);
                  }
                }}
                disabled={currentSlideIndex === 0}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 rounded-xl font-bold border border-slate-700"
              >
                Slide trước
              </button>
              <button
                onClick={() => {
                  if (currentSlideIndex < slides.length - 1) {
                    setCurrentSlideIndex(i => i + 1);
                  }
                }}
                disabled={currentSlideIndex === slides.length - 1}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-xl text-white font-black shadow-lg"
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LUCKY GIFT BOX REWARD MODAL (BỐC HỘP QUÀ MAY MẮN) */}
      {/* ========================================================================= */}
      {luckyModalOpen && openedGiftBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-50 to-white border-4 border-amber-400 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setLuckyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-20 h-20 bg-amber-300 text-amber-950 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl mb-4 border-2 border-white animate-bounce">
              {openedGiftBox.icon}
            </div>

            <div className="inline-block bg-[#B45309] text-amber-200 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2">
              {openedGiftBox.name} • {openedGiftBox.symbol}
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">
              CHÚC MỪNG EM ĐÃ MỞ ĐƯỢC QUÀ! 🎉
            </h2>

            <div className="bg-amber-100/80 border-2 border-amber-300 rounded-2xl p-5 my-4">
              <div className="text-xl font-black text-[#0F2942]">
                {openedGiftBox.reward}
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-6">
              Phần thưởng sẽ được ghi nhận vào sổ theo dõi thi đua học tập môn Toán!
            </p>

            <button
              onClick={() => setLuckyModalOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-black text-sm shadow-xl"
            >
              Tiếp tục bài giảng
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK SCRATCH BLACKBOARD / WHITEBOARD OVERLAY */}
      {/* ========================================================================= */}
      {scratchBoard !== 'none' && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className={`w-full max-w-5xl h-[85vh] rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative ${
            scratchBoard === 'blackboard' ? 'bg-[#0F3F2E] border-8 border-[#B45309] text-white' : 'bg-white border-4 border-slate-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-emerald-700/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span className="font-black text-base uppercase">
                  {scratchBoard === 'blackboard' ? 'BẢNG ĐEN NHÁP PHẤN TRẮNG' : 'BẢNG TRẮNG VIẾT BÚT DẠ'}
                </span>
                <span className="text-xs text-emerald-300 ml-2">Dành cho giáo viên giảng giải và viết nháp công thức</span>
              </div>
              <button
                onClick={() => setScratchBoard('none')}
                className="p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 my-4 flex items-center justify-center border border-dashed border-emerald-500/30 rounded-2xl p-4 text-center">
              <div className="space-y-2 text-emerald-200/80">
                <div className="text-2xl font-mono">u · v = |u| · |v| · cos(u, v)</div>
                <div className="text-sm">Bảng phụ sẵn sàng cho giáo viên ghi chú hoặc mời học sinh lên bảng giải toán trực tiếp.</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-emerald-700/50">
              <span>Bấm phím [B] hoặc [ESC] để đóng bảng nháp và trở lại bài giảng</span>
              <button
                onClick={() => setScratchBoard('none')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl"
              >
                Quay lại Slide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
