import { CurriculumEntry } from '../types/edtech';

/**
 * Phân loại tiết học thuộc phân môn Hình học hay Số & Đại số
 */
export function isHinhEntry(entry: { branch?: string; chapter?: string; lessonName?: string }): boolean {
  const name = (entry.lessonName || '').toLowerCase();
  // Nếu là tiết 2/2 của bài kiểm tra định kì -> Thuộc phân môn Hình học
  if (name.includes('tiết 2/2') || name.includes('tiết 2 / 2') || name.includes('phần hình')) {
    return true;
  }
  // Nếu là tiết 1/2 của bài kiểm tra định kì -> Thuộc phân môn Số & Đại số
  if (name.includes('tiết 1/2') || name.includes('tiết 1 / 2') || name.includes('phần đại số') || name.includes('phần số')) {
    return false;
  }

  if (entry.branch === 'Hình học') return true;
  if (entry.branch === 'Đại số' || entry.branch === 'Thống kê & Xác suất') return false;

  const combined = ((entry.branch || '') + ' ' + (entry.chapter || '') + ' ' + (entry.lessonName || '')).toLowerCase();
  return combined.includes('hình học') || combined.includes('tam giác') || combined.includes('lượng giác') || combined.includes('đường tròn') || combined.includes('đo lường') || combined.includes('góc nhọn') || combined.includes('tỉ số lượng giác');
}

export interface PeriodicExamInfo {
  isExam: boolean;
  type?: 'gk1' | 'ck1' | 'gk2' | 'ck2';
  title?: string;
  name?: string;
  half?: '1/2' | '2/2';
  standardWeek?: number;
}

/**
 * Kiểm tra xem một tiết có thuộc 4 đợt kiểm tra định kì trong năm học không:
 * 1. Giữa học kì 1 (Thường ở Tuần 9)
 * 2. Cuối học kì 1 (Thường ở Tuần 17-18)
 * 3. Giữa học kì 2 (Thường ở Tuần 26-27)
 * 4. Cuối học kì 2 / Cuối năm (Thường ở Tuần 35)
 */
export function isPeriodicExamEntry(entry: { branch?: string; chapter?: string; lessonName?: string }): PeriodicExamInfo {
  const combined = `${entry.branch || ''} ${entry.chapter || ''} ${entry.lessonName || ''}`.toLowerCase();
  
  // Không bao gồm các bài ôn tập hoặc trả bài hoặc bài hướng dẫn/đề cương
  const isReviewOrReturn = combined.includes('ôn tập') || combined.includes('trả bài') || combined.includes('hướng dẫn') || combined.includes('rèn kỹ năng') || combined.includes('đề cương') || combined.includes('ôn thi');
  if (isReviewOrReturn) return { isExam: false };

  const isGK1 = combined.includes('giữa học kì 1') || combined.includes('giữa kì 1') || combined.includes('giữa hk1') || combined.includes('giữa học kỳ 1') || combined.includes('giữa kỳ 1');
  const isCK1 = combined.includes('cuối học kì 1') || combined.includes('cuối kì 1') || combined.includes('cuối hk1') || combined.includes('cuối học kỳ 1') || combined.includes('cuối kỳ 1');
  const isGK2 = combined.includes('giữa học kì 2') || combined.includes('giữa kì 2') || combined.includes('giữa hk2') || combined.includes('giữa học kỳ 2') || combined.includes('giữa kỳ 2');
  const isCK2 = combined.includes('cuối học kì 2') || combined.includes('cuối kì 2') || combined.includes('cuối hk2') || combined.includes('cuối năm') || combined.includes('cuối học kỳ 2') || combined.includes('cuối kỳ 2');

  const hasExamKeyword = combined.includes('kiểm tra') || combined.includes('đánh giá định kỳ') || combined.includes('đánh giá định kì') || combined.includes('khảo sát');

  if (hasExamKeyword && (isGK1 || isCK1 || isGK2 || isCK2)) {
    const isHinh = isHinhEntry(entry);
    const half: '1/2' | '2/2' = (combined.includes('2/2') || isHinh) ? '2/2' : '1/2';
    if (isGK1) return { isExam: true, type: 'gk1', title: 'Kiểm tra đánh giá giữa Học kì 1', name: 'Giữa học kì 1', half, standardWeek: 9 };
    if (isCK1) return { isExam: true, type: 'ck1', title: 'Kiểm tra đánh giá cuối Học kì 1', name: 'Cuối học kì 1', half, standardWeek: 17 };
    if (isGK2) return { isExam: true, type: 'gk2', title: 'Kiểm tra đánh giá giữa Học kì 2', name: 'Giữa học kì 2', half, standardWeek: 27 };
    if (isCK2) return { isExam: true, type: 'ck2', title: 'Kiểm tra đánh giá cuối năm (Học kì 2)', name: 'Cuối năm (HK2)', half, standardWeek: 35 };
  }

  return { isExam: false };
}

