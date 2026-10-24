import { CurriculumEntry, GradeLevel } from '../types/edtech';
import { CURRICULUM_TOAN_9 } from './curriculumToan9';
import { applySeparateBranchPeriodNumbering, ensurePeriodicExamsAreSynchronized, fillOrTrimTo140Periods, isHinhEntry, isPeriodicExamEntry, repairAndBalanceWeeklyCurriculum } from '../utils/curriculumHelpers';

// =========================================================================
// PHÂN PHỐI CHƯƠNG TRÌNH TOÁN 8 - GDPT 2018 (BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG / CÁNH DIỀU)
// ĐỦ 140 TIẾT / NĂM: HỌC KỲ I: 72 TIẾT (18 TUẦN x 4 TIẾT) • HỌC KỲ II: 68 TIẾT (17 TUẦN x 4 TIẾT)
// =========================================================================

const RAW_CURRICULUM_TOAN_8: CurriculumEntry[] = [
  // --- TUẦN 1 (TIẾT 1 - 4) ---
  {
    id: 't8-w1-p1',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 1,
    periodNumber: 1,
    branch: 'Đại số',
    chapter: 'Chương I. Đa thức',
    lessonName: 'Bài 1. Đơn thức nhiều biến. Đa thức nhiều biến (Tiết 1)',
    equipment: 'Máy chiếu, SGK Toán 8, máy tính cầm tay',
    location: 'Lớp học',
    digitalCompetency: '1.1.NC1b: Tìm kiếm trực tuyến ứng dụng của đơn thức trong tính toán hình học',
    aiRoleCode: '8.A1.1',
    periodsCount: 2
  },
  {
    id: 't8-w1-p2',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 1,
    periodNumber: 2,
    branch: 'Đại số',
    chapter: 'Chương I. Đa thức',
    lessonName: 'Bài 1. Đơn thức nhiều biến. Đa thức nhiều biến (Tiết 2)',
    equipment: 'Máy chiếu, phiếu học tập số 1',
    location: 'Lớp học',
    digitalCompetency: '5.3.NC1a: Lập bảng tính toán đa thức thu gọn trên Excel',
    aiRoleCode: '8.A1.2',
    periodsCount: 2
  },
  {
    id: 't8-w1-p3',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 1,
    periodNumber: 3,
    branch: 'Đại số',
    chapter: 'Chương I. Đa thức',
    lessonName: 'Bài 2. Các phép tính với đa thức nhiều biến: Cộng và trừ đa thức (Tiết 1)',
    equipment: 'Bảng phụ, SGK Toán 8',
    location: 'Lớp học',
    digitalCompetency: '3.2.NC1: Trực quan hóa quy tắc dấu ngoặc khi trừ đa thức',
    aiRoleCode: '8.A2.1',
    periodsCount: 2
  },
  {
    id: 't8-w1-p4',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 1,
    periodNumber: 1, // Đếm riêng phân môn: Tuần 1 Hình học bắt đầu từ Tiết 1 (không đếm gộp thành Tiết 4)
    branch: 'Hình học',
    chapter: 'Chương III. Tứ giác',
    lessonName: 'Bài 10. Tứ giác: Định nghĩa và tổng các góc trong một tứ giác (Tiết 1)',
    equipment: 'Thước đo góc, phần mềm GeoGebra vẽ tứ giác',
    location: 'Lớp học',
    digitalCompetency: '5.3.NC1a: Dùng GeoGebra kéo thả các đỉnh chứng minh tổng 4 góc bằng 360°',
    aiRoleCode: '8.C1.1',
    periodsCount: 1
  },

  // --- TUẦN 2 (TIẾT 5 - 8) ---
  {
    id: 't8-w2-p5',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 2,
    periodNumber: 5,
    branch: 'Đại số',
    chapter: 'Chương I. Đa thức',
    lessonName: 'Bài 2. Các phép tính với đa thức nhiều biến: Nhân đơn thức với đa thức (Tiết 2)',
    equipment: 'Máy tính Casio, SGK',
    location: 'Lớp học',
    digitalCompetency: '1.2.NC1: Sử dụng công cụ số kiểm tra phép nhân đa thức',
    aiRoleCode: '8.A2.2',
    periodsCount: 4
  },
  {
    id: 't8-w2-p6',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 2,
    periodNumber: 6,
    branch: 'Đại số',
    chapter: 'Chương I. Đa thức',
    lessonName: 'Bài 2. Các phép tính với đa thức nhiều biến: Nhân đa thức với đa thức (Tiết 3)',
    equipment: 'Phiếu học tập cặp đôi',
    location: 'Lớp học',
    digitalCompetency: '3.1.NC1: Tính diện tích hình chữ nhật mở rộng bằng đa thức',
    aiRoleCode: '8.A2.3',
    periodsCount: 4
  },
  {
    id: 't8-w2-p7',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 2,
    periodNumber: 7,
    branch: 'Đại số',
    chapter: 'Chương I. Đa thức',
    lessonName: 'Bài 2. Các phép tính với đa thức nhiều biến: Chia đa thức cho đơn thức (Tiết 4)',
    equipment: 'Bảng tương tác, SGK',
    location: 'Lớp học',
    digitalCompetency: '1.1.NC1: Luyện tập trắc nghiệm số trên Quizizz',
    aiRoleCode: '8.A2.4',
    periodsCount: 4
  },
  {
    id: 't8-w2-p8',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 2,
    periodNumber: 2, // Đếm riêng phân môn: Hình học Tiết 2
    branch: 'Hình học',
    chapter: 'Chương III. Tứ giác',
    lessonName: 'Bài 11. Hình thang cân: Định nghĩa, tính chất và dấu hiệu nhận biết (Tiết 1)',
    equipment: 'Compa, thước kẻ, máy chiếu GeoGebra',
    location: 'Lớp học',
    digitalCompetency: '5.3.NC1a: Sử dụng GeoGebra kiểm tra tính đối xứng của hình thang cân',
    aiRoleCode: '8.C2.1',
    periodsCount: 2
  },

  // --- TUẦN 3 ---
  {
    id: 't8-w3-p9',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 3,
    periodNumber: 7,
    branch: 'Đại số',
    chapter: 'Chương I. Đa thức',
    lessonName: 'Luyện tập chung về các phép tính đa thức nhiều biến',
    equipment: 'Phiếu học tập nhóm',
    location: 'Lớp học',
    digitalCompetency: '4.1.NC1: Hoạt động giải toán nhóm qua bảng tương tác Padlet',
    aiRoleCode: '8.A2.5',
    periodsCount: 1
  },
  {
    id: 't8-w3-p10',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 3,
    periodNumber: 8,
    branch: 'Đại số',
    chapter: 'Chương II. Hằng đẳng thức đáng nhớ và ứng dụng',
    lessonName: 'Bài 6. Hiệu hai bình phương. Bình phương của một tổng hay một hiệu (Tiết 1)',
    equipment: 'Mô hình cắt ghép hình học diện tích hình vuông (a+b)²',
    location: 'Lớp học',
    digitalCompetency: '5.3.NC1: Trực quan hóa hình học hằng đẳng thức trên GeoGebra',
    aiRoleCode: '8.B1.1',
    periodsCount: 2
  },
  {
    id: 't8-w3-p11',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 3,
    periodNumber: 9,
    branch: 'Đại số',
    chapter: 'Chương II. Hằng đẳng thức đáng nhớ và ứng dụng',
    lessonName: 'Bài 6. Hiệu hai bình phương. Bình phương của một tổng hay một hiệu (Tiết 2)',
    equipment: 'Máy tính cầm tay, SGK Toán 8',
    location: 'Lớp học',
    digitalCompetency: '1.2.NC1: Tính nhanh bình phương số lớn bằng hằng đẳng thức',
    aiRoleCode: '8.B1.2',
    periodsCount: 2
  },
  {
    id: 't8-w3-p12',
    grade: 'Lớp 8',
    subject: 'Toán học',
    semester: 1,
    week: 3,
    periodNumber: 3, // Đếm riêng phân môn: Hình học Tiết 3
    branch: 'Hình học',
    chapter: 'Chương III. Tứ giác',
    lessonName: 'Bài 11. Hình thang cân: Luyện tập và ứng dụng thực tế (Tiết 2)',
    equipment: 'Hình ảnh thực tế cầu ngói, mái nhà hình thang cân',
    location: 'Lớp học',
    digitalCompetency: '2.1.NC1: Tìm hiểu kết cấu kiến trúc hình thang cân',
    aiRoleCode: '8.C2.2',
    periodsCount: 2
  },

  // --- TUẦN 4 - 18: KHUNG CHƯƠNG TRÌNH CHUẨN HK1 TOÁN 8 ---
  // (Tạo chuỗi 72 tiết chuẩn học kỳ 1 Toán 8)
  ...generateSemester1Grade8Periods(),

  // --- HỌC KỲ II: 68 TIẾT (TUẦN 19 - TUẦN 35) ---
  ...generateSemester2Grade8Periods()
];

