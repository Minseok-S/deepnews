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

  const handleSearch = async (query: string, countries: string[]) => {
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

      // 변수 치환하여 프롬프트 생성
      const prompt = promptTemplate
        .replace(/{query}/g, query)
        .replace(/{currentDate}/g, currentDate)
        .replace(/{languageInstruction}/g, languageInstruction);

      console.log(prompt);

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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-5xl mx-auto">
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md text-sm sm:text-base">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col justify-center items-center p-4 sm:p-8">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center">
                &quot;{searchQuery}&quot;에 대한 정보를 찾고 있습니다...
              </p>
            </div>
          )}

          {!isLoading && !results && showIntro && (
            <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                DeepNews 소개
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  서비스 설명
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  DeepNews는 AI를 활용한 심층 뉴스 요약 서비스입니다. 구글
                  Gemini AI 모델을 통해 다양한 뉴스 소스에서 정보를 수집하고
                  분석하여 종합적인 보고서를 제공합니다.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  최신 뉴스와 관련 정보를 빠르게 찾고, 다양한 관점에서 정보를
                  확인할 수 있습니다.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  사용 방법
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>검색창에 관심 있는 주제나 키워드를 입력하세요.</li>
                  <li>
                    검색하고자 하는 국가를 선택하세요 (한국, 미국 또는
                    모든 국가).
                  </li>
                  <li>
                    &quot;검색&quot; 버튼을 클릭하면 AI가 관련 뉴스를 검색하고
                    분석합니다.
                  </li>
                  <li>잠시 후 종합된 정보가 표시됩니다.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  유의사항
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
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

              <button
                onClick={() => setShowIntro(false)}
                className="mt-6 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                이 안내 다시 보지 않기
              </button>
            </div>
          )}

          {results && <SearchResults results={results} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
