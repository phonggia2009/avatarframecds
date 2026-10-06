'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ImageIcon } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg flex-shrink-0">
              <ImageIcon size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-sm tracking-wide leading-none">TẠO AVATAR</p>
              <p className="text-xs font-semibold leading-none mt-0.5" style={{ color: '#fbbf24' }}>
                CHUYỂN ĐỔI SỐ
              </p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-blue-800 mx-1" />
            <span className="hidden sm:block text-blue-300 text-xs font-medium tracking-wider uppercase">
              Xã Sơn Đồng
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Điều hướng chính">
            <a
              href="#hero"
              className="px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
            >
              Trang chủ
            </a>
            <a
              href="#editor"
              className="px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
            >
              Tạo avatar
            </a>
            <a
              href="#huong-dan"
              className="px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
            >
              Hướng dẫn
            </a>
            <a
              href="#editor"
              className="ml-2 btn-primary py-2 px-5 text-sm"
            >
              Tạo ngay
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900/40 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden py-4 border-t animate-fade-in"
            style={{ borderColor: 'rgba(59,130,246,0.15)' }}
          >
            <nav className="flex flex-col gap-1" aria-label="Menu di động">
              <a
                href="#hero"
                className="px-4 py-3 text-sm text-blue-200 hover:text-white hover:bg-blue-900/30 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Trang chủ
              </a>
              <a
                href="#editor"
                className="px-4 py-3 text-sm text-blue-200 hover:text-white hover:bg-blue-900/30 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Tạo avatar
              </a>
              <a
                href="#huong-dan"
                className="px-4 py-3 text-sm text-blue-200 hover:text-white hover:bg-blue-900/30 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Hướng dẫn
              </a>
              <a
                href="#editor"
                className="mt-2 btn-primary text-center"
                onClick={() => setMenuOpen(false)}
              >
                Tạo avatar ngay
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