// Helper to generate remaining weeks of Semester 1 for Grade 8
function generateSemester1Grade8Periods(): CurriculumEntry[] {
  const result: CurriculumEntry[] = [];
  const chapters = [
    { name: 'Chương II. Hằng đẳng thức và phân tích đa thức', branch: 'Đại số' as const, baseLesson: 'Bài 7. Lập phương của một tổng và một hiệu. Tổng và hiệu hai lập phương' },
    { name: 'Chương II. Hằng đẳng thức và phân tích đa thức', branch: 'Đại số' as const, baseLesson: 'Bài 8. Phân tích đa thức thành nhân tử bằng phương pháp đặt nhân tử chung và dùng hằng đẳng thức' },
    { name: 'Chương II. Hằng đẳng thức và phân tích đa thức', branch: 'Đại số' as const, baseLesson: 'Bài 9. Phân tích đa thức thành nhân tử bằng phương pháp nhóm hạng tử' },
    { name: 'Chương III. Tứ giác', branch: 'Hình học' as const, baseLesson: 'Bài 12. Hình bình hành: Định nghĩa, tính chất và dấu hiệu nhận biết' },
    { name: 'Chương III. Tứ giác', branch: 'Hình học' as const, baseLesson: 'Bài 13. Hình chữ nhật: Tính chất hai đường chéo và dấu hiệu nhận biết' },
    { name: 'Chương III. Tứ giác', branch: 'Hình học' as const, baseLesson: 'Bài 14. Hình thoi và hình vuông: Tính chất đối xứng và dấu hiệu' },
    { name: 'Chương IV. Định lí Thalès', branch: 'Hình học' as const, baseLesson: 'Bài 15. Định lí Thalès trong tam giác' },
    { name: 'Chương IV. Định lí Thalès', branch: 'Hình học' as const, baseLesson: 'Bài 16. Đường trung bình của tam giác' },
    { name: 'Chương IV. Định lí Thalès', branch: 'Hình học' as const, baseLesson: 'Bài 17. Tính chất đường phân giác của tam giác' },
    { name: 'Kiểm tra & Đánh giá định kỳ', branch: 'Kiểm tra' as const, baseLesson: 'Kiểm tra định kỳ giữa Học kỳ I (Chuẩn Công văn 7991/BGDĐT)' },
    { name: 'Chương V. Dữ liệu và biểu đồ', branch: 'Thống kê & Xác suất' as const, baseLesson: 'Bài 18. Thu thập và phân loại dữ liệu thống kê' },
    { name: 'Chương V. Dữ liệu và biểu đồ', branch: 'Thống kê & Xác suất' as const, baseLesson: 'Bài 19. Biểu diễn dữ liệu bằng bảng và biểu đồ thích hợp' },
    { name: 'Ôn tập cuối Học kỳ I', branch: 'Đại số' as const, baseLesson: 'Ôn tập tổng hợp kiến thức Đại số Học kỳ I' },
    { name: 'Kiểm tra cuối Học kỳ I', branch: 'Kiểm tra' as const, baseLesson: 'Kiểm tra đánh giá cuối Học kỳ I (Ma trận chuẩn CV 7991)' },
    { name: 'Thực hành trải nghiệm', branch: 'Thực hành trải nghiệm' as const, baseLesson: 'Hoạt động trải nghiệm: Ứng dụng định lí Thalès đo khoảng cách thực tế' }
  ];

  let period = 13;
  for (let w = 4; w <= 18; w++) {
    for (let pInWeek = 1; pInWeek <= 4; pInWeek++) {
      // Mỗi bài dạy 2 tiết: pInWeek 1,2 là Bài 1; pInWeek 3,4 là Bài 2
      const topicIndex = (w - 4) * 2 + (pInWeek <= 2 ? 0 : 1);
      const ch = chapters[topicIndex % chapters.length];
      const pInLesson = ((pInWeek - 1) % 2) + 1; // Tiết 1 hoặc Tiết 2 của bài đó
      result.push({
        id: `t8-w${w}-p${period}`,
        grade: 'Lớp 8',
        subject: 'Toán học',
        semester: 1,
        week: w,
        periodNumber: period,
        branch: ch.branch,
        chapter: ch.name,
        lessonName: `${ch.baseLesson} (Tiết ${pInLesson})`,
        equipment: 'Máy tính, ti vi, SGK Toán 8, phần mềm GeoGebra',
        location: 'Lớp học',
        digitalCompetency: '5.3.NC1a: Sử dụng công cụ số mô phỏng và kiểm tra kết quả',
        aiRoleCode: `8.${ch.branch === 'Đại số' ? 'A' : ch.branch === 'Hình học' ? 'C' : ch.branch === 'Thống kê & Xác suất' ? 'T' : 'D'}${period % 5 + 1}.1`,
        periodsCount: 2
      });
      period++;
    }
  }
  return result;
}

