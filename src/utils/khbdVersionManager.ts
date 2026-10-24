import { KHBDData, WorkspaceState } from '../types/edtech';

export interface KHBDVersionRecord {
  versionId: string; // e.g. "v1.0", "v1.1", "v2.0"
  versionName: string; // e.g. "Phiên bản v1.1 - Cập nhật theo Prompt chuẩn CV 5512"
  createdAt: string;
  promptUsed: string;
  referenceFile: string;
  summary: string;
  khbdSnapshot: KHBDData;
}

const STORAGE_KEY_VERSIONS = 'edtech_khbd_version_history';

export function getStoredVersionHistory(): KHBDVersionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VERSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading version history', e);
  }
  return [];
}

export function saveStoredVersionHistory(history: KHBDVersionRecord[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_VERSIONS, JSON.stringify(history));
      window.dispatchEvent(new CustomEvent('khbd-versions-updated', { detail: history }));
    } catch (e) {
      console.warn('Error saving version history', e);
    }
  }
}

// Generate updated KHBD Data based on prompt & reference form
export function generateUpdatedKHBDFromPrompt(
  currentKHBD: KHBDData,
  prompt: string,
  referenceFile: string,
  newVersionTag: string
): { updatedKHBD: KHBDData; summary: string } {
  const isSTEM = prompt.toLowerCase().includes('stem') || prompt.toLowerCase().includes('thực tiễn');
  const isDifferentiated = prompt.toLowerCase().includes('phân hóa') || prompt.toLowerCase().includes('mở rộng');
  const isQuick45Min = prompt.toLowerCase().includes('45') || prompt.toLowerCase().includes('rút gọn');

  const updatedKHBD: KHBDData = JSON.parse(JSON.stringify(currentKHBD));

  // Update knowledge and objectives based on prompt
  if (isSTEM) {
    updatedKHBD.objectives.knowledge.push(
      `Vận dụng kiến thức bài học để giải quyết bài toán thực tế đời sống theo form mẫu tệp ${referenceFile}.`
    );
    updatedKHBD.objectives.coreCompetencies.push(
      'Năng lực sáng tạo và mô hình hóa toán học: Đề xuất phương án đo đạc và tính toán thực nghiệm.'
    );
  } else if (isDifferentiated) {
    updatedKHBD.objectives.knowledge.push(
      'Phát triển tư duy phân hóa: Học sinh khá giỏi hoàn thành bài toán mở rộng và câu hỏi tư duy logic cao.'
    );
    updatedKHBD.objectives.subjectCompetencies.push(
      'Năng lực tư duy phản biện: Phân tích và phản biện các hướng giải khác nhau của bài toán.'
    );
  } else {
    updatedKHBD.objectives.knowledge.push(
      `Đạt chuẩn đầu ra theo Công văn 5512/BGDĐT và bám sát cấu trúc sư phạm của tệp ${referenceFile}.`
    );
  }

  const isVipRef = referenceFile.includes('KHBD_TOAN9') || referenceFile.includes('VIP') || referenceFile.includes('PL1_PL3') || currentKHBD.lessonName.includes('Bài 2');

  // Update activities based on prompt and reference form
  if (isVipRef) {
    updatedKHBD.objectives.knowledge = [
      'Hiểu được quy tắc cộng đại số và các bước giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp cộng đại số.',
      'Vận dụng thành thạo phương pháp cộng đại số giải hệ hai phương trình trong 2 trường hợp: Hệ số bằng nhau (trừ từng vế) hoặc đối nhau (cộng từng vế); Hệ số khác nhau (nhân hai vế cân bằng hệ số).',
      'Sử dụng MTCT (Casio fx-580VN X / fx-880BTG) kiểm tra nghiệm chính xác.'
    ];

    updatedKHBD.activities = [
      {
        id: 'act-v-1',
        code: 'hd1',
        title: 'Hoạt động 1: Mở đầu / Khởi động (Tiếp cận Quy tắc cộng đại số)',
        durationMinutes: 5,
        objective: 'Kích hoạt nhu cầu tìm phương pháp giải hệ nhanh hơn phương pháp thế khi hệ số đối hoặc bằng nhau.',
        content: 'Xét hệ phương trình: { 2x + y = 4 (1) ; x - y = 1 (2) }. Nhiệm vụ 1: Giải hệ bằng phương pháp thế. Nhiệm vụ 2: Quan sát hệ số của y (+1 và -1), thử cộng từng vế của hai phương trình để xem điều gì xảy ra.',
        product: 'HS giải ra nghiệm (5/3; 2/3) bằng cả hai cách và nhận xét: Cách cộng từng vế giúp triệt tiêu ẩn y ngay lập tức (3x = 5 <=> x = 5/3), nhanh và ít nhầm lẫn hơn so với phương pháp thế.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'GV trình chiếu hệ { 2x + y = 4 ; x - y = 1 }. Yêu cầu dãy 1 giải bằng thế, dãy 2 thử cộng từng vế hai phương trình. Thời gian 2 phút.',
            studentAction: 'Dãy 1 rút ẩn x = y + 1 thế vào pt 1. Dãy 2 lấy vế trái cộng vế trái: (2x + y) + (x - y) = 3x, vế phải cộng vế phải: 4 + 1 = 5.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Quan sát học sinh thao tác trên giấy nháp. Nhắc nhở dãy 2 chú ý dấu khi cộng (+y + (-y) = 0).',
            studentAction: 'Học sinh dãy 2 phát hiện ẩn y bị triệt tiêu, thu được 3x = 5 => x = 5/3. Thay vào tìm y = 2/3.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Mời 2 đại diện lên bảng (1 em giải thế, 1 em thực hiện cộng từng vế). Cho cả lớp so sánh thời gian và độ phức tạp.',
            studentAction: 'HS nhận xét: Cách cộng từng vế nhanh hơn rất nhiều, không phải quy đồng mẫu số phức tạp.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'GV chuẩn hóa: Phép biến đổi cộng từng vế để triệt tiêu một ẩn chính là "Quy tắc cộng đại số". Phương pháp này rất mạnh khi hệ số của một ẩn bằng nhau hoặc đối nhau -> Dẫn dắt vào Tiết 2.',
            studentAction: 'Ghi tựa bài mới: Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn bằng phương pháp cộng đại số (Tiết 2).'
          }
        ]
      },
      {
        id: 'act-v-2',
        code: 'hd2',
        title: 'Hoạt động 2: Hình thành kiến thức mới (Quy tắc cộng đại số & Phân dạng TH1 - TH2)',
        durationMinutes: 20,
        objective: 'Nắm vững quy tắc 2 bước cộng đại số; giải thành thạo TH1 (hệ số bằng/đối) và TH2 (nhân cân bằng hệ số) qua Ví dụ 2, 3, 4 SGK KNTT.',
        content: '1. Khung quy tắc 2 bước SGK KNTT trang 10 (Bước 1: Cộng/trừ từng vế; Bước 2: Giải pt một ẩn rồi suy ra nghiệm).\n2. TH1 (Hệ số bằng nhau hoặc đối nhau):\n   - Ví dụ 2: Giải hệ { 2x + 3y = 7 (1) ; 2x - y = -1 (2) }. Trừ từng vế: 4y = 8 <=> y = 2 => x = 1/2. Nghiệm (1/2; 2).\n   - Ví dụ 3: Giải hệ { 3x - 2y = 4 (1) ; 2x + 2y = 6 (2) }. Cộng từng vế: 5x = 10 <=> x = 2 => y = 1. Nghiệm (2; 1).\n3. TH2 (Hệ số không bằng nhau và không đối nhau):\n   - Ví dụ 4: Giải hệ { 3x + 2y = 7 (1) ; 2x + 3y = 3 (2) }. Nhân (1) với 2, nhân (2) với 3 đưa về { 6x + 4y = 14 ; 6x + 9y = 9 }. Trừ từng vế: 5y = -5 <=> y = -1 => x = 3. Nghiệm (3; -1).',
        product: 'Sơ đồ quy tắc trong vở; lời giải chi tiết Ví dụ 2, 3, 4 với đầy đủ các bước lập luận, tương đương và kết luận nghiệm; ghi nhớ: Bằng nhau -> Trừ; Đối nhau -> Cộng; Khác nhau -> Nhân cân bằng hệ số.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Phát Phiếu học tập số 1. Yêu cầu nhóm 4 HS đọc mục 2 SGK KNTT (trang 10-12) và hoàn thành các câu hỏi hướng dẫn giải Ví dụ 2, Ví dụ 3, Ví dụ 4.',
            studentAction: 'Nhận phiếu học tập số 1, bầu nhóm trưởng điều phối và thư ký ghi chép.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Quan sát các nhóm thảo luận. Lưu ý học sinh quy tắc đổi dấu khi trừ cụm (2x - y) trong Ví dụ 2: -(2x - y) = -2x + y, nên 3y - (-y) = 4y. Hướng dẫn nhóm gặp khó khăn ở Ví dụ 4 cách tìm BCNN của 3 và 2 là 6 để nhân cân bằng hệ số.',
            studentAction: 'Học sinh thực hiện giải chi tiết vào phiếu. Đối chiếu cách nhân cân bằng hệ số của ẩn x hoặc ẩn y.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Gọi đại diện nhóm 1 trình bày Ví dụ 2, nhóm 3 trình bày Ví dụ 3, nhóm 5 trình bày Ví dụ 4 lên bảng.',
            studentAction: 'Đại diện nhóm báo cáo các bước giải. Các nhóm khác nhận xét, đặt câu hỏi về việc tại sao Ví dụ 2 lại trừ mà Ví dụ 3 lại cộng.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'GV chuẩn hóa bảng quy tắc vàng:\n• Hệ số bằng nhau => TRỪ từng vế hai phương trình.\n• Hệ số đối nhau => CỘNG từng vế hai phương trình.\n• Hệ số khác nhau => NHÂN cả hai vế với số thích hợp để đưa về bằng hoặc đối nhau (thường chọn BCNN).',
            studentAction: 'Ghi khung kiến thức trọng tâm vào vở ghi lý thuyết.'
          }
        ]
      },
      {
        id: 'act-v-3',
        code: 'hd3',
        title: 'Hoạt động 3: Luyện tập (Củng cố kỹ năng qua Luyện tập 2, 3, Bài 1.6 & Bấm máy MTCT)',
        durationMinutes: 13,
        objective: 'Rèn luyện phản xạ tính toán chính xác, kỹ năng giải hệ phương trình bằng cộng đại số qua Luyện tập 2, Luyện tập 3, Bài 1.6 SGK KNTT và bấm máy tính Casio kiểm tra.',
        content: '1. Luyện tập 2 (trang 11 SGK KNTT): Giải hệ { 3x + 2y = 6 ; 2x - 2y = 14 }.\n2. Luyện tập 3 (trang 12 SGK KNTT): Giải hệ { 4x + 3y = 6 ; 2x + y = 4 }.\n3. Bài 1.6 (trang 12 SGK KNTT):\n   a) { x - y = 8 ; x + y = 2 }\n   b) { 3x + y = 3 ; 2x - y = 7 }.\n4. Thực hành bấm MTCT Casio fx-580VN X (MENU 9 1 2) kiểm tra nghiệm.',
        product: 'Bài giải chuẩn mực trong vở:\n- LT2: Cộng hai vế được 5x = 20 <=> x = 4 => y = -3. Nghiệm (4; -3).\n- LT3: Nhân pt (2) với 2: { 4x + 3y = 6 ; 4x + 2y = 8 }. Trừ từng vế: y = -2 => x = 3. Nghiệm (3; -2).\n- Bài 1.6a: Cộng hai vế: 2x = 10 <=> x = 5 => y = -3. Nghiệm: (5; -3).\n- Bài 1.6b: Cộng hai vế: 5x = 10 <=> x = 2 => y = -3. Nghiệm: (2; -3).',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Giao 4 bài tập: Tổ 1 làm LT2; Tổ 2 làm LT3; Tổ 3 làm Bài 1.6a; Tổ 4 làm Bài 1.6b. Thời gian 5 phút. Sau đó dùng MTCT kiểm tra lại nghiệm.',
            studentAction: 'Học sinh làm việc độc lập vào vở bài tập, chuẩn bị đổi vở kiểm tra chéo.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Bao quát lớp, hướng dẫn thao tác phím MTCT Casio: MENU -> 9 -> 1 -> 2 -> Nhập hệ số a1, b1, c1, a2, b2, c2 -> Nhấn = để đọc nghiệm x, y.',
            studentAction: 'Giải bài tập ra vở, bấm MTCT kiểm tra kết quả đối chiếu với phép tính tay.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Mời 4 học sinh đại diện 4 tổ lên bảng trình bày. Chiếu bài làm của 1 học sinh dùng camera vật thể.',
            studentAction: 'Học sinh đổi chéo vở chấm bài cho bạn cùng bàn theo barem lời giải trên bảng.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Nhận xét, chỉ ra các lỗi sai học sinh hay mắc: Quên nhân ở vế phải (bên dấu =), sai dấu khi trừ số âm. Đánh giá cho điểm các bạn làm bài xuất sắc.',
            studentAction: 'Chữa bài cẩn thận vào vở ghi, ghi chú lỗi sai cần tránh.'
          }
        ]
      },
      {
        id: 'act-v-4',
        code: 'hd4',
        title: 'Hoạt động 4: Vận dụng & Hướng dẫn tự học (Tranh luận toán học & Bài toán thực tiễn)',
        durationMinutes: 7,
        objective: 'Vận dụng giải quyết bài toán thực tế; phân tích sâu tình huống Tranh luận (SGK KNTT trang 12) để linh hoạt lựa chọn phương pháp giải tối ưu.',
        content: '1. Mục Tranh luận (SGK KNTT trang 12): Cho hệ { x - 2y = 1 ; 3x + 2y = 11 }. Bạn Tròn đề xuất giải bằng phương pháp thế (rút x = 2y + 1), bạn Vuông đề xuất giải bằng phương pháp cộng đại số (cộng vế mất y ngay). Em đồng ý với ai?\n2. Bài toán thực tế tiệm bánh mì:\n   - Buổi sáng: 30 bánh mì pate + 20 bánh mì trứng = 1.100.000 đồng.\n   - Buổi chiều: 20 bánh mì pate + 20 bánh mì trứng = 900.000 đồng.\n   Tìm giá bán mỗi loại bánh mì?\n3. Hướng dẫn tự học ở nhà.',
        product: '1. Tranh luận: Cả hai bạn đều đúng! Bạn Vuông nhanh hơn vì hệ số của y đối nhau (+2 và -2) nên cộng vế triệt tiêu ngay; bạn Tròn cũng rất thuận lợi vì hệ số của x ở pt thứ nhất bằng 1 nên rút x = 2y + 1 dễ dàng. Tùy đặc điểm hệ số mà chọn cách ngắn nhất.\n2. Bài toán bánh mì: Gọi giá bánh pate là x (nghìn đồng), bánh trứng là y (nghìn đồng). Hệ pt: { 30x + 20y = 1100 ; 20x + 20y = 900 }. Trừ từng vế: 10x = 200 <=> x = 20 => y = 25. Giá bánh pate 20.000 đồng, bánh trứng 25.000 đồng.\n3. Ghi nhớ bài tập về nhà: Bài 1.7, 1.8, 1.9 SGK trang 12, 13; chuẩn bị bài mới.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Chiếu tình huống Tranh luận giữa bạn Tròn và Vuông (SGK trang 12) và bài toán tiệm bánh mì. Yêu cầu thảo luận cặp đôi 2 phút.',
            studentAction: 'Lắng nghe yêu cầu, thảo luận với bạn cùng bàn về ưu điểm của từng phương pháp.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Khuyến khích học sinh phân tích lý lẽ của cả 2 bạn; gọi 1 học sinh lên lập hệ phương trình bánh mì.',
            studentAction: 'Trao đổi ý kiến, lập hệ phương trình: 30x + 20y = 1100 và 20x + 20y = 900.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Mời đại diện cặp đôi phát biểu ý kiến tranh luận. Lớp trưởng nhận xét bài giải trên bảng.',
            studentAction: 'HS phát biểu: Cả hai bạn đều đúng, nhưng cách cộng đại số của Vuông chỉ cần 1 dòng là triệt tiêu ẩn y; cách của Tròn cũng rất tốt vì hệ số x bằng 1.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'GV tổng kết bài học: Cần quan sát kỹ hệ số của hệ phương trình trước khi quyết định chọn phương pháp thế hay cộng đại số để có lời giải ngắn gọn nhất. Dặn dò nhiệm vụ về nhà: Bài 1.7, 1.8, 1.9 SGK trang 12, 13.',
            studentAction: 'Lắng nghe dặn dò, ghi chép bài tập về nhà vào sổ tay học tập.'
          }
        ]
      }
    ];

    updatedKHBD.appendix = {
      worksheets: [
        {
          title: `Phiếu học tập số 1: Khám phá Quy tắc cộng đại số (${referenceFile})`,
          content: `Họ và tên: .................................................... Lớp: ${currentKHBD.className || '9A1'}\nBÀI 2: GIẢI HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN (TIẾT 2)\n\n1. Cho hệ { 2x + 3y = 7 (1) ; 2x - y = -1 (2) }\n   - Nhận xét hệ số của ẩn x: ...................\n   - Lấy pt (1) trừ pt (2) ta được: 4y = ...... => y = ...... ; x = ......\n   - Kết luận nghiệm: (x; y) = (......; ......)\n2. Cho hệ { 3x + 2y = 7 ; 2x + 3y = 3 }\n   - BCNN(3; 2) = ......\n   - Đưa về hệ tương đương: { 6x + 4y = 14 ; 6x + 9y = 9 }\n   - Nghiệm của hệ là: (x; y) = (......; ......)`
        },
        {
          title: `Phiếu học tập số 2: Luyện tập & Vận dụng chuẩn GDPT 2018`,
          content: `1. Giải hệ phương trình { 3x + 2y = 6 ; 2x - 2y = 14 }:\n   Lời giải: ............................................................................\n2. Giải bài toán thực tế tiệm bánh mì:\n   { 30x + 20y = 1100 ; 20x + 20y = 900 }\n   Giá bánh mì pate: ......... đồng ; Giá bánh mì trứng: ......... đồng.`
        }
      ],
      rubrics: [
        {
          criterion: 'Nhận diện hệ số và lựa chọn phép cộng/trừ triệt tiêu ẩn',
          level1: 'Còn nhầm lẫn dấu hoặc chọn sai phép toán (0 - 0.25đ)',
          level2: 'Nhận biết đúng hệ số bằng/đối nhau và giải đúng bài cơ bản (0.5đ)',
          level3: 'Xác định nhanh chóng, linh hoạt nhân hệ số thích hợp trong mọi trường hợp (1.0đ)'
        },
        {
          criterion: 'Kỹ năng biến đổi tương đương và tính toán',
          level1: 'Sai sót dấu khi trừ số âm hoặc quên nhân ở vế phải (0 - 0.25đ)',
          level2: 'Tính toán chính xác nghiệm trong bài tập cơ bản (0.5đ)',
          level3: 'Trình bày mẫu mực từng dòng tương đương <=> (1.0đ)'
        },
        {
          criterion: 'Sử dụng máy tính cầm tay Casio kiểm tra nghiệm',
          level1: 'Chưa nhớ cú pháp bấm phím (0đ)',
          level2: 'Bấm MENU 9 1 2 nhưng còn chậm (0.25đ)',
          level3: 'Thao tác thuần thục, đối chiếu ngay sau khi giải tay (0.5đ)'
        }
      ]
    };
  } else {
    // Update activities based on prompt and reference form
    updatedKHBD.activities = updatedKHBD.activities.map((act) => {
      const updatedAct = { ...act };
      if (act.code === 'hd1') {
        updatedAct.title = isSTEM 
          ? 'Hoạt động 1: Khởi động & Đặt vấn đề thực tiễn (Bám theo form mẫu)' 
          : 'Hoạt động 1: Mở đầu - Khởi động tiếp cận kiến thức mới (Bám theo form mẫu)';
        updatedAct.content = `Thực hiện nhiệm vụ khởi động liên quan đến ${currentKHBD.lessonName}. Học sinh quan sát tình huống xuất phát và kết nối với nội dung bài học.`;
        updatedAct.product = 'Học sinh hình thành nhu cầu tìm hiểu kiến thức mới, ghi lại câu hỏi cốt lõi vào vở nháp.';
      } else if (act.code === 'hd2') {
        updatedAct.title = 'Hoạt động 2: Hình thành kiến thức mới (Theo cấu trúc chuẩn file mẫu)';
        updatedAct.content = `Giáo viên tổ chức dạy học theo đúng phong cách trình bày của tài liệu "${referenceFile}". Trực quan hóa khái niệm trọng tâm qua bảng biểu và mô hình minh họa.`;
        updatedAct.product = 'Học sinh nắm vững định nghĩa, tính chất, phương pháp giải mẫu và ghi chép có hệ thống.';
      } else if (act.code === 'hd3') {
        updatedAct.title = isDifferentiated
          ? 'Hoạt động 3: Luyện tập phân hóa 3 mức độ (Nhận biết - Thông hiểu - Vận dụng)'
          : 'Hoạt động 3: Luyện tập & Củng cố kỹ năng (Bám theo form bài tập mẫu)';
        updatedAct.content = `Hệ thống bài tập luyện tập được trích xuất và bám sát theo tệp "${referenceFile}", gồm các dạng bài cơ bản đến bài tập nâng cao có đáp án chi tiết.`;
        updatedAct.product = 'Lời giải chuẩn xác của học sinh trên phiếu học tập và bảng nhóm cá nhân.';
      } else if (act.code === 'hd4') {
        updatedAct.title = 'Hoạt động 4: Vận dụng thực tiễn & Mở rộng (Cập nhật phiên bản mới)';
        updatedAct.content = `Nhiệm vụ vận dụng được nâng cấp theo yêu cầu bài học. Học sinh tìm hiểu ứng dụng thực tế và chuẩn bị bài học tiếp theo.`;
        updatedAct.product = 'Bản báo cáo dự án nhỏ hoặc bài giải tình huống thực tế của học sinh.';
      }
      return updatedAct;
    });

    // Ensure appendix has updated rubrics and worksheets
    updatedKHBD.appendix = {
      worksheets: [
        {
          title: `Phiếu học tập số 1 (Theo form mẫu ${referenceFile} - ${newVersionTag})`,
          content: `Nhiệm vụ tìm hiểu khám phá kiến thức mới: Học sinh làm việc cá nhân trong 5 phút, ghi nhận kết quả và đối chiếu với đáp án chuẩn.`
        },
        {
          title: `Phiếu học tập số 2: Luyện tập phân hóa & Vận dụng (${newVersionTag})`,
          content: `Hệ thống 4 bài toán từ mức độ Nhận biết đến Vận dụng cao, thiết kế theo thang điểm 10 chuẩn GDPT 2018.`
        }
      ],
      rubrics: [
        {
          criterion: 'Mức độ nắm vững kiến thức trọng tâm',
          level1: 'Chưa nhớ định nghĩa hoặc áp dụng sai công thức',
          level2: 'Nhớ và áp dụng được vào bài toán cơ bản',
          level3: 'Vận dụng thành thạo và giải thích rõ ràng cho bạn khác'
        },
        {
          criterion: 'Kỹ năng hợp tác nhóm và giải quyết vấn đề',
          level1: 'Ít tham gia đóng góp ý kiến trong nhóm',
          level2: 'Tích cực tham gia và hoàn thành nhiệm vụ được giao',
          level3: 'Chủ động điều phối, sáng tạo và phản biện thuyết phục'
        }
      ]
    };
  }

  const summary = `Đã cập nhật thành công Kế hoạch bài dạy theo form mẫu "${referenceFile}" và áp dụng Prompt tùy chỉnh. Tạo thành công phiên bản ${newVersionTag}!`;

  return { updatedKHBD, summary };
}

