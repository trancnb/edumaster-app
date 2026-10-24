import { CURRICULUM_TOAN_9 } from '../data/curriculumToan9';
import { CURRICULUM_TOAN_8 } from '../data/multiGradeCurriculum';
import { GradeLevel } from '../types/edtech';

export interface StoredPPCT {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: 'docx' | 'pdf' | 'xlsx';
  description: string;
  totalPeriods: number;
  dataUrl?: string; // Stored base64 if user uploaded
  isDefault?: boolean;
  rawText?: string;
  htmlContent?: string;
  isConvertedFromWord?: boolean;
  originalFileName?: string;
  isCirculating?: boolean; // Hiệu lực lưu hành
  isOriginal?: boolean; // NEW: File gốc
  curriculumData?: any[]; // Snapshot of curriculum
}

const STORAGE_KEY_PREFIX = 'edtech_stored_ppct_list_';

export const DEFAULT_PPCT_LIST_LOP_9: StoredPPCT[] = [];
export const DEFAULT_PPCT_LIST_LOP_8: StoredPPCT[] = [];
export const DEFAULT_PPCT_LIST: StoredPPCT[] = [];

export function getGradeStorageKey(grade: GradeLevel = 'Lớp 9'): string {
  return `${STORAGE_KEY_PREFIX}${grade.replace(/\s+/g, '_')}`;
}

export function getDefaultPPCTForGrade(grade: GradeLevel = 'Lớp 9'): StoredPPCT[] {
  if (grade === 'Lớp 8') {
    return [{
      id: 'ppct-toan-8-thao-phuluc3',
      name: 'THAO - PHU LUC 3 TOAN 8- NLS-AI.docx',
      originalFileName: 'THAO - PHU LUC 3 TOAN 8- NLS-AI.docx',
      size: '184.5 KB',
      uploadedAt: 'File gốc ban đầu',
      type: 'docx',
      description: 'Kế hoạch giáo dục & Kế hoạch bài dạy môn Toán 8 (THCS Mỹ Hóa)',
      totalPeriods: 140,
      isOriginal: true,
      isCirculating: true,
      isConvertedFromWord: true
    }];
  }

  return [{
    id: 'ppct-toan-9-goc',
    name: 'PPCT Toán 9 (140 tiết) - Năm học 2026-2027.docx',
    originalFileName: 'PPCT Toán 9 (140 tiết) - Năm học 2026-2027.docx',
    size: '142.5 KB',
    uploadedAt: 'File gốc ban đầu',
    type: 'docx',
    description: 'Kế hoạch dạy học môn Toán 9 (140 tiết • HK1: 72 tiết, HK2: 68 tiết) - Trường THCS Mỹ Hóa',
    totalPeriods: 140,
    isOriginal: true,
    isCirculating: true,
    isConvertedFromWord: true
  }];
}