// Helper to generate Semester 2 for Grade 8 (68 periods, Weeks 19-35)
function generateSemester2Grade8Periods(): CurriculumEntry[] {
  const result: CurriculumEntry[] = [];
  const sem2Topics = [
    { name: 'Chương VI. Phân thức đại số', branch: 'Đại số' as const, baseLesson: 'Bài 21. Khái niệm phân thức đại số và tính chất cơ bản' },
    { name: 'Chương VI. Phân thức đại số', branch: 'Đại số' as const, baseLesson: 'Bài 22. Phép cộng và phép trừ phân thức đại số' },
    { name: 'Chương VI. Phân thức đại số', branch: 'Đại số' as const, baseLesson: 'Bài 23. Phép nhân và phép chia phân thức đại số' },
    { name: 'Chương VII. Phương trình bậc nhất một ẩn và hàm số bậc nhất', branch: 'Đại số' as const, baseLesson: 'Bài 25. Phương trình bậc nhất một ẩn ax + b = 0' },
    { name: 'Chương VII. Phương trình bậc nhất một ẩn và hàm số bậc nhất', branch: 'Đại số' as const, baseLesson: 'Bài 26. Giải bài toán bằng cách lập phương trình' },
    { name: 'Chương VII. Phương trình bậc nhất một ẩn và hàm số bậc nhất', branch: 'Đại số' as const, baseLesson: 'Bài 27. Khái niệm hàm số bậc nhất y = ax + b (a ≠ 0) và đồ thị' },
    { name: 'Chương VII. Phương trình bậc nhất một ẩn và hàm số bậc nhất', branch: 'Đại số' as const, baseLesson: 'Bài 28. Hệ số góc của đường thẳng y = ax + b' },
    { name: 'Chương VIII. Mở đầu về xác suất của biến cố', branch: 'Thống kê & Xác suất' as const, baseLesson: 'Bài 29. Xác suất thực nghiệm của biến cố trong một số trò chơi' },
    { name: 'Chương VIII. Mở đầu về xác suất của biến cố', branch: 'Thống kê & Xác suất' as const, baseLesson: 'Bài 30. Xác suất của biến cố ngẫu nhiên trong một số trò chơi đơn giản' },
    { name: 'Chương IX. Tam giác đồng dạng', branch: 'Hình học' as const, baseLesson: 'Bài 31. Hai tam giác đồng dạng: Định nghĩa và tính chất' },
    { name: 'Chương IX. Tam giác đồng dạng', branch: 'Hình học' as const, baseLesson: 'Bài 32. Các trường hợp đồng dạng của hai tam giác' },
    { name: 'Chương IX. Tam giác đồng dạng', branch: 'Hình học' as const, baseLesson: 'Bài 33. Các trường hợp đồng dạng của hai tam giác vuông' },
    { name: 'Chương X. Một số hình khối trong thực tiễn', branch: 'Hình học' as const, baseLesson: 'Bài 34. Hình chóp tam giác đều: Diện tích xung quanh và thể tích' },
    { name: 'Chương X. Một số hình khối trong thực tiễn', branch: 'Hình học' as const, baseLesson: 'Bài 35. Hình chóp tứ giác đều: Diện tích xung quanh và thể tích' },
    { name: 'Kiểm tra giữa Học kỳ II', branch: 'Kiểm tra' as const, baseLesson: 'Kiểm tra định kỳ giữa Học kỳ II (Chuẩn CV 7991)' },
    { name: 'Ôn tập cuối năm', branch: 'Đại số' as const, baseLesson: 'Ôn tập cuối năm toàn diện: Phân thức, phương trình, hàm số và tam giác đồng dạng' },
    { name: 'Kiểm tra cuối Học kỳ II', branch: 'Kiểm tra' as const, baseLesson: 'Kiểm tra đánh giá cuối năm học (Chuẩn 10 điểm CV 7991)' },
    { name: 'Tổng kết năm học', branch: 'Thực hành trải nghiệm' as const, baseLesson: 'Thực hành trải nghiệm: Đo chiều cao vật thể bằng tam giác đồng dạng và bóng mặt trời' }
  ];

  let period = 73;
  for (let w = 19; w <= 35; w++) {
    for (let pInWeek = 1; pInWeek <= 4; pInWeek++) {
      const topicIndex = (w - 19) * 2 + (pInWeek <= 2 ? 0 : 1);
      const topic = sem2Topics[topicIndex % sem2Topics.length];
      const pInLesson = ((pInWeek - 1) % 2) + 1; // Tiết 1 hoặc Tiết 2 của bài đó
      result.push({
        id: `t8-w${w}-p${period}`,
        grade: 'Lớp 8',
        subject: 'Toán học',
        semester: 2,
        week: w,
        periodNumber: period,
        branch: topic.branch,
        chapter: topic.name,
        lessonName: `${topic.baseLesson} (Tiết ${pInLesson})`,
        equipment: 'Máy tính, ti vi, SGK Toán 8, dụng cụ thực hành đo đạc',
        location: 'Lớp học',
        digitalCompetency: '5.3.NC1a: Sử dụng GeoGebra vẽ đồ thị và mô hình 3D hình chóp',
        aiRoleCode: `8.${topic.branch === 'Đại số' ? 'A' : topic.branch === 'Hình học' ? 'C' : topic.branch === 'Thống kê & Xác suất' ? 'T' : 'D'}${period % 5 + 1}.2`,
        periodsCount: 2
      });
      period++;
    }
  }
  return result;
}

