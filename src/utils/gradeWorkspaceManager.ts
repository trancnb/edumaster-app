import { GradeLevel, KHBDData } from '../types/edtech';
import { StoredPPCT } from './ppctStorage';
import { OriginalFileItem } from '../components/OriginalFileViewerModal';
import { KHBDVersionRecord } from './khbdVersionManager';
import { getCurriculumForGrade } from '../data/multiGradeCurriculum';
import { buildStateFromCurriculumEntry } from '../data/curriculumToan9';
import { getAuthenticToan8Html } from './docxToPdfHelper';

export interface GradeWorkspaceData {
  grade: GradeLevel;
  assignedClasses: string[]; // ví dụ: ['8A1', '8A2', '8A4']
  activeClass: string; // ví dụ: '8A2'
  periodsPerWeek: number; // ví dụ: 4 hoặc 8 tiết
  ppctList: StoredPPCT[];
  uploadedFiles: OriginalFileItem[];
  versionHistory: KHBDVersionRecord[];
  currentVersion: string;
  khbdState: KHBDData | null;
  lastUpdated: string;
}

const STORAGE_KEY_MULTI_GRADE_WORKSPACES = 'edtech_multi_grade_workspaces_v2';
const STORAGE_KEY_ASSIGNED_GRADES = 'edtech_teacher_assigned_grades_v2';
const STORAGE_KEY_ACTIVE_GRADE = 'edtech_active_selected_grade_v2';

// 1. TỰ ĐỘNG NHẬN DIỆN KHỐI LỚP TỪ TÊN FILE VÀ NỘI DUNG (SMART GRADE AUTO-DETECTION)
export function detectGradeFromFileName(fileName: string, content?: string): GradeLevel | null {
  const text = `${fileName} ${content || ''}`.toLowerCase();

  // Khối 9
  if (
    text.includes('toán 9') || 
    text.includes('toan 9') || 
    text.includes('toan_9') || 
    text.includes('toan9') || 
    text.includes('lớp 9') || 
    text.includes('lop 9') || 
    text.includes('khối 9') || 
    text.includes('khoi 9') ||
    text.includes('khbd 9') ||
    text.includes('khdh 9') ||
    /\b9a\d?\b/i.test(text) ||
    /\b9b\d?\b/i.test(text)
  ) {
    return 'Lớp 9';
  }

  // Khối 8
  if (
    text.includes('toán 8') || 
    text.includes('toan 8') || 
    text.includes('toan_8') || 
    text.includes('toan8') || 
    text.includes('lớp 8') || 
    text.includes('lop 8') || 
    text.includes('khối 8') || 
    text.includes('khoi 8') ||
    text.includes('khbd 8') ||
    text.includes('khdh 8') ||
    /to[aá]n\s*8/i.test(text) ||
    /ph[uụ]\s*l[uụ]c\s*3.*8/i.test(text) ||
    /toan\s*8/i.test(text) ||
    /\b8\/[1-9]\b/.test(text) ||
    /\b8a\d?\b/i.test(text) ||
    /\b8b\d?\b/i.test(text)
  ) {
    return 'Lớp 8';
  }

  // Khối 7
  if (
    text.includes('toán 7') || 
    text.includes('toan 7') || 
    text.includes('toan_7') || 
    text.includes('toan7') || 
    text.includes('lớp 7') || 
    text.includes('lop 7') || 
    text.includes('khối 7') || 
    text.includes('khoi 7') ||
    text.includes('khbd 7') ||
    text.includes('khdh 7') ||
    /\b7a\d?\b/i.test(text)
  ) {
    return 'Lớp 7';
  }

  // Khối 6
  if (
    text.includes('toán 6') || 
    text.includes('toan 6') || 
    text.includes('toan_6') || 
    text.includes('toan6') || 
    text.includes('lớp 6') || 
    text.includes('lop 6') || 
    text.includes('khối 6') || 
    text.includes('khoi 6') ||
    text.includes('khbd 6') ||
    text.includes('khdh 6') ||
    /\b6a\d?\b/i.test(text)
  ) {
    return 'Lớp 6';
  }

  // Khối 10, 11, 12 (nếu cấp THPT)
  if (text.includes('lớp 10') || text.includes('khối 10') || text.includes('toán 10')) return 'Lớp 10';
  if (text.includes('lớp 11') || text.includes('khối 11') || text.includes('toán 11')) return 'Lớp 11';
  if (text.includes('lớp 12') || text.includes('khối 12') || text.includes('toán 12')) return 'Lớp 12';

  return null;
}