/**
 * Phân tách tên bài học thành:
 * - mainTitle: Tiêu đề bài học tổng thể (Dòng 1)
 * - periodSubtitle: Tiêu đề cụ thể của từng tiết (Dòng 2), ví dụ "(Tiết 1: Phương trình bậc nhất 2 ẩn)"
 */
export function splitLessonTitle(lessonName: string): { mainTitle: string; periodSubtitle: string | null } {
  if (!lessonName) return { mainTitle: '', periodSubtitle: null };

  // 1. Phân tách theo ký tự xuống dòng (\n)
  if (lessonName.includes('\n')) {
    const lines = lessonName.split('\n').map(l => l.trim()).filter(Boolean);
    const mainTitle = lines[0] || '';
    const subtitle = lines.slice(1).join(' ').trim();
    return { 
      mainTitle, 
      periodSubtitle: subtitle ? (subtitle.startsWith('(') && subtitle.endsWith(')') ? subtitle : `(${subtitle})`) : null 
    };
  }

  // 2. Phân tách theo ngoặc đơn ở cuối hoặc gần cuối: "(Tiết 1: ...)" hoặc "(Tiết 1)"
  const matchParen = lessonName.match(/^(.*?)\s*(\((?:tiết|Tiết)\s*\d+[^)]*\))\s*\.?$/i);
  if (matchParen) {
    return {
      mainTitle: matchParen[1].trim(),
      periodSubtitle: matchParen[2].trim()
    };
  }

  // 3. Phân tách theo dấu gạch ngang: "Tên bài - Tiết 1: ..." hoặc "Tên bài - (Tiết 1: ...)"
  const matchDash = lessonName.match(/^(.*?)\s*[-–]\s*((?:tiết|Tiết)\s*\d+.*)$/i);
  if (matchDash && matchDash[1].length > 4) {
    const sub = matchDash[2].trim();
    return {
      mainTitle: matchDash[1].trim(),
      periodSubtitle: sub.startsWith('(') && sub.endsWith(')') ? sub : `(${sub})`
    };
  }

  // 4. Phân tách dạng dấu chấm: "Tên bài. Tiết 1: ..."
  const matchDot = lessonName.match(/^(.*?)\s*\.\s*((?:tiết|Tiết)\s*\d+\s*:.*)$/i);
  if (matchDot && matchDot[1].length > 4) {
    const sub = matchDot[2].trim();
    return {
      mainTitle: matchDot[1].trim(),
      periodSubtitle: sub.startsWith('(') && sub.endsWith(')') ? sub : `(${sub})`
    };
  }

  return { mainTitle: lessonName.trim(), periodSubtitle: null };
}

/**
 * Định dạng lại tên bài học có hỗ trợ xuống dòng:
 * Dòng 1: Tiêu đề bài học
 * Dòng 2: Nội dung tiết cụ thể
 */
export function formatLessonTitle(mainTitle: string, periodSubtitle?: string | null): string {
  const cleanMain = mainTitle.trim();
  if (!periodSubtitle || !periodSubtitle.trim()) return cleanMain;

  let cleanSub = periodSubtitle.trim();
  if (!cleanSub.startsWith('(') && !cleanSub.endsWith(')')) {
    cleanSub = `(${cleanSub})`;
  }
  return `${cleanMain}\n${cleanSub}`;
}

/**
 * Chuẩn hóa tiêu đề bài dạy: tự động thêm vào sau tên mỗi bài dạy (khác với tiết) số tiết của bài đó.
 * Ví dụ: 
 * - "Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn (2 Tiết)"
 * - "Luyện tập: Giải hệ hai phương trình bậc nhất hai ẩn" -> "Luyện tập: Giải hệ hai phương trình bậc nhất hai ẩn (1 Tiết)"
 * - "Bài 3. Giải bài toán bằng cách lập hệ phương trình" (3 tiết) -> "Bài 3. Giải bài toán bằng cách lập hệ phương trình (3 Tiết)"
 */
