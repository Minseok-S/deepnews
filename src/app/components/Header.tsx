import React from "react";

export const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-4 sm:py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Deep<span className="text-blue-600 dark:text-blue-400">News</span>
          </h1>
        </div>
        <div className="flex items-center">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mr-3 hidden sm:inline-block">
            AI 기반 뉴스 요약 서비스
          </span>
          <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full flex items-center">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              powered by Gemini AI
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