// =========================================================================
// PHÂN PHỐI CHƯƠNG TRÌNH TOÁN 7 & TOÁN 6 (GDPT 2018 - 140 TIẾT / NĂM)
// =========================================================================

export function generateStandardCurriculumForGrade(grade: GradeLevel): CurriculumEntry[] {
  if (grade === 'Lớp 9') return CURRICULUM_TOAN_9;
  if (grade === 'Lớp 8') return CURRICULUM_TOAN_8;

  // Grade 7 (Toán 7)
  if (grade === 'Lớp 7') {
    const list: CurriculumEntry[] = [];
    const topics = [
      { name: 'Chương I. Số hữu tỉ', branch: 'Đại số' as const, lesson: 'Tập hợp các số hữu tỉ và các phép tính cộng, trừ, nhân, chia' },
      { name: 'Chương II. Số thực', branch: 'Đại số' as const, lesson: 'Số vô tỉ. Căn bậc hai số học và tập hợp số thực' },
      { name: 'Chương III. Góc và đường thẳng song song', branch: 'Hình học' as const, lesson: 'Hai góc kề bù, so le trong, đồng vị và định lí song song' },
      { name: 'Chương IV. Tam giác bằng nhau', branch: 'Hình học' as const, lesson: 'Các trường hợp bằng nhau của hai tam giác' },
      { name: 'Chương V. Biểu đồ đoạn thẳng và quạt tròn', branch: 'Thống kê & Xác suất' as const, lesson: 'Thu thập và biểu diễn dữ liệu bằng biểu đồ quạt tròn' },
      { name: 'Chương VI. Tỉ lệ thức và đại lượng tỉ lệ', branch: 'Đại số' as const, lesson: 'Tỉ lệ thức và dãy tỉ số bằng nhau' },
      { name: 'Chương VII. Biểu thức đại số và đa thức một biến', branch: 'Đại số' as const, lesson: 'Đa thức một biến và nghiệm của đa thức' },
      { name: 'Chương VIII. Quan hệ giữa các yếu tố trong tam giác', branch: 'Hình học' as const, lesson: 'Bất đẳng thức tam giác và đường đồng quy trong tam giác' }
    ];

    let pNum = 1;
    for (let w = 1; w <= 35; w++) {
      const sem = w <= 18 ? 1 : 2;
      for (let p = 1; p <= 4; p++) {
        const topIdx = (w - 1) * 2 + (p <= 2 ? 0 : 1);
        const top = topics[topIdx % topics.length];
        const pInLesson = ((p - 1) % 2) + 1; // Tiết 1 hoặc Tiết 2 của bài
        list.push({
          id: `t7-w${w}-p${pNum}`,
          grade: 'Lớp 7',
          subject: 'Toán học',
          semester: sem,
          week: w,
          periodNumber: pNum,
          branch: top.branch,
          chapter: top.name,
          lessonName: `${top.lesson} (Tiết ${pInLesson})`,
          equipment: 'SGK Toán 7, máy tính cầm tay, thước kẻ, compa',
          location: 'Lớp học',
          digitalCompetency: '5.3.NC1a: Dùng GeoGebra dựng hình và kiểm tra',
          aiRoleCode: `7.A${pNum % 4 + 1}.1`,
          periodsCount: 2
        });
        pNum++;
      }
    }
    return list;
  }

  // Grade 6 (Toán 6)
  const list6: CurriculumEntry[] = [];
  const topics6 = [
    { name: 'Chương I. Tập hợp các số tự nhiên', branch: 'Đại số' as const, lesson: 'Tập hợp, thứ tự trong tập hợp và các phép tính số tự nhiên' },
    { name: 'Chương II. Tính chia hết trong tập hợp số tự nhiên', branch: 'Đại số' as const, lesson: 'Dấu hiệu chia hết, số nguyên tố, ước chung lớn nhất' },
    { name: 'Chương III. Số nguyên', branch: 'Đại số' as const, lesson: 'Tập hợp các số nguyên Z và quy tắc cộng trừ nhân số nguyên' },
    { name: 'Chương IV. Hình học trực quan', branch: 'Hình học' as const, lesson: 'Hình tam giác đều, hình vuông, hình lục giác đều, hình thoi' },
    { name: 'Chương V. Tính đối xứng của hình phẳng', branch: 'Hình học' as const, lesson: 'Hình có trục đối xứng và hình có tâm đối xứng trong thực tiễn' },
    { name: 'Chương VI. Phân số', branch: 'Đại số' as const, lesson: 'Khái niệm phân số, phân số bằng nhau và các phép tính' },
    { name: 'Chương VII. Số thập phân', branch: 'Đại số' as const, lesson: 'Số thập phân, tỉ số và tỉ số phần trăm' },
    { name: 'Chương VIII. Dữ liệu và xác suất thực nghiệm', branch: 'Thống kê & Xác suất' as const, lesson: 'Thu thập dữ liệu và biểu đồ cột kép' }
  ];

  let pNum6 = 1;
  for (let w = 1; w <= 35; w++) {
    const sem = w <= 18 ? 1 : 2;
    for (let p = 1; p <= 4; p++) {
      const topIdx = (w - 1) * 2 + (p <= 2 ? 0 : 1);
      const top = topics6[topIdx % topics6.length];
      const pInLesson = ((p - 1) % 2) + 1; // Tiết 1 hoặc Tiết 2 của bài
      list6.push({
        id: `t6-w${w}-p${pNum6}`,
        grade: 'Lớp 6',
        subject: 'Toán học',
        semester: sem,
        week: w,
        periodNumber: pNum6,
        branch: top.branch,
        chapter: top.name,
        lessonName: `${top.lesson} (Tiết ${pInLesson})`,
        equipment: 'SGK Toán 6, thước chia khoảng, đồ dùng trực quan',
        location: 'Lớp học',
        digitalCompetency: '1.1.NC1b: Tìm kiếm hình ảnh đối xứng trong tự nhiên',
        aiRoleCode: `6.A${pNum6 % 4 + 1}.1`,
        periodsCount: 2
      });
      pNum6++;
    }
  }
  return list6;
}