export function ensureLessonTitleHasPeriodCount(title: string, periodsCount: number = 1): string {
  if (!title) return '';
  let trimmed = title.trim();
  // Loại bỏ hậu tố số tiết cũ nếu có (ví dụ: (2 tiết), (2 Tiết), ( 3 tiết ))
  trimmed = trimmed.replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '').trim();
  // Loại bỏ nếu có dạng (Tiết \d+...) ở cuối
  trimmed = trimmed.replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '').trim();
  const count = periodsCount && periodsCount > 0 ? periodsCount : 1;
  return `${trimmed} (${count} Tiết)`;
}

/**
 * Tự động cân bằng phân phối chương trình:
 * Mỗi tuần đảm bảo đúng chuẩn 4 tiết (Tuần 1: tiết 1-4, Tuần 2: tiết 5-8, ...)
 * Tuần 1-18 thuộc Học kì 1, Tuần 19-35+ thuộc Học kì 2.
 */
export function rebalanceCurriculumWeeks(entries: CurriculumEntry[]): CurriculumEntry[] {
  return entries.map((entry, index) => {
    const week = Math.floor(index / 4) + 1;
    const semester = (week <= 18 ? 1 : 2) as (1 | 2);
    return {
      ...entry,
      week,
      semester
    };
  });
}

/**
 * Đếm thứ tự tiết theo đúng chuẩn quy định môn Toán THCS:
 * 1. Đếm riêng thứ tự tiết cho từng phân môn:
 *    - Phân môn Số & Đại số ('Đại số' / 'Số học'): 1, 2, 3...
 *    - Phân môn Hình học ('Hình học'): 1, 2, 3...
 *    - Phân môn Thống kê & Xác suất: 1, 2, 3...
 *    - Phân môn Kiểm tra: 1, 2, 3...
 *    - Thực hành trải nghiệm: 1, 2, 3...
 * 
 * 2. Đánh số và bảo toàn 100% nội dung tên bài dạy, tự động thêm số tiết vào sau tên bài:
 *    - Tự động thêm (X Tiết) vào sau tên bài dạy (Ví dụ: "Bài 1. Khái niệm phương trình... (2 Tiết)")
 *    - BẢO TOÀN tên gọi chi tiết do giáo viên đặt cho từng tiết (ví dụ: "Tiết 1: Phương trình bậc nhất 2 ẩn").
 *    - Hỗ trợ xuống dòng (\n) để tách biệt tiêu đề bài và tiêu đề tiết học.
 */
