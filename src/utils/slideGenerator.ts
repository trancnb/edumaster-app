import { KHBDData, SlideItem } from '../types/edtech';

/**
 * Tạo bộ slide bài giảng sư phạm cao cấp chuẩn SGK Kết Nối Tri Thức Với Cuộc Sống
 * Chuyên đề: TOÁN 9 - CHƯƠNG I: PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
 * Bài 1: Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn (Tiết 1)
 * 
 * - Trang 1: Chào mừng học sinh THCS (Đồng phục áo trắng, khăn quàng đỏ, không khí vui tươi)
 * - Trang 2: Tiêu đề KNTT (Navy khối lớn, Thẻ chương cam, Dẫn nhập, PPCT Tuần 1 Tiết 1)
 * - Trang 3: Định hướng Mục tiêu tiết học (4 YCCĐ chuẩn CV 5512, khung viền cyan sắc nét)
 * - Trang 4: Hành trình khám phá (5 trạm học tập 01 - 05)
 * - Trang 5: Khởi động (Bài toán thực tế vé tham quan / mua sắm dẫn vào 5x + 3y = 26)
 * - Trang 6: Khám phá 1 - Khái niệm phương trình bậc nhất hai ẩn (Dạng tổng quát ax + by = c)
 * - Trang 7: Khám phá 1 (tiếp) - Khái niệm nghiệm và biểu diễn hình học trên mặt phẳng Oxy
 * - Trang 8: Tương tác Live Widget - Thử tài kiểm tra nghiệm của phương trình 2x + y = 5
 * - Trang 9: Khám phá 2 - Khái niệm hệ hai phương trình bậc nhất hai ẩn và nghiệm của hệ
 * - Trang 10: Ý nghĩa hình học của hệ hai phương trình (3 vị trí tương giao: Cắt nhau, Song song, Trùng nhau)
 * - Trang 11: Luyện tập - Bài toán dân gian "Vừa gà vừa chó" đưa về hệ phương trình & Giải từng bước
 * - Trang 12: AI LAB & Năng lực số - Trực quan hóa hình học bằng GeoGebra / Desmos theo QĐ 2422
 * - Trang 13: Exit Ticket - Phiếu tự kiểm tra ra về (3 câu cốt lõi)
 * - Trang 14: Game show "HỘP QUÀ MAY MẮN" (4 hộp quà 1, 2, 3, 4 nhận thưởng)
 * - Trang 15 - 18: Bộ 4 câu hỏi trắc nghiệm tương tác Click-To-Reveal (NB 1, NB 2, NB 3, TH) với quà tặng
 * - Trang 19: Bảng tổng kết kết quả thử thách & Vinh danh
 * - Trang 20: Cảm ơn và dặn dò nhiệm vụ về nhà
 */
