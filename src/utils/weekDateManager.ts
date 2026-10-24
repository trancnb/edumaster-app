/**
 * QUẢN LÝ LỊCH VÀ NGÀY THÁNG CỦA CÁC TUẦN TRONG NĂM HỌC (TUẦN 1 -> TUẦN 35)
 * Tuân thủ yêu cầu:
 * a. Lấy ngày hệ thống làm mốc tính năm học (bắt đầu từ đầu tháng 9).
 * b. Khi bấm vào thời gian ở đầu tuần, hiện Calendar. Chọn bất kỳ ngày nào trong tuần đó, 
 *    hệ thống tự động tính ra Thứ 2 -> Thứ 7 của tuần.
 *    Định dạng hiển thị chuẩn: (dd/mm/yy-dd/mm/yy), ví dụ: (07/09/26-12/09/26).
 * c. Các tuần sau tự động rải ngày tiếp nối (+7 ngày mỗi tuần).
 * d. Nếu có điều chỉnh (ví dụ nghỉ Tết, nghỉ lễ, điều chỉnh tiến độ), 
 *    khi điều chỉnh tại tuần đó thì tự động có hiệu lực cho tuần đó trở về sau.
 */

export interface WeekDateInfo {
  week: number;
  monday: Date;
  saturday: Date;
  rangeString: string; // ví dụ: "(07/09/26-12/09/26)"
  isOverridden: boolean;
}

/**
 * Lấy ngày Thứ Hai đầu tiên của tháng 9 (mở đầu năm học) dựa trên ngày hệ thống.
 * Ví dụ: Năm học 2026-2027 -> Ngày khai giảng tuần 1 là Thứ Hai 07/09/2026.
 */
export function getDefaultSchoolYearStartDate(refDate: Date = new Date()): Date {
  const currentYear = refDate.getFullYear();
  const currentMonth = refDate.getMonth(); // 0 = Jan, 8 = Sep
  // Nếu đang từ tháng 9 trở đi thì năm học bắt đầu tháng 9 năm nay; nếu trước tháng 9 thì năm học bắt đầu tháng 9 năm trước.
  const startYear = currentMonth >= 8 ? currentYear : currentYear - 1;

  // Tìm ngày Thứ Hai đầu tiên của tháng 9
  const sep1 = new Date(startYear, 8, 1);
  const dayOfWeek = sep1.getDay(); // 0: Sun, 1: Mon, 2: Tue, ...
  const diffToFirstMonday = dayOfWeek === 1 ? 0 : dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  
  const firstMonday = new Date(startYear, 8, 1 + diffToFirstMonday);
  firstMonday.setHours(0, 0, 0, 0);
  return firstMonday;
}

/**
 * Lấy ngày Thứ Hai của tuần chứa một ngày bất kỳ.
 * (Thứ Hai được tính là ngày bắt đầu tuần học tại Việt Nam).
 */
export function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0: CN, 1: T2, 2: T3, ..., 6: T7
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

/**
 * Lấy ngày Thứ Bảy của tuần dựa trên ngày Thứ Hai (+5 ngày).
 */
export function getSaturdayOfWeek(monday: Date): Date {
  const sat = new Date(monday);
  sat.setDate(sat.getDate() + 5);
  sat.setHours(0, 0, 0, 0);
  return sat;
}

/**
 * Định dạng ngày dạng ngắn dd/mm/yy (ví dụ: 07/09/26)
 */
export function formatDateShort(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yy = date.getFullYear().toString().slice(-2);
  return `${dd}/${mm}/${yy}`;
}

/**
 * Định dạng chuỗi ngày tuần (dd/mm/yy-dd/mm/yy)
 * Ví dụ: (07/09/26-12/09/26)
 */
export function formatWeekDateRange(monday: Date): string {
  const sat = getSaturdayOfWeek(monday);
  return `(${formatDateShort(monday)}-${formatDateShort(sat)})`;
}

/**
 * Định dạng ngày ISO 'YYYY-MM-DD' để đưa vào input type="date"
 */
