import { jsPDF } from 'jspdf';

/**
 * Generates an authentic high-resolution multi-page PDF for
 * KHBD_TOAN9_KNTT_TAP1_FULL_5_CHUONG_NEW_VIP_2026_2027_MUC_TIEU_CHUAN_PL1_PL3.pdf
 * (Pages 7, 8, 9) matching the exact pedagogical curriculum format.
 * Header: KHBD TOÁN 9-KNTT - TH NLS/AI NĂM HỌC 2026–2027
 * Clean of any hardcoded teacher or ministry overrides.
 */

function createPageCanvas(pageNumber: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  // A4 ratio: 210 x 297 mm -> 2x scale for crisp HD rendering (1680 x 2376)
  const width = 1680;
  const height = 2376;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Outer margin border
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Top Running Header (Standard format as requested: KHBD TOÁN 9-KNTT - TH NLS/AI NĂM HỌC 2026–2027)
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 26px "Times New Roman", Times, serif';
  ctx.fillText('KHBD TOÁN 9-KNTT - TH NLS/AI NĂM HỌC 2026–2027', 80, 95);

  ctx.fillStyle = '#64748b';
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Trang ${pageNumber} / 248`, width - 80, 95);
  ctx.textAlign = 'left';

  // Header separator line
  ctx.beginPath();
  ctx.moveTo(80, 115);
  ctx.lineTo(width - 80, 115);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 3;
  ctx.stroke();

  if (pageNumber === 7) {
    renderPage7Content(ctx, width);
  } else if (pageNumber === 8) {
    renderPage8Content(ctx, width);
  } else if (pageNumber === 9) {
    renderPage9Content(ctx, width);
  }

  // Footer separator & page number
  ctx.beginPath();
  ctx.moveTo(80, height - 100);
  ctx.lineTo(width - 80, height - 100);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 18px "Times New Roman", Times, serif';
  ctx.fillText('Kế hoạch bài dạy chuẩn Công văn 5512 & Phụ lục 1 - 3 • Toán 9 KNTT Tập 1', 80, height - 65);
  ctx.textAlign = 'right';
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.fillText(`- ${pageNumber} -`, width - 80, height - 65);
  ctx.textAlign = 'left';

  return canvas;
}

function renderPage7Content(ctx: CanvasRenderingContext2D, width: number) {
  let y = 180;

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 36px "Times New Roman", Times, serif';
  ctx.textAlign = 'center';
  ctx.fillText('BÀI 2: GIẢI HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN (TIẾT 2)', width / 2, y);
  
  y += 45;
  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'bold 24px "Times New Roman", Times, serif';
  ctx.fillText('Mục 2: Phương pháp cộng đại số (SGK Toán 9 KNTT Tập 1 - Trang 10, 11, 12)', width / 2, y);

  y += 38;
  ctx.fillStyle = '#475569';
  ctx.font = 'italic 21px "Times New Roman", Times, serif';
  ctx.fillText('Thời lượng thực hiện: Tiết 2 / 2 tiết (PPCT Tuần 2 - Phân môn Đại số: Tiết 6)', width / 2, y);
  ctx.textAlign = 'left';

  y += 60;
  // Section I: MỤC TIÊU DẠY HỌC
  drawSectionHeader(ctx, 'I. MỤC TIÊU DẠY HỌC (CHUẨN CÔNG VĂN 5512 & GDPT 2018)', y);
  y += 45;

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('1. Về kiến thức:', 80, y);
  y += 32;

  ctx.fillStyle = '#1e293b';
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  const k1 = [
    '• Hiểu được quy tắc cộng đại số và các bước giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp cộng đại số.',
    '• Vận dụng thành thạo phương pháp cộng đại số để giải hệ hai phương trình bậc nhất hai ẩn trong 2 trường hợp cốt lõi:',
    '    + TH1: Hệ số của cùng một ẩn bằng nhau (trừ từng vế) hoặc đối nhau (cộng từng vế) để triệt tiêu một ẩn.',
    '    + TH2: Hệ số của cùng một ẩn không bằng nhau và không đối nhau (nhân hai vế với số thích hợp để đưa về TH1).',
    '• Sử dụng máy tính cầm tay (MTCT Casio fx-580VN X / fx-880BTG) để kiểm tra nghiệm chính xác của hệ phương trình.'
  ];
  for (const line of k1) {
    ctx.fillText(line, 100, y);
    y += 34;
  }

  y += 15;
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('2. Về năng lực:', 80, y);
  y += 32;

  ctx.fillStyle = '#1e293b';
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  const n1 = [
    'a) Năng lực đặc thù toán học:',
    '  - Tư duy và lập luận toán học: So sánh hệ số của ẩn x, y để lựa chọn phương án cộng hay trừ triệt tiêu ẩn tối ưu.',
    '  - Giải quyết vấn đề toán học: Biến đổi tương đương đưa hệ hai phương trình về một phương trình bậc nhất một ẩn.',
    '  - Mô hình hóa toán học: Thiết lập hệ phương trình bậc nhất hai ẩn giải quyết bài toán mua sắm thực tế.',
    '  - Năng lực sử dụng công cụ toán học: Thao tác chính xác chức năng giải hệ phương trình trên MTCT (MENU 9 1 2).',
    'b) Năng lực chung: Tự chủ và tự học trong nghiên cứu SGK; giao tiếp và hợp tác nhóm khi thảo luận lời giải.'
  ];
  for (const line of n1) {
    ctx.fillText(line, 100, y);
    y += 34;
  }

  y += 15;
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('3. Về phẩm chất:', 80, y);
  y += 32;

  ctx.fillStyle = '#1e293b';
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  const p1 = [
    '• Chăm chỉ: Chủ động thực hiện các phép biến đổi đại số cẩn thận, chính xác, không ngại phép tính phân số.',
    '• Trung thực: Khách quan đối chiếu kết quả tìm được với nghiệm trên máy tính cầm tay và phiếu học tập nhóm bạn.',
    '• Trách nhiệm: Hỗ trợ thành viên trong nhóm giải quyết các trường hợp hệ số chứa dấu âm.'
  ];
  for (const line of p1) {
    ctx.fillText(line, 100, y);
    y += 34;
  }

  y += 25;
  // Section II: THIẾT BỊ DẠY HỌC
  drawSectionHeader(ctx, 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU', y);
  y += 45;

  ctx.fillStyle = '#1e293b';
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  ctx.fillText('1. Giáo viên: KHBD chuẩn CV 5512, Slide tương tác, Phiếu học tập số 1 (HĐ3) và Phiếu học tập số 2 (Luyện tập 2).', 100, y);
  y += 34;
  ctx.fillText('2. Học sinh: SGK Toán 9 KNTT tập 1, vở ghi, máy tính cầm tay (Casio fx-580VN X/fx-880BTG), bút dạ viết bảng nhóm.', 100, y);

  y += 45;
  // Section III: TIẾN TRÌNH DẠY HỌC
  drawSectionHeader(ctx, 'III. TIẾN TRÌNH DẠY HỌC (HOẠT ĐỘNG 1: KHỞI ĐỘNG)', y);
  y += 42;

  ctx.fillStyle = '#1e293b';
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  ctx.fillText('a) Mục tiêu: Kích hoạt kiến thức về nghiệm hệ phương trình và tạo mâu thuẫn nhận thức khi dùng phương pháp thế.', 100, y);
  y += 32;
  ctx.fillText('b) Nội dung: GV yêu cầu HS giải hệ { 2x + 2y = 3, 2x - 3y = 1 } bằng phương pháp thế và nhận xét thời gian thực hiện.', 100, y);
  y += 32;
  ctx.fillText('c) Sản phẩm: HS nhận thấy các hệ số của x giống nhau (đều là 2), đặt câu hỏi có cách nào trừ triệt tiêu x ngay không?', 100, y);
  y += 32;
  ctx.fillText('d) Tổ chức thực hiện: Giao nhiệm vụ cá nhân (2 phút) -> HS phát biểu -> GV dẫn dắt vào bài học mới.', 100, y);
}

function renderPage8Content(ctx: CanvasRenderingContext2D, width: number) {
  let y = 170;

  drawSectionHeader(ctx, 'HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (MỤC 2: PHƯƠNG PHÁP CỘNG ĐẠI SỐ)', y);
  y += 50;

  // HĐ3 Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(80, y, width - 160, 480);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, y, width - 160, 480);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 23px "Times New Roman", Times, serif';
  ctx.fillText('HĐ3 (SGK Toán 9 KNTT - Trang 10): Xây dựng quy tắc cộng đại số', 105, y + 40);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  ctx.fillText('Cho hệ phương trình bậc nhất hai ẩn:', 105, y + 80);

  // System (I)
  drawEquationSystem(ctx, 450, y + 105, '2x + 2y = 3', '2x - 3y = 1', '(I)');

  ctx.fillText('• Câu a: Trừ từng vế hai phương trình của hệ (I) để nhận được phương trình một ẩn theo y:', 105, y + 185);
  
  ctx.fillStyle = '#1e40af';
  ctx.font = 'italic bold 21px "Times New Roman", Times, serif';
  ctx.fillText('          (2x + 2y) - (2x - 3y) = 3 - 1   <=>   5y = 2   <=>   y = 2/5 (0,4)', 105, y + 225);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  ctx.fillText('• Câu b: Thay y = 2/5 vào phương trình đầu tiên 2x + 2y = 3 để tìm giá trị của x:', 105, y + 275);

  ctx.fillStyle = '#1e40af';
  ctx.font = 'italic bold 21px "Times New Roman", Times, serif';
  ctx.fillText('          2x + 2.(2/5) = 3   <=>   2x = 3 - 4/5 = 11/5   <=>   x = 11/10 (1,1)', 105, y + 315);

  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 21px "Times New Roman", Times, serif';
  ctx.fillText('• Kết luận nghiệm: Hệ (I) có nghiệm duy nhất là (x; y) = (11/10; 2/5) hay (1,1; 0,4).', 105, y + 365);

  ctx.fillStyle = '#475569';
  ctx.font = 'italic 19px "Times New Roman", Times, serif';
  ctx.fillText('  * Kiểm tra MTCT Casio: Bấm MENU 9 1 2 -> Nhập hệ số [2, 2, 3] và [2, -3, 1] -> Máy báo x = 11/10; y = 2/5 (Khớp 100%).', 105, y + 410);

  y += 520;

  // Box quy tắc 2 trường hợp
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(80, y, width - 160, 480);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(80, y, width - 160, 480);

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 23px "Times New Roman", Times, serif';
  ctx.fillText('QUY TẮC CỘNG ĐẠI SỐ & 2 TRƯỜNG HỢP CỐT LÕI (CHUẨN SGK KNTT):', 105, y + 40);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 21px "Times New Roman", Times, serif';
  ctx.fillText('1. Trường hợp 1: Hệ số của cùng một ẩn bằng nhau hoặc đối nhau', 105, y + 85);

  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('   - Khi các hệ số của cùng một ẩn BẰNG NHAU: Ta trừ từng vế hai phương trình để triệt tiêu ẩn đó.', 105, y + 120);
  ctx.fillText('   - Khi các hệ số của cùng một ẩn ĐỐI NHAU: Ta cộng từng vế hai phương trình để triệt tiêu ẩn đó.', 105, y + 155);

  ctx.font = 'bold 21px "Times New Roman", Times, serif';
  ctx.fillText('2. Trường hợp 2: Hệ số của cùng một ẩn không bằng nhau và không đối nhau', 105, y + 210);

  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('   - Nhân hai vế của mỗi phương trình với một số thích hợp (thường là BCNN của các hệ số) sao cho', 105, y + 245);
  ctx.fillText('     các hệ số của một ẩn trong hệ mới trở nên bằng nhau hoặc đối nhau.', 105, y + 280);
  ctx.fillText('   - Áp dụng quy tắc Trường hợp 1 để giải hệ phương trình vừa nhận được.', 105, y + 315);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 21px "Times New Roman", Times, serif';
  ctx.fillText('3. Các bước tóm tắt thực hiện:', 105, y + 370);
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('   Bước 1: Nhân các hệ số (nếu cần) -> Bước 2: Cộng hoặc trừ từng vế -> Bước 3: Giải pt 1 ẩn -> Bước 4: Tìm ẩn còn lại & Kết luận.', 105, y + 405);

  y += 530;
  // Ví dụ mẫu 2
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('VÍ DỤ 2 (SGK KNTT - Trang 11): Giải hệ phương trình { 3x + 2y = 7, 2x + 3y = 3 }', 80, y);
  y += 35;
  ctx.fillStyle = '#1e293b';
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('Lời giải: Nhân hai vế phương trình thứ nhất với 2 và nhân hai vế phương trình thứ hai với 3 ta được hệ mới:', 100, y);
  y += 35;
  drawEquationSystem(ctx, 400, y, '6x + 4y = 14', '6x + 9y = 9', '');
  y += 75;
  ctx.fillText('Trừ từng vế hai phương trình: -5y = 5 <=> y = -1. Thay y = -1 vào 3x + 2y = 7 => 3x = 9 <=> x = 3.', 100, y);
  y += 32;
  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.fillText('Vậy nghiệm của hệ phương trình là (x; y) = (3; -1).', 100, y);
}

function renderPage9Content(ctx: CanvasRenderingContext2D, width: number) {
  let y = 170;

  drawSectionHeader(ctx, 'HOẠT ĐỘNG 3: LUYỆN TẬP VÀ VẬN DỤNG KIẾN THỨC (TRANG 9 / 248)', y);
  y += 50;

  // Luyện tập 2 Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(80, y, width - 160, 480);
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, y, width - 160, 480);

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 23px "Times New Roman", Times, serif';
  ctx.fillText('LUYỆN TẬP 2 (SGK Toán 9 KNTT Tập 1 - Trang 11):', 105, y + 40);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 21px "Times New Roman", Times, serif';
  ctx.fillText('Đề bài: Giải các hệ phương trình sau bằng phương pháp cộng đại số:', 105, y + 80);

  // Câu a
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.fillText('a)', 105, y + 130);
  drawEquationSystem(ctx, 160, y + 105, '3x + 2y = 6', '2x - 2y = 14', '(a)');

  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('Giải: Nhận thấy hệ số của y đối nhau (+2 và -2).', 500, y + 125);
  ctx.fillText('Cộng từng vế hai phương trình:', 500, y + 160);
  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'italic bold 20px "Times New Roman", Times, serif';
  ctx.fillText('5x = 20 <=> x = 4.', 780, y + 160);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('Thay x = 4 vào (1): 3.(4) + 2y = 6 <=> 2y = -6 <=> y = -3.', 500, y + 195);
  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.fillText('=> Nghiệm của hệ (a) là (x; y) = (4; -3).', 500, y + 230);

  // Divider
  ctx.beginPath();
  ctx.moveTo(105, y + 260);
  ctx.lineTo(width - 105, y + 260);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Câu b
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.fillText('b)', 105, y + 310);
  drawEquationSystem(ctx, 160, y + 285, '0,3x + 0,5y = 3', '1,5x - 2y = 1,5', '(b)');

  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('Giải: Nhân hai vế pt thứ nhất với 4 và pt thứ hai với 1 ta có hệ:', 500, y + 305);
  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'italic 19px "Times New Roman", Times, serif';
  ctx.fillText('{ 1,2x + 2y = 12 ; 1,5x - 2y = 1,5 }', 500, y + 340);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('Cộng từng vế: 2,7x = 13,5 <=> x = 5. Thay x = 5 => y = 3.', 500, y + 375);
  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.fillText('=> Nghiệm của hệ (b) là (x; y) = (5; 3).', 500, y + 410);

  y += 520;

  // VẬN DỤNG 2
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(80, y, width - 160, 460);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, y, width - 160, 460);

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 23px "Times New Roman", Times, serif';
  ctx.fillText('VẬN DỤNG 2 (SGK Toán 9 KNTT - Trang 12): Bài toán mua bánh mì thực tế', 105, y + 40);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('Bài toán: Bạn Nam mua 2 chiếc bánh mì xúc xích và 3 chiếc bánh bao hết 75.000 đồng.', 105, y + 80);
  ctx.fillText('Bạn Bình mua 3 chiếc bánh mì xúc xích và 2 chiếc bánh bao cùng loại hết 70.000 đồng.', 105, y + 115);
  ctx.fillText('Tính giá tiền của mỗi chiếc bánh mì xúc xích và mỗi chiếc bánh bao.', 105, y + 150);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.fillText('Hướng dẫn giải & Thiết lập mô hình toán học:', 105, y + 195);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('Gọi giá tiền một chiếc bánh mì xúc xích là x (đồng) và một chiếc bánh bao là y (đồng) (x, y > 0).', 105, y + 230);
  ctx.fillText('Theo bài ra ta có hệ phương trình:', 105, y + 265);

  drawEquationSystem(ctx, 400, y + 275, '2x + 3y = 75000', '3x + 2y = 70000', '');

  ctx.fillText('Nhân pt (1) với 3 và pt (2) với 2: { 6x + 9y = 225000, 6x + 4y = 140000 }.', 105, y + 360);
  ctx.fillText('Trừ từng vế hai phương trình: 5y = 85000 <=> y = 17000 (đồng).', 105, y + 395);
  ctx.fillText('Thay y = 17000 vào pt (1): 2x + 3.(17000) = 75000 <=> 2x = 24000 <=> x = 12000 (đồng).', 105, y + 425);

  y += 490;
  // BẢNG TIẾN TRÌNH SƯ PHẠM 4 BƯỚC CV 5512
  drawSectionHeader(ctx, 'HOẠT ĐỘNG 4: HƯỚNG DẪN TỰ HỌC & GIAO NHIỆM VỤ VỀ NHÀ', y);
  y += 45;
  ctx.fillStyle = '#1e293b';
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  ctx.fillText('1. Ghi nhớ quy tắc cộng đại số (TH1: cùng hệ số trừ, đối hệ số cộng; TH2: nhân chéo hệ số đưa về TH1).', 100, y);
  y += 32;
  ctx.fillText('2. Hoàn thành Bài tập 1.6, 1.7, 1.8 (SGK Toán 9 KNTT tập 1 - Trang 12) vào vở bài tập.', 100, y);
  y += 32;
  ctx.fillText('3. Thực hành kiểm tra nghiệm tất cả các hệ phương trình đã giải bằng máy tính Casio fx-580VN X.', 100, y);
}

function drawSectionHeader(ctx: CanvasRenderingContext2D, title: string, y: number) {
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText(title, 80, y);

  ctx.beginPath();
  ctx.moveTo(80, y + 10);
  ctx.lineTo(80 + ctx.measureText(title).width + 30, y + 10);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawEquationSystem(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  eq1: string, 
  eq2: string, 
  label: string
) {
  // Draw large left brace {
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  // top curve
  ctx.moveTo(x + 10, y);
  ctx.quadraticCurveTo(x, y, x, y + 15);
  // line to middle
  ctx.lineTo(x, y + 22);
  // middle point
  ctx.quadraticCurveTo(x, y + 30, x - 8, y + 30);
  ctx.quadraticCurveTo(x, y + 30, x, y + 38);
  // line to bottom
  ctx.lineTo(x, y + 45);
  // bottom curve
  ctx.quadraticCurveTo(x, y + 60, x + 10, y + 60);
  ctx.stroke();

  // Equations
  ctx.fillStyle = '#0f172a';
  ctx.font = 'italic bold 21px "Times New Roman", Times, serif';
  ctx.fillText(eq1, x + 20, y + 22);
  ctx.fillText(eq2, x + 20, y + 52);

  if (label) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'normal 19px "Times New Roman", Times, serif';
    ctx.fillText(label, x + Math.max(ctx.measureText(eq1).width, ctx.measureText(eq2).width) + 35, y + 38);
  }
}

/**
 * Builds and returns a valid Base64 dataUrl string representing the 3-page PDF.
 */
export function generateSampleVIPMathPDF(): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pages = [7, 8, 9];

  pages.forEach((pageNum, index) => {
    if (index > 0) {
      doc.addPage('a4', 'portrait');
    }

    const canvas = createPageCanvas(pageNum);
    const imgData = canvas.toDataURL('image/png', 0.95);
    doc.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  });

  return doc.output('datauristring');
}

function drawSimpleTable(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  colWidths: number[],
  headers: string[],
  rows: string[][]
): number {
  let y = startY;
  const totalW = colWidths.reduce((a, b) => a + b, 0);

  // Header row
  const headerHeight = 55;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(startX, y, totalW, headerHeight);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(startX, y, totalW, headerHeight);

  let curX = startX;
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 20px "Times New Roman", Times, serif';
  ctx.textAlign = 'center';

  headers.forEach((h, i) => {
    ctx.strokeRect(curX, y, colWidths[i], headerHeight);
    const lines = h.split('\n');
    if (lines.length > 1) {
      ctx.fillText(lines[0], curX + colWidths[i] / 2, y + 24);
      ctx.fillText(lines[1], curX + colWidths[i] / 2, y + 46);
    } else {
      ctx.fillText(h, curX + colWidths[i] / 2, y + 35);
    }
    curX += colWidths[i];
  });
  y += headerHeight;

  // Data rows
  ctx.font = 'normal 20px "Times New Roman", Times, serif';
  rows.forEach((row) => {
    const rowHeight = 48;
    ctx.strokeRect(startX, y, totalW, rowHeight);
    let rx = startX;
    row.forEach((cell, ci) => {
      ctx.strokeRect(rx, y, colWidths[ci], rowHeight);
      if (ci === 0 || ci === 2) {
        ctx.textAlign = 'center';
        ctx.fillText(cell, rx + colWidths[ci] / 2, y + 32);
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(cell, rx + 15, y + 32);
      }
      rx += colWidths[ci];
    });
    y += rowHeight;
  });

  return y;
}

function createAIKHDHPage1Canvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const width = 1680;
  const height = 2376;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Top header left (Image 2)
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px "Times New Roman", Times, serif';
  ctx.textAlign = 'center';
  ctx.fillText('UBND PHƯỜNG BẾN TRE', 350, 120);
  ctx.fillText('TRƯỜNG THCS MỸ HÓA', 350, 155);

  // Top header right
  ctx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', width - 420, 120);
  ctx.fillText('Độc lập – Tự do – Hạnh phúc', width - 420, 155);
  ctx.beginPath();
  ctx.moveTo(width - 520, 170);
  ctx.lineTo(width - 320, 170);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Main Title
  ctx.font = 'bold 34px "Times New Roman", Times, serif';
  ctx.fillText('PHÂN PHỐI CHƯƠNG TRÌNH MÔN TOÁN 9', width / 2, 260);
  ctx.font = 'bold 24px "Times New Roman", Times, serif';
  ctx.fillText('ÁP DỤNG TỪ NĂM HỌC 2026-2027', width / 2, 305);

  ctx.textAlign = 'left';
  let y = 380;
  ctx.font = 'bold 24px "Times New Roman", Times, serif';
  ctx.fillText('I. ĐẶC ĐIỂM TÌNH HÌNH', 120, y);
  y += 45;

  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('1. Số lớp: ', 120, y);
  ctx.font = 'normal 22px "Times New Roman", Times, serif';
  ctx.fillText('11;  Số học sinh:', 225, y);
  y += 45;

  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('2. Tình hình đội ngũ:', 120, y);
  y += 35;
  ctx.font = 'normal 21px "Times New Roman", Times, serif';
  ctx.fillText('Số giáo viên: 03 giáo viên;', 150, y);
  y += 32;
  ctx.fillText('Trình độ đào tạo: Cao đẳng 00 giáo viên; Đại học: 02 giáo viên; trên đại học: 01 giáo viên.', 150, y);
  y += 32;
  ctx.fillText('Mức đạt chuẩn nghề nghiệp giáo viên: Tốt: 02 giáo viên; Khá: 01 giáo viên; Đạt: 00 giáo viên; Chưa đạt: 00 giáo viên.', 150, y);
  y += 50;

  // 3. Thiết bị dạy học
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('3. Thiết bị dạy học: ', 120, y);
  ctx.font = 'italic 20px "Times New Roman", Times, serif';
  ctx.fillText('(Trình bày cụ thể các thiết bị dạy học có thể sử dụng để tổ chức dạy học môn học/hoạt động giáo dục)', 310, y);
  y += 35;

  const cols1 = [80, 520, 140, 500, 200];
  const startX = 120;
  const headers1 = ['STT', 'Thiết bị dạy học', 'Số\nlượng', 'Các bài thí nghiệm/thực hành', 'Ghi chú'];
  const rows1 = [
    ['1', 'Máy tính, ti vi kết nối mạng tại các phòng học.', '4 bộ', 'Dùng cho các tiết dạy có ứng dụng CNTT', ''],
    ['2', 'Thước kẻ, Eke, compa của giáo viên', '4 bộ', 'Dụng cụ vẽ hình dùng cho các tiết hình học', ''],
    ['3', 'Bìa giấy cứng, keo dán, dụng cụ thủ công', '4 bộ', 'Dùng cho các tiết tạo hình, hoạt động trải nghiệm', '']
  ];
  y = drawSimpleTable(ctx, startX, y, cols1, headers1, rows1);
  y += 45;

  // 4. Phòng học bộ môn
  ctx.font = 'bold 22px "Times New Roman", Times, serif';
  ctx.fillText('4. Phòng học bộ môn/phòng thí nghiệm/phòng đa năng/sân chơi, bãi tập', 120, y);
  y += 28;
  ctx.font = 'italic 20px "Times New Roman", Times, serif';
  ctx.fillText('(Trình bày cụ thể các phòng thí nghiệm/phòng bộ môn/phòng đa năng/sân chơi/bãi tập có thể sử dụng để tổ chức dạy học môn học/hoạt động giáo dục)', 120, y);
  y += 35;

  const cols2 = [80, 360, 140, 660, 200];
  const headers2 = ['STT', 'Tên phòng', 'Số\nlượng', 'Phạm vi và nội dung sử dụng', 'Ghi chú'];
  const rows2 = [
    ['1', 'Phòng Tin học', '01', 'Thực hành phần mềm GEOGEBRA, excel', ''],
    ['2', 'Lớp học', '01', 'Pha chế dung dịch theo nồng độ yêu cầu', ''],
    ['3', 'Sân trường', '01', 'Tính chiều cao và xác định khoảng cách', '']
  ];
  y = drawSimpleTable(ctx, startX, y, cols2, headers2, rows2);

  return canvas;
}

/**
 * Builds and returns a valid Base64 dataUrl string representing the authentic
 * AI_KHDH TOÁN 9 HK2 (26-27 KNTT).pdf matching Image 2 exactly.
 */
export function generateAuthenticAIKHDHToan9PDF(): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const canvas1 = createAIKHDHPage1Canvas();
  const imgData1 = canvas1.toDataURL('image/png', 0.95);
  doc.addImage(imgData1, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  return doc.output('datauristring');
}

