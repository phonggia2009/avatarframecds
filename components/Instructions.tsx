'use client';

import { ImageIcon, Move, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ImageIcon,
    title: 'CHỌN ẢNH',
    desc: 'Tải ảnh cá nhân từ điện thoại hoặc máy tính. Hỗ trợ JPG, PNG, WEBP tối đa 20 MB.',
    color: '#3b82f6',
  },
  {
    number: '02',
    icon: Move,
    title: 'CĂN CHỈNH',
    desc: 'Kéo, zoom và xoay ảnh để căn khuôn mặt vào vị trí phù hợp trong khung tròn.',
    color: '#8b5cf6',
  },
  {
    number: '03',
    icon: Download,
    title: 'TẢI VỀ',
    desc: 'Tải ảnh hoàn chỉnh về thiết bị và dùng ngay làm ảnh đại diện mạng xã hội.',
    color: '#f59e0b',
  },
];

export default function Instructions() {
  return (
    <section id="huong-dan" className="py-16 md:py-20" aria-labelledby="instructions-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="section-divider">
            <span className="badge badge-blue text-xs tracking-widest uppercase whitespace-nowrap px-5">
              Hướng dẫn
            </span>
          </div>
          <h2
            id="instructions-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
          >
            3 BƯỚC TẠO AVATAR
          </h2>
          <p className="text-sm text-blue-200/60 max-w-md mx-auto">
            Đơn giản, nhanh chóng và miễn phí hoàn toàn.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="step-card animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                {/* Number + Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="step-number">{step.number}</div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `rgba(${
                        step.color === '#3b82f6'
                          ? '59,130,246'
                          : step.color === '#8b5cf6'
                          ? '139,92,246'
                          : '245,158,11'
                      }, 0.12)`,
                      border: `1px solid ${step.color}30`,
                    }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                  </div>
                </div>

                {/* Content */}
                <h3
                  className="text-base font-bold tracking-wide mb-2"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(147,197,253,0.7)' }}>
                  {step.desc}
                </p>

                {/* Connector line (except last) */}
                {idx < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10"
                    aria-hidden="true"
                  >
                    <div
                      className="w-6 h-px"
                      style={{ background: 'rgba(59,130,246,0.3)' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="#editor"
            className="btn-primary inline-flex"
            aria-label="Bắt đầu tạo avatar"
          >
            Bắt đầu tạo avatar
          </a>
        </div>
      </div>
    </section>
  );
}