export function applySeparateBranchPeriodNumbering(entries: CurriculumEntry[]): CurriculumEntry[] {
  if (!entries || entries.length === 0) return [];
  const synchronizedEntries = ensurePeriodicExamsAreSynchronized(entries);
  const branchCounters: Record<string, number> = {};

  // 1. Tính toán tổng số tiết thực tế của từng bài học dựa trên toàn bộ phân phối chương trình
  const lessonTotalPeriods: Record<string, number> = {};
  const lessonEntriesMap: Record<string, number[]> = {};

  synchronizedEntries.forEach((entry, idx) => {
    const { mainTitle } = splitLessonTitle(entry.lessonName);
    const cleanBase = mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim().toLowerCase();
    const match = entry.lessonName.match(/\((?:tiết|Tiết)\s*(\d+)/i);
    const pNum = match ? parseInt(match[1], 10) : 1;

    lessonTotalPeriods[cleanBase] = Math.max(
      lessonTotalPeriods[cleanBase] || 0,
      pNum,
      entry.periodsCount || 1
    );

    if (!lessonEntriesMap[cleanBase]) {
      lessonEntriesMap[cleanBase] = [];
    }
    lessonEntriesMap[cleanBase].push(idx);
  });

  // Nếu bài học xuất hiện nhiều lần (nhiều tiết) trong phân phối, cập nhật tổng số tiết bằng số lần xuất hiện nếu lớn hơn
  Object.keys(lessonEntriesMap).forEach(cleanBase => {
    const appearanceCount = lessonEntriesMap[cleanBase].length;
    if (appearanceCount > lessonTotalPeriods[cleanBase]) {
      lessonTotalPeriods[cleanBase] = appearanceCount;
    }
  });

  // 2. Chuẩn hóa lại từng entry: đếm riêng tiết phân môn (Số, Hình, Thống kê) và bảo toàn tên tiết chi tiết
  // Sắp xếp các tiết:
  // - Theo tuần (1 -> 35)
  // - Trong cùng 1 tuần: Các bài dạy thông thường (regular) luôn đứng TRƯỚC, bài kiểm tra định kỳ luôn đứng CUỐI CÙNG của tuần đó
  const sortedEntries = [...synchronizedEntries].sort((a, b) => {
    if (a.week !== b.week) return a.week - b.week;
    const aIsHinh = isHinhEntry(a);
    const bIsHinh = isHinhEntry(b);
    if (aIsHinh !== bIsHinh) return aIsHinh ? 1 : -1;
    const aExam = isPeriodicExamEntry(a).isExam ? 1 : 0;
    const bExam = isPeriodicExamEntry(b).isExam ? 1 : 0;
    return aExam - bExam;
  });

  const lessonCurrentIndex: Record<string, number> = {};

  return sortedEntries.map(entry => {
    // Đếm riêng tiết phân môn
    const isHinh = isHinhEntry(entry);
    const branchKey = isHinh ? 'Hình học' : (entry.branch === 'Thống kê & Xác suất' ? 'Thống kê & Xác suất' : 'Đại số');
    branchCounters[branchKey] = (branchCounters[branchKey] || 0) + 1;
    const branchPeriod = branchCounters[branchKey];

    const { mainTitle, periodSubtitle } = splitLessonTitle(entry.lessonName);
    const cleanBase = mainTitle
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .replace(/\s*\(\s*(?:tiết|Tiết)\s*\d+[^)]*\)$/i, '')
      .trim();
    const cleanKey = cleanBase.toLowerCase();
    const totalPeriods = lessonTotalPeriods[cleanKey] || entry.periodsCount || 1;

    lessonCurrentIndex[cleanKey] = (lessonCurrentIndex[cleanKey] || 0) + 1;
    const inLessonPeriod = lessonCurrentIndex[cleanKey];

    // Tự động thêm vào sau tên mỗi bài dạy số tiết: "Tên bài dạy (X Tiết)"
    const finalMainTitle = ensureLessonTitleHasPeriodCount(cleanBase, totalPeriods);
    let finalLessonName = finalMainTitle;

    // 3. Xử lý đặc biệt cho 4 bài kiểm tra định kỳ toàn diện (90 phút = 2 tiết song song)
    const examInfo = isPeriodicExamEntry(entry);
    if (examInfo.isExam) {
      const halfText = isHinh ? '(tiết 2/2 kiểm tra)' : '(tiết 1/2 kiểm tra)';
      const examTitle = examInfo.title || cleanBase;
      const cleanExamTitle = examTitle
        .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
        .trim();
      finalLessonName = `${cleanExamTitle} (2 tiết)\n${halfText}`;
      return {
        ...entry,
        branch: (isHinh ? 'Hình học' : 'Đại số') as any,
        overallPeriodNumber: entry.periodNumber,
        periodNumber: branchPeriod,
        periodsCount: 2,
        lessonName: finalLessonName
      };
    }

    if (periodSubtitle) {
      const cleanSub = periodSubtitle.startsWith('(') && periodSubtitle.endsWith(')') 
        ? periodSubtitle 
        : `(${periodSubtitle})`;

      // Nếu có tên chi tiết của tiết (chứa dấu hai chấm : hoặc chữ mở rộng) hoặc có dấu xuống dòng: BẢO TOÀN 100%
      finalLessonName = `${finalMainTitle}\n${cleanSub}`;
    } else {
      finalLessonName = totalPeriods > 1 ? `${finalMainTitle}\n(Tiết ${inLessonPeriod})` : finalMainTitle;
    }

    return {
      ...entry,
      branch: (isHinh ? 'Hình học' : (entry.branch || 'Đại số')) as any,
      overallPeriodNumber: entry.periodNumber,
      periodNumber: branchPeriod,
      periodsCount: totalPeriods,
      lessonName: finalLessonName
    };
  });
}

/**
 * Đảm bảo phân phối chương trình luôn đủ chuẩn chính xác 140 tiết:
 * - Khử trùng lặp ID
 * - Giới hạn tối đa 2 tiết cho mỗi bài kiểm tra định kỳ (1 tiết Số, 1 tiết Hình)
 * - Nếu thiếu tiết (< 140), tự động bù đắp các bài còn thiếu từ phân phối chuẩn
 * - Nếu thừa tiết (> 140), tự động lược bớt các bài dạy thông thường ở cuối để đúng 140 tiết
 */
