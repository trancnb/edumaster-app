import { WorkspaceState, KHBDData } from '../types/edtech';
import { extractClassesForGrade } from './classHelpers';

// Generate MS Word (.doc) file for KHBD (Công văn 5512)
export function exportKHBDToWord(state: WorkspaceState) {
  const { khbd } = state;
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${khbd.lessonName}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
    h1 { font-size: 15pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
    h2 { font-size: 13pt; text-transform: uppercase; margin-top: 14px; margin-bottom: 6px; font-weight: bold; color: #1e3a8a; }
    h3 { font-size: 13pt; margin-top: 8px; margin-bottom: 4px; font-weight: bold; }
    p, li { text-align: justify; margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table, th, td { border: 1px solid #000; }
    th, td { padding: 6px 8px; vertical-align: top; }
    th { background-color: #f1f5f9; font-weight: bold; }
    .header-tbl { border: none !important; margin-bottom: 20px; }
    .header-tbl td { border: none !important; padding: 2px 4px; }
    .text-center { text-align: center; }
    .italic { font-style: italic; }
    .bold { font-weight: bold; }
  </style>
</head>
<body>
  <table class="header-tbl" style="width: 100%;">
    <tr>
      <td style="width: 50%; text-align: center;">
        <span class="bold">${khbd.schoolName.toUpperCase()}</span><br>
        <span class="bold">${khbd.department.toUpperCase()}</span>
      </td>
      <td style="width: 50%; text-align: center;">
        <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
        <span class="bold">Độc lập - Tự do - Hạnh phúc</span><br>
        -----------------
      </td>
    </tr>
  </table>

  <h1>KẾ HOẠCH BÀI DẠY (GIÁO ÁN)</h1>
  <p class="text-center bold" style="font-size: 14pt; margin-bottom: 15px;">${khbd.lessonName}</p>
  <p class="text-center italic" style="margin-bottom: 25px;">
    Môn: ${khbd.subject} - ${khbd.grade} (Lớp: ${extractClassesForGrade(khbd.assignedClasses || khbd.className, khbd.grade)}) | Thời lượng: ${khbd.periodsCount} tiết (Thực hiện tiết: ${khbd.currentPeriod})<br>
    Giáo viên thực hiện: ${khbd.teacherName} | Khung thời gian: ${khbd.timeframe}
    ${khbd.curriculumRef ? `<br><strong>Phân phối chương trình:</strong> Tuần ${khbd.curriculumRef.week} • Tiết ${khbd.curriculumRef.period} • Mạch: ${khbd.curriculumRef.branch}` : ''}
    ${khbd.curriculumRef?.aiRoleCode ? `<br><em>Tích hợp AI (QĐ 2422/BGDĐT): ${khbd.curriculumRef.aiRoleCode}</em>` : ''}
  </p>

  <h2>I. MỤC TIÊU BÀI DẠY</h2>
  <h3>1. Về kiến thức:</h3>
  <ul>
    ${khbd.objectives.knowledge.map(k => `<li>${k}</li>`).join('')}
  </ul>

  <h3>2. Về năng lực:</h3>
  <p class="bold">• Năng lực chung:</p>
  <ul>
    ${khbd.objectives.coreCompetencies.map(c => `<li>${c}</li>`).join('')}
  </ul>
  <p class="bold">• Năng lực đặc thù môn học:</p>
  <ul>
    ${khbd.objectives.subjectCompetencies.map(c => `<li>${c}</li>`).join('')}
  </ul>

  <h3>3. Về phẩm chất:</h3>
  <ul>
    ${khbd.objectives.qualities.map(q => `<li>${q}</li>`).join('')}
  </ul>

  <h2>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h2>
  <p><strong>1. Chuẩn bị của giáo viên:</strong> ${khbd.equipment.teacher.join('; ')}.</p>
  <p><strong>2. Chuẩn bị của học sinh:</strong> ${khbd.equipment.students.join('; ')}.</p>
  <p><strong>3. Học liệu số & thiết bị công nghệ:</strong> ${khbd.equipment.digitalResources.join('; ')}.</p>

  <h2>III. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512/BGDĐT-GDTrH)</h2>
  ${khbd.activities.map((act) => `
    <div style="margin-top: 15px; border-bottom: 1px dashed #64748b; padding-bottom: 15px;">
      <h3 style="color: #1e3a8a;">${act.title} (${act.durationMinutes} phút)</h3>
      <p><strong>a) Mục tiêu:</strong> ${act.objective}</p>
      <p><strong>b) Nội dung:</strong> ${act.content}</p>
      <p><strong>c) Sản phẩm:</strong> ${act.product}</p>
      <p><strong>d) Tổ chức thực hiện:</strong></p>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Các bước</th>
            <th style="width: 40%;">Hoạt động của Giáo viên</th>
            <th style="width: 35%;">Hoạt động của Học sinh</th>
          </tr>
        </thead>
        <tbody>
          ${act.steps.map(s => `
            <tr>
              <td><strong>${s.name}</strong></td>
              <td>${s.teacherAction}</td>
              <td>${s.studentAction}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')}

  <h2>IV. HỒ SƠ DẠY HỌC VÀ PHỤ LỤC</h2>
  ${khbd.appendix.worksheets.map(w => `
    <h3>${w.title}</h3>
    <div style="border: 1px solid #cbd5e1; padding: 10px; background-color: #f8fafc; white-space: pre-line;">
      ${w.content}
    </div>
  `).join('')}

  ${khbd.appendix.rubrics.length > 0 ? `
    <h3 style="margin-top: 15px;">BẢNG TIÊU CHÍ ĐÁNH GIÁ (RUBRICS)</h3>
    <table>
      <thead>
        <tr>
          <th>Tiêu chí đánh giá</th>
          <th>Mức 1 (Cần cố gắng)</th>
          <th>Mức 2 (Đạt)</th>
          <th>Mức 3 (Tốt / Xuất sắc)</th>
        </tr>
      </thead>
      <tbody>
        ${khbd.appendix.rubrics.map(r => `
          <tr>
            <td><strong>${r.criterion}</strong></td>
            <td>${r.level1}</td>
            <td>${r.level2}</td>
            <td>${r.level3}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}
</body>
</html>
`;
  const cleanSlug = khbd.lessonName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  downloadBlob(content, `KHBD_5512_${cleanSlug || 'Toan9'}.doc`, 'application/msword');
}

// Generate MS Word (.doc) for Exam (Công văn 7991)
export function exportExamToWord(state: WorkspaceState) {
  const { exam } = state;
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${exam.examTitle}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
    h2 { font-size: 13pt; margin-top: 14px; margin-bottom: 4px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #000; padding-bottom: 2px; }
    p, li { text-align: justify; margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table, th, td { border: 1px solid #000; }
    th, td { padding: 5px 8px; vertical-align: top; }
    th { background-color: #f1f5f9; }
    .header-tbl { border: none !important; margin-bottom: 15px; }
    .header-tbl td { border: none !important; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
    .score-badge { font-weight: bold; color: #2563eb; }
  </style>
</head>
<body>
  <table class="header-tbl" style="width: 100%;">
    <tr>
      <td style="width: 45%; text-align: center;">
        <span class="bold">SỞ GIÁO DỤC VÀ ĐÀO TẠO</span><br>
        <span class="bold">TRƯỜNG THPT CHUYÊN LÊ HỒNG PHONG</span><br>
        <span>${exam.examCode}</span>
      </td>
      <td style="width: 55%; text-align: center;">
        <span class="bold">${exam.examTitle}</span><br>
        <span class="bold">Môn thi: ${exam.subject} - ${exam.grade}</span><br>
        <span class="italic">Thời gian làm bài: ${exam.durationMinutes} phút (không kể thời gian giao đề)</span>
      </td>
    </tr>
  </table>

  <h2>${exam.part1.title} (${exam.part1.totalScore} điểm)</h2>
  <p class="italic">${exam.part1.instructions}</p>
  ${exam.part1.questions.map((q, idx) => `
    <div style="margin-top: 8px;">
      <p><strong>${q.code}:</strong> ${q.text} <span class="score-badge">(${q.score}đ - Mức: ${q.level})</span></p>
      <table style="border: none; margin: 4px 0;">
        <tr style="border: none;">
          ${q.options.map(opt => `<td style="border: none; width: 25%;"><strong>${opt.key}.</strong> ${opt.text}</td>`).join('')}
        </tr>
      </table>
    </div>
  `).join('')}

  <h2>${exam.part2.title} (${exam.part2.totalScore} điểm - Chuẩn CV 7991)</h2>
  <p class="italic">${exam.part2.instructions}</p>
  ${exam.part2.questions.map((q) => `
    <div style="margin-top: 10px;">
      <p><strong>${q.code}:</strong> ${q.stem} <span class="score-badge">(Tối đa 1,0 điểm)</span></p>
      <table style="width: 100%; margin-top: 4px;">
        <thead>
          <tr>
            <th style="width: 75%;">Lệnh hỏi / Khẳng định</th>
            <th style="width: 12%; text-align: center;">Đúng</th>
            <th style="width: 13%; text-align: center;">Sai</th>
          </tr>
        </thead>
        <tbody>
          ${q.statements.map(st => `
            <tr>
              <td><strong>${st.subId})</strong> ${st.text} <em>[Mức: ${st.level}]</em></td>
              <td style="text-align: center;">[ ]</td>
              <td style="text-align: center;">[ ]</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')}

  <h2>${exam.part3.title} (${exam.part3.totalScore} điểm)</h2>
  <p class="italic">${exam.part3.instructions}</p>
  ${exam.part3.questions.map((q) => `
    <div style="margin-top: 8px;">
      <p><strong>${q.code}:</strong> ${q.text} <span class="score-badge">(${q.score}đ - Mức: ${q.level})</span></p>
      <p><em>Đáp số: ........................................................................................</em></p>
    </div>
  `).join('')}

  <h2>${exam.part4.title} (${exam.part4.totalScore} điểm)</h2>
  <p class="italic">${exam.part4.instructions}</p>
  ${exam.part4.questions.map((q) => `
    <div style="margin-top: 8px;">
      <p><strong>${q.code}:</strong> ${q.text} <span class="score-badge">(${q.score}đ - Mức: ${q.level})</span></p>
    </div>
  `).join('')}

  <br>
  <p class="bold" style="text-align: center;">----------------- HẾT -----------------</p>
  <p class="italic text-center">Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm.</p>

  <div style="page-break-before: always; margin-top: 30px;">
    <h1>HƯỚNG DẪN CHẤM & BAREM ĐIỂM CHI TIẾT (CHUẨN CV 7991)</h1>
    
    <h2>1. ĐÁP ÁN PHẦN I (${exam.part1.totalScore} điểm)</h2>
    <table>
      <tr>
        ${exam.part1.questions.map(q => `<th>${q.code}</th>`).join('')}
      </tr>
      <tr>
        ${exam.part1.questions.map(q => `<td style="text-align: center; font-weight: bold; color: #2563eb;">${q.correctAnswer}</td>`).join('')}
      </tr>
    </table>

    <h2>2. ĐÁP ÁN PHẦN II (${exam.part2.totalScore} điểm - Quy chuẩn điểm Đúng/Sai 4 ý)</h2>
    <p><em>* Quy tắc: Đúng 1 ý: 0,1đ | Đúng 2 ý: 0,25đ | Đúng 3 ý: 0,5đ | Đúng 4 ý: 1,0đ.</em></p>
    <table>
      <thead>
        <tr>
          <th>Câu hỏi</th>
          <th>Lệnh a)</th>
          <th>Lệnh b)</th>
          <th>Lệnh c)</th>
          <th>Lệnh d)</th>
        </tr>
      </thead>
      <tbody>
        ${exam.part2.questions.map(q => `
          <tr>
            <td><strong>${q.code}</strong></td>
            ${q.statements.map(st => `<td style="text-align: center; font-weight: bold;">${st.isCorrect ? '<span style="color: green;">ĐÚNG</span>' : '<span style="color: red;">SAI</span>'}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>3. ĐÁP ÁN PHẦN III (${exam.part3.totalScore} điểm)</h2>
    <table>
      <thead>
        <tr>
          <th>Câu hỏi</th>
          <th>Đáp án</th>
          <th>Mức điểm</th>
          <th>Hướng dẫn giải vắn tắt</th>
        </tr>
      </thead>
      <tbody>
        ${exam.part3.questions.map(q => `
          <tr>
            <td><strong>${q.code}</strong></td>
            <td style="font-weight: bold; color: #2563eb;">${q.correctAnswer} ${q.unit || ''}</td>
            <td>${q.score}đ</td>
            <td>${q.explanation}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>4. ĐÁP ÁN & BAREM BƯỚC PHẦN IV (${exam.part4.totalScore} điểm)</h2>
    ${exam.part4.questions.map(q => `
      <p><strong>${q.code}:</strong> ${q.text}</p>
      <table>
        <thead>
          <tr>
            <th style="width: 80%;">Nội dung các bước giải</th>
            <th style="width: 20%; text-align: center;">Điểm</th>
          </tr>
        </thead>
        <tbody>
          ${q.rubricSteps.map(step => `
            <tr>
              <td>${step.stepDescription}</td>
              <td style="text-align: center; font-weight: bold;">${step.score}đ</td>
            </tr>
          `).join('')}
          <tr>
            <td style="font-weight: bold; text-align: right;">TỔNG ĐIỂM:</td>
            <td style="text-align: center; font-weight: bold; color: #2563eb;">${q.score}đ</td>
          </tr>
        </tbody>
      </table>
    `).join('')}
  </div>
</body>
</html>
`;

  downloadBlob(content, `DE_THI_7991_${exam.subject.replace(/[^a-zA-Z0-9]/g, '_')}.doc`, 'application/msword');
}

// Generate MS Word (.doc) for Matrix Specification (Công văn 7991)
export function exportMatrixToWord(state: WorkspaceState) {
  const { exam, khbd } = state;
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>MA TRẬN ĐẶC TẢ ĐỀ KIỂM TRA - ${exam.examTitle}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
    h2 { font-size: 13pt; margin-top: 14px; margin-bottom: 4px; font-weight: bold; color: #0f172a; }
    p, li { text-align: justify; margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table, th, td { border: 1px solid #000; }
    th, td { padding: 6px 8px; vertical-align: top; }
    th { background-color: #f1f5f9; text-align: center; font-weight: bold; }
    .header-tbl { border: none !important; margin-bottom: 15px; }
    .header-tbl td { border: none !important; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
    .center { text-align: center; }
  </style>
</head>
<body>
  <table class="header-tbl" style="width: 100%;">
    <tr>
      <td style="width: 45%; text-align: center;">
        <span class="bold">TRƯỜNG: ${khbd.schoolName.toUpperCase()}</span><br>
        <span class="bold">TỔ CHUYÊN MÔN: ${khbd.department.toUpperCase()}</span>
      </td>
      <td style="width: 55%; text-align: center;">
        <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
        <span class="bold">Độc lập - Tự do - Hạnh phúc</span>
      </td>
    </tr>
  </table>

  <h1>BẢNG MA TRẬN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ</h1>
  <p class="center italic">
    Căn cứ Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ Giáo dục và Đào tạo<br>
    Môn: ${exam.subject} - ${exam.grade} | Thời gian: ${exam.durationMinutes} phút | Tổng điểm: 10.0 điểm
  </p>

  <h2>I. KHUNG MA TRẬN TỔNG QUÁT (TỈ LỆ 40% - 30% - 30%)</h2>
  <table>
    <thead>
      <tr>
        <th rowspan="2">TT</th>
        <th rowspan="2">Mạch nội dung / Chủ đề</th>
        <th colspan="3">Mức độ nhận thức</th>
        <th rowspan="2">Tổng số câu</th>
        <th rowspan="2">Tổng điểm</th>
        <th rowspan="2">Tỉ lệ %</th>
      </tr>
      <tr>
        <th>Nhận biết (NB)</th>
        <th>Thông hiểu (TH)</th>
        <th>Vận dụng (VD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">1</td>
        <td><strong>Phần I:</strong> Trắc nghiệm nhiều lựa chọn (4 chọn 1)</td>
        <td class="center">6 câu (1.5đ)</td>
        <td class="center">6 câu (1.5đ)</td>
        <td class="center">0 câu (0.0đ)</td>
        <td class="center font-bold">12 câu</td>
        <td class="center font-bold">3.0 điểm</td>
        <td class="center">30%</td>
      </tr>
      <tr>
        <td class="center">2</td>
        <td><strong>Phần II:</strong> Trắc nghiệm Đúng / Sai (mỗi câu 4 mệnh đề)</td>
        <td class="center">4 ý (1.0đ)</td>
        <td class="center">4 ý (1.0đ)</td>
        <td class="center">0 ý (0.0đ)</td>
        <td class="center font-bold">02 câu (8 ý)</td>
        <td class="center font-bold">2.0 điểm</td>
        <td class="center">20%</td>
      </tr>
      <tr>
        <td class="center">3</td>
        <td><strong>Phần III:</strong> Trắc nghiệm trả lời ngắn (điền kết quả)</td>
        <td class="center">2 câu (1.0đ)</td>
        <td class="center">1 câu (0.5đ)</td>
        <td class="center">1 câu (0.5đ)</td>
        <td class="center font-bold">04 câu</td>
        <td class="center font-bold">2.0 điểm</td>
        <td class="center">20%</td>
      </tr>
      <tr>
        <td class="center">4</td>
        <td><strong>Phần IV:</strong> Tự luận (trình bày chi tiết theo bước)</td>
        <td class="center">0 câu (0.0đ)</td>
        <td class="center">0 câu (0.0đ)</td>
        <td class="center">2 câu (3.0đ)</td>
        <td class="center font-bold">02 câu</td>
        <td class="center font-bold">3.0 điểm</td>
        <td class="center">30%</td>
      </tr>
      <tr style="background-color: #f8fafc; font-weight: bold;">
        <td colspan="2" class="center">TỔNG CỘNG:</td>
        <td class="center">4.0 điểm (40%)</td>
        <td class="center">3.0 điểm (30%)</td>
        <td class="center">3.0 điểm (30%)</td>
        <td class="center">20 câu</td>
        <td class="center" style="font-size: 14pt; color: #1e40af;">10.0 điểm</td>
        <td class="center">100%</td>
      </tr>
    </tbody>
  </table>

  <h2>II. QUY ĐỊNH BAREM CHẤM ĐIỂM CHUẨN CÔNG VĂN 7991</h2>
  <ul>
    <li><strong>Phần I:</strong> Mỗi câu trả lời đúng được 0,25 điểm (12 câu x 0.25đ = 3.0 điểm).</li>
    <li><strong>Phần II:</strong> Điểm tối đa của 01 câu hỏi là 1,0 điểm.
      <br>• Đúng 01 ý: được 0,10 điểm.
      <br>• Đúng 02 ý: được 0,25 điểm.
      <br>• Đúng 03 ý: được 0,50 điểm.
      <br>• Đúng cả 04 ý: được 1,00 điểm.
    </li>
    <li><strong>Phần III:</strong> Mỗi câu điền đúng đáp số được 0,5 điểm (4 câu x 0.5đ = 2.0 điểm).</li>
    <li><strong>Phần IV:</strong> Tự luận chấm điểm theo barem bước giải chi tiết từng nấc 0.25đ - 0.5đ (tổng 3.0 điểm).</li>
  </ul>
</body>
</html>
`;

  downloadBlob(content, `MA_TRAN_DAC_TA_7991_${exam.subject.replace(/[^a-zA-Z0-9]/g, '_')}.doc`, 'application/msword');
}

/**
 * Chuẩn hóa tên file PowerPoint theo quy chuẩn Bộ Giáo Dục & yêu cầu:
 * MONxx_HOCKIxx_CHUONGxx_BAIxx+ttênbài_GV_xxxxx
 * Ví dụ: TOAN09_HOCKI01_CHUONG01_BAI01Ti_So_Luong_Giac_Goc_Nhon_GV_CHAU_NGOC_BAO_TRAN
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function toPascalSnakeCase(str: string): string {
  const clean = removeVietnameseAccents(str);
  return clean
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('_');
}

export function toUpperSnakeCase(str: string): string {
  const clean = removeVietnameseAccents(str);
  return clean
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.toUpperCase())
    .join('_');
}

export function generateStandardSlideFileName(khbd: Partial<KHBDData> & { lessonName: string }): string {
  // 1. MONxx (ví dụ: TOAN09, TOAN10, VAN09, ANH09)
  let monCode = 'TOAN';
  const sub = (khbd.subject || 'Toán học').toLowerCase();
  if (sub.includes('văn') || sub.includes('ngữ văn')) monCode = 'VAN';
  else if (sub.includes('anh') || sub.includes('tiếng anh')) monCode = 'ANH';
  else if (sub.includes('lí') || sub.includes('lý') || sub.includes('vật lí')) monCode = 'LY';
  else if (sub.includes('hóa')) monCode = 'HOA';
  else if (sub.includes('sinh')) monCode = 'SINH';
  else if (sub.includes('sử') || sub.includes('lịch sử')) monCode = 'SU';
  else if (sub.includes('địa')) monCode = 'DIA';
  else if (sub.includes('tin')) monCode = 'TIN';
  else if (sub.includes('gdcd')) monCode = 'GDCD';
  else {
    const cleanSub = removeVietnameseAccents(khbd.subject || 'TOAN').toUpperCase().replace(/[^A-Z]/g, '');
    monCode = cleanSub.slice(0, 4) || 'TOAN';
  }

  // Khối 2 chữ số (09, 10, 06...)
  const gradeDigits = (khbd.grade || 'Lớp 9').replace(/[^0-9]/g, '');
  const gradeNum = parseInt(gradeDigits, 10) || 9;
  const gradeFormatted = gradeNum < 10 ? `0${gradeNum}` : `${gradeNum}`;
  const MONxx = `${monCode}${gradeFormatted}`;

  // 2. HOCKIxx (ví dụ: HOCKI01, HOCKI02)
  let semesterNum = 1;
  if (khbd.timeframe && (khbd.timeframe.includes('Học kỳ 2') || khbd.timeframe.includes('HK2') || khbd.timeframe.includes('Kỳ 2'))) {
    semesterNum = 2;
  } else if (khbd.curriculumRef && (khbd.curriculumRef.week > 18 || khbd.curriculumRef.period > 54)) {
    semesterNum = 2;
  }
  const HOCKIxx = `HOCKI${semesterNum < 10 ? '0' + semesterNum : semesterNum}`;

  // 3. CHUONGxx (ví dụ: CHUONG01, CHUONG04)
  let chuongNum = 1;
  const chapterText = khbd.curriculumRef?.chapter || '';
  const romanMap: Record<string, number> = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
  };
  const romanMatch = chapterText.match(/chương\s+([IVXLCDM]+)/i);
  const arabicMatch = chapterText.match(/chương\s+(\d+)/i);
  if (romanMatch && romanMap[romanMatch[1].toUpperCase()]) {
    chuongNum = romanMap[romanMatch[1].toUpperCase()];
  } else if (arabicMatch) {
    chuongNum = parseInt(arabicMatch[1], 10);
  }
  const CHUONGxx = `CHUONG${chuongNum < 10 ? '0' + chuongNum : chuongNum}`;

  // 4. BAIxx + tên bài
  let baiNum = khbd.currentPeriod || 1;
  const lessonMatch = khbd.lessonName.match(/bài\s+(\d+)/i);
  if (lessonMatch) {
    baiNum = parseInt(lessonMatch[1], 10);
  }
  const baiFormatted = baiNum < 10 ? `0${baiNum}` : `${baiNum}`;

  // Lấy phần tên bài sạch (bỏ "Bài 1:", "Bài 11.")
  const rawLessonTitle = khbd.lessonName.replace(/^bài\s*\d+\s*[:.-]?\s*/i, '').trim();
  const titlePascalSnake = toPascalSnakeCase(rawLessonTitle || 'Bai_Hoc');
  const BAIxxTenBai = `BAI${baiFormatted}${titlePascalSnake}`;

  // 5. GV_xxxxx
  const rawTeacher = khbd.teacherName || '';
  const cleanTeacher = rawTeacher
    .replace(/^(giáo viên|thầy|cô|gv|tổ trưởng)\s*[:.-]?\s*/i, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  const gvUpperSnake = cleanTeacher ? toUpperSnakeCase(cleanTeacher) : 'TOAN';
  const GV_xxxxx = `GV_${gvUpperSnake}`;

  return `${MONxx}_${HOCKIxx}_${CHUONGxx}_${BAIxxTenBai}_${GV_xxxxx}`;
}

// Generate Real Native Static PowerPoint Presentation (.pptx) with pptxgenjs
// Uses LAYOUT_WIDE (13.333 x 7.5 inches) for 100% widescreen projection fit without any border overflow!
export async function exportSlidesToPPTX(state: WorkspaceState): Promise<string> {
  const { slides, khbd } = state;
  try {
    const pptxgenModule = await import('pptxgenjs');
    const PptxGen = (pptxgenModule as any).default || pptxgenModule;
    const pptx = new PptxGen();
    // Use modern standard Widescreen (13.333 x 7.5 inches) matching PowerPoint 16:9
    pptx.layout = 'LAYOUT_WIDE';
    pptx.title = khbd.lessonName;
    pptx.author = khbd.teacherName || 'Giáo viên bộ môn';
    pptx.company = khbd.schoolName || 'Trường THCS & THPT';

    // Bảng màu chuẩn sư phạm cao cấp
    const BG_WHITE = 'FFFFFF';
    const COLOR_NAVY = '0F2942'; // Xanh Navy đậm KNTT
    const COLOR_BLUE = '0284C7'; // Xanh dương điểm nhấn
    const COLOR_CYAN = '0EA5E9'; // Cyan đường chỉ
    const COLOR_ORANGE = 'F59E0B'; // Cam hổ phách
    const COLOR_ORANGE_DARK = 'EA580C'; // Cam đậm
    const COLOR_MINT = '10B981'; // Xanh lá chốt kiến thức
    const COLOR_PURPLE = '8B5CF6'; // Tím phương án trắc nghiệm
    const COLOR_TEXT_DARK = '1E293B';
    const COLOR_TEXT_MUTED = '64748B';
    const COLOR_BORDER_CYAN = '38BDF8';

    const teacherName = khbd.teacherName || 'Bộ môn Toán';
    const schoolName = khbd.schoolName || 'TRƯỜNG THCS';

    slides.forEach((s, idx) => {
      const slide = pptx.addSlide();
      slide.background = { color: BG_WHITE };

      // 1. TOP ACCENT BAR (Dải màu cyan trên cùng xuyên suốt mọi slide)
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.333,
        h: 0.08,
        fill: { color: COLOR_CYAN },
        line: { width: 0 }
      });

      // 2. BOTTOM NAVY FOOTER BAR
      const renderSlideFooter = (pageNumber: number) => {
        // Dải 2 đường kẻ trang trí đặc trưng ở góc dưới bên phải (Cyan & Cam)
        slide.addShape(pptx.ShapeType.line, {
          x: 9.2,
          y: 6.9,
          w: 3.3,
          h: 0,
          line: { color: COLOR_CYAN, width: 2.5 }
        });
        slide.addShape(pptx.ShapeType.line, {
          x: 9.8,
          y: 6.96,
          w: 2.7,
          h: 0,
          line: { color: COLOR_ORANGE, width: 2.5 }
        });

        // Thanh nền Navy dưới đáy slide
        slide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 7.05,
          w: 13.333,
          h: 0.45,
          fill: { color: COLOR_NAVY },
          line: { width: 0 }
        });

        // Thông tin chân trang bên trái
        slide.addText(`${schoolName.toUpperCase()} - GV: ${teacherName.toUpperCase()}`, {
          x: 0.8,
          y: 7.05,
          w: 9.0,
          h: 0.45,
          color: 'E2E8F0',
          fontSize: 9,
          bold: true,
          valign: 'middle'
        });

        // Số trang bên phải
        slide.addText(`${pageNumber}`, {
          x: 12.0,
          y: 7.05,
          w: 0.8,
          h: 0.45,
          color: 'FFFFFF',
          fontSize: 10,
          bold: true,
          align: 'right',
          valign: 'middle'
        });
      };

      // =====================================================================
      // 1. WELCOME SLIDE (Khớp hoàn hảo với khung 16:9, không bị lệch lề)
      // =====================================================================
      if (s.slideType === 'welcome') {
        // Bảng xanh lá học đường lớn căn giữa tuyệt đối
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 1.2,
          y: 0.7,
          w: 10.933,
          h: 5.8,
          fill: { color: '0F3F2E' }, // Xanh lá bảng phấn học đường
          line: { color: 'B45309', width: 6 }
        });

        // Tiêu đề Chào mừng các em
        slide.addText('CHÀO MỪNG CÁC EM', {
          x: 1.5,
          y: 1.3,
          w: 10.333,
          h: 0.9,
          color: 'FBBF24',
          fontSize: 34,
          bold: true,
          align: 'center'
        });
        slide.addText('ĐẾN VỚI TIẾT HỌC MỚI HÔM NAY!', {
          x: 1.5,
          y: 2.2,
          w: 10.333,
          h: 0.8,
          color: 'FFFFFF',
          fontSize: 28,
          bold: true,
          align: 'center'
        });

        // Hộp thông tin bài học ở giữa bảng
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 2.8,
          y: 3.5,
          w: 7.733,
          h: 1.8,
          fill: { color: '14532D' },
          line: { color: '86EFAC', width: 1.5 }
        });
        slide.addText(`${(khbd.subject || 'MÔN TOÁN').toUpperCase()} - ${khbd.lessonName.toUpperCase()}`, {
          x: 3.0,
          y: 3.8,
          w: 7.333,
          h: 0.6,
          color: 'FDE047',
          fontSize: 16,
          bold: true,
          align: 'center'
        });
        slide.addText(`Giáo viên: ${teacherName} • Lớp: ${extractClassesForGrade(khbd.assignedClasses || khbd.className, khbd.grade)}`, {
          x: 3.0,
          y: 4.45,
          w: 7.333,
          h: 0.5,
          color: 'E2E8F0',
          fontSize: 13,
          align: 'center'
        });

        renderSlideFooter(idx + 1);
        slide.addNotes('Kịch bản mở đầu: Ổn định nề nếp lớp học, tạo không khí hứng khởi, giới thiệu mục tiêu tổng quan của tiết học.');
        return;
      }

      // =====================================================================
      // 2. HERO TITLE SLIDE (Cột trái Navy 60%, Cột phải Lab 40% cân đối)
      // =====================================================================
      if (s.slideType === 'hero-title') {
        // Cột trái: Khối bo tròn màu xanh Navy đậm lớn
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 0.5,
          w: 7.8,
          h: 6.2,
          fill: { color: COLOR_NAVY },
          line: { color: COLOR_ORANGE, width: 3 }
        });

        // Thẻ cam trên cùng: CHƯƠNG IV • VECTƠ
        const chapterLabel = s.chapterTag || khbd.curriculumRef?.chapter || 'CHƯƠNG I • HỆ THỨC LƯỢNG';
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 1.2,
          y: 0.85,
          w: 3.2,
          h: 0.48,
          fill: { color: COLOR_ORANGE },
          line: { color: COLOR_ORANGE_DARK, width: 0 }
        });
        slide.addText(chapterLabel.toUpperCase(), {
          x: 1.2,
          y: 0.85,
          w: 3.2,
          h: 0.48,
          color: 'FFFFFF',
          fontSize: 11,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        // Tên bài học lớn màu trắng
        slide.addText(s.title.toUpperCase(), {
          x: 1.2,
          y: 1.5,
          w: 7.0,
          h: 1.4,
          color: 'FFFFFF',
          fontSize: 24,
          bold: true,
          valign: 'top'
        });

        // Thẻ phụ xanh cyan nổi bật
        if (s.subtitle) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: 1.2,
            y: 3.1,
            w: 7.0,
            h: 0.65,
            fill: { color: COLOR_BLUE },
            line: { color: '38BDF8', width: 1 }
          });
          slide.addText(s.subtitle, {
            x: 1.35,
            y: 3.1,
            w: 6.7,
            h: 0.65,
            color: 'FFFFFF',
            fontSize: 13,
            bold: true,
            valign: 'middle'
          });
        }

        // Câu trích dẫn triết lý sư phạm
        const quoteText = s.philosophyQuote || 'Từ trực quan sinh động đến tư duy trừu tượng, vận dụng sáng tạo vào giải quyết vấn đề toán học và đời sống.';
        slide.addText(`“${quoteText}”`, {
          x: 1.2,
          y: 3.95,
          w: 7.0,
          h: 1.2,
          color: 'CBD5E1',
          fontSize: 12,
          italic: true,
          valign: 'top'
        });

        // Thẻ cam dưới cùng: TOÁN 10 • KNTT • TIẾT 1 • PPCT 35 • TUẦN 12
        const ppctLabel = s.ppctTag || `${(khbd.subject || 'TOÁN').toUpperCase()} ${(khbd.grade || '9').replace(/[^0-9]/g, '') || '9'} • KNTT • TIẾT ${khbd.currentPeriod || 1} • TUẦN ${khbd.curriculumRef?.week || 1}`;
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 1.2,
          y: 5.4,
          w: 5.6,
          h: 0.55,
          fill: { color: COLOR_ORANGE },
          line: { color: COLOR_ORANGE, width: 0 }
        });
        slide.addText(ppctLabel.toUpperCase(), {
          x: 1.2,
          y: 5.4,
          w: 5.6,
          h: 0.55,
          color: COLOR_NAVY,
          fontSize: 11,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        // Cột phải: Khối hình ảnh phòng thực hành / học sinh
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 8.9,
          y: 0.5,
          w: 3.633,
          h: 6.2,
          fill: { color: 'F8FAFC' },
          line: { color: 'CBD5E1', width: 1.5 }
        });
        slide.addText('HỌC LIỆU SỐ TRỰC QUAN', {
          x: 9.1,
          y: 1.2,
          w: 3.233,
          h: 0.5,
          color: COLOR_BLUE,
          fontSize: 12,
          bold: true,
          align: 'center'
        });
        slide.addText('Phòng học thông minh KNTT\nChủ động kiến tạo tri thức', {
          x: 9.1,
          y: 2.0,
          w: 3.233,
          h: 1.2,
          color: COLOR_TEXT_MUTED,
          fontSize: 11,
          align: 'center'
        });

        renderSlideFooter(idx + 1);
        slide.addNotes('Kịch bản giảng dạy: Giới thiệu vị trí bài học trong chương trình, nêu tầm quan trọng của chủ đề đối với thực tế và các môn học liên quan.');
        return;
      }

      // 3. OBJECTIVES / AGENDA SLIDE
      // =====================================================================
      if (s.slideType === 'objectives' || s.slideType === 'agenda') {
        // Thẻ cam trạng thái bên trái: ĐỊNH HƯỚNG
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 0.45,
          w: 2.0,
          h: 0.55,
          fill: { color: COLOR_ORANGE },
          line: { color: COLOR_ORANGE, width: 0 }
        });
        slide.addText('ĐỊNH HƯỚNG', {
          x: 0.8,
          y: 0.45,
          w: 2.0,
          h: 0.55,
          color: 'FFFFFF',
          fontSize: 11,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        // Thanh tiêu đề trắng bo tròn có chấm tròn xanh cyan
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 3.0,
          y: 0.45,
          w: 9.533,
          h: 0.55,
          fill: { color: 'F8FAFC' },
          line: { color: 'E2E8F0', width: 1 }
        });
        slide.addText(s.title.toUpperCase(), {
          x: 3.3,
          y: 0.45,
          w: 8.5,
          h: 0.55,
          color: COLOR_NAVY,
          fontSize: 16,
          bold: true,
          valign: 'middle'
        });
        slide.addShape(pptx.ShapeType.ellipse, {
          x: 12.1,
          y: 0.58,
          w: 0.25,
          h: 0.25,
          fill: { color: COLOR_CYAN },
          line: { color: COLOR_CYAN, width: 0 }
        });

        const boxes = s.numberedBoxes || (s.bullets || []).map((b, bIdx) => ({
          num: `0${bIdx + 1}`,
          text: b
        }));

        const boxCount = Math.min(5, boxes.length);
        const boxH = boxCount <= 4 ? 1.05 : 0.84;
        const boxGap = boxCount <= 4 ? 0.28 : 0.20;
        const startY = boxCount <= 4 ? 1.35 : 1.30;

        // Căn giữa chính xác: x = 1.2, w = 10.933 (lề trái 1.2, lề phải 1.2 trên slide 13.333)
        boxes.slice(0, boxCount).forEach((b, bIdx) => {
          const currentY = startY + bIdx * (boxH + boxGap);
          slide.addShape(pptx.ShapeType.roundRect, {
            x: 1.2,
            y: currentY,
            w: 10.933,
            h: boxH,
            fill: { color: 'FFFFFF' },
            line: { color: COLOR_BORDER_CYAN, width: 2 }
          });
          slide.addText(b.num, {
            x: 1.5,
            y: currentY,
            w: 0.8,
            h: boxH,
            color: COLOR_NAVY,
            fontSize: 20,
            bold: true,
            valign: 'middle'
          });
          slide.addText(b.text, {
            x: 2.4,
            y: currentY,
            w: 9.4,
            h: boxH,
            color: COLOR_NAVY,
            fontSize: 14,
            bold: true,
            valign: 'middle'
          });
        });

        renderSlideFooter(idx + 1);
        slide.addNotes(`Mục tiêu: Tạo bản đồ tiến trình tiết học.\nThời lượng: 1-2 phút.\nLời dẫn GV: Giới thiệu nhịp học 45 phút, giúp học sinh chủ động nắm bắt từng trạm học tập.\nKịch bản click: Click 1 hiện tiêu đề; Click 2-6 xuất hiện từng chặng theo nhịp giảng.`);
        return;
      }

      // =====================================================================
      // 4. LUCKY GIFT BOX GAME SHOW SLIDE (Căn giữa 4 hộp quà hoàn hảo)
      // =====================================================================
      if (s.slideType === 'lucky-gift') {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 2.5,
          y: 0.55,
          w: 8.333,
          h: 1.15,
          fill: { color: 'B45309' },
          line: { color: 'FBBF24', width: 3 }
        });
        slide.addText('HỘP QUÀ MAY MẮN', {
          x: 2.5,
          y: 0.6,
          w: 8.333,
          h: 0.6,
          color: 'FDE047',
          fontSize: 28,
          bold: true,
          align: 'center'
        });
        slide.addText('Chọn hộp quà – trả lời câu hỏi – nhận thưởng!', {
          x: 2.5,
          y: 1.2,
          w: 8.333,
          h: 0.45,
          color: 'FFFFFF',
          fontSize: 14,
          bold: true,
          align: 'center'
        });

        const giftBoxes = [
          { num: 1, name: 'Hộp Đỏ', color: 'DC2626', reward: 'Ngôi sao chăm chỉ', symbol: 'π' },
          { num: 2, name: 'Hộp Xanh Dương', color: '2563EB', reward: 'Huy hiệu khám phá', symbol: 'Σ' },
          { num: 3, name: 'Hộp Xanh Lá', color: '16A34A', reward: 'Sticker toán học', symbol: '∫' },
          { num: 4, name: 'Hộp Tím', color: '7C3AED', reward: 'Phiếu quà tư duy', symbol: 'AI' }
        ];

        // 4 hộp quà: w = 2.6, gap = 0.4. x = 0.8 + bIdx * 3.0.
        // Hộp 1: 0.8, Hộp 2: 3.8, Hộp 3: 6.8, Hộp 4: 9.8. (9.8 + 2.6 = 12.4, lề phải 0.933 cân đối)
        giftBoxes.forEach((box, bIdx) => {
          const bX = 0.8 + bIdx * 3.0;
          slide.addShape(pptx.ShapeType.roundRect, {
            x: bX,
            y: 2.0,
            w: 2.6,
            h: 3.8,
            fill: { color: box.color },
            line: { color: 'FDE047', width: 3 }
          });
          // Nơ dọc
          slide.addShape(pptx.ShapeType.rect, {
            x: bX + 1.1,
            y: 2.0,
            w: 0.4,
            h: 3.8,
            fill: { color: 'FBBF24' }
          });
          // Nơ ngang
          slide.addShape(pptx.ShapeType.rect, {
            x: bX,
            y: 3.4,
            w: 2.6,
            h: 0.4,
            fill: { color: 'FBBF24' }
          });
          // Vòng tròn số
          slide.addShape(pptx.ShapeType.ellipse, {
            x: bX + 0.8,
            y: 3.1,
            w: 1.0,
            h: 1.0,
            fill: { color: 'FDE047' },
            line: { color: '92400E', width: 2 }
          });
          slide.addText(`${box.num}`, {
            x: bX + 0.8,
            y: 3.1,
            w: 1.0,
            h: 1.0,
            color: '78350F',
            fontSize: 26,
            bold: true,
            align: 'center',
            valign: 'middle'
          });
          slide.addText(`Quà: ${box.reward}`, {
            x: bX,
            y: 4.9,
            w: 2.6,
            h: 0.7,
            color: 'FFFFFF',
            fontSize: 11,
            bold: true,
            align: 'center'
          });
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 2.8,
          y: 6.1,
          w: 7.733,
          h: 0.65,
          fill: { color: COLOR_NAVY },
          line: { color: COLOR_ORANGE, width: 1.5 }
        });
        slide.addText('f(x) = Tri thức + Tư duy + Sáng tạo = Thành công 🌟', {
          x: 3.0,
          y: 6.1,
          w: 7.333,
          h: 0.65,
          color: 'FDE047',
          fontSize: 13,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        renderSlideFooter(idx + 1);
        slide.addNotes('Kịch bản tương tác: Cho 4 tổ đại diện chọn lần lượt 4 hộp quà để bước vào thử thách trắc nghiệm.');
        return;
      }

      // =====================================================================
      // 5. INTERACTIVE QUIZ CLICK-TO-REVEAL SLIDE (Đầy đủ và không tràn lề)
      // =====================================================================
      if (s.slideType === 'interactive-quiz' || s.giftQuiz) {
        const qData = s.giftQuiz || {
          questionNumber: 1,
          level: 'NB 1',
          question: s.quizData?.question || s.title,
          options: (s.quizData?.options || ['A. Phương án 1', 'B. Phương án 2', 'C. Phương án 3', 'D. Phương án 4']).map((t, oIdx) => ({
            key: ['A', 'B', 'C', 'D'][oIdx] as any,
            text: t
          })),
          correctKey: ['A', 'B', 'C', 'D'][s.quizData?.correctIndex || 0] as any,
          reward: 'Ngôi sao chăm chỉ 🌟'
        };

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 0.45,
          w: 1.8,
          h: 0.55,
          fill: { color: COLOR_ORANGE },
          line: { color: COLOR_ORANGE, width: 0 }
        });
        slide.addText('HỘP QUÀ', {
          x: 0.8,
          y: 0.45,
          w: 1.8,
          h: 0.55,
          color: 'FFFFFF',
          fontSize: 12,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 2.8,
          y: 0.45,
          w: 8.3,
          h: 0.55,
          fill: { color: 'F8FAFC' },
          line: { color: 'E2E8F0', width: 1 }
        });
        slide.addText(`${khbd.lessonName} • Tiết ${khbd.currentPeriod || 1}`, {
          x: 3.0,
          y: 0.45,
          w: 7.9,
          h: 0.55,
          color: COLOR_NAVY,
          fontSize: 14,
          bold: true,
          valign: 'middle'
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 11.3,
          y: 0.45,
          w: 1.233,
          h: 0.55,
          fill: { color: COLOR_MINT },
          line: { color: COLOR_MINT, width: 0 }
        });
        slide.addText(qData.level, {
          x: 11.3,
          y: 0.45,
          w: 1.233,
          h: 0.55,
          color: 'FFFFFF',
          fontSize: 13,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        // Khung câu hỏi
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 1.25,
          w: 11.733,
          h: 0.95,
          fill: { color: 'FEF3C7' },
          line: { color: 'FDE68A', width: 1 }
        });
        slide.addText(`Câu ${qData.questionNumber}. ${qData.question}`, {
          x: 1.0,
          y: 1.25,
          w: 11.333,
          h: 0.95,
          color: COLOR_NAVY,
          fontSize: 15,
          bold: true,
          valign: 'middle'
        });

        const optColors: Record<string, { fill: string; badge: string }> = {
          'A': { fill: 'FFFFFF', badge: '2563EB' },
          'B': { fill: 'FFFFFF', badge: 'F59E0B' },
          'C': { fill: 'FFFFFF', badge: '8B5CF6' },
          'D': { fill: 'FFFFFF', badge: '10B981' }
        };

        qData.options.slice(0, 4).forEach((opt, oIdx) => {
          const optY = 2.4 + oIdx * 0.92;
          const isCorrect = opt.key === qData.correctKey;
          const conf = optColors[opt.key] || optColors['A'];

          slide.addShape(pptx.ShapeType.roundRect, {
            x: 0.8,
            y: optY,
            w: 11.733,
            h: 0.8,
            fill: { color: isCorrect ? 'F0FDF4' : conf.fill },
            line: { color: isCorrect ? '16A34A' : '38BDF8', width: isCorrect ? 2.5 : 1.5 }
          });

          slide.addShape(pptx.ShapeType.roundRect, {
            x: 0.95,
            y: optY + 0.1,
            w: 0.7,
            h: 0.6,
            fill: { color: conf.badge },
            line: { width: 0 }
          });
          slide.addText(opt.key, {
            x: 0.95,
            y: optY + 0.1,
            w: 0.7,
            h: 0.6,
            color: 'FFFFFF',
            fontSize: 15,
            bold: true,
            align: 'center',
            valign: 'middle'
          });

          slide.addText(opt.text, {
            x: 1.85,
            y: optY,
            w: 10.4,
            h: 0.8,
            color: isCorrect ? '166534' : COLOR_NAVY,
            fontSize: 14,
            bold: isCorrect,
            valign: 'middle'
          });
        });

        // Thanh thao tác click công bố đáp án
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 6.2,
          w: 8.0,
          h: 0.55,
          fill: { color: '059669' },
          line: { width: 0 }
        });
        slide.addText(`HS chọn phương án → GV CLICK CHUỘT để công bố đáp án.  ĐÁP ÁN: ${qData.correctKey} • CHÚC MỪNG!`, {
          x: 0.9,
          y: 6.2,
          w: 7.8,
          h: 0.55,
          color: 'FFFFFF',
          fontSize: 11,
          bold: true,
          valign: 'middle'
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 9.0,
          y: 6.2,
          w: 3.533,
          h: 0.55,
          fill: { color: 'EA580C' },
          line: { width: 0 }
        });
        slide.addText(`PHẦN QUÀ: ${qData.reward}`, {
          x: 9.1,
          y: 6.2,
          w: 3.333,
          h: 0.55,
          color: 'FFFFFF',
          fontSize: 11,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        renderSlideFooter(idx + 1);
        slide.addNotes(`Kịch bản click: 1) Học sinh giơ bảng chọn phương án. 2) GV bấm chuột công bố đáp án đúng (${qData.correctKey}) và trao phần thưởng (${qData.reward}).`);
        return;
      }

      // =====================================================================
      // 6. QUIZ RESULTS SLIDE (Bảng kết quả)
      // =====================================================================
      if (s.slideType === 'quiz-results') {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 0.45,
          w: 1.8,
          h: 0.55,
          fill: { color: COLOR_ORANGE },
          line: { width: 0 }
        });
        slide.addText('KẾT QUẢ', {
          x: 0.8,
          y: 0.45,
          w: 1.8,
          h: 0.55,
          color: 'FFFFFF',
          fontSize: 12,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 2.8,
          y: 0.45,
          w: 9.733,
          h: 0.55,
          fill: { color: 'F8FAFC' },
          line: { color: 'E2E8F0', width: 1 }
        });
        slide.addText(`${khbd.lessonName} • Bảng tổng kết`, {
          x: 3.0,
          y: 0.45,
          w: 9.3,
          h: 0.55,
          color: COLOR_NAVY,
          fontSize: 14,
          bold: true,
          valign: 'middle'
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 1.5,
          y: 1.35,
          w: 10.333,
          h: 0.7,
          fill: { color: '059669' },
          line: { width: 0 }
        });
        slide.addText('ĐÁP ÁN THỬ THÁCH', {
          x: 1.5,
          y: 1.35,
          w: 10.333,
          h: 0.7,
          color: 'FFFFFF',
          fontSize: 18,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        const results = [
          { q: 'Câu 1', ans: 'Đáp án: A', color: '2563EB' },
          { q: 'Câu 2', ans: 'Đáp án: B', color: 'F59E0B' },
          { q: 'Câu 3', ans: 'Đáp án: C', color: '8B5CF6' },
          { q: 'Câu 4', ans: 'Đáp án: C', color: 'EF4444' }
        ];

        results.forEach((r, rIdx) => {
          const rX = 1.5 + rIdx * 2.65;
          slide.addShape(pptx.ShapeType.roundRect, {
            x: rX,
            y: 2.35,
            w: 2.4,
            h: 2.2,
            fill: { color: 'FFFFFF' },
            line: { color: r.color, width: 2.5 }
          });
          slide.addText(r.q, {
            x: rX,
            y: 2.6,
            w: 2.4,
            h: 0.6,
            color: COLOR_NAVY,
            fontSize: 18,
            bold: true,
            align: 'center'
          });
          slide.addText(r.ans, {
            x: rX,
            y: 3.3,
            w: 2.4,
            h: 0.6,
            color: r.color,
            fontSize: 16,
            bold: true,
            align: 'center'
          });
        });

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 1.5,
          y: 4.95,
          w: 10.333,
          h: 1.3,
          fill: { color: 'FEF3C7' },
          line: { color: 'F59E0B', width: 1.5 }
        });
        slide.addText('Chúc mừng các em đã hoàn thành xuất sắc phần "Hộp quà may mắn"!\nHãy tiếp tục giữ tinh thần học tập tích cực, tự tin và sáng tạo!', {
          x: 1.8,
          y: 5.05,
          w: 9.733,
          h: 1.1,
          color: COLOR_NAVY,
          fontSize: 15,
          bold: true,
          align: 'center',
          valign: 'middle'
        });

        renderSlideFooter(idx + 1);
        slide.addNotes('Tổng kết điểm số thi đua giữa các tổ, biểu dương tinh thần tự giác học tập.');
        return;
      }

      // =====================================================================
      // 7. PEDAGOGICAL CONTENT SLIDES (Căn chỉnh đối xứng, tỷ lệ hoàn mỹ)
      // =====================================================================
      const statusLabel = s.statusBadge?.label || (
        idx === 0 ? 'TRANG BÌA' :
        s.phase.includes('Khởi động') ? 'KHỞI ĐỘNG' :
        s.phase.includes('Khám phá') ? 'KIẾN THỨC MỚI' :
        s.phase.includes('Luyện tập') ? 'LUYỆN TẬP' :
        s.phase.includes('Vận dụng') ? 'VẬN DỤNG' : 'BÀI HỌC'
      );
      const statusColor = s.statusBadge?.color === 'cyan' ? COLOR_BLUE :
                          s.statusBadge?.color === 'green' ? COLOR_MINT :
                          s.statusBadge?.color === 'purple' ? COLOR_PURPLE : COLOR_ORANGE;

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 0.45,
        w: 2.2,
        h: 0.55,
        fill: { color: statusColor },
        line: { width: 0 }
      });
      slide.addText(statusLabel.toUpperCase(), {
        x: 0.8,
        y: 0.45,
        w: 2.2,
        h: 0.55,
        color: 'FFFFFF',
        fontSize: 11,
        bold: true,
        align: 'center',
        valign: 'middle'
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 3.2,
        y: 0.45,
        w: 9.333,
        h: 0.55,
        fill: { color: 'F8FAFC' },
        line: { color: 'E2E8F0', width: 1 }
      });
      slide.addText(s.title.toUpperCase(), {
        x: 3.5,
        y: 0.45,
        w: 8.4,
        h: 0.55,
        color: COLOR_NAVY,
        fontSize: 15,
        bold: true,
        valign: 'middle'
      });
      slide.addShape(pptx.ShapeType.ellipse, {
        x: 12.1,
        y: 0.58,
        w: 0.25,
        h: 0.25,
        fill: { color: COLOR_CYAN },
        line: { width: 0 }
      });

      if (s.calloutBoxes && s.calloutBoxes.length > 0) {
        // Cột trái: Phép tính hoặc gạch đầu dòng
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 1.25,
          w: 5.6,
          h: 5.4,
          fill: { color: 'F8FAFC' },
          line: { color: 'CBD5E1', width: 1.5 }
        });

        if (s.mathProblems && s.mathProblems.length > 0) {
          s.mathProblems.slice(0, 4).forEach((prob, pIdx) => {
            const pY = 1.6 + pIdx * 1.15;
            slide.addText(prob, {
              x: 1.1,
              y: pY,
              w: 5.0,
              h: 0.85,
              color: pIdx % 2 === 0 ? COLOR_BLUE : COLOR_NAVY,
              fontSize: 22,
              bold: true,
              align: 'center',
              valign: 'middle'
            });
          });
        } else {
          slide.addText(s.bullets.join('\n\n'), {
            x: 1.1,
            y: 1.5,
            w: 5.0,
            h: 4.8,
            color: COLOR_TEXT_DARK,
            fontSize: 13,
            valign: 'top'
          });
        }

        // Cột phải: Các hộp Callout chuyên nghiệp
        const callH = s.calloutBoxes.length === 1 ? 5.0 : 2.45;
        s.calloutBoxes.slice(0, 2).forEach((cb, cbIdx) => {
          const cbY = 1.25 + cbIdx * 2.75;
          const tagBg = cb.tagColor === 'green' ? '10B981' :
                        cb.tagColor === 'cyan' ? '0284C7' :
                        cb.tagColor === 'purple' ? '8B5CF6' : 'F59E0B';

          slide.addShape(pptx.ShapeType.roundRect, {
            x: 6.7,
            y: cbY,
            w: 5.833,
            h: callH,
            fill: { color: 'FFFFFF' },
            line: { color: tagBg, width: 2 }
          });

          slide.addShape(pptx.ShapeType.roundRect, {
            x: 7.1,
            y: cbY - 0.22,
            w: 1.8,
            h: 0.45,
            fill: { color: tagBg },
            line: { width: 0 }
          });
          slide.addText(cb.tag.toUpperCase(), {
            x: 7.1,
            y: cbY - 0.22,
            w: 1.8,
            h: 0.45,
            color: 'FFFFFF',
            fontSize: 10,
            bold: true,
            align: 'center',
            valign: 'middle'
          });

          slide.addText(cb.text, {
            x: 7.0,
            y: cbY + 0.35,
            w: 5.233,
            h: callH - 0.5,
            color: COLOR_NAVY,
            fontSize: 13,
            bold: true,
            valign: 'top'
          });
        });
      } else {
        // Bố cục thông thường
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 1.25,
          w: 7.8,
          h: 5.4,
          fill: { color: 'FFFFFF' },
          line: { color: 'E2E8F0', width: 1.5 }
        });

        if (s.subtitle) {
          slide.addText(s.subtitle, {
            x: 1.1,
            y: 1.45,
            w: 7.2,
            h: 0.5,
            color: COLOR_NAVY,
            fontSize: 15,
            bold: true
          });
        }

        if (s.bullets && s.bullets.length > 0) {
          const bulletItems = s.bullets.map(b => ({
            text: b,
            options: {
              bullet: true,
              color: COLOR_TEXT_DARK,
              fontSize: 13,
              breakLine: true
            }
          }));
          slide.addText(bulletItems, {
            x: 1.1,
            y: 2.05,
            w: 7.2,
            h: 3.0,
            valign: 'top'
          });
        }

        if (s.bannerPrompt) {
          slide.addShape(pptx.ShapeType.roundRect, {
            x: 1.1,
            y: 5.4,
            w: 7.2,
            h: 0.75,
            fill: { color: '6EE7B7' },
            line: { width: 0 }
          });
          slide.addText(s.bannerPrompt, {
            x: 1.3,
            y: 5.4,
            w: 6.8,
            h: 0.75,
            color: '064E3B',
            fontSize: 14,
            bold: true,
            valign: 'middle'
          });
        }

        slide.addShape(pptx.ShapeType.roundRect, {
          x: 8.9,
          y: 1.25,
          w: 3.633,
          h: 5.4,
          fill: { color: 'F8FAFC' },
          line: { color: 'CBD5E1', width: 1 }
        });
        slide.addText('MINH HỌA SƯ PHẠM', {
          x: 9.1,
          y: 1.6,
          w: 3.233,
          h: 0.4,
          color: COLOR_BLUE,
          fontSize: 12,
          bold: true,
          align: 'center'
        });
        slide.addText(s.notes || 'Học sinh chú ý theo dõi bài học và hoàn thành các nhiệm vụ sư phạm theo hướng dẫn của giáo viên.', {
          x: 9.1,
          y: 2.2,
          w: 3.233,
          h: 4.0,
          color: COLOR_TEXT_MUTED,
          fontSize: 11,
          align: 'left',
          valign: 'top'
        });
      }

      renderSlideFooter(idx + 1);

      if (s.notes) {
        slide.addNotes(s.notes);
      }
    });

    // Tạo tên file đúng quy chuẩn: MONxx_HOCKIxx_CHUONGxx_BAIxx+ttênbài_GV_xxxxx.pptx
    const baseName = generateStandardSlideFileName(khbd);
    const fileName = `${baseName}.pptx`;
    await pptx.writeFile({ fileName });
    return fileName;
  } catch (error) {
    console.error('Error generating native PPTX:', error);
    throw error;
  }
}

