'use client';

import { useState } from 'react';
import { Share2, Check, X } from 'lucide-react';
import type { ImageTransform } from '@/lib/canvas';
import { createOutputCanvas } from '@/lib/canvas';

interface ShareButtonProps {
  userImage: HTMLImageElement | null;
  frameImage: HTMLImageElement | null;
  transform: ImageTransform;
}

export default function ShareButton({
  userImage,
  frameImage,
  transform,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);

  // Chỉ hiển thị nếu Web Share API hỗ trợ
  if (typeof navigator === 'undefined' || !navigator.share) {
    return null;
  }

  const handleShare = async () => {
    if (!userImage || !frameImage) return;

    setIsSharing(true);
    try {
      const outputCanvas = createOutputCanvas(userImage, frameImage, transform);

      // Chuyển canvas thành blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Cannot create blob'));
          },
          'image/png'
        );
      });

      const file = new File([blob], 'avatar-chuyen-doi-so-son-dong.png', {
        type: 'image/png',
      });

      // Kiểm tra có thể share file không
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Avatar Chuyển Đổi Số – Xã Sơn Đồng',
          text: 'Tạo avatar chuyển đổi số của tôi với khung Ngày Chuyển Đổi Số Quốc Gia 10/10',
          files: [file],
        });
      } else {
        await navigator.share({
          title: 'Avatar Chuyển Đổi Số – Xã Sơn Đồng',
          text: 'Tạo avatar chuyển đổi số tại: ' + window.location.href,
        });
      }

      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch (err) {
      // User cancelled share - không phải lỗi
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share error:', err);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!userImage || !frameImage || isSharing}
      className="btn-secondary w-full"
      aria-label="Chia sẻ avatar"
    >
      {shared ? (
        <>
          <Check size={16} className="text-green-400" />
          <span>Đã chia sẻ!</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span>Chia sẻ</span>
        </>
      )}
    </button>
  );
}
