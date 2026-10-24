import { SubjectType, GradeLevel, TextbookSeries, CurriculumEntry, WorkspaceState } from '../types/edtech';
import { CURRICULUM_TOAN_9 } from '../data/curriculumToan9';

export interface CloudBook {
  id: string;
  type: 'SGK' | 'SBT' | 'SGV'; // Sách Giáo Khoa, Sách Bài Tập, Sách Giáo Viên
  title: string;
  subject: SubjectType;
  grade: GradeLevel;
  semester: 1 | 2;
  textbook: TextbookSeries;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  cloudStorageUrl: string;
  pagesCount: number;
  chaptersCount: number;
  cloudStatus: 'synced' | 'uploading' | 'verified';
}

export interface CloudArtifact {
  id: string;
  title: string;
  format: 'WORD' | 'PDF' | 'PPTX' | 'HTML';
  module: 'KHBD' | 'SLIDE' | 'EXAM' | 'MATRIX';
  subject: SubjectType;
  grade: GradeLevel;
  lessonName: string;
  fileSize: string;
  createdAt: string;
  cloudStoragePath: string;
  cloudSyncStatus: 'synced' | 'pending';
}

// Initial preloaded standard textbooks (Bộ sách Kết Nối Tri Thức Với Cuộc Sống)
export const DEFAULT_CLOUD_BOOKS: CloudBook[] = [
  {
    id: 'book-sgk-toan-9-t1',
    type: 'SGK',
    title: 'Sách Giáo Khoa Toán 9 - Tập 1 (Kết Nối Tri Thức)',
    subject: 'Toán học',
    grade: 'Lớp 9',
    semester: 1,
    textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
    fileName: 'SGK_Toan_9_Tap1_KNTT_BoGDDT.pdf',
    fileSize: '28.4 MB',
    uploadedAt: '15/08/2024 08:30',
    cloudStorageUrl: 'cloud://edumaster-storage/sgk/toan9_kntt_t1.pdf',
    pagesCount: 136,
    chaptersCount: 5,
    cloudStatus: 'verified'
  },
  {
    id: 'book-sgk-toan-9-t2',
    type: 'SGK',
    title: 'Sách Giáo Khoa Toán 9 - Tập 2 (Kết Nối Tri Thức)',
    subject: 'Toán học',
    grade: 'Lớp 9',
    semester: 2,
    textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
    fileName: 'SGK_Toan_9_Tap2_KNTT_BoGDDT.pdf',
    fileSize: '31.2 MB',
    uploadedAt: '15/08/2024 08:45',
    cloudStorageUrl: 'cloud://edumaster-storage/sgk/toan9_kntt_t2.pdf',
    pagesCount: 144,
    chaptersCount: 5,
    cloudStatus: 'verified'
  },
  {
    id: 'book-sbt-toan-9',
    type: 'SBT',
    title: 'Sách Bài Tập Toán 9 (Kết Nối Tri Thức)',
    subject: 'Toán học',
    grade: 'Lớp 9',
    semester: 1,
    textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
    fileName: 'SBT_Toan_9_KNTT_NXB_GDVN.pdf',
    fileSize: '19.8 MB',
    uploadedAt: '18/08/2024 14:10',
    cloudStorageUrl: 'cloud://edumaster-storage/sbt/sbt_toan9_kntt.pdf',
    pagesCount: 112,
    chaptersCount: 5,
    cloudStatus: 'verified'
  },
  {
    id: 'book-sgv-toan-9',
    type: 'SGV',
    title: 'Sách Giáo Viên Toán 9 (Kết Nối Tri Thức)',
    subject: 'Toán học',
    grade: 'Lớp 9',
    semester: 1,
    textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
    fileName: 'SGV_Toan_9_KNTT_Chuan_SuPham.pdf',
    fileSize: '24.1 MB',
    uploadedAt: '20/08/2024 09:20',
    cloudStorageUrl: 'cloud://edumaster-storage/sgv/sgv_toan9_kntt.pdf',
    pagesCount: 168,
    chaptersCount: 5,
    cloudStatus: 'verified'
  },
  {
    id: 'book-sgk-van-9-t1',
    type: 'SGK',
    title: 'Sách Giáo Khoa Ngữ Văn 9 - Tập 1 (Kết Nối Tri Thức)',
    subject: 'Ngữ văn',
    grade: 'Lớp 9',
    semester: 1,
    textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
    fileName: 'SGK_NguVan_9_Tap1_KNTT.pdf',
    fileSize: '34.5 MB',
    uploadedAt: '22/08/2024 10:15',
    cloudStorageUrl: 'cloud://edumaster-storage/sgk/van9_kntt_t1.pdf',
    pagesCount: 152,
    chaptersCount: 5,
    cloudStatus: 'verified'
  },
  {
    id: 'book-sgk-khtn-9',
    type: 'SGK',
    title: 'Sách Giáo Khoa Khoa Học Tự Nhiên 9 (Kết Nối Tri Thức)',
    subject: 'Vật lí',
    grade: 'Lớp 9',
    semester: 1,
    textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
    fileName: 'SGK_KHTN_9_KNTT_BoGDDT.pdf',
    fileSize: '42.0 MB',
    uploadedAt: '25/08/2024 16:00',
    cloudStorageUrl: 'cloud://edumaster-storage/sgk/khtn9_kntt.pdf',
    pagesCount: 210,
    chaptersCount: 10,
    cloudStatus: 'verified'
  },
  {
    id: 'book-sgk-tienganh-9',
    type: 'SGK',
    title: 'Sách Giáo Khoa Tiếng Anh 9 Global Success (Kết Nối Tri Thức)',
    subject: 'Tiếng Anh',
    grade: 'Lớp 9',
    semester: 1,
    textbook: 'Kết Nối Tri Thức Với Cuộc Sống',
    fileName: 'SGK_TiengAnh_9_GlobalSuccess_KNTT.pdf',
    fileSize: '36.8 MB',
    uploadedAt: '26/08/2024 11:30',
    cloudStorageUrl: 'cloud://edumaster-storage/sgk/tienganh9_kntt.pdf',
    pagesCount: 138,
    chaptersCount: 12,
    cloudStatus: 'verified'
  }
];