export function fillOrTrimTo140Periods(entries: CurriculumEntry[], standardEntries?: CurriculumEntry[]): CurriculumEntry[] {
  if (!entries || entries.length === 0) return standardEntries && standardEntries.length > 0 ? [...standardEntries] : [];

  // 1. Khử trùng lặp ID nếu có
  const seenIds = new Set<string>();
  let list: CurriculumEntry[] = [];
  for (const entry of entries) {
    if (!entry || !entry.id) continue;
    if (seenIds.has(entry.id)) continue;
    seenIds.add(entry.id);
    list.push({ ...entry });
  }

  // 2. Giới hạn tối đa 2 tiết cho mỗi bài kiểm tra định kỳ (1 tiết Số, 1 tiết Hình)
  const examCounts: Record<string, number> = { gk1: 0, ck1: 0, gk2: 0, ck2: 0 };
  list = list.filter(entry => {
    const examInfo = isPeriodicExamEntry(entry);
    if (!examInfo.isExam || !examInfo.type) return true;
    examCounts[examInfo.type] = (examCounts[examInfo.type] || 0) + 1;
    return examCounts[examInfo.type] <= 2;
  });

  // 3. Nếu thiếu tiết (< 140), bù đắp từ standardEntries
  if (standardEntries && standardEntries.length > 0) {
    if (list.length < 140) {
      for (const stdEntry of standardEntries) {
        if (list.length >= 140) break;
        if (!list.some(e => e.id === stdEntry.id)) {
          list.push({ ...stdEntry });
        }
      }
    }

    // Nếu vẫn chưa đủ 140, bổ sung bài mẫu với ID duy nhất
    let fallbackIdx = 0;
    while (list.length < 140 && standardEntries.length > 0) {
      const fallback = standardEntries[fallbackIdx % standardEntries.length];
      fallbackIdx++;
      list.push({
        ...fallback,
        id: `${fallback.id}-replenished-${list.length + 1}`
      });
    }

    // 4. Nếu thừa tiết (> 140), lược bớt các bài dạy thông thường ở cuối
    while (list.length > 140) {
      let lastRegularIdx = -1;
      for (let i = list.length - 1; i >= 0; i--) {
        if (!isPeriodicExamEntry(list[i]).isExam) {
          lastRegularIdx = i;
          break;
        }
      }
      if (lastRegularIdx !== -1) {
        list.splice(lastRegularIdx, 1);
      } else {
        list.pop();
      }
    }
  }

  return list;
}

/**
 * Tự động định vị ngang hàng 2 tiết cho 4 đợt kiểm tra định kì trong năm học:
 * - Giữa học kì 1: Tuần 9 (Tiết 18 Số & Tiết 18 Hình nằm song song ngang hàng)
 * - Cuối học kì 1: Tuần 17-18 (Tiết 34 Số & Tiết 34 Hình nằm song song ngang hàng)
 * - Giữa học kì 2: Tuần 27 (Tiết 54 Số & Tiết 54 Hình nằm song song ngang hàng)
 * - Cuối học kì 2 / Cuối năm: Tuần 35 (Tiết 69 Số & Tiết 69 Hình nằm song song ngang hàng)
 */
