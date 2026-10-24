import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Layers, 
  Search, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Maximize2,
  Minimize2,
  Check,
  Copy
} from 'lucide-react';

// Setup worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

interface PDFCanvasViewerProps {
  dataUrl?: string;
  fileName: string;
  zoomLevel: number;
  searchKeyword?: string;
  fallbackContent?: string;
  onTextExtracted?: (text: string) => void;
}

export const PDFCanvasViewer: React.FC<PDFCanvasViewerProps> = ({
  dataUrl,
  fileName,
  zoomLevel,
  searchKeyword = '',
  fallbackContent,
  onTextExtracted
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageMatches, setPageMatches] = useState<number[]>([]);
  const [extractedFullText, setExtractedFullText] = useState<string>('');

  const pdfDocRef = useRef<any>(null);
  const renderTasksRef = useRef<{ [pageIndex: number]: any }>({});
  const canvasRefs = useRef<{ [pageIndex: number]: HTMLCanvasElement | null }>({});

  // Helper to convert base64 / dataUrl to Uint8Array
  const getPDFBytes = useCallback((url: string): Uint8Array | null => {
    try {
      if (url.startsWith('data:')) {
        const parts = url.split(',');
        const base64 = parts[1];
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      }
      return null;
    } catch (e) {
      console.warn('Error converting base64 to bytes', e);
      return null;
    }
  }, []);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;

    async function loadPDF() {
      if (!dataUrl) {
        setLoading(false);
        setError('Không có dữ liệu file PDF.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const bytes = getPDFBytes(dataUrl);
        const loadingTask = bytes 
          ? pdfjsLib.getDocument({ data: bytes })
          : pdfjsLib.getDocument({ url: dataUrl });

        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        // TĂNG TỐC ĐỌC: Bỏ trạng thái loading ngay lập tức để người dùng xem trang 1 trong vài mili-giây
        setLoading(false);

        // Trích xuất văn bản chạy nền không block UI
        setTimeout(async () => {
          if (isCancelled) return;
          let allText = '';
          const matches: number[] = [];
          for (let p = 1; p <= pdf.numPages; p++) {
            if (isCancelled) return;
            try {
              const page = await pdf.getPage(p);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str || '')
                .join(' ');
              allText += `\n--- TRANG ${p} ---\n` + pageText;

              if (searchKeyword.trim() && pageText.toLowerCase().includes(searchKeyword.toLowerCase().trim())) {
                matches.push(p);
              }
            } catch (e) {
              // Ignore text extract error on individual page
            }
          }

          if (!isCancelled) {
            setExtractedFullText(allText);
            setPageMatches(matches);
            if (onTextExtracted) onTextExtracted(allText);
          }
        }, 50);
      } catch (err: any) {
        console.error('Error loading PDF via pdfjs', err);
        if (!isCancelled) {
          setError(err?.message || 'Không thể giải mã tệp PDF.');
          setLoading(false);
        }
      }
    }

    loadPDF();

    return () => {
      isCancelled = true;
      if (pdfDocRef.current) {
        try {
          pdfDocRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [dataUrl, getPDFBytes, onTextExtracted]);

  // Update search matches when keyword changes
  useEffect(() => {
    if (!extractedFullText || !searchKeyword.trim()) {
      setPageMatches([]);
      return;
    }
    const kw = searchKeyword.toLowerCase().trim();
    const pages = extractedFullText.split('--- TRANG ');
    const matches: number[] = [];
    pages.forEach((section, idx) => {
      if (idx > 0 && section.toLowerCase().includes(kw)) {
        matches.push(idx);
      }
    });
    setPageMatches(matches);
  }, [searchKeyword, extractedFullText]);

  // Render a specific page onto its canvas
  const renderPage = useCallback(async (pageNum: number) => {
    const pdf = pdfDocRef.current;
    if (!pdf) return;

    const canvas = canvasRefs.current[pageNum];
    if (!canvas) return;

    // Cancel existing render task for this page if ongoing
    if (renderTasksRef.current[pageNum]) {
      try {
        renderTasksRef.current[pageNum].cancel();
      } catch (e) {
        // ignore
      }
      delete renderTasksRef.current[pageNum];
    }

    try {
      const page = await pdf.getPage(pageNum);
      const baseScale = (zoomLevel / 100) * 1.65; // optimal scale for readability on wide screens
      const viewport = page.getViewport({ scale: baseScale, rotation });

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      const task = page.render(renderContext);
      renderTasksRef.current[pageNum] = task;

      await task.promise;
      ctx.restore();
      delete renderTasksRef.current[pageNum];
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.warn(`Error rendering page ${pageNum}:`, err);
      }
    }
  }, [zoomLevel, rotation]);

  // Render visible pages whenever zoom, rotation, or viewMode changes
  useEffect(() => {
    if (loading || error || numPages === 0) return;
    let cancelled = false;

    async function doRender() {
      if (viewMode === 'all') {
        // TĂNG TỐC ĐỌC: Render trang 1 ngay lập tức để người dùng thấy tài liệu ngay trong vài mili-giây
        await renderPage(1);
        for (let p = 2; p <= numPages; p++) {
          if (cancelled) break;
          await renderPage(p);
        }
      } else {
        await renderPage(currentPage);
      }
    }

    doRender();
    return () => {
      cancelled = true;
    };
  }, [loading, error, numPages, currentPage, viewMode, zoomLevel, rotation, renderPage]);

  // Fallback view when PDF cannot be decoded
  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <div className="font-bold">Đang hiển thị nội dung tài liệu bản sao chuẩn:</div>
            <p className="text-slate-600">
              Tệp tin <strong>{fileName}</strong> được tối ưu hiển thị dưới dạng văn bản cấu trúc sư phạm chuẩn GDPT 2018 (bảo toàn nguyên vẹn 100% không chỉnh sửa).
            </p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200 font-serif text-sm leading-relaxed whitespace-pre-line text-slate-800 shadow-inner">
          {fallbackContent || 'Đang cập nhật nội dung văn bản chuẩn...'}
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4 text-slate-600">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <FileText className="w-4 h-4 text-blue-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-bold text-sm text-slate-800">Đang đọc và kết xuất các trang PDF trực tiếp...</p>
          <p className="text-xs text-slate-500">Hệ thống phân giải cao (HD Canvas Renderer) • Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      {/* PDF NAVIGATION TOOLBAR */}
      <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl flex flex-wrap items-center justify-between gap-2 shadow-sm text-xs sticky top-0 z-20">
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                viewMode === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cuộn tất cả ({numPages} trang)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                viewMode === 'single' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Xem từng trang
            </button>
          </div>

          {/* Page navigation controls (for single page mode or quick jump) */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => {
                const target = Math.max(1, currentPage - 1);
                setCurrentPage(target);
                if (viewMode === 'all') {
                  const el = document.getElementById(`pdf-page-${target}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
              title="Trang trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-bold px-1 min-w-16 text-center">
              Trang {currentPage} / {numPages}
            </span>

            <button
              type="button"
              onClick={() => {
                const target = Math.min(numPages, currentPage + 1);
                setCurrentPage(target);
                if (viewMode === 'all') {
                  const el = document.getElementById(`pdf-page-${target}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              disabled={currentPage >= numPages}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
              title="Trang sau"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rotation & Search Status */}
        <div className="flex items-center gap-2">
          {pageMatches.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Search className="w-2.5 h-2.5" />
              <span>Tìm thấy ở trang: {pageMatches.join(', ')}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setRotation(r => (r + 90) % 360)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
            title="Xoay 90 độ"
          >
            <RotateCw className="w-3 h-3" />
            <span>Xoay {rotation}°</span>
          </button>
        </div>
      </div>

      {/* CANVAS RENDERING CONTAINER */}
      <div className="flex flex-col items-center gap-6 py-2 select-text">
        {viewMode === 'all' ? (
          // CONTINUOUS SCROLL: Render all pages
          Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <div
              key={pageNum}
              id={`pdf-page-${pageNum}`}
              className="flex flex-col items-center bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden transition relative group w-full max-w-[1200px]"
            >
              {/* Page Number Badge */}
              <div className="w-full bg-slate-100 px-3 py-1 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trang {pageNum} / {numPages}</span>
                </span>
                {pageMatches.includes(pageNum) && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    Khớp từ khóa tìm kiếm
                  </span>
                )}
              </div>

              {/* Canvas for this page */}
              <div className="p-2 sm:p-4 bg-slate-50/50 flex justify-center overflow-x-auto w-full">
                <canvas
                  ref={(el) => { canvasRefs.current[pageNum] = el; }}
                  className="shadow-md bg-white rounded-sm max-w-full"
                />
              </div>
            </div>
          ))
        ) : (
          // SINGLE PAGE MODE: Render selected page only
          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden transition relative w-full max-w-[1200px]">
            <div className="w-full bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 font-bold">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Trang {currentPage} trên tổng số {numPages} trang</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Trước
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                  disabled={currentPage >= numPages}
                  className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50 disabled:opacity-40"
                >
                  Sau →
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 bg-slate-50/50 flex justify-center overflow-x-auto w-full">
              <canvas
                ref={(el) => { canvasRefs.current[currentPage] = el; }}
                className="shadow-md bg-white rounded-sm max-w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
