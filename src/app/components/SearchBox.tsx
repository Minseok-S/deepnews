"use client";

import React, { useState } from "react";

interface SearchBoxProps {
  onSearch: (
    query: string,
    countries: string[],
    date: string,
    newsCount: number
  ) => Promise<void>;
  isLoading: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["all"]);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [newsCount, setNewsCount] = useState<number>(10);
  const [activeDateRange, setActiveDateRange] = useState<
    "today" | "week" | "month" | "year" | "custom"
  >("today");

  // 오늘 날짜
  const getMaxDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // 간편 날짜 설정 함수
  const setDateRange = (range: "today" | "week" | "month" | "year") => {
    const today = new Date();
    const endDateStr = today.toISOString().split("T")[0];

    let startDateObj = new Date(today);

    switch (range) {
      case "today":
        // 시작일과 종료일 모두 오늘로 설정
        break;
      case "week":
        // 1주일 전으로 설정
        startDateObj.setDate(today.getDate() - 7);
        break;
      case "month":
        // 1달 전으로 설정
        startDateObj.setMonth(today.getMonth() - 1);
        break;
      case "year":
        // 1년 전으로 설정
        startDateObj.setFullYear(today.getFullYear() - 1);
        break;
    }

    const startDateStr = startDateObj.toISOString().split("T")[0];

    setStartDate(startDateStr);
    setEndDate(endDateStr);
    setActiveDateRange(range);
  };

  // 직접 날짜 변경 시 custom 모드로 변경
  const handleDateChange = (date: string, type: "start" | "end") => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setActiveDateRange("custom");
  };

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

    // 날짜 범위를 시작일~종료일 형식으로 전달
    const dateRange = `${startDate}~${endDate}`;
    await onSearch(searchQuery, selectedCountries, dateRange, newsCount);
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
        className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-colors ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {label}
      </button>
    );
  };

  const DateRangeButton = ({
    range,
    label,
  }: {
    range: "today" | "week" | "month" | "year";
    label: string;
  }) => {
    const isActive = activeDateRange === range;
    return (
      <button
        type="button"
        onClick={() => setDateRange(range)}
        className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        뉴스 검색
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요 (예: 인공지능, 경제, 기후변화)"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2 mb-3 sm:mb-4">
          <div className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-1">
            뉴스 검색 국가:
          </div>
          <div className="flex flex-wrap gap-2">
            <CountryButton country="all" label="모든 국가" />
            <CountryButton country="kr" label="한국" />
            <CountryButton country="us" label="미국" />
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-3 sm:mb-4">
          <div className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-1">
            검색 기간:
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <DateRangeButton range="today" label="오늘" />
            <DateRangeButton range="week" label="일주일" />
            <DateRangeButton range="month" label="한 달" />
            <DateRangeButton range="year" label="일 년" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={startDate}
                max={getMaxDate()}
                onChange={(e) => handleDateChange(e.target.value, "start")}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                종료일
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={getMaxDate()}
                onChange={(e) => handleDateChange(e.target.value, "end")}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            ※ 검색 기간이 길수록 정보의 정확도가 떨어질 수 있습니다. 최신 정보를
            원하시면 짧은 기간을 선택하세요.
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-3 sm:mb-4">
          <div className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-1">
            뉴스 수:
          </div>
          <div className="flex items-center">
            <input
              type="range"
              min="5"
              max="20"
              value={newsCount}
              onChange={(e) => setNewsCount(parseInt(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 min-w-[2rem] text-center">
              {newsCount}
            </span>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            ※ 뉴스 수가 많을수록 검색 및 요약 시간이 길어질 수 있습니다. 반면,
            뉴스 수가 적을수록 정보의 다양성이 감소할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            {"검색어를 입력하면 관련 뉴스를 검색하고 주요 내용을 요약합니다."}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base py-2 px-4 sm:px-6 rounded-md transition-colors disabled:opacity-50 w-full sm:w-auto order-1 sm:order-2"
          >
            {isLoading ? "검색 중..." : "검색"}
          </button>
        </div>
      </form>
    </div>
  );
};
