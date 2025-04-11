import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} DeepNews. 모든 권리 보유.
        </p>
      </div>
    </footer>
  );
};
