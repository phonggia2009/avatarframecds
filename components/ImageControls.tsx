'use client';

import { RotateCw, RefreshCcw } from 'lucide-react';

interface ImageControlsProps {
  onRotate: () => void;
  onReset: () => void;
}

export default function ImageControls({ onRotate, onReset }: ImageControlsProps) {
  return (
    <div className="flex gap-3">
      {/* Rotate button */}
      <button
        onClick={onRotate}
        className="btn-secondary flex-1 gap-2"
        aria-label="Xoay ảnh 90 độ theo chiều kim đồng hồ"
      >
        <RotateCw size={16} />
        <span className="text-sm">Xoay 90°</span>
      </button>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="btn-danger flex-1 gap-2"
        aria-label="Đặt lại về vị trí mặc định"
      >
        <RefreshCcw size={16} />
        <span className="text-sm">Đặt lại</span>
      </button>
    </div>
  );
}
