/**
 * FRAME CONFIGURATION
 *
 * Đây là file cấu hình duy nhất cho vùng tròn trung tâm của frame.
 * Khi cần chỉnh sửa tọa độ vùng tròn, CHỈ thay đổi tại đây.
 *
 * Cách xác định tọa độ:
 * - Mở khungfinal.png (1536x1536px)
 * - Dùng phần mềm ảnh (Photoshop, GIMP, Paint.NET...) để xác định
 *   tọa độ tâm và bán kính của vùng tròn đen ở trung tâm
 * - Cập nhật các giá trị dưới đây
 *
 * Hiện tại: Ước tính từ phân tích hình ảnh frame
 * - Frame 1536x1536px
 * - Vùng tròn trung tâm chiếm khoảng 66% chiều rộng frame
 * - Tâm nằm khoảng 52% từ trên xuống
 */

export const FRAME_CONFIG = {
  /** Kích thước gốc của frame PNG */
  width: 1536,
  height: 1536,

  /** Vùng tròn trung tâm để hiển thị ảnh người dùng */
  circle: {
    /**
     * Tọa độ X của tâm hình tròn (pixel, tính từ góc trên-trái)
     * Frame rộng 1536px, tâm tròn ở giữa → ~768px
     */
    centerX: 768,

    /**
     * Tọa độ Y của tâm hình tròn (pixel, tính từ góc trên-trái)
     * Tròn nằm hơi trên trung tâm frame → ~720px
     */
    centerY: 720,

    /**
     * Bán kính hình tròn (pixel)
     * Ước tính từ frame: vùng tròn chiếm ~64% chiều rộng → radius ~490px
     */
    radius: 490,
  },

  /** Tên file output khi tải về */
  outputFileName: 'avatar-chuyen-doi-so-son-dong',

  /** Đường dẫn file frame */
  framePath: '/khungfinal.png',

  /** Dung lượng ảnh tối đa (bytes) */
  maxFileSize: 20 * 1024 * 1024, // 20MB
} as const;

export type FrameConfig = typeof FRAME_CONFIG;
