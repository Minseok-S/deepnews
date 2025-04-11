"use client";

import React, { useState } from "react";

interface SearchBoxProps {
  onSearch: (query: string, countries: string[]) => Promise<void>;
  isLoading: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["all"]);

  const handleCountryToggle = (country: string) => {
    if (country === "all") {
      setSelectedCountries(["all"]);
      return;
    }

    if (selectedCountries.includes("all")) {
      setSelectedCountries([country]);
      return;
    }

    const newSelectedCountries = [...selectedCountries];

    if (newSelectedCountries.includes(country)) {
      if (newSelectedCountries.length === 1) {
        return;
      }
      const filtered = newSelectedCountries.filter((c) => c !== country);
      setSelectedCountries(filtered);
    } else {
      setSelectedCountries([...newSelectedCountries, country]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    await onSearch(searchQuery, selectedCountries);
  };

  const CountryButton = ({
    country,
    label,
  }: {
    country: string;
    label: string;
  }) => {
    const isSelected = selectedCountries.includes(country);
    return (
      <button
        type="button"
        onClick={() => handleCountryToggle(country)}
        className={`px-4 py-2 rounded-md transition-colors ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        뉴스 검색
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요 (예: 인공지능, 경제, 기후변화)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            뉴스 검색 국가:
          </div>
          <div className="flex flex-wrap gap-2">
            <CountryButton country="all" label="모든 국가" />
            <CountryButton country="kr" label="한국" />
            <CountryButton country="us" label="미국" />
            <CountryButton country="cn" label="중국" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {"검색어를 입력하면 관련 뉴스를 검색하고 주요 내용을 요약합니다."}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? "검색 중..." : "검색"}
          </button>
        </div>
      </form>
    </div>
  );
};
