/**
 * Tiện ích giải mã và trích xuất dữ liệu văn bản từ base64 DataURL
 * Bảo toàn 100% chuẩn mã hóa tiếng Việt UTF-8 byte-for-byte.
 */

export function extractTextFromDataUrl(dataUrl: string): string {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes(',')) {
    return '';
  }

  try {
    const commaIndex = dataUrl.indexOf(',');
    const meta = dataUrl.substring(0, commaIndex);
    const content = dataUrl.substring(commaIndex + 1);

    if (meta.includes(';base64')) {
      const cleanContent = content.replace(/\s/g, '');
      const binaryString = atob(cleanContent);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    } else {
      return decodeURIComponent(content);
    }
  } catch (err) {
    console.warn('Failed standard UTF-8 decode, attempting fallback decode:', err);
    try {
      const parts = dataUrl.split(',');
      return decodeURIComponent(escape(atob(parts[1] || '')));
    } catch {
      try {
        const parts = dataUrl.split(',');
        return atob(parts[1] || '');
      } catch {
        return '';
      }
    }
  }
}
