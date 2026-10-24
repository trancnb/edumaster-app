import { GradeLevel } from '../types/edtech';
import { getSavedTeacherProfile } from './teacherStorage';

/**
 * Trích xuất danh sách các lớp dạy thuộc một khối lớp cụ thể từ chuỗi các lớp được phân công.
 * Hỗ trợ các định dạng giáo viên Việt Nam hay dùng:
 * - Dạng gạch chéo: 8/1, 8/2, 8/5, 9/1, 9/2...
 * - Dạng chữ cái: 8A1, 8A2, 8B, 9A1, 9A2...
 * - Dạng chấm: 8.1, 8.2, 9.1...
 * - Dạng có chữ Lớp: Lớp 8/5, Lớp 9/1...
 *
 * Yêu cầu sư phạm:
 * - Khi chọn KHBD Lớp 9: tự động lấy ra tất cả các lớp 9 (ví dụ: "9/1, 9/2")
 * - Khi chọn KHBD Lớp 8: tự động lấy ra tất cả các lớp 8 (ví dụ: "8/5" hoặc "8/1, 8/5")
 * - Trường hợp dạy nhiều lớp (vd: 9/1, 9/2, 9/3 hoặc 8/1, 8/5): ghi hết tất cả các lớp được phân công của khối đó
 * - Nếu chưa nhập lớp cho khối đang chọn: tự động lấy từ danh sách phân công lưu trong hồ sơ giáo viên, hoặc tạo lớp mặc định đúng khối (ví dụ 9/1 hoặc 9A1) thay vì để sai khối!
 */
export function extractClassesForGrade(
  assignedClassesInput: string | undefined | null,
  targetGrade: string | GradeLevel | undefined,
  fallbackInput?: string | null
): string {
  // Lấy chữ số của khối lớp mục tiêu (6, 7, 8, 9)
  const gradeDigitMatch = (targetGrade || 'Lớp 9').match(/\d+/);
  const targetDigit = gradeDigitMatch ? gradeDigitMatch[0] : '9';

  const filterTokensForDigit = (inputStr: string): string[] => {
    const tokens = inputStr
      .split(/[,;\n|]+/)
      .map(t => t.trim())
      .filter(Boolean);

    const matches: string[] = [];
    for (const token of tokens) {
      const cleanToken = token.replace(/^[Ll]ớp\s*/i, '').trim();
      const tokenDigitMatch = cleanToken.match(/^\d+/);
      if (tokenDigitMatch && tokenDigitMatch[0] === targetDigit) {
        matches.push(cleanToken);
      } else {
        const anyDigitMatch = cleanToken.match(/\b([6789])[\/A-Za-z0-9.]+/);
        if (anyDigitMatch && anyDigitMatch[1] === targetDigit) {
          matches.push(cleanToken);
        }
      }
    }
    return Array.from(new Set(matches));
  };

  // 1. Thử trích xuất từ chuỗi truyền vào
  if (assignedClassesInput && assignedClassesInput.trim()) {
    const directMatches = filterTokensForDigit(assignedClassesInput);
    if (directMatches.length > 0) {
      return directMatches.join(', ');
    }
  }

  // 2. Thử trích xuất từ fallback truyền vào
  if (fallbackInput && fallbackInput.trim()) {
    const fallbackMatches = filterTokensForDigit(fallbackInput);
    if (fallbackMatches.length > 0) {
      return fallbackMatches.join(', ');
    }
  }

  // 3. Thử trích xuất từ hồ sơ phân công giáo viên đã lưu
  try {
    const profile = getSavedTeacherProfile();
    const storedAssigned = profile.assignedClasses || profile.className;
    if (storedAssigned) {
      const storedMatches = filterTokensForDigit(storedAssigned);
      if (storedMatches.length > 0) {
        return storedMatches.join(', ');
      }
    }
  } catch (e) {
    // ignore
  }

  // 4. Nếu giáo viên chưa khai báo lớp nào thuộc khối này, sinh lớp mẫu đúng định dạng
  const allKnown = `${assignedClassesInput || ''} ${fallbackInput || ''}`;
  const prefersSlash = allKnown.includes('/') || true; // Mặc định giáo viên Việt Nam hay dùng định dạng / như 8/5, 9/1
  return prefersSlash ? `${targetDigit}/1` : `${targetDigit}A1`;
}

/**
 * Lấy danh sách tất cả các khối lớp có trong danh sách phân công
 */
export function getGradesInAssignedClasses(assignedClassesInput: string): GradeLevel[] {
  const gradesSet = new Set<GradeLevel>();
  const tokens = (assignedClassesInput || '')
    .split(/[,;\n|]+/)
    .map(t => t.trim())
    .filter(Boolean);

  tokens.forEach(t => {
    const m = t.match(/\b([6789])/);
    if (m) {
      gradesSet.add(`Lớp ${m[1]}` as GradeLevel);
    }
  });

  return Array.from(gradesSet).sort();
}