// Generate Standalone Single-File HTML with Alpine.js, Tailwind CDN, and Lucide CDN
// Fully implements Scope 1 (Shell Layout, Topbar, 3-mode Sidebar) and Scope 2 (CV 7991 Exam Module with Matrix Sliders & 4-Part Live Document)
export function generateStandaloneOfflineHTML(state: WorkspaceState): string {
  const jsonEscaped = JSON.stringify(state).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduMaster 5512 & 7991 - Nền Tảng Sư Phạm Số</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Alpine.js CDN -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Be Vietnam Pro', 'Inter', system-ui, sans-serif; }
    @media print {
      .no-print { display: none !important; }
      body { background-color: #fff !important; }
      @page { size: A4 portrait; margin: 15mm; }
    }
    input[type=range]::-webkit-slider-thumb {
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #2563eb;
      cursor: pointer;
    }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 antialiased h-screen overflow-hidden flex flex-col" x-data="edtechApp()">

  <!-- =========================================================================
       SCOPE 1: TOPBAR - BỘ CHỌN NHANH MÔN HỌC, KHỐI LỚP, BỘ SÁCH, TÊN BÀI HỌC
       ========================================================================= -->
  <header class="bg-slate-900 text-white border-b border-slate-800 shadow-md no-print shrink-0 z-20">
    <div class="px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
      
      <!-- Brand -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-inner tracking-tighter">
          EM
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold tracking-tight text-white">EduMaster K-12</span>
            <span class="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.5 rounded font-bold">
              CV 5512 & 7991
            </span>
          </div>
          <p class="text-[10px] text-slate-400">Kiến trúc sư chuyển đổi số giáo dục</p>
        </div>
      </div>

      <!-- TOPBAR SELECTORS: MÔN HỌC, KHỐI LỚP, BỘ SÁCH, TÊN BÀI HỌC -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        
        <!-- Môn học -->
        <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 px-2.5 py-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase mr-1.5">Môn:</span>
          <select x-model="state.khbd.subject" @change="state.exam.subject = state.khbd.subject" class="bg-transparent text-blue-400 font-bold focus:outline-none cursor-pointer text-xs">
            <option value="Toán học" class="bg-slate-900 text-white">Toán học</option>
            <option value="Vật lí" class="bg-slate-900 text-white">Vật lí</option>
            <option value="Hóa học" class="bg-slate-900 text-white">Hóa học</option>
            <option value="Sinh học" class="bg-slate-900 text-white">Sinh học</option>
            <option value="Tin học" class="bg-slate-900 text-white">Tin học</option>
            <option value="Ngữ văn" class="bg-slate-900 text-white">Ngữ văn</option>
            <option value="Lịch sử" class="bg-slate-900 text-white">Lịch sử</option>
            <option value="Địa lí" class="bg-slate-900 text-white">Địa lí</option>
            <option value="Tiếng Anh" class="bg-slate-900 text-white">Tiếng Anh</option>
          </select>
        </div>

        <!-- Khối lớp -->
        <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 px-2.5 py-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase mr-1.5">Khối:</span>
          <select x-model="state.khbd.grade" @change="state.exam.grade = state.khbd.grade" class="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs">
            <option value="Lớp 6" class="bg-slate-900 text-white">Lớp 6</option>
            <option value="Lớp 7" class="bg-slate-900 text-white">Lớp 7</option>
            <option value="Lớp 8" class="bg-slate-900 text-white">Lớp 8</option>
            <option value="Lớp 9" class="bg-slate-900 text-white">Lớp 9</option>
            <option value="Lớp 10" class="bg-slate-900 text-white">Lớp 10</option>
            <option value="Lớp 11" class="bg-slate-900 text-white">Lớp 11</option>
            <option value="Lớp 12" class="bg-slate-900 text-white">Lớp 12</option>
          </select>
        </div>

        <!-- Bộ sách quy chuẩn duy nhất: Kết Nối Tri Thức Với Cuộc Sống -->
        <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 px-2.5 py-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase mr-1.5">Bộ sách:</span>
          <span class="text-amber-300 font-bold text-xs">Kết Nối Tri Thức (Quy chuẩn)</span>
        </div>

        <!-- Tên bài học -->
        <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 px-2.5 py-1 min-w-[260px]">
          <span class="text-[10px] font-bold text-slate-400 uppercase mr-1.5">Tên bài:</span>
          <input type="text" x-model="state.khbd.lessonName" class="bg-transparent text-white font-semibold focus:outline-none w-full text-xs" />
        </div>

      </div>

      <!-- Topbar Action -->
      <div class="flex items-center gap-2">
        <button @click="downloadWordExam()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5">
          <span>Tải file Word chuẩn Bộ GD&ĐT</span>
        </button>
        <button @click="downloadWordMatrix()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition flex items-center gap-1.5">
          <span>Tải Ma Trận Đặc Tả</span>
        </button>
      </div>

    </div>
  </header>

  <!-- =========================================================================
       KHUNG SPLIT-PANE Ở GIỮA
       ========================================================================= -->
  <div class="flex-1 flex overflow-hidden">
    
    <!-- =======================================================================
        SIDEBAR ĐIỀU HƯỚNG 3 CHẾ ĐỘ (RỘNG 380PX)
        ======================================================================= -->
    <aside class="w-[380px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden no-print shadow-sm">
      
      <!-- 3 Navigation Mode Buttons - BƯỚC 1: CHỌN CHẾ ĐỘ SƯ PHẠM -->
      <div class="p-4 border-b border-slate-200 space-y-2">
        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
          Bước 1: Chọn Chế Độ Sư Phạm
        </label>
        
        <div class="space-y-1.5">
          <button
            @click="currentTab = 'khbd'"
            :class="currentTab === 'khbd' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'"
            class="w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition text-left"
          >
            <span>Soạn KHBD 5512</span>
            <span class="text-[10px] opacity-80">4 Hoạt động</span>
          </button>

          <button
            @click="currentTab = 'slide'"
            :class="currentTab === 'slide' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'"
            class="w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition text-left"
          >
            <span>Trình Chiếu Slide Bài Giảng</span>
            <span class="text-[10px] opacity-80" x-text="state.slides.length + ' Slides'"></span>
          </button>

          <button
            @click="currentTab = 'exam'"
            :class="currentTab === 'exam' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'"
            class="w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition text-left"
          >
            <span>Ngân Hàng Đề Thi 7991</span>
            <span class="text-[10px] opacity-80">4 Phần • 10.0đ</span>
          </button>
        </div>
      </div>

      <!-- Quick Action Buttons in Sidebar -->
      <div class="p-4 border-b border-slate-200 space-y-2">
        <label class="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
          Xuất Bản Hồ Sơ & Đề Thi
        </label>
        <button @click="downloadWordExam()" class="w-full py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-xs border border-blue-200 text-left transition flex items-center justify-between">
          <span>Tải file Word chuẩn Bộ GD&ĐT (.doc)</span>
          <span>↓</span>
        </button>
        <button @click="downloadWordMatrix()" class="w-full py-2 px-3 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-bold text-xs border border-emerald-200 text-left transition flex items-center justify-between">
          <span>Tải Ma Trận Đặc Tả (.doc)</span>
          <span>↓</span>
        </button>
        <button @click="window.print()" class="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs border border-slate-300 text-left transition">
          In ấn trực tiếp / Lưu PDF A4
        </button>
      </div>

      <!-- Sidebar Specs Body -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        <!-- Profile Card - Bước 2: Thông Tin Giáo Viên -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <span class="text-[10px] font-bold uppercase text-slate-500 block">Bước 2: Thông Tin Giáo Viên</span>
          <div class="flex justify-between"><span class="text-slate-500">1. Giáo viên:</span><strong class="text-slate-800" x-text="state.khbd.teacherName"></strong></div>
          <div class="flex justify-between"><span class="text-slate-500">2. Lớp dạy:</span><strong class="text-slate-800" x-text="state.khbd.className || '9A1'"></strong></div>
          <div class="flex justify-between"><span class="text-slate-500">3. Môn dạy:</span><strong class="text-blue-700" x-text="state.khbd.subject"></strong></div>
          <div class="flex justify-between"><span class="text-slate-500">4. Năm học:</span><strong class="text-slate-800" x-text="state.khbd.schoolYear || '2026-2027'"></strong></div>
        </div>

        <!-- Verification Status Badge -->
        <div class="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
          <div class="flex items-center justify-between font-bold">
            <span class="text-[10px] uppercase">Pháp lý sư phạm:</span>
            <span class="text-[11px] bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-900">4/4 Đạt Chuẩn</span>
          </div>
          <ul class="text-[10px] space-y-0.5 text-emerald-800 pt-1">
            <li>✓ CV 5512: Đúng 4 hoạt động bài dạy</li>
            <li>✓ CV 7991: Đủ 4 phần trắc nghiệm & tự luận</li>
            <li>✓ Phần II Đúng/Sai 4 ý có barem 0.1-0.25-0.5-1.0</li>
            <li>✓ Khóa tổng điểm toàn đề 10.0 điểm</li>
          </ul>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 flex justify-between">
        <span>EduMaster Single-File Standalone</span>
        <span class="font-bold text-blue-700">Offline Ready</span>
      </div>
    </aside>

    <!-- =========================================================================
        VÙNG LÀM VIỆC TRỰC QUAN BÊN PHẢI (CO GIÃN NẠP CÁC MODULE CON)
        ========================================================================= -->
    <main class="flex-1 h-full overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-100/70">
      
      <!-- =======================================================================
           MODULE CON 1: SOẠN KHBD 5512 (BẢNG TIẾN TRÌNH INLINE EDITABLE)
           ======================================================================= -->
      <section x-show="currentTab === 'khbd'" class="space-y-6">
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          
          <!-- Topbar KHBD with Chuyển Đổi Nhanh KHBD Thành Slide Button -->
          <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-6">
            <div>
              <span class="text-xs uppercase font-bold text-blue-700" x-text="state.khbd.schoolName"></span>
              <h2 class="text-xl md:text-2xl font-bold text-slate-900 mt-0.5 uppercase" x-text="'KẾ HOẠCH BÀI DẠY: ' + state.khbd.lessonName"></h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Môn: <span class="font-semibold text-slate-800" x-text="state.khbd.subject"></span> | 
                Khối: <span class="font-semibold text-slate-800" x-text="state.khbd.grade"></span> | 
                Lớp: <span class="font-bold text-emerald-700" x-text="state.khbd.className || '9A1'"></span> | 
                Bộ sách: <span class="font-semibold text-amber-700" x-text="state.khbd.textbook"></span>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <!-- NÚT CHUYỂN ĐỔI NHANH KHBD THÀNH SLIDE -->
              <button
                @click="quickConvertKHBDToSlides()"
                class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
                title="Tự động đồng bộ 4 hoạt động thành Slide Deck 16:9 với các thẻ trực quan hóa"
              >
                <span>Chuyển Đổi Nhanh KHBD Thành Slide</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- BẢNG TIẾN TRÌNH 4 HOẠT ĐỘNG (INLINE EDITABLE) -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase">
              III. TIẾN TRÌNH DẠY HỌC (CHUẨN 4 HOẠT ĐỘNG CÔNG VĂN 5512 - INLINE EDITABLE)
            </h3>
            <span class="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
              ✓ Bảng tiến trình chỉnh sửa trực tiếp (Click để sửa)
            </span>
          </div>

          <div class="space-y-6">
            <template x-for="(act, index) in state.khbd.activities" :key="act.id">
              <div class="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                
                <!-- Activity Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                  <div class="flex items-center gap-2 flex-1">
                    <span class="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shrink-0" x-text="index + 1"></span>
                    <input
                      type="text"
                      x-model="act.title"
                      class="font-bold text-slate-900 text-sm uppercase bg-white border border-blue-200 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
                    <span>Thời lượng:</span>
                    <input
                      type="number"
                      min="1"
                      max="45"
                      x-model.number="act.durationMinutes"
                      class="w-12 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                    />
                    <span>phút</span>
                  </div>
                </div>

                <!-- 3 Mục: a) Mục tiêu - b) Nội dung - c) Sản phẩm (Inline Editable) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  
                  <!-- a) Mục tiêu -->
                  <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-blue-700">a) Mục tiêu:</span>
                      <span class="text-[10px] text-blue-500">Sửa trực tiếp</span>
                    </div>
                    <textarea
                      rows="3"
                      x-model="act.objective"
                      class="w-full text-slate-700 bg-blue-50/20 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs resize-none"
                    ></textarea>
                  </div>

                  <!-- b) Nội dung -->
                  <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-amber-700">b) Nội dung:</span>
                      <span class="text-[10px] text-amber-500">Sửa trực tiếp</span>
                    </div>
                    <textarea
                      rows="3"
                      x-model="act.content"
                      class="w-full text-slate-700 bg-amber-50/20 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs resize-none"
                    ></textarea>
                  </div>

                  <!-- c) Sản phẩm -->
                  <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-emerald-700">c) Sản phẩm:</span>
                      <span class="text-[10px] text-emerald-500">Sửa trực tiếp</span>
                    </div>
                    <textarea
                      rows="3"
                      x-model="act.product"
                      class="w-full text-slate-700 bg-emerald-50/20 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs resize-none"
                    ></textarea>
                  </div>

                </div>

                <!-- d) Tổ chức thực hiện (Bảng tiến trình 4 bước chuẩn 5512 Inline Editable) -->
                <div>
                  <span class="font-bold text-slate-900 text-xs block mb-2">
                    d) Tổ chức thực hiện (Chuẩn 4 bước Công văn 5512 - Inline Editable):
                  </span>
                  <div class="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                    <table class="w-full text-xs text-left bg-white">
                      <thead class="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold">
                        <tr>
                          <th class="p-2.5 w-1/4">Các bước chuẩn</th>
                          <th class="p-2.5 w-2/5 border-l border-slate-200">Hoạt động của Giáo viên</th>
                          <th class="p-2.5 w-1/3 border-l border-slate-200">Hoạt động của Học sinh</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-200 text-slate-700">
                        <template x-for="(step, sIdx) in act.steps" :key="sIdx">
                          <tr>
                            <td class="p-2.5 font-bold text-blue-900 bg-slate-50/50 align-top" x-text="step.name"></td>
                            <td class="p-2 border-l border-slate-200 align-top">
                              <textarea
                                rows="2"
                                x-model="step.teacherAction"
                                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded p-1.5 text-xs text-slate-800 focus:outline-none transition resize-none"
                              ></textarea>
                            </td>
                            <td class="p-2 border-l border-slate-200 align-top">
                              <textarea
                                rows="2"
                                x-model="step.studentAction"
                                class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-blue-500 rounded p-1.5 text-xs text-slate-800 focus:outline-none transition resize-none"
                              ></textarea>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- =======================================================================
           MODULE CON 2: TRÌNH CHIẾU SLIDE BÀI GIẢNG (SLIDE DECK 16:9 & THẺ TRỰC QUAN HÓA)
           ======================================================================= -->
      <section x-show="currentTab === 'slide'" class="space-y-6">
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          
          <!-- Slide Deck Toolbar -->
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4 border-b pb-4">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-900 uppercase">Slide Deck Bài Giảng (16:9)</h3>
                <span class="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold" x-text="'Slide ' + (activeSlideIndex + 1) + ' / ' + state.slides.length"></span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">Trực quan hóa từ KHBD 5512 với các thẻ kiến thức sinh động</p>
            </div>

            <div class="flex items-center gap-2">
              <!-- NÚT CHUYỂN ĐỔI NHANH KHBD THÀNH SLIDE -->
              <button
                @click="quickConvertKHBDToSlides()"
                class="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                title="Đồng bộ hóa lại từ 4 hoạt động KHBD 5512"
              >
                <span>Chuyển Đổi Nhanh KHBD Thành Slide</span>
              </button>

              <!-- Lesson Timer Widget -->
              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-mono">
                <span>⏱</span>
                <span class="font-bold" x-text="formatTime(timerSeconds)"></span>
                <button
                  @click="timerRunning = !timerRunning"
                  class="ml-1 text-[10px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-slate-300"
                  x-text="timerRunning ? 'Dừng' : 'Bắt đầu'"
                ></button>
              </div>

              <!-- Nút Toàn Màn Hình (Fullscreen Presentation) -->
              <button
                @click="isFullscreen = true"
                class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              >
                <span>Toàn Màn Hình (F5)</span>
              </button>
            </div>
          </div>

          <!-- SLIDE DECK CANVAS (TỈ LỆ CHUẨN 16:9) -->
          <div class="aspect-[16/9] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 md:p-10 shadow-2xl flex flex-col justify-between border border-slate-800 relative overflow-hidden">
            
            <!-- Top Tag & Progress -->
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30" x-text="state.slides[activeSlideIndex]?.phase || 'Khám phá'"></span>
              <span class="text-xs font-mono text-slate-400" x-text="(activeSlideIndex + 1) + ' / ' + state.slides.length"></span>
            </div>

            <!-- Slide Body with THẺ TRỰC QUAN HÓA KIẾN THỨC -->
            <div class="my-auto py-4">
              <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1" x-text="state.slides[activeSlideIndex]?.title"></h2>
              <p class="text-xs md:text-sm text-blue-300 font-medium mb-4" x-text="state.slides[activeSlideIndex]?.subtitle"></p>

              <!-- THẺ TRỰC QUAN HÓA KIẾN THỨC (KNOWLEDGE CARDS) NẾU CÓ -->
              <template x-if="state.slides[activeSlideIndex]?.knowledgeCards && state.slides[activeSlideIndex]?.knowledgeCards.length > 0">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
                  <template x-for="(card, cIdx) in state.slides[activeSlideIndex].knowledgeCards" :key="cIdx">
                    <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-lg flex flex-col justify-between hover:border-slate-500 transition">
                      <div>
                        <div class="flex items-center justify-between mb-1.5">
                          <h4 class="font-bold text-sm text-white" x-text="card.title"></h4>
                          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30" x-text="card.badge"></span>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed" x-text="card.content"></p>
                      </div>
                    </div>
                  </template>
                </div>
              </template>

              <!-- HOẶC BULLET POINTS CHUẨN NẾU CHƯA CÓ CARDS -->
              <template x-if="!state.slides[activeSlideIndex]?.knowledgeCards || state.slides[activeSlideIndex]?.knowledgeCards.length === 0">
                <ul class="space-y-3 text-sm md:text-base text-slate-200">
                  <template x-for="(bullet, bIdx) in state.slides[activeSlideIndex]?.bullets" :key="bIdx">
                    <li class="flex items-start gap-2.5">
                      <span class="text-blue-400 font-bold">•</span>
                      <span x-text="bullet"></span>
                    </li>
                  </template>
                </ul>
              </template>
            </div>

            <!-- Slide Footer -->
            <div class="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span x-text="state.khbd.schoolName + ' - ' + state.khbd.teacherName"></span>
              <span x-text="state.khbd.lessonName"></span>
            </div>

          </div>

          <!-- THANH ĐIỀU HƯỚNG NEXT / PREV -->
          <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm mt-4">
            <button
              @click="if (activeSlideIndex > 0) activeSlideIndex--"
              :disabled="activeSlideIndex === 0"
              class="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-lg text-xs font-semibold transition"
            >
              <span>← Slide trước</span>
            </button>

            <!-- Dot Indicators -->
            <div class="flex items-center gap-1.5">
              <template x-for="(s, sIdx) in state.slides" :key="s.id">
                <button
                  @click="activeSlideIndex = sIdx"
                  class="w-2.5 h-2.5 rounded-full transition"
                  :class="sIdx === activeSlideIndex ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'"
                ></button>
              </template>
            </div>

            <button
              @click="if (activeSlideIndex < state.slides.length - 1) activeSlideIndex++"
              :disabled="activeSlideIndex === state.slides.length - 1"
              class="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition"
            >
              <span>Slide tiếp theo →</span>
            </button>
          </div>

        </div>

        <!-- FULLSCREEN PRESENTATION MODAL -->
        <div
          x-show="isFullscreen"
          class="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-8 md:p-14 select-none"
          @keydown.window.escape="isFullscreen = false"
        >
          <!-- Top Bar Fullscreen -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-600 text-white" x-text="state.slides[activeSlideIndex]?.phase"></span>
              <span class="text-sm font-semibold text-slate-300" x-text="state.khbd.lessonName"></span>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 font-mono text-sm bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                <span>⏱</span>
                <span x-text="formatTime(timerSeconds)"></span>
              </div>
              <span class="text-sm font-mono text-slate-400" x-text="(activeSlideIndex + 1) + ' / ' + state.slides.length"></span>
              <button
                @click="isFullscreen = false"
                class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-white"
              >
                Thoát (ESC)
              </button>
            </div>
          </div>

          <!-- Fullscreen Content with Cards -->
          <div class="my-auto max-w-5xl mx-auto w-full py-6">
            <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-2" x-text="state.slides[activeSlideIndex]?.title"></h1>
            <p class="text-lg md:text-xl text-blue-300 font-medium mb-6" x-text="state.slides[activeSlideIndex]?.subtitle"></p>

            <template x-if="state.slides[activeSlideIndex]?.knowledgeCards && state.slides[activeSlideIndex]?.knowledgeCards.length > 0">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 my-4">
                <template x-for="(card, cIdx) in state.slides[activeSlideIndex].knowledgeCards" :key="cIdx">
                  <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <h3 class="font-bold text-xl text-white" x-text="card.title"></h3>
                        <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30" x-text="card.badge"></span>
                      </div>
                      <p class="text-base text-slate-200 leading-relaxed" x-text="card.content"></p>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>

          <!-- Bottom Fullscreen Nav -->
          <div class="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
            <span>Dùng nút hoặc phím [←] và [→] để chuyển slide</span>
            <div class="flex items-center gap-3">
              <button @click="if (activeSlideIndex > 0) activeSlideIndex--" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold">← Trước</button>
              <button @click="if (activeSlideIndex < state.slides.length - 1) activeSlideIndex++" class="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold">Tiếp theo →</button>
            </div>
          </div>
        </div>
      </section>

      <!-- =======================================================================
           SCOPE 2: MODULE ĐỀ KIỂM TRA CHUẨN CÔNG VĂN 7991/BGDĐT-GDTrH
           BÊN TRÁI: BẢNG MA TRẬN ĐỀ (SLIDER 40-30-30, KHÓA 10.0Đ, BỘ ĐẾM CÂU HỎI)
           BÊN PHẢI: LIVE DOCUMENT ĐỦ 4 PHẦN CHUẨN BGDĐT
           ======================================================================= -->
      <section x-show="currentTab === 'exam'" class="space-y-6">
        
        <!-- Top Action Bar for Exam -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
          <div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Công văn 7991/BGDĐT-GDTrH (17/12/2024)
            </span>
            <h2 class="text-lg font-bold text-slate-900 mt-1" x-text="'Đề Kiểm Tra Chuẩn BGDĐT: ' + state.khbd.subject + ' - ' + state.khbd.grade"></h2>
          </div>

          <div class="flex items-center gap-2">
            <button @click="showAnswerKeys = !showAnswerKeys" class="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700">
              <span x-text="showAnswerKeys ? 'Ẩn đáp án & Barem' : 'Hiện đáp án & Barem'"></span>
            </button>
            <button @click="downloadWordExam()" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition">
              Tải file Word chuẩn Bộ GD&ĐT
            </button>
            <button @click="downloadWordMatrix()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition">
              Tải Ma Trận Đặc Tả
            </button>
          </div>
        </div>

        <!-- Scope 2 Split-Pane Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- ===================================================================
               BÊN TRÁI: BẢNG THIẾT LẬP MA TRẬN ĐỀ (WIDTH 4 COLS)
               - Slider 40-30-30, tổng điểm khóa chặt ở 10.0
               - Bộ đếm số lượng câu hỏi từng phần
               =================================================================== -->
          <div class="lg:col-span-4 space-y-4 no-print">
            
            <!-- Card: Matrix Sliders -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">Thiết Lập Ma Trận Đề</h3>
                  <p class="text-[11px] text-slate-500">Chuẩn hóa theo CV 7991/BGDĐT</p>
                </div>
                <div class="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl font-bold text-xs">
                  <span>🔒 10.0 Điểm</span>
                </div>
              </div>

              <!-- Sliders -->
              <div class="space-y-3.5 text-xs">
                
                <!-- Nhận biết (NB) -->
                <div class="space-y-1">
                  <div class="flex justify-between font-bold">
                    <span class="text-blue-800">1. Nhận biết (NB):</span>
                    <span class="text-blue-700 font-mono" x-text="ratioNB + '% (' + ((ratioNB * 10) / 100).toFixed(1) + 'đ)'"></span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="5"
                    x-model.number="ratioNB"
                    @input="handleRatioChange('NB', ratioNB)"
                    class="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <!-- Thông hiểu (TH) -->
                <div class="space-y-1">
                  <div class="flex justify-between font-bold">
                    <span class="text-indigo-800">2. Thông hiểu (TH):</span>
                    <span class="text-indigo-700 font-mono" x-text="ratioTH + '% (' + ((ratioTH * 10) / 100).toFixed(1) + 'đ)'"></span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="5"
                    x-model.number="ratioTH"
                    @input="handleRatioChange('TH', ratioTH)"
                    class="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <!-- Vận dụng (VD) -->
                <div class="space-y-1">
                  <div class="flex justify-between font-bold">
                    <span class="text-emerald-800">3. Vận dụng (VD):</span>
                    <span class="text-emerald-700 font-mono" x-text="ratioVD + '% (' + ((ratioVD * 10) / 100).toFixed(1) + 'đ)'"></span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    step="5"
                    x-model.number="ratioVD"
                    @input="handleRatioChange('VD', ratioVD)"
                    class="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <!-- Reset standard 40-30-30 -->
                <button
                  @click="resetMatrix()"
                  class="w-full py-1 text-[11px] text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  Khôi phục tỉ lệ chuẩn 40% - 30% - 30%
                </button>
              </div>

              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                Tổng điểm luôn được khóa chặt ở <strong class="text-slate-900">10.0 điểm</strong> theo đúng quy định Bộ GD&ĐT.
              </div>
            </div>

            <!-- Card: Bộ Đếm Số Lượng Câu Hỏi Từng Phần -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-2">
                Bộ Đếm Câu Hỏi Từng Phần
              </h4>

              <div class="space-y-2 text-xs">
                
                <!-- Phần I -->
                <div class="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                  <div>
                    <span class="font-bold text-blue-900 block">Phần I: TN nhiều lựa chọn</span>
                    <span class="text-[11px] text-slate-500">12 câu x 0,25đ</span>
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-black text-sm text-blue-700">3,0 đ</span>
                    <span class="text-[10px] text-slate-400 block">30%</span>
                  </div>
                </div>

                <!-- Phần II -->
                <div class="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 flex items-center justify-between">
                  <div>
                    <span class="font-bold text-indigo-900 block">Phần II: TN Đúng / Sai</span>
                    <span class="text-[11px] text-slate-500">02 câu lớn (8 mệnh đề a, b, c, d)</span>
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-black text-sm text-indigo-700">2,0 đ</span>
                    <span class="text-[10px] text-slate-400 block">20%</span>
                  </div>
                </div>

                <!-- Phần III -->
                <div class="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                  <div>
                    <span class="font-bold text-emerald-900 block">Phần III: Trả lời ngắn</span>
                    <span class="text-[11px] text-slate-500">04 câu x 0,50đ (điền kết quả)</span>
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-black text-sm text-emerald-700">2,0 đ</span>
                    <span class="text-[10px] text-slate-400 block">20%</span>
                  </div>
                </div>

                <!-- Phần IV -->
                <div class="p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between">
                  <div>
                    <span class="font-bold text-amber-900 block">Phần IV: Tự luận</span>
                    <span class="text-[11px] text-slate-500">02 câu tự luận (có barem bước)</span>
                  </div>
                  <div class="text-right">
                    <span class="font-mono font-black text-sm text-amber-700">3,0 đ</span>
                    <span class="text-[10px] text-slate-400 block">30%</span>
                  </div>
                </div>

                <!-- Total -->
                <div class="pt-2 border-t flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>TỔNG CỘNG TOÀN ĐỀ:</span>
                  <span class="text-blue-700 font-black text-base">10,0 Điểm (100%)</span>
                </div>

              </div>
            </div>

            <!-- Download Buttons in Left Column -->
            <div class="space-y-2">
              <button @click="downloadWordExam()" class="w-full p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition text-center">
                Tải file Word chuẩn Bộ GD&ĐT (.doc)
              </button>
              <button @click="downloadWordMatrix()" class="w-full p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition text-center">
                Tải Ma Trận Đặc Tả (.doc)
              </button>
            </div>

          </div>

          <!-- ===================================================================
               BÊN PHẢI: LIVE DOCUMENT HIỂN THỊ ĐÚNG 4 PHẦN (8 COLS)
               =================================================================== -->
          <div class="lg:col-span-8 bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-md text-slate-800 leading-relaxed font-sans text-sm space-y-8">
            
            <!-- Document Header -->
            <div class="grid grid-cols-2 text-center pb-6 border-b border-slate-300">
              <div>
                <p class="font-bold text-xs uppercase text-slate-700">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
                <p class="font-bold text-xs uppercase text-blue-800" x-text="state.khbd.schoolName"></p>
                <p class="font-bold text-xs text-slate-600 mt-1" x-text="state.exam.examCode"></p>
                <div class="w-16 h-0.5 bg-slate-400 mx-auto mt-1"></div>
              </div>
              <div>
                <h1 class="font-bold text-sm uppercase text-slate-900" x-text="state.exam.examTitle"></h1>
                <p class="font-bold text-xs text-blue-800" x-text="'MÔN THI: ' + state.exam.subject.toUpperCase() + ' - ' + state.exam.grade.toUpperCase()"></p>
                <p class="text-xs text-slate-600 italic" x-text="'Thời gian làm bài: ' + state.exam.durationMinutes + ' phút (không kể thời gian phát đề)'"></p>
                <div class="w-24 h-0.5 bg-slate-400 mx-auto mt-1"></div>
              </div>
            </div>

            <!-- Student Info -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex justify-between">
              <span>Họ và tên thí sinh: ............................................................................</span>
              <span>Lớp: <strong class="text-slate-800" x-text="state.khbd.className || '9A1'"></strong></span>
              <span>Số báo danh: .....................</span>
            </div>

            <!-- ---------------------------------------------------------------
                 PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (3.0đ) KÈM KEY ĐÁP ÁN
                 --------------------------------------------------------------- -->
            <section class="space-y-4">
              <div class="bg-slate-100 p-3 rounded-xl border-l-4 border-blue-600 flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-xs uppercase">
                    PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 ĐIỂM)
                  </h3>
                  <p class="text-xs text-slate-600 italic mt-0.5">
                    Thí sinh trả lời từ Câu 1 đến Câu 12. Mỗi câu hỏi chỉ chọn một phương án đúng nhất (0,25 điểm/câu).
                  </p>
                </div>
                <span class="text-xs bg-white text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
                  12 câu x 0.25đ = 3.0đ
                </span>
              </div>

              <div class="space-y-3">
                <template x-for="(q, idx) in state.exam.part1.questions.slice(0, 12)" :key="q.id">
                  <div class="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <p class="text-xs font-semibold text-slate-900">
                        <span class="font-bold text-blue-700" x-text="'Câu ' + (idx + 1) + ': '"></span>
                        <span x-text="q.text"></span>
                      </p>
                      <span class="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200 shrink-0" x-text="'0.25đ [' + q.level + ']'"></span>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      <template x-for="opt in q.options" :key="opt.key">
                        <div
                          class="p-2 rounded-lg border text-xs flex items-center gap-1.5"
                          :class="showAnswerKeys && opt.key === q.correctAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400' : 'border-slate-200 bg-slate-50/60 text-slate-700'"
                        >
                          <span
                            class="w-5 h-5 rounded-full border font-bold flex items-center justify-center text-[10px] shrink-0"
                            :class="showAnswerKeys && opt.key === q.correctAnswer ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300 text-slate-700'"
                            x-text="opt.key"
                          ></span>
                          <span x-text="opt.text"></span>
                        </div>
                      </template>
                    </div>

                    <!-- Key đáp án & giải thích -->
                    <div x-show="showAnswerKeys" class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span class="font-bold text-emerald-700">
                        Đáp án đúng: <span class="underline" x-text="q.correctAnswer"></span>
                      </span>
                      <span class="text-slate-500 italic truncate max-w-md" x-text="q.explanation"></span>
                    </div>
                  </div>
                </template>
              </div>
            </section>

            <!-- ---------------------------------------------------------------
                 PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (2.0đ)
                 HIỂN THỊ RÕ MỘT CÂU GỐC VÀ 4 MỆNH ĐỀ a, b, c, d VỚI BADGE CHỌN ĐÚNG/SAI TRỰC QUAN
                 --------------------------------------------------------------- -->
            <section class="space-y-4">
              <div class="bg-indigo-900 text-white p-3.5 rounded-xl flex items-center justify-between shadow-xs">
                <div>
                  <h3 class="font-bold text-xs uppercase flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">
                      CỐT LÕI CV 7991
                    </span>
                    PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI (2,0 ĐIỂM)
                  </h3>
                  <p class="text-xs text-indigo-200 mt-0.5">
                    Thí sinh trả lời Câu 1 và Câu 2. Trong mỗi ý a), b), c), d), chọn Đúng (Đ) hoặc Sai (S).
                  </p>
                </div>
                <span class="text-xs bg-indigo-800 text-indigo-100 font-bold px-3 py-1 rounded-lg border border-indigo-700 shrink-0">
                  02 câu x 1.0đ = 2.0đ
                </span>
              </div>

              <!-- Barem chú giải điểm chuẩn CV 7991 -->
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <span class="font-bold text-amber-800">
                  Quy tắc tính điểm chuẩn Công văn 7991/BGDĐT-GDTrH:
                </span>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-[11px] pt-1 font-semibold">
                  <div class="bg-white p-1 rounded border border-amber-200">Đúng 1 ý: <strong>0,10 điểm</strong></div>
                  <div class="bg-white p-1 rounded border border-amber-200">Đúng 2 ý: <strong>0,25 điểm</strong></div>
                  <div class="bg-white p-1 rounded border border-amber-200">Đúng 3 ý: <strong>0,50 điểm</strong></div>
                  <div class="bg-white p-1 rounded border border-amber-200">Đúng 4 ý: <strong>1,00 điểm</strong></div>
                </div>
              </div>

              <!-- Câu hỏi Đúng/Sai -->
              <div class="space-y-5">
                <template x-for="(q, qIdx) in state.exam.part2.questions.slice(0, 2)" :key="q.id">
                  <div class="p-4 bg-white border border-indigo-200 rounded-xl shadow-xs space-y-3">
                    
                    <!-- Câu gốc (Stem) -->
                    <div class="flex items-start justify-between gap-3">
                      <p class="text-xs font-bold text-slate-900 leading-relaxed">
                        <span class="text-indigo-700 font-black" x-text="'Câu ' + (qIdx + 1) + ' (Câu gốc): '"></span>
                        <span x-text="q.stem"></span>
                      </p>
                      <span class="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                        Tối đa: 1,0đ
                      </span>
                    </div>

                    <!-- 4 Mệnh đề a, b, c, d với badge chọn Đúng/Sai trực quan -->
                    <div class="overflow-x-auto rounded-lg border border-slate-200">
                      <table class="w-full text-xs text-left bg-white">
                        <thead class="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold">
                          <tr>
                            <th class="p-2.5 w-3/4">Mệnh đề khẳng định</th>
                            <th class="p-2.5 w-1/8 text-center border-l">Chọn Đúng</th>
                            <th class="p-2.5 w-1/8 text-center border-l">Chọn Sai</th>
                            <th class="p-2.5 w-1/8 text-center border-l bg-indigo-50/50">Đáp án</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                          <template x-for="st in q.statements" :key="st.subId">
                            <tr class="hover:bg-slate-50">
                              <td class="p-2.5 text-slate-800">
                                <span class="font-bold text-indigo-800 mr-1.5" x-text="st.subId + ')'"></span>
                                <span x-text="st.text"></span>
                                <span class="ml-1.5 text-[10px] text-slate-400 font-mono" x-text="'[' + st.level + ']'"></span>
                              </td>

                              <!-- Button Choose TRUE -->
                              <td class="p-2 text-center border-l">
                                <button
                                  @click="toggleUserChoicePart2(q.id, st.subId, true)"
                                  :class="getUserChoice(q.id, st.subId) === true ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
                                  class="w-7 h-7 rounded-md font-bold text-xs transition"
                                >
                                  Đ
                                </button>
                              </td>

                              <!-- Button Choose FALSE -->
                              <td class="p-2 text-center border-l">
                                <button
                                  @click="toggleUserChoicePart2(q.id, st.subId, false)"
                                  :class="getUserChoice(q.id, st.subId) === false ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
                                  class="w-7 h-7 rounded-md font-bold text-xs transition"
                                >
                                  S
                                </button>
                              </td>

                              <!-- Official Answer Badge -->
                              <td class="p-2 text-center border-l bg-indigo-50/30">
                                <span
                                  class="px-2 py-0.5 rounded text-[11px] font-bold"
                                  :class="st.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                                  x-text="st.isCorrect ? 'ĐÚNG' : 'SAI'"
                                ></span>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>

                    <!-- Interactive Scorer Simulator for Part II -->
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <span class="text-slate-600 font-medium">
                        Điểm thực tế theo công thức CV 7991:
                      </span>
                      <span class="font-bold text-indigo-900 bg-white px-2.5 py-1 rounded border border-indigo-200 shadow-xs">
                        Điểm đạt được: <strong class="text-blue-700" x-text="calculatePart2Score(q.id).toFixed(2)"></strong> / 1,0 điểm
                      </span>
                    </div>

                  </div>
                </template>
              </div>
            </section>

            <!-- ---------------------------------------------------------------
                 PHẦN III: TRẢ LỜI NGẮN (2.0đ) CÓ Ô ĐIỀN KẾT QUẢ NHANH
                 --------------------------------------------------------------- -->
            <section class="space-y-4">
              <div class="bg-slate-100 p-3 rounded-xl border-l-4 border-emerald-600 flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-xs uppercase">
                    PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 ĐIỂM)
                  </h3>
                  <p class="text-xs text-slate-600 italic mt-0.5">
                    Thí sinh trả lời từ Câu 1 đến Câu 4. Điền kết quả tìm được vào ô trống tương ứng (0,50 điểm/câu).
                  </p>
                </div>
                <span class="text-xs bg-white text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
                  04 câu x 0.50đ = 2.0đ
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <template x-for="(q, idx) in state.exam.part3.questions.slice(0, 4)" :key="q.id">
                  <div class="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-xs font-semibold text-slate-900">
                        <span class="font-bold text-emerald-700" x-text="'Câu ' + (idx + 1) + ': '"></span>
                        <span x-text="q.text"></span>
                      </p>
                      <span class="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 shrink-0" x-text="'0.5đ [' + q.level + ']'"></span>
                    </div>

                    <!-- Ô điền kết quả nhanh -->
                    <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <span class="text-slate-500 italic">Ô điền kết quả nhanh:</span>
                      <input
                        type="text"
                        placeholder="Nhập số/kết quả..."
                        :value="showAnswerKeys ? q.correctAnswer : ''"
                        class="w-32 text-center font-mono font-bold text-emerald-800 bg-white border border-slate-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div x-show="showAnswerKeys" class="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                      Hướng dẫn: <span x-text="q.explanation"></span>
                    </div>
                  </div>
                </template>
              </div>
            </section>

            <!-- ---------------------------------------------------------------
                 PHẦN IV: TỰ LUẬN (3.0đ) KÈM BAREM CHẤM TỪNG BƯỚC
                 --------------------------------------------------------------- -->
            <section class="space-y-4">
              <div class="bg-slate-100 p-3 rounded-xl border-l-4 border-amber-600 flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-slate-900 text-xs uppercase">
                    PHẦN IV. CÂU HỎI TỰ LUẬN (3,0 ĐIỂM)
                  </h3>
                  <p class="text-xs text-slate-600 italic mt-0.5">
                    Thí sinh trình bày chi tiết các bước giải bài toán vào tờ giấy thi.
                  </p>
                </div>
                <span class="text-xs bg-white text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs shrink-0">
                  02 câu x 1.50đ = 3.0đ
                </span>
              </div>

              <div class="space-y-4">
                <template x-for="(q, idx) in part4Questions" :key="q.id">
                  <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-xs font-semibold text-slate-900 leading-relaxed">
                        <span class="font-bold text-amber-700" x-text="q.code + ': '"></span>
                        <span x-text="q.text"></span>
                      </p>
                      <span class="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200 shrink-0" x-text="q.score + 'đ [' + q.level + ']'"></span>
                    </div>

                    <!-- Barem chấm từng bước chi tiết -->
                    <div x-show="showAnswerKeys" class="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-1.5">
                      <span class="font-bold text-amber-900 block border-b border-amber-200 pb-1" x-text="'Barem Chấm Điểm Chi Tiết Từng Bước (Tổng ' + q.score + 'đ):'"></span>
                      <div class="space-y-1 text-slate-700">
                        <template x-for="(step, sIdx) in q.rubricSteps" :key="sIdx">
                          <div class="flex justify-between items-start py-1 border-b border-amber-100 last:border-none">
                            <span class="leading-snug" x-text="'• ' + step.stepDescription"></span>
                            <span class="font-bold text-amber-800 font-mono ml-3 shrink-0" x-text="'+' + step.score + 'đ'"></span>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </section>

            <!-- Document Footer -->
            <div class="text-center pt-6 border-t border-slate-300">
              <p class="font-bold text-xs uppercase text-slate-700">----------------- HẾT -----------------</p>
              <p class="text-xs text-slate-500 italic mt-1">
                Thí sinh không được sử dụng tài liệu. Cán bộ coi thi không giải thích gì thêm.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- =========================================================================
           JSON STATE SESSION HANDOFF (BÀN GIAO PHIÊN LÀM VIỆC TIẾP THEO)
           ========================================================================= -->
      <footer class="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl border border-slate-800 no-print space-y-3">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400">JSON STATE HANDOFF (BÀN GIAO PHIÊN LÀM VIỆC)</h4>
          </div>
          <button @click="copyJsonState()" class="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg border border-slate-700 font-semibold transition">
            Sao chép JSON State
          </button>
        </div>
        <p class="text-xs text-slate-400">
          Khối dữ liệu trạng thái phiên làm việc chứa toàn bộ thông số chuẩn CV 5512, bộ Slide bài giảng và Đề kiểm tra chuẩn CV 7991:
        </p>
        <pre class="bg-black/60 p-3 rounded-xl text-[11px] overflow-x-auto text-emerald-300 font-mono max-h-48 border border-slate-800" x-text="JSON.stringify(state, null, 2)"></pre>
      </footer>

    </main>

  </div>

  <script>
    function edtechApp() {
      return {
        currentTab: 'khbd', // Default on KHBD 5512 or Scope 3
        activeSlideIndex: 0,
        isFullscreen: false,
        timerSeconds: 0,
        timerRunning: false,
        showAnswerKeys: true,
        ratioNB: 40,
        ratioTH: 30,
        ratioVD: 30,
        userChoicesPart2: {
          'p2-q1': { a: true, b: true, c: false, d: true },
          'p2-q2': { a: true, b: true, c: false, d: true }
        },
        formatTime(seconds) {
          const m = Math.floor(seconds / 60).toString().padStart(2, '0');
          const s = (seconds % 60).toString().padStart(2, '0');
          return m + ':' + s;
        },
        init() {
          setInterval(() => {
            if (this.timerRunning) {
              this.timerSeconds++;
            }
          }, 1000);
        },
        // Chuyển Đổi Nhanh KHBD Thành Slide 16:9 với các thẻ trực quan hóa
        quickConvertKHBDToSlides() {
          const activities = this.state.khbd.activities || [];
          const generatedSlides = activities.map((act, index) => {
            const phaseName = index === 0 ? 'Khởi động' : index === 1 ? 'Khám phá' : index === 2 ? 'Luyện tập' : 'Vận dụng';
            return {
              id: 'slide-gen-' + (index + 1),
              title: act.title || ('Hoạt động ' + (index + 1)),
              subtitle: 'Hoạt động ' + (index + 1) + ' (' + phaseName + ') • Thời lượng: ' + (act.durationMinutes || 10) + ' phút',
              phase: phaseName,
              activityRef: 'hd' + (index + 1),
              layout: 'two-column',
              bullets: [
                'Mục tiêu: ' + act.objective,
                'Nội dung: ' + act.content,
                'Sản phẩm: ' + act.product
              ],
              knowledgeCards: [
                {
                  title: 'a) Mục tiêu cần đạt',
                  content: act.objective,
                  badge: 'Mục tiêu',
                  color: 'blue'
                },
                {
                  title: 'b) Nhiệm vụ & Nội dung học tập',
                  content: act.content,
                  badge: 'Nội dung',
                  color: 'indigo'
                },
                {
                  title: 'c) Sản phẩm & Kết quả học tập',
                  content: act.product,
                  badge: 'Sản phẩm',
                  color: 'emerald'
                },
                {
                  title: 'd) Hướng dẫn tổ chức thực hiện',
                  content: act.steps && act.steps[0] ? (act.steps[0].name + ': ' + act.steps[0].teacherAction) : 'Giáo viên điều hành, học sinh thực hiện theo phân công.',
                  badge: 'Tiến trình',
                  color: 'amber'
                }
              ]
            };
          });
          if (generatedSlides.length > 0) {
            this.state.slides = generatedSlides;
          }
          this.currentTab = 'slide';
          this.activeSlideIndex = 0;
        },
        part4Questions: [
          {
            id: 'p4-q1',
            code: 'Câu 1 (Tự luận)',
            text: 'Giải bài toán thực tế: Một người thợ thủ công cần làm một chiếc hộp hình chữ nhật có thể tích V = 4 m³, đáy có chiều dài gấp đôi chiều rộng. Tìm kích thước của hộp để diện tích toàn phần là nhỏ nhất.',
            score: 1.5,
            level: 'VD',
            rubricSteps: [
              { stepDescription: 'Gọi chiều rộng đáy là x (m, x > 0). Chiều dài 2x và chiều cao h = 2/x².', score: 0.5 },
              { stepDescription: 'Lập hàm diện tích toàn phần S(x) = 4x² + 12/x và tính đạo hàm S\\'(x) = 8x - 12/x².', score: 0.5 },
              { stepDescription: 'Cho S\\'(x) = 0 tìm x = ∛(1.5) m và kết luận kích thước tối ưu đạt giá trị nhỏ nhất.', score: 0.5 }
            ]
          },
          {
            id: 'p4-q2',
            code: 'Câu 2 (Tự luận)',
            text: 'Cho tam giác nhọn ABC nội tiếp đường tròn (O; R). Các đường cao AD, BE, CF cắt nhau tại trực tâm H. Chứng minh rằng tứ giác BCEF là tứ giác nội tiếp và xác định tâm đường tròn đi qua bốn điểm đó.',
            score: 1.5,
            level: 'VD',
            rubricSteps: [
              { stepDescription: 'Chỉ ra góc BEC = 90° và góc BFC = 90° do BE và CF là hai đường cao.', score: 0.5 },
              { stepDescription: 'Lập luận hai đỉnh E và F cùng nhìn đoạn thẳng BC dưới một góc vuông 90°.', score: 0.5 },
              { stepDescription: 'Kết luận tứ giác BCEF nội tiếp đường tròn đường kính BC, tâm là trung điểm BC.', score: 0.5 }
            ]
          }
        ],
        state: ${jsonEscaped},

        // Ratio slider handling locking total to 100% (10.0đ)
        handleRatioChange(type, val) {
          const value = Math.max(10, Math.min(80, val));
          if (type === 'NB') {
            const remaining = 100 - value;
            this.ratioNB = value;
            this.ratioTH = Math.round(remaining / 2);
            this.ratioVD = remaining - this.ratioTH;
          } else if (type === 'TH') {
            const remaining = 100 - value;
            this.ratioTH = value;
            this.ratioNB = Math.round((remaining * 4) / 7);
            this.ratioVD = remaining - this.ratioNB;
          } else {
            const remaining = 100 - value;
            this.ratioVD = value;
            this.ratioNB = Math.round((remaining * 4) / 7);
            this.ratioTH = remaining - this.ratioNB;
          }
        },

        resetMatrix() {
          this.ratioNB = 40;
          this.ratioTH = 30;
          this.ratioVD = 30;
        },

        // Part 2 Choice & Scorer (0.1, 0.25, 0.5, 1.0đ)
        getUserChoice(qId, subId) {
          return this.userChoicesPart2[qId]?.[subId];
        },

        toggleUserChoicePart2(qId, subId, val) {
          if (!this.userChoicesPart2[qId]) {
            this.userChoicesPart2[qId] = {};
          }
          this.userChoicesPart2[qId][subId] = val;
        },

        calculatePart2Score(qId) {
          const question = this.state.exam.part2.questions.find(q => q.id === qId);
          if (!question) return 0;
          const userAns = this.userChoicesPart2[qId] || {};
          let correct = 0;
          question.statements.forEach(st => {
            if (userAns[st.subId] !== undefined && userAns[st.subId] === st.isCorrect) {
              correct++;
            }
          });
          switch (correct) {
            case 1: return 0.10;
            case 2: return 0.25;
            case 3: return 0.50;
            case 4: return 1.00;
            default: return 0.00;
          }
        },

        // Copy JSON State
        copyJsonState() {
          navigator.clipboard.writeText(JSON.stringify(this.state, null, 2));
          alert('Đã sao chép toàn bộ JSON State vào Clipboard!');
        },

        // Export Word Exam (.doc) directly inside browser
        downloadWordExam() {
          const exam = this.state.exam;
          const khbd = this.state.khbd;
          const content = \`
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>\${exam.examTitle}</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
    h2 { font-size: 13pt; margin-top: 14px; margin-bottom: 4px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #000; padding-bottom: 2px; }
    p, li { text-align: justify; margin: 3px 0; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table, th, td { border: 1px solid #000; }
    th, td { padding: 5px 8px; vertical-align: top; }
    th { background-color: #f1f5f9; }
    .header-tbl { border: none !important; margin-bottom: 15px; }
    .header-tbl td { border: none !important; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
  </style>
</head>
<body>
  <table class="header-tbl" style="width: 100%;">
    <tr>
      <td style="width: 45%; text-align: center;">
        <span class="bold">SỞ GIÁO DỤC VÀ ĐÀO TẠO</span><br>
        <span class="bold">\${khbd.schoolName.toUpperCase()}</span><br>
        <span>\${exam.examCode}</span>
      </td>
      <td style="width: 55%; text-align: center;">
        <span class="bold">\${exam.examTitle.toUpperCase()}</span><br>
        <span class="bold">MÔN THI: \${exam.subject.toUpperCase()} - \${exam.grade.toUpperCase()}</span><br>
        <span class="italic">Thời gian làm bài: \${exam.durationMinutes} phút</span>
      </td>
    </tr>
  </table>

  <h2>PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 ĐIỂM)</h2>
  <p class="italic">Thí sinh trả lời từ Câu 1 đến Câu 12. Mỗi câu hỏi chỉ chọn một phương án đúng nhất (0,25đ/câu).</p>
  \${exam.part1.questions.slice(0, 12).map((q, idx) => \`
    <div style="margin-top: 8px;">
      <p><strong>Câu \${idx + 1}:</strong> \${q.text} (0.25đ - Mức \${q.level})</p>
      <table style="border: none; margin: 4px 0;">
        <tr style="border: none;">
          \${q.options.map(opt => \`<td style="border: none; width: 25%;"><strong>\${opt.key}.</strong> \${opt.text}</td>\`).join('')}
        </tr>
      </table>
    </div>
  \`).join('')}

  <h2>PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI (2,0 ĐIỂM - CHUẨN CV 7991)</h2>
  <p class="italic">Thí sinh trả lời Câu 1 và Câu 2. Trong mỗi ý a), b), c), d), chọn Đúng hoặc Sai (Tối đa 1,0đ/câu).</p>
  \${exam.part2.questions.slice(0, 2).map((q, qIdx) => \`
    <div style="margin-top: 10px;">
      <p><strong>Câu \${qIdx + 1} (Câu gốc):</strong> \${q.stem} (Tối đa 1,0 điểm)</p>
      <table style="width: 100%; margin-top: 4px;">
        <thead>
          <tr>
            <th style="width: 75%;">Mệnh đề khẳng định</th>
            <th style="width: 12%; text-align: center;">Đúng</th>
            <th style="width: 13%; text-align: center;">Sai</th>
          </tr>
        </thead>
        <tbody>
          \${q.statements.map(st => \`
            <tr>
              <td><strong>\${st.subId})</strong> \${st.text} <em>[\${st.level}]</em></td>
              <td style="text-align: center;">[ ]</td>
              <td style="text-align: center;">[ ]</td>
            </tr>
          \`).join('')}
        </tbody>
      </table>
    </div>
  \`).join('')}

  <h2>PHẦN III. TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 ĐIỂM)</h2>
  <p class="italic">Thí sinh trả lời từ Câu 1 đến Câu 4 (0,50đ/câu).</p>
  \${exam.part3.questions.slice(0, 4).map((q, idx) => \`
    <div style="margin-top: 8px;">
      <p><strong>Câu \${idx + 1}:</strong> \${q.text} (0.50đ - Mức \${q.level})</p>
      <p><em>Đáp số: ........................................................................................</em></p>
    </div>
  \`).join('')}

  <h2>PHẦN IV. TỰ LUẬN (3,0 ĐIỂM)</h2>
  <p class="italic">Thí sinh trình bày chi tiết các bước giải bài toán vào tờ giấy thi.</p>
  \${this.part4Questions.map((q) => \`
    <div style="margin-top: 8px;">
      <p><strong>\${q.code}:</strong> \${q.text} (\${q.score}đ - Mức \${q.level})</p>
    </div>
  \`).join('')}

  <p class="bold" style="text-align: center; margin-top: 25px;">----------------- HẾT -----------------</p>

  <div style="page-break-before: always; margin-top: 30px;">
    <h1>HƯỚNG DẪN CHẤM & BAREM ĐIỂM CHI TIẾT (CHUẨN CV 7991)</h1>
    <h2>1. ĐÁP ÁN PHẦN I (3.0 điểm)</h2>
    <table>
      <tr>\${exam.part1.questions.slice(0, 12).map((q, idx) => \`<th>Câu \${idx + 1}</th>\`).join('')}</tr>
      <tr>\${exam.part1.questions.slice(0, 12).map(q => \`<td style="text-align: center; font-weight: bold; color: #2563eb;">\${q.correctAnswer}</td>\`).join('')}</tr>
    </table>

    <h2>2. ĐÁP ÁN PHẦN II (2.0 điểm - Điểm 1 ý: 0.1đ | 2 ý: 0.25đ | 3 ý: 0.5đ | 4 ý: 1.0đ)</h2>
    <table>
      <thead>
        <tr><th>Câu hỏi</th><th>Lệnh a)</th><th>Lệnh b)</th><th>Lệnh c)</th><th>Lệnh d)</th></tr>
      </thead>
      <tbody>
        \${exam.part2.questions.slice(0, 2).map((q, qIdx) => \`
          <tr>
            <td><strong>Câu \${qIdx + 1}</strong></td>
            \${q.statements.map(st => \`<td style="text-align: center; font-weight: bold; color: \${st.isCorrect ? 'green' : 'red'};">\${st.isCorrect ? 'ĐÚNG' : 'SAI'}</td>\`).join('')}
          </tr>
        \`).join('')}
      </tbody>
    </table>

    <h2>3. ĐÁP ÁN PHẦN III (2.0 điểm)</h2>
    <table>
      <thead>
        <tr><th>Câu hỏi</th><th>Đáp án</th><th>Điểm</th><th>Hướng dẫn</th></tr>
      </thead>
      <tbody>
        \${exam.part3.questions.slice(0, 4).map((q, idx) => \`
          <tr>
            <td><strong>Câu \${idx + 1}</strong></td>
            <td style="font-weight: bold; color: #2563eb;">\${q.correctAnswer}</td>
            <td>0.5đ</td>
            <td>\${q.explanation}</td>
          </tr>
        \`).join('')}
      </tbody>
    </table>

    <h2>4. BAREM BƯỚC PHẦN IV (3.0 điểm)</h2>
    \${this.part4Questions.map(q => \`
      <p><strong>\${q.code}:</strong> \${q.text}</p>
      <table>
        <thead><tr><th style="width: 80%;">Nội dung các bước giải</th><th style="width: 20%; text-align: center;">Điểm</th></tr></thead>
        <tbody>
          \${q.rubricSteps.map(step => \`<tr><td>\${step.stepDescription}</td><td style="text-align: center; font-weight: bold;">\${step.score}đ</td></tr>\`).join('')}
          <tr><td style="font-weight: bold; text-align: right;">TỔNG ĐIỂM:</td><td style="text-align: center; font-weight: bold; color: #2563eb;">\${q.score}đ</td></tr>
        </tbody>
      </table>
    \`).join('')}
  </div>
</body>
</html>\`;
          const blob = new Blob([content], { type: 'application/msword' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = \`DE_THI_7991_\${exam.subject}_\${exam.grade}.doc\`;
          a.click();
          URL.revokeObjectURL(url);
        },

        // Export Matrix Specification Word (.doc)
        downloadWordMatrix() {
          const exam = this.state.exam;
          const khbd = this.state.khbd;
          const content = \`
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>MA TRẬN ĐẶC TẢ ĐỀ KIỂM TRA 7991</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; color: #000; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table, th, td { border: 1px solid #000; }
    th, td { padding: 6px 8px; vertical-align: middle; }
    th { background-color: #f1f5f9; text-align: center; font-weight: bold; }
    .center { text-align: center; }
    .bold { font-weight: bold; }
  </style>
</head>
<body>
  <h1>BẢNG MA TRẬN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KỲ</h1>
  <p style="text-align: center; font-style: italic;">
    Căn cứ Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ Giáo dục và Đào tạo<br>
    Môn: \${exam.subject} - \${exam.grade} | Thời gian: \${exam.durationMinutes} phút | Tổng điểm: 10.0 điểm
  </p>

  <h2>KHUNG MA TRẬN TỔNG QUÁT (TỈ LỆ \${this.ratioNB}% NB - \${this.ratioTH}% TH - \${this.ratioVD}% VD)</h2>
  <table>
    <thead>
      <tr>
        <th>TT</th><th>Cấu trúc các phần của đề thi</th><th>Nhận biết (\${this.ratioNB}%)</th><th>Thông hiểu (\${this.ratioTH}%)</th><th>Vận dụng (\${this.ratioVD}%)</th><th>Tổng số câu</th><th>Tổng điểm</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="center">1</td><td>Phần I: TN nhiều lựa chọn (0.25đ/câu)</td><td class="center">6 câu (1.5đ)</td><td class="center">6 câu (1.5đ)</td><td class="center">0 câu (0.0đ)</td><td class="center bold">12 câu</td><td class="center bold">3.0 điểm</td>
      </tr>
      <tr>
        <td class="center">2</td><td>Phần II: TN Đúng / Sai (2 câu x 4 ý)</td><td class="center">4 ý (1.0đ)</td><td class="center">4 ý (1.0đ)</td><td class="center">0 ý (0.0đ)</td><td class="center bold">02 câu (8 ý)</td><td class="center bold">2.0 điểm</td>
      </tr>
      <tr>
        <td class="center">3</td><td>Phần III: TN trả lời ngắn (0.50đ/câu)</td><td class="center">2 câu (1.0đ)</td><td class="center">1 câu (0.5đ)</td><td class="center">1 câu (0.5đ)</td><td class="center bold">04 câu</td><td class="center bold">2.0 điểm</td>
      </tr>
      <tr>
        <td class="center">4</td><td>Phần IV: Tự luận (chấm theo bước)</td><td class="center">0 câu (0.0đ)</td><td class="center">0 câu (0.0đ)</td><td class="center">2 câu (3.0đ)</td><td class="center bold">02 câu</td><td class="center bold">3.0 điểm</td>
      </tr>
      <tr style="background-color: #f8fafc; font-weight: bold;">
        <td colspan="2" class="center">TỔNG CỘNG TOÀN ĐỀ:</td>
        <td class="center">\${((this.ratioNB * 10) / 100).toFixed(1)}đ (\${this.ratioNB}%)</td>
        <td class="center">\${((this.ratioTH * 10) / 100).toFixed(1)}đ (\${this.ratioTH}%)</td>
        <td class="center">\${((this.ratioVD * 10) / 100).toFixed(1)}đ (\${this.ratioVD}%)</td>
        <td class="center">20 câu</td>
        <td class="center text-blue-700">10.0 Điểm (100%)</td>
      </tr>
    </tbody>
  </table>
</body>
</html>\`;
          const blob = new Blob([content], { type: 'application/msword' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = \`MA_TRAN_DAC_TA_7991_\${exam.subject}_\${exam.grade}.doc\`;
          a.click();
          URL.revokeObjectURL(url);
        }
      };
    }
  </script>
</body>
</html>`;
}

// Browser file download helper
export function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download Standalone HTML directly
export function downloadStandaloneHTMLFile(state: WorkspaceState) {
  const html = generateStandaloneOfflineHTML(state);
  const fileName = `EduMaster_${state.khbd.subject}_Lop${state.khbd.grade.replace(/[^0-9]/g, '')}_Offline.html`;
  downloadBlob(html, fileName, 'text/html;charset=utf-8');
}