// Kiểm tra xem một file có phải là file mẫu dummy của hệ thống không
export function isMockPpctFile(item: StoredPPCT): boolean {
  // Bản lưu hành, bản gốc, bản cập nhật tuyệt đối không phải mock
  if (item.isCirculating || item.isOriginal || (item.name && /cập\s*nhật/i.test(item.name))) {
    return false;
  }
  if (item.id === 'ppct-toan-9-goc' || item.id === 'ppct-toan-8-thao-phuluc3') {
    return false;
  }
  if (item.isDefault) return true;
  const name = (item.name || '').toLowerCase();
  const id = (item.id || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const up = (item.uploadedAt || '').toLowerCase();

  if (desc.includes('mẫu chuẩn hệ thống') || up.includes('mẫu chuẩn hệ thống')) return true;

  if (
    id.includes('ppct-toan-9-standard') ||
    id.includes('ppct-toan-thcs-tongthe-9') ||
    id.includes('ppct-toan-9-tongthe') ||
    id.includes('ppct-toan-8-standard') ||
    id.includes('ppct-toan-8-pdf') ||
    id.includes('ppct-toan-7-standard') ||
    id.includes('ppct-toan-6-standard')
  ) {
    return true;
  }

  if (
    name.includes('ppct_toan_lop9_140tiet') ||
    name.includes('ppct_toan_thcs_lop9_tongthe') ||
    name.includes('ppct_toan_lop8_140tiet') ||
    name.includes('ppct_toan_8_kntt_chuan') ||
    name.includes('ppct_toan_lop7_140tiet') ||
    name.includes('ppct_toan_lop6_140tiet')
  ) {
    if (!item.dataUrl && !item.isConvertedFromWord && !item.htmlContent) {
      return true;
    }
  }

  return false;
}

// Hàm làm sạch và chống trùng lặp file (loại bỏ bản sao trùng tên và file mẫu thừa)
export function deduplicatePpctList(list: StoredPPCT[], grade?: GradeLevel): StoredPPCT[] {
  const seenNames = new Set<string>();
  const cleanList: StoredPPCT[] = [];

  for (const item of list) {
    // 1. Loại bỏ toàn bộ file dummy hệ thống
    if (isMockPpctFile(item)) continue;

    // 2. Bảo toàn 100% định dạng Word docx
    let workingItem = { ...item };
    if (workingItem.name.toLowerCase().endsWith('.docx') || workingItem.name.toLowerCase().endsWith('.doc')) {
      workingItem.originalFileName = workingItem.originalFileName || item.name;
      workingItem.type = 'docx';
      workingItem.isConvertedFromWord = true;
    }

    // 3. Cách ly theo khối
    if (grade === 'Lớp 8' && /to[aá]n\s*9|l[oớ]p\s*9|kh[oố]i\s*9|9a\d?/i.test(workingItem.name)) {
      continue;
    }
    if (grade === 'Lớp 9' && /to[aá]n\s*8|l[oớ]p\s*8|kh[oố]i\s*8|8a\d?/i.test(workingItem.name)) {
      continue;
    }

    // 4. Chuẩn hóa tên file để so sánh trùng lặp
    const norm = (workingItem.originalFileName || workingItem.name)
      .toLowerCase()
      .replace(/\.(docx?|doc|pdf|xlsx)$/i, '')
      .trim();

    if (seenNames.has(norm)) {
      continue; // Đã có bản sao, loại bỏ
    }
    seenNames.add(norm);
    cleanList.push(workingItem);
  }

  return cleanList;
}

export function getStoredPPCTList(grade: GradeLevel = 'Lớp 9'): StoredPPCT[] {
  if (typeof window === 'undefined') return [];
  const key = getGradeStorageKey(grade);
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = deduplicatePpctList(parsed, grade);
        // Lưu lại danh sách đã làm sạch để triệt tiêu vĩnh viễn file thừa trong localStorage
        if (cleaned.length !== parsed.length) {
          try {
            localStorage.setItem(key, JSON.stringify(cleaned));
          } catch (e) {}
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.warn(`Error reading PPCT list for ${grade}`, err);
  }
  return [];
}

export function saveStoredPPCTList(list: StoredPPCT[], grade: GradeLevel = 'Lớp 9') {
  if (typeof window !== 'undefined') {
    const key = getGradeStorageKey(grade);
    // Lọc sạch triệt để trước khi lưu
    const cleanList = deduplicatePpctList(list, grade);

    try {
      localStorage.setItem(key, JSON.stringify(cleanList));
      window.dispatchEvent(new CustomEvent('ppct-storage-updated', { detail: { grade, list: cleanList } }));
    } catch (err) {
      console.warn(`Error saving PPCT list for ${grade}`, err);
    }
  }
}

export function deleteStoredPPCT(id: string, grade: GradeLevel = 'Lớp 9'): StoredPPCT[] {
  const current = getStoredPPCTList(grade);
  const updated = current.filter(item => item.id !== id);
  saveStoredPPCTList(updated, grade);
  return updated;
}

export function clearAllStoredPPCT(grade: GradeLevel = 'Lớp 9'): StoredPPCT[] {
  saveStoredPPCTList([], grade);
  return [];
}

export function restoreDefaultPPCT(grade: GradeLevel = 'Lớp 9'): StoredPPCT[] {
  const def = getDefaultPPCTForGrade(grade);
  saveStoredPPCTList(def, grade);
  return def;
}

export function downloadPPCTDoc(ppctItem: StoredPPCT) {
  // If user uploaded a custom file and we have dataUrl
  if (ppctItem.dataUrl) {
    let downloadName = ppctItem.originalFileName || ppctItem.name;
    const isWord = 
      downloadName.toLowerCase().endsWith('.docx') || 
      downloadName.toLowerCase().endsWith('.doc') ||
      ppctItem.dataUrl.includes('wordprocessingml') || 
      ppctItem.dataUrl.includes('msword') || 
      ppctItem.type === 'docx';

    // Đảm bảo nếu nội dung là file Word (.docx / .doc) thì khi tải về phải là file Word (.docx), không bao giờ là .pdf làm lỗi font và hỏng file
    if (isWord) {
      if (!downloadName.toLowerCase().endsWith('.docx') && !downloadName.toLowerCase().endsWith('.doc')) {
        downloadName = downloadName.replace(/\.pdf$/i, '') + '.docx';
      }
    } else if (ppctItem.dataUrl.includes('application/pdf')) {
      if (!downloadName.toLowerCase().endsWith('.pdf')) {
        downloadName = downloadName.replace(/\.[^/.]+$/, '') + '.pdf';
      }
    }

    try {
      const parts = ppctItem.dataUrl.split(',');
      const mime = parts[0]?.match(/:(.*?);/)?.[1] || (isWord ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/octet-stream');
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
      link.href = ppctItem.dataUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
  }

  // Otherwise generate standard Word document for PPCT
  const isGrade8 = /to[aá]n\s*8|l[oớ]p\s*8|kh[oố]i\s*8/i.test(ppctItem.name);
  const curList = isGrade8 ? CURRICULUM_TOAN_8 : CURRICULUM_TOAN_9;
  const gradeTitle = isGrade8 ? 'PHÂN PHỐI CHƯƠNG TRÌNH MÔN TOÁN 8 (140 TIẾT) - NĂM HỌC 2026-2027' : 'PHÂN PHỐI CHƯƠNG TRÌNH MÔN TOÁN 9 (140 TIẾT) - NĂM HỌC 2026-2027';

  const rows = curList.map((entry, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="text-align: center; font-weight: bold;">Tuần ${entry.week}</td>
      <td style="text-align: center; font-weight: bold;">${entry.periodNumber}</td>
      <td><strong>${entry.lessonName}</strong><br><span style="color: #4b5563; font-size: 11pt;">${entry.chapter}</span></td>
      <td style="text-align: center;">${entry.periodsCount || 2}</td>
      <td style="text-align: center;">${entry.branch}</td>
      <td>${entry.equipment || 'MTCT, máy tính, bảng phụ'}</td>
      <td style="font-size: 10.5pt;">${entry.digitalCompetency || ''} ${entry.aiRoleCode ? `<br><em>AI: ${entry.aiRoleCode}</em>` : ''}</td>
    </tr>
  `).join('');

  const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${ppctItem.name}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.3; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 4px; }
    h2 { font-size: 13pt; text-align: center; font-weight: bold; margin-top: 0; margin-bottom: 12px; }
    p { margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #000; padding: 5px 6px; vertical-align: middle; }
    th { background-color: #e2e8f0; font-weight: bold; text-align: center; font-size: 11pt; }
    .header-tbl { border: none !important; margin-bottom: 15px; }
    .header-tbl td { border: none !important; }
  </style>
</head>
<body>
  <table class="header-tbl" style="width: 100%;">
    <tr>
      <td style="width: 50%; text-align: center;">
        <strong>TRƯỜNG THCS MỸ HÓA</strong><br>
        <strong>TỔ TOÁN - TIN HỌC</strong>
      </td>
      <td style="width: 50%; text-align: center;">
        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
        -----------------
      </td>
    </tr>
  </table>

  <h1>KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN</h1>
  <h2>${gradeTitle}</h2>
  <p style="text-align: center; font-style: italic;">
    (Áp dụng theo Chương trình GDPT 2018 - Tích hợp Khung Năng lực số & AI theo QĐ 2422/BGDĐT)
  </p>

  <table>
    <thead>
      <tr>
        <th style="width: 4%;">STT</th>
        <th style="width: 8%;">Tuần</th>
        <th style="width: 6%;">Tiết</th>
        <th style="width: 32%;">Bài dạy / Tên nội dung</th>
        <th style="width: 6%;">Số tiết</th>
        <th style="width: 10%;">Mạch</th>
        <th style="width: 16%;">Thiết bị dạy học</th>
        <th style="width: 18%;">Năng lực số & AI</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', wordContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = ppctItem.name.endsWith('.docx') || ppctItem.name.endsWith('.doc') 
    ? ppctItem.name 
    : `${ppctItem.name.replace(/\.[^/.]+$/, '')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
