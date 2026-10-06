/**
 * Canvas rendering utilities
 * Tất cả logic vẽ canvas được tập trung tại đây
 */

import { FRAME_CONFIG } from './frameConfig';

export interface ImageTransform {
  x: number;       // Vị trí X của ảnh (tính từ tâm vùng tròn)
  y: number;       // Vị trí Y của ảnh (tính từ tâm vùng tròn)
  scale: number;   // Tỷ lệ zoom (1.0 = mặc định)
  rotation: number; // Góc xoay (radian)
}

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  userImage: HTMLImageElement;
  frameImage: HTMLImageElement;
  transform: ImageTransform;
}

/**
 * Tính toán scale tối thiểu để ảnh luôn phủ kín hoàn toàn vùng tròn (không lộ bất kỳ khoảng trống nào)
 */
export function calculateMinScale(
  imageWidth: number,
  imageHeight: number,
  circleRadius: number = FRAME_CONFIG.circle.radius
): number {
  const diameter = circleRadius * 2;
  const scaleX = diameter / imageWidth;
  const scaleY = diameter / imageHeight;
  return Math.max(scaleX, scaleY);
}

/** Giữ alias tương thích ngược */
export const calculateDefaultScale = calculateMinScale;

/**
 * Giới hạn vị trí (x, y) và scale của ảnh sao cho toàn bộ vùng crop hình tròn
 * LUÔN LUÔN nằm 100% bên trong bức ảnh của người dùng.
 * Đảm bảo:
 * - cropArea.left >= image.left
 * - cropArea.right <= image.right
 * - cropArea.top >= image.top
 * - cropArea.bottom <= image.bottom
 * Ngăn chặn tuyệt đối việc lộ nền đen, nền trắng, nền trong suốt hay khoảng trống.
 */
export function clampTransform(
  transform: ImageTransform,
  userImage: { width: number; height: number },
  circleRadius: number = FRAME_CONFIG.circle.radius
): ImageTransform {
  const minScale = calculateMinScale(userImage.width, userImage.height, circleRadius);
  const scale = Math.max(minScale, transform.scale);
  const rot = transform.rotation;

  // Bán kích thước ảnh sau khi scale (trong hệ trục của ảnh)
  const halfW = (userImage.width * scale) / 2;
  const halfH = (userImage.height * scale) / 2;

  // Giới hạn khoảng cách tối đa từ tâm hình tròn tới tâm ảnh
  // sao cho mép ảnh luôn bao phủ trọn vẹn đường tròn bán kính circleRadius
  const maxDu = Math.max(0, halfW - circleRadius);
  const maxDv = Math.max(0, halfH - circleRadius);

  // Chiếu vector dịch chuyển (transform.x, transform.y) vào hệ trục của ảnh xoay
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const du = transform.x * cos + transform.y * sin;
  const dv = -transform.x * sin + transform.y * cos;

  // Giới hạn du, dv nằm chặt chẽ trong phạm vi cho phép
  const clampedDu = Math.min(maxDu, Math.max(-maxDu, du));
  const clampedDv = Math.min(maxDv, Math.max(-maxDv, dv));

  // Chuyển ngược lại về hệ tọa độ frame (x, y)
  const clampedX = clampedDu * cos - clampedDv * sin;
  const clampedY = clampedDu * sin + clampedDv * cos;

  return {
    ...transform,
    scale,
    x: clampedX,
    y: clampedY,
  };
}

/**
 * Render ảnh lên canvas với clipping tròn và frame overlay
 * Pipeline:
 * 1. Clear canvas
 * 2. Save context
 * 3. Create circular clip path
 * 4. Draw user image (với transform đã được clamp)
 * 5. Restore context
 * 6. Draw frame PNG (always on top)
 */
export function renderAvatar(options: RenderOptions): void {
  const { canvas, userImage, frameImage, transform } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height, circle } = FRAME_CONFIG;

  // Tính tỷ lệ scale của canvas hiển thị so với canvas gốc
  const displayScale = canvas.width / width;

  // Scale tọa độ vùng tròn theo tỷ lệ canvas hiển thị
  const cx = circle.centerX * displayScale;
  const cy = circle.centerY * displayScale;
  const r = circle.radius * displayScale;

  // Đảm bảo transform luôn tuân thủ boundary
  const safeTransform = clampTransform(transform, userImage, circle.radius);

  // 1. Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Clip theo hình tròn và vẽ ảnh người dùng (100% lấp đầy vùng tròn)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Di chuyển origin tới tâm vùng tròn để rotate/scale/translate
  ctx.translate(cx + safeTransform.x * displayScale, cy + safeTransform.y * displayScale);
  ctx.rotate(safeTransform.rotation);
  ctx.scale(safeTransform.scale * displayScale, safeTransform.scale * displayScale);

  // Vẽ ảnh người dùng (căn giữa)
  ctx.drawImage(
    userImage,
    -userImage.width / 2,
    -userImage.height / 2,
    userImage.width,
    userImage.height
  );

  ctx.restore();

  // 3. Vẽ frame lên trên (TOP LAYER - không bao giờ bị che)
  // Frame luôn được vẽ ở 0,0 với kích thước đầy đủ canvas
  ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
}

/**
 * Export canvas thành file ảnh và trigger download
 */
/**
 * Export canvas thành file ảnh và trigger download
 * Sử dụng Blob + URL.createObjectURL để đảm bảo file tải về là file ảnh hợp lệ (.png hoặc .jpg),
 * tránh lỗi file không có đuôi hoặc data URL quá dài (>2MB) bị trình duyệt chuyển thành file lạ/corrupted.
 */
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg' = 'png',
  fileName: string = FRAME_CONFIG.outputFileName
): Promise<void> {
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = format === 'jpg' ? 0.95 : undefined;
  const ext = format === 'jpg' ? 'jpg' : 'png';
  const cleanFileName = fileName.endsWith(`.${ext}`) ? fileName : `${fileName}.${ext}`;

  return new Promise<void>((resolve, reject) => {
    try {
      // 1. Thử dùng canvas.toBlob (chuẩn W3C tốt nhất cho download file ảnh lớn)
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = cleanFileName;
              link.href = blobUrl;
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Dọn dẹp URL sau khi click
              setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
              }, 1500);

              resolve();
              return;
            }

            // Fallback sang toDataURL nếu blob null
            fallbackDataUrl();
          },
          mimeType,
          quality
        );
      } else {
        fallbackDataUrl();
      }
    } catch (err) {
      // Nếu có lỗi (ví dụ SecurityError hoặc toBlob lỗi), thử fallback
      try {
        fallbackDataUrl();
      } catch (fallbackErr) {
        reject(fallbackErr);
      }
    }

    function fallbackDataUrl() {
      try {
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const link = document.createElement('a');
        link.download = cleanFileName;
        link.href = dataUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } catch (err) {
        reject(err);
      }
    }
  });
}

/**
 * Tạo output canvas 1536x1536 và render kết quả cuối cùng
 */
export function createOutputCanvas(
  userImage: HTMLImageElement,
  frameImage: HTMLImageElement,
  transform: ImageTransform
): HTMLCanvasElement {
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = FRAME_CONFIG.width;
  outputCanvas.height = FRAME_CONFIG.height;

  renderAvatar({
    canvas: outputCanvas,
    userImage,
    frameImage,
    transform,
  });

  return outputCanvas;
}