// 2. DANH SÁCH CÁC KHỐI LỚP PHÂN CÔNG GIẢNG DẠY CỦA GIÁO VIÊN TRONG NĂM HỌC
// Giáo viên dạy các lớp: 8/5; 9/3; 9/6 (Khối 8 và Khối 9 đã được nạp KHBD tương ứng)
export const DEFAULT_ASSIGNED_GRADES: GradeLevel[] = ['Lớp 9', 'Lớp 8'];

export function getTeacherAssignedGrades(): GradeLevel[] {
  if (typeof window === 'undefined') return DEFAULT_ASSIGNED_GRADES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ASSIGNED_GRADES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading assigned grades', e);
  }
  return DEFAULT_ASSIGNED_GRADES;
}

export function saveTeacherAssignedGrades(grades: GradeLevel[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ASSIGNED_GRADES, JSON.stringify(grades));
      window.dispatchEvent(new CustomEvent('assigned-grades-updated', { detail: grades }));
    } catch (e) {
      console.warn('Error saving assigned grades', e);
    }
  }
}

// Tự động thêm khối lớp khi có file KHBD hoặc PPCT của khối đó được nạp
export function autoAddGradeFromKHBD(grade: GradeLevel): GradeWorkspaceData {
  const assigned = getTeacherAssignedGrades();
  if (!assigned.includes(grade)) {
    const updated = [...assigned, grade].sort();
    saveTeacherAssignedGrades(updated);
  }
  const ws = getGradeWorkspace(grade);
  setActiveGrade(grade);
  return ws;
}

// Xóa hoàn toàn KHBD và khối lớp đó khỏi hệ thống (khi xóa KHBD thì xóa luôn cả khối)
export function deleteGradeWorkspaceAndRemove(grade: GradeLevel): GradeLevel | null {
  // 1. Loại bỏ khối khỏi danh sách phân công
  const assigned = getTeacherAssignedGrades();
  const remaining = assigned.filter(g => g !== grade);
  saveTeacherAssignedGrades(remaining);

  // 2. Xóa kho dữ liệu workspace của khối
  const all = getAllGradeWorkspaces();
  delete all[grade];
  saveAllGradeWorkspaces(all);

  // 3. Xóa cache PPCT lưu trữ của khối đó
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(`edtech_stored_ppct_list_${grade.replace(/\s+/g, '_')}`);
    } catch (e) {
      console.warn('Error removing PPCT key for grade', e);
    }
  }

  // 4. Chọn khối tiếp theo để chuyển sang
  const nextGrade = remaining.length > 0 ? remaining[0] : null;
  if (nextGrade) {
    setActiveGrade(nextGrade);
  } else if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_GRADE);
  }

  // 5. Phát sự kiện cập nhật đồng bộ cho toàn bộ giao diện
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('grade-deleted', { detail: { deletedGrade: grade, nextGrade } }));
    window.dispatchEvent(new CustomEvent('assigned-grades-updated', { detail: remaining }));
    if (nextGrade) {
      window.dispatchEvent(new CustomEvent('active-grade-changed', { detail: nextGrade }));
    }
  }

  return nextGrade;
}

// 3. KHỐI LỚP ĐANG HOẠT ĐỘNG (ACTIVE GRADE)
export function getActiveGrade(): GradeLevel {
  if (typeof window === 'undefined') return 'Lớp 9';
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_GRADE) as GradeLevel;
    if (saved) return saved;
  } catch (e) {
    // ignore
  }
  return 'Lớp 9';
}

