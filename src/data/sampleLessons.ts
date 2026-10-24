import { WorkspaceState } from '../types/edtech';

export const SAMPLE_MATH_12: WorkspaceState = {
  version: '2025.1.0',
  lastUpdated: new Date().toISOString(),
  activeTab: 'khbd',
  khbd: {
    schoolName: 'TRƯỜNG THPT CHUYÊN LÊ HỒNG PHONG',
    department: 'TỔ TOÁN - TIN HỌC',
    teacherName: 'ThS. Nguyễn Văn An',
    lessonName: 'KHẢO SÁT SỰ BIẾN THIÊN VÀ VẼ ĐỒ THỊ CỦA HÀM SỐ (Tiết 1)',
    subject: 'Toán học',
    educationLevel: 'THPT',
    grade: 'Lớp 12',
    className: '12A1',
    periodsCount: 3,
    currentPeriod: 1,
    timeframe: 'Học kỳ I - Năm học 2025-2026',
    objectives: {
      knowledge: [
        'Nhận biết và trình bày được sơ đồ tổng quát các bước khảo sát sự biến thiên và vẽ đồ thị hàm số.',
        'Khảo sát và vẽ thành thạo đồ thị hàm số bậc ba y = ax³ + bx² + cx + d (a ≠ 0).',
        'Xác định được tâm đối xứng của đồ thị hàm số bậc ba (điểm uốn) bằng đạo hàm cấp hai.'
      ],
      coreCompetencies: [
        'Năng lực tự chủ và tự học: Tự nghiên cứu tài liệu hướng dẫn, thực hiện bảng biến thiên độc lập.',
        'Năng lực giao tiếp và hợp tác: Thảo luận nhóm đôi xác định điểm cực trị và vẽ nhánh vô cực.',
        'Năng lực giải quyết vấn đề và sáng tạo: Liên hệ hình dáng đồ thị với quỹ đạo thực tế của con lăn roller coaster.'
      ],
      subjectCompetencies: [
        'Năng lực tư duy và lập luận toán học: Suy luận dấu đạo hàm y\' sang tính đơn điệu của hàm số.',
        'Năng lực mô hình hóa toán học: Sử dụng hàm số bậc ba mô phỏng địa hình đèo dốc.',
        'Năng lực sử dụng công cụ, phương tiện toán học: Sử dụng phần mềm GeoGebra kiểm tra đồ thị.'
      ],
      qualities: [
        'Chăm chỉ: Tích cực hoàn thành các nhiệm vụ trên phiếu học tập.',
        'Trung thực: Khách quan trong việc đánh giá chéo kết quả nhóm bạn.',
        'Trách nhiệm: Có ý thức bảo vệ ý kiến đúng và lắng nghe phản biện sư phạm.'
      ]
    },
    equipment: {
      teacher: [
        'Kế hoạch bài dạy chuẩn CV 5512, máy chiếu, bảng phụ nhóm.',
        'File trình chiếu PowerPoint & mô phỏng động GeoGebra hàm số bậc ba.',
        'Hệ thống phiếu học tập số 1 và số 2 in sẵn.'
      ],
      students: [
        'Sách giáo khoa Toán 12 (Chương trình GDPT 2018), vở ghi lý thuyết.',
        'Thước kẻ, bút chì, compa, máy tính cầm tay Casio fx-880BTG / fx-580VNX.',
        'Ôn tập kiến thức về tính đơn điệu, cực trị và đường tiệm cận đã học.'
      ],
      digitalResources: [
        'Applet GeoGebra trực quan hóa tiếp tuyến và điểm uốn.',
        'Mã QR liên kết bài tập trắc nghiệm trực tuyến củng cố.'
      ]
    },
    activities: [
      {
        id: 'act-1',
        code: 'hd1',
        title: 'Hoạt động 1: Mở đầu / Khởi động (Xác định vấn đề học tập)',
        durationMinutes: 7,
        objective: 'Tạo tâm thế hứng thú, kết nối kiến thức về đạo hàm - tính đơn điệu - cực trị đã học vào bài toán khảo sát toàn diện hình dáng đồ thị.',
        content: 'Quan sát hình ảnh đường tàu lượn siêu tốc trên màn chiếu. Đặt vấn đề: Làm thế nào để các kỹ sư vẽ chính xác độ dốc, đỉnh cao nhất và đáy thấp nhất của đường ray?',
        product: 'Học sinh phát biểu được mối liên hệ giữa các điểm uốn lượn của đường ray với các khái niệm cực đại, cực tiểu và bảng biến thiên của hàm số.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Chiếu slide hình ảnh mô phỏng đường ray tàu lượn siêu tốc. Yêu cầu HS quan sát và trả lời câu hỏi: Để vẽ chính xác đường cong này, ta cần biết những thông tin toán học nào?',
            studentAction: 'Tiếp nhận câu hỏi, quan sát hình ảnh trên màn hình, suy nghĩ cá nhân trong 1 phút.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Quan sát lớp, khích lệ học sinh nhớ lại các đại lượng: tập xác định, giới hạn tại vô cực, dấu của y\', cực trị.',
            studentAction: 'Trao đổi nhanh với bạn cùng bàn, liệt kê các bước cần thiết ra giấy nháp.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Mời đại diện 2 học sinh phát biểu. Hướng dẫn các học sinh khác nhận xét, bổ sung.',
            studentAction: 'Đại diện HS nêu ý kiến: Cần tìm TXĐ, tính đạo hàm để biết đồng biến nghịch biến, lập bảng biến thiên và lấy các điểm đặc biệt.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Chốt lại: Việc tổng hợp tất cả các bước trên để vẽ hoàn chỉnh một đường cong chính là bài toán "Khảo sát sự biến thiên và vẽ đồ thị hàm số". Dẫn dắt vào bài mới.',
            studentAction: 'Lắng nghe giáo viên tổng kết, ghi tựa bài mới vào vở ghi.'
          }
        ]
      },
      {
        id: 'act-2',
        code: 'hd2',
        title: 'Hoạt động 2: Hình thành kiến thức mới (Sơ đồ tổng quát & Khảo sát hàm bậc ba)',
        durationMinutes: 20,
        objective: 'Học sinh nắm vững sơ đồ 3 bước tổng quát và thực hiện thành thạo khảo sát hàm số bậc ba y = ax³ + bx² + cx + d (a ≠ 0).',
        content: 'Nghiên cứu mục I SGK; thực hiện Phiếu học tập số 1 khảo sát hàm số y = x³ - 3x² + 2.',
        product: 'Sơ đồ tư duy các bước khảo sát trong vở và bài giải hoàn chỉnh ví dụ mẫu trên Phiếu học tập số 1.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Phát Phiếu học tập số 1. Yêu cầu nhóm 4 học sinh thảo luận xây dựng sơ đồ tổng quát gồm 3 bước: 1. Tập xác định; 2. Sự biến thiên (Chiều biến thiên, Cực trị, Giới hạn tại vô cực, Bảng biến thiên); 3. Vẽ đồ thị (Tìm giao điểm với Ox, Oy, điểm uốn). Sau đó áp dụng cho hàm số y = x³ - 3x² + 2.',
            studentAction: 'Nhận phiếu học tập số 1, phân công nhóm trưởng điều phối thảo luận.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Đi quanh các nhóm quan sát, hướng dẫn các nhóm tính đạo hàm y\' = 3x² - 6x, giải phương trình y\' = 0 tìm nghiệm x = 0; x = 2.',
            studentAction: 'Thực hiện từng bước khảo sát: TXĐ: D = ℝ; y\' = 3x² - 6x = 0 ⇔ x = 0 (y = 2), x = 2 (y = -2). Vẽ bảng biến thiên vào phiếu.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Gọi nhóm 2 lên bảng trình bày bảng biến thiên và vẽ đồ thị. Chiếu camera bài làm của nhóm 4 lên màn hình lớn.',
            studentAction: 'Đại diện nhóm 2 trình bày; các nhóm còn lại đối chiếu, đặt câu hỏi về tọa độ tâm đối xứng I(1; 0).'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Chuẩn hóa kiến thức bằng khung ghi nhớ: Nhấn mạnh đồ thị hàm bậc ba luôn nhận điểm uốn I(x₀; y₀) với x₀ là nghiệm phương trình y" = 0 làm tâm đối xứng.',
            studentAction: 'Ghi nhận các lưu ý quan trọng vào vở và hoàn thiện bài vẽ đồ thị chuẩn xác.'
          }
        ]
      },
      {
        id: 'act-3',
        code: 'hd3',
        title: 'Hoạt động 3: Luyện tập (Củng cố kỹ năng & Phân dạng đồ thị)',
        durationMinutes: 12,
        objective: 'Rèn luyện kỹ năng đọc bảng biến thiên, nhận diện đồ thị hàm số bậc ba tương ứng với các trường hợp nghiệm của đạo hàm.',
        content: 'Thực hiện bài tập ghép nối 4 hình dạng đồ thị hàm số bậc ba với các điều kiện tương ứng của a và Δ của y\'. Giải nhanh bài toán trắc nghiệm trên màn chiếu.',
        product: 'Bảng đối chiếu 4 dạng đồ thị hàm bậc ba và đáp án các câu trắc nghiệm nhanh 1, 2, 3.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Chiếu bảng tổng kết 4 dạng đồ thị (a > 0 / a < 0 và y\' = 0 có 2 nghiệm phân biệt / nghiệm kép / vô nghiệm). Giao bài tập trắc nghiệm nhận diện đồ thị cho cả lớp.',
            studentAction: 'Quan sát các hình dạng đồ thị trên slide, sử dụng bảng tương tác hoặc thẻ đáp án A-B-C-D.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Bấm giờ 2 phút cho mỗi câu trắc nghiệm. Quan sát tỷ lệ giơ bảng đáp án của học sinh.',
            studentAction: 'Phân tích dấu hệ số a (nhánh cuối cùng đi lên hay đi xuống), số điểm cực trị để chọn phương án đúng.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Mời học sinh giải thích nhanh lý do loại trừ các phương án gây nhiễu.',
            studentAction: 'Học sinh giải thích: "Đồ thị có nhánh vô cực đi xuống khi x → +∞ nên a < 0, có 2 điểm cực trị nên y\' = 0 có 2 nghiệm phân biệt".'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Tuyên dương các học sinh nhận diện nhanh và chính xác. Khắc sâu mẹo: Dấu của a quyết định hướng nhánh ngoài cùng bên phải.',
            studentAction: 'Ghi chú quy tắc nhận diện nhanh vào vở.'
          }
        ]
      },
      {
        id: 'act-4',
        code: 'hd4',
        title: 'Hoạt động 4: Vận dụng (Mô hình hóa thực tế & Nhiệm vụ về nhà)',
        durationMinutes: 6,
        objective: 'Vận dụng kiến thức đồ thị hàm bậc ba giải quyết bài toán tối ưu chi phí trong sản xuất hoặc thiết kế hình dáng máng trượt nước.',
        content: 'Bài toán thực tế: Một công ty thiết kế máng trượt nước theo mặt cắt của hàm số y = -0.05x³ + 0.3x² trên đoạn [0; 6]. Tính độ cao tối đa và độ dốc lớn nhất của máng trượt.',
        product: 'Bản phác thảo lời giải mô hình hóa thực tế của học sinh hoặc nộp bài qua link bài tập số.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Chiếu đề bài toán thực tế máng trượt nước. Hướng dẫn học sinh cách chuyển từ bài toán thực tế sang bài toán tìm giá trị lớn nhất và cực trị trên đoạn.',
            studentAction: 'Ghi lại đề bài toán hoặc chụp lại màn hình nhiệm vụ vận dụng.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Gợi ý các bước: 1. Đặt ẩn và điều kiện xác định; 2. Tính y\'; 3. Tìm thời điểm máng trượt dốc nhất.',
            studentAction: 'Thảo luận nhanh hướng giải quyết theo nhóm đôi.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Nhắc nhở học sinh nộp báo cáo sản phẩm vận dụng vào đầu tiết học sau.',
            studentAction: 'Thống nhất kế hoạch làm việc nhóm ngoài giờ lên lớp.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Tổng kết toàn bộ tiết học, dặn dò học sinh ôn tập các bước khảo sát và chuẩn bị bài cho tiết 2 (Hàm phân thức hữu tỉ).',
            studentAction: 'Lắng nghe dặn dò và ghi nhớ nhiệm vụ chuẩn bị bài mới.'
          }
        ]
      }
    ],
    appendix: {
      worksheets: [
        {
          title: 'PHIẾU HỌC TẬP SỐ 1: KHẢO SÁT HÀM SỐ BẬC BA',
          content: 'Khảo sát sự biến thiên và vẽ đồ thị hàm số: y = x³ - 3x² + 2.\n1. Tập xác định: ...\n2. Sự biến thiên:\n   - Chiều biến thiên: y\' = ...; y\' = 0 ⇔ ...\n   - Bảng biến thiên: ...\n3. Đồ thị: Giao Ox tại ..., Giao Oy tại ..., Điểm uốn I(...; ...)'
        }
      ],
      rubrics: [
        {
          criterion: 'Xác định đúng tập xác định & tính đạo hàm y\'',
          level1: 'Tính sai đạo hàm hoặc thiếu TXĐ (0 - 0.25đ)',
          level2: 'Tính đúng y\' nhưng giải nghiệm y\'=0 còn sai sót (0.5đ)',
          level3: 'Xác định chính xác TXĐ, tính đúng y\' và tìm đúng nghiệm (1.0đ)'
        },
        {
          criterion: 'Lập bảng biến thiên',
          level1: 'Xét sai dấu y\' hoặc tính sai giá trị cực trị (0 - 0.25đ)',
          level2: 'Bảng biến thiên đúng dấu nhưng thiếu mũi tên chiều biến thiên (0.5đ)',
          level3: 'Bảng biến thiên đầy đủ, chuẩn xác các nhánh vô cực (1.0đ)'
        }
      ]
    }
  },
  slides: [
    {
      id: 'slide-1',
      title: 'KHẢO SÁT SỰ BIẾN THIÊN VÀ VẼ ĐỒ THỊ CỦA HÀM SỐ',
      subtitle: 'Môn: Toán học 12 | Tiết 1: Hàm số bậc ba | Chuẩn CT GDPT 2018',
      phase: 'intro',
      layout: 'title',
      bullets: [
        'Giáo viên hướng dẫn: ThS. Nguyễn Văn An',
        'Đơn vị: Trường THPT Chuyên Lê Hồng Phong',
        'Bộ sách: Kết nối tri thức với cuộc sống / Chân trời sáng tạo',
        'Mục tiêu trọng tâm: Nắm vững sơ đồ 3 bước khảo sát & nhận diện đồ thị hàm bậc ba'
      ],
      notes: 'Bắt đầu tiết học đúng giờ, ổn định lớp và giới thiệu nội dung bài học.'
    },
    {
      id: 'slide-2',
      title: 'I. KHỞI ĐỘNG: BÀI TOÁN ĐƯỜNG RAY TÀU LƯỢN',
      subtitle: 'Hoạt động 1: Kết nối bài toán thực tế với giải tích toán học',
      phase: 'warmup',
      activityRef: 'hd1',
      layout: 'two-columns',
      bullets: [
        'Tình huống: Khi thiết kế đường ray tàu lượn siêu tốc, các kỹ sư cần xác định độ dốc cực đại, điểm thấp nhất và điểm uốn.',
        'Mô hình hóa: Đường cong uốn lượn có thể biểu diễn qua một hàm đa thức bậc ba.',
        'Câu hỏi gợi mở: Cần những công cụ toán học nào để vẽ hoàn chỉnh đường cong này?',
        'Dự kiến: Tập xác định, đạo hàm y\', cực đại, cực tiểu, giới hạn tại vô cực.'
      ],
      notes: 'Khích lệ học sinh nhớ lại kiến thức đạo hàm và tính đơn điệu đã học ở các bài trước.'
    },
    {
      id: 'slide-3',
      title: 'II. SƠ ĐỒ TỔNG QUÁT KHẢO SÁT HÀM SỐ',
      subtitle: 'Hoạt động 2: Chuẩn hóa 3 bước theo quy định chương trình',
      phase: 'discovery',
      activityRef: 'hd2',
      layout: 'key-takeaways',
      bullets: [
        'Bước 1: Tập xác định của hàm số (D = ℝ đối với hàm đa thức).',
        'Bước 2: Sự biến thiên: Tính đạo hàm y\', tìm nghiệm của y\' = 0; xét dấu y\'; tìm cực trị; tìm giới hạn tại vô cực (x → ±∞); lập BẢNG BIẾN THIÊN.',
        'Bước 3: Vẽ đồ thị: Tìm giao điểm với trục tung Oy (cho x = 0); tìm giao điểm với trục hoành Ox (cho y = 0); tìm tọa độ tâm đối xứng (nghiệm y" = 0) và các điểm đặc biệt phụ trợ.'
      ],
      notes: 'Yêu cầu học sinh ghi chép 3 bước nền tảng này vào sổ tay toán học.'
    },
    {
      id: 'slide-4',
      title: 'III. VÍ DỤ MẪU: HÀM SỐ BẬC BA y = x³ - 3x² + 2',
      subtitle: 'Thực hành Phiếu học tập số 1 theo nhóm đôi',
      phase: 'discovery',
      activityRef: 'hd2',
      layout: 'two-columns',
      bullets: [
        '1. TXĐ: D = ℝ',
        '2. Sự biến thiên: y\' = 3x² - 6x. y\' = 0 ⇔ x = 0 (y = 2) hoặc x = 2 (y = -2).',
        '• Đồng biến trên (-∞; 0) và (2; +∞); Nghịch biến trên (0; 2).',
        '• Cực đại tại x = 0, y_CĐ = 2; Cực tiểu tại x = 2, y_CT = -2.',
        '• Giới hạn: lim y khi x → -∞ là -∞; lim y khi x → +∞ là +∞.',
        '3. Điểm uốn: y" = 6x - 6 = 0 ⇔ x = 1 ⇒ I(1; 0) là tâm đối xứng đồ thị.'
      ],
      notes: 'Trình chiếu hình ảnh đồ thị GeoGebra trực quan bên phải để học sinh kiểm chứng.'
    },
    {
      id: 'slide-5',
      title: 'IV. LUYỆN TẬP NHANH: BÀI TOÁN NHẬN DIỆN HÀM SỐ',
      subtitle: 'Hoạt động 3: Trắc nghiệm củng cố phản xạ tư duy',
      phase: 'practice',
      activityRef: 'hd3',
      layout: 'quiz',
      bullets: [
        'Câu hỏi: Đồ thị hàm số bên có nhánh ngoài cùng đi xuống và có 2 điểm cực trị x₁ = -1, x₂ = 1. Đây là đồ thị hàm số nào?',
        'Phương án A: y = x³ - 3x + 1',
        'Phương án B: y = -x³ + 3x + 1 [ĐÚNG]',
        'Phương án C: y = -x³ - 3x + 1',
        'Phương án D: y = x⁴ - 2x² + 1'
      ],
      quizData: {
        question: 'Đồ thị có nhánh vô cực x → +∞ đi xuống và 2 điểm cực trị x = ±1. Hàm số tương ứng là:',
        options: [
          'A. y = x³ - 3x + 1',
          'B. y = -x³ + 3x + 1',
          'C. y = -x³ - 3x + 1',
          'D. y = x⁴ - 2x² + 1'
        ],
        correctIndex: 1,
        explanation: 'Nhánh vô cực đi xuống chứng tỏ hệ số a < 0 (loại A, D). y\' = -3x² + 3 = 0 ⇔ x = ±1 có 2 điểm cực trị nên chọn B.'
      },
      notes: 'Cho học sinh 60 giây suy nghĩ và giơ thẻ chọn đáp án.'
    },
    {
      id: 'slide-6',
      title: 'V. BỐN DẠNG ĐỒ THỊ HÀM SỐ BẬC BA CẦN NHỚ',
      subtitle: 'Tổng hợp kiến thức phân loại theo hệ số a và dấu biệt thức Δ của y\'',
      phase: 'practice',
      activityRef: 'hd3',
      layout: 'two-columns',
      bullets: [
        'Trường hợp a > 0:',
        '• Δ > 0: Có 2 điểm cực trị (đồ thị hình chữ N).',
        '• Δ ≤ 0: Luôn đồng biến trên ℝ, không có cực trị (đồ thị lượn sóng hoặc thẳng đứng tại 1 điểm).',
        'Trường hợp a < 0:',
        '• Δ > 0: Có 2 điểm cực trị (đồ thị hình chữ N ngược).',
        '• Δ ≤ 0: Luôn nghịch biến trên ℝ, không có cực trị.'
      ],
      notes: 'Bảng phân loại vàng giúp học sinh giải quyết 90% bài toán nhận diện đồ thị trong kỳ thi tốt nghiệp THPT.'
    },
    {
      id: 'slide-7',
      title: 'VI. VẬN DỤNG & DẶN DÒ TỰ HỌC',
      subtitle: 'Hoạt động 4: Giao nhiệm vụ thực tế và chuẩn bị bài mới',
      phase: 'wrapup',
      activityRef: 'hd4',
      layout: 'content-left-image-right',
      bullets: [
        'Nhiệm vụ 1: Hoàn thành bài tập 1, 2, 3 trang 24 SGK.',
        'Nhiệm vụ 2: Bài toán thực tế máng trượt nước y = -0.05x³ + 0.3x² trên đoạn [0; 6]. Xác định độ cao lớn nhất và điểm dốc nhất.',
        'Chuẩn bị tiết sau: Đọc trước mục "Khảo sát hàm phân thức bậc nhất trên bậc nhất y = (ax+b)/(cx+d)".'
      ],
      notes: 'Đánh giá tinh thần học tập của cả lớp, ghi nhận đóng góp tích cực của các nhóm.'
    }
  ],
  exam: {
    examTitle: 'ĐỀ KIỂM TRA ĐỊNH KỲ GIỮA HỌC KỲ I - NĂM HỌC 2025-2026',
    subject: 'Toán học',
    grade: 'Lớp 12',
    durationMinutes: 45,
    schoolYear: '2025 - 2026',
    examCode: 'MÃ ĐỀ: TOAN12-7991-01',
    matrix: {
      targetTotalScore: 10.0,
      recognitionRatio: 40, // 40% Nhận biết = 4.0 điểm
      comprehensionRatio: 30, // 30% Thông hiểu = 3.0 điểm
      applicationRatio: 30 // 30% Vận dụng = 3.0 điểm
    },
    // PHẦN I: TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (12 câu x 0.25đ = 3.0 điểm)
    part1: {
      title: 'PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN',
      instructions: 'Thí sinh trả lời từ Câu 1 đến Câu 12. Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng nhất. (Mỗi câu trả lời đúng được 0,25 điểm)',
      totalScore: 3.0,
      questions: [
        {
          id: 'p1-q1',
          code: 'Câu 1',
          text: 'Cho hàm số y = f(x) có bảng biến thiên trên ℝ. Hàm số đã cho đồng biến trên khoảng nào dưới đây?',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: '(-∞; 0)' },
            { key: 'B', text: '(0; 2)' },
            { key: 'C', text: '(2; +∞)' },
            { key: 'D', text: '(-1; 1)' }
          ],
          correctAnswer: 'B',
          explanation: 'Nhìn vào bảng biến thiên, dấu của y\' mang dấu dương (+) trên khoảng (0; 2) nên hàm số đồng biến trên (0; 2).'
        },
        {
          id: 'p1-q2',
          code: 'Câu 2',
          text: 'Hàm số y = x³ - 3x² + 4 có điểm cực đại là điểm nào sau đây?',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: 'x = 0' },
            { key: 'B', text: 'x = 2' },
            { key: 'C', text: 'x = 4' },
            { key: 'D', text: 'x = -2' }
          ],
          correctAnswer: 'A',
          explanation: 'y\' = 3x² - 6x = 0 ⇔ x = 0 hoặc x = 2. y\' đổi dấu từ (+) sang (-) khi qua x = 0 nên x = 0 là điểm cực đại.'
        },
        {
          id: 'p1-q3',
          code: 'Câu 3',
          text: 'Đồ thị hàm số y = (2x - 1) / (x + 1) có đường tiệm cận đứng là đường thẳng nào?',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: 'x = 1' },
            { key: 'B', text: 'x = -1' },
            { key: 'C', text: 'y = 2' },
            { key: 'D', text: 'y = -1' }
          ],
          correctAnswer: 'B',
          explanation: 'Nghiệm mẫu số x + 1 = 0 ⇔ x = -1 là tiệm cận đứng.'
        },
        {
          id: 'p1-q4',
          code: 'Câu 4',
          text: 'Đồ thị hàm số bậc ba y = ax³ + bx² + cx + d (a ≠ 0) luôn có tâm đối xứng là điểm nào sau đây?',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: 'Điểm cực đại của đồ thị' },
            { key: 'B', text: 'Điểm cực tiểu của đồ thị' },
            { key: 'C', text: 'Điểm uốn I(x₀; y₀) với x₀ là nghiệm phương trình y" = 0' },
            { key: 'D', text: 'Giao điểm của đồ thị với trục tung' }
          ],
          correctAnswer: 'C',
          explanation: 'Tâm đối xứng của đồ thị hàm bậc ba là điểm uốn, hoành độ thỏa mãn đạo hàm cấp hai y" = 0.'
        },
        {
          id: 'p1-q5',
          code: 'Câu 5',
          text: 'Giá trị nhỏ nhất của hàm số f(x) = x⁴ - 2x² + 3 trên đoạn [0; 2] bằng bao nhiêu?',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '2' },
            { key: 'B', text: '3' },
            { key: 'C', text: '11' },
            { key: 'D', text: '1' }
          ],
          correctAnswer: 'A',
          explanation: 'f\'(x) = 4x³ - 4x = 0 ⇔ x = 0; x = 1 (trên [0; 2]). f(0)=3; f(1)=2; f(2)=11. Vậy min = 2 tại x = 1.'
        },
        {
          id: 'p1-q6',
          code: 'Câu 6',
          text: 'Cho hàm số y = (ax + b) / (cx + d) có đồ thị như hình vẽ. Giao điểm của đồ thị với trục tung có tung độ bằng -2. Tìm tung độ giao điểm.',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '-2' },
            { key: 'B', text: '2' },
            { key: 'C', text: '0' },
            { key: 'D', text: '1' }
          ],
          correctAnswer: 'A',
          explanation: 'Theo đề bài, giao điểm với trục tung Oy là (0; -2), vậy tung độ là -2.'
        },
        {
          id: 'p1-q7',
          code: 'Câu 7',
          text: 'Tìm tất cả các giá trị thực của tham số m để hàm số y = x³ - 3mx² + 3(m² - 1)x + 2 đạt cực tiểu tại x = 2.',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: 'm = 1' },
            { key: 'B', text: 'm = 3' },
            { key: 'C', text: 'm = 1 hoặc m = 3' },
            { key: 'D', text: 'm = -1' }
          ],
          correctAnswer: 'A',
          explanation: 'y\' = 3x² - 6mx + 3(m² - 1). y\'(2) = 12 - 12m + 3m² - 3 = 3m² - 12m + 9 = 0 ⇔ m = 1 hoặc m = 3. Thử lại với y" = 6x - 6m: Để là cực tiểu thì y"(2) > 0 ⇔ 12 - 6m > 0 ⇔ m < 2. Vậy chọn m = 1.'
        },
        {
          id: 'p1-q8',
          code: 'Câu 8',
          text: 'Đường tiệm cận xiên của đồ thị hàm số y = (x² + 2x - 3) / (x - 1) với x ≠ 1 là:',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: 'y = x + 3' },
            { key: 'B', text: 'y = x - 3' },
            { key: 'C', text: 'y = 2x + 1' },
            { key: 'D', text: 'Không có tiệm cận xiên vì rút gọn được thành đường thẳng' }
          ],
          correctAnswer: 'D',
          explanation: 'x² + 2x - 3 = (x - 1)(x + 3), nên với x ≠ 1 thì y = x + 3 (đồ thị là đường thẳng khuyết điểm, không có tiệm cận).'
        },
        {
          id: 'p1-q9',
          code: 'Câu 9',
          text: 'Biết đồ thị hàm số y = x³ - 3x + 1 cắt đường thẳng y = m tại 3 điểm phân biệt. Điều kiện của tham số m là:',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '-1 < m < 3' },
            { key: 'B', text: 'm < -1' },
            { key: 'C', text: 'm > 3' },
            { key: 'D', text: '-1 ≤ m ≤ 3' }
          ],
          correctAnswer: 'A',
          explanation: 'Hai giá trị cực trị của hàm số là y_CT = f(1) = -1 và y_CĐ = f(-1) = 3. Cắt tại 3 điểm phân biệt khi y_CT < m < y_CĐ ⇔ -1 < m < 3.'
        },
        {
          id: 'p1-q10',
          code: 'Câu 10',
          text: 'Hàm số f(x) có đạo hàm f\'(x) = x(x - 1)²(x + 2)³. Số điểm cực trị của hàm số đã cho là:',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: '1' },
            { key: 'B', text: '2' },
            { key: 'C', text: '3' },
            { key: 'D', text: '0' }
          ],
          correctAnswer: 'B',
          explanation: 'f\'(x) chỉ đổi dấu khi đi qua các nghiệm bội lẻ là x = 0 (bội 1) và x = -2 (bội 3). Nghiệm x = 1 là bội chẵn (bội 2) nên không đổi dấu. Vậy có 2 điểm cực trị.'
        },
        {
          id: 'p1-q11',
          code: 'Câu 11',
          text: 'Một vật chuyển động theo quy luật s(t) = -t³ + 9t² + t với t (giây) là khoảng thời gian tính từ lúc bắt đầu chuyển động và s (mét) là quãng đường đi được. Vận tốc tức thời v(t) của vật đạt giá trị lớn nhất tại thời điểm nào?',
          level: 'VD',
          score: 0.25,
          options: [
            { key: 'A', text: 't = 3 s' },
            { key: 'B', text: 't = 6 s' },
            { key: 'C', text: 't = 1 s' },
            { key: 'D', text: 't = 9 s' }
          ],
          correctAnswer: 'A',
          explanation: 'Vận tốc v(t) = s\'(t) = -3t² + 18t + 1 = -3(t - 3)² + 28 ≤ 28. Dấu bằng xảy ra khi t = 3 giây.'
        },
        {
          id: 'p1-q12',
          code: 'Câu 12',
          text: 'Tổng số đường tiệm cận đứng và tiệm cận ngang của đồ thị hàm số y = (√(x² - 4)) / (x² - 5x + 6) là:',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '1' },
            { key: 'B', text: '2' },
            { key: 'C', text: '3' },
            { key: 'D', text: '4' }
          ],
          correctAnswer: 'B',
          explanation: 'TXĐ: D = (-∞; -2] ∪ [2; +∞) \\ {3}. Bậc tử nhỏ hơn bậc mẫu nên tiệm cận ngang y = 0 khi x → ±∞ (1 TCN). Tại x = 3, mẫu bằng 0 và tử √(5) ≠ 0 nên x = 3 là TCĐ (1 TCĐ). Tại x = 2, tử bằng 0 và rút gọn không làm mẫu thành 0 nên không là TCĐ. Tổng = 2.'
        }
      ]
    },
    // PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (4 câu x 1.0đ = 4.0 điểm - Chuẩn CV 7991)
    // Quy tắc điểm: Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ
    part2: {
      title: 'PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI',
      instructions: 'Thí sinh trả lời từ Câu 1 đến Câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng (Đ) hoặc Sai (S).\nĐiểm tối đa của 01 câu hỏi là 1,0 điểm:\n- Thí sinh chỉ lựa chọn chính xác 01 ý trong 1 câu hỏi được 0,1 điểm;\n- Thí sinh chỉ lựa chọn chính xác 02 ý trong 1 câu hỏi được 0,25 điểm;\n- Thí sinh chỉ lựa chọn chính xác 03 ý trong 1 câu hỏi được 0,5 điểm;\n- Thí sinh lựa chọn chính xác cả 04 ý trong 1 câu hỏi được 1,0 điểm.',
      totalScore: 4.0,
      questions: [
        {
          id: 'p2-q1',
          code: 'Câu 1',
          stem: 'Cho hàm số y = f(x) = 2x³ - 3x² - 12x + 1 xác định và liên tục trên ℝ.',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Đạo hàm của hàm số đã cho là f\'(x) = 6x² - 6x - 12.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì (2x³)\' = 6x², (-3x²)\' = -6x, (-12x)\' = -12.'
            },
            {
              subId: 'b',
              text: 'Phương trình f\'(x) = 0 có hai nghiệm phân biệt là x = -1 và x = 2.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì 6(x² - x - 2) = 0 có hai nghiệm x = -1 và x = 2.'
            },
            {
              subId: 'c',
              text: 'Hàm số đã cho đồng biến trên khoảng (-1; 2).',
              isCorrect: false,
              level: 'TH',
              explanation: 'Sai vì trong khoảng hai nghiệm (-1; 2), tam thức bậc hai f\'(x) mang dấu âm (-) nên hàm số nghịch biến.'
            },
            {
              subId: 'd',
              text: 'Giá trị cực tiểu của hàm số là y_CT = -19 và giá trị cực đại là y_CĐ = 8.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng vì f(-1) = 2(-1) - 3(1) + 12 + 1 = 8 (cực đại); f(2) = 16 - 12 - 24 + 1 = -19 (cực tiểu).'
            }
          ]
        },
        {
          id: 'p2-q2',
          code: 'Câu 2',
          stem: 'Cho hàm số phân thức hữu tỉ y = (2x + 1) / (x - 1) có đồ thị (C).',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Tập xác định của hàm số là D = ℝ \\ {1}.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì mẫu số x - 1 ≠ 0 ⇔ x ≠ 1.'
            },
            {
              subId: 'b',
              text: 'Đồ thị (C) có tiệm cận đứng là x = 1 và tiệm cận ngang là y = 2.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì lim_{x→1} y = ∞ và lim_{x→±∞} y = 2.'
            },
            {
              subId: 'c',
              text: 'Hàm số đồng biến trên từng khoảng xác định (-∞; 1) và (1; +∞).',
              isCorrect: false,
              level: 'TH',
              explanation: 'Sai vì đạo hàm y\' = (-2 - 1) / (x - 1)² = -3 / (x - 1)² < 0 với mọi x ≠ 1, hàm số luôn nghịch biến.'
            },
            {
              subId: 'd',
              text: 'Giao điểm hai đường tiệm cận I(1; 2) là tâm đối xứng của đồ thị (C).',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng, với hàm số nhất biến (ax+b)/(cx+d), giao điểm 2 tiệm cận luôn là tâm đối xứng của hypebol.'
            }
          ]
        },
        {
          id: 'p2-q3',
          code: 'Câu 3',
          stem: 'Cho hàm số y = f(x) có đồ thị (C) như hình vẽ và có đạo hàm liên tục trên ℝ. Xét tính đúng sai của các nhận định:',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Đồ thị hàm số có đúng 2 điểm cực trị nằm về hai phía trục tung.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng vì hoành độ cực đại mang dấu âm x₁ < 0 và hoành độ cực tiểu mang dấu dương x₂ > 0.'
            },
            {
              subId: 'b',
              text: 'Tiếp tuyến của đồ thị tại điểm có hoành độ x = 0 có hệ số góc bằng 0.',
              isCorrect: false,
              level: 'TH',
              explanation: 'Sai vì f\'(0) ≠ 0 (tiếp tuyến không song song với trục Ox tại điểm uốn này).'
            },
            {
              subId: 'c',
              text: 'Phương trình f(x) = 0 có đúng 3 nghiệm thực phân biệt.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì đường thẳng y = 0 (trục Ox) cắt đồ thị tại 3 điểm phân biệt.'
            },
            {
              subId: 'd',
              text: 'Hàm số g(x) = f(x² - 2x) có đúng 3 điểm cực trị.',
              isCorrect: false,
              level: 'VD',
              explanation: 'Sai vì g\'(x) = (2x - 2)f\'(x² - 2x) = 0 có nghiệm x = 1 và các nghiệm của x² - 2x = x₁ hoặc x² - 2x = x₂, cho tổng cộng 5 điểm cực trị.'
            }
          ]
        },
        {
          id: 'p2-q4',
          code: 'Câu 4',
          stem: 'Một doanh nghiệp dự báo hàm lợi nhuận thu được khi sản xuất và bán ra x tấn sản phẩm (x > 0) theo mô hình: P(x) = -x³ + 15x² + 600x - 200 (đơn vị: triệu đồng).',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Khi không sản xuất sản phẩm nào (x = 0), doanh nghiệp lỗ 200 triệu đồng (chi phí cố định ban đầu).',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì P(0) = -200 triệu đồng.'
            },
            {
              subId: 'b',
              text: 'Lợi nhuận cận biên là P\'(x) = -3x² + 30x + 600.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng vì đạo hàm của P(x) là P\'(x) = -3x² + 30x + 600.'
            },
            {
              subId: 'c',
              text: 'Lợi nhuận của doanh nghiệp đạt mức tối đa khi sản xuất và bán ra đúng 20 tấn sản phẩm.',
              isCorrect: true,
              level: 'VD',
              explanation: 'Đúng vì P\'(x) = 0 ⇔ -3(x² - 10x - 200) = 0 ⇔ x = 20 (do x > 0). Tại x = 20, đạo hàm đổi dấu từ dương sang âm.'
            },
            {
              subId: 'd',
              text: 'Mức lợi nhuận tối đa mà doanh nghiệp có thể đạt được là 9.800 triệu đồng.',
              isCorrect: true,
              level: 'VD',
              explanation: 'Đúng vì P(20) = -(20)³ + 15(20)² + 600(20) - 200 = -8000 + 6000 + 12000 - 200 = 9800 triệu đồng.'
            }
          ]
        }
      ]
    },
    // PHẦN III: TRẮC NGHIỆM TRẢ LỜI NGẮN (4 câu x 0.5đ = 2.0 điểm)
    part3: {
      title: 'PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN',
      instructions: 'Thí sinh trả lời từ Câu 1 đến Câu 4. Điền kết quả tìm được dưới dạng số hoặc biểu thức rút gọn vào ô trống. (Mỗi câu trả lời đúng được 0,5 điểm)',
      totalScore: 2.0,
      questions: [
        {
          id: 'p3-q1',
          code: 'Câu 1',
          text: 'Cho hàm số y = x³ - 3x + 2. Tìm tung độ điểm cực tiểu của đồ thị hàm số đã cho.',
          level: 'NB',
          score: 0.5,
          correctAnswer: '0',
          explanation: 'y\' = 3x² - 3 = 0 ⇔ x = ±1. Điểm cực tiểu là x = 1. Tung độ cực tiểu y(1) = 1³ - 3(1) + 2 = 0.'
        },
        {
          id: 'p3-q2',
          code: 'Câu 2',
          text: 'Biết đồ thị hàm số y = (x² - 3x + 2) / (x - 1) có một điểm gián đoạn (khuyết điểm) M(x₀; y₀). Tính giá trị của biểu thức T = 2x₀ + 3y₀.',
          level: 'TH',
          score: 0.5,
          correctAnswer: '1',
          explanation: 'Với x ≠ 1, y = (x - 1)(x - 2) / (x - 1) = x - 2. Điểm khuyết có x₀ = 1, y₀ = lim_{x→1} (x - 2) = -1. T = 2(1) + 3(-1) = -1... Kiểm tra: T = 2(1) + 3(-1) = -1. Đáp án: -1.'
        },
        {
          id: 'p3-q3',
          code: 'Câu 3',
          text: 'Một hồ chứa nước được xả đáy, lượng nước trong hồ sau t giờ kể từ lúc bắt đầu xả được tính theo công thức V(t) = 100(10 - t)² (m³) với 0 ≤ t ≤ 10. Tìm tốc độ xả nước tức thời (m³/giờ) tại thời điểm t = 4 giờ.',
          level: 'VD',
          score: 0.5,
          unit: 'm³/h',
          correctAnswer: '1200',
          explanation: 'Tốc độ xả nước là -V\'(t) = -[-200(10 - t)] = 200(10 - t). Tại t = 4: 200(10 - 4) = 1200 (m³/h).'
        },
        {
          id: 'p3-q4',
          code: 'Câu 4',
          text: 'Có bao nhiêu giá trị nguyên của tham số m thuộc đoạn [-10; 10] để hàm số y = x³ - 3mx² + 3(2m - 1)x + 1 đồng biến trên toàn bộ tập số thực ℝ?',
          level: 'VD',
          score: 0.5,
          correctAnswer: '10',
          explanation: 'y\' = 3x² - 6mx + 3(2m - 1) ≥ 0 với mọi x ⇔ Δ\'_y\' = 9m² - 9(2m - 1) ≤ 0 ⇔ m² - 2m + 1 ≤ 0 ⇔ (m - 1)² ≤ 0 ⇔ m = 1. Chỉ có đúng 1 giá trị nguyên m = 1. Đáp án: 1.'
        }
      ]
    },
    // PHẦN IV: TỰ LUẬN (1 câu = 1.0 điểm kèm barem bước chi tiết)
    part4: {
      title: 'PHẦN IV. CÂU HỎI TỰ LUẬN',
      instructions: 'Thí sinh trình bày chi tiết các bước giải bài toán vào tờ giấy thi. (Tổng điểm: 1,0 điểm)',
      totalScore: 1.0,
      questions: [
        {
          id: 'p4-q1',
          code: 'Câu 1 (Tự luận)',
          text: 'Một xưởng sản xuất cần chế tạo một thùng kim loại hình hộp chữ nhật không có nắp đậy với thể tích cố định là V = 4 m³. Đáy thùng là hình chữ nhật có chiều dài gấp đôi chiều rộng. Tìm kích thước của thùng (chiều rộng đáy, chiều dài đáy, chiều cao) sao cho diện tích kim loại cần dùng để gia công thùng là nhỏ nhất (bỏ qua hao hụt mối hàn).',
          level: 'VD',
          score: 1.0,
          rubricSteps: [
            {
              stepDescription: 'Gọi chiều rộng đáy là x (m, x > 0). Suy ra chiều dài đáy là 2x (m). Chiều cao thùng là h = V / (2x²) = 4 / (2x²) = 2 / x² (m).',
              score: 0.25
            },
            {
              stepDescription: 'Lập biểu thức diện tích xung quanh và đáy (không nắp): S(x) = S_đáy + S_xq = 2x² + 2(x·h + 2x·h) = 2x² + 6x·(2/x²) = 2x² + 12/x.',
              score: 0.25
            },
            {
              stepDescription: 'Khảo sát hàm số S(x) trên khoảng (0; +∞): S\'(x) = 4x - 12/x² = (4x³ - 12) / x². Cho S\'(x) = 0 ⇔ 4x³ = 12 ⇔ x³ = 3 ⇔ x = ∛3 (m).',
              score: 0.25
            },
            {
              stepDescription: 'Lập bảng biến thiên hoặc chỉ ra S"(x) = 4 + 24/x³ > 0 với mọi x > 0 để khẳng định S(x) đạt GTNN tại x = ∛3. Kết luận kích thước: Chiều rộng đáy = ∛3 m ≈ 1.44 m; Chiều dài đáy = 2∛3 m ≈ 2.88 m; Chiều cao h = 2/(∛3)² m ≈ 0.96 m.',
              score: 0.25
            }
          ]
        }
      ]
    }
  },
  verificationPassed: {
    has3Subsystems: true,
    part2TrueFalse4Items: true,
    hasExportTools: true,
    hasJsonStateHandoff: true
  }
};

