import { CurriculumEntry, GradeLevel } from '../types/edtech';
import { applySeparateBranchPeriodNumbering } from './curriculumHelpers';

/**
 * Trình phân tích cú pháp (Parser) Phân phối chương trình (PPCT)
 * Hỗ trợ đọc tự động từ tệp DOCX (HTML table từ mammoth) hoặc tệp PDF / TXT (Text rows).
 * Tự động trích xuất:
 * - STT, Tuần, Tiết PPCT, Tên bài dạy / Bài học, Số tiết, Phân môn (Số / Hình / Thống kê), Thiết bị, NLS
 */

export interface ParsedPPCTResult {
  success: boolean;
  entries: CurriculumEntry[];
  totalPeriods: number;
  detectedGrade: GradeLevel;
  sourceType: 'table_html' | 'text_lines' | 'fallback';
  message: string;
}

/**
 * Phân tích bảng PPCT từ mã HTML (do mammoth trích xuất từ file DOCX)
 */
export function parsePPCTFromHtml(html: string, grade: GradeLevel = 'Lớp 9'): CurriculumEntry[] {
  if (!html || typeof window === 'undefined') return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = Array.from(doc.querySelectorAll('table'));
    if (tables.length === 0) return [];

    // Chọn bảng có nhiều dòng nhất (bảng PPCT chi tiết)
    let mainTable = tables[0];
    let maxRows = 0;
    for (const t of tables) {
      const rows = t.querySelectorAll('tr').length;
      if (rows > maxRows) {
        maxRows = rows;
        mainTable = t;
      }
    }

    if (maxRows < 3) return [];

    const rows = Array.from(mainTable.querySelectorAll('tr'));
    if (rows.length < 2) return [];

    // Xác định chỉ số các cột từ dòng tiêu đề (Header row)
    let headerRowIndex = -1;
    let colStt = -1;
    let colWeek = -1;
    let colPeriod = -1;
    let colLesson = -1;
    let colPeriodsCount = -1;
    let colBranch = -1;
    let colEquipment = -1;
    let colLocation = -1;
    let colCompetency = -1;

    for (let r = 0; r < Math.min(rows.length, 5); r++) {
      const thsOrTds = Array.from(rows[r].querySelectorAll('th, td')).map(c => (c.textContent || '').trim().toLowerCase());
      
      const hasLessonCol = thsOrTds.some(text => text.includes('bài') || text.includes('nội dung') || text.includes('tên bài') || text.includes('chủ đề'));
      const hasPeriodCol = thsOrTds.some(text => text.includes('tiết') || text.includes('thời lượng'));

      if (hasLessonCol || hasPeriodCol) {
        headerRowIndex = r;
        thsOrTds.forEach((text, idx) => {
          if (text.includes('stt') || text === 'tt' || text === 'số tt') colStt = idx;
          else if (text.includes('tuần')) colWeek = idx;
          else if (text.includes('tiết thứ') || text.includes('tiết ppct') || (text.includes('tiết') && !text.includes('số tiết'))) colPeriod = idx;
          else if (text.includes('bài học') || text.includes('tên bài') || text.includes('nội dung') || text.includes('chủ đề')) colLesson = idx;
          else if (text.includes('số tiết') || text.includes('thời lượng')) colPeriodsCount = idx;
          else if (text.includes('phân môn') || text.includes('mạch') || text.includes('lĩnh vực')) colBranch = idx;
          else if (text.includes('thiết bị') || text.includes('học liệu') || text.includes('đồ dùng')) colEquipment = idx;
          else if (text.includes('địa điểm')) colLocation = idx;
          else if (text.includes('năng lực') || text.includes('nls') || text.includes('ghi chú')) colCompetency = idx;
        });
        break;
      }
    }

    // Nếu không tìm thấy cột chính xác theo tên, dự đoán theo số cột phổ biến chuẩn BGDĐT (9 cột)
    if (colLesson === -1) {
      const sampleCells = Array.from(rows[headerRowIndex + 1]?.querySelectorAll('td') || []);
      if (sampleCells.length >= 5) {
        colStt = 0;
        colWeek = 1;
        colPeriod = 2;
        colLesson = 3;
        colPeriodsCount = 4;
        colBranch = 5;
        colEquipment = 6;
        colLocation = 7;
        colCompetency = 8;
      }
    }

    const entries: CurriculumEntry[] = [];
    let currentWeek = 1;
    let globalPeriodNumber = 1;
    let currentChapter = 'Chương I';

    for (let r = headerRowIndex + 1; r < rows.length; r++) {
      const cells = Array.from(rows[r].querySelectorAll('td, th')).map(c => (c.textContent || '').trim());
      if (cells.length < 3) continue;

      // Đọc tuần
      if (colWeek !== -1 && cells[colWeek]) {
        const weekMatch = cells[colWeek].match(/\d+/);
        if (weekMatch) {
          const w = parseInt(weekMatch[0], 10);
          if (w >= 1 && w <= 35) currentWeek = w;
        }
      }

      // Đọc tên bài học
      let rawLesson = colLesson !== -1 && cells[colLesson] ? cells[colLesson] : '';
      if (!rawLesson && cells[colPeriod] && cells[colPeriod].length > 10) {
        rawLesson = cells[colPeriod];
      }

      // Bỏ qua dòng tiêu đề phụ (ví dụ "HỌC KỲ I", "CHƯƠNG I")
      if (!rawLesson || rawLesson.length < 3) continue;
      if (rawLesson.toUpperCase().startsWith('CHƯƠNG') || rawLesson.toUpperCase().startsWith('PHẦN')) {
        currentChapter = rawLesson;
        continue;
      }

      // Xác định số tiết bài học
      let periodsCount = 1;
      if (colPeriodsCount !== -1 && cells[colPeriodsCount]) {
        const countMatch = cells[colPeriodsCount].match(/\d+/);
        if (countMatch) periodsCount = parseInt(countMatch[0], 10);
      }

      // Xác định phân môn
      let branch: 'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Kiểm tra' | 'Thực hành trải nghiệm' = 'Đại số';
      const branchText = (colBranch !== -1 && cells[colBranch] ? cells[colBranch] : '').toLowerCase();
      const combinedText = `${rawLesson} ${branchText}`.toLowerCase();

      if (combinedText.includes('hình') || combinedText.includes('tam giác') || combinedText.includes('đường tròn') || combinedText.includes('tứ giác') || combinedText.includes('góc')) {
        branch = 'Hình học';
      } else if (combinedText.includes('thống kê') || combinedText.includes('xác suất') || combinedText.includes('tần số') || combinedText.includes('biểu đồ')) {
        branch = 'Thống kê & Xác suất';
      } else if (combinedText.includes('kiểm tra') || combinedText.includes('đánh giá') || combinedText.includes('giữa kì') || combinedText.includes('cuối kì')) {
        branch = 'Kiểm tra';
      } else if (combinedText.includes('trải nghiệm') || combinedText.includes('hoạt động thực hành')) {
        branch = 'Thực hành trải nghiệm';
      } else {
        branch = 'Đại số';
      }

      // Đọc thiết bị & NLS
      const equipment = (colEquipment !== -1 && cells[colEquipment]) ? cells[colEquipment] : 'Máy tính, máy chiếu, SGK, MTCT';
      const location = (colLocation !== -1 && cells[colLocation]) ? cells[colLocation] : 'Lớp học';
      const digitalCompetency = (colCompetency !== -1 && cells[colCompetency]) ? cells[colCompetency] : '1.1.NC1b: Tìm kiếm và xử lý dữ liệu học tập';

      const entry: CurriculumEntry = {
        id: `ppct-${grade.replace(/\s+/g, '')}-w${currentWeek}-p${globalPeriodNumber}`,
        grade,
        subject: 'Toán học',
        semester: currentWeek <= 18 ? 1 : 2,
        week: currentWeek,
        periodNumber: globalPeriodNumber,
        branch,
        chapter: currentChapter,
        lessonName: rawLesson,
        equipment,
        location,
        digitalCompetency,
        aiRoleCode: `${grade.replace(/[^0-9]/g, '') || '9'}.A${(globalPeriodNumber % 4) + 1}.1`,
        periodsCount
      };

      entries.push(entry);
      globalPeriodNumber++;
    }

    if (entries.length >= 10) {
      return applySeparateBranchPeriodNumbering(entries);
    }
  } catch (err) {
    console.warn('Lỗi phân tích bảng PPCT từ HTML:', err);
  }

  return [];
}