export function setActiveGrade(grade: GradeLevel) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_GRADE, grade);
      window.dispatchEvent(new CustomEvent('active-grade-changed', { detail: grade }));
    } catch (e) {
      console.warn('Error setting active grade', e);
    }
  }
}

// Tên file KHBD chuẩn gốc của Lớp 8
export const AUTHENTIC_TOAN_8_FILE_NAME = 'THAO - PHU LUC 3 TOAN 8- NLS-AI.docx';

// 4. KHỞI TẠO DỮ LIỆU MẪU MẶC ĐỊNH CHO MỘT KHỐI NẾU CHƯA CÓ
export function createDefaultGradeWorkspace(grade: GradeLevel): GradeWorkspaceData {
  const shortNum = grade.replace('Lớp ', '');
  const curriculum = getCurriculumForGrade(grade);
  const firstEntry = curriculum[0];
  const defaultClass = grade === 'Lớp 8' ? '8/5' : grade === 'Lớp 9' ? '9/3' : `${shortNum}A1`;
  const assigned = grade === 'Lớp 8' ? ['8/5'] : grade === 'Lớp 9' ? ['9/3', '9/6'] : [`${shortNum}A1`, `${shortNum}A2`];

  const defaultState = buildStateFromCurriculumEntry(firstEntry, defaultClass);

  let defaultPpct: StoredPPCT[] = [];
  let defaultUploads: OriginalFileItem[] = [];

  if (grade === 'Lớp 8') {
    const authToan8Html = getAuthenticToan8Html();
    defaultUploads = [{
      name: AUTHENTIC_TOAN_8_FILE_NAME,
      size: '184.5 KB',
      type: 'DOCX',
      uploadedAt: 'Đã nạp vào hệ thống',
      note: 'Kế hoạch giáo dục & Kế hoạch bài dạy môn Toán 8 (THCS Mỹ Hóa) • Đã nạp vào hệ thống',
      isConvertedFromWord: true,
      htmlContent: authToan8Html,
      originalFileName: AUTHENTIC_TOAN_8_FILE_NAME
    }];
    defaultPpct = [{
      id: 'ppct-toan-8-thao-phuluc3',
      name: AUTHENTIC_TOAN_8_FILE_NAME,
      size: '184.5 KB',
      uploadedAt: 'Đã nạp vào hệ thống',
      type: 'docx',
      description: 'Kế hoạch giáo dục & Kế hoạch bài dạy môn Toán 8 (THCS Mỹ Hóa)',
      totalPeriods: 140,
      isConvertedFromWord: true,
      htmlContent: authToan8Html,
      originalFileName: AUTHENTIC_TOAN_8_FILE_NAME
    }];
  }

  return {
    grade,
    assignedClasses: assigned,
    activeClass: defaultClass,
    periodsPerWeek: 4,
    ppctList: defaultPpct,
    uploadedFiles: defaultUploads,
    versionHistory: [],
    currentVersion: 'v1.0',
    khbdState: defaultState.khbd,
    lastUpdated: new Date().toISOString()
  };
}

