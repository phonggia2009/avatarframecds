'use client';

import { useState } from 'react';
import { Download, FileImage, Loader2 } from 'lucide-react';
import { downloadCanvas, createOutputCanvas } from '@/lib/canvas';
import { FRAME_CONFIG } from '@/lib/frameConfig';
import type { ImageTransform } from '@/lib/canvas';

interface DownloadButtonProps {
  userImage: HTMLImageElement | null;
  frameImage: HTMLImageElement | null;
  transform: ImageTransform;
  onSuccess?: () => void;
}

export default function DownloadButton({
  userImage,
  frameImage,
  transform,
  onSuccess,
}: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpg'>('png');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [webviewHint, setWebviewHint] = useState(false);

  const handleDownload = async () => {
    if (!userImage || !frameImage) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setWebviewHint(false);
    try {
      // Tạo output canvas 1536x1536
      const outputCanvas = createOutputCanvas(userImage, frameImage, transform);

      // Keep export synchronous with the user's tap for embedded webviews.
      const isEmbeddedWebView = await downloadCanvas(outputCanvas, format, FRAME_CONFIG.outputFileName);
      setWebviewHint(isEmbeddedWebView);

      onSuccess?.();
    } catch (err) {
      console.error('Lỗi khi tạo ảnh:', err);
      setErrorMsg('Không thể xuất ảnh. Vui lòng thử lại với định dạng khác.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Format selection */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setFormat('png')}
          className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150"
          style={{
            background: format === 'png' ? 'rgba(37,99,235,0.25)' : 'rgba(15,32,64,0.4)',
            border: format === 'png' ? '1.5px solid rgba(59,130,246,0.5)' : '1px solid rgba(59,130,246,0.15)',
            color: format === 'png' ? '#93c5fd' : '#4b5563',
          }}
          aria-pressed={format === 'png'}
          aria-label="Tải về định dạng PNG"
        >
          PNG
        </button>
        <button
          onClick={() => setFormat('jpg')}
          className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150"
          style={{
            background: format === 'jpg' ? 'rgba(37,99,235,0.25)' : 'rgba(15,32,64,0.4)',
            border: format === 'jpg' ? '1.5px solid rgba(59,130,246,0.5)' : '1px solid rgba(59,130,246,0.15)',
            color: format === 'jpg' ? '#93c5fd' : '#4b5563',
          }}
          aria-pressed={format === 'jpg'}
          aria-label="Tải về định dạng JPG"
        >
          JPG
        </button>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={!userImage || !frameImage || isGenerating}
        className="btn-gold w-full"
        aria-label={`Tải avatar về dạng ${format.toUpperCase()}`}
      >
        {isGenerating ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Đang tạo ảnh...
          </>
        ) : (
          <>
            <Download size={18} />
            TẢI ẢNH VỀ ({format.toUpperCase()})
          </>
        )}
      </button>

      {/* Error message */}
      {errorMsg && (
        <p className="mt-2 text-center text-xs text-red-400 font-medium">
          {errorMsg}
        </p>
      )}

      {webviewHint && (
        <p className="mt-2 text-center text-xs text-amber-300 font-medium" role="status">
          Zalo có thể chặn tải tự động. Nếu chưa thấy ảnh được lưu, hãy mở menu ⋮ rồi chọn Mở bằng trình duyệt và thực hiện thao tác tạo ảnh lại.
        </p>
      )}

      {/* Output info */}
      <p className="mt-2 text-center text-xs" style={{ color: 'rgba(59,130,246,0.5)' }}>
        <FileImage size={11} className="inline mr-1" />
        Kích thước output: 1536 × 1536 px
      </p>
    </div>
  );
}