/**
 * Phân tích PPCT từ văn bản thô (Text) trích xuất từ PDF hoặc tệp Text
 */
export function parsePPCTFromText(rawText: string, grade: GradeLevel = 'Lớp 9'): CurriculumEntry[] {
  if (!rawText || rawText.length < 50) return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const entries: CurriculumEntry[] = [];
  let currentWeek = 1;
  let periodCount = 1;
  let currentChapter = 'Chương I';

  for (const line of lines) {
    // Nhận diện dòng Tuần: "Tuần 1", "TUẦN 2:"
    const weekMatch = line.match(/^tuần\s*(\d+)/i);
    if (weekMatch) {
      const w = parseInt(weekMatch[1], 10);
      if (w >= 1 && w <= 35) {
        currentWeek = w;
        continue;
      }
    }

    // Nhận diện Chương
    if (line.toLowerCase().startsWith('chương')) {
      currentChapter = line;
      continue;
    }

    // Nhận diện dòng tiết học: "Tiết 1: ...", "- Tiết 2: ...", "1. Bài 1: ..."
    const periodLineMatch = line.match(/^(?:[-*•]|\d+[.)])?\s*(?:tiết|Tiết)\s*(\d+)[:.-]?\s*(.+)$/i);
    if (periodLineMatch) {
      const pNum = parseInt(periodLineMatch[1], 10);
      const lesson = periodLineMatch[2].trim();
      if (lesson.length > 3) {
        const combined = lesson.toLowerCase();
        let branch: 'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Kiểm tra' | 'Thực hành trải nghiệm' = 'Đại số';

        if (combined.includes('hình') || combined.includes('tam giác') || combined.includes('đường tròn') || combined.includes('tứ giác')) {
          branch = 'Hình học';
        } else if (combined.includes('thống kê') || combined.includes('xác suất') || combined.includes('tần số')) {
          branch = 'Thống kê & Xác suất';
        } else if (combined.includes('kiểm tra')) {
          branch = 'Kiểm tra';
        }

        entries.push({
          id: `ppct-${grade.replace(/\s+/g, '')}-w${currentWeek}-p${periodCount}`,
          grade,
          subject: 'Toán học',
          semester: currentWeek <= 18 ? 1 : 2,
          week: currentWeek,
          periodNumber: pNum || periodCount,
          branch,
          chapter: currentChapter,
          lessonName: lesson,
          equipment: 'Máy tính, máy chiếu, SGK, MTCT',
          location: 'Lớp học',
          digitalCompetency: '1.1.NC1b: Tìm kiếm và xử lý dữ liệu học tập',
          aiRoleCode: `${grade.replace(/[^0-9]/g, '') || '9'}.A${(periodCount % 4) + 1}.1`,
          periodsCount: 2
        });
        periodCount++;
      }
    }
  }

  if (entries.length >= 10) {
    return applySeparateBranchPeriodNumbering(entries);
  }

  return [];
}