// Kiểm tra xem một file có phải là file mẫu dummy của hệ thống không
export function isMockDocument(name: string, id?: string, note?: string, uploadedAt?: string): boolean {
  const n = (name || '').toLowerCase();
  const i = (id || '').toLowerCase();
  const not = (note || '').toLowerCase();
  const up = (uploadedAt || '').toLowerCase();

  // BẢO VỆ TUYỆT ĐỐI: File thực tế của giáo viên, file Phụ lục 3, NLS-AI không bao giờ là mock!
  if (
    n.includes('thao') || 
    n.includes('phu luc 3') || 
    n.includes('nls-ai') || 
    n.includes('phu - phu luc 3') ||
    n.includes('toan 8-')
  ) {
    return false;
  }

  if (not.includes('mẫu chuẩn hệ thống') || up.includes('mẫu chuẩn hệ thống')) return true;
  if (up.includes('năm học 2026-2027') && !not.includes('giáo viên') && !not.includes('mỹ hóa')) return true;

  if (
    i.includes('ppct-toan-9-standard') ||
    i.includes('ppct-toan-9-tongthe') ||
    i.includes('ppct-toan-8-standard') ||
    i.includes('ppct-toan-8-pdf') ||
    i.includes('ppct-toan-7-standard') ||
    i.includes('ppct-toan-6-standard')
  ) {
    return true;
  }

  if (
    n.includes('ppct_toan_lop9_140tiet') ||
    n.includes('ppct_toan_thcs_lop9_tongthe') ||
    n.includes('ppct_toan_lop8_140tiet') ||
    n.includes('ppct_toan_8_kntt_chuan') ||
    n.includes('ppct_toan_lop7_140tiet') ||
    n.includes('ppct_toan_lop6_140tiet') ||
    n.includes('toan_9_pp_chuong_1_bai_1') ||
    n.includes('bai_tap_mau_he_phuong_trinh_2_an') ||
    n.includes('phieu_hoc_tap_kntt_toan9') ||
    n.includes('toan_8_khdh_chuong_1_da_thuc') ||
    n.includes('bai_tap_mau_hang_dang_thuc') ||
    n.includes('phieu_hoc_tap_kntt_toan8_tu_giac') ||
    n.includes('toan_7_bai_day_mau_so_huu_ti') ||
    n.includes('toan_6_bai_day_mau_tap_hop')
  ) {
    return true;
  }

  return false;
}

// LẤY TOÀN BỘ FILE HIỆN CÓ CỦA MỘT KHỐI (để kiểm tra quy định: Mỗi khối chỉ lưu 1 KHBD)
export function getExistingFilesForGrade(grade: GradeLevel): OriginalFileItem[] {
  const ws = getGradeWorkspace(grade);
  const result: OriginalFileItem[] = [];

  // 1. Kiểm tra danh sách file KHBD tham khảo đã nạp
  if (ws && Array.isArray(ws.uploadedFiles)) {
    for (const f of ws.uploadedFiles) {
      if (f && f.name && !isMockDocument(f.name, f.id, f.note, f.uploadedAt)) {
        result.push(f);
      }
    }
  }

  // 2. Kiểm tra danh sách file PPCT / Kế hoạch dạy học đã nạp
  if (ws && Array.isArray(ws.ppctList)) {
    for (const p of ws.ppctList) {
      if (p && p.name && !isMockDocument(p.name, p.id, p.description, p.uploadedAt)) {
        const alreadyIn = result.some(r => 
          (r.originalFileName || r.name).toLowerCase().replace(/\.(docx?|doc|pdf|xlsx)$/i, '').trim() ===
          (p.originalFileName || p.name).toLowerCase().replace(/\.(docx?|doc|pdf|xlsx)$/i, '').trim()
        );
        if (!alreadyIn) {
          result.push({
            name: p.originalFileName || p.name,
            size: p.size || '184.5 KB',
            type: (p.type || 'docx').toUpperCase(),
            note: p.description || `Tài liệu PPCT / Kế hoạch dạy học của ${grade}`,
            uploadedAt: p.uploadedAt || 'Đã nạp',
            dataUrl: p.dataUrl,
            htmlContent: p.htmlContent,
            rawText: p.rawText,
            isConvertedFromWord: p.isConvertedFromWord,
            originalFileName: p.originalFileName || p.name
          });
        }
      }
    }
  }

  // 3. Nếu khối là Lớp 8 mà danh sách đang rỗng thì nạp file gốc chuẩn THAO - PHU LUC 3
  if (result.length === 0 && grade === 'Lớp 8') {
    const authToan8Html = getAuthenticToan8Html();
    result.push({
      name: AUTHENTIC_TOAN_8_FILE_NAME,
      size: '184.5 KB',
      type: 'DOCX',
      uploadedAt: 'Đã nạp vào hệ thống',
      note: 'Kế hoạch giáo dục & Kế hoạch bài dạy môn Toán 8 (THCS Mỹ Hóa)',
      isConvertedFromWord: true,
      htmlContent: authToan8Html,
      originalFileName: AUTHENTIC_TOAN_8_FILE_NAME
    });
  }

  return result;
}

