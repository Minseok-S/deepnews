"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SearchBox } from "./components/SearchBox";
import { SearchResults } from "./components/SearchResults";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showIntro, setShowIntro] = useState(true);

  const handleSearch = async (
    query: string,
    countries: string[],
    dateRange: string,
    newsCount: number
  ) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Gemini API 통합
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
      );

      // 자동 그라운딩 활성화된 모델 사용
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro-exp-03-25",
        tools: [
          {
            google_search: {},
          } as any,
        ],
      });

      const currentDate = new Date().toISOString().split("T")[0];

      // 환경 변수에서 프롬프트 가져오기
      const promptTemplate = process.env.NEXT_PUBLIC_NEWS_PROMPT || "";

      // 국가별 검색어 설정
      let languageInstruction = "";

      if (countries.includes("all")) {
        languageInstruction =
          '한국어와 영어로 두 가지 언어로 "{query}"를 검색하여 국내외 정보를 모두 포함해주세요.';
      } else {
        const languageMap: Record<string, string> = {
          kr: '한국어로 "{query}"를 검색하여 한국 내 정보만 찾아주세요.',
          us: '영어로 "{query}"를 검색하여 미국 내 정보만 찾아주세요.',
        };

        const languageInstructions = countries
          .map((country) => languageMap[country])
          .filter(Boolean);

        if (languageInstructions.length > 0) {
          languageInstruction = languageInstructions.join(" 그리고 ");
        } else {
          languageInstruction =
            '한국어와 영어로 두 가지 언어로 "{query}"를 검색하여 국내외 정보를 모두 포함해주세요.';
        }
      }

      // 날짜 범위 설정
      let dateInstruction = "";
      // dateRange 형식: "YYYY-MM-DD~YYYY-MM-DD"
      if (dateRange && dateRange.includes("~")) {
        const [startDate, endDate] = dateRange.split("~");
        dateInstruction = `검색결과는 최대한 ${startDate}부터 ${endDate}까지의 기간 동안의 정보를 검색해주세요.`;
      } else {
        // 기본값 (오늘)
        dateInstruction =
          "검색결과는 최대한 오늘 날짜 정보를 위주로 검색해주세요.";
      }

      // 뉴스 수 설정
      const newsCountInstruction = `최소 ${
        newsCount * 2
      }개의 뉴스 기사를 찾아 요약해주세요.`;

      // 변수 치환하여 프롬프트 생성
      const prompt = promptTemplate
        .replace(/{query}/g, query)
        .replace(/{currentDate}/g, currentDate)
        .replace(/{languageInstruction}/g, languageInstruction)
        .replace(/{dateInstruction}/g, dateInstruction)
        .replace(/{newsCountInstruction}/g, newsCountInstruction);

      const generationConfig = {
        temperature: 0,
        maxOutputTokens: 8192,
      };

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
      });

      const text = result.response.text();

      console.log(text);
      setResults(text);
    } catch (err) {
      console.error("검색 오류:", err);
      setError("뉴스 검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              뉴스 통합 요약 서비스
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AI 기반 뉴스 분석으로 핵심 내용만 빠르게 파악하세요. 다양한 소스를
              통합하여 종합적인 요약을 제공합니다.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <SearchBox onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 mb-6 rounded-lg shadow-sm border border-red-200 dark:border-red-800/30 flex items-start justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col justify-center items-center p-8 sm:p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                뉴스 검색 중...
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center mb-3">
                &quot;{searchQuery}&quot;에 대한 정보를 찾고 있습니다
              </p>
              <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 text-center mt-4">
                선택한 뉴스 수와 검색 기간에 따라 처리 시간이 달라질 수
                있습니다.
              </p>
            </div>
          )}

          {!isLoading && !results && showIntro && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 text-gray-800 dark:text-white flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  DeepNews 서비스 안내
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  다양한 뉴스를 하나로 모아 핵심만 빠르게 파악하는 AI 통합 요약
                  서비스
                </p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      서비스 소개
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 pl-10">
                    DeepNews는 방대한 뉴스 데이터를 분석하여 핵심 내용만
                    추출해주는 AI 기반 요약 서비스입니다. 구글 Gemini AI의 최신
                    모델을 활용하여 여러 뉴스 소스를 하나로 통합하고, 핵심
                    요약과 주요 쟁점을 한눈에 볼 수 있습니다.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 pl-10">
                    복잡하고 시간이 소요되는 뉴스 검색과 분석 과정을 자동화하여
                    효율적인 정보 습득이 가능합니다.
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      사용 방법
                    </h3>
                  </div>
                  <ol className="list-decimal pl-10 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>검색창에 관심 있는 주제나 키워드를 입력하세요.</li>
                    <li>
                      검색하고자 하는 국가를 선택하세요 (한국, 미국 또는 모든
                      국가).
                    </li>
                    <li>검색 기간과 원하는 뉴스 수를 설정하세요.</li>
                    <li>
                      &quot;검색&quot; 버튼을 클릭하면 AI가 관련 뉴스를 검색하고
                      분석합니다.
                    </li>
                  </ol>
                </div>

                <div>
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      유의사항
                    </h3>
                  </div>
                  <ul className="list-disc pl-10 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>
                      검색 결과는 AI가 생성한 내용으로, 정확성을 보장하지
                      않습니다.
                    </li>
                    <li>
                      국가별 검색 기능을 활용하면 특정 지역의 뉴스에 집중할 수
                      있습니다.
                    </li>
                    <li>
                      복잡한 주제일수록 검색 결과 생성에 시간이 더 소요될 수
                      있습니다.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setShowIntro(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  >
                    시작하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {results && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <SearchResults results={results} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
