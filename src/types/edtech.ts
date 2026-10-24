export type SystemTab = 'workflow' | 'khbd' | 'slide' | 'exam';

export type SubjectType = 'Toán học' | 'Vật lí' | 'Hóa học' | 'Sinh học' | 'Ngữ văn' | 'Lịch sử' | 'Địa lí' | 'Tin học' | 'Tiếng Anh';
export type EducationLevel = 'THCS' | 'THPT';
export type GradeLevel = 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
export type TextbookSeries = 'Kết Nối Tri Thức Với Cuộc Sống' | 'Cánh Diều' | 'Chân Trời Sáng Tạo';

// Phân phối chương trình (PPCT) entry
export interface CurriculumEntry {
  id: string;
  grade: GradeLevel;
  subject: SubjectType;
  semester: 1 | 2;
  week: number;
  periodNumber: number; // Thứ tự tiết của phân môn (Đại số, Hình học đếm riêng biệt)
  overallPeriodNumber?: number; // Thứ tự tiết tổng thể cả năm (1-140)
  branch: 'Đại số' | 'Hình học' | 'Thống kê & Xác suất' | 'Thực hành trải nghiệm' | 'Kiểm tra';
  lessonName: string;
  chapter: string;
  equipment: string;
  location: string;
  digitalCompetency?: string; // Ví dụ: 5.3.NC1a, 1.1.NC1b...
  aiRoleCode?: string; // Ví dụ: 9.A3.1, 9.C5.1, 9.D1.1, 9.C2.1, 9.C3.1...
  periodsCount: number;
}

// KHBD (Công văn 5512) Types
export interface KHBDActivityStep {
  name: string; // Bước 1: Chuyển giao nhiệm vụ | Bước 2: Thực hiện nhiệm vụ | Bước 3: Báo cáo, thảo luận | Bước 4: Kết luận, nhận định
  teacherAction: string;
  studentAction: string;
}

export interface KHBDActivityRow {
  gvHsAction: string; // Hoạt động của giáo viên và học sinh (đề bài, tình huống, câu hỏi, nhiệm vụ)
  expectedProduct: string; // Sản phẩm dự kiến (lời giải, công thức, biến đổi, kết quả chi tiết)
  nlsAiCode: string; // Mã NLS và AI (ví dụ: "2.1.TC2a – HS lựa chọn phép biến đổi và ghi lại quy trình")
}

export interface KHBDActivity {
  id: string;
  code: 'hd1' | 'hd2' | 'hd3' | 'hd4';
  title: string; // Tên hoạt động (vd: Hoạt động 1: Khởi động / Mở đầu)
  objective: string; // a) Mục tiêu
  content: string; // b) Nội dung
  product: string; // c) Sản phẩm học tập
  steps: KHBDActivityStep[]; // d) Tổ chức thực hiện (4 bước)
  tableRows?: KHBDActivityRow[]; // Bảng 3 cột chuẩn ruột kiến thức (Hoạt động GV-HS | Sản phẩm dự kiến | Mã NLS và AI)
  durationMinutes: number;
}

export interface KHBDData {
  schoolName: string;
  department: string;
  teacherName: string;
  lessonName: string;
  subject: SubjectType;
  textbook?: TextbookSeries;
  educationLevel?: EducationLevel;
  grade: GradeLevel;
  className?: string; // Lớp học cụ thể hiển thị trên KHBD (vd: 9/1, 9/2 hoặc 8/5)
  assignedClasses?: string; // Toàn bộ các lớp phân công dạy (vd: "8/5, 9/1, 9/2")
  schoolYear?: string; // Năm học (vd: 2026-2027)
  chapter?: string; // Chương / chuyên đề
  periodsCount: number;
  currentPeriod: number;
  timeframe: string;
  curriculumRef?: {
    week: number;
    period: number;
    overallPeriod?: number;
    lessonPeriod?: number;
    branch: string;
    chapter?: string;
    digitalCompetency?: string;
    aiRoleCode?: string;
  };
  // I. Mục tiêu
  objectives: {
    knowledge: string[];
    coreCompetencies: string[]; // Năng lực chung: tự chủ, giao tiếp, sáng tạo
    subjectCompetencies: string[]; // Năng lực đặc thù môn học
    qualities: string[]; // Phẩm chất: chăm chỉ, trách nhiệm, trung thực...
  };
  // II. Thiết bị và học liệu
  equipment: {
    teacher: string[];
    students: string[];
    digitalResources: string[];
  };
  // III. Tiến trình dạy học (4 hoạt động chuẩn 5512)
  activities: KHBDActivity[];
  // IV. Phụ lục và hồ sơ dạy học
  appendix: {
    worksheets: { title: string; content: string }[];
    rubrics: { criterion: string; level1: string; level2: string; level3: string }[];
  };
  notes?: string;
}

export interface KnowledgeCard {
  title: string;
  content: string;
  badge?: string;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'purple';
}

