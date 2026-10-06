'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, ImageIcon, RefreshCcw } from 'lucide-react';
import CanvasEditor from './CanvasEditor';
import ImageUploader from './ImageUploader';
import ZoomControl from './ZoomControl';
import ImageControls from './ImageControls';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';
import PrivacyNotice from './PrivacyNotice';
import { calculateMinScale, clampTransform } from '@/lib/canvas';
import { loadImageFromUrl } from '@/lib/image';
import { FRAME_CONFIG } from '@/lib/frameConfig';
import type { ImageTransform } from '@/lib/canvas';

function getDefaultTransform(userImage: HTMLImageElement): ImageTransform {
  const minScale = calculateMinScale(
    userImage.width,
    userImage.height,
    FRAME_CONFIG.circle.radius
  );
  return {
    x: 0,
    y: 0,
    scale: minScale,
    rotation: 0,
  };
}

export default function AvatarEditor() {
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<ImageTransform>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
  });
  const [frameLoading, setFrameLoading] = useState(true);
  const [frameError, setFrameError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Load frame PNG on mount
  useEffect(() => {
    setFrameLoading(true);
    setFrameError(null);
    loadImageFromUrl(FRAME_CONFIG.framePath)
      .then((img) => {
        setFrameImage(img);
        setFrameLoading(false);
      })
      .catch(() => {
        setFrameError('Không thể tải khung ảnh. Vui lòng tải lại trang.');
        setFrameLoading(false);
      });
  }, []);

  const handleImageLoaded = useCallback((img: HTMLImageElement) => {
    setUserImage(img);
    setTransform(getDefaultTransform(img));
    setDownloadSuccess(false);
  }, []);

  const handleZoomChange = useCallback((zoom: number) => {
    if (!userImage) return;
    setTransform((prev) => clampTransform({ ...prev, scale: zoom }, userImage));
  }, [userImage]);

  const handleRotate = useCallback(() => {
    if (!userImage) return;
    setTransform((prev) =>
      clampTransform(
        {
          ...prev,
          rotation: prev.rotation + Math.PI / 2,
        },
        userImage
      )
    );
  }, [userImage]);

  const handleReset = useCallback(() => {
    if (!userImage) return;
    setTransform(getDefaultTransform(userImage));
  }, [userImage]);

  const handleCreateNew = useCallback(() => {
    setUserImage(null);
    setDownloadSuccess(false);
    setTransform({ x: 0, y: 0, scale: 1, rotation: 0 });
  }, []);

  const handleDownloadSuccess = useCallback(() => {
    setDownloadSuccess(true);
  }, []);

  return (
    <section id="editor" className="py-16 md:py-20" aria-labelledby="editor-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="section-divider">
            <span className="badge badge-blue text-xs tracking-widest uppercase whitespace-nowrap px-5">
              Tạo Avatar
            </span>
          </div>
          <h2 id="editor-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Tạo ảnh đại diện của bạn
          </h2>
          <p className="text-sm text-blue-200/60 max-w-md mx-auto">
            Tải ảnh lên, căn chỉnh và tải về chỉ trong vài giây.
          </p>
        </div>

        {/* Frame loading error */}
        {frameError && (
          <div className="error-message max-w-xl mx-auto mb-8" role="alert">
            <span>{frameError}</span>
          </div>
        )}

        {/* Main editor layout */}
        {!userImage ? (
          /* Upload state */
          <div className="max-w-2xl mx-auto">
            {frameLoading && (
              <div className="flex justify-center items-center gap-2 mb-6 text-blue-400 text-sm">
                <div className="spinner" />
                <span>Đang tải khung ảnh...</span>
              </div>
            )}
            <ImageUploader onImageLoaded={handleImageLoaded} />
            <div className="mt-6">
              <PrivacyNotice />
            </div>
          </div>
        ) : (
          /* Editor state */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* LEFT: Preview Canvas */}
            <div className="w-full">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-blue-400/70 font-medium uppercase tracking-wider">
                  Xem trước realtime
                </span>
                <span className="badge badge-blue text-xs">
                  1536 × 1536 px
                </span>
              </div>

              {frameImage && (
                <CanvasEditor
                  userImage={userImage}
                  frameImage={frameImage}
                  transform={transform}
                  onTransformChange={setTransform}
                />
              )}

              <p className="mt-3 text-center text-xs" style={{ color: 'rgba(59,130,246,0.45)' }}>
                Kéo ảnh để căn chỉnh vị trí
              </p>
            </div>

            {/* RIGHT: Controls */}
            <div className="flex flex-col gap-5">
              {/* Download success banner */}
              {downloadSuccess && (
                <div className="success-banner animate-fade-in">
                  <CheckCircle size={22} className="text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-300 text-sm">
                      ✓ Ảnh đại diện đã sẵn sàng!
                    </p>
                    <p className="text-xs text-green-400/70 mt-0.5">
                      Avatar đã được tải về thiết bị của bạn.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload new / Change photo */}
              <div className="card-dark">
                <p className="control-label mb-3">Ảnh của bạn</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateNew}
                    className="btn-secondary flex-1 text-sm"
                    aria-label="Chọn ảnh khác"
                  >
                    <ImageIcon size={15} />
                    Đổi ảnh
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-danger flex-1 text-sm"
                    aria-label="Đặt lại vị trí ảnh"
                  >
                    <RefreshCcw size={15} />
                    Đặt lại
                  </button>
                </div>
              </div>

              {/* Zoom control */}
              <div className="card-dark">
                <ZoomControl
                  zoom={transform.scale}
                  min={
                    userImage
                      ? parseFloat(calculateMinScale(userImage.width, userImage.height).toFixed(3))
                      : 0.5
                  }
                  max={
                    userImage
                      ? Math.max(
                          4,
                          parseFloat(
                            (calculateMinScale(userImage.width, userImage.height) * 3).toFixed(2)
                          )
                        )
                      : 4
                  }
                  step={0.01}
                  onChange={handleZoomChange}
                />
              </div>

              {/* Rotate */}
              <div className="card-dark">
                <p className="control-label mb-3">Xoay ảnh</p>
                <ImageControls onRotate={handleRotate} onReset={handleReset} />
              </div>

              {/* Download */}
              <div className="card" style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
                <p className="control-label mb-3" style={{ color: '#fcd34d' }}>
                  Tải ảnh về
                </p>
                <DownloadButton
                  userImage={userImage}
                  frameImage={frameImage}
                  transform={transform}
                  onSuccess={handleDownloadSuccess}
                />

                {/* Share button */}
                <div className="mt-3">
                  <ShareButton
                    userImage={userImage}
                    frameImage={frameImage}
                    transform={transform}
                  />
                </div>

                {/* Tạo ảnh khác */}
                <button
                  onClick={handleCreateNew}
                  className="btn-secondary w-full mt-3 text-sm"
                  aria-label="Tạo ảnh avatar khác"
                >
                  Tạo ảnh khác
                </button>
              </div>

              {/* Privacy notice */}
              <PrivacyNotice compact />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
