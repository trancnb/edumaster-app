export interface TeacherProfile {
  teacherName: string;
  className: string; // Lớp hoặc danh sách lớp phân công, vd: "8/5, 9/1, 9/2"
  assignedClasses?: string; // Toàn bộ các lớp được phân công dạy
  subject: string;
  schoolYear: string;
}

const STORAGE_KEY = 'edtech_teacher_profile';

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  teacherName: '',
  className: '9A1',
  assignedClasses: '9A1',
  subject: 'Toán học',
  schoolYear: '2026-2027'
};

export function getSavedTeacherProfile(): TeacherProfile {
  if (typeof window === 'undefined') return DEFAULT_TEACHER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const effectiveAssigned = parsed.assignedClasses || parsed.className || DEFAULT_TEACHER_PROFILE.assignedClasses;
      return {
        teacherName: parsed.teacherName !== undefined ? parsed.teacherName : DEFAULT_TEACHER_PROFILE.teacherName,
        className: parsed.className !== undefined ? parsed.className : DEFAULT_TEACHER_PROFILE.className,
        assignedClasses: effectiveAssigned,
        subject: parsed.subject !== undefined ? parsed.subject : DEFAULT_TEACHER_PROFILE.subject,
        schoolYear: parsed.schoolYear !== undefined ? parsed.schoolYear : DEFAULT_TEACHER_PROFILE.schoolYear,
      };
    }
  } catch (err) {
    console.warn('Error reading teacher profile from localStorage', err);
  }
  return DEFAULT_TEACHER_PROFILE;
}

export function saveTeacherProfile(patch: Partial<TeacherProfile>): TeacherProfile {
  const current = getSavedTeacherProfile();
  const updated: TeacherProfile = { ...current, ...patch };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Error saving teacher profile to localStorage', err);
    }
  }
  return updated;
}
