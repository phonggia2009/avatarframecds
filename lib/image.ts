/**
 * Image utility functions
 */

import { FRAME_CONFIG } from './frameConfig';

export type SupportedFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const SUPPORTED_FORMATS: SupportedFormat[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Kiểm tra file ảnh có hợp lệ không
 */
export function validateImageFile(file: File): ValidationResult {
  // Kiểm tra định dạng
  if (!SUPPORTED_FORMATS.includes(file.type as SupportedFormat)) {
    return {
      valid: false,
      error: 'Vui lòng chọn ảnh JPG, PNG hoặc WEBP.',
    };
  }

  // Kiểm tra dung lượng
  if (file.size > FRAME_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: 'Ảnh vượt quá dung lượng cho phép. Vui lòng chọn ảnh nhỏ hơn 20 MB.',
    };
  }

  return { valid: true };
}

/**
 * Load file ảnh thành HTMLImageElement (100% client-side, không upload server)
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      // Revoke URL ngay sau khi load xong để tránh memory leak
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể đọc ảnh này. Vui lòng thử một ảnh khác.'));
    };

    img.src = objectUrl;
  });
}

/**
 * Load ảnh từ URL (dùng để load frame)
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Chỉ đặt crossOrigin cho link ngoài (tránh lỗi CORS với static file nội bộ /khungfinal.png)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Không thể load ảnh từ: ${url}`));
    img.src = url;
  });
}

/**
 * Định dạng dung lượng file thân thiện
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