export const CURRICULUM_TOAN_8: CurriculumEntry[] = applySeparateBranchPeriodNumbering(RAW_CURRICULUM_TOAN_8);

// Unified Getter (Mặc định chuẩn)
export function getCurriculumForGrade(grade: GradeLevel): CurriculumEntry[] {
  if (grade === 'Lớp 9') return CURRICULUM_TOAN_9;
  if (grade === 'Lớp 8') return CURRICULUM_TOAN_8;
  return applySeparateBranchPeriodNumbering(generateStandardCurriculumForGrade(grade));
}

export function getSavedCurriculumForGrade(grade: GradeLevel = 'Lớp 9'): CurriculumEntry[] {
  try {
    const key = `edtech_custom_curriculum_${grade.replace(/\s+/g, '_')}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Tự động nâng cấp các bài mẫu của Toán 9 nếu là dữ liệu cũ chưa có phụ đề chi tiết Tiết 1 / Tiết 2
        let upgraded = parsed;
        if (grade === 'Lớp 9') {
          upgraded = parsed.map(e => {
            if (e.id === 't9-w1-p1' && !e.lessonName.includes(':')) {
              return { ...e, lessonName: 'Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn\n(Tiết 1: Phương trình bậc nhất 2 ẩn)' };
            }
            if (e.id === 't9-w1-p2' && !e.lessonName.includes(':')) {
              return { ...e, lessonName: 'Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn\n(Tiết 2: Hệ phương trình bậc nhất 2 ẩn)' };
            }
            return e;
          });
        }
        const standardFallback = getCurriculumForGrade(grade);
        const standardized140 = fillOrTrimTo140Periods(upgraded, standardFallback);

        // Tự động chuẩn hóa và định vị 4 bài kiểm tra định kì (Giữa kì 1, Cuối kì 1, Giữa kì 2, Cuối năm)
        // và tự động cân bằng 35 tuần đúng 4 tiết/tuần mà không phá vỡ tỷ lệ linh hoạt
        const synchronized = ensurePeriodicExamsAreSynchronized(standardized140, grade, standardFallback);

        const finalStandardized = applySeparateBranchPeriodNumbering(synchronized);
        if (JSON.stringify(finalStandardized) !== JSON.stringify(parsed)) {
          try {
            localStorage.setItem(key, JSON.stringify(finalStandardized));
          } catch (e) {
            // ignore
          }
        }

        return finalStandardized;
      }
    }
  } catch (err) {
    console.warn('Lỗi đọc custom curriculum từ localStorage:', err);
  }
  return getCurriculumForGrade(grade);
}

// Lưu phân phối chương trình tùy chỉnh của giáo viên cho từng khối
export function saveCurriculumForGrade(grade: GradeLevel, entries: CurriculumEntry[], source: string = 'internal'): void {
  try {
    const key = `edtech_custom_curriculum_${grade.replace(/\s+/g, '_')}`;
    const standardized = applySeparateBranchPeriodNumbering(entries);
    localStorage.setItem(key, JSON.stringify(standardized));
    window.dispatchEvent(new CustomEvent('curriculum-updated', { detail: { grade, source } }));
  } catch (err) {
    console.warn('Lỗi lưu custom curriculum vào localStorage:', err);
  }
}

// Khôi phục phân phối chương trình mặc định ban đầu
export function resetCurriculumForGrade(grade: GradeLevel): void {
  try {
    const key = `edtech_custom_curriculum_${grade.replace(/\s+/g, '_')}`;
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('curriculum-updated', { detail: { grade } }));
  } catch (err) {
    console.warn('Lỗi reset custom curriculum:', err);
  }
}