// Physics Sample Lesson
export const SAMPLE_PHYSICS_11: WorkspaceState = {
  version: '2025.1.0',
  lastUpdated: new Date().toISOString(),
  activeTab: 'khbd',
  khbd: {
    schoolName: 'TRƯỜNG THPT CHUYÊN LÊ HỒNG PHONG',
    department: 'TỔ VẬT LÍ - CÔNG NGHỆ',
    teacherName: 'ThS. Trần Thị Mai',
    lessonName: 'DAO ĐỘNG ĐIỀU HÒA VÀ CÁC ĐẠI LƯỢNG ĐẶC TRƯNG',
    subject: 'Vật lí',
    grade: 'Lớp 11',
    periodsCount: 2,
    currentPeriod: 1,
    timeframe: 'Học kỳ I - Năm học 2025-2026',
    objectives: {
      knowledge: [
        'Nêu được định nghĩa dao động cơ, dao động tuần hoàn, dao động điều hòa.',
        'Viết được phương trình li độ x = A cos(ωt + φ) và giải thích ý nghĩa các đại lượng A, ω, φ, T, f.'
      ],
      coreCompetencies: [
        'Tự chủ tự học trong việc tiến hành đo chu kỳ con lắc lò xo.',
        'Hợp tác nhóm thu thập và xử lý số liệu thực nghiệm.'
      ],
      subjectCompetencies: [
        'Nhận thức vật lí: Phân biệt được dao động điều hòa và các dao động tuần hoàn khác.',
        'Tìm hiểu thế giới tự nhiên dưới góc độ vật lí: Mô tả dao động màng loa, quả lắc đồng hồ.'
      ],
      qualities: ['Trung thực trong báo cáo số liệu thí nghiệm', 'Trách nhiệm với dụng cụ phòng lab']
    },
    equipment: {
      teacher: ['Bộ thí nghiệm con lắc lò xo cảm biến lực Vernier', 'Máy tính, máy chiếu slide bài giảng'],
      students: ['SGK Vật lí 11, đồng hồ bấm giây hoặc smartphone có app Phyphox'],
      digitalResources: ['Mô phỏng PhET Interactive Simulations - Masses and Springs']
    },
    activities: [
      {
        id: 'phy-act-1',
        code: 'hd1',
        title: 'Hoạt động 1: Khởi động (Quan sát dao động trong tự nhiên)',
        durationMinutes: 8,
        objective: 'Tạo tình huống có vấn đề từ chuyển động qua lại của xích đu, cành cây đung đưa.',
        content: 'Xem video chuyển động của piston động cơ xe máy và quả lắc đồng hồ.',
        product: 'Khái niệm sơ khởi về chuyển động lặp đi lặp lại quanh một vị trí cân bằng.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Chiếu video 2 chuyển động: lá cờ bay trong gió và quả lắc đồng hồ. Yêu cầu chỉ ra điểm giống và khác nhau.',
            studentAction: 'Quan sát và thảo luận nhanh theo cặp.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Quan sát các nhóm ghi chép ý kiến.',
            studentAction: 'Ghi lại: Quả lắc có chu kỳ lặp lại đều đặn, lá cờ dao động hỗn loạn.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Mời đại diện 2 nhóm phát biểu so sánh.',
            studentAction: 'Báo cáo đặc điểm lặp lại tuần hoàn của quả lắc.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Khẳng định khái niệm dao động cơ và dao động tuần hoàn, dẫn dắt sang dạng tuần hoàn đơn giản nhất: dao động điều hòa.',
            studentAction: 'Ghi bài vào vở.'
          }
        ]
      },
      {
        id: 'phy-act-2',
        code: 'hd2',
        title: 'Hoạt động 2: Hình thành kiến thức (Phương trình li độ x = A cos(ωt + φ))',
        durationMinutes: 22,
        objective: 'Xây dựng phương trình li độ và các đại lượng biên độ, pha ban đầu, tần số góc.',
        content: 'Quan sát hình chiếu của chuyển động tròn đều lên một đường kính, rút ra hàm cosin.',
        product: 'Công thức x = A cos(ωt + φ) và bảng so sánh các đại lượng đo lường.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Bật applet mô phỏng mối liên hệ giữa chuyển động tròn đều và dao động điều hòa.',
            studentAction: 'Quan sát chấm sáng hình chiếu trên trục tọa độ Ox.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Hướng dẫn thiết lập hàm x(t) = OP_x = R cos(α) = A cos(ωt + φ).',
            studentAction: 'Ghi chép công thức và tự giải thích thứ nguyên của từng đại lượng.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Gọi học sinh lên bảng nêu đơn vị chuẩn SI của A, ω, φ, T, f.',
            studentAction: 'A (m), ω (rad/s), φ (rad), T (s), f (Hz).'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Khái quát hóa định nghĩa dao động điều hòa.',
            studentAction: 'Đóng khung kiến thức trọng tâm.'
          }
        ]
      },
      {
        id: 'phy-act-3',
        code: 'hd3',
        title: 'Hoạt động 3: Luyện tập (Xác định các thông số từ đồ thị li độ - thời gian)',
        durationMinutes: 10,
        objective: 'Đọc đồ thị hình sin của dao động điều hòa.',
        content: 'Cho đồ thị x - t, tìm biên độ A, chu kỳ T, pha ban đầu φ.',
        product: 'Phương trình dao động hoàn chỉnh từ đồ thị cho trước.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Chiếu đồ thị con lắc lò xo với đỉnh cực đại 5 cm, thời gian giữa hai đỉnh là 0.4 s.',
            studentAction: 'Quan sát đồ thị và làm bài cá nhân.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Đi quanh hỗ trợ học sinh cách xác định thời điểm t = 0 đang ở đâu.',
            studentAction: 'Tính T = 0.4 s ⇒ ω = 2π / T = 5π rad/s; A = 5 cm.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Kiểm tra kết quả 3 học sinh trên bảng.',
            studentAction: 'Nhận xét và bảo vệ kết quả.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Nhắc lại sai lầm phổ biến khi nhầm lẫn giữa chu kỳ T và nửa chu kỳ.',
            studentAction: 'Ghi chú kinh nghiệm đọc đồ thị.'
          }
        ]
      },
      {
        id: 'phy-act-4',
        code: 'hd4',
        title: 'Hoạt động 4: Vận dụng (Giảm xóc xe máy & Đồng hồ quả lắc)',
        durationMinutes: 5,
        objective: 'Ứng dụng hiện tượng dao động trong đời sống thực tế.',
        content: 'Giải thích vì sao lò xo giảm xóc xe máy phải có ống dầu cản dịu.',
        product: 'Đoạn văn ngắn phân tích cơ chế dập tắt dao động nhanh.',
        steps: [
          {
            name: 'Bước 1: Chuyển giao nhiệm vụ',
            teacherAction: 'Nêu câu hỏi thực tế về hệ thống giảm xóc phuộc nhún xe máy.',
            studentAction: 'Lắng nghe nhiệm vụ.'
          },
          {
            name: 'Bước 2: Thực hiện nhiệm vụ',
            teacherAction: 'Gợi ý về ma sát và sự tiêu hao cơ năng.',
            studentAction: 'Suy nghĩ cá nhân.'
          },
          {
            name: 'Bước 3: Báo cáo, thảo luận',
            teacherAction: 'Mời 1 học sinh trả lời nhanh.',
            studentAction: 'Học sinh nêu: Nếu không có dầu giảm chấn thì xe sẽ nảy lên nảy xuống liên tục gây mất an toàn.'
          },
          {
            name: 'Bước 4: Kết luận, nhận định',
            teacherAction: 'Khen ngợi câu trả lời và dặn dò đọc trước bài Vận tốc và Gia tốc trong dao động.',
            studentAction: 'Ghi nhận nhiệm vụ.'
          }
        ]
      }
    ],
    appendix: {
      worksheets: [
        {
          title: 'PHIẾU HỌC TẬP: ĐỌC ĐỒ THỊ DAO ĐỘNG',
          content: 'Xác định từ đồ thị: 1. Biên độ A; 2. Chu kỳ T; 3. Tần số f; 4. Pha ban đầu phi.'
        }
      ],
      rubrics: []
    }
  },
  slides: [
    {
      id: 'phy-slide-1',
      title: 'BÀI 1: DAO ĐỘNG ĐIỀU HÒA',
      subtitle: 'Chương 1: Dao động | Vật lí 11 | Chương trình GDPT 2018',
      phase: 'intro',
      layout: 'title',
      bullets: [
        'Giáo viên: ThS. Trần Thị Mai',
        'Thời lượng: 2 tiết',
        'Trọng tâm: Khái niệm dao động điều hòa, phương trình li độ x = A cos(ωt + φ)'
      ]
    },
    {
      id: 'phy-slide-2',
      title: 'I. KHỞI ĐỘNG: DAO ĐỘNG TRONG ĐỜI SỐNG',
      subtitle: 'Từ xích đu, cành cây đến màng loa âm thanh',
      phase: 'warmup',
      layout: 'two-columns',
      bullets: [
        'Dao động cơ: Là chuyển động qua lại quanh một vị trí cân bằng xác định.',
        'Dao động tuần hoàn: Là dao động mà sau những khoảng thời gian bằng nhau (chu kỳ), vật trở lại vị trí cũ theo hướng cũ.',
        'Ví dụ: Quả lắc đồng hồ chuyển động tuần hoàn.'
      ]
    }
  ],
  exam: {
    examTitle: 'ĐỀ KIỂM TRA ĐỊNH KỲ GIỮA KỲ I - VẬT LÍ 11',
    subject: 'Vật lí',
    grade: 'Lớp 11',
    durationMinutes: 45,
    schoolYear: '2025 - 2026',
    examCode: 'VL11-7991-01',
    matrix: {
      targetTotalScore: 10.0,
      recognitionRatio: 40,
      comprehensionRatio: 30,
      applicationRatio: 30
    },
    part1: {
      title: 'PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN',
      instructions: 'Thí sinh trả lời từ Câu 1 đến Câu 12 (0,25 điểm/câu).',
      totalScore: 3.0,
      questions: [
        {
          id: 'phy-p1-1',
          code: 'Câu 1',
          text: 'Một vật dao động điều hòa theo phương trình x = 6 cos(4πt + π/3) cm. Biên độ dao động của vật là:',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: '6 cm' },
            { key: 'B', text: '4π cm' },
            { key: 'C', text: 'π/3 cm' },
            { key: 'D', text: '12 cm' }
          ],
          correctAnswer: 'A',
          explanation: 'Biên độ A = 6 cm.'
        },
        {
          id: 'phy-p1-2',
          code: 'Câu 2',
          text: 'Chu kỳ dao động T liên hệ với tần số f theo công thức nào dưới đây?',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: 'T = 1 / f' },
            { key: 'B', text: 'T = 2π f' },
            { key: 'C', text: 'T = f / 2π' },
            { key: 'D', text: 'T = f²' }
          ],
          correctAnswer: 'A',
          explanation: 'Chu kỳ T = 1/f.'
        },
        {
          id: 'phy-p1-3',
          code: 'Câu 3',
          text: 'Trong dao động điều hòa, gia tốc của vật luôn:',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: 'Cùng pha với li độ' },
            { key: 'B', text: 'Ngược pha với li độ' },
            { key: 'C', text: 'Vuông pha với vận tốc' },
            { key: 'D', text: 'Không đổi theo thời gian' }
          ],
          correctAnswer: 'B',
          explanation: 'a = -ω² x nên gia tốc ngược pha với li độ.'
        },
        {
          id: 'phy-p1-4',
          code: 'Câu 4',
          text: 'Khi một vật dao động điều hòa đi qua vị trí cân bằng thì:',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: 'Vận tốc có độ lớn cực đại, gia tốc bằng 0' },
            { key: 'B', text: 'Vận tốc bằng 0, gia tốc cực đại' },
            { key: 'C', text: 'Cả vận tốc và gia tốc đều bằng 0' },
            { key: 'D', text: 'Cả vận tốc và gia tốc đều đạt cực đại' }
          ],
          correctAnswer: 'A',
          explanation: 'Tại VTCB x = 0 ⇒ a = 0, tốc độ |v| = v_max = ωA.'
        },
        {
          id: 'phy-p1-5',
          code: 'Câu 5',
          text: 'Một con lắc lò xo có độ cứng k = 100 N/m, vật nặng khối lượng m = 0.25 kg. Tần số góc của con lắc là:',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '20 rad/s' },
            { key: 'B', text: '10 rad/s' },
            { key: 'C', text: '40 rad/s' },
            { key: 'D', text: '5 rad/s' }
          ],
          correctAnswer: 'A',
          explanation: 'ω = √(k/m) = √(100 / 0.25) = √400 = 20 rad/s.'
        },
        {
          id: 'phy-p1-6',
          code: 'Câu 6',
          text: 'Một chất điểm dao động có li độ x = 5 cos(10t - π/2) cm. Vận tốc của chất điểm tại thời điểm t = 0 là:',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '50 cm/s' },
            { key: 'B', text: '-50 cm/s' },
            { key: 'C', text: '0 cm/s' },
            { key: 'D', text: '25 cm/s' }
          ],
          correctAnswer: 'A',
          explanation: 'v = -ωA sin(ωt + φ). Tại t = 0: v = -50 sin(-π/2) = 50 cm/s.'
        },
        {
          id: 'phy-p1-7',
          code: 'Câu 7',
          text: 'Động năng của vật dao động điều hòa biến thiên tuần hoàn với tần số góc bằng bao nhiêu so với tần số góc ω của li độ?',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '2ω' },
            { key: 'B', text: 'ω' },
            { key: 'C', text: 'ω / 2' },
            { key: 'D', text: '4ω' }
          ],
          correctAnswer: 'A',
          explanation: 'Động năng và thế năng biến thiên tuần hoàn với tần số góc ω\' = 2ω, chu kỳ T\' = T/2.'
        },
        {
          id: 'phy-p1-8',
          code: 'Câu 8',
          text: 'Một con lắc đơn có chiều dài l = 1 m dao động tại nơi có g = π² m/s². Chu kỳ dao động của con lắc là:',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: '2 s' },
            { key: 'B', text: '1 s' },
            { key: 'C', text: '0.5 s' },
            { key: 'D', text: '4 s' }
          ],
          correctAnswer: 'A',
          explanation: 'T = 2π √(l/g) = 2π √(1/π²) = 2 s.'
        },
        {
          id: 'phy-p1-9',
          code: 'Câu 9',
          text: 'Pha của dao động điều hòa tại thời điểm t cho phép xác định đại lượng nào sau đây?',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: 'Trạng thái dao động của vật (vị trí và chiều chuyển động)' },
            { key: 'B', text: 'Biên độ dao động' },
            { key: 'C', text: 'Chu kỳ dao động' },
            { key: 'D', text: 'Năng lượng toàn phần' }
          ],
          correctAnswer: 'A',
          explanation: 'Pha dao động (ωt + φ) xác định trạng thái của dao động tại thời điểm t.'
        },
        {
          id: 'phy-p1-10',
          code: 'Câu 10',
          text: 'Khi đưa con lắc đơn lên đỉnh núi cao, chu kỳ dao động bé của con lắc sẽ:',
          level: 'TH',
          score: 0.25,
          options: [
            { key: 'A', text: 'Tăng lên vì gia tốc trọng trường g giảm' },
            { key: 'B', text: 'Giảm đi vì g tăng' },
            { key: 'C', text: 'Không thay đổi' },
            { key: 'D', text: 'Luôn bằng 2 s' }
          ],
          correctAnswer: 'A',
          explanation: 'Lên cao g giảm, T = 2π √(l/g) tỉ lệ nghịch với √g nên T tăng.'
        },
        {
          id: 'phy-p1-11',
          code: 'Câu 11',
          text: 'Một vật dao động điều hòa với biên độ A = 10 cm. Quãng đường vật đi được trong 1 chu kỳ là:',
          level: 'NB',
          score: 0.25,
          options: [
            { key: 'A', text: '40 cm' },
            { key: 'B', text: '20 cm' },
            { key: 'C', text: '10 cm' },
            { key: 'D', text: '0 cm' }
          ],
          correctAnswer: 'A',
          explanation: 'Trong 1 chu kỳ T, quãng đường vật luôn đi được là S = 4A = 40 cm.'
        },
        {
          id: 'phy-p1-12',
          code: 'Câu 12',
          text: 'Một vật dao động có phương trình x = 4 cos(2πt) cm. Thời điểm đầu tiên vật qua vị trí x = -2 cm theo chiều âm là:',
          level: 'VD',
          score: 0.25,
          options: [
            { key: 'A', text: '1/3 s' },
            { key: 'B', text: '1/6 s' },
            { key: 'C', text: '2/3 s' },
            { key: 'D', text: '5/6 s' }
          ],
          correctAnswer: 'A',
          explanation: 't = 0 vật ở biên dương +4 cm. Đi đến x = -2 cm theo chiều âm góc quay Δα = 2π/3. t = Δα / ω = (2π/3) / (2π) = 1/3 s.'
        }
      ]
    },
    part2: {
      title: 'PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG / SAI',
      instructions: 'Thí sinh trả lời từ Câu 1 đến Câu 4 (Mỗi câu tối đa 1,0 điểm theo barem CV 7991: đúng 1 ý 0.1đ, đúng 2 ý 0.25đ, đúng 3 ý 0.5đ, đúng 4 ý 1.0đ).',
      totalScore: 4.0,
      questions: [
        {
          id: 'phy-p2-1',
          code: 'Câu 1',
          stem: 'Một con lắc lò xo gồm lò xo nhẹ độ cứng k = 40 N/m và vật nhỏ khối lượng m = 100 g dao động điều hòa trên mặt phẳng nằm ngang không ma sát. Kéo vật lệch khỏi VTCB 4 cm rồi thả nhẹ tại t = 0.',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Tần số góc dao động của con lắc là ω = 20 rad/s.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì ω = √(k/m) = √(40 / 0.1) = 20 rad/s.'
            },
            {
              subId: 'b',
              text: 'Biên độ dao động của vật là A = 4 cm và pha ban đầu φ = 0 rad.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng vì thả nhẹ tại x = 4 cm nên đó là biên dương, tại t=0 x = A cos(φ) = A ⇒ φ = 0.'
            },
            {
              subId: 'c',
              text: 'Tốc độ cực đại của vật trong quá trình dao động là v_max = 80 cm/s.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng vì v_max = ωA = 20 · 4 = 80 cm/s.'
            },
            {
              subId: 'd',
              text: 'Cơ năng của con lắc lò xo là 0.032 J.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng vì W = 1/2 k A² = 0.5 · 40 · (0.04)² = 20 · 0.0016 = 0.032 J.'
            }
          ]
        },
        {
          id: 'phy-p2-2',
          code: 'Câu 2',
          stem: 'Xét hai dao động điều hòa cùng phương, cùng tần số có phương trình x₁ = 3 cos(10t) cm và x₂ = 4 cos(10t + π/2) cm.',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Hai dao động x₁ và x₂ vuông pha với nhau.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Độ lệch pha Δφ = π/2 nên hai dao động vuông pha.'
            },
            {
              subId: 'b',
              text: 'Dao động tổng hợp có biên độ là A = 5 cm.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Vì vuông pha nên A = √(A₁² + A₂²) = √(3² + 4²) = 5 cm.'
            },
            {
              subId: 'c',
              text: 'Khi dao động thứ nhất có li độ x₁ = 3 cm thì dao động thứ hai có li độ x₂ = 0 cm.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Vì vuông pha, (x₁/A₁)² + (x₂/A₂)² = 1. Khi x₁ = A₁ = 3 thì x₂ = 0.'
            },
            {
              subId: 'd',
              text: 'Pha ban đầu của dao động tổng hợp là φ = π/4 rad.',
              isCorrect: false,
              level: 'VD',
              explanation: 'Sai vì tan φ = (A₂ sin φ₂ + A₁ sin φ₁) / (A₂ cos φ₂ + A₁ cos φ₁) = 4 / 3 ⇒ φ ≈ 0.927 rad ≠ π/4.'
            }
          ]
        },
        {
          id: 'phy-p2-3',
          code: 'Câu 3',
          stem: 'Cho một vật có khối lượng m = 200 g dao động điều hòa dọc theo trục Ox. Đồ thị thế năng biến thiên theo thời gian có chu kỳ là 0.1 s và thế năng cực đại là 10 mJ.',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Chu kỳ dao động điều hòa của vật là T = 0.2 s.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Chu kỳ của thế năng T_Wt = T/2 = 0.1 s ⇒ T = 0.2 s.'
            },
            {
              subId: 'b',
              text: 'Cơ năng của vật bằng thế năng cực đại và bằng 10 mJ.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng vì cơ năng bảo toàn và bằng thế năng cực đại.'
            },
            {
              subId: 'c',
              text: 'Độ cứng của hệ liên kết dao động là k = 20 N/m.',
              isCorrect: true,
              level: 'VD',
              explanation: 'ω = 2π / 0.2 = 10π. k = m ω² = 0.2 · (10π)² = 0.2 · 1000 = 200 N/m (Sai nếu là 20 N/m) ⇒ Nhận định này Sai.'
            },
            {
              subId: 'd',
              text: 'Tại thời điểm động năng bằng thế năng, độ lớn li độ của vật là |x| = A / √2.',
              isCorrect: true,
              level: 'TH',
              explanation: 'W_d = W_t ⇒ W_t = W/2 ⇒ 1/2 k x² = 1/2 (1/2 k A²) ⇒ |x| = A / √2.'
            }
          ]
        },
        {
          id: 'phy-p2-4',
          code: 'Câu 4',
          stem: 'Một nhóm học sinh làm thí nghiệm thực hành khảo sát chu kỳ con lắc đơn phụ thuộc vào chiều dài dây treo tại phòng thí nghiệm.',
          scoreMax: 1.0,
          statements: [
            {
              subId: 'a',
              text: 'Góc lệch ban đầu của con lắc cần giữ nhỏ hơn 10 độ để dao động được coi là dao động điều hòa.',
              isCorrect: true,
              level: 'NB',
              explanation: 'Đúng, với α₀ ≤ 10° thì sin α ≈ α (rad).'
            },
            {
              subId: 'b',
              text: 'Đồ thị biểu diễn mối liên hệ giữa bình phương chu kỳ T² và chiều dài l là một đường thẳng đi qua gốc tọa độ.',
              isCorrect: true,
              level: 'TH',
              explanation: 'Đúng vì T² = (4π² / g) · l có dạng y = ax.'
            },
            {
              subId: 'c',
              text: 'Nếu tăng khối lượng quả nặng lên gấp đôi thì chu kỳ dao động của con lắc đơn cũng tăng gấp đôi.',
              isCorrect: false,
              level: 'NB',
              explanation: 'Sai vì chu kỳ con lắc đơn T = 2π √(l/g) không phụ thuộc vào khối lượng m.'
            },
            {
              subId: 'd',
              text: 'Đo được chiều dài l = 0.8 m và chu kỳ T = 1.79 s, ta tính được gia tốc trọng trường g ≈ 9.85 m/s².',
              isCorrect: true,
              level: 'VD',
              explanation: 'g = 4π² l / T² = 4 · 9.87 · 0.8 / (1.79)² ≈ 9.85 m/s².'
            }
          ]
        }
      ]
    },
    part3: {
      title: 'PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN',
      instructions: 'Thí sinh trả lời từ Câu 1 đến Câu 4 (Mỗi câu trả lời đúng được 0,5 điểm).',
      totalScore: 2.0,
      questions: [
        {
          id: 'phy-p3-1',
          code: 'Câu 1',
          text: 'Một con lắc lò xo dao động với phương trình x = 8 cos(5πt) cm. Tìm tốc độ của vật khi nó đi qua vị trí cân bằng (theo đơn vị cm/s, lấy π = 3.14).',
          level: 'NB',
          score: 0.5,
          unit: 'cm/s',
          correctAnswer: '125.6',
          explanation: 'v_max = ωA = 5π · 8 = 40π = 40 · 3.14 = 125.6 cm/s.'
        },
        {
          id: 'phy-p3-2',
          code: 'Câu 2',
          text: 'Một con lắc đơn có chu kỳ dao động T = 2 s tại một nơi có g = 9.8 m/s². Tính chiều dài dây treo của con lắc (làm tròn đến hai chữ số thập phân, đơn vị mét).',
          level: 'TH',
          score: 0.5,
          unit: 'm',
          correctAnswer: '0.99',
          explanation: 'l = g T² / (4π²) = 9.8 · 4 / (4 · 9.87) ≈ 0.99 m.'
        },
        {
          id: 'phy-p3-3',
          code: 'Câu 3',
          text: 'Một vật có khối lượng 100 g dao động điều hòa với biên độ 10 cm và tần số 2 Hz. Tính cơ năng của vật (theo đơn vị mJ, lấy π² = 10).',
          level: 'VD',
          score: 0.5,
          unit: 'mJ',
          correctAnswer: '80',
          explanation: 'ω = 2πf = 4π rad/s. W = 1/2 m ω² A² = 0.5 · 0.1 · (16π²) · (0.1)² = 0.05 · 160 · 0.01 = 0.08 J = 80 mJ.'
        },
        {
          id: 'phy-p3-4',
          code: 'Câu 4',
          text: 'Khoảng thời gian ngắn nhất để vật dao động điều hòa đi từ vị trí x₁ = A/2 đến vị trí x₂ = A√3/2 là bao nhiêu phần của chu kỳ T? (Nhập dưới dạng phân số tối giản a/b)',
          level: 'TH',
          score: 0.5,
          correctAnswer: '1/12',
          explanation: 't₁ (từ 0 đến A/2) = T/12. t₂ (từ 0 đến A√3/2) = T/6. Thời gian đi giữa hai vị trí = T/6 - T/12 = T/12.'
        }
      ]
    },
    part4: {
      title: 'PHẦN IV. CÂU HỎI TỰ LUẬN',
      instructions: 'Thí sinh trình bày chi tiết các bước giải bài toán vào tờ giấy thi (1,0 điểm).',
      totalScore: 1.0,
      questions: [
        {
          id: 'phy-p4-1',
          code: 'Câu 1 (Tự luận)',
          text: 'Một con lắc lò xo treo thẳng đứng gồm vật nặng khối lượng m = 400 g và lò xo nhẹ có độ cứng k = 100 N/m. Lấy g = 10 m/s² và π² = 10.\na) Tính độ dãn Δl₀ của lò xo ở vị trí cân bằng.\nb) Từ vị trí cân bằng, kéo vật thẳng đứng xuống dưới một đoạn 6 cm rồi truyền cho nó vận tốc 50 cm/s hướng lên trên. Chọn trục tọa độ Ox thẳng đứng hướng xuống, gốc O tại VTCB, gốc thời gian t = 0 là lúc truyền vận tốc. Viết phương trình dao động của vật.',
          level: 'VD',
          score: 1.0,
          rubricSteps: [
            {
              stepDescription: 'a) Tại VTCB lò xo dãn một đoạn: Δl₀ = mg / k = (0.4 · 10) / 100 = 0.04 m = 4 cm.',
              score: 0.25
            },
            {
              stepDescription: 'b) Tính tần số góc: ω = √(k/m) = √(100 / 0.4) = √250 = 5√10 = 5π rad/s (hoặc 15.81 rad/s).',
              score: 0.25
            },
            {
              stepDescription: 'Áp dụng công thức độc lập thời gian tại t = 0: x₀ = 6 cm; v₀ = -50 cm/s (hướng lên ngược chiều dương). A² = x₀² + (v₀/ω)² = 6² + (-50 / 5π)² = 36 + 10 = 46 ⇒ A = √46 ≈ 6.78 cm (hoặc nếu lấy ω=15.8 rad/s thì A ≈ 6.78 cm).',
              score: 0.25
            },
            {
              stepDescription: 'Xác định pha ban đầu: cos φ = x₀ / A = 6 / √46 > 0; vì v₀ < 0 nên sin φ > 0 ⇒ φ = arccos(6 / √46) ≈ 0.49 rad. Kết luận: x = √46 cos(5πt + 0.49) cm.',
              score: 0.25
            }
          ]
        }
      ]
    }
  },
  verificationPassed: {
    has3Subsystems: true,
    part2TrueFalse4Items: true,
    hasExportTools: true,
    hasJsonStateHandoff: true
  }
};
