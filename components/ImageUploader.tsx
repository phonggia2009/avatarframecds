'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, ImageIcon, AlertCircle } from 'lucide-react';
import { validateImageFile, loadImageFromFile } from '@/lib/image';

interface ImageUploaderProps {
  onImageLoaded: (image: HTMLImageElement) => void;
}

export default function ImageUploader({ onImageLoaded }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsLoading(true);

      // Validate
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'File không hợp lệ.');
        setIsLoading(false);
        return;
      }

      try {
        const img = await loadImageFromFile(file);
        onImageLoaded(img);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Không thể đọc ảnh này. Vui lòng thử một ảnh khác.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onImageLoaded]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
      // Reset input để có thể chọn lại cùng file
      e.target.value = '';
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    },
    []
  );

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Chọn ảnh từ thiết bị"
        id="file-input"
      />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Kéo thả ảnh hoặc nhấn để chọn ảnh"
        aria-disabled={isLoading}
        className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onKeyDown={handleKeyDown}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            <p className="text-blue-300 font-medium text-sm">Đang tải ảnh...</p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse-glow"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(29,78,216,0.2))',
                  border: '1.5px solid rgba(59,130,246,0.35)',
                }}
              >
                {isDragOver ? (
                  <ImageIcon size={36} className="text-blue-300" />
                ) : (
                  <Upload size={36} className="text-blue-400" />
                )}
              </div>
            </div>

            {/* Text */}
            {isDragOver ? (
              <p className="text-lg font-bold text-blue-200 mb-1">Thả ảnh vào đây</p>
            ) : (
              <>
                <p className="text-lg font-bold text-white mb-1">
                  KÉO THẢ ẢNH VÀO ĐÂY
                </p>
                <p className="text-sm text-blue-300/70 mb-5">hoặc</p>
                <button
                  type="button"
                  className="btn-primary pointer-events-none"
                  tabIndex={-1}
                >
                  <ImageIcon size={16} />
                  CHỌN ẢNH TỪ THIẾT BỊ
                </button>
              </>
            )}

            {/* Supported formats */}
            <p className="mt-5 text-xs text-blue-400/60">
              Hỗ trợ: JPG / JPEG / PNG / WEBP &nbsp;·&nbsp; Tối đa 20 MB
            </p>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message mt-3 animate-fade-in" role="alert" aria-live="polite">
          <AlertCircle size={16} className="flex-shrink-0" style={{ color: '#f87171' }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
