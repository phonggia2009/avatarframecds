import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tạo Avatar Chuyển Đổi Số – Xã Sơn Đồng',
  description:
    'Tạo ảnh đại diện với khung chuyển đổi số Xã Sơn Đồng. Tải ảnh, căn chỉnh và tải avatar hoàn chỉnh miễn phí.',
  keywords: ['avatar', 'chuyển đổi số', 'Sơn Đồng', 'tạo avatar', 'khung ảnh'],
  authors: [{ name: 'UBND xã Sơn Đồng' }],
  openGraph: {
    title: 'Tạo Avatar Chuyển Đổi Số – Xã Sơn Đồng',
    description:
      'Tạo ảnh đại diện với khung chuyển đổi số Xã Sơn Đồng. Tải ảnh, căn chỉnh và tải avatar hoàn chỉnh miễn phí.',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
