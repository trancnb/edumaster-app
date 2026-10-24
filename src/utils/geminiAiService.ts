import { GoogleGenAI } from '@google/genai';
import { KHBDData, SlideItem, Exam7991Data } from '../types/edtech';

export const GEMINI_API_KEY_REQUIRED_MESSAGE = 
  "Vui lòng bấm vào [Bấm để Cài đặt API, Google Drive & Cloud Storage] để nhập Gemini API Key của bạn trước khi sử dụng.";

/**
 * Đọc API Key cá nhân của người dùng từ localStorage.
 * Bắt buộc đọc từ localStorage.getItem('user_gemini_key') thay vì biến môi trường (env).
 */
export function getUserGeminiApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user_gemini_key');
    if (!raw) return null;
    // Hỗ trợ người dùng nhập nhiều key cách nhau bằng dòng mới hoặc dấu phẩy
    const keys = raw
      .split(/[\n,]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (keys.length === 0) return null;
    // Ưu tiên key chuẩn AIzaSy nếu có
    const officialKey = keys.find(k => k.startsWith('AIzaSy'));
    return officialKey || keys[0];
  } catch (err) {
    console.error('Lỗi đọc user_gemini_key từ localStorage:', err);
    return null;
  }
}

/**
 * Kiểm tra xem người dùng đã thiết lập Gemini API Key hợp lệ hay chưa
 */
export function hasUserGeminiApiKey(): boolean {
  const key = getUserGeminiApiKey();
  return Boolean(key && key.trim().length > 0);
}

/**
 * Cơ chế kiểm tra chặn:
 * Nếu user_gemini_key trống hoặc không tồn tại, chặn ngay việc gọi API
 * và hiển thị thông báo alert:
 * "Vui lòng bấm vào [Bấm để Cài đặt API, Google Drive & Cloud Storage] để nhập Gemini API Key của bạn trước khi sử dụng."
 */
export function ensureGeminiApiKey(): boolean {
  const key = getUserGeminiApiKey();
  if (!key) {
    if (typeof window !== 'undefined') {
      alert(GEMINI_API_KEY_REQUIRED_MESSAGE);
      window.dispatchEvent(new CustomEvent('gemini_key_missing', {
        detail: { message: GEMINI_API_KEY_REQUIRED_MESSAGE }
      }));
    }
    return false;
  }
  return true;
}

/**
 * Khởi tạo GoogleGenAI SDK bằng khóa cá nhân từ localStorage (Nhịp 2)
 */
export function getGeminiClient(): GoogleGenAI {
  if (!ensureGeminiApiKey()) {
    throw new Error(GEMINI_API_KEY_REQUIRED_MESSAGE);
  }
  const apiKey = getUserGeminiApiKey()!;
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

/**
 * Đọc Model AI được cấu hình từ localStorage ('user_gemini_model') (Nhịp 3).
 * Nếu trống hoặc không tồn tại, mặc định là 'gemini-3.7-flash'.
 * Tuyệt đối không hardcode cứng tên model để tương thích các phiên bản sau này.
 */
export function getUserGeminiModel(): string {
  if (typeof window === 'undefined') return 'gemini-3.7-flash';
  try {
    const customModel = localStorage.getItem('user_gemini_model');
    if (customModel && customModel.trim().length > 0) {
      return customModel.trim();
    }
  } catch (err) {
    console.warn('Lỗi đọc user_gemini_model từ localStorage:', err);
  }
  return 'gemini-3.7-flash';
}

/**
 * Hàm gọi Gemini API trực tiếp bằng khóa cá nhân của người dùng và model động (Nhịp 3)
 */
export async function callGeminiGenerate(options: {
  prompt: string;
  model?: string;
  systemInstruction?: string;
}): Promise<string> {
  if (!ensureGeminiApiKey()) {
    throw new Error(GEMINI_API_KEY_REQUIRED_MESSAGE);
  }

  const apiKey = getUserGeminiApiKey()!;
  // Đọc model động từ user_gemini_model, fallback là gemini-3.7-flash
  const model = options.model || getUserGeminiModel();

  try {
    // 1. Thử gọi qua SDK chính thức @google/genai
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const response = await ai.models.generateContent({
      model: model,
      contents: options.prompt,
      config: options.systemInstruction ? {
        systemInstruction: options.systemInstruction
      } : undefined
    });

    if (response && response.text) {
      return response.text;
    }
  } catch (sdkErr) {
    console.warn('Lỗi gọi SDK @google/genai, chuyển sang fallback REST fetch:', sdkErr);
  }

  // 2. Fallback REST fetch an toàn trực tiếp từ trình duyệt sử dụng user_gemini_key
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body: any = {
    contents: [
      {
        parts: [{ text: options.prompt }]
      }
    ]
  };
  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }]
    };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    const errText = errJson?.error?.message || `Lỗi Gemini API ${res.status}: ${res.statusText}`;
    throw new Error(errText);
  }

  const resData = await res.json();
  const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || '';
}

/**
 * Hàm chặn và kiểm tra khóa cho tác vụ Sinh/Tạo KHBD
 */
export function checkApiKeyForKHBDGeneration(): boolean {
  return ensureGeminiApiKey();
}

/**
 * Hàm chặn và kiểm tra khóa cho tác vụ Sinh/Tạo Slide Bài Giảng
 */
export function checkApiKeyForSlideGeneration(): boolean {
  return ensureGeminiApiKey();
}

/**
 * Hàm chặn và kiểm tra khóa cho tác vụ Sinh/Tạo Đề Thi
 */
export function checkApiKeyForExamGeneration(): boolean {
  return ensureGeminiApiKey();
}