// Preloaded curriculum entries for other subjects / grades if needed
export const EXTRA_CURRICULUM_SAMPLES: CurriculumEntry[] = [
  // Vật lí 9 / KHTN 9
  {
    id: 'vl9-w1-p1',
    grade: 'Lớp 9',
    subject: 'Vật lí',
    semester: 1,
    week: 1,
    periodNumber: 1,
    branch: 'Thực hành trải nghiệm',
    chapter: 'Chương 1. Năng lượng cơ học',
    lessonName: 'Bài 1. Động năng. Thế năng',
    equipment: 'Máng nghiêng, quả cầu kim loại, khối gỗ, thước đo',
    location: 'Phòng thí nghiệm KHTN',
    periodsCount: 2
  },
  {
    id: 'vl9-w1-p2',
    grade: 'Lớp 9',
    subject: 'Vật lí',
    semester: 1,
    week: 1,
    periodNumber: 2,
    branch: 'Thực hành trải nghiệm',
    chapter: 'Chương 1. Năng lượng cơ học',
    lessonName: 'Bài 2. Cơ năng và định luật bảo toàn cơ năng',
    equipment: 'Con lắc đơn, cảm biến vị trí, máy tính kết nối cảm biến',
    location: 'Phòng thực hành',
    periodsCount: 2
  },
  // Ngữ văn 9
  {
    id: 'nv9-w1-p1',
    grade: 'Lớp 9',
    subject: 'Ngữ văn',
    semester: 1,
    week: 1,
    periodNumber: 1,
    branch: 'Đại số', // Text analysis
    chapter: 'Bài 1. Thương nhớ quê hương',
    lessonName: 'Đọc hiểu văn bản: Chiếc lược ngà (Nguyễn Quang Sáng) - Tiết 1',
    equipment: 'Máy chiếu, phiếu bài tập đọc hiểu, sơ đồ tư duy',
    location: 'Lớp học',
    periodsCount: 2
  },
  // Tin học 9
  {
    id: 'th9-w1-p1',
    grade: 'Lớp 9',
    subject: 'Tin học',
    semester: 1,
    week: 1,
    periodNumber: 1,
    branch: 'Thực hành trải nghiệm',
    chapter: 'Chủ đề A. Máy tính và cộng đồng',
    lessonName: 'Bài 1. Vai trò của máy tính trong đời sống và khoa học kỹ thuật',
    equipment: 'Phòng máy tính kết nối mạng Internet, máy chiếu',
    location: 'Phòng Tin học',
    periodsCount: 1
  },
  // Hóa học 9 / KHTN 9
  {
    id: 'hh9-w1-p1',
    grade: 'Lớp 9',
    subject: 'Hóa học',
    semester: 1,
    week: 1,
    periodNumber: 1,
    branch: 'Thực hành trải nghiệm',
    chapter: 'Chương 1. Các loại hợp chất vô cơ',
    lessonName: 'Bài 1. Tính chất hóa học của Oxide. Khái quát phân loại',
    equipment: 'Ống nghiệm, kẹp gỗ, giá để ống nghiệm, hóa chất CuO, HCl, quỳ tím',
    location: 'Phòng thực hành Hóa',
    periodsCount: 2
  },
  // Sinh học 9 / KHTN 9
  {
    id: 'sh9-w1-p1',
    grade: 'Lớp 9',
    subject: 'Sinh học',
    semester: 1,
    week: 1,
    periodNumber: 1,
    branch: 'Thực hành trải nghiệm',
    chapter: 'Chương 1. Di truyền và biến dị',
    lessonName: 'Bài 1. Menđen và Di truyền học. Lai một cặp tính trạng',
    equipment: 'Tranh ảnh thí nghiệm lai đậu Hà Lan của Menđen, mô hình ADN',
    location: 'Lớp học',
    periodsCount: 2
  },
  // Tiếng Anh 9
  {
    id: 'ta9-w1-p1',
    grade: 'Lớp 9',
    subject: 'Tiếng Anh',
    semester: 1,
    week: 1,
    periodNumber: 1,
    branch: 'Thực hành trải nghiệm',
    chapter: 'Unit 1. Local Community',
    lessonName: 'Unit 1: Getting Started - A visit to a craft village',
    equipment: 'Audio Track, TV, Flashcards, handouts',
    location: 'Lớp học',
    periodsCount: 1
  }
];