export function ensurePeriodicExamsAreSynchronized(entries: CurriculumEntry[], _grade: string = 'Lớp 9', standardFallback?: CurriculumEntry[]): CurriculumEntry[] {
  if (!entries || entries.length === 0) return entries;

  // Đảm bảo đủ 140 tiết nếu có standardFallback
  const preProcessed = standardFallback && standardFallback.length > 0
    ? fillOrTrimTo140Periods(entries, standardFallback)
    : entries;

  // 1. Khử trùng lặp ID nếu có
  const seenIds = new Set<string>();
  const uniqueList: CurriculumEntry[] = [];
  for (const entry of preProcessed) {
    if (!entry || !entry.id) continue;
    if (seenIds.has(entry.id)) continue;
    seenIds.add(entry.id);
    uniqueList.push({ ...entry });
  }

  // 2. Giới hạn tối đa 2 tiết cho mỗi bài kiểm tra định kỳ (1 tiết Số, 1 tiết Hình)
  const examTypeCounts: Record<string, number> = { gk1: 0, ck1: 0, gk2: 0, ck2: 0 };
  const filteredList = uniqueList.filter(entry => {
    const examInfo = isPeriodicExamEntry(entry);
    if (!examInfo.isExam || !examInfo.type) return true;
    examTypeCounts[examInfo.type] = (examTypeCounts[examInfo.type] || 0) + 1;
    return examTypeCounts[examInfo.type] <= 2;
  });

  const examAssignedCounts: Record<string, number> = { gk1: 0, ck1: 0, gk2: 0, ck2: 0 };
  const synchronized = filteredList.map(entry => {
    const examInfo = isPeriodicExamEntry(entry);
    if (!examInfo.isExam || !examInfo.type) {
      return entry;
    }

    // Exam entry formatting and canonical week assignment
    let targetWeek = 9;
    if (examInfo.type === 'gk1') targetWeek = 9;
    else if (examInfo.type === 'ck1') targetWeek = 17;
    else if (examInfo.type === 'gk2') targetWeek = 27;
    else if (examInfo.type === 'ck2') targetWeek = 35;

    examAssignedCounts[examInfo.type] = (examAssignedCounts[examInfo.type] || 0) + 1;
    const isFirstOfPair = examAssignedCounts[examInfo.type] === 1;

    // First entry is always Đại số (tiết 1/2), second entry is always Hình học (tiết 2/2)
    const isHinh = !isFirstOfPair;
    const halfText = isHinh ? '(tiết 2/2 kiểm tra)' : '(tiết 1/2 kiểm tra)';
    const cleanTitle = (examInfo.title || 'Kiểm tra đánh giá định kỳ')
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .trim();

    return {
      ...entry,
      week: targetWeek,
      semester: (targetWeek <= 18 ? 1 : 2) as (1 | 2),
      branch: (isHinh ? 'Hình học' : 'Đại số') as any,
      chapter: examInfo.title || entry.chapter,
      lessonName: `${cleanTitle} (2 tiết)\n${halfText}`,
      periodsCount: 2
    };
  });

  // 3. Đảm bảo tuần kiểm tra có 2 tiết kiểm tra + tối đa 2 tiết bài dạy (linh hoạt 2 Số - 0 Hình, 1 Số - 1 Hình, hoặc 0 Số - 2 Hình)
  // và tự động cân bằng toàn bộ 35 tuần đúng chuẩn 4 tiết/tuần mà không làm mất tỷ lệ linh hoạt
  return balanceCurriculumWeeks4PerWeek(synchronized);
}

/**
 * Cân bằng phân bổ các tuần: đảm bảo mỗi tuần từ Tuần 1 đến Tuần 35 có đúng chính xác 4 tiết (140 tiết cả năm).
 * Giữ nguyên các tỷ lệ linh hoạt:
 * - Tuần không kiểm tra: 4-0, 3-1, 2-2, 1-3, 0-4
 * - Tuần kiểm tra: 3-1, 2-2, 1-3 (2 tiết kiểm tra + 2 tiết bài dạy: 2 Số - 0 Hình, 1 Số - 1 Hình, hoặc 0 Số - 2 Hình)
 */
export function balanceCurriculumWeeks4PerWeek(entries: CurriculumEntry[]): CurriculumEntry[] {
  if (!entries || entries.length === 0) return entries;
  const list = entries.map(e => ({ ...e }));

  // 1. Trong các tuần kiểm tra định kỳ [9, 17, 27, 35]: giữ tối đa 2 bài dạy thông thường
  const examWeeks = [9, 17, 27, 35];
  for (const w of examWeeks) {
    const regInWeek = list.filter(e => e.week === w && !isPeriodicExamEntry(e).isExam);
    while (regInWeek.length > 2) {
      const extra = regInWeek.pop()!;
      let bestW = 1;
      let minDiff = 999;
      for (let candW = 1; candW <= 35; candW++) {
        const candTotal = list.filter(e => e.week === candW).length;
        const candReg = list.filter(e => e.week === candW && !isPeriodicExamEntry(e).isExam).length;
        const isExam = examWeeks.includes(candW);
        const canAccept = isExam ? candReg < 2 : candTotal < 4;
        if (canAccept) {
          const diff = Math.abs(candW - w);
          if (diff < minDiff) {
            minDiff = diff;
            bestW = candW;
          }
        }
      }
      extra.week = bestW;
      extra.semester = (bestW <= 18 ? 1 : 2) as (1 | 2);
    }
  }

  // 2. Trên toàn bộ 35 tuần, điều chuyển các tiết thừa (> 4) sang các tuần thiếu (< 4)
  let iterations = 0;
  while (iterations < 60) {
    iterations++;
    const overWeek = Array.from({ length: 35 }, (_, i) => i + 1).find(w => list.filter(e => e.week === w).length > 4);
    const underWeek = Array.from({ length: 35 }, (_, i) => i + 1).find(w => list.filter(e => e.week === w).length < 4);
    if (!overWeek || !underWeek) break;

    const overReg = list.filter(e => e.week === overWeek && !isPeriodicExamEntry(e).isExam);
    if (overReg.length === 0) break;
    const toMove = overReg[overReg.length - 1];
    toMove.week = underWeek;
    toMove.semester = (underWeek <= 18 ? 1 : 2) as (1 | 2);
  }

  return list;
}