export function toISODateString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * TÍNH TOÁN DANH SÁCH TOÀN BỘ NGÀY CỦA CÁC TUẦN (MẶC ĐỊNH 35 TUẦN)
 * Có hỗ trợ điểm neo điều chỉnh (anchorDates):
 * - Nếu tuần w có mốc anchorDate thì lấy mốc đó (chuyển về Thứ 2).
 * - Nếu không có mốc, tuần w tự động bằng Thứ 2 của tuần (w - 1) + 7 ngày.
 */
export function computeAllWeekDates(
  totalWeeks: number = 35,
  anchorDates: Record<number, string> = {},
  refDate: Date = new Date()
): Map<number, WeekDateInfo> {
  const result = new Map<number, WeekDateInfo>();
  const defaultStart = getDefaultSchoolYearStartDate(refDate);

  let currentMonday = defaultStart;

  for (let w = 1; w <= totalWeeks; w++) {
    let weekMonday: Date;
    let isOverridden = false;

    if (anchorDates[w]) {
      weekMonday = getMondayOfWeek(new Date(anchorDates[w]));
      isOverridden = true;
      currentMonday = weekMonday;
    } else {
      if (w === 1) {
        weekMonday = defaultStart;
      } else {
        weekMonday = new Date(currentMonday.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
      currentMonday = weekMonday;
    }

    const saturday = getSaturdayOfWeek(weekMonday);
    result.set(w, {
      week: w,
      monday: weekMonday,
      saturday,
      rangeString: `(${formatDateShort(weekMonday)}-${formatDateShort(saturday)})`,
      isOverridden
    });
  }

  return result;
}

/**
 * LƯU VÀ TẢI MỐC NGÀY ĐIỀU CHỈNH THEO KHỐI LỚP VÀO LOCALSTORAGE
 */
const STORAGE_PREFIX = 'khbd_week_anchors_';

export function loadGradeWeekAnchors(grade: string = 'Lớp 9'): Record<number, string> {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${grade}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Lỗi đọc mốc ngày tuần từ localStorage:', e);
  }
  return {};
}

export function saveGradeWeekAnchors(grade: string = 'Lớp 9', anchors: Record<number, string>): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${grade}`, JSON.stringify(anchors));
  } catch (e) {
    console.warn('Lỗi lưu mốc ngày tuần vào localStorage:', e);
  }
}

/**
 * ĐIỀU CHỈNH MỐC NGÀY TẠI TUẦN K
 * - Lấy ngày Thứ Hai của tuần chứa ngày được chọn.
 * - Xóa các mốc neo sau tuần k để tuần k có hiệu lực rải tiếp nối từ đó trở về sau (yêu cầu d).
 */
export function adjustWeekAnchor(
  grade: string,
  week: number,
  selectedDate: Date,
  currentAnchors: Record<number, string>
): Record<number, string> {
  const monday = getMondayOfWeek(selectedDate);
  const updated: Record<number, string> = {};

  // Giữ lại các mốc trước tuần này
  Object.keys(currentAnchors).forEach(keyStr => {
    const w = parseInt(keyStr, 10);
    if (w < week) {
      updated[w] = currentAnchors[w];
    }
  });

  // Đặt mốc tuần này
  updated[week] = toISODateString(monday);

  saveGradeWeekAnchors(grade, updated);
  return updated;
}

/**
 * TĂNG / GIẢM TUẦN (Ví dụ: +1 tuần khi nghỉ Tết, nghỉ lễ)
 */
export function shiftWeekAnchor(
  grade: string,
  week: number,
  daysOffset: number,
  currentMonday: Date,
  currentAnchors: Record<number, string>
): Record<number, string> {
  const newMonday = new Date(currentMonday.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  return adjustWeekAnchor(grade, week, newMonday, currentAnchors);
}

/**
 * KHÔI PHỤC NGÀY CHUẨN CỦA NĂM HỌC
 */
export function resetWeekAnchors(grade: string): Record<number, string> {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${grade}`);
  } catch (e) {
    // ignore
  }
  return {};
}