/**
 * Trình phân tích tích hợp: Thử parse HTML trước (từ DOCX), sau đó thử Text (từ PDF/TXT)
 */
export function parseUploadedPPCT(
  file: { name: string; htmlContent?: string; rawText?: string },
  grade: GradeLevel = 'Lớp 9'
): ParsedPPCTResult {
  // 1. Thử phân tích HTML table nếu có
  if (file.htmlContent) {
    const htmlEntries = parsePPCTFromHtml(file.htmlContent, grade);
    if (htmlEntries.length >= 10) {
      return {
        success: true,
        entries: htmlEntries,
        totalPeriods: htmlEntries.length,
        detectedGrade: grade,
        sourceType: 'table_html',
        message: `Đã đọc thành công bảng PPCT từ file Word với ${htmlEntries.length} tiết chuẩn xác!`
      };
    }
  }

  // 2. Thử phân tích văn bản thô
  if (file.rawText) {
    const textEntries = parsePPCTFromText(file.rawText, grade);
    if (textEntries.length >= 10) {
      return {
        success: true,
        entries: textEntries,
        totalPeriods: textEntries.length,
        detectedGrade: grade,
        sourceType: 'text_lines',
        message: `Đã nhận diện thành công PPCT từ tệp với ${textEntries.length} tiết!`
      };
    }
  }

  return {
    success: false,
    entries: [],
    totalPeriods: 0,
    detectedGrade: grade,
    sourceType: 'fallback',
    message: 'Không tìm thấy cấu trúc bảng hoặc danh sách tiết tương thích. Giữ nguyên PPCT mẫu chuẩn của hệ thống.'
  };
}