// Export versioned Word document
export function exportVersionedKHBDToWord(
  khbd: KHBDData,
  versionRecord: { versionId: string; promptUsed: string; referenceFile: string; createdAt: string }
) {
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${khbd.lessonName} - ${versionRecord.versionId}</title>
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
    .header-tbl { border: none !important; margin-bottom: 15px; }
    .header-tbl td { border: none !important; padding: 2px 4px; }
    .text-center { text-align: center; }
    .italic { font-style: italic; }
    .bold { font-weight: bold; }
    .version-banner {
      background-color: #f0fdf4;
      border: 2px solid #16a34a;
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <!-- BĂNG THÔNG TIN PHIÊN BẢN CẬP NHẬT THEO FORM & PROMPT -->
  <div class="version-banner">
    <p style="margin: 0; font-size: 11pt; color: #166534;">
      <strong>★ BẢN XUẤT FORM MỚI - PHIÊN BẢN: ${versionRecord.versionId}</strong> (Cập nhật ngày: ${versionRecord.createdAt})<br>
      <strong>File tài liệu mẫu bám theo:</strong> ${versionRecord.referenceFile}<br>
      <strong>Prompt chỉ dẫn áp dụng:</strong> <em>"${versionRecord.promptUsed}"</em>
    </p>
  </div>

  <table class="header-tbl" style="width: 100%;">
    <tr>
      <td style="width: 50%; text-align: center;">
        <span class="bold">${khbd.schoolName?.toUpperCase() || 'TRƯỜNG THCS'}</span><br>
        <span class="bold">${khbd.department?.toUpperCase() || 'TỔ TOÁN - TIN HỌC'}</span>
      </td>
      <td style="width: 50%; text-align: center;">
        <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
        <span class="bold">Độc lập - Tự do - Hạnh phúc</span><br>
        -----------------
      </td>
    </tr>
  </table>

  <h1>KẾ HOẠCH BÀI DẠY (GIÁO ÁN)</h1>
  <p class="text-center bold" style="font-size: 14pt; margin-bottom: 8px;">${khbd.lessonName}</p>
  <p class="text-center italic" style="margin-bottom: 20px;">
    Môn: ${khbd.subject} - ${khbd.grade} (Lớp: ${khbd.className || '9A1'}) | Thời lượng: ${khbd.periodsCount} tiết (Thực hiện tiết: ${khbd.currentPeriod})<br>
    Giáo viên thực hiện: ${khbd.teacherName} | Khung thời gian: ${khbd.timeframe}<br>
    <strong>Phiên bản: ${versionRecord.versionId}</strong> (Cập nhật theo form mẫu và Prompt tùy biến)
  </p>

  <h2>I. MỤC TIÊU DẠY HỌC</h2>
  <p class="bold">1. Về kiến thức:</p>
  <ul>
    ${khbd.objectives.knowledge.map(k => `<li>${k}</li>`).join('')}
  </ul>

  <p class="bold">2. Về năng lực:</p>
  <p class="italic">- Năng lực đặc thù:</p>
  <ul>
    ${khbd.objectives.subjectCompetencies.map(c => `<li>${c}</li>`).join('')}
  </ul>
  <p class="italic">- Năng lực chung:</p>
  <ul>
    ${khbd.objectives.coreCompetencies.map(c => `<li>${c}</li>`).join('')}
  </ul>

  <p class="bold">3. Về phẩm chất:</p>
  <ul>
    ${khbd.objectives.qualities.map(q => `<li>${q}</li>`).join('')}
  </ul>

  <h2>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h2>
  <p><strong>1. Giáo viên:</strong> ${khbd.equipment.teacher.join('; ')}</p>
  <p><strong>2. Học sinh:</strong> ${khbd.equipment.students.join('; ')}</p>
  <p><strong>3. Học liệu số & thiết bị bám theo:</strong> ${khbd.equipment.digitalResources.join('; ')}</p>

  <h2>III. TIẾN TRÌNH DẠY HỌC (CHUẨN 4 HOẠT ĐỘNG CÔNG VĂN 5512)</h2>
  ${khbd.activities.map((act, idx) => `
    <div style="margin-bottom: 18px;">
      <h3>${act.title} (${act.durationMinutes} phút)</h3>
      <p><strong>a) Mục tiêu:</strong> ${act.objective}</p>
      <p><strong>b) Nội dung:</strong> ${act.content}</p>
      <p><strong>c) Sản phẩm học tập:</strong> ${act.product}</p>
      <p><strong>d) Tổ chức thực hiện:</strong></p>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Các bước thực hiện</th>
            <th style="width: 40%;">Hoạt động của Giáo viên</th>
            <th style="width: 35%;">Hoạt động của Học sinh</th>
          </tr>
        </thead>
        <tbody>
          ${act.steps.map(step => `
            <tr>
              <td class="bold">${step.name}</td>
              <td>${step.teacherAction}</td>
              <td>${step.studentAction}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')}

  <h2>IV. HỒ SƠ DẠY HỌC & PHỤ LỤC ĐÁNH GIÁ (RUBRICS)</h2>
  <p class="bold">1. Các phiếu học tập bám theo form mẫu:</p>
  ${khbd.appendix?.worksheets?.map((ws, i) => `
    <p><strong>${ws.title}:</strong> ${ws.content}</p>
  `).join('') || '<p>Đang cập nhật phiếu học tập...</p>'}

  <p class="bold" style="margin-top: 10px;">2. Tiêu chí đánh giá Rubrics:</p>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">Tiêu chí</th>
        <th style="width: 23%;">Mức 1 (Cần cố gắng)</th>
        <th style="width: 23%;">Mức 2 (Đạt yêu cầu)</th>
        <th style="width: 24%;">Mức 3 (Tốt / Xuất sắc)</th>
      </tr>
    </thead>
    <tbody>
      ${khbd.appendix?.rubrics?.map(r => `
        <tr>
          <td class="bold">${r.criterion}</td>
          <td>${r.level1}</td>
          <td>${r.level2}</td>
          <td>${r.level3}</td>
        </tr>
      `).join('') || ''}
    </tbody>
  </table>

  <div style="margin-top: 30px; text-align: right;">
    <p class="italic">Ngày ..... tháng ..... năm 2026</p>
    <p class="bold" style="margin-right: 40px;">GIÁO VIÊN BIÊN SOẠN</p>
    <br><br>
    <p class="bold" style="margin-right: 40px;">${khbd.teacherName || 'Giáo viên bộ môn'}</p>
  </div>
</body>
</html>
  `;

  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = khbd.lessonName.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_').substring(0, 45);
  link.download = `KHBD_${safeTitle}_${versionRecord.versionId}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
