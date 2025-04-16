import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from './components/Header';
import './globals.css';

const inter = Inter({
  //Google Font 적용
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TypeMaster - 타자 연습',
  description: '타자 연습을 통해 타이핑 실력을 향상시켜보세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <div className='pt-16'>{children}</div>
      </body>
    </html>
  );
}
