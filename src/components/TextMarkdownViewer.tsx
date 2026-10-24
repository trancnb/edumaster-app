import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Eye, 
  Code2, 
  ShieldCheck, 
  Search, 
  Maximize2,
  FileText
} from 'lucide-react';

interface TextMarkdownViewerProps {
  fileName: string;
  content: string;
  isMarkdown?: boolean;
  zoomLevel?: number;
  searchKeyword?: string;
  fileSize?: string;
}

export const TextMarkdownViewer: React.FC<TextMarkdownViewerProps> = ({
  fileName,
  content,
  isMarkdown = true,
  zoomLevel = 100,
  searchKeyword = '',
  fileSize
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  const lines = useMemo(() => {
    return (content || '').split('\n');
  }, [content]);

  const handleCopyAll = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Hàm highlight từ khóa tìm kiếm
  const renderHighlightedText = (text: string) => {
    if (!searchKeyword.trim()) return text;
    const parts = text.split(new RegExp(`(${searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchKeyword.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 text-slate-900 px-0.5 rounded-xs font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Chuyển đổi Markdown cơ bản sang HTML trực quan
  const renderFormattedMarkdownLine = (line: string, index: number) => {
    const trimmed = line.trim();

    // Tiêu đề H1
    if (line.startsWith('# ')) {
      return (
        <h1 key={index} className="text-xl sm:text-2xl font-black text-blue-900 border-b-2 border-blue-200 pb-2.5 mt-5 mb-3 tracking-tight">
          {renderHighlightedText(line.substring(2))}
        </h1>
      );
    }
    // Tiêu đề H2
    if (line.startsWith('## ')) {
      return (
        <h2 key={index} className="text-base sm:text-lg font-black text-indigo-900 border-b border-slate-200 pb-1.5 mt-4 mb-2 tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
          <span>{renderHighlightedText(line.substring(3))}</span>
        </h2>
      );
    }
    // Tiêu đề H3
    if (line.startsWith('### ')) {
      return (
        <h3 key={index} className="text-sm sm:text-base font-bold text-slate-900 mt-3 mb-1.5 tracking-tight">
          {renderHighlightedText(line.substring(4))}
        </h3>
      );
    }
    // Tiêu đề H4
    if (line.startsWith('#### ')) {
      return (
        <h4 key={index} className="text-xs sm:text-sm font-bold text-slate-800 mt-2 mb-1">
          {renderHighlightedText(line.substring(5))}
        </h4>
      );
    }
    // Đường kẻ ngang
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      return <hr key={index} className="border-t border-slate-300 my-4" />;
    }
    // Trích dẫn blockquote
    if (line.startsWith('> ')) {
      return (
        <blockquote key={index} className="border-l-4 border-indigo-500 bg-indigo-50/60 px-3.5 py-1.5 my-2 rounded-r-md text-xs italic text-slate-700">
          {renderHighlightedText(line.substring(2))}
        </blockquote>
      );
    }
    // Danh sách gạch đầu dòng
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <div key={index} className="flex items-start gap-2 ml-4 my-1 text-xs text-slate-800 leading-relaxed">
          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
          <div>{renderHighlightedInline(line.substring(2))}</div>
        </div>
      );
    }
    // Danh sách số thứ tự
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      return (
        <div key={index} className="flex items-start gap-2 ml-4 my-1 text-xs text-slate-800 leading-relaxed">
          <span className="text-indigo-700 font-bold text-[11px] shrink-0 mt-0.5 min-w-[16px]">{numberedMatch[1]}.</span>
          <div>{renderHighlightedInline(numberedMatch[2])}</div>
        </div>
      );
    }
    // Dòng trống
    if (!trimmed) {
      return <div key={index} className="h-2.5" />;
    }

    // Dòng bình thường có thể có in đậm (**text**) hoặc in nghiêng
    return (
      <p key={index} className="text-xs sm:text-sm text-slate-800 leading-relaxed my-1">
        {renderHighlightedInline(line)}
      </p>
    );
  };

  // Render các tag inline như **bold**, `code`
  const renderHighlightedInline = (text: string) => {
    // Tách bold **...**
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-slate-950 bg-amber-50/80 px-0.5 rounded-xs">
            {renderHighlightedText(part.substring(2, part.length - 2))}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="font-mono text-xs bg-slate-100 text-pink-600 px-1 py-0.5 rounded border border-slate-200">
            {renderHighlightedText(part.substring(1, part.length - 1))}
          </code>
        );
      }
      return <React.Fragment key={idx}>{renderHighlightedText(part)}</React.Fragment>;
    });
  };

  return (
    <div className="w-full max-w-5xl space-y-3">
      {/* HEADER BANNER */}
      <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-300 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 font-sans print:hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
            isMarkdown ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-purple-100 text-purple-800 border border-purple-300'
          }`}>
            {isMarkdown ? 'MARKDOWN FILE' : 'TEXT PROMPT'}
          </span>
          <span className="font-bold text-slate-900 truncate max-w-sm sm:max-w-md" title={fileName}>
            {fileName}
          </span>
          {fileSize && (
            <span className="text-slate-400 shrink-0 text-[11px]">({fileSize})</span>
          )}
          <span className="text-slate-400 shrink-0 text-[11px] hidden sm:inline">
            • {lines.length} dòng
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Chế độ xem: Định dạng vs Mã nguồn */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'preview' ? 'bg-white shadow-2xs text-indigo-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Định dạng</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'raw' ? 'bg-white shadow-2xs text-indigo-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Mã nguồn</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyAll}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
            title="Sao chép toàn bộ nội dung file"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Sao chép</span>
              </>
            )}
          </button>

          <div className="hidden md:flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>File Gốc Nguyên Bản 100%</span>
          </div>
        </div>
      </div>

      {/* DOCUMENT PAPER DISPLAY */}
      <div 
        style={{ zoom: `${zoomLevel}%` }}
        className="bg-white shadow-xl rounded-xl border border-slate-300 p-6 sm:p-10 min-h-[700px] text-slate-900 relative transition-all"
      >
        {viewMode === 'preview' ? (
          <div className="prose max-w-none font-sans text-slate-800 leading-relaxed">
            {lines.map((line, idx) => renderFormattedMarkdownLine(line, idx))}
          </div>
        ) : (
          <div className="overflow-x-auto font-mono text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
            {lines.map((line, idx) => (
              <div key={idx} className="flex hover:bg-slate-100/80 -mx-4 px-4 py-0.5">
                <span className="select-none text-slate-400 text-right pr-4 min-w-[40px] font-mono shrink-0">
                  {idx + 1}
                </span>
                <span className="whitespace-pre-wrap break-all flex-1">
                  {renderHighlightedText(line) || <span className="opacity-0">.</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer ghi nhận nguồn tài liệu */}
        <div className="mt-12 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-sans text-slate-500">
          <div className="flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Tài liệu: <strong>{fileName}</strong></span>
            {fileSize && <span>• Dung lượng: {fileSize}</span>}
          </div>
          <div className="text-emerald-700 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Nội dung chính xác 100% tệp gốc do giáo viên nạp</span>
          </div>
        </div>
      </div>
    </div>
  );
};