const LOCAL_STORAGE_BOOKS_KEY = 'edumaster_cloud_books_v1';
const LOCAL_STORAGE_PPCT_KEY = 'edumaster_custom_ppct_v1';
const LOCAL_STORAGE_ARTIFACTS_KEY = 'edumaster_cloud_artifacts_v1';

export class CloudStorageService {
  // Load Books
  static getBooks(): CloudBook[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_BOOKS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading cloud books:', e);
    }
    return DEFAULT_CLOUD_BOOKS;
  }

  // Save Book
  static saveBook(book: CloudBook): CloudBook[] {
    const list = this.getBooks();
    const updated = [book, ...list];
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving book to cloud:', e);
    }
    return updated;
  }

  // Delete Book
  static deleteBook(bookId: string): CloudBook[] {
    const list = this.getBooks().filter(b => b.id !== bookId);
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error deleting book:', e);
    }
    return list;
  }

  // Get Curriculum (Combined Standard + Teacher's Custom Distribution)
  static getAllCurriculum(): CurriculumEntry[] {
    let custom: CurriculumEntry[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PPCT_KEY);
      if (stored) {
        custom = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading custom PPCT:', e);
    }
    return [...custom, ...CURRICULUM_TOAN_9, ...EXTRA_CURRICULUM_SAMPLES];
  }

  // Filter Curriculum by Subject -> Grade -> Semester
  static filterCurriculum(subject: SubjectType, grade: GradeLevel, semester: 1 | 2): CurriculumEntry[] {
    const all = this.getAllCurriculum();
    return all.filter(item => 
      item.subject === subject && 
      item.grade === grade && 
      item.semester === semester
    );
  }

  // Add Custom Curriculum Entry from Teacher's Distribution
  static addCurriculumEntry(entry: CurriculumEntry): CurriculumEntry[] {
    let custom: CurriculumEntry[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PPCT_KEY);
      if (stored) {
        custom = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading custom PPCT:', e);
    }
    const updated = [entry, ...custom];
    try {
      localStorage.setItem(LOCAL_STORAGE_PPCT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving custom PPCT:', e);
    }
    return this.getAllCurriculum();
  }

  // Delete Custom Curriculum Entry
  static deleteCurriculumEntry(entryId: string): CurriculumEntry[] {
    let custom: CurriculumEntry[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PPCT_KEY);
      if (stored) {
        custom = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading custom PPCT:', e);
    }
    const updated = custom.filter(item => item.id !== entryId);
    try {
      localStorage.setItem(LOCAL_STORAGE_PPCT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting custom PPCT entry:', e);
    }
    return this.getAllCurriculum();
  }

  // Get Cloud Artifacts (Generated Files)
  static getArtifacts(state?: WorkspaceState): CloudArtifact[] {
    let storedList: CloudArtifact[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ARTIFACTS_KEY);
      if (stored) {
        storedList = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading cloud artifacts:', e);
    }

    if (storedList.length > 0) {
      return storedList;
    }

    // Default artifacts based on current lesson
    const defaultSubject = state?.khbd.subject || 'Toán học';
    const defaultGrade = state?.khbd.grade || 'Lớp 9';
    const defaultLesson = state?.khbd.lessonName || 'Phương trình bậc hai một ẩn và công thức nghiệm';

    const defaults: CloudArtifact[] = [
      {
        id: 'art-khbd-word',
        title: `Kế hoạch bài dạy (Giáo án) 5512 - ${defaultLesson}`,
        format: 'WORD',
        module: 'KHBD',
        subject: defaultSubject,
        grade: defaultGrade,
        lessonName: defaultLesson,
        fileSize: '185 KB',
        createdAt: new Date().toLocaleDateString('vi-VN') + ' 09:15',
        cloudStoragePath: `cloud://edumaster/khbd/${defaultSubject}_${defaultGrade}_5512.doc`,
        cloudSyncStatus: 'synced'
      },
      {
        id: 'art-slide-pptx',
        title: `Slide Bài Giảng Trình Chiếu 16:9 - ${defaultLesson}`,
        format: 'PPTX',
        module: 'SLIDE',
        subject: defaultSubject,
        grade: defaultGrade,
        lessonName: defaultLesson,
        fileSize: '4.2 MB',
        createdAt: new Date().toLocaleDateString('vi-VN') + ' 09:18',
        cloudStoragePath: `cloud://edumaster/slides/${defaultSubject}_${defaultGrade}_SlideDeck.pptx`,
        cloudSyncStatus: 'synced'
      },
      {
        id: 'art-exam-word',
        title: `Đề Kiểm Tra Chuẩn CV 7991 (4 Phần • 10.0đ) - ${defaultLesson}`,
        format: 'WORD',
        module: 'EXAM',
        subject: defaultSubject,
        grade: defaultGrade,
        lessonName: defaultLesson,
        fileSize: '142 KB',
        createdAt: new Date().toLocaleDateString('vi-VN') + ' 09:22',
        cloudStoragePath: `cloud://edumaster/exams/${defaultSubject}_${defaultGrade}_DeThi7991.doc`,
        cloudSyncStatus: 'synced'
      },
      {
        id: 'art-matrix-word',
        title: `Ma Trận Đặc Tả Đề Kiểm Tra (Tỉ lệ 40-30-30) - ${defaultLesson}`,
        format: 'WORD',
        module: 'MATRIX',
        subject: defaultSubject,
        grade: defaultGrade,
        lessonName: defaultLesson,
        fileSize: '98 KB',
        createdAt: new Date().toLocaleDateString('vi-VN') + ' 09:24',
        cloudStoragePath: `cloud://edumaster/matrix/${defaultSubject}_${defaultGrade}_MaTranDacTa.doc`,
        cloudSyncStatus: 'synced'
      },
      {
        id: 'art-slide-pdf',
        title: `Tài liệu Slide Bài Giảng Handout A4 PDF - ${defaultLesson}`,
        format: 'PDF',
        module: 'SLIDE',
        subject: defaultSubject,
        grade: defaultGrade,
        lessonName: defaultLesson,
        fileSize: '1.8 MB',
        createdAt: new Date().toLocaleDateString('vi-VN') + ' 09:26',
        cloudStoragePath: `cloud://edumaster/pdf/${defaultSubject}_${defaultGrade}_SlideHandout.pdf`,
        cloudSyncStatus: 'synced'
      }
    ];

    try {
      localStorage.setItem(LOCAL_STORAGE_ARTIFACTS_KEY, JSON.stringify(defaults));
    } catch (e) {
      console.error('Error seeding artifacts:', e);
    }
    return defaults;
  }

  // Register New Generated Artifact in Cloud
  static recordArtifact(artifact: CloudArtifact): CloudArtifact[] {
    const list = this.getArtifacts();
    const updated = [artifact, ...list];
    try {
      localStorage.setItem(LOCAL_STORAGE_ARTIFACTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error recording artifact:', e);
    }
    return updated;
  }
}
