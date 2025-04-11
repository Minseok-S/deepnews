import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next"; // Import Viewport
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react"; // Import ReactNode

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- SEO Enhancement ---
// Define the base URL for metadata. Helps resolve relative paths.
const siteUrl = "https://deepnews.vercel.app"; // Replace if you have a custom domain

export const metadata: Metadata = {
  // metadataBase is crucial for resolving relative URLs in metadata fields like openGraph.url
  metadataBase: new URL(siteUrl),

  // Title: Concise and descriptive. Include brand name.
  title: {
    default: "DeepNews - AI 기반 뉴스 요약 서비스", // Default title for homepage/unspecified pages
    template: "%s | DeepNews", // Template for titles on other pages (e.g., "Article Title | DeepNews")
  },

  // Description: Clear, compelling summary (keep under 160 characters ideally).
  description:
    "DeepNews는 AI(Gemini)를 활용하여 복잡한 뉴스를 쉽고 빠르게 요약해 드립니다. 최신 뉴스를 한눈에 파악하고 심층 분석 정보를 얻으세요.",

  keywords: [
    "뉴스",
    "뉴스 요약",
    "AI 뉴스",
    "Gemini",
    "딥러닝 뉴스",
    "뉴스 검색",
    "뉴스 분석",
    "실시간 뉴스",
    "속보 요약",
    "DeepNews",
    "인공지능 뉴스",
    "딥뉴스",
    "딥 뉴스",
    "딥뉴스 요약",
    "딥뉴스 검색",
    "딥뉴스 분석",
    "딥뉴스 속보",
    "딥뉴스 실시간",
    "딥뉴스 최신",
    "딥뉴스 최근",
    "딥뉴스 최신 뉴스",
    "딥뉴스 최근 뉴스",
    "딥뉴스 최신 속보",
    "딥뉴스 최근 속보",
    "deepnews",
    "deep news",
    "deep news 요약",
    "deep news 검색",
    "deep news 분석",
    "deep news 속보",
    "deep news 실시간",
    "DeepNews 요약",
    "DeepNews 검색",
    "DeepNews 분석",
    "DeepNews 속보",
    "DeepNews 실시간",
    "DeepNews 최신",
    "DeepNews 최근",
  ],

  authors: [{ name: "DeepNews Team", url: siteUrl }], // Link to author/team page if available
  creator: "DeepNews Team", // Or individual creator name
  publisher: "DeepNews",

  // Robots: Control indexing and following. 'index, follow' is default but good to be explicit.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons: Standard favicons and Apple touch icons. Ensure these files exist in /public.
  icons: {
    icon: "/favicon.ico", // Standard favicon
  },

  // Manifest: For PWA capabilities (Add to Home Screen, etc.). Create a manifest.json file in /public.
  manifest: "/manifest.json",

  // Open Graph (for Facebook, LinkedIn, etc.): Enhanced social sharing previews.
  openGraph: {
    title: "DeepNews - AI 기반의 스마트한 뉴스 요약", // Slightly different title for social maybe?
    description:
      "AI가 최신 뉴스를 분석하고 핵심만 요약해 드립니다. DeepNews로 시간을 절약하고 정보의 깊이를 더하세요.",
    url: siteUrl, // Canonical URL of the site
    siteName: "DeepNews",
    // Ensure this image exists and is accessible. Recommended size: 1200x630px.
    images: [
      {
        url: "/og-image.png", // Use a dedicated OG image if possible
        width: 1200,
        height: 630,
        alt: "DeepNews 서비스 로고와 설명",
      },
    ],
    locale: "ko_KR", // Specify the content language
    type: "website", // Type of content
  },

  // Twitter Cards: Specific settings for Twitter previews.
  twitter: {
    card: "summary_large_image", // Use 'summary_large_image' for more visual impact
    title: "DeepNews: AI가 뉴스를 요약해 드립니다", // Concise title for Twitter
    description:
      "AI(Gemini)를 활용한 뉴스 요약 서비스 DeepNews. 복잡한 세상의 소식을 빠르고 정확하게 파악하세요.",
    // site: "@YourTwitterHandle", // Add your Twitter handle if you have one
    // creator: "@CreatorTwitterHandle", // Add creator's handle if different
    images: [`${siteUrl}/twitter-image.png`], // Ensure this image exists. Recommended size: Minimum 300x157, ideally larger like 1200x675. Absolute URL needed.
  },

  // Verification: For Google Search Console and other webmaster tools.
  verification: {
    google: "tW-owcSeSqto-tKT9N_hvSrU1N_uqejvc4fbTP0sAJ8",
    // Add other verification keys if needed (e.g., Naver, Bing)
    // naver: "YOUR_NAVER_SITE_VERIFICATION_CODE",
  },

  // Alternates: Define canonical URL and language/regional versions if any.
  alternates: {
    canonical: siteUrl,
    // languages: {
    //   'en-US': 'https://deepnews.vercel.app/en', // Example if you add English version
    // },
  },

  category: "news",
};

// --- Viewport Configuration ---
// Controls layout on mobile browsers.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevent zooming if desired, or use a larger value like 5
  // userScalable: false, // Consider if you want to disable user zoom
  themeColor: [
    // Match your site's theme
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }, // Light mode
    { media: "(prefers-color-scheme: dark)", color: "#111827" }, // Dark mode (using dark:bg-gray-900)
  ],
  colorScheme: "light dark", // Indicate support for both color schemes
};

// --- Root Layout Component ---
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode; // Use ReactNode type
}>) {
  return (
    // Add suppressHydrationWarning if class mismatches occur due to themes/extensions
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4923560171218864" />
        <meta
          name="google-site-verification"
          content="tW-owcSeSqto-tKT9N_hvSrU1N_uqejvc4fbTP0sAJ8"
        />
        <meta
          name="naver-site-verification"
          content="83df586ef8caee5c4e6dbf1c3aab6e23240bb08f"
        />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4923560171218864"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
