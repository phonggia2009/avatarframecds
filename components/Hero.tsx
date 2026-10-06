'use client';

import { ArrowDown, Star, Users, Zap } from 'lucide-react';

export default function Hero() {
  const scrollToEditor = () => {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(37,99,235,0.6) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 opacity-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-64 h-64 opacity-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(37,99,235,0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <span className="badge badge-gold">
            <Star size={12} fill="currentColor" />
            Ngày Chuyển Đổi Số Quốc Gia 10/10
          </span>
        </div>

        {/* Main heading */}
        <h1
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 animate-fade-in-up delay-100"
        >
          TẠO AVATAR{' '}
          <span className="text-gradient block sm:inline">CHUYỂN ĐỔI SỐ</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg font-semibold tracking-widest text-blue-300 mb-4 uppercase animate-fade-in-up delay-200"
        >
          Chung tay xây dựng chính quyền số – xã hội số
        </p>

        {/* Description */}
        <p
          className="text-sm sm:text-base text-blue-200/70 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-300"
        >
          Tải ảnh của bạn, căn chỉnh và tạo ảnh đại diện với khung chuyển đổi số
          của{' '}
          <strong className="text-blue-100 font-semibold">xã Sơn Đồng</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <button
            onClick={scrollToEditor}
            className="btn-gold w-full sm:w-auto text-base px-8 py-4"
            aria-label="Bắt đầu tạo avatar ngay"
          >
            <Zap size={18} />
            TẠO AVATAR NGAY
          </button>
          <a
            href="#huong-dan"
            className="btn-secondary w-full sm:w-auto text-base"
            aria-label="Xem hướng dẫn sử dụng"
          >
            Xem hướng dẫn
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 animate-fade-in-up delay-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
              <Zap size={16} className="text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Xử lý tức thì</p>
              <p className="text-blue-400/70 text-xs">Không cần chờ đợi</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10" style={{ background: 'rgba(59,130,246,0.2)' }} />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
              <Users size={16} className="text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Miễn phí hoàn toàn</p>
              <p className="text-blue-400/70 text-xs">Không cần đăng ký</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10" style={{ background: 'rgba(59,130,246,0.2)' }} />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-900/30 border border-green-700/30 flex items-center justify-center">
              <span className="text-green-400 text-sm font-bold">🔒</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Bảo mật tuyệt đối</p>
              <p className="text-blue-400/70 text-xs">Ảnh không rời thiết bị</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-14 flex justify-center animate-fade-in">
          <button
            onClick={scrollToEditor}
            className="flex flex-col items-center gap-2 text-blue-400/50 hover:text-blue-300/80 transition-colors"
            aria-label="Cuộn xuống để bắt đầu"
          >
            <span className="text-xs tracking-widest uppercase">Bắt đầu</span>
            <ArrowDown size={16} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