// XÓA SẠCH TOÀN BỘ FILE CŨ CỦA MỘT KHỐI KHI XÁC NHẬN GHI ĐÈ
export function clearGradeWorkspaceFiles(grade: GradeLevel): void {
  const all = getAllGradeWorkspaces();
  const ws = all[grade] || createDefaultGradeWorkspace(grade);
  ws.uploadedFiles = [];
  ws.ppctList = [];
  ws.lastUpdated = new Date().toISOString();
  all[grade] = ws;
  saveAllGradeWorkspaces(all);

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(`edtech_stored_ppct_list_${grade.replace(/\s+/g, '_')}`);
      window.dispatchEvent(new CustomEvent('ppct-storage-updated', { detail: { grade, list: [] } }));
    } catch (e) {}
  }
}

// Làm sạch triệt để một workspace: loại bỏ file mẫu dummy, chuyển Word sang PDF, cách ly khối và chống trùng lặp
export function sanitizeWorkspace(ws: GradeWorkspaceData, grade: GradeLevel): GradeWorkspaceData {
  // 1. Lọc bỏ toàn bộ file mẫu dummy hệ thống
  let ppctList = (ws.ppctList || []).filter(p => !isMockDocument(p.name, p.id, p.description, p.uploadedAt));
  let uploadedFiles = (ws.uploadedFiles || []).filter(f => !isMockDocument(f.name, f.id, f.note, f.uploadedAt));

  // 2. Bảo toàn 100% tệp gốc: Giữ nguyên tên file .docx và định dạng gốc khi tải lên / tải về
  // Khôi phục lại tên file .docx gốc nếu các bản trước từng đổi thành .pdf làm lỗi tải về
  ppctList = ppctList.map(p => {
    const isWord = 
      (p.originalFileName && (p.originalFileName.toLowerCase().endsWith('.docx') || p.originalFileName.toLowerCase().endsWith('.doc'))) ||
      (p.dataUrl && (p.dataUrl.includes('wordprocessingml') || p.dataUrl.includes('msword'))) ||
      p.name.toLowerCase().endsWith('.docx') || 
      p.name.toLowerCase().endsWith('.doc');

    if (isWord) {
      const origName = p.originalFileName || (p.name.toLowerCase().endsWith('.pdf') ? p.name.replace(/\.pdf$/i, '.docx') : p.name);
      return {
        ...p,
        name: origName,
        originalFileName: origName,
        type: 'docx' as const,
        isConvertedFromWord: true
      };
    }
    return p;
  });

  uploadedFiles = uploadedFiles.map(f => {
    const isWord = 
      (f.originalFileName && (f.originalFileName.toLowerCase().endsWith('.docx') || f.originalFileName.toLowerCase().endsWith('.doc'))) ||
      (f.dataUrl && (f.dataUrl.includes('wordprocessingml') || f.dataUrl.includes('msword'))) ||
      f.name.toLowerCase().endsWith('.docx') || 
      f.name.toLowerCase().endsWith('.doc');

    if (isWord) {
      const origName = f.originalFileName || (f.name.toLowerCase().endsWith('.pdf') ? f.name.replace(/\.pdf$/i, '.docx') : f.name);
      return {
        ...f,
        name: origName,
        originalFileName: origName,
        type: 'DOCX',
        isConvertedFromWord: true
      };
    }
    return f;
  });

  // 3. Cách ly triệt để giữa Khối 8 và Khối 9
  if (grade === 'Lớp 8') {
    ppctList = ppctList.filter(p => !/to[aá]n\s*9|l[oớ]p\s*9|kh[oố]i\s*9|9a\d?/i.test(p.name));
    uploadedFiles = uploadedFiles.filter(f => !/to[aá]n\s*9|l[oớ]p\s*9|kh[oố]i\s*9|9a\d?/i.test(f.name));
  } else if (grade === 'Lớp 9') {
    ppctList = ppctList.filter(p => !/to[aá]n\s*8|l[oớ]p\s*8|kh[oố]i\s*8|8a\d?/i.test(p.name));
    uploadedFiles = uploadedFiles.filter(f => !/to[aá]n\s*8|l[oớ]p\s*8|kh[oố]i\s*8|8a\d?/i.test(f.name));
  }

  // 4. Chống trùng lặp tuyệt đối theo cleanKey
  const seenPpct = new Set<string>();
  ppctList = ppctList.filter(p => {
    const k = (p.originalFileName || p.name).toLowerCase().replace(/\.(docx?|doc|pdf|xlsx)$/i, '').trim();
    if (seenPpct.has(k)) return false;
    seenPpct.add(k);
    return true;
  });

  const seenFiles = new Set<string>();
  uploadedFiles = uploadedFiles.filter(f => {
    const k = (f.originalFileName || f.name).toLowerCase().replace(/\.(docx?|doc|pdf|xlsx)$/i, '').trim();
    if (seenFiles.has(k)) return false;
    seenFiles.add(k);
    return true;
  });

  return {
    ...ws,
    ppctList,
    uploadedFiles
  };
}

