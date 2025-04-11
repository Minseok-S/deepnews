import React from "react";

export const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-3 sm:py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Deep<span className="text-blue-600">News</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          powered by Gemini AI
        </p>
      </div>
    </header>
  );
};
