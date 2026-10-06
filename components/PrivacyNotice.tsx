'use client';

import { Lock } from 'lucide-react';

interface PrivacyNoticeProps {
  compact?: boolean;
}

export default function PrivacyNotice({ compact = false }: PrivacyNoticeProps) {
  if (compact) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.15)',
          color: 'rgba(110,231,183,0.8)',
        }}
      >
        <Lock size={12} className="flex-shrink-0" style={{ color: '#6ee7b7' }} />
        <span>Ảnh xử lý trực tiếp trên thiết bị – không gửi lên server.</span>
      </div>
    );
  }

  return (
    <div className="privacy-notice" role="note" aria-label="Thông tin bảo mật">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        <Lock size={16} style={{ color: '#6ee7b7' }} />
      </div>
      <div>
        <p className="font-semibold text-sm mb-0.5" style={{ color: '#6ee7b7' }}>
          🔒 ẢNH CỦA BẠN ĐƯỢC XỬ LÝ TRÊN THIẾT BỊ
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(110,231,183,0.65)' }}>
          Ảnh bạn chọn được xử lý trực tiếp trên trình duyệt và không được tải lên
          máy chủ. Dữ liệu cá nhân của bạn hoàn toàn riêng tư.
        </p>
      </div>
    </div>
  );
}