// Slide Presentation Types (Quy chuẩn theo ảnh mẫu & PDF bài giảng sư phạm KNTT)
export interface SlideItem {
  id: string;
  title: string;
  titlePart2?: string; // Dòng 2 tiêu đề nổi bật màu xanh dương
  subtitle?: string;
  badgeText?: string; // Huy hiệu vàng góc trên bên trái: ví dụ "TOÁN 3 • BÀI 9" hoặc "TOÁN 9 • BÀI 1"
  phase: string;
  activityRef?: string;
  layout: 'title' | 'content-left-image-right' | 'two-columns' | 'quiz' | 'key-takeaways' | 'content-split';
  bullets: string[];
  knowledgeCards?: KnowledgeCard[];
  bannerPrompt?: string; // Băng màu xanh ngọc (Mint green callout)
  mathProblems?: string[]; // 4 bài toán / phép tính nổi bật (2x2 grid)
  illustrationType?: 
    | 'nature-exploration' 
    | 'classroom-students' 
    | 'discovery-science' 
    | 'practice-math' 
    | 'real-world-success'
    | 'thcs-linear-equation'
    | 'thcs-group-discussion'
    | 'thcs-oxy-graph'
    | 'thcs-student-hand'
    | 'thcs-market-math';
  schoolName?: string;
  teacherName?: string;
  notes?: string;
  quizData?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  // Các trường đồ họa sư phạm cao cấp theo file mẫu PDF
  slideType?: 'welcome' | 'hero-title' | 'objectives' | 'agenda' | 'content-split' | 'cards-row' | 'ai-lab' | 'lucky-gift' | 'interactive-quiz' | 'quiz-results' | 'thank-you';
  statusBadge?: { label: string; color: 'orange' | 'cyan' | 'green' | 'blue' | 'purple' };
  chapterTag?: string; // Ví dụ: "CHƯƠNG IV • VECTƠ"
  philosophyQuote?: string; // Câu trích dẫn triết lý học tập
  ppctTag?: string; // Ví dụ: "TOÁN 10 • KNTT • TIẾT 1 • PPCT 35 • TUẦN 12"
  numberedBoxes?: { num: string; text: string; subText?: string }[];
  calloutBoxes?: { tag: string; tagColor: 'orange' | 'cyan' | 'green' | 'blue' | 'purple'; text: string; subText?: string }[];
  giftQuiz?: {
    questionNumber: number;
    level: string; // 'NB 1', 'NB 2', 'NB 3', 'TH'
    question: string;
    options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
    correctKey: 'A' | 'B' | 'C' | 'D';
    reward: string; // 'Ngôi sao chăm chỉ', 'Huy hiệu khám phá', 'Sticker toán học', 'Phiếu quà tư duy'
    rewardIcon?: string;
    explanation?: string;
    revealed?: boolean;
    selectedKey?: 'A' | 'B' | 'C' | 'D';
    openedGiftBoxId?: number;
  };
  stepByStep?: { step: number; title: string; content: string }[];
  activeStepIndex?: number;
  interactiveWidget?: 'check-equation-root' | 'graph-intersection' | 'system-classification';
}

// Exam (Công văn 7991) Types
export type CognitiveLevel = 'NB' | 'TH' | 'VD'; // Nhận biết (40%), Thông hiểu (30%), Vận dụng (30%)

export interface MultipleChoiceQuestion {
  id: string;
  code: string; // Câu 1, Câu 2...
  text: string;
  level: CognitiveLevel;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  score: number; // Thường 0.25đ
  explanation: string;
}

export interface TrueFalseStatement {
  subId: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
  level: CognitiveLevel;
  explanation: string;
}

export interface TrueFalseQuestion {
  id: string;
  code: string; // Câu 1, Câu 2...
  stem: string; // Đề bài / Bối cảnh dữ kiện chung
  statements: TrueFalseStatement[]; // 4 lệnh a, b, c, d
  scoreMax: number; // Luôn là 1.0 điểm theo quy tắc 7991
}

export interface ShortAnswerQuestion {
  id: string;
  code: string; // Câu 1, Câu 2...
  text: string;
  level: CognitiveLevel;
  correctAnswer: string;
  score: number; // 0.25đ hoặc 0.5đ
  unit?: string;
  explanation: string;
}

export interface EssayQuestion {
  id: string;
  code: string; // Câu 1, Câu 2...
  text: string;
  level: CognitiveLevel;
  score: number;
  rubricSteps: { stepDescription: string; score: number }[];
}

export interface ExamMatrix {
  targetTotalScore: 10.0;
  recognitionRatio: number; // Nhận biết: mục tiêu 40% (4.0đ)
  comprehensionRatio: number; // Thông hiểu: mục tiêu 30% (3.0đ)
  applicationRatio: number; // Vận dụng: mục tiêu 30% (3.0đ)
}

export interface Exam7991Data {
  examTitle: string; // ĐỀ KIỂM TRA ĐỊNH KỲ / CUỐI HỌC KỲ
  subject: SubjectType;
  grade: GradeLevel;
  durationMinutes: number; // 45, 60, hoặc 90 phút
  schoolYear: string;
  examCode: string;
  matrix: ExamMatrix;
  
  // 4 Phần độc lập theo CV 7991:
  part1: {
    title: string;
    instructions: string;
    questions: MultipleChoiceQuestion[];
    totalScore: number;
  };
  part2: {
    title: string;
    instructions: string;
    // Barem tính điểm chuẩn 7991:
    // Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ
    questions: TrueFalseQuestion[];
    totalScore: number;
  };
  part3: {
    title: string;
    instructions: string;
    questions: ShortAnswerQuestion[];
    totalScore: number;
  };
  part4: {
    title: string;
    instructions: string;
    questions: EssayQuestion[];
    totalScore: number;
  };
}

// Entire Lesson Workspace State (JSON State)
export interface WorkspaceState {
  version: string;
  lastUpdated: string;
  activeTab: SystemTab;
  khbd: KHBDData;
  slides: SlideItem[];
  exam: Exam7991Data;
  verificationPassed: {
    has3Subsystems: boolean;
    part2TrueFalse4Items: boolean;
    hasExportTools: boolean;
    hasJsonStateHandoff: boolean;
  };
}
