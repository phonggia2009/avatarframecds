'use client';

export default function Footer() {
  return (
    <footer
      className="py-10 mt-8 border-t"
      style={{ borderColor: 'rgba(59,130,246,0.1)' }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{
              background: 'rgba(15,32,64,0.5)',
              border: '1px solid rgba(59,130,246,0.15)',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' }}
            >
              <span className="text-white font-black text-sm">🏛</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm tracking-wide">
                ỦY BAN NHÂN DÂN XÃ SƠN ĐỒNG
              </p>
              <p className="text-xs font-medium" style={{ color: '#fbbf24' }}>
                Chuyển đổi số vì cộng đồng
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="divider w-48" />

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'rgba(59,130,246,0.4)' }}>
            © 2026 UBND xã Sơn Đồng. Tất cả các quyền được bảo lưu.
          </p>
          <p className="text-xs" style={{ color: 'rgba(59,130,246,0.3)' }}>
            Xử lý ảnh 100% phía client – Không thu thập dữ liệu cá nhân.
          </p>
        </div>
      </div>
    </footer>
  );
}