export function generateStaticSlides(
  khbd: Partial<KHBDData> & { 
    lessonName: string; 
    subject?: any; 
    grade?: any; 
    currentPeriod?: number; 
    schoolName?: string; 
    teacherName?: string;
    className?: string;
  }, 
  targetCount: number = 20
): SlideItem[] {
  const schoolCredit = khbd.schoolName || 'TRƯỜNG THCS';
  const teacherCredit = khbd.teacherName || 'Bộ môn Toán';
  const className = khbd.className || '9A1';

  const allSlides: SlideItem[] = [];

  // =========================================================================
  // 1. SLIDE 1: CHÀO MỪNG CÁC EM (Welcome Slide)
  // =========================================================================
  allSlides.push({
    id: `slide-1-welcome-${Date.now()}`,
    slideType: 'welcome',
    title: 'Chào mừng các em học sinh đến với tiết học Toán 9!',
    subtitle: 'TOÁN 9 • BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG',
    phase: 'Mở đầu',
    layout: 'content-left-image-right',
    bullets: [
      'Không gian lớp học số tương tác hiện đại & thân thiện',
      'Chủ động tư duy – Hợp tác nhóm – Khám phá kiến thức mới',
      'Ứng dụng toán học giải quyết các tình huống thực tiễn đời sống'
    ],
    illustrationType: 'thcs-linear-equation',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Giáo viên ổn định lớp, tạo không khí học tập hào hứng, khích lệ tinh thần các em học sinh lớp 9.'
  });

  // =========================================================================
  // 2. SLIDE 2: TIÊU ĐỀ BÀI HỌC KNTT (Hero Title Slide)
  // =========================================================================
  allSlides.push({
    id: `slide-2-hero-${Date.now()}`,
    slideType: 'hero-title',
    chapterTag: 'CHƯƠNG I • PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    title: 'BÀI 1: KHÁI NIỆM PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    titlePart2: 'TIẾT 1 • HÌNH THÀNH KHÁI NIỆM & Ý NGHĨA HÌNH HỌC',
    subtitle: 'Dạng tổng quát $ax + by = c$ • Khái niệm nghiệm $(x_0; y_0)$ • Hệ hai phương trình',
    philosophyQuote: 'Toán học bắt nguồn từ thực tiễn mua bán, đo đạc và quay trở lại giải quyết những bài toán đa chiều của cuộc sống hiện đại.',
    ppctTag: `TOÁN 9 • KNTT • TIẾT 1 • PPCT 1 • TUẦN 1 • LỚP ${className}`,
    phase: 'Trang tiêu đề',
    layout: 'content-left-image-right',
    bullets: [
      'Chương I: Phương trình và hệ hai phương trình bậc nhất hai ẩn',
      'Bài 1: Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn',
      'Thời lượng: Tiết 1 / Tổng số 2 tiết'
    ],
    illustrationType: 'thcs-linear-equation',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Giới thiệu tên bài học, mục tiêu tiết học và vị trí mở đầu quan trọng của Chương I trong chương trình Toán 9.'
  });

  // =========================================================================
  // 3. SLIDE 3: ĐỊNH HƯỚNG MỤC TIÊU TIẾT 1 (Objectives Slide)
  // =========================================================================
  allSlides.push({
    id: `slide-3-objectives-${Date.now()}`,
    slideType: 'objectives',
    statusBadge: { label: 'ĐỊNH HƯỚNG', color: 'orange' },
    title: 'MỤC TIÊU TIẾT HỌC (YÊU CẦU CẦN ĐẠT)',
    phase: 'Định hướng',
    layout: 'key-takeaways',
    bullets: [],
    numberedBoxes: [
      { 
        num: '01', 
        text: 'Nhận biết phương trình bậc nhất hai ẩn $ax + by = c$ ($a, b$ không đồng thời bằng 0) và xác định đúng các hệ số $a, b, c$.' 
      },
      { 
        num: '02', 
        text: 'Hiểu khái niệm nghiệm của phương trình bậc nhất hai ẩn; kiểm tra thành thạo một cặp số $(x_0; y_0)$ có là nghiệm hay không.' 
      },
      { 
        num: '03', 
        text: 'Nhận biết hệ hai phương trình bậc nhất hai ẩn và nghiệm của hệ hai phương trình bậc nhất hai ẩn.' 
      },
      { 
        num: '04', 
        text: 'Hiểu ý nghĩa hình học của nghiệm phương trình trên mặt phẳng tọa độ $Oxy$ và mô hình hóa bài toán thực tế.' 
      }
    ],
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Giáo viên nêu rõ 4 mục tiêu yêu cầu cần đạt bám sát chương trình GDPT 2018 và SGK Toán 9.'
  });

  // =========================================================================
  // 4. SLIDE 4: HÀNH TRÌNH KHÁM PHÁ (Agenda Slide - 5 Trạm)
  // =========================================================================
  allSlides.push({
    id: `slide-4-agenda-${Date.now()}`,
    slideType: 'agenda',
    statusBadge: { label: 'LỘ TRÌNH', color: 'orange' },
    title: 'HÀNH TRÌNH KHÁM PHÁ BÀI HỌC',
    phase: 'Lộ trình',
    layout: 'key-takeaways',
    bullets: [],
    numberedBoxes: [
      { num: '01', text: 'Khởi động: Tình huống thực tiễn tính tiền vé tham quan dã ngoại' },
      { num: '02', text: 'Khám phá 1: Khái niệm phương trình bậc nhất hai ẩn & Nghiệm' },
      { num: '03', text: 'Khám phá 2: Khái niệm hệ hai phương trình bậc nhất hai ẩn & Ý nghĩa hình học' },
      { num: '04', text: 'Luyện tập & AI Lab: Bài toán dân gian "Vừa gà vừa chó" & Mô phỏng GeoGebra' },
      { num: '05', text: 'Về đích: Game show Hộp quà may mắn & Phiếu kiểm tra Exit Ticket' }
    ],
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Giới thiệu sơ đồ 5 trạm học tập giúp học sinh chủ động nắm bắt tiến trình làm việc.'
  });

  // =========================================================================
  // 5. SLIDE 5: KHỞI ĐỘNG (Tình huống thực tế)
  // =========================================================================
  allSlides.push({
    id: `slide-5-warmup-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'KHỞI ĐỘNG', color: 'orange' },
    title: 'HĐ1 • TÌNH HUỐNG THỰC TẾ: MUA VÉ THAM QUAN',
    subtitle: 'Xuất phát từ nhu cầu quản lý chi phí chuyến trải nghiệm của lớp',
    phase: 'Khởi động',
    layout: 'two-columns',
    bullets: [
      'Lớp 9A tổ chức đi tham quan khu di tích lịch sử.',
      'Giá vé người lớn là $50\\,000$ đồng/vé; giá vé học sinh là $30\\,000$ đồng/vé.',
      'Tổng số tiền mua vé cả đoàn hết $260\\,000$ đồng.',
      'Gọi $x$ là số vé người lớn, $y$ là số vé học sinh ($x, y \\in \\mathbb{N}^*$).'
    ],
    calloutBoxes: [
      {
        tag: 'THIẾT LẬP HỆ THỨC',
        tagColor: 'orange',
        text: 'Tổng số tiền mua vé được biểu thị bởi biểu thức:\n$$50\\,000x + 30\\,000y = 260\\,000$$\nChia cả hai vế cho $10\\,000$, ta thu được hệ thức tối giản:\n$$5x + 3y = 26$$'
      },
      {
        tag: 'CÂU HỎI GỢI MỞ',
        tagColor: 'green',
        text: 'Hệ thức $5x + 3y = 26$ có những đặc điểm gì?\n• Có bao nhiêu ẩn số?\n• Bậc của mỗi ẩn số là bao nhiêu?\n=> Đó chính là một PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN!'
      }
    ],
    bannerPrompt: 'Nếu mua 1 vé người lớn ($x=1$), cần mua bao nhiêu vé học sinh ($y$)? Có tìm được số nguyên không?',
    illustrationType: 'thcs-group-discussion',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Tổ chức cho học sinh thảo luận cặp đôi 2 phút, thiết lập hệ thức và nhận xét số ẩn và bậc của ẩn.'
  });

  // =========================================================================
  // 6. SLIDE 6: KHÁM PHÁ 1 - PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
  // =========================================================================
  allSlides.push({
    id: `slide-6-concept1-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'KIẾN THỨC MỚI', color: 'cyan' },
    title: '1. KHÁI NIỆM PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    subtitle: 'Định nghĩa chuẩn mực theo SGK Toán 9 Kết Nối Tri Thức',
    phase: 'Khám phá',
    layout: 'two-columns',
    bullets: [
      'Phương trình bậc nhất hai ẩn $x$ và $y$ là hệ thức dạng: $ax + by = c$.',
      'Trong đó: $x, y$ là các ẩn số; $a, b, c$ là các số đã cho.',
      'Điều kiện bắt buộc: $a$ và $b$ không đồng thời bằng 0 (nghĩa là $a^2 + b^2 \\ne 0$).'
    ],
    calloutBoxes: [
      {
        tag: 'ĐỊNH NGHĨA TỔNG QUÁT',
        tagColor: 'cyan',
        text: '$$ax + by = c$$\n• $a$: Hệ số của $x$\n• $b$: Hệ số của $y$\n• $c$: Hằng số tự do\n• Điều kiện: $a \\ne 0$ hoặc $b \\ne 0$'
      },
      {
        tag: 'VÍ DỤ NHẬN DIỆN',
        tagColor: 'green',
        text: '✓ $2x - 3y = 5$ (là pt bậc nhất 2 ẩn: $a=2, b=-3, c=5$)\n✓ $0x + 4y = 8$ (là pt bậc nhất 2 ẩn: $a=0, b=4, c=8$)\n✗ $x^2 + 2y = 1$ (KHÔNG PHẢI, vì $x$ có bậc 2)\n✗ $0x + 0y = 7$ (KHÔNG PHẢI, vì $a=b=0$)'
      }
    ],
    bannerPrompt: 'Ghi nhớ: Chỉ cần ÍT NHẤT một trong hai hệ số $a, b$ khác 0!',
    illustrationType: 'thcs-linear-equation',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Khắc sâu điều kiện a và b không đồng thời bằng 0 cho học sinh, lấy ví dụ cụ thể để học sinh nhận diện.'
  });

  // =========================================================================
  // 7. SLIDE 7: KHÁM PHÁ 1 (TIẾP) - NGHIỆM VÀ TẬP NGHIỆM
  // =========================================================================
  allSlides.push({
    id: `slide-7-roots-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'TRỌNG TÂM', color: 'orange' },
    title: 'NGHIỆM CỦA PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    subtitle: 'Cặp số $(x_0; y_0)$ thỏa mãn phương trình & Ý nghĩa hình học',
    phase: 'Khám phá',
    layout: 'two-columns',
    bullets: [
      'Cho phương trình bậc nhất hai ẩn $ax + by = c$.',
      'Nếu với $x = x_0$ và $y = y_0$, giá trị của vế trái bằng vế phải ($ax_0 + by_0 = c$) thì cặp số $(x_0; y_0)$ được gọi là một nghiệm của phương trình.',
      'Quy ước viết nghiệm: Viết $x$ trước, $y$ sau trong dấu ngoặc tròn: $(x_0; y_0)$.'
    ],
    calloutBoxes: [
      {
        tag: 'QUY TẮC XÁC ĐỊNH NGHIỆM',
        tagColor: 'cyan',
        text: 'Cặp số $(x_0; y_0)$ là một nghiệm của $ax + by = c$ $\\Leftrightarrow$ $ax_0 + by_0 = c$ là một đẳng thức đúng.\n\nVí dụ: Cặp $(1; 3)$ là nghiệm của $2x + y = 5$\nVì $2 \\cdot 1 + 3 = 5$ (đúng).'
      },
      {
        tag: 'ĐẶC ĐIỂM TẬP NGHIỆM',
        tagColor: 'purple',
        text: '• Phương trình bậc nhất hai ẩn luôn có VÔ SỐ NGHIỆM.\n• Trong mặt phẳng tọa độ $Oxy$, tập hợp các điểm biểu diễn các nghiệm của $ax + by = c$ là một ĐƯỜNG THẲNG $d$.'
      }
    ],
    bannerPrompt: 'Mỗi nghiệm $(x_0; y_0)$ tương ứng với tọa độ một điểm $M(x_0; y_0)$ trên mặt phẳng Oxy!',
    illustrationType: 'thcs-oxy-graph',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Nhấn mạnh sự khác biệt giữa phương trình một ẩn (thường có hữu hạn nghiệm) và phương trình hai ẩn (có vô số nghiệm).'
  });

  // =========================================================================
  // 8. SLIDE 8: TƯƠNG TÁC TRỰC TIẾP (Interactive Widget: Thử tài kiểm tra nghiệm)
  // =========================================================================
  allSlides.push({
    id: `slide-8-interactive-check-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'TƯƠNG TÁC TRỰC TIẾP', color: 'green' },
    title: 'HOẠT ĐỘNG THỰC HÀNH: KIỂM TRA NGHIỆM CỦA $2x + y = 5$',
    subtitle: 'Thầy cô và các em học sinh có thể trực tiếp nhập số kiểm tra ngay trên slide!',
    phase: 'Luyện tập',
    layout: 'two-columns',
    bullets: [
      'Xét phương trình: $2x + y = 5$.',
      'Nhiệm vụ: Hãy kiểm tra các cặp số sau có phải là nghiệm của phương trình hay không:',
      '1) Cặp $(1; 3)$: Thay $x=1, y=3$ vào vế trái: $2(1) + 3 = 5$ (Là nghiệm).',
      '2) Cặp $(2; 2)$: Thay $x=2, y=2$ vào vế trái: $2(2) + 2 = 6 \\ne 5$ (Không là nghiệm).',
      '3) Cặp $(0; 5)$: Thay $x=0, y=5$ vào vế trái: $2(0) + 5 = 5$ (Là nghiệm).'
    ],
    calloutBoxes: [
      {
        tag: 'CÔNG CỤ TƯƠNG TÁC SỐ',
        tagColor: 'green',
        text: 'Sử dụng bộ công cụ bên phải để thay đổi các giá trị $(x; y)$ và quan sát ngay kết quả tính toán tự động.'
      },
      {
        tag: 'GHI CHÚ HÌNH HỌC',
        tagColor: 'cyan',
        text: 'Các điểm $(1; 3)$ và $(0; 5)$ nằm trên đường thẳng $y = -2x + 5$.\nĐiểm $(2; 2)$ nằm ngoài đường thẳng này!'
      }
    ],
    interactiveWidget: 'check-equation-root',
    illustrationType: 'thcs-group-discussion',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Mời học sinh lên bảng bấm thử các giá trị x, y khác nhau trên màn hình tương tác để kiểm chứng.'
  });

  // =========================================================================
  // 9. SLIDE 9: KHÁM PHÁ 2 - HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
  // =========================================================================
  allSlides.push({
    id: `slide-9-system-concept-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'KIẾN THỨC MỚI', color: 'cyan' },
    title: '2. KHÁI NIỆM HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    subtitle: 'Khi hai điều kiện bậc nhất đồng thời cùng xảy ra',
    phase: 'Khám phá',
    layout: 'two-columns',
    bullets: [
      'Hệ hai phương trình bậc nhất hai ẩn có dạng tổng quát:',
      '$$\\begin{cases} a_1x + b_1y = c_1 \\\\ a_2x + b_2y = c_2 \\end{cases}$$',
      'Trong đó: $x, y$ là ẩn số; các hệ số thỏa mãn $a_1^2 + b_1^2 \\ne 0$ và $a_2^2 + b_2^2 \\ne 0$.',
      'Nghiệm của hệ: Cặp số $(x_0; y_0)$ đồng thời là nghiệm của cả hai phương trình.'
    ],
    calloutBoxes: [
      {
        tag: 'ĐỊNH NGHĨA HỆ PHƯƠNG TRÌNH',
        tagColor: 'cyan',
        text: '$$\\begin{cases} a_1x + b_1y = c_1 \\\\ a_2x + b_2y = c_2 \\end{cases}$$\nCặp số $(x_0; y_0)$ là một nghiệm của hệ khi và chỉ khi:\n$$\\begin{cases} a_1x_0 + b_1y_0 = c_1 \\\\ a_2x_0 + b_2y_0 = c_2 \\end{cases}$$ đều là các khẳng định đúng.'
      },
      {
        tag: 'VÍ DỤ MINH HỌA',
        tagColor: 'orange',
        text: 'Xét hệ phương trình: $\\begin{cases} 2x - y = 1 \\\\ x + y = 5 \\end{cases}$\n• Kiểm tra cặp $(2; 3)$:\n$2(2) - 3 = 1$ (Đúng)\n$2 + 3 = 5$ (Đúng)\n=> Cặp $(2; 3)$ là một nghiệm của hệ!'
      }
    ],
    bannerPrompt: 'Để là nghiệm của hệ, cặp số phải thỏa mãn ĐỒNG THỜI cả hai phương trình!',
    illustrationType: 'thcs-linear-equation',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Nhấn mạnh từ khóa "đồng thời" - thỏa mãn 1 phương trình thôi thì chưa đủ để là nghiệm của hệ.'
  });

  // =========================================================================
  // 10. SLIDE 10: Ý NGHĨA HÌNH HỌC CỦA HỆ PHƯƠNG TRÌNH
  // =========================================================================
  allSlides.push({
    id: `slide-10-geometry-meaning-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'Ý NGHĨA HÌNH HỌC', color: 'purple' },
    title: 'Ý NGHĨA HÌNH HỌC CỦA HỆ PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    subtitle: 'Mối quan hệ giữa số nghiệm của hệ và vị trí tương đối của hai đường thẳng',
    phase: 'Khám phá',
    layout: 'two-columns',
    bullets: [
      'Mỗi phương trình trong hệ biểu diễn một đường thẳng trên mặt phẳng tọa độ $Oxy$:',
      '$(d_1): a_1x + b_1y = c_1$ và $(d_2): a_2x + b_2y = c_2$.',
      'Số nghiệm của hệ chính là số điểm chung của hai đường thẳng $(d_1)$ và $(d_2)$!'
    ],
    calloutBoxes: [
      {
        tag: '3 VỊ TRÍ TƯƠNG ĐỐI',
        tagColor: 'cyan',
        text: '1. $(d_1)$ cắt $(d_2)$ tại 1 điểm $M(x_0; y_0)$:\n   $\\Leftrightarrow$ Hệ có NGHIỆM DUY NHẤT.\n2. $(d_1)$ song song với $(d_2)$:\n   $\\Leftrightarrow$ Hệ VÔ NGHIỆM.\n3. $(d_1)$ trùng với $(d_2)$:\n   $\\Leftrightarrow$ Hệ có VÔ SỐ NGHIỆM.'
      },
      {
        tag: 'TRỰC QUAN HÓA TOÁN HỌC',
        tagColor: 'green',
        text: 'Nghiệm duy nhất $(2; 3)$ của hệ $\\begin{cases} 2x - y = 1 \\\\ x + y = 5 \\end{cases}$ chính là tọa độ giao điểm $M(2; 3)$ của hai đường thẳng trên đồ thị!'
      }
    ],
    interactiveWidget: 'graph-intersection',
    illustrationType: 'thcs-oxy-graph',
    bannerPrompt: 'Tìm nghiệm của hệ phương trình chính là tìm tọa độ giao điểm của hai đường thẳng!',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Liên hệ giữa đại số (giải hệ) và hình học (vị trí tương đối của hai đường thẳng).'
  });

  // =========================================================================
  // 11. SLIDE 11: LUYỆN TẬP - BÀI TOÁN DÂN GIAN VỪA GÀ VỪA CHÓ
  // =========================================================================
  allSlides.push({
    id: `slide-11-folk-problem-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'LUYỆN TẬP', color: 'orange' },
    title: 'BÀI TOÁN CỔ TRUYỀN: "VỪA GÀ VỪA CHÓ"',
    subtitle: 'Mô hình hóa bài toán dân gian Việt Nam bằng hệ hai phương trình bậc nhất hai ẩn',
    phase: 'Luyện tập',
    layout: 'two-columns',
    bullets: [
      '"Vừa gà vừa chó / Bó lại cho tròn / Ba mươi sáu con / Một trăm chân chẵn".',
      'Hỏi có bao nhiêu con gà và bao nhiêu con chó?',
      'Gọi $x$ là số con gà, $y$ là số con chó ($x, y \\in \\mathbb{N}^*$, $x, y < 36$).'
    ],
    calloutBoxes: [
      {
        tag: 'THIẾT LẬP HỆ PHƯƠNG TRÌNH',
        tagColor: 'orange',
        text: '• Tổng số con là 36: $x + y = 36$\n• Gà có 2 chân, chó có 4 chân, tổng số chân là 100:\n  $2x + 4y = 100$\n\nTa có hệ phương trình:\n$$\\begin{cases} x + y = 36 \\\\ 2x + 4y = 100 \\end{cases}$$'
      },
      {
        tag: 'KIỂM CHỨNG NGHIỆM',
        tagColor: 'green',
        text: 'Kiểm tra cặp số $(x; y) = (22; 14)$:\n• $22 + 14 = 36$ (Đúng)\n• $2(22) + 4(14) = 44 + 56 = 100$ (Đúng)\n\nKết luận: Có 22 con gà và 14 con chó!'
      }
    ],
    stepByStep: [
      { step: 1, title: 'Bước 1: Chọn ẩn số và điều kiện', content: 'Gọi số gà là $x$, số chó là $y$ ($x, y \\in \\mathbb{N}^*$ và $x, y < 36$).' },
      { step: 2, title: 'Bước 2: Lập hệ phương trình', content: 'Từ giả thiết có hệ: $\\begin{cases} x + y = 36 \\\\ 2x + 4y = 100 \\end{cases}$' },
      { step: 3, title: 'Bước 3: Kiểm tra và kết luận', content: 'Cặp $(22; 14)$ thỏa mãn cả hai phương trình. Vậy có 22 con gà và 14 con chó.' }
    ],
    activeStepIndex: 0,
    bannerPrompt: 'Bấm nút "Xem bước tiếp theo" để hướng dẫn học sinh phân tích từng bước chặt chẽ!',
    illustrationType: 'thcs-group-discussion',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Khích lệ học sinh phát biểu, sử dụng tính năng Step-by-Step để mở từng bước lời giải sư phạm.'
  });

  // =========================================================================
  // 12. SLIDE 12: AI LAB & NĂNG LỰC SỐ THEO QĐ 2422
  // =========================================================================
  allSlides.push({
    id: `slide-12-ai-lab-${Date.now()}`,
    slideType: 'ai-lab',
    statusBadge: { label: 'NLS / AI LAB', color: 'purple' },
    title: 'AI LAB • TRỰC QUAN HÓA TOÁN HỌC & KIỂM CHỨNG CÓ TRÁCH NHIỆM',
    subtitle: 'Tích hợp Năng lực số 5.3.NC1a và Trí tuệ nhân tạo có kiểm chứng sư phạm',
    phase: 'Vận dụng',
    layout: 'content-split',
    bullets: [
      'Sử dụng GeoGebra / Desmos vẽ hai đường thẳng $d_1$ và $d_2$ để tìm nhanh giao điểm.',
      'Đặt câu hỏi thông minh cho AI: "Hãy phân tích bài toán thực tế đưa về hệ phương trình bậc nhất hai ẩn".',
      'Nguyên tắc vàng: Luôn dùng MTCT Casio fx-580VNX và công thức toán học để đối chứng, không sao chép mù quáng.'
    ],
    calloutBoxes: [
      {
        tag: 'GEOGEBRA / DESMOS',
        tagColor: 'cyan',
        text: 'Nhập trực tiếp hai hàm số $2x - y = 1$ và $x + y = 5$ vào ô lệnh. Phần mềm tự động xác định giao điểm $A(2, 3)$ tức thì.'
      },
      {
        tag: 'QĐ 2422 BỘ GD&ĐT',
        tagColor: 'purple',
        text: 'Mã năng lực 9.A3.1: Học sinh biết dùng công nghệ số và AI để tìm kiếm tình huống mô hình hóa, đồng thời rèn luyện tư duy phản biện.'
      }
    ],
    numberedBoxes: [
      { num: '01', text: 'Nhập phương trình vào phần mềm đồ thị số (GeoGebra/Desmos)' },
      { num: '02', text: 'Quan sát giao điểm và đọc tọa độ $(x; y)$ trực quan' },
      { num: '03', text: 'Dùng máy tính Casio fx-580 bấm MODE 9 - 1 - 2 đối chiếu' },
      { num: '04', text: 'Đánh giá độ tin cậy và ghi nhận kết luận chính xác vào vở' }
    ],
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Hướng dẫn học sinh thao tác phần mềm toán học, nhấn mạnh kỹ năng kiểm chứng có trách nhiệm.'
  });

  // =========================================================================
  // 13. SLIDE 13: EXIT TICKET (Phiếu ra về 3 câu)
  // =========================================================================
  allSlides.push({
    id: `slide-13-exit-ticket-${Date.now()}`,
    slideType: 'content-split',
    statusBadge: { label: 'ĐÁNH GIÁ', color: 'orange' },
    title: 'EXIT TICKET • PHIẾU TỰ ĐÁNH GIÁ RA VỀ',
    subtitle: '3 phút tự kiểm tra mức độ nắm vững bài học trước khi kết thúc tiết 1',
    phase: 'Củng cố',
    layout: 'two-columns',
    bullets: [
      '1) Phương trình $0x + 0y = 3$ có phải là phương trình bậc nhất hai ẩn không? Vì sao?',
      '2) Cho phương trình $3x - y = 4$. Cặp số $(2; 2)$ có phải là nghiệm không?',
      '3) Hệ hai phương trình bậc nhất hai ẩn có thể có bao nhiêu nghiệm?'
    ],
    calloutBoxes: [
      {
        tag: 'PHIẾU HỌC TẬP NHANH',
        tagColor: 'orange',
        text: 'Các em ghi nhanh câu trả lời vào góc cuối vở ghi hoặc phiếu học tập số 1.'
      },
      {
        tag: 'ĐÁP ÁN CHUẨN XÁC',
        tagColor: 'green',
        text: '1) Không phải (vì $a=0$ và $b=0$, vi phạm điều kiện $a^2+b^2 \\ne 0$).\n2) Có! Vì $3(2) - 2 = 6 - 2 = 4$ (Đúng).\n3) Có 3 khả năng: Có 1 nghiệm duy nhất, Vô nghiệm, hoặc Vô số nghiệm.'
      }
    ],
    bannerPrompt: 'Tự đánh giá: Em đã hoàn thành đúng mấy trên 3 câu hỏi trên?',
    illustrationType: 'thcs-student-hand',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Thu nhanh 5-6 phiếu kiểm tra của học sinh bất kỳ để đánh giá mức độ tiếp thu bài của lớp.'
  });

  // =========================================================================
  // 14. SLIDE 14: GAME SHOW "HỘP QUÀ MAY MẮN" (Lucky Gift Box)
  // =========================================================================
  allSlides.push({
    id: `slide-14-lucky-gift-${Date.now()}`,
    slideType: 'lucky-gift',
    title: 'GAME SHOW: HỘP QUÀ TOÁN HỌC MAY MẮN',
    subtitle: 'Chọn hộp quà – Trả lời câu hỏi tương tác – Nhận phần thưởng xứng đáng!',
    phase: 'Luyện tập',
    layout: 'quiz',
    bullets: [
      'Hộp 1 (Đỏ): Câu hỏi Nhận biết 1 - Quà: Ngôi sao chăm chỉ 🌟',
      'Hộp 2 (Xanh lam): Câu hỏi Nhận biết 2 - Quà: Huy hiệu khám phá 🏅',
      'Hộp 3 (Xanh lục): Câu hỏi Nhận biết 3 - Quà: Sticker toán học 🎯',
      'Hộp 4 (Tím): Câu hỏi Thông hiểu - Quà: Điểm 10 xuất sắc 🎁'
    ],
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Kích hoạt trò chơi tương tác cuối tiết học, mời các tổ trưởng hoặc học sinh xung phong chọn hộp quà.'
  });

  // =========================================================================
  // 15. SLIDE 15: CÂU HỎI TRẮC NGHIỆM 1 (NB 1 - Hộp Đỏ)
  // =========================================================================
  allSlides.push({
    id: `slide-15-quiz1-${Date.now()}`,
    slideType: 'interactive-quiz',
    statusBadge: { label: 'HỘP QUÀ 1', color: 'orange' },
    title: 'CÂU 1 (NB 1) • NHẬN DIỆN PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
    phase: 'Luyện tập',
    layout: 'quiz',
    bullets: [],
    giftQuiz: {
      questionNumber: 1,
      level: 'NB 1',
      question: 'Trong các phương trình sau, phương trình nào là phương trình bậc nhất hai ẩn?',
      options: [
        { key: 'A', text: '$2x^2 + 3y = 5$' },
        { key: 'B', text: '$3x - 5y = 7$' },
        { key: 'C', text: '$xy + 2 = 0$' },
        { key: 'D', text: '$0x + 0y = 4$' }
      ],
      correctKey: 'B',
      reward: 'Ngôi sao chăm chỉ 🌟',
      explanation: 'Đáp án B chính xác! Phương trình $3x - 5y = 7$ có dạng $ax + by = c$ với $a = 3 \\ne 0, b = -5 \\ne 0, c = 7$. Phương án A có bậc 2; phương án C có tích $xy$ (bậc 2); phương án D có $a=b=0$.'
    },
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Nhắc nhở học sinh đối chiếu với dạng tổng quát ax + by = c với a hoặc b khác 0.'
  });

  // =========================================================================
  // 16. SLIDE 16: CÂU HỎI TRẮC NGHIỆM 2 (NB 2 - Hộp Xanh Lam)
  // =========================================================================
  allSlides.push({
    id: `slide-16-quiz2-${Date.now()}`,
    slideType: 'interactive-quiz',
    statusBadge: { label: 'HỘP QUÀ 2', color: 'cyan' },
    title: 'CÂU 2 (NB 2) • KIỂM TRA NGHIỆM CỦA PHƯƠNG TRÌNH',
    phase: 'Luyện tập',
    layout: 'quiz',
    bullets: [],
    giftQuiz: {
      questionNumber: 2,
      level: 'NB 2',
      question: 'Cặp số nào sau đây là một nghiệm của phương trình $2x + y = 5$?',
      options: [
        { key: 'A', text: '$(1; 3)$' },
        { key: 'B', text: '$(2; 2)$' },
        { key: 'C', text: '$(3; 1)$' },
        { key: 'D', text: '$(0; 3)$' }
      ],
      correctKey: 'A',
      reward: 'Huy hiệu khám phá 🏅',
      explanation: 'Đáp án A chính xác! Thay $x = 1, y = 3$ vào vế trái ta có: $2(1) + 3 = 2 + 3 = 5$ (bằng vế phải). Các cặp số còn lại: $2(2)+2=6\\ne 5$; $2(3)+1=7\\ne 5$; $2(0)+3=3\\ne 5$.'
    },
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Học sinh bấm Casio hoặc tính nhẩm nhanh để tìm đáp án đúng trong vòng 30 giây.'
  });

  // =========================================================================
  // 17. SLIDE 17: CÂU HỎI TRẮC NGHIỆM 3 (NB 3 - Hộp Xanh Lục)
  // =========================================================================
  allSlides.push({
    id: `slide-17-quiz3-${Date.now()}`,
    slideType: 'interactive-quiz',
    statusBadge: { label: 'HỘP QUÀ 3', color: 'green' },
    title: 'CÂU 3 (NB 3) • KIỂM TRA NGHIỆM CỦA HỆ PHƯƠNG TRÌNH',
    phase: 'Luyện tập',
    layout: 'quiz',
    bullets: [],
    giftQuiz: {
      questionNumber: 3,
      level: 'NB 3',
      question: 'Cặp số $(2; 1)$ là nghiệm của hệ phương trình nào dưới đây?',
      options: [
        { key: 'A', text: '$\\begin{cases} x + y = 3 \\\\ 2x - y = 3 \\end{cases}$' },
        { key: 'B', text: '$\\begin{cases} x - y = 2 \\\\ x + 2y = 5 \\end{cases}$' },
        { key: 'C', text: '$\\begin{cases} 2x + y = 6 \\\\ x - y = 0 \\end{cases}$' },
        { key: 'D', text: '$\\begin{cases} x + y = 4 \\\\ 3x - y = 1 \\end{cases}$' }
      ],
      correctKey: 'A',
      reward: 'Sticker toán học 🎯',
      explanation: 'Đáp án A chính xác! Thay $(x; y) = (2; 1)$ vào hệ A ta có: $2 + 1 = 3$ (đúng) và $2(2) - 1 = 3$ (đúng). Do đó $(2; 1)$ đồng thời thỏa mãn cả hai phương trình của hệ.'
    },
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Nhấn mạnh: Nghiệm của hệ phải thỏa mãn ĐỒNG THỜI cả hai phương trình.'
  });

  // =========================================================================
  // 18. SLIDE 18: CÂU HỎI TRẮC NGHIỆM 4 (TH - Hộp Tím)
  // =========================================================================
  allSlides.push({
    id: `slide-18-quiz4-${Date.now()}`,
    slideType: 'interactive-quiz',
    statusBadge: { label: 'HỘP QUÀ 4', color: 'purple' },
    title: 'CÂU 4 (TH) • Ý NGHĨA HÌNH HỌC VÀ SỐ NGHIỆM CỦA HỆ',
    phase: 'Luyện tập',
    layout: 'quiz',
    bullets: [],
    giftQuiz: {
      questionNumber: 4,
      level: 'TH',
      question: 'Cho hệ phương trình $\\begin{cases} 2x - y = 1 \\\\ 4x - 2y = 5 \\end{cases}$. Nhận xét nào sau đây về số nghiệm của hệ là đúng?',
      options: [
        { key: 'A', text: 'Hệ có nghiệm duy nhất' },
        { key: 'B', text: 'Hệ vô nghiệm vì hai đường thẳng song song' },
        { key: 'C', text: 'Hệ có vô số nghiệm' },
        { key: 'D', text: 'Hệ có đúng 2 nghiệm' }
      ],
      correctKey: 'B',
      reward: 'Điểm 10 xuất sắc 🎁',
      explanation: 'Đáp án B chính xác! Viết lại phương trình: $d_1: y = 2x - 1$ và $d_2: y = 2x - 2.5$. Hai đường thẳng có cùng hệ số góc $k = 2$ và tung độ gốc khác nhau $(-1 \\ne -2.5)$ nên chúng SONG SONG với nhau. Do đó hệ phương trình VÔ NGHIỆM.'
    },
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Liên hệ kiến thức hàm số bậc nhất y = ax + b đã học ở lớp 8 và đầu năm lớp 9.'
  });

  // =========================================================================
  // 19. SLIDE 19: BẢNG TỔNG KẾT KẾT QUẢ THỬ THÁCH
  // =========================================================================
  allSlides.push({
    id: `slide-19-results-${Date.now()}`,
    slideType: 'quiz-results',
    title: 'BẢNG TỔNG KẾT KẾT QUẢ HỌC TẬP',
    subtitle: 'Tuyên dương tinh thần học tập tích cực, sáng tạo của lớp!',
    phase: 'Tổng kết',
    layout: 'content-split',
    bullets: [
      'Nắm vững định nghĩa phương trình bậc nhất hai ẩn $ax + by = c$',
      'Kiểm tra thành thạo nghiệm của phương trình và hệ hai phương trình',
      'Hiểu bản chất hình học: Giao điểm của hai đường thẳng trên mặt phẳng $Oxy$'
    ],
    calloutBoxes: [
      {
        tag: 'TUYÊN DƯƠNG',
        tagColor: 'green',
        text: 'Chúc mừng cả lớp đã xuất sắc hoàn thành trọn vẹn 4 thử thách của Game Show Hộp quà may mắn!'
      },
      {
        tag: 'ĐIỂM SỐ CỘNG THƯỞNG',
        tagColor: 'orange',
        text: 'Các bạn có câu trả lời đúng được cộng 1 điểm rèn luyện và 1 ngôi sao toán học vào sổ thi đua.'
      }
    ],
    illustrationType: 'classroom-students',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Giáo viên tổng kết thi đua giữa các tổ, ghi nhận sự tiến bộ của học sinh.'
  });

  // =========================================================================
  // 20. SLIDE 20: CẢM ƠN VÀ DẶN DÒ BÀI TẬP (Thank You Slide)
  // =========================================================================
  allSlides.push({
    id: `slide-20-thank-you-${Date.now()}`,
    slideType: 'thank-you',
    title: 'CẢM ƠN CÁC THẦY CÔ VÀ CÁC EM HỌC SINH!',
    subtitle: 'Chúc các em luôn yêu thích môn Toán và đạt nhiều kết quả cao!',
    phase: 'Kết thúc',
    layout: 'content-left-image-right',
    bullets: [
      'Ghi nhớ: Dạng phương trình $ax + by = c$ và cách kiểm tra cặp nghiệm $(x_0; y_0)$',
      'Làm bài tập: Bài 1.1, 1.2, 1.3 trang 11 SGK Toán 9 (Tập 1)',
      'Chuẩn bị tiết 2: Cách giải hệ hai phương trình bằng phương pháp thế và phương pháp cộng đại số'
    ],
    illustrationType: 'thcs-linear-equation',
    schoolName: schoolCredit,
    teacherName: teacherCredit,
    notes: 'Dặn dò nhiệm vụ tự học về nhà và nội dung cần chuẩn bị cho Tiết 2.'
  });

  return allSlides.slice(0, targetCount);
}

export default generateStaticSlides;