let memoryWorkspacesCache: Record<string, GradeWorkspaceData> | null = null;

// 5. LẤY & LƯU TOÀN BỘ WORKSPACE CỦA CÁC KHỐI (CÓ BỘ ĐỆM BỘ NHỚ SIÊU TỐC)
export function getAllGradeWorkspaces(): Record<string, GradeWorkspaceData> {
  if (memoryWorkspacesCache) {
    return memoryWorkspacesCache;
  }
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MULTI_GRADE_WORKSPACES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        // Tự động làm sạch toàn bộ workspace trong storage
        const sanitized: Record<string, GradeWorkspaceData> = {};
        let modified = false;

        for (const [key, ws] of Object.entries(parsed)) {
          if (ws && typeof ws === 'object') {
            const cleanWs = sanitizeWorkspace(ws as GradeWorkspaceData, key as GradeLevel);
            sanitized[key] = cleanWs;
            if (
              cleanWs.ppctList.length !== (ws as GradeWorkspaceData).ppctList?.length ||
              cleanWs.uploadedFiles.length !== (ws as GradeWorkspaceData).uploadedFiles?.length
            ) {
              modified = true;
            }
          }
        }

        if (modified) {
          try {
            localStorage.setItem(STORAGE_KEY_MULTI_GRADE_WORKSPACES, JSON.stringify(sanitized));
          } catch (e) {
            console.warn('Quota exceeded or error saving sanitized workspaces', e);
          }
        }

        memoryWorkspacesCache = sanitized;
        return sanitized;
      }
    }
  } catch (e) {
    console.warn('Error loading multi-grade workspaces', e);
  }
  memoryWorkspacesCache = {};
  return memoryWorkspacesCache;
}

export function saveAllGradeWorkspaces(workspaces: Record<string, GradeWorkspaceData>) {
  memoryWorkspacesCache = workspaces;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_MULTI_GRADE_WORKSPACES, JSON.stringify(workspaces));
      window.dispatchEvent(new CustomEvent('grade-workspaces-saved', { detail: workspaces }));
    } catch (e) {
      console.warn('Error saving multi-grade workspaces to localStorage', e);
    }
  }
}

// Lấy workspace cho một khối cụ thể (đảm bảo cách ly 100% không để lẫn lộn giữa Khối 8 và Khối 9)
export function getGradeWorkspace(grade: GradeLevel): GradeWorkspaceData {
  const all = getAllGradeWorkspaces();
  let ws = all[grade];
  if (!ws) {
    ws = createDefaultGradeWorkspace(grade);
    all[grade] = ws;
    saveAllGradeWorkspaces(all);
    return ws;
  }

  // Luôn đảm bảo workspace được làm sạch triệt để
  return sanitizeWorkspace(ws, grade);
}

