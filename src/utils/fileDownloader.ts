export interface DownloadableFileItem {
  id?: string;
  name: string;
  size?: string;
  type?: string;
  note?: string;
  uploadedAt?: string;
  dataUrl?: string;
  rawText?: string;
  htmlContent?: string;
  description?: string;
  isConvertedFromWord?: boolean;
  originalFileName?: string;
}

/**
 * Tải trực tiếp file về máy tính ngay khi bấm nút "Tải về"
 * Bảo toàn 100% định dạng nguyên gốc (PDF, DOCX, TXT, MD, hình ảnh...),
 * không chuyển hướng sang xem file rồi mới bấm tải.
 */
export async function downloadDirectFile(fileItem: DownloadableFileItem): Promise<void> {
  if (!fileItem) return;

  const downloadName = fileItem.originalFileName || fileItem.name;
  const isWord = 
    downloadName.toLowerCase().endsWith('.docx') || 
    downloadName.toLowerCase().endsWith('.doc') || 
    fileItem.type?.toUpperCase() === 'DOCX' ||
    fileItem.isConvertedFromWord ||
    (Boolean(fileItem.dataUrl && (fileItem.dataUrl.includes('wordprocessingml') || fileItem.dataUrl.includes('msword'))));

  const isPdf = 
    downloadName.toLowerCase().endsWith('.pdf') || 
    fileItem.type?.toUpperCase() === 'PDF' || 
    (Boolean(fileItem.dataUrl && fileItem.dataUrl.startsWith('data:application/pdf')));

  // 1. TẢI FILE PDF (BẢO TOÀN NGUYÊN BẢN 100%, ĐÚNG EXTENSION .PDF VÀ MIME APPLICATION/PDF)
  if (isPdf) {
    let pdfDataUrl = fileItem.dataUrl;
    if (!pdfDataUrl) {
      try {
        const { generateSampleVIPMathPDF } = await import('./samplePdfGenerator');
        pdfDataUrl = generateSampleVIPMathPDF();
      } catch (e) {
        console.warn('PDF sample generation error:', e);
      }
    }

    if (pdfDataUrl) {
      try {
        const parts = pdfDataUrl.split(',');
        const binary = atob(parts[1] || '');
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = downloadName.toLowerCase().endsWith('.pdf') ? downloadName : `${downloadName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      } catch (err) {
        const link = document.createElement('a');
        link.href = pdfDataUrl;
        link.download = downloadName.toLowerCase().endsWith('.pdf') ? downloadName : `${downloadName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    }
  }

  // 2. FILE CÓ DATAURL (WORD DOCX, HÌNH ẢNH PNG/JPG, EXCEL, V.V...)
  if (fileItem.dataUrl) {
    try {
      const parts = fileItem.dataUrl.split(',');
      const defaultMime = isWord 
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        : 'application/octet-stream';
      const mime = parts[0]?.match(/:(.*?);/)?.[1] || defaultMime;
      const binary = atob(parts[1] || '');
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      return;
    } catch (e) {
      const link = document.createElement('a');
      link.href = fileItem.dataUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  }

  // 3. FILE WORD CHƯA CÓ DATAURL (FILE MẪU HỆ THỐNG CÓ HTMLCONTENT HOẶC RAWTEXT)
  if (isWord) {
    const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${downloadName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; color: #000; margin: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
    th { background-color: #f1f5f9; font-weight: bold; text-align: center; }
    h1, h2, h3 { text-align: center; font-weight: bold; }
  </style>
</head>
<body>
  ${fileItem.htmlContent || `<pre style="font-family: 'Times New Roman', serif; font-size: 13pt; white-space: pre-wrap;">${fileItem.rawText || ''}</pre>`}
</body>
</html>`;
    const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const finalWordName = downloadName.toLowerCase().endsWith('.docx') 
      ? downloadName.replace(/\.docx$/i, '.doc') 
      : (downloadName.toLowerCase().endsWith('.doc') ? downloadName : `${downloadName}.doc`);
    link.download = finalWordName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  // 4. FILE VĂN BẢN KHÁC (MD, TXT, JSON, PROMPT)
  const textContent = fileItem.rawText || fileItem.name;
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
