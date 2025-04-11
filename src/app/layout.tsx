import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeepNews - ai를 활용한 간단한 뉴스 요약 서비스",
  description: "ai를 활용한 간단한 뉴스 요약 서비스",
  keywords:
    "뉴스, 검색, 심층 분석, AI, Gemini, 뉴스 검색, 딥러닝, 뉴스요약, 한눈에 보는 뉴스, ai 뉴스",
  authors: [{ name: "DeepNews Team" }],
  creator: "DeepNews",
  publisher: "DeepNews",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "DeepNews - ai를 활용한 간단한 뉴스 요약 서비스",
    description: "ai를 활용한 간단한 뉴스 요약 서비스",
    url: "https://deepnews.vercel.app",
    siteName: "DeepNews",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "DeepNews 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepNews - ai를 활용한 간단한 뉴스 요약 서비스",
    description: "ai를 활용한 간단한 뉴스 요약 서비스",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4923560171218864" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