// Cập nhật workspace cho một khối cụ thể
export function updateGradeWorkspace(grade: GradeLevel, updates: Partial<GradeWorkspaceData>): GradeWorkspaceData {
  const all = getAllGradeWorkspaces();
  const current = all[grade] || createDefaultGradeWorkspace(grade);
  const updated: GradeWorkspaceData = sanitizeWorkspace({
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString()
  }, grade);
  all[grade] = updated;
  saveAllGradeWorkspaces(all);
  return updated;
}

export function saveGradeWorkspace(grade: GradeLevel, data: GradeWorkspaceData): GradeWorkspaceData {
  return updateGradeWorkspace(grade, data);
}

// Thêm file tài liệu mẫu vào một khối cụ thể (dành cho chế độ phân loại nền)
export function addFileToGradeWorkspace(grade: GradeLevel, file: OriginalFileItem) {
  const ws = getGradeWorkspace(grade);
  
  // Tự động chuyển đổi Word sang PDF nếu là file doc/docx
  let workingFile = { ...file };
  if (workingFile.name.toLowerCase().endsWith('.docx') || workingFile.name.toLowerCase().endsWith('.doc')) {
    workingFile.name = workingFile.name.replace(/\.(docx?|doc)$/i, '.pdf');
    workingFile.originalFileName = workingFile.originalFileName || file.name;
    workingFile.type = 'PDF';
    workingFile.isConvertedFromWord = true;
  }

  const fileKey = (workingFile.originalFileName || workingFile.name)
    .toLowerCase()
    .replace(/\.(docx?|doc|pdf|xlsx)$/i, '')
    .trim();

  // Quy định: Mỗi khối chỉ lưu trữ DUY NHẤT 1 KHBD
  const updatedFiles = [workingFile];
  updateGradeWorkspace(grade, { uploadedFiles: updatedFiles });
}

// Thêm file PPCT vào một khối cụ thể (dành cho chế độ phân loại nền)
export function addPpctToGradeWorkspace(grade: GradeLevel, ppct: StoredPPCT) {
  const ws = getGradeWorkspace(grade);

  // Tự động chuyển đổi Word sang PDF nếu là file doc/docx
  let workingPpct = { ...ppct };
  if (workingPpct.name.toLowerCase().endsWith('.docx') || workingPpct.name.toLowerCase().endsWith('.doc')) {
    workingPpct.name = workingPpct.name.replace(/\.(docx?|doc)$/i, '.pdf');
    workingPpct.originalFileName = workingPpct.originalFileName || ppct.name;
    workingPpct.type = 'pdf';
    workingPpct.isConvertedFromWord = true;
  }

  const ppctKey = (workingPpct.originalFileName || workingPpct.name)
    .toLowerCase()
    .replace(/\.(docx?|doc|pdf|xlsx)$/i, '')
    .trim();

  // Loại bỏ file dummy và file trùng tên
  const updatedPpct = [
    workingPpct, 
    ...ws.ppctList.filter(p => {
      if (isMockDocument(p.name, p.id, p.description, p.uploadedAt)) return false;
      const k = (p.originalFileName || p.name).toLowerCase().replace(/\.(docx?|doc|pdf|xlsx)$/i, '').trim();
      return k !== ppctKey && p.id !== ppct.id;
    })
  ];
  updateGradeWorkspace(grade, { ppctList: updatedPpct });
}

// Xóa sạch toàn bộ file đã load trong khối khi PPCT bị xóa (đảm bảo tính đồng bộ)
export function clearGradeWorkspaceOnPpctDelete(grade: GradeLevel) {
  updateGradeWorkspace(grade, {
    ppctList: [],
    uploadedFiles: [],
    versionHistory: [],
    currentVersion: 'v1.0',
    khbdState: null
  });
}