/**
 * Tự động cân bằng chuẩn 4 tiết / tuần cho toàn bộ 35 tuần của năm học:
 * - Đảm bảo mỗi tuần có đúng 4 tiết:
 *   + Tuần 7: 4 tiết (2 Số + 2 Hình)
 *   + Tuần 8: 4 tiết (2 Số + 2 Hình)
 *   + Tuần 9 (Kiểm tra giữa kì 1): 4 tiết (1 Số bài dạy [Tiết 17] + 1 Số kiểm tra [Tiết 18] + 1 Hình bài dạy [Tiết 17] + 1 Hình kiểm tra [Tiết 18])
 *   + Tuần 10: 4 tiết (2 Số [Tiết 19, 20] + 2 Hình [Tiết 19, 20])
 *   + Mọi tuần còn lại: chuẩn 4 tiết/tuần.
 * - Khắc phục triệt để tình trạng lệch tiết (ví dụ Tuần 7 bị thiếu còn 2 tiết, Tuần 9 dồn lên 8 tiết, Tuần 10 dồn lên 14 tiết).
 */
export function repairAndBalanceWeeklyCurriculum(entries: CurriculumEntry[], standardFallback?: CurriculumEntry[]): CurriculumEntry[] {
  if (!entries || entries.length === 0) return standardFallback && standardFallback.length > 0 ? [...standardFallback] : [];

  // Đảm bảo đủ 140 tiết nếu có standardFallback
  const preProcessed = standardFallback && standardFallback.length > 0
    ? fillOrTrimTo140Periods(entries, standardFallback)
    : entries;

  // 1. Khử trùng lặp ID
  const seenIds = new Set<string>();
  const uniqueList: CurriculumEntry[] = [];
  for (const entry of preProcessed) {
    if (!entry || !entry.id) continue;
    if (seenIds.has(entry.id)) continue;
    seenIds.add(entry.id);
    uniqueList.push({ ...entry });
  }

  // 2. Giới hạn mỗi đợt kiểm tra định kỳ đúng 2 tiết (1 Số, 1 Hình)
  const examTypeCounts: Record<string, number> = { gk1: 0, ck1: 0, gk2: 0, ck2: 0 };
  const filteredList = uniqueList.filter(entry => {
    const examInfo = isPeriodicExamEntry(entry);
    if (!examInfo.isExam || !examInfo.type) return true;
    examTypeCounts[examInfo.type] = (examTypeCounts[examInfo.type] || 0) + 1;
    return examTypeCounts[examInfo.type] <= 2;
  });

  // Đồng bộ và chuẩn hóa 4 đợt kiểm tra định kì vào đúng tuần quy định (Tuần 9, 17, 27, 35)
  const examAssigned: Record<string, number> = { gk1: 0, ck1: 0, gk2: 0, ck2: 0 };
  filteredList.forEach(entry => {
    const examInfo = isPeriodicExamEntry(entry);
    if (!examInfo.isExam || !examInfo.type) return;

    let targetWeek = 9;
    if (examInfo.type === 'gk1') targetWeek = 9;
    else if (examInfo.type === 'ck1') targetWeek = 17;
    else if (examInfo.type === 'gk2') targetWeek = 27;
    else if (examInfo.type === 'ck2') targetWeek = 35;

    examAssigned[examInfo.type] = (examAssigned[examInfo.type] || 0) + 1;
    const isFirstOfPair = examAssigned[examInfo.type] === 1;
    const isHinh = !isFirstOfPair;
    const halfText = isHinh ? '(tiết 2/2 kiểm tra)' : '(tiết 1/2 kiểm tra)';
    const cleanTitle = (examInfo.title || 'Kiểm tra đánh giá định kỳ')
      .replace(/\s*\(\s*\d+\s*(?:tiết|Tiết)\s*\)$/i, '')
      .trim();

    entry.week = targetWeek;
    entry.semester = (targetWeek <= 18 ? 1 : 2) as (1 | 2);
    entry.branch = (isHinh ? 'Hình học' : 'Đại số') as any;
    entry.chapter = examInfo.title || entry.chapter;
    entry.lessonName = `${cleanTitle} (2 tiết)\n${halfText}`;
    entry.periodsCount = 2;
  });

  // 3. Cân bằng tuần tự từng học kỳ để mỗi tuần có đúng 4 tiết:
  // - Học kỳ 1: Tuần 1-18 (72 tiết), trong đó Tuần 9 và Tuần 17 là tuần kiểm tra định kỳ (2 tiết kiểm tra + 2 tiết bài học)
  // - Học kỳ 2: Tuần 19-35 (68 tiết), trong đó Tuần 27 và Tuần 35 là tuần kiểm tra định kỳ
  function balanceSemesterRange(startW: number, endW: number, examWeeks: number[]) {
    const semEntries = filteredList.filter(e => {
      const w = e.week || 1;
      return w >= startW && w <= endW;
    });

    const regular = semEntries.filter(e => !isPeriodicExamEntry(e).isExam);

    const regSo = regular.filter(e => !isHinhEntry(e));
    const regHinh = regular.filter(e => isHinhEntry(e));

    // Sắp xếp bài dạy thông thường Số và Hình theo thứ tự tuần hiện có để giữ vững mạch kiến thức
    regSo.sort((a, b) => (a.week || 1) - (b.week || 1));
    regHinh.sort((a, b) => (a.week || 1) - (b.week || 1));

    let soIdx = 0;
    let hinhIdx = 0;

    for (let w = startW; w <= endW; w++) {
      const isExamWeek = examWeeks.includes(w);
      const sem = (w <= 18 ? 1 : 2) as (1 | 2);

      let takeHinh = 0;
      let takeSo = 0;

      if (isExamWeek) {
        // Tuần kiểm tra định kỳ (9, 17, 27, 35):
        // Riêng Tuần 35 (cuối năm): Hình học kết thúc ở tuần 34, nên tuần 35 gồm 2 bài tổng kết/trả bài Số + 2 tiết kiểm tra
        if (w === 35 && regHinh.length - hinhIdx === 0) {
          takeHinh = 0;
          takeSo = 2;
        } else {
          // Tuần 9, 17, 27: Đúng chuẩn 1 tiết bài mới Số + 1 tiết bài mới Hình + 2 tiết kiểm tra = 4 tiết (2 Số • 2 Hình)
          takeHinh = 1;
          takeSo = 1;
        }
      } else {
        const remainingWeeks = endW - w + 1;
        const remainingHinh = regHinh.length - hinhIdx;
        const needed = 4;
        if (remainingHinh >= remainingWeeks * 2) {
          takeHinh = 2;
        } else if (remainingHinh > remainingWeeks) {
          takeHinh = 2;
        } else {
          takeHinh = 1;
        }
        takeHinh = Math.min(takeHinh, remainingHinh);
        takeSo = needed - takeHinh;
        if (takeSo > (regSo.length - soIdx)) {
          takeSo = regSo.length - soIdx;
          takeHinh = needed - takeSo;
        }
      }

      for (let i = 0; i < takeSo; i++) {
        if (soIdx < regSo.length) {
          regSo[soIdx].week = w;
          regSo[soIdx].semester = sem;
          soIdx++;
        }
      }
      for (let i = 0; i < takeHinh; i++) {
        if (hinhIdx < regHinh.length) {
          regHinh[hinhIdx].week = w;
          regHinh[hinhIdx].semester = sem;
          hinhIdx++;
        }
      }
    }

    // Residual items (nếu có bài giáo viên thêm mới vượt khung)
    while (soIdx < regSo.length) {
      regSo[soIdx].week = endW;
      regSo[soIdx].semester = (endW <= 18 ? 1 : 2) as (1 | 2);
      soIdx++;
    }
    while (hinhIdx < regHinh.length) {
      regHinh[hinhIdx].week = endW;
      regHinh[hinhIdx].semester = (endW <= 18 ? 1 : 2) as (1 | 2);
      hinhIdx++;
    }
  }

  balanceSemesterRange(1, 18, [9, 17]);
  balanceSemesterRange(19, 35, [27, 35]);

  return applySeparateBranchPeriodNumbering(filteredList);
}

