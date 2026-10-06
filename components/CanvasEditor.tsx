'use client';

import { useRef, useEffect, useCallback } from 'react';
import { renderAvatar, clampTransform, calculateMinScale } from '@/lib/canvas';
import { FRAME_CONFIG } from '@/lib/frameConfig';
import type { ImageTransform } from '@/lib/canvas';

interface CanvasEditorProps {
  userImage: HTMLImageElement;
  frameImage: HTMLImageElement;
  transform: ImageTransform;
  onTransformChange: (transform: ImageTransform) => void;
}

export default function CanvasEditor({
  userImage,
  frameImage,
  transform,
  onTransformChange,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchDistRef = useRef<number | null>(null);

  // Refs mới nhất để dùng trong callbacks (tránh stale closure)
  const userImageRef = useRef(userImage);
  const frameImageRef = useRef(frameImage);
  const transformRef = useRef(transform);

  useEffect(() => { userImageRef.current = userImage; }, [userImage]);
  useEffect(() => { frameImageRef.current = frameImage; }, [frameImage]);
  useEffect(() => { transformRef.current = transform; }, [transform]);

  /**
   * Hàm vẽ canvas thực sự — đồng bộ, không RAF
   */
  const draw = useCallback(
    (t?: ImageTransform) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Đảm bảo kích thước canvas = kích thước container
      const size = container.clientWidth;
      if (size <= 0) return;
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }

      renderAvatar({
        canvas,
        userImage: userImageRef.current,
        frameImage: frameImageRef.current,
        transform: t ?? transformRef.current,
      });
    },
    [] // Chỉ phụ thuộc vào refs — không bao giờ stale
  );

  // ── Vẽ lại mỗi khi transform / image thay đổi ────────────────────────────
  useEffect(() => {
    draw(transform);
  }, [draw, transform, userImage, frameImage]);

  // ── ResizeObserver: vẽ lại khi container thay đổi kích thước ─────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    // Vẽ ngay lần đầu
    draw();
    return () => ro.disconnect();
  }, [draw]);

  // ── Tính display scale để chuyển tọa độ màn hình → frame space ───────────
  const getDisplayScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return 1;
    return canvas.width / FRAME_CONFIG.width;
  }, []);

  // ════════════════════════ MOUSE EVENTS ════════════════════════════════════

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !lastPointerRef.current) return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      const ds = getDisplayScale();
      const t = transformRef.current;
      const unconstrained: ImageTransform = { ...t, x: t.x + dx / ds, y: t.y + dy / ds };
      const next = clampTransform(unconstrained, userImageRef.current);
      transformRef.current = next;
      onTransformChange(next);
      draw(next);
    },
    [draw, getDisplayScale, onTransformChange]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    lastPointerRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // ════════════════════════ TOUCH EVENTS ════════════════════════════════════

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      lastPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastTouchDistRef.current = null;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistRef.current = Math.hypot(dx, dy);
      lastPointerRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      if (e.touches.length === 1 && lastPointerRef.current) {
        const dx = e.touches[0].clientX - lastPointerRef.current.x;
        const dy = e.touches[0].clientY - lastPointerRef.current.y;
        lastPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        const ds = getDisplayScale();
        const t = transformRef.current;
        const unconstrained: ImageTransform = { ...t, x: t.x + dx / ds, y: t.y + dy / ds };
        const next = clampTransform(unconstrained, userImageRef.current);
        transformRef.current = next;
        onTransformChange(next);
        draw(next);
      } else if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const ratio = dist / lastTouchDistRef.current;
        lastTouchDistRef.current = dist;

        const t = transformRef.current;
        const minScale = calculateMinScale(userImageRef.current.width, userImageRef.current.height);
        const maxScale = Math.max(4, minScale * 3);
        const newScale = Math.min(maxScale, Math.max(minScale, t.scale * ratio));
        const unconstrained: ImageTransform = { ...t, scale: newScale };
        const next = clampTransform(unconstrained, userImageRef.current);
        transformRef.current = next;
        onTransformChange(next);
        draw(next);
      }
    },
    [draw, getDisplayScale, onTransformChange]
  );

  const handleTouchEnd = useCallback(() => {
    lastPointerRef.current = null;
    lastTouchDistRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="canvas-wrapper"
      aria-label="Vùng xem trước ảnh đại diện"
      role="img"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Canvas chỉnh sửa ảnh – kéo để di chuyển ảnh"
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      />
    </div>
  );
}
