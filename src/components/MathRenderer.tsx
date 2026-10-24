import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
  block?: boolean;
}

/**
 * MathRenderer: Component render toán học chuẩn KaTeX
 * - Hỗ trợ cả inline math ($...$) và display math ($$...$$)
 * - Tự động phát hiện các biểu thức toán học dạng LaTeX thuần (\begin{cases}, \frac, v.v.)
 * - Tuyệt đối không để lại ký tự mã LaTeX thô trong giao diện
 * - Phông chữ toán học sắc nét, chuẩn mực typography sư phạm
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ 
  text, 
  className = '', 
  block = false 
}) => {
  const renderedContent = useMemo(() => {
    if (!text) return '';

    // Nếu văn bản bắt đầu bằng block math hoàn chỉnh hoặc là một khối LaTeX lớn
    if (text.startsWith('$$') && text.endsWith('$$') && text.length > 4) {
      const mathExpr = text.slice(2, -2).trim();
      try {
        return katex.renderToString(mathExpr, {
          displayMode: true,
          throwOnError: false,
          output: 'html'
        });
      } catch {
        return text;
      }
    }

    // Nếu toàn bộ chuỗi là một phương trình bắt đầu bằng \begin{cases} hoặc có cấu trúc LaTeX rõ rệt không có dấu $
    if (text.startsWith('\\begin{') || (text.includes('\\frac{') && !text.includes('$'))) {
      try {
        return katex.renderToString(text.trim(), {
          displayMode: block,
          throwOnError: false,
          output: 'html'
        });
      } catch {
        return text;
      }
    }

    // Phân tích văn bản có chứa $...$ hoặc $$...$$
    // Regex tìm $$...$$ trước, sau đó tìm $...$
    const parts: string[] = [];
    let lastIndex = 0;
    const regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Đưa đoạn text trước công thức vào
      if (match.index > lastIndex) {
        const plainText = text.substring(lastIndex, match.index);
        parts.push(escapeHtml(plainText).replace(/\n/g, '<br/>'));
      }

      const isBlock = Boolean(match[1]);
      const mathExpr = (match[1] || match[2]).trim();

      try {
        const html = katex.renderToString(mathExpr, {
          displayMode: isBlock,
          throwOnError: false,
          output: 'html'
        });
        parts.push(html);
      } catch {
        // Fallback nhẹ nếu công thức lỗi
        parts.push(`<span class="font-mono text-xs bg-slate-100 px-1 rounded">${escapeHtml(mathExpr)}</span>`);
      }

      lastIndex = regex.lastIndex;
    }

    // Đưa đoạn còn lại vào
    if (lastIndex < text.length) {
      const rest = text.substring(lastIndex);
      parts.push(escapeHtml(rest).replace(/\n/g, '<br/>'));
    }

    return parts.join('');
  }, [text, block]);

  return (
    <span
      className={`math-renderer inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default MathRenderer;
